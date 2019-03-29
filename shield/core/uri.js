import urljoin from 'url-join';
import Params from 'querystringify';

module.exports = function (httpUrl, query, prefix = {}) {
  let {api, path} = prefix;

  return urljoin(api, path, httpUrl, Params.stringify(query, '?'));
};
