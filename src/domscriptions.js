const document = document || false;

/**
 * @summary Stores a video's tint setting with chrome.storage.
 * @param {string} id The youtube video's id (?v=...).
 * @param {bool} tint True to tint, false otherwise.
 */
const storeVideo = (id, tint) => {
  const obj = {};
  obj[id] = tint;
  chrome.storage.sync.set(obj);
}

/**
 * @summary Updates stylesheet with user's color choice, if it exists.
 * @param {string} className The class to apply a background color to.
 */
const setTintColor = (className) => {
  chrome.storage.sync.get('tint', (items) => {
    if (items.tint) {
      const sheet = document.createElement('style')
      sheet.innerHTML = `.${className} {background-color: ${items.tint}}`;
      document.body.appendChild(sheet);
    }
  });
}

/**
 * @summary Toggles tinting a video.
 * @param {Event} e
 */
const onAltClickVideo = (e) => {
  if (e.altKey) {
    const elements = Object.values(e.path);
    const thumbnail = elements.find((el) => !!el.search);
    const id = thumbnail.search.split('&')[0];
    const elementName = 'ytd-grid-video-renderer';
    const video = elements.find((el) => el.localName === elementName);

    if (video === undefined || id === undefined) {
      return;
    } else if (video.classList.contains('tinted-video')) {
      video.classList.remove('tinted-video');
      storeVideo(id, false);
    } else {
      video.classList.add('tinted-video');
      storeVideo(id, true);
    }

    e.stopPropagation();
    e.preventDefault();
    return false;
  }
}

/**
 * @summary Creates a mapping of video IDs to their grid elements.
 * @desc Sets up each video with a listener; @fires onAltClickVideo
 * @returns {object} { id: <ytd-grid-video-renderer>... }
 */
const getVideoMap = () => {
  const videoMap = {};
  Array.from(document.getElementsByTagName('ytd-grid-video-renderer'))
    .forEach((video) => {
      video.addEventListener('click', onAltClickVideo);

      const id = video
        .getElementsByTagName('ytd-thumbnail')[0].childNodes[1].search
        .split('&')[0];
      videoMap[id] = video;
    });
  return videoMap;
}

/**
 * @summary Sets up the subscription grid with saved tint settings, if any.
 * @desc Removes old video IDs from chrome.storage during iteration.
 * @param {object} videoMap A mapping of video IDs with their HTMLElements.
 */
const onLoadSubscriptions = (videoMap) => {
  const removeIds = [];

  chrome.storage.sync.get(null, (res) => {
    Object.keys(res).forEach((key) => {
      if (key === 'tint') {
        // this is the user's custom tint color
        return;
      } else if (!videoMap[key]) {
        // stored video id is old, can be erased from storage
        removeIds.push(key);
      } else if (res[key] === true) {
        // we need to tint this video
        videoMap[key].classList.add('tinted-video');
      }
    });

    if (removeIds.length !== 0) {
      chrome.storage.sync.remove(removeIds);
    }
  });
};

if (document) {
  console.info('%c Domscriptions is running.', 'color: #008080');
  setTintColor('tinted-video');
  onLoadSubscriptions(getVideoMap());
}

module.exports = {
  // expose functions for unit testing
  onLoadSubscriptions: onLoadSubscriptions,
  getVideoMap: getVideoMap,
  onAltClickVideo: onAltClickVideo,
  setTintColor: setTintColor,
  storeVideo: storeVideo
}
