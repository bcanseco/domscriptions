import * as utils from './utils';
import {TINTED_ATTRIBUTE_NAME} from './constants';

(async () => {
  await utils.injectStylesheet();
  const storedTintedVideos = await utils.queryTintedVideos();

  const onLoadMoreSubscriptions = () => {
    const videoMap = utils.scrapeVideoMap();

    Object
      .entries(videoMap)
      .filter(([id, element]) => !element.hasAttribute(TINTED_ATTRIBUTE_NAME))
      .forEach(([id, element]) => {
        element.addEventListener('click', utils.onShiftClickVideo);
        element.setAttribute(TINTED_ATTRIBUTE_NAME, Boolean(storedTintedVideos[id]));
      });

    /**
     * Removes old keys from `chrome.storage.sync` to avoid hitting the max limit.
     * @see https://developer.chrome.com/extensions/storage#property-sync-MAX_ITEMS
     */
    if (Object.keys(storedTintedVideos).length >= 400) {
      const oldVideoIds = Object.keys(storedTintedVideos).filter((id) => !videoMap[id]);
      chrome.storage.sync.remove(oldVideoIds);
    }
  };

  onLoadMoreSubscriptions();

  new MutationObserver(onLoadMoreSubscriptions).observe(
    document.querySelector('ytd-section-list-renderer[page-subtype="subscriptions"] > #contents'),
    {
      childList: true, // triggers observer callback when scrolling to load more subscription videos
    },
  );
})();
