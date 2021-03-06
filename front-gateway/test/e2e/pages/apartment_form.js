'use stric';
const common = require('../common');
const imagePath = common.IS_CI ? 'C:/Users/hello/Desktop/images/logo1.jpg' : __dirname + '/resources/test.png';

module.exports = {
  url: function () {
    return common.getBaseUrl() + '/apartments/submit';
  },
  sections: {
    apartmentDetails: {
      selector: '.apartment-details-step',
      elements: {
        city: {
          selector: 'select[name="apartment.building.city.id"]'
        },
        neighbourhood: {
          selector: 'select[name="apartment.building.neighborhood.id"] option:nth-of-type(2)'
        },
        street: {
          selector: 'input[name="apartment.building.street_name"]'
        },
        houseNumber: {
          selector: 'input[name="apartment.building.house_number"]'
        },
        apartmentNumber: {
          selector: 'input[name="apartment.apt_number"]'
        },
        buildingEntrance: {
          selector: 'input[name="apartment.building.entrance"]'
        },
        apartmentFloor: {
          selector: 'input[name="apartment.floor"]'
        },
        buildingFloors: {
          selector: 'input[name="apartment.building.floors"]'
        },
        apartmentSize: {
          selector: 'input[name="apartment.size"]'
        },
        apartmentRooms: {
          selector: 'select[name="apartment.rooms"]'
        },
        description: {
          selector: 'textarea[name="description"]'
        },
        parking: {
          selector: 'input[name="apartment.parking"]'
        },
        elevator: {
          selector: 'input[name="apartment.building.elevator"]'
        },
        sunHeaterBoiler: {
          selector: 'input[name="apartment.sun_heated_boiler"]'
        },
        pets: {
          selector: 'input[name="apartment.pets"]'
        },
        airCondition: {
          selector: 'input[name="apartment.air_conditioning"]'
        },
        balcony: {
          selector: 'input[name="apartment.balcony"]'
        },
        securityBars: {
          selector: 'input[name="apartment.security_bars"]'
        },
        parquetFloor: {
          selector: 'input[name="apartment.parquet_floor"]'
        },
        entranceDate: {
          selector: 'input[name="apartment.entrance-date"] + input'
        },
        exitDate: {
          selector: 'input[name="apartment.exit-date"] + input'
        },
        entranceDateCalendar: {
          selector: '#calendar'
        },
        monthlyRent: {
          selector: 'input[name="monthly_rent"]'
        },
        propertyTax: {
          selector: 'input[name="property_tax"]'
        },
        boardFee: {
          selector: 'input[name="board_fee"]'
        },
        nextStep: {
          selector: 'i.apartment-details-next-step'
        }
      }
    },
    apartmentPictures: {
      selector: '.apartment-pictures-step',
      elements: {
        addNewPhoto: {
          selector: 'span.add-photo'
        },
        nextStep: {
          selector: '.step-btn.step2.btn.btn-success'
        },
        previousStep: {
          selector: 'i.apartment-pictures-previous-step'
        }
      }
    },
    contactDetails: {
      selector: '.contact-details-step',
      elements: {
        firstName: {
          selector: 'input[name="user.firstname"]'
        },
        lastName: {
          selector: 'input[name="user.lastname"]'
        },
        email: {
          selector: 'input[name="user.email"]'
        },
        phone: {
          selector: 'input[name="user.phone"]'
        },
        submit: {
          selector: 'button.step-btn'
        },
        previousStep: {
          selector: 'i.open-house-event-previous-step'
        }
      }
    },
    successModal: {
      selector: '.modal-dialog',
      elements: {
        successTitle: {
          selector: '.modal-header > h4'
        },
        listingId: {
          selector: '.modal-body .modal-container'
        },
        okButton: {
          selector: '.submit-success'
        }
      }
    }
  },
  commands: [{
    navigateToApartmentDetailsSection: function () {
      this
        .navigate()
        .waitForElementVisible('body');
      return this;
    },
    navigateToApartmentPicturesSection: function () {
      this
        .navigateToApartmentDetailsSection()
        .fillApartmentDetailsAllFields()
        .goFromApartmentDetailsToApartmentPictures();
      return this;
    },
    goFromApartmentPicturesToApartmentDetails: function () {
      this.section.apartmentPictures.click('@previousStep');
      return this;
    },
    goFromApartmentDetailsToApartmentPictures: function () {
      this.section.apartmentDetails.click('@nextStep');
      return this;
    },
    goFromApartmentPicturesToContactDetails: function () {
      this.section.apartmentPictures.click('@nextStep');
      return this;
    },
    goFromContactDetailsToApartmentPictures: function () {
      this.section.contactDetails.click('@previousStep');
      return this;
    },
    fillApartmentDetailsAllFields: function () {
      this.section.apartmentDetails
        .waitForElementVisible('@city')
        .setValue('@city', 'הרצליה')
        .waitForElementVisible('@neighbourhood')
        .click('@neighbourhood')
        .setValue('@street', 'בן יהודה')
        .setValue('@houseNumber', common.getMediumRandomNumber())
        .setValue('@apartmentNumber', common.getMediumRandomNumber())
        .setValue('@buildingEntrance', common.getSmallRandomNumber())
        .setValue('@apartmentFloor', common.getSmallRandomNumber())
        .setValue('@buildingFloors', common.getSmallRandomNumber())
        .setValue('@apartmentSize', common.getMediumRandomNumber())
        .setValue('@apartmentRooms', common.getSmallRandomNumber())
        .setValue('@description', 'דירה יפה לבדיקה')
        .click('@parking')
        .click('@elevator')
        .click('@sunHeaterBoiler')
        .click('@pets')
        .click('@airCondition')
        .click('@balcony')
        .click('@securityBars')
        .click('@parquetFloor')
        .setValue('@entranceDate', '')
        .setValue('@monthlyRent', common.getBigRandomNumber())
        .setValue('@propertyTax', common.getBigRandomNumber())
        .setValue('@boardFee', common.getBigRandomNumber());
      return this;
    },
    clearUserDetailsFields: function () {
      this.section.contactDetails
        .clearValue('@firstName')
        .clearValue('@lastName')
        .clearValue('@email')
        .clearValue('@phone');
      return this;
    },
    fillUserDetailsFields: function (user) {
      this.section.contactDetails
        .setValue('@firstName', user.firstName)
        .setValue('@lastName', user.lastName)
        .setValue('@phone', user.phone);
      return this;
    },
    submitApartment: function () {
      this.section.contactDetails.click('@submit');
      return this;
    },
    uploadImage: function () {
      this.section.apartmentPictures
        .waitForElementVisible('.add-photo')
        .setValue('input[type="file"]', imagePath)
        .waitForElementVisible('.remove-image', 5000);
      return this;
    }
  }]
};
