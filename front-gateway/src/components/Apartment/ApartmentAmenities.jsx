import React, { Component } from 'react';
import _ from 'lodash';

// TODO: everything commented out is not supported yet
const amenitiesLeft = [
  { path: 'apartment.building.elevator', icon:'lift', label: 'מעלית' },
  { path: 'apartment.security_bars', icon:'bars', label: 'סורגים בחלונות' },
  { path: 'apartment.pets', icon:'dog', label: 'בע״ח: מותר' },
  // { path: '', icon:'partners', label: 'מתאימה לשותפים' },
  // { path: '', icon:'alarm', label: 'אינטרקום' },
  { path: 'apartment.parquet_floor', icon:'parquet', label: 'פרקט' },
  // { path: '', icon:'nature', label: 'גינה בבניין' },
  // { path: '', icon:'laundry', label: 'הכנה למכונת כביסה' },
  // { path: '', icon:'house', label: 'ממ״ד' }
];

const amenitiesRight = [
  { path: 'apartment.parking', icon: 'parking', label: 'חנייה' },
  { path: 'apartment.air_conditioning', icon: 'ac', label: 'מזגן' },
  { path: 'apartment.sun_heated_boiler', icon: 'solar', label: 'דוד שמש' },
  { path: 'apartment.balcony', icon: 'balcony', label: 'מרפסת' },
  // { path: '', icon: 'disabled', label: 'נגישות לנכים' },
  // { path: '', icon: 'arrow', label: 'תקרות גבוהות' },
  // { path: '', icon: 'wardrobe', label: 'ארון קיר' },
  // { path: '', icon: 'package', label: 'מחסן' }
];

export default class ApartmentAmenities extends Component {
  renderAmentites(amenities, listing) {
    const amenityList = amenities
      .filter(amenity => _.get(listing, amenity.path))
      .map((amenity, index) => (<li key={index}><img src={'https://s3.eu-central-1.amazonaws.com/dorbel-site-assets/images/amenities/icon-' + amenity.icon + '.svg'}/>{amenity.label}</li>));

    return (
      <div className="col-lg-5 col-sm-5 col-xs-6">
        <ul>
          {amenityList}
        </ul>
      </div>
    );
  }
  
  render() {
    const { listing } = this.props;

    return (
      <div className="row property-amenities">
        <div className="col-lg-2 col-sm-2 col-xs-12">
          <h5>תאור הנכס</h5>
        </div>
        {this.renderAmentites(amenitiesLeft, listing)}
        {this.renderAmentites(amenitiesRight, listing)}
      </div>
    );
  }
}

ApartmentAmenities.propTypes = {
  listing: React.PropTypes.object.isRequired
};