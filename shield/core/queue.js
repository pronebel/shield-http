const _ajaxQueue = {};

function check(key) {
  return !!_ajaxQueue[key];
}
function push(key, value) {

  if (!_ajaxQueue[key]) {
    _ajaxQueue[key] = value;

  }

}
function clear(key) {
  if (_ajaxQueue[key]) {
    _ajaxQueue[key].apply(null);
    delete _ajaxQueue[key];
  }
}
function clearAll() {
  for (let key in _ajaxQueue) {
    clear(key);
  }
}

/**
 * ajax queue
 */
export default {
  check,
  push,
  clear,
  clearAll
};
