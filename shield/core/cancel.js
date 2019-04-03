const _cancelManager = {};

function check(key) {
  return !!_cancelManager[key];
}
function push(key, cancelToken) {

  if (!_cancelManager[key]) {
    _cancelManager[key] = cancelToken;

  }

}
function clear(key) {
  if (_cancelManager[key]) {
    _cancelManager[key].apply(null);
    delete _cancelManager[key];
  }
}
function clearAll() {
  for (let key in _cancelManager) {
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
