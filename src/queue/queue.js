/**
 * 请求的队列
 * @type {{checkInQueue: ((p1:*)), remove: ((key))}}
 */
export default {

  checkInQueue: (key) => {
    window.ajaxQueueData = window.ajaxQueueData || {};
    const queue = window.ajaxQueueData;

    if (!queue[key]) { // not in
      queue[key] = 1;
      return null;
    }
    return new Promise(function (resolve, reject) {

    });
  },
  remove(key) {
    window.ajaxQueueData = window.ajaxQueueData || {};
    if (window.ajaxQueueData[key]) {
      delete window.ajaxQueueData[key];
    }
  }
};
