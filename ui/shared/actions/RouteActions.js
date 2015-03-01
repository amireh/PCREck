var { keys } = Object;
var delegate;

/**
 * Update the query string to reflect the new given key/value pairs. This
 * will trigger a re-transition of the current route.
 *
 * @param  {Object} newQuery
 *         The query parameters.
 */
exports.updateQuery = function(newQuery) {
  var routes = delegate.getRoutes();
  var currentRouteName = routes[routes.length-1].name;
  var query = exports.adjustQuery(newQuery);

  delegate.replaceWith(currentRouteName, delegate.getParams(), query);
};

exports.adjustQuery = function(newQuery) {
  var query = delegate.getQuery();

  keys(newQuery).forEach(function(key) {
    query[key] = newQuery[key];
  });

  return query;
};

exports.assignDelegate = function(inDelegate) {
  delegate = inDelegate;
};