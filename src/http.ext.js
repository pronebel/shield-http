import urljoin from 'url-join';
import Params from 'querystringify';
import {Methods, ContentType} from './constant';

import ICode from './icode';

let emptyFunction = function () {
};

export default class HttpExt {

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
  constructor(options, auth) {

    this.options = Object.assign({
      progress: true,
      silent: false,
      timeout: 100000,
      defaultError: '报错啦'
    }, options);
    this.apiPrefix = options.apiPrefix;
    this.envTransferType = options.envTransferType;

    this.injectHeaders();

    this.$code = new ICode(this.options);

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
    } else {
      headerConfig['content-type'] = ContentType.RESTFUL;
    }
    this.headers = Object.assign({}, headerConfig, this.options.headers);

  }

  getToken() {
    return this.$auth.getToken ? this.$auth.getToken() : null;
  }

  getSystemInfo() {
    /**
     {
           callerApp: "ICRMCLIENT",
           pageUrl: getCurrentPage(),
           userType: 'BANK_CUSTOMER'
       }
     *
     */
    let getInfoFunc = this.options.getSystemInfo;
    let envParams = getInfoFunc.call(this, ...arguments);

    let token = this.getToken();

    if (token) {
      envParams['token'] = token;
    }
    return envParams;
  }

  mixUrl(bizurl, params = {}, apiUrl) {

    let envParams = this.getSystemInfo();

    let pathPrefix = this.options.pathPrefix || '';

    if (this.envTransferType === 'HEADER') {

      for (let key in envParams) {
        this.headers[key] = envParams[key];
      }
      return urljoin((apiUrl || this.apiPrefix), pathPrefix, bizurl, Params.stringify(params, '?'));
    }
    let getPramas = Object.assign({}, envParams, params);

    return urljoin((apiUrl || this.apiPrefix), pathPrefix, bizurl, Params.stringify(getPramas, '?'));

  }

  log(str) {
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
  request(config) {
    let that = this;
    let headerConfig = Object.assign({}, this.headers, config.headers);

    let loadingBar = config.progress === undefined ? this.options.progress : !!config.progress;
    let silent = config.silent === undefined ? this.options.silent : !!config.silent;

    this.showRequestState(loadingBar);

    let promise = new Promise(function (resolve, reject) {

      reject = reject || emptyFunction;
      let msgErrId = that.msgErrTag();

      that.originalRequest({
        url: config.url,
        method: config.method || Methods.GET,
        data: config.data || {},
        header: headerConfig,
        cache: false,
        timeout: that.options.timeout,

        success: function (response) {

          let resp = response.data;

          that.hideRequestState();

          let retCode = that.getResponseBizCode(resp);

          if (that.$code.isSuccess(retCode)) {
            resolve(that.getResponseData(resp));
          } else {

            that.report(response);
            if (!silent) {
              let errResult = that.$code.processBizError(retCode);

              if (errResult) {
                that.showError(errResult.message || that.options.defaultError);
              }

            }

            reject({response, msgErrId, biz: 1});
          }
        },
        fail: function (response) {

          that.hideRequestState();
          that.report(response);
          if (!silent) {
            let errResult = that.$code.proccessHttpError(that.getReponseHttpStatus(response));

            if (errResult) {
              that.showError(errResult.message || that.options.defaultError);
            }
          }

          reject({response, msgErrId});

        }
      });

    });

    return promise;
  }

  getCacheKey(url, data) {
    return url + JSON.stringify(data);
  }

  $post(url, data = {}, opts = {}, urlParam = {}) {

    let cacheKey = this.getCacheKey(url, data);

    opts.url = this.mixUrl(url, Object.assign({}, urlParam), opts.apiUrl);
    opts.cacheKey = cacheKey;
    opts.method = Methods.POST;

    if (data.toString() === '[object Array]') {
      opts.data = data;
    } else {
      opts.data = Object.assign({}, data);
    }

    return this.request(opts);
  }

  $get(url, data = {}, opts = {}) {
    let params = Object.assign({}, data);
    let cacheKey = this.getCacheKey(url, data);

    opts.url = this.mixUrl(url, params, opts.apiUrl);
    opts.cacheKey = cacheKey;
    opts.method = Methods.GET;

    return this.request(opts);
  }

  msgErrTag() {
    return Math.random().toString(36).substring(2, 15);
  }

  // ////////////////////////////////////  需要根据实际情况重载  //////////////////////////////////////////////////////
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

  // //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  originalRequest(options) {
    // this.assembleRequestOptions(options)

  }

}
