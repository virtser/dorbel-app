'use strict';
import React from 'react';
import { observer } from 'mobx-react';
import { Nav, NavItem, Navbar } from 'react-bootstrap';
import autobind from 'react-autobind';
import _ from 'lodash';
import ReactTooltip from 'react-tooltip';
import ListingStatusSelector from './ListingStatusSelector.jsx';

const tabs = [
  { relativeRoute: '', title: 'מודעת הדירה' },
  { relativeRoute: 'events', title: 'מועדי ביקור' }
];

@observer(['appStore', 'router'])
export default class ListingMenu extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  renderTooltip() {
    const tipOffset = {top: -7, left: 15};

    return (
      <span>
        <span data-tip="קבעו מועדי ביקור חדשים וצפו בנרשמים.">&nbsp;&nbsp;<i className="fa fa-info-circle" aria-hidden="true"></i></span>
        <ReactTooltip type="dark" effect="solid" place="left" offset={tipOffset} />
      </span>
    );
  }

  renderMenu() {
    const { currentAction, listing } = this.props;
    const activeTab = _.find(tabs, { relativeRoute: currentAction }) || tabs[0];

    return (
      <Navbar className="listing-menu-tabs">
        <Nav bsStyle="tabs" activeKey={activeTab.relativeRoute} onSelect={this.changeTab}>
          {tabs.map(tab => 
            <NavItem key={tab.relativeRoute} eventKey={tab.relativeRoute}>
              {tab.title} {tab.relativeRoute === 'events' ? this.renderTooltip() : ''}
            </NavItem>
          )}
        </Nav>
        {currentAction === 'events' ? '' : <ListingStatusSelector listing={listing} />}
      </Navbar>
    );
  }

  changeTab(relativeRoute) {
    const { router, listing } = this.props;
    let actionRoute = relativeRoute ? `/${relativeRoute}` : '';
    router.setRoute(`/apartments/${listing.id}${actionRoute}`);
  }

  shouldMenuBeVisible() {
    const { appStore, listing } = this.props;
    return appStore.listingStore.isListingPublisherOrAdmin(listing);
  }

  render() {
    return this.shouldMenuBeVisible() ? this.renderMenu() : null;
  }
}

ListingMenu.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object,
  router: React.PropTypes.object,
  listing: React.PropTypes.object.isRequired,
  currentAction: React.PropTypes.string
};