require('./index.less');

var React = require('react');
var Router = require('react-router');
var Root = require('./views/Root.js');

require('./config/codemirror');

var { Route, DefaultRoute, NotFoundRoute, HashLocation } = Router;

var router = Router.create({
  location: HashLocation,
  routes: [
    <Route name="root" path="/" handler={Root}>
      <DefaultRoute name="editor" handler={require("./views/Editor")} />
    </Route>,

    <NotFoundRoute
      name="not-found"
      handler={require('./views/NotFound')}
    />
  ]
});

router.run(function(Handler, state) {
  React.render(<Handler {...state} />, document.querySelector("#__app__"));
});