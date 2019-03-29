const shildeUtils = require('../utils/index');

function emptyFunction() {

  return function (err) {
    return err;
  };

}

class ICode {
  constructor(options) {
    this.$status = options.status || [];
    this.$bizcode = options.codes || [];
    this.assembleErrorMsg = options.error || emptyFunction();
    this.isSuccess = options.isSuccess;
  }

  checkHttp(codeVal) {
    return this.getError(codeVal, this.$status);
  }

  checkBiz(codeVal, customCodes = []) {

    let retErr = this.getError(codeVal, customCodes);

    if (!retErr) {
      retErr = this.getError(codeVal, this.$bizcode);
    }
    return this.assembleErrorMsg(retErr);

  }

  getError(codeVal, codes = []) {
    let retErr = null;

    for (let i = 0; i < codes.length; i++) {
      let _code = codes[i];

      if (shildeUtils.checkValueByOperator(_code.val, codeVal, this)) {
        retErr = _code;
        break;
      }

    }
    return retErr;
  }
}

module.exports = Code;
