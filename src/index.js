import * as utils from './utils';
import {TINTED_ATTRIBUTE_NAME} from './constants';

(async () => {
  await utils.injectStylesheet();

  const videoMap = utils.scrapeVideoMap();
  const storedTintedVideos = await utils.queryTintedVideos();

  Object
    .entries(videoMap)
    .forEach(([id, element]) => {
      element.addEventListener('click', utils.onShiftClickVideo);

      if (storedTintedVideos[id]) {
        element.setAttribute(TINTED_ATTRIBUTE_NAME, '');
      }
    });

  /**
   * Removes old keys from `chrome.storage.sync` to avoid hitting the max limit.
   * @see https://developer.chrome.com/extensions/storage#property-sync-MAX_ITEMS
   */
  if (Object.keys(storedTintedVideos).length >= 400) {
    const oldVideoIds = Object.keys(storedTintedVideos).filter((id) => !videoMap[id]);
    chrome.storage.sync.remove(oldVideoIds);
  }
})();
