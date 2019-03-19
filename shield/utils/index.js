var utils = require('../../axios-lib/utils');

/**
 * check the value by Operator
 * @param operator
 * @param val
 * @returns {boolean}
 */
function checkValueByOperator(operator, val, context) {

  if (utils.isFunction(operator)) {
    if (operator.apply(context, [val])) {
      return true;
    }
  }

  if (operator instanceof RegExp) {
    if (operator.test(val)) {
      return true;
    }
  }

  if (operator === val) {
    return true;
  }

  return false;
}

module.exports = {
  checkValueByOperator: checkValueByOperator
};
