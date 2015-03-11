var React = require('react');
var Router = require('react-router');
var AppStore = require('AppStore');
var Root = require('./views/Root');
var Actions = require('Actions');

require('./config/codemirror');
require('./css/index.less');

var { Route, DefaultRoute, NotFoundRoute, HashLocation } = Router;

var router = Router.create({
  location: HashLocation,
  routes: [
    <Route name="root" path="/" handler={Root}>
      <DefaultRoute
        name="dialects"
        handler={require("./views/Dialects")}
      />

      <Route
        name="editor"
        path="/dialects/:dialect"
        handler={require("./views/Editor")}
      />

      <NotFoundRoute
        name="not-found"
        handler={require('./views/NotFound')}
      />
    </Route>,
  ]
});

router.run(function(Handler, state) {
  Actions.clearTransientState();
  React.render(<Handler {...state} />, document.querySelector("#__app__"));
});