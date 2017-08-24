/**
 * ⚠️⚠️⚠️ WARNING ⚠️⚠️⚠️
 * This file is in the dist/ folder, which is generated via gulp.
 * Changes here will be lost on the next build! Please be careful.
 * ⚠️⚠️⚠️ WARNING ⚠️⚠️⚠️
 */

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function(document) {
'use strict';

var document = document || false;

/**
 * @summary Stores a video's tint setting with chrome.storage.
 * @param {string} id The youtube video's id (?v=...).
 * @param {bool} tint True to tint, false otherwise.
 */
var storeVideo = function storeVideo(id, tint) {
  var obj = {};
  obj[id] = tint;
  chrome.storage.sync.set(obj);
};

/**
 * @summary Updates stylesheet with user's color choice, if it exists.
 * @param {string} className The class to apply a background color to.
 */
var setTintColor = function setTintColor(className) {
  chrome.storage.sync.get('tint', function (items) {
    if (items.tint) {
      var sheet = document.createElement('style');
      sheet.innerHTML = '.' + className + ' {background-color: ' + items.tint + '}';
      document.body.appendChild(sheet);
    }
  });
};

/**
 * @summary Toggles tinting a video.
 * @param {Event} e
 */
var onAltClickVideo = function onAltClickVideo(e) {
  if (e.altKey) {
    var elements = Object.values(e.path);
    var thumbnail = elements.find(function (el) {
      return !!el.search;
    });
    var id = thumbnail.search.split('&')[0];
    var elementName = 'ytd-grid-video-renderer';
    var video = elements.find(function (el) {
      return el.localName === elementName;
    });

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
};

/**
 * @summary Creates a mapping of video IDs to their grid elements.
 * @desc Sets up each video with a listener; @fires onAltCLickVideo
 * @returns {object} { id: <ytd-grid-video-renderer>... }
 */
var getVideoMap = function getVideoMap() {
  var videoMap = {};
  Array.from(document.getElementsByTagName('ytd-grid-video-renderer')).forEach(function (video) {
    video.addEventListener('click', onAltClickVideo);

    var id = video.getElementsByTagName('ytd-thumbnail')[0].childNodes[1].search.split('&')[0];
    videoMap[id] = video;
  });
  return videoMap;
};

/**
 * @summary Sets up the subscription grid with saved tint settings, if any.
 * @desc Removes old video IDs from chrome.storage during iteration.
 * @param {object} videoMap A mapping of video IDs with their HTMLElements.
 */
var onLoadSubscriptions = function onLoadSubscriptions(videoMap) {
  var removeIds = [];

  chrome.storage.sync.get(null, function (res) {
    Object.keys(res).forEach(function (key) {
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
};
}(document));

},{}]},{},[1])