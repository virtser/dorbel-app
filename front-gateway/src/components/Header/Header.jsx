import React, { Component, PropTypes as T } from 'react';
import autobind from 'react-autobind';
import { inject, observer } from 'mobx-react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import isMobileJs from 'ismobilejs';
import UserProfileBadge from './UserProfileBadge/UserProfileBadge';
import { MENU_ITEMS } from '../Dashboard/DashboardShared';

import './Header.scss';

@inject('appStore', 'appProviders', 'router') @observer
class Header extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  static propTypes = {
    appProviders: T.object,
    appStore: T.object
  }

  renderDashboardMenuItem(item) {
    const itemPath = '/dashboard/' + item.navTo;
    const isSelected = process.env.IS_CLIENT ? (location.pathname === itemPath) : false;

    return <NavItem key={'header-dashboard-menu-item-' + item.navTo}
              onClick={(e) => this.routeTo(e, itemPath)}
              href={itemPath}
              className={'header-dashboard-menu-item ' + (isSelected ? 'header-dashboard-menu-item-selected' : '')}>
        <i className={'header-dashboard-menu-item-icon fa ' + item.faIconClassName}  aria-hidden="true"></i>
        {item.menuText}
      </NavItem>;
  }

  redirect(e) {
    const href = e.target.href;
    if ((e.metaKey || e.ctrlKey) && window) {
      window.open(href);
    } else if (location) {
      location.href = href;
    }
  }

  routeTo(e, link) {
    if ((e.metaKey || e.ctrlKey) && window) {
      window.open(link);
    } else if (this.props.router.setRoute) {
      this.props.router.setRoute(link);
    }
  }

  headerToggleHandler(navExpanded) {
    const intercomContainer = document.getElementById('intercom-container');
    intercomContainer.style.display = navExpanded ? 'none' : 'block';
  }

  componentDidMount() {
    this.mobileMenu = document.getElementsByClassName('navbar-collapse')[0];
    this.mobileMenuToggle = document.getElementsByClassName('navbar-toggle')[0];
  }

  render() {
    const { authProvider } = this.props.appProviders;
    const { authStore } = this.props.appStore;
    const isLoggedIn = authStore.isLoggedIn;
    const isMobile = isMobileJs.phone;
    const externalURL = 'https://www.dorbel.com';

    return (
      <Navbar className="header-navbar"
              collapseOnSelect fixedTop fluid inverse
              onToggle={this.headerToggleHandler}>
        <Navbar.Header>
          <Navbar.Brand>
            <a href={externalURL}
              className="header-navbar-logo-anchor">
              <img src="https://static.dorbel.com/images/logo/dorbel_logo_white.svg"
                alt="Dorbel" className="header-logo-image"/>
            </a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <UserProfileBadge />
          <Nav className="header-navbar-links">
            {MENU_ITEMS.map((item) => this.renderDashboardMenuItem(item))}
            {isMobile ?
              <NavItem className="header-navbar-btn-publish" onClick={(e) => this.routeTo(e, '/apartments/new_form')}
                href="/apartments/new_form">פרסמו דירה</NavItem>
            :
              null}
            {isMobile ?
              <NavItem onClick={(e) => this.routeTo(e, '/apartments')} href="/apartments">מצאו דירה</NavItem>
            :
              null}
            <NavItem onClick={this.redirect} href={externalURL + '/pages/about_us'}>
              מי אנחנו</NavItem>
            <NavItem onClick={this.redirect} href={externalURL + '/pages/owner'}>
              בעלי דירות</NavItem>
            <NavItem className="header-navbar-owner-services-navitem"
              onClick={this.redirect}
              href={externalURL + '/pages/services'}>שירותי פרימיום</NavItem>            
            {isMobile ?
              null
            :
              <NavItem onClick={(e) => this.routeTo(e, '/apartments')} href="/apartments">מצאו דירה</NavItem>
            }
            {isMobile ?
              null
            :
              <NavItem className="header-navbar-btn-publish" onClick={(e) => this.routeTo(e, '/apartments/new_form')}
                href="/apartments/new_form">פרסמו דירה</NavItem>
            }
            {isLoggedIn ?
              <NavItem onClick={authProvider.logout}
                className="header-navbar-profile-login-text">
                <i className="fa fa-sign-out" />
                התנתק
              </NavItem>
              :
              <NavItem onClick={authProvider.showLoginModal}
                className="header-navbar-profile-login-text">
                <i className="fa fa-sign-in" />
                התחבר
              </NavItem>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

Header.wrappedComponent.propTypes = {
  router: React.PropTypes.any
};

export default Header;
