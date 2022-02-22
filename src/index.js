import * as utils from './utils';
import {TINTED_ATTRIBUTE_NAME, MUTATION_OBSERVER_TARGET, MAX_STORED_KEYS, WAIT_FOR_PAGE_INTERVAL_MS} from './constants';

(async () => {
  await utils.injectStylesheet();
  const storedTintedVideos = await utils.queryTintedVideos();

  const onLoadMoreSubscriptions = () => {
    const videoMap = utils.scrapeVideoMap();

    Object
      .entries(videoMap)
      .filter(([_, element]) => !element.hasAttribute(TINTED_ATTRIBUTE_NAME))
      .forEach(([id, element]) => {
        element.addEventListener('click', utils.onShiftClickVideo);
        element.setAttribute(TINTED_ATTRIBUTE_NAME, Boolean(storedTintedVideos[id]));
      });

    /**
     * Removes old keys from `chrome.storage.sync` to avoid hitting the max limit.
     * @see https://developer.chrome.com/extensions/storage#property-sync-MAX_ITEMS
     */
    if (Object.keys(storedTintedVideos).length >= MAX_STORED_KEYS) {
      const oldVideoIds = Object.keys(storedTintedVideos).filter((id) => !videoMap[id]);
      chrome.storage.sync.remove(oldVideoIds);
    }
  };

  const waitForPageInterval = setInterval(() => {
    const subsPage = document.querySelector(MUTATION_OBSERVER_TARGET);

    if (subsPage) {
      clearInterval(waitForPageInterval);
      new MutationObserver(onLoadMoreSubscriptions).observe(subsPage, {
        childList: true, // triggers observer callback when scrolling to load more subscription videos
      });
    }
  }, WAIT_FOR_PAGE_INTERVAL_MS);

  console.log(
    ['%c', '🎨', '\n', '%c', 'Domscriptions is running', '\n'].join(''),
    'font-size: 9em',
    'font-weight: bold',
  );
})();
