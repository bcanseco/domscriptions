import * as utils from './utils';
import {TINTED_ATTRIBUTE_NAME, MUTATION_OBSERVER_TARGET, VIDEO_PREVIEW_TARGET, MAX_STORED_KEYS, WAIT_FOR_PAGE_INTERVAL_MS, WAIT_FOR_VIDEO_PREVIEW_INTERVAL_MS} from './constants';

(async () => {
  await utils.injectStylesheet();
  const storedTintedVideos = await utils.queryTintedVideos();

  const onLoadMoreSubscriptions = () => {
    const videoMap = utils.scrapeVideoMap();
    utils.log(`Found ${Object.keys(videoMap).length} videos.`);

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
      utils.log('Approaching maximum storage size for tinted videos. Pruning old video states.');
      const oldVideoIds = Object.keys(storedTintedVideos).filter((id) => !videoMap[id]);
      chrome.storage.sync.remove(oldVideoIds);
    }
  };

  const waitForPageInterval = setInterval(() => {
    const subsPage = document.querySelector(MUTATION_OBSERVER_TARGET);

    if (subsPage) {
      utils.log('Found the subs page.');
      clearInterval(waitForPageInterval);
      onLoadMoreSubscriptions();
      new MutationObserver(onLoadMoreSubscriptions).observe(subsPage, {
        childList: true, // triggers observer callback when scrolling to load more subscription videos
      });
    } else {
      utils.log(`Didn't find the subs page. Retrying in ${WAIT_FOR_PAGE_INTERVAL_MS}ms`);
    }
  }, WAIT_FOR_PAGE_INTERVAL_MS);

  const waitForVideoPreviewInterval = setInterval(() => {
    const videoPreview = document.querySelector(VIDEO_PREVIEW_TARGET);

    if (videoPreview) {
      utils.log('Found the video preview.');
      clearInterval(waitForVideoPreviewInterval);
      videoPreview.remove(); // causes issues with the shift+click listener
    } else {
      utils.log(`Didn't find the video preview. Retrying in ${WAIT_FOR_VIDEO_PREVIEW_INTERVAL_MS}ms`);
    }
  }, WAIT_FOR_VIDEO_PREVIEW_INTERVAL_MS);

  utils.log('Domscriptions is running!');
})();
