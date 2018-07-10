(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("shield-http", [], factory);
	else if(typeof exports === 'object')
		exports["shield-http"] = factory();
	else
		root["shield-http"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/querystringify/index.js":
/*!**********************************************!*\
  !*** ./node_modules/querystringify/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String} The decoded string.
 * @api private
 */
function decode(input) {
  return decodeURIComponent(input.replace(/\+/g, ' '));
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?&]+)=?([^&]*)/g
    , result = {}
    , part;

  while (part = parser.exec(query)) {
    var key = decode(part[1])
      , value = decode(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    if (key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = [];

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (var key in obj) {
    if (has.call(obj, key)) {
      pairs.push(encodeURIComponent(key) +'='+ encodeURIComponent(obj[key]));
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;


/***/ }),

/***/ "./node_modules/url-join/lib/url-join.js":
/*!***********************************************!*\
  !*** ./node_modules/url-join/lib/url-join.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (name, context, definition) {
  if (typeof module !== 'undefined' && module.exports) module.exports = definition();
  else if (true) !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  else {}
})('urljoin', this, function () {

  function normalize (strArray) {
    var resultArray = [];

    // If the first part is a plain protocol, we combine it with the next part.
    if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
      var first = strArray.shift();
      strArray[0] = first + strArray[0];
    }

    // There must be two or three slashes in the file protocol, two slashes in anything else.
    if (strArray[0].match(/^file:\/\/\//)) {
      strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1:///');
    } else {
      strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1://');
    }

    for (var i = 0; i < strArray.length; i++) {
      var component = strArray[i];

      if (typeof component !== 'string') {
        throw new TypeError('Url must be a string. Received ' + component);
      }

      if (component === '') { continue; }

      if (i > 0) {
        // Removing the starting slashes for each component but the first.
        component = component.replace(/^[\/]+/, '');
      }
      if (i < strArray.length - 1) {
        // Removing the ending slashes for each component but the last.
        component = component.replace(/[\/]+$/, '');
      } else {
        // For the last component we will combine multiple slashes to a single one.
        component = component.replace(/[\/]+$/, '/');
      }

      resultArray.push(component);

    }

    var str = resultArray.join('/');
    // Each input component is now separated by a single slash except the possible first plain protocol part.

    // remove trailing slash before parameters or hash
    str = str.replace(/\/(\?|&|#[^!])/g, '$1');

    // replace ? in parameters with &
    var parts = str.split('?');
    str = parts.shift() + (parts.length > 0 ? '?': '') + parts.join('&');

    return str;
  }

  return function () {
    var input;

    if (typeof arguments[0] === 'object') {
      input = arguments[0];
    } else {
      input = [].slice.call(arguments);
    }

    return normalize(input);
  };

});


/***/ }),

/***/ "./src/constant.js":
/*!*************************!*\
  !*** ./src/constant.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContentType = exports.Methods = void 0;

/**
 * http method
 */
var Methods = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};
/**
 * http-content-type
 * @type {{NORMAL: string, RESTFUL: string}}
 */

exports.Methods = Methods;
var ContentType = {
  NORMAL: 'application/x-www-form-urlencoded',
  RESTFUL: 'application/json;charset=utf-8'
};
exports.ContentType = ContentType;

/***/ }),

/***/ "./src/http.ext.js":
/*!*************************!*\
  !*** ./src/http.ext.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _urlJoin = _interopRequireDefault(__webpack_require__(/*! url-join */ "./node_modules/url-join/lib/url-join.js"));

var _querystringify = _interopRequireDefault(__webpack_require__(/*! querystringify */ "./node_modules/querystringify/index.js"));

var _constant = __webpack_require__(/*! ./constant */ "./src/constant.js");

var _icode = _interopRequireDefault(__webpack_require__(/*! ./icode */ "./src/icode.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var emptyFunction = function emptyFunction() {};

var HttpExt =
/*#__PURE__*/
function () {
  /**
   * options:{
     *  apiPrefix:'api前缀'
     *  successCode:200,
     *  codes:[
     *      {
     *          val:1000,
     *          message:'逻辑问题描述'
     *      }
     *  ],
     *  error:function(){
     *      错误处理方式
     *  }
     *
     * }
   * @param options
   */
  function HttpExt(options, auth) {
    _classCallCheck(this, HttpExt);

    this.options = Object.assign({
      progress: true,
      silent: false,
      timeout: 100000,
      defaultError: '报错啦'
    }, options);
    this.apiPrefix = options.apiPrefix;
    this.envTransferType = options.envTransferType;
    this.injectHeaders();
    this.$code = new _icode.default(this.options);
    /**
     * 确保有以下几种方式:
     * getToken
     * setToken
     * clear
     */

    this.$auth = auth;
  }
  /**
   * 设置头部 header 变量
   */


  _createClass(HttpExt, [{
    key: "injectHeaders",
    value: function injectHeaders() {
      var headerConfig = {};

      if (this.options.isStream) {
        headerConfig = undefined; // 'application/octet-stream';
      } else {
        headerConfig['content-type'] = _constant.ContentType.RESTFUL;
      }

      this.headers = Object.assign({}, headerConfig, this.options.headers);
    }
  }, {
    key: "getToken",
    value: function getToken() {
      return this.$auth.getToken ? this.$auth.getToken() : null;
    }
  }, {
    key: "getSystemInfo",
    value: function getSystemInfo() {
      /**
       {
             callerApp: "ICRMCLIENT",
             pageUrl: getCurrentPage(),
             userType: 'BANK_CUSTOMER'
         }
       *
       */
      var getInfoFunc = this.options.getSystemInfo;
      var envParams = getInfoFunc.call.apply(getInfoFunc, [this].concat(Array.prototype.slice.call(arguments)));
      var token = this.getToken();

      if (token) {
        envParams['token'] = token;
      }

      return envParams;
    }
  }, {
    key: "mixUrl",
    value: function mixUrl(bizurl) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var apiUrl = arguments[2];
      var envParams = this.getSystemInfo();
      var pathPrefix = this.options.pathPrefix || '';

      if (this.envTransferType === 'HEADER') {
        for (var key in envParams) {
          this.headers[key] = envParams[key];
        }

        return (0, _urlJoin.default)(apiUrl || this.apiPrefix, pathPrefix, bizurl, _querystringify.default.stringify(params, '?'));
      }

      var getPramas = Object.assign({}, envParams, params);
      return (0, _urlJoin.default)(apiUrl || this.apiPrefix, pathPrefix, bizurl, _querystringify.default.stringify(getPramas, '?'));
    }
  }, {
    key: "log",
    value: function log(str) {
      console.log(str);
    }
    /**
     * http的封装
     * @param opts:{
    *
    *  cache:{       //cache不传则不开启
    *    exp:1,      //0 不开启
    *    read:-1,    //-1不开启
    *  }
    * }
     * @param parseFunc
     * @returns {*}
     */

  }, {
    key: "request",
    value: function request(config) {
      var that = this;
      var headerConfig = Object.assign({}, this.headers, config.headers);
      var loadingBar = config.progress === undefined ? this.options.progress : !!config.progress;
      var silent = config.silent === undefined ? this.options.silent : !!config.silent;
      this.showRequestState(loadingBar);
      var promise = new Promise(function (resolve, reject) {
        reject = reject || emptyFunction;
        var msgErrId = that.msgErrTag();
        that.originalRequest({
          url: config.url,
          method: config.method || _constant.Methods.GET,
          data: config.data || {},
          header: headerConfig,
          cache: false,
          timeout: that.options.timeout,
          success: function success(response) {
            var resp = response.data;
            that.hideRequestState();
            var retCode = that.getResponseBizCode(resp);

            if (that.$code.isSuccess(retCode)) {
              resolve(that.getResponseData(resp));
            } else {
              that.report(response);

              if (!silent) {
                var errResult = that.$code.processBizError(retCode);

                if (errResult) {
                  that.showError(errResult.message || that.options.defaultError);
                }
              }

              reject({
                response: response,
                msgErrId: msgErrId,
                biz: 1
              });
            }
          },
          fail: function fail(response) {
            that.hideRequestState();
            that.report(response);

            if (!silent) {
              var errResult = that.$code.proccessHttpError(that.getReponseHttpStatus(response));

              if (errResult) {
                that.showError(errResult.message || that.options.defaultError);
              }
            }

            reject({
              response: response,
              msgErrId: msgErrId
            });
          }
        });
      });
      return promise;
    }
  }, {
    key: "getCacheKey",
    value: function getCacheKey(url, data) {
      return url + JSON.stringify(data);
    }
  }, {
    key: "$post",
    value: function $post(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var urlParam = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var cacheKey = this.getCacheKey(url, data);
      opts.url = this.mixUrl(url, Object.assign({}, urlParam), opts.apiUrl);
      opts.cacheKey = cacheKey;
      opts.method = _constant.Methods.POST;

      if (data.toString() === '[object Array]') {
        opts.data = data;
      } else {
        opts.data = Object.assign({}, data);
      }

      return this.request(opts);
    }
  }, {
    key: "$get",
    value: function $get(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var params = Object.assign({}, data);
      var cacheKey = this.getCacheKey(url, data);
      opts.url = this.mixUrl(url, params, opts.apiUrl);
      opts.cacheKey = cacheKey;
      opts.method = _constant.Methods.GET;
      return this.request(opts);
    }
  }, {
    key: "msgErrTag",
    value: function msgErrTag() {
      return Math.random().toString(36).substring(2, 15);
    } // ////////////////////////////////////  需要根据实际情况重载  //////////////////////////////////////////////////////

  }, {
    key: "showRequestState",
    value: function showRequestState(loadingBar) {//
    }
  }, {
    key: "hideRequestState",
    value: function hideRequestState() {
      /*
                   if (loadingBar) {
                      AjaxLoading.close()
                  }
       */
    }
  }, {
    key: "showError",
    value: function showError(resp) {// dialog.alert(resp.retMessage || resp.exception || "服务器错误")
    }
  }, {
    key: "report",
    value: function report() {}
  }, {
    key: "getResponseData",
    value: function getResponseData(resp) {}
  }, {
    key: "getResponseBizCode",
    value: function getResponseBizCode(resp) {}
  }, {
    key: "getReponseHttpStatus",
    value: function getReponseHttpStatus(response) {
      return null;
    } // //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  }, {
    key: "originalRequest",
    value: function originalRequest(options) {// this.assembleRequestOptions(options)
    }
  }]);

  return HttpExt;
}();

exports.default = HttpExt;
module.exports = exports["default"];

/***/ }),

/***/ "./src/icode.js":
/*!**********************!*\
  !*** ./src/icode.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * code判断
 * 假定:code是数字来设计的
 */
var icode =
/*#__PURE__*/
function () {
  function icode(options) {
    _classCallCheck(this, icode);

    this.$successCode = options.successCode;
    this.$status = options.status || [];
    /**
     * code=[{
         *  val:11111,
         *  message:"1111111111111"
         *
         *
         * }]
     * @type {*|Array}
     */

    this.$bizcode = options.codes || [];
    /**
     * return {
         *      message:xxxx
         *
         * }
     * @type {*|Error|MediaError|Function}
     */

    this.assembleErrorMsg = options.error || function () {};
  }

  _createClass(icode, [{
    key: "isSuccess",
    value: function isSuccess(code) {
      if (typeof this.$successCode === 'string') {
        if (this.$successCode === code) {
          return true;
        }

        return false;
      } // 比如200位成功,大于200都算成功,小于200算失败


      if (this.$successCode <= code) {
        return true;
      }

      return false;
    }
  }, {
    key: "proccessHttpError",
    value: function proccessHttpError(codeVal) {
      var retErr = null;

      for (var i = 0; i < this.$status.length; i++) {
        var _code = this.$status[i];

        if (_code.val === codeVal) {
          retErr = _code;
          break;
        }
      }

      if (retErr) {
        return {
          message: retErr.message
        };
      }

      return null;
    }
  }, {
    key: "processBizError",
    value: function processBizError(codeVal) {
      var retErr = null;
      var that = this;

      for (var i = 0; i < this.$bizcode.length; i++) {
        var _code = this.$bizcode[i];
        var checkVal = _code.val;

        var typename = _typeof(checkVal);

        if (typename === 'function') {
          if (checkVal.apply(that, [codeVal])) {
            retErr = _code;
            break;
          }
        } else if (checkVal instanceof RegExp) {
          if (checkVal.test(codeVal)) {
            retErr = _code;
            break;
          }
        } else if (_code.val === codeVal) {
          retErr = _code;
          break;
        }
      }

      if (retErr) {
        this.assembleErrorMsg(retErr);
        return {};
      }

      return null;
    }
  }]);

  return icode;
}();

exports.default = icode;
module.exports = exports["default"];

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "HttpExt", {
  enumerable: true,
  get: function get() {
    return _httpExt.default;
  }
});

var _httpExt = _interopRequireDefault(__webpack_require__(/*! ./http.ext.js */ "./src/http.ext.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ })

/******/ });
});
//# sourceMappingURL=shield-http.js.map