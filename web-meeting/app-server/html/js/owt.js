(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Owt = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// MIT License
//
// Copyright (c) 2012 Universidad Politécnica de Madrid
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
// This file is borrowed from lynckia/licode with some modifications.

/* global unescape*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Base64 = void 0;

var Base64 = function () {
  var END_OF_INPUT = -1;
  var base64Str;
  var base64Count;
  var i;
  var base64Chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'];
  var reverseBase64Chars = [];

  for (i = 0; i < base64Chars.length; i = i + 1) {
    reverseBase64Chars[base64Chars[i]] = i;
  }

  var setBase64Str = function setBase64Str(str) {
    base64Str = str;
    base64Count = 0;
  };

  var readBase64 = function readBase64() {
    if (!base64Str) {
      return END_OF_INPUT;
    }

    if (base64Count >= base64Str.length) {
      return END_OF_INPUT;
    }

    var c = base64Str.charCodeAt(base64Count) & 0xff;
    base64Count = base64Count + 1;
    return c;
  };

  var encodeBase64 = function encodeBase64(str) {
    var result;
    var done;
    setBase64Str(str);
    result = '';
    var inBuffer = new Array(3);
    done = false;

    while (!done && (inBuffer[0] = readBase64()) !== END_OF_INPUT) {
      inBuffer[1] = readBase64();
      inBuffer[2] = readBase64();
      result = result + base64Chars[inBuffer[0] >> 2];

      if (inBuffer[1] !== END_OF_INPUT) {
        result = result + base64Chars[inBuffer[0] << 4 & 0x30 | inBuffer[1] >> 4];

        if (inBuffer[2] !== END_OF_INPUT) {
          result = result + base64Chars[inBuffer[1] << 2 & 0x3c | inBuffer[2] >> 6];
          result = result + base64Chars[inBuffer[2] & 0x3F];
        } else {
          result = result + base64Chars[inBuffer[1] << 2 & 0x3c];
          result = result + '=';
          done = true;
        }
      } else {
        result = result + base64Chars[inBuffer[0] << 4 & 0x30];
        result = result + '=';
        result = result + '=';
        done = true;
      }
    }

    return result;
  };

  var readReverseBase64 = function readReverseBase64() {
    if (!base64Str) {
      return END_OF_INPUT;
    }

    while (true) {
      // eslint-disable-line no-constant-condition
      if (base64Count >= base64Str.length) {
        return END_OF_INPUT;
      }

      var nextCharacter = base64Str.charAt(base64Count);
      base64Count = base64Count + 1;

      if (reverseBase64Chars[nextCharacter]) {
        return reverseBase64Chars[nextCharacter];
      }

      if (nextCharacter === 'A') {
        return 0;
      }
    }
  };

  var ntos = function ntos(n) {
    n = n.toString(16);

    if (n.length === 1) {
      n = '0' + n;
    }

    n = '%' + n;
    return unescape(n);
  };

  var decodeBase64 = function decodeBase64(str) {
    var result;
    var done;
    setBase64Str(str);
    result = '';
    var inBuffer = new Array(4);
    done = false;

    while (!done && (inBuffer[0] = readReverseBase64()) !== END_OF_INPUT && (inBuffer[1] = readReverseBase64()) !== END_OF_INPUT) {
      inBuffer[2] = readReverseBase64();
      inBuffer[3] = readReverseBase64();
      result = result + ntos(inBuffer[0] << 2 & 0xff | inBuffer[1] >> 4);

      if (inBuffer[2] !== END_OF_INPUT) {
        result += ntos(inBuffer[1] << 4 & 0xff | inBuffer[2] >> 2);

        if (inBuffer[3] !== END_OF_INPUT) {
          result = result + ntos(inBuffer[2] << 6 & 0xff | inBuffer[3]);
        } else {
          done = true;
        }
      } else {
        done = true;
      }
    }

    return result;
  };

  return {
    encodeBase64: encodeBase64,
    decodeBase64: decodeBase64
  };
}();

exports.Base64 = Base64;

},{}],2:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';
/**
 * @class AudioCodec
 * @memberOf Owt.Base
 * @classDesc Audio codec enumeration.
 * @hideconstructor
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoEncodingParameters = exports.VideoCodecParameters = exports.VideoCodec = exports.AudioEncodingParameters = exports.AudioCodecParameters = exports.AudioCodec = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioCodec = {
  PCMU: 'pcmu',
  PCMA: 'pcma',
  OPUS: 'opus',
  G722: 'g722',
  ISAC: 'iSAC',
  ILBC: 'iLBC',
  AAC: 'aac',
  AC3: 'ac3',
  NELLYMOSER: 'nellymoser'
};
/**
 * @class AudioCodecParameters
 * @memberOf Owt.Base
 * @classDesc Codec parameters for an audio track.
 * @hideconstructor
 */

exports.AudioCodec = AudioCodec;

var AudioCodecParameters = // eslint-disable-next-line require-jsdoc
function AudioCodecParameters(name, channelCount, clockRate) {
  _classCallCheck(this, AudioCodecParameters);

  /**
   * @member {string} name
   * @memberof Owt.Base.AudioCodecParameters
   * @instance
   * @desc Name of a codec. Please use a value in Owt.Base.AudioCodec. However, some functions do not support all the values in Owt.Base.AudioCodec.
   */
  this.name = name;
  /**
   * @member {?number} channelCount
   * @memberof Owt.Base.AudioCodecParameters
   * @instance
   * @desc Numbers of channels for an audio track.
   */

  this.channelCount = channelCount;
  /**
   * @member {?number} clockRate
   * @memberof Owt.Base.AudioCodecParameters
   * @instance
   * @desc The codec clock rate expressed in Hertz.
   */

  this.clockRate = clockRate;
};
/**
 * @class AudioEncodingParameters
 * @memberOf Owt.Base
 * @classDesc Encoding parameters for sending an audio track.
 * @hideconstructor
 */


exports.AudioCodecParameters = AudioCodecParameters;

var AudioEncodingParameters = // eslint-disable-next-line require-jsdoc
function AudioEncodingParameters(codec, maxBitrate) {
  _classCallCheck(this, AudioEncodingParameters);

  /**
   * @member {?Owt.Base.AudioCodecParameters} codec
   * @instance
   * @memberof Owt.Base.AudioEncodingParameters
   */
  this.codec = codec;
  /**
   * @member {?number} maxBitrate
   * @instance
   * @memberof Owt.Base.AudioEncodingParameters
   * @desc Max bitrate expressed in kbps.
   */

  this.maxBitrate = maxBitrate;
};

exports.AudioEncodingParameters = AudioEncodingParameters;
var VideoCodec = {
  VP8: 'vp8',
  VP9: 'vp9',
  H264: 'h264',
  H265: 'h265'
};
/**
 * @class VideoCodecParameters
 * @memberOf Owt.Base
 * @classDesc Codec parameters for a video track.
 * @hideconstructor
 */

exports.VideoCodec = VideoCodec;

var VideoCodecParameters = // eslint-disable-next-line require-jsdoc
function VideoCodecParameters(name, profile) {
  _classCallCheck(this, VideoCodecParameters);

  /**
   * @member {string} name
   * @memberof Owt.Base.VideoCodecParameters
   * @instance
   * @desc Name of a codec. Please use a value in Owt.Base.VideoCodec. However, some functions do not support all the values in Owt.Base.AudioCodec.
   */
  this.name = name;
  /**
   * @member {?string} profile
   * @memberof Owt.Base.VideoCodecParameters
   * @instance
   * @desc The profile of a codec. Profile may not apply to all codecs.
   */

  this.profile = profile;
};
/**
 * @class VideoEncodingParameters
 * @memberOf Owt.Base
 * @classDesc Encoding parameters for sending a video track.
 * @hideconstructor
 */


exports.VideoCodecParameters = VideoCodecParameters;

var VideoEncodingParameters = // eslint-disable-next-line require-jsdoc
function VideoEncodingParameters(codec, maxBitrate) {
  _classCallCheck(this, VideoEncodingParameters);

  /**
   * @member {?Owt.Base.VideoCodecParameters} codec
   * @instance
   * @memberof Owt.Base.VideoEncodingParameters
   */
  this.codec = codec;
  /**
   * @member {?number} maxBitrate
   * @instance
   * @memberof Owt.Base.VideoEncodingParameters
   * @desc Max bitrate expressed in kbps.
   */

  this.maxBitrate = maxBitrate;
};

exports.VideoEncodingParameters = VideoEncodingParameters;

},{}],3:[function(require,module,exports){
// MIT License
//
// Copyright (c) 2012 Universidad Politécnica de Madrid
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
// This file is borrowed from lynckia/licode with some modifications.
'use strict';
/**
 * @class EventDispatcher
 * @classDesc A shim for EventTarget. Might be changed to EventTarget later.
 * @memberof Owt.Base
 * @hideconstructor
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MuteEvent = exports.ErrorEvent = exports.MessageEvent = exports.OwtEvent = exports.EventDispatcher = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventDispatcher = function EventDispatcher() {
  // Private vars
  var spec = {};
  spec.dispatcher = {};
  spec.dispatcher.eventListeners = {};
  /**
   * @function addEventListener
   * @desc This function registers a callback function as a handler for the corresponding event. It's shortened form is on(eventType, listener). See the event description in the following table.
   * @instance
   * @memberof Owt.Base.EventDispatcher
   * @param {string} eventType Event string.
   * @param {function} listener Callback function.
   */

  this.addEventListener = function (eventType, listener) {
    if (spec.dispatcher.eventListeners[eventType] === undefined) {
      spec.dispatcher.eventListeners[eventType] = [];
    }

    spec.dispatcher.eventListeners[eventType].push(listener);
  };
  /**
   * @function removeEventListener
   * @desc This function removes a registered event listener.
   * @instance
   * @memberof Owt.Base.EventDispatcher
   * @param {string} eventType Event string.
   * @param {function} listener Callback function.
   */


  this.removeEventListener = function (eventType, listener) {
    if (!spec.dispatcher.eventListeners[eventType]) {
      return;
    }

    var index = spec.dispatcher.eventListeners[eventType].indexOf(listener);

    if (index !== -1) {
      spec.dispatcher.eventListeners[eventType].splice(index, 1);
    }
  };
  /**
   * @function clearEventListener
   * @desc This function removes all event listeners for one type.
   * @instance
   * @memberof Owt.Base.EventDispatcher
   * @param {string} eventType Event string.
   */


  this.clearEventListener = function (eventType) {
    spec.dispatcher.eventListeners[eventType] = [];
  }; // It dispatch a new event to the event listeners, based on the type
  // of event. All events are intended to be LicodeEvents.


  this.dispatchEvent = function (event) {
    if (!spec.dispatcher.eventListeners[event.type]) {
      return;
    }

    spec.dispatcher.eventListeners[event.type].map(function (listener) {
      listener(event);
    });
  };
};
/**
 * @class OwtEvent
 * @classDesc Class OwtEvent represents a generic Event in the library.
 * @memberof Owt.Base
 * @hideconstructor
 */


exports.EventDispatcher = EventDispatcher;

var OwtEvent = // eslint-disable-next-line require-jsdoc
function OwtEvent(type) {
  _classCallCheck(this, OwtEvent);

  this.type = type;
};
/**
 * @class MessageEvent
 * @classDesc Class MessageEvent represents a message Event in the library.
 * @memberof Owt.Base
 * @hideconstructor
 */


exports.OwtEvent = OwtEvent;

var MessageEvent =
/*#__PURE__*/
function (_OwtEvent) {
  _inherits(MessageEvent, _OwtEvent);

  // eslint-disable-next-line require-jsdoc
  function MessageEvent(type, init) {
    var _this;

    _classCallCheck(this, MessageEvent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MessageEvent).call(this, type));
    /**
     * @member {string} origin
     * @instance
     * @memberof Owt.Base.MessageEvent
     * @desc ID of the remote endpoint who published this stream.
     */

    _this.origin = init.origin;
    /**
     * @member {string} message
     * @instance
     * @memberof Owt.Base.MessageEvent
     */

    _this.message = init.message;
    /**
     * @member {string} to
     * @instance
     * @memberof Owt.Base.MessageEvent
     * @desc Values could be "all", "me" in conference mode, or undefined in P2P mode..
     */

    _this.to = init.to;
    return _this;
  }

  return MessageEvent;
}(OwtEvent);
/**
 * @class ErrorEvent
 * @classDesc Class ErrorEvent represents an error Event in the library.
 * @memberof Owt.Base
 * @hideconstructor
 */


exports.MessageEvent = MessageEvent;

var ErrorEvent =
/*#__PURE__*/
function (_OwtEvent2) {
  _inherits(ErrorEvent, _OwtEvent2);

  // eslint-disable-next-line require-jsdoc
  function ErrorEvent(type, init) {
    var _this2;

    _classCallCheck(this, ErrorEvent);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ErrorEvent).call(this, type));
    /**
     * @member {Error} error
     * @instance
     * @memberof Owt.Base.ErrorEvent
     */

    _this2.error = init.error;
    return _this2;
  }

  return ErrorEvent;
}(OwtEvent);
/**
 * @class MuteEvent
 * @classDesc Class MuteEvent represents a mute or unmute event.
 * @memberof Owt.Base
 * @hideconstructor
 */


exports.ErrorEvent = ErrorEvent;

var MuteEvent =
/*#__PURE__*/
function (_OwtEvent3) {
  _inherits(MuteEvent, _OwtEvent3);

  // eslint-disable-next-line require-jsdoc
  function MuteEvent(type, init) {
    var _this3;

    _classCallCheck(this, MuteEvent);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(MuteEvent).call(this, type));
    /**
     * @member {Owt.Base.TrackKind} kind
     * @instance
     * @memberof Owt.Base.MuteEvent
     */

    _this3.kind = init.kind;
    return _this3;
  }

  return MuteEvent;
}(OwtEvent);

exports.MuteEvent = MuteEvent;

},{}],4:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mediastreamFactory = require("./mediastream-factory.js");

Object.keys(_mediastreamFactory).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _mediastreamFactory[key];
    }
  });
});

var _stream = require("./stream.js");

Object.keys(_stream).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _stream[key];
    }
  });
});

var _mediaformat = require("./mediaformat.js");

Object.keys(_mediaformat).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _mediaformat[key];
    }
  });
});

},{"./mediaformat.js":6,"./mediastream-factory.js":7,"./stream.js":10}],5:[function(require,module,exports){
// MIT License
//
// Copyright (c) 2012 Universidad Politécnica de Madrid
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
// This file is borrowed from lynckia/licode with some modifications.

/* global console,window */
'use strict';
/*
 * API to write logs based on traditional logging mechanisms: debug, trace,
 * info, warning, error
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var Logger = function () {
  var DEBUG = 0;
  var TRACE = 1;
  var INFO = 2;
  var WARNING = 3;
  var ERROR = 4;
  var NONE = 5;

  var noOp = function noOp() {}; // |that| is the object to be returned.


  var that = {
    DEBUG: DEBUG,
    TRACE: TRACE,
    INFO: INFO,
    WARNING: WARNING,
    ERROR: ERROR,
    NONE: NONE
  };
  that.log = window.console.log.bind(window.console);

  var bindType = function bindType(type) {
    if (typeof window.console[type] === 'function') {
      return window.console[type].bind(window.console);
    } else {
      return window.console.log.bind(window.console);
    }
  };

  var setLogLevel = function setLogLevel(level) {
    if (level <= DEBUG) {
      that.debug = bindType('log');
    } else {
      that.debug = noOp;
    }

    if (level <= TRACE) {
      that.trace = bindType('trace');
    } else {
      that.trace = noOp;
    }

    if (level <= INFO) {
      that.info = bindType('info');
    } else {
      that.info = noOp;
    }

    if (level <= WARNING) {
      that.warning = bindType('warn');
    } else {
      that.warning = noOp;
    }

    if (level <= ERROR) {
      that.error = bindType('error');
    } else {
      that.error = noOp;
    }
  };

  setLogLevel(DEBUG); // Default level is debug.

  that.setLogLevel = setLogLevel;
  return that;
}();

var _default = Logger;
exports.default = _default;

},{}],6:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';
/**
 * @class AudioSourceInfo
 * @classDesc Source info about an audio track. Values: 'mic', 'screen-cast', 'file', 'mixed'.
 * @memberOf Owt.Base
 * @readonly
 * @enum {string}
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Resolution = exports.TrackKind = exports.VideoSourceInfo = exports.AudioSourceInfo = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioSourceInfo = {
  MIC: 'mic',
  SCREENCAST: 'screen-cast',
  FILE: 'file',
  MIXED: 'mixed'
};
/**
 * @class VideoSourceInfo
 * @classDesc Source info about a video track. Values: 'camera', 'screen-cast', 'file', 'mixed'.
 * @memberOf Owt.Base
 * @readonly
 * @enum {string}
 */

exports.AudioSourceInfo = AudioSourceInfo;
var VideoSourceInfo = {
  CAMERA: 'camera',
  SCREENCAST: 'screen-cast',
  FILE: 'file',
  MIXED: 'mixed'
};
/**
 * @class TrackKind
 * @classDesc Kind of a track. Values: 'audio' for audio track, 'video' for video track, 'av' for both audio and video tracks.
 * @memberOf Owt.Base
 * @readonly
 * @enum {string}
 */

exports.VideoSourceInfo = VideoSourceInfo;
var TrackKind = {
  /**
   * Audio tracks.
   * @type string
   */
  AUDIO: 'audio',

  /**
   * Video tracks.
   * @type string
   */
  VIDEO: 'video',

  /**
   * Both audio and video tracks.
   * @type string
   */
  AUDIO_AND_VIDEO: 'av'
};
/**
 * @class Resolution
 * @memberOf Owt.Base
 * @classDesc The Resolution defines the size of a rectangle.
 * @constructor
 * @param {number} width
 * @param {number} height
 */

exports.TrackKind = TrackKind;

var Resolution = // eslint-disable-next-line require-jsdoc
function Resolution(width, height) {
  _classCallCheck(this, Resolution);

  /**
   * @member {number} width
   * @instance
   * @memberof Owt.Base.Resolution
   */
  this.width = width;
  /**
   * @member {number} height
   * @instance
   * @memberof Owt.Base.Resolution
   */

  this.height = height;
};

exports.Resolution = Resolution;

},{}],7:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0

/* global console, window, Promise, chrome, navigator */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaStreamFactory = exports.StreamConstraints = exports.VideoTrackConstraints = exports.AudioTrackConstraints = void 0;

var utils = _interopRequireWildcard(require("./utils.js"));

var _logger = _interopRequireDefault(require("./logger.js"));

var MediaFormatModule = _interopRequireWildcard(require("./mediaformat.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class AudioTrackConstraints
 * @classDesc Constraints for creating an audio MediaStreamTrack.
 * @memberof Owt.Base
 * @constructor
 * @param {Owt.Base.AudioSourceInfo} source Source info of this audio track.
 */
var AudioTrackConstraints = // eslint-disable-next-line require-jsdoc
function AudioTrackConstraints(source) {
  _classCallCheck(this, AudioTrackConstraints);

  if (!Object.values(MediaFormatModule.AudioSourceInfo).some(function (v) {
    return v === source;
  })) {
    throw new TypeError('Invalid source.');
  }
  /**
   * @member {string} source
   * @memberof Owt.Base.AudioTrackConstraints
   * @desc Values could be "mic", "screen-cast", "file" or "mixed".
   * @instance
   */


  this.source = source;
  /**
   * @member {string} deviceId
   * @memberof Owt.Base.AudioTrackConstraints
   * @desc Do not provide deviceId if source is not "mic".
   * @instance
   * @see https://w3c.github.io/mediacapture-main/#def-constraint-deviceId
   */

  this.deviceId = undefined;
};
/**
 * @class VideoTrackConstraints
 * @classDesc Constraints for creating a video MediaStreamTrack.
 * @memberof Owt.Base
 * @constructor
 * @param {Owt.Base.VideoSourceInfo} source Source info of this video track.
 */


exports.AudioTrackConstraints = AudioTrackConstraints;

var VideoTrackConstraints = // eslint-disable-next-line require-jsdoc
function VideoTrackConstraints(source) {
  _classCallCheck(this, VideoTrackConstraints);

  if (!Object.values(MediaFormatModule.VideoSourceInfo).some(function (v) {
    return v === source;
  })) {
    throw new TypeError('Invalid source.');
  }
  /**
   * @member {string} source
   * @memberof Owt.Base.VideoTrackConstraints
   * @desc Values could be "camera", "screen-cast", "file" or "mixed".
   * @instance
   */


  this.source = source;
  /**
   * @member {string} deviceId
   * @memberof Owt.Base.VideoTrackConstraints
   * @desc Do not provide deviceId if source is not "camera".
   * @instance
   * @see https://w3c.github.io/mediacapture-main/#def-constraint-deviceId
   */

  this.deviceId = undefined;
  /**
   * @member {Owt.Base.Resolution} resolution
   * @memberof Owt.Base.VideoTrackConstraints
   * @instance
   */

  this.resolution = undefined;
  /**
   * @member {number} frameRate
   * @memberof Owt.Base.VideoTrackConstraints
   * @instance
   */

  this.frameRate = undefined;
};
/**
 * @class StreamConstraints
 * @classDesc Constraints for creating a MediaStream from screen mic and camera.
 * @memberof Owt.Base
 * @constructor
 * @param {?Owt.Base.AudioTrackConstraints} audioConstraints
 * @param {?Owt.Base.VideoTrackConstraints} videoConstraints
 */


exports.VideoTrackConstraints = VideoTrackConstraints;

var StreamConstraints = // eslint-disable-next-line require-jsdoc
function StreamConstraints() {
  var audioConstraints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var videoConstraints = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  _classCallCheck(this, StreamConstraints);

  /**
   * @member {Owt.Base.MediaStreamTrackDeviceConstraintsForAudio} audio
   * @memberof Owt.Base.MediaStreamDeviceConstraints
   * @instance
   */
  this.audio = audioConstraints;
  /**
   * @member {Owt.Base.MediaStreamTrackDeviceConstraintsForVideo} Video
   * @memberof Owt.Base.MediaStreamDeviceConstraints
   * @instance
   */

  this.video = videoConstraints;
}; // eslint-disable-next-line require-jsdoc


exports.StreamConstraints = StreamConstraints;

function isVideoConstrainsForScreenCast(constraints) {
  return _typeof(constraints.video) === 'object' && constraints.video.source === MediaFormatModule.VideoSourceInfo.SCREENCAST;
}
/**
 * @class MediaStreamFactory
 * @classDesc A factory to create MediaStream. You can also create MediaStream by yourself.
 * @memberof Owt.Base
 */


var MediaStreamFactory =
/*#__PURE__*/
function () {
  function MediaStreamFactory() {
    _classCallCheck(this, MediaStreamFactory);
  }

  _createClass(MediaStreamFactory, null, [{
    key: "createMediaStream",

    /**
     * @function createMediaStream
     * @static
     * @desc Create a MediaStream with given constraints. If you want to create a MediaStream for screen cast, please make sure both audio and video's source are "screen-cast".
     * @memberof Owt.Base.MediaStreamFactory
     * @returns {Promise<MediaStream, Error>} Return a promise that is resolved when stream is successfully created, or rejected if one of the following error happened:
     * - One or more parameters cannot be satisfied.
     * - Specified device is busy.
     * - Cannot obtain necessary permission or operation is canceled by user.
     * - Video source is screen cast, while audio source is not.
     * - Audio source is screen cast, while video source is disabled.
     * @param {Owt.Base.StreamConstraints} constraints
     */
    value: function createMediaStream(constraints) {
      if (_typeof(constraints) !== 'object' || !constraints.audio && !constraints.video) {
        return Promise.reject(new TypeError('Invalid constrains'));
      }

      if (!isVideoConstrainsForScreenCast(constraints) && _typeof(constraints.audio) === 'object' && constraints.audio.source === MediaFormatModule.AudioSourceInfo.SCREENCAST) {
        return Promise.reject(new TypeError('Cannot share screen without video.'));
      }

      if (isVideoConstrainsForScreenCast(constraints) && !utils.isChrome() && !utils.isFirefox()) {
        return Promise.reject(new TypeError('Screen sharing only supports Chrome and Firefox.'));
      }

      if (isVideoConstrainsForScreenCast(constraints) && _typeof(constraints.audio) === 'object' && constraints.audio.source !== MediaFormatModule.AudioSourceInfo.SCREENCAST) {
        return Promise.reject(new TypeError('Cannot capture video from screen cast while capture audio from' + ' other source.'));
      } // Check and convert constraints.


      if (!constraints.audio && !constraints.video) {
        return Promise.reject(new TypeError('At least one of audio and video must be requested.'));
      }

      var mediaConstraints = Object.create({});

      if (_typeof(constraints.audio) === 'object' && constraints.audio.source === MediaFormatModule.AudioSourceInfo.MIC) {
        mediaConstraints.audio = Object.create({});

        if (utils.isEdge()) {
          mediaConstraints.audio.deviceId = constraints.audio.deviceId;
        } else {
          mediaConstraints.audio.deviceId = {
            exact: constraints.audio.deviceId
          };
        }
      } else {
        if (constraints.audio.source === MediaFormatModule.AudioSourceInfo.SCREENCAST) {
          mediaConstraints.audio = true;
        } else {
          mediaConstraints.audio = constraints.audio;
        }
      }

      if (_typeof(constraints.video) === 'object') {
        mediaConstraints.video = Object.create({});

        if (typeof constraints.video.frameRate === 'number') {
          mediaConstraints.video.frameRate = constraints.video.frameRate;
        }

        if (constraints.video.resolution && constraints.video.resolution.width && constraints.video.resolution.height) {
          if (constraints.video.source === MediaFormatModule.VideoSourceInfo.SCREENCAST) {
            mediaConstraints.video.width = constraints.video.resolution.width;
            mediaConstraints.video.height = constraints.video.resolution.height;
          } else {
            mediaConstraints.video.width = Object.create({});
            mediaConstraints.video.width.exact = constraints.video.resolution.width;
            mediaConstraints.video.height = Object.create({});
            mediaConstraints.video.height.exact = constraints.video.resolution.height;
          }
        }

        if (typeof constraints.video.deviceId === 'string') {
          mediaConstraints.video.deviceId = {
            exact: constraints.video.deviceId
          };
        }

        if (utils.isFirefox() && constraints.video.source === MediaFormatModule.VideoSourceInfo.SCREENCAST) {
          mediaConstraints.video.mediaSource = 'screen';
        }
      } else {
        mediaConstraints.video = constraints.video;
      }

      if (isVideoConstrainsForScreenCast(constraints)) {
        return navigator.mediaDevices.getDisplayMedia(mediaConstraints);
      } else {
        return navigator.mediaDevices.getUserMedia(mediaConstraints);
      }
    }
  }]);

  return MediaStreamFactory;
}();

exports.MediaStreamFactory = MediaStreamFactory;

},{"./logger.js":5,"./mediaformat.js":6,"./utils.js":11}],8:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PublishOptions = exports.Publication = exports.PublicationSettings = exports.VideoPublicationSettings = exports.AudioPublicationSettings = void 0;

var Utils = _interopRequireWildcard(require("./utils.js"));

var MediaFormat = _interopRequireWildcard(require("./mediaformat.js"));

var _event = require("../base/event.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class AudioPublicationSettings
 * @memberOf Owt.Base
 * @classDesc The audio settings of a publication.
 * @hideconstructor
 */
var AudioPublicationSettings = // eslint-disable-next-line require-jsdoc
function AudioPublicationSettings(codec) {
  _classCallCheck(this, AudioPublicationSettings);

  /**
   * @member {?Owt.Base.AudioCodecParameters} codec
   * @instance
   * @memberof Owt.Base.AudioPublicationSettings
   */
  this.codec = codec;
};
/**
 * @class VideoPublicationSettings
 * @memberOf Owt.Base
 * @classDesc The video settings of a publication.
 * @hideconstructor
 */


exports.AudioPublicationSettings = AudioPublicationSettings;

var VideoPublicationSettings = // eslint-disable-next-line require-jsdoc
function VideoPublicationSettings(codec, resolution, frameRate, bitrate, keyFrameInterval) {
  _classCallCheck(this, VideoPublicationSettings);

  /**
   * @member {?Owt.Base.VideoCodecParameters} codec
   * @instance
   * @memberof Owt.Base.VideoPublicationSettings
   */
  this.codec = codec,
  /**
   * @member {?Owt.Base.Resolution} resolution
   * @instance
   * @memberof Owt.Base.VideoPublicationSettings
   */
  this.resolution = resolution;
  /**
   * @member {?number} frameRates
   * @instance
   * @classDesc Frames per second.
   * @memberof Owt.Base.VideoPublicationSettings
   */

  this.frameRate = frameRate;
  /**
   * @member {?number} bitrate
   * @instance
   * @memberof Owt.Base.VideoPublicationSettings
   */

  this.bitrate = bitrate;
  /**
   * @member {?number} keyFrameIntervals
   * @instance
   * @classDesc The time interval between key frames. Unit: second.
   * @memberof Owt.Base.VideoPublicationSettings
   */

  this.keyFrameInterval = keyFrameInterval;
};
/**
 * @class PublicationSettings
 * @memberOf Owt.Base
 * @classDesc The settings of a publication.
 * @hideconstructor
 */


exports.VideoPublicationSettings = VideoPublicationSettings;

var PublicationSettings = // eslint-disable-next-line require-jsdoc
function PublicationSettings(audio, video) {
  _classCallCheck(this, PublicationSettings);

  /**
   * @member {Owt.Base.AudioPublicationSettings} audio
   * @instance
   * @memberof Owt.Base.PublicationSettings
   */
  this.audio = audio;
  /**
   * @member {Owt.Base.VideoPublicationSettings} video
   * @instance
   * @memberof Owt.Base.PublicationSettings
   */

  this.video = video;
};
/**
 * @class Publication
 * @extends Owt.Base.EventDispatcher
 * @memberOf Owt.Base
 * @classDesc Publication represents a sender for publishing a stream. It
 * handles the actions on a LocalStream published to a conference.
 * Events:
 *
 * | Event Name      | Argument Type    | Fired when       |
 * | ----------------| ---------------- | ---------------- |
 * | ended           | Event            | Publication is ended. |
 * | error           | ErrorEvent       | An error occurred on the publication. |
 * | mute            | MuteEvent        | Publication is muted. Client stopped sending audio and/or video data to remote endpoint. |
 * | unmute          | MuteEvent        | Publication is unmuted. Client continued sending audio and/or video data to remote endpoint. |
 *
 * @hideconstructor
 */


exports.PublicationSettings = PublicationSettings;

var Publication =
/*#__PURE__*/
function (_EventDispatcher) {
  _inherits(Publication, _EventDispatcher);

  // eslint-disable-next-line require-jsdoc
  function Publication(id, stop, getStats, mute, unmute) {
    var _this;

    _classCallCheck(this, Publication);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Publication).call(this));
    /**
     * @member {string} id
     * @instance
     * @memberof Owt.Base.Publication
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'id', {
      configurable: false,
      writable: false,
      value: id ? id : Utils.createUuid()
    });
    /**
     * @function stop
     * @instance
     * @desc Stop certain publication. Once a subscription is stopped, it cannot be recovered.
     * @memberof Owt.Base.Publication
     * @returns {undefined}
     */

    _this.stop = stop;
    /**
     * @function getStats
     * @instance
     * @desc Get stats of underlying PeerConnection.
     * @memberof Owt.Base.Publication
     * @returns {Promise<RTCStatsReport, Error>}
     */

    _this.getStats = getStats;
    /**
     * @function mute
     * @instance
     * @desc Stop sending data to remote endpoint.
     * @memberof Owt.Base.Publication
     * @param {Owt.Base.TrackKind } kind Kind of tracks to be muted.
     * @returns {Promise<undefined, Error>}
     */

    _this.mute = mute;
    /**
     * @function unmute
     * @instance
     * @desc Continue sending data to remote endpoint.
     * @memberof Owt.Base.Publication
     * @param {Owt.Base.TrackKind } kind Kind of tracks to be unmuted.
     * @returns {Promise<undefined, Error>}
     */

    _this.unmute = unmute;
    return _this;
  }

  return Publication;
}(_event.EventDispatcher);
/**
 * @class PublishOptions
 * @memberOf Owt.Base
 * @classDesc PublishOptions defines options for publishing a Owt.Base.LocalStream.
 */


exports.Publication = Publication;

var PublishOptions = // eslint-disable-next-line require-jsdoc
function PublishOptions(audio, video) {
  _classCallCheck(this, PublishOptions);

  /**
   * @member {?Array<Owt.Base.AudioEncodingParameters>} audio
   * @instance
   * @memberof Owt.Base.PublishOptions
   */
  this.audio = audio;
  /**
   * @member {?Array<Owt.Base.VideoEncodingParameters>} video
   * @instance
   * @memberof Owt.Base.PublishOptions
   */

  this.video = video;
};

exports.PublishOptions = PublishOptions;

},{"../base/event.js":3,"./mediaformat.js":6,"./utils.js":11}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reorderCodecs = reorderCodecs;
exports.setMaxBitrate = setMaxBitrate;

var _logger = _interopRequireDefault(require("./logger.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 *  Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* More information about these options at jshint.com/docs/options */

/* eslint-disable */

/* globals  adapter, trace */

/* exported setCodecParam, iceCandidateType, formatTypePreference,
   maybeSetOpusOptions, maybePreferAudioReceiveCodec,
   maybePreferAudioSendCodec, maybeSetAudioReceiveBitRate,
   maybeSetAudioSendBitRate, maybePreferVideoReceiveCodec,
   maybePreferVideoSendCodec, maybeSetVideoReceiveBitRate,
   maybeSetVideoSendBitRate, maybeSetVideoSendInitialBitRate,
   maybeRemoveVideoFec, mergeConstraints, removeCodecParam*/

/* This file is borrowed from apprtc with some modifications. */

/* Commit hash: c6af0c25e9af527f71b3acdd6bfa1389d778f7bd + PR 530 */
'use strict';

function mergeConstraints(cons1, cons2) {
  if (!cons1 || !cons2) {
    return cons1 || cons2;
  }

  var merged = cons1;

  for (var key in cons2) {
    merged[key] = cons2[key];
  }

  return merged;
}

function iceCandidateType(candidateStr) {
  return candidateStr.split(' ')[7];
} // Turns the local type preference into a human-readable string.
// Note that this mapping is browser-specific.


function formatTypePreference(pref) {
  if (adapter.browserDetails.browser === 'chrome') {
    switch (pref) {
      case 0:
        return 'TURN/TLS';

      case 1:
        return 'TURN/TCP';

      case 2:
        return 'TURN/UDP';

      default:
        break;
    }
  } else if (adapter.browserDetails.browser === 'firefox') {
    switch (pref) {
      case 0:
        return 'TURN/TCP';

      case 5:
        return 'TURN/UDP';

      default:
        break;
    }
  }

  return '';
}

function maybeSetOpusOptions(sdp, params) {
  // Set Opus in Stereo, if stereo is true, unset it, if stereo is false, and
  // do nothing if otherwise.
  if (params.opusStereo === 'true') {
    sdp = setCodecParam(sdp, 'opus/48000', 'stereo', '1');
  } else if (params.opusStereo === 'false') {
    sdp = removeCodecParam(sdp, 'opus/48000', 'stereo');
  } // Set Opus FEC, if opusfec is true, unset it, if opusfec is false, and
  // do nothing if otherwise.


  if (params.opusFec === 'true') {
    sdp = setCodecParam(sdp, 'opus/48000', 'useinbandfec', '1');
  } else if (params.opusFec === 'false') {
    sdp = removeCodecParam(sdp, 'opus/48000', 'useinbandfec');
  } // Set Opus DTX, if opusdtx is true, unset it, if opusdtx is false, and
  // do nothing if otherwise.


  if (params.opusDtx === 'true') {
    sdp = setCodecParam(sdp, 'opus/48000', 'usedtx', '1');
  } else if (params.opusDtx === 'false') {
    sdp = removeCodecParam(sdp, 'opus/48000', 'usedtx');
  } // Set Opus maxplaybackrate, if requested.


  if (params.opusMaxPbr) {
    sdp = setCodecParam(sdp, 'opus/48000', 'maxplaybackrate', params.opusMaxPbr);
  }

  return sdp;
}

function maybeSetAudioSendBitRate(sdp, params) {
  if (!params.audioSendBitrate) {
    return sdp;
  }

  _logger.default.debug('Prefer audio send bitrate: ' + params.audioSendBitrate);

  return preferBitRate(sdp, params.audioSendBitrate, 'audio');
}

function maybeSetAudioReceiveBitRate(sdp, params) {
  if (!params.audioRecvBitrate) {
    return sdp;
  }

  _logger.default.debug('Prefer audio receive bitrate: ' + params.audioRecvBitrate);

  return preferBitRate(sdp, params.audioRecvBitrate, 'audio');
}

function maybeSetVideoSendBitRate(sdp, params) {
  if (!params.videoSendBitrate) {
    return sdp;
  }

  _logger.default.debug('Prefer video send bitrate: ' + params.videoSendBitrate);

  return preferBitRate(sdp, params.videoSendBitrate, 'video');
}

function maybeSetVideoReceiveBitRate(sdp, params) {
  if (!params.videoRecvBitrate) {
    return sdp;
  }

  _logger.default.debug('Prefer video receive bitrate: ' + params.videoRecvBitrate);

  return preferBitRate(sdp, params.videoRecvBitrate, 'video');
} // Add a b=AS:bitrate line to the m=mediaType section.


function preferBitRate(sdp, bitrate, mediaType) {
  var sdpLines = sdp.split('\r\n'); // Find m line for the given mediaType.

  var mLineIndex = findLine(sdpLines, 'm=', mediaType);

  if (mLineIndex === null) {
    _logger.default.debug('Failed to add bandwidth line to sdp, as no m-line found');

    return sdp;
  } // Find next m-line if any.


  var nextMLineIndex = findLineInRange(sdpLines, mLineIndex + 1, -1, 'm=');

  if (nextMLineIndex === null) {
    nextMLineIndex = sdpLines.length;
  } // Find c-line corresponding to the m-line.


  var cLineIndex = findLineInRange(sdpLines, mLineIndex + 1, nextMLineIndex, 'c=');

  if (cLineIndex === null) {
    _logger.default.debug('Failed to add bandwidth line to sdp, as no c-line found');

    return sdp;
  } // Check if bandwidth line already exists between c-line and next m-line.


  var bLineIndex = findLineInRange(sdpLines, cLineIndex + 1, nextMLineIndex, 'b=AS');

  if (bLineIndex) {
    sdpLines.splice(bLineIndex, 1);
  } // Create the b (bandwidth) sdp line.


  var bwLine = 'b=AS:' + bitrate; // As per RFC 4566, the b line should follow after c-line.

  sdpLines.splice(cLineIndex + 1, 0, bwLine);
  sdp = sdpLines.join('\r\n');
  return sdp;
} // Add an a=fmtp: x-google-min-bitrate=kbps line, if videoSendInitialBitrate
// is specified. We'll also add a x-google-min-bitrate value, since the max
// must be >= the min.


function maybeSetVideoSendInitialBitRate(sdp, params) {
  var initialBitrate = parseInt(params.videoSendInitialBitrate);

  if (!initialBitrate) {
    return sdp;
  } // Validate the initial bitrate value.


  var maxBitrate = parseInt(initialBitrate);
  var bitrate = parseInt(params.videoSendBitrate);

  if (bitrate) {
    if (initialBitrate > bitrate) {
      _logger.default.debug('Clamping initial bitrate to max bitrate of ' + bitrate + ' kbps.');

      initialBitrate = bitrate;
      params.videoSendInitialBitrate = initialBitrate;
    }

    maxBitrate = bitrate;
  }

  var sdpLines = sdp.split('\r\n'); // Search for m line.

  var mLineIndex = findLine(sdpLines, 'm=', 'video');

  if (mLineIndex === null) {
    _logger.default.debug('Failed to find video m-line');

    return sdp;
  } // Figure out the first codec payload type on the m=video SDP line.


  var videoMLine = sdpLines[mLineIndex];
  var pattern = new RegExp('m=video\\s\\d+\\s[A-Z/]+\\s');
  var sendPayloadType = videoMLine.split(pattern)[1].split(' ')[0];
  var fmtpLine = sdpLines[findLine(sdpLines, 'a=rtpmap', sendPayloadType)];
  var codecName = fmtpLine.split('a=rtpmap:' + sendPayloadType)[1].split('/')[0]; // Use codec from params if specified via URL param, otherwise use from SDP.

  var codec = params.videoSendCodec || codecName;
  sdp = setCodecParam(sdp, codec, 'x-google-min-bitrate', params.videoSendInitialBitrate.toString());
  sdp = setCodecParam(sdp, codec, 'x-google-max-bitrate', maxBitrate.toString());
  return sdp;
}

function removePayloadTypeFromMline(mLine, payloadType) {
  mLine = mLine.split(' ');

  for (var i = 0; i < mLine.length; ++i) {
    if (mLine[i] === payloadType.toString()) {
      mLine.splice(i, 1);
    }
  }

  return mLine.join(' ');
}

function removeCodecByName(sdpLines, codec) {
  var index = findLine(sdpLines, 'a=rtpmap', codec);

  if (index === null) {
    return sdpLines;
  }

  var payloadType = getCodecPayloadTypeFromLine(sdpLines[index]);
  sdpLines.splice(index, 1); // Search for the video m= line and remove the codec.

  var mLineIndex = findLine(sdpLines, 'm=', 'video');

  if (mLineIndex === null) {
    return sdpLines;
  }

  sdpLines[mLineIndex] = removePayloadTypeFromMline(sdpLines[mLineIndex], payloadType);
  return sdpLines;
}

function removeCodecByPayloadType(sdpLines, payloadType) {
  var index = findLine(sdpLines, 'a=rtpmap', payloadType.toString());

  if (index === null) {
    return sdpLines;
  }

  sdpLines.splice(index, 1); // Search for the video m= line and remove the codec.

  var mLineIndex = findLine(sdpLines, 'm=', 'video');

  if (mLineIndex === null) {
    return sdpLines;
  }

  sdpLines[mLineIndex] = removePayloadTypeFromMline(sdpLines[mLineIndex], payloadType);
  return sdpLines;
}

function maybeRemoveVideoFec(sdp, params) {
  if (params.videoFec !== 'false') {
    return sdp;
  }

  var sdpLines = sdp.split('\r\n');
  var index = findLine(sdpLines, 'a=rtpmap', 'red');

  if (index === null) {
    return sdp;
  }

  var redPayloadType = getCodecPayloadTypeFromLine(sdpLines[index]);
  sdpLines = removeCodecByPayloadType(sdpLines, redPayloadType);
  sdpLines = removeCodecByName(sdpLines, 'ulpfec'); // Remove fmtp lines associated with red codec.

  index = findLine(sdpLines, 'a=fmtp', redPayloadType.toString());

  if (index === null) {
    return sdp;
  }

  var fmtpLine = parseFmtpLine(sdpLines[index]);
  var rtxPayloadType = fmtpLine.pt;

  if (rtxPayloadType === null) {
    return sdp;
  }

  sdpLines.splice(index, 1);
  sdpLines = removeCodecByPayloadType(sdpLines, rtxPayloadType);
  return sdpLines.join('\r\n');
} // Promotes |audioSendCodec| to be the first in the m=audio line, if set.


function maybePreferAudioSendCodec(sdp, params) {
  return maybePreferCodec(sdp, 'audio', 'send', params.audioSendCodec);
} // Promotes |audioRecvCodec| to be the first in the m=audio line, if set.


function maybePreferAudioReceiveCodec(sdp, params) {
  return maybePreferCodec(sdp, 'audio', 'receive', params.audioRecvCodec);
} // Promotes |videoSendCodec| to be the first in the m=audio line, if set.


function maybePreferVideoSendCodec(sdp, params) {
  return maybePreferCodec(sdp, 'video', 'send', params.videoSendCodec);
} // Promotes |videoRecvCodec| to be the first in the m=audio line, if set.


function maybePreferVideoReceiveCodec(sdp, params) {
  return maybePreferCodec(sdp, 'video', 'receive', params.videoRecvCodec);
} // Sets |codec| as the default |type| codec if it's present.
// The format of |codec| is 'NAME/RATE', e.g. 'opus/48000'.


function maybePreferCodec(sdp, type, dir, codec) {
  var str = type + ' ' + dir + ' codec';

  if (!codec) {
    _logger.default.debug('No preference on ' + str + '.');

    return sdp;
  }

  _logger.default.debug('Prefer ' + str + ': ' + codec);

  var sdpLines = sdp.split('\r\n'); // Search for m line.

  var mLineIndex = findLine(sdpLines, 'm=', type);

  if (mLineIndex === null) {
    return sdp;
  } // If the codec is available, set it as the default in m line.


  var payload = null;

  for (var i = 0; i < sdpLines.length; i++) {
    var index = findLineInRange(sdpLines, i, -1, 'a=rtpmap', codec);

    if (index !== null) {
      payload = getCodecPayloadTypeFromLine(sdpLines[index]);

      if (payload) {
        sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], payload);
      }
    }
  }

  sdp = sdpLines.join('\r\n');
  return sdp;
} // Set fmtp param to specific codec in SDP. If param does not exists, add it.


function setCodecParam(sdp, codec, param, value) {
  var sdpLines = sdp.split('\r\n'); // SDPs sent from MCU use \n as line break.

  if (sdpLines.length <= 1) {
    sdpLines = sdp.split('\n');
  }

  var fmtpLineIndex = findFmtpLine(sdpLines, codec);
  var fmtpObj = {};

  if (fmtpLineIndex === null) {
    var index = findLine(sdpLines, 'a=rtpmap', codec);

    if (index === null) {
      return sdp;
    }

    var payload = getCodecPayloadTypeFromLine(sdpLines[index]);
    fmtpObj.pt = payload.toString();
    fmtpObj.params = {};
    fmtpObj.params[param] = value;
    sdpLines.splice(index + 1, 0, writeFmtpLine(fmtpObj));
  } else {
    fmtpObj = parseFmtpLine(sdpLines[fmtpLineIndex]);
    fmtpObj.params[param] = value;
    sdpLines[fmtpLineIndex] = writeFmtpLine(fmtpObj);
  }

  sdp = sdpLines.join('\r\n');
  return sdp;
} // Remove fmtp param if it exists.


function removeCodecParam(sdp, codec, param) {
  var sdpLines = sdp.split('\r\n');
  var fmtpLineIndex = findFmtpLine(sdpLines, codec);

  if (fmtpLineIndex === null) {
    return sdp;
  }

  var map = parseFmtpLine(sdpLines[fmtpLineIndex]);
  delete map.params[param];
  var newLine = writeFmtpLine(map);

  if (newLine === null) {
    sdpLines.splice(fmtpLineIndex, 1);
  } else {
    sdpLines[fmtpLineIndex] = newLine;
  }

  sdp = sdpLines.join('\r\n');
  return sdp;
} // Split an fmtp line into an object including 'pt' and 'params'.


function parseFmtpLine(fmtpLine) {
  var fmtpObj = {};
  var spacePos = fmtpLine.indexOf(' ');
  var keyValues = fmtpLine.substring(spacePos + 1).split(';');
  var pattern = new RegExp('a=fmtp:(\\d+)');
  var result = fmtpLine.match(pattern);

  if (result && result.length === 2) {
    fmtpObj.pt = result[1];
  } else {
    return null;
  }

  var params = {};

  for (var i = 0; i < keyValues.length; ++i) {
    var pair = keyValues[i].split('=');

    if (pair.length === 2) {
      params[pair[0]] = pair[1];
    }
  }

  fmtpObj.params = params;
  return fmtpObj;
} // Generate an fmtp line from an object including 'pt' and 'params'.


function writeFmtpLine(fmtpObj) {
  if (!fmtpObj.hasOwnProperty('pt') || !fmtpObj.hasOwnProperty('params')) {
    return null;
  }

  var pt = fmtpObj.pt;
  var params = fmtpObj.params;
  var keyValues = [];
  var i = 0;

  for (var key in params) {
    keyValues[i] = key + '=' + params[key];
    ++i;
  }

  if (i === 0) {
    return null;
  }

  return 'a=fmtp:' + pt.toString() + ' ' + keyValues.join(';');
} // Find fmtp attribute for |codec| in |sdpLines|.


function findFmtpLine(sdpLines, codec) {
  // Find payload of codec.
  var payload = getCodecPayloadType(sdpLines, codec); // Find the payload in fmtp line.

  return payload ? findLine(sdpLines, 'a=fmtp:' + payload.toString()) : null;
} // Find the line in sdpLines that starts with |prefix|, and, if specified,
// contains |substr| (case-insensitive search).


function findLine(sdpLines, prefix, substr) {
  return findLineInRange(sdpLines, 0, -1, prefix, substr);
} // Find the line in sdpLines[startLine...endLine - 1] that starts with |prefix|
// and, if specified, contains |substr| (case-insensitive search).


function findLineInRange(sdpLines, startLine, endLine, prefix, substr) {
  var realEndLine = endLine !== -1 ? endLine : sdpLines.length;

  for (var i = startLine; i < realEndLine; ++i) {
    if (sdpLines[i].indexOf(prefix) === 0) {
      if (!substr || sdpLines[i].toLowerCase().indexOf(substr.toLowerCase()) !== -1) {
        return i;
      }
    }
  }

  return null;
} // Gets the codec payload type from sdp lines.


function getCodecPayloadType(sdpLines, codec) {
  var index = findLine(sdpLines, 'a=rtpmap', codec);
  return index ? getCodecPayloadTypeFromLine(sdpLines[index]) : null;
} // Gets the codec payload type from an a=rtpmap:X line.


function getCodecPayloadTypeFromLine(sdpLine) {
  var pattern = new RegExp('a=rtpmap:(\\d+) [a-zA-Z0-9-]+\\/\\d+');
  var result = sdpLine.match(pattern);
  return result && result.length === 2 ? result[1] : null;
} // Returns a new m= line with the specified codec as the first one.


function setDefaultCodec(mLine, payload) {
  var elements = mLine.split(' '); // Just copy the first three parameters; codec order starts on fourth.

  var newLine = elements.slice(0, 3); // Put target payload first and copy in the rest.

  newLine.push(payload);

  for (var i = 3; i < elements.length; i++) {
    if (elements[i] !== payload) {
      newLine.push(elements[i]);
    }
  }

  return newLine.join(' ');
}
/* Below are newly added functions */
// Following codecs will not be removed from SDP event they are not in the
// user-specified codec list.


var audioCodecWhiteList = ['CN', 'telephone-event'];
var videoCodecWhiteList = ['red', 'ulpfec']; // Returns a new m= line with the specified codec order.

function setCodecOrder(mLine, payloads) {
  var elements = mLine.split(' '); // Just copy the first three parameters; codec order starts on fourth.

  var newLine = elements.slice(0, 3); // Concat payload types.

  newLine = newLine.concat(payloads);
  return newLine.join(' ');
} // Append RTX payloads for existing payloads.


function appendRtxPayloads(sdpLines, payloads) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = payloads[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var payload = _step.value;
      var index = findLine(sdpLines, 'a=fmtp', 'apt=' + payload);

      if (index !== null) {
        var fmtpLine = parseFmtpLine(sdpLines[index]);
        payloads.push(fmtpLine.pt);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return payloads;
} // Remove a codec with all its associated a lines.


function removeCodecFramALine(sdpLines, payload) {
  var pattern = new RegExp('a=(rtpmap|rtcp-fb|fmtp):' + payload + '\\s');

  for (var i = sdpLines.length - 1; i > 0; i--) {
    if (sdpLines[i].match(pattern)) {
      sdpLines.splice(i, 1);
    }
  }

  return sdpLines;
} // Reorder codecs in m-line according the order of |codecs|. Remove codecs from
// m-line if it is not present in |codecs|
// The format of |codec| is 'NAME/RATE', e.g. 'opus/48000'.


function reorderCodecs(sdp, type, codecs) {
  if (!codecs || codecs.length === 0) {
    return sdp;
  }

  codecs = type === 'audio' ? codecs.concat(audioCodecWhiteList) : codecs.concat(videoCodecWhiteList);
  var sdpLines = sdp.split('\r\n'); // Search for m line.

  var mLineIndex = findLine(sdpLines, 'm=', type);

  if (mLineIndex === null) {
    return sdp;
  }

  var originPayloads = sdpLines[mLineIndex].split(' ');
  originPayloads.splice(0, 3); // If the codec is available, set it as the default in m line.

  var payloads = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = codecs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var codec = _step2.value;

      for (var i = 0; i < sdpLines.length; i++) {
        var index = findLineInRange(sdpLines, i, -1, 'a=rtpmap', codec);

        if (index !== null) {
          var payload = getCodecPayloadTypeFromLine(sdpLines[index]);

          if (payload) {
            payloads.push(payload);
            i = index;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  payloads = appendRtxPayloads(sdpLines, payloads);
  sdpLines[mLineIndex] = setCodecOrder(sdpLines[mLineIndex], payloads); // Remove a lines.

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = originPayloads[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var _payload = _step3.value;

      if (payloads.indexOf(_payload) === -1) {
        sdpLines = removeCodecFramALine(sdpLines, _payload);
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  sdp = sdpLines.join('\r\n');
  return sdp;
}

function setMaxBitrate(sdp, encodingParametersList) {
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = encodingParametersList[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var encodingParameters = _step4.value;

      if (encodingParameters.maxBitrate) {
        sdp = setCodecParam(sdp, encodingParameters.codec.name, 'x-google-max-bitrate', encodingParameters.maxBitrate.toString());
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  return sdp;
}

},{"./logger.js":5}],10:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StreamEvent = exports.RemoteStream = exports.LocalStream = exports.Stream = exports.StreamSourceInfo = void 0;

var _logger = _interopRequireDefault(require("./logger.js"));

var _event = require("./event.js");

var Utils = _interopRequireWildcard(require("./utils.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// eslint-disable-next-line require-jsdoc
function isAllowedValue(obj, allowedValues) {
  return allowedValues.some(function (ele) {
    return ele === obj;
  });
}
/**
 * @class StreamSourceInfo
 * @memberOf Owt.Base
 * @classDesc Information of a stream's source.
 * @constructor
 * @description Audio source info or video source info could be undefined if a stream does not have audio/video track.
 * @param {?string} audioSourceInfo Audio source info. Accepted values are: "mic", "screen-cast", "file", "mixed" or undefined.
 * @param {?string} videoSourceInfo Video source info. Accepted values are: "camera", "screen-cast", "file", "mixed" or undefined.
 */


var StreamSourceInfo = // eslint-disable-next-line require-jsdoc
function StreamSourceInfo(audioSourceInfo, videoSourceInfo) {
  _classCallCheck(this, StreamSourceInfo);

  if (!isAllowedValue(audioSourceInfo, [undefined, 'mic', 'screen-cast', 'file', 'mixed'])) {
    throw new TypeError('Incorrect value for audioSourceInfo');
  }

  if (!isAllowedValue(videoSourceInfo, [undefined, 'camera', 'screen-cast', 'file', 'encoded-file', 'raw-file', 'mixed'])) {
    throw new TypeError('Incorrect value for videoSourceInfo');
  }

  this.audio = audioSourceInfo;
  this.video = videoSourceInfo;
};
/**
 * @class Stream
 * @memberOf Owt.Base
 * @classDesc Base class of streams.
 * @extends Owt.Base.EventDispatcher
 * @hideconstructor
 */


exports.StreamSourceInfo = StreamSourceInfo;

var Stream =
/*#__PURE__*/
function (_EventDispatcher) {
  _inherits(Stream, _EventDispatcher);

  // eslint-disable-next-line require-jsdoc
  function Stream(stream, sourceInfo, attributes) {
    var _this;

    _classCallCheck(this, Stream);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Stream).call(this));

    if (stream && !(stream instanceof MediaStream) || _typeof(sourceInfo) !== 'object') {
      throw new TypeError('Invalid stream or sourceInfo.');
    }

    if (stream && (stream.getAudioTracks().length > 0 && !sourceInfo.audio || stream.getVideoTracks().length > 0 && !sourceInfo.video)) {
      throw new TypeError('Missing audio source info or video source info.');
    }
    /**
     * @member {?MediaStream} mediaStream
     * @instance
     * @memberof Owt.Base.Stream
     * @see {@link https://www.w3.org/TR/mediacapture-streams/#mediastream|MediaStream API of Media Capture and Streams}.
     */


    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'mediaStream', {
      configurable: false,
      writable: true,
      value: stream
    });
    /**
     * @member {Owt.Base.StreamSourceInfo} source
     * @instance
     * @memberof Owt.Base.Stream
     * @desc Source info of a stream.
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'source', {
      configurable: false,
      writable: false,
      value: sourceInfo
    });
    /**
     * @member {object} attributes
     * @instance
     * @memberof Owt.Base.Stream
     * @desc Custom attributes of a stream.
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'attributes', {
      configurable: true,
      writable: false,
      value: attributes
    });
    return _this;
  }

  return Stream;
}(_event.EventDispatcher);
/**
 * @class LocalStream
 * @classDesc Stream captured from current endpoint.
 * @memberOf Owt.Base
 * @extends Owt.Base.Stream
 * @constructor
 * @param {MediaStream} stream Underlying MediaStream.
 * @param {Owt.Base.StreamSourceInfo} sourceInfo Information about stream's source.
 * @param {object} attributes Custom attributes of the stream.
 */


exports.Stream = Stream;

var LocalStream =
/*#__PURE__*/
function (_Stream) {
  _inherits(LocalStream, _Stream);

  // eslint-disable-next-line require-jsdoc
  function LocalStream(stream, sourceInfo, attributes) {
    var _this2;

    _classCallCheck(this, LocalStream);

    if (!(stream instanceof MediaStream)) {
      throw new TypeError('Invalid stream.');
    }

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(LocalStream).call(this, stream, sourceInfo, attributes));
    /**
     * @member {string} id
     * @instance
     * @memberof Owt.Base.LocalStream
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), 'id', {
      configurable: false,
      writable: false,
      value: Utils.createUuid()
    });
    return _this2;
  }

  return LocalStream;
}(Stream);
/**
 * @class RemoteStream
 * @classDesc Stream sent from a remote endpoint.
 * Events:
 *
 * | Event Name      | Argument Type    | Fired when         |
 * | ----------------| ---------------- | ------------------ |
 * | ended           | Event            | Stream is ended.   |
 * | updated         | Event            | Stream is updated. |
 *
 * @memberOf Owt.Base
 * @extends Owt.Base.Stream
 * @hideconstructor
 */


exports.LocalStream = LocalStream;

var RemoteStream =
/*#__PURE__*/
function (_Stream2) {
  _inherits(RemoteStream, _Stream2);

  // eslint-disable-next-line require-jsdoc
  function RemoteStream(id, origin, stream, sourceInfo, attributes) {
    var _this3;

    _classCallCheck(this, RemoteStream);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(RemoteStream).call(this, stream, sourceInfo, attributes));
    /**
     * @member {string} id
     * @instance
     * @memberof Owt.Base.RemoteStream
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this3)), 'id', {
      configurable: false,
      writable: false,
      value: id ? id : Utils.createUuid()
    });
    /**
     * @member {string} origin
     * @instance
     * @memberof Owt.Base.RemoteStream
     * @desc ID of the remote endpoint who published this stream.
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this3)), 'origin', {
      configurable: false,
      writable: false,
      value: origin
    });
    /**
     * @member {Owt.Base.PublicationSettings} settings
     * @instance
     * @memberof Owt.Base.RemoteStream
     * @desc Original settings for publishing this stream. This property is only valid in conference mode.
     */

    _this3.settings = undefined;
    /**
     * @member {Owt.Conference.SubscriptionCapabilities} capabilities
     * @instance
     * @memberof Owt.Base.RemoteStream
     * @desc Capabilities remote endpoint provides for subscription. This property is only valid in conference mode.
     */

    _this3.capabilities = undefined;
    return _this3;
  }

  return RemoteStream;
}(Stream);
/**
 * @class StreamEvent
 * @classDesc Event for Stream.
 * @extends Owt.Base.OwtEvent
 * @memberof Owt.Base
 * @hideconstructor
 */


exports.RemoteStream = RemoteStream;

var StreamEvent =
/*#__PURE__*/
function (_OwtEvent) {
  _inherits(StreamEvent, _OwtEvent);

  // eslint-disable-next-line require-jsdoc
  function StreamEvent(type, init) {
    var _this4;

    _classCallCheck(this, StreamEvent);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(StreamEvent).call(this, type));
    /**
     * @member {Owt.Base.Stream} stream
     * @instance
     * @memberof Owt.Base.StreamEvent
     */

    _this4.stream = init.stream;
    return _this4;
  }

  return StreamEvent;
}(_event.OwtEvent);

exports.StreamEvent = StreamEvent;

},{"./event.js":3,"./logger.js":5,"./utils.js":11}],11:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0

/* global navigator, window */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFirefox = isFirefox;
exports.isChrome = isChrome;
exports.isSafari = isSafari;
exports.isEdge = isEdge;
exports.createUuid = createUuid;
exports.sysInfo = sysInfo;
var sdkVersion = '4.2.1'; // eslint-disable-next-line require-jsdoc

function isFirefox() {
  return window.navigator.userAgent.match('Firefox') !== null;
} // eslint-disable-next-line require-jsdoc


function isChrome() {
  return window.navigator.userAgent.match('Chrome') !== null;
} // eslint-disable-next-line require-jsdoc


function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
} // eslint-disable-next-line require-jsdoc


function isEdge() {
  return window.navigator.userAgent.match(/Edge\/(\d+).(\d+)$/) !== null;
} // eslint-disable-next-line require-jsdoc


function createUuid() {
  return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
} // Returns system information.
// Format: {sdk:{version:**, type:**}, runtime:{version:**, name:**}, os:{version:**, name:**}};
// eslint-disable-next-line require-jsdoc


function sysInfo() {
  var info = Object.create({});
  info.sdk = {
    version: sdkVersion,
    type: 'JavaScript'
  }; // Runtime info.

  var userAgent = navigator.userAgent;
  var firefoxRegex = /Firefox\/([0-9\.]+)/;
  var chromeRegex = /Chrome\/([0-9\.]+)/;
  var edgeRegex = /Edge\/([0-9\.]+)/;
  var safariVersionRegex = /Version\/([0-9\.]+) Safari/;
  var result = chromeRegex.exec(userAgent);

  if (result) {
    info.runtime = {
      name: 'Chrome',
      version: result[1]
    };
  } else if (result = firefoxRegex.exec(userAgent)) {
    info.runtime = {
      name: 'Firefox',
      version: result[1]
    };
  } else if (result = edgeRegex.exec(userAgent)) {
    info.runtime = {
      name: 'Edge',
      version: result[1]
    };
  } else if (isSafari()) {
    result = safariVersionRegex.exec(userAgent);
    info.runtime = {
      name: 'Safari'
    };
    info.runtime.version = result ? result[1] : 'Unknown';
  } else {
    info.runtime = {
      name: 'Unknown',
      version: 'Unknown'
    };
  } // OS info.


  var windowsRegex = /Windows NT ([0-9\.]+)/;
  var macRegex = /Intel Mac OS X ([0-9_\.]+)/;
  var iPhoneRegex = /iPhone OS ([0-9_\.]+)/;
  var linuxRegex = /X11; Linux/;
  var androidRegex = /Android( ([0-9\.]+))?/;
  var chromiumOsRegex = /CrOS/;

  if (result = windowsRegex.exec(userAgent)) {
    info.os = {
      name: 'Windows NT',
      version: result[1]
    };
  } else if (result = macRegex.exec(userAgent)) {
    info.os = {
      name: 'Mac OS X',
      version: result[1].replace(/_/g, '.')
    };
  } else if (result = iPhoneRegex.exec(userAgent)) {
    info.os = {
      name: 'iPhone OS',
      version: result[1].replace(/_/g, '.')
    };
  } else if (result = linuxRegex.exec(userAgent)) {
    info.os = {
      name: 'Linux',
      version: 'Unknown'
    };
  } else if (result = androidRegex.exec(userAgent)) {
    info.os = {
      name: 'Android',
      version: result[1] || 'Unknown'
    };
  } else if (result = chromiumOsRegex.exec(userAgent)) {
    info.os = {
      name: 'Chrome OS',
      version: 'Unknown'
    };
  } else {
    info.os = {
      name: 'Unknown',
      version: 'Unknown'
    };
  }

  info.capabilities = {
    continualIceGathering: false,
    unifiedPlan: true,
    streamRemovable: info.runtime.name !== 'Firefox'
  };
  return info;
}

},{}],12:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable require-jsdoc */

/* global Promise */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConferencePeerConnectionChannel = void 0;

var _logger = _interopRequireDefault(require("../base/logger.js"));

var _event = require("../base/event.js");

var _mediaformat = require("../base/mediaformat.js");

var _publication = require("../base/publication.js");

var _subscription = require("./subscription.js");

var _error2 = require("./error.js");

var Utils = _interopRequireWildcard(require("../base/utils.js"));

var SdpUtils = _interopRequireWildcard(require("../base/sdputils.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class ConferencePeerConnectionChannel
 * @classDesc A channel for a connection between client and conference server. Currently, only one stream could be tranmitted in a channel.
 * @hideconstructor
 * @private
 */
var ConferencePeerConnectionChannel =
/*#__PURE__*/
function (_EventDispatcher) {
  _inherits(ConferencePeerConnectionChannel, _EventDispatcher);

  // eslint-disable-next-line require-jsdoc
  function ConferencePeerConnectionChannel(config, signaling) {
    var _this;

    _classCallCheck(this, ConferencePeerConnectionChannel);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ConferencePeerConnectionChannel).call(this));
    _this._config = config;
    _this._options = null;
    _this._signaling = signaling;
    _this._pc = null;
    _this._internalId = null; // It's publication ID or subscription ID.

    _this._pendingCandidates = [];
    _this._subscribePromise = null;
    _this._publishPromise = null;
    _this._subscribedStream = null;
    _this._publishedStream = null;
    _this._publication = null;
    _this._subscription = null; // Timer for PeerConnection disconnected. Will stop connection after timer.

    _this._disconnectTimer = null;
    _this._ended = false;
    return _this;
  }
  /**
   * @function onMessage
   * @desc Received a message from conference portal. Defined in client-server protocol.
   * @param {string} notification Notification type.
   * @param {object} message Message received.
   * @private
   */


  _createClass(ConferencePeerConnectionChannel, [{
    key: "onMessage",
    value: function onMessage(notification, message) {
      switch (notification) {
        case 'progress':
          if (message.status === 'soac') {
            this._sdpHandler(message.data);
          } else if (message.status === 'ready') {
            this._readyHandler();
          } else if (message.status === 'error') {
            this._errorHandler(message.data);
          }

          break;

        case 'stream':
          this._onStreamEvent(message);

          break;

        default:
          _logger.default.warning('Unknown notification from MCU.');

      }
    }
  }, {
    key: "publish",
    value: function publish(stream, options) {
      var _this2 = this;

      if (options === undefined) {
        options = {
          audio: !!stream.mediaStream.getAudioTracks(),
          video: !!stream.mediaStream.getVideoTracks()
        };
      }

      if (_typeof(options) !== 'object') {
        return Promise.reject(new TypeError('Options should be an object.'));
      }

      if (options.audio === undefined) {
        options.audio = !!stream.mediaStream.getAudioTracks();
      }

      if (options.video === undefined) {
        options.video = !!stream.mediaStream.getVideoTracks();
      }

      if (!!options.audio === !stream.mediaStream.getAudioTracks().length || !!options.video === !stream.mediaStream.getVideoTracks().length) {
        return Promise.reject(new _error2.ConferenceError('options.audio/video is inconsistent with tracks presented in the ' + 'MediaStream.'));
      }

      if ((options.audio === false || options.audio === null) && (options.video === false || options.video === null)) {
        return Promise.reject(new _error2.ConferenceError('Cannot publish a stream without audio and video.'));
      }

      if (_typeof(options.audio) === 'object') {
        if (!Array.isArray(options.audio)) {
          return Promise.reject(new TypeError('options.audio should be a boolean or an array.'));
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = options.audio[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var parameters = _step.value;

            if (!parameters.codec || typeof parameters.codec.name !== 'string' || parameters.maxBitrate !== undefined && typeof parameters.maxBitrate !== 'number') {
              return Promise.reject(new TypeError('options.audio has incorrect parameters.'));
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      if (_typeof(options.video) === 'object') {
        if (!Array.isArray(options.video)) {
          return Promise.reject(new TypeError('options.video should be a boolean or an array.'));
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = options.video[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _parameters = _step2.value;

            if (!_parameters.codec || typeof _parameters.codec.name !== 'string' || _parameters.maxBitrate !== undefined && typeof _parameters.maxBitrate !== 'number' || _parameters.codec.profile !== undefined && typeof _parameters.codec.profile !== 'string') {
              return Promise.reject(new TypeError('options.video has incorrect parameters.'));
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      this._options = options;
      var mediaOptions = {};

      this._createPeerConnection();

      if (stream.mediaStream.getAudioTracks().length > 0 && options.audio !== false && options.audio !== null) {
        if (stream.mediaStream.getAudioTracks().length > 1) {
          _logger.default.warning('Publishing a stream with multiple audio tracks is not fully' + ' supported.');
        }

        if (typeof options.audio !== 'boolean' && _typeof(options.audio) !== 'object') {
          return Promise.reject(new _error2.ConferenceError('Type of audio options should be boolean or an object.'));
        }

        mediaOptions.audio = {};
        mediaOptions.audio.source = stream.source.audio;
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = stream.mediaStream.getAudioTracks()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var track = _step3.value;

            this._pc.addTrack(track, stream.mediaStream);
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      } else {
        mediaOptions.audio = false;
      }

      if (stream.mediaStream.getVideoTracks().length > 0 && options.video !== false && options.video !== null) {
        if (stream.mediaStream.getVideoTracks().length > 1) {
          _logger.default.warning('Publishing a stream with multiple video tracks is not fully ' + 'supported.');
        }

        mediaOptions.video = {};
        mediaOptions.video.source = stream.source.video;
        var trackSettings = stream.mediaStream.getVideoTracks()[0].getSettings();
        mediaOptions.video.parameters = {
          resolution: {
            width: trackSettings.width,
            height: trackSettings.height
          },
          framerate: trackSettings.frameRate
        };
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = stream.mediaStream.getVideoTracks()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _track = _step4.value;

            this._pc.addTrack(_track, stream.mediaStream);
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      } else {
        mediaOptions.video = false;
      }

      this._publishedStream = stream;

      this._signaling.sendSignalingMessage('publish', {
        media: mediaOptions,
        attributes: stream.attributes
      }).then(function (data) {
        var messageEvent = new _event.MessageEvent('id', {
          message: data.id,
          origin: _this2._remoteId
        });

        _this2.dispatchEvent(messageEvent);

        _this2._internalId = data.id;
        var offerOptions = {
          offerToReceiveAudio: false,
          offerToReceiveVideo: false
        };

        if (typeof _this2._pc.addTransceiver === 'function') {
          // |direction| seems not working on Safari.
          if (mediaOptions.audio && stream.mediaStream.getAudioTracks() > 0) {
            _this2._pc.addTransceiver('audio', {
              direction: 'sendonly'
            });
          }

          if (mediaOptions.video && stream.mediaStream.getVideoTracks() > 0) {
            _this2._pc.addTransceiver('video', {
              direction: 'sendonly'
            });
          }
        }

        var localDesc;

        _this2._pc.createOffer(offerOptions).then(function (desc) {
          if (options) {
            desc.sdp = _this2._setRtpReceiverOptions(desc.sdp, options);
          }

          return desc;
        }).then(function (desc) {
          localDesc = desc;
          return _this2._pc.setLocalDescription(desc);
        }).then(function () {
          _this2._signaling.sendSignalingMessage('soac', {
            id: _this2._internalId,
            signaling: localDesc
          });
        }).catch(function (e) {
          _logger.default.error('Failed to create offer or set SDP. Message: ' + e.message);

          _this2._unpublish();

          _this2._rejectPromise(e);

          _this2._fireEndedEventOnPublicationOrSubscription();
        });
      }).catch(function (e) {
        _this2._unpublish();

        _this2._rejectPromise(e);

        _this2._fireEndedEventOnPublicationOrSubscription();
      });

      return new Promise(function (resolve, reject) {
        _this2._publishPromise = {
          resolve: resolve,
          reject: reject
        };
      });
    }
  }, {
    key: "subscribe",
    value: function subscribe(stream, options) {
      var _this3 = this;

      if (options === undefined) {
        options = {
          audio: !!stream.capabilities.audio,
          video: !!stream.capabilities.video
        };
      }

      if (_typeof(options) !== 'object') {
        return Promise.reject(new TypeError('Options should be an object.'));
      }

      if (options.audio === undefined) {
        options.audio = !!stream.capabilities.audio;
      }

      if (options.video === undefined) {
        options.video = !!stream.capabilities.video;
      }

      if (options.audio !== undefined && _typeof(options.audio) !== 'object' && typeof options.audio !== 'boolean' && options.audio !== null || options.video !== undefined && _typeof(options.video) !== 'object' && typeof options.video !== 'boolean' && options.video !== null) {
        return Promise.reject(new TypeError('Invalid options type.'));
      }

      if (options.audio && !stream.capabilities.audio || options.video && !stream.capabilities.video) {
        return Promise.reject(new _error2.ConferenceError('options.audio/video cannot be true or an object if there is no ' + 'audio/video track in remote stream.'));
      }

      if (options.audio === false && options.video === false) {
        return Promise.reject(new _error2.ConferenceError('Cannot subscribe a stream without audio and video.'));
      }

      this._options = options;
      var mediaOptions = {};

      if (options.audio) {
        if (_typeof(options.audio) === 'object' && Array.isArray(options.audio.codecs)) {
          if (options.audio.codecs.length === 0) {
            return Promise.reject(new TypeError('Audio codec cannot be an empty array.'));
          }
        }

        mediaOptions.audio = {};
        mediaOptions.audio.from = stream.id;
      } else {
        mediaOptions.audio = false;
      }

      if (options.video) {
        if (_typeof(options.video) === 'object' && Array.isArray(options.video.codecs)) {
          if (options.video.codecs.length === 0) {
            return Promise.reject(new TypeError('Video codec cannot be an empty array.'));
          }
        }

        mediaOptions.video = {};
        mediaOptions.video.from = stream.id;

        if (options.video.resolution || options.video.frameRate || options.video.bitrateMultiplier && options.video.bitrateMultiplier !== 1 || options.video.keyFrameInterval) {
          mediaOptions.video.parameters = {
            resolution: options.video.resolution,
            framerate: options.video.frameRate,
            bitrate: options.video.bitrateMultiplier ? 'x' + options.video.bitrateMultiplier.toString() : undefined,
            keyFrameInterval: options.video.keyFrameInterval
          };
        }
      } else {
        mediaOptions.video = false;
      }

      this._subscribedStream = stream;

      this._signaling.sendSignalingMessage('subscribe', {
        media: mediaOptions
      }).then(function (data) {
        var messageEvent = new _event.MessageEvent('id', {
          message: data.id,
          origin: _this3._remoteId
        });

        _this3.dispatchEvent(messageEvent);

        _this3._internalId = data.id;

        _this3._createPeerConnection();

        var offerOptions = {
          offerToReceiveAudio: !!options.audio,
          offerToReceiveVideo: !!options.video
        };

        if (typeof _this3._pc.addTransceiver === 'function') {
          // |direction| seems not working on Safari.
          if (mediaOptions.audio) {
            _this3._pc.addTransceiver('audio', {
              direction: 'recvonly'
            });
          }

          if (mediaOptions.video) {
            _this3._pc.addTransceiver('video', {
              direction: 'recvonly'
            });
          }
        }

        _this3._pc.createOffer(offerOptions).then(function (desc) {
          if (options) {
            desc.sdp = _this3._setRtpReceiverOptions(desc.sdp, options);
          }

          _this3._pc.setLocalDescription(desc).then(function () {
            _this3._signaling.sendSignalingMessage('soac', {
              id: _this3._internalId,
              signaling: desc
            });
          }, function (errorMessage) {
            _logger.default.error('Set local description failed. Message: ' + JSON.stringify(errorMessage));
          });
        }, function (error) {
          _logger.default.error('Create offer failed. Error info: ' + JSON.stringify(error));
        }).catch(function (e) {
          _logger.default.error('Failed to create offer or set SDP. Message: ' + e.message);

          _this3._unsubscribe();

          _this3._rejectPromise(e);

          _this3._fireEndedEventOnPublicationOrSubscription();
        });
      }).catch(function (e) {
        _this3._unsubscribe();

        _this3._rejectPromise(e);

        _this3._fireEndedEventOnPublicationOrSubscription();
      });

      return new Promise(function (resolve, reject) {
        _this3._subscribePromise = {
          resolve: resolve,
          reject: reject
        };
      });
    }
  }, {
    key: "_unpublish",
    value: function _unpublish() {
      this._signaling.sendSignalingMessage('unpublish', {
        id: this._internalId
      }).catch(function (e) {
        _logger.default.warning('MCU returns negative ack for unpublishing, ' + e);
      });

      if (this._pc && this._pc.signalingState !== 'closed') {
        this._pc.close();
      }
    }
  }, {
    key: "_unsubscribe",
    value: function _unsubscribe() {
      this._signaling.sendSignalingMessage('unsubscribe', {
        id: this._internalId
      }).catch(function (e) {
        _logger.default.warning('MCU returns negative ack for unsubscribing, ' + e);
      });

      if (this._pc && this._pc.signalingState !== 'closed') {
        this._pc.close();
      }
    }
  }, {
    key: "_muteOrUnmute",
    value: function _muteOrUnmute(isMute, isPub, trackKind) {
      var _this4 = this;

      var eventName = isPub ? 'stream-control' : 'subscription-control';
      var operation = isMute ? 'pause' : 'play';
      return this._signaling.sendSignalingMessage(eventName, {
        id: this._internalId,
        operation: operation,
        data: trackKind
      }).then(function () {
        if (!isPub) {
          var muteEventName = isMute ? 'mute' : 'unmute';

          _this4._subscription.dispatchEvent(new _event.MuteEvent(muteEventName, {
            kind: trackKind
          }));
        }
      });
    }
  }, {
    key: "_applyOptions",
    value: function _applyOptions(options) {
      if (_typeof(options) !== 'object' || _typeof(options.video) !== 'object') {
        return Promise.reject(new _error2.ConferenceError('Options should be an object.'));
      }

      var videoOptions = {};
      videoOptions.resolution = options.video.resolution;
      videoOptions.framerate = options.video.frameRate;
      videoOptions.bitrate = options.video.bitrateMultiplier ? 'x' + options.video.bitrateMultiplier.toString() : undefined;
      videoOptions.keyFrameInterval = options.video.keyFrameInterval;
      return this._signaling.sendSignalingMessage('subscription-control', {
        id: this._internalId,
        operation: 'update',
        data: {
          video: {
            parameters: videoOptions
          }
        }
      }).then();
    }
  }, {
    key: "_onRemoteStreamAdded",
    value: function _onRemoteStreamAdded(event) {
      _logger.default.debug('Remote stream added.');

      if (this._subscribedStream) {
        this._subscribedStream.mediaStream = event.streams[0];
      } else {
        // This is not expected path. However, this is going to happen on Safari
        // because it does not support setting direction of transceiver.
        _logger.default.warning('Received remote stream without subscription.');
      }
    }
  }, {
    key: "_onLocalIceCandidate",
    value: function _onLocalIceCandidate(event) {
      if (event.candidate) {
        if (this._pc.signalingState !== 'stable') {
          this._pendingCandidates.push(event.candidate);
        } else {
          this._sendCandidate(event.candidate);
        }
      } else {
        _logger.default.debug('Empty candidate.');
      }
    }
  }, {
    key: "_fireEndedEventOnPublicationOrSubscription",
    value: function _fireEndedEventOnPublicationOrSubscription() {
      if (this._ended) {
        return;
      }

      this._ended = true;
      var event = new _event.OwtEvent('ended');

      if (this._publication) {
        this._publication.dispatchEvent(event);

        this._publication.stop();
      } else if (this._subscription) {
        this._subscription.dispatchEvent(event);

        this._subscription.stop();
      }
    }
  }, {
    key: "_rejectPromise",
    value: function _rejectPromise(error) {
      if (!error) {
        var _error = new _error2.ConferenceError('Connection failed or closed.');
      } // Rejecting corresponding promise if publishing and subscribing is ongoing.


      if (this._publishPromise) {
        this._publishPromise.reject(error);

        this._publishPromise = undefined;
      } else if (this._subscribePromise) {
        this._subscribePromise.reject(error);

        this._subscribePromise = undefined;
      }
    }
  }, {
    key: "_onIceConnectionStateChange",
    value: function _onIceConnectionStateChange(event) {
      if (!event || !event.currentTarget) {
        return;
      }

      _logger.default.debug('ICE connection state changed to ' + event.currentTarget.iceConnectionState);

      if (event.currentTarget.iceConnectionState === 'closed' || event.currentTarget.iceConnectionState === 'failed') {
        if (event.currentTarget.iceConnectionState === 'failed') {
          this._handleError('ICE connection failed.');
        } // Fire ended event if publication or subscription exists.


        this._fireEndedEventOnPublicationOrSubscription();
      }
    }
  }, {
    key: "_sendCandidate",
    value: function _sendCandidate(candidate) {
      this._signaling.sendSignalingMessage('soac', {
        id: this._internalId,
        signaling: {
          type: 'candidate',
          candidate: {
            candidate: 'a=' + candidate.candidate,
            sdpMid: candidate.sdpMid,
            sdpMLineIndex: candidate.sdpMLineIndex
          }
        }
      });
    }
  }, {
    key: "_createPeerConnection",
    value: function _createPeerConnection() {
      var _this5 = this;

      var pcConfiguration = this._config.rtcConfiguration || {};

      if (Utils.isChrome()) {
        pcConfiguration.sdpSemantics = 'unified-plan';
      }

      this._pc = new RTCPeerConnection(pcConfiguration);

      this._pc.onicecandidate = function (event) {
        _this5._onLocalIceCandidate.apply(_this5, [event]);
      };

      this._pc.ontrack = function (event) {
        _this5._onRemoteStreamAdded.apply(_this5, [event]);
      };

      this._pc.oniceconnectionstatechange = function (event) {
        _this5._onIceConnectionStateChange.apply(_this5, [event]);
      };
    }
  }, {
    key: "_getStats",
    value: function _getStats() {
      if (this._pc) {
        return this._pc.getStats();
      } else {
        return Promise.reject(new _error2.ConferenceError('PeerConnection is not available.'));
      }
    }
  }, {
    key: "_readyHandler",
    value: function _readyHandler() {
      var _this6 = this;

      if (this._subscribePromise) {
        this._subscription = new _subscription.Subscription(this._internalId, function () {
          _this6._unsubscribe();
        }, function () {
          return _this6._getStats();
        }, function (trackKind) {
          return _this6._muteOrUnmute(true, false, trackKind);
        }, function (trackKind) {
          return _this6._muteOrUnmute(false, false, trackKind);
        }, function (options) {
          return _this6._applyOptions(options);
        }); // Fire subscription's ended event when associated stream is ended.

        this._subscribedStream.addEventListener('ended', function () {
          _this6._subscription.dispatchEvent('ended', new _event.OwtEvent('ended'));
        });

        this._subscribePromise.resolve(this._subscription);
      } else if (this._publishPromise) {
        this._publication = new _publication.Publication(this._internalId, function () {
          _this6._unpublish();

          return Promise.resolve();
        }, function () {
          return _this6._getStats();
        }, function (trackKind) {
          return _this6._muteOrUnmute(true, true, trackKind);
        }, function (trackKind) {
          return _this6._muteOrUnmute(false, true, trackKind);
        });

        this._publishPromise.resolve(this._publication); // Do not fire publication's ended event when associated stream is ended.
        // It may still sending silence or black frames.
        // Refer to https://w3c.github.io/webrtc-pc/#rtcrtpsender-interface.

      }

      this._publishPromise = null;
      this._subscribePromise = null;
    }
  }, {
    key: "_sdpHandler",
    value: function _sdpHandler(sdp) {
      var _this7 = this;

      if (sdp.type === 'answer') {
        if ((this._publication || this._publishPromise) && this._options) {
          sdp.sdp = this._setRtpSenderOptions(sdp.sdp, this._options);
        }

        this._pc.setRemoteDescription(sdp).then(function () {
          if (_this7._pendingCandidates.length > 0) {
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
              for (var _iterator5 = _this7._pendingCandidates[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var candidate = _step5.value;

                _this7._sendCandidate(candidate);
              }
            } catch (err) {
              _didIteratorError5 = true;
              _iteratorError5 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                  _iterator5.return();
                }
              } finally {
                if (_didIteratorError5) {
                  throw _iteratorError5;
                }
              }
            }
          }
        }, function (error) {
          _logger.default.error('Set remote description failed: ' + error);

          _this7._rejectPromise(error);

          _this7._fireEndedEventOnPublicationOrSubscription();
        });
      }
    }
  }, {
    key: "_errorHandler",
    value: function _errorHandler(errorMessage) {
      return this._handleError(errorMessage);
    }
  }, {
    key: "_handleError",
    value: function _handleError(errorMessage) {
      var error = new _error2.ConferenceError(errorMessage);
      var p = this._publishPromise || this._subscribePromise;

      if (p) {
        return this._rejectPromise(error);
      }

      if (this._ended) {
        return;
      }

      var dispatcher = this._publication || this._subscription;

      if (!dispatcher) {
        _logger.default.warning('Neither publication nor subscription is available.');

        return;
      }

      var errorEvent = new _event.ErrorEvent('error', {
        error: error
      });
      dispatcher.dispatchEvent(errorEvent);
    }
  }, {
    key: "_setCodecOrder",
    value: function _setCodecOrder(sdp, options) {
      if (this._publication || this._publishPromise) {
        if (options.audio) {
          var audioCodecNames = Array.from(options.audio, function (encodingParameters) {
            return encodingParameters.codec.name;
          });
          sdp = SdpUtils.reorderCodecs(sdp, 'audio', audioCodecNames);
        }

        if (options.video) {
          var videoCodecNames = Array.from(options.video, function (encodingParameters) {
            return encodingParameters.codec.name;
          });
          sdp = SdpUtils.reorderCodecs(sdp, 'video', videoCodecNames);
        }
      } else {
        if (options.audio && options.audio.codecs) {
          var _audioCodecNames = Array.from(options.audio.codecs, function (codec) {
            return codec.name;
          });

          sdp = SdpUtils.reorderCodecs(sdp, 'audio', _audioCodecNames);
        }

        if (options.video && options.video.codecs) {
          var _videoCodecNames = Array.from(options.video.codecs, function (codec) {
            return codec.name;
          });

          sdp = SdpUtils.reorderCodecs(sdp, 'video', _videoCodecNames);
        }
      }

      return sdp;
    }
  }, {
    key: "_setMaxBitrate",
    value: function _setMaxBitrate(sdp, options) {
      if (_typeof(options.audio) === 'object') {
        sdp = SdpUtils.setMaxBitrate(sdp, options.audio);
      }

      if (_typeof(options.video) === 'object') {
        sdp = SdpUtils.setMaxBitrate(sdp, options.video);
      }

      return sdp;
    }
  }, {
    key: "_setRtpSenderOptions",
    value: function _setRtpSenderOptions(sdp, options) {
      sdp = this._setMaxBitrate(sdp, options);
      return sdp;
    }
  }, {
    key: "_setRtpReceiverOptions",
    value: function _setRtpReceiverOptions(sdp, options) {
      sdp = this._setCodecOrder(sdp, options);
      return sdp;
    } // Handle stream event sent from MCU. Some stream events should be publication
    // event or subscription event. It will be handled here.

  }, {
    key: "_onStreamEvent",
    value: function _onStreamEvent(message) {
      var eventTarget;

      if (this._publication && message.id === this._publication.id) {
        eventTarget = this._publication;
      } else if (this._subscribedStream && message.id === this._subscribedStream.id) {
        eventTarget = this._subscription;
      }

      if (!eventTarget) {
        return;
      }

      var trackKind;

      if (message.data.field === 'audio.status') {
        trackKind = _mediaformat.TrackKind.AUDIO;
      } else if (message.data.field === 'video.status') {
        trackKind = _mediaformat.TrackKind.VIDEO;
      } else {
        _logger.default.warning('Invalid data field for stream update info.');
      }

      if (message.data.value === 'active') {
        eventTarget.dispatchEvent(new _event.MuteEvent('unmute', {
          kind: trackKind
        }));
      } else if (message.data.value === 'inactive') {
        eventTarget.dispatchEvent(new _event.MuteEvent('mute', {
          kind: trackKind
        }));
      } else {
        _logger.default.warning('Invalid data value for stream update info.');
      }
    }
  }]);

  return ConferencePeerConnectionChannel;
}(_event.EventDispatcher);

exports.ConferencePeerConnectionChannel = ConferencePeerConnectionChannel;

},{"../base/event.js":3,"../base/logger.js":5,"../base/mediaformat.js":6,"../base/publication.js":8,"../base/sdputils.js":9,"../base/utils.js":11,"./error.js":14,"./subscription.js":21}],13:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0

/* global Map, Promise */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConferenceClient = void 0;

var EventModule = _interopRequireWildcard(require("../base/event.js"));

var _signaling = require("./signaling.js");

var _logger = _interopRequireDefault(require("../base/logger.js"));

var _base = require("../base/base64.js");

var _error = require("./error.js");

var Utils = _interopRequireWildcard(require("../base/utils.js"));

var StreamModule = _interopRequireWildcard(require("../base/stream.js"));

var _participant2 = require("./participant.js");

var _info = require("./info.js");

var _channel = require("./channel.js");

var _mixedstream = require("./mixedstream.js");

var StreamUtilsModule = _interopRequireWildcard(require("./streamutils.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SignalingState = {
  READY: 1,
  CONNECTING: 2,
  CONNECTED: 3
};
var protocolVersion = '1.0';
/* eslint-disable valid-jsdoc */

/**
 * @class ParticipantEvent
 * @classDesc Class ParticipantEvent represents a participant event.
   @extends Owt.Base.OwtEvent
 * @memberof Owt.Conference
 * @hideconstructor
 */

var ParticipantEvent = function ParticipantEvent(type, init) {
  var that = new EventModule.OwtEvent(type, init);
  /**
   * @member {Owt.Conference.Participant} participant
   * @instance
   * @memberof Owt.Conference.ParticipantEvent
   */

  that.participant = init.participant;
  return that;
};
/* eslint-enable valid-jsdoc */

/**
 * @class ConferenceClientConfiguration
 * @classDesc Configuration for ConferenceClient.
 * @memberOf Owt.Conference
 * @hideconstructor
 */


var ConferenceClientConfiguration = // eslint-disable-line no-unused-vars
// eslint-disable-next-line require-jsdoc
function ConferenceClientConfiguration() {
  _classCallCheck(this, ConferenceClientConfiguration);

  /**
   * @member {?RTCConfiguration} rtcConfiguration
   * @instance
   * @memberof Owt.Conference.ConferenceClientConfiguration
   * @desc It will be used for creating PeerConnection.
   * @see {@link https://www.w3.org/TR/webrtc/#rtcconfiguration-dictionary|RTCConfiguration Dictionary of WebRTC 1.0}.
   * @example
   * // Following object can be set to conferenceClientConfiguration.rtcConfiguration.
   * {
   *   iceServers: [{
   *      urls: "stun:example.com:3478"
   *   }, {
   *     urls: [
   *       "turn:example.com:3478?transport=udp",
   *       "turn:example.com:3478?transport=tcp"
   *     ],
   *      credential: "password",
   *      username: "username"
   *   }
   * }
   */
  this.rtcConfiguration = undefined;
};
/**
 * @class ConferenceClient
 * @classdesc The ConferenceClient handles PeerConnections between client and server. For conference controlling, please refer to REST API guide.
 * Events:
 *
 * | Event Name            | Argument Type                    | Fired when       |
 * | --------------------- | ---------------------------------| ---------------- |
 * | streamadded           | Owt.Base.StreamEvent             | A new stream is available in the conference. |
 * | participantjoined     | Owt.Conference.ParticipantEvent  | A new participant joined the conference. |
 * | messagereceived       | Owt.Base.MessageEvent            | A new message is received. |
 * | serverdisconnected    | Owt.Base.OwtEvent                | Disconnected from conference server. |
 *
 * @memberof Owt.Conference
 * @extends Owt.Base.EventDispatcher
 * @constructor
 * @param {?Owt.Conference.ConferenceClientConfiguration } config Configuration for ConferenceClient.
 * @param {?Owt.Conference.SioSignaling } signalingImpl Signaling channel implementation for ConferenceClient. SDK uses default signaling channel implementation if this parameter is undefined. Currently, a Socket.IO signaling channel implementation was provided as ics.conference.SioSignaling. However, it is not recommended to directly access signaling channel or customize signaling channel for ConferenceClient as this time.
 */


var ConferenceClient = function ConferenceClient(config, signalingImpl) {
  Object.setPrototypeOf(this, new EventModule.EventDispatcher());
  config = config || {};
  var self = this;
  var signalingState = SignalingState.READY;
  var signaling = signalingImpl ? signalingImpl : new _signaling.SioSignaling();
  var me;
  var room;
  var remoteStreams = new Map(); // Key is stream ID, value is a RemoteStream.

  var participants = new Map(); // Key is participant ID, value is a Participant object.

  var publishChannels = new Map(); // Key is MediaStream's ID, value is pc channel.

  var channels = new Map(); // Key is channel's internal ID, value is channel.

  /**
   * @function onSignalingMessage
   * @desc Received a message from conference portal. Defined in client-server protocol.
   * @param {string} notification Notification type.
   * @param {object} data Data received.
   * @private
   */

  function onSignalingMessage(notification, data) {
    if (notification === 'soac' || notification === 'progress') {
      if (!channels.has(data.id)) {
        _logger.default.warning('Cannot find a channel for incoming data.');

        return;
      }

      channels.get(data.id).onMessage(notification, data);
    } else if (notification === 'stream') {
      if (data.status === 'add') {
        fireStreamAdded(data.data);
      } else if (data.status === 'remove') {
        fireStreamRemoved(data);
      } else if (data.status === 'update') {
        // Broadcast audio/video update status to channel so specific events can be fired on publication or subscription.
        if (data.data.field === 'audio.status' || data.data.field === 'video.status') {
          channels.forEach(function (c) {
            c.onMessage(notification, data);
          });
        } else if (data.data.field === 'activeInput') {
          fireActiveAudioInputChange(data);
        } else if (data.data.field === 'video.layout') {
          fireLayoutChange(data);
        } else if (data.data.field === '.') {
          updateRemoteStream(data.data.value);
        } else {
          _logger.default.warning('Unknown stream event from MCU.');
        }
      }
    } else if (notification === 'text') {
      fireMessageReceived(data);
    } else if (notification === 'participant') {
      fireParticipantEvent(data);
    }
  }

  signaling.addEventListener('data', function (event) {
    onSignalingMessage(event.message.notification, event.message.data);
  });
  signaling.addEventListener('disconnect', function () {
    clean();
    signalingState = SignalingState.READY;
    self.dispatchEvent(new EventModule.OwtEvent('serverdisconnected'));
  }); // eslint-disable-next-line require-jsdoc

  function fireParticipantEvent(data) {
    if (data.action === 'join') {
      data = data.data;
      var participant = new _participant2.Participant(data.id, data.role, data.user);
      participants.set(data.id, participant);
      var event = new ParticipantEvent('participantjoined', {
        participant: participant
      });
      self.dispatchEvent(event);
    } else if (data.action === 'leave') {
      var participantId = data.data;

      if (!participants.has(participantId)) {
        _logger.default.warning('Received leave message from MCU for an unknown participant.');

        return;
      }

      var _participant = participants.get(participantId);

      participants.delete(participantId);

      _participant.dispatchEvent(new EventModule.OwtEvent('left'));
    }
  } // eslint-disable-next-line require-jsdoc


  function fireMessageReceived(data) {
    var messageEvent = new EventModule.MessageEvent('messagereceived', {
      message: data.message,
      origin: data.from,
      to: data.to
    });
    self.dispatchEvent(messageEvent);
  } // eslint-disable-next-line require-jsdoc


  function fireStreamAdded(info) {
    var stream = createRemoteStream(info);
    remoteStreams.set(stream.id, stream);
    var streamEvent = new StreamModule.StreamEvent('streamadded', {
      stream: stream
    });
    self.dispatchEvent(streamEvent);
  } // eslint-disable-next-line require-jsdoc


  function fireStreamRemoved(info) {
    if (!remoteStreams.has(info.id)) {
      _logger.default.warning('Cannot find specific remote stream.');

      return;
    }

    var stream = remoteStreams.get(info.id);
    var streamEvent = new EventModule.OwtEvent('ended');
    remoteStreams.delete(stream.id);
    stream.dispatchEvent(streamEvent);
  } // eslint-disable-next-line require-jsdoc


  function fireActiveAudioInputChange(info) {
    if (!remoteStreams.has(info.id)) {
      _logger.default.warning('Cannot find specific remote stream.');

      return;
    }

    var stream = remoteStreams.get(info.id);
    var streamEvent = new _mixedstream.ActiveAudioInputChangeEvent('activeaudioinputchange', {
      activeAudioInputStreamId: info.data.value
    });
    stream.dispatchEvent(streamEvent);
  } // eslint-disable-next-line require-jsdoc


  function fireLayoutChange(info) {
    if (!remoteStreams.has(info.id)) {
      _logger.default.warning('Cannot find specific remote stream.');

      return;
    }

    var stream = remoteStreams.get(info.id);
    var streamEvent = new _mixedstream.LayoutChangeEvent('layoutchange', {
      layout: info.data.value
    });
    stream.dispatchEvent(streamEvent);
  } // eslint-disable-next-line require-jsdoc


  function updateRemoteStream(streamInfo) {
    if (!remoteStreams.has(streamInfo.id)) {
      _logger.default.warning('Cannot find specific remote stream.');

      return;
    }

    var stream = remoteStreams.get(streamInfo.id);
    stream.settings = StreamUtilsModule.convertToPublicationSettings(streamInfo.media);
    stream.capabilities = StreamUtilsModule.convertToSubscriptionCapabilities(streamInfo.media);
    var streamEvent = new EventModule.OwtEvent('updated');
    stream.dispatchEvent(streamEvent);
  } // eslint-disable-next-line require-jsdoc


  function createRemoteStream(streamInfo) {
    if (streamInfo.type === 'mixed') {
      return new _mixedstream.RemoteMixedStream(streamInfo);
    } else {
      var audioSourceInfo;
      var videoSourceInfo;

      if (streamInfo.media.audio) {
        audioSourceInfo = streamInfo.media.audio.source;
      }

      if (streamInfo.media.video) {
        videoSourceInfo = streamInfo.media.video.source;
      }

      var stream = new StreamModule.RemoteStream(streamInfo.id, streamInfo.info.owner, undefined, new StreamModule.StreamSourceInfo(audioSourceInfo, videoSourceInfo), streamInfo.info.attributes);
      stream.settings = StreamUtilsModule.convertToPublicationSettings(streamInfo.media);
      stream.capabilities = StreamUtilsModule.convertToSubscriptionCapabilities(streamInfo.media);
      return stream;
    }
  } // eslint-disable-next-line require-jsdoc


  function sendSignalingMessage(type, message) {
    return signaling.send(type, message);
  } // eslint-disable-next-line require-jsdoc


  function createPeerConnectionChannel() {
    // Construct an signaling sender/receiver for ConferencePeerConnection.
    var signalingForChannel = Object.create(EventModule.EventDispatcher);
    signalingForChannel.sendSignalingMessage = sendSignalingMessage;
    var pcc = new _channel.ConferencePeerConnectionChannel(config, signalingForChannel);
    pcc.addEventListener('id', function (messageEvent) {
      channels.set(messageEvent.message, pcc);
    });
    return pcc;
  } // eslint-disable-next-line require-jsdoc


  function clean() {
    participants.clear();
    remoteStreams.clear();
  }

  Object.defineProperty(this, 'info', {
    configurable: false,
    get: function get() {
      if (!room) {
        return null;
      }

      return new _info.ConferenceInfo(room.id, Array.from(participants, function (x) {
        return x[1];
      }), Array.from(remoteStreams, function (x) {
        return x[1];
      }), me);
    }
  });
  /**
   * @function join
   * @instance
   * @desc Join a conference.
   * @memberof Owt.Conference.ConferenceClient
   * @returns {Promise<ConferenceInfo, Error>} Return a promise resolved with current conference's information if successfully join the conference. Or return a promise rejected with a newly created Owt.Error if failed to join the conference.
   * @param {string} tokenString Token is issued by conference server(nuve).
   */

  this.join = function (tokenString) {
    return new Promise(function (resolve, reject) {
      var token = JSON.parse(_base.Base64.decodeBase64(tokenString));
      var isSecured = token.secure === true;
      var host = token.host;

      if (typeof host !== 'string') {
        reject(new _error.ConferenceError('Invalid host.'));
        return;
      }

      if (host.indexOf('http') === -1) {
        host = isSecured ? 'https://' + host : 'http://' + host;
      }

      if (signalingState !== SignalingState.READY) {
        reject(new _error.ConferenceError('connection state invalid'));
        return;
      }

      signalingState = SignalingState.CONNECTING;
      var loginInfo = {
        token: tokenString,
        userAgent: Utils.sysInfo(),
        protocol: protocolVersion
      };
      signaling.connect(host, isSecured, loginInfo).then(function (resp) {
        signalingState = SignalingState.CONNECTED;
        room = resp.room;

        if (room.streams !== undefined) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = room.streams[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var st = _step.value;

              if (st.type === 'mixed') {
                st.viewport = st.info.label;
              }

              remoteStreams.set(st.id, createRemoteStream(st));
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }

        if (resp.room && resp.room.participants !== undefined) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = resp.room.participants[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var p = _step2.value;
              participants.set(p.id, new _participant2.Participant(p.id, p.role, p.user));

              if (p.id === resp.id) {
                me = participants.get(p.id);
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }

        resolve(new _info.ConferenceInfo(resp.room.id, Array.from(participants.values()), Array.from(remoteStreams.values()), me));
      }, function (e) {
        signalingState = SignalingState.READY;
        reject(new _error.ConferenceError(e));
      });
    });
  };
  /**
   * @function publish
   * @memberof Owt.Conference.ConferenceClient
   * @instance
   * @desc Publish a LocalStream to conference server. Other participants will be able to subscribe this stream when it is successfully published.
   * @param {Owt.Base.LocalStream} stream The stream to be published.
   * @param {Owt.Base.PublishOptions} options Options for publication.
   * @returns {Promise<Publication, Error>} Returned promise will be resolved with a newly created Publication once specific stream is successfully published, or rejected with a newly created Error if stream is invalid or options cannot be satisfied. Successfully published means PeerConnection is established and server is able to process media data.
   */


  this.publish = function (stream, options) {
    if (!(stream instanceof StreamModule.LocalStream)) {
      return Promise.reject(new _error.ConferenceError('Invalid stream.'));
    }

    if (publishChannels.has(stream.mediaStream.id)) {
      return Promise.reject(new _error.ConferenceError('Cannot publish a published stream.'));
    }

    var channel = createPeerConnectionChannel();
    return channel.publish(stream, options);
  };
  /**
   * @function subscribe
   * @memberof Owt.Conference.ConferenceClient
   * @instance
   * @desc Subscribe a RemoteStream from conference server.
   * @param {Owt.Base.RemoteStream} stream The stream to be subscribed.
   * @param {Owt.Conference.SubscribeOptions} options Options for subscription.
   * @returns {Promise<Subscription, Error>} Returned promise will be resolved with a newly created Subscription once specific stream is successfully subscribed, or rejected with a newly created Error if stream is invalid or options cannot be satisfied. Successfully subscribed means PeerConnection is established and server was started to send media data.
   */


  this.subscribe = function (stream, options) {
    if (!(stream instanceof StreamModule.RemoteStream)) {
      return Promise.reject(new _error.ConferenceError('Invalid stream.'));
    }

    var channel = createPeerConnectionChannel();
    return channel.subscribe(stream, options);
  };
  /**
   * @function send
   * @memberof Owt.Conference.ConferenceClient
   * @instance
   * @desc Send a text message to a participant or all participants.
   * @param {string} message Message to be sent.
   * @param {string} participantId Receiver of this message. Message will be sent to all participants if participantId is undefined.
   * @return {Promise<void, Error>} Returned promise will be resolved when conference server received certain message.
   */


  this.send = function (message, participantId) {
    if (participantId === undefined) {
      participantId = 'all';
    }

    return sendSignalingMessage('text', {
      to: participantId,
      message: message
    });
  };
  /**
   * @function leave
   * @memberOf Owt.Conference.ConferenceClient
   * @instance
   * @desc Leave a conference.
   * @return {Promise<void, Error>} Returned promise will be resolved with undefined once the connection is disconnected.
   */


  this.leave = function () {
    return signaling.disconnect().then(function () {
      clean();
      signalingState = SignalingState.READY;
    });
  };
};

exports.ConferenceClient = ConferenceClient;

},{"../base/base64.js":1,"../base/event.js":3,"../base/logger.js":5,"../base/stream.js":10,"../base/utils.js":11,"./channel.js":12,"./error.js":14,"./info.js":16,"./mixedstream.js":17,"./participant.js":18,"./signaling.js":19,"./streamutils.js":20}],14:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';
/**
 * @class ConferenceError
 * @classDesc The ConferenceError object represents an error in conference mode.
 * @memberOf Owt.Conference
 * @hideconstructor
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConferenceError = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ConferenceError =
/*#__PURE__*/
function (_Error) {
  _inherits(ConferenceError, _Error);

  // eslint-disable-next-line require-jsdoc
  function ConferenceError(message) {
    _classCallCheck(this, ConferenceError);

    return _possibleConstructorReturn(this, _getPrototypeOf(ConferenceError).call(this, message));
  }

  return ConferenceError;
}(_wrapNativeSuper(Error));

exports.ConferenceError = ConferenceError;

},{}],15:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ConferenceClient", {
  enumerable: true,
  get: function get() {
    return _client.ConferenceClient;
  }
});
Object.defineProperty(exports, "SioSignaling", {
  enumerable: true,
  get: function get() {
    return _signaling.SioSignaling;
  }
});

var _client = require("./client.js");

var _signaling = require("./signaling.js");

},{"./client.js":13,"./signaling.js":19}],16:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';
/**
 * @class ConferenceInfo
 * @classDesc Information for a conference.
 * @memberOf Owt.Conference
 * @hideconstructor
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConferenceInfo = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConferenceInfo = // eslint-disable-next-line require-jsdoc
function ConferenceInfo(id, participants, remoteStreams, myInfo) {
  _classCallCheck(this, ConferenceInfo);

  /**
   * @member {string} id
   * @instance
   * @memberof Owt.Conference.ConferenceInfo
   * @desc Conference ID.
   */
  this.id = id;
  /**
   * @member {Array<Owt.Conference.Participant>} participants
   * @instance
   * @memberof Owt.Conference.ConferenceInfo
   * @desc Participants in the conference.
   */

  this.participants = participants;
  /**
   * @member {Array<Owt.Base.RemoteStream>} remoteStreams
   * @instance
   * @memberof Owt.Conference.ConferenceInfo
   * @desc Streams published by participants. It also includes streams published by current user.
   */

  this.remoteStreams = remoteStreams;
  /**
   * @member {Owt.Base.Participant} self
   * @instance
   * @memberof Owt.Conference.ConferenceInfo
   */

  this.self = myInfo;
};

exports.ConferenceInfo = ConferenceInfo;

},{}],17:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LayoutChangeEvent = exports.ActiveAudioInputChangeEvent = exports.RemoteMixedStream = void 0;

var StreamModule = _interopRequireWildcard(require("../base/stream.js"));

var StreamUtilsModule = _interopRequireWildcard(require("./streamutils.js"));

var _event = require("../base/event.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class RemoteMixedStream
 * @classDesc Mixed stream from conference server.
 * Events:
 *
 * | Event Name             | Argument Type    | Fired when       |
 * | -----------------------| ---------------- | ---------------- |
 * | activeaudioinputchange | Event            | Audio activeness of input stream (of the mixed stream) is changed. |
 * | layoutchange           | Event            | Video's layout has been changed. It usually happens when a new video is mixed into the target mixed stream or an existing video has been removed from mixed stream. |
 *
 * @memberOf Owt.Conference
 * @extends Owt.Base.RemoteStream
 * @hideconstructor
 */
var RemoteMixedStream =
/*#__PURE__*/
function (_StreamModule$RemoteS) {
  _inherits(RemoteMixedStream, _StreamModule$RemoteS);

  // eslint-disable-next-line require-jsdoc
  function RemoteMixedStream(info) {
    var _this;

    _classCallCheck(this, RemoteMixedStream);

    if (info.type !== 'mixed') {
      throw new TypeError('Not a mixed stream');
    }

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RemoteMixedStream).call(this, info.id, undefined, undefined, new StreamModule.StreamSourceInfo('mixed', 'mixed')));
    _this.settings = StreamUtilsModule.convertToPublicationSettings(info.media);
    _this.capabilities = new StreamUtilsModule.convertToSubscriptionCapabilities(info.media);
    return _this;
  }

  return RemoteMixedStream;
}(StreamModule.RemoteStream);
/**
 * @class ActiveAudioInputChangeEvent
 * @classDesc Class ActiveAudioInputChangeEvent represents an active audio input change event.
 * @memberof Owt.Conference
 * @hideconstructor
 */


exports.RemoteMixedStream = RemoteMixedStream;

var ActiveAudioInputChangeEvent =
/*#__PURE__*/
function (_OwtEvent) {
  _inherits(ActiveAudioInputChangeEvent, _OwtEvent);

  // eslint-disable-next-line require-jsdoc
  function ActiveAudioInputChangeEvent(type, init) {
    var _this2;

    _classCallCheck(this, ActiveAudioInputChangeEvent);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ActiveAudioInputChangeEvent).call(this, type));
    /**
     * @member {string} activeAudioInputStreamId
     * @instance
     * @memberof Owt.Conference.ActiveAudioInputChangeEvent
     * @desc The ID of input stream(of the mixed stream) whose audio is active.
     */

    _this2.activeAudioInputStreamId = init.activeAudioInputStreamId;
    return _this2;
  }

  return ActiveAudioInputChangeEvent;
}(_event.OwtEvent);
/**
 * @class LayoutChangeEvent
 * @classDesc Class LayoutChangeEvent represents an video layout change event.
 * @memberof Owt.Conference
 * @hideconstructor
 */


exports.ActiveAudioInputChangeEvent = ActiveAudioInputChangeEvent;

var LayoutChangeEvent =
/*#__PURE__*/
function (_OwtEvent2) {
  _inherits(LayoutChangeEvent, _OwtEvent2);

  // eslint-disable-next-line require-jsdoc
  function LayoutChangeEvent(type, init) {
    var _this3;

    _classCallCheck(this, LayoutChangeEvent);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(LayoutChangeEvent).call(this, type));
    /**
     * @member {object} layout
     * @instance
     * @memberof Owt.Conference.LayoutChangeEvent
     * @desc Current video's layout. It's an array of map which maps each stream to a region.
     */

    _this3.layout = init.layout;
    return _this3;
  }

  return LayoutChangeEvent;
}(_event.OwtEvent);

exports.LayoutChangeEvent = LayoutChangeEvent;

},{"../base/event.js":3,"../base/stream.js":10,"./streamutils.js":20}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Participant = void 0;

var EventModule = _interopRequireWildcard(require("../base/event.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

'use strict';
/**
 * @class Participant
 * @memberOf Owt.Conference
 * @classDesc The Participant defines a participant in a conference.
 * Events:
 *
 * | Event Name      | Argument Type      | Fired when       |
 * | ----------------| ------------------ | ---------------- |
 * | left            | Owt.Base.OwtEvent  | The participant left the conference. |
 *
 * @extends Owt.Base.EventDispatcher
 * @hideconstructor
 */


var Participant =
/*#__PURE__*/
function (_EventModule$EventDis) {
  _inherits(Participant, _EventModule$EventDis);

  // eslint-disable-next-line require-jsdoc
  function Participant(id, role, userId) {
    var _this;

    _classCallCheck(this, Participant);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Participant).call(this));
    /**
     * @member {string} id
     * @instance
     * @memberof Owt.Conference.Participant
     * @desc The ID of the participant. It varies when a single user join different conferences.
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'id', {
      configurable: false,
      writable: false,
      value: id
    });
    /**
     * @member {string} role
     * @instance
     * @memberof Owt.Conference.Participant
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'role', {
      configurable: false,
      writable: false,
      value: role
    });
    /**
     * @member {string} userId
     * @instance
     * @memberof Owt.Conference.Participant
     * @desc The user ID of the participant. It can be integrated into existing account management system.
     */

    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'userId', {
      configurable: false,
      writable: false,
      value: userId
    });
    return _this;
  }

  return Participant;
}(EventModule.EventDispatcher);

exports.Participant = Participant;

},{"../base/event.js":3}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SioSignaling = void 0;

var _logger = _interopRequireDefault(require("../base/logger.js"));

var EventModule = _interopRequireWildcard(require("../base/event.js"));

var _error = require("./error.js");

var _base = require("../base/base64.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

'use strict';

var reconnectionAttempts = 10; // eslint-disable-next-line require-jsdoc

function handleResponse(status, data, resolve, reject) {
  if (status === 'ok' || status === 'success') {
    resolve(data);
  } else if (status === 'error') {
    reject(data);
  } else {
    _logger.default.error('MCU returns unknown ack.');
  }
}
/**
 * @class SioSignaling
 * @classdesc Socket.IO signaling channel for ConferenceClient. It is not recommended to directly access this class.
 * @memberof Owt.Conference
 * @extends Owt.Base.EventDispatcher
 * @constructor
 */


var SioSignaling =
/*#__PURE__*/
function (_EventModule$EventDis) {
  _inherits(SioSignaling, _EventModule$EventDis);

  // eslint-disable-next-line require-jsdoc
  function SioSignaling() {
    var _this;

    _classCallCheck(this, SioSignaling);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SioSignaling).call(this));
    _this._socket = null;
    _this._loggedIn = false;
    _this._reconnectTimes = 0;
    _this._reconnectionTicket = null;
    _this._refreshReconnectionTicket = null;
    return _this;
  }
  /**
   * @function connect
   * @instance
   * @desc Connect to a portal.
   * @memberof Oms.Conference.SioSignaling
   * @return {Promise<Object, Error>} Return a promise resolved with the data returned by portal if successfully logged in. Or return a promise rejected with a newly created Oms.Error if failed.
   * @param {string} host Host of the portal.
   * @param {string} isSecured Is secure connection or not.
   * @param {string} loginInfo Infomation required for logging in.
   * @private.
   */


  _createClass(SioSignaling, [{
    key: "connect",
    value: function connect(host, isSecured, loginInfo) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var opts = {
          'reconnection': true,
          'reconnectionAttempts': reconnectionAttempts,
          'force new connection': true
        };
        _this2._socket = io(host, opts);
        ['participant', 'text', 'stream', 'progress'].forEach(function (notification) {
          _this2._socket.on(notification, function (data) {
            _this2.dispatchEvent(new EventModule.MessageEvent('data', {
              message: {
                notification: notification,
                data: data
              }
            }));
          });
        });

        _this2._socket.on('reconnecting', function () {
          _this2._reconnectTimes++;
        });

        _this2._socket.on('reconnect_failed', function () {
          if (_this2._reconnectTimes >= reconnectionAttempts) {
            _this2.dispatchEvent(new EventModule.OwtEvent('disconnect'));
          }
        });

        _this2._socket.on('connect_error', function (e) {
          reject("connect_error:".concat(host));
        });

        _this2._socket.on('drop', function () {
          _this2._reconnectTimes = reconnectionAttempts;
        });

        _this2._socket.on('disconnect', function () {
          _this2._clearReconnectionTask();

          if (_this2._reconnectTimes >= reconnectionAttempts) {
            _this2._loggedIn = false;

            _this2.dispatchEvent(new EventModule.OwtEvent('disconnect'));
          }
        });

        _this2._socket.emit('login', loginInfo, function (status, data) {
          if (status === 'ok') {
            _this2._loggedIn = true;

            _this2._onReconnectionTicket(data.reconnectionTicket);

            _this2._socket.on('connect', function () {
              // re-login with reconnection ticket.
              _this2._socket.emit('relogin', _this2._reconnectionTicket, function (status, data) {
                if (status === 'ok') {
                  _this2._reconnectTimes = 0;

                  _this2._onReconnectionTicket(data);
                } else {
                  _this2.dispatchEvent(new EventModule.OwtEvent('disconnect'));
                }
              });
            });
          }

          handleResponse(status, data, resolve, reject);
        });
      });
    }
    /**
     * @function disconnect
     * @instance
     * @desc Disconnect from a portal.
     * @memberof Oms.Conference.SioSignaling
     * @return {Promise<Object, Error>} Return a promise resolved with the data returned by portal if successfully disconnected. Or return a promise rejected with a newly created Oms.Error if failed.
     * @private.
     */

  }, {
    key: "disconnect",
    value: function disconnect() {
      var _this3 = this;

      if (!this._socket || this._socket.disconnected) {
        return Promise.reject(new _error.ConferenceError('Portal is not connected.'));
      }

      return new Promise(function (resolve, reject) {
        _this3._socket.emit('logout', function (status, data) {
          // Maximize the reconnect times to disable reconnection.
          _this3._reconnectTimes = reconnectionAttempts;

          _this3._socket.disconnect();

          handleResponse(status, data, resolve, reject);
        });
      });
    }
    /**
     * @function send
     * @instance
     * @desc Send data to portal.
     * @memberof Oms.Conference.SioSignaling
     * @return {Promise<Object, Error>} Return a promise resolved with the data returned by portal. Or return a promise rejected with a newly created Oms.Error if failed to send the message.
     * @param {string} requestName Name defined in client-server protocol.
     * @param {string} requestData Data format is defined in client-server protocol.
     * @private.
     */

  }, {
    key: "send",
    value: function send(requestName, requestData) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _this4._socket.emit(requestName, requestData, function (status, data) {
          handleResponse(status, data, resolve, reject);
        });
      });
    }
    /**
     * @function _onReconnectionTicket
     * @instance
     * @desc Parse reconnection ticket and schedule ticket refreshing.
     * @memberof Owt.Conference.SioSignaling
     * @private.
     */

  }, {
    key: "_onReconnectionTicket",
    value: function _onReconnectionTicket(ticketString) {
      var _this5 = this;

      this._reconnectionTicket = ticketString;
      var ticket = JSON.parse(_base.Base64.decodeBase64(ticketString)); // Refresh ticket 1 min or 10 seconds before it expires.

      var now = Date.now();
      var millisecondsInOneMinute = 60 * 1000;
      var millisecondsInTenSeconds = 10 * 1000;

      if (ticket.notAfter <= now - millisecondsInTenSeconds) {
        _logger.default.warning('Reconnection ticket expires too soon.');

        return;
      }

      var refreshAfter = ticket.notAfter - now - millisecondsInOneMinute;

      if (refreshAfter < 0) {
        refreshAfter = ticket.notAfter - now - millisecondsInTenSeconds;
      }

      this._clearReconnectionTask();

      this._refreshReconnectionTicket = setTimeout(function () {
        _this5._socket.emit('refreshReconnectionTicket', function (status, data) {
          if (status !== 'ok') {
            _logger.default.warning('Failed to refresh reconnection ticket.');

            return;
          }

          _this5._onReconnectionTicket(data);
        });
      }, refreshAfter);
    }
  }, {
    key: "_clearReconnectionTask",
    value: function _clearReconnectionTask() {
      clearTimeout(this._refreshReconnectionTicket);
      this._refreshReconnectionTicket = null;
    }
  }]);

  return SioSignaling;
}(EventModule.EventDispatcher);

exports.SioSignaling = SioSignaling;

},{"../base/base64.js":1,"../base/event.js":3,"../base/logger.js":5,"./error.js":14}],20:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
// This file doesn't have public APIs.

/* eslint-disable valid-jsdoc */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToPublicationSettings = convertToPublicationSettings;
exports.convertToSubscriptionCapabilities = convertToSubscriptionCapabilities;

var PublicationModule = _interopRequireWildcard(require("../base/publication.js"));

var MediaFormatModule = _interopRequireWildcard(require("../base/mediaformat.js"));

var CodecModule = _interopRequireWildcard(require("../base/codec.js"));

var SubscriptionModule = _interopRequireWildcard(require("./subscription.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
 * @function extractBitrateMultiplier
 * @desc Extract bitrate multiplier from a string like "x0.2".
 * @return {Promise<Object, Error>} The float number after "x".
 * @private
 */
function extractBitrateMultiplier(input) {
  if (typeof input !== 'string' || !input.startsWith('x')) {
    L.Logger.warning('Invalid bitrate multiplier input.');
    return 0;
  }

  return Number.parseFloat(input.replace(/^x/, ''));
} // eslint-disable-next-line require-jsdoc


function sortNumbers(x, y) {
  return x - y;
} // eslint-disable-next-line require-jsdoc


function sortResolutions(x, y) {
  if (x.width !== y.width) {
    return x.width - y.width;
  } else {
    return x.height - y.height;
  }
}
/**
 * @function convertToPublicationSettings
 * @desc Convert mediaInfo received from server to PublicationSettings.
 * @private
 */


function convertToPublicationSettings(mediaInfo) {
  var audio;
  var audioCodec;
  var video;
  var videoCodec;
  var resolution;
  var framerate;
  var bitrate;
  var keyFrameInterval;

  if (mediaInfo.audio) {
    if (mediaInfo.audio.format) {
      audioCodec = new CodecModule.AudioCodecParameters(mediaInfo.audio.format.codec, mediaInfo.audio.format.channelNum, mediaInfo.audio.format.sampleRate);
    }

    audio = new PublicationModule.AudioPublicationSettings(audioCodec);
  }

  if (mediaInfo.video) {
    if (mediaInfo.video.format) {
      videoCodec = new CodecModule.VideoCodecParameters(mediaInfo.video.format.codec, mediaInfo.video.format.profile);
    }

    if (mediaInfo.video.parameters) {
      if (mediaInfo.video.parameters.resolution) {
        resolution = new MediaFormatModule.Resolution(mediaInfo.video.parameters.resolution.width, mediaInfo.video.parameters.resolution.height);
      }

      framerate = mediaInfo.video.parameters.framerate;
      bitrate = mediaInfo.video.parameters.bitrate * 1000;
      keyFrameInterval = mediaInfo.video.parameters.keyFrameInterval;
    }

    video = new PublicationModule.VideoPublicationSettings(videoCodec, resolution, framerate, bitrate, keyFrameInterval);
  }

  return new PublicationModule.PublicationSettings(audio, video);
}
/**
 * @function convertToSubscriptionCapabilities
 * @desc Convert mediaInfo received from server to SubscriptionCapabilities.
 * @private
 */


function convertToSubscriptionCapabilities(mediaInfo) {
  var audio;
  var video;

  if (mediaInfo.audio) {
    var audioCodecs = [];

    if (mediaInfo.audio && mediaInfo.audio.format) {
      audioCodecs.push(new CodecModule.AudioCodecParameters(mediaInfo.audio.format.codec, mediaInfo.audio.format.channelNum, mediaInfo.audio.format.sampleRate));
    }

    if (mediaInfo.audio && mediaInfo.audio.optional && mediaInfo.audio.optional.format) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = mediaInfo.audio.optional.format[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var audioCodecInfo = _step.value;
          var audioCodec = new CodecModule.AudioCodecParameters(audioCodecInfo.codec, audioCodecInfo.channelNum, audioCodecInfo.sampleRate);
          audioCodecs.push(audioCodec);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    audioCodecs.sort();
    audio = new SubscriptionModule.AudioSubscriptionCapabilities(audioCodecs);
  }

  if (mediaInfo.video) {
    var videoCodecs = [];

    if (mediaInfo.video && mediaInfo.video.format) {
      videoCodecs.push(new CodecModule.VideoCodecParameters(mediaInfo.video.format.codec, mediaInfo.video.format.profile));
    }

    if (mediaInfo.video && mediaInfo.video.optional && mediaInfo.video.optional.format) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = mediaInfo.video.optional.format[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var videoCodecInfo = _step2.value;
          var videoCodec = new CodecModule.VideoCodecParameters(videoCodecInfo.codec, videoCodecInfo.profile);
          videoCodecs.push(videoCodec);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    videoCodecs.sort();
    var resolutions = Array.from(mediaInfo.video.optional.parameters.resolution, function (r) {
      return new MediaFormatModule.Resolution(r.width, r.height);
    });

    if (mediaInfo.video && mediaInfo.video.parameters && mediaInfo.video.parameters.resolution) {
      resolutions.push(new MediaFormatModule.Resolution(mediaInfo.video.parameters.resolution.width, mediaInfo.video.parameters.resolution.height));
    }

    resolutions.sort(sortResolutions);
    var bitrates = Array.from(mediaInfo.video.optional.parameters.bitrate, function (bitrate) {
      return extractBitrateMultiplier(bitrate);
    });
    bitrates.push(1.0);
    bitrates.sort(sortNumbers);
    var frameRates = JSON.parse(JSON.stringify(mediaInfo.video.optional.parameters.framerate));

    if (mediaInfo.video && mediaInfo.video.parameters && mediaInfo.video.parameters.framerate) {
      frameRates.push(mediaInfo.video.parameters.framerate);
    }

    frameRates.sort(sortNumbers);
    var keyFrameIntervals = JSON.parse(JSON.stringify(mediaInfo.video.optional.parameters.keyFrameInterval));

    if (mediaInfo.video && mediaInfo.video.parameters && mediaInfo.video.parameters.keyFrameInterval) {
      keyFrameIntervals.push(mediaInfo.video.parameters.keyFrameInterval);
    }

    keyFrameIntervals.sort(sortNumbers);
    video = new SubscriptionModule.VideoSubscriptionCapabilities(videoCodecs, resolutions, frameRates, bitrates, keyFrameIntervals);
  }

  return new SubscriptionModule.SubscriptionCapabilities(audio, video);
}

},{"../base/codec.js":2,"../base/mediaformat.js":6,"../base/publication.js":8,"./subscription.js":21}],21:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Subscription = exports.SubscriptionUpdateOptions = exports.VideoSubscriptionUpdateOptions = exports.SubscribeOptions = exports.VideoSubscriptionConstraints = exports.AudioSubscriptionConstraints = exports.SubscriptionCapabilities = exports.VideoSubscriptionCapabilities = exports.AudioSubscriptionCapabilities = void 0;

var MediaFormatModule = _interopRequireWildcard(require("../base/mediaformat.js"));

var CodecModule = _interopRequireWildcard(require("../base/codec.js"));

var _event = require("../base/event.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class AudioSubscriptionCapabilities
 * @memberOf Owt.Conference
 * @classDesc Represents the audio capability for subscription.
 * @hideconstructor
 */
var AudioSubscriptionCapabilities = // eslint-disable-next-line require-jsdoc
function AudioSubscriptionCapabilities(codecs) {
  _classCallCheck(this, AudioSubscriptionCapabilities);

  /**
   * @member {Array.<Owt.Base.AudioCodecParameters>} codecs
   * @instance
   * @memberof Owt.Conference.AudioSubscriptionCapabilities
   */
  this.codecs = codecs;
};
/**
 * @class VideoSubscriptionCapabilities
 * @memberOf Owt.Conference
 * @classDesc Represents the video capability for subscription.
 * @hideconstructor
 */


exports.AudioSubscriptionCapabilities = AudioSubscriptionCapabilities;

var VideoSubscriptionCapabilities = // eslint-disable-next-line require-jsdoc
function VideoSubscriptionCapabilities(codecs, resolutions, frameRates, bitrateMultipliers, keyFrameIntervals) {
  _classCallCheck(this, VideoSubscriptionCapabilities);

  /**
   * @member {Array.<Owt.Base.VideoCodecParameters>} codecs
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionCapabilities
   */
  this.codecs = codecs;
  /**
   * @member {Array.<Owt.Base.Resolution>} resolutions
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionCapabilities
   */

  this.resolutions = resolutions;
  /**
   * @member {Array.<number>} frameRates
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionCapabilities
   */

  this.frameRates = frameRates;
  /**
   * @member {Array.<number>} bitrateMultipliers
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionCapabilities
   */

  this.bitrateMultipliers = bitrateMultipliers;
  /**
   * @member {Array.<number>} keyFrameIntervals
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionCapabilities
   */

  this.keyFrameIntervals = keyFrameIntervals;
};
/**
 * @class SubscriptionCapabilities
 * @memberOf Owt.Conference
 * @classDesc Represents the capability for subscription.
 * @hideconstructor
 */


exports.VideoSubscriptionCapabilities = VideoSubscriptionCapabilities;

var SubscriptionCapabilities = // eslint-disable-next-line require-jsdoc
function SubscriptionCapabilities(audio, video) {
  _classCallCheck(this, SubscriptionCapabilities);

  /**
   * @member {?Owt.Conference.AudioSubscriptionCapabilities} audio
   * @instance
   * @memberof Owt.Conference.SubscriptionCapabilities
   */
  this.audio = audio;
  /**
   * @member {?Owt.Conference.VideoSubscriptionCapabilities} video
   * @instance
   * @memberof Owt.Conference.SubscriptionCapabilities
   */

  this.video = video;
};
/**
 * @class AudioSubscriptionConstraints
 * @memberOf Owt.Conference
 * @classDesc Represents the audio constraints for subscription.
 * @hideconstructor
 */


exports.SubscriptionCapabilities = SubscriptionCapabilities;

var AudioSubscriptionConstraints = // eslint-disable-next-line require-jsdoc
function AudioSubscriptionConstraints(codecs) {
  _classCallCheck(this, AudioSubscriptionConstraints);

  /**
   * @member {?Array.<Owt.Base.AudioCodecParameters>} codecs
   * @instance
   * @memberof Owt.Conference.AudioSubscriptionConstraints
   * @desc Codecs accepted. If none of `codecs` supported by both sides, connection fails. Leave it undefined will use all possible codecs.
   */
  this.codecs = codecs;
};
/**
 * @class VideoSubscriptionConstraints
 * @memberOf Owt.Conference
 * @classDesc Represents the video constraints for subscription.
 * @hideconstructor
 */


exports.AudioSubscriptionConstraints = AudioSubscriptionConstraints;

var VideoSubscriptionConstraints = // eslint-disable-next-line require-jsdoc
function VideoSubscriptionConstraints(codecs, resolution, frameRate, bitrateMultiplier, keyFrameInterval) {
  _classCallCheck(this, VideoSubscriptionConstraints);

  /**
   * @member {?Array.<Owt.Base.VideoCodecParameters>} codecs
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionConstraints
   * @desc Codecs accepted. If none of `codecs` supported by both sides, connection fails. Leave it undefined will use all possible codecs.
   */
  this.codecs = codecs;
  /**
   * @member {?Owt.Base.Resolution} resolution
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionConstraints
   * @desc Only resolutions listed in Owt.Conference.VideoSubscriptionCapabilities are allowed.
   */

  this.resolution = resolution;
  /**
   * @member {?number} frameRate
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionConstraints
   * @desc Only frameRates listed in Owt.Conference.VideoSubscriptionCapabilities are allowed.
   */

  this.frameRate = frameRate;
  /**
   * @member {?number} bitrateMultiplier
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionConstraints
   * @desc Only bitrateMultipliers listed in Owt.Conference.VideoSubscriptionCapabilities are allowed.
   */

  this.bitrateMultiplier = bitrateMultiplier;
  /**
   * @member {?number} keyFrameInterval
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionConstraints
   * @desc Only keyFrameIntervals listed in Owt.Conference.VideoSubscriptionCapabilities are allowed.
   */

  this.keyFrameInterval = keyFrameInterval;
};
/**
 * @class SubscribeOptions
 * @memberOf Owt.Conference
 * @classDesc SubscribeOptions defines options for subscribing a Owt.Base.RemoteStream.
 */


exports.VideoSubscriptionConstraints = VideoSubscriptionConstraints;

var SubscribeOptions = // eslint-disable-next-line require-jsdoc
function SubscribeOptions(audio, video) {
  _classCallCheck(this, SubscribeOptions);

  /**
   * @member {?AudioSubscriptionConstraints} audio
   * @instance
   * @memberof Owt.Conference.SubscribeOptions
   */
  this.audio = audio;
  /**
   * @member {?VideoSubscriptionConstraints} video
   * @instance
   * @memberof Owt.Conference.SubscribeOptions
   */

  this.video = video;
};
/**
 * @class VideoSubscriptionUpdateOptions
 * @memberOf Owt.Conference
 * @classDesc VideoSubscriptionUpdateOptions defines options for updating a subscription's video part.
 * @hideconstructor
 */


exports.SubscribeOptions = SubscribeOptions;

var VideoSubscriptionUpdateOptions = // eslint-disable-next-line require-jsdoc
function VideoSubscriptionUpdateOptions() {
  _classCallCheck(this, VideoSubscriptionUpdateOptions);

  /**
   * @member {?Owt.Base.Resolution} resolution
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionUpdateOptions
   * @desc Only resolutions listed in VideoSubscriptionCapabilities are allowed.
   */
  this.resolution = undefined;
  /**
   * @member {?number} frameRates
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionUpdateOptions
   * @desc Only frameRates listed in VideoSubscriptionCapabilities are allowed.
   */

  this.frameRate = undefined;
  /**
   * @member {?number} bitrateMultipliers
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionUpdateOptions
   * @desc Only bitrateMultipliers listed in VideoSubscriptionCapabilities are allowed.
   */

  this.bitrateMultipliers = undefined;
  /**
   * @member {?number} keyFrameIntervals
   * @instance
   * @memberof Owt.Conference.VideoSubscriptionUpdateOptions
   * @desc Only keyFrameIntervals listed in VideoSubscriptionCapabilities are allowed.
   */

  this.keyFrameInterval = undefined;
};
/**
 * @class SubscriptionUpdateOptions
 * @memberOf Owt.Conference
 * @classDesc SubscriptionUpdateOptions defines options for updating a subscription.
 * @hideconstructor
 */


exports.VideoSubscriptionUpdateOptions = VideoSubscriptionUpdateOptions;

var SubscriptionUpdateOptions = // eslint-disable-next-line require-jsdoc
function SubscriptionUpdateOptions() {
  _classCallCheck(this, SubscriptionUpdateOptions);

  /**
   * @member {?VideoSubscriptionUpdateOptions} video
   * @instance
   * @memberof Owt.Conference.SubscriptionUpdateOptions
   */
  this.video = undefined;
};
/**
 * @class Subscription
 * @memberof Owt.Conference
 * @classDesc Subscription is a receiver for receiving a stream.
 * Events:
 *
 * | Event Name      | Argument Type    | Fired when       |
 * | ----------------| ---------------- | ---------------- |
 * | ended           | Event            | Subscription is ended. |
 * | error           | ErrorEvent       | An error occurred on the subscription. |
 * | mute            | MuteEvent        | Publication is muted. Remote side stopped sending audio and/or video data. |
 * | unmute          | MuteEvent        | Publication is unmuted. Remote side continued sending audio and/or video data. |
 *
 * @extends Owt.Base.EventDispatcher
 * @hideconstructor
 */


exports.SubscriptionUpdateOptions = SubscriptionUpdateOptions;

var Subscription =
/*#__PURE__*/
function (_EventDispatcher) {
  _inherits(Subscription, _EventDispatcher);

  // eslint-disable-next-line require-jsdoc
  function Subscription(id, stop, getStats, mute, unmute, applyOptions) {
    var _this;

    _classCallCheck(this, Subscription);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Subscription).call(this));

    if (!id) {
      throw new TypeError('ID cannot be null or undefined.');
    }
    /**
     * @member {string} id
     * @instance
     * @memberof Owt.Conference.Subscription
     */


    Object.defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), 'id', {
      configurable: false,
      writable: false,
      value: id
    });
    /**
     * @function stop
     * @instance
     * @desc Stop certain subscription. Once a subscription is stopped, it cannot be recovered.
     * @memberof Owt.Conference.Subscription
     * @returns {undefined}
     */

    _this.stop = stop;
    /**
     * @function getStats
     * @instance
     * @desc Get stats of underlying PeerConnection.
     * @memberof Owt.Conference.Subscription
     * @returns {Promise<RTCStatsReport, Error>}
     */

    _this.getStats = getStats;
    /**
     * @function mute
     * @instance
     * @desc Stop reeving data from remote endpoint.
     * @memberof Owt.Conference.Subscription
     * @param {Owt.Base.TrackKind } kind Kind of tracks to be muted.
     * @returns {Promise<undefined, Error>}
     */

    _this.mute = mute;
    /**
     * @function unmute
     * @instance
     * @desc Continue reeving data from remote endpoint.
     * @memberof Owt.Conference.Subscription
     * @param {Owt.Base.TrackKind } kind Kind of tracks to be unmuted.
     * @returns {Promise<undefined, Error>}
     */

    _this.unmute = unmute;
    /**
     * @function applyOptions
     * @instance
     * @desc Update subscription with given options.
     * @memberof Owt.Conference.Subscription
     * @param {Owt.Conference.SubscriptionUpdateOptions } options Subscription update options.
     * @returns {Promise<undefined, Error>}
     */

    _this.applyOptions = applyOptions;
    return _this;
  }

  return Subscription;
}(_event.EventDispatcher);

exports.Subscription = Subscription;

},{"../base/codec.js":2,"../base/event.js":3,"../base/mediaformat.js":6}],22:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Conference = exports.P2P = exports.Base = void 0;

var base = _interopRequireWildcard(require("./base/export.js"));

var p2p = _interopRequireWildcard(require("./p2p/export.js"));

var conference = _interopRequireWildcard(require("./conference/export.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
 * Base objects for both P2P and conference.
 * @namespace Owt.Base
 */
var Base = base;
/**
 * P2P WebRTC connections.
 * @namespace Owt.P2P
 */

exports.Base = Base;
var P2P = p2p;
/**
 * WebRTC connections with conference server.
 * @namespace Owt.Conference
 */

exports.P2P = P2P;
var Conference = conference;
exports.Conference = Conference;

},{"./base/export.js":4,"./conference/export.js":15,"./p2p/export.js":24}],23:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorByCode = getErrorByCode;
exports.P2PError = exports.errors = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var errors = {
  // 2100-2999 for P2P errors
  // 2100-2199 for connection errors
  // 2100-2109 for server errors
  P2P_CONN_SERVER_UNKNOWN: {
    code: 2100,
    message: 'Server unknown error.'
  },
  P2P_CONN_SERVER_UNAVAILABLE: {
    code: 2101,
    message: 'Server is unavaliable.'
  },
  P2P_CONN_SERVER_BUSY: {
    code: 2102,
    message: 'Server is too busy.'
  },
  P2P_CONN_SERVER_NOT_SUPPORTED: {
    code: 2103,
    message: 'Method has not been supported by server.'
  },
  // 2110-2119 for client errors
  P2P_CONN_CLIENT_UNKNOWN: {
    code: 2110,
    message: 'Client unknown error.'
  },
  P2P_CONN_CLIENT_NOT_INITIALIZED: {
    code: 2111,
    message: 'Connection is not initialized.'
  },
  // 2120-2129 for authentication errors
  P2P_CONN_AUTH_UNKNOWN: {
    code: 2120,
    message: 'Authentication unknown error.'
  },
  P2P_CONN_AUTH_FAILED: {
    code: 2121,
    message: 'Wrong username or token.'
  },
  // 2200-2299 for message transport errors
  P2P_MESSAGING_TARGET_UNREACHABLE: {
    code: 2201,
    message: 'Remote user cannot be reached.'
  },
  P2P_CLIENT_DENIED: {
    code: 2202,
    message: 'User is denied.'
  },
  // 2301-2399 for chat room errors
  // 2401-2499 for client errors
  P2P_CLIENT_UNKNOWN: {
    code: 2400,
    message: 'Unknown errors.'
  },
  P2P_CLIENT_UNSUPPORTED_METHOD: {
    code: 2401,
    message: 'This method is unsupported in current browser.'
  },
  P2P_CLIENT_ILLEGAL_ARGUMENT: {
    code: 2402,
    message: 'Illegal argument.'
  },
  P2P_CLIENT_INVALID_STATE: {
    code: 2403,
    message: 'Invalid peer state.'
  },
  P2P_CLIENT_NOT_ALLOWED: {
    code: 2404,
    message: 'Remote user is not allowed.'
  },
  // 2501-2599 for WebRTC erros.
  P2P_WEBRTC_UNKNOWN: {
    code: 2500,
    message: 'WebRTC error.'
  },
  P2P_WEBRTC_SDP: {
    code: 2502,
    message: 'SDP error.'
  }
};
/**
 * @function getErrorByCode
 * @desc Get error object by error code.
 * @param {string} errorCode Error code.
 * @return {Owt.P2P.Error} Error object
 * @private
 */

exports.errors = errors;

function getErrorByCode(errorCode) {
  var codeErrorMap = {
    2100: errors.P2P_CONN_SERVER_UNKNOWN,
    2101: errors.P2P_CONN_SERVER_UNAVAILABLE,
    2102: errors.P2P_CONN_SERVER_BUSY,
    2103: errors.P2P_CONN_SERVER_NOT_SUPPORTED,
    2110: errors.P2P_CONN_CLIENT_UNKNOWN,
    2111: errors.P2P_CONN_CLIENT_NOT_INITIALIZED,
    2120: errors.P2P_CONN_AUTH_UNKNOWN,
    2121: errors.P2P_CONN_AUTH_FAILED,
    2201: errors.P2P_MESSAGING_TARGET_UNREACHABLE,
    2400: errors.P2P_CLIENT_UNKNOWN,
    2401: errors.P2P_CLIENT_UNSUPPORTED_METHOD,
    2402: errors.P2P_CLIENT_ILLEGAL_ARGUMENT,
    2403: errors.P2P_CLIENT_INVALID_STATE,
    2404: errors.P2P_CLIENT_NOT_ALLOWED,
    2500: errors.P2P_WEBRTC_UNKNOWN,
    2501: errors.P2P_WEBRTC_SDP
  };
  return codeErrorMap[errorCode];
}
/**
 * @class P2PError
 * @classDesc The P2PError object represents an error in P2P mode.
 * @memberOf Owt.P2P
 * @hideconstructor
 */


var P2PError =
/*#__PURE__*/
function (_Error) {
  _inherits(P2PError, _Error);

  // eslint-disable-next-line require-jsdoc
  function P2PError(error, message) {
    var _this;

    _classCallCheck(this, P2PError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(P2PError).call(this, message));

    if (typeof error === 'number') {
      _this.code = error;
    } else {
      _this.code = error.code;
    }

    return _this;
  }

  return P2PError;
}(_wrapNativeSuper(Error));

exports.P2PError = P2PError;

},{}],24:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "P2PClient", {
  enumerable: true,
  get: function get() {
    return _p2pclient.default;
  }
});
Object.defineProperty(exports, "P2PError", {
  enumerable: true,
  get: function get() {
    return _error.P2PError;
  }
});

var _p2pclient = _interopRequireDefault(require("./p2pclient.js"));

var _error = require("./error.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./error.js":23,"./p2pclient.js":25}],25:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0

/* global Map, Promise */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _logger = _interopRequireDefault(require("../base/logger.js"));

var _event = require("../base/event.js");

var Utils = _interopRequireWildcard(require("../base/utils.js"));

var ErrorModule = _interopRequireWildcard(require("./error.js"));

var _peerconnectionChannel = _interopRequireDefault(require("./peerconnection-channel.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ConnectionState = {
  READY: 1,
  CONNECTING: 2,
  CONNECTED: 3
};
/* eslint-disable no-unused-vars */

/**
 * @class P2PClientConfiguration
 * @classDesc Configuration for P2PClient.
 * @memberOf Owt.P2P
 * @hideconstructor
 */

var P2PClientConfiguration = function P2PClientConfiguration() {
  /**
   * @member {?Array<Owt.Base.AudioEncodingParameters>} audioEncoding
   * @instance
   * @desc Encoding parameters for publishing audio tracks.
   * @memberof Owt.P2P.P2PClientConfiguration
   */
  this.audioEncoding = undefined;
  /**
   * @member {?Array<Owt.Base.VideoEncodingParameters>} videoEncoding
   * @instance
   * @desc Encoding parameters for publishing video tracks.
   * @memberof Owt.P2P.P2PClientConfiguration
   */

  this.videoEncoding = undefined;
  /**
   * @member {?RTCConfiguration} rtcConfiguration
   * @instance
   * @memberof Owt.P2P.P2PClientConfiguration
   * @desc It will be used for creating PeerConnection.
   * @see {@link https://www.w3.org/TR/webrtc/#rtcconfiguration-dictionary|RTCConfiguration Dictionary of WebRTC 1.0}.
   * @example
   * // Following object can be set to p2pClientConfiguration.rtcConfiguration.
   * {
   *   iceServers: [{
   *      urls: "stun:example.com:3478"
   *   }, {
   *     urls: [
   *       "turn:example.com:3478?transport=udp",
   *       "turn:example.com:3478?transport=tcp"
   *     ],
   *      credential: "password",
   *      username: "username"
   *   }
   * }
   */

  this.rtcConfiguration = undefined;
};
/* eslint-enable no-unused-vars */

/**
 * @class P2PClient
 * @classDesc The P2PClient handles PeerConnections between different clients.
 * Events:
 *
 * | Event Name            | Argument Type    | Fired when       |
 * | --------------------- | ---------------- | ---------------- |
 * | streamadded           | StreamEvent      | A new stream is sent from remote endpoint. |
 * | messagereceived       | MessageEvent     | A new message is received. |
 * | serverdisconnected    | OwtEvent         | Disconnected from signaling server. |
 *
 * @memberof Owt.P2P
 * @extends Owt.Base.EventDispatcher
 * @constructor
 * @param {?Owt.P2P.P2PClientConfiguration } configuration Configuration for Owt.P2P.P2PClient.
 * @param {Object} signalingChannel A channel for sending and receiving signaling messages.
 */


var P2PClient = function P2PClient(configuration, signalingChannel) {
  Object.setPrototypeOf(this, new _event.EventDispatcher());
  var config = configuration;
  var signaling = signalingChannel;
  var channels = new Map(); // Map of PeerConnectionChannels.

  var self = this;
  var state = ConnectionState.READY;
  var myId;

  signaling.onMessage = function (origin, message) {
    _logger.default.debug('Received signaling message from ' + origin + ': ' + message);

    var data = JSON.parse(message);

    if (data.type === 'chat-closed') {
      if (channels.has(origin)) {
        getOrCreateChannel(origin).onMessage(data);
        channels.delete(origin);
      }

      return;
    }

    if (self.allowedRemoteIds.indexOf(origin) >= 0) {
      getOrCreateChannel(origin).onMessage(data);
    } else {
      sendSignalingMessage(origin, 'chat-closed', ErrorModule.errors.P2P_CLIENT_DENIED);
    }
  };

  signaling.onServerDisconnected = function () {
    state = ConnectionState.READY;
    self.dispatchEvent(new _event.OwtEvent('serverdisconnected'));
  };
  /**
   * @member {array} allowedRemoteIds
   * @memberof Owt.P2P.P2PClient
   * @instance
   * @desc Only allowed remote endpoint IDs are able to publish stream or send message to current endpoint. Removing an ID from allowedRemoteIds does stop existing connection with certain endpoint. Please call stop to stop the PeerConnection.
   */


  this.allowedRemoteIds = [];
  /**
   * @function connect
   * @instance
   * @desc Connect to signaling server. Since signaling can be customized, this method does not define how a token looks like. SDK passes token to signaling channel without changes.
   * @memberof Owt.P2P.P2PClient
   * @param {string} token A token for connecting to signaling server. The format of this token depends on signaling server's requirement.
   * @return {Promise<object, Error>} It returns a promise resolved with an object returned by signaling channel once signaling channel reports connection has been established.
   */

  this.connect = function (token) {
    if (state === ConnectionState.READY) {
      state = ConnectionState.CONNECTING;
    } else {
      _logger.default.warning('Invalid connection state: ' + state);

      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE));
    }

    return new Promise(function (resolve, reject) {
      signaling.connect(token).then(function (id) {
        myId = id;
        state = ConnectionState.CONNECTED;
        resolve(myId);
      }, function (errCode) {
        reject(new ErrorModule.P2PError(ErrorModule.getErrorByCode(errCode)));
      });
    });
  };
  /**
   * @function disconnect
   * @instance
   * @desc Disconnect from the signaling channel. It stops all existing sessions with remote endpoints.
   * @memberof Owt.P2P.P2PClient
   * @returns {Promise<undefined, Error>}
   */


  this.disconnect = function () {
    if (state == ConnectionState.READY) {
      return;
    }

    channels.forEach(function (channel) {
      channel.stop();
    });
    channels.clear();
    signaling.disconnect();
  };
  /**
   * @function publish
   * @instance
   * @desc Publish a stream to a remote endpoint.
   * @memberof Owt.P2P.P2PClient
   * @param {string} remoteId Remote endpoint's ID.
   * @param {Owt.Base.LocalStream} stream An Owt.Base.LocalStream to be published.
   * @return {Promise<Owt.Base.Publication, Error>} A promised that resolves when remote side received the certain stream. However, remote endpoint may not display this stream, or ignore it.
   */


  this.publish = function (remoteId, stream) {
    if (state !== ConnectionState.CONNECTED) {
      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE, 'P2P Client is not connected to signaling channel.'));
    }

    if (this.allowedRemoteIds.indexOf(remoteId) < 0) {
      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_NOT_ALLOWED));
    }

    return Promise.resolve(getOrCreateChannel(remoteId).publish(stream));
  };
  /**
   * @function send
   * @instance
   * @desc Send a message to remote endpoint.
   * @memberof Owt.P2P.P2PClient
   * @param {string} remoteId Remote endpoint's ID.
   * @param {string} message Message to be sent. It should be a string.
   * @return {Promise<undefined, Error>} It returns a promise resolved when remote endpoint received certain message.
   */


  this.send = function (remoteId, message) {
    if (state !== ConnectionState.CONNECTED) {
      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE, 'P2P Client is not connected to signaling channel.'));
    }

    if (this.allowedRemoteIds.indexOf(remoteId) < 0) {
      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_NOT_ALLOWED));
    }

    return Promise.resolve(getOrCreateChannel(remoteId).send(message));
  };
  /**
   * @function stop
   * @instance
   * @desc Clean all resources associated with given remote endpoint. It may include RTCPeerConnection, RTCRtpTransceiver and RTCDataChannel. It still possible to publish a stream, or send a message to given remote endpoint after stop.
   * @memberof Owt.P2P.P2PClient
   * @param {string} remoteId Remote endpoint's ID.
   * @return {undefined}
   */


  this.stop = function (remoteId) {
    if (!channels.has(remoteId)) {
      _logger.default.warning('No PeerConnection between current endpoint and specific remote ' + 'endpoint.');

      return;
    }

    channels.get(remoteId).stop();
    channels.delete(remoteId);
  };
  /**
   * @function getStats
   * @instance
   * @desc Get stats of underlying PeerConnection.
   * @memberof Owt.P2P.P2PClient
   * @param {string} remoteId Remote endpoint's ID.
   * @return {Promise<RTCStatsReport, Error>} It returns a promise resolved with an RTCStatsReport or reject with an Error if there is no connection with specific user.
   */


  this.getStats = function (remoteId) {
    if (!channels.has(remoteId)) {
      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE, 'No PeerConnection between current endpoint and specific remote ' + 'endpoint.'));
    }

    return channels.get(remoteId).getStats();
  };

  var sendSignalingMessage = function sendSignalingMessage(remoteId, type, message) {
    var msg = {
      type: type
    };

    if (message) {
      msg.data = message;
    }

    return signaling.send(remoteId, JSON.stringify(msg)).catch(function (e) {
      if (typeof e === 'number') {
        throw ErrorModule.getErrorByCode(e);
      }
    });
  };

  var getOrCreateChannel = function getOrCreateChannel(remoteId) {
    if (!channels.has(remoteId)) {
      // Construct an signaling sender/receiver for P2PPeerConnection.
      var signalingForChannel = Object.create(_event.EventDispatcher);
      signalingForChannel.sendSignalingMessage = sendSignalingMessage;
      var pcc = new _peerconnectionChannel.default(config, myId, remoteId, signalingForChannel);
      pcc.addEventListener('streamadded', function (streamEvent) {
        self.dispatchEvent(streamEvent);
      });
      pcc.addEventListener('messagereceived', function (messageEvent) {
        self.dispatchEvent(messageEvent);
      });
      pcc.addEventListener('ended', function () {
        channels.delete(remoteId);
      });
      channels.set(remoteId, pcc);
    }

    return channels.get(remoteId);
  };
};

var _default = P2PClient;
exports.default = _default;

},{"../base/event.js":3,"../base/logger.js":5,"../base/utils.js":11,"./error.js":23,"./peerconnection-channel.js":26}],26:[function(require,module,exports){
// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0
// This file doesn't have public APIs.

/* eslint-disable valid-jsdoc */

/* eslint-disable require-jsdoc */

/* global Event, Map, Promise, RTCIceCandidate */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.P2PPeerConnectionChannelEvent = void 0;

var _logger = _interopRequireDefault(require("../base/logger.js"));

var _event = require("../base/event.js");

var _publication = require("../base/publication.js");

var Utils = _interopRequireWildcard(require("../base/utils.js"));

var ErrorModule = _interopRequireWildcard(require("./error.js"));

var StreamModule = _interopRequireWildcard(require("../base/stream.js"));

var SdpUtils = _interopRequireWildcard(require("../base/sdputils.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * @class P2PPeerConnectionChannelEvent
 * @desc Event for Stream.
 * @memberOf Owt.P2P
 * @private
 * */
var P2PPeerConnectionChannelEvent =
/*#__PURE__*/
function (_Event) {
  _inherits(P2PPeerConnectionChannelEvent, _Event);

  /* eslint-disable-next-line require-jsdoc */
  function P2PPeerConnectionChannelEvent(init) {
    var _this;

    _classCallCheck(this, P2PPeerConnectionChannelEvent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(P2PPeerConnectionChannelEvent).call(this, init));
    _this.stream = init.stream;
    return _this;
  }

  return P2PPeerConnectionChannelEvent;
}(_wrapNativeSuper(Event));

exports.P2PPeerConnectionChannelEvent = P2PPeerConnectionChannelEvent;
var DataChannelLabel = {
  MESSAGE: 'message',
  FILE: 'file'
};
var SignalingType = {
  DENIED: 'chat-denied',
  CLOSED: 'chat-closed',
  NEGOTIATION_NEEDED: 'chat-negotiation-needed',
  TRACK_SOURCES: 'chat-track-sources',
  STREAM_INFO: 'chat-stream-info',
  SDP: 'chat-signal',
  TRACKS_ADDED: 'chat-tracks-added',
  TRACKS_REMOVED: 'chat-tracks-removed',
  DATA_RECEIVED: 'chat-data-received',
  UA: 'chat-ua'
};
var sysInfo = Utils.sysInfo();
/**
 * @class P2PPeerConnectionChannel
 * @desc A P2PPeerConnectionChannel handles all interactions between this endpoint and a remote endpoint.
 * @memberOf Owt.P2P
 * @private
 */

var P2PPeerConnectionChannel =
/*#__PURE__*/
function (_EventDispatcher) {
  _inherits(P2PPeerConnectionChannel, _EventDispatcher);

  // |signaling| is an object has a method |sendSignalingMessage|.

  /* eslint-disable-next-line require-jsdoc */
  function P2PPeerConnectionChannel(config, localId, remoteId, signaling) {
    var _this2;

    _classCallCheck(this, P2PPeerConnectionChannel);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(P2PPeerConnectionChannel).call(this));
    _this2._config = config;
    _this2._localId = localId;
    _this2._remoteId = remoteId;
    _this2._signaling = signaling;
    _this2._pc = null;
    _this2._publishedStreams = new Map(); // Key is streams published, value is its publication.

    _this2._pendingStreams = []; // Streams going to be added to PeerConnection.

    _this2._publishingStreams = []; // Streams have been added to PeerConnection, but does not receive ack from remote side.

    _this2._pendingUnpublishStreams = []; // Streams going to be removed.
    // Key is MediaStream's ID, value is an object {source:{audio:string, video:string}, attributes: object, stream: RemoteStream, mediaStream: MediaStream}. `stream` and `mediaStream` will be set when `track` event is fired on `RTCPeerConnection`. `mediaStream` will be `null` after `streamadded` event is fired on `P2PClient`. Other propertes will be set upon `STREAM_INFO` event from signaling channel.

    _this2._remoteStreamInfo = new Map();
    _this2._remoteStreams = [];
    _this2._remoteTrackSourceInfo = new Map(); // Key is MediaStreamTrack's ID, value is source info.

    _this2._publishPromises = new Map(); // Key is MediaStream's ID, value is an object has |resolve| and |reject|.

    _this2._unpublishPromises = new Map(); // Key is MediaStream's ID, value is an object has |resolve| and |reject|.

    _this2._publishingStreamTracks = new Map(); // Key is MediaStream's ID, value is an array of the ID of its MediaStreamTracks that haven't been acked.

    _this2._publishedStreamTracks = new Map(); // Key is MediaStream's ID, value is an array of the ID of its MediaStreamTracks that haven't been removed.

    _this2._isNegotiationNeeded = false;
    _this2._remoteSideSupportsRemoveStream = true;
    _this2._remoteSideSupportsPlanB = true;
    _this2._remoteSideSupportsUnifiedPlan = true;
    _this2._remoteIceCandidates = [];
    _this2._dataChannels = new Map(); // Key is data channel's label, value is a RTCDataChannel.

    _this2._pendingMessages = [];
    _this2._dataSeq = 1; // Sequence number for data channel messages.

    _this2._sendDataPromises = new Map(); // Key is data sequence number, value is an object has |resolve| and |reject|.

    _this2._addedTrackIds = []; // Tracks that have been added after receiving remote SDP but before connection is established. Draining these messages when ICE connection state is connected.

    _this2._isCaller = true;
    _this2._infoSent = false;
    _this2._disposed = false;

    _this2._createPeerConnection();

    return _this2;
  }
  /**
   * @function publish
   * @desc Publish a stream to the remote endpoint.
   * @private
   */


  _createClass(P2PPeerConnectionChannel, [{
    key: "publish",
    value: function publish(stream) {
      var _this3 = this;

      if (!(stream instanceof StreamModule.LocalStream)) {
        return Promise.reject(new TypeError('Invalid stream.'));
      }

      if (this._publishedStreams.has(stream)) {
        return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_ILLEGAL_ARGUMENT, 'Duplicated stream.'));
      }

      if (this._areAllTracksEnded(stream.mediaStream)) {
        return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE, 'All tracks are ended.'));
      }

      return Promise.all([this._sendClosedMsgIfNecessary(), this._sendSysInfoIfNecessary(), this._sendStreamInfo(stream)]).then(function () {
        return new Promise(function (resolve, reject) {
          // Replace |addStream| with PeerConnection.addTrack when all browsers are ready.
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = stream.mediaStream.getTracks()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var track = _step.value;

              _this3._pc.addTrack(track, stream.mediaStream);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          _this3._onNegotiationneeded();

          _this3._publishingStreams.push(stream);

          var trackIds = Array.from(stream.mediaStream.getTracks(), function (track) {
            return track.id;
          });

          _this3._publishingStreamTracks.set(stream.mediaStream.id, trackIds);

          _this3._publishPromises.set(stream.mediaStream.id, {
            resolve: resolve,
            reject: reject
          });
        });
      });
    }
    /**
     * @function send
     * @desc Send a message to the remote endpoint.
     * @private
     */

  }, {
    key: "send",
    value: function send(message) {
      var _this4 = this;

      if (!(typeof message === 'string')) {
        return Promise.reject(new TypeError('Invalid message.'));
      }

      var data = {
        id: this._dataSeq++,
        data: message
      };
      var promise = new Promise(function (resolve, reject) {
        _this4._sendDataPromises.set(data.id, {
          resolve: resolve,
          reject: reject
        });
      });

      if (!this._dataChannels.has(DataChannelLabel.MESSAGE)) {
        this._createDataChannel(DataChannelLabel.MESSAGE);
      }

      this._sendClosedMsgIfNecessary().catch(function (err) {
        _logger.default.debug('Failed to send closed message.' + err.message);
      });

      this._sendSysInfoIfNecessary().catch(function (err) {
        _logger.default.debug('Failed to send sysInfo.' + err.message);
      });

      var dc = this._dataChannels.get(DataChannelLabel.MESSAGE);

      if (dc.readyState === 'open') {
        this._dataChannels.get(DataChannelLabel.MESSAGE).send(JSON.stringify(data));
      } else {
        this._pendingMessages.push(data);
      }

      return promise;
    }
    /**
     * @function stop
     * @desc Stop the connection with remote endpoint.
     * @private
     */

  }, {
    key: "stop",
    value: function stop() {
      this._stop(undefined, true);
    }
    /**
     * @function getStats
     * @desc Get stats for a specific MediaStream.
     * @private
     */

  }, {
    key: "getStats",
    value: function getStats(mediaStream) {
      var _this5 = this;

      if (this._pc) {
        if (mediaStream === undefined) {
          return this._pc.getStats();
        } else {
          var tracksStatsReports = [];
          return Promise.all([mediaStream.getTracks().forEach(function (track) {
            _this5._getStats(track, tracksStatsReports);
          })]).then(function () {
            return new Promise(function (resolve, reject) {
              resolve(tracksStatsReports);
            });
          });
        }
      } else {
        return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE));
      }
    }
  }, {
    key: "_getStats",
    value: function _getStats(mediaStreamTrack, reportsResult) {
      return this._pc.getStats(mediaStreamTrack).then(function (statsReport) {
        reportsResult.push(statsReport);
      });
    }
    /**
     * @function onMessage
     * @desc This method is called by P2PClient when there is new signaling message arrived.
     * @private
     */

  }, {
    key: "onMessage",
    value: function onMessage(message) {
      this._SignalingMesssageHandler(message);
    }
  }, {
    key: "_sendSdp",
    value: function _sendSdp(sdp) {
      return this._signaling.sendSignalingMessage(this._remoteId, SignalingType.SDP, sdp);
    }
  }, {
    key: "_sendSignalingMessage",
    value: function _sendSignalingMessage(type, message) {
      return this._signaling.sendSignalingMessage(this._remoteId, type, message);
    }
  }, {
    key: "_SignalingMesssageHandler",
    value: function _SignalingMesssageHandler(message) {
      _logger.default.debug('Channel received message: ' + message);

      switch (message.type) {
        case SignalingType.UA:
          this._handleRemoteCapability(message.data);

          this._sendSysInfoIfNecessary();

          break;

        case SignalingType.TRACK_SOURCES:
          this._trackSourcesHandler(message.data);

          break;

        case SignalingType.STREAM_INFO:
          this._streamInfoHandler(message.data);

          break;

        case SignalingType.SDP:
          this._sdpHandler(message.data);

          break;

        case SignalingType.TRACKS_ADDED:
          this._tracksAddedHandler(message.data);

          break;

        case SignalingType.TRACKS_REMOVED:
          this._tracksRemovedHandler(message.data);

          break;

        case SignalingType.DATA_RECEIVED:
          this._dataReceivedHandler(message.data);

          break;

        case SignalingType.CLOSED:
          this._chatClosedHandler(message.data);

          break;

        default:
          _logger.default.error('Invalid signaling message received. Type: ' + message.type);

      }
    }
    /**
     * @function _tracksAddedHandler
     * @desc Handle track added event from remote side.
     * @private
     */

  }, {
    key: "_tracksAddedHandler",
    value: function _tracksAddedHandler(ids) {
      var _this6 = this;

      // Currently, |ids| contains all track IDs of a MediaStream. Following algorithm also handles |ids| is a part of a MediaStream's tracks.
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        var _loop = function _loop() {
          var id = _step2.value;

          // It could be a problem if there is a track published with different MediaStreams.
          _this6._publishingStreamTracks.forEach(function (mediaTrackIds, mediaStreamId) {
            for (var i = 0; i < mediaTrackIds.length; i++) {
              if (mediaTrackIds[i] === id) {
                // Move this track from publishing tracks to published tracks.
                if (!_this6._publishedStreamTracks.has(mediaStreamId)) {
                  _this6._publishedStreamTracks.set(mediaStreamId, []);
                }

                _this6._publishedStreamTracks.get(mediaStreamId).push(mediaTrackIds[i]);

                mediaTrackIds.splice(i, 1);
              } // Resolving certain publish promise when remote endpoint received all tracks of a MediaStream.


              if (mediaTrackIds.length == 0) {
                var _ret = function () {
                  if (!_this6._publishPromises.has(mediaStreamId)) {
                    _logger.default.warning('Cannot find the promise for publishing ' + mediaStreamId);

                    return "continue";
                  }

                  var targetStreamIndex = _this6._publishingStreams.findIndex(function (element) {
                    return element.mediaStream.id == mediaStreamId;
                  });

                  var targetStream = _this6._publishingStreams[targetStreamIndex];

                  _this6._publishingStreams.splice(targetStreamIndex, 1);

                  var publication = new _publication.Publication(id, function () {
                    _this6._unpublish(targetStream).then(function () {
                      publication.dispatchEvent(new _event.OwtEvent('ended'));
                    }, function (err) {
                      // Use debug mode because this error usually doesn't block stopping a publication.
                      _logger.default.debug('Something wrong happened during stopping a ' + 'publication. ' + err.message);
                    });
                  }, function () {
                    if (!targetStream || !targetStream.mediaStream) {
                      return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_INVALID_STATE, 'Publication is not available.'));
                    }

                    return _this6.getStats(targetStream.mediaStream);
                  });

                  _this6._publishedStreams.set(targetStream, publication);

                  _this6._publishPromises.get(mediaStreamId).resolve(publication);

                  _this6._publishPromises.delete(mediaStreamId);
                }();

                if (_ret === "continue") continue;
              }
            }
          });
        };

        for (var _iterator2 = ids[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
    /**
     * @function _tracksRemovedHandler
     * @desc Handle track removed event from remote side.
     * @private
     */

  }, {
    key: "_tracksRemovedHandler",
    value: function _tracksRemovedHandler(ids) {
      var _this7 = this;

      // Currently, |ids| contains all track IDs of a MediaStream. Following algorithm also handles |ids| is a part of a MediaStream's tracks.
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        var _loop2 = function _loop2() {
          var id = _step3.value;

          // It could be a problem if there is a track published with different MediaStreams.
          _this7._publishedStreamTracks.forEach(function (mediaTrackIds, mediaStreamId) {
            for (var i = 0; i < mediaTrackIds.length; i++) {
              if (mediaTrackIds[i] === id) {
                mediaTrackIds.splice(i, 1);
              }
            }
          });
        };

        for (var _iterator3 = ids[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          _loop2();
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
    /**
     * @function _dataReceivedHandler
     * @desc Handle data received event from remote side.
     * @private
     */

  }, {
    key: "_dataReceivedHandler",
    value: function _dataReceivedHandler(id) {
      if (!this._sendDataPromises.has(id)) {
        _logger.default.warning('Received unknown data received message. ID: ' + id);

        return;
      } else {
        this._sendDataPromises.get(id).resolve();
      }
    }
    /**
     * @function _sdpHandler
     * @desc Handle SDP received event from remote side.
     * @private
     */

  }, {
    key: "_sdpHandler",
    value: function _sdpHandler(sdp) {
      if (sdp.type === 'offer') {
        this._onOffer(sdp);
      } else if (sdp.type === 'answer') {
        this._onAnswer(sdp);
      } else if (sdp.type === 'candidates') {
        this._onRemoteIceCandidate(sdp);
      }
    }
    /**
     * @function _trackSourcesHandler
     * @desc Received track source information from remote side.
     * @private
     */

  }, {
    key: "_trackSourcesHandler",
    value: function _trackSourcesHandler(data) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = data[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var info = _step4.value;

          this._remoteTrackSourceInfo.set(info.id, info.source);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
    /**
     * @function _streamInfoHandler
     * @desc Received stream information from remote side.
     * @private
     */

  }, {
    key: "_streamInfoHandler",
    value: function _streamInfoHandler(data) {
      if (!data) {
        _logger.default.warning('Unexpected stream info.');

        return;
      }

      this._remoteStreamInfo.set(data.id, {
        source: data.source,
        attributes: data.attributes,
        stream: null,
        mediaStream: null,
        trackIds: data.tracks // Track IDs may not match at sender and receiver sides. Keep it for legacy porposes.

      });
    }
    /**
     * @function _chatClosedHandler
     * @desc Received chat closed event from remote side.
     * @private
     */

  }, {
    key: "_chatClosedHandler",
    value: function _chatClosedHandler(data) {
      this._disposed = true;

      this._stop(data, false);
    }
  }, {
    key: "_onOffer",
    value: function _onOffer(sdp) {
      var _this8 = this;

      _logger.default.debug('About to set remote description. Signaling state: ' + this._pc.signalingState);

      sdp.sdp = this._setRtpSenderOptions(sdp.sdp, this._config); // Firefox only has one codec in answer, which does not truly reflect its
      // decoding capability. So we set codec preference to remote offer, and let
      // Firefox choose its preferred codec.
      // Reference: https://bugzilla.mozilla.org/show_bug.cgi?id=814227.

      if (Utils.isFirefox()) {
        sdp.sdp = this._setCodecOrder(sdp.sdp);
      }

      var sessionDescription = new RTCSessionDescription(sdp);

      this._pc.setRemoteDescription(sessionDescription).then(function () {
        _this8._createAndSendAnswer();
      }, function (error) {
        _logger.default.debug('Set remote description failed. Message: ' + error.message);

        _this8._stop(error, true);
      });
    }
  }, {
    key: "_onAnswer",
    value: function _onAnswer(sdp) {
      var _this9 = this;

      _logger.default.debug('About to set remote description. Signaling state: ' + this._pc.signalingState);

      sdp.sdp = this._setRtpSenderOptions(sdp.sdp, this._config);
      var sessionDescription = new RTCSessionDescription(sdp);

      this._pc.setRemoteDescription(new RTCSessionDescription(sessionDescription)).then(function () {
        _logger.default.debug('Set remote descripiton successfully.');

        _this9._drainPendingMessages();
      }, function (error) {
        _logger.default.debug('Set remote description failed. Message: ' + error.message);

        _this9._stop(error, true);
      });
    }
  }, {
    key: "_onLocalIceCandidate",
    value: function _onLocalIceCandidate(event) {
      if (event.candidate) {
        this._sendSdp({
          type: 'candidates',
          candidate: event.candidate.candidate,
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex
        }).catch(function (e) {
          _logger.default.warning('Failed to send candidate.');
        });
      } else {
        _logger.default.debug('Empty candidate.');
      }
    }
  }, {
    key: "_onRemoteTrackAdded",
    value: function _onRemoteTrackAdded(event) {
      _logger.default.debug('Remote track added.');

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = event.streams[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var stream = _step5.value;

          if (!this._remoteStreamInfo.has(stream.id)) {
            _logger.default.warning('Missing stream info.');

            return;
          }

          if (!this._remoteStreamInfo.get(stream.id).stream) {
            this._setStreamToRemoteStreamInfo(stream);
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      if (this._pc.iceConnectionState === 'connected' || this._pc.iceConnectionState === 'completed') {
        this._checkIceConnectionStateAndFireEvent();
      } else {
        this._addedTrackIds.concat(event.track.id);
      }
    }
  }, {
    key: "_onRemoteStreamAdded",
    value: function _onRemoteStreamAdded(event) {
      _logger.default.debug('Remote stream added.');

      if (!this._remoteStreamInfo.has(event.stream.id)) {
        _logger.default.warning('Cannot find source info for stream ' + event.stream.id);

        return;
      }

      if (this._pc.iceConnectionState === 'connected' || this._pc.iceConnectionState === 'completed') {
        this._sendSignalingMessage(SignalingType.TRACKS_ADDED, this._remoteStreamInfo.get(event.stream.id).trackIds);
      } else {
        this._addedTrackIds = this._addedTrackIds.concat(this._remoteStreamInfo.get(event.stream.id).trackIds);
      }

      var audioTrackSource = this._remoteStreamInfo.get(event.stream.id).source.audio;

      var videoTrackSource = this._remoteStreamInfo.get(event.stream.id).source.video;

      var sourceInfo = new StreamModule.StreamSourceInfo(audioTrackSource, videoTrackSource);

      if (Utils.isSafari()) {
        if (!sourceInfo.audio) {
          event.stream.getAudioTracks().forEach(function (track) {
            event.stream.removeTrack(track);
          });
        }

        if (!sourceInfo.video) {
          event.stream.getVideoTracks().forEach(function (track) {
            event.stream.removeTrack(track);
          });
        }
      }

      var attributes = this._remoteStreamInfo.get(event.stream.id).attributes;

      var stream = new StreamModule.RemoteStream(undefined, this._remoteId, event.stream, sourceInfo, attributes);

      if (stream) {
        this._remoteStreams.push(stream);

        var streamEvent = new StreamModule.StreamEvent('streamadded', {
          stream: stream
        });
        this.dispatchEvent(streamEvent);
      }
    }
  }, {
    key: "_onRemoteStreamRemoved",
    value: function _onRemoteStreamRemoved(event) {
      _logger.default.debug('Remote stream removed.');

      var i = this._remoteStreams.findIndex(function (s) {
        return s.mediaStream.id === event.stream.id;
      });

      if (i !== -1) {
        var stream = this._remoteStreams[i];

        this._streamRemoved(stream);

        this._remoteStreams.splice(i, 1);
      }
    }
  }, {
    key: "_onNegotiationneeded",
    value: function _onNegotiationneeded() {
      // This is intented to be executed when onnegotiationneeded event is fired.
      // However, onnegotiationneeded may fire mutiple times when more than one
      // track is added/removed. So we manually execute this function after
      // adding/removing track and creating data channel.
      _logger.default.debug('On negotiation needed.');

      if (this._pc.signalingState === 'stable') {
        this._doNegotiate();
      } else {
        this._isNegotiationNeeded = true;
      }
    }
  }, {
    key: "_onRemoteIceCandidate",
    value: function _onRemoteIceCandidate(candidateInfo) {
      var candidate = new RTCIceCandidate({
        candidate: candidateInfo.candidate,
        sdpMid: candidateInfo.sdpMid,
        sdpMLineIndex: candidateInfo.sdpMLineIndex
      });

      if (this._pc.remoteDescription && this._pc.remoteDescription.sdp !== '') {
        _logger.default.debug('Add remote ice candidates.');

        this._pc.addIceCandidate(candidate).catch(function (error) {
          _logger.default.warning('Error processing ICE candidate: ' + error);
        });
      } else {
        _logger.default.debug('Cache remote ice candidates.');

        this._remoteIceCandidates.push(candidate);
      }
    }
  }, {
    key: "_onSignalingStateChange",
    value: function _onSignalingStateChange(event) {
      _logger.default.debug('Signaling state changed: ' + this._pc.signalingState);

      if (this._pc.signalingState === 'closed') {// stopChatLocally(peer, peer.id);
      } else if (this._pc.signalingState === 'stable') {
        this._negotiating = false;

        if (this._isNegotiationNeeded) {
          this._onNegotiationneeded();
        } else {
          this._drainPendingStreams();

          this._drainPendingMessages();
        }
      } else if (this._pc.signalingState === 'have-remote-offer') {
        this._drainPendingRemoteIceCandidates();
      }
    }
  }, {
    key: "_onIceConnectionStateChange",
    value: function _onIceConnectionStateChange(event) {
      if (event.currentTarget.iceConnectionState === 'closed' || event.currentTarget.iceConnectionState === 'failed') {
        var _error = new ErrorModule.P2PError(ErrorModule.errors.P2P_WEBRTC_UNKNOWN, 'ICE connection failed or closed.');

        this._stop(_error, true);
      } else if (event.currentTarget.iceConnectionState === 'connected' || event.currentTarget.iceConnectionState === 'completed') {
        this._sendSignalingMessage(SignalingType.TRACKS_ADDED, this._addedTrackIds);

        this._addedTrackIds = [];

        this._checkIceConnectionStateAndFireEvent();
      }
    }
  }, {
    key: "_onDataChannelMessage",
    value: function _onDataChannelMessage(event) {
      var message = JSON.parse(event.data);

      _logger.default.debug('Data channel message received: ' + message.data);

      this._sendSignalingMessage(SignalingType.DATA_RECEIVED, message.id);

      var messageEvent = new _event.MessageEvent('messagereceived', {
        message: message.data,
        origin: this._remoteId
      });
      this.dispatchEvent(messageEvent);
    }
  }, {
    key: "_onDataChannelOpen",
    value: function _onDataChannelOpen(event) {
      _logger.default.debug('Data Channel is opened.');

      if (event.target.label === DataChannelLabel.MESSAGE) {
        _logger.default.debug('Data channel for messages is opened.');

        this._drainPendingMessages();
      }
    }
  }, {
    key: "_onDataChannelClose",
    value: function _onDataChannelClose(event) {
      _logger.default.debug('Data Channel is closed.');
    }
  }, {
    key: "_streamRemoved",
    value: function _streamRemoved(stream) {
      if (!this._remoteStreamInfo.has(stream.mediaStream.id)) {
        _logger.default.warning('Cannot find stream info.');
      }

      this._sendSignalingMessage(SignalingType.TRACKS_REMOVED, this._remoteStreamInfo.get(stream.mediaStream.id).trackIds);

      var event = new _event.OwtEvent('ended');
      stream.dispatchEvent(event);
    }
  }, {
    key: "_isUnifiedPlan",
    value: function _isUnifiedPlan() {
      if (Utils.isFirefox()) {
        return true;
      }

      var pc = new RTCPeerConnection({
        sdpSemantics: 'unified-plan'
      });
      return pc.getConfiguration() && pc.getConfiguration().sdpSemantics === 'plan-b';
    }
  }, {
    key: "_createPeerConnection",
    value: function _createPeerConnection() {
      var _this10 = this;

      var pcConfiguration = this._config.rtcConfiguration || {};

      if (Utils.isChrome()) {
        pcConfiguration.sdpSemantics = 'unified-plan';
      }

      this._pc = new RTCPeerConnection(pcConfiguration); // Firefox 59 implemented addTransceiver. However, mid in SDP will differ from track's ID in this case. And transceiver's mid is null.

      if (typeof this._pc.addTransceiver === 'function' && Utils.isSafari()) {
        this._pc.addTransceiver('audio');

        this._pc.addTransceiver('video');
      }

      if (!this._isUnifiedPlan()) {
        this._pc.onaddstream = function (event) {
          // TODO: Legacy API, should be removed when all UAs implemented WebRTC 1.0.
          _this10._onRemoteStreamAdded.apply(_this10, [event]);
        };

        this._pc.onremovestream = function (event) {
          _this10._onRemoteStreamRemoved.apply(_this10, [event]);
        };
      } else {
        this._pc.ontrack = function (event) {
          _this10._onRemoteTrackAdded.apply(_this10, [event]);
        };
      }

      this._pc.onicecandidate = function (event) {
        _this10._onLocalIceCandidate.apply(_this10, [event]);
      };

      this._pc.onsignalingstatechange = function (event) {
        _this10._onSignalingStateChange.apply(_this10, [event]);
      };

      this._pc.ondatachannel = function (event) {
        _logger.default.debug('On data channel.'); // Save remote created data channel.


        if (!_this10._dataChannels.has(event.channel.label)) {
          _this10._dataChannels.set(event.channel.label, event.channel);

          _logger.default.debug('Save remote created data channel.');
        }

        _this10._bindEventsToDataChannel(event.channel);
      };

      this._pc.oniceconnectionstatechange = function (event) {
        _this10._onIceConnectionStateChange.apply(_this10, [event]);
      };
      /*
      this._pc.oniceChannelStatechange = function(event) {
        _onIceChannelStateChange(peer, event);
      };
       = function() {
        onNegotiationneeded(peers[peer.id]);
      };
       //DataChannel
      this._pc.ondatachannel = function(event) {
        Logger.debug(myId + ': On data channel');
        // Save remote created data channel.
        if (!peer.dataChannels[event.channel.label]) {
          peer.dataChannels[event.channel.label] = event.channel;
          Logger.debug('Save remote created data channel.');
        }
        bindEventsToDataChannel(event.channel, peer);
      };*/

    }
  }, {
    key: "_drainPendingStreams",
    value: function _drainPendingStreams() {
      var negotiationNeeded = false;

      _logger.default.debug('Draining pending streams.');

      if (this._pc && this._pc.signalingState === 'stable') {
        _logger.default.debug('Peer connection is ready for draining pending streams.');

        for (var i = 0; i < this._pendingStreams.length; i++) {
          var stream = this._pendingStreams[i]; // OnNegotiationNeeded event will be triggered immediately after adding stream to PeerConnection in Firefox.
          // And OnNegotiationNeeded handler will execute drainPendingStreams. To avoid add the same stream multiple times,
          // shift it from pending stream list before adding it to PeerConnection.

          this._pendingStreams.shift();

          if (!stream.mediaStream) {
            continue;
          }

          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = stream.mediaStream.getTracks()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var track = _step6.value;

              this._pc.addTrack(track, stream.mediaStream);

              negotiationNeeded = true;
            }
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
                _iterator6.return();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }

          _logger.default.debug('Added stream to peer connection.');

          this._publishingStreams.push(stream);
        }

        this._pendingStreams.length = 0;

        for (var j = 0; j < this._pendingUnpublishStreams.length; j++) {
          if (!this._pendingUnpublishStreams[j].mediaStream) {
            continue;
          }

          this._pc.removeStream(this._pendingUnpublishStreams[j].mediaStream);

          negotiationNeeded = true;

          this._unpublishPromises.get(this._pendingUnpublishStreams[j].mediaStream.id).resolve();

          this._publishedStreams.delete(this._pendingUnpublishStreams[j]);

          _logger.default.debug('Remove stream.');
        }

        this._pendingUnpublishStreams.length = 0;
      }

      if (negotiationNeeded) {
        this._onNegotiationneeded();
      }
    }
  }, {
    key: "_drainPendingRemoteIceCandidates",
    value: function _drainPendingRemoteIceCandidates() {
      for (var i = 0; i < this._remoteIceCandidates.length; i++) {
        _logger.default.debug('Add candidate');

        this._pc.addIceCandidate(this._remoteIceCandidates[i]).catch(function (error) {
          _logger.default.warning('Error processing ICE candidate: ' + error);
        });
      }

      this._remoteIceCandidates.length = 0;
    }
  }, {
    key: "_drainPendingMessages",
    value: function _drainPendingMessages() {
      _logger.default.debug('Draining pending messages.');

      if (this._pendingMessages.length == 0) {
        return;
      }

      var dc = this._dataChannels.get(DataChannelLabel.MESSAGE);

      if (dc && dc.readyState === 'open') {
        for (var i = 0; i < this._pendingMessages.length; i++) {
          _logger.default.debug('Sending message via data channel: ' + this._pendingMessages[i]);

          dc.send(JSON.stringify(this._pendingMessages[i]));
        }

        this._pendingMessages.length = 0;
      } else if (this._pc && !dc) {
        this._createDataChannel(DataChannelLabel.MESSAGE);
      }
    }
  }, {
    key: "_sendStreamInfo",
    value: function _sendStreamInfo(stream) {
      if (!stream || !stream.mediaStream) {
        return new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_ILLEGAL_ARGUMENT);
      }

      var info = [];
      stream.mediaStream.getTracks().map(function (track) {
        info.push({
          id: track.id,
          source: stream.source[track.kind]
        });
      });
      return Promise.all([this._sendSignalingMessage(SignalingType.TRACK_SOURCES, info), this._sendSignalingMessage(SignalingType.STREAM_INFO, {
        id: stream.mediaStream.id,
        attributes: stream.attributes,
        // Track IDs may not match at sender and receiver sides.
        tracks: Array.from(info, function (item) {
          return item.id;
        }),
        // This is a workaround for Safari. Please use track-sources if possible.
        source: stream.source
      })]);
    }
  }, {
    key: "_sendSysInfoIfNecessary",
    value: function _sendSysInfoIfNecessary() {
      if (this._infoSent) {
        return Promise.resolve();
      }

      this._infoSent = true;
      return this._sendSignalingMessage(SignalingType.UA, sysInfo);
    }
  }, {
    key: "_sendClosedMsgIfNecessary",
    value: function _sendClosedMsgIfNecessary() {
      if (this._pc.remoteDescription === null || this._pc.remoteDescription.sdp === '') {
        return this._sendSignalingMessage(SignalingType.CLOSED);
      }

      return Promise.resolve();
    }
  }, {
    key: "_handleRemoteCapability",
    value: function _handleRemoteCapability(ua) {
      if (ua.sdk && ua.sdk && ua.sdk.type === 'JavaScript' && ua.runtime && ua.runtime.name === 'Firefox') {
        this._remoteSideSupportsRemoveStream = false;
        this._remoteSideSupportsPlanB = false;
        this._remoteSideSupportsUnifiedPlan = true;
      } else {
        // Remote side is iOS/Android/C++ which uses Google's WebRTC stack.
        this._remoteSideSupportsRemoveStream = true;
        this._remoteSideSupportsPlanB = true;
        this._remoteSideSupportsUnifiedPlan = false;
      }
    }
  }, {
    key: "_doNegotiate",
    value: function _doNegotiate() {
      this._createAndSendOffer();
    }
  }, {
    key: "_setCodecOrder",
    value: function _setCodecOrder(sdp) {
      if (this._config.audioEncodings) {
        var audioCodecNames = Array.from(this._config.audioEncodings, function (encodingParameters) {
          return encodingParameters.codec.name;
        });
        sdp = SdpUtils.reorderCodecs(sdp, 'audio', audioCodecNames);
      }

      if (this._config.videoEncodings) {
        var videoCodecNames = Array.from(this._config.videoEncodings, function (encodingParameters) {
          return encodingParameters.codec.name;
        });
        sdp = SdpUtils.reorderCodecs(sdp, 'video', videoCodecNames);
      }

      return sdp;
    }
  }, {
    key: "_setMaxBitrate",
    value: function _setMaxBitrate(sdp, options) {
      if (_typeof(options.audioEncodings) === 'object') {
        sdp = SdpUtils.setMaxBitrate(sdp, options.audioEncodings);
      }

      if (_typeof(options.videoEncodings) === 'object') {
        sdp = SdpUtils.setMaxBitrate(sdp, options.videoEncodings);
      }

      return sdp;
    }
  }, {
    key: "_setRtpSenderOptions",
    value: function _setRtpSenderOptions(sdp, options) {
      sdp = this._setMaxBitrate(sdp, options);
      return sdp;
    }
  }, {
    key: "_setRtpReceiverOptions",
    value: function _setRtpReceiverOptions(sdp) {
      sdp = this._setCodecOrder(sdp);
      return sdp;
    }
  }, {
    key: "_createAndSendOffer",
    value: function _createAndSendOffer() {
      var _this11 = this;

      if (!this._pc) {
        _logger.default.error('Peer connection have not been created.');

        return;
      }

      this._isNegotiationNeeded = false;
      this._isCaller = true;
      var localDesc;

      this._pc.createOffer().then(function (desc) {
        desc.sdp = _this11._setRtpReceiverOptions(desc.sdp);
        localDesc = desc;

        if (_this11._pc.signalingState === 'stable') {
          return _this11._pc.setLocalDescription(desc).then(function () {
            return _this11._sendSdp(localDesc);
          });
        }
      }).catch(function (e) {
        _logger.default.error(e.message + ' Please check your codec settings.');

        var error = new ErrorModule.P2PError(ErrorModule.errors.P2P_WEBRTC_SDP, e.message);

        _this11._stop(error, true);
      });
    }
  }, {
    key: "_createAndSendAnswer",
    value: function _createAndSendAnswer() {
      var _this12 = this;

      this._drainPendingStreams();

      this._isNegotiationNeeded = false;
      this._isCaller = false;
      var localDesc;

      this._pc.createAnswer().then(function (desc) {
        desc.sdp = _this12._setRtpReceiverOptions(desc.sdp);
        localDesc = desc;

        _this12._logCurrentAndPendingLocalDescription();

        return _this12._pc.setLocalDescription(desc);
      }).then(function () {
        return _this12._sendSdp(localDesc);
      }).catch(function (e) {
        _logger.default.error(e.message + ' Please check your codec settings.');

        var error = new ErrorModule.P2PError(ErrorModule.errors.P2P_WEBRTC_SDP, e.message);

        _this12._stop(error, true);
      });
    }
  }, {
    key: "_logCurrentAndPendingLocalDescription",
    value: function _logCurrentAndPendingLocalDescription() {
      _logger.default.info('Current description: ' + this._pc.currentLocalDescription);

      _logger.default.info('Pending description: ' + this._pc.pendingLocalDescription);
    }
  }, {
    key: "_getAndDeleteTrackSourceInfo",
    value: function _getAndDeleteTrackSourceInfo(tracks) {
      if (tracks.length > 0) {
        var trackId = tracks[0].id;

        if (this._remoteTrackSourceInfo.has(trackId)) {
          var sourceInfo = this._remoteTrackSourceInfo.get(trackId);

          this._remoteTrackSourceInfo.delete(trackId);

          return sourceInfo;
        } else {
          _logger.default.warning('Cannot find source info for ' + trackId);
        }
      }
    }
  }, {
    key: "_unpublish",
    value: function _unpublish(stream) {
      var _this13 = this;

      if (navigator.mozGetUserMedia || !this._remoteSideSupportsRemoveStream) {
        // Actually unpublish is supported. It is a little bit complex since Firefox implemented WebRTC spec while Chrome implemented an old API.
        _logger.default.error('Stopping a publication is not supported on Firefox. Please use P2PClient.stop() to stop the connection with remote endpoint.');

        return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_UNSUPPORTED_METHOD));
      }

      if (!this._publishedStreams.has(stream)) {
        return Promise.reject(new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_ILLEGAL_ARGUMENT));
      }

      this._pendingUnpublishStreams.push(stream);

      return new Promise(function (resolve, reject) {
        _this13._unpublishPromises.set(stream.mediaStream.id, {
          resolve: resolve,
          reject: reject
        });

        _this13._drainPendingStreams();
      });
    } // Make sure |_pc| is available before calling this method.

  }, {
    key: "_createDataChannel",
    value: function _createDataChannel(label) {
      if (this._dataChannels.has(label)) {
        _logger.default.warning('Data channel labeled ' + label + ' already exists.');

        return;
      }

      if (!this._pc) {
        _logger.default.debug('PeerConnection is not available before creating DataChannel.');

        return;
      }

      _logger.default.debug('Create data channel.');

      var dc = this._pc.createDataChannel(label);

      this._bindEventsToDataChannel(dc);

      this._dataChannels.set(DataChannelLabel.MESSAGE, dc);

      this._onNegotiationneeded();
    }
  }, {
    key: "_bindEventsToDataChannel",
    value: function _bindEventsToDataChannel(dc) {
      var _this14 = this;

      dc.onmessage = function (event) {
        _this14._onDataChannelMessage.apply(_this14, [event]);
      };

      dc.onopen = function (event) {
        _this14._onDataChannelOpen.apply(_this14, [event]);
      };

      dc.onclose = function (event) {
        _this14._onDataChannelClose.apply(_this14, [event]);
      };

      dc.onerror = function (event) {
        _logger.default.debug('Data Channel Error:', error);
      };
    } // Returns all MediaStreams it belongs to.

  }, {
    key: "_getStreamByTrack",
    value: function _getStreamByTrack(mediaStreamTrack) {
      var streams = [];
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = this._remoteStreamInfo[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var _step7$value = _slicedToArray(_step7.value, 2),
              id = _step7$value[0],
              info = _step7$value[1];

          if (!info.stream || !info.stream.mediaStream) {
            continue;
          }

          var _iteratorNormalCompletion8 = true;
          var _didIteratorError8 = false;
          var _iteratorError8 = undefined;

          try {
            for (var _iterator8 = info.stream.mediaStream.getTracks()[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
              var track = _step8.value;

              if (mediaStreamTrack === track) {
                streams.push(info.stream.mediaStream);
              }
            }
          } catch (err) {
            _didIteratorError8 = true;
            _iteratorError8 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
                _iterator8.return();
              }
            } finally {
              if (_didIteratorError8) {
                throw _iteratorError8;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      return streams;
    }
  }, {
    key: "_areAllTracksEnded",
    value: function _areAllTracksEnded(mediaStream) {
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = mediaStream.getTracks()[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var track = _step9.value;

          if (track.readyState === 'live') {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
            _iterator9.return();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }

      return true;
    }
  }, {
    key: "_stop",
    value: function _stop(error, notifyRemote) {
      var promiseError = error;

      if (!promiseError) {
        promiseError = new ErrorModule.P2PError(ErrorModule.errors.P2P_CLIENT_UNKNOWN);
      }

      var _iteratorNormalCompletion10 = true;
      var _didIteratorError10 = false;
      var _iteratorError10 = undefined;

      try {
        for (var _iterator10 = this._dataChannels[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
          var _step10$value = _slicedToArray(_step10.value, 2),
              label = _step10$value[0],
              dc = _step10$value[1];

          dc.close();
        }
      } catch (err) {
        _didIteratorError10 = true;
        _iteratorError10 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion10 && _iterator10.return != null) {
            _iterator10.return();
          }
        } finally {
          if (_didIteratorError10) {
            throw _iteratorError10;
          }
        }
      }

      this._dataChannels.clear();

      if (this._pc && this._pc.iceConnectionState !== 'closed') {
        this._pc.close();
      }

      var _iteratorNormalCompletion11 = true;
      var _didIteratorError11 = false;
      var _iteratorError11 = undefined;

      try {
        for (var _iterator11 = this._publishPromises[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
          var _step11$value = _slicedToArray(_step11.value, 2),
              id = _step11$value[0],
              promise = _step11$value[1];

          promise.reject(promiseError);
        }
      } catch (err) {
        _didIteratorError11 = true;
        _iteratorError11 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion11 && _iterator11.return != null) {
            _iterator11.return();
          }
        } finally {
          if (_didIteratorError11) {
            throw _iteratorError11;
          }
        }
      }

      this._publishPromises.clear();

      var _iteratorNormalCompletion12 = true;
      var _didIteratorError12 = false;
      var _iteratorError12 = undefined;

      try {
        for (var _iterator12 = this._unpublishPromises[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
          var _step12$value = _slicedToArray(_step12.value, 2),
              id = _step12$value[0],
              promise = _step12$value[1];

          promise.reject(promiseError);
        }
      } catch (err) {
        _didIteratorError12 = true;
        _iteratorError12 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion12 && _iterator12.return != null) {
            _iterator12.return();
          }
        } finally {
          if (_didIteratorError12) {
            throw _iteratorError12;
          }
        }
      }

      this._unpublishPromises.clear();

      var _iteratorNormalCompletion13 = true;
      var _didIteratorError13 = false;
      var _iteratorError13 = undefined;

      try {
        for (var _iterator13 = this._sendDataPromises[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
          var _step13$value = _slicedToArray(_step13.value, 2),
              id = _step13$value[0],
              promise = _step13$value[1];

          promise.reject(promiseError);
        }
      } catch (err) {
        _didIteratorError13 = true;
        _iteratorError13 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion13 && _iterator13.return != null) {
            _iterator13.return();
          }
        } finally {
          if (_didIteratorError13) {
            throw _iteratorError13;
          }
        }
      }

      this._sendDataPromises.clear(); // Fire ended event if publication or remote stream exists.


      this._publishedStreams.forEach(function (publication) {
        publication.dispatchEvent(new _event.OwtEvent('ended'));
      });

      this._publishedStreams.clear();

      this._remoteStreams.forEach(function (stream) {
        stream.dispatchEvent(new _event.OwtEvent('ended'));
      });

      this._remoteStreams = [];

      if (!this._disposed) {
        if (notifyRemote) {
          var sendError;

          if (error) {
            sendError = JSON.parse(JSON.stringify(error)); // Avoid to leak detailed error to remote side.

            sendError.message = 'Error happened at remote side.';
          }

          this._sendSignalingMessage(SignalingType.CLOSED, sendError).catch(function (err) {
            _logger.default.debug('Failed to send close.' + err.message);
          });
        }

        this.dispatchEvent(new Event('ended'));
      }
    }
  }, {
    key: "_setStreamToRemoteStreamInfo",
    value: function _setStreamToRemoteStreamInfo(mediaStream) {
      var info = this._remoteStreamInfo.get(mediaStream.id);

      var attributes = info.attributes;
      var sourceInfo = new StreamModule.StreamSourceInfo(this._remoteStreamInfo.get(mediaStream.id).source.audio, this._remoteStreamInfo.get(mediaStream.id).source.video);
      info.stream = new StreamModule.RemoteStream(undefined, this._remoteId, mediaStream, sourceInfo, attributes);
      info.mediaStream = mediaStream;
      var stream = info.stream;

      if (stream) {
        this._remoteStreams.push(stream);
      } else {
        _logger.default.warning('Failed to create RemoteStream.');
      }
    }
  }, {
    key: "_checkIceConnectionStateAndFireEvent",
    value: function _checkIceConnectionStateAndFireEvent() {
      var _this15 = this;

      if (this._pc.iceConnectionState === 'connected' || this._pc.iceConnectionState === 'completed') {
        var _iteratorNormalCompletion14 = true;
        var _didIteratorError14 = false;
        var _iteratorError14 = undefined;

        try {
          for (var _iterator14 = this._remoteStreamInfo[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
            var _step14$value = _slicedToArray(_step14.value, 2),
                id = _step14$value[0],
                info = _step14$value[1];

            if (info.mediaStream) {
              var streamEvent = new StreamModule.StreamEvent('streamadded', {
                stream: info.stream
              });

              if (this._isUnifiedPlan()) {
                var _iteratorNormalCompletion15 = true;
                var _didIteratorError15 = false;
                var _iteratorError15 = undefined;

                try {
                  for (var _iterator15 = info.mediaStream.getTracks()[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                    var track = _step15.value;
                    track.addEventListener('ended', function (event) {
                      var mediaStreams = _this15._getStreamByTrack(event.target);

                      var _iteratorNormalCompletion16 = true;
                      var _didIteratorError16 = false;
                      var _iteratorError16 = undefined;

                      try {
                        for (var _iterator16 = mediaStreams[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                          var mediaStream = _step16.value;

                          if (_this15._areAllTracksEnded(mediaStream)) {
                            _this15._onRemoteStreamRemoved(mediaStream);
                          }
                        }
                      } catch (err) {
                        _didIteratorError16 = true;
                        _iteratorError16 = err;
                      } finally {
                        try {
                          if (!_iteratorNormalCompletion16 && _iterator16.return != null) {
                            _iterator16.return();
                          }
                        } finally {
                          if (_didIteratorError16) {
                            throw _iteratorError16;
                          }
                        }
                      }
                    });
                  }
                } catch (err) {
                  _didIteratorError15 = true;
                  _iteratorError15 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion15 && _iterator15.return != null) {
                      _iterator15.return();
                    }
                  } finally {
                    if (_didIteratorError15) {
                      throw _iteratorError15;
                    }
                  }
                }
              }

              this._sendSignalingMessage(SignalingType.TRACKS_ADDED, info.trackIds);

              this._remoteStreamInfo.get(info.mediaStream.id).mediaStream = null;
              this.dispatchEvent(streamEvent);
            }
          }
        } catch (err) {
          _didIteratorError14 = true;
          _iteratorError14 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion14 && _iterator14.return != null) {
              _iterator14.return();
            }
          } finally {
            if (_didIteratorError14) {
              throw _iteratorError14;
            }
          }
        }
      }
    }
  }]);

  return P2PPeerConnectionChannel;
}(_event.EventDispatcher);

var _default = P2PPeerConnectionChannel;
exports.default = _default;

},{"../base/event.js":3,"../base/logger.js":5,"../base/publication.js":8,"../base/sdputils.js":9,"../base/stream.js":10,"../base/utils.js":11,"./error.js":23}]},{},[22])(22)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2RrL2Jhc2UvYmFzZTY0LmpzIiwic3JjL3Nkay9iYXNlL2NvZGVjLmpzIiwic3JjL3Nkay9iYXNlL2V2ZW50LmpzIiwic3JjL3Nkay9iYXNlL2V4cG9ydC5qcyIsInNyYy9zZGsvYmFzZS9sb2dnZXIuanMiLCJzcmMvc2RrL2Jhc2UvbWVkaWFmb3JtYXQuanMiLCJzcmMvc2RrL2Jhc2UvbWVkaWFzdHJlYW0tZmFjdG9yeS5qcyIsInNyYy9zZGsvYmFzZS9wdWJsaWNhdGlvbi5qcyIsInNyYy9zZGsvYmFzZS9zZHB1dGlscy5qcyIsInNyYy9zZGsvYmFzZS9zdHJlYW0uanMiLCJzcmMvc2RrL2Jhc2UvdXRpbHMuanMiLCJzcmMvc2RrL2NvbmZlcmVuY2UvY2hhbm5lbC5qcyIsInNyYy9zZGsvY29uZmVyZW5jZS9jbGllbnQuanMiLCJzcmMvc2RrL2NvbmZlcmVuY2UvZXJyb3IuanMiLCJzcmMvc2RrL2NvbmZlcmVuY2UvZXhwb3J0LmpzIiwic3JjL3Nkay9jb25mZXJlbmNlL2luZm8uanMiLCJzcmMvc2RrL2NvbmZlcmVuY2UvbWl4ZWRzdHJlYW0uanMiLCJzcmMvc2RrL2NvbmZlcmVuY2UvcGFydGljaXBhbnQuanMiLCJzcmMvc2RrL2NvbmZlcmVuY2Uvc2lnbmFsaW5nLmpzIiwic3JjL3Nkay9jb25mZXJlbmNlL3N0cmVhbXV0aWxzLmpzIiwic3JjL3Nkay9jb25mZXJlbmNlL3N1YnNjcmlwdGlvbi5qcyIsInNyYy9zZGsvZXhwb3J0LmpzIiwic3JjL3Nkay9wMnAvZXJyb3IuanMiLCJzcmMvc2RrL3AycC9leHBvcnQuanMiLCJzcmMvc2RrL3AycC9wMnBjbGllbnQuanMiLCJzcmMvc2RrL3AycC9wZWVyY29ubmVjdGlvbi1jaGFubmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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Q0Q7QUFDRjtBQU53QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTzFDLHFCQVBEO0FBUUQ7QUFWd0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVcxQjs7QUFDRCxtQkFBSyxxQkFBTCxDQUEyQixhQUFhLENBQUMsWUFBekMsRUFBdUQsSUFBSSxDQUFDLFFBQTVEOztBQUNBLG1CQUFLLGlCQUFMLENBQXVCLEdBQXZCLENBQTJCLElBQUksQ0FBQyxXQUFMLENBQWlCLEVBQTVDLEVBQWdELFdBQWhELEdBQThELElBQTlEO0FBQ0EsbUJBQUssYUFBTCxDQUFtQixXQUFuQjtBQUNEO0FBQ0Y7QUF0QjhDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUF1QmhEO0FBQ0Y7Ozs7RUE1aENvQyxzQjs7ZUEraEN4Qix3QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIE1JVCBMaWNlbnNlXG4vL1xuLy8gQ29weXJpZ2h0IChjKSAyMDEyIFVuaXZlcnNpZGFkIFBvbGl0w6ljbmljYSBkZSBNYWRyaWRcbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG4vLyBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbi8vIFNPRlRXQVJFLlxuXG4vLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbi8vIFRoaXMgZmlsZSBpcyBib3Jyb3dlZCBmcm9tIGx5bmNraWEvbGljb2RlIHdpdGggc29tZSBtb2RpZmljYXRpb25zLlxuXG4vKiBnbG9iYWwgdW5lc2NhcGUqL1xuJ3VzZSBzdHJpY3QnO1xuZXhwb3J0IGNvbnN0IEJhc2U2NCA9IChmdW5jdGlvbigpIHtcbiAgY29uc3QgRU5EX09GX0lOUFVUID0gLTE7XG4gIGxldCBiYXNlNjRTdHI7XG4gIGxldCBiYXNlNjRDb3VudDtcblxuICBsZXQgaTtcblxuICBjb25zdCBiYXNlNjRDaGFycyA9IFtcbiAgICAnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnLCAnRycsICdIJyxcbiAgICAnSScsICdKJywgJ0snLCAnTCcsICdNJywgJ04nLCAnTycsICdQJyxcbiAgICAnUScsICdSJywgJ1MnLCAnVCcsICdVJywgJ1YnLCAnVycsICdYJyxcbiAgICAnWScsICdaJywgJ2EnLCAnYicsICdjJywgJ2QnLCAnZScsICdmJyxcbiAgICAnZycsICdoJywgJ2knLCAnaicsICdrJywgJ2wnLCAnbScsICduJyxcbiAgICAnbycsICdwJywgJ3EnLCAncicsICdzJywgJ3QnLCAndScsICd2JyxcbiAgICAndycsICd4JywgJ3knLCAneicsICcwJywgJzEnLCAnMicsICczJyxcbiAgICAnNCcsICc1JywgJzYnLCAnNycsICc4JywgJzknLCAnKycsICcvJyxcbiAgXTtcblxuICBjb25zdCByZXZlcnNlQmFzZTY0Q2hhcnMgPSBbXTtcblxuICBmb3IgKGkgPSAwOyBpIDwgYmFzZTY0Q2hhcnMubGVuZ3RoOyBpID0gaSArIDEpIHtcbiAgICByZXZlcnNlQmFzZTY0Q2hhcnNbYmFzZTY0Q2hhcnNbaV1dID0gaTtcbiAgfVxuXG4gIGNvbnN0IHNldEJhc2U2NFN0ciA9IGZ1bmN0aW9uKHN0cikge1xuICAgIGJhc2U2NFN0ciA9IHN0cjtcbiAgICBiYXNlNjRDb3VudCA9IDA7XG4gIH07XG5cbiAgY29uc3QgcmVhZEJhc2U2NCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghYmFzZTY0U3RyKSB7XG4gICAgICByZXR1cm4gRU5EX09GX0lOUFVUO1xuICAgIH1cbiAgICBpZiAoYmFzZTY0Q291bnQgPj0gYmFzZTY0U3RyLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIEVORF9PRl9JTlBVVDtcbiAgICB9XG4gICAgY29uc3QgYyA9IGJhc2U2NFN0ci5jaGFyQ29kZUF0KGJhc2U2NENvdW50KSAmIDB4ZmY7XG4gICAgYmFzZTY0Q291bnQgPSBiYXNlNjRDb3VudCArIDE7XG4gICAgcmV0dXJuIGM7XG4gIH07XG5cbiAgY29uc3QgZW5jb2RlQmFzZTY0ID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBsZXQgZG9uZTtcbiAgICBzZXRCYXNlNjRTdHIoc3RyKTtcbiAgICByZXN1bHQgPSAnJztcbiAgICBjb25zdCBpbkJ1ZmZlciA9IG5ldyBBcnJheSgzKTtcbiAgICBkb25lID0gZmFsc2U7XG4gICAgd2hpbGUgKCFkb25lICYmIChpbkJ1ZmZlclswXSA9IHJlYWRCYXNlNjQoKSkgIT09IEVORF9PRl9JTlBVVCkge1xuICAgICAgaW5CdWZmZXJbMV0gPSByZWFkQmFzZTY0KCk7XG4gICAgICBpbkJ1ZmZlclsyXSA9IHJlYWRCYXNlNjQoKTtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdCArIChiYXNlNjRDaGFyc1tpbkJ1ZmZlclswXSA+PiAyXSk7XG4gICAgICBpZiAoaW5CdWZmZXJbMV0gIT09IEVORF9PRl9JTlBVVCkge1xuICAgICAgICByZXN1bHQgPSByZXN1bHQgKyAoYmFzZTY0Q2hhcnNbKChpbkJ1ZmZlclswXSA8PCA0KSAmIDB4MzApIHwgKFxuICAgICAgICAgIGluQnVmZmVyWzFdID4+IDQpXSk7XG4gICAgICAgIGlmIChpbkJ1ZmZlclsyXSAhPT0gRU5EX09GX0lOUFVUKSB7XG4gICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgKGJhc2U2NENoYXJzWygoaW5CdWZmZXJbMV0gPDwgMikgJiAweDNjKSB8IChcbiAgICAgICAgICAgIGluQnVmZmVyWzJdID4+IDYpXSk7XG4gICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgKGJhc2U2NENoYXJzW2luQnVmZmVyWzJdICYgMHgzRl0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCArIChiYXNlNjRDaGFyc1soKGluQnVmZmVyWzFdIDw8IDIpICYgMHgzYyldKTtcbiAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyAoJz0nKTtcbiAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgKGJhc2U2NENoYXJzWygoaW5CdWZmZXJbMF0gPDwgNCkgJiAweDMwKV0pO1xuICAgICAgICByZXN1bHQgPSByZXN1bHQgKyAoJz0nKTtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgKCc9Jyk7XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIGNvbnN0IHJlYWRSZXZlcnNlQmFzZTY0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFiYXNlNjRTdHIpIHtcbiAgICAgIHJldHVybiBFTkRfT0ZfSU5QVVQ7XG4gICAgfVxuICAgIHdoaWxlICh0cnVlKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gICAgICBpZiAoYmFzZTY0Q291bnQgPj0gYmFzZTY0U3RyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gRU5EX09GX0lOUFVUO1xuICAgICAgfVxuICAgICAgY29uc3QgbmV4dENoYXJhY3RlciA9IGJhc2U2NFN0ci5jaGFyQXQoYmFzZTY0Q291bnQpO1xuICAgICAgYmFzZTY0Q291bnQgPSBiYXNlNjRDb3VudCArIDE7XG4gICAgICBpZiAocmV2ZXJzZUJhc2U2NENoYXJzW25leHRDaGFyYWN0ZXJdKSB7XG4gICAgICAgIHJldHVybiByZXZlcnNlQmFzZTY0Q2hhcnNbbmV4dENoYXJhY3Rlcl07XG4gICAgICB9XG4gICAgICBpZiAobmV4dENoYXJhY3RlciA9PT0gJ0EnKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCBudG9zID0gZnVuY3Rpb24obikge1xuICAgIG4gPSBuLnRvU3RyaW5nKDE2KTtcbiAgICBpZiAobi5sZW5ndGggPT09IDEpIHtcbiAgICAgIG4gPSAnMCcgKyBuO1xuICAgIH1cbiAgICBuID0gJyUnICsgbjtcbiAgICByZXR1cm4gdW5lc2NhcGUobik7XG4gIH07XG5cbiAgY29uc3QgZGVjb2RlQmFzZTY0ID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBsZXQgZG9uZTtcbiAgICBzZXRCYXNlNjRTdHIoc3RyKTtcbiAgICByZXN1bHQgPSAnJztcbiAgICBjb25zdCBpbkJ1ZmZlciA9IG5ldyBBcnJheSg0KTtcbiAgICBkb25lID0gZmFsc2U7XG4gICAgd2hpbGUgKCFkb25lICYmIChpbkJ1ZmZlclswXSA9IHJlYWRSZXZlcnNlQmFzZTY0KCkpICE9PSBFTkRfT0ZfSU5QVVQgJiZcbiAgICAgIChpbkJ1ZmZlclsxXSA9IHJlYWRSZXZlcnNlQmFzZTY0KCkpICE9PSBFTkRfT0ZfSU5QVVQpIHtcbiAgICAgIGluQnVmZmVyWzJdID0gcmVhZFJldmVyc2VCYXNlNjQoKTtcbiAgICAgIGluQnVmZmVyWzNdID0gcmVhZFJldmVyc2VCYXNlNjQoKTtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdCArIG50b3MoKCgoaW5CdWZmZXJbMF0gPDwgMikgJiAweGZmKSB8IGluQnVmZmVyWzFdID4+XG4gICAgICAgIDQpKTtcbiAgICAgIGlmIChpbkJ1ZmZlclsyXSAhPT0gRU5EX09GX0lOUFVUKSB7XG4gICAgICAgIHJlc3VsdCArPSBudG9zKCgoKGluQnVmZmVyWzFdIDw8IDQpICYgMHhmZikgfCBpbkJ1ZmZlclsyXSA+PiAyKSk7XG4gICAgICAgIGlmIChpbkJ1ZmZlclszXSAhPT0gRU5EX09GX0lOUFVUKSB7XG4gICAgICAgICAgcmVzdWx0ID0gcmVzdWx0ICsgbnRvcygoKChpbkJ1ZmZlclsyXSA8PCA2KSAmIDB4ZmYpIHwgaW5CdWZmZXJbXG4gICAgICAgICAgICAgIDNdKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgZW5jb2RlQmFzZTY0OiBlbmNvZGVCYXNlNjQsXG4gICAgZGVjb2RlQmFzZTY0OiBkZWNvZGVCYXNlNjQsXG4gIH07XG59KCkpO1xuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQGNsYXNzIEF1ZGlvQ29kZWNcbiAqIEBtZW1iZXJPZiBPd3QuQmFzZVxuICogQGNsYXNzRGVzYyBBdWRpbyBjb2RlYyBlbnVtZXJhdGlvbi5cbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNvbnN0IEF1ZGlvQ29kZWMgPSB7XG4gIFBDTVU6ICdwY211JyxcbiAgUENNQTogJ3BjbWEnLFxuICBPUFVTOiAnb3B1cycsXG4gIEc3MjI6ICdnNzIyJyxcbiAgSVNBQzogJ2lTQUMnLFxuICBJTEJDOiAnaUxCQycsXG4gIEFBQzogJ2FhYycsXG4gIEFDMzogJ2FjMycsXG4gIE5FTExZTU9TRVI6ICduZWxseW1vc2VyJyxcbn07XG4vKipcbiAqIEBjbGFzcyBBdWRpb0NvZGVjUGFyYW1ldGVyc1xuICogQG1lbWJlck9mIE93dC5CYXNlXG4gKiBAY2xhc3NEZXNjIENvZGVjIHBhcmFtZXRlcnMgZm9yIGFuIGF1ZGlvIHRyYWNrLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgQXVkaW9Db2RlY1BhcmFtZXRlcnMge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3RvcihuYW1lLCBjaGFubmVsQ291bnQsIGNsb2NrUmF0ZSkge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gbmFtZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5BdWRpb0NvZGVjUGFyYW1ldGVyc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBkZXNjIE5hbWUgb2YgYSBjb2RlYy4gUGxlYXNlIHVzZSBhIHZhbHVlIGluIE93dC5CYXNlLkF1ZGlvQ29kZWMuIEhvd2V2ZXIsIHNvbWUgZnVuY3Rpb25zIGRvIG5vdCBzdXBwb3J0IGFsbCB0aGUgdmFsdWVzIGluIE93dC5CYXNlLkF1ZGlvQ29kZWMuXG4gICAgICovXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/bnVtYmVyfSBjaGFubmVsQ291bnRcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuQXVkaW9Db2RlY1BhcmFtZXRlcnNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAZGVzYyBOdW1iZXJzIG9mIGNoYW5uZWxzIGZvciBhbiBhdWRpbyB0cmFjay5cbiAgICAgKi9cbiAgICB0aGlzLmNoYW5uZWxDb3VudCA9IGNoYW5uZWxDb3VudDtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/bnVtYmVyfSBjbG9ja1JhdGVcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuQXVkaW9Db2RlY1BhcmFtZXRlcnNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAZGVzYyBUaGUgY29kZWMgY2xvY2sgcmF0ZSBleHByZXNzZWQgaW4gSGVydHouXG4gICAgICovXG4gICAgdGhpcy5jbG9ja1JhdGUgPSBjbG9ja1JhdGU7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgQXVkaW9FbmNvZGluZ1BhcmFtZXRlcnNcbiAqIEBtZW1iZXJPZiBPd3QuQmFzZVxuICogQGNsYXNzRGVzYyBFbmNvZGluZyBwYXJhbWV0ZXJzIGZvciBzZW5kaW5nIGFuIGF1ZGlvIHRyYWNrLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgQXVkaW9FbmNvZGluZ1BhcmFtZXRlcnMge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3Rvcihjb2RlYywgbWF4Qml0cmF0ZSkge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9Pd3QuQmFzZS5BdWRpb0NvZGVjUGFyYW1ldGVyc30gY29kZWNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuQXVkaW9FbmNvZGluZ1BhcmFtZXRlcnNcbiAgICAgKi9cbiAgICB0aGlzLmNvZGVjID0gY29kZWM7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P251bWJlcn0gbWF4Qml0cmF0ZVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5BdWRpb0VuY29kaW5nUGFyYW1ldGVyc1xuICAgICAqIEBkZXNjIE1heCBiaXRyYXRlIGV4cHJlc3NlZCBpbiBrYnBzLlxuICAgICAqL1xuICAgIHRoaXMubWF4Qml0cmF0ZSA9IG1heEJpdHJhdGU7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IFZpZGVvQ29kZWMgPSB7XG4gIFZQODogJ3ZwOCcsXG4gIFZQOTogJ3ZwOScsXG4gIEgyNjQ6ICdoMjY0JyxcbiAgSDI2NTogJ2gyNjUnLFxufTtcblxuLyoqXG4gKiBAY2xhc3MgVmlkZW9Db2RlY1BhcmFtZXRlcnNcbiAqIEBtZW1iZXJPZiBPd3QuQmFzZVxuICogQGNsYXNzRGVzYyBDb2RlYyBwYXJhbWV0ZXJzIGZvciBhIHZpZGVvIHRyYWNrLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgVmlkZW9Db2RlY1BhcmFtZXRlcnMge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3RvcihuYW1lLCBwcm9maWxlKSB7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBuYW1lXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlZpZGVvQ29kZWNQYXJhbWV0ZXJzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgTmFtZSBvZiBhIGNvZGVjLiBQbGVhc2UgdXNlIGEgdmFsdWUgaW4gT3d0LkJhc2UuVmlkZW9Db2RlYy4gSG93ZXZlciwgc29tZSBmdW5jdGlvbnMgZG8gbm90IHN1cHBvcnQgYWxsIHRoZSB2YWx1ZXMgaW4gT3d0LkJhc2UuQXVkaW9Db2RlYy5cbiAgICAgKi9cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9zdHJpbmd9IHByb2ZpbGVcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuVmlkZW9Db2RlY1BhcmFtZXRlcnNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAZGVzYyBUaGUgcHJvZmlsZSBvZiBhIGNvZGVjLiBQcm9maWxlIG1heSBub3QgYXBwbHkgdG8gYWxsIGNvZGVjcy5cbiAgICAgKi9cbiAgICB0aGlzLnByb2ZpbGUgPSBwcm9maWxlO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFZpZGVvRW5jb2RpbmdQYXJhbWV0ZXJzXG4gKiBAbWVtYmVyT2YgT3d0LkJhc2VcbiAqIEBjbGFzc0Rlc2MgRW5jb2RpbmcgcGFyYW1ldGVycyBmb3Igc2VuZGluZyBhIHZpZGVvIHRyYWNrLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgVmlkZW9FbmNvZGluZ1BhcmFtZXRlcnMge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3Rvcihjb2RlYywgbWF4Qml0cmF0ZSkge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9Pd3QuQmFzZS5WaWRlb0NvZGVjUGFyYW1ldGVyc30gY29kZWNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuVmlkZW9FbmNvZGluZ1BhcmFtZXRlcnNcbiAgICAgKi9cbiAgICB0aGlzLmNvZGVjID0gY29kZWM7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P251bWJlcn0gbWF4Qml0cmF0ZVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5WaWRlb0VuY29kaW5nUGFyYW1ldGVyc1xuICAgICAqIEBkZXNjIE1heCBiaXRyYXRlIGV4cHJlc3NlZCBpbiBrYnBzLlxuICAgICAqL1xuICAgIHRoaXMubWF4Qml0cmF0ZSA9IG1heEJpdHJhdGU7XG4gIH1cbn1cbiIsIi8vIE1JVCBMaWNlbnNlXG4vL1xuLy8gQ29weXJpZ2h0IChjKSAyMDEyIFVuaXZlcnNpZGFkIFBvbGl0w6ljbmljYSBkZSBNYWRyaWRcbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG4vLyBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbi8vIFNPRlRXQVJFLlxuXG4vLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbi8vIFRoaXMgZmlsZSBpcyBib3Jyb3dlZCBmcm9tIGx5bmNraWEvbGljb2RlIHdpdGggc29tZSBtb2RpZmljYXRpb25zLlxuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQGNsYXNzIEV2ZW50RGlzcGF0Y2hlclxuICogQGNsYXNzRGVzYyBBIHNoaW0gZm9yIEV2ZW50VGFyZ2V0LiBNaWdodCBiZSBjaGFuZ2VkIHRvIEV2ZW50VGFyZ2V0IGxhdGVyLlxuICogQG1lbWJlcm9mIE93dC5CYXNlXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjb25zdCBFdmVudERpc3BhdGNoZXIgPSBmdW5jdGlvbigpIHtcbiAgLy8gUHJpdmF0ZSB2YXJzXG4gIGNvbnN0IHNwZWMgPSB7fTtcbiAgc3BlYy5kaXNwYXRjaGVyID0ge307XG4gIHNwZWMuZGlzcGF0Y2hlci5ldmVudExpc3RlbmVycyA9IHt9O1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lclxuICAgKiBAZGVzYyBUaGlzIGZ1bmN0aW9uIHJlZ2lzdGVycyBhIGNhbGxiYWNrIGZ1bmN0aW9uIGFzIGEgaGFuZGxlciBmb3IgdGhlIGNvcnJlc3BvbmRpbmcgZXZlbnQuIEl0J3Mgc2hvcnRlbmVkIGZvcm0gaXMgb24oZXZlbnRUeXBlLCBsaXN0ZW5lcikuIFNlZSB0aGUgZXZlbnQgZGVzY3JpcHRpb24gaW4gdGhlIGZvbGxvd2luZyB0YWJsZS5cbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5FdmVudERpc3BhdGNoZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSBFdmVudCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIENhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKi9cbiAgdGhpcy5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnRUeXBlLCBsaXN0ZW5lcikge1xuICAgIGlmIChzcGVjLmRpc3BhdGNoZXIuZXZlbnRMaXN0ZW5lcnNbZXZlbnRUeXBlXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBzcGVjLmRpc3BhdGNoZXIuZXZlbnRMaXN0ZW5lcnNbZXZlbnRUeXBlXSA9IFtdO1xuICAgIH1cbiAgICBzcGVjLmRpc3BhdGNoZXIuZXZlbnRMaXN0ZW5lcnNbZXZlbnRUeXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgfTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJcbiAgICogQGRlc2MgVGhpcyBmdW5jdGlvbiByZW1vdmVzIGEgcmVnaXN0ZXJlZCBldmVudCBsaXN0ZW5lci5cbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5FdmVudERpc3BhdGNoZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSBFdmVudCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIENhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKi9cbiAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnRUeXBlLCBsaXN0ZW5lcikge1xuICAgIGlmICghc3BlYy5kaXNwYXRjaGVyLmV2ZW50TGlzdGVuZXJzW2V2ZW50VHlwZV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaW5kZXggPSBzcGVjLmRpc3BhdGNoZXIuZXZlbnRMaXN0ZW5lcnNbZXZlbnRUeXBlXS5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBzcGVjLmRpc3BhdGNoZXIuZXZlbnRMaXN0ZW5lcnNbZXZlbnRUeXBlXS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIGNsZWFyRXZlbnRMaXN0ZW5lclxuICAgKiBAZGVzYyBUaGlzIGZ1bmN0aW9uIHJlbW92ZXMgYWxsIGV2ZW50IGxpc3RlbmVycyBmb3Igb25lIHR5cGUuXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuRXZlbnREaXNwYXRjaGVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFR5cGUgRXZlbnQgc3RyaW5nLlxuICAgKi9cbiAgdGhpcy5jbGVhckV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudFR5cGUpIHtcbiAgICBzcGVjLmRpc3BhdGNoZXIuZXZlbnRMaXN0ZW5lcnNbZXZlbnRUeXBlXSA9IFtdO1xuICB9O1xuXG4gIC8vIEl0IGRpc3BhdGNoIGEgbmV3IGV2ZW50IHRvIHRoZSBldmVudCBsaXN0ZW5lcnMsIGJhc2VkIG9uIHRoZSB0eXBlXG4gIC8vIG9mIGV2ZW50LiBBbGwgZXZlbnRzIGFyZSBpbnRlbmRlZCB0byBiZSBMaWNvZGVFdmVudHMuXG4gIHRoaXMuZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgaWYgKCFzcGVjLmRpc3BhdGNoZXIuZXZlbnRMaXN0ZW5lcnNbZXZlbnQudHlwZV0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3BlYy5kaXNwYXRjaGVyLmV2ZW50TGlzdGVuZXJzW2V2ZW50LnR5cGVdLm1hcChmdW5jdGlvbihsaXN0ZW5lcikge1xuICAgICAgbGlzdGVuZXIoZXZlbnQpO1xuICAgIH0pO1xuICB9O1xufTtcblxuLyoqXG4gKiBAY2xhc3MgT3d0RXZlbnRcbiAqIEBjbGFzc0Rlc2MgQ2xhc3MgT3d0RXZlbnQgcmVwcmVzZW50cyBhIGdlbmVyaWMgRXZlbnQgaW4gdGhlIGxpYnJhcnkuXG4gKiBAbWVtYmVyb2YgT3d0LkJhc2VcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIE93dEV2ZW50IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgY29uc3RydWN0b3IodHlwZSkge1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgTWVzc2FnZUV2ZW50XG4gKiBAY2xhc3NEZXNjIENsYXNzIE1lc3NhZ2VFdmVudCByZXByZXNlbnRzIGEgbWVzc2FnZSBFdmVudCBpbiB0aGUgbGlicmFyeS5cbiAqIEBtZW1iZXJvZiBPd3QuQmFzZVxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgTWVzc2FnZUV2ZW50IGV4dGVuZHMgT3d0RXZlbnQge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBpbml0KSB7XG4gICAgc3VwZXIodHlwZSk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBvcmlnaW5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuTWVzc2FnZUV2ZW50XG4gICAgICogQGRlc2MgSUQgb2YgdGhlIHJlbW90ZSBlbmRwb2ludCB3aG8gcHVibGlzaGVkIHRoaXMgc3RyZWFtLlxuICAgICAqL1xuICAgIHRoaXMub3JpZ2luID0gaW5pdC5vcmlnaW47XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBtZXNzYWdlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLk1lc3NhZ2VFdmVudFxuICAgICAqL1xuICAgIHRoaXMubWVzc2FnZSA9IGluaXQubWVzc2FnZTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IHRvXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLk1lc3NhZ2VFdmVudFxuICAgICAqIEBkZXNjIFZhbHVlcyBjb3VsZCBiZSBcImFsbFwiLCBcIm1lXCIgaW4gY29uZmVyZW5jZSBtb2RlLCBvciB1bmRlZmluZWQgaW4gUDJQIG1vZGUuLlxuICAgICAqL1xuICAgIHRoaXMudG8gPSBpbml0LnRvO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIEVycm9yRXZlbnRcbiAqIEBjbGFzc0Rlc2MgQ2xhc3MgRXJyb3JFdmVudCByZXByZXNlbnRzIGFuIGVycm9yIEV2ZW50IGluIHRoZSBsaWJyYXJ5LlxuICogQG1lbWJlcm9mIE93dC5CYXNlXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBFcnJvckV2ZW50IGV4dGVuZHMgT3d0RXZlbnQge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBpbml0KSB7XG4gICAgc3VwZXIodHlwZSk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7RXJyb3J9IGVycm9yXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLkVycm9yRXZlbnRcbiAgICAgKi9cbiAgICB0aGlzLmVycm9yID0gaW5pdC5lcnJvcjtcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBNdXRlRXZlbnRcbiAqIEBjbGFzc0Rlc2MgQ2xhc3MgTXV0ZUV2ZW50IHJlcHJlc2VudHMgYSBtdXRlIG9yIHVubXV0ZSBldmVudC5cbiAqIEBtZW1iZXJvZiBPd3QuQmFzZVxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgTXV0ZUV2ZW50IGV4dGVuZHMgT3d0RXZlbnQge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBpbml0KSB7XG4gICAgc3VwZXIodHlwZSk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7T3d0LkJhc2UuVHJhY2tLaW5kfSBraW5kXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLk11dGVFdmVudFxuICAgICAqL1xuICAgIHRoaXMua2luZCA9IGluaXQua2luZDtcbiAgfVxufVxuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydCAqIGZyb20gJy4vbWVkaWFzdHJlYW0tZmFjdG9yeS5qcyc7XG5leHBvcnQgKiBmcm9tICcuL3N0cmVhbS5qcyc7XG5leHBvcnQgKiBmcm9tICcuL21lZGlhZm9ybWF0LmpzJztcbiIsIi8vIE1JVCBMaWNlbnNlXG4vL1xuLy8gQ29weXJpZ2h0IChjKSAyMDEyIFVuaXZlcnNpZGFkIFBvbGl0w6ljbmljYSBkZSBNYWRyaWRcbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG4vLyBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcbi8vIFNPRlRXQVJFLlxuXG4vLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbi8vIFRoaXMgZmlsZSBpcyBib3Jyb3dlZCBmcm9tIGx5bmNraWEvbGljb2RlIHdpdGggc29tZSBtb2RpZmljYXRpb25zLlxuXG4vKiBnbG9iYWwgY29uc29sZSx3aW5kb3cgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKlxuICogQVBJIHRvIHdyaXRlIGxvZ3MgYmFzZWQgb24gdHJhZGl0aW9uYWwgbG9nZ2luZyBtZWNoYW5pc21zOiBkZWJ1ZywgdHJhY2UsXG4gKiBpbmZvLCB3YXJuaW5nLCBlcnJvclxuICovXG5jb25zdCBMb2dnZXIgPSAoZnVuY3Rpb24oKSB7XG4gIGNvbnN0IERFQlVHID0gMDtcbiAgY29uc3QgVFJBQ0UgPSAxO1xuICBjb25zdCBJTkZPID0gMjtcbiAgY29uc3QgV0FSTklORyA9IDM7XG4gIGNvbnN0IEVSUk9SID0gNDtcbiAgY29uc3QgTk9ORSA9IDU7XG5cbiAgY29uc3Qgbm9PcCA9IGZ1bmN0aW9uKCkge307XG5cbiAgLy8gfHRoYXR8IGlzIHRoZSBvYmplY3QgdG8gYmUgcmV0dXJuZWQuXG4gIGNvbnN0IHRoYXQgPSB7XG4gICAgREVCVUc6IERFQlVHLFxuICAgIFRSQUNFOiBUUkFDRSxcbiAgICBJTkZPOiBJTkZPLFxuICAgIFdBUk5JTkc6IFdBUk5JTkcsXG4gICAgRVJST1I6IEVSUk9SLFxuICAgIE5PTkU6IE5PTkUsXG4gIH07XG5cbiAgdGhhdC5sb2cgPSB3aW5kb3cuY29uc29sZS5sb2cuYmluZCh3aW5kb3cuY29uc29sZSk7XG5cbiAgY29uc3QgYmluZFR5cGUgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuY29uc29sZVt0eXBlXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHdpbmRvdy5jb25zb2xlW3R5cGVdLmJpbmQod2luZG93LmNvbnNvbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gd2luZG93LmNvbnNvbGUubG9nLmJpbmQod2luZG93LmNvbnNvbGUpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBzZXRMb2dMZXZlbCA9IGZ1bmN0aW9uKGxldmVsKSB7XG4gICAgaWYgKGxldmVsIDw9IERFQlVHKSB7XG4gICAgICB0aGF0LmRlYnVnID0gYmluZFR5cGUoJ2xvZycpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGF0LmRlYnVnID0gbm9PcDtcbiAgICB9XG4gICAgaWYgKGxldmVsIDw9IFRSQUNFKSB7XG4gICAgICB0aGF0LnRyYWNlID0gYmluZFR5cGUoJ3RyYWNlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQudHJhY2UgPSBub09wO1xuICAgIH1cbiAgICBpZiAobGV2ZWwgPD0gSU5GTykge1xuICAgICAgdGhhdC5pbmZvID0gYmluZFR5cGUoJ2luZm8nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhhdC5pbmZvID0gbm9PcDtcbiAgICB9XG4gICAgaWYgKGxldmVsIDw9IFdBUk5JTkcpIHtcbiAgICAgIHRoYXQud2FybmluZyA9IGJpbmRUeXBlKCd3YXJuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQud2FybmluZyA9IG5vT3A7XG4gICAgfVxuICAgIGlmIChsZXZlbCA8PSBFUlJPUikge1xuICAgICAgdGhhdC5lcnJvciA9IGJpbmRUeXBlKCdlcnJvcicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGF0LmVycm9yID0gbm9PcDtcbiAgICB9XG4gIH07XG5cbiAgc2V0TG9nTGV2ZWwoREVCVUcpOyAvLyBEZWZhdWx0IGxldmVsIGlzIGRlYnVnLlxuXG4gIHRoYXQuc2V0TG9nTGV2ZWwgPSBzZXRMb2dMZXZlbDtcblxuICByZXR1cm4gdGhhdDtcbn0oKSk7XG5cbmV4cG9ydCBkZWZhdWx0IExvZ2dlcjtcbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcblxuJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBAY2xhc3MgQXVkaW9Tb3VyY2VJbmZvXG4gKiBAY2xhc3NEZXNjIFNvdXJjZSBpbmZvIGFib3V0IGFuIGF1ZGlvIHRyYWNrLiBWYWx1ZXM6ICdtaWMnLCAnc2NyZWVuLWNhc3QnLCAnZmlsZScsICdtaXhlZCcuXG4gKiBAbWVtYmVyT2YgT3d0LkJhc2VcbiAqIEByZWFkb25seVxuICogQGVudW0ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IEF1ZGlvU291cmNlSW5mbyA9IHtcbiAgTUlDOiAnbWljJyxcbiAgU0NSRUVOQ0FTVDogJ3NjcmVlbi1jYXN0JyxcbiAgRklMRTogJ2ZpbGUnLFxuICBNSVhFRDogJ21peGVkJyxcbn07XG5cbi8qKlxuICogQGNsYXNzIFZpZGVvU291cmNlSW5mb1xuICogQGNsYXNzRGVzYyBTb3VyY2UgaW5mbyBhYm91dCBhIHZpZGVvIHRyYWNrLiBWYWx1ZXM6ICdjYW1lcmEnLCAnc2NyZWVuLWNhc3QnLCAnZmlsZScsICdtaXhlZCcuXG4gKiBAbWVtYmVyT2YgT3d0LkJhc2VcbiAqIEByZWFkb25seVxuICogQGVudW0ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IFZpZGVvU291cmNlSW5mbyA9IHtcbiAgQ0FNRVJBOiAnY2FtZXJhJyxcbiAgU0NSRUVOQ0FTVDogJ3NjcmVlbi1jYXN0JyxcbiAgRklMRTogJ2ZpbGUnLFxuICBNSVhFRDogJ21peGVkJyxcbn07XG5cbi8qKlxuICogQGNsYXNzIFRyYWNrS2luZFxuICogQGNsYXNzRGVzYyBLaW5kIG9mIGEgdHJhY2suIFZhbHVlczogJ2F1ZGlvJyBmb3IgYXVkaW8gdHJhY2ssICd2aWRlbycgZm9yIHZpZGVvIHRyYWNrLCAnYXYnIGZvciBib3RoIGF1ZGlvIGFuZCB2aWRlbyB0cmFja3MuXG4gKiBAbWVtYmVyT2YgT3d0LkJhc2VcbiAqIEByZWFkb25seVxuICogQGVudW0ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IFRyYWNrS2luZCA9IHtcbiAgLyoqXG4gICAqIEF1ZGlvIHRyYWNrcy5cbiAgICogQHR5cGUgc3RyaW5nXG4gICAqL1xuICBBVURJTzogJ2F1ZGlvJyxcbiAgLyoqXG4gICAqIFZpZGVvIHRyYWNrcy5cbiAgICogQHR5cGUgc3RyaW5nXG4gICAqL1xuICBWSURFTzogJ3ZpZGVvJyxcbiAgLyoqXG4gICAqIEJvdGggYXVkaW8gYW5kIHZpZGVvIHRyYWNrcy5cbiAgICogQHR5cGUgc3RyaW5nXG4gICAqL1xuICBBVURJT19BTkRfVklERU86ICdhdicsXG59O1xuLyoqXG4gKiBAY2xhc3MgUmVzb2x1dGlvblxuICogQG1lbWJlck9mIE93dC5CYXNlXG4gKiBAY2xhc3NEZXNjIFRoZSBSZXNvbHV0aW9uIGRlZmluZXMgdGhlIHNpemUgb2YgYSByZWN0YW5nbGUuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodFxuICovXG5leHBvcnQgY2xhc3MgUmVzb2x1dGlvbiB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtudW1iZXJ9IHdpZHRoXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlJlc29sdXRpb25cbiAgICAgKi9cbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7bnVtYmVyfSBoZWlnaHRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuUmVzb2x1dGlvblxuICAgICAqL1xuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICB9XG59XG4iLCIvLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbi8qIGdsb2JhbCBjb25zb2xlLCB3aW5kb3csIFByb21pc2UsIGNocm9tZSwgbmF2aWdhdG9yICovXG5cbid1c2Ugc3RyaWN0JztcbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IExvZ2dlciBmcm9tICcuL2xvZ2dlci5qcyc7XG5pbXBvcnQgKiBhcyBNZWRpYUZvcm1hdE1vZHVsZSBmcm9tICcuL21lZGlhZm9ybWF0LmpzJztcblxuLyoqXG4gKiBAY2xhc3MgQXVkaW9UcmFja0NvbnN0cmFpbnRzXG4gKiBAY2xhc3NEZXNjIENvbnN0cmFpbnRzIGZvciBjcmVhdGluZyBhbiBhdWRpbyBNZWRpYVN0cmVhbVRyYWNrLlxuICogQG1lbWJlcm9mIE93dC5CYXNlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T3d0LkJhc2UuQXVkaW9Tb3VyY2VJbmZvfSBzb3VyY2UgU291cmNlIGluZm8gb2YgdGhpcyBhdWRpbyB0cmFjay5cbiAqL1xuZXhwb3J0IGNsYXNzIEF1ZGlvVHJhY2tDb25zdHJhaW50cyB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKHNvdXJjZSkge1xuICAgIGlmICghT2JqZWN0LnZhbHVlcyhNZWRpYUZvcm1hdE1vZHVsZS5BdWRpb1NvdXJjZUluZm8pXG4gICAgICAgIC5zb21lKCh2KSA9PiB2ID09PSBzb3VyY2UpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHNvdXJjZS4nKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBzb3VyY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuQXVkaW9UcmFja0NvbnN0cmFpbnRzXG4gICAgICogQGRlc2MgVmFsdWVzIGNvdWxkIGJlIFwibWljXCIsIFwic2NyZWVuLWNhc3RcIiwgXCJmaWxlXCIgb3IgXCJtaXhlZFwiLlxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gZGV2aWNlSWRcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuQXVkaW9UcmFja0NvbnN0cmFpbnRzXG4gICAgICogQGRlc2MgRG8gbm90IHByb3ZpZGUgZGV2aWNlSWQgaWYgc291cmNlIGlzIG5vdCBcIm1pY1wiLlxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBzZWUgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL21lZGlhY2FwdHVyZS1tYWluLyNkZWYtY29uc3RyYWludC1kZXZpY2VJZFxuICAgICAqL1xuICAgIHRoaXMuZGV2aWNlSWQgPSB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgVmlkZW9UcmFja0NvbnN0cmFpbnRzXG4gKiBAY2xhc3NEZXNjIENvbnN0cmFpbnRzIGZvciBjcmVhdGluZyBhIHZpZGVvIE1lZGlhU3RyZWFtVHJhY2suXG4gKiBAbWVtYmVyb2YgT3d0LkJhc2VcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPd3QuQmFzZS5WaWRlb1NvdXJjZUluZm99IHNvdXJjZSBTb3VyY2UgaW5mbyBvZiB0aGlzIHZpZGVvIHRyYWNrLlxuICovXG5leHBvcnQgY2xhc3MgVmlkZW9UcmFja0NvbnN0cmFpbnRzIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgY29uc3RydWN0b3Ioc291cmNlKSB7XG4gICAgaWYgKCFPYmplY3QudmFsdWVzKE1lZGlhRm9ybWF0TW9kdWxlLlZpZGVvU291cmNlSW5mbylcbiAgICAgIC5zb21lKCh2KSA9PiB2ID09PSBzb3VyY2UpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHNvdXJjZS4nKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBzb3VyY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuVmlkZW9UcmFja0NvbnN0cmFpbnRzXG4gICAgICogQGRlc2MgVmFsdWVzIGNvdWxkIGJlIFwiY2FtZXJhXCIsIFwic2NyZWVuLWNhc3RcIiwgXCJmaWxlXCIgb3IgXCJtaXhlZFwiLlxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gZGV2aWNlSWRcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuVmlkZW9UcmFja0NvbnN0cmFpbnRzXG4gICAgICogQGRlc2MgRG8gbm90IHByb3ZpZGUgZGV2aWNlSWQgaWYgc291cmNlIGlzIG5vdCBcImNhbWVyYVwiLlxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBzZWUgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL21lZGlhY2FwdHVyZS1tYWluLyNkZWYtY29uc3RyYWludC1kZXZpY2VJZFxuICAgICAqL1xuXG4gICAgdGhpcy5kZXZpY2VJZCA9IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge093dC5CYXNlLlJlc29sdXRpb259IHJlc29sdXRpb25cbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuVmlkZW9UcmFja0NvbnN0cmFpbnRzXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgdGhpcy5yZXNvbHV0aW9uID0gdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7bnVtYmVyfSBmcmFtZVJhdGVcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuVmlkZW9UcmFja0NvbnN0cmFpbnRzXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgdGhpcy5mcmFtZVJhdGUgPSB1bmRlZmluZWQ7XG4gIH1cbn1cbi8qKlxuICogQGNsYXNzIFN0cmVhbUNvbnN0cmFpbnRzXG4gKiBAY2xhc3NEZXNjIENvbnN0cmFpbnRzIGZvciBjcmVhdGluZyBhIE1lZGlhU3RyZWFtIGZyb20gc2NyZWVuIG1pYyBhbmQgY2FtZXJhLlxuICogQG1lbWJlcm9mIE93dC5CYXNlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7P093dC5CYXNlLkF1ZGlvVHJhY2tDb25zdHJhaW50c30gYXVkaW9Db25zdHJhaW50c1xuICogQHBhcmFtIHs/T3d0LkJhc2UuVmlkZW9UcmFja0NvbnN0cmFpbnRzfSB2aWRlb0NvbnN0cmFpbnRzXG4gKi9cbmV4cG9ydCBjbGFzcyBTdHJlYW1Db25zdHJhaW50cyB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKGF1ZGlvQ29uc3RyYWludHMgPSBmYWxzZSwgdmlkZW9Db25zdHJhaW50cyA9IGZhbHNlKSB7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7T3d0LkJhc2UuTWVkaWFTdHJlYW1UcmFja0RldmljZUNvbnN0cmFpbnRzRm9yQXVkaW99IGF1ZGlvXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLk1lZGlhU3RyZWFtRGV2aWNlQ29uc3RyYWludHNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICB0aGlzLmF1ZGlvID0gYXVkaW9Db25zdHJhaW50cztcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtPd3QuQmFzZS5NZWRpYVN0cmVhbVRyYWNrRGV2aWNlQ29uc3RyYWludHNGb3JWaWRlb30gVmlkZW9cbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuTWVkaWFTdHJlYW1EZXZpY2VDb25zdHJhaW50c1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIHRoaXMudmlkZW8gPSB2aWRlb0NvbnN0cmFpbnRzO1xuICB9XG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG5mdW5jdGlvbiBpc1ZpZGVvQ29uc3RyYWluc0ZvclNjcmVlbkNhc3QoY29uc3RyYWludHMpIHtcbiAgcmV0dXJuICh0eXBlb2YgY29uc3RyYWludHMudmlkZW8gPT09ICdvYmplY3QnICYmIGNvbnN0cmFpbnRzLnZpZGVvLnNvdXJjZSA9PT1cbiAgICBNZWRpYUZvcm1hdE1vZHVsZS5WaWRlb1NvdXJjZUluZm8uU0NSRUVOQ0FTVCk7XG59XG5cbi8qKlxuICogQGNsYXNzIE1lZGlhU3RyZWFtRmFjdG9yeVxuICogQGNsYXNzRGVzYyBBIGZhY3RvcnkgdG8gY3JlYXRlIE1lZGlhU3RyZWFtLiBZb3UgY2FuIGFsc28gY3JlYXRlIE1lZGlhU3RyZWFtIGJ5IHlvdXJzZWxmLlxuICogQG1lbWJlcm9mIE93dC5CYXNlXG4gKi9cbmV4cG9ydCBjbGFzcyBNZWRpYVN0cmVhbUZhY3Rvcnkge1xuICAvKipcbiAgICogQGZ1bmN0aW9uIGNyZWF0ZU1lZGlhU3RyZWFtXG4gICAqIEBzdGF0aWNcbiAgICogQGRlc2MgQ3JlYXRlIGEgTWVkaWFTdHJlYW0gd2l0aCBnaXZlbiBjb25zdHJhaW50cy4gSWYgeW91IHdhbnQgdG8gY3JlYXRlIGEgTWVkaWFTdHJlYW0gZm9yIHNjcmVlbiBjYXN0LCBwbGVhc2UgbWFrZSBzdXJlIGJvdGggYXVkaW8gYW5kIHZpZGVvJ3Mgc291cmNlIGFyZSBcInNjcmVlbi1jYXN0XCIuXG4gICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5NZWRpYVN0cmVhbUZhY3RvcnlcbiAgICogQHJldHVybnMge1Byb21pc2U8TWVkaWFTdHJlYW0sIEVycm9yPn0gUmV0dXJuIGEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdoZW4gc3RyZWFtIGlzIHN1Y2Nlc3NmdWxseSBjcmVhdGVkLCBvciByZWplY3RlZCBpZiBvbmUgb2YgdGhlIGZvbGxvd2luZyBlcnJvciBoYXBwZW5lZDpcbiAgICogLSBPbmUgb3IgbW9yZSBwYXJhbWV0ZXJzIGNhbm5vdCBiZSBzYXRpc2ZpZWQuXG4gICAqIC0gU3BlY2lmaWVkIGRldmljZSBpcyBidXN5LlxuICAgKiAtIENhbm5vdCBvYnRhaW4gbmVjZXNzYXJ5IHBlcm1pc3Npb24gb3Igb3BlcmF0aW9uIGlzIGNhbmNlbGVkIGJ5IHVzZXIuXG4gICAqIC0gVmlkZW8gc291cmNlIGlzIHNjcmVlbiBjYXN0LCB3aGlsZSBhdWRpbyBzb3VyY2UgaXMgbm90LlxuICAgKiAtIEF1ZGlvIHNvdXJjZSBpcyBzY3JlZW4gY2FzdCwgd2hpbGUgdmlkZW8gc291cmNlIGlzIGRpc2FibGVkLlxuICAgKiBAcGFyYW0ge093dC5CYXNlLlN0cmVhbUNvbnN0cmFpbnRzfSBjb25zdHJhaW50c1xuICAgKi9cbiAgc3RhdGljIGNyZWF0ZU1lZGlhU3RyZWFtKGNvbnN0cmFpbnRzKSB7XG4gICAgaWYgKHR5cGVvZiBjb25zdHJhaW50cyAhPT0gJ29iamVjdCcgfHxcbiAgICAgICAgKCFjb25zdHJhaW50cy5hdWRpbyAmJiAhY29uc3RyYWludHMudmlkZW8pKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignSW52YWxpZCBjb25zdHJhaW5zJykpO1xuICAgIH1cbiAgICBpZiAoIWlzVmlkZW9Db25zdHJhaW5zRm9yU2NyZWVuQ2FzdChjb25zdHJhaW50cykgJiZcbiAgICAgICAgKHR5cGVvZiBjb25zdHJhaW50cy5hdWRpbyA9PT0gJ29iamVjdCcpICYmXG4gICAgICAgIGNvbnN0cmFpbnRzLmF1ZGlvLnNvdXJjZSA9PT1cbiAgICAgICAgICAgIE1lZGlhRm9ybWF0TW9kdWxlLkF1ZGlvU291cmNlSW5mby5TQ1JFRU5DQVNUKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXG4gICAgICAgICAgbmV3IFR5cGVFcnJvcignQ2Fubm90IHNoYXJlIHNjcmVlbiB3aXRob3V0IHZpZGVvLicpKTtcbiAgICB9XG4gICAgaWYgKGlzVmlkZW9Db25zdHJhaW5zRm9yU2NyZWVuQ2FzdChjb25zdHJhaW50cykgJiYgIXV0aWxzLmlzQ2hyb21lKCkgJiZcbiAgICAgICAgIXV0aWxzLmlzRmlyZWZveCgpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXG4gICAgICAgICAgbmV3IFR5cGVFcnJvcignU2NyZWVuIHNoYXJpbmcgb25seSBzdXBwb3J0cyBDaHJvbWUgYW5kIEZpcmVmb3guJykpO1xuICAgIH1cbiAgICBpZiAoaXNWaWRlb0NvbnN0cmFpbnNGb3JTY3JlZW5DYXN0KGNvbnN0cmFpbnRzKSAmJlxuICAgICAgICB0eXBlb2YgY29uc3RyYWludHMuYXVkaW8gPT09ICdvYmplY3QnICYmXG4gICAgICAgIGNvbnN0cmFpbnRzLmF1ZGlvLnNvdXJjZSAhPT1cbiAgICAgICAgICAgIE1lZGlhRm9ybWF0TW9kdWxlLkF1ZGlvU291cmNlSW5mby5TQ1JFRU5DQVNUKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGNhcHR1cmUgdmlkZW8gZnJvbSBzY3JlZW4gY2FzdCB3aGlsZSBjYXB0dXJlIGF1ZGlvIGZyb20nXG4gICAgICAgICAgKyAnIG90aGVyIHNvdXJjZS4nKSk7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgYW5kIGNvbnZlcnQgY29uc3RyYWludHMuXG4gICAgaWYgKCFjb25zdHJhaW50cy5hdWRpbyAmJiAhY29uc3RyYWludHMudmlkZW8pIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFxuICAgICAgICAnQXQgbGVhc3Qgb25lIG9mIGF1ZGlvIGFuZCB2aWRlbyBtdXN0IGJlIHJlcXVlc3RlZC4nKSk7XG4gICAgfVxuICAgIGNvbnN0IG1lZGlhQ29uc3RyYWludHMgPSBPYmplY3QuY3JlYXRlKHt9KTtcbiAgICBpZiAodHlwZW9mIGNvbnN0cmFpbnRzLmF1ZGlvID09PSAnb2JqZWN0JyAmJlxuICAgICAgICBjb25zdHJhaW50cy5hdWRpby5zb3VyY2UgPT09IE1lZGlhRm9ybWF0TW9kdWxlLkF1ZGlvU291cmNlSW5mby5NSUMpIHtcbiAgICAgIG1lZGlhQ29uc3RyYWludHMuYXVkaW8gPSBPYmplY3QuY3JlYXRlKHt9KTtcbiAgICAgIGlmICh1dGlscy5pc0VkZ2UoKSkge1xuICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLmF1ZGlvLmRldmljZUlkID0gY29uc3RyYWludHMuYXVkaW8uZGV2aWNlSWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLmF1ZGlvLmRldmljZUlkID0ge1xuICAgICAgICAgIGV4YWN0OiBjb25zdHJhaW50cy5hdWRpby5kZXZpY2VJZCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNvbnN0cmFpbnRzLmF1ZGlvLnNvdXJjZSA9PT0gTWVkaWFGb3JtYXRNb2R1bGUuQXVkaW9Tb3VyY2VJbmZvLlNDUkVFTkNBU1QpIHtcbiAgICAgICAgbWVkaWFDb25zdHJhaW50cy5hdWRpbyA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLmF1ZGlvID0gY29uc3RyYWludHMuYXVkaW87XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY29uc3RyYWludHMudmlkZW8gPT09ICdvYmplY3QnKSB7XG4gICAgICBtZWRpYUNvbnN0cmFpbnRzLnZpZGVvID0gT2JqZWN0LmNyZWF0ZSh7fSk7XG4gICAgICBpZiAodHlwZW9mIGNvbnN0cmFpbnRzLnZpZGVvLmZyYW1lUmF0ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgbWVkaWFDb25zdHJhaW50cy52aWRlby5mcmFtZVJhdGUgPSBjb25zdHJhaW50cy52aWRlby5mcmFtZVJhdGU7XG4gICAgICB9XG4gICAgICBpZiAoY29uc3RyYWludHMudmlkZW8ucmVzb2x1dGlvbiAmJlxuICAgICAgICAgIGNvbnN0cmFpbnRzLnZpZGVvLnJlc29sdXRpb24ud2lkdGggJiZcbiAgICAgICAgICBjb25zdHJhaW50cy52aWRlby5yZXNvbHV0aW9uLmhlaWdodCkge1xuICAgICAgICAgICAgaWYgKGNvbnN0cmFpbnRzLnZpZGVvLnNvdXJjZSA9PT1cbiAgICAgICAgICAgICAgTWVkaWFGb3JtYXRNb2R1bGUuVmlkZW9Tb3VyY2VJbmZvLlNDUkVFTkNBU1QpIHtcbiAgICAgICAgICAgICAgbWVkaWFDb25zdHJhaW50cy52aWRlby53aWR0aCA9XG4gICAgICAgICAgICAgICAgY29uc3RyYWludHMudmlkZW8ucmVzb2x1dGlvbi53aWR0aDtcbiAgICAgICAgICAgICAgbWVkaWFDb25zdHJhaW50cy52aWRlby5oZWlnaHQgPVxuICAgICAgICAgICAgICAgIGNvbnN0cmFpbnRzLnZpZGVvLnJlc29sdXRpb24uaGVpZ2h0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbWVkaWFDb25zdHJhaW50cy52aWRlby53aWR0aCA9IE9iamVjdC5jcmVhdGUoe30pO1xuICAgICAgICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLnZpZGVvLndpZHRoLmV4YWN0ID1cbiAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnRzLnZpZGVvLnJlc29sdXRpb24ud2lkdGg7XG4gICAgICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8uaGVpZ2h0ID0gT2JqZWN0LmNyZWF0ZSh7fSk7XG4gICAgICAgICAgICAgIG1lZGlhQ29uc3RyYWludHMudmlkZW8uaGVpZ2h0LmV4YWN0ID1cbiAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnRzLnZpZGVvLnJlc29sdXRpb24uaGVpZ2h0O1xuXG4gICAgICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGNvbnN0cmFpbnRzLnZpZGVvLmRldmljZUlkID09PSAnc3RyaW5nJykge1xuICAgICAgICBtZWRpYUNvbnN0cmFpbnRzLnZpZGVvLmRldmljZUlkID0geyBleGFjdDogY29uc3RyYWludHMudmlkZW8uZGV2aWNlSWQgfTtcbiAgICAgIH1cbiAgICAgIGlmICh1dGlscy5pc0ZpcmVmb3goKSAmJlxuICAgICAgICAgIGNvbnN0cmFpbnRzLnZpZGVvLnNvdXJjZSA9PT1cbiAgICAgICAgICAgICAgTWVkaWFGb3JtYXRNb2R1bGUuVmlkZW9Tb3VyY2VJbmZvLlNDUkVFTkNBU1QpIHtcbiAgICAgICAgbWVkaWFDb25zdHJhaW50cy52aWRlby5tZWRpYVNvdXJjZSA9ICdzY3JlZW4nO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBtZWRpYUNvbnN0cmFpbnRzLnZpZGVvID0gY29uc3RyYWludHMudmlkZW87XG4gICAgfVxuXG4gICAgaWYgKGlzVmlkZW9Db25zdHJhaW5zRm9yU2NyZWVuQ2FzdChjb25zdHJhaW50cykpIHtcbiAgICAgIHJldHVybiBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldERpc3BsYXlNZWRpYShtZWRpYUNvbnN0cmFpbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKG1lZGlhQ29uc3RyYWludHMpO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgTWVkaWFGb3JtYXQgZnJvbSAnLi9tZWRpYWZvcm1hdC5qcyc7XG5pbXBvcnQge0V2ZW50RGlzcGF0Y2hlcn0gZnJvbSAnLi4vYmFzZS9ldmVudC5qcyc7XG5cbi8qKlxuICogQGNsYXNzIEF1ZGlvUHVibGljYXRpb25TZXR0aW5nc1xuICogQG1lbWJlck9mIE93dC5CYXNlXG4gKiBAY2xhc3NEZXNjIFRoZSBhdWRpbyBzZXR0aW5ncyBvZiBhIHB1YmxpY2F0aW9uLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgQXVkaW9QdWJsaWNhdGlvblNldHRpbmdzIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgY29uc3RydWN0b3IoY29kZWMpIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/T3d0LkJhc2UuQXVkaW9Db2RlY1BhcmFtZXRlcnN9IGNvZGVjXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLkF1ZGlvUHVibGljYXRpb25TZXR0aW5nc1xuICAgICAqL1xuICAgIHRoaXMuY29kZWMgPSBjb2RlYztcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBWaWRlb1B1YmxpY2F0aW9uU2V0dGluZ3NcbiAqIEBtZW1iZXJPZiBPd3QuQmFzZVxuICogQGNsYXNzRGVzYyBUaGUgdmlkZW8gc2V0dGluZ3Mgb2YgYSBwdWJsaWNhdGlvbi5cbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFZpZGVvUHVibGljYXRpb25TZXR0aW5ncyB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKGNvZGVjLCByZXNvbHV0aW9uLCBmcmFtZVJhdGUsIGJpdHJhdGUsIGtleUZyYW1lSW50ZXJ2YWwpIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/T3d0LkJhc2UuVmlkZW9Db2RlY1BhcmFtZXRlcnN9IGNvZGVjXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlZpZGVvUHVibGljYXRpb25TZXR0aW5nc1xuICAgICAqL1xuICAgIHRoaXMuY29kZWM9Y29kZWMsXG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P093dC5CYXNlLlJlc29sdXRpb259IHJlc29sdXRpb25cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuVmlkZW9QdWJsaWNhdGlvblNldHRpbmdzXG4gICAgICovXG4gICAgdGhpcy5yZXNvbHV0aW9uPXJlc29sdXRpb247XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P251bWJlcn0gZnJhbWVSYXRlc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBjbGFzc0Rlc2MgRnJhbWVzIHBlciBzZWNvbmQuXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlZpZGVvUHVibGljYXRpb25TZXR0aW5nc1xuICAgICAqL1xuICAgIHRoaXMuZnJhbWVSYXRlPWZyYW1lUmF0ZTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/bnVtYmVyfSBiaXRyYXRlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlZpZGVvUHVibGljYXRpb25TZXR0aW5nc1xuICAgICAqL1xuICAgIHRoaXMuYml0cmF0ZT1iaXRyYXRlO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9udW1iZXJ9IGtleUZyYW1lSW50ZXJ2YWxzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGNsYXNzRGVzYyBUaGUgdGltZSBpbnRlcnZhbCBiZXR3ZWVuIGtleSBmcmFtZXMuIFVuaXQ6IHNlY29uZC5cbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuVmlkZW9QdWJsaWNhdGlvblNldHRpbmdzXG4gICAgICovXG4gICAgdGhpcy5rZXlGcmFtZUludGVydmFsPWtleUZyYW1lSW50ZXJ2YWw7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgUHVibGljYXRpb25TZXR0aW5nc1xuICogQG1lbWJlck9mIE93dC5CYXNlXG4gKiBAY2xhc3NEZXNjIFRoZSBzZXR0aW5ncyBvZiBhIHB1YmxpY2F0aW9uLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgUHVibGljYXRpb25TZXR0aW5ncyB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKGF1ZGlvLCB2aWRlbykge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge093dC5CYXNlLkF1ZGlvUHVibGljYXRpb25TZXR0aW5nc30gYXVkaW9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuUHVibGljYXRpb25TZXR0aW5nc1xuICAgICAqL1xuICAgIHRoaXMuYXVkaW89YXVkaW87XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7T3d0LkJhc2UuVmlkZW9QdWJsaWNhdGlvblNldHRpbmdzfSB2aWRlb1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5QdWJsaWNhdGlvblNldHRpbmdzXG4gICAgICovXG4gICAgdGhpcy52aWRlbz12aWRlbztcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBQdWJsaWNhdGlvblxuICogQGV4dGVuZHMgT3d0LkJhc2UuRXZlbnREaXNwYXRjaGVyXG4gKiBAbWVtYmVyT2YgT3d0LkJhc2VcbiAqIEBjbGFzc0Rlc2MgUHVibGljYXRpb24gcmVwcmVzZW50cyBhIHNlbmRlciBmb3IgcHVibGlzaGluZyBhIHN0cmVhbS4gSXRcbiAqIGhhbmRsZXMgdGhlIGFjdGlvbnMgb24gYSBMb2NhbFN0cmVhbSBwdWJsaXNoZWQgdG8gYSBjb25mZXJlbmNlLlxuICogRXZlbnRzOlxuICpcbiAqIHwgRXZlbnQgTmFtZSAgICAgIHwgQXJndW1lbnQgVHlwZSAgICB8IEZpcmVkIHdoZW4gICAgICAgfFxuICogfCAtLS0tLS0tLS0tLS0tLS0tfCAtLS0tLS0tLS0tLS0tLS0tIHwgLS0tLS0tLS0tLS0tLS0tLSB8XG4gKiB8IGVuZGVkICAgICAgICAgICB8IEV2ZW50ICAgICAgICAgICAgfCBQdWJsaWNhdGlvbiBpcyBlbmRlZC4gfFxuICogfCBlcnJvciAgICAgICAgICAgfCBFcnJvckV2ZW50ICAgICAgIHwgQW4gZXJyb3Igb2NjdXJyZWQgb24gdGhlIHB1YmxpY2F0aW9uLiB8XG4gKiB8IG11dGUgICAgICAgICAgICB8IE11dGVFdmVudCAgICAgICAgfCBQdWJsaWNhdGlvbiBpcyBtdXRlZC4gQ2xpZW50IHN0b3BwZWQgc2VuZGluZyBhdWRpbyBhbmQvb3IgdmlkZW8gZGF0YSB0byByZW1vdGUgZW5kcG9pbnQuIHxcbiAqIHwgdW5tdXRlICAgICAgICAgIHwgTXV0ZUV2ZW50ICAgICAgICB8IFB1YmxpY2F0aW9uIGlzIHVubXV0ZWQuIENsaWVudCBjb250aW51ZWQgc2VuZGluZyBhdWRpbyBhbmQvb3IgdmlkZW8gZGF0YSB0byByZW1vdGUgZW5kcG9pbnQuIHxcbiAqXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBQdWJsaWNhdGlvbiBleHRlbmRzIEV2ZW50RGlzcGF0Y2hlciB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKGlkLCBzdG9wLCBnZXRTdGF0cywgbXV0ZSwgdW5tdXRlKSB7XG4gICAgc3VwZXIoKTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IGlkXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlB1YmxpY2F0aW9uXG4gICAgICovXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdpZCcsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogaWQgPyBpZCA6IFV0aWxzLmNyZWF0ZVV1aWQoKSxcbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBAZnVuY3Rpb24gc3RvcFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBkZXNjIFN0b3AgY2VydGFpbiBwdWJsaWNhdGlvbi4gT25jZSBhIHN1YnNjcmlwdGlvbiBpcyBzdG9wcGVkLCBpdCBjYW5ub3QgYmUgcmVjb3ZlcmVkLlxuICAgICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5QdWJsaWNhdGlvblxuICAgICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICAgICovXG4gICAgdGhpcy5zdG9wID0gc3RvcDtcbiAgICAvKipcbiAgICAgKiBAZnVuY3Rpb24gZ2V0U3RhdHNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAZGVzYyBHZXQgc3RhdHMgb2YgdW5kZXJseWluZyBQZWVyQ29ubmVjdGlvbi5cbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuUHVibGljYXRpb25cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxSVENTdGF0c1JlcG9ydCwgRXJyb3I+fVxuICAgICAqL1xuICAgIHRoaXMuZ2V0U3RhdHMgPSBnZXRTdGF0cztcbiAgICAvKipcbiAgICAgKiBAZnVuY3Rpb24gbXV0ZVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBkZXNjIFN0b3Agc2VuZGluZyBkYXRhIHRvIHJlbW90ZSBlbmRwb2ludC5cbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuUHVibGljYXRpb25cbiAgICAgKiBAcGFyYW0ge093dC5CYXNlLlRyYWNrS2luZCB9IGtpbmQgS2luZCBvZiB0cmFja3MgdG8gYmUgbXV0ZWQuXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dW5kZWZpbmVkLCBFcnJvcj59XG4gICAgICovXG4gICAgdGhpcy5tdXRlID0gbXV0ZTtcbiAgICAvKipcbiAgICAgKiBAZnVuY3Rpb24gdW5tdXRlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgQ29udGludWUgc2VuZGluZyBkYXRhIHRvIHJlbW90ZSBlbmRwb2ludC5cbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuUHVibGljYXRpb25cbiAgICAgKiBAcGFyYW0ge093dC5CYXNlLlRyYWNrS2luZCB9IGtpbmQgS2luZCBvZiB0cmFja3MgdG8gYmUgdW5tdXRlZC5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx1bmRlZmluZWQsIEVycm9yPn1cbiAgICAgKi9cbiAgICB0aGlzLnVubXV0ZSA9IHVubXV0ZTtcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBQdWJsaXNoT3B0aW9uc1xuICogQG1lbWJlck9mIE93dC5CYXNlXG4gKiBAY2xhc3NEZXNjIFB1Ymxpc2hPcHRpb25zIGRlZmluZXMgb3B0aW9ucyBmb3IgcHVibGlzaGluZyBhIE93dC5CYXNlLkxvY2FsU3RyZWFtLlxuICovXG5leHBvcnQgY2xhc3MgUHVibGlzaE9wdGlvbnMge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3RvcihhdWRpbywgdmlkZW8pIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/QXJyYXk8T3d0LkJhc2UuQXVkaW9FbmNvZGluZ1BhcmFtZXRlcnM+fSBhdWRpb1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5QdWJsaXNoT3B0aW9uc1xuICAgICAqL1xuICAgIHRoaXMuYXVkaW8gPSBhdWRpbztcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/QXJyYXk8T3d0LkJhc2UuVmlkZW9FbmNvZGluZ1BhcmFtZXRlcnM+fSB2aWRlb1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5QdWJsaXNoT3B0aW9uc1xuICAgICAqL1xuICAgIHRoaXMudmlkZW8gPSB2aWRlbztcbiAgfVxufVxuIiwiLypcbiAqICBDb3B5cmlnaHQgKGMpIDIwMTQgVGhlIFdlYlJUQyBwcm9qZWN0IGF1dGhvcnMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGEgQlNELXN0eWxlIGxpY2Vuc2VcbiAqICB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluIHRoZSByb290IG9mIHRoZSBzb3VyY2VcbiAqICB0cmVlLlxuICovXG5cbi8qIE1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlc2Ugb3B0aW9ucyBhdCBqc2hpbnQuY29tL2RvY3Mvb3B0aW9ucyAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4vKiBnbG9iYWxzICBhZGFwdGVyLCB0cmFjZSAqL1xuLyogZXhwb3J0ZWQgc2V0Q29kZWNQYXJhbSwgaWNlQ2FuZGlkYXRlVHlwZSwgZm9ybWF0VHlwZVByZWZlcmVuY2UsXG4gICBtYXliZVNldE9wdXNPcHRpb25zLCBtYXliZVByZWZlckF1ZGlvUmVjZWl2ZUNvZGVjLFxuICAgbWF5YmVQcmVmZXJBdWRpb1NlbmRDb2RlYywgbWF5YmVTZXRBdWRpb1JlY2VpdmVCaXRSYXRlLFxuICAgbWF5YmVTZXRBdWRpb1NlbmRCaXRSYXRlLCBtYXliZVByZWZlclZpZGVvUmVjZWl2ZUNvZGVjLFxuICAgbWF5YmVQcmVmZXJWaWRlb1NlbmRDb2RlYywgbWF5YmVTZXRWaWRlb1JlY2VpdmVCaXRSYXRlLFxuICAgbWF5YmVTZXRWaWRlb1NlbmRCaXRSYXRlLCBtYXliZVNldFZpZGVvU2VuZEluaXRpYWxCaXRSYXRlLFxuICAgbWF5YmVSZW1vdmVWaWRlb0ZlYywgbWVyZ2VDb25zdHJhaW50cywgcmVtb3ZlQ29kZWNQYXJhbSovXG5cbi8qIFRoaXMgZmlsZSBpcyBib3Jyb3dlZCBmcm9tIGFwcHJ0YyB3aXRoIHNvbWUgbW9kaWZpY2F0aW9ucy4gKi9cbi8qIENvbW1pdCBoYXNoOiBjNmFmMGMyNWU5YWY1MjdmNzFiM2FjZGQ2YmZhMTM4OWQ3NzhmN2JkICsgUFIgNTMwICovXG5cbmltcG9ydCBMb2dnZXIgZnJvbSAnLi9sb2dnZXIuanMnO1xuXG4ndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIG1lcmdlQ29uc3RyYWludHMoY29uczEsIGNvbnMyKSB7XG4gIGlmICghY29uczEgfHwgIWNvbnMyKSB7XG4gICAgcmV0dXJuIGNvbnMxIHx8IGNvbnMyO1xuICB9XG4gIGNvbnN0IG1lcmdlZCA9IGNvbnMxO1xuICBmb3IgKGNvbnN0IGtleSBpbiBjb25zMikge1xuICAgIG1lcmdlZFtrZXldID0gY29uczJba2V5XTtcbiAgfVxuICByZXR1cm4gbWVyZ2VkO1xufVxuXG5mdW5jdGlvbiBpY2VDYW5kaWRhdGVUeXBlKGNhbmRpZGF0ZVN0cikge1xuICByZXR1cm4gY2FuZGlkYXRlU3RyLnNwbGl0KCcgJylbN107XG59XG5cbi8vIFR1cm5zIHRoZSBsb2NhbCB0eXBlIHByZWZlcmVuY2UgaW50byBhIGh1bWFuLXJlYWRhYmxlIHN0cmluZy5cbi8vIE5vdGUgdGhhdCB0aGlzIG1hcHBpbmcgaXMgYnJvd3Nlci1zcGVjaWZpYy5cbmZ1bmN0aW9uIGZvcm1hdFR5cGVQcmVmZXJlbmNlKHByZWYpIHtcbiAgaWYgKGFkYXB0ZXIuYnJvd3NlckRldGFpbHMuYnJvd3NlciA9PT0gJ2Nocm9tZScpIHtcbiAgICBzd2l0Y2ggKHByZWYpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuICdUVVJOL1RMUyc7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHJldHVybiAnVFVSTi9UQ1AnO1xuICAgICAgY2FzZSAyOlxuICAgICAgICByZXR1cm4gJ1RVUk4vVURQJztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSBlbHNlIGlmIChhZGFwdGVyLmJyb3dzZXJEZXRhaWxzLmJyb3dzZXIgPT09ICdmaXJlZm94Jykge1xuICAgIHN3aXRjaCAocHJlZikge1xuICAgICAgY2FzZSAwOlxuICAgICAgICByZXR1cm4gJ1RVUk4vVENQJztcbiAgICAgIGNhc2UgNTpcbiAgICAgICAgcmV0dXJuICdUVVJOL1VEUCc7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiBtYXliZVNldE9wdXNPcHRpb25zKHNkcCwgcGFyYW1zKSB7XG4gIC8vIFNldCBPcHVzIGluIFN0ZXJlbywgaWYgc3RlcmVvIGlzIHRydWUsIHVuc2V0IGl0LCBpZiBzdGVyZW8gaXMgZmFsc2UsIGFuZFxuICAvLyBkbyBub3RoaW5nIGlmIG90aGVyd2lzZS5cbiAgaWYgKHBhcmFtcy5vcHVzU3RlcmVvID09PSAndHJ1ZScpIHtcbiAgICBzZHAgPSBzZXRDb2RlY1BhcmFtKHNkcCwgJ29wdXMvNDgwMDAnLCAnc3RlcmVvJywgJzEnKTtcbiAgfSBlbHNlIGlmIChwYXJhbXMub3B1c1N0ZXJlbyA9PT0gJ2ZhbHNlJykge1xuICAgIHNkcCA9IHJlbW92ZUNvZGVjUGFyYW0oc2RwLCAnb3B1cy80ODAwMCcsICdzdGVyZW8nKTtcbiAgfVxuXG4gIC8vIFNldCBPcHVzIEZFQywgaWYgb3B1c2ZlYyBpcyB0cnVlLCB1bnNldCBpdCwgaWYgb3B1c2ZlYyBpcyBmYWxzZSwgYW5kXG4gIC8vIGRvIG5vdGhpbmcgaWYgb3RoZXJ3aXNlLlxuICBpZiAocGFyYW1zLm9wdXNGZWMgPT09ICd0cnVlJykge1xuICAgIHNkcCA9IHNldENvZGVjUGFyYW0oc2RwLCAnb3B1cy80ODAwMCcsICd1c2VpbmJhbmRmZWMnLCAnMScpO1xuICB9IGVsc2UgaWYgKHBhcmFtcy5vcHVzRmVjID09PSAnZmFsc2UnKSB7XG4gICAgc2RwID0gcmVtb3ZlQ29kZWNQYXJhbShzZHAsICdvcHVzLzQ4MDAwJywgJ3VzZWluYmFuZGZlYycpO1xuICB9XG5cbiAgLy8gU2V0IE9wdXMgRFRYLCBpZiBvcHVzZHR4IGlzIHRydWUsIHVuc2V0IGl0LCBpZiBvcHVzZHR4IGlzIGZhbHNlLCBhbmRcbiAgLy8gZG8gbm90aGluZyBpZiBvdGhlcndpc2UuXG4gIGlmIChwYXJhbXMub3B1c0R0eCA9PT0gJ3RydWUnKSB7XG4gICAgc2RwID0gc2V0Q29kZWNQYXJhbShzZHAsICdvcHVzLzQ4MDAwJywgJ3VzZWR0eCcsICcxJyk7XG4gIH0gZWxzZSBpZiAocGFyYW1zLm9wdXNEdHggPT09ICdmYWxzZScpIHtcbiAgICBzZHAgPSByZW1vdmVDb2RlY1BhcmFtKHNkcCwgJ29wdXMvNDgwMDAnLCAndXNlZHR4Jyk7XG4gIH1cblxuICAvLyBTZXQgT3B1cyBtYXhwbGF5YmFja3JhdGUsIGlmIHJlcXVlc3RlZC5cbiAgaWYgKHBhcmFtcy5vcHVzTWF4UGJyKSB7XG4gICAgc2RwID0gc2V0Q29kZWNQYXJhbShcbiAgICAgICAgc2RwLCAnb3B1cy80ODAwMCcsICdtYXhwbGF5YmFja3JhdGUnLCBwYXJhbXMub3B1c01heFBicik7XG4gIH1cbiAgcmV0dXJuIHNkcDtcbn1cblxuZnVuY3Rpb24gbWF5YmVTZXRBdWRpb1NlbmRCaXRSYXRlKHNkcCwgcGFyYW1zKSB7XG4gIGlmICghcGFyYW1zLmF1ZGlvU2VuZEJpdHJhdGUpIHtcbiAgICByZXR1cm4gc2RwO1xuICB9XG4gIExvZ2dlci5kZWJ1ZygnUHJlZmVyIGF1ZGlvIHNlbmQgYml0cmF0ZTogJyArIHBhcmFtcy5hdWRpb1NlbmRCaXRyYXRlKTtcbiAgcmV0dXJuIHByZWZlckJpdFJhdGUoc2RwLCBwYXJhbXMuYXVkaW9TZW5kQml0cmF0ZSwgJ2F1ZGlvJyk7XG59XG5cbmZ1bmN0aW9uIG1heWJlU2V0QXVkaW9SZWNlaXZlQml0UmF0ZShzZHAsIHBhcmFtcykge1xuICBpZiAoIXBhcmFtcy5hdWRpb1JlY3ZCaXRyYXRlKSB7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuICBMb2dnZXIuZGVidWcoJ1ByZWZlciBhdWRpbyByZWNlaXZlIGJpdHJhdGU6ICcgKyBwYXJhbXMuYXVkaW9SZWN2Qml0cmF0ZSk7XG4gIHJldHVybiBwcmVmZXJCaXRSYXRlKHNkcCwgcGFyYW1zLmF1ZGlvUmVjdkJpdHJhdGUsICdhdWRpbycpO1xufVxuXG5mdW5jdGlvbiBtYXliZVNldFZpZGVvU2VuZEJpdFJhdGUoc2RwLCBwYXJhbXMpIHtcbiAgaWYgKCFwYXJhbXMudmlkZW9TZW5kQml0cmF0ZSkge1xuICAgIHJldHVybiBzZHA7XG4gIH1cbiAgTG9nZ2VyLmRlYnVnKCdQcmVmZXIgdmlkZW8gc2VuZCBiaXRyYXRlOiAnICsgcGFyYW1zLnZpZGVvU2VuZEJpdHJhdGUpO1xuICByZXR1cm4gcHJlZmVyQml0UmF0ZShzZHAsIHBhcmFtcy52aWRlb1NlbmRCaXRyYXRlLCAndmlkZW8nKTtcbn1cblxuZnVuY3Rpb24gbWF5YmVTZXRWaWRlb1JlY2VpdmVCaXRSYXRlKHNkcCwgcGFyYW1zKSB7XG4gIGlmICghcGFyYW1zLnZpZGVvUmVjdkJpdHJhdGUpIHtcbiAgICByZXR1cm4gc2RwO1xuICB9XG4gIExvZ2dlci5kZWJ1ZygnUHJlZmVyIHZpZGVvIHJlY2VpdmUgYml0cmF0ZTogJyArIHBhcmFtcy52aWRlb1JlY3ZCaXRyYXRlKTtcbiAgcmV0dXJuIHByZWZlckJpdFJhdGUoc2RwLCBwYXJhbXMudmlkZW9SZWN2Qml0cmF0ZSwgJ3ZpZGVvJyk7XG59XG5cbi8vIEFkZCBhIGI9QVM6Yml0cmF0ZSBsaW5lIHRvIHRoZSBtPW1lZGlhVHlwZSBzZWN0aW9uLlxuZnVuY3Rpb24gcHJlZmVyQml0UmF0ZShzZHAsIGJpdHJhdGUsIG1lZGlhVHlwZSkge1xuICBjb25zdCBzZHBMaW5lcyA9IHNkcC5zcGxpdCgnXFxyXFxuJyk7XG5cbiAgLy8gRmluZCBtIGxpbmUgZm9yIHRoZSBnaXZlbiBtZWRpYVR5cGUuXG4gIGNvbnN0IG1MaW5lSW5kZXggPSBmaW5kTGluZShzZHBMaW5lcywgJ209JywgbWVkaWFUeXBlKTtcbiAgaWYgKG1MaW5lSW5kZXggPT09IG51bGwpIHtcbiAgICBMb2dnZXIuZGVidWcoJ0ZhaWxlZCB0byBhZGQgYmFuZHdpZHRoIGxpbmUgdG8gc2RwLCBhcyBubyBtLWxpbmUgZm91bmQnKTtcbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgLy8gRmluZCBuZXh0IG0tbGluZSBpZiBhbnkuXG4gIGxldCBuZXh0TUxpbmVJbmRleCA9IGZpbmRMaW5lSW5SYW5nZShzZHBMaW5lcywgbUxpbmVJbmRleCArIDEsIC0xLCAnbT0nKTtcbiAgaWYgKG5leHRNTGluZUluZGV4ID09PSBudWxsKSB7XG4gICAgbmV4dE1MaW5lSW5kZXggPSBzZHBMaW5lcy5sZW5ndGg7XG4gIH1cblxuICAvLyBGaW5kIGMtbGluZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBtLWxpbmUuXG4gIGNvbnN0IGNMaW5lSW5kZXggPSBmaW5kTGluZUluUmFuZ2Uoc2RwTGluZXMsIG1MaW5lSW5kZXggKyAxLFxuICAgICAgbmV4dE1MaW5lSW5kZXgsICdjPScpO1xuICBpZiAoY0xpbmVJbmRleCA9PT0gbnVsbCkge1xuICAgIExvZ2dlci5kZWJ1ZygnRmFpbGVkIHRvIGFkZCBiYW5kd2lkdGggbGluZSB0byBzZHAsIGFzIG5vIGMtbGluZSBmb3VuZCcpO1xuICAgIHJldHVybiBzZHA7XG4gIH1cblxuICAvLyBDaGVjayBpZiBiYW5kd2lkdGggbGluZSBhbHJlYWR5IGV4aXN0cyBiZXR3ZWVuIGMtbGluZSBhbmQgbmV4dCBtLWxpbmUuXG4gIGNvbnN0IGJMaW5lSW5kZXggPSBmaW5kTGluZUluUmFuZ2Uoc2RwTGluZXMsIGNMaW5lSW5kZXggKyAxLFxuICAgICAgbmV4dE1MaW5lSW5kZXgsICdiPUFTJyk7XG4gIGlmIChiTGluZUluZGV4KSB7XG4gICAgc2RwTGluZXMuc3BsaWNlKGJMaW5lSW5kZXgsIDEpO1xuICB9XG5cbiAgLy8gQ3JlYXRlIHRoZSBiIChiYW5kd2lkdGgpIHNkcCBsaW5lLlxuICBjb25zdCBid0xpbmUgPSAnYj1BUzonICsgYml0cmF0ZTtcbiAgLy8gQXMgcGVyIFJGQyA0NTY2LCB0aGUgYiBsaW5lIHNob3VsZCBmb2xsb3cgYWZ0ZXIgYy1saW5lLlxuICBzZHBMaW5lcy5zcGxpY2UoY0xpbmVJbmRleCArIDEsIDAsIGJ3TGluZSk7XG4gIHNkcCA9IHNkcExpbmVzLmpvaW4oJ1xcclxcbicpO1xuICByZXR1cm4gc2RwO1xufVxuXG4vLyBBZGQgYW4gYT1mbXRwOiB4LWdvb2dsZS1taW4tYml0cmF0ZT1rYnBzIGxpbmUsIGlmIHZpZGVvU2VuZEluaXRpYWxCaXRyYXRlXG4vLyBpcyBzcGVjaWZpZWQuIFdlJ2xsIGFsc28gYWRkIGEgeC1nb29nbGUtbWluLWJpdHJhdGUgdmFsdWUsIHNpbmNlIHRoZSBtYXhcbi8vIG11c3QgYmUgPj0gdGhlIG1pbi5cbmZ1bmN0aW9uIG1heWJlU2V0VmlkZW9TZW5kSW5pdGlhbEJpdFJhdGUoc2RwLCBwYXJhbXMpIHtcbiAgbGV0IGluaXRpYWxCaXRyYXRlID0gcGFyc2VJbnQocGFyYW1zLnZpZGVvU2VuZEluaXRpYWxCaXRyYXRlKTtcbiAgaWYgKCFpbml0aWFsQml0cmF0ZSkge1xuICAgIHJldHVybiBzZHA7XG4gIH1cblxuICAvLyBWYWxpZGF0ZSB0aGUgaW5pdGlhbCBiaXRyYXRlIHZhbHVlLlxuICBsZXQgbWF4Qml0cmF0ZSA9IHBhcnNlSW50KGluaXRpYWxCaXRyYXRlKTtcbiAgY29uc3QgYml0cmF0ZSA9IHBhcnNlSW50KHBhcmFtcy52aWRlb1NlbmRCaXRyYXRlKTtcbiAgaWYgKGJpdHJhdGUpIHtcbiAgICBpZiAoaW5pdGlhbEJpdHJhdGUgPiBiaXRyYXRlKSB7XG4gICAgICBMb2dnZXIuZGVidWcoJ0NsYW1waW5nIGluaXRpYWwgYml0cmF0ZSB0byBtYXggYml0cmF0ZSBvZiAnICsgYml0cmF0ZSArICcga2Jwcy4nKTtcbiAgICAgIGluaXRpYWxCaXRyYXRlID0gYml0cmF0ZTtcbiAgICAgIHBhcmFtcy52aWRlb1NlbmRJbml0aWFsQml0cmF0ZSA9IGluaXRpYWxCaXRyYXRlO1xuICAgIH1cbiAgICBtYXhCaXRyYXRlID0gYml0cmF0ZTtcbiAgfVxuXG4gIGNvbnN0IHNkcExpbmVzID0gc2RwLnNwbGl0KCdcXHJcXG4nKTtcblxuICAvLyBTZWFyY2ggZm9yIG0gbGluZS5cbiAgY29uc3QgbUxpbmVJbmRleCA9IGZpbmRMaW5lKHNkcExpbmVzLCAnbT0nLCAndmlkZW8nKTtcbiAgaWYgKG1MaW5lSW5kZXggPT09IG51bGwpIHtcbiAgICBMb2dnZXIuZGVidWcoJ0ZhaWxlZCB0byBmaW5kIHZpZGVvIG0tbGluZScpO1xuICAgIHJldHVybiBzZHA7XG4gIH1cbiAgLy8gRmlndXJlIG91dCB0aGUgZmlyc3QgY29kZWMgcGF5bG9hZCB0eXBlIG9uIHRoZSBtPXZpZGVvIFNEUCBsaW5lLlxuICBjb25zdCB2aWRlb01MaW5lID0gc2RwTGluZXNbbUxpbmVJbmRleF07XG4gIGNvbnN0IHBhdHRlcm4gPSBuZXcgUmVnRXhwKCdtPXZpZGVvXFxcXHNcXFxcZCtcXFxcc1tBLVovXStcXFxccycpO1xuICBjb25zdCBzZW5kUGF5bG9hZFR5cGUgPSB2aWRlb01MaW5lLnNwbGl0KHBhdHRlcm4pWzFdLnNwbGl0KCcgJylbMF07XG4gIGNvbnN0IGZtdHBMaW5lID0gc2RwTGluZXNbZmluZExpbmUoc2RwTGluZXMsICdhPXJ0cG1hcCcsIHNlbmRQYXlsb2FkVHlwZSldO1xuICBjb25zdCBjb2RlY05hbWUgPSBmbXRwTGluZS5zcGxpdCgnYT1ydHBtYXA6JyArXG4gICAgICBzZW5kUGF5bG9hZFR5cGUpWzFdLnNwbGl0KCcvJylbMF07XG5cbiAgLy8gVXNlIGNvZGVjIGZyb20gcGFyYW1zIGlmIHNwZWNpZmllZCB2aWEgVVJMIHBhcmFtLCBvdGhlcndpc2UgdXNlIGZyb20gU0RQLlxuICBjb25zdCBjb2RlYyA9IHBhcmFtcy52aWRlb1NlbmRDb2RlYyB8fCBjb2RlY05hbWU7XG4gIHNkcCA9IHNldENvZGVjUGFyYW0oc2RwLCBjb2RlYywgJ3gtZ29vZ2xlLW1pbi1iaXRyYXRlJyxcbiAgICAgIHBhcmFtcy52aWRlb1NlbmRJbml0aWFsQml0cmF0ZS50b1N0cmluZygpKTtcbiAgc2RwID0gc2V0Q29kZWNQYXJhbShzZHAsIGNvZGVjLCAneC1nb29nbGUtbWF4LWJpdHJhdGUnLFxuICAgICAgbWF4Qml0cmF0ZS50b1N0cmluZygpKTtcblxuICByZXR1cm4gc2RwO1xufVxuXG5mdW5jdGlvbiByZW1vdmVQYXlsb2FkVHlwZUZyb21NbGluZShtTGluZSwgcGF5bG9hZFR5cGUpIHtcbiAgbUxpbmUgPSBtTGluZS5zcGxpdCgnICcpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG1MaW5lLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKG1MaW5lW2ldID09PSBwYXlsb2FkVHlwZS50b1N0cmluZygpKSB7XG4gICAgICBtTGluZS5zcGxpY2UoaSwgMSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBtTGluZS5qb2luKCcgJyk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNvZGVjQnlOYW1lKHNkcExpbmVzLCBjb2RlYykge1xuICBjb25zdCBpbmRleCA9IGZpbmRMaW5lKHNkcExpbmVzLCAnYT1ydHBtYXAnLCBjb2RlYyk7XG4gIGlmIChpbmRleCA9PT0gbnVsbCkge1xuICAgIHJldHVybiBzZHBMaW5lcztcbiAgfVxuICBjb25zdCBwYXlsb2FkVHlwZSA9IGdldENvZGVjUGF5bG9hZFR5cGVGcm9tTGluZShzZHBMaW5lc1tpbmRleF0pO1xuICBzZHBMaW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gIC8vIFNlYXJjaCBmb3IgdGhlIHZpZGVvIG09IGxpbmUgYW5kIHJlbW92ZSB0aGUgY29kZWMuXG4gIGNvbnN0IG1MaW5lSW5kZXggPSBmaW5kTGluZShzZHBMaW5lcywgJ209JywgJ3ZpZGVvJyk7XG4gIGlmIChtTGluZUluZGV4ID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHNkcExpbmVzO1xuICB9XG4gIHNkcExpbmVzW21MaW5lSW5kZXhdID0gcmVtb3ZlUGF5bG9hZFR5cGVGcm9tTWxpbmUoc2RwTGluZXNbbUxpbmVJbmRleF0sXG4gICAgICBwYXlsb2FkVHlwZSk7XG4gIHJldHVybiBzZHBMaW5lcztcbn1cblxuZnVuY3Rpb24gcmVtb3ZlQ29kZWNCeVBheWxvYWRUeXBlKHNkcExpbmVzLCBwYXlsb2FkVHlwZSkge1xuICBjb25zdCBpbmRleCA9IGZpbmRMaW5lKHNkcExpbmVzLCAnYT1ydHBtYXAnLCBwYXlsb2FkVHlwZS50b1N0cmluZygpKTtcbiAgaWYgKGluZGV4ID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHNkcExpbmVzO1xuICB9XG4gIHNkcExpbmVzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgLy8gU2VhcmNoIGZvciB0aGUgdmlkZW8gbT0gbGluZSBhbmQgcmVtb3ZlIHRoZSBjb2RlYy5cbiAgY29uc3QgbUxpbmVJbmRleCA9IGZpbmRMaW5lKHNkcExpbmVzLCAnbT0nLCAndmlkZW8nKTtcbiAgaWYgKG1MaW5lSW5kZXggPT09IG51bGwpIHtcbiAgICByZXR1cm4gc2RwTGluZXM7XG4gIH1cbiAgc2RwTGluZXNbbUxpbmVJbmRleF0gPSByZW1vdmVQYXlsb2FkVHlwZUZyb21NbGluZShzZHBMaW5lc1ttTGluZUluZGV4XSxcbiAgICAgIHBheWxvYWRUeXBlKTtcbiAgcmV0dXJuIHNkcExpbmVzO1xufVxuXG5mdW5jdGlvbiBtYXliZVJlbW92ZVZpZGVvRmVjKHNkcCwgcGFyYW1zKSB7XG4gIGlmIChwYXJhbXMudmlkZW9GZWMgIT09ICdmYWxzZScpIHtcbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgbGV0IHNkcExpbmVzID0gc2RwLnNwbGl0KCdcXHJcXG4nKTtcblxuICBsZXQgaW5kZXggPSBmaW5kTGluZShzZHBMaW5lcywgJ2E9cnRwbWFwJywgJ3JlZCcpO1xuICBpZiAoaW5kZXggPT09IG51bGwpIHtcbiAgICByZXR1cm4gc2RwO1xuICB9XG4gIGNvbnN0IHJlZFBheWxvYWRUeXBlID0gZ2V0Q29kZWNQYXlsb2FkVHlwZUZyb21MaW5lKHNkcExpbmVzW2luZGV4XSk7XG4gIHNkcExpbmVzID0gcmVtb3ZlQ29kZWNCeVBheWxvYWRUeXBlKHNkcExpbmVzLCByZWRQYXlsb2FkVHlwZSk7XG5cbiAgc2RwTGluZXMgPSByZW1vdmVDb2RlY0J5TmFtZShzZHBMaW5lcywgJ3VscGZlYycpO1xuXG4gIC8vIFJlbW92ZSBmbXRwIGxpbmVzIGFzc29jaWF0ZWQgd2l0aCByZWQgY29kZWMuXG4gIGluZGV4ID0gZmluZExpbmUoc2RwTGluZXMsICdhPWZtdHAnLCByZWRQYXlsb2FkVHlwZS50b1N0cmluZygpKTtcbiAgaWYgKGluZGV4ID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuICBjb25zdCBmbXRwTGluZSA9IHBhcnNlRm10cExpbmUoc2RwTGluZXNbaW5kZXhdKTtcbiAgY29uc3QgcnR4UGF5bG9hZFR5cGUgPSBmbXRwTGluZS5wdDtcbiAgaWYgKHJ0eFBheWxvYWRUeXBlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuICBzZHBMaW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gIHNkcExpbmVzID0gcmVtb3ZlQ29kZWNCeVBheWxvYWRUeXBlKHNkcExpbmVzLCBydHhQYXlsb2FkVHlwZSk7XG4gIHJldHVybiBzZHBMaW5lcy5qb2luKCdcXHJcXG4nKTtcbn1cblxuLy8gUHJvbW90ZXMgfGF1ZGlvU2VuZENvZGVjfCB0byBiZSB0aGUgZmlyc3QgaW4gdGhlIG09YXVkaW8gbGluZSwgaWYgc2V0LlxuZnVuY3Rpb24gbWF5YmVQcmVmZXJBdWRpb1NlbmRDb2RlYyhzZHAsIHBhcmFtcykge1xuICByZXR1cm4gbWF5YmVQcmVmZXJDb2RlYyhzZHAsICdhdWRpbycsICdzZW5kJywgcGFyYW1zLmF1ZGlvU2VuZENvZGVjKTtcbn1cblxuLy8gUHJvbW90ZXMgfGF1ZGlvUmVjdkNvZGVjfCB0byBiZSB0aGUgZmlyc3QgaW4gdGhlIG09YXVkaW8gbGluZSwgaWYgc2V0LlxuZnVuY3Rpb24gbWF5YmVQcmVmZXJBdWRpb1JlY2VpdmVDb2RlYyhzZHAsIHBhcmFtcykge1xuICByZXR1cm4gbWF5YmVQcmVmZXJDb2RlYyhzZHAsICdhdWRpbycsICdyZWNlaXZlJywgcGFyYW1zLmF1ZGlvUmVjdkNvZGVjKTtcbn1cblxuLy8gUHJvbW90ZXMgfHZpZGVvU2VuZENvZGVjfCB0byBiZSB0aGUgZmlyc3QgaW4gdGhlIG09YXVkaW8gbGluZSwgaWYgc2V0LlxuZnVuY3Rpb24gbWF5YmVQcmVmZXJWaWRlb1NlbmRDb2RlYyhzZHAsIHBhcmFtcykge1xuICByZXR1cm4gbWF5YmVQcmVmZXJDb2RlYyhzZHAsICd2aWRlbycsICdzZW5kJywgcGFyYW1zLnZpZGVvU2VuZENvZGVjKTtcbn1cblxuLy8gUHJvbW90ZXMgfHZpZGVvUmVjdkNvZGVjfCB0byBiZSB0aGUgZmlyc3QgaW4gdGhlIG09YXVkaW8gbGluZSwgaWYgc2V0LlxuZnVuY3Rpb24gbWF5YmVQcmVmZXJWaWRlb1JlY2VpdmVDb2RlYyhzZHAsIHBhcmFtcykge1xuICByZXR1cm4gbWF5YmVQcmVmZXJDb2RlYyhzZHAsICd2aWRlbycsICdyZWNlaXZlJywgcGFyYW1zLnZpZGVvUmVjdkNvZGVjKTtcbn1cblxuLy8gU2V0cyB8Y29kZWN8IGFzIHRoZSBkZWZhdWx0IHx0eXBlfCBjb2RlYyBpZiBpdCdzIHByZXNlbnQuXG4vLyBUaGUgZm9ybWF0IG9mIHxjb2RlY3wgaXMgJ05BTUUvUkFURScsIGUuZy4gJ29wdXMvNDgwMDAnLlxuZnVuY3Rpb24gbWF5YmVQcmVmZXJDb2RlYyhzZHAsIHR5cGUsIGRpciwgY29kZWMpIHtcbiAgY29uc3Qgc3RyID0gdHlwZSArICcgJyArIGRpciArICcgY29kZWMnO1xuICBpZiAoIWNvZGVjKSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdObyBwcmVmZXJlbmNlIG9uICcgKyBzdHIgKyAnLicpO1xuICAgIHJldHVybiBzZHA7XG4gIH1cblxuICBMb2dnZXIuZGVidWcoJ1ByZWZlciAnICsgc3RyICsgJzogJyArIGNvZGVjKTtcblxuICBjb25zdCBzZHBMaW5lcyA9IHNkcC5zcGxpdCgnXFxyXFxuJyk7XG5cbiAgLy8gU2VhcmNoIGZvciBtIGxpbmUuXG4gIGNvbnN0IG1MaW5lSW5kZXggPSBmaW5kTGluZShzZHBMaW5lcywgJ209JywgdHlwZSk7XG4gIGlmIChtTGluZUluZGV4ID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIC8vIElmIHRoZSBjb2RlYyBpcyBhdmFpbGFibGUsIHNldCBpdCBhcyB0aGUgZGVmYXVsdCBpbiBtIGxpbmUuXG4gIGxldCBwYXlsb2FkID0gbnVsbDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZHBMaW5lcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGluZGV4ID0gZmluZExpbmVJblJhbmdlKHNkcExpbmVzLCBpLCAtMSwgJ2E9cnRwbWFwJywgY29kZWMpO1xuICAgIGlmIChpbmRleCAhPT0gbnVsbCkge1xuICAgICAgcGF5bG9hZCA9IGdldENvZGVjUGF5bG9hZFR5cGVGcm9tTGluZShzZHBMaW5lc1tpbmRleF0pO1xuICAgICAgaWYgKHBheWxvYWQpIHtcbiAgICAgICAgc2RwTGluZXNbbUxpbmVJbmRleF0gPSBzZXREZWZhdWx0Q29kZWMoc2RwTGluZXNbbUxpbmVJbmRleF0sIHBheWxvYWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNkcCA9IHNkcExpbmVzLmpvaW4oJ1xcclxcbicpO1xuICByZXR1cm4gc2RwO1xufVxuXG4vLyBTZXQgZm10cCBwYXJhbSB0byBzcGVjaWZpYyBjb2RlYyBpbiBTRFAuIElmIHBhcmFtIGRvZXMgbm90IGV4aXN0cywgYWRkIGl0LlxuZnVuY3Rpb24gc2V0Q29kZWNQYXJhbShzZHAsIGNvZGVjLCBwYXJhbSwgdmFsdWUpIHtcbiAgbGV0IHNkcExpbmVzID0gc2RwLnNwbGl0KCdcXHJcXG4nKTtcbiAgLy8gU0RQcyBzZW50IGZyb20gTUNVIHVzZSBcXG4gYXMgbGluZSBicmVhay5cbiAgaWYgKHNkcExpbmVzLmxlbmd0aCA8PSAxKSB7XG4gICAgc2RwTGluZXMgPSBzZHAuc3BsaXQoJ1xcbicpO1xuICB9XG5cbiAgY29uc3QgZm10cExpbmVJbmRleCA9IGZpbmRGbXRwTGluZShzZHBMaW5lcywgY29kZWMpO1xuXG4gIGxldCBmbXRwT2JqID0ge307XG4gIGlmIChmbXRwTGluZUluZGV4ID09PSBudWxsKSB7XG4gICAgY29uc3QgaW5kZXggPSBmaW5kTGluZShzZHBMaW5lcywgJ2E9cnRwbWFwJywgY29kZWMpO1xuICAgIGlmIChpbmRleCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHNkcDtcbiAgICB9XG4gICAgY29uc3QgcGF5bG9hZCA9IGdldENvZGVjUGF5bG9hZFR5cGVGcm9tTGluZShzZHBMaW5lc1tpbmRleF0pO1xuICAgIGZtdHBPYmoucHQgPSBwYXlsb2FkLnRvU3RyaW5nKCk7XG4gICAgZm10cE9iai5wYXJhbXMgPSB7fTtcbiAgICBmbXRwT2JqLnBhcmFtc1twYXJhbV0gPSB2YWx1ZTtcbiAgICBzZHBMaW5lcy5zcGxpY2UoaW5kZXggKyAxLCAwLCB3cml0ZUZtdHBMaW5lKGZtdHBPYmopKTtcbiAgfSBlbHNlIHtcbiAgICBmbXRwT2JqID0gcGFyc2VGbXRwTGluZShzZHBMaW5lc1tmbXRwTGluZUluZGV4XSk7XG4gICAgZm10cE9iai5wYXJhbXNbcGFyYW1dID0gdmFsdWU7XG4gICAgc2RwTGluZXNbZm10cExpbmVJbmRleF0gPSB3cml0ZUZtdHBMaW5lKGZtdHBPYmopO1xuICB9XG5cbiAgc2RwID0gc2RwTGluZXMuam9pbignXFxyXFxuJyk7XG4gIHJldHVybiBzZHA7XG59XG5cbi8vIFJlbW92ZSBmbXRwIHBhcmFtIGlmIGl0IGV4aXN0cy5cbmZ1bmN0aW9uIHJlbW92ZUNvZGVjUGFyYW0oc2RwLCBjb2RlYywgcGFyYW0pIHtcbiAgY29uc3Qgc2RwTGluZXMgPSBzZHAuc3BsaXQoJ1xcclxcbicpO1xuXG4gIGNvbnN0IGZtdHBMaW5lSW5kZXggPSBmaW5kRm10cExpbmUoc2RwTGluZXMsIGNvZGVjKTtcbiAgaWYgKGZtdHBMaW5lSW5kZXggPT09IG51bGwpIHtcbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgY29uc3QgbWFwID0gcGFyc2VGbXRwTGluZShzZHBMaW5lc1tmbXRwTGluZUluZGV4XSk7XG4gIGRlbGV0ZSBtYXAucGFyYW1zW3BhcmFtXTtcblxuICBjb25zdCBuZXdMaW5lID0gd3JpdGVGbXRwTGluZShtYXApO1xuICBpZiAobmV3TGluZSA9PT0gbnVsbCkge1xuICAgIHNkcExpbmVzLnNwbGljZShmbXRwTGluZUluZGV4LCAxKTtcbiAgfSBlbHNlIHtcbiAgICBzZHBMaW5lc1tmbXRwTGluZUluZGV4XSA9IG5ld0xpbmU7XG4gIH1cblxuICBzZHAgPSBzZHBMaW5lcy5qb2luKCdcXHJcXG4nKTtcbiAgcmV0dXJuIHNkcDtcbn1cblxuLy8gU3BsaXQgYW4gZm10cCBsaW5lIGludG8gYW4gb2JqZWN0IGluY2x1ZGluZyAncHQnIGFuZCAncGFyYW1zJy5cbmZ1bmN0aW9uIHBhcnNlRm10cExpbmUoZm10cExpbmUpIHtcbiAgY29uc3QgZm10cE9iaiA9IHt9O1xuICBjb25zdCBzcGFjZVBvcyA9IGZtdHBMaW5lLmluZGV4T2YoJyAnKTtcbiAgY29uc3Qga2V5VmFsdWVzID0gZm10cExpbmUuc3Vic3RyaW5nKHNwYWNlUG9zICsgMSkuc3BsaXQoJzsnKTtcblxuICBjb25zdCBwYXR0ZXJuID0gbmV3IFJlZ0V4cCgnYT1mbXRwOihcXFxcZCspJyk7XG4gIGNvbnN0IHJlc3VsdCA9IGZtdHBMaW5lLm1hdGNoKHBhdHRlcm4pO1xuICBpZiAocmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPT09IDIpIHtcbiAgICBmbXRwT2JqLnB0ID0gcmVzdWx0WzFdO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgcGFyYW1zID0ge307XG4gIGZvciAobGV0IGkgPSAwOyBpIDwga2V5VmFsdWVzLmxlbmd0aDsgKytpKSB7XG4gICAgY29uc3QgcGFpciA9IGtleVZhbHVlc1tpXS5zcGxpdCgnPScpO1xuICAgIGlmIChwYWlyLmxlbmd0aCA9PT0gMikge1xuICAgICAgcGFyYW1zW3BhaXJbMF1dID0gcGFpclsxXTtcbiAgICB9XG4gIH1cbiAgZm10cE9iai5wYXJhbXMgPSBwYXJhbXM7XG5cbiAgcmV0dXJuIGZtdHBPYmo7XG59XG5cbi8vIEdlbmVyYXRlIGFuIGZtdHAgbGluZSBmcm9tIGFuIG9iamVjdCBpbmNsdWRpbmcgJ3B0JyBhbmQgJ3BhcmFtcycuXG5mdW5jdGlvbiB3cml0ZUZtdHBMaW5lKGZtdHBPYmopIHtcbiAgaWYgKCFmbXRwT2JqLmhhc093blByb3BlcnR5KCdwdCcpIHx8ICFmbXRwT2JqLmhhc093blByb3BlcnR5KCdwYXJhbXMnKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnN0IHB0ID0gZm10cE9iai5wdDtcbiAgY29uc3QgcGFyYW1zID0gZm10cE9iai5wYXJhbXM7XG4gIGNvbnN0IGtleVZhbHVlcyA9IFtdO1xuICBsZXQgaSA9IDA7XG4gIGZvciAoY29uc3Qga2V5IGluIHBhcmFtcykge1xuICAgIGtleVZhbHVlc1tpXSA9IGtleSArICc9JyArIHBhcmFtc1trZXldO1xuICAgICsraTtcbiAgfVxuICBpZiAoaSA9PT0gMCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiAnYT1mbXRwOicgKyBwdC50b1N0cmluZygpICsgJyAnICsga2V5VmFsdWVzLmpvaW4oJzsnKTtcbn1cblxuLy8gRmluZCBmbXRwIGF0dHJpYnV0ZSBmb3IgfGNvZGVjfCBpbiB8c2RwTGluZXN8LlxuZnVuY3Rpb24gZmluZEZtdHBMaW5lKHNkcExpbmVzLCBjb2RlYykge1xuICAvLyBGaW5kIHBheWxvYWQgb2YgY29kZWMuXG4gIGNvbnN0IHBheWxvYWQgPSBnZXRDb2RlY1BheWxvYWRUeXBlKHNkcExpbmVzLCBjb2RlYyk7XG4gIC8vIEZpbmQgdGhlIHBheWxvYWQgaW4gZm10cCBsaW5lLlxuICByZXR1cm4gcGF5bG9hZCA/IGZpbmRMaW5lKHNkcExpbmVzLCAnYT1mbXRwOicgKyBwYXlsb2FkLnRvU3RyaW5nKCkpIDogbnVsbDtcbn1cblxuLy8gRmluZCB0aGUgbGluZSBpbiBzZHBMaW5lcyB0aGF0IHN0YXJ0cyB3aXRoIHxwcmVmaXh8LCBhbmQsIGlmIHNwZWNpZmllZCxcbi8vIGNvbnRhaW5zIHxzdWJzdHJ8IChjYXNlLWluc2Vuc2l0aXZlIHNlYXJjaCkuXG5mdW5jdGlvbiBmaW5kTGluZShzZHBMaW5lcywgcHJlZml4LCBzdWJzdHIpIHtcbiAgcmV0dXJuIGZpbmRMaW5lSW5SYW5nZShzZHBMaW5lcywgMCwgLTEsIHByZWZpeCwgc3Vic3RyKTtcbn1cblxuLy8gRmluZCB0aGUgbGluZSBpbiBzZHBMaW5lc1tzdGFydExpbmUuLi5lbmRMaW5lIC0gMV0gdGhhdCBzdGFydHMgd2l0aCB8cHJlZml4fFxuLy8gYW5kLCBpZiBzcGVjaWZpZWQsIGNvbnRhaW5zIHxzdWJzdHJ8IChjYXNlLWluc2Vuc2l0aXZlIHNlYXJjaCkuXG5mdW5jdGlvbiBmaW5kTGluZUluUmFuZ2Uoc2RwTGluZXMsIHN0YXJ0TGluZSwgZW5kTGluZSwgcHJlZml4LCBzdWJzdHIpIHtcbiAgY29uc3QgcmVhbEVuZExpbmUgPSBlbmRMaW5lICE9PSAtMSA/IGVuZExpbmUgOiBzZHBMaW5lcy5sZW5ndGg7XG4gIGZvciAobGV0IGkgPSBzdGFydExpbmU7IGkgPCByZWFsRW5kTGluZTsgKytpKSB7XG4gICAgaWYgKHNkcExpbmVzW2ldLmluZGV4T2YocHJlZml4KSA9PT0gMCkge1xuICAgICAgaWYgKCFzdWJzdHIgfHxcbiAgICAgICAgICBzZHBMaW5lc1tpXS50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc3Vic3RyLnRvTG93ZXJDYXNlKCkpICE9PSAtMSkge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8vIEdldHMgdGhlIGNvZGVjIHBheWxvYWQgdHlwZSBmcm9tIHNkcCBsaW5lcy5cbmZ1bmN0aW9uIGdldENvZGVjUGF5bG9hZFR5cGUoc2RwTGluZXMsIGNvZGVjKSB7XG4gIGNvbnN0IGluZGV4ID0gZmluZExpbmUoc2RwTGluZXMsICdhPXJ0cG1hcCcsIGNvZGVjKTtcbiAgcmV0dXJuIGluZGV4ID8gZ2V0Q29kZWNQYXlsb2FkVHlwZUZyb21MaW5lKHNkcExpbmVzW2luZGV4XSkgOiBudWxsO1xufVxuXG4vLyBHZXRzIHRoZSBjb2RlYyBwYXlsb2FkIHR5cGUgZnJvbSBhbiBhPXJ0cG1hcDpYIGxpbmUuXG5mdW5jdGlvbiBnZXRDb2RlY1BheWxvYWRUeXBlRnJvbUxpbmUoc2RwTGluZSkge1xuICBjb25zdCBwYXR0ZXJuID0gbmV3IFJlZ0V4cCgnYT1ydHBtYXA6KFxcXFxkKykgW2EtekEtWjAtOS1dK1xcXFwvXFxcXGQrJyk7XG4gIGNvbnN0IHJlc3VsdCA9IHNkcExpbmUubWF0Y2gocGF0dGVybik7XG4gIHJldHVybiAocmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPT09IDIpID8gcmVzdWx0WzFdIDogbnVsbDtcbn1cblxuLy8gUmV0dXJucyBhIG5ldyBtPSBsaW5lIHdpdGggdGhlIHNwZWNpZmllZCBjb2RlYyBhcyB0aGUgZmlyc3Qgb25lLlxuZnVuY3Rpb24gc2V0RGVmYXVsdENvZGVjKG1MaW5lLCBwYXlsb2FkKSB7XG4gIGNvbnN0IGVsZW1lbnRzID0gbUxpbmUuc3BsaXQoJyAnKTtcblxuICAvLyBKdXN0IGNvcHkgdGhlIGZpcnN0IHRocmVlIHBhcmFtZXRlcnM7IGNvZGVjIG9yZGVyIHN0YXJ0cyBvbiBmb3VydGguXG4gIGNvbnN0IG5ld0xpbmUgPSBlbGVtZW50cy5zbGljZSgwLCAzKTtcblxuICAvLyBQdXQgdGFyZ2V0IHBheWxvYWQgZmlyc3QgYW5kIGNvcHkgaW4gdGhlIHJlc3QuXG4gIG5ld0xpbmUucHVzaChwYXlsb2FkKTtcbiAgZm9yIChsZXQgaSA9IDM7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChlbGVtZW50c1tpXSAhPT0gcGF5bG9hZCkge1xuICAgICAgbmV3TGluZS5wdXNoKGVsZW1lbnRzW2ldKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5ld0xpbmUuam9pbignICcpO1xufVxuXG4vKiBCZWxvdyBhcmUgbmV3bHkgYWRkZWQgZnVuY3Rpb25zICovXG5cbi8vIEZvbGxvd2luZyBjb2RlY3Mgd2lsbCBub3QgYmUgcmVtb3ZlZCBmcm9tIFNEUCBldmVudCB0aGV5IGFyZSBub3QgaW4gdGhlXG4vLyB1c2VyLXNwZWNpZmllZCBjb2RlYyBsaXN0LlxuY29uc3QgYXVkaW9Db2RlY1doaXRlTGlzdCA9IFsnQ04nLCAndGVsZXBob25lLWV2ZW50J107XG5jb25zdCB2aWRlb0NvZGVjV2hpdGVMaXN0ID0gWydyZWQnLCAndWxwZmVjJ107XG5cbi8vIFJldHVybnMgYSBuZXcgbT0gbGluZSB3aXRoIHRoZSBzcGVjaWZpZWQgY29kZWMgb3JkZXIuXG5mdW5jdGlvbiBzZXRDb2RlY09yZGVyKG1MaW5lLCBwYXlsb2Fkcykge1xuICBjb25zdCBlbGVtZW50cyA9IG1MaW5lLnNwbGl0KCcgJyk7XG5cbiAgLy8gSnVzdCBjb3B5IHRoZSBmaXJzdCB0aHJlZSBwYXJhbWV0ZXJzOyBjb2RlYyBvcmRlciBzdGFydHMgb24gZm91cnRoLlxuICBsZXQgbmV3TGluZSA9IGVsZW1lbnRzLnNsaWNlKDAsIDMpO1xuXG4gIC8vIENvbmNhdCBwYXlsb2FkIHR5cGVzLlxuICBuZXdMaW5lID0gbmV3TGluZS5jb25jYXQocGF5bG9hZHMpO1xuXG4gIHJldHVybiBuZXdMaW5lLmpvaW4oJyAnKTtcbn1cblxuLy8gQXBwZW5kIFJUWCBwYXlsb2FkcyBmb3IgZXhpc3RpbmcgcGF5bG9hZHMuXG5mdW5jdGlvbiBhcHBlbmRSdHhQYXlsb2FkcyhzZHBMaW5lcywgcGF5bG9hZHMpIHtcbiAgZm9yIChjb25zdCBwYXlsb2FkIG9mIHBheWxvYWRzKSB7XG4gICAgY29uc3QgaW5kZXggPSBmaW5kTGluZShzZHBMaW5lcywgJ2E9Zm10cCcsICdhcHQ9JyArIHBheWxvYWQpO1xuICAgIGlmIChpbmRleCAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgZm10cExpbmUgPSBwYXJzZUZtdHBMaW5lKHNkcExpbmVzW2luZGV4XSk7XG4gICAgICBwYXlsb2Fkcy5wdXNoKGZtdHBMaW5lLnB0KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBheWxvYWRzO1xufVxuXG4vLyBSZW1vdmUgYSBjb2RlYyB3aXRoIGFsbCBpdHMgYXNzb2NpYXRlZCBhIGxpbmVzLlxuZnVuY3Rpb24gcmVtb3ZlQ29kZWNGcmFtQUxpbmUoc2RwTGluZXMsIHBheWxvYWQpIHtcbiAgY29uc3QgcGF0dGVybiA9IG5ldyBSZWdFeHAoJ2E9KHJ0cG1hcHxydGNwLWZifGZtdHApOicrcGF5bG9hZCsnXFxcXHMnKTtcbiAgZm9yIChsZXQgaT1zZHBMaW5lcy5sZW5ndGgtMTsgaT4wOyBpLS0pIHtcbiAgICBpZiAoc2RwTGluZXNbaV0ubWF0Y2gocGF0dGVybikpIHtcbiAgICAgIHNkcExpbmVzLnNwbGljZShpLCAxKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNkcExpbmVzO1xufVxuXG4vLyBSZW9yZGVyIGNvZGVjcyBpbiBtLWxpbmUgYWNjb3JkaW5nIHRoZSBvcmRlciBvZiB8Y29kZWNzfC4gUmVtb3ZlIGNvZGVjcyBmcm9tXG4vLyBtLWxpbmUgaWYgaXQgaXMgbm90IHByZXNlbnQgaW4gfGNvZGVjc3xcbi8vIFRoZSBmb3JtYXQgb2YgfGNvZGVjfCBpcyAnTkFNRS9SQVRFJywgZS5nLiAnb3B1cy80ODAwMCcuXG5leHBvcnQgZnVuY3Rpb24gcmVvcmRlckNvZGVjcyhzZHAsIHR5cGUsIGNvZGVjcykge1xuICBpZiAoIWNvZGVjcyB8fCBjb2RlY3MubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIGNvZGVjcyA9IHR5cGUgPT09ICdhdWRpbycgPyBjb2RlY3MuY29uY2F0KGF1ZGlvQ29kZWNXaGl0ZUxpc3QpIDogY29kZWNzLmNvbmNhdChcbiAgICAgIHZpZGVvQ29kZWNXaGl0ZUxpc3QpO1xuXG4gIGxldCBzZHBMaW5lcyA9IHNkcC5zcGxpdCgnXFxyXFxuJyk7XG5cbiAgLy8gU2VhcmNoIGZvciBtIGxpbmUuXG4gIGNvbnN0IG1MaW5lSW5kZXggPSBmaW5kTGluZShzZHBMaW5lcywgJ209JywgdHlwZSk7XG4gIGlmIChtTGluZUluZGV4ID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIGNvbnN0IG9yaWdpblBheWxvYWRzID0gc2RwTGluZXNbbUxpbmVJbmRleF0uc3BsaXQoJyAnKTtcbiAgb3JpZ2luUGF5bG9hZHMuc3BsaWNlKDAsIDMpO1xuXG4gIC8vIElmIHRoZSBjb2RlYyBpcyBhdmFpbGFibGUsIHNldCBpdCBhcyB0aGUgZGVmYXVsdCBpbiBtIGxpbmUuXG4gIGxldCBwYXlsb2FkcyA9IFtdO1xuICBmb3IgKGNvbnN0IGNvZGVjIG9mIGNvZGVjcykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2RwTGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gZmluZExpbmVJblJhbmdlKHNkcExpbmVzLCBpLCAtMSwgJ2E9cnRwbWFwJywgY29kZWMpO1xuICAgICAgaWYgKGluZGV4ICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBnZXRDb2RlY1BheWxvYWRUeXBlRnJvbUxpbmUoc2RwTGluZXNbaW5kZXhdKTtcbiAgICAgICAgaWYgKHBheWxvYWQpIHtcbiAgICAgICAgICBwYXlsb2Fkcy5wdXNoKHBheWxvYWQpO1xuICAgICAgICAgIGkgPSBpbmRleDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBwYXlsb2FkcyA9IGFwcGVuZFJ0eFBheWxvYWRzKHNkcExpbmVzLCBwYXlsb2Fkcyk7XG4gIHNkcExpbmVzW21MaW5lSW5kZXhdID0gc2V0Q29kZWNPcmRlcihzZHBMaW5lc1ttTGluZUluZGV4XSwgcGF5bG9hZHMpO1xuXG4gIC8vIFJlbW92ZSBhIGxpbmVzLlxuICBmb3IgKGNvbnN0IHBheWxvYWQgb2Ygb3JpZ2luUGF5bG9hZHMpIHtcbiAgICBpZiAocGF5bG9hZHMuaW5kZXhPZihwYXlsb2FkKT09PS0xKSB7XG4gICAgICBzZHBMaW5lcyA9IHJlbW92ZUNvZGVjRnJhbUFMaW5lKHNkcExpbmVzLCBwYXlsb2FkKTtcbiAgICB9XG4gIH1cblxuICBzZHAgPSBzZHBMaW5lcy5qb2luKCdcXHJcXG4nKTtcbiAgcmV0dXJuIHNkcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldE1heEJpdHJhdGUoc2RwLCBlbmNvZGluZ1BhcmFtZXRlcnNMaXN0KSB7XG4gIGZvciAoY29uc3QgZW5jb2RpbmdQYXJhbWV0ZXJzIG9mIGVuY29kaW5nUGFyYW1ldGVyc0xpc3QpIHtcbiAgICBpZiAoZW5jb2RpbmdQYXJhbWV0ZXJzLm1heEJpdHJhdGUpIHtcbiAgICAgIHNkcCA9IHNldENvZGVjUGFyYW0oXG4gICAgICAgICAgc2RwLCBlbmNvZGluZ1BhcmFtZXRlcnMuY29kZWMubmFtZSwgJ3gtZ29vZ2xlLW1heC1iaXRyYXRlJyxcbiAgICAgICAgICAoZW5jb2RpbmdQYXJhbWV0ZXJzLm1heEJpdHJhdGUpLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc2RwO1xufVxuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4ndXNlIHN0cmljdCc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vbG9nZ2VyLmpzJ1xuaW1wb3J0IHtPd3RFdmVudH0gZnJvbSAnLi9ldmVudC5qcydcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vdXRpbHMuanMnXG5pbXBvcnQgeyBFdmVudERpc3BhdGNoZXJ9IGZyb20gJy4vZXZlbnQuanMnO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuZnVuY3Rpb24gaXNBbGxvd2VkVmFsdWUob2JqLCBhbGxvd2VkVmFsdWVzKSB7XG4gIHJldHVybiAoYWxsb3dlZFZhbHVlcy5zb21lKChlbGUpID0+IHtcbiAgICByZXR1cm4gZWxlID09PSBvYmo7XG4gIH0pKTtcbn1cbi8qKlxuICogQGNsYXNzIFN0cmVhbVNvdXJjZUluZm9cbiAqIEBtZW1iZXJPZiBPd3QuQmFzZVxuICogQGNsYXNzRGVzYyBJbmZvcm1hdGlvbiBvZiBhIHN0cmVhbSdzIHNvdXJjZS5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGRlc2NyaXB0aW9uIEF1ZGlvIHNvdXJjZSBpbmZvIG9yIHZpZGVvIHNvdXJjZSBpbmZvIGNvdWxkIGJlIHVuZGVmaW5lZCBpZiBhIHN0cmVhbSBkb2VzIG5vdCBoYXZlIGF1ZGlvL3ZpZGVvIHRyYWNrLlxuICogQHBhcmFtIHs/c3RyaW5nfSBhdWRpb1NvdXJjZUluZm8gQXVkaW8gc291cmNlIGluZm8uIEFjY2VwdGVkIHZhbHVlcyBhcmU6IFwibWljXCIsIFwic2NyZWVuLWNhc3RcIiwgXCJmaWxlXCIsIFwibWl4ZWRcIiBvciB1bmRlZmluZWQuXG4gKiBAcGFyYW0gez9zdHJpbmd9IHZpZGVvU291cmNlSW5mbyBWaWRlbyBzb3VyY2UgaW5mby4gQWNjZXB0ZWQgdmFsdWVzIGFyZTogXCJjYW1lcmFcIiwgXCJzY3JlZW4tY2FzdFwiLCBcImZpbGVcIiwgXCJtaXhlZFwiIG9yIHVuZGVmaW5lZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0cmVhbVNvdXJjZUluZm8ge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3RvcihhdWRpb1NvdXJjZUluZm8sIHZpZGVvU291cmNlSW5mbykge1xuICAgIGlmICghaXNBbGxvd2VkVmFsdWUoYXVkaW9Tb3VyY2VJbmZvLCBbdW5kZWZpbmVkLCAnbWljJywgJ3NjcmVlbi1jYXN0JyxcbiAgICAgICdmaWxlJywgJ21peGVkJ10pKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbmNvcnJlY3QgdmFsdWUgZm9yIGF1ZGlvU291cmNlSW5mbycpO1xuICAgIH1cbiAgICBpZiAoIWlzQWxsb3dlZFZhbHVlKHZpZGVvU291cmNlSW5mbywgW3VuZGVmaW5lZCwgJ2NhbWVyYScsICdzY3JlZW4tY2FzdCcsXG4gICAgICAnZmlsZScsICdlbmNvZGVkLWZpbGUnLCAncmF3LWZpbGUnLCAnbWl4ZWQnXSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0luY29ycmVjdCB2YWx1ZSBmb3IgdmlkZW9Tb3VyY2VJbmZvJyk7XG4gICAgfVxuICAgIHRoaXMuYXVkaW8gPSBhdWRpb1NvdXJjZUluZm87XG4gICAgdGhpcy52aWRlbyA9IHZpZGVvU291cmNlSW5mbztcbiAgfVxufVxuLyoqXG4gKiBAY2xhc3MgU3RyZWFtXG4gKiBAbWVtYmVyT2YgT3d0LkJhc2VcbiAqIEBjbGFzc0Rlc2MgQmFzZSBjbGFzcyBvZiBzdHJlYW1zLlxuICogQGV4dGVuZHMgT3d0LkJhc2UuRXZlbnREaXNwYXRjaGVyXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBTdHJlYW0gZXh0ZW5kcyBFdmVudERpc3BhdGNoZXIge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3RvcihzdHJlYW0sIHNvdXJjZUluZm8sIGF0dHJpYnV0ZXMpIHtcbiAgICBzdXBlcigpO1xuICAgIGlmICgoc3RyZWFtICYmICEoc3RyZWFtIGluc3RhbmNlb2YgTWVkaWFTdHJlYW0pKSB8fCAodHlwZW9mIHNvdXJjZUluZm8gIT09XG4gICAgICAgICdvYmplY3QnKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBzdHJlYW0gb3Igc291cmNlSW5mby4nKTtcbiAgICB9XG4gICAgaWYgKHN0cmVhbSAmJiAoKHN0cmVhbS5nZXRBdWRpb1RyYWNrcygpLmxlbmd0aCA+IDAgJiYgIXNvdXJjZUluZm8uYXVkaW8pIHx8XG4gICAgICAgIHN0cmVhbS5nZXRWaWRlb1RyYWNrcygpLmxlbmd0aCA+IDAgJiYgIXNvdXJjZUluZm8udmlkZW8pKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdNaXNzaW5nIGF1ZGlvIHNvdXJjZSBpbmZvIG9yIHZpZGVvIHNvdXJjZSBpbmZvLicpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/TWVkaWFTdHJlYW19IG1lZGlhU3RyZWFtXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlN0cmVhbVxuICAgICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9tZWRpYWNhcHR1cmUtc3RyZWFtcy8jbWVkaWFzdHJlYW18TWVkaWFTdHJlYW0gQVBJIG9mIE1lZGlhIENhcHR1cmUgYW5kIFN0cmVhbXN9LlxuICAgICAqL1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbWVkaWFTdHJlYW0nLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICB2YWx1ZTogc3RyZWFtLFxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge093dC5CYXNlLlN0cmVhbVNvdXJjZUluZm99IHNvdXJjZVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5TdHJlYW1cbiAgICAgKiBAZGVzYyBTb3VyY2UgaW5mbyBvZiBhIHN0cmVhbS5cbiAgICAgKi9cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3NvdXJjZScsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogc291cmNlSW5mbyxcbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtvYmplY3R9IGF0dHJpYnV0ZXNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuU3RyZWFtXG4gICAgICogQGRlc2MgQ3VzdG9tIGF0dHJpYnV0ZXMgb2YgYSBzdHJlYW0uXG4gICAgICovXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdhdHRyaWJ1dGVzJywge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IGF0dHJpYnV0ZXMsXG4gICAgfSk7XG4gIH1cbn1cbi8qKlxuICogQGNsYXNzIExvY2FsU3RyZWFtXG4gKiBAY2xhc3NEZXNjIFN0cmVhbSBjYXB0dXJlZCBmcm9tIGN1cnJlbnQgZW5kcG9pbnQuXG4gKiBAbWVtYmVyT2YgT3d0LkJhc2VcbiAqIEBleHRlbmRzIE93dC5CYXNlLlN0cmVhbVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge01lZGlhU3RyZWFtfSBzdHJlYW0gVW5kZXJseWluZyBNZWRpYVN0cmVhbS5cbiAqIEBwYXJhbSB7T3d0LkJhc2UuU3RyZWFtU291cmNlSW5mb30gc291cmNlSW5mbyBJbmZvcm1hdGlvbiBhYm91dCBzdHJlYW0ncyBzb3VyY2UuXG4gKiBAcGFyYW0ge29iamVjdH0gYXR0cmlidXRlcyBDdXN0b20gYXR0cmlidXRlcyBvZiB0aGUgc3RyZWFtLlxuICovXG5leHBvcnQgY2xhc3MgTG9jYWxTdHJlYW0gZXh0ZW5kcyBTdHJlYW0ge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3RvcihzdHJlYW0sIHNvdXJjZUluZm8sIGF0dHJpYnV0ZXMpIHtcbiAgICBpZiAoIShzdHJlYW0gaW5zdGFuY2VvZiBNZWRpYVN0cmVhbSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgc3RyZWFtLicpO1xuICAgIH1cbiAgICBzdXBlcihzdHJlYW0sIHNvdXJjZUluZm8sIGF0dHJpYnV0ZXMpO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gaWRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuTG9jYWxTdHJlYW1cbiAgICAgKi9cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2lkJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBVdGlscy5jcmVhdGVVdWlkKCksXG4gICAgfSk7XG4gIH1cbn1cbi8qKlxuICogQGNsYXNzIFJlbW90ZVN0cmVhbVxuICogQGNsYXNzRGVzYyBTdHJlYW0gc2VudCBmcm9tIGEgcmVtb3RlIGVuZHBvaW50LlxuICogRXZlbnRzOlxuICpcbiAqIHwgRXZlbnQgTmFtZSAgICAgIHwgQXJndW1lbnQgVHlwZSAgICB8IEZpcmVkIHdoZW4gICAgICAgICB8XG4gKiB8IC0tLS0tLS0tLS0tLS0tLS18IC0tLS0tLS0tLS0tLS0tLS0gfCAtLS0tLS0tLS0tLS0tLS0tLS0gfFxuICogfCBlbmRlZCAgICAgICAgICAgfCBFdmVudCAgICAgICAgICAgIHwgU3RyZWFtIGlzIGVuZGVkLiAgIHxcbiAqIHwgdXBkYXRlZCAgICAgICAgIHwgRXZlbnQgICAgICAgICAgICB8IFN0cmVhbSBpcyB1cGRhdGVkLiB8XG4gKlxuICogQG1lbWJlck9mIE93dC5CYXNlXG4gKiBAZXh0ZW5kcyBPd3QuQmFzZS5TdHJlYW1cbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFJlbW90ZVN0cmVhbSBleHRlbmRzIFN0cmVhbSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKGlkLCBvcmlnaW4sIHN0cmVhbSwgc291cmNlSW5mbywgYXR0cmlidXRlcykge1xuICAgIHN1cGVyKHN0cmVhbSwgc291cmNlSW5mbywgYXR0cmlidXRlcyk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBpZFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQmFzZS5SZW1vdGVTdHJlYW1cbiAgICAgKi9cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2lkJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBpZCA/IGlkIDogVXRpbHMuY3JlYXRlVXVpZCgpLFxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gb3JpZ2luXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlJlbW90ZVN0cmVhbVxuICAgICAqIEBkZXNjIElEIG9mIHRoZSByZW1vdGUgZW5kcG9pbnQgd2hvIHB1Ymxpc2hlZCB0aGlzIHN0cmVhbS5cbiAgICAgKi9cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ29yaWdpbicsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogb3JpZ2luLFxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge093dC5CYXNlLlB1YmxpY2F0aW9uU2V0dGluZ3N9IHNldHRpbmdzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlJlbW90ZVN0cmVhbVxuICAgICAqIEBkZXNjIE9yaWdpbmFsIHNldHRpbmdzIGZvciBwdWJsaXNoaW5nIHRoaXMgc3RyZWFtLiBUaGlzIHByb3BlcnR5IGlzIG9ubHkgdmFsaWQgaW4gY29uZmVyZW5jZSBtb2RlLlxuICAgICAqL1xuICAgIHRoaXMuc2V0dGluZ3MgPSB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7T3d0LkNvbmZlcmVuY2UuU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzfSBjYXBhYmlsaXRpZXNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkJhc2UuUmVtb3RlU3RyZWFtXG4gICAgICogQGRlc2MgQ2FwYWJpbGl0aWVzIHJlbW90ZSBlbmRwb2ludCBwcm92aWRlcyBmb3Igc3Vic2NyaXB0aW9uLiBUaGlzIHByb3BlcnR5IGlzIG9ubHkgdmFsaWQgaW4gY29uZmVyZW5jZSBtb2RlLlxuICAgICAqL1xuICAgIHRoaXMuY2FwYWJpbGl0aWVzID0gdW5kZWZpbmVkO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFN0cmVhbUV2ZW50XG4gKiBAY2xhc3NEZXNjIEV2ZW50IGZvciBTdHJlYW0uXG4gKiBAZXh0ZW5kcyBPd3QuQmFzZS5Pd3RFdmVudFxuICogQG1lbWJlcm9mIE93dC5CYXNlXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBTdHJlYW1FdmVudCBleHRlbmRzIE93dEV2ZW50IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgY29uc3RydWN0b3IodHlwZSwgaW5pdCkge1xuICAgIHN1cGVyKHR5cGUpO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge093dC5CYXNlLlN0cmVhbX0gc3RyZWFtXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5CYXNlLlN0cmVhbUV2ZW50XG4gICAgICovXG4gICAgdGhpcy5zdHJlYW0gPSBpbml0LnN0cmVhbTtcbiAgfVxufVxuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4vKiBnbG9iYWwgbmF2aWdhdG9yLCB3aW5kb3cgKi9cblxuJ3VzZSBzdHJpY3QnO1xuY29uc3Qgc2RrVmVyc2lvbiA9ICc0LjIuMSc7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG5leHBvcnQgZnVuY3Rpb24gaXNGaXJlZm94KCkge1xuICByZXR1cm4gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goJ0ZpcmVmb3gnKSAhPT0gbnVsbDtcbn1cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG5leHBvcnQgZnVuY3Rpb24gaXNDaHJvbWUoKSB7XG4gIHJldHVybiB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgnQ2hyb21lJykgIT09IG51bGw7XG59XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2FmYXJpKCkge1xuICByZXR1cm4gL14oKD8hY2hyb21lfGFuZHJvaWQpLikqc2FmYXJpL2kudGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XG59XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuZXhwb3J0IGZ1bmN0aW9uIGlzRWRnZSgpIHtcbiAgcmV0dXJuIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9FZGdlXFwvKFxcZCspLihcXGQrKSQvKSAhPT0gbnVsbDtcbn1cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVXVpZCgpIHtcbiAgcmV0dXJuICd4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XG4gICAgY29uc3QgciA9IE1hdGgucmFuZG9tKCkgKiAxNiB8IDA7XG4gICAgY29uc3QgdiA9IGMgPT09ICd4JyA/IHIgOiAociAmIDB4MyB8IDB4OCk7XG4gICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICB9KTtcbn1cblxuLy8gUmV0dXJucyBzeXN0ZW0gaW5mb3JtYXRpb24uXG4vLyBGb3JtYXQ6IHtzZGs6e3ZlcnNpb246KiosIHR5cGU6Kip9LCBydW50aW1lOnt2ZXJzaW9uOioqLCBuYW1lOioqfSwgb3M6e3ZlcnNpb246KiosIG5hbWU6Kip9fTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG5leHBvcnQgZnVuY3Rpb24gc3lzSW5mbygpIHtcbiAgY29uc3QgaW5mbyA9IE9iamVjdC5jcmVhdGUoe30pO1xuICBpbmZvLnNkayA9IHtcbiAgICB2ZXJzaW9uOiBzZGtWZXJzaW9uLFxuICAgIHR5cGU6ICdKYXZhU2NyaXB0JyxcbiAgfTtcbiAgLy8gUnVudGltZSBpbmZvLlxuICBjb25zdCB1c2VyQWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuICBjb25zdCBmaXJlZm94UmVnZXggPSAvRmlyZWZveFxcLyhbMC05XFwuXSspLztcbiAgY29uc3QgY2hyb21lUmVnZXggPSAvQ2hyb21lXFwvKFswLTlcXC5dKykvO1xuICBjb25zdCBlZGdlUmVnZXggPSAvRWRnZVxcLyhbMC05XFwuXSspLztcbiAgY29uc3Qgc2FmYXJpVmVyc2lvblJlZ2V4ID0gL1ZlcnNpb25cXC8oWzAtOVxcLl0rKSBTYWZhcmkvO1xuICBsZXQgcmVzdWx0ID0gY2hyb21lUmVnZXguZXhlYyh1c2VyQWdlbnQpO1xuICBpZiAocmVzdWx0KSB7XG4gICAgaW5mby5ydW50aW1lID0ge1xuICAgICAgbmFtZTogJ0Nocm9tZScsXG4gICAgICB2ZXJzaW9uOiByZXN1bHRbMV0sXG4gICAgfTtcbiAgfSBlbHNlIGlmIChyZXN1bHQgPSBmaXJlZm94UmVnZXguZXhlYyh1c2VyQWdlbnQpKSB7XG4gICAgaW5mby5ydW50aW1lID0ge1xuICAgICAgbmFtZTogJ0ZpcmVmb3gnLFxuICAgICAgdmVyc2lvbjogcmVzdWx0WzFdLFxuICAgIH07XG4gIH0gZWxzZSBpZiAocmVzdWx0ID0gZWRnZVJlZ2V4LmV4ZWModXNlckFnZW50KSkge1xuICAgIGluZm8ucnVudGltZSA9IHtcbiAgICAgIG5hbWU6ICdFZGdlJyxcbiAgICAgIHZlcnNpb246IHJlc3VsdFsxXSxcbiAgICB9O1xuICB9IGVsc2UgaWYgKGlzU2FmYXJpKCkpIHtcbiAgICByZXN1bHQgPSBzYWZhcmlWZXJzaW9uUmVnZXguZXhlYyh1c2VyQWdlbnQpO1xuICAgIGluZm8ucnVudGltZSA9IHtcbiAgICAgIG5hbWU6ICdTYWZhcmknLFxuICAgIH07XG4gICAgaW5mby5ydW50aW1lLnZlcnNpb24gPSByZXN1bHQgPyByZXN1bHRbMV0gOiAnVW5rbm93bic7XG4gIH0gZWxzZSB7XG4gICAgaW5mby5ydW50aW1lID0ge1xuICAgICAgbmFtZTogJ1Vua25vd24nLFxuICAgICAgdmVyc2lvbjogJ1Vua25vd24nLFxuICAgIH07XG4gIH1cbiAgLy8gT1MgaW5mby5cbiAgY29uc3Qgd2luZG93c1JlZ2V4ID0gL1dpbmRvd3MgTlQgKFswLTlcXC5dKykvO1xuICBjb25zdCBtYWNSZWdleCA9IC9JbnRlbCBNYWMgT1MgWCAoWzAtOV9cXC5dKykvO1xuICBjb25zdCBpUGhvbmVSZWdleCA9IC9pUGhvbmUgT1MgKFswLTlfXFwuXSspLztcbiAgY29uc3QgbGludXhSZWdleCA9IC9YMTE7IExpbnV4LztcbiAgY29uc3QgYW5kcm9pZFJlZ2V4ID0gL0FuZHJvaWQoIChbMC05XFwuXSspKT8vO1xuICBjb25zdCBjaHJvbWl1bU9zUmVnZXggPSAvQ3JPUy87XG4gIGlmIChyZXN1bHQgPSB3aW5kb3dzUmVnZXguZXhlYyh1c2VyQWdlbnQpKSB7XG4gICAgaW5mby5vcyA9IHtcbiAgICAgIG5hbWU6ICdXaW5kb3dzIE5UJyxcbiAgICAgIHZlcnNpb246IHJlc3VsdFsxXSxcbiAgICB9O1xuICB9IGVsc2UgaWYgKHJlc3VsdCA9IG1hY1JlZ2V4LmV4ZWModXNlckFnZW50KSkge1xuICAgIGluZm8ub3MgPSB7XG4gICAgICBuYW1lOiAnTWFjIE9TIFgnLFxuICAgICAgdmVyc2lvbjogcmVzdWx0WzFdLnJlcGxhY2UoL18vZywgJy4nKSxcbiAgICB9O1xuICB9IGVsc2UgaWYgKHJlc3VsdCA9IGlQaG9uZVJlZ2V4LmV4ZWModXNlckFnZW50KSkge1xuICAgIGluZm8ub3MgPSB7XG4gICAgICBuYW1lOiAnaVBob25lIE9TJyxcbiAgICAgIHZlcnNpb246IHJlc3VsdFsxXS5yZXBsYWNlKC9fL2csICcuJyksXG4gICAgfTtcbiAgfSBlbHNlIGlmIChyZXN1bHQgPSBsaW51eFJlZ2V4LmV4ZWModXNlckFnZW50KSkge1xuICAgIGluZm8ub3MgPSB7XG4gICAgICBuYW1lOiAnTGludXgnLFxuICAgICAgdmVyc2lvbjogJ1Vua25vd24nLFxuICAgIH07XG4gIH0gZWxzZSBpZiAocmVzdWx0ID0gYW5kcm9pZFJlZ2V4LmV4ZWModXNlckFnZW50KSkge1xuICAgIGluZm8ub3MgPSB7XG4gICAgICBuYW1lOiAnQW5kcm9pZCcsXG4gICAgICB2ZXJzaW9uOiByZXN1bHRbMV0gfHwgJ1Vua25vd24nLFxuICAgIH07XG4gIH0gZWxzZSBpZiAocmVzdWx0ID0gY2hyb21pdW1Pc1JlZ2V4LmV4ZWModXNlckFnZW50KSkge1xuICAgIGluZm8ub3MgPSB7XG4gICAgICBuYW1lOiAnQ2hyb21lIE9TJyxcbiAgICAgIHZlcnNpb246ICdVbmtub3duJyxcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIGluZm8ub3MgPSB7XG4gICAgICBuYW1lOiAnVW5rbm93bicsXG4gICAgICB2ZXJzaW9uOiAnVW5rbm93bicsXG4gICAgfTtcbiAgfVxuICBpbmZvLmNhcGFiaWxpdGllcyA9IHtcbiAgICBjb250aW51YWxJY2VHYXRoZXJpbmc6IGZhbHNlLFxuICAgIHVuaWZpZWRQbGFuOiB0cnVlLFxuICAgIHN0cmVhbVJlbW92YWJsZTogaW5mby5ydW50aW1lLm5hbWUgIT09ICdGaXJlZm94JyxcbiAgfTtcbiAgcmV0dXJuIGluZm87XG59XG4iLCIvLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbi8qIGVzbGludC1kaXNhYmxlIHJlcXVpcmUtanNkb2MgKi9cbi8qIGdsb2JhbCBQcm9taXNlICovXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IExvZ2dlciBmcm9tICcuLi9iYXNlL2xvZ2dlci5qcyc7XG5pbXBvcnQge1xuICBFdmVudERpc3BhdGNoZXIsXG4gIE1lc3NhZ2VFdmVudCxcbiAgT3d0RXZlbnQsXG4gIEVycm9yRXZlbnQsXG4gIE11dGVFdmVudFxufSBmcm9tICcuLi9iYXNlL2V2ZW50LmpzJztcbmltcG9ydCB7IFRyYWNrS2luZCB9IGZyb20gJy4uL2Jhc2UvbWVkaWFmb3JtYXQuanMnXG5pbXBvcnQgeyBQdWJsaWNhdGlvbiB9IGZyb20gJy4uL2Jhc2UvcHVibGljYXRpb24uanMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9zdWJzY3JpcHRpb24uanMnXG5pbXBvcnQgeyBDb25mZXJlbmNlRXJyb3IgfSBmcm9tICcuL2Vycm9yLmpzJ1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi4vYmFzZS91dGlscy5qcyc7XG5pbXBvcnQgKiBhcyBTZHBVdGlscyBmcm9tICcuLi9iYXNlL3NkcHV0aWxzLmpzJztcblxuLyoqXG4gKiBAY2xhc3MgQ29uZmVyZW5jZVBlZXJDb25uZWN0aW9uQ2hhbm5lbFxuICogQGNsYXNzRGVzYyBBIGNoYW5uZWwgZm9yIGEgY29ubmVjdGlvbiBiZXR3ZWVuIGNsaWVudCBhbmQgY29uZmVyZW5jZSBzZXJ2ZXIuIEN1cnJlbnRseSwgb25seSBvbmUgc3RyZWFtIGNvdWxkIGJlIHRyYW5taXR0ZWQgaW4gYSBjaGFubmVsLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGNsYXNzIENvbmZlcmVuY2VQZWVyQ29ubmVjdGlvbkNoYW5uZWwgZXh0ZW5kcyBFdmVudERpc3BhdGNoZXIge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3Rvcihjb25maWcsIHNpZ25hbGluZykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuX29wdGlvbnMgPSBudWxsO1xuICAgIHRoaXMuX3NpZ25hbGluZyA9IHNpZ25hbGluZztcbiAgICB0aGlzLl9wYyA9IG51bGw7XG4gICAgdGhpcy5faW50ZXJuYWxJZCA9IG51bGw7IC8vIEl0J3MgcHVibGljYXRpb24gSUQgb3Igc3Vic2NyaXB0aW9uIElELlxuICAgIHRoaXMuX3BlbmRpbmdDYW5kaWRhdGVzID0gW107XG4gICAgdGhpcy5fc3Vic2NyaWJlUHJvbWlzZSA9IG51bGw7XG4gICAgdGhpcy5fcHVibGlzaFByb21pc2UgPSBudWxsO1xuICAgIHRoaXMuX3N1YnNjcmliZWRTdHJlYW0gPSBudWxsO1xuICAgIHRoaXMuX3B1Ymxpc2hlZFN0cmVhbSA9IG51bGw7XG4gICAgdGhpcy5fcHVibGljYXRpb24gPSBudWxsO1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgLy8gVGltZXIgZm9yIFBlZXJDb25uZWN0aW9uIGRpc2Nvbm5lY3RlZC4gV2lsbCBzdG9wIGNvbm5lY3Rpb24gYWZ0ZXIgdGltZXIuXG4gICAgdGhpcy5fZGlzY29ubmVjdFRpbWVyID0gbnVsbDtcbiAgICB0aGlzLl9lbmRlZCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBvbk1lc3NhZ2VcbiAgICogQGRlc2MgUmVjZWl2ZWQgYSBtZXNzYWdlIGZyb20gY29uZmVyZW5jZSBwb3J0YWwuIERlZmluZWQgaW4gY2xpZW50LXNlcnZlciBwcm90b2NvbC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG5vdGlmaWNhdGlvbiBOb3RpZmljYXRpb24gdHlwZS5cbiAgICogQHBhcmFtIHtvYmplY3R9IG1lc3NhZ2UgTWVzc2FnZSByZWNlaXZlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uTWVzc2FnZShub3RpZmljYXRpb24sIG1lc3NhZ2UpIHtcbiAgICBzd2l0Y2ggKG5vdGlmaWNhdGlvbikge1xuICAgICAgY2FzZSAncHJvZ3Jlc3MnOlxuICAgICAgICBpZiAobWVzc2FnZS5zdGF0dXMgPT09ICdzb2FjJykge1xuICAgICAgICAgIHRoaXMuX3NkcEhhbmRsZXIobWVzc2FnZS5kYXRhKTtcbiAgICAgICAgfSBlbHNlIGlmIChtZXNzYWdlLnN0YXR1cyA9PT0gJ3JlYWR5Jykge1xuICAgICAgICAgIHRoaXMuX3JlYWR5SGFuZGxlcigpO1xuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2Uuc3RhdHVzID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgdGhpcy5fZXJyb3JIYW5kbGVyKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdHJlYW0nOlxuICAgICAgICB0aGlzLl9vblN0cmVhbUV2ZW50KG1lc3NhZ2UpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIExvZ2dlci53YXJuaW5nKCdVbmtub3duIG5vdGlmaWNhdGlvbiBmcm9tIE1DVS4nKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaXNoKHN0cmVhbSwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9wdGlvbnMgPSB7YXVkaW86ICEhc3RyZWFtLm1lZGlhU3RyZWFtLmdldEF1ZGlvVHJhY2tzKCksIHZpZGVvOiAhIXN0cmVhbVxuICAgICAgICAgIC5tZWRpYVN0cmVhbS5nZXRWaWRlb1RyYWNrcygpfTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ09wdGlvbnMgc2hvdWxkIGJlIGFuIG9iamVjdC4nKSk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmF1ZGlvID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9wdGlvbnMuYXVkaW8gPSAhIXN0cmVhbS5tZWRpYVN0cmVhbS5nZXRBdWRpb1RyYWNrcygpO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy52aWRlbyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvcHRpb25zLnZpZGVvID0gISFzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0VmlkZW9UcmFja3MoKTtcbiAgICB9XG4gICAgaWYgKCEhb3B0aW9ucy5hdWRpbyA9PT0gIXN0cmVhbS5tZWRpYVN0cmVhbS5nZXRBdWRpb1RyYWNrcygpLmxlbmd0aCB8fCAhIVxuICAgIG9wdGlvbnMudmlkZW8gPT09ICFzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0VmlkZW9UcmFja3MoKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQ29uZmVyZW5jZUVycm9yKFxuICAgICAgICAgICdvcHRpb25zLmF1ZGlvL3ZpZGVvIGlzIGluY29uc2lzdGVudCB3aXRoIHRyYWNrcyBwcmVzZW50ZWQgaW4gdGhlICcgK1xuICAgICAgICAgICdNZWRpYVN0cmVhbS4nXG4gICAgICApKTtcbiAgICB9XG4gICAgaWYgKChvcHRpb25zLmF1ZGlvID09PSBmYWxzZSB8fCBvcHRpb25zLmF1ZGlvID09PSBudWxsKSAmJlxuICAgICAgKG9wdGlvbnMudmlkZW8gPT09IGZhbHNlIHx8IG9wdGlvbnMudmlkZW8gPT09IG51bGwpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IENvbmZlcmVuY2VFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IHB1Ymxpc2ggYSBzdHJlYW0gd2l0aG91dCBhdWRpbyBhbmQgdmlkZW8uJykpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuYXVkaW8gPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkob3B0aW9ucy5hdWRpbykpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgICAnb3B0aW9ucy5hdWRpbyBzaG91bGQgYmUgYSBib29sZWFuIG9yIGFuIGFycmF5LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgcGFyYW1ldGVycyBvZiBvcHRpb25zLmF1ZGlvKSB7XG4gICAgICAgIGlmICghcGFyYW1ldGVycy5jb2RlYyB8fCB0eXBlb2YgcGFyYW1ldGVycy5jb2RlYy5uYW1lICE9PSAnc3RyaW5nJyB8fCAoXG4gICAgICAgICAgcGFyYW1ldGVycy5tYXhCaXRyYXRlICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHBhcmFtZXRlcnMubWF4Qml0cmF0ZVxuICAgICAgICAgICE9PSAnbnVtYmVyJykpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAgICAgJ29wdGlvbnMuYXVkaW8gaGFzIGluY29ycmVjdCBwYXJhbWV0ZXJzLicpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMudmlkZW8gPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkob3B0aW9ucy52aWRlbykpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgICAnb3B0aW9ucy52aWRlbyBzaG91bGQgYmUgYSBib29sZWFuIG9yIGFuIGFycmF5LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgcGFyYW1ldGVycyBvZiBvcHRpb25zLnZpZGVvKSB7XG4gICAgICAgIGlmICghcGFyYW1ldGVycy5jb2RlYyB8fCB0eXBlb2YgcGFyYW1ldGVycy5jb2RlYy5uYW1lICE9PSAnc3RyaW5nJyB8fCAoXG4gICAgICAgICAgcGFyYW1ldGVycy5tYXhCaXRyYXRlICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHBhcmFtZXRlcnMubWF4Qml0cmF0ZVxuICAgICAgICAgICE9PSAnbnVtYmVyJykgfHwgKHBhcmFtZXRlcnMuY29kZWMucHJvZmlsZSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgJiYgdHlwZW9mIHBhcmFtZXRlcnMuY29kZWMucHJvZmlsZSAhPT0gJ3N0cmluZycpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgICAgICdvcHRpb25zLnZpZGVvIGhhcyBpbmNvcnJlY3QgcGFyYW1ldGVycy4nKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgY29uc3QgbWVkaWFPcHRpb25zID0ge307XG4gICAgdGhpcy5fY3JlYXRlUGVlckNvbm5lY3Rpb24oKTtcbiAgICBpZiAoc3RyZWFtLm1lZGlhU3RyZWFtLmdldEF1ZGlvVHJhY2tzKCkubGVuZ3RoID4gMCAmJiBvcHRpb25zLmF1ZGlvICE9PVxuICAgICAgZmFsc2UgJiYgb3B0aW9ucy5hdWRpbyAhPT0gbnVsbCkge1xuICAgICAgaWYgKHN0cmVhbS5tZWRpYVN0cmVhbS5nZXRBdWRpb1RyYWNrcygpLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgTG9nZ2VyLndhcm5pbmcoXG4gICAgICAgICAgICAnUHVibGlzaGluZyBhIHN0cmVhbSB3aXRoIG11bHRpcGxlIGF1ZGlvIHRyYWNrcyBpcyBub3QgZnVsbHknXG4gICAgICAgICAgICArICcgc3VwcG9ydGVkLidcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5hdWRpbyAhPT0gJ2Jvb2xlYW4nICYmIHR5cGVvZiBvcHRpb25zLmF1ZGlvICE9PVxuICAgICAgICAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IENvbmZlcmVuY2VFcnJvcihcbiAgICAgICAgICAgICdUeXBlIG9mIGF1ZGlvIG9wdGlvbnMgc2hvdWxkIGJlIGJvb2xlYW4gb3IgYW4gb2JqZWN0LidcbiAgICAgICAgKSk7XG4gICAgICB9XG4gICAgICBtZWRpYU9wdGlvbnMuYXVkaW8gPSB7fTtcbiAgICAgIG1lZGlhT3B0aW9ucy5hdWRpby5zb3VyY2UgPSBzdHJlYW0uc291cmNlLmF1ZGlvO1xuICAgICAgZm9yIChjb25zdCB0cmFjayBvZiBzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0QXVkaW9UcmFja3MoKSkge1xuICAgICAgICB0aGlzLl9wYy5hZGRUcmFjayh0cmFjaywgc3RyZWFtLm1lZGlhU3RyZWFtKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbWVkaWFPcHRpb25zLmF1ZGlvID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0VmlkZW9UcmFja3MoKS5sZW5ndGggPiAwICYmIG9wdGlvbnMudmlkZW8gIT09XG4gICAgICBmYWxzZSAmJiBvcHRpb25zLnZpZGVvICE9PSBudWxsKSB7XG4gICAgICBpZiAoc3RyZWFtLm1lZGlhU3RyZWFtLmdldFZpZGVvVHJhY2tzKCkubGVuZ3RoID4gMSkge1xuICAgICAgICBMb2dnZXIud2FybmluZyhcbiAgICAgICAgICAgICdQdWJsaXNoaW5nIGEgc3RyZWFtIHdpdGggbXVsdGlwbGUgdmlkZW8gdHJhY2tzIGlzIG5vdCBmdWxseSAnXG4gICAgICAgICAgICArICdzdXBwb3J0ZWQuJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgICAgbWVkaWFPcHRpb25zLnZpZGVvID0ge307XG4gICAgICBtZWRpYU9wdGlvbnMudmlkZW8uc291cmNlID0gc3RyZWFtLnNvdXJjZS52aWRlbztcbiAgICAgIGNvbnN0IHRyYWNrU2V0dGluZ3MgPSBzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0VmlkZW9UcmFja3MoKVswXVxuICAgICAgICAgIC5nZXRTZXR0aW5ncygpO1xuICAgICAgbWVkaWFPcHRpb25zLnZpZGVvLnBhcmFtZXRlcnMgPSB7XG4gICAgICAgIHJlc29sdXRpb246IHtcbiAgICAgICAgICB3aWR0aDogdHJhY2tTZXR0aW5ncy53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IHRyYWNrU2V0dGluZ3MuaGVpZ2h0LFxuICAgICAgICB9LFxuICAgICAgICBmcmFtZXJhdGU6IHRyYWNrU2V0dGluZ3MuZnJhbWVSYXRlLFxuICAgICAgfTtcbiAgICAgIGZvciAoY29uc3QgdHJhY2sgb2Ygc3RyZWFtLm1lZGlhU3RyZWFtLmdldFZpZGVvVHJhY2tzKCkpIHtcbiAgICAgICAgdGhpcy5fcGMuYWRkVHJhY2sodHJhY2ssIHN0cmVhbS5tZWRpYVN0cmVhbSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lZGlhT3B0aW9ucy52aWRlbyA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLl9wdWJsaXNoZWRTdHJlYW0gPSBzdHJlYW07XG4gICAgdGhpcy5fc2lnbmFsaW5nLnNlbmRTaWduYWxpbmdNZXNzYWdlKCdwdWJsaXNoJywge1xuICAgICAgbWVkaWE6IG1lZGlhT3B0aW9ucyxcbiAgICAgIGF0dHJpYnV0ZXM6IHN0cmVhbS5hdHRyaWJ1dGVzLFxuICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2VFdmVudCA9IG5ldyBNZXNzYWdlRXZlbnQoJ2lkJywge1xuICAgICAgICBtZXNzYWdlOiBkYXRhLmlkLFxuICAgICAgICBvcmlnaW46IHRoaXMuX3JlbW90ZUlkLFxuICAgICAgfSk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobWVzc2FnZUV2ZW50KTtcbiAgICAgIHRoaXMuX2ludGVybmFsSWQgPSBkYXRhLmlkO1xuICAgICAgY29uc3Qgb2ZmZXJPcHRpb25zID0ge1xuICAgICAgICBvZmZlclRvUmVjZWl2ZUF1ZGlvOiBmYWxzZSxcbiAgICAgICAgb2ZmZXJUb1JlY2VpdmVWaWRlbzogZmFsc2UsXG4gICAgICB9O1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLl9wYy5hZGRUcmFuc2NlaXZlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyB8ZGlyZWN0aW9ufCBzZWVtcyBub3Qgd29ya2luZyBvbiBTYWZhcmkuXG4gICAgICAgIGlmIChtZWRpYU9wdGlvbnMuYXVkaW8gJiYgc3RyZWFtLm1lZGlhU3RyZWFtLmdldEF1ZGlvVHJhY2tzKCkgPiAwKSB7XG4gICAgICAgICAgdGhpcy5fcGMuYWRkVHJhbnNjZWl2ZXIoJ2F1ZGlvJywge2RpcmVjdGlvbjogJ3NlbmRvbmx5J30pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtZWRpYU9wdGlvbnMudmlkZW8gJiYgc3RyZWFtLm1lZGlhU3RyZWFtLmdldFZpZGVvVHJhY2tzKCkgPiAwKSB7XG4gICAgICAgICAgdGhpcy5fcGMuYWRkVHJhbnNjZWl2ZXIoJ3ZpZGVvJywge2RpcmVjdGlvbjogJ3NlbmRvbmx5J30pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsZXQgbG9jYWxEZXNjO1xuICAgICAgdGhpcy5fcGMuY3JlYXRlT2ZmZXIob2ZmZXJPcHRpb25zKS50aGVuKChkZXNjKSA9PiB7XG4gICAgICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAgICAgZGVzYy5zZHAgPSB0aGlzLl9zZXRSdHBSZWNlaXZlck9wdGlvbnMoZGVzYy5zZHAsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZXNjO1xuICAgICAgfSkudGhlbigoZGVzYykgPT4ge1xuICAgICAgICBsb2NhbERlc2MgPSBkZXNjO1xuICAgICAgICByZXR1cm4gdGhpcy5fcGMuc2V0TG9jYWxEZXNjcmlwdGlvbihkZXNjKTtcbiAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLl9zaWduYWxpbmcuc2VuZFNpZ25hbGluZ01lc3NhZ2UoJ3NvYWMnLCB7XG4gICAgICAgICAgaWQ6IHRoaXNcbiAgICAgICAgICAgICAgLl9pbnRlcm5hbElkLFxuICAgICAgICAgIHNpZ25hbGluZzogbG9jYWxEZXNjLFxuICAgICAgICB9KTtcbiAgICAgIH0pLmNhdGNoKChlKSA9PiB7XG4gICAgICAgIExvZ2dlci5lcnJvcignRmFpbGVkIHRvIGNyZWF0ZSBvZmZlciBvciBzZXQgU0RQLiBNZXNzYWdlOiAnXG4gICAgICAgICAgICArIGUubWVzc2FnZSk7XG4gICAgICAgIHRoaXMuX3VucHVibGlzaCgpO1xuICAgICAgICB0aGlzLl9yZWplY3RQcm9taXNlKGUpO1xuICAgICAgICB0aGlzLl9maXJlRW5kZWRFdmVudE9uUHVibGljYXRpb25PclN1YnNjcmlwdGlvbigpO1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goKGUpID0+IHtcbiAgICAgIHRoaXMuX3VucHVibGlzaCgpO1xuICAgICAgdGhpcy5fcmVqZWN0UHJvbWlzZShlKTtcbiAgICAgIHRoaXMuX2ZpcmVFbmRlZEV2ZW50T25QdWJsaWNhdGlvbk9yU3Vic2NyaXB0aW9uKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuX3B1Ymxpc2hQcm9taXNlID0ge3Jlc29sdmU6IHJlc29sdmUsIHJlamVjdDogcmVqZWN0fTtcbiAgICB9KTtcbiAgfVxuXG4gIHN1YnNjcmliZShzdHJlYW0sIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvcHRpb25zID0ge1xuICAgICAgICBhdWRpbzogISFzdHJlYW0uY2FwYWJpbGl0aWVzLmF1ZGlvLFxuICAgICAgICB2aWRlbzogISFzdHJlYW0uY2FwYWJpbGl0aWVzLnZpZGVvLFxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ09wdGlvbnMgc2hvdWxkIGJlIGFuIG9iamVjdC4nKSk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmF1ZGlvID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9wdGlvbnMuYXVkaW8gPSAhIXN0cmVhbS5jYXBhYmlsaXRpZXMuYXVkaW87XG4gICAgfVxuICAgIGlmIChvcHRpb25zLnZpZGVvID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9wdGlvbnMudmlkZW8gPSAhIXN0cmVhbS5jYXBhYmlsaXRpZXMudmlkZW87XG4gICAgfVxuICAgIGlmICgob3B0aW9ucy5hdWRpbyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvcHRpb25zLmF1ZGlvICE9PSAnb2JqZWN0JyAmJlxuICAgICAgICB0eXBlb2Ygb3B0aW9ucy5hdWRpbyAhPT0gJ2Jvb2xlYW4nICYmIG9wdGlvbnMuYXVkaW8gIT09IG51bGwpIHx8IChcbiAgICAgIG9wdGlvbnMudmlkZW8gIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb3B0aW9ucy52aWRlbyAhPT0gJ29iamVjdCcgJiZcbiAgICAgICAgdHlwZW9mIG9wdGlvbnMudmlkZW8gIT09ICdib29sZWFuJyAmJiBvcHRpb25zLnZpZGVvICE9PSBudWxsKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgb3B0aW9ucyB0eXBlLicpKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuYXVkaW8gJiYgIXN0cmVhbS5jYXBhYmlsaXRpZXMuYXVkaW8gfHwgKG9wdGlvbnMudmlkZW8gJiZcbiAgICAgICAgIXN0cmVhbS5jYXBhYmlsaXRpZXMudmlkZW8pKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IENvbmZlcmVuY2VFcnJvcihcbiAgICAgICAgICAnb3B0aW9ucy5hdWRpby92aWRlbyBjYW5ub3QgYmUgdHJ1ZSBvciBhbiBvYmplY3QgaWYgdGhlcmUgaXMgbm8gJ1xuICAgICAgICAgICsgJ2F1ZGlvL3ZpZGVvIHRyYWNrIGluIHJlbW90ZSBzdHJlYW0uJ1xuICAgICAgKSk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmF1ZGlvID09PSBmYWxzZSAmJiBvcHRpb25zLnZpZGVvID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBzdWJzY3JpYmUgYSBzdHJlYW0gd2l0aG91dCBhdWRpbyBhbmQgdmlkZW8uJykpO1xuICAgIH1cbiAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgICBjb25zdCBtZWRpYU9wdGlvbnMgPSB7fTtcbiAgICBpZiAob3B0aW9ucy5hdWRpbykge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmF1ZGlvID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgIEFycmF5LmlzQXJyYXkob3B0aW9ucy5hdWRpby5jb2RlY3MpKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmF1ZGlvLmNvZGVjcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAgICAgJ0F1ZGlvIGNvZGVjIGNhbm5vdCBiZSBhbiBlbXB0eSBhcnJheS4nKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG1lZGlhT3B0aW9ucy5hdWRpbyA9IHt9O1xuICAgICAgbWVkaWFPcHRpb25zLmF1ZGlvLmZyb20gPSBzdHJlYW0uaWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lZGlhT3B0aW9ucy5hdWRpbyA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy52aWRlbykge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnZpZGVvID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgIEFycmF5LmlzQXJyYXkob3B0aW9ucy52aWRlby5jb2RlY3MpKSB7XG4gICAgICAgIGlmIChvcHRpb25zLnZpZGVvLmNvZGVjcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAgICAgJ1ZpZGVvIGNvZGVjIGNhbm5vdCBiZSBhbiBlbXB0eSBhcnJheS4nKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG1lZGlhT3B0aW9ucy52aWRlbyA9IHt9O1xuICAgICAgbWVkaWFPcHRpb25zLnZpZGVvLmZyb20gPSBzdHJlYW0uaWQ7XG4gICAgICBpZiAob3B0aW9ucy52aWRlby5yZXNvbHV0aW9uIHx8IG9wdGlvbnMudmlkZW8uZnJhbWVSYXRlIHx8IChvcHRpb25zLnZpZGVvXG4gICAgICAgICAgLmJpdHJhdGVNdWx0aXBsaWVyICYmIG9wdGlvbnMudmlkZW8uYml0cmF0ZU11bHRpcGxpZXIgIT09IDEpIHx8XG4gICAgICAgIG9wdGlvbnMudmlkZW8ua2V5RnJhbWVJbnRlcnZhbCkge1xuICAgICAgICBtZWRpYU9wdGlvbnMudmlkZW8ucGFyYW1ldGVycyA9IHtcbiAgICAgICAgICByZXNvbHV0aW9uOiBvcHRpb25zLnZpZGVvLnJlc29sdXRpb24sXG4gICAgICAgICAgZnJhbWVyYXRlOiBvcHRpb25zLnZpZGVvLmZyYW1lUmF0ZSxcbiAgICAgICAgICBiaXRyYXRlOiBvcHRpb25zLnZpZGVvLmJpdHJhdGVNdWx0aXBsaWVyID8gJ3gnXG4gICAgICAgICAgICAgICsgb3B0aW9ucy52aWRlby5iaXRyYXRlTXVsdGlwbGllci50b1N0cmluZygpIDogdW5kZWZpbmVkLFxuICAgICAgICAgIGtleUZyYW1lSW50ZXJ2YWw6IG9wdGlvbnMudmlkZW8ua2V5RnJhbWVJbnRlcnZhbCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbWVkaWFPcHRpb25zLnZpZGVvID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuX3N1YnNjcmliZWRTdHJlYW0gPSBzdHJlYW07XG4gICAgdGhpcy5fc2lnbmFsaW5nLnNlbmRTaWduYWxpbmdNZXNzYWdlKCdzdWJzY3JpYmUnLCB7XG4gICAgICBtZWRpYTogbWVkaWFPcHRpb25zLFxuICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2VFdmVudCA9IG5ldyBNZXNzYWdlRXZlbnQoJ2lkJywge1xuICAgICAgICBtZXNzYWdlOiBkYXRhLmlkLFxuICAgICAgICBvcmlnaW46IHRoaXMuX3JlbW90ZUlkLFxuICAgICAgfSk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobWVzc2FnZUV2ZW50KTtcbiAgICAgIHRoaXMuX2ludGVybmFsSWQgPSBkYXRhLmlkO1xuICAgICAgdGhpcy5fY3JlYXRlUGVlckNvbm5lY3Rpb24oKTtcbiAgICAgIGNvbnN0IG9mZmVyT3B0aW9ucyA9IHtcbiAgICAgICAgb2ZmZXJUb1JlY2VpdmVBdWRpbzogISFvcHRpb25zLmF1ZGlvLFxuICAgICAgICBvZmZlclRvUmVjZWl2ZVZpZGVvOiAhIW9wdGlvbnMudmlkZW8sXG4gICAgICB9O1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLl9wYy5hZGRUcmFuc2NlaXZlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyB8ZGlyZWN0aW9ufCBzZWVtcyBub3Qgd29ya2luZyBvbiBTYWZhcmkuXG4gICAgICAgIGlmIChtZWRpYU9wdGlvbnMuYXVkaW8pIHtcbiAgICAgICAgICB0aGlzLl9wYy5hZGRUcmFuc2NlaXZlcignYXVkaW8nLCB7ZGlyZWN0aW9uOiAncmVjdm9ubHknfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lZGlhT3B0aW9ucy52aWRlbykge1xuICAgICAgICAgIHRoaXMuX3BjLmFkZFRyYW5zY2VpdmVyKCd2aWRlbycsIHtkaXJlY3Rpb246ICdyZWN2b25seSd9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5fcGMuY3JlYXRlT2ZmZXIob2ZmZXJPcHRpb25zKS50aGVuKChkZXNjKSA9PiB7XG4gICAgICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAgICAgZGVzYy5zZHAgPSB0aGlzLl9zZXRSdHBSZWNlaXZlck9wdGlvbnMoZGVzYy5zZHAsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3BjLnNldExvY2FsRGVzY3JpcHRpb24oZGVzYykudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fc2lnbmFsaW5nLnNlbmRTaWduYWxpbmdNZXNzYWdlKCdzb2FjJywge1xuICAgICAgICAgICAgaWQ6IHRoaXNcbiAgICAgICAgICAgICAgICAuX2ludGVybmFsSWQsXG4gICAgICAgICAgICBzaWduYWxpbmc6IGRlc2MsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yTWVzc2FnZSkge1xuICAgICAgICAgIExvZ2dlci5lcnJvcignU2V0IGxvY2FsIGRlc2NyaXB0aW9uIGZhaWxlZC4gTWVzc2FnZTogJyArXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeShlcnJvck1lc3NhZ2UpKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICBMb2dnZXIuZXJyb3IoJ0NyZWF0ZSBvZmZlciBmYWlsZWQuIEVycm9yIGluZm86ICcgKyBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgIGVycm9yKSk7XG4gICAgICB9KS5jYXRjaCgoZSk9PntcbiAgICAgICAgTG9nZ2VyLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIG9mZmVyIG9yIHNldCBTRFAuIE1lc3NhZ2U6ICdcbiAgICAgICAgICAgICsgZS5tZXNzYWdlKTtcbiAgICAgICAgdGhpcy5fdW5zdWJzY3JpYmUoKTtcbiAgICAgICAgdGhpcy5fcmVqZWN0UHJvbWlzZShlKTtcbiAgICAgICAgdGhpcy5fZmlyZUVuZGVkRXZlbnRPblB1YmxpY2F0aW9uT3JTdWJzY3JpcHRpb24oKTtcbiAgICAgIH0pO1xuICAgIH0pLmNhdGNoKChlKSA9PiB7XG4gICAgICB0aGlzLl91bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5fcmVqZWN0UHJvbWlzZShlKTtcbiAgICAgIHRoaXMuX2ZpcmVFbmRlZEV2ZW50T25QdWJsaWNhdGlvbk9yU3Vic2NyaXB0aW9uKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuX3N1YnNjcmliZVByb21pc2UgPSB7cmVzb2x2ZTogcmVzb2x2ZSwgcmVqZWN0OiByZWplY3R9O1xuICAgIH0pO1xuICB9XG5cbiAgX3VucHVibGlzaCgpIHtcbiAgICB0aGlzLl9zaWduYWxpbmcuc2VuZFNpZ25hbGluZ01lc3NhZ2UoJ3VucHVibGlzaCcsIHtpZDogdGhpcy5faW50ZXJuYWxJZH0pXG4gICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgIExvZ2dlci53YXJuaW5nKCdNQ1UgcmV0dXJucyBuZWdhdGl2ZSBhY2sgZm9yIHVucHVibGlzaGluZywgJyArIGUpO1xuICAgICAgICB9KTtcbiAgICBpZiAodGhpcy5fcGMgJiYgdGhpcy5fcGMuc2lnbmFsaW5nU3RhdGUgIT09ICdjbG9zZWQnKSB7XG4gICAgICB0aGlzLl9wYy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIF91bnN1YnNjcmliZSgpIHtcbiAgICB0aGlzLl9zaWduYWxpbmcuc2VuZFNpZ25hbGluZ01lc3NhZ2UoJ3Vuc3Vic2NyaWJlJywge1xuICAgICAgaWQ6IHRoaXMuX2ludGVybmFsSWQsXG4gICAgfSlcbiAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgTG9nZ2VyLndhcm5pbmcoJ01DVSByZXR1cm5zIG5lZ2F0aXZlIGFjayBmb3IgdW5zdWJzY3JpYmluZywgJyArIGUpO1xuICAgICAgICB9KTtcbiAgICBpZiAodGhpcy5fcGMgJiYgdGhpcy5fcGMuc2lnbmFsaW5nU3RhdGUgIT09ICdjbG9zZWQnKSB7XG4gICAgICB0aGlzLl9wYy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIF9tdXRlT3JVbm11dGUoaXNNdXRlLCBpc1B1YiwgdHJhY2tLaW5kKSB7XG4gICAgY29uc3QgZXZlbnROYW1lID0gaXNQdWIgPyAnc3RyZWFtLWNvbnRyb2wnIDpcbiAgICAgICdzdWJzY3JpcHRpb24tY29udHJvbCc7XG4gICAgY29uc3Qgb3BlcmF0aW9uID0gaXNNdXRlID8gJ3BhdXNlJyA6ICdwbGF5JztcbiAgICByZXR1cm4gdGhpcy5fc2lnbmFsaW5nLnNlbmRTaWduYWxpbmdNZXNzYWdlKGV2ZW50TmFtZSwge1xuICAgICAgaWQ6IHRoaXMuX2ludGVybmFsSWQsXG4gICAgICBvcGVyYXRpb246IG9wZXJhdGlvbixcbiAgICAgIGRhdGE6IHRyYWNrS2luZCxcbiAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgIGlmICghaXNQdWIpIHtcbiAgICAgICAgY29uc3QgbXV0ZUV2ZW50TmFtZSA9IGlzTXV0ZSA/ICdtdXRlJyA6ICd1bm11dGUnO1xuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb24uZGlzcGF0Y2hFdmVudChcbiAgICAgICAgICAgIG5ldyBNdXRlRXZlbnQobXV0ZUV2ZW50TmFtZSwge2tpbmQ6IHRyYWNrS2luZH0pKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIF9hcHBseU9wdGlvbnMob3B0aW9ucykge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ29iamVjdCcgfHwgdHlwZW9mIG9wdGlvbnMudmlkZW8gIT09ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IENvbmZlcmVuY2VFcnJvcihcbiAgICAgICAgICAnT3B0aW9ucyBzaG91bGQgYmUgYW4gb2JqZWN0LicpKTtcbiAgICB9XG4gICAgY29uc3QgdmlkZW9PcHRpb25zID0ge307XG4gICAgdmlkZW9PcHRpb25zLnJlc29sdXRpb24gPSBvcHRpb25zLnZpZGVvLnJlc29sdXRpb247XG4gICAgdmlkZW9PcHRpb25zLmZyYW1lcmF0ZSA9IG9wdGlvbnMudmlkZW8uZnJhbWVSYXRlO1xuICAgIHZpZGVvT3B0aW9ucy5iaXRyYXRlID0gb3B0aW9ucy52aWRlby5iaXRyYXRlTXVsdGlwbGllciA/ICd4JyArIG9wdGlvbnMudmlkZW9cbiAgICAgICAgLmJpdHJhdGVNdWx0aXBsaWVyXG4gICAgICAgIC50b1N0cmluZygpIDogdW5kZWZpbmVkO1xuICAgIHZpZGVvT3B0aW9ucy5rZXlGcmFtZUludGVydmFsID0gb3B0aW9ucy52aWRlby5rZXlGcmFtZUludGVydmFsO1xuICAgIHJldHVybiB0aGlzLl9zaWduYWxpbmcuc2VuZFNpZ25hbGluZ01lc3NhZ2UoJ3N1YnNjcmlwdGlvbi1jb250cm9sJywge1xuICAgICAgaWQ6IHRoaXMuX2ludGVybmFsSWQsXG4gICAgICBvcGVyYXRpb246ICd1cGRhdGUnLFxuICAgICAgZGF0YToge1xuICAgICAgICB2aWRlbzoge3BhcmFtZXRlcnM6IHZpZGVvT3B0aW9uc30sXG4gICAgICB9LFxuICAgIH0pLnRoZW4oKTtcbiAgfVxuXG4gIF9vblJlbW90ZVN0cmVhbUFkZGVkKGV2ZW50KSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdSZW1vdGUgc3RyZWFtIGFkZGVkLicpO1xuICAgIGlmICh0aGlzLl9zdWJzY3JpYmVkU3RyZWFtKSB7XG4gICAgICB0aGlzLl9zdWJzY3JpYmVkU3RyZWFtLm1lZGlhU3RyZWFtID0gZXZlbnQuc3RyZWFtc1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhpcyBpcyBub3QgZXhwZWN0ZWQgcGF0aC4gSG93ZXZlciwgdGhpcyBpcyBnb2luZyB0byBoYXBwZW4gb24gU2FmYXJpXG4gICAgICAvLyBiZWNhdXNlIGl0IGRvZXMgbm90IHN1cHBvcnQgc2V0dGluZyBkaXJlY3Rpb24gb2YgdHJhbnNjZWl2ZXIuXG4gICAgICBMb2dnZXIud2FybmluZygnUmVjZWl2ZWQgcmVtb3RlIHN0cmVhbSB3aXRob3V0IHN1YnNjcmlwdGlvbi4nKTtcbiAgICB9XG4gIH1cblxuICBfb25Mb2NhbEljZUNhbmRpZGF0ZShldmVudCkge1xuICAgIGlmIChldmVudC5jYW5kaWRhdGUpIHtcbiAgICAgIGlmICh0aGlzLl9wYy5zaWduYWxpbmdTdGF0ZSAhPT0gJ3N0YWJsZScpIHtcbiAgICAgICAgdGhpcy5fcGVuZGluZ0NhbmRpZGF0ZXMucHVzaChldmVudC5jYW5kaWRhdGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2VuZENhbmRpZGF0ZShldmVudC5jYW5kaWRhdGUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBMb2dnZXIuZGVidWcoJ0VtcHR5IGNhbmRpZGF0ZS4nKTtcbiAgICB9XG4gIH1cblxuICBfZmlyZUVuZGVkRXZlbnRPblB1YmxpY2F0aW9uT3JTdWJzY3JpcHRpb24oKSB7XG4gICAgaWYgKHRoaXMuX2VuZGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2VuZGVkID0gdHJ1ZTtcbiAgICBjb25zdCBldmVudCA9IG5ldyBPd3RFdmVudCgnZW5kZWQnKTtcbiAgICBpZiAodGhpcy5fcHVibGljYXRpb24pIHtcbiAgICAgIHRoaXMuX3B1YmxpY2F0aW9uLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgdGhpcy5fcHVibGljYXRpb24uc3RvcCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fc3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9zdWJzY3JpcHRpb24uZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICB0aGlzLl9zdWJzY3JpcHRpb24uc3RvcCgpO1xuICAgIH1cbiAgfVxuXG4gIF9yZWplY3RQcm9taXNlKGVycm9yKSB7XG4gICAgaWYgKCFlcnJvcikge1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgQ29uZmVyZW5jZUVycm9yKCdDb25uZWN0aW9uIGZhaWxlZCBvciBjbG9zZWQuJyk7XG4gICAgfVxuICAgIC8vIFJlamVjdGluZyBjb3JyZXNwb25kaW5nIHByb21pc2UgaWYgcHVibGlzaGluZyBhbmQgc3Vic2NyaWJpbmcgaXMgb25nb2luZy5cbiAgICBpZiAodGhpcy5fcHVibGlzaFByb21pc2UpIHtcbiAgICAgIHRoaXMuX3B1Ymxpc2hQcm9taXNlLnJlamVjdChlcnJvcik7XG4gICAgICB0aGlzLl9wdWJsaXNoUHJvbWlzZSA9IHVuZGVmaW5lZDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3N1YnNjcmliZVByb21pc2UpIHtcbiAgICAgIHRoaXMuX3N1YnNjcmliZVByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgIHRoaXMuX3N1YnNjcmliZVByb21pc2UgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgX29uSWNlQ29ubmVjdGlvblN0YXRlQ2hhbmdlKGV2ZW50KSB7XG4gICAgaWYgKCFldmVudCB8fCAhZXZlbnQuY3VycmVudFRhcmdldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIExvZ2dlci5kZWJ1ZygnSUNFIGNvbm5lY3Rpb24gc3RhdGUgY2hhbmdlZCB0byAnICtcbiAgICAgICAgZXZlbnQuY3VycmVudFRhcmdldC5pY2VDb25uZWN0aW9uU3RhdGUpO1xuICAgIGlmIChldmVudC5jdXJyZW50VGFyZ2V0LmljZUNvbm5lY3Rpb25TdGF0ZSA9PT0gJ2Nsb3NlZCcgfHxcbiAgICAgICAgZXZlbnQuY3VycmVudFRhcmdldC5pY2VDb25uZWN0aW9uU3RhdGUgPT09ICdmYWlsZWQnKSB7XG4gICAgICBpZiAoZXZlbnQuY3VycmVudFRhcmdldC5pY2VDb25uZWN0aW9uU3RhdGUgPT09ICdmYWlsZWQnKSB7XG4gICAgICAgIHRoaXMuX2hhbmRsZUVycm9yKCdJQ0UgY29ubmVjdGlvbiBmYWlsZWQuJyk7XG4gICAgICB9XG4gICAgICAvLyBGaXJlIGVuZGVkIGV2ZW50IGlmIHB1YmxpY2F0aW9uIG9yIHN1YnNjcmlwdGlvbiBleGlzdHMuXG4gICAgICB0aGlzLl9maXJlRW5kZWRFdmVudE9uUHVibGljYXRpb25PclN1YnNjcmlwdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIF9zZW5kQ2FuZGlkYXRlKGNhbmRpZGF0ZSkge1xuICAgIHRoaXMuX3NpZ25hbGluZy5zZW5kU2lnbmFsaW5nTWVzc2FnZSgnc29hYycsIHtcbiAgICAgIGlkOiB0aGlzLl9pbnRlcm5hbElkLFxuICAgICAgc2lnbmFsaW5nOiB7XG4gICAgICAgIHR5cGU6ICdjYW5kaWRhdGUnLFxuICAgICAgICBjYW5kaWRhdGU6IHtcbiAgICAgICAgICBjYW5kaWRhdGU6ICdhPScgKyBjYW5kaWRhdGUuY2FuZGlkYXRlLFxuICAgICAgICAgIHNkcE1pZDogY2FuZGlkYXRlLnNkcE1pZCxcbiAgICAgICAgICBzZHBNTGluZUluZGV4OiBjYW5kaWRhdGUuc2RwTUxpbmVJbmRleCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBfY3JlYXRlUGVlckNvbm5lY3Rpb24oKSB7XG4gICAgY29uc3QgcGNDb25maWd1cmF0aW9uID0gdGhpcy5fY29uZmlnLnJ0Y0NvbmZpZ3VyYXRpb24gfHwge307XG4gICAgaWYgKFV0aWxzLmlzQ2hyb21lKCkpIHtcbiAgICAgIHBjQ29uZmlndXJhdGlvbi5zZHBTZW1hbnRpY3MgPSAndW5pZmllZC1wbGFuJztcbiAgICB9XG4gICAgdGhpcy5fcGMgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24ocGNDb25maWd1cmF0aW9uKTtcbiAgICB0aGlzLl9wYy5vbmljZWNhbmRpZGF0ZSA9IChldmVudCkgPT4ge1xuICAgICAgdGhpcy5fb25Mb2NhbEljZUNhbmRpZGF0ZS5hcHBseSh0aGlzLCBbZXZlbnRdKTtcbiAgICB9O1xuICAgIHRoaXMuX3BjLm9udHJhY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX29uUmVtb3RlU3RyZWFtQWRkZWQuYXBwbHkodGhpcywgW2V2ZW50XSk7XG4gICAgfTtcbiAgICB0aGlzLl9wYy5vbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSA9IChldmVudCkgPT4ge1xuICAgICAgdGhpcy5fb25JY2VDb25uZWN0aW9uU3RhdGVDaGFuZ2UuYXBwbHkodGhpcywgW2V2ZW50XSk7XG4gICAgfTtcbiAgfVxuXG4gIF9nZXRTdGF0cygpIHtcbiAgICBpZiAodGhpcy5fcGMpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYy5nZXRTdGF0cygpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IENvbmZlcmVuY2VFcnJvcihcbiAgICAgICAgICAnUGVlckNvbm5lY3Rpb24gaXMgbm90IGF2YWlsYWJsZS4nKSk7XG4gICAgfVxuICB9XG5cbiAgX3JlYWR5SGFuZGxlcigpIHtcbiAgICBpZiAodGhpcy5fc3Vic2NyaWJlUHJvbWlzZSkge1xuICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbih0aGlzLl9pbnRlcm5hbElkLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuX3Vuc3Vic2NyaWJlKCk7XG4gICAgICB9LCAoKSA9PiB0aGlzLl9nZXRTdGF0cygpLFxuICAgICAgKHRyYWNrS2luZCkgPT4gdGhpcy5fbXV0ZU9yVW5tdXRlKHRydWUsIGZhbHNlLCB0cmFja0tpbmQpLFxuICAgICAgKHRyYWNrS2luZCkgPT4gdGhpcy5fbXV0ZU9yVW5tdXRlKGZhbHNlLCBmYWxzZSwgdHJhY2tLaW5kKSxcbiAgICAgIChvcHRpb25zKSA9PiB0aGlzLl9hcHBseU9wdGlvbnMob3B0aW9ucykpO1xuICAgICAgLy8gRmlyZSBzdWJzY3JpcHRpb24ncyBlbmRlZCBldmVudCB3aGVuIGFzc29jaWF0ZWQgc3RyZWFtIGlzIGVuZGVkLlxuICAgICAgdGhpcy5fc3Vic2NyaWJlZFN0cmVhbS5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsICgpID0+IHtcbiAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uLmRpc3BhdGNoRXZlbnQoJ2VuZGVkJywgbmV3IE93dEV2ZW50KCdlbmRlZCcpKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fc3Vic2NyaWJlUHJvbWlzZS5yZXNvbHZlKHRoaXMuX3N1YnNjcmlwdGlvbik7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9wdWJsaXNoUHJvbWlzZSkge1xuICAgICAgdGhpcy5fcHVibGljYXRpb24gPSBuZXcgUHVibGljYXRpb24odGhpcy5faW50ZXJuYWxJZCwgKCkgPT4ge1xuICAgICAgICB0aGlzLl91bnB1Ymxpc2goKTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgfSwgKCkgPT4gdGhpcy5fZ2V0U3RhdHMoKSxcbiAgICAgICh0cmFja0tpbmQpID0+IHRoaXMuX211dGVPclVubXV0ZSh0cnVlLCB0cnVlLCB0cmFja0tpbmQpLFxuICAgICAgKHRyYWNrS2luZCkgPT4gdGhpcy5fbXV0ZU9yVW5tdXRlKGZhbHNlLCB0cnVlLCB0cmFja0tpbmQpKTtcbiAgICAgIHRoaXMuX3B1Ymxpc2hQcm9taXNlLnJlc29sdmUodGhpcy5fcHVibGljYXRpb24pO1xuICAgICAgLy8gRG8gbm90IGZpcmUgcHVibGljYXRpb24ncyBlbmRlZCBldmVudCB3aGVuIGFzc29jaWF0ZWQgc3RyZWFtIGlzIGVuZGVkLlxuICAgICAgLy8gSXQgbWF5IHN0aWxsIHNlbmRpbmcgc2lsZW5jZSBvciBibGFjayBmcmFtZXMuXG4gICAgICAvLyBSZWZlciB0byBodHRwczovL3czYy5naXRodWIuaW8vd2VicnRjLXBjLyNydGNydHBzZW5kZXItaW50ZXJmYWNlLlxuICAgIH1cbiAgICB0aGlzLl9wdWJsaXNoUHJvbWlzZSA9IG51bGw7XG4gICAgdGhpcy5fc3Vic2NyaWJlUHJvbWlzZSA9IG51bGw7XG4gIH1cblxuICBfc2RwSGFuZGxlcihzZHApIHtcbiAgICBpZiAoc2RwLnR5cGUgPT09ICdhbnN3ZXInKSB7XG4gICAgICBpZiAoKHRoaXMuX3B1YmxpY2F0aW9uIHx8IHRoaXMuX3B1Ymxpc2hQcm9taXNlKSAmJiB0aGlzLl9vcHRpb25zKSB7XG4gICAgICAgIHNkcC5zZHAgPSB0aGlzLl9zZXRSdHBTZW5kZXJPcHRpb25zKHNkcC5zZHAsIHRoaXMuX29wdGlvbnMpO1xuICAgICAgfVxuICAgICAgdGhpcy5fcGMuc2V0UmVtb3RlRGVzY3JpcHRpb24oc2RwKS50aGVuKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX3BlbmRpbmdDYW5kaWRhdGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IGNhbmRpZGF0ZSBvZiB0aGlzLl9wZW5kaW5nQ2FuZGlkYXRlcykge1xuICAgICAgICAgICAgdGhpcy5fc2VuZENhbmRpZGF0ZShjYW5kaWRhdGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgIExvZ2dlci5lcnJvcignU2V0IHJlbW90ZSBkZXNjcmlwdGlvbiBmYWlsZWQ6ICcgKyBlcnJvcik7XG4gICAgICAgIHRoaXMuX3JlamVjdFByb21pc2UoZXJyb3IpO1xuICAgICAgICB0aGlzLl9maXJlRW5kZWRFdmVudE9uUHVibGljYXRpb25PclN1YnNjcmlwdGlvbigpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX2Vycm9ySGFuZGxlcihlcnJvck1lc3NhZ2UpIHtcbiAgICByZXR1cm4gdGhpcy5faGFuZGxlRXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgfVxuXG4gIF9oYW5kbGVFcnJvcihlcnJvck1lc3NhZ2Upe1xuICAgIGNvbnN0IGVycm9yID0gbmV3IENvbmZlcmVuY2VFcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgIGNvbnN0IHAgPSB0aGlzLl9wdWJsaXNoUHJvbWlzZSB8fCB0aGlzLl9zdWJzY3JpYmVQcm9taXNlO1xuICAgIGlmIChwKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVqZWN0UHJvbWlzZShlcnJvcik7XG4gICAgfVxuICAgIGlmICh0aGlzLl9lbmRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBkaXNwYXRjaGVyID0gdGhpcy5fcHVibGljYXRpb24gfHwgdGhpcy5fc3Vic2NyaXB0aW9uO1xuICAgIGlmICghZGlzcGF0Y2hlcikge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ05laXRoZXIgcHVibGljYXRpb24gbm9yIHN1YnNjcmlwdGlvbiBpcyBhdmFpbGFibGUuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGVycm9yRXZlbnQgPSBuZXcgRXJyb3JFdmVudCgnZXJyb3InLCB7XG4gICAgICBlcnJvcjogZXJyb3IsXG4gICAgfSk7XG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGVycm9yRXZlbnQpO1xuICB9XG5cbiAgX3NldENvZGVjT3JkZXIoc2RwLCBvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMuX3B1YmxpY2F0aW9uIHx8IHRoaXMuX3B1Ymxpc2hQcm9taXNlKSB7XG4gICAgICBpZiAob3B0aW9ucy5hdWRpbykge1xuICAgICAgICBjb25zdCBhdWRpb0NvZGVjTmFtZXMgPSBBcnJheS5mcm9tKG9wdGlvbnMuYXVkaW8sXG4gICAgICAgICAgICAoZW5jb2RpbmdQYXJhbWV0ZXJzKSA9PiBlbmNvZGluZ1BhcmFtZXRlcnMuY29kZWMubmFtZSk7XG4gICAgICAgIHNkcCA9IFNkcFV0aWxzLnJlb3JkZXJDb2RlY3Moc2RwLCAnYXVkaW8nLCBhdWRpb0NvZGVjTmFtZXMpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMudmlkZW8pIHtcbiAgICAgICAgY29uc3QgdmlkZW9Db2RlY05hbWVzID0gQXJyYXkuZnJvbShvcHRpb25zLnZpZGVvLFxuICAgICAgICAgICAgKGVuY29kaW5nUGFyYW1ldGVycykgPT4gZW5jb2RpbmdQYXJhbWV0ZXJzLmNvZGVjLm5hbWUpO1xuICAgICAgICBzZHAgPSBTZHBVdGlscy5yZW9yZGVyQ29kZWNzKHNkcCwgJ3ZpZGVvJywgdmlkZW9Db2RlY05hbWVzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG9wdGlvbnMuYXVkaW8gJiYgb3B0aW9ucy5hdWRpby5jb2RlY3MpIHtcbiAgICAgICAgY29uc3QgYXVkaW9Db2RlY05hbWVzID0gQXJyYXkuZnJvbShvcHRpb25zLmF1ZGlvLmNvZGVjcywgKGNvZGVjKSA9PlxuICAgICAgICAgIGNvZGVjLm5hbWUpO1xuICAgICAgICBzZHAgPSBTZHBVdGlscy5yZW9yZGVyQ29kZWNzKHNkcCwgJ2F1ZGlvJywgYXVkaW9Db2RlY05hbWVzKTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zLnZpZGVvICYmIG9wdGlvbnMudmlkZW8uY29kZWNzKSB7XG4gICAgICAgIGNvbnN0IHZpZGVvQ29kZWNOYW1lcyA9IEFycmF5LmZyb20ob3B0aW9ucy52aWRlby5jb2RlY3MsIChjb2RlYykgPT5cbiAgICAgICAgICBjb2RlYy5uYW1lKTtcbiAgICAgICAgc2RwID0gU2RwVXRpbHMucmVvcmRlckNvZGVjcyhzZHAsICd2aWRlbycsIHZpZGVvQ29kZWNOYW1lcyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZHA7XG4gIH1cblxuICBfc2V0TWF4Qml0cmF0ZShzZHAsIG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuYXVkaW8gPT09ICdvYmplY3QnKSB7XG4gICAgICBzZHAgPSBTZHBVdGlscy5zZXRNYXhCaXRyYXRlKHNkcCwgb3B0aW9ucy5hdWRpbyk7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy52aWRlbyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHNkcCA9IFNkcFV0aWxzLnNldE1heEJpdHJhdGUoc2RwLCBvcHRpb25zLnZpZGVvKTtcbiAgICB9XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIF9zZXRSdHBTZW5kZXJPcHRpb25zKHNkcCwgb3B0aW9ucykge1xuICAgIHNkcCA9IHRoaXMuX3NldE1heEJpdHJhdGUoc2RwLCBvcHRpb25zKTtcbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgX3NldFJ0cFJlY2VpdmVyT3B0aW9ucyhzZHAsIG9wdGlvbnMpIHtcbiAgICBzZHAgPSB0aGlzLl9zZXRDb2RlY09yZGVyKHNkcCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIC8vIEhhbmRsZSBzdHJlYW0gZXZlbnQgc2VudCBmcm9tIE1DVS4gU29tZSBzdHJlYW0gZXZlbnRzIHNob3VsZCBiZSBwdWJsaWNhdGlvblxuICAvLyBldmVudCBvciBzdWJzY3JpcHRpb24gZXZlbnQuIEl0IHdpbGwgYmUgaGFuZGxlZCBoZXJlLlxuICBfb25TdHJlYW1FdmVudChtZXNzYWdlKSB7XG4gICAgbGV0IGV2ZW50VGFyZ2V0O1xuICAgIGlmICh0aGlzLl9wdWJsaWNhdGlvbiAmJiBtZXNzYWdlLmlkID09PSB0aGlzLl9wdWJsaWNhdGlvbi5pZCkge1xuICAgICAgZXZlbnRUYXJnZXQgPSB0aGlzLl9wdWJsaWNhdGlvbjtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5fc3Vic2NyaWJlZFN0cmVhbSAmJiBtZXNzYWdlLmlkID09PSB0aGlzLl9zdWJzY3JpYmVkU3RyZWFtLmlkKSB7XG4gICAgICBldmVudFRhcmdldCA9IHRoaXMuX3N1YnNjcmlwdGlvbjtcbiAgICB9XG4gICAgaWYgKCFldmVudFRhcmdldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgdHJhY2tLaW5kO1xuICAgIGlmIChtZXNzYWdlLmRhdGEuZmllbGQgPT09ICdhdWRpby5zdGF0dXMnKSB7XG4gICAgICB0cmFja0tpbmQgPSBUcmFja0tpbmQuQVVESU87XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLmRhdGEuZmllbGQgPT09ICd2aWRlby5zdGF0dXMnKSB7XG4gICAgICB0cmFja0tpbmQgPSBUcmFja0tpbmQuVklERU87XG4gICAgfSBlbHNlIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdJbnZhbGlkIGRhdGEgZmllbGQgZm9yIHN0cmVhbSB1cGRhdGUgaW5mby4nKTtcbiAgICB9XG4gICAgaWYgKG1lc3NhZ2UuZGF0YS52YWx1ZSA9PT0gJ2FjdGl2ZScpIHtcbiAgICAgIGV2ZW50VGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IE11dGVFdmVudCgndW5tdXRlJywge2tpbmQ6IHRyYWNrS2luZH0pKTtcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuZGF0YS52YWx1ZSA9PT0gJ2luYWN0aXZlJykge1xuICAgICAgZXZlbnRUYXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgTXV0ZUV2ZW50KCdtdXRlJywge2tpbmQ6IHRyYWNrS2luZH0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ0ludmFsaWQgZGF0YSB2YWx1ZSBmb3Igc3RyZWFtIHVwZGF0ZSBpbmZvLicpO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4vKiBnbG9iYWwgTWFwLCBQcm9taXNlICovXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICogYXMgRXZlbnRNb2R1bGUgZnJvbSAnLi4vYmFzZS9ldmVudC5qcyc7XG5pbXBvcnQge1Npb1NpZ25hbGluZyBhcyBTaWduYWxpbmd9IGZyb20gJy4vc2lnbmFsaW5nLmpzJztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi4vYmFzZS9sb2dnZXIuanMnO1xuaW1wb3J0IHtCYXNlNjR9IGZyb20gJy4uL2Jhc2UvYmFzZTY0LmpzJztcbmltcG9ydCB7Q29uZmVyZW5jZUVycm9yfSBmcm9tICcuL2Vycm9yLmpzJztcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4uL2Jhc2UvdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgU3RyZWFtTW9kdWxlIGZyb20gJy4uL2Jhc2Uvc3RyZWFtLmpzJztcbmltcG9ydCB7UGFydGljaXBhbnR9IGZyb20gJy4vcGFydGljaXBhbnQuanMnO1xuaW1wb3J0IHtDb25mZXJlbmNlSW5mb30gZnJvbSAnLi9pbmZvLmpzJztcbmltcG9ydCB7Q29uZmVyZW5jZVBlZXJDb25uZWN0aW9uQ2hhbm5lbH0gZnJvbSAnLi9jaGFubmVsLmpzJztcbmltcG9ydCB7XG4gIFJlbW90ZU1peGVkU3RyZWFtLFxuICBBY3RpdmVBdWRpb0lucHV0Q2hhbmdlRXZlbnQsXG4gIExheW91dENoYW5nZUV2ZW50LFxufSBmcm9tICcuL21peGVkc3RyZWFtLmpzJztcbmltcG9ydCAqIGFzIFN0cmVhbVV0aWxzTW9kdWxlIGZyb20gJy4vc3RyZWFtdXRpbHMuanMnO1xuXG5jb25zdCBTaWduYWxpbmdTdGF0ZSA9IHtcbiAgUkVBRFk6IDEsXG4gIENPTk5FQ1RJTkc6IDIsXG4gIENPTk5FQ1RFRDogMyxcbn07XG5cbmNvbnN0IHByb3RvY29sVmVyc2lvbiA9ICcxLjAnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSB2YWxpZC1qc2RvYyAqL1xuLyoqXG4gKiBAY2xhc3MgUGFydGljaXBhbnRFdmVudFxuICogQGNsYXNzRGVzYyBDbGFzcyBQYXJ0aWNpcGFudEV2ZW50IHJlcHJlc2VudHMgYSBwYXJ0aWNpcGFudCBldmVudC5cbiAgIEBleHRlbmRzIE93dC5CYXNlLk93dEV2ZW50XG4gKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2VcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuY29uc3QgUGFydGljaXBhbnRFdmVudCA9IGZ1bmN0aW9uKHR5cGUsIGluaXQpIHtcbiAgY29uc3QgdGhhdCA9IG5ldyBFdmVudE1vZHVsZS5Pd3RFdmVudCh0eXBlLCBpbml0KTtcbiAgLyoqXG4gICAqIEBtZW1iZXIge093dC5Db25mZXJlbmNlLlBhcnRpY2lwYW50fSBwYXJ0aWNpcGFudFxuICAgKiBAaW5zdGFuY2VcbiAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlBhcnRpY2lwYW50RXZlbnRcbiAgICovXG4gIHRoYXQucGFydGljaXBhbnQgPSBpbml0LnBhcnRpY2lwYW50O1xuICByZXR1cm4gdGhhdDtcbn07XG4vKiBlc2xpbnQtZW5hYmxlIHZhbGlkLWpzZG9jICovXG5cbi8qKlxuICogQGNsYXNzIENvbmZlcmVuY2VDbGllbnRDb25maWd1cmF0aW9uXG4gKiBAY2xhc3NEZXNjIENvbmZpZ3VyYXRpb24gZm9yIENvbmZlcmVuY2VDbGllbnQuXG4gKiBAbWVtYmVyT2YgT3d0LkNvbmZlcmVuY2VcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuY2xhc3MgQ29uZmVyZW5jZUNsaWVudENvbmZpZ3VyYXRpb24geyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9SVENDb25maWd1cmF0aW9ufSBydGNDb25maWd1cmF0aW9uXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLkNvbmZlcmVuY2VDbGllbnRDb25maWd1cmF0aW9uXG4gICAgICogQGRlc2MgSXQgd2lsbCBiZSB1c2VkIGZvciBjcmVhdGluZyBQZWVyQ29ubmVjdGlvbi5cbiAgICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy53My5vcmcvVFIvd2VicnRjLyNydGNjb25maWd1cmF0aW9uLWRpY3Rpb25hcnl8UlRDQ29uZmlndXJhdGlvbiBEaWN0aW9uYXJ5IG9mIFdlYlJUQyAxLjB9LlxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gRm9sbG93aW5nIG9iamVjdCBjYW4gYmUgc2V0IHRvIGNvbmZlcmVuY2VDbGllbnRDb25maWd1cmF0aW9uLnJ0Y0NvbmZpZ3VyYXRpb24uXG4gICAgICoge1xuICAgICAqICAgaWNlU2VydmVyczogW3tcbiAgICAgKiAgICAgIHVybHM6IFwic3R1bjpleGFtcGxlLmNvbTozNDc4XCJcbiAgICAgKiAgIH0sIHtcbiAgICAgKiAgICAgdXJsczogW1xuICAgICAqICAgICAgIFwidHVybjpleGFtcGxlLmNvbTozNDc4P3RyYW5zcG9ydD11ZHBcIixcbiAgICAgKiAgICAgICBcInR1cm46ZXhhbXBsZS5jb206MzQ3OD90cmFuc3BvcnQ9dGNwXCJcbiAgICAgKiAgICAgXSxcbiAgICAgKiAgICAgIGNyZWRlbnRpYWw6IFwicGFzc3dvcmRcIixcbiAgICAgKiAgICAgIHVzZXJuYW1lOiBcInVzZXJuYW1lXCJcbiAgICAgKiAgIH1cbiAgICAgKiB9XG4gICAgICovXG4gICAgdGhpcy5ydGNDb25maWd1cmF0aW9uID0gdW5kZWZpbmVkO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIENvbmZlcmVuY2VDbGllbnRcbiAqIEBjbGFzc2Rlc2MgVGhlIENvbmZlcmVuY2VDbGllbnQgaGFuZGxlcyBQZWVyQ29ubmVjdGlvbnMgYmV0d2VlbiBjbGllbnQgYW5kIHNlcnZlci4gRm9yIGNvbmZlcmVuY2UgY29udHJvbGxpbmcsIHBsZWFzZSByZWZlciB0byBSRVNUIEFQSSBndWlkZS5cbiAqIEV2ZW50czpcbiAqXG4gKiB8IEV2ZW50IE5hbWUgICAgICAgICAgICB8IEFyZ3VtZW50IFR5cGUgICAgICAgICAgICAgICAgICAgIHwgRmlyZWQgd2hlbiAgICAgICB8XG4gKiB8IC0tLS0tLS0tLS0tLS0tLS0tLS0tLSB8IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXwgLS0tLS0tLS0tLS0tLS0tLSB8XG4gKiB8IHN0cmVhbWFkZGVkICAgICAgICAgICB8IE93dC5CYXNlLlN0cmVhbUV2ZW50ICAgICAgICAgICAgIHwgQSBuZXcgc3RyZWFtIGlzIGF2YWlsYWJsZSBpbiB0aGUgY29uZmVyZW5jZS4gfFxuICogfCBwYXJ0aWNpcGFudGpvaW5lZCAgICAgfCBPd3QuQ29uZmVyZW5jZS5QYXJ0aWNpcGFudEV2ZW50ICB8IEEgbmV3IHBhcnRpY2lwYW50IGpvaW5lZCB0aGUgY29uZmVyZW5jZS4gfFxuICogfCBtZXNzYWdlcmVjZWl2ZWQgICAgICAgfCBPd3QuQmFzZS5NZXNzYWdlRXZlbnQgICAgICAgICAgICB8IEEgbmV3IG1lc3NhZ2UgaXMgcmVjZWl2ZWQuIHxcbiAqIHwgc2VydmVyZGlzY29ubmVjdGVkICAgIHwgT3d0LkJhc2UuT3d0RXZlbnQgICAgICAgICAgICAgICAgfCBEaXNjb25uZWN0ZWQgZnJvbSBjb25mZXJlbmNlIHNlcnZlci4gfFxuICpcbiAqIEBtZW1iZXJvZiBPd3QuQ29uZmVyZW5jZVxuICogQGV4dGVuZHMgT3d0LkJhc2UuRXZlbnREaXNwYXRjaGVyXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7P093dC5Db25mZXJlbmNlLkNvbmZlcmVuY2VDbGllbnRDb25maWd1cmF0aW9uIH0gY29uZmlnIENvbmZpZ3VyYXRpb24gZm9yIENvbmZlcmVuY2VDbGllbnQuXG4gKiBAcGFyYW0gez9Pd3QuQ29uZmVyZW5jZS5TaW9TaWduYWxpbmcgfSBzaWduYWxpbmdJbXBsIFNpZ25hbGluZyBjaGFubmVsIGltcGxlbWVudGF0aW9uIGZvciBDb25mZXJlbmNlQ2xpZW50LiBTREsgdXNlcyBkZWZhdWx0IHNpZ25hbGluZyBjaGFubmVsIGltcGxlbWVudGF0aW9uIGlmIHRoaXMgcGFyYW1ldGVyIGlzIHVuZGVmaW5lZC4gQ3VycmVudGx5LCBhIFNvY2tldC5JTyBzaWduYWxpbmcgY2hhbm5lbCBpbXBsZW1lbnRhdGlvbiB3YXMgcHJvdmlkZWQgYXMgaWNzLmNvbmZlcmVuY2UuU2lvU2lnbmFsaW5nLiBIb3dldmVyLCBpdCBpcyBub3QgcmVjb21tZW5kZWQgdG8gZGlyZWN0bHkgYWNjZXNzIHNpZ25hbGluZyBjaGFubmVsIG9yIGN1c3RvbWl6ZSBzaWduYWxpbmcgY2hhbm5lbCBmb3IgQ29uZmVyZW5jZUNsaWVudCBhcyB0aGlzIHRpbWUuXG4gKi9cbmV4cG9ydCBjb25zdCBDb25mZXJlbmNlQ2xpZW50ID0gZnVuY3Rpb24oY29uZmlnLCBzaWduYWxpbmdJbXBsKSB7XG4gIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBuZXcgRXZlbnRNb2R1bGUuRXZlbnREaXNwYXRjaGVyKCkpO1xuICBjb25maWcgPSBjb25maWcgfHwge307XG4gIGNvbnN0IHNlbGYgPSB0aGlzO1xuICBsZXQgc2lnbmFsaW5nU3RhdGUgPSBTaWduYWxpbmdTdGF0ZS5SRUFEWTtcbiAgY29uc3Qgc2lnbmFsaW5nID0gc2lnbmFsaW5nSW1wbCA/IHNpZ25hbGluZ0ltcGwgOiAobmV3IFNpZ25hbGluZygpKTtcbiAgbGV0IG1lO1xuICBsZXQgcm9vbTtcbiAgY29uc3QgcmVtb3RlU3RyZWFtcyA9IG5ldyBNYXAoKTsgLy8gS2V5IGlzIHN0cmVhbSBJRCwgdmFsdWUgaXMgYSBSZW1vdGVTdHJlYW0uXG4gIGNvbnN0IHBhcnRpY2lwYW50cyA9IG5ldyBNYXAoKTsgLy8gS2V5IGlzIHBhcnRpY2lwYW50IElELCB2YWx1ZSBpcyBhIFBhcnRpY2lwYW50IG9iamVjdC5cbiAgY29uc3QgcHVibGlzaENoYW5uZWxzID0gbmV3IE1hcCgpOyAvLyBLZXkgaXMgTWVkaWFTdHJlYW0ncyBJRCwgdmFsdWUgaXMgcGMgY2hhbm5lbC5cbiAgY29uc3QgY2hhbm5lbHMgPSBuZXcgTWFwKCk7IC8vIEtleSBpcyBjaGFubmVsJ3MgaW50ZXJuYWwgSUQsIHZhbHVlIGlzIGNoYW5uZWwuXG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBvblNpZ25hbGluZ01lc3NhZ2VcbiAgICogQGRlc2MgUmVjZWl2ZWQgYSBtZXNzYWdlIGZyb20gY29uZmVyZW5jZSBwb3J0YWwuIERlZmluZWQgaW4gY2xpZW50LXNlcnZlciBwcm90b2NvbC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG5vdGlmaWNhdGlvbiBOb3RpZmljYXRpb24gdHlwZS5cbiAgICogQHBhcmFtIHtvYmplY3R9IGRhdGEgRGF0YSByZWNlaXZlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIG9uU2lnbmFsaW5nTWVzc2FnZShub3RpZmljYXRpb24sIGRhdGEpIHtcbiAgICBpZiAobm90aWZpY2F0aW9uID09PSAnc29hYycgfHwgbm90aWZpY2F0aW9uID09PSAncHJvZ3Jlc3MnKSB7XG4gICAgICBpZiAoIWNoYW5uZWxzLmhhcyhkYXRhLmlkKSkge1xuICAgICAgICBMb2dnZXIud2FybmluZygnQ2Fubm90IGZpbmQgYSBjaGFubmVsIGZvciBpbmNvbWluZyBkYXRhLicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjaGFubmVscy5nZXQoZGF0YS5pZCkub25NZXNzYWdlKG5vdGlmaWNhdGlvbiwgZGF0YSk7XG4gICAgfSBlbHNlIGlmIChub3RpZmljYXRpb24gPT09ICdzdHJlYW0nKSB7XG4gICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdhZGQnKSB7XG4gICAgICAgIGZpcmVTdHJlYW1BZGRlZChkYXRhLmRhdGEpO1xuICAgICAgfSBlbHNlIGlmIChkYXRhLnN0YXR1cyA9PT0gJ3JlbW92ZScpIHtcbiAgICAgICAgZmlyZVN0cmVhbVJlbW92ZWQoZGF0YSk7XG4gICAgICB9IGVsc2UgaWYgKGRhdGEuc3RhdHVzID09PSAndXBkYXRlJykge1xuICAgICAgICAvLyBCcm9hZGNhc3QgYXVkaW8vdmlkZW8gdXBkYXRlIHN0YXR1cyB0byBjaGFubmVsIHNvIHNwZWNpZmljIGV2ZW50cyBjYW4gYmUgZmlyZWQgb24gcHVibGljYXRpb24gb3Igc3Vic2NyaXB0aW9uLlxuICAgICAgICBpZiAoZGF0YS5kYXRhLmZpZWxkID09PSAnYXVkaW8uc3RhdHVzJyB8fCBkYXRhLmRhdGEuZmllbGQgPT09XG4gICAgICAgICAgJ3ZpZGVvLnN0YXR1cycpIHtcbiAgICAgICAgICBjaGFubmVscy5mb3JFYWNoKChjKSA9PiB7XG4gICAgICAgICAgICBjLm9uTWVzc2FnZShub3RpZmljYXRpb24sIGRhdGEpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEuZGF0YS5maWVsZCA9PT0gJ2FjdGl2ZUlucHV0Jykge1xuICAgICAgICAgIGZpcmVBY3RpdmVBdWRpb0lucHV0Q2hhbmdlKGRhdGEpO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEuZGF0YS5maWVsZCA9PT0gJ3ZpZGVvLmxheW91dCcpIHtcbiAgICAgICAgICBmaXJlTGF5b3V0Q2hhbmdlKGRhdGEpO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEuZGF0YS5maWVsZCA9PT0gJy4nKSB7XG4gICAgICAgICAgdXBkYXRlUmVtb3RlU3RyZWFtKGRhdGEuZGF0YS52YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgTG9nZ2VyLndhcm5pbmcoJ1Vua25vd24gc3RyZWFtIGV2ZW50IGZyb20gTUNVLicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub3RpZmljYXRpb24gPT09ICd0ZXh0Jykge1xuICAgICAgZmlyZU1lc3NhZ2VSZWNlaXZlZChkYXRhKTtcbiAgICB9IGVsc2UgaWYgKG5vdGlmaWNhdGlvbiA9PT0gJ3BhcnRpY2lwYW50Jykge1xuICAgICAgZmlyZVBhcnRpY2lwYW50RXZlbnQoZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgc2lnbmFsaW5nLmFkZEV2ZW50TGlzdGVuZXIoJ2RhdGEnLCAoZXZlbnQpID0+IHtcbiAgICBvblNpZ25hbGluZ01lc3NhZ2UoZXZlbnQubWVzc2FnZS5ub3RpZmljYXRpb24sIGV2ZW50Lm1lc3NhZ2UuZGF0YSk7XG4gIH0pO1xuXG4gIHNpZ25hbGluZy5hZGRFdmVudExpc3RlbmVyKCdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgIGNsZWFuKCk7XG4gICAgc2lnbmFsaW5nU3RhdGUgPSBTaWduYWxpbmdTdGF0ZS5SRUFEWTtcbiAgICBzZWxmLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50TW9kdWxlLk93dEV2ZW50KCdzZXJ2ZXJkaXNjb25uZWN0ZWQnKSk7XG4gIH0pO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGZ1bmN0aW9uIGZpcmVQYXJ0aWNpcGFudEV2ZW50KGRhdGEpIHtcbiAgICBpZiAoZGF0YS5hY3Rpb24gPT09ICdqb2luJykge1xuICAgICAgZGF0YSA9IGRhdGEuZGF0YTtcbiAgICAgIGNvbnN0IHBhcnRpY2lwYW50ID0gbmV3IFBhcnRpY2lwYW50KGRhdGEuaWQsIGRhdGEucm9sZSwgZGF0YS51c2VyKTtcbiAgICAgIHBhcnRpY2lwYW50cy5zZXQoZGF0YS5pZCwgcGFydGljaXBhbnQpO1xuICAgICAgY29uc3QgZXZlbnQgPSBuZXcgUGFydGljaXBhbnRFdmVudChcbiAgICAgICAgICAncGFydGljaXBhbnRqb2luZWQnLCB7cGFydGljaXBhbnQ6IHBhcnRpY2lwYW50fSk7XG4gICAgICBzZWxmLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIH0gZWxzZSBpZiAoZGF0YS5hY3Rpb24gPT09ICdsZWF2ZScpIHtcbiAgICAgIGNvbnN0IHBhcnRpY2lwYW50SWQgPSBkYXRhLmRhdGE7XG4gICAgICBpZiAoIXBhcnRpY2lwYW50cy5oYXMocGFydGljaXBhbnRJZCkpIHtcbiAgICAgICAgTG9nZ2VyLndhcm5pbmcoXG4gICAgICAgICAgICAnUmVjZWl2ZWQgbGVhdmUgbWVzc2FnZSBmcm9tIE1DVSBmb3IgYW4gdW5rbm93biBwYXJ0aWNpcGFudC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcGFydGljaXBhbnQgPSBwYXJ0aWNpcGFudHMuZ2V0KHBhcnRpY2lwYW50SWQpO1xuICAgICAgcGFydGljaXBhbnRzLmRlbGV0ZShwYXJ0aWNpcGFudElkKTtcbiAgICAgIHBhcnRpY2lwYW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50TW9kdWxlLk93dEV2ZW50KCdsZWZ0JykpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGZ1bmN0aW9uIGZpcmVNZXNzYWdlUmVjZWl2ZWQoZGF0YSkge1xuICAgIGNvbnN0IG1lc3NhZ2VFdmVudCA9IG5ldyBFdmVudE1vZHVsZS5NZXNzYWdlRXZlbnQoJ21lc3NhZ2VyZWNlaXZlZCcsIHtcbiAgICAgIG1lc3NhZ2U6IGRhdGEubWVzc2FnZSxcbiAgICAgIG9yaWdpbjogZGF0YS5mcm9tLFxuICAgICAgdG86IGRhdGEudG8sXG4gICAgfSk7XG4gICAgc2VsZi5kaXNwYXRjaEV2ZW50KG1lc3NhZ2VFdmVudCk7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBmdW5jdGlvbiBmaXJlU3RyZWFtQWRkZWQoaW5mbykge1xuICAgIGNvbnN0IHN0cmVhbSA9IGNyZWF0ZVJlbW90ZVN0cmVhbShpbmZvKTtcbiAgICByZW1vdGVTdHJlYW1zLnNldChzdHJlYW0uaWQsIHN0cmVhbSk7XG4gICAgY29uc3Qgc3RyZWFtRXZlbnQgPSBuZXcgU3RyZWFtTW9kdWxlLlN0cmVhbUV2ZW50KCdzdHJlYW1hZGRlZCcsIHtcbiAgICAgIHN0cmVhbTogc3RyZWFtLFxuICAgIH0pO1xuICAgIHNlbGYuZGlzcGF0Y2hFdmVudChzdHJlYW1FdmVudCk7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBmdW5jdGlvbiBmaXJlU3RyZWFtUmVtb3ZlZChpbmZvKSB7XG4gICAgaWYgKCFyZW1vdGVTdHJlYW1zLmhhcyhpbmZvLmlkKSkge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ0Nhbm5vdCBmaW5kIHNwZWNpZmljIHJlbW90ZSBzdHJlYW0uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHN0cmVhbSA9IHJlbW90ZVN0cmVhbXMuZ2V0KGluZm8uaWQpO1xuICAgIGNvbnN0IHN0cmVhbUV2ZW50ID0gbmV3IEV2ZW50TW9kdWxlLk93dEV2ZW50KCdlbmRlZCcpO1xuICAgIHJlbW90ZVN0cmVhbXMuZGVsZXRlKHN0cmVhbS5pZCk7XG4gICAgc3RyZWFtLmRpc3BhdGNoRXZlbnQoc3RyZWFtRXZlbnQpO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgZnVuY3Rpb24gZmlyZUFjdGl2ZUF1ZGlvSW5wdXRDaGFuZ2UoaW5mbykge1xuICAgIGlmICghcmVtb3RlU3RyZWFtcy5oYXMoaW5mby5pZCkpIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdDYW5ub3QgZmluZCBzcGVjaWZpYyByZW1vdGUgc3RyZWFtLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzdHJlYW0gPSByZW1vdGVTdHJlYW1zLmdldChpbmZvLmlkKTtcbiAgICBjb25zdCBzdHJlYW1FdmVudCA9IG5ldyBBY3RpdmVBdWRpb0lucHV0Q2hhbmdlRXZlbnQoXG4gICAgICAgICdhY3RpdmVhdWRpb2lucHV0Y2hhbmdlJywge1xuICAgICAgICAgIGFjdGl2ZUF1ZGlvSW5wdXRTdHJlYW1JZDogaW5mby5kYXRhLnZhbHVlLFxuICAgICAgICB9KTtcbiAgICBzdHJlYW0uZGlzcGF0Y2hFdmVudChzdHJlYW1FdmVudCk7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBmdW5jdGlvbiBmaXJlTGF5b3V0Q2hhbmdlKGluZm8pIHtcbiAgICBpZiAoIXJlbW90ZVN0cmVhbXMuaGFzKGluZm8uaWQpKSB7XG4gICAgICBMb2dnZXIud2FybmluZygnQ2Fubm90IGZpbmQgc3BlY2lmaWMgcmVtb3RlIHN0cmVhbS4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc3RyZWFtID0gcmVtb3RlU3RyZWFtcy5nZXQoaW5mby5pZCk7XG4gICAgY29uc3Qgc3RyZWFtRXZlbnQgPSBuZXcgTGF5b3V0Q2hhbmdlRXZlbnQoXG4gICAgICAgICdsYXlvdXRjaGFuZ2UnLCB7XG4gICAgICAgICAgbGF5b3V0OiBpbmZvLmRhdGEudmFsdWUsXG4gICAgICAgIH0pO1xuICAgIHN0cmVhbS5kaXNwYXRjaEV2ZW50KHN0cmVhbUV2ZW50KTtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGZ1bmN0aW9uIHVwZGF0ZVJlbW90ZVN0cmVhbShzdHJlYW1JbmZvKSB7XG4gICAgaWYgKCFyZW1vdGVTdHJlYW1zLmhhcyhzdHJlYW1JbmZvLmlkKSkge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ0Nhbm5vdCBmaW5kIHNwZWNpZmljIHJlbW90ZSBzdHJlYW0uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHN0cmVhbSA9IHJlbW90ZVN0cmVhbXMuZ2V0KHN0cmVhbUluZm8uaWQpO1xuICAgIHN0cmVhbS5zZXR0aW5ncyA9IFN0cmVhbVV0aWxzTW9kdWxlLmNvbnZlcnRUb1B1YmxpY2F0aW9uU2V0dGluZ3Moc3RyZWFtSW5mb1xuICAgICAgICAubWVkaWEpO1xuICAgIHN0cmVhbS5jYXBhYmlsaXRpZXMgPSBTdHJlYW1VdGlsc01vZHVsZS5jb252ZXJ0VG9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMoXG4gICAgICAgIHN0cmVhbUluZm8ubWVkaWEpO1xuICAgIGNvbnN0IHN0cmVhbUV2ZW50ID0gbmV3IEV2ZW50TW9kdWxlLk93dEV2ZW50KCd1cGRhdGVkJyk7XG4gICAgc3RyZWFtLmRpc3BhdGNoRXZlbnQoc3RyZWFtRXZlbnQpO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgZnVuY3Rpb24gY3JlYXRlUmVtb3RlU3RyZWFtKHN0cmVhbUluZm8pIHtcbiAgICBpZiAoc3RyZWFtSW5mby50eXBlID09PSAnbWl4ZWQnKSB7XG4gICAgICByZXR1cm4gbmV3IFJlbW90ZU1peGVkU3RyZWFtKHN0cmVhbUluZm8pO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgYXVkaW9Tb3VyY2VJbmZvOyBsZXQgdmlkZW9Tb3VyY2VJbmZvO1xuICAgICAgaWYgKHN0cmVhbUluZm8ubWVkaWEuYXVkaW8pIHtcbiAgICAgICAgYXVkaW9Tb3VyY2VJbmZvID0gc3RyZWFtSW5mby5tZWRpYS5hdWRpby5zb3VyY2U7XG4gICAgICB9XG4gICAgICBpZiAoc3RyZWFtSW5mby5tZWRpYS52aWRlbykge1xuICAgICAgICB2aWRlb1NvdXJjZUluZm8gPSBzdHJlYW1JbmZvLm1lZGlhLnZpZGVvLnNvdXJjZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHN0cmVhbSA9IG5ldyBTdHJlYW1Nb2R1bGUuUmVtb3RlU3RyZWFtKHN0cmVhbUluZm8uaWQsXG4gICAgICAgICAgc3RyZWFtSW5mby5pbmZvLm93bmVyLCB1bmRlZmluZWQsIG5ldyBTdHJlYW1Nb2R1bGUuU3RyZWFtU291cmNlSW5mbyhcbiAgICAgICAgICAgICAgYXVkaW9Tb3VyY2VJbmZvLCB2aWRlb1NvdXJjZUluZm8pLCBzdHJlYW1JbmZvLmluZm8uYXR0cmlidXRlcyk7XG4gICAgICBzdHJlYW0uc2V0dGluZ3MgPSBTdHJlYW1VdGlsc01vZHVsZS5jb252ZXJ0VG9QdWJsaWNhdGlvblNldHRpbmdzKFxuICAgICAgICAgIHN0cmVhbUluZm8ubWVkaWEpO1xuICAgICAgc3RyZWFtLmNhcGFiaWxpdGllcyA9IFN0cmVhbVV0aWxzTW9kdWxlLmNvbnZlcnRUb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyhcbiAgICAgICAgICBzdHJlYW1JbmZvLm1lZGlhKTtcbiAgICAgIHJldHVybiBzdHJlYW07XG4gICAgfVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgZnVuY3Rpb24gc2VuZFNpZ25hbGluZ01lc3NhZ2UodHlwZSwgbWVzc2FnZSkge1xuICAgIHJldHVybiBzaWduYWxpbmcuc2VuZCh0eXBlLCBtZXNzYWdlKTtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGZ1bmN0aW9uIGNyZWF0ZVBlZXJDb25uZWN0aW9uQ2hhbm5lbCgpIHtcbiAgICAvLyBDb25zdHJ1Y3QgYW4gc2lnbmFsaW5nIHNlbmRlci9yZWNlaXZlciBmb3IgQ29uZmVyZW5jZVBlZXJDb25uZWN0aW9uLlxuICAgIGNvbnN0IHNpZ25hbGluZ0ZvckNoYW5uZWwgPSBPYmplY3QuY3JlYXRlKEV2ZW50TW9kdWxlLkV2ZW50RGlzcGF0Y2hlcik7XG4gICAgc2lnbmFsaW5nRm9yQ2hhbm5lbC5zZW5kU2lnbmFsaW5nTWVzc2FnZSA9IHNlbmRTaWduYWxpbmdNZXNzYWdlO1xuICAgIGNvbnN0IHBjYyA9IG5ldyBDb25mZXJlbmNlUGVlckNvbm5lY3Rpb25DaGFubmVsKFxuICAgICAgICBjb25maWcsIHNpZ25hbGluZ0ZvckNoYW5uZWwpO1xuICAgIHBjYy5hZGRFdmVudExpc3RlbmVyKCdpZCcsIChtZXNzYWdlRXZlbnQpID0+IHtcbiAgICAgIGNoYW5uZWxzLnNldChtZXNzYWdlRXZlbnQubWVzc2FnZSwgcGNjKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcGNjO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgZnVuY3Rpb24gY2xlYW4oKSB7XG4gICAgcGFydGljaXBhbnRzLmNsZWFyKCk7XG4gICAgcmVtb3RlU3RyZWFtcy5jbGVhcigpO1xuICB9XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdpbmZvJywge1xuICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgZ2V0OiAoKSA9PiB7XG4gICAgICBpZiAoIXJvb20pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IENvbmZlcmVuY2VJbmZvKHJvb20uaWQsIEFycmF5LmZyb20ocGFydGljaXBhbnRzLCAoeCkgPT4geFtcbiAgICAgICAgICAxXSksIEFycmF5LmZyb20ocmVtb3RlU3RyZWFtcywgKHgpID0+IHhbMV0pLCBtZSk7XG4gICAgfSxcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBqb2luXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAZGVzYyBKb2luIGEgY29uZmVyZW5jZS5cbiAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLkNvbmZlcmVuY2VDbGllbnRcbiAgICogQHJldHVybnMge1Byb21pc2U8Q29uZmVyZW5jZUluZm8sIEVycm9yPn0gUmV0dXJuIGEgcHJvbWlzZSByZXNvbHZlZCB3aXRoIGN1cnJlbnQgY29uZmVyZW5jZSdzIGluZm9ybWF0aW9uIGlmIHN1Y2Nlc3NmdWxseSBqb2luIHRoZSBjb25mZXJlbmNlLiBPciByZXR1cm4gYSBwcm9taXNlIHJlamVjdGVkIHdpdGggYSBuZXdseSBjcmVhdGVkIE93dC5FcnJvciBpZiBmYWlsZWQgdG8gam9pbiB0aGUgY29uZmVyZW5jZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRva2VuU3RyaW5nIFRva2VuIGlzIGlzc3VlZCBieSBjb25mZXJlbmNlIHNlcnZlcihudXZlKS5cbiAgICovXG4gIHRoaXMuam9pbiA9IGZ1bmN0aW9uKHRva2VuU3RyaW5nKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHRva2VuID0gSlNPTi5wYXJzZShCYXNlNjQuZGVjb2RlQmFzZTY0KHRva2VuU3RyaW5nKSk7XG4gICAgICBjb25zdCBpc1NlY3VyZWQgPSAodG9rZW4uc2VjdXJlID09PSB0cnVlKTtcbiAgICAgIGxldCBob3N0ID0gdG9rZW4uaG9zdDtcbiAgICAgIGlmICh0eXBlb2YgaG9zdCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoJ0ludmFsaWQgaG9zdC4nKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChob3N0LmluZGV4T2YoJ2h0dHAnKSA9PT0gLTEpIHtcbiAgICAgICAgaG9zdCA9IGlzU2VjdXJlZCA/ICgnaHR0cHM6Ly8nICsgaG9zdCkgOiAoJ2h0dHA6Ly8nICsgaG9zdCk7XG4gICAgICB9XG4gICAgICBpZiAoc2lnbmFsaW5nU3RhdGUgIT09IFNpZ25hbGluZ1N0YXRlLlJFQURZKSB7XG4gICAgICAgIHJlamVjdChuZXcgQ29uZmVyZW5jZUVycm9yKCdjb25uZWN0aW9uIHN0YXRlIGludmFsaWQnKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2lnbmFsaW5nU3RhdGUgPSBTaWduYWxpbmdTdGF0ZS5DT05ORUNUSU5HO1xuXG4gICAgICBjb25zdCBsb2dpbkluZm8gPSB7XG4gICAgICAgIHRva2VuOiB0b2tlblN0cmluZyxcbiAgICAgICAgdXNlckFnZW50OiBVdGlscy5zeXNJbmZvKCksXG4gICAgICAgIHByb3RvY29sOiBwcm90b2NvbFZlcnNpb24sXG4gICAgICB9O1xuXG4gICAgICBzaWduYWxpbmcuY29ubmVjdChob3N0LCBpc1NlY3VyZWQsIGxvZ2luSW5mbykudGhlbigocmVzcCkgPT4ge1xuICAgICAgICBzaWduYWxpbmdTdGF0ZSA9IFNpZ25hbGluZ1N0YXRlLkNPTk5FQ1RFRDtcbiAgICAgICAgcm9vbSA9IHJlc3Aucm9vbTtcbiAgICAgICAgaWYgKHJvb20uc3RyZWFtcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBzdCBvZiByb29tLnN0cmVhbXMpIHtcbiAgICAgICAgICAgIGlmIChzdC50eXBlID09PSAnbWl4ZWQnKSB7XG4gICAgICAgICAgICAgIHN0LnZpZXdwb3J0ID0gc3QuaW5mby5sYWJlbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlbW90ZVN0cmVhbXMuc2V0KHN0LmlkLCBjcmVhdGVSZW1vdGVTdHJlYW0oc3QpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3Aucm9vbSAmJiByZXNwLnJvb20ucGFydGljaXBhbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IHAgb2YgcmVzcC5yb29tLnBhcnRpY2lwYW50cykge1xuICAgICAgICAgICAgcGFydGljaXBhbnRzLnNldChwLmlkLCBuZXcgUGFydGljaXBhbnQocC5pZCwgcC5yb2xlLCBwLnVzZXIpKTtcbiAgICAgICAgICAgIGlmIChwLmlkID09PSByZXNwLmlkKSB7XG4gICAgICAgICAgICAgIG1lID0gcGFydGljaXBhbnRzLmdldChwLmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShuZXcgQ29uZmVyZW5jZUluZm8ocmVzcC5yb29tLmlkLCBBcnJheS5mcm9tKHBhcnRpY2lwYW50c1xuICAgICAgICAgICAgLnZhbHVlcygpKSwgQXJyYXkuZnJvbShyZW1vdGVTdHJlYW1zLnZhbHVlcygpKSwgbWUpKTtcbiAgICAgIH0sIChlKSA9PiB7XG4gICAgICAgIHNpZ25hbGluZ1N0YXRlID0gU2lnbmFsaW5nU3RhdGUuUkVBRFk7XG4gICAgICAgIHJlamVjdChuZXcgQ29uZmVyZW5jZUVycm9yKGUpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gcHVibGlzaFxuICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuQ29uZmVyZW5jZUNsaWVudFxuICAgKiBAaW5zdGFuY2VcbiAgICogQGRlc2MgUHVibGlzaCBhIExvY2FsU3RyZWFtIHRvIGNvbmZlcmVuY2Ugc2VydmVyLiBPdGhlciBwYXJ0aWNpcGFudHMgd2lsbCBiZSBhYmxlIHRvIHN1YnNjcmliZSB0aGlzIHN0cmVhbSB3aGVuIGl0IGlzIHN1Y2Nlc3NmdWxseSBwdWJsaXNoZWQuXG4gICAqIEBwYXJhbSB7T3d0LkJhc2UuTG9jYWxTdHJlYW19IHN0cmVhbSBUaGUgc3RyZWFtIHRvIGJlIHB1Ymxpc2hlZC5cbiAgICogQHBhcmFtIHtPd3QuQmFzZS5QdWJsaXNoT3B0aW9uc30gb3B0aW9ucyBPcHRpb25zIGZvciBwdWJsaWNhdGlvbi5cbiAgICogQHJldHVybnMge1Byb21pc2U8UHVibGljYXRpb24sIEVycm9yPn0gUmV0dXJuZWQgcHJvbWlzZSB3aWxsIGJlIHJlc29sdmVkIHdpdGggYSBuZXdseSBjcmVhdGVkIFB1YmxpY2F0aW9uIG9uY2Ugc3BlY2lmaWMgc3RyZWFtIGlzIHN1Y2Nlc3NmdWxseSBwdWJsaXNoZWQsIG9yIHJlamVjdGVkIHdpdGggYSBuZXdseSBjcmVhdGVkIEVycm9yIGlmIHN0cmVhbSBpcyBpbnZhbGlkIG9yIG9wdGlvbnMgY2Fubm90IGJlIHNhdGlzZmllZC4gU3VjY2Vzc2Z1bGx5IHB1Ymxpc2hlZCBtZWFucyBQZWVyQ29ubmVjdGlvbiBpcyBlc3RhYmxpc2hlZCBhbmQgc2VydmVyIGlzIGFibGUgdG8gcHJvY2VzcyBtZWRpYSBkYXRhLlxuICAgKi9cbiAgdGhpcy5wdWJsaXNoID0gZnVuY3Rpb24oc3RyZWFtLCBvcHRpb25zKSB7XG4gICAgaWYgKCEoc3RyZWFtIGluc3RhbmNlb2YgU3RyZWFtTW9kdWxlLkxvY2FsU3RyZWFtKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoJ0ludmFsaWQgc3RyZWFtLicpKTtcbiAgICB9XG4gICAgaWYgKHB1Ymxpc2hDaGFubmVscy5oYXMoc3RyZWFtLm1lZGlhU3RyZWFtLmlkKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBDb25mZXJlbmNlRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBwdWJsaXNoIGEgcHVibGlzaGVkIHN0cmVhbS4nKSk7XG4gICAgfVxuICAgIGNvbnN0IGNoYW5uZWwgPSBjcmVhdGVQZWVyQ29ubmVjdGlvbkNoYW5uZWwoKTtcbiAgICByZXR1cm4gY2hhbm5lbC5wdWJsaXNoKHN0cmVhbSwgb3B0aW9ucyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBzdWJzY3JpYmVcbiAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLkNvbmZlcmVuY2VDbGllbnRcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIFN1YnNjcmliZSBhIFJlbW90ZVN0cmVhbSBmcm9tIGNvbmZlcmVuY2Ugc2VydmVyLlxuICAgKiBAcGFyYW0ge093dC5CYXNlLlJlbW90ZVN0cmVhbX0gc3RyZWFtIFRoZSBzdHJlYW0gdG8gYmUgc3Vic2NyaWJlZC5cbiAgICogQHBhcmFtIHtPd3QuQ29uZmVyZW5jZS5TdWJzY3JpYmVPcHRpb25zfSBvcHRpb25zIE9wdGlvbnMgZm9yIHN1YnNjcmlwdGlvbi5cbiAgICogQHJldHVybnMge1Byb21pc2U8U3Vic2NyaXB0aW9uLCBFcnJvcj59IFJldHVybmVkIHByb21pc2Ugd2lsbCBiZSByZXNvbHZlZCB3aXRoIGEgbmV3bHkgY3JlYXRlZCBTdWJzY3JpcHRpb24gb25jZSBzcGVjaWZpYyBzdHJlYW0gaXMgc3VjY2Vzc2Z1bGx5IHN1YnNjcmliZWQsIG9yIHJlamVjdGVkIHdpdGggYSBuZXdseSBjcmVhdGVkIEVycm9yIGlmIHN0cmVhbSBpcyBpbnZhbGlkIG9yIG9wdGlvbnMgY2Fubm90IGJlIHNhdGlzZmllZC4gU3VjY2Vzc2Z1bGx5IHN1YnNjcmliZWQgbWVhbnMgUGVlckNvbm5lY3Rpb24gaXMgZXN0YWJsaXNoZWQgYW5kIHNlcnZlciB3YXMgc3RhcnRlZCB0byBzZW5kIG1lZGlhIGRhdGEuXG4gICAqL1xuICB0aGlzLnN1YnNjcmliZSA9IGZ1bmN0aW9uKHN0cmVhbSwgb3B0aW9ucykge1xuICAgIGlmICghKHN0cmVhbSBpbnN0YW5jZW9mIFN0cmVhbU1vZHVsZS5SZW1vdGVTdHJlYW0pKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IENvbmZlcmVuY2VFcnJvcignSW52YWxpZCBzdHJlYW0uJykpO1xuICAgIH1cbiAgICBjb25zdCBjaGFubmVsID0gY3JlYXRlUGVlckNvbm5lY3Rpb25DaGFubmVsKCk7XG4gICAgcmV0dXJuIGNoYW5uZWwuc3Vic2NyaWJlKHN0cmVhbSwgb3B0aW9ucyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBzZW5kXG4gICAqIEBtZW1iZXJvZiBPd3QuQ29uZmVyZW5jZS5Db25mZXJlbmNlQ2xpZW50XG4gICAqIEBpbnN0YW5jZVxuICAgKiBAZGVzYyBTZW5kIGEgdGV4dCBtZXNzYWdlIHRvIGEgcGFydGljaXBhbnQgb3IgYWxsIHBhcnRpY2lwYW50cy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgTWVzc2FnZSB0byBiZSBzZW50LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFydGljaXBhbnRJZCBSZWNlaXZlciBvZiB0aGlzIG1lc3NhZ2UuIE1lc3NhZ2Ugd2lsbCBiZSBzZW50IHRvIGFsbCBwYXJ0aWNpcGFudHMgaWYgcGFydGljaXBhbnRJZCBpcyB1bmRlZmluZWQuXG4gICAqIEByZXR1cm4ge1Byb21pc2U8dm9pZCwgRXJyb3I+fSBSZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVzb2x2ZWQgd2hlbiBjb25mZXJlbmNlIHNlcnZlciByZWNlaXZlZCBjZXJ0YWluIG1lc3NhZ2UuXG4gICAqL1xuICB0aGlzLnNlbmQgPSBmdW5jdGlvbihtZXNzYWdlLCBwYXJ0aWNpcGFudElkKSB7XG4gICAgaWYgKHBhcnRpY2lwYW50SWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcGFydGljaXBhbnRJZCA9ICdhbGwnO1xuICAgIH1cbiAgICByZXR1cm4gc2VuZFNpZ25hbGluZ01lc3NhZ2UoJ3RleHQnLCB7dG86IHBhcnRpY2lwYW50SWQsIG1lc3NhZ2U6IG1lc3NhZ2V9KTtcbiAgfTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIGxlYXZlXG4gICAqIEBtZW1iZXJPZiBPd3QuQ29uZmVyZW5jZS5Db25mZXJlbmNlQ2xpZW50XG4gICAqIEBpbnN0YW5jZVxuICAgKiBAZGVzYyBMZWF2ZSBhIGNvbmZlcmVuY2UuXG4gICAqIEByZXR1cm4ge1Byb21pc2U8dm9pZCwgRXJyb3I+fSBSZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVzb2x2ZWQgd2l0aCB1bmRlZmluZWQgb25jZSB0aGUgY29ubmVjdGlvbiBpcyBkaXNjb25uZWN0ZWQuXG4gICAqL1xuICB0aGlzLmxlYXZlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNpZ25hbGluZy5kaXNjb25uZWN0KCkudGhlbigoKSA9PiB7XG4gICAgICBjbGVhbigpO1xuICAgICAgc2lnbmFsaW5nU3RhdGUgPSBTaWduYWxpbmdTdGF0ZS5SRUFEWTtcbiAgICB9KTtcbiAgfTtcbn07XG4iLCIvLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAY2xhc3MgQ29uZmVyZW5jZUVycm9yXG4gKiBAY2xhc3NEZXNjIFRoZSBDb25mZXJlbmNlRXJyb3Igb2JqZWN0IHJlcHJlc2VudHMgYW4gZXJyb3IgaW4gY29uZmVyZW5jZSBtb2RlLlxuICogQG1lbWJlck9mIE93dC5Db25mZXJlbmNlXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBDb25mZXJlbmNlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgfVxufVxuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydCB7Q29uZmVyZW5jZUNsaWVudH0gZnJvbSAnLi9jbGllbnQuanMnO1xuZXhwb3J0IHtTaW9TaWduYWxpbmd9IGZyb20gJy4vc2lnbmFsaW5nLmpzJztcbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBjbGFzcyBDb25mZXJlbmNlSW5mb1xuICogQGNsYXNzRGVzYyBJbmZvcm1hdGlvbiBmb3IgYSBjb25mZXJlbmNlLlxuICogQG1lbWJlck9mIE93dC5Db25mZXJlbmNlXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBDb25mZXJlbmNlSW5mbyB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKGlkLCBwYXJ0aWNpcGFudHMsIHJlbW90ZVN0cmVhbXMsIG15SW5mbykge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gaWRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuQ29uZmVyZW5jZUluZm9cbiAgICAgKiBAZGVzYyBDb25mZXJlbmNlIElELlxuICAgICAqL1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtBcnJheTxPd3QuQ29uZmVyZW5jZS5QYXJ0aWNpcGFudD59IHBhcnRpY2lwYW50c1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQ29uZmVyZW5jZS5Db25mZXJlbmNlSW5mb1xuICAgICAqIEBkZXNjIFBhcnRpY2lwYW50cyBpbiB0aGUgY29uZmVyZW5jZS5cbiAgICAgKi9cbiAgICB0aGlzLnBhcnRpY2lwYW50cyA9IHBhcnRpY2lwYW50cztcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtBcnJheTxPd3QuQmFzZS5SZW1vdGVTdHJlYW0+fSByZW1vdGVTdHJlYW1zXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLkNvbmZlcmVuY2VJbmZvXG4gICAgICogQGRlc2MgU3RyZWFtcyBwdWJsaXNoZWQgYnkgcGFydGljaXBhbnRzLiBJdCBhbHNvIGluY2x1ZGVzIHN0cmVhbXMgcHVibGlzaGVkIGJ5IGN1cnJlbnQgdXNlci5cbiAgICAgKi9cbiAgICB0aGlzLnJlbW90ZVN0cmVhbXMgPSByZW1vdGVTdHJlYW1zO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge093dC5CYXNlLlBhcnRpY2lwYW50fSBzZWxmXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLkNvbmZlcmVuY2VJbmZvXG4gICAgICovXG4gICAgdGhpcy5zZWxmID0gbXlJbmZvO1xuICB9XG59XG4iLCIvLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICogYXMgU3RyZWFtTW9kdWxlIGZyb20gJy4uL2Jhc2Uvc3RyZWFtLmpzJztcbmltcG9ydCAqIGFzIFN0cmVhbVV0aWxzTW9kdWxlIGZyb20gJy4vc3RyZWFtdXRpbHMuanMnO1xuaW1wb3J0IHtPd3RFdmVudH0gZnJvbSAnLi4vYmFzZS9ldmVudC5qcyc7XG5cbi8qKlxuICogQGNsYXNzIFJlbW90ZU1peGVkU3RyZWFtXG4gKiBAY2xhc3NEZXNjIE1peGVkIHN0cmVhbSBmcm9tIGNvbmZlcmVuY2Ugc2VydmVyLlxuICogRXZlbnRzOlxuICpcbiAqIHwgRXZlbnQgTmFtZSAgICAgICAgICAgICB8IEFyZ3VtZW50IFR5cGUgICAgfCBGaXJlZCB3aGVuICAgICAgIHxcbiAqIHwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS18IC0tLS0tLS0tLS0tLS0tLS0gfCAtLS0tLS0tLS0tLS0tLS0tIHxcbiAqIHwgYWN0aXZlYXVkaW9pbnB1dGNoYW5nZSB8IEV2ZW50ICAgICAgICAgICAgfCBBdWRpbyBhY3RpdmVuZXNzIG9mIGlucHV0IHN0cmVhbSAob2YgdGhlIG1peGVkIHN0cmVhbSkgaXMgY2hhbmdlZC4gfFxuICogfCBsYXlvdXRjaGFuZ2UgICAgICAgICAgIHwgRXZlbnQgICAgICAgICAgICB8IFZpZGVvJ3MgbGF5b3V0IGhhcyBiZWVuIGNoYW5nZWQuIEl0IHVzdWFsbHkgaGFwcGVucyB3aGVuIGEgbmV3IHZpZGVvIGlzIG1peGVkIGludG8gdGhlIHRhcmdldCBtaXhlZCBzdHJlYW0gb3IgYW4gZXhpc3RpbmcgdmlkZW8gaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIG1peGVkIHN0cmVhbS4gfFxuICpcbiAqIEBtZW1iZXJPZiBPd3QuQ29uZmVyZW5jZVxuICogQGV4dGVuZHMgT3d0LkJhc2UuUmVtb3RlU3RyZWFtXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBSZW1vdGVNaXhlZFN0cmVhbSBleHRlbmRzIFN0cmVhbU1vZHVsZS5SZW1vdGVTdHJlYW0ge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3RvcihpbmZvKSB7XG4gICAgaWYgKGluZm8udHlwZSAhPT0gJ21peGVkJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTm90IGEgbWl4ZWQgc3RyZWFtJyk7XG4gICAgfVxuICAgIHN1cGVyKGluZm8uaWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBuZXcgU3RyZWFtTW9kdWxlLlN0cmVhbVNvdXJjZUluZm8oXG4gICAgICAgICdtaXhlZCcsICdtaXhlZCcpKTtcblxuICAgIHRoaXMuc2V0dGluZ3MgPSBTdHJlYW1VdGlsc01vZHVsZS5jb252ZXJ0VG9QdWJsaWNhdGlvblNldHRpbmdzKGluZm8ubWVkaWEpO1xuXG4gICAgdGhpcy5jYXBhYmlsaXRpZXMgPSBuZXcgU3RyZWFtVXRpbHNNb2R1bGUuY29udmVydFRvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzKFxuICAgICAgICBpbmZvLm1lZGlhKTtcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBBY3RpdmVBdWRpb0lucHV0Q2hhbmdlRXZlbnRcbiAqIEBjbGFzc0Rlc2MgQ2xhc3MgQWN0aXZlQXVkaW9JbnB1dENoYW5nZUV2ZW50IHJlcHJlc2VudHMgYW4gYWN0aXZlIGF1ZGlvIGlucHV0IGNoYW5nZSBldmVudC5cbiAqIEBtZW1iZXJvZiBPd3QuQ29uZmVyZW5jZVxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgQWN0aXZlQXVkaW9JbnB1dENoYW5nZUV2ZW50IGV4dGVuZHMgT3d0RXZlbnQge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBpbml0KSB7XG4gICAgc3VwZXIodHlwZSk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBhY3RpdmVBdWRpb0lucHV0U3RyZWFtSWRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuQWN0aXZlQXVkaW9JbnB1dENoYW5nZUV2ZW50XG4gICAgICogQGRlc2MgVGhlIElEIG9mIGlucHV0IHN0cmVhbShvZiB0aGUgbWl4ZWQgc3RyZWFtKSB3aG9zZSBhdWRpbyBpcyBhY3RpdmUuXG4gICAgICovXG4gICAgdGhpcy5hY3RpdmVBdWRpb0lucHV0U3RyZWFtSWQgPSBpbml0LmFjdGl2ZUF1ZGlvSW5wdXRTdHJlYW1JZDtcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBMYXlvdXRDaGFuZ2VFdmVudFxuICogQGNsYXNzRGVzYyBDbGFzcyBMYXlvdXRDaGFuZ2VFdmVudCByZXByZXNlbnRzIGFuIHZpZGVvIGxheW91dCBjaGFuZ2UgZXZlbnQuXG4gKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2VcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIExheW91dENoYW5nZUV2ZW50IGV4dGVuZHMgT3d0RXZlbnQge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBpbml0KSB7XG4gICAgc3VwZXIodHlwZSk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7b2JqZWN0fSBsYXlvdXRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuTGF5b3V0Q2hhbmdlRXZlbnRcbiAgICAgKiBAZGVzYyBDdXJyZW50IHZpZGVvJ3MgbGF5b3V0LiBJdCdzIGFuIGFycmF5IG9mIG1hcCB3aGljaCBtYXBzIGVhY2ggc3RyZWFtIHRvIGEgcmVnaW9uLlxuICAgICAqL1xuICAgIHRoaXMubGF5b3V0ID0gaW5pdC5sYXlvdXQ7XG4gIH1cbn1cblxuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG5pbXBvcnQgKiBhcyBFdmVudE1vZHVsZSBmcm9tICcuLi9iYXNlL2V2ZW50LmpzJztcblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBjbGFzcyBQYXJ0aWNpcGFudFxuICogQG1lbWJlck9mIE93dC5Db25mZXJlbmNlXG4gKiBAY2xhc3NEZXNjIFRoZSBQYXJ0aWNpcGFudCBkZWZpbmVzIGEgcGFydGljaXBhbnQgaW4gYSBjb25mZXJlbmNlLlxuICogRXZlbnRzOlxuICpcbiAqIHwgRXZlbnQgTmFtZSAgICAgIHwgQXJndW1lbnQgVHlwZSAgICAgIHwgRmlyZWQgd2hlbiAgICAgICB8XG4gKiB8IC0tLS0tLS0tLS0tLS0tLS18IC0tLS0tLS0tLS0tLS0tLS0tLSB8IC0tLS0tLS0tLS0tLS0tLS0gfFxuICogfCBsZWZ0ICAgICAgICAgICAgfCBPd3QuQmFzZS5Pd3RFdmVudCAgfCBUaGUgcGFydGljaXBhbnQgbGVmdCB0aGUgY29uZmVyZW5jZS4gfFxuICpcbiAqIEBleHRlbmRzIE93dC5CYXNlLkV2ZW50RGlzcGF0Y2hlclxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgUGFydGljaXBhbnQgZXh0ZW5kcyBFdmVudE1vZHVsZS5FdmVudERpc3BhdGNoZXIge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3RvcihpZCwgcm9sZSwgdXNlcklkKSB7XG4gICAgc3VwZXIoKTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IGlkXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlBhcnRpY2lwYW50XG4gICAgICogQGRlc2MgVGhlIElEIG9mIHRoZSBwYXJ0aWNpcGFudC4gSXQgdmFyaWVzIHdoZW4gYSBzaW5nbGUgdXNlciBqb2luIGRpZmZlcmVudCBjb25mZXJlbmNlcy5cbiAgICAgKi9cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2lkJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBpZCxcbiAgICB9KTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IHJvbGVcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuUGFydGljaXBhbnRcbiAgICAgKi9cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3JvbGUnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHJvbGUsXG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSB1c2VySWRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuUGFydGljaXBhbnRcbiAgICAgKiBAZGVzYyBUaGUgdXNlciBJRCBvZiB0aGUgcGFydGljaXBhbnQuIEl0IGNhbiBiZSBpbnRlZ3JhdGVkIGludG8gZXhpc3RpbmcgYWNjb3VudCBtYW5hZ2VtZW50IHN5c3RlbS5cbiAgICAgKi9cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3VzZXJJZCcsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogdXNlcklkLFxuICAgIH0pO1xuICB9XG59XG4iLCIvLyBDb3B5cmlnaHQgKEMpIDwyMDE4PiBJbnRlbCBDb3Jwb3JhdGlvblxuLy9cbi8vIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG5cbi8qIGdsb2JhbCBpbywgUHJvbWlzZSAqL1xuaW1wb3J0IExvZ2dlciBmcm9tICcuLi9iYXNlL2xvZ2dlci5qcyc7XG5pbXBvcnQgKiBhcyBFdmVudE1vZHVsZSBmcm9tICcuLi9iYXNlL2V2ZW50LmpzJztcbmltcG9ydCB7Q29uZmVyZW5jZUVycm9yfSBmcm9tICcuL2Vycm9yLmpzJztcbmltcG9ydCB7QmFzZTY0fSBmcm9tICcuLi9iYXNlL2Jhc2U2NC5qcyc7XG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgcmVjb25uZWN0aW9uQXR0ZW1wdHMgPSAxMDtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbmZ1bmN0aW9uIGhhbmRsZVJlc3BvbnNlKHN0YXR1cywgZGF0YSwgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gIGlmIChzdGF0dXMgPT09ICdvaycgfHwgc3RhdHVzID09PSAnc3VjY2VzcycpIHtcbiAgICByZXNvbHZlKGRhdGEpO1xuICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gJ2Vycm9yJykge1xuICAgIHJlamVjdChkYXRhKTtcbiAgfSBlbHNlIHtcbiAgICBMb2dnZXIuZXJyb3IoJ01DVSByZXR1cm5zIHVua25vd24gYWNrLicpO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFNpb1NpZ25hbGluZ1xuICogQGNsYXNzZGVzYyBTb2NrZXQuSU8gc2lnbmFsaW5nIGNoYW5uZWwgZm9yIENvbmZlcmVuY2VDbGllbnQuIEl0IGlzIG5vdCByZWNvbW1lbmRlZCB0byBkaXJlY3RseSBhY2Nlc3MgdGhpcyBjbGFzcy5cbiAqIEBtZW1iZXJvZiBPd3QuQ29uZmVyZW5jZVxuICogQGV4dGVuZHMgT3d0LkJhc2UuRXZlbnREaXNwYXRjaGVyXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFNpb1NpZ25hbGluZyBleHRlbmRzIEV2ZW50TW9kdWxlLkV2ZW50RGlzcGF0Y2hlciB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fc29ja2V0ID0gbnVsbDtcbiAgICB0aGlzLl9sb2dnZWRJbiA9IGZhbHNlO1xuICAgIHRoaXMuX3JlY29ubmVjdFRpbWVzID0gMDtcbiAgICB0aGlzLl9yZWNvbm5lY3Rpb25UaWNrZXQgPSBudWxsO1xuICAgIHRoaXMuX3JlZnJlc2hSZWNvbm5lY3Rpb25UaWNrZXQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBjb25uZWN0XG4gICAqIEBpbnN0YW5jZVxuICAgKiBAZGVzYyBDb25uZWN0IHRvIGEgcG9ydGFsLlxuICAgKiBAbWVtYmVyb2YgT21zLkNvbmZlcmVuY2UuU2lvU2lnbmFsaW5nXG4gICAqIEByZXR1cm4ge1Byb21pc2U8T2JqZWN0LCBFcnJvcj59IFJldHVybiBhIHByb21pc2UgcmVzb2x2ZWQgd2l0aCB0aGUgZGF0YSByZXR1cm5lZCBieSBwb3J0YWwgaWYgc3VjY2Vzc2Z1bGx5IGxvZ2dlZCBpbi4gT3IgcmV0dXJuIGEgcHJvbWlzZSByZWplY3RlZCB3aXRoIGEgbmV3bHkgY3JlYXRlZCBPbXMuRXJyb3IgaWYgZmFpbGVkLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaG9zdCBIb3N0IG9mIHRoZSBwb3J0YWwuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpc1NlY3VyZWQgSXMgc2VjdXJlIGNvbm5lY3Rpb24gb3Igbm90LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9naW5JbmZvIEluZm9tYXRpb24gcmVxdWlyZWQgZm9yIGxvZ2dpbmcgaW4uXG4gICAqIEBwcml2YXRlLlxuICAgKi9cbiAgY29ubmVjdChob3N0LCBpc1NlY3VyZWQsIGxvZ2luSW5mbykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBvcHRzID0ge1xuICAgICAgICAncmVjb25uZWN0aW9uJzogdHJ1ZSxcbiAgICAgICAgJ3JlY29ubmVjdGlvbkF0dGVtcHRzJzogcmVjb25uZWN0aW9uQXR0ZW1wdHMsXG4gICAgICAgICdmb3JjZSBuZXcgY29ubmVjdGlvbic6IHRydWUsXG4gICAgICB9O1xuICAgICAgdGhpcy5fc29ja2V0ID0gaW8oaG9zdCwgb3B0cyk7XG4gICAgICBbJ3BhcnRpY2lwYW50JywgJ3RleHQnLCAnc3RyZWFtJywgJ3Byb2dyZXNzJ10uZm9yRWFjaCgoXG4gICAgICAgICAgbm90aWZpY2F0aW9uKSA9PiB7XG4gICAgICAgIHRoaXMuX3NvY2tldC5vbihub3RpZmljYXRpb24sIChkYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudE1vZHVsZS5NZXNzYWdlRXZlbnQoJ2RhdGEnLCB7XG4gICAgICAgICAgICBtZXNzYWdlOiB7XG4gICAgICAgICAgICAgIG5vdGlmaWNhdGlvbjogbm90aWZpY2F0aW9uLFxuICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9zb2NrZXQub24oJ3JlY29ubmVjdGluZycsICgpID0+IHtcbiAgICAgICAgdGhpcy5fcmVjb25uZWN0VGltZXMrKztcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fc29ja2V0Lm9uKCdyZWNvbm5lY3RfZmFpbGVkJywgKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fcmVjb25uZWN0VGltZXMgPj0gcmVjb25uZWN0aW9uQXR0ZW1wdHMpIHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50TW9kdWxlLk93dEV2ZW50KCdkaXNjb25uZWN0JykpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3NvY2tldC5vbignY29ubmVjdF9lcnJvcicsIChlKSA9PiB7XG4gICAgICAgIHJlamVjdChgY29ubmVjdF9lcnJvcjoke2hvc3R9YCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3NvY2tldC5vbignZHJvcCcsICgpID0+IHtcbiAgICAgICAgdGhpcy5fcmVjb25uZWN0VGltZXMgPSByZWNvbm5lY3Rpb25BdHRlbXB0cztcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fc29ja2V0Lm9uKCdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgICAgICB0aGlzLl9jbGVhclJlY29ubmVjdGlvblRhc2soKTtcbiAgICAgICAgaWYgKHRoaXMuX3JlY29ubmVjdFRpbWVzID49IHJlY29ubmVjdGlvbkF0dGVtcHRzKSB7XG4gICAgICAgICAgdGhpcy5fbG9nZ2VkSW4gPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50TW9kdWxlLk93dEV2ZW50KCdkaXNjb25uZWN0JykpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3NvY2tldC5lbWl0KCdsb2dpbicsIGxvZ2luSW5mbywgKHN0YXR1cywgZGF0YSkgPT4ge1xuICAgICAgICBpZiAoc3RhdHVzID09PSAnb2snKSB7XG4gICAgICAgICAgdGhpcy5fbG9nZ2VkSW4gPSB0cnVlO1xuICAgICAgICAgIHRoaXMuX29uUmVjb25uZWN0aW9uVGlja2V0KGRhdGEucmVjb25uZWN0aW9uVGlja2V0KTtcbiAgICAgICAgICB0aGlzLl9zb2NrZXQub24oJ2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAgICAgICAvLyByZS1sb2dpbiB3aXRoIHJlY29ubmVjdGlvbiB0aWNrZXQuXG4gICAgICAgICAgICB0aGlzLl9zb2NrZXQuZW1pdCgncmVsb2dpbicsIHRoaXMuX3JlY29ubmVjdGlvblRpY2tldCwgKHN0YXR1cyxcbiAgICAgICAgICAgICAgICBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChzdGF0dXMgPT09ICdvaycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWNvbm5lY3RUaW1lcyA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25SZWNvbm5lY3Rpb25UaWNrZXQoZGF0YSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudE1vZHVsZS5Pd3RFdmVudCgnZGlzY29ubmVjdCcpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaGFuZGxlUmVzcG9uc2Uoc3RhdHVzLCBkYXRhLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGZ1bmN0aW9uIGRpc2Nvbm5lY3RcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIERpc2Nvbm5lY3QgZnJvbSBhIHBvcnRhbC5cbiAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLlNpb1NpZ25hbGluZ1xuICAgKiBAcmV0dXJuIHtQcm9taXNlPE9iamVjdCwgRXJyb3I+fSBSZXR1cm4gYSBwcm9taXNlIHJlc29sdmVkIHdpdGggdGhlIGRhdGEgcmV0dXJuZWQgYnkgcG9ydGFsIGlmIHN1Y2Nlc3NmdWxseSBkaXNjb25uZWN0ZWQuIE9yIHJldHVybiBhIHByb21pc2UgcmVqZWN0ZWQgd2l0aCBhIG5ld2x5IGNyZWF0ZWQgT21zLkVycm9yIGlmIGZhaWxlZC5cbiAgICogQHByaXZhdGUuXG4gICAqL1xuICBkaXNjb25uZWN0KCkge1xuICAgIGlmICghdGhpcy5fc29ja2V0IHx8IHRoaXMuX3NvY2tldC5kaXNjb25uZWN0ZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgQ29uZmVyZW5jZUVycm9yKFxuICAgICAgICAgICdQb3J0YWwgaXMgbm90IGNvbm5lY3RlZC4nKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLl9zb2NrZXQuZW1pdCgnbG9nb3V0JywgKHN0YXR1cywgZGF0YSkgPT4ge1xuICAgICAgICAvLyBNYXhpbWl6ZSB0aGUgcmVjb25uZWN0IHRpbWVzIHRvIGRpc2FibGUgcmVjb25uZWN0aW9uLlxuICAgICAgICB0aGlzLl9yZWNvbm5lY3RUaW1lcyA9IHJlY29ubmVjdGlvbkF0dGVtcHRzO1xuICAgICAgICB0aGlzLl9zb2NrZXQuZGlzY29ubmVjdCgpO1xuICAgICAgICBoYW5kbGVSZXNwb25zZShzdGF0dXMsIGRhdGEsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gc2VuZFxuICAgKiBAaW5zdGFuY2VcbiAgICogQGRlc2MgU2VuZCBkYXRhIHRvIHBvcnRhbC5cbiAgICogQG1lbWJlcm9mIE9tcy5Db25mZXJlbmNlLlNpb1NpZ25hbGluZ1xuICAgKiBAcmV0dXJuIHtQcm9taXNlPE9iamVjdCwgRXJyb3I+fSBSZXR1cm4gYSBwcm9taXNlIHJlc29sdmVkIHdpdGggdGhlIGRhdGEgcmV0dXJuZWQgYnkgcG9ydGFsLiBPciByZXR1cm4gYSBwcm9taXNlIHJlamVjdGVkIHdpdGggYSBuZXdseSBjcmVhdGVkIE9tcy5FcnJvciBpZiBmYWlsZWQgdG8gc2VuZCB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3ROYW1lIE5hbWUgZGVmaW5lZCBpbiBjbGllbnQtc2VydmVyIHByb3RvY29sLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVxdWVzdERhdGEgRGF0YSBmb3JtYXQgaXMgZGVmaW5lZCBpbiBjbGllbnQtc2VydmVyIHByb3RvY29sLlxuICAgKiBAcHJpdmF0ZS5cbiAgICovXG4gIHNlbmQocmVxdWVzdE5hbWUsIHJlcXVlc3REYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuX3NvY2tldC5lbWl0KHJlcXVlc3ROYW1lLCByZXF1ZXN0RGF0YSwgKHN0YXR1cywgZGF0YSkgPT4ge1xuICAgICAgICBoYW5kbGVSZXNwb25zZShzdGF0dXMsIGRhdGEsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gX29uUmVjb25uZWN0aW9uVGlja2V0XG4gICAqIEBpbnN0YW5jZVxuICAgKiBAZGVzYyBQYXJzZSByZWNvbm5lY3Rpb24gdGlja2V0IGFuZCBzY2hlZHVsZSB0aWNrZXQgcmVmcmVzaGluZy5cbiAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlNpb1NpZ25hbGluZ1xuICAgKiBAcHJpdmF0ZS5cbiAgICovXG4gIF9vblJlY29ubmVjdGlvblRpY2tldCh0aWNrZXRTdHJpbmcpIHtcbiAgICB0aGlzLl9yZWNvbm5lY3Rpb25UaWNrZXQgPSB0aWNrZXRTdHJpbmc7XG4gICAgY29uc3QgdGlja2V0ID0gSlNPTi5wYXJzZShCYXNlNjQuZGVjb2RlQmFzZTY0KHRpY2tldFN0cmluZykpO1xuICAgIC8vIFJlZnJlc2ggdGlja2V0IDEgbWluIG9yIDEwIHNlY29uZHMgYmVmb3JlIGl0IGV4cGlyZXMuXG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCBtaWxsaXNlY29uZHNJbk9uZU1pbnV0ZSA9IDYwICogMTAwMDtcbiAgICBjb25zdCBtaWxsaXNlY29uZHNJblRlblNlY29uZHMgPSAxMCAqIDEwMDA7XG4gICAgaWYgKHRpY2tldC5ub3RBZnRlciA8PSBub3cgLSBtaWxsaXNlY29uZHNJblRlblNlY29uZHMpIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdSZWNvbm5lY3Rpb24gdGlja2V0IGV4cGlyZXMgdG9vIHNvb24uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCByZWZyZXNoQWZ0ZXIgPSB0aWNrZXQubm90QWZ0ZXIgLSBub3cgLSBtaWxsaXNlY29uZHNJbk9uZU1pbnV0ZTtcbiAgICBpZiAocmVmcmVzaEFmdGVyIDwgMCkge1xuICAgICAgcmVmcmVzaEFmdGVyID0gdGlja2V0Lm5vdEFmdGVyIC0gbm93IC0gbWlsbGlzZWNvbmRzSW5UZW5TZWNvbmRzO1xuICAgIH1cbiAgICB0aGlzLl9jbGVhclJlY29ubmVjdGlvblRhc2soKTtcbiAgICB0aGlzLl9yZWZyZXNoUmVjb25uZWN0aW9uVGlja2V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLl9zb2NrZXQuZW1pdCgncmVmcmVzaFJlY29ubmVjdGlvblRpY2tldCcsIChzdGF0dXMsIGRhdGEpID0+IHtcbiAgICAgICAgaWYgKHN0YXR1cyAhPT0gJ29rJykge1xuICAgICAgICAgIExvZ2dlci53YXJuaW5nKCdGYWlsZWQgdG8gcmVmcmVzaCByZWNvbm5lY3Rpb24gdGlja2V0LicpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9vblJlY29ubmVjdGlvblRpY2tldChkYXRhKTtcbiAgICAgIH0pO1xuICAgIH0sIHJlZnJlc2hBZnRlcik7XG4gIH1cblxuICBfY2xlYXJSZWNvbm5lY3Rpb25UYXNrKCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLl9yZWZyZXNoUmVjb25uZWN0aW9uVGlja2V0KTtcbiAgICB0aGlzLl9yZWZyZXNoUmVjb25uZWN0aW9uVGlja2V0ID0gbnVsbDtcbiAgfVxufVxuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4vLyBUaGlzIGZpbGUgZG9lc24ndCBoYXZlIHB1YmxpYyBBUElzLlxuLyogZXNsaW50LWRpc2FibGUgdmFsaWQtanNkb2MgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgKiBhcyBQdWJsaWNhdGlvbk1vZHVsZSBmcm9tICcuLi9iYXNlL3B1YmxpY2F0aW9uLmpzJztcbmltcG9ydCAqIGFzIE1lZGlhRm9ybWF0TW9kdWxlIGZyb20gJy4uL2Jhc2UvbWVkaWFmb3JtYXQuanMnO1xuaW1wb3J0ICogYXMgQ29kZWNNb2R1bGUgZnJvbSAnLi4vYmFzZS9jb2RlYy5qcyc7XG5pbXBvcnQgKiBhcyBTdWJzY3JpcHRpb25Nb2R1bGUgZnJvbSAnLi9zdWJzY3JpcHRpb24uanMnO1xuXG5cbi8qKlxuICogQGZ1bmN0aW9uIGV4dHJhY3RCaXRyYXRlTXVsdGlwbGllclxuICogQGRlc2MgRXh0cmFjdCBiaXRyYXRlIG11bHRpcGxpZXIgZnJvbSBhIHN0cmluZyBsaWtlIFwieDAuMlwiLlxuICogQHJldHVybiB7UHJvbWlzZTxPYmplY3QsIEVycm9yPn0gVGhlIGZsb2F0IG51bWJlciBhZnRlciBcInhcIi5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3RCaXRyYXRlTXVsdGlwbGllcihpbnB1dCkge1xuICBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJyB8fCAhaW5wdXQuc3RhcnRzV2l0aCgneCcpKSB7XG4gICAgTC5Mb2dnZXIud2FybmluZygnSW52YWxpZCBiaXRyYXRlIG11bHRpcGxpZXIgaW5wdXQuJyk7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgcmV0dXJuIE51bWJlci5wYXJzZUZsb2F0KGlucHV0LnJlcGxhY2UoL154LywgJycpKTtcbn1cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbmZ1bmN0aW9uIHNvcnROdW1iZXJzKHgsIHkpIHtcbiAgcmV0dXJuIHggLSB5O1xufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuZnVuY3Rpb24gc29ydFJlc29sdXRpb25zKHgsIHkpIHtcbiAgaWYgKHgud2lkdGggIT09IHkud2lkdGgpIHtcbiAgICByZXR1cm4geC53aWR0aCAtIHkud2lkdGg7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHguaGVpZ2h0IC0geS5oZWlnaHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBAZnVuY3Rpb24gY29udmVydFRvUHVibGljYXRpb25TZXR0aW5nc1xuICogQGRlc2MgQ29udmVydCBtZWRpYUluZm8gcmVjZWl2ZWQgZnJvbSBzZXJ2ZXIgdG8gUHVibGljYXRpb25TZXR0aW5ncy5cbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0VG9QdWJsaWNhdGlvblNldHRpbmdzKG1lZGlhSW5mbykge1xuICBsZXQgYXVkaW87XG4gIGxldCBhdWRpb0NvZGVjO1xuICBsZXQgdmlkZW87XG4gIGxldCB2aWRlb0NvZGVjO1xuICBsZXQgcmVzb2x1dGlvbjtcbiAgbGV0IGZyYW1lcmF0ZTtcbiAgbGV0IGJpdHJhdGU7XG4gIGxldCBrZXlGcmFtZUludGVydmFsO1xuICBpZiAobWVkaWFJbmZvLmF1ZGlvKSB7XG4gICAgaWYgKG1lZGlhSW5mby5hdWRpby5mb3JtYXQpIHtcbiAgICAgIGF1ZGlvQ29kZWMgPSBuZXcgQ29kZWNNb2R1bGUuQXVkaW9Db2RlY1BhcmFtZXRlcnMoXG4gICAgICAgICAgbWVkaWFJbmZvLmF1ZGlvLmZvcm1hdC5jb2RlYywgbWVkaWFJbmZvLmF1ZGlvLmZvcm1hdC5jaGFubmVsTnVtLFxuICAgICAgICAgIG1lZGlhSW5mby5hdWRpby5mb3JtYXQuc2FtcGxlUmF0ZVxuICAgICAgKTtcbiAgICB9XG4gICAgYXVkaW8gPSBuZXcgUHVibGljYXRpb25Nb2R1bGUuQXVkaW9QdWJsaWNhdGlvblNldHRpbmdzKGF1ZGlvQ29kZWMpO1xuICB9XG4gIGlmIChtZWRpYUluZm8udmlkZW8pIHtcbiAgICBpZiAobWVkaWFJbmZvLnZpZGVvLmZvcm1hdCkge1xuICAgICAgdmlkZW9Db2RlYyA9IG5ldyBDb2RlY01vZHVsZS5WaWRlb0NvZGVjUGFyYW1ldGVycyhcbiAgICAgICAgICBtZWRpYUluZm8udmlkZW8uZm9ybWF0LmNvZGVjLCBtZWRpYUluZm8udmlkZW8uZm9ybWF0LnByb2ZpbGUpO1xuICAgIH1cbiAgICBpZiAobWVkaWFJbmZvLnZpZGVvLnBhcmFtZXRlcnMpIHtcbiAgICAgIGlmIChtZWRpYUluZm8udmlkZW8ucGFyYW1ldGVycy5yZXNvbHV0aW9uKSB7XG4gICAgICAgIHJlc29sdXRpb24gPSBuZXcgTWVkaWFGb3JtYXRNb2R1bGUuUmVzb2x1dGlvbihcbiAgICAgICAgICAgIG1lZGlhSW5mby52aWRlby5wYXJhbWV0ZXJzLnJlc29sdXRpb24ud2lkdGgsXG4gICAgICAgICAgICBtZWRpYUluZm8udmlkZW8ucGFyYW1ldGVycy5yZXNvbHV0aW9uLmhlaWdodCk7XG4gICAgICB9XG4gICAgICBmcmFtZXJhdGUgPSBtZWRpYUluZm8udmlkZW8ucGFyYW1ldGVycy5mcmFtZXJhdGU7XG4gICAgICBiaXRyYXRlID0gbWVkaWFJbmZvLnZpZGVvLnBhcmFtZXRlcnMuYml0cmF0ZSAqIDEwMDA7XG4gICAgICBrZXlGcmFtZUludGVydmFsID0gbWVkaWFJbmZvLnZpZGVvLnBhcmFtZXRlcnMua2V5RnJhbWVJbnRlcnZhbDtcbiAgICB9XG4gICAgdmlkZW8gPSBuZXcgUHVibGljYXRpb25Nb2R1bGUuVmlkZW9QdWJsaWNhdGlvblNldHRpbmdzKHZpZGVvQ29kZWMsXG4gICAgICAgIHJlc29sdXRpb24sIGZyYW1lcmF0ZSwgYml0cmF0ZSwga2V5RnJhbWVJbnRlcnZhbFxuICAgICk7XG4gIH1cbiAgcmV0dXJuIG5ldyBQdWJsaWNhdGlvbk1vZHVsZS5QdWJsaWNhdGlvblNldHRpbmdzKGF1ZGlvLCB2aWRlbyk7XG59XG5cbi8qKlxuICogQGZ1bmN0aW9uIGNvbnZlcnRUb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllc1xuICogQGRlc2MgQ29udmVydCBtZWRpYUluZm8gcmVjZWl2ZWQgZnJvbSBzZXJ2ZXIgdG8gU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzLlxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRUb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyhtZWRpYUluZm8pIHtcbiAgbGV0IGF1ZGlvOyBsZXQgdmlkZW87XG4gIGlmIChtZWRpYUluZm8uYXVkaW8pIHtcbiAgICBjb25zdCBhdWRpb0NvZGVjcyA9IFtdO1xuICAgIGlmIChtZWRpYUluZm8uYXVkaW8gJiYgbWVkaWFJbmZvLmF1ZGlvLmZvcm1hdCkge1xuICAgICAgYXVkaW9Db2RlY3MucHVzaChuZXcgQ29kZWNNb2R1bGUuQXVkaW9Db2RlY1BhcmFtZXRlcnMoXG4gICAgICAgICAgbWVkaWFJbmZvLmF1ZGlvLmZvcm1hdC5jb2RlYywgbWVkaWFJbmZvLmF1ZGlvLmZvcm1hdC5jaGFubmVsTnVtLFxuICAgICAgICAgIG1lZGlhSW5mby5hdWRpby5mb3JtYXQuc2FtcGxlUmF0ZSkpO1xuICAgIH1cbiAgICBpZiAobWVkaWFJbmZvLmF1ZGlvICYmIG1lZGlhSW5mby5hdWRpby5vcHRpb25hbCAmJlxuICAgICAgbWVkaWFJbmZvLmF1ZGlvLm9wdGlvbmFsLmZvcm1hdCkge1xuICAgICAgZm9yIChjb25zdCBhdWRpb0NvZGVjSW5mbyBvZiBtZWRpYUluZm8uYXVkaW8ub3B0aW9uYWwuZm9ybWF0KSB7XG4gICAgICAgIGNvbnN0IGF1ZGlvQ29kZWMgPSBuZXcgQ29kZWNNb2R1bGUuQXVkaW9Db2RlY1BhcmFtZXRlcnMoXG4gICAgICAgICAgICBhdWRpb0NvZGVjSW5mby5jb2RlYywgYXVkaW9Db2RlY0luZm8uY2hhbm5lbE51bSxcbiAgICAgICAgICAgIGF1ZGlvQ29kZWNJbmZvLnNhbXBsZVJhdGUpO1xuICAgICAgICBhdWRpb0NvZGVjcy5wdXNoKGF1ZGlvQ29kZWMpO1xuICAgICAgfVxuICAgIH1cbiAgICBhdWRpb0NvZGVjcy5zb3J0KCk7XG4gICAgYXVkaW8gPSBuZXcgU3Vic2NyaXB0aW9uTW9kdWxlLkF1ZGlvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzKGF1ZGlvQ29kZWNzKTtcbiAgfVxuICBpZiAobWVkaWFJbmZvLnZpZGVvKSB7XG4gICAgY29uc3QgdmlkZW9Db2RlY3MgPSBbXTtcbiAgICBpZiAobWVkaWFJbmZvLnZpZGVvICYmIG1lZGlhSW5mby52aWRlby5mb3JtYXQpIHtcbiAgICAgIHZpZGVvQ29kZWNzLnB1c2gobmV3IENvZGVjTW9kdWxlLlZpZGVvQ29kZWNQYXJhbWV0ZXJzKFxuICAgICAgICAgIG1lZGlhSW5mby52aWRlby5mb3JtYXQuY29kZWMsIG1lZGlhSW5mby52aWRlby5mb3JtYXQucHJvZmlsZSkpO1xuICAgIH1cbiAgICBpZiAobWVkaWFJbmZvLnZpZGVvICYmIG1lZGlhSW5mby52aWRlby5vcHRpb25hbCAmJlxuICAgICAgbWVkaWFJbmZvLnZpZGVvLm9wdGlvbmFsLmZvcm1hdCkge1xuICAgICAgZm9yIChjb25zdCB2aWRlb0NvZGVjSW5mbyBvZiBtZWRpYUluZm8udmlkZW8ub3B0aW9uYWwuZm9ybWF0KSB7XG4gICAgICAgIGNvbnN0IHZpZGVvQ29kZWMgPSBuZXcgQ29kZWNNb2R1bGUuVmlkZW9Db2RlY1BhcmFtZXRlcnMoXG4gICAgICAgICAgICB2aWRlb0NvZGVjSW5mby5jb2RlYywgdmlkZW9Db2RlY0luZm8ucHJvZmlsZSk7XG4gICAgICAgIHZpZGVvQ29kZWNzLnB1c2godmlkZW9Db2RlYyk7XG4gICAgICB9XG4gICAgfVxuICAgIHZpZGVvQ29kZWNzLnNvcnQoKTtcbiAgICBjb25zdCByZXNvbHV0aW9ucyA9IEFycmF5LmZyb20oXG4gICAgICAgIG1lZGlhSW5mby52aWRlby5vcHRpb25hbC5wYXJhbWV0ZXJzLnJlc29sdXRpb24sXG4gICAgICAgIChyKSA9PiBuZXcgTWVkaWFGb3JtYXRNb2R1bGUuUmVzb2x1dGlvbihyLndpZHRoLCByLmhlaWdodCkpO1xuICAgIGlmIChtZWRpYUluZm8udmlkZW8gJiYgbWVkaWFJbmZvLnZpZGVvLnBhcmFtZXRlcnMgJiZcbiAgICAgIG1lZGlhSW5mby52aWRlby5wYXJhbWV0ZXJzLnJlc29sdXRpb24pIHtcbiAgICAgIHJlc29sdXRpb25zLnB1c2gobmV3IE1lZGlhRm9ybWF0TW9kdWxlLlJlc29sdXRpb24oXG4gICAgICAgICAgbWVkaWFJbmZvLnZpZGVvLnBhcmFtZXRlcnMucmVzb2x1dGlvbi53aWR0aCxcbiAgICAgICAgICBtZWRpYUluZm8udmlkZW8ucGFyYW1ldGVycy5yZXNvbHV0aW9uLmhlaWdodCkpO1xuICAgIH1cbiAgICByZXNvbHV0aW9ucy5zb3J0KHNvcnRSZXNvbHV0aW9ucyk7XG4gICAgY29uc3QgYml0cmF0ZXMgPSBBcnJheS5mcm9tKFxuICAgICAgICBtZWRpYUluZm8udmlkZW8ub3B0aW9uYWwucGFyYW1ldGVycy5iaXRyYXRlLFxuICAgICAgICAoYml0cmF0ZSkgPT4gZXh0cmFjdEJpdHJhdGVNdWx0aXBsaWVyKGJpdHJhdGUpKTtcbiAgICBiaXRyYXRlcy5wdXNoKDEuMCk7XG4gICAgYml0cmF0ZXMuc29ydChzb3J0TnVtYmVycyk7XG4gICAgY29uc3QgZnJhbWVSYXRlcyA9IEpTT04ucGFyc2UoXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KG1lZGlhSW5mby52aWRlby5vcHRpb25hbC5wYXJhbWV0ZXJzLmZyYW1lcmF0ZSkpO1xuICAgIGlmIChtZWRpYUluZm8udmlkZW8gJiYgbWVkaWFJbmZvLnZpZGVvLnBhcmFtZXRlcnMgJiZcbiAgICAgICAgbWVkaWFJbmZvLnZpZGVvLnBhcmFtZXRlcnMuZnJhbWVyYXRlKSB7XG4gICAgICBmcmFtZVJhdGVzLnB1c2gobWVkaWFJbmZvLnZpZGVvLnBhcmFtZXRlcnMuZnJhbWVyYXRlKTtcbiAgICB9XG4gICAgZnJhbWVSYXRlcy5zb3J0KHNvcnROdW1iZXJzKTtcbiAgICBjb25zdCBrZXlGcmFtZUludGVydmFscyA9IEpTT04ucGFyc2UoXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KG1lZGlhSW5mby52aWRlby5vcHRpb25hbC5wYXJhbWV0ZXJzLmtleUZyYW1lSW50ZXJ2YWwpKTtcbiAgICBpZiAobWVkaWFJbmZvLnZpZGVvICYmIG1lZGlhSW5mby52aWRlby5wYXJhbWV0ZXJzICYmXG4gICAgICAgIG1lZGlhSW5mby52aWRlby5wYXJhbWV0ZXJzLmtleUZyYW1lSW50ZXJ2YWwpIHtcbiAgICAgIGtleUZyYW1lSW50ZXJ2YWxzLnB1c2gobWVkaWFJbmZvLnZpZGVvLnBhcmFtZXRlcnMua2V5RnJhbWVJbnRlcnZhbCk7XG4gICAgfVxuICAgIGtleUZyYW1lSW50ZXJ2YWxzLnNvcnQoc29ydE51bWJlcnMpO1xuICAgIHZpZGVvID0gbmV3IFN1YnNjcmlwdGlvbk1vZHVsZS5WaWRlb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyhcbiAgICAgICAgdmlkZW9Db2RlY3MsIHJlc29sdXRpb25zLCBmcmFtZVJhdGVzLCBiaXRyYXRlcywga2V5RnJhbWVJbnRlcnZhbHMpO1xuICB9XG4gIHJldHVybiBuZXcgU3Vic2NyaXB0aW9uTW9kdWxlLlN1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyhhdWRpbywgdmlkZW8pO1xufVxuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCAqIGFzIE1lZGlhRm9ybWF0TW9kdWxlIGZyb20gJy4uL2Jhc2UvbWVkaWFmb3JtYXQuanMnO1xuaW1wb3J0ICogYXMgQ29kZWNNb2R1bGUgZnJvbSAnLi4vYmFzZS9jb2RlYy5qcyc7XG5pbXBvcnQge0V2ZW50RGlzcGF0Y2hlcn0gZnJvbSAnLi4vYmFzZS9ldmVudC5qcyc7XG5cbi8qKlxuICogQGNsYXNzIEF1ZGlvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gKiBAbWVtYmVyT2YgT3d0LkNvbmZlcmVuY2VcbiAqIEBjbGFzc0Rlc2MgUmVwcmVzZW50cyB0aGUgYXVkaW8gY2FwYWJpbGl0eSBmb3Igc3Vic2NyaXB0aW9uLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgQXVkaW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3Rvcihjb2RlY3MpIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtBcnJheS48T3d0LkJhc2UuQXVkaW9Db2RlY1BhcmFtZXRlcnM+fSBjb2RlY3NcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuQXVkaW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXNcbiAgICAgKi9cbiAgICB0aGlzLmNvZGVjcyA9IGNvZGVjcztcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBWaWRlb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllc1xuICogQG1lbWJlck9mIE93dC5Db25mZXJlbmNlXG4gKiBAY2xhc3NEZXNjIFJlcHJlc2VudHMgdGhlIHZpZGVvIGNhcGFiaWxpdHkgZm9yIHN1YnNjcmlwdGlvbi5cbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgY29uc3RydWN0b3IoY29kZWNzLCByZXNvbHV0aW9ucywgZnJhbWVSYXRlcywgYml0cmF0ZU11bHRpcGxpZXJzLFxuICAgICAga2V5RnJhbWVJbnRlcnZhbHMpIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtBcnJheS48T3d0LkJhc2UuVmlkZW9Db2RlY1BhcmFtZXRlcnM+fSBjb2RlY3NcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXNcbiAgICAgKi9cbiAgICB0aGlzLmNvZGVjcyA9IGNvZGVjcztcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtBcnJheS48T3d0LkJhc2UuUmVzb2x1dGlvbj59IHJlc29sdXRpb25zXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5yZXNvbHV0aW9ucyA9IHJlc29sdXRpb25zO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge0FycmF5LjxudW1iZXI+fSBmcmFtZVJhdGVzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5mcmFtZVJhdGVzID0gZnJhbWVSYXRlcztcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtBcnJheS48bnVtYmVyPn0gYml0cmF0ZU11bHRpcGxpZXJzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5iaXRyYXRlTXVsdGlwbGllcnMgPSBiaXRyYXRlTXVsdGlwbGllcnM7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7QXJyYXkuPG51bWJlcj59IGtleUZyYW1lSW50ZXJ2YWxzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5rZXlGcmFtZUludGVydmFscyA9IGtleUZyYW1lSW50ZXJ2YWxzO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFN1YnNjcmlwdGlvbkNhcGFiaWxpdGllc1xuICogQG1lbWJlck9mIE93dC5Db25mZXJlbmNlXG4gKiBAY2xhc3NEZXNjIFJlcHJlc2VudHMgdGhlIGNhcGFiaWxpdHkgZm9yIHN1YnNjcmlwdGlvbi5cbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFN1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKGF1ZGlvLCB2aWRlbykge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9Pd3QuQ29uZmVyZW5jZS5BdWRpb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllc30gYXVkaW9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy5hdWRpbyA9IGF1ZGlvO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9Pd3QuQ29uZmVyZW5jZS5WaWRlb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllc30gdmlkZW9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzXG4gICAgICovXG4gICAgdGhpcy52aWRlbyA9IHZpZGVvO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIEF1ZGlvU3Vic2NyaXB0aW9uQ29uc3RyYWludHNcbiAqIEBtZW1iZXJPZiBPd3QuQ29uZmVyZW5jZVxuICogQGNsYXNzRGVzYyBSZXByZXNlbnRzIHRoZSBhdWRpbyBjb25zdHJhaW50cyBmb3Igc3Vic2NyaXB0aW9uLlxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgQXVkaW9TdWJzY3JpcHRpb25Db25zdHJhaW50cyB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKGNvZGVjcykge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9BcnJheS48T3d0LkJhc2UuQXVkaW9Db2RlY1BhcmFtZXRlcnM+fSBjb2RlY3NcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuQXVkaW9TdWJzY3JpcHRpb25Db25zdHJhaW50c1xuICAgICAqIEBkZXNjIENvZGVjcyBhY2NlcHRlZC4gSWYgbm9uZSBvZiBgY29kZWNzYCBzdXBwb3J0ZWQgYnkgYm90aCBzaWRlcywgY29ubmVjdGlvbiBmYWlscy4gTGVhdmUgaXQgdW5kZWZpbmVkIHdpbGwgdXNlIGFsbCBwb3NzaWJsZSBjb2RlY3MuXG4gICAgICovXG4gICAgdGhpcy5jb2RlY3MgPSBjb2RlY3M7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgVmlkZW9TdWJzY3JpcHRpb25Db25zdHJhaW50c1xuICogQG1lbWJlck9mIE93dC5Db25mZXJlbmNlXG4gKiBAY2xhc3NEZXNjIFJlcHJlc2VudHMgdGhlIHZpZGVvIGNvbnN0cmFpbnRzIGZvciBzdWJzY3JpcHRpb24uXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBWaWRlb1N1YnNjcmlwdGlvbkNvbnN0cmFpbnRzIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgY29uc3RydWN0b3IoY29kZWNzLCByZXNvbHV0aW9uLCBmcmFtZVJhdGUsIGJpdHJhdGVNdWx0aXBsaWVyLFxuICAgICAga2V5RnJhbWVJbnRlcnZhbCkge1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9BcnJheS48T3d0LkJhc2UuVmlkZW9Db2RlY1BhcmFtZXRlcnM+fSBjb2RlY3NcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25Db25zdHJhaW50c1xuICAgICAqIEBkZXNjIENvZGVjcyBhY2NlcHRlZC4gSWYgbm9uZSBvZiBgY29kZWNzYCBzdXBwb3J0ZWQgYnkgYm90aCBzaWRlcywgY29ubmVjdGlvbiBmYWlscy4gTGVhdmUgaXQgdW5kZWZpbmVkIHdpbGwgdXNlIGFsbCBwb3NzaWJsZSBjb2RlY3MuXG4gICAgICovXG4gICAgdGhpcy5jb2RlY3MgPSBjb2RlY3M7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P093dC5CYXNlLlJlc29sdXRpb259IHJlc29sdXRpb25cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25Db25zdHJhaW50c1xuICAgICAqIEBkZXNjIE9ubHkgcmVzb2x1dGlvbnMgbGlzdGVkIGluIE93dC5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzIGFyZSBhbGxvd2VkLlxuICAgICAqL1xuICAgIHRoaXMucmVzb2x1dGlvbiA9IHJlc29sdXRpb247XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P251bWJlcn0gZnJhbWVSYXRlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ29uc3RyYWludHNcbiAgICAgKiBAZGVzYyBPbmx5IGZyYW1lUmF0ZXMgbGlzdGVkIGluIE93dC5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzIGFyZSBhbGxvd2VkLlxuICAgICAqL1xuICAgIHRoaXMuZnJhbWVSYXRlID0gZnJhbWVSYXRlO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9udW1iZXJ9IGJpdHJhdGVNdWx0aXBsaWVyXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ29uc3RyYWludHNcbiAgICAgKiBAZGVzYyBPbmx5IGJpdHJhdGVNdWx0aXBsaWVycyBsaXN0ZWQgaW4gT3d0LkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMgYXJlIGFsbG93ZWQuXG4gICAgICovXG4gICAgdGhpcy5iaXRyYXRlTXVsdGlwbGllciA9IGJpdHJhdGVNdWx0aXBsaWVyO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9udW1iZXJ9IGtleUZyYW1lSW50ZXJ2YWxcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25Db25zdHJhaW50c1xuICAgICAqIEBkZXNjIE9ubHkga2V5RnJhbWVJbnRlcnZhbHMgbGlzdGVkIGluIE93dC5Db25mZXJlbmNlLlZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzIGFyZSBhbGxvd2VkLlxuICAgICAqL1xuICAgIHRoaXMua2V5RnJhbWVJbnRlcnZhbCA9IGtleUZyYW1lSW50ZXJ2YWw7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgU3Vic2NyaWJlT3B0aW9uc1xuICogQG1lbWJlck9mIE93dC5Db25mZXJlbmNlXG4gKiBAY2xhc3NEZXNjIFN1YnNjcmliZU9wdGlvbnMgZGVmaW5lcyBvcHRpb25zIGZvciBzdWJzY3JpYmluZyBhIE93dC5CYXNlLlJlbW90ZVN0cmVhbS5cbiAqL1xuZXhwb3J0IGNsYXNzIFN1YnNjcmliZU9wdGlvbnMge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3RvcihhdWRpbywgdmlkZW8pIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/QXVkaW9TdWJzY3JpcHRpb25Db25zdHJhaW50c30gYXVkaW9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuU3Vic2NyaWJlT3B0aW9uc1xuICAgICAqL1xuICAgIHRoaXMuYXVkaW8gPSBhdWRpbztcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/VmlkZW9TdWJzY3JpcHRpb25Db25zdHJhaW50c30gdmlkZW9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuU3Vic2NyaWJlT3B0aW9uc1xuICAgICAqL1xuICAgIHRoaXMudmlkZW8gPSB2aWRlbztcbiAgfVxufVxuXG4vKipcbiAqIEBjbGFzcyBWaWRlb1N1YnNjcmlwdGlvblVwZGF0ZU9wdGlvbnNcbiAqIEBtZW1iZXJPZiBPd3QuQ29uZmVyZW5jZVxuICogQGNsYXNzRGVzYyBWaWRlb1N1YnNjcmlwdGlvblVwZGF0ZU9wdGlvbnMgZGVmaW5lcyBvcHRpb25zIGZvciB1cGRhdGluZyBhIHN1YnNjcmlwdGlvbidzIHZpZGVvIHBhcnQuXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBWaWRlb1N1YnNjcmlwdGlvblVwZGF0ZU9wdGlvbnMge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvY1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHs/T3d0LkJhc2UuUmVzb2x1dGlvbn0gcmVzb2x1dGlvblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQ29uZmVyZW5jZS5WaWRlb1N1YnNjcmlwdGlvblVwZGF0ZU9wdGlvbnNcbiAgICAgKiBAZGVzYyBPbmx5IHJlc29sdXRpb25zIGxpc3RlZCBpbiBWaWRlb1N1YnNjcmlwdGlvbkNhcGFiaWxpdGllcyBhcmUgYWxsb3dlZC5cbiAgICAgKi9cbiAgICB0aGlzLnJlc29sdXRpb24gPSB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P251bWJlcn0gZnJhbWVSYXRlc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQ29uZmVyZW5jZS5WaWRlb1N1YnNjcmlwdGlvblVwZGF0ZU9wdGlvbnNcbiAgICAgKiBAZGVzYyBPbmx5IGZyYW1lUmF0ZXMgbGlzdGVkIGluIFZpZGVvU3Vic2NyaXB0aW9uQ2FwYWJpbGl0aWVzIGFyZSBhbGxvd2VkLlxuICAgICAqL1xuICAgIHRoaXMuZnJhbWVSYXRlID0gdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgez9udW1iZXJ9IGJpdHJhdGVNdWx0aXBsaWVyc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBPd3QuQ29uZmVyZW5jZS5WaWRlb1N1YnNjcmlwdGlvblVwZGF0ZU9wdGlvbnNcbiAgICAgKiBAZGVzYyBPbmx5IGJpdHJhdGVNdWx0aXBsaWVycyBsaXN0ZWQgaW4gVmlkZW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMgYXJlIGFsbG93ZWQuXG4gICAgICovXG4gICAgdGhpcy5iaXRyYXRlTXVsdGlwbGllcnMgPSB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P251bWJlcn0ga2V5RnJhbWVJbnRlcnZhbHNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuVmlkZW9TdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zXG4gICAgICogQGRlc2MgT25seSBrZXlGcmFtZUludGVydmFscyBsaXN0ZWQgaW4gVmlkZW9TdWJzY3JpcHRpb25DYXBhYmlsaXRpZXMgYXJlIGFsbG93ZWQuXG4gICAgICovXG4gICAgdGhpcy5rZXlGcmFtZUludGVydmFsID0gdW5kZWZpbmVkO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIFN1YnNjcmlwdGlvblVwZGF0ZU9wdGlvbnNcbiAqIEBtZW1iZXJPZiBPd3QuQ29uZmVyZW5jZVxuICogQGNsYXNzRGVzYyBTdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zIGRlZmluZXMgb3B0aW9ucyBmb3IgdXBkYXRpbmcgYSBzdWJzY3JpcHRpb24uXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7P1ZpZGVvU3Vic2NyaXB0aW9uVXBkYXRlT3B0aW9uc30gdmlkZW9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuU3Vic2NyaXB0aW9uVXBkYXRlT3B0aW9uc1xuICAgICAqL1xuICAgIHRoaXMudmlkZW8gPSB1bmRlZmluZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgU3Vic2NyaXB0aW9uXG4gKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2VcbiAqIEBjbGFzc0Rlc2MgU3Vic2NyaXB0aW9uIGlzIGEgcmVjZWl2ZXIgZm9yIHJlY2VpdmluZyBhIHN0cmVhbS5cbiAqIEV2ZW50czpcbiAqXG4gKiB8IEV2ZW50IE5hbWUgICAgICB8IEFyZ3VtZW50IFR5cGUgICAgfCBGaXJlZCB3aGVuICAgICAgIHxcbiAqIHwgLS0tLS0tLS0tLS0tLS0tLXwgLS0tLS0tLS0tLS0tLS0tLSB8IC0tLS0tLS0tLS0tLS0tLS0gfFxuICogfCBlbmRlZCAgICAgICAgICAgfCBFdmVudCAgICAgICAgICAgIHwgU3Vic2NyaXB0aW9uIGlzIGVuZGVkLiB8XG4gKiB8IGVycm9yICAgICAgICAgICB8IEVycm9yRXZlbnQgICAgICAgfCBBbiBlcnJvciBvY2N1cnJlZCBvbiB0aGUgc3Vic2NyaXB0aW9uLiB8XG4gKiB8IG11dGUgICAgICAgICAgICB8IE11dGVFdmVudCAgICAgICAgfCBQdWJsaWNhdGlvbiBpcyBtdXRlZC4gUmVtb3RlIHNpZGUgc3RvcHBlZCBzZW5kaW5nIGF1ZGlvIGFuZC9vciB2aWRlbyBkYXRhLiB8XG4gKiB8IHVubXV0ZSAgICAgICAgICB8IE11dGVFdmVudCAgICAgICAgfCBQdWJsaWNhdGlvbiBpcyB1bm11dGVkLiBSZW1vdGUgc2lkZSBjb250aW51ZWQgc2VuZGluZyBhdWRpbyBhbmQvb3IgdmlkZW8gZGF0YS4gfFxuICpcbiAqIEBleHRlbmRzIE93dC5CYXNlLkV2ZW50RGlzcGF0Y2hlclxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgU3Vic2NyaXB0aW9uIGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2NcbiAgY29uc3RydWN0b3IoaWQsIHN0b3AsIGdldFN0YXRzLCBtdXRlLCB1bm11dGUsIGFwcGx5T3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG4gICAgaWYgKCFpZCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSUQgY2Fubm90IGJlIG51bGwgb3IgdW5kZWZpbmVkLicpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IGlkXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlN1YnNjcmlwdGlvblxuICAgICAqL1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnaWQnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IGlkLFxuICAgIH0pO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiBzdG9wXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgU3RvcCBjZXJ0YWluIHN1YnNjcmlwdGlvbi4gT25jZSBhIHN1YnNjcmlwdGlvbiBpcyBzdG9wcGVkLCBpdCBjYW5ub3QgYmUgcmVjb3ZlcmVkLlxuICAgICAqIEBtZW1iZXJvZiBPd3QuQ29uZmVyZW5jZS5TdWJzY3JpcHRpb25cbiAgICAgKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICAgICAqL1xuICAgIHRoaXMuc3RvcCA9IHN0b3A7XG4gICAgLyoqXG4gICAgICogQGZ1bmN0aW9uIGdldFN0YXRzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgR2V0IHN0YXRzIG9mIHVuZGVybHlpbmcgUGVlckNvbm5lY3Rpb24uXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlN1YnNjcmlwdGlvblxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPFJUQ1N0YXRzUmVwb3J0LCBFcnJvcj59XG4gICAgICovXG4gICAgdGhpcy5nZXRTdGF0cyA9IGdldFN0YXRzO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiBtdXRlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQGRlc2MgU3RvcCByZWV2aW5nIGRhdGEgZnJvbSByZW1vdGUgZW5kcG9pbnQuXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlN1YnNjcmlwdGlvblxuICAgICAqIEBwYXJhbSB7T3d0LkJhc2UuVHJhY2tLaW5kIH0ga2luZCBLaW5kIG9mIHRyYWNrcyB0byBiZSBtdXRlZC5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx1bmRlZmluZWQsIEVycm9yPn1cbiAgICAgKi9cbiAgICB0aGlzLm11dGUgPSBtdXRlO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiB1bm11dGVcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAZGVzYyBDb250aW51ZSByZWV2aW5nIGRhdGEgZnJvbSByZW1vdGUgZW5kcG9pbnQuXG4gICAgICogQG1lbWJlcm9mIE93dC5Db25mZXJlbmNlLlN1YnNjcmlwdGlvblxuICAgICAqIEBwYXJhbSB7T3d0LkJhc2UuVHJhY2tLaW5kIH0ga2luZCBLaW5kIG9mIHRyYWNrcyB0byBiZSB1bm11dGVkLlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHVuZGVmaW5lZCwgRXJyb3I+fVxuICAgICAqL1xuICAgIHRoaXMudW5tdXRlID0gdW5tdXRlO1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiBhcHBseU9wdGlvbnNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAZGVzYyBVcGRhdGUgc3Vic2NyaXB0aW9uIHdpdGggZ2l2ZW4gb3B0aW9ucy5cbiAgICAgKiBAbWVtYmVyb2YgT3d0LkNvbmZlcmVuY2UuU3Vic2NyaXB0aW9uXG4gICAgICogQHBhcmFtIHtPd3QuQ29uZmVyZW5jZS5TdWJzY3JpcHRpb25VcGRhdGVPcHRpb25zIH0gb3B0aW9ucyBTdWJzY3JpcHRpb24gdXBkYXRlIG9wdGlvbnMuXG4gICAgICogQHJldHVybnMge1Byb21pc2U8dW5kZWZpbmVkLCBFcnJvcj59XG4gICAgICovXG4gICAgdGhpcy5hcHBseU9wdGlvbnMgPSBhcHBseU9wdGlvbnM7XG4gIH1cbn1cbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgKiBhcyBiYXNlIGZyb20gJy4vYmFzZS9leHBvcnQuanMnO1xuaW1wb3J0ICogYXMgcDJwIGZyb20gJy4vcDJwL2V4cG9ydC5qcyc7XG5pbXBvcnQgKiBhcyBjb25mZXJlbmNlIGZyb20gJy4vY29uZmVyZW5jZS9leHBvcnQuanMnO1xuXG4vKipcbiAqIEJhc2Ugb2JqZWN0cyBmb3IgYm90aCBQMlAgYW5kIGNvbmZlcmVuY2UuXG4gKiBAbmFtZXNwYWNlIE93dC5CYXNlXG4gKi9cbmV4cG9ydCBjb25zdCBCYXNlID0gYmFzZTtcblxuLyoqXG4gKiBQMlAgV2ViUlRDIGNvbm5lY3Rpb25zLlxuICogQG5hbWVzcGFjZSBPd3QuUDJQXG4gKi9cbmV4cG9ydCBjb25zdCBQMlAgPSBwMnA7XG5cbi8qKlxuICogV2ViUlRDIGNvbm5lY3Rpb25zIHdpdGggY29uZmVyZW5jZSBzZXJ2ZXIuXG4gKiBAbmFtZXNwYWNlIE93dC5Db25mZXJlbmNlXG4gKi9cbmV4cG9ydCBjb25zdCBDb25mZXJlbmNlID0gY29uZmVyZW5jZTtcbiIsIi8vIENvcHlyaWdodCAoQykgPDIwMTg+IEludGVsIENvcnBvcmF0aW9uXG4vL1xuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcblxuJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgY29uc3QgZXJyb3JzID0ge1xuICAvLyAyMTAwLTI5OTkgZm9yIFAyUCBlcnJvcnNcbiAgLy8gMjEwMC0yMTk5IGZvciBjb25uZWN0aW9uIGVycm9yc1xuICAvLyAyMTAwLTIxMDkgZm9yIHNlcnZlciBlcnJvcnNcbiAgUDJQX0NPTk5fU0VSVkVSX1VOS05PV046IHtcbiAgICBjb2RlOiAyMTAwLFxuICAgIG1lc3NhZ2U6ICdTZXJ2ZXIgdW5rbm93biBlcnJvci4nLFxuICB9LFxuICBQMlBfQ09OTl9TRVJWRVJfVU5BVkFJTEFCTEU6IHtcbiAgICBjb2RlOiAyMTAxLFxuICAgIG1lc3NhZ2U6ICdTZXJ2ZXIgaXMgdW5hdmFsaWFibGUuJyxcbiAgfSxcbiAgUDJQX0NPTk5fU0VSVkVSX0JVU1k6IHtcbiAgICBjb2RlOiAyMTAyLFxuICAgIG1lc3NhZ2U6ICdTZXJ2ZXIgaXMgdG9vIGJ1c3kuJyxcbiAgfSxcbiAgUDJQX0NPTk5fU0VSVkVSX05PVF9TVVBQT1JURUQ6IHtcbiAgICBjb2RlOiAyMTAzLFxuICAgIG1lc3NhZ2U6ICdNZXRob2QgaGFzIG5vdCBiZWVuIHN1cHBvcnRlZCBieSBzZXJ2ZXIuJyxcbiAgfSxcbiAgLy8gMjExMC0yMTE5IGZvciBjbGllbnQgZXJyb3JzXG4gIFAyUF9DT05OX0NMSUVOVF9VTktOT1dOOiB7XG4gICAgY29kZTogMjExMCxcbiAgICBtZXNzYWdlOiAnQ2xpZW50IHVua25vd24gZXJyb3IuJyxcbiAgfSxcbiAgUDJQX0NPTk5fQ0xJRU5UX05PVF9JTklUSUFMSVpFRDoge1xuICAgIGNvZGU6IDIxMTEsXG4gICAgbWVzc2FnZTogJ0Nvbm5lY3Rpb24gaXMgbm90IGluaXRpYWxpemVkLicsXG4gIH0sXG4gIC8vIDIxMjAtMjEyOSBmb3IgYXV0aGVudGljYXRpb24gZXJyb3JzXG4gIFAyUF9DT05OX0FVVEhfVU5LTk9XTjoge1xuICAgIGNvZGU6IDIxMjAsXG4gICAgbWVzc2FnZTogJ0F1dGhlbnRpY2F0aW9uIHVua25vd24gZXJyb3IuJyxcbiAgfSxcbiAgUDJQX0NPTk5fQVVUSF9GQUlMRUQ6IHtcbiAgICBjb2RlOiAyMTIxLFxuICAgIG1lc3NhZ2U6ICdXcm9uZyB1c2VybmFtZSBvciB0b2tlbi4nLFxuICB9LFxuICAvLyAyMjAwLTIyOTkgZm9yIG1lc3NhZ2UgdHJhbnNwb3J0IGVycm9yc1xuICBQMlBfTUVTU0FHSU5HX1RBUkdFVF9VTlJFQUNIQUJMRToge1xuICAgIGNvZGU6IDIyMDEsXG4gICAgbWVzc2FnZTogJ1JlbW90ZSB1c2VyIGNhbm5vdCBiZSByZWFjaGVkLicsXG4gIH0sXG4gIFAyUF9DTElFTlRfREVOSUVEOiB7XG4gICAgY29kZTogMjIwMixcbiAgICBtZXNzYWdlOiAnVXNlciBpcyBkZW5pZWQuJyxcbiAgfSxcbiAgLy8gMjMwMS0yMzk5IGZvciBjaGF0IHJvb20gZXJyb3JzXG4gIC8vIDI0MDEtMjQ5OSBmb3IgY2xpZW50IGVycm9yc1xuICBQMlBfQ0xJRU5UX1VOS05PV046IHtcbiAgICBjb2RlOiAyNDAwLFxuICAgIG1lc3NhZ2U6ICdVbmtub3duIGVycm9ycy4nLFxuICB9LFxuICBQMlBfQ0xJRU5UX1VOU1VQUE9SVEVEX01FVEhPRDoge1xuICAgIGNvZGU6IDI0MDEsXG4gICAgbWVzc2FnZTogJ1RoaXMgbWV0aG9kIGlzIHVuc3VwcG9ydGVkIGluIGN1cnJlbnQgYnJvd3Nlci4nLFxuICB9LFxuICBQMlBfQ0xJRU5UX0lMTEVHQUxfQVJHVU1FTlQ6IHtcbiAgICBjb2RlOiAyNDAyLFxuICAgIG1lc3NhZ2U6ICdJbGxlZ2FsIGFyZ3VtZW50LicsXG4gIH0sXG4gIFAyUF9DTElFTlRfSU5WQUxJRF9TVEFURToge1xuICAgIGNvZGU6IDI0MDMsXG4gICAgbWVzc2FnZTogJ0ludmFsaWQgcGVlciBzdGF0ZS4nLFxuICB9LFxuICBQMlBfQ0xJRU5UX05PVF9BTExPV0VEOiB7XG4gICAgY29kZTogMjQwNCxcbiAgICBtZXNzYWdlOiAnUmVtb3RlIHVzZXIgaXMgbm90IGFsbG93ZWQuJyxcbiAgfSxcbiAgLy8gMjUwMS0yNTk5IGZvciBXZWJSVEMgZXJyb3MuXG4gIFAyUF9XRUJSVENfVU5LTk9XTjoge1xuICAgIGNvZGU6IDI1MDAsXG4gICAgbWVzc2FnZTogJ1dlYlJUQyBlcnJvci4nLFxuICB9LFxuICBQMlBfV0VCUlRDX1NEUDoge1xuICAgIGNvZGU6IDI1MDIsXG4gICAgbWVzc2FnZTogJ1NEUCBlcnJvci4nLFxuICB9LFxufTtcblxuLyoqXG4gKiBAZnVuY3Rpb24gZ2V0RXJyb3JCeUNvZGVcbiAqIEBkZXNjIEdldCBlcnJvciBvYmplY3QgYnkgZXJyb3IgY29kZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBlcnJvckNvZGUgRXJyb3IgY29kZS5cbiAqIEByZXR1cm4ge093dC5QMlAuRXJyb3J9IEVycm9yIG9iamVjdFxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEVycm9yQnlDb2RlKGVycm9yQ29kZSkge1xuICBjb25zdCBjb2RlRXJyb3JNYXAgPSB7XG4gICAgMjEwMDogZXJyb3JzLlAyUF9DT05OX1NFUlZFUl9VTktOT1dOLFxuICAgIDIxMDE6IGVycm9ycy5QMlBfQ09OTl9TRVJWRVJfVU5BVkFJTEFCTEUsXG4gICAgMjEwMjogZXJyb3JzLlAyUF9DT05OX1NFUlZFUl9CVVNZLFxuICAgIDIxMDM6IGVycm9ycy5QMlBfQ09OTl9TRVJWRVJfTk9UX1NVUFBPUlRFRCxcbiAgICAyMTEwOiBlcnJvcnMuUDJQX0NPTk5fQ0xJRU5UX1VOS05PV04sXG4gICAgMjExMTogZXJyb3JzLlAyUF9DT05OX0NMSUVOVF9OT1RfSU5JVElBTElaRUQsXG4gICAgMjEyMDogZXJyb3JzLlAyUF9DT05OX0FVVEhfVU5LTk9XTixcbiAgICAyMTIxOiBlcnJvcnMuUDJQX0NPTk5fQVVUSF9GQUlMRUQsXG4gICAgMjIwMTogZXJyb3JzLlAyUF9NRVNTQUdJTkdfVEFSR0VUX1VOUkVBQ0hBQkxFLFxuICAgIDI0MDA6IGVycm9ycy5QMlBfQ0xJRU5UX1VOS05PV04sXG4gICAgMjQwMTogZXJyb3JzLlAyUF9DTElFTlRfVU5TVVBQT1JURURfTUVUSE9ELFxuICAgIDI0MDI6IGVycm9ycy5QMlBfQ0xJRU5UX0lMTEVHQUxfQVJHVU1FTlQsXG4gICAgMjQwMzogZXJyb3JzLlAyUF9DTElFTlRfSU5WQUxJRF9TVEFURSxcbiAgICAyNDA0OiBlcnJvcnMuUDJQX0NMSUVOVF9OT1RfQUxMT1dFRCxcbiAgICAyNTAwOiBlcnJvcnMuUDJQX1dFQlJUQ19VTktOT1dOLFxuICAgIDI1MDE6IGVycm9ycy5QMlBfV0VCUlRDX1NEUCxcbiAgfTtcbiAgcmV0dXJuIGNvZGVFcnJvck1hcFtlcnJvckNvZGVdO1xufVxuXG4vKipcbiAqIEBjbGFzcyBQMlBFcnJvclxuICogQGNsYXNzRGVzYyBUaGUgUDJQRXJyb3Igb2JqZWN0IHJlcHJlc2VudHMgYW4gZXJyb3IgaW4gUDJQIG1vZGUuXG4gKiBAbWVtYmVyT2YgT3d0LlAyUFxuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5leHBvcnQgY2xhc3MgUDJQRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXG4gIGNvbnN0cnVjdG9yKGVycm9yLCBtZXNzYWdlKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgaWYgKHR5cGVvZiBlcnJvciA9PT0gJ251bWJlcicpIHtcbiAgICAgIHRoaXMuY29kZSA9IGVycm9yO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvZGUgPSBlcnJvci5jb2RlO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydCB7ZGVmYXVsdCBhcyBQMlBDbGllbnR9IGZyb20gJy4vcDJwY2xpZW50LmpzJztcbmV4cG9ydCB7UDJQRXJyb3J9IGZyb20gJy4vZXJyb3IuanMnO1xuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4vKiBnbG9iYWwgTWFwLCBQcm9taXNlICovXG5cbid1c2Ugc3RyaWN0JztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi4vYmFzZS9sb2dnZXIuanMnO1xuaW1wb3J0IHtFdmVudERpc3BhdGNoZXIsIE93dEV2ZW50fSBmcm9tICcuLi9iYXNlL2V2ZW50LmpzJztcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4uL2Jhc2UvdXRpbHMuanMnO1xuaW1wb3J0ICogYXMgRXJyb3JNb2R1bGUgZnJvbSAnLi9lcnJvci5qcyc7XG5pbXBvcnQgUDJQUGVlckNvbm5lY3Rpb25DaGFubmVsIGZyb20gJy4vcGVlcmNvbm5lY3Rpb24tY2hhbm5lbC5qcyc7XG5cbmNvbnN0IENvbm5lY3Rpb25TdGF0ZSA9IHtcbiAgUkVBRFk6IDEsXG4gIENPTk5FQ1RJTkc6IDIsXG4gIENPTk5FQ1RFRDogMyxcbn07XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4vKipcbiAqIEBjbGFzcyBQMlBDbGllbnRDb25maWd1cmF0aW9uXG4gKiBAY2xhc3NEZXNjIENvbmZpZ3VyYXRpb24gZm9yIFAyUENsaWVudC5cbiAqIEBtZW1iZXJPZiBPd3QuUDJQXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmNvbnN0IFAyUENsaWVudENvbmZpZ3VyYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgLyoqXG4gICAqIEBtZW1iZXIgez9BcnJheTxPd3QuQmFzZS5BdWRpb0VuY29kaW5nUGFyYW1ldGVycz59IGF1ZGlvRW5jb2RpbmdcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIEVuY29kaW5nIHBhcmFtZXRlcnMgZm9yIHB1Ymxpc2hpbmcgYXVkaW8gdHJhY2tzLlxuICAgKiBAbWVtYmVyb2YgT3d0LlAyUC5QMlBDbGllbnRDb25maWd1cmF0aW9uXG4gICAqL1xuICB0aGlzLmF1ZGlvRW5jb2RpbmcgPSB1bmRlZmluZWQ7XG4gIC8qKlxuICAgKiBAbWVtYmVyIHs/QXJyYXk8T3d0LkJhc2UuVmlkZW9FbmNvZGluZ1BhcmFtZXRlcnM+fSB2aWRlb0VuY29kaW5nXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAZGVzYyBFbmNvZGluZyBwYXJhbWV0ZXJzIGZvciBwdWJsaXNoaW5nIHZpZGVvIHRyYWNrcy5cbiAgICogQG1lbWJlcm9mIE93dC5QMlAuUDJQQ2xpZW50Q29uZmlndXJhdGlvblxuICAgKi9cbiAgdGhpcy52aWRlb0VuY29kaW5nID0gdW5kZWZpbmVkO1xuICAvKipcbiAgICogQG1lbWJlciB7P1JUQ0NvbmZpZ3VyYXRpb259IHJ0Y0NvbmZpZ3VyYXRpb25cbiAgICogQGluc3RhbmNlXG4gICAqIEBtZW1iZXJvZiBPd3QuUDJQLlAyUENsaWVudENvbmZpZ3VyYXRpb25cbiAgICogQGRlc2MgSXQgd2lsbCBiZSB1c2VkIGZvciBjcmVhdGluZyBQZWVyQ29ubmVjdGlvbi5cbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cudzMub3JnL1RSL3dlYnJ0Yy8jcnRjY29uZmlndXJhdGlvbi1kaWN0aW9uYXJ5fFJUQ0NvbmZpZ3VyYXRpb24gRGljdGlvbmFyeSBvZiBXZWJSVEMgMS4wfS5cbiAgICogQGV4YW1wbGVcbiAgICogLy8gRm9sbG93aW5nIG9iamVjdCBjYW4gYmUgc2V0IHRvIHAycENsaWVudENvbmZpZ3VyYXRpb24ucnRjQ29uZmlndXJhdGlvbi5cbiAgICoge1xuICAgKiAgIGljZVNlcnZlcnM6IFt7XG4gICAqICAgICAgdXJsczogXCJzdHVuOmV4YW1wbGUuY29tOjM0NzhcIlxuICAgKiAgIH0sIHtcbiAgICogICAgIHVybHM6IFtcbiAgICogICAgICAgXCJ0dXJuOmV4YW1wbGUuY29tOjM0Nzg/dHJhbnNwb3J0PXVkcFwiLFxuICAgKiAgICAgICBcInR1cm46ZXhhbXBsZS5jb206MzQ3OD90cmFuc3BvcnQ9dGNwXCJcbiAgICogICAgIF0sXG4gICAqICAgICAgY3JlZGVudGlhbDogXCJwYXNzd29yZFwiLFxuICAgKiAgICAgIHVzZXJuYW1lOiBcInVzZXJuYW1lXCJcbiAgICogICB9XG4gICAqIH1cbiAgICovXG4gIHRoaXMucnRjQ29uZmlndXJhdGlvbiA9IHVuZGVmaW5lZDtcbn07XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG5cbi8qKlxuICogQGNsYXNzIFAyUENsaWVudFxuICogQGNsYXNzRGVzYyBUaGUgUDJQQ2xpZW50IGhhbmRsZXMgUGVlckNvbm5lY3Rpb25zIGJldHdlZW4gZGlmZmVyZW50IGNsaWVudHMuXG4gKiBFdmVudHM6XG4gKlxuICogfCBFdmVudCBOYW1lICAgICAgICAgICAgfCBBcmd1bWVudCBUeXBlICAgIHwgRmlyZWQgd2hlbiAgICAgICB8XG4gKiB8IC0tLS0tLS0tLS0tLS0tLS0tLS0tLSB8IC0tLS0tLS0tLS0tLS0tLS0gfCAtLS0tLS0tLS0tLS0tLS0tIHxcbiAqIHwgc3RyZWFtYWRkZWQgICAgICAgICAgIHwgU3RyZWFtRXZlbnQgICAgICB8IEEgbmV3IHN0cmVhbSBpcyBzZW50IGZyb20gcmVtb3RlIGVuZHBvaW50LiB8XG4gKiB8IG1lc3NhZ2VyZWNlaXZlZCAgICAgICB8IE1lc3NhZ2VFdmVudCAgICAgfCBBIG5ldyBtZXNzYWdlIGlzIHJlY2VpdmVkLiB8XG4gKiB8IHNlcnZlcmRpc2Nvbm5lY3RlZCAgICB8IE93dEV2ZW50ICAgICAgICAgfCBEaXNjb25uZWN0ZWQgZnJvbSBzaWduYWxpbmcgc2VydmVyLiB8XG4gKlxuICogQG1lbWJlcm9mIE93dC5QMlBcbiAqIEBleHRlbmRzIE93dC5CYXNlLkV2ZW50RGlzcGF0Y2hlclxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0gez9Pd3QuUDJQLlAyUENsaWVudENvbmZpZ3VyYXRpb24gfSBjb25maWd1cmF0aW9uIENvbmZpZ3VyYXRpb24gZm9yIE93dC5QMlAuUDJQQ2xpZW50LlxuICogQHBhcmFtIHtPYmplY3R9IHNpZ25hbGluZ0NoYW5uZWwgQSBjaGFubmVsIGZvciBzZW5kaW5nIGFuZCByZWNlaXZpbmcgc2lnbmFsaW5nIG1lc3NhZ2VzLlxuICovXG5jb25zdCBQMlBDbGllbnQgPSBmdW5jdGlvbihjb25maWd1cmF0aW9uLCBzaWduYWxpbmdDaGFubmVsKSB7XG4gIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBuZXcgRXZlbnREaXNwYXRjaGVyKCkpO1xuICBjb25zdCBjb25maWcgPSBjb25maWd1cmF0aW9uO1xuICBjb25zdCBzaWduYWxpbmcgPSBzaWduYWxpbmdDaGFubmVsO1xuICBjb25zdCBjaGFubmVscyA9IG5ldyBNYXAoKTsgLy8gTWFwIG9mIFBlZXJDb25uZWN0aW9uQ2hhbm5lbHMuXG4gIGNvbnN0IHNlbGY9dGhpcztcbiAgbGV0IHN0YXRlID0gQ29ubmVjdGlvblN0YXRlLlJFQURZO1xuICBsZXQgbXlJZDtcblxuICBzaWduYWxpbmcub25NZXNzYWdlID0gZnVuY3Rpb24ob3JpZ2luLCBtZXNzYWdlKSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdSZWNlaXZlZCBzaWduYWxpbmcgbWVzc2FnZSBmcm9tICcgKyBvcmlnaW4gKyAnOiAnICsgbWVzc2FnZSk7XG4gICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UobWVzc2FnZSk7XG4gICAgaWYgKGRhdGEudHlwZSA9PT0gJ2NoYXQtY2xvc2VkJykge1xuICAgICAgaWYgKGNoYW5uZWxzLmhhcyhvcmlnaW4pKSB7XG4gICAgICAgIGdldE9yQ3JlYXRlQ2hhbm5lbChvcmlnaW4pLm9uTWVzc2FnZShkYXRhKTtcbiAgICAgICAgY2hhbm5lbHMuZGVsZXRlKG9yaWdpbik7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChzZWxmLmFsbG93ZWRSZW1vdGVJZHMuaW5kZXhPZihvcmlnaW4pID49IDApIHtcbiAgICAgIGdldE9yQ3JlYXRlQ2hhbm5lbChvcmlnaW4pLm9uTWVzc2FnZShkYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VuZFNpZ25hbGluZ01lc3NhZ2Uob3JpZ2luLCAnY2hhdC1jbG9zZWQnLFxuICAgICAgICAgIEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX0RFTklFRCk7XG4gICAgfVxuICB9O1xuXG4gIHNpZ25hbGluZy5vblNlcnZlckRpc2Nvbm5lY3RlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHN0YXRlID0gQ29ubmVjdGlvblN0YXRlLlJFQURZO1xuICAgIHNlbGYuZGlzcGF0Y2hFdmVudChuZXcgT3d0RXZlbnQoJ3NlcnZlcmRpc2Nvbm5lY3RlZCcpKTtcbiAgfTtcblxuICAvKipcbiAgICogQG1lbWJlciB7YXJyYXl9IGFsbG93ZWRSZW1vdGVJZHNcbiAgICogQG1lbWJlcm9mIE93dC5QMlAuUDJQQ2xpZW50XG4gICAqIEBpbnN0YW5jZVxuICAgKiBAZGVzYyBPbmx5IGFsbG93ZWQgcmVtb3RlIGVuZHBvaW50IElEcyBhcmUgYWJsZSB0byBwdWJsaXNoIHN0cmVhbSBvciBzZW5kIG1lc3NhZ2UgdG8gY3VycmVudCBlbmRwb2ludC4gUmVtb3ZpbmcgYW4gSUQgZnJvbSBhbGxvd2VkUmVtb3RlSWRzIGRvZXMgc3RvcCBleGlzdGluZyBjb25uZWN0aW9uIHdpdGggY2VydGFpbiBlbmRwb2ludC4gUGxlYXNlIGNhbGwgc3RvcCB0byBzdG9wIHRoZSBQZWVyQ29ubmVjdGlvbi5cbiAgICovXG4gIHRoaXMuYWxsb3dlZFJlbW90ZUlkcz1bXTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIGNvbm5lY3RcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIENvbm5lY3QgdG8gc2lnbmFsaW5nIHNlcnZlci4gU2luY2Ugc2lnbmFsaW5nIGNhbiBiZSBjdXN0b21pemVkLCB0aGlzIG1ldGhvZCBkb2VzIG5vdCBkZWZpbmUgaG93IGEgdG9rZW4gbG9va3MgbGlrZS4gU0RLIHBhc3NlcyB0b2tlbiB0byBzaWduYWxpbmcgY2hhbm5lbCB3aXRob3V0IGNoYW5nZXMuXG4gICAqIEBtZW1iZXJvZiBPd3QuUDJQLlAyUENsaWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9rZW4gQSB0b2tlbiBmb3IgY29ubmVjdGluZyB0byBzaWduYWxpbmcgc2VydmVyLiBUaGUgZm9ybWF0IG9mIHRoaXMgdG9rZW4gZGVwZW5kcyBvbiBzaWduYWxpbmcgc2VydmVyJ3MgcmVxdWlyZW1lbnQuXG4gICAqIEByZXR1cm4ge1Byb21pc2U8b2JqZWN0LCBFcnJvcj59IEl0IHJldHVybnMgYSBwcm9taXNlIHJlc29sdmVkIHdpdGggYW4gb2JqZWN0IHJldHVybmVkIGJ5IHNpZ25hbGluZyBjaGFubmVsIG9uY2Ugc2lnbmFsaW5nIGNoYW5uZWwgcmVwb3J0cyBjb25uZWN0aW9uIGhhcyBiZWVuIGVzdGFibGlzaGVkLlxuICAgKi9cbiAgdGhpcy5jb25uZWN0ID0gZnVuY3Rpb24odG9rZW4pIHtcbiAgICBpZiAoc3RhdGUgPT09IENvbm5lY3Rpb25TdGF0ZS5SRUFEWSkge1xuICAgICAgc3RhdGUgPSBDb25uZWN0aW9uU3RhdGUuQ09OTkVDVElORztcbiAgICB9IGVsc2Uge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ0ludmFsaWQgY29ubmVjdGlvbiBzdGF0ZTogJyArIHN0YXRlKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoXG4gICAgICAgICAgRXJyb3JNb2R1bGUuZXJyb3JzLlAyUF9DTElFTlRfSU5WQUxJRF9TVEFURSkpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgc2lnbmFsaW5nLmNvbm5lY3QodG9rZW4pLnRoZW4oKGlkKSA9PiB7XG4gICAgICAgIG15SWQgPSBpZDtcbiAgICAgICAgc3RhdGUgPSBDb25uZWN0aW9uU3RhdGUuQ09OTkVDVEVEO1xuICAgICAgICByZXNvbHZlKG15SWQpO1xuICAgICAgfSwgKGVyckNvZGUpID0+IHtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihFcnJvck1vZHVsZS5nZXRFcnJvckJ5Q29kZShcbiAgICAgICAgICAgIGVyckNvZGUpKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIGRpc2Nvbm5lY3RcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIERpc2Nvbm5lY3QgZnJvbSB0aGUgc2lnbmFsaW5nIGNoYW5uZWwuIEl0IHN0b3BzIGFsbCBleGlzdGluZyBzZXNzaW9ucyB3aXRoIHJlbW90ZSBlbmRwb2ludHMuXG4gICAqIEBtZW1iZXJvZiBPd3QuUDJQLlAyUENsaWVudFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTx1bmRlZmluZWQsIEVycm9yPn1cbiAgICovXG4gIHRoaXMuZGlzY29ubmVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChzdGF0ZSA9PSBDb25uZWN0aW9uU3RhdGUuUkVBRFkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2hhbm5lbHMuZm9yRWFjaCgoY2hhbm5lbCk9PntcbiAgICAgIGNoYW5uZWwuc3RvcCgpO1xuICAgIH0pO1xuICAgIGNoYW5uZWxzLmNsZWFyKCk7XG4gICAgc2lnbmFsaW5nLmRpc2Nvbm5lY3QoKTtcbiAgfTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIHB1Ymxpc2hcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIFB1Ymxpc2ggYSBzdHJlYW0gdG8gYSByZW1vdGUgZW5kcG9pbnQuXG4gICAqIEBtZW1iZXJvZiBPd3QuUDJQLlAyUENsaWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVtb3RlSWQgUmVtb3RlIGVuZHBvaW50J3MgSUQuXG4gICAqIEBwYXJhbSB7T3d0LkJhc2UuTG9jYWxTdHJlYW19IHN0cmVhbSBBbiBPd3QuQmFzZS5Mb2NhbFN0cmVhbSB0byBiZSBwdWJsaXNoZWQuXG4gICAqIEByZXR1cm4ge1Byb21pc2U8T3d0LkJhc2UuUHVibGljYXRpb24sIEVycm9yPn0gQSBwcm9taXNlZCB0aGF0IHJlc29sdmVzIHdoZW4gcmVtb3RlIHNpZGUgcmVjZWl2ZWQgdGhlIGNlcnRhaW4gc3RyZWFtLiBIb3dldmVyLCByZW1vdGUgZW5kcG9pbnQgbWF5IG5vdCBkaXNwbGF5IHRoaXMgc3RyZWFtLCBvciBpZ25vcmUgaXQuXG4gICAqL1xuICB0aGlzLnB1Ymxpc2ggPSBmdW5jdGlvbihyZW1vdGVJZCwgc3RyZWFtKSB7XG4gICAgaWYgKHN0YXRlICE9PSBDb25uZWN0aW9uU3RhdGUuQ09OTkVDVEVEKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKFxuICAgICAgICAgIEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX0lOVkFMSURfU1RBVEUsXG4gICAgICAgICAgJ1AyUCBDbGllbnQgaXMgbm90IGNvbm5lY3RlZCB0byBzaWduYWxpbmcgY2hhbm5lbC4nKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmFsbG93ZWRSZW1vdGVJZHMuaW5kZXhPZihyZW1vdGVJZCkgPCAwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKFxuICAgICAgICAgIEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX05PVF9BTExPV0VEKSk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZ2V0T3JDcmVhdGVDaGFubmVsKHJlbW90ZUlkKS5wdWJsaXNoKHN0cmVhbSkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gc2VuZFxuICAgKiBAaW5zdGFuY2VcbiAgICogQGRlc2MgU2VuZCBhIG1lc3NhZ2UgdG8gcmVtb3RlIGVuZHBvaW50LlxuICAgKiBAbWVtYmVyb2YgT3d0LlAyUC5QMlBDbGllbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlbW90ZUlkIFJlbW90ZSBlbmRwb2ludCdzIElELlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSBNZXNzYWdlIHRvIGJlIHNlbnQuIEl0IHNob3VsZCBiZSBhIHN0cmluZy5cbiAgICogQHJldHVybiB7UHJvbWlzZTx1bmRlZmluZWQsIEVycm9yPn0gSXQgcmV0dXJucyBhIHByb21pc2UgcmVzb2x2ZWQgd2hlbiByZW1vdGUgZW5kcG9pbnQgcmVjZWl2ZWQgY2VydGFpbiBtZXNzYWdlLlxuICAgKi9cbiAgdGhpcy5zZW5kPWZ1bmN0aW9uKHJlbW90ZUlkLCBtZXNzYWdlKSB7XG4gICAgaWYgKHN0YXRlICE9PSBDb25uZWN0aW9uU3RhdGUuQ09OTkVDVEVEKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKFxuICAgICAgICAgIEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX0lOVkFMSURfU1RBVEUsXG4gICAgICAgICAgJ1AyUCBDbGllbnQgaXMgbm90IGNvbm5lY3RlZCB0byBzaWduYWxpbmcgY2hhbm5lbC4nKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmFsbG93ZWRSZW1vdGVJZHMuaW5kZXhPZihyZW1vdGVJZCkgPCAwKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKFxuICAgICAgICAgIEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX05PVF9BTExPV0VEKSk7XG4gICAgfVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZ2V0T3JDcmVhdGVDaGFubmVsKHJlbW90ZUlkKS5zZW5kKG1lc3NhZ2UpKTtcbiAgfTtcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIHN0b3BcbiAgICogQGluc3RhbmNlXG4gICAqIEBkZXNjIENsZWFuIGFsbCByZXNvdXJjZXMgYXNzb2NpYXRlZCB3aXRoIGdpdmVuIHJlbW90ZSBlbmRwb2ludC4gSXQgbWF5IGluY2x1ZGUgUlRDUGVlckNvbm5lY3Rpb24sIFJUQ1J0cFRyYW5zY2VpdmVyIGFuZCBSVENEYXRhQ2hhbm5lbC4gSXQgc3RpbGwgcG9zc2libGUgdG8gcHVibGlzaCBhIHN0cmVhbSwgb3Igc2VuZCBhIG1lc3NhZ2UgdG8gZ2l2ZW4gcmVtb3RlIGVuZHBvaW50IGFmdGVyIHN0b3AuXG4gICAqIEBtZW1iZXJvZiBPd3QuUDJQLlAyUENsaWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVtb3RlSWQgUmVtb3RlIGVuZHBvaW50J3MgSUQuXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICovXG4gIHRoaXMuc3RvcCA9IGZ1bmN0aW9uKHJlbW90ZUlkKSB7XG4gICAgaWYgKCFjaGFubmVscy5oYXMocmVtb3RlSWQpKSB7XG4gICAgICBMb2dnZXIud2FybmluZyhcbiAgICAgICAgICAnTm8gUGVlckNvbm5lY3Rpb24gYmV0d2VlbiBjdXJyZW50IGVuZHBvaW50IGFuZCBzcGVjaWZpYyByZW1vdGUgJyArXG4gICAgICAgICAgJ2VuZHBvaW50LidcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNoYW5uZWxzLmdldChyZW1vdGVJZCkuc3RvcCgpO1xuICAgIGNoYW5uZWxzLmRlbGV0ZShyZW1vdGVJZCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBnZXRTdGF0c1xuICAgKiBAaW5zdGFuY2VcbiAgICogQGRlc2MgR2V0IHN0YXRzIG9mIHVuZGVybHlpbmcgUGVlckNvbm5lY3Rpb24uXG4gICAqIEBtZW1iZXJvZiBPd3QuUDJQLlAyUENsaWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVtb3RlSWQgUmVtb3RlIGVuZHBvaW50J3MgSUQuXG4gICAqIEByZXR1cm4ge1Byb21pc2U8UlRDU3RhdHNSZXBvcnQsIEVycm9yPn0gSXQgcmV0dXJucyBhIHByb21pc2UgcmVzb2x2ZWQgd2l0aCBhbiBSVENTdGF0c1JlcG9ydCBvciByZWplY3Qgd2l0aCBhbiBFcnJvciBpZiB0aGVyZSBpcyBubyBjb25uZWN0aW9uIHdpdGggc3BlY2lmaWMgdXNlci5cbiAgICovXG4gIHRoaXMuZ2V0U3RhdHMgPSBmdW5jdGlvbihyZW1vdGVJZCkge1xuICAgIGlmICghY2hhbm5lbHMuaGFzKHJlbW90ZUlkKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihcbiAgICAgICAgICBFcnJvck1vZHVsZS5lcnJvcnMuUDJQX0NMSUVOVF9JTlZBTElEX1NUQVRFLFxuICAgICAgICAgICdObyBQZWVyQ29ubmVjdGlvbiBiZXR3ZWVuIGN1cnJlbnQgZW5kcG9pbnQgYW5kIHNwZWNpZmljIHJlbW90ZSAnICtcbiAgICAgICAgICAnZW5kcG9pbnQuJykpO1xuICAgIH1cbiAgICByZXR1cm4gY2hhbm5lbHMuZ2V0KHJlbW90ZUlkKS5nZXRTdGF0cygpO1xuICB9O1xuXG4gIGNvbnN0IHNlbmRTaWduYWxpbmdNZXNzYWdlID0gZnVuY3Rpb24ocmVtb3RlSWQsIHR5cGUsIG1lc3NhZ2UpIHtcbiAgICBjb25zdCBtc2cgPSB7XG4gICAgICB0eXBlOiB0eXBlLFxuICAgIH07XG4gICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgIG1zZy5kYXRhID0gbWVzc2FnZTtcbiAgICB9XG4gICAgcmV0dXJuIHNpZ25hbGluZy5zZW5kKHJlbW90ZUlkLCBKU09OLnN0cmluZ2lmeShtc2cpKS5jYXRjaCgoZSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBlID09PSAnbnVtYmVyJykge1xuICAgICAgICB0aHJvdyBFcnJvck1vZHVsZS5nZXRFcnJvckJ5Q29kZShlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBnZXRPckNyZWF0ZUNoYW5uZWwgPSBmdW5jdGlvbihyZW1vdGVJZCkge1xuICAgIGlmICghY2hhbm5lbHMuaGFzKHJlbW90ZUlkKSkge1xuICAgICAgLy8gQ29uc3RydWN0IGFuIHNpZ25hbGluZyBzZW5kZXIvcmVjZWl2ZXIgZm9yIFAyUFBlZXJDb25uZWN0aW9uLlxuICAgICAgY29uc3Qgc2lnbmFsaW5nRm9yQ2hhbm5lbCA9IE9iamVjdC5jcmVhdGUoRXZlbnREaXNwYXRjaGVyKTtcbiAgICAgIHNpZ25hbGluZ0ZvckNoYW5uZWwuc2VuZFNpZ25hbGluZ01lc3NhZ2UgPSBzZW5kU2lnbmFsaW5nTWVzc2FnZTtcbiAgICAgIGNvbnN0IHBjYyA9IG5ldyBQMlBQZWVyQ29ubmVjdGlvbkNoYW5uZWwoY29uZmlnLCBteUlkLCByZW1vdGVJZCxcbiAgICAgICAgICBzaWduYWxpbmdGb3JDaGFubmVsKTtcbiAgICAgIHBjYy5hZGRFdmVudExpc3RlbmVyKCdzdHJlYW1hZGRlZCcsIChzdHJlYW1FdmVudCk9PntcbiAgICAgICAgc2VsZi5kaXNwYXRjaEV2ZW50KHN0cmVhbUV2ZW50KTtcbiAgICAgIH0pO1xuICAgICAgcGNjLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2VyZWNlaXZlZCcsIChtZXNzYWdlRXZlbnQpPT57XG4gICAgICAgIHNlbGYuZGlzcGF0Y2hFdmVudChtZXNzYWdlRXZlbnQpO1xuICAgICAgfSk7XG4gICAgICBwY2MuYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCAoKT0+e1xuICAgICAgICBjaGFubmVscy5kZWxldGUocmVtb3RlSWQpO1xuICAgICAgfSk7XG4gICAgICBjaGFubmVscy5zZXQocmVtb3RlSWQsIHBjYyk7XG4gICAgfVxuICAgIHJldHVybiBjaGFubmVscy5nZXQocmVtb3RlSWQpO1xuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUDJQQ2xpZW50O1xuIiwiLy8gQ29weXJpZ2h0IChDKSA8MjAxOD4gSW50ZWwgQ29ycG9yYXRpb25cbi8vXG4vLyBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuXG4vLyBUaGlzIGZpbGUgZG9lc24ndCBoYXZlIHB1YmxpYyBBUElzLlxuLyogZXNsaW50LWRpc2FibGUgdmFsaWQtanNkb2MgKi9cbi8qIGVzbGludC1kaXNhYmxlIHJlcXVpcmUtanNkb2MgKi9cbi8qIGdsb2JhbCBFdmVudCwgTWFwLCBQcm9taXNlLCBSVENJY2VDYW5kaWRhdGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4uL2Jhc2UvbG9nZ2VyLmpzJztcbmltcG9ydCB7RXZlbnREaXNwYXRjaGVyLCBNZXNzYWdlRXZlbnQsIE93dEV2ZW50fSBmcm9tICcuLi9iYXNlL2V2ZW50LmpzJztcbmltcG9ydCB7UHVibGljYXRpb259IGZyb20gJy4uL2Jhc2UvcHVibGljYXRpb24uanMnO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi4vYmFzZS91dGlscy5qcyc7XG5pbXBvcnQgKiBhcyBFcnJvck1vZHVsZSBmcm9tICcuL2Vycm9yLmpzJztcbmltcG9ydCAqIGFzIFN0cmVhbU1vZHVsZSBmcm9tICcuLi9iYXNlL3N0cmVhbS5qcyc7XG5pbXBvcnQgKiBhcyBTZHBVdGlscyBmcm9tICcuLi9iYXNlL3NkcHV0aWxzLmpzJztcblxuLyoqXG4gKiBAY2xhc3MgUDJQUGVlckNvbm5lY3Rpb25DaGFubmVsRXZlbnRcbiAqIEBkZXNjIEV2ZW50IGZvciBTdHJlYW0uXG4gKiBAbWVtYmVyT2YgT3d0LlAyUFxuICogQHByaXZhdGVcbiAqICovXG5leHBvcnQgY2xhc3MgUDJQUGVlckNvbm5lY3Rpb25DaGFubmVsRXZlbnQgZXh0ZW5kcyBFdmVudCB7XG4gIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jICovXG4gIGNvbnN0cnVjdG9yKGluaXQpIHtcbiAgICBzdXBlcihpbml0KTtcbiAgICB0aGlzLnN0cmVhbSA9IGluaXQuc3RyZWFtO1xuICB9XG59XG5cbmNvbnN0IERhdGFDaGFubmVsTGFiZWwgPSB7XG4gIE1FU1NBR0U6ICdtZXNzYWdlJyxcbiAgRklMRTogJ2ZpbGUnLFxufTtcblxuY29uc3QgU2lnbmFsaW5nVHlwZSA9IHtcbiAgREVOSUVEOiAnY2hhdC1kZW5pZWQnLFxuICBDTE9TRUQ6ICdjaGF0LWNsb3NlZCcsXG4gIE5FR09USUFUSU9OX05FRURFRDogJ2NoYXQtbmVnb3RpYXRpb24tbmVlZGVkJyxcbiAgVFJBQ0tfU09VUkNFUzogJ2NoYXQtdHJhY2stc291cmNlcycsXG4gIFNUUkVBTV9JTkZPOiAnY2hhdC1zdHJlYW0taW5mbycsXG4gIFNEUDogJ2NoYXQtc2lnbmFsJyxcbiAgVFJBQ0tTX0FEREVEOiAnY2hhdC10cmFja3MtYWRkZWQnLFxuICBUUkFDS1NfUkVNT1ZFRDogJ2NoYXQtdHJhY2tzLXJlbW92ZWQnLFxuICBEQVRBX1JFQ0VJVkVEOiAnY2hhdC1kYXRhLXJlY2VpdmVkJyxcbiAgVUE6ICdjaGF0LXVhJyxcbn07XG5cbmNvbnN0IHN5c0luZm8gPSBVdGlscy5zeXNJbmZvKCk7XG5cbi8qKlxuICogQGNsYXNzIFAyUFBlZXJDb25uZWN0aW9uQ2hhbm5lbFxuICogQGRlc2MgQSBQMlBQZWVyQ29ubmVjdGlvbkNoYW5uZWwgaGFuZGxlcyBhbGwgaW50ZXJhY3Rpb25zIGJldHdlZW4gdGhpcyBlbmRwb2ludCBhbmQgYSByZW1vdGUgZW5kcG9pbnQuXG4gKiBAbWVtYmVyT2YgT3d0LlAyUFxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgUDJQUGVlckNvbm5lY3Rpb25DaGFubmVsIGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyIHtcbiAgLy8gfHNpZ25hbGluZ3wgaXMgYW4gb2JqZWN0IGhhcyBhIG1ldGhvZCB8c2VuZFNpZ25hbGluZ01lc3NhZ2V8LlxuICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVxdWlyZS1qc2RvYyAqL1xuICBjb25zdHJ1Y3Rvcihjb25maWcsIGxvY2FsSWQsIHJlbW90ZUlkLCBzaWduYWxpbmcpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2NvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLl9sb2NhbElkID0gbG9jYWxJZDtcbiAgICB0aGlzLl9yZW1vdGVJZCA9IHJlbW90ZUlkO1xuICAgIHRoaXMuX3NpZ25hbGluZyA9IHNpZ25hbGluZztcbiAgICB0aGlzLl9wYyA9IG51bGw7XG4gICAgdGhpcy5fcHVibGlzaGVkU3RyZWFtcyA9IG5ldyBNYXAoKTsgLy8gS2V5IGlzIHN0cmVhbXMgcHVibGlzaGVkLCB2YWx1ZSBpcyBpdHMgcHVibGljYXRpb24uXG4gICAgdGhpcy5fcGVuZGluZ1N0cmVhbXMgPSBbXTsgLy8gU3RyZWFtcyBnb2luZyB0byBiZSBhZGRlZCB0byBQZWVyQ29ubmVjdGlvbi5cbiAgICB0aGlzLl9wdWJsaXNoaW5nU3RyZWFtcyA9IFtdOyAvLyBTdHJlYW1zIGhhdmUgYmVlbiBhZGRlZCB0byBQZWVyQ29ubmVjdGlvbiwgYnV0IGRvZXMgbm90IHJlY2VpdmUgYWNrIGZyb20gcmVtb3RlIHNpZGUuXG4gICAgdGhpcy5fcGVuZGluZ1VucHVibGlzaFN0cmVhbXMgPSBbXTsgLy8gU3RyZWFtcyBnb2luZyB0byBiZSByZW1vdmVkLlxuICAgIC8vIEtleSBpcyBNZWRpYVN0cmVhbSdzIElELCB2YWx1ZSBpcyBhbiBvYmplY3Qge3NvdXJjZTp7YXVkaW86c3RyaW5nLCB2aWRlbzpzdHJpbmd9LCBhdHRyaWJ1dGVzOiBvYmplY3QsIHN0cmVhbTogUmVtb3RlU3RyZWFtLCBtZWRpYVN0cmVhbTogTWVkaWFTdHJlYW19LiBgc3RyZWFtYCBhbmQgYG1lZGlhU3RyZWFtYCB3aWxsIGJlIHNldCB3aGVuIGB0cmFja2AgZXZlbnQgaXMgZmlyZWQgb24gYFJUQ1BlZXJDb25uZWN0aW9uYC4gYG1lZGlhU3RyZWFtYCB3aWxsIGJlIGBudWxsYCBhZnRlciBgc3RyZWFtYWRkZWRgIGV2ZW50IGlzIGZpcmVkIG9uIGBQMlBDbGllbnRgLiBPdGhlciBwcm9wZXJ0ZXMgd2lsbCBiZSBzZXQgdXBvbiBgU1RSRUFNX0lORk9gIGV2ZW50IGZyb20gc2lnbmFsaW5nIGNoYW5uZWwuXG4gICAgdGhpcy5fcmVtb3RlU3RyZWFtSW5mbyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9yZW1vdGVTdHJlYW1zID0gW107XG4gICAgdGhpcy5fcmVtb3RlVHJhY2tTb3VyY2VJbmZvID0gbmV3IE1hcCgpOyAvLyBLZXkgaXMgTWVkaWFTdHJlYW1UcmFjaydzIElELCB2YWx1ZSBpcyBzb3VyY2UgaW5mby5cbiAgICB0aGlzLl9wdWJsaXNoUHJvbWlzZXMgPSBuZXcgTWFwKCk7IC8vIEtleSBpcyBNZWRpYVN0cmVhbSdzIElELCB2YWx1ZSBpcyBhbiBvYmplY3QgaGFzIHxyZXNvbHZlfCBhbmQgfHJlamVjdHwuXG4gICAgdGhpcy5fdW5wdWJsaXNoUHJvbWlzZXMgPSBuZXcgTWFwKCk7IC8vIEtleSBpcyBNZWRpYVN0cmVhbSdzIElELCB2YWx1ZSBpcyBhbiBvYmplY3QgaGFzIHxyZXNvbHZlfCBhbmQgfHJlamVjdHwuXG4gICAgdGhpcy5fcHVibGlzaGluZ1N0cmVhbVRyYWNrcyA9IG5ldyBNYXAoKTsgLy8gS2V5IGlzIE1lZGlhU3RyZWFtJ3MgSUQsIHZhbHVlIGlzIGFuIGFycmF5IG9mIHRoZSBJRCBvZiBpdHMgTWVkaWFTdHJlYW1UcmFja3MgdGhhdCBoYXZlbid0IGJlZW4gYWNrZWQuXG4gICAgdGhpcy5fcHVibGlzaGVkU3RyZWFtVHJhY2tzID0gbmV3IE1hcCgpOyAvLyBLZXkgaXMgTWVkaWFTdHJlYW0ncyBJRCwgdmFsdWUgaXMgYW4gYXJyYXkgb2YgdGhlIElEIG9mIGl0cyBNZWRpYVN0cmVhbVRyYWNrcyB0aGF0IGhhdmVuJ3QgYmVlbiByZW1vdmVkLlxuICAgIHRoaXMuX2lzTmVnb3RpYXRpb25OZWVkZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9yZW1vdGVTaWRlU3VwcG9ydHNSZW1vdmVTdHJlYW0gPSB0cnVlO1xuICAgIHRoaXMuX3JlbW90ZVNpZGVTdXBwb3J0c1BsYW5CID0gdHJ1ZTtcbiAgICB0aGlzLl9yZW1vdGVTaWRlU3VwcG9ydHNVbmlmaWVkUGxhbiA9IHRydWU7XG4gICAgdGhpcy5fcmVtb3RlSWNlQ2FuZGlkYXRlcyA9IFtdO1xuICAgIHRoaXMuX2RhdGFDaGFubmVscyA9IG5ldyBNYXAoKTsgLy8gS2V5IGlzIGRhdGEgY2hhbm5lbCdzIGxhYmVsLCB2YWx1ZSBpcyBhIFJUQ0RhdGFDaGFubmVsLlxuICAgIHRoaXMuX3BlbmRpbmdNZXNzYWdlcyA9IFtdO1xuICAgIHRoaXMuX2RhdGFTZXEgPSAxOyAvLyBTZXF1ZW5jZSBudW1iZXIgZm9yIGRhdGEgY2hhbm5lbCBtZXNzYWdlcy5cbiAgICB0aGlzLl9zZW5kRGF0YVByb21pc2VzID0gbmV3IE1hcCgpOyAvLyBLZXkgaXMgZGF0YSBzZXF1ZW5jZSBudW1iZXIsIHZhbHVlIGlzIGFuIG9iamVjdCBoYXMgfHJlc29sdmV8IGFuZCB8cmVqZWN0fC5cbiAgICB0aGlzLl9hZGRlZFRyYWNrSWRzID0gW107IC8vIFRyYWNrcyB0aGF0IGhhdmUgYmVlbiBhZGRlZCBhZnRlciByZWNlaXZpbmcgcmVtb3RlIFNEUCBidXQgYmVmb3JlIGNvbm5lY3Rpb24gaXMgZXN0YWJsaXNoZWQuIERyYWluaW5nIHRoZXNlIG1lc3NhZ2VzIHdoZW4gSUNFIGNvbm5lY3Rpb24gc3RhdGUgaXMgY29ubmVjdGVkLlxuICAgIHRoaXMuX2lzQ2FsbGVyID0gdHJ1ZTtcbiAgICB0aGlzLl9pbmZvU2VudCA9IGZhbHNlO1xuICAgIHRoaXMuX2Rpc3Bvc2VkID0gZmFsc2U7XG4gICAgdGhpcy5fY3JlYXRlUGVlckNvbm5lY3Rpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gcHVibGlzaFxuICAgKiBAZGVzYyBQdWJsaXNoIGEgc3RyZWFtIHRvIHRoZSByZW1vdGUgZW5kcG9pbnQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwdWJsaXNoKHN0cmVhbSkge1xuICAgIGlmICghKHN0cmVhbSBpbnN0YW5jZW9mIFN0cmVhbU1vZHVsZS5Mb2NhbFN0cmVhbSkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHN0cmVhbS4nKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9wdWJsaXNoZWRTdHJlYW1zLmhhcyhzdHJlYW0pKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKFxuICAgICAgICAgIEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX0lMTEVHQUxfQVJHVU1FTlQsXG4gICAgICAgICAgJ0R1cGxpY2F0ZWQgc3RyZWFtLicpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2FyZUFsbFRyYWNrc0VuZGVkKHN0cmVhbS5tZWRpYVN0cmVhbSkpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoXG4gICAgICAgICAgRXJyb3JNb2R1bGUuZXJyb3JzLlAyUF9DTElFTlRfSU5WQUxJRF9TVEFURSxcbiAgICAgICAgICAnQWxsIHRyYWNrcyBhcmUgZW5kZWQuJykpO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoW3RoaXMuX3NlbmRDbG9zZWRNc2dJZk5lY2Vzc2FyeSgpLFxuICAgICAgdGhpcy5fc2VuZFN5c0luZm9JZk5lY2Vzc2FyeSgpLFxuICAgICAgdGhpcy5fc2VuZFN0cmVhbUluZm8oc3RyZWFtKV0pLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgLy8gUmVwbGFjZSB8YWRkU3RyZWFtfCB3aXRoIFBlZXJDb25uZWN0aW9uLmFkZFRyYWNrIHdoZW4gYWxsIGJyb3dzZXJzIGFyZSByZWFkeS5cbiAgICAgICAgZm9yIChjb25zdCB0cmFjayBvZiBzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0VHJhY2tzKCkpIHtcbiAgICAgICAgICB0aGlzLl9wYy5hZGRUcmFjayh0cmFjaywgc3RyZWFtLm1lZGlhU3RyZWFtKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9vbk5lZ290aWF0aW9ubmVlZGVkKCk7XG4gICAgICAgIHRoaXMuX3B1Ymxpc2hpbmdTdHJlYW1zLnB1c2goc3RyZWFtKTtcbiAgICAgICAgY29uc3QgdHJhY2tJZHMgPSBBcnJheS5mcm9tKHN0cmVhbS5tZWRpYVN0cmVhbS5nZXRUcmFja3MoKSxcbiAgICAgICAgICAgICh0cmFjaykgPT4gdHJhY2suaWQpO1xuICAgICAgICB0aGlzLl9wdWJsaXNoaW5nU3RyZWFtVHJhY2tzLnNldChzdHJlYW0ubWVkaWFTdHJlYW0uaWQsXG4gICAgICAgICAgICB0cmFja0lkcyk7XG4gICAgICAgIHRoaXMuX3B1Ymxpc2hQcm9taXNlcy5zZXQoc3RyZWFtLm1lZGlhU3RyZWFtLmlkLCB7XG4gICAgICAgICAgcmVzb2x2ZTogcmVzb2x2ZSxcbiAgICAgICAgICByZWplY3Q6IHJlamVjdCxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gc2VuZFxuICAgKiBAZGVzYyBTZW5kIGEgbWVzc2FnZSB0byB0aGUgcmVtb3RlIGVuZHBvaW50LlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2VuZChtZXNzYWdlKSB7XG4gICAgaWYgKCEodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgbWVzc2FnZS4nKSk7XG4gICAgfVxuICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICBpZDogdGhpcy5fZGF0YVNlcSsrLFxuICAgICAgZGF0YTogbWVzc2FnZSxcbiAgICB9O1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLl9zZW5kRGF0YVByb21pc2VzLnNldChkYXRhLmlkLCB7XG4gICAgICAgIHJlc29sdmU6IHJlc29sdmUsXG4gICAgICAgIHJlamVjdDogcmVqZWN0LFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKCF0aGlzLl9kYXRhQ2hhbm5lbHMuaGFzKERhdGFDaGFubmVsTGFiZWwuTUVTU0FHRSkpIHtcbiAgICAgIHRoaXMuX2NyZWF0ZURhdGFDaGFubmVsKERhdGFDaGFubmVsTGFiZWwuTUVTU0FHRSk7XG4gICAgfVxuXG4gICAgdGhpcy5fc2VuZENsb3NlZE1zZ0lmTmVjZXNzYXJ5KCkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdGYWlsZWQgdG8gc2VuZCBjbG9zZWQgbWVzc2FnZS4nICsgZXJyLm1lc3NhZ2UpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fc2VuZFN5c0luZm9JZk5lY2Vzc2FyeSgpLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIExvZ2dlci5kZWJ1ZygnRmFpbGVkIHRvIHNlbmQgc3lzSW5mby4nICsgZXJyLm1lc3NhZ2UpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZGMgPSB0aGlzLl9kYXRhQ2hhbm5lbHMuZ2V0KERhdGFDaGFubmVsTGFiZWwuTUVTU0FHRSk7XG4gICAgaWYgKGRjLnJlYWR5U3RhdGUgPT09ICdvcGVuJykge1xuICAgICAgdGhpcy5fZGF0YUNoYW5uZWxzLmdldChEYXRhQ2hhbm5lbExhYmVsLk1FU1NBR0UpLnNlbmQoXG4gICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9wZW5kaW5nTWVzc2FnZXMucHVzaChkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogQGZ1bmN0aW9uIHN0b3BcbiAgICogQGRlc2MgU3RvcCB0aGUgY29ubmVjdGlvbiB3aXRoIHJlbW90ZSBlbmRwb2ludC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5fc3RvcCh1bmRlZmluZWQsIHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBnZXRTdGF0c1xuICAgKiBAZGVzYyBHZXQgc3RhdHMgZm9yIGEgc3BlY2lmaWMgTWVkaWFTdHJlYW0uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXRTdGF0cyhtZWRpYVN0cmVhbSkge1xuICAgIGlmICh0aGlzLl9wYykge1xuICAgICAgaWYgKG1lZGlhU3RyZWFtID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BjLmdldFN0YXRzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0cmFja3NTdGF0c1JlcG9ydHMgPSBbXTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFttZWRpYVN0cmVhbS5nZXRUcmFja3MoKS5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgICAgIHRoaXMuX2dldFN0YXRzKHRyYWNrLCB0cmFja3NTdGF0c1JlcG9ydHMpO1xuICAgICAgICB9KV0pLnRoZW4oXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cmFja3NTdGF0c1JlcG9ydHMpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKFxuICAgICAgICAgIEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX0lOVkFMSURfU1RBVEUpKTtcbiAgICB9XG4gIH1cblxuICBfZ2V0U3RhdHMobWVkaWFTdHJlYW1UcmFjaywgcmVwb3J0c1Jlc3VsdCkge1xuICAgIHJldHVybiB0aGlzLl9wYy5nZXRTdGF0cyhtZWRpYVN0cmVhbVRyYWNrKS50aGVuKFxuICAgICAgICAoc3RhdHNSZXBvcnQpID0+IHtcbiAgICAgICAgICByZXBvcnRzUmVzdWx0LnB1c2goc3RhdHNSZXBvcnQpO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gb25NZXNzYWdlXG4gICAqIEBkZXNjIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBieSBQMlBDbGllbnQgd2hlbiB0aGVyZSBpcyBuZXcgc2lnbmFsaW5nIG1lc3NhZ2UgYXJyaXZlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uTWVzc2FnZShtZXNzYWdlKSB7XG4gICAgdGhpcy5fU2lnbmFsaW5nTWVzc3NhZ2VIYW5kbGVyKG1lc3NhZ2UpO1xuICB9XG5cbiAgX3NlbmRTZHAoc2RwKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NpZ25hbGluZy5zZW5kU2lnbmFsaW5nTWVzc2FnZShcbiAgICAgICAgdGhpcy5fcmVtb3RlSWQsIFNpZ25hbGluZ1R5cGUuU0RQLCBzZHApO1xuICB9XG5cbiAgX3NlbmRTaWduYWxpbmdNZXNzYWdlKHR5cGUsIG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gdGhpcy5fc2lnbmFsaW5nLnNlbmRTaWduYWxpbmdNZXNzYWdlKHRoaXMuX3JlbW90ZUlkLCB0eXBlLCBtZXNzYWdlKTtcbiAgfVxuXG4gIF9TaWduYWxpbmdNZXNzc2FnZUhhbmRsZXIobWVzc2FnZSkge1xuICAgIExvZ2dlci5kZWJ1ZygnQ2hhbm5lbCByZWNlaXZlZCBtZXNzYWdlOiAnICsgbWVzc2FnZSk7XG4gICAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcbiAgICAgIGNhc2UgU2lnbmFsaW5nVHlwZS5VQTpcbiAgICAgICAgdGhpcy5faGFuZGxlUmVtb3RlQ2FwYWJpbGl0eShtZXNzYWdlLmRhdGEpO1xuICAgICAgICB0aGlzLl9zZW5kU3lzSW5mb0lmTmVjZXNzYXJ5KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTaWduYWxpbmdUeXBlLlRSQUNLX1NPVVJDRVM6XG4gICAgICAgIHRoaXMuX3RyYWNrU291cmNlc0hhbmRsZXIobWVzc2FnZS5kYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNpZ25hbGluZ1R5cGUuU1RSRUFNX0lORk86XG4gICAgICAgIHRoaXMuX3N0cmVhbUluZm9IYW5kbGVyKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTaWduYWxpbmdUeXBlLlNEUDpcbiAgICAgICAgdGhpcy5fc2RwSGFuZGxlcihtZXNzYWdlLmRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU2lnbmFsaW5nVHlwZS5UUkFDS1NfQURERUQ6XG4gICAgICAgIHRoaXMuX3RyYWNrc0FkZGVkSGFuZGxlcihtZXNzYWdlLmRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU2lnbmFsaW5nVHlwZS5UUkFDS1NfUkVNT1ZFRDpcbiAgICAgICAgdGhpcy5fdHJhY2tzUmVtb3ZlZEhhbmRsZXIobWVzc2FnZS5kYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNpZ25hbGluZ1R5cGUuREFUQV9SRUNFSVZFRDpcbiAgICAgICAgdGhpcy5fZGF0YVJlY2VpdmVkSGFuZGxlcihtZXNzYWdlLmRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU2lnbmFsaW5nVHlwZS5DTE9TRUQ6XG4gICAgICAgIHRoaXMuX2NoYXRDbG9zZWRIYW5kbGVyKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgTG9nZ2VyLmVycm9yKCdJbnZhbGlkIHNpZ25hbGluZyBtZXNzYWdlIHJlY2VpdmVkLiBUeXBlOiAnICtcbiAgICAgICAgICAgIG1lc3NhZ2UudHlwZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBfdHJhY2tzQWRkZWRIYW5kbGVyXG4gICAqIEBkZXNjIEhhbmRsZSB0cmFjayBhZGRlZCBldmVudCBmcm9tIHJlbW90ZSBzaWRlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3RyYWNrc0FkZGVkSGFuZGxlcihpZHMpIHtcbiAgICAvLyBDdXJyZW50bHksIHxpZHN8IGNvbnRhaW5zIGFsbCB0cmFjayBJRHMgb2YgYSBNZWRpYVN0cmVhbS4gRm9sbG93aW5nIGFsZ29yaXRobSBhbHNvIGhhbmRsZXMgfGlkc3wgaXMgYSBwYXJ0IG9mIGEgTWVkaWFTdHJlYW0ncyB0cmFja3MuXG4gICAgZm9yIChjb25zdCBpZCBvZiBpZHMpIHtcbiAgICAgIC8vIEl0IGNvdWxkIGJlIGEgcHJvYmxlbSBpZiB0aGVyZSBpcyBhIHRyYWNrIHB1Ymxpc2hlZCB3aXRoIGRpZmZlcmVudCBNZWRpYVN0cmVhbXMuXG4gICAgICB0aGlzLl9wdWJsaXNoaW5nU3RyZWFtVHJhY2tzLmZvckVhY2goKG1lZGlhVHJhY2tJZHMsIG1lZGlhU3RyZWFtSWQpID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZWRpYVRyYWNrSWRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKG1lZGlhVHJhY2tJZHNbaV0gPT09IGlkKSB7XG4gICAgICAgICAgICAvLyBNb3ZlIHRoaXMgdHJhY2sgZnJvbSBwdWJsaXNoaW5nIHRyYWNrcyB0byBwdWJsaXNoZWQgdHJhY2tzLlxuICAgICAgICAgICAgaWYgKCF0aGlzLl9wdWJsaXNoZWRTdHJlYW1UcmFja3MuaGFzKG1lZGlhU3RyZWFtSWQpKSB7XG4gICAgICAgICAgICAgIHRoaXMuX3B1Ymxpc2hlZFN0cmVhbVRyYWNrcy5zZXQobWVkaWFTdHJlYW1JZCwgW10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fcHVibGlzaGVkU3RyZWFtVHJhY2tzLmdldChtZWRpYVN0cmVhbUlkKS5wdXNoKFxuICAgICAgICAgICAgICAgIG1lZGlhVHJhY2tJZHNbaV0pO1xuICAgICAgICAgICAgbWVkaWFUcmFja0lkcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFJlc29sdmluZyBjZXJ0YWluIHB1Ymxpc2ggcHJvbWlzZSB3aGVuIHJlbW90ZSBlbmRwb2ludCByZWNlaXZlZCBhbGwgdHJhY2tzIG9mIGEgTWVkaWFTdHJlYW0uXG4gICAgICAgICAgaWYgKG1lZGlhVHJhY2tJZHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fcHVibGlzaFByb21pc2VzLmhhcyhtZWRpYVN0cmVhbUlkKSkge1xuICAgICAgICAgICAgICBMb2dnZXIud2FybmluZygnQ2Fubm90IGZpbmQgdGhlIHByb21pc2UgZm9yIHB1Ymxpc2hpbmcgJyArXG4gICAgICAgICAgICAgICAgbWVkaWFTdHJlYW1JZCk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0U3RyZWFtSW5kZXggPSB0aGlzLl9wdWJsaXNoaW5nU3RyZWFtcy5maW5kSW5kZXgoXG4gICAgICAgICAgICAgICAgKGVsZW1lbnQpID0+IGVsZW1lbnQubWVkaWFTdHJlYW0uaWQgPT0gbWVkaWFTdHJlYW1JZCk7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRTdHJlYW0gPSB0aGlzLl9wdWJsaXNoaW5nU3RyZWFtc1t0YXJnZXRTdHJlYW1JbmRleF07XG4gICAgICAgICAgICB0aGlzLl9wdWJsaXNoaW5nU3RyZWFtcy5zcGxpY2UodGFyZ2V0U3RyZWFtSW5kZXgsIDEpO1xuICAgICAgICAgICAgY29uc3QgcHVibGljYXRpb24gPSBuZXcgUHVibGljYXRpb24oXG4gICAgICAgICAgICAgICAgaWQsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuX3VucHVibGlzaCh0YXJnZXRTdHJlYW0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBwdWJsaWNhdGlvbi5kaXNwYXRjaEV2ZW50KG5ldyBPd3RFdmVudCgnZW5kZWQnKSk7XG4gICAgICAgICAgICAgICAgICB9LCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAvLyBVc2UgZGVidWcgbW9kZSBiZWNhdXNlIHRoaXMgZXJyb3IgdXN1YWxseSBkb2Vzbid0IGJsb2NrIHN0b3BwaW5nIGEgcHVibGljYXRpb24uXG4gICAgICAgICAgICAgICAgICAgIExvZ2dlci5kZWJ1ZyhcbiAgICAgICAgICAgICAgICAgICAgICAgICdTb21ldGhpbmcgd3JvbmcgaGFwcGVuZWQgZHVyaW5nIHN0b3BwaW5nIGEgJytcbiAgICAgICAgICAgICAgICAgICAgICAgICdwdWJsaWNhdGlvbi4gJyArIGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmICghdGFyZ2V0U3RyZWFtIHx8ICF0YXJnZXRTdHJlYW0ubWVkaWFTdHJlYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX0lOVkFMSURfU1RBVEUsXG4gICAgICAgICAgICAgICAgICAgICAgICAnUHVibGljYXRpb24gaXMgbm90IGF2YWlsYWJsZS4nKSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRTdGF0cyh0YXJnZXRTdHJlYW0ubWVkaWFTdHJlYW0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5fcHVibGlzaGVkU3RyZWFtcy5zZXQodGFyZ2V0U3RyZWFtLCBwdWJsaWNhdGlvbik7XG4gICAgICAgICAgICB0aGlzLl9wdWJsaXNoUHJvbWlzZXMuZ2V0KG1lZGlhU3RyZWFtSWQpLnJlc29sdmUocHVibGljYXRpb24pO1xuICAgICAgICAgICAgdGhpcy5fcHVibGlzaFByb21pc2VzLmRlbGV0ZShtZWRpYVN0cmVhbUlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gX3RyYWNrc1JlbW92ZWRIYW5kbGVyXG4gICAqIEBkZXNjIEhhbmRsZSB0cmFjayByZW1vdmVkIGV2ZW50IGZyb20gcmVtb3RlIHNpZGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfdHJhY2tzUmVtb3ZlZEhhbmRsZXIoaWRzKSB7XG4gICAgLy8gQ3VycmVudGx5LCB8aWRzfCBjb250YWlucyBhbGwgdHJhY2sgSURzIG9mIGEgTWVkaWFTdHJlYW0uIEZvbGxvd2luZyBhbGdvcml0aG0gYWxzbyBoYW5kbGVzIHxpZHN8IGlzIGEgcGFydCBvZiBhIE1lZGlhU3RyZWFtJ3MgdHJhY2tzLlxuICAgIGZvciAoY29uc3QgaWQgb2YgaWRzKSB7XG4gICAgICAvLyBJdCBjb3VsZCBiZSBhIHByb2JsZW0gaWYgdGhlcmUgaXMgYSB0cmFjayBwdWJsaXNoZWQgd2l0aCBkaWZmZXJlbnQgTWVkaWFTdHJlYW1zLlxuICAgICAgdGhpcy5fcHVibGlzaGVkU3RyZWFtVHJhY2tzLmZvckVhY2goKG1lZGlhVHJhY2tJZHMsIG1lZGlhU3RyZWFtSWQpID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZWRpYVRyYWNrSWRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKG1lZGlhVHJhY2tJZHNbaV0gPT09IGlkKSB7XG4gICAgICAgICAgICBtZWRpYVRyYWNrSWRzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gX2RhdGFSZWNlaXZlZEhhbmRsZXJcbiAgICogQGRlc2MgSGFuZGxlIGRhdGEgcmVjZWl2ZWQgZXZlbnQgZnJvbSByZW1vdGUgc2lkZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9kYXRhUmVjZWl2ZWRIYW5kbGVyKGlkKSB7XG4gICAgaWYgKCF0aGlzLl9zZW5kRGF0YVByb21pc2VzLmhhcyhpZCkpIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdSZWNlaXZlZCB1bmtub3duIGRhdGEgcmVjZWl2ZWQgbWVzc2FnZS4gSUQ6ICcgKyBpZCk7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NlbmREYXRhUHJvbWlzZXMuZ2V0KGlkKS5yZXNvbHZlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBfc2RwSGFuZGxlclxuICAgKiBAZGVzYyBIYW5kbGUgU0RQIHJlY2VpdmVkIGV2ZW50IGZyb20gcmVtb3RlIHNpZGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfc2RwSGFuZGxlcihzZHApIHtcbiAgICBpZiAoc2RwLnR5cGUgPT09ICdvZmZlcicpIHtcbiAgICAgIHRoaXMuX29uT2ZmZXIoc2RwKTtcbiAgICB9IGVsc2UgaWYgKHNkcC50eXBlID09PSAnYW5zd2VyJykge1xuICAgICAgdGhpcy5fb25BbnN3ZXIoc2RwKTtcbiAgICB9IGVsc2UgaWYgKHNkcC50eXBlID09PSAnY2FuZGlkYXRlcycpIHtcbiAgICAgIHRoaXMuX29uUmVtb3RlSWNlQ2FuZGlkYXRlKHNkcCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBfdHJhY2tTb3VyY2VzSGFuZGxlclxuICAgKiBAZGVzYyBSZWNlaXZlZCB0cmFjayBzb3VyY2UgaW5mb3JtYXRpb24gZnJvbSByZW1vdGUgc2lkZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF90cmFja1NvdXJjZXNIYW5kbGVyKGRhdGEpIHtcbiAgICBmb3IgKGNvbnN0IGluZm8gb2YgZGF0YSkge1xuICAgICAgdGhpcy5fcmVtb3RlVHJhY2tTb3VyY2VJbmZvLnNldChpbmZvLmlkLCBpbmZvLnNvdXJjZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBfc3RyZWFtSW5mb0hhbmRsZXJcbiAgICogQGRlc2MgUmVjZWl2ZWQgc3RyZWFtIGluZm9ybWF0aW9uIGZyb20gcmVtb3RlIHNpZGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfc3RyZWFtSW5mb0hhbmRsZXIoZGF0YSkge1xuICAgIGlmICghZGF0YSkge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ1VuZXhwZWN0ZWQgc3RyZWFtIGluZm8uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX3JlbW90ZVN0cmVhbUluZm8uc2V0KGRhdGEuaWQsIHtcbiAgICAgIHNvdXJjZTogZGF0YS5zb3VyY2UsXG4gICAgICBhdHRyaWJ1dGVzOiBkYXRhLmF0dHJpYnV0ZXMsXG4gICAgICBzdHJlYW06IG51bGwsXG4gICAgICBtZWRpYVN0cmVhbTogbnVsbCxcbiAgICAgIHRyYWNrSWRzOiBkYXRhLnRyYWNrcywgLy8gVHJhY2sgSURzIG1heSBub3QgbWF0Y2ggYXQgc2VuZGVyIGFuZCByZWNlaXZlciBzaWRlcy4gS2VlcCBpdCBmb3IgbGVnYWN5IHBvcnBvc2VzLlxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBfY2hhdENsb3NlZEhhbmRsZXJcbiAgICogQGRlc2MgUmVjZWl2ZWQgY2hhdCBjbG9zZWQgZXZlbnQgZnJvbSByZW1vdGUgc2lkZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jaGF0Q2xvc2VkSGFuZGxlcihkYXRhKSB7XG4gICAgdGhpcy5fZGlzcG9zZWQgPSB0cnVlO1xuICAgIHRoaXMuX3N0b3AoZGF0YSwgZmFsc2UpO1xuICB9XG5cbiAgX29uT2ZmZXIoc2RwKSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdBYm91dCB0byBzZXQgcmVtb3RlIGRlc2NyaXB0aW9uLiBTaWduYWxpbmcgc3RhdGU6ICcgK1xuICAgICAgdGhpcy5fcGMuc2lnbmFsaW5nU3RhdGUpO1xuICAgIHNkcC5zZHAgPSB0aGlzLl9zZXRSdHBTZW5kZXJPcHRpb25zKHNkcC5zZHAsIHRoaXMuX2NvbmZpZyk7XG4gICAgLy8gRmlyZWZveCBvbmx5IGhhcyBvbmUgY29kZWMgaW4gYW5zd2VyLCB3aGljaCBkb2VzIG5vdCB0cnVseSByZWZsZWN0IGl0c1xuICAgIC8vIGRlY29kaW5nIGNhcGFiaWxpdHkuIFNvIHdlIHNldCBjb2RlYyBwcmVmZXJlbmNlIHRvIHJlbW90ZSBvZmZlciwgYW5kIGxldFxuICAgIC8vIEZpcmVmb3ggY2hvb3NlIGl0cyBwcmVmZXJyZWQgY29kZWMuXG4gICAgLy8gUmVmZXJlbmNlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD04MTQyMjcuXG4gICAgaWYgKFV0aWxzLmlzRmlyZWZveCgpKSB7XG4gICAgICBzZHAuc2RwID0gdGhpcy5fc2V0Q29kZWNPcmRlcihzZHAuc2RwKTtcbiAgICB9XG4gICAgY29uc3Qgc2Vzc2lvbkRlc2NyaXB0aW9uID0gbmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihzZHApO1xuICAgIHRoaXMuX3BjLnNldFJlbW90ZURlc2NyaXB0aW9uKHNlc3Npb25EZXNjcmlwdGlvbikudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLl9jcmVhdGVBbmRTZW5kQW5zd2VyKCk7XG4gICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICBMb2dnZXIuZGVidWcoJ1NldCByZW1vdGUgZGVzY3JpcHRpb24gZmFpbGVkLiBNZXNzYWdlOiAnICsgZXJyb3IubWVzc2FnZSk7XG4gICAgICB0aGlzLl9zdG9wKGVycm9yLCB0cnVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9vbkFuc3dlcihzZHApIHtcbiAgICBMb2dnZXIuZGVidWcoJ0Fib3V0IHRvIHNldCByZW1vdGUgZGVzY3JpcHRpb24uIFNpZ25hbGluZyBzdGF0ZTogJyArXG4gICAgICB0aGlzLl9wYy5zaWduYWxpbmdTdGF0ZSk7XG4gICAgc2RwLnNkcCA9IHRoaXMuX3NldFJ0cFNlbmRlck9wdGlvbnMoc2RwLnNkcCwgdGhpcy5fY29uZmlnKTtcbiAgICBjb25zdCBzZXNzaW9uRGVzY3JpcHRpb24gPSBuZXcgUlRDU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCk7XG4gICAgdGhpcy5fcGMuc2V0UmVtb3RlRGVzY3JpcHRpb24obmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihcbiAgICAgICAgc2Vzc2lvbkRlc2NyaXB0aW9uKSkudGhlbigoKSA9PiB7XG4gICAgICBMb2dnZXIuZGVidWcoJ1NldCByZW1vdGUgZGVzY3JpcGl0b24gc3VjY2Vzc2Z1bGx5LicpO1xuICAgICAgdGhpcy5fZHJhaW5QZW5kaW5nTWVzc2FnZXMoKTtcbiAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgIExvZ2dlci5kZWJ1ZygnU2V0IHJlbW90ZSBkZXNjcmlwdGlvbiBmYWlsZWQuIE1lc3NhZ2U6ICcgKyBlcnJvci5tZXNzYWdlKTtcbiAgICAgIHRoaXMuX3N0b3AoZXJyb3IsIHRydWUpO1xuICAgIH0pO1xuICB9XG5cbiAgX29uTG9jYWxJY2VDYW5kaWRhdGUoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuY2FuZGlkYXRlKSB7XG4gICAgICB0aGlzLl9zZW5kU2RwKHtcbiAgICAgICAgdHlwZTogJ2NhbmRpZGF0ZXMnLFxuICAgICAgICBjYW5kaWRhdGU6IGV2ZW50LmNhbmRpZGF0ZS5jYW5kaWRhdGUsXG4gICAgICAgIHNkcE1pZDogZXZlbnQuY2FuZGlkYXRlLnNkcE1pZCxcbiAgICAgICAgc2RwTUxpbmVJbmRleDogZXZlbnQuY2FuZGlkYXRlLnNkcE1MaW5lSW5kZXgsXG4gICAgICB9KS5jYXRjaCgoZSk9PntcbiAgICAgICAgTG9nZ2VyLndhcm5pbmcoJ0ZhaWxlZCB0byBzZW5kIGNhbmRpZGF0ZS4nKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBMb2dnZXIuZGVidWcoJ0VtcHR5IGNhbmRpZGF0ZS4nKTtcbiAgICB9XG4gIH1cblxuICBfb25SZW1vdGVUcmFja0FkZGVkKGV2ZW50KSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdSZW1vdGUgdHJhY2sgYWRkZWQuJyk7XG4gICAgZm9yIChjb25zdCBzdHJlYW0gb2YgZXZlbnQuc3RyZWFtcykge1xuICAgICAgaWYgKCF0aGlzLl9yZW1vdGVTdHJlYW1JbmZvLmhhcyhzdHJlYW0uaWQpKSB7XG4gICAgICAgIExvZ2dlci53YXJuaW5nKCdNaXNzaW5nIHN0cmVhbSBpbmZvLicpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuX3JlbW90ZVN0cmVhbUluZm8uZ2V0KHN0cmVhbS5pZCkuc3RyZWFtKSB7XG4gICAgICAgIHRoaXMuX3NldFN0cmVhbVRvUmVtb3RlU3RyZWFtSW5mbyhzdHJlYW0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5fcGMuaWNlQ29ubmVjdGlvblN0YXRlID09PSAnY29ubmVjdGVkJyB8fFxuICAgICAgIHRoaXMuX3BjLmljZUNvbm5lY3Rpb25TdGF0ZSA9PT0gJ2NvbXBsZXRlZCcpIHtcbiAgICAgIHRoaXMuX2NoZWNrSWNlQ29ubmVjdGlvblN0YXRlQW5kRmlyZUV2ZW50KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2FkZGVkVHJhY2tJZHMuY29uY2F0KGV2ZW50LnRyYWNrLmlkKTtcbiAgICB9XG4gIH1cblxuICBfb25SZW1vdGVTdHJlYW1BZGRlZChldmVudCkge1xuICAgIExvZ2dlci5kZWJ1ZygnUmVtb3RlIHN0cmVhbSBhZGRlZC4nKTtcbiAgICBpZiAoIXRoaXMuX3JlbW90ZVN0cmVhbUluZm8uaGFzKGV2ZW50LnN0cmVhbS5pZCkpIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdDYW5ub3QgZmluZCBzb3VyY2UgaW5mbyBmb3Igc3RyZWFtICcgKyBldmVudC5zdHJlYW0uaWQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5fcGMuaWNlQ29ubmVjdGlvblN0YXRlID09PSAnY29ubmVjdGVkJyB8fFxuICAgICAgdGhpcy5fcGMuaWNlQ29ubmVjdGlvblN0YXRlID09PSAnY29tcGxldGVkJykge1xuICAgICAgdGhpcy5fc2VuZFNpZ25hbGluZ01lc3NhZ2UoU2lnbmFsaW5nVHlwZS5UUkFDS1NfQURERUQsXG4gICAgICAgICAgdGhpcy5fcmVtb3RlU3RyZWFtSW5mby5nZXQoZXZlbnQuc3RyZWFtLmlkKS50cmFja0lkcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2FkZGVkVHJhY2tJZHMgPSB0aGlzLl9hZGRlZFRyYWNrSWRzLmNvbmNhdChcbiAgICAgICAgICB0aGlzLl9yZW1vdGVTdHJlYW1JbmZvLmdldChldmVudC5zdHJlYW0uaWQpLnRyYWNrSWRzKTtcbiAgICB9XG4gICAgY29uc3QgYXVkaW9UcmFja1NvdXJjZSA9IHRoaXMuX3JlbW90ZVN0cmVhbUluZm8uZ2V0KGV2ZW50LnN0cmVhbS5pZClcbiAgICAgICAgLnNvdXJjZS5hdWRpbztcbiAgICBjb25zdCB2aWRlb1RyYWNrU291cmNlID0gdGhpcy5fcmVtb3RlU3RyZWFtSW5mby5nZXQoZXZlbnQuc3RyZWFtLmlkKVxuICAgICAgICAuc291cmNlLnZpZGVvO1xuICAgIGNvbnN0IHNvdXJjZUluZm8gPSBuZXcgU3RyZWFtTW9kdWxlLlN0cmVhbVNvdXJjZUluZm8oYXVkaW9UcmFja1NvdXJjZSxcbiAgICAgICAgdmlkZW9UcmFja1NvdXJjZSk7XG4gICAgaWYgKFV0aWxzLmlzU2FmYXJpKCkpIHtcbiAgICAgIGlmICghc291cmNlSW5mby5hdWRpbykge1xuICAgICAgICBldmVudC5zdHJlYW0uZ2V0QXVkaW9UcmFja3MoKS5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgICAgIGV2ZW50LnN0cmVhbS5yZW1vdmVUcmFjayh0cmFjayk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKCFzb3VyY2VJbmZvLnZpZGVvKSB7XG4gICAgICAgIGV2ZW50LnN0cmVhbS5nZXRWaWRlb1RyYWNrcygpLmZvckVhY2goKHRyYWNrKSA9PiB7XG4gICAgICAgICAgZXZlbnQuc3RyZWFtLnJlbW92ZVRyYWNrKHRyYWNrKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSB0aGlzLl9yZW1vdGVTdHJlYW1JbmZvLmdldChldmVudC5zdHJlYW0uaWQpLmF0dHJpYnV0ZXM7XG4gICAgY29uc3Qgc3RyZWFtID0gbmV3IFN0cmVhbU1vZHVsZS5SZW1vdGVTdHJlYW0odW5kZWZpbmVkLCB0aGlzLl9yZW1vdGVJZCxcbiAgICAgICAgZXZlbnQuc3RyZWFtLCBzb3VyY2VJbmZvLCBhdHRyaWJ1dGVzKTtcbiAgICBpZiAoc3RyZWFtKSB7XG4gICAgICB0aGlzLl9yZW1vdGVTdHJlYW1zLnB1c2goc3RyZWFtKTtcbiAgICAgIGNvbnN0IHN0cmVhbUV2ZW50ID0gbmV3IFN0cmVhbU1vZHVsZS5TdHJlYW1FdmVudCgnc3RyZWFtYWRkZWQnLCB7XG4gICAgICAgIHN0cmVhbTogc3RyZWFtLFxuICAgICAgfSk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoc3RyZWFtRXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIF9vblJlbW90ZVN0cmVhbVJlbW92ZWQoZXZlbnQpIHtcbiAgICBMb2dnZXIuZGVidWcoJ1JlbW90ZSBzdHJlYW0gcmVtb3ZlZC4nKTtcbiAgICBjb25zdCBpID0gdGhpcy5fcmVtb3RlU3RyZWFtcy5maW5kSW5kZXgoKHMpID0+IHtcbiAgICAgIHJldHVybiBzLm1lZGlhU3RyZWFtLmlkID09PSBldmVudC5zdHJlYW0uaWQ7XG4gICAgfSk7XG4gICAgaWYgKGkgIT09IC0xKSB7XG4gICAgICBjb25zdCBzdHJlYW0gPSB0aGlzLl9yZW1vdGVTdHJlYW1zW2ldO1xuICAgICAgdGhpcy5fc3RyZWFtUmVtb3ZlZChzdHJlYW0pO1xuICAgICAgdGhpcy5fcmVtb3RlU3RyZWFtcy5zcGxpY2UoaSwgMSk7XG4gICAgfVxuICB9XG5cbiAgX29uTmVnb3RpYXRpb25uZWVkZWQoKSB7XG4gICAgLy8gVGhpcyBpcyBpbnRlbnRlZCB0byBiZSBleGVjdXRlZCB3aGVuIG9ubmVnb3RpYXRpb25uZWVkZWQgZXZlbnQgaXMgZmlyZWQuXG4gICAgLy8gSG93ZXZlciwgb25uZWdvdGlhdGlvbm5lZWRlZCBtYXkgZmlyZSBtdXRpcGxlIHRpbWVzIHdoZW4gbW9yZSB0aGFuIG9uZVxuICAgIC8vIHRyYWNrIGlzIGFkZGVkL3JlbW92ZWQuIFNvIHdlIG1hbnVhbGx5IGV4ZWN1dGUgdGhpcyBmdW5jdGlvbiBhZnRlclxuICAgIC8vIGFkZGluZy9yZW1vdmluZyB0cmFjayBhbmQgY3JlYXRpbmcgZGF0YSBjaGFubmVsLlxuICAgIExvZ2dlci5kZWJ1ZygnT24gbmVnb3RpYXRpb24gbmVlZGVkLicpO1xuXG4gICAgaWYgKHRoaXMuX3BjLnNpZ25hbGluZ1N0YXRlID09PSAnc3RhYmxlJykge1xuICAgICAgdGhpcy5fZG9OZWdvdGlhdGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faXNOZWdvdGlhdGlvbk5lZWRlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgX29uUmVtb3RlSWNlQ2FuZGlkYXRlKGNhbmRpZGF0ZUluZm8pIHtcbiAgICBjb25zdCBjYW5kaWRhdGUgPSBuZXcgUlRDSWNlQ2FuZGlkYXRlKHtcbiAgICAgIGNhbmRpZGF0ZTogY2FuZGlkYXRlSW5mby5jYW5kaWRhdGUsXG4gICAgICBzZHBNaWQ6IGNhbmRpZGF0ZUluZm8uc2RwTWlkLFxuICAgICAgc2RwTUxpbmVJbmRleDogY2FuZGlkYXRlSW5mby5zZHBNTGluZUluZGV4LFxuICAgIH0pO1xuICAgIGlmICh0aGlzLl9wYy5yZW1vdGVEZXNjcmlwdGlvbiAmJiB0aGlzLl9wYy5yZW1vdGVEZXNjcmlwdGlvbi5zZHAgIT09ICcnKSB7XG4gICAgICBMb2dnZXIuZGVidWcoJ0FkZCByZW1vdGUgaWNlIGNhbmRpZGF0ZXMuJyk7XG4gICAgICB0aGlzLl9wYy5hZGRJY2VDYW5kaWRhdGUoY2FuZGlkYXRlKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgTG9nZ2VyLndhcm5pbmcoJ0Vycm9yIHByb2Nlc3NpbmcgSUNFIGNhbmRpZGF0ZTogJyArIGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBMb2dnZXIuZGVidWcoJ0NhY2hlIHJlbW90ZSBpY2UgY2FuZGlkYXRlcy4nKTtcbiAgICAgIHRoaXMuX3JlbW90ZUljZUNhbmRpZGF0ZXMucHVzaChjYW5kaWRhdGUpO1xuICAgIH1cbiAgfVxuXG4gIF9vblNpZ25hbGluZ1N0YXRlQ2hhbmdlKGV2ZW50KSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdTaWduYWxpbmcgc3RhdGUgY2hhbmdlZDogJyArIHRoaXMuX3BjLnNpZ25hbGluZ1N0YXRlKTtcbiAgICBpZiAodGhpcy5fcGMuc2lnbmFsaW5nU3RhdGUgPT09ICdjbG9zZWQnKSB7XG4gICAgICAvLyBzdG9wQ2hhdExvY2FsbHkocGVlciwgcGVlci5pZCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9wYy5zaWduYWxpbmdTdGF0ZSA9PT0gJ3N0YWJsZScpIHtcbiAgICAgIHRoaXMuX25lZ290aWF0aW5nID0gZmFsc2U7XG4gICAgICBpZiAodGhpcy5faXNOZWdvdGlhdGlvbk5lZWRlZCkge1xuICAgICAgICB0aGlzLl9vbk5lZ290aWF0aW9ubmVlZGVkKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9kcmFpblBlbmRpbmdTdHJlYW1zKCk7XG4gICAgICAgIHRoaXMuX2RyYWluUGVuZGluZ01lc3NhZ2VzKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLl9wYy5zaWduYWxpbmdTdGF0ZSA9PT0gJ2hhdmUtcmVtb3RlLW9mZmVyJykge1xuICAgICAgdGhpcy5fZHJhaW5QZW5kaW5nUmVtb3RlSWNlQ2FuZGlkYXRlcygpO1xuICAgIH1cbiAgfVxuXG4gIF9vbkljZUNvbm5lY3Rpb25TdGF0ZUNoYW5nZShldmVudCkge1xuICAgIGlmIChldmVudC5jdXJyZW50VGFyZ2V0LmljZUNvbm5lY3Rpb25TdGF0ZSA9PT0gJ2Nsb3NlZCcgfHxcbiAgICAgICAgZXZlbnQuY3VycmVudFRhcmdldC5pY2VDb25uZWN0aW9uU3RhdGUgPT09ICdmYWlsZWQnKSB7XG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihcbiAgICAgICAgICBFcnJvck1vZHVsZS5lcnJvcnMuUDJQX1dFQlJUQ19VTktOT1dOLFxuICAgICAgICAgICdJQ0UgY29ubmVjdGlvbiBmYWlsZWQgb3IgY2xvc2VkLicpO1xuICAgICAgdGhpcy5fc3RvcChlcnJvciwgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmIChldmVudC5jdXJyZW50VGFyZ2V0LmljZUNvbm5lY3Rpb25TdGF0ZSA9PT0gJ2Nvbm5lY3RlZCcgfHxcbiAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQuaWNlQ29ubmVjdGlvblN0YXRlID09PSAnY29tcGxldGVkJykge1xuICAgICAgdGhpcy5fc2VuZFNpZ25hbGluZ01lc3NhZ2UoU2lnbmFsaW5nVHlwZS5UUkFDS1NfQURERUQsXG4gICAgICAgICAgdGhpcy5fYWRkZWRUcmFja0lkcyk7XG4gICAgICB0aGlzLl9hZGRlZFRyYWNrSWRzID0gW107XG4gICAgICB0aGlzLl9jaGVja0ljZUNvbm5lY3Rpb25TdGF0ZUFuZEZpcmVFdmVudCgpO1xuICAgIH1cbiAgfVxuXG4gIF9vbkRhdGFDaGFubmVsTWVzc2FnZShldmVudCkge1xuICAgIGNvbnN0IG1lc3NhZ2U9SlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICBMb2dnZXIuZGVidWcoJ0RhdGEgY2hhbm5lbCBtZXNzYWdlIHJlY2VpdmVkOiAnK21lc3NhZ2UuZGF0YSk7XG4gICAgdGhpcy5fc2VuZFNpZ25hbGluZ01lc3NhZ2UoU2lnbmFsaW5nVHlwZS5EQVRBX1JFQ0VJVkVELCBtZXNzYWdlLmlkKTtcbiAgICBjb25zdCBtZXNzYWdlRXZlbnQgPSBuZXcgTWVzc2FnZUV2ZW50KCdtZXNzYWdlcmVjZWl2ZWQnLCB7XG4gICAgICBtZXNzYWdlOiBtZXNzYWdlLmRhdGEsXG4gICAgICBvcmlnaW46IHRoaXMuX3JlbW90ZUlkLFxuICAgIH0pO1xuICAgIHRoaXMuZGlzcGF0Y2hFdmVudChtZXNzYWdlRXZlbnQpO1xuICB9XG5cbiAgX29uRGF0YUNoYW5uZWxPcGVuKGV2ZW50KSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdEYXRhIENoYW5uZWwgaXMgb3BlbmVkLicpO1xuICAgIGlmIChldmVudC50YXJnZXQubGFiZWwgPT09IERhdGFDaGFubmVsTGFiZWwuTUVTU0FHRSkge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdEYXRhIGNoYW5uZWwgZm9yIG1lc3NhZ2VzIGlzIG9wZW5lZC4nKTtcbiAgICAgIHRoaXMuX2RyYWluUGVuZGluZ01lc3NhZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgX29uRGF0YUNoYW5uZWxDbG9zZShldmVudCkge1xuICAgIExvZ2dlci5kZWJ1ZygnRGF0YSBDaGFubmVsIGlzIGNsb3NlZC4nKTtcbiAgfVxuXG4gIF9zdHJlYW1SZW1vdmVkKHN0cmVhbSkge1xuICAgIGlmICghdGhpcy5fcmVtb3RlU3RyZWFtSW5mby5oYXMoc3RyZWFtLm1lZGlhU3RyZWFtLmlkKSkge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ0Nhbm5vdCBmaW5kIHN0cmVhbSBpbmZvLicpO1xuICAgIH1cbiAgICB0aGlzLl9zZW5kU2lnbmFsaW5nTWVzc2FnZShTaWduYWxpbmdUeXBlLlRSQUNLU19SRU1PVkVELFxuICAgICAgICB0aGlzLl9yZW1vdGVTdHJlYW1JbmZvLmdldChzdHJlYW0ubWVkaWFTdHJlYW0uaWQpLnRyYWNrSWRzKTtcbiAgICBjb25zdCBldmVudCA9IG5ldyBPd3RFdmVudCgnZW5kZWQnKTtcbiAgICBzdHJlYW0uZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH1cblxuICBfaXNVbmlmaWVkUGxhbigpIHtcbiAgICBpZiAoVXRpbHMuaXNGaXJlZm94KCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjb25zdCBwYyA9IG5ldyBSVENQZWVyQ29ubmVjdGlvbih7XG4gICAgICBzZHBTZW1hbnRpY3M6ICd1bmlmaWVkLXBsYW4nLFxuICAgIH0pO1xuICAgIHJldHVybiAocGMuZ2V0Q29uZmlndXJhdGlvbigpICYmIHBjLmdldENvbmZpZ3VyYXRpb24oKS5zZHBTZW1hbnRpY3MgPT09XG4gICAgICAncGxhbi1iJyk7XG4gIH1cblxuICBfY3JlYXRlUGVlckNvbm5lY3Rpb24oKSB7XG4gICAgY29uc3QgcGNDb25maWd1cmF0aW9uID0gdGhpcy5fY29uZmlnLnJ0Y0NvbmZpZ3VyYXRpb24gfHwge307XG4gICAgaWYgKFV0aWxzLmlzQ2hyb21lKCkpIHtcbiAgICAgIHBjQ29uZmlndXJhdGlvbi5zZHBTZW1hbnRpY3MgPSAndW5pZmllZC1wbGFuJztcbiAgICB9XG4gICAgdGhpcy5fcGMgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24ocGNDb25maWd1cmF0aW9uKTtcbiAgICAvLyBGaXJlZm94IDU5IGltcGxlbWVudGVkIGFkZFRyYW5zY2VpdmVyLiBIb3dldmVyLCBtaWQgaW4gU0RQIHdpbGwgZGlmZmVyIGZyb20gdHJhY2sncyBJRCBpbiB0aGlzIGNhc2UuIEFuZCB0cmFuc2NlaXZlcidzIG1pZCBpcyBudWxsLlxuICAgIGlmICh0eXBlb2YgdGhpcy5fcGMuYWRkVHJhbnNjZWl2ZXIgPT09ICdmdW5jdGlvbicgJiYgVXRpbHMuaXNTYWZhcmkoKSkge1xuICAgICAgdGhpcy5fcGMuYWRkVHJhbnNjZWl2ZXIoJ2F1ZGlvJyk7XG4gICAgICB0aGlzLl9wYy5hZGRUcmFuc2NlaXZlcigndmlkZW8nKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9pc1VuaWZpZWRQbGFuKCkpIHtcbiAgICAgIHRoaXMuX3BjLm9uYWRkc3RyZWFtID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIC8vIFRPRE86IExlZ2FjeSBBUEksIHNob3VsZCBiZSByZW1vdmVkIHdoZW4gYWxsIFVBcyBpbXBsZW1lbnRlZCBXZWJSVEMgMS4wLlxuICAgICAgICB0aGlzLl9vblJlbW90ZVN0cmVhbUFkZGVkLmFwcGx5KHRoaXMsIFtldmVudF0pO1xuICAgICAgfTtcbiAgICAgIHRoaXMuX3BjLm9ucmVtb3Zlc3RyZWFtID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuX29uUmVtb3RlU3RyZWFtUmVtb3ZlZC5hcHBseSh0aGlzLCBbZXZlbnRdKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3BjLm9udHJhY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5fb25SZW1vdGVUcmFja0FkZGVkLmFwcGx5KHRoaXMsIFtldmVudF0pO1xuICAgICAgfTtcbiAgICB9XG4gICAgdGhpcy5fcGMub25pY2VjYW5kaWRhdGUgPSAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX29uTG9jYWxJY2VDYW5kaWRhdGUuYXBwbHkodGhpcywgW2V2ZW50XSk7XG4gICAgfTtcbiAgICB0aGlzLl9wYy5vbnNpZ25hbGluZ3N0YXRlY2hhbmdlID0gKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl9vblNpZ25hbGluZ1N0YXRlQ2hhbmdlLmFwcGx5KHRoaXMsIFtldmVudF0pO1xuICAgIH07XG4gICAgdGhpcy5fcGMub25kYXRhY2hhbm5lbCA9IChldmVudCkgPT4ge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdPbiBkYXRhIGNoYW5uZWwuJyk7XG4gICAgICAvLyBTYXZlIHJlbW90ZSBjcmVhdGVkIGRhdGEgY2hhbm5lbC5cbiAgICAgIGlmICghdGhpcy5fZGF0YUNoYW5uZWxzLmhhcyhldmVudC5jaGFubmVsLmxhYmVsKSkge1xuICAgICAgICB0aGlzLl9kYXRhQ2hhbm5lbHMuc2V0KGV2ZW50LmNoYW5uZWwubGFiZWwsIGV2ZW50LmNoYW5uZWwpO1xuICAgICAgICBMb2dnZXIuZGVidWcoJ1NhdmUgcmVtb3RlIGNyZWF0ZWQgZGF0YSBjaGFubmVsLicpO1xuICAgICAgfVxuICAgICAgdGhpcy5fYmluZEV2ZW50c1RvRGF0YUNoYW5uZWwoZXZlbnQuY2hhbm5lbCk7XG4gICAgfTtcbiAgICB0aGlzLl9wYy5vbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSA9IChldmVudCkgPT4ge1xuICAgICAgdGhpcy5fb25JY2VDb25uZWN0aW9uU3RhdGVDaGFuZ2UuYXBwbHkodGhpcywgW2V2ZW50XSk7XG4gICAgfTtcbiAgICAvKlxuICAgIHRoaXMuX3BjLm9uaWNlQ2hhbm5lbFN0YXRlY2hhbmdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIF9vbkljZUNoYW5uZWxTdGF0ZUNoYW5nZShwZWVyLCBldmVudCk7XG4gICAgfTtcbiAgICAgPSBmdW5jdGlvbigpIHtcbiAgICAgIG9uTmVnb3RpYXRpb25uZWVkZWQocGVlcnNbcGVlci5pZF0pO1xuICAgIH07XG5cbiAgICAvL0RhdGFDaGFubmVsXG4gICAgdGhpcy5fcGMub25kYXRhY2hhbm5lbCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBMb2dnZXIuZGVidWcobXlJZCArICc6IE9uIGRhdGEgY2hhbm5lbCcpO1xuICAgICAgLy8gU2F2ZSByZW1vdGUgY3JlYXRlZCBkYXRhIGNoYW5uZWwuXG4gICAgICBpZiAoIXBlZXIuZGF0YUNoYW5uZWxzW2V2ZW50LmNoYW5uZWwubGFiZWxdKSB7XG4gICAgICAgIHBlZXIuZGF0YUNoYW5uZWxzW2V2ZW50LmNoYW5uZWwubGFiZWxdID0gZXZlbnQuY2hhbm5lbDtcbiAgICAgICAgTG9nZ2VyLmRlYnVnKCdTYXZlIHJlbW90ZSBjcmVhdGVkIGRhdGEgY2hhbm5lbC4nKTtcbiAgICAgIH1cbiAgICAgIGJpbmRFdmVudHNUb0RhdGFDaGFubmVsKGV2ZW50LmNoYW5uZWwsIHBlZXIpO1xuICAgIH07Ki9cbiAgfVxuXG4gIF9kcmFpblBlbmRpbmdTdHJlYW1zKCkge1xuICAgIGxldCBuZWdvdGlhdGlvbk5lZWRlZCA9IGZhbHNlO1xuICAgIExvZ2dlci5kZWJ1ZygnRHJhaW5pbmcgcGVuZGluZyBzdHJlYW1zLicpO1xuICAgIGlmICh0aGlzLl9wYyAmJiB0aGlzLl9wYy5zaWduYWxpbmdTdGF0ZSA9PT0gJ3N0YWJsZScpIHtcbiAgICAgIExvZ2dlci5kZWJ1ZygnUGVlciBjb25uZWN0aW9uIGlzIHJlYWR5IGZvciBkcmFpbmluZyBwZW5kaW5nIHN0cmVhbXMuJyk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3BlbmRpbmdTdHJlYW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHN0cmVhbSA9IHRoaXMuX3BlbmRpbmdTdHJlYW1zW2ldO1xuICAgICAgICAvLyBPbk5lZ290aWF0aW9uTmVlZGVkIGV2ZW50IHdpbGwgYmUgdHJpZ2dlcmVkIGltbWVkaWF0ZWx5IGFmdGVyIGFkZGluZyBzdHJlYW0gdG8gUGVlckNvbm5lY3Rpb24gaW4gRmlyZWZveC5cbiAgICAgICAgLy8gQW5kIE9uTmVnb3RpYXRpb25OZWVkZWQgaGFuZGxlciB3aWxsIGV4ZWN1dGUgZHJhaW5QZW5kaW5nU3RyZWFtcy4gVG8gYXZvaWQgYWRkIHRoZSBzYW1lIHN0cmVhbSBtdWx0aXBsZSB0aW1lcyxcbiAgICAgICAgLy8gc2hpZnQgaXQgZnJvbSBwZW5kaW5nIHN0cmVhbSBsaXN0IGJlZm9yZSBhZGRpbmcgaXQgdG8gUGVlckNvbm5lY3Rpb24uXG4gICAgICAgIHRoaXMuX3BlbmRpbmdTdHJlYW1zLnNoaWZ0KCk7XG4gICAgICAgIGlmICghc3RyZWFtLm1lZGlhU3RyZWFtKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCB0cmFjayBvZiBzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0VHJhY2tzKCkpIHtcbiAgICAgICAgICB0aGlzLl9wYy5hZGRUcmFjayh0cmFjaywgc3RyZWFtLm1lZGlhU3RyZWFtKTtcbiAgICAgICAgICBuZWdvdGlhdGlvbk5lZWRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgTG9nZ2VyLmRlYnVnKCdBZGRlZCBzdHJlYW0gdG8gcGVlciBjb25uZWN0aW9uLicpO1xuICAgICAgICB0aGlzLl9wdWJsaXNoaW5nU3RyZWFtcy5wdXNoKHN0cmVhbSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9wZW5kaW5nU3RyZWFtcy5sZW5ndGggPSAwO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLl9wZW5kaW5nVW5wdWJsaXNoU3RyZWFtcy5sZW5ndGg7IGorKykge1xuICAgICAgICBpZiAoIXRoaXMuX3BlbmRpbmdVbnB1Ymxpc2hTdHJlYW1zW2pdLm1lZGlhU3RyZWFtKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcGMucmVtb3ZlU3RyZWFtKHRoaXMuX3BlbmRpbmdVbnB1Ymxpc2hTdHJlYW1zW2pdLm1lZGlhU3RyZWFtKTtcbiAgICAgICAgbmVnb3RpYXRpb25OZWVkZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl91bnB1Ymxpc2hQcm9taXNlcy5nZXQoXG4gICAgICAgICAgICB0aGlzLl9wZW5kaW5nVW5wdWJsaXNoU3RyZWFtc1tqXS5tZWRpYVN0cmVhbS5pZCkucmVzb2x2ZSgpO1xuICAgICAgICB0aGlzLl9wdWJsaXNoZWRTdHJlYW1zLmRlbGV0ZSh0aGlzLl9wZW5kaW5nVW5wdWJsaXNoU3RyZWFtc1tqXSk7XG4gICAgICAgIExvZ2dlci5kZWJ1ZygnUmVtb3ZlIHN0cmVhbS4nKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3BlbmRpbmdVbnB1Ymxpc2hTdHJlYW1zLmxlbmd0aCA9IDA7XG4gICAgfVxuICAgIGlmIChuZWdvdGlhdGlvbk5lZWRlZCkge1xuICAgICAgdGhpcy5fb25OZWdvdGlhdGlvbm5lZWRlZCgpO1xuICAgIH1cbiAgfVxuXG4gIF9kcmFpblBlbmRpbmdSZW1vdGVJY2VDYW5kaWRhdGVzKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fcmVtb3RlSWNlQ2FuZGlkYXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdBZGQgY2FuZGlkYXRlJyk7XG4gICAgICB0aGlzLl9wYy5hZGRJY2VDYW5kaWRhdGUodGhpcy5fcmVtb3RlSWNlQ2FuZGlkYXRlc1tpXSkuY2F0Y2goKGVycm9yKT0+e1xuICAgICAgICBMb2dnZXIud2FybmluZygnRXJyb3IgcHJvY2Vzc2luZyBJQ0UgY2FuZGlkYXRlOiAnK2Vycm9yKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLl9yZW1vdGVJY2VDYW5kaWRhdGVzLmxlbmd0aCA9IDA7XG4gIH1cblxuICBfZHJhaW5QZW5kaW5nTWVzc2FnZXMoKSB7XG4gICAgTG9nZ2VyLmRlYnVnKCdEcmFpbmluZyBwZW5kaW5nIG1lc3NhZ2VzLicpO1xuICAgIGlmICh0aGlzLl9wZW5kaW5nTWVzc2FnZXMubGVuZ3RoID09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZGMgPSB0aGlzLl9kYXRhQ2hhbm5lbHMuZ2V0KERhdGFDaGFubmVsTGFiZWwuTUVTU0FHRSk7XG4gICAgaWYgKGRjICYmIGRjLnJlYWR5U3RhdGUgPT09ICdvcGVuJykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9wZW5kaW5nTWVzc2FnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgTG9nZ2VyLmRlYnVnKCdTZW5kaW5nIG1lc3NhZ2UgdmlhIGRhdGEgY2hhbm5lbDogJyt0aGlzLl9wZW5kaW5nTWVzc2FnZXNbaV0pO1xuICAgICAgICBkYy5zZW5kKEpTT04uc3RyaW5naWZ5KHRoaXMuX3BlbmRpbmdNZXNzYWdlc1tpXSkpO1xuICAgICAgfVxuICAgICAgdGhpcy5fcGVuZGluZ01lc3NhZ2VzLmxlbmd0aCA9IDA7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9wYyAmJiAhZGMpIHtcbiAgICAgIHRoaXMuX2NyZWF0ZURhdGFDaGFubmVsKERhdGFDaGFubmVsTGFiZWwuTUVTU0FHRSk7XG4gICAgfVxuICB9XG5cbiAgX3NlbmRTdHJlYW1JbmZvKHN0cmVhbSkge1xuICAgIGlmICghc3RyZWFtIHx8ICFzdHJlYW0ubWVkaWFTdHJlYW0pIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoRXJyb3JNb2R1bGUuZXJyb3JzLlAyUF9DTElFTlRfSUxMRUdBTF9BUkdVTUVOVCk7XG4gICAgfVxuICAgIGNvbnN0IGluZm8gPSBbXTtcbiAgICBzdHJlYW0ubWVkaWFTdHJlYW0uZ2V0VHJhY2tzKCkubWFwKCh0cmFjaykgPT4ge1xuICAgICAgaW5mby5wdXNoKHtcbiAgICAgICAgaWQ6IHRyYWNrLmlkLFxuICAgICAgICBzb3VyY2U6IHN0cmVhbS5zb3VyY2VbdHJhY2sua2luZF0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoW3RoaXMuX3NlbmRTaWduYWxpbmdNZXNzYWdlKFNpZ25hbGluZ1R5cGUuVFJBQ0tfU09VUkNFUyxcbiAgICAgICAgaW5mbyksXG4gICAgdGhpcy5fc2VuZFNpZ25hbGluZ01lc3NhZ2UoU2lnbmFsaW5nVHlwZS5TVFJFQU1fSU5GTywge1xuICAgICAgaWQ6IHN0cmVhbS5tZWRpYVN0cmVhbS5pZCxcbiAgICAgIGF0dHJpYnV0ZXM6IHN0cmVhbS5hdHRyaWJ1dGVzLFxuICAgICAgLy8gVHJhY2sgSURzIG1heSBub3QgbWF0Y2ggYXQgc2VuZGVyIGFuZCByZWNlaXZlciBzaWRlcy5cbiAgICAgIHRyYWNrczogQXJyYXkuZnJvbShpbmZvLCAoaXRlbSkgPT4gaXRlbS5pZCksXG4gICAgICAvLyBUaGlzIGlzIGEgd29ya2Fyb3VuZCBmb3IgU2FmYXJpLiBQbGVhc2UgdXNlIHRyYWNrLXNvdXJjZXMgaWYgcG9zc2libGUuXG4gICAgICBzb3VyY2U6IHN0cmVhbS5zb3VyY2UsXG4gICAgfSksXG4gICAgXSk7XG4gIH1cblxuXG4gIF9zZW5kU3lzSW5mb0lmTmVjZXNzYXJ5KCkge1xuICAgIGlmICh0aGlzLl9pbmZvU2VudCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICB0aGlzLl9pbmZvU2VudCA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXMuX3NlbmRTaWduYWxpbmdNZXNzYWdlKFNpZ25hbGluZ1R5cGUuVUEsIHN5c0luZm8pO1xuICB9XG5cbiAgX3NlbmRDbG9zZWRNc2dJZk5lY2Vzc2FyeSgpIHtcbiAgICBpZiAodGhpcy5fcGMucmVtb3RlRGVzY3JpcHRpb24gPT09IG51bGwgfHxcbiAgICAgICAgdGhpcy5fcGMucmVtb3RlRGVzY3JpcHRpb24uc2RwID09PSAnJykge1xuICAgICAgcmV0dXJuIHRoaXMuX3NlbmRTaWduYWxpbmdNZXNzYWdlKFNpZ25hbGluZ1R5cGUuQ0xPU0VEKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgX2hhbmRsZVJlbW90ZUNhcGFiaWxpdHkodWEpIHtcbiAgICBpZiAodWEuc2RrICYmIHVhLnNkayAmJiB1YS5zZGsudHlwZSA9PT0gJ0phdmFTY3JpcHQnICYmIHVhLnJ1bnRpbWUgJiZcbiAgICAgICAgdWEucnVudGltZS5uYW1lID09PSAnRmlyZWZveCcpIHtcbiAgICAgIHRoaXMuX3JlbW90ZVNpZGVTdXBwb3J0c1JlbW92ZVN0cmVhbSA9IGZhbHNlO1xuICAgICAgdGhpcy5fcmVtb3RlU2lkZVN1cHBvcnRzUGxhbkIgPSBmYWxzZTtcbiAgICAgIHRoaXMuX3JlbW90ZVNpZGVTdXBwb3J0c1VuaWZpZWRQbGFuID0gdHJ1ZTtcbiAgICB9IGVsc2UgeyAvLyBSZW1vdGUgc2lkZSBpcyBpT1MvQW5kcm9pZC9DKysgd2hpY2ggdXNlcyBHb29nbGUncyBXZWJSVEMgc3RhY2suXG4gICAgICB0aGlzLl9yZW1vdGVTaWRlU3VwcG9ydHNSZW1vdmVTdHJlYW0gPSB0cnVlO1xuICAgICAgdGhpcy5fcmVtb3RlU2lkZVN1cHBvcnRzUGxhbkIgPSB0cnVlO1xuICAgICAgdGhpcy5fcmVtb3RlU2lkZVN1cHBvcnRzVW5pZmllZFBsYW4gPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBfZG9OZWdvdGlhdGUoKSB7XG4gICAgdGhpcy5fY3JlYXRlQW5kU2VuZE9mZmVyKCk7XG4gIH1cblxuICBfc2V0Q29kZWNPcmRlcihzZHApIHtcbiAgICBpZiAodGhpcy5fY29uZmlnLmF1ZGlvRW5jb2RpbmdzKSB7XG4gICAgICBjb25zdCBhdWRpb0NvZGVjTmFtZXMgPSBBcnJheS5mcm9tKHRoaXMuX2NvbmZpZy5hdWRpb0VuY29kaW5ncyxcbiAgICAgICAgICAoZW5jb2RpbmdQYXJhbWV0ZXJzKSA9PiBlbmNvZGluZ1BhcmFtZXRlcnMuY29kZWMubmFtZSk7XG4gICAgICBzZHAgPSBTZHBVdGlscy5yZW9yZGVyQ29kZWNzKHNkcCwgJ2F1ZGlvJywgYXVkaW9Db2RlY05hbWVzKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2NvbmZpZy52aWRlb0VuY29kaW5ncykge1xuICAgICAgY29uc3QgdmlkZW9Db2RlY05hbWVzID0gQXJyYXkuZnJvbSh0aGlzLl9jb25maWcudmlkZW9FbmNvZGluZ3MsXG4gICAgICAgICAgKGVuY29kaW5nUGFyYW1ldGVycykgPT4gZW5jb2RpbmdQYXJhbWV0ZXJzLmNvZGVjLm5hbWUpO1xuICAgICAgc2RwID0gU2RwVXRpbHMucmVvcmRlckNvZGVjcyhzZHAsICd2aWRlbycsIHZpZGVvQ29kZWNOYW1lcyk7XG4gICAgfVxuICAgIHJldHVybiBzZHA7XG4gIH1cblxuICBfc2V0TWF4Qml0cmF0ZShzZHAsIG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuYXVkaW9FbmNvZGluZ3MgPT09ICdvYmplY3QnKSB7XG4gICAgICBzZHAgPSBTZHBVdGlscy5zZXRNYXhCaXRyYXRlKHNkcCwgb3B0aW9ucy5hdWRpb0VuY29kaW5ncyk7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy52aWRlb0VuY29kaW5ncyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHNkcCA9IFNkcFV0aWxzLnNldE1heEJpdHJhdGUoc2RwLCBvcHRpb25zLnZpZGVvRW5jb2RpbmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIF9zZXRSdHBTZW5kZXJPcHRpb25zKHNkcCwgb3B0aW9ucykge1xuICAgIHNkcCA9IHRoaXMuX3NldE1heEJpdHJhdGUoc2RwLCBvcHRpb25zKTtcbiAgICByZXR1cm4gc2RwO1xuICB9XG5cbiAgX3NldFJ0cFJlY2VpdmVyT3B0aW9ucyhzZHApIHtcbiAgICBzZHAgPSB0aGlzLl9zZXRDb2RlY09yZGVyKHNkcCk7XG4gICAgcmV0dXJuIHNkcDtcbiAgfVxuXG4gIF9jcmVhdGVBbmRTZW5kT2ZmZXIoKSB7XG4gICAgaWYgKCF0aGlzLl9wYykge1xuICAgICAgTG9nZ2VyLmVycm9yKCdQZWVyIGNvbm5lY3Rpb24gaGF2ZSBub3QgYmVlbiBjcmVhdGVkLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9pc05lZ290aWF0aW9uTmVlZGVkID0gZmFsc2U7XG4gICAgdGhpcy5faXNDYWxsZXIgPSB0cnVlO1xuICAgIGxldCBsb2NhbERlc2M7XG4gICAgdGhpcy5fcGMuY3JlYXRlT2ZmZXIoKS50aGVuKChkZXNjKSA9PiB7XG4gICAgICBkZXNjLnNkcCA9IHRoaXMuX3NldFJ0cFJlY2VpdmVyT3B0aW9ucyhkZXNjLnNkcCk7XG4gICAgICBsb2NhbERlc2MgPSBkZXNjO1xuICAgICAgaWYodGhpcy5fcGMuc2lnbmFsaW5nU3RhdGU9PT0nc3RhYmxlJyl7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYy5zZXRMb2NhbERlc2NyaXB0aW9uKGRlc2MpLnRoZW4oKCk9PntcbiAgICAgICAgICByZXR1cm4gdGhpcy5fc2VuZFNkcChsb2NhbERlc2MpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KS5jYXRjaCgoZSkgPT4ge1xuICAgICAgTG9nZ2VyLmVycm9yKGUubWVzc2FnZSArICcgUGxlYXNlIGNoZWNrIHlvdXIgY29kZWMgc2V0dGluZ3MuJyk7XG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihFcnJvck1vZHVsZS5lcnJvcnMuUDJQX1dFQlJUQ19TRFAsXG4gICAgICAgICAgZS5tZXNzYWdlKTtcbiAgICAgIHRoaXMuX3N0b3AoZXJyb3IsIHRydWUpO1xuICAgIH0pO1xuICB9XG5cbiAgX2NyZWF0ZUFuZFNlbmRBbnN3ZXIoKSB7XG4gICAgdGhpcy5fZHJhaW5QZW5kaW5nU3RyZWFtcygpO1xuICAgIHRoaXMuX2lzTmVnb3RpYXRpb25OZWVkZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9pc0NhbGxlciA9IGZhbHNlO1xuICAgIGxldCBsb2NhbERlc2M7XG4gICAgdGhpcy5fcGMuY3JlYXRlQW5zd2VyKCkudGhlbigoZGVzYykgPT4ge1xuICAgICAgZGVzYy5zZHAgPSB0aGlzLl9zZXRSdHBSZWNlaXZlck9wdGlvbnMoZGVzYy5zZHApO1xuICAgICAgbG9jYWxEZXNjPWRlc2M7XG4gICAgICB0aGlzLl9sb2dDdXJyZW50QW5kUGVuZGluZ0xvY2FsRGVzY3JpcHRpb24oKTtcbiAgICAgIHJldHVybiB0aGlzLl9wYy5zZXRMb2NhbERlc2NyaXB0aW9uKGRlc2MpO1xuICAgIH0pLnRoZW4oKCk9PntcbiAgICAgIHJldHVybiB0aGlzLl9zZW5kU2RwKGxvY2FsRGVzYyk7XG4gICAgfSkuY2F0Y2goKGUpID0+IHtcbiAgICAgIExvZ2dlci5lcnJvcihlLm1lc3NhZ2UgKyAnIFBsZWFzZSBjaGVjayB5b3VyIGNvZGVjIHNldHRpbmdzLicpO1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3JNb2R1bGUuUDJQRXJyb3IoRXJyb3JNb2R1bGUuZXJyb3JzLlAyUF9XRUJSVENfU0RQLFxuICAgICAgICAgIGUubWVzc2FnZSk7XG4gICAgICB0aGlzLl9zdG9wKGVycm9yLCB0cnVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9sb2dDdXJyZW50QW5kUGVuZGluZ0xvY2FsRGVzY3JpcHRpb24oKXtcbiAgICBMb2dnZXIuaW5mbygnQ3VycmVudCBkZXNjcmlwdGlvbjogJyt0aGlzLl9wYy5jdXJyZW50TG9jYWxEZXNjcmlwdGlvbik7XG4gICAgTG9nZ2VyLmluZm8oJ1BlbmRpbmcgZGVzY3JpcHRpb246ICcrdGhpcy5fcGMucGVuZGluZ0xvY2FsRGVzY3JpcHRpb24pO1xuICB9XG5cbiAgX2dldEFuZERlbGV0ZVRyYWNrU291cmNlSW5mbyh0cmFja3MpIHtcbiAgICBpZiAodHJhY2tzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHRyYWNrSWQgPSB0cmFja3NbMF0uaWQ7XG4gICAgICBpZiAodGhpcy5fcmVtb3RlVHJhY2tTb3VyY2VJbmZvLmhhcyh0cmFja0lkKSkge1xuICAgICAgICBjb25zdCBzb3VyY2VJbmZvID0gdGhpcy5fcmVtb3RlVHJhY2tTb3VyY2VJbmZvLmdldCh0cmFja0lkKTtcbiAgICAgICAgdGhpcy5fcmVtb3RlVHJhY2tTb3VyY2VJbmZvLmRlbGV0ZSh0cmFja0lkKTtcbiAgICAgICAgcmV0dXJuIHNvdXJjZUluZm87XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBMb2dnZXIud2FybmluZygnQ2Fubm90IGZpbmQgc291cmNlIGluZm8gZm9yICcgKyB0cmFja0lkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfdW5wdWJsaXNoKHN0cmVhbSkge1xuICAgIGlmIChuYXZpZ2F0b3IubW96R2V0VXNlck1lZGlhIHx8ICF0aGlzLl9yZW1vdGVTaWRlU3VwcG9ydHNSZW1vdmVTdHJlYW0pIHtcbiAgICAgIC8vIEFjdHVhbGx5IHVucHVibGlzaCBpcyBzdXBwb3J0ZWQuIEl0IGlzIGEgbGl0dGxlIGJpdCBjb21wbGV4IHNpbmNlIEZpcmVmb3ggaW1wbGVtZW50ZWQgV2ViUlRDIHNwZWMgd2hpbGUgQ2hyb21lIGltcGxlbWVudGVkIGFuIG9sZCBBUEkuXG4gICAgICBMb2dnZXIuZXJyb3IoXG4gICAgICAgICAgJ1N0b3BwaW5nIGEgcHVibGljYXRpb24gaXMgbm90IHN1cHBvcnRlZCBvbiBGaXJlZm94LiBQbGVhc2UgdXNlIFAyUENsaWVudC5zdG9wKCkgdG8gc3RvcCB0aGUgY29ubmVjdGlvbiB3aXRoIHJlbW90ZSBlbmRwb2ludC4nXG4gICAgICApO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihcbiAgICAgICAgICBFcnJvck1vZHVsZS5lcnJvcnMuUDJQX0NMSUVOVF9VTlNVUFBPUlRFRF9NRVRIT0QpKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9wdWJsaXNoZWRTdHJlYW1zLmhhcyhzdHJlYW0pKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yTW9kdWxlLlAyUEVycm9yKFxuICAgICAgICAgIEVycm9yTW9kdWxlLmVycm9ycy5QMlBfQ0xJRU5UX0lMTEVHQUxfQVJHVU1FTlQpKTtcbiAgICB9XG4gICAgdGhpcy5fcGVuZGluZ1VucHVibGlzaFN0cmVhbXMucHVzaChzdHJlYW0pO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLl91bnB1Ymxpc2hQcm9taXNlcy5zZXQoc3RyZWFtLm1lZGlhU3RyZWFtLmlkLCB7XG4gICAgICAgIHJlc29sdmU6IHJlc29sdmUsXG4gICAgICAgIHJlamVjdDogcmVqZWN0LFxuICAgICAgfSk7XG4gICAgICB0aGlzLl9kcmFpblBlbmRpbmdTdHJlYW1zKCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBNYWtlIHN1cmUgfF9wY3wgaXMgYXZhaWxhYmxlIGJlZm9yZSBjYWxsaW5nIHRoaXMgbWV0aG9kLlxuICBfY3JlYXRlRGF0YUNoYW5uZWwobGFiZWwpIHtcbiAgICBpZiAodGhpcy5fZGF0YUNoYW5uZWxzLmhhcyhsYWJlbCkpIHtcbiAgICAgIExvZ2dlci53YXJuaW5nKCdEYXRhIGNoYW5uZWwgbGFiZWxlZCAnKyBsYWJlbCsnIGFscmVhZHkgZXhpc3RzLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX3BjKSB7XG4gICAgICBMb2dnZXIuZGVidWcoJ1BlZXJDb25uZWN0aW9uIGlzIG5vdCBhdmFpbGFibGUgYmVmb3JlIGNyZWF0aW5nIERhdGFDaGFubmVsLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBMb2dnZXIuZGVidWcoJ0NyZWF0ZSBkYXRhIGNoYW5uZWwuJyk7XG4gICAgY29uc3QgZGMgPSB0aGlzLl9wYy5jcmVhdGVEYXRhQ2hhbm5lbChsYWJlbCk7XG4gICAgdGhpcy5fYmluZEV2ZW50c1RvRGF0YUNoYW5uZWwoZGMpO1xuICAgIHRoaXMuX2RhdGFDaGFubmVscy5zZXQoRGF0YUNoYW5uZWxMYWJlbC5NRVNTQUdFLCBkYyk7XG4gICAgdGhpcy5fb25OZWdvdGlhdGlvbm5lZWRlZCgpO1xuICB9XG5cbiAgX2JpbmRFdmVudHNUb0RhdGFDaGFubmVsKGRjKSB7XG4gICAgZGMub25tZXNzYWdlID0gKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl9vbkRhdGFDaGFubmVsTWVzc2FnZS5hcHBseSh0aGlzLCBbZXZlbnRdKTtcbiAgICB9O1xuICAgIGRjLm9ub3BlbiA9IChldmVudCkgPT4ge1xuICAgICAgdGhpcy5fb25EYXRhQ2hhbm5lbE9wZW4uYXBwbHkodGhpcywgW2V2ZW50XSk7XG4gICAgfTtcbiAgICBkYy5vbmNsb3NlID0gKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl9vbkRhdGFDaGFubmVsQ2xvc2UuYXBwbHkodGhpcywgW2V2ZW50XSk7XG4gICAgfTtcbiAgICBkYy5vbmVycm9yID0gKGV2ZW50KSA9PiB7XG4gICAgICBMb2dnZXIuZGVidWcoJ0RhdGEgQ2hhbm5lbCBFcnJvcjonLCBlcnJvcik7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYWxsIE1lZGlhU3RyZWFtcyBpdCBiZWxvbmdzIHRvLlxuICBfZ2V0U3RyZWFtQnlUcmFjayhtZWRpYVN0cmVhbVRyYWNrKSB7XG4gICAgY29uc3Qgc3RyZWFtcyA9IFtdO1xuICAgIGZvciAoY29uc3QgW2lkLCBpbmZvXSBvZiB0aGlzLl9yZW1vdGVTdHJlYW1JbmZvKSB7XG4gICAgICBpZiAoIWluZm8uc3RyZWFtIHx8ICFpbmZvLnN0cmVhbS5tZWRpYVN0cmVhbSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgdHJhY2sgb2YgaW5mby5zdHJlYW0ubWVkaWFTdHJlYW0uZ2V0VHJhY2tzKCkpIHtcbiAgICAgICAgaWYgKG1lZGlhU3RyZWFtVHJhY2sgPT09IHRyYWNrKSB7XG4gICAgICAgICAgc3RyZWFtcy5wdXNoKGluZm8uc3RyZWFtLm1lZGlhU3RyZWFtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RyZWFtcztcbiAgfVxuXG4gIF9hcmVBbGxUcmFja3NFbmRlZChtZWRpYVN0cmVhbSkge1xuICAgIGZvciAoY29uc3QgdHJhY2sgb2YgbWVkaWFTdHJlYW0uZ2V0VHJhY2tzKCkpIHtcbiAgICAgIGlmICh0cmFjay5yZWFkeVN0YXRlID09PSAnbGl2ZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIF9zdG9wKGVycm9yLCBub3RpZnlSZW1vdGUpIHtcbiAgICBsZXQgcHJvbWlzZUVycm9yID0gZXJyb3I7XG4gICAgaWYgKCFwcm9taXNlRXJyb3IpIHtcbiAgICAgIHByb21pc2VFcnJvciA9IG5ldyBFcnJvck1vZHVsZS5QMlBFcnJvcihcbiAgICAgICAgICBFcnJvck1vZHVsZS5lcnJvcnMuUDJQX0NMSUVOVF9VTktOT1dOKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBbbGFiZWwsIGRjXSBvZiB0aGlzLl9kYXRhQ2hhbm5lbHMpIHtcbiAgICAgIGRjLmNsb3NlKCk7XG4gICAgfVxuICAgIHRoaXMuX2RhdGFDaGFubmVscy5jbGVhcigpO1xuICAgIGlmICh0aGlzLl9wYyAmJiB0aGlzLl9wYy5pY2VDb25uZWN0aW9uU3RhdGUgIT09ICdjbG9zZWQnKSB7XG4gICAgICB0aGlzLl9wYy5jbG9zZSgpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IFtpZCwgcHJvbWlzZV0gb2YgdGhpcy5fcHVibGlzaFByb21pc2VzKSB7XG4gICAgICBwcm9taXNlLnJlamVjdChwcm9taXNlRXJyb3IpO1xuICAgIH1cbiAgICB0aGlzLl9wdWJsaXNoUHJvbWlzZXMuY2xlYXIoKTtcbiAgICBmb3IgKGNvbnN0IFtpZCwgcHJvbWlzZV0gb2YgdGhpcy5fdW5wdWJsaXNoUHJvbWlzZXMpIHtcbiAgICAgIHByb21pc2UucmVqZWN0KHByb21pc2VFcnJvcik7XG4gICAgfVxuICAgIHRoaXMuX3VucHVibGlzaFByb21pc2VzLmNsZWFyKCk7XG4gICAgZm9yIChjb25zdCBbaWQsIHByb21pc2VdIG9mIHRoaXMuX3NlbmREYXRhUHJvbWlzZXMpIHtcbiAgICAgIHByb21pc2UucmVqZWN0KHByb21pc2VFcnJvcik7XG4gICAgfVxuICAgIHRoaXMuX3NlbmREYXRhUHJvbWlzZXMuY2xlYXIoKTtcbiAgICAvLyBGaXJlIGVuZGVkIGV2ZW50IGlmIHB1YmxpY2F0aW9uIG9yIHJlbW90ZSBzdHJlYW0gZXhpc3RzLlxuICAgIHRoaXMuX3B1Ymxpc2hlZFN0cmVhbXMuZm9yRWFjaCgocHVibGljYXRpb24pID0+IHtcbiAgICAgIHB1YmxpY2F0aW9uLmRpc3BhdGNoRXZlbnQobmV3IE93dEV2ZW50KCdlbmRlZCcpKTtcbiAgICB9KTtcbiAgICB0aGlzLl9wdWJsaXNoZWRTdHJlYW1zLmNsZWFyKCk7XG4gICAgdGhpcy5fcmVtb3RlU3RyZWFtcy5mb3JFYWNoKChzdHJlYW0pID0+IHtcbiAgICAgIHN0cmVhbS5kaXNwYXRjaEV2ZW50KG5ldyBPd3RFdmVudCgnZW5kZWQnKSk7XG4gICAgfSk7XG4gICAgdGhpcy5fcmVtb3RlU3RyZWFtcyA9IFtdO1xuICAgIGlmICghdGhpcy5fZGlzcG9zZWQpIHtcbiAgICAgIGlmIChub3RpZnlSZW1vdGUpIHtcbiAgICAgICAgbGV0IHNlbmRFcnJvcjtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgc2VuZEVycm9yID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShlcnJvcikpO1xuICAgICAgICAgIC8vIEF2b2lkIHRvIGxlYWsgZGV0YWlsZWQgZXJyb3IgdG8gcmVtb3RlIHNpZGUuXG4gICAgICAgICAgc2VuZEVycm9yLm1lc3NhZ2UgPSAnRXJyb3IgaGFwcGVuZWQgYXQgcmVtb3RlIHNpZGUuJztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZW5kU2lnbmFsaW5nTWVzc2FnZShTaWduYWxpbmdUeXBlLkNMT1NFRCwgc2VuZEVycm9yKS5jYXRjaChcbiAgICAgICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgTG9nZ2VyLmRlYnVnKCdGYWlsZWQgdG8gc2VuZCBjbG9zZS4nICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdlbmRlZCcpKTtcbiAgICB9XG4gIH1cblxuICBfc2V0U3RyZWFtVG9SZW1vdGVTdHJlYW1JbmZvKG1lZGlhU3RyZWFtKSB7XG4gICAgY29uc3QgaW5mbyA9IHRoaXMuX3JlbW90ZVN0cmVhbUluZm8uZ2V0KG1lZGlhU3RyZWFtLmlkKTtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gaW5mby5hdHRyaWJ1dGVzO1xuICAgIGNvbnN0IHNvdXJjZUluZm8gPSBuZXcgU3RyZWFtTW9kdWxlLlN0cmVhbVNvdXJjZUluZm8odGhpcy5fcmVtb3RlU3RyZWFtSW5mb1xuICAgICAgICAuZ2V0KG1lZGlhU3RyZWFtLmlkKS5zb3VyY2UuYXVkaW8sIHRoaXMuX3JlbW90ZVN0cmVhbUluZm8uZ2V0KFxuICAgICAgICBtZWRpYVN0cmVhbS5pZClcbiAgICAgICAgLnNvdXJjZS52aWRlbyk7XG4gICAgaW5mby5zdHJlYW0gPSBuZXcgU3RyZWFtTW9kdWxlLlJlbW90ZVN0cmVhbShcbiAgICAgICAgdW5kZWZpbmVkLCB0aGlzLl9yZW1vdGVJZCwgbWVkaWFTdHJlYW0sXG4gICAgICAgIHNvdXJjZUluZm8sIGF0dHJpYnV0ZXMpO1xuICAgIGluZm8ubWVkaWFTdHJlYW0gPSBtZWRpYVN0cmVhbTtcbiAgICBjb25zdCBzdHJlYW0gPSBpbmZvLnN0cmVhbTtcbiAgICBpZiAoc3RyZWFtKSB7XG4gICAgICB0aGlzLl9yZW1vdGVTdHJlYW1zLnB1c2goc3RyZWFtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgTG9nZ2VyLndhcm5pbmcoJ0ZhaWxlZCB0byBjcmVhdGUgUmVtb3RlU3RyZWFtLicpO1xuICAgIH1cbiAgfVxuXG4gIF9jaGVja0ljZUNvbm5lY3Rpb25TdGF0ZUFuZEZpcmVFdmVudCgpIHtcbiAgICBpZiAodGhpcy5fcGMuaWNlQ29ubmVjdGlvblN0YXRlID09PSAnY29ubmVjdGVkJyB8fFxuICAgICAgICB0aGlzLl9wYy5pY2VDb25uZWN0aW9uU3RhdGUgPT09ICdjb21wbGV0ZWQnKSB7XG4gICAgICBmb3IgKGNvbnN0IFtpZCwgaW5mb10gb2YgdGhpcy5fcmVtb3RlU3RyZWFtSW5mbykge1xuICAgICAgICBpZiAoaW5mby5tZWRpYVN0cmVhbSkge1xuICAgICAgICAgIGNvbnN0IHN0cmVhbUV2ZW50ID0gbmV3IFN0cmVhbU1vZHVsZS5TdHJlYW1FdmVudCgnc3RyZWFtYWRkZWQnLCB7XG4gICAgICAgICAgICBzdHJlYW06IGluZm8uc3RyZWFtLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICh0aGlzLl9pc1VuaWZpZWRQbGFuKCkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdHJhY2sgb2YgaW5mby5tZWRpYVN0cmVhbS5nZXRUcmFja3MoKSkge1xuICAgICAgICAgICAgICB0cmFjay5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lZGlhU3RyZWFtcyA9IHRoaXMuX2dldFN0cmVhbUJ5VHJhY2soZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG1lZGlhU3RyZWFtIG9mIG1lZGlhU3RyZWFtcykge1xuICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2FyZUFsbFRyYWNrc0VuZGVkKG1lZGlhU3RyZWFtKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vblJlbW90ZVN0cmVhbVJlbW92ZWQobWVkaWFTdHJlYW0pO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX3NlbmRTaWduYWxpbmdNZXNzYWdlKFNpZ25hbGluZ1R5cGUuVFJBQ0tTX0FEREVELCBpbmZvLnRyYWNrSWRzKTtcbiAgICAgICAgICB0aGlzLl9yZW1vdGVTdHJlYW1JbmZvLmdldChpbmZvLm1lZGlhU3RyZWFtLmlkKS5tZWRpYVN0cmVhbSA9IG51bGw7XG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KHN0cmVhbUV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQMlBQZWVyQ29ubmVjdGlvbkNoYW5uZWw7XG4iXX0=
