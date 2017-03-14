import React from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { MenuItem, Nav, NavDropdown } from 'react-bootstrap';
import autobind from 'react-autobind';
import utils from '~/providers/utils';

const listingStatusLabels = utils.getListingStatusLabels();

@observer(['appStore', 'appProviders'])
class ListingStatusSelector extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  changeStatus(newStatus) {
    const { listing, appStore, appProviders } = this.props;

    const openHouseEvents = appStore.oheStore.oheByListingId(listing.id);
    const listingHasActiveEvents = openHouseEvents.some(event => event.status !== 'expired');

    let confirmation = Promise.resolve(true);

    if (newStatus === 'rented' && listingHasActiveEvents) {
      confirmation = appProviders.modalProvider.showConfirmationModal({
        title: 'סימון הדירה כמושכרת',
        heading: 'השכרתם את הדירה? בשעה טובה!',
        body: 'שימו לב - למועדה זו מועדי ביקור פעילים. סימון הדירה כמושכרת יבטל את מועדי הביקור וישלח על כך עדכון לדיירים הרשומים, במידה וישנם.',
        confirmButton: 'הדירה הושכרה',
        confirmStyle: 'primary'
      });
    } else if (newStatus === 'unlisted' && listingHasActiveEvents) {
      confirmation = appProviders.modalProvider.showConfirmationModal({
        title: 'הפסקת פרסום המודעה',
        heading: 'ברצונכם לעצור את פרסום המודעה?',
        body: 'שימו לב - למועדה זו מועדי ביקור פעילים. השהיית המודעה תבטל את מועדי הביקור הקיימים ותשלח על כך עדכון לדיירים הרשומים, במידה וישנם.',
        confirmButton: 'השהה מודעה'
      });
    }

    confirmation.then(choice => {
      if (choice) {
        return appProviders.listingsProvider.updateListingStatus(listing.id, newStatus);
      }
    }).catch((err) => this.props.appProviders.notificationProvider.error(err));
  }

  render() {
    const { listing } = this.props;
    const currentStatus = listingStatusLabels[listing.status].label;
    const options = _.get(listing, 'meta.possibleStatuses') || [];

    return (
      <Nav bsStyle="tabs" className="listing-menu-status-selector" onSelect={this.changeStatus} pullLeft>
        <NavDropdown title={currentStatus} id="nav-dropdown" disabled={options.length === 0}>
          {options.map(status => <MenuItem id={status} key={status} eventKey={status}>{listingStatusLabels[status].actionLabel}</MenuItem>)}
        </NavDropdown>
      </Nav>
    );
  }
}

ListingStatusSelector.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object,
  appProviders: React.PropTypes.object,
  listing: React.PropTypes.object.isRequired
};

export default ListingStatusSelector;