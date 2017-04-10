import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Nav, NavItem } from 'react-bootstrap';
import { MENU_ITEMS } from '../../Dashboard/DashboardShared';

import './UserProfileBadge.scss';

@observer(['appProviders', 'appStore'])
class UserProfileBadge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayMenu: false
    };
  }

  renderDashboardMenuItem(item) {
    const itemPath = '/dashboard/' + item.navTo;

    return <NavItem key={'header-profile-menu-item-' + item.navTo}
              onClick={(e) => this.routeTo(e, itemPath)}
              href={itemPath}
              className="header-profile-menu-item">
        <i className={'fa ' + item.faIconClassName}  aria-hidden="true"></i>
        {item.menuText}
      </NavItem>;
  }

  renderAuthenticationLink(isLoggedIn) {
    const { authProvider } = this.props.appProviders;
    const showDashboardMenu = process.env.NODE_ENV === 'development' && isLoggedIn;

    return isLoggedIn ?
      (
        <Nav>
          {showDashboardMenu ? MENU_ITEMS.map((item) => this.renderDashboardMenuItem(item)) : null}
          <NavItem
            onClick={authProvider.logout}
            className="user-profile-badge-auth user-profile-badge-auth-logout">
            <i className="fa fa-sign-out" />
            התנתק
          </NavItem>
        </Nav>
      )
      :
      (
        <Nav>
          <NavItem 
            onClick={authProvider.showLoginModal}
            className="user-profile-badge-auth">
            <i className="fa fa-sign-in" />
            התחבר
          </NavItem>
        </Nav>
      );
  }

  renderPersonalData(isLoggedIn) {
    const { authStore } = this.props.appStore;
    const profile = authStore.profile || {};

    return isLoggedIn ?
      (
        <div className="user-profile-badge-details">
          <i className="fa fa-ellipsis-v user-profile-badge-ellipsis-icon" />
          <img src={profile.picture} className="user-profile-badge-image" />
          <div className="user-profile-badge-name">
            <span>{profile.first_name ? profile.first_name : 'ברוכים'}</span>
            <span>{profile.first_name ? profile.last_name : 'הבאים'}</span>
          </div>
        </div>
      ) :
      (
        <div className="user-profile-badge-details">
          <i className="fa fa-ellipsis-v user-profile-badge-ellipsis-icon" />
          <div className="user-profile-badge-anonymous-icon-wrapper">
            <div className="user-profile-badge-anonymous-icon">
              <i className="fa fa-user" />
            </div>
          </div>
          <div className="user-profile-badge-auth-inline">
            {this.renderAuthenticationLink(isLoggedIn)}
          </div>
        </div>
      );
  }

  handleHover(isVisible) {
    this.setState({ displayMenu: isVisible });
  }

  render() {
    const { authStore } = this.props.appStore;
    const isLoggedIn = authStore.isLoggedIn;

    return (
      <div className="user-profile-badge" onMouseEnter={() => { this.handleHover(true); }} onMouseLeave={() => { this.handleHover(false); }}>
        {this.renderPersonalData(isLoggedIn)}
        <div className={'user-profile-badge-menu-desktop ' + (this.state.displayMenu ? 'active' : '')}>
          <div className="triangle-up" />
            {this.renderAuthenticationLink(isLoggedIn)}
        </div>
        <div className="user-profile-badge-menu-mobile">
          {this.renderAuthenticationLink(isLoggedIn)}
        </div>
      </div >
    );
  }
}

UserProfileBadge.wrappedComponent.propTypes = {
  appProviders: React.PropTypes.object,
  appStore: React.PropTypes.object,
};

export default UserProfileBadge;