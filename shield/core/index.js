import utils from '../../axios-lib/utils';
import axios from '../../axios-lib/axios';

import axiosCreateError from '../../axios-lib/core/createError';

import urljoin from 'url-join';
import Params from 'querystringify';
import Methods from '../constant/method';
import ContentType from '../constant/content';
import sessionType from '../constant/session'
import {cache} from 'shield-store';
import ICode from '../code/code';
import ajaxQueue from './queue';

const emptyFunction = function () {
};

/**
 * default options
 * 默认options配置
 */
let defaultOptions = {
  progress: true,
  silent: false,
  timeout: 10000,
  tokenKey: 'session',
  apiPrefix: '/',
  defaultErrorMessage: 'request error'
};

export default class HttpExt {
  /**
   * options:{
   *  apiPrefix:'api前缀',
   *
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
  constructor(options, auth, axiosInstance) {
    this.options = Object.assign(defaultOptions, options);

    this.envTransferType = options.envTransferType;
    this.$axios = axiosInstance || axios;

    this.injectHeaders();
    this.injectGlobalCodes();
    this.injectAuthority(auth);

    /**
     * refer Constant Var
     */
    this.METHODS = Methods;
    this.CONTENT_TYPE = ContentType;
  }

  injectGlobalCodes() {
    let {codes, status, error, isSuccess} = this.options || {};

    this.$code = new ICode({codes, status, error, isSuccess});
  }
  injectAuthority(auth) {
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
  injectHeaders() {
    let headerConfig = {};

    if (this.options.isStream) {
      headerConfig = undefined; // 'application/octet-stream';
    } else if (this.options.isForm) {
      headerConfig['content-type'] = ContentType.NORMAL;
    } else {
      headerConfig['content-type'] = ContentType.RESTFUL;
    }
    this.headers = Object.assign({}, headerConfig, this.options.headers);
  }

  getToken() {
    return null;
    // return this.$auth.getToken ? this.$auth.getToken() : null;
  }

  uri(){
    const pathPrefix = this.options.pathPrefix || '';
    return urljoin((apiUrl || this.options.apiPrefix), pathPrefix, bizurl, Params.stringify(params, '?'));
  },
  /**
   * virtual: getSystemInfo
   */
  getSystemInfo() {
    // ....
    return {};
  }

  mixUrlWithHeader(bizurl, params = {}, apiUrl) {
    const pathPrefix = this.options.pathPrefix || '';

    return urljoin((apiUrl || this.options.apiPrefix), pathPrefix, bizurl, Params.stringify(params, '?'));
  }

  mixUrl(bizurl, params = {}, apiUrl) {
    const envParams = this.getSystemInfo();


    const transferType = this.envTransferType.toUpperCase();

    if (transferType === sessionType.HEADER) {
      for (const key in envParams) {
        this.headers[key] = envParams[key];
      }
      return urljoin((apiUrl || this.options.apiPrefix), pathPrefix, bizurl, Params.stringify(params, '?'));
    } else if (transferType === sessionType.QUERY) {
      const getPramas = Object.assign({}, envParams, params);

      return urljoin((apiUrl || this.options.apiPrefix), pathPrefix, bizurl, Params.stringify(getPramas, '?'));
    }
    return urljoin((apiUrl || this.options.apiPrefix), pathPrefix, bizurl, Params.stringify(params, '?'));

  }

  log(str) {
    console.log(str);
  }

  getCache(key) {
    // if (window.debug) {
    //   return null;
    // }
    const that = this;
    const resData = cache.get(key);

    if (resData) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          const retCode = that.getResponseBizCode(resData);

          if (this.$code.isSuccess(retCode)) {
            resolve(resData);
          } else {
            reject(resData);
          }
        }, 0);
      });
    }
    return null;
  }

  /**
   * 请求的 key, 用于缓存标记及请求队列
   * @param url
   * @param data
   * @returns {string}
   */
  getUniqueKey(url, data) {
    return url + JSON.stringify(data);
  }

  cacheExist(key, update = false) {
    if (update) {
      // 强制更新
      cache.remove(key);
      return false;
    }
    const resData = cache.get(key);

    return !!resData;
  }

  $prepare(url, data = {}, opts = {}, urlParam = {}) {
    opts.url = this.mixUrl(url, Object.assign({}, urlParam), opts.apiUrl);
    opts.cacheKey = this.getUniqueKey(opts.url, opts.data);
    opts.method = Methods.POST;

    if (data.toString() === '[object Array]') {
      opts.data = data;
    } else {
      opts.data = Object.assign({}, data);
    }

    let headerConfig = {};

    if (!opts.noHeader) {
      headerConfig = Object.assign({}, this.headers, opts.headers);
    }
    opts.headers = headerConfig;

    return opts;
  }

  /**
   * http的封装
   * @param config:{
   *
   *  cache:{       //cache不传则不开启
   *    time:1,      //0 不开启
   *    read:-1,    //-1不开启
   *  }
   * }
   * @param parseFunc
   * @returns {*}
   */
  request(config) {
    // 检查缓存里是否有数据
    const cachepattern = config.cache;
    const httpKey = this.getUniqueKey(config.url, config.data);

    if (this.cacheExist(httpKey, cachepattern && cachepattern.update)) {
      return this.getCache(httpKey);
    }

    // 没有缓存则从服务器获取

    // const checkQueue = ajaxQueue.checkInQueue(httpKey)
    //
    // if (checkQueue) {
    //   return checkQueue
    // }

    const that = this;
    let headerConfig = {};

    if (!config.noHeader) {
      headerConfig = Object.assign({}, this.headers, config.headers);
    }

    let customeCodes = config.codes || [];

    const silent = config.silent === undefined ? this.options.silent : !!config.silent;

    this.__showRequestState(config);

    const promise = new Promise(function (resolve, reject) {
      reject = reject || emptyFunction;
      const msgErrId = that.msgErrTag();

      return that.$axios({
        url: config.url,
        method: config.method || Methods.GET,
        data: config.data || {},
        headers: headerConfig,
        cache: false,
        timeout: that.options.timeout
      }).then((response) => {
        const resp = response.data;

        ajaxQueue.remove(httpKey);
        that.__hideRequestState(config);

        const retCode = that.getResponseBizCode(resp);

        if (that.$code.isSuccess(retCode)) {
          cachepattern && cache.set(httpKey, resp, cachepattern);
          resolve(that.getResponseData(resp));
        } else {
          that.report(response);
          if (!silent) {
            const errResult = that.$code.processBizError(retCode, customeCodes);

            if (errResult) {
              that.showError(errResult || that.options.defaultError);
            }
          }

          reject({response, msgErrId, biz: 1});
        }
      }).catch((response) => {
        ajaxQueue.remove(httpKey);
        that.__hideRequestState(config);
        that.report(response);
        if (!silent) {
          const errResult = that.$code.proccessHttpError(that.getReponseHttpStatus(response), customeCodes);

          if (errResult) {
            that.showError(errResult.message || that.options.defaultError);
          }
        }

        reject({response, msgErrId});
      });
    });

    return promise;
  }

  getLoadingState(config) {
    return config.progress === undefined ? this.options.progress : !!config.progress;
  }

  $put(url, data = {}, opts = {}, urlParam = {}) {
    opts.url = this.mixUrl(url, Object.assign({}, urlParam), opts.apiUrl);

    opts.method = Methods.PUT;

    opts.data = data;

    return this.request(opts);
  }

  $delete(url, data = {}, opts = {}, urlParam = {}) {
    opts.url = this.mixUrl(url, Object.assign({}, urlParam), opts.apiUrl);
    opts.method = Methods.DELETE;
    opts.data = data;

    return this.request(opts);
  }

  $post(url, data = {}, opts = {}, urlParam = {}) {
    opts.url = this.mixUrl(url, Object.assign({}, urlParam), opts.apiUrl);

    opts.method = Methods.POST;

    if (data.toString() === '[object Array]') {
      opts.data = data;
    } else {
      opts.data = Object.assign({}, data);
    }

    return this.request(opts);
  }

  $get(url, data = {}, opts = {}) {
    const params = Object.assign({}, data);

    opts.url = this.mixUrl(url, params, opts.apiUrl);

    opts.method = Methods.GET;

    return this.request(opts);
  }

  msgErrTag() {
    return Math.random().toString(36).substring(2, 15);
  }

  // ////////////////////////////////////  需要根据实际情况重载  //////////////////////////////////////////////////////
  __showRequestState(config) {
    const loadBar = this.getLoadingState(config);

    return this.showRequestState(loadBar);
  }

  showRequestState(loadingBar) {

    //
  }

  __hideRequestState(config) {
    const loadBar = this.getLoadingState(config);

    return this.hideRequestState(loadBar);
  }

  hideRequestState() {
    /*

                if (loadingBar) {
                    AjaxLoading.close()
                }
     */
  }

  showError(resp) {

    // dialog.alert(resp.retMessage || resp.exception || "服务器错误")

  }

  report() {

  }

  getResponseData(resp) {

  }

  getResponseBizCode(resp) {

  }

  getReponseHttpStatus(response) {
    return null;
  }
}
