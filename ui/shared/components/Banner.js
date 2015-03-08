var React = require("react");
var Icon = require("components/Icon");
var { Link } = require("react-router");

var BannerItem = React.createClass({
  render() {
    return (
      <div
        className="banner__navigation-item"
        children={this.props.children}
        onClick={this.props.onClick}
      />
    )
  }
});

var Banner = React.createClass({
  propTypes: {
    dialect: React.PropTypes.string
  },

  render() {
    var dialect = decodeURIComponent(this.props.dialect || '');

    return(
      <div className="banner-wrapper">
        <header className="banner">
          <h1 className="banner__logo">
            <Link to="/">
              <span className="banner__logo-highlight">
                [
              </span>
              :rgx:
              <span className="banner__logo-highlight">
                ]
              </span>
            </Link>
          </h1>

          <p className="banner__motto">
            <em>Express yourself.</em>
          </p>

          <nav className="banner__navigation">
            {dialect.length > 0 &&
              <BannerItem onClick={this.openDialectPicker}>
                {' '}
                <Link to="dialects">{dialect}</Link>
                {''}
                <Icon className="icon-arrow-down" />
              </BannerItem>
            }

            {dialect.length > 0 &&
              <BannerItem>
                <Icon className="icon-book" />{' '}
                <a href="/cheatsheet">Cheatsheet</a>
              </BannerItem>
            }

            <BannerItem>
              <Icon className="icon-cube" />{' '}
              <a href="/browse">Browse</a>
            </BannerItem>
          </nav>
        </header>
      </div>
    );
  }
});

module.exports = Banner;