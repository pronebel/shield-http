import utils from '../../axios-lib/utils';
import axios from '../../axios-lib/axios';
import rules from './rule';
import axiosCreateError from '../../axios-lib/core/createError';
import uuidv4 from 'uuid/v4';
import urljoin from 'url-join';
import Params from 'querystringify';
import Methods from '../constant/method';
import ContentType from '../constant/content';
import sessionType from '../constant/session';
import {cache} from 'shield-store';
import ICode from '../code';
import QueueManager from './queue';
import CancelManager from './cancel';
import CancelToken from '../../axios-lib/cancel/CancelToken';



const emptyFunction = function () {
};

const EVENTS = ['authError'];

/**
 * default options
 * 默认options配置
 */
let defaultOptions = {
  progress: true,
  silent: false,
  timeout: 10000,
  method: Methods.GET,
  tokenKey: 'session',
  apiPrefix: '/',
  pathPrefix: '/',
  cacheMethods: [Methods.GET],
  cancelToken: null,
  enableCancel: false,
  defaultErrorMessage: 'request error',
  isSuccess: function () {
    return true;
  }
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
  constructor(options, axiosInstance) {
    this.options = Object.assign(defaultOptions, options);

    this.transterType = options.transterType;
    this.$axios = axiosInstance || axios;

    this.injectHeaders();
    this.injectGlobalCodes();

    /**
     * refer Constant Var
     */
    this.METHODS = Methods;
    this.CONTENT_TYPE = ContentType;
  }

  injectGlobalCodes() {
    let {codes, status, error} = this.options || {};

    this.$code = new ICode({codes, status, error});
  }

  /**
   * 设置默认的全局头部header变量
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

  /**
   * virtual:checkAuthorize
   * @returns {null}
   */
  checkAuthorize() {
    return true;
  }

  mixUri(bizurl, params = {}, apiUrl) {
    let arr = [];

    arr.push(apiUrl || this.options.apiPrefix);
    arr.push(this.options.pathPrefix || '');
    arr.push(bizurl);
    arr.push(Params.stringify(params, '?'));

    return urljoin.apply(null, arr);
  }
  /**
   * virtual: getSystemInfo
   */
  getSystemInfo() {
    // ....
    return {};
  }

  mixUrl(bizurl, params = {}, apiUrl) {

    const transferType = this.transterType.toUpperCase();

    if (transferType === sessionType.QUERY) {
      const envParams = this.getSystemInfo();

      return this.mixUri(
        bizurl,
        Object.assign({}, envParams, params),
        apiUrl
      );
    }
    return this.mixUri(bizurl, params, apiUrl);

  }

  /**
   * 获取请求的缓存
   * @param key
   * @returns {*}
   */
  requestCache(key) {
    const that = this;
    const resData = cache.get(key);

    if (resData) {
      return {
        cancel: null,
        request: function () {
          return new Promise(function (resolve, reject) {
            setTimeout(function () {
              const retCode = that.transformResponseCode(resData);

              if (this.options.isSuccess(retCode)) {
                resolve(resData);
              } else {
                reject(resData);
              }
            }, 0);
          });
        }
      };
    }
    return null;
  }

  /**
   * 请求的 key, 用于缓存标记及请求队列
   * @param url
   * @param data
   * @returns {string}
   */
  getUniqueKey(config) {
    let {url, data} = config || {};

    return url + JSON.stringify(data);
  }

  /**
   * 检查缓存是否存在,
   * @param key:缓存的key
   * @param update:是否强制更新
   * @returns {boolean}
   */
  cacheExist(key, update = false) {
    if (update) {
      cache.remove(key);
      return false;
    }
    const resData = cache.get(key);

    return !!resData;
  }

  /**
   * 单独为每个请求实例化请求的header
   * @param config
   * @returns {*}
   */
  prepareHeader(config) {
    if (!config.noHeader) {
      let envParams = {};

      if (this.transterType.toUpperCase() === sessionType.HEADER) {
        envParams = this.getSystemInfo();
      }
      return Object.assign({}, this.headers, envParams, config.headers);
    }
    return {};

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

    const httpKey = config.httpKey;

    // 检查缓存里是否有数据
    const pattern = rules.cacheEnableInMethod(config.method, this.options.cacheMethods) ? config.cache : null;

    if (pattern && this.cacheExist(httpKey, pattern && pattern.update)) {
      return this.requestCache(httpKey);
    }
    return this.requestExec(config, httpKey, pattern);
  }
  beforeRequest(config) {
    this.__showRequestState(config);
  }
  afterRequest(config) {

    this.__hideRequestState(config);
  }

  checkReponseTypeIsFile(responseType) {
    return responseType && (responseType.toLowerCase() === 'stream' || responseType.toLowerCase() === 'blob');
  }
  /**
   *
   * @param config
   * @param httpKey
   * @param cachepattern:缓存策略
   * @returns {Promise<any>}
   */
  requestExec(config, httpKey, cachepattern) {
    this.beforeRequest(config);

    const that = this;

    config.cancelToken = null;
    if (config.enableCancel === true) {
      config.cancelToken = this.genCancelToken(httpKey);
    }
    const silent = config.silent === undefined ? this.options.silent : !!config.silent;

    function request() {

      const promise = new Promise(function (resolve, reject) {
        reject = reject || emptyFunction;

        let requestOptions = {
          url: config.url,
          method: config.method || Methods.GET,
          data: config.data || {},
          headers: this.prepareHeader(config),
          cache: false,
          timeout: that.options.timeout

        };

        if (config.responseType) {
          requestOptions['responseType'] = config.responseType;
        }

        if (config.cancelToken) {
          requestOptions['cancelToken'] = config.cancelToken;
        }

        return that.$axios().then((response) => {
          const resp = response.data;

          QueueManager.remove(httpKey);
          that.afterRequest(config);
          if (that.checkReponseTypeIsFile(config.responseType)) {
            resolve(resp);
          } else {
            const retCode = that.transformResponseCode(resp);

            if (that.options.isSuccess(retCode)) {
              cachepattern && cache.set(httpKey, resp, cachepattern);
              resolve(that.transformResponseData(resp));
            } else {
              that.report(response);
              if (!silent) {
                that.__showError(retCode, config.codes);
              }
              reject({response, msgErrId: that.__msgErrTag(), biz: 1});
            }
          }

        }).catch((response) => {
          QueueManager.remove(httpKey);
          that.afterRequest(config);
          that.report(response);
          if (!silent) {
            that.__showError(that.transformHttpStatus(response));
          }
          reject({response, msgErrId: that.__msgErrTag()});
        });
      });

      return promise;
    }

    return {
      cancel: CancelManager.get(httpKey),
      request
    };
  }

  getLoadingState(config) {
    return config.progress === undefined ? this.options.progress : !!config.progress;
  }

  $prepare(url, reqData = {}, opts = {}) {
    let {data, query} = reqData;

    opts.url = this.mixUrl(url, query, opts.apiUrl);
    opts.data = data;
    let headerConfig = {};

    if (!opts.noHeader) {
      headerConfig = Object.assign({}, this.headers, opts.headers);
    }
    opts.headers = headerConfig;

    return opts;
  }

  genCancelToken(httpKey) {

    return new CancelToken((cancel) => {
      CancelManager.push(httpKey, cancel);
    });
  }

  /**
   *
   * @param url: 请求的地址,搭配全局的path,和apiurl组成完整的url路径
   * @param reqData: {
   *   data:请求数据,
   *   query:用于在非get情况下,需要在url后面增加query参数的情况
   * }
   * @param opts
   * @returns {*}
   */
  $request(url, reqData = {}, opts = {}) {

    if (opts.authorize === true) {
      if (!this.checkAuthorize()) {
        return Promise.reject();
      }
    }

    let {data, query} = reqData;

    opts.url = this.mixUrl(url, query, opts.apiUrl);
    opts.data = data;
    opts.httpKey = this.getUniqueKey(opts);

    let httpKey = opts.httpKey;

    if (!QueueManager.check(httpKey)) {

      return this.request(opts);

    }
    return Promise.reject();

  }

  __msgErrTag() {
    return this.msgGenerateId();
  }
  __showRequestState(config) {
    const loadBar = this.getLoadingState(config);

    return this.showRequestState(loadBar);
  }
  __hideRequestState(config) {
    const loadBar = this.getLoadingState(config);

    return this.hideRequestState(loadBar);
  }
  __showError(retCode, customCode, isBizError) {
    const errResult = isBizError ? this.$code.checkBiz(retCode, customCode) : this.$code.checkHttp(retCode);

    if (errResult) {
      this.showError(errResult.message || this.options.defaultErrorMessage);
    }
  }
  // ////////////////////////////////////  需要根据实际情况重载  //////////////////////////////////////////////////////
  msgGenerateId() {
    return Math.random().toString(36).substring(2, 15);
  }
  showRequestState(loadingBar) {

    //
  }

  hideRequestState() {
    /*

                if (loadingBar) {
                    AjaxLoading.close()
                }
     */
  }

  showError(message) {

    // dialog.alert(resp.retMessage || resp.exception || "服务器错误")

  }

  /**
   * virtual
   * @param resp
   */
  report() {

  }

  /**
   * virtual
   * @param resp
   */
  transformResponseData(resp) {

  }

  /**
   * virtual
   * @param resp
   */
  transformResponseCode(resp) {

  }

  /**
   * virtual
   * @param resp
   */
  transformHttpStatus(resp) {
    return null;
  }
}
