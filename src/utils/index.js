//
// Copyright (c) BoxCast, Inc. and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
//

import Clock from './clock';
export { Clock };

import MonotonicClock from './monotonic_clock';
export { MonotonicClock };

import { STATE } from '../state';

/* eslint max-len: 0 */

export function getStorage() {
  const { localStorage, sessionStorage } = window;
  try {
    localStorage.setItem('__sentinel__', 'foo');
    if (localStorage.getItem('__sentinel__') === 'foo') {
      localStorage.removeItem('__sentinel__');
      return localStorage;
    }
    return sessionStorage;
  } catch (e) {
    return sessionStorage;
  }
}

export function uuid() {
  var r = function(n) {
    var text = '',
      possible = '0123456789ABCDEF';
    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
  return r(8) + '-' + r(4) + '-' + r(4) + '-' + r(4) + '-' + r(12);
}

export function normalizeError(error, source) {
  // This error object could come from various sources, depending on playback
  // and circumstance:
  //   a) string error description
  //   b) dictionary with `message` and `data` keys
  //   c) dictionary with `evt` and `data` keys from hls.js, where `data` is an object with `type`, `details`, and a whole bunch of other keys
  //   d) error object from native HTML5 video element
  //
  // Please note, per the HTML5 spec, these are the following error code values:
  //   MEDIA_ERR_ABORTED (1) The fetching process for the media resource was aborted by the user agent at the user's request.
  //   MEDIA_ERR_NETWORK (2) A network error of some description caused the user agent to stop fetching the media resource, after the resource was established to be usable.
  //   MEDIA_ERR_DECODE (3) An error of some description occurred while decoding the media resource, after the resource was established to be usable.
  //   MEDIA_ERR_SRC_NOT_SUPPORTED (4) The media resource indicated by the src attribute was not suitable.
  //
  // Let's try to normalize the reported error a touch
  error = error || {};
  const code = (error.code) || (error.data && error.data.code);
  let message = error.message;
  if (!message && error.data) {
    message = error.data.details /* hlsError, cannot be stringified */ || JSON.stringify(error.data);
  } else {
    message = error.toString();
  }
  if (message === '[object MediaError]') {
    message = 'MediaError occurred';
  }
  let errorObject = {
    message: message,
    code: code,
    data: error.data
  };
  if (source) {
    errorObject.source = source;
  }
  return errorObject;
}

export function normalizeAxiosError(error) {
  // Error could be nil, or it could be a response-like object, or it could
  // contain a nested response :(
  if (!error) {
    return 'Unknown error';
  } else if (error.response && error.response.data) {
    return error.response.data;
  } else if (error.data) {
    return error.data;
  }
  return error;
}

export function parseList(response) {
  return {
    pagination: JSON.parse(response.headers['x-pagination'] || '{}'),
    data: response.data
  };
}

export function authHeaders() {
  return {
    headers: {
      'Authorization': `Bearer ${STATE.lastAuthToken}`
    }
  };
}

export function throttle (func, interval) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function () {
      timeout = false;
    };
    if (!timeout) {
      func.apply(context, args);
      timeout = true;
      setTimeout(later, interval);
    }
  };
}
