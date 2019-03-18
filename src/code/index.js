/**
 * code判断
 * 假定:code是数字来设计的
 */
export default class index {
  constructor(options) {
    this.$successCode = options.successCode;
    this.$status = options.status || [];
    this.$bizcode = options.codes || [];
    /**
     * return {
         *      message:xxxx
         *
         * }
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
      const _code = this.$status[i];

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

  getError(codeVal, codes = []) {
    let retErr = null;
    const that = this;

    for (let i = 0; i < codes.length; i++) {
      const _code = codes[i];
      const checkVal = _code.val;

      const typename = typeof checkVal;

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
    return retErr;
  }
  processBizError(codeVal, customerCode = []) {

    let retErr = this.getError(codeVal, customerCode);

    if (!retErr) {
      retErr = this.getError(codeVal, this.$bizcode);
    }

    if (retErr) {
      return this.assembleErrorMsg(retErr);
    }
    return {
      message: '服务器报错'
    };

  }
}
