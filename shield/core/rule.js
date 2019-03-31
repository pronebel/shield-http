/**
 * 请求相关的最佳实践规则
 */
module.exports = {
  /**
   * 判断发送的数据是否是key:value对象
   * @param data
   * @returns {boolean}
   */
  sendDataIsObject(data) {
    // todo: check
    return true;
  },
  /**
   * 严格来讲,只有get的数据需要缓存.post/put/delete的不可缓存
   * @param method
   * @param methodRule
   * @returns {boolean}
   */
  cacheEnableInMethod(method, methodRule) {
    return methodRule.indexOf(method) > -1;
  },
  ResponseCodeNoEnableInHttpError(){

  }
};
