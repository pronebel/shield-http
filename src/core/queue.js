const _ajaxQueue = {};

/**
 * ajax queue
 */
export default {

  checkInQueue(key) {

    if (!_ajaxQueue[key]) {
      _ajaxQueue[key] = 1;
      return null;
    }
    return new Promise(function (resolve, reject) {

    });
  },
  remove(key) {

    if (_ajaxQueue[key]) {
      delete _ajaxQueue[key];
    }
  }
};
