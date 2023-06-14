import {TINTED_ATTRIBUTE_NAME, SAVED_TINT_COLOR_NAME, DEFAULT_TINT_COLOR, VIDEO_TARGET, VIDEO_THUMBNAIL_TARGET} from './constants';

/**
 * Stores a video's tint setting with `chrome.storage`.
 * @param {String} id The youtube video's unique ID
 * @param {Boolean} shouldTint True to tint, false otherwise.
 */
export const storeVideo = (id, shouldTint) => {
  chrome.storage.sync.set({
    [id]: shouldTint,
  });
};

/**
 * Given a Youtube video DOM element, returns its unique YouTube video ID.
 * @param {HTMLElement} element
 * @return {String}
 */
export const getVideoId = (element) => {
  const href = new URL(element.querySelector(VIDEO_THUMBNAIL_TARGET).href);

  if (href.pathname.includes('shorts')) {
    return href.pathname.split('/').pop();
  } else {
    return new URLSearchParams(href.search).get('v');
  }
};

/**
 * Toggles tinting a video on both the DOM and Chrome storage.
 * @param {Event} event
 */
export const onShiftClickVideo = (event) => {
  if (!event.shiftKey) return;

  const video = event.target.closest(VIDEO_TARGET);
  const shouldTint = !JSON.parse(video.getAttribute(TINTED_ATTRIBUTE_NAME));

  storeVideo(getVideoId(video), shouldTint);
  video.setAttribute(TINTED_ATTRIBUTE_NAME, shouldTint);

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  return false;
};

/**
 * Creates a mapping of video IDs to their grid elements.
 * @return {Object.<string, HTMLElement>}
 */
export const scrapeVideoMap = () => Array
  .from(document.querySelectorAll(VIDEO_TARGET))
  .reduce((accumulator, video) => ({
    ...accumulator,
    [getVideoId(video)]: video,
  }), {});

/**
 * Returns a mapping of stored video IDs and whether they should be tinted or not.
 * @return {Promise<Object.<string, Boolean>>}
 */
export const queryTintedVideos = async () => new Promise((resolve) => {
  chrome.storage.sync.get(null, resolve);
});

/**
 * Returns the user's saved tint color, if it exists.
 * @return {Promise<String>}
 */
export const querySavedTintColor = async () => new Promise((resolve) => {
  chrome.storage.local.get(SAVED_TINT_COLOR_NAME, ({[SAVED_TINT_COLOR_NAME]: tint}) => resolve(tint));
});

/**
 * Injects a stylesheet necessary for tinting to the page.
 */
export const injectStylesheet = async () => {
  const tint = await querySavedTintColor() || DEFAULT_TINT_COLOR;
  const stylesheet = document.createElement('style');

  stylesheet.setAttribute(TINTED_ATTRIBUTE_NAME, '');
  stylesheet.innerHTML = `
    *[${TINTED_ATTRIBUTE_NAME}="true"] {
      background-color: ${tint} !important;
    }
  `;

  document.body.appendChild(stylesheet);
};

/**
 * Logs to the console.
 * @param {object} message
 */
export const log = (message) => {
  console.log(
    ['%c', '🎨', '\n', '%c', message, '\n'].join(''),
    'font-size: 9em',
    'font-weight: bold',
  );
};
