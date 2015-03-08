var React = require("react");

var Banner = React.createClass({
  render() {
    return(
      <div className="banner-wrapper">
        <header className="banner">
          <h1 className="banner__logo">
            <span className="banner__logo-highlight">
              [
            </span>
            :rgx:
            <span className="banner__logo-highlight">
              ]
            </span>
          </h1>

          <p className="banner__motto">
            <em>Express yourself.</em>
          </p>

          <nav className="banner__navigation">
            <a className="banner__navigation-item" href="/cheatsheet">
              Cheatsheet
            </a>

            <a className="banner__navigation-item" href="/browse">
              Browse
            </a>
          </nav>
        </header>
      </div>
    );
  }
});

module.exports = Banner;