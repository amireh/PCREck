var React = require("react");
var Icon = require("components/Icon");
var Button = require("components/Button");
var DialectPicker = require("components/DialectPicker");
var { Link } = require("react-router");
var Popup = require('qjunk/lib/Popup');
var AppStore = require('AppStore');

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

  componentDidUpdate: function(prevProps, prevState) {
    if (this.refs.popup) {
      this.refs.popup.reposition();
    }
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
            <em>Express</em> yourself.
          </p>

          <nav className="banner__navigation">
            {dialect.length > 0 &&
              <Popup
                ref="popup"
                content={DialectPicker}
                activeDialect={dialect}
                availableDialects={AppStore.getSingleton().getAvailableDialects()}
                popupOptions={
                  {
                    position: {
                      my: 'top center',
                      at: 'bottom center',
                      offset: {
                        y: -10
                      }
                    }
                  }
                }
              >
                <BannerItem>
                  <Icon className="icon-arrow-down" />
                  {' '}
                  <a>{dialect}</a>
                </BannerItem>
              </Popup>
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