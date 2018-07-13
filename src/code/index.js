/**
 * code判断
 * 假定:code是数字来设计的
 */
export default class index {

  constructor(options) {
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
    this.assembleErrorMsg = options.error || function () {
    };

  }

  isSuccess(code) {
    if (typeof this.$successCode === 'string') {
      if (this.$successCode === code) {
        return true;
      }
      return false;

    }
    // 比如200位成功,大于200都算成功,小于200算失败
    if (this.$successCode <= code) {
      return true;
    }
    return false;

  }

  proccessHttpError(codeVal) {
    let retErr = null;

    for (let i = 0; i < this.$status.length; i++) {
      let _code = this.$status[i];

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

  processBizError(codeVal) {
    let retErr = null;
    let that = this;

    for (let i = 0; i < this.$bizcode.length; i++) {
      let _code = this.$bizcode[i];
      let checkVal = _code.val;

      let typename = typeof checkVal;

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

}
