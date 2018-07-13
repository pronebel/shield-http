/**
 * 请求的队列
 * @type {{checkInQueue: ((p1:*)), remove: ((key))}}
 */
export default {

  checkInQueue: (key) => {
    window.ajaxQueueData = window.ajaxQueueData || {};
    let queue = window.ajaxQueueData;

    if (!queue[key]) { // not in
      queue[key] = 1;
      return null;
    }
    return new Promise(function (resolve, reject) {

    });

  },
  remove(key) {
    window.ajaxQueueData = window.ajaxQueueData || {};
    delete window.ajaxQueueData[key];
  }
};
