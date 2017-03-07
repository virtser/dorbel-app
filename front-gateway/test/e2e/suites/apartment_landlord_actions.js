'use stric';
const common = require('../common');
let home, apartmentForm;

function login() {
  home.navigate().signIn('landlord');
}

function loginOnStep3() {
  home.signInForm('landlord');
}

module.exports = {
  beforeEach: function (browser) {
    home = browser.page.home();
    home.resizeDesktop(browser);
    apartmentForm = browser.page.apartment_form();
  },
  'should go back from apartment details to previous screen': function (browser) {
    apartmentForm
      .navigateToApartmentDetailsSection()
      .goFromApartmentDetailsToApartmentPictures()
      .expect.section('@apartmentPictures').to.be.visible;
    browser.end();
  },
  'should go back from event details to previous screen': function (browser) {
    apartmentForm
      .navigateToOpenHouseEventSection()
      .goFromOpenHouseEventToApartmentDetails()
      .expect.section('@apartmentDetails').to.be.visible;
    browser.end();
  },  
  'should fail to go to step3 as user details in step2 were not filled': function (browser) {
    apartmentForm
      .navigateToApartmentDetailsSection()
      .goFromApartmentDetailsToOpenHouseEvent()
      .expect.section('@openHouseEvent').to.not.be.present;
    browser.end();
  },
  'should fail to submit a new apartment because of mising user details': function (browser) {
    login();    
    apartmentForm
      .navigateToOpenHouseEventSection()
      .clearUserDetailsFields()
      .submitApartment()
      .expect.section('@successModal').to.not.be.present;
    browser.end();
  },
  'should successfully submit a new apartment with logged in user': function (browser) {
    login();
    apartmentForm
      .fillAndSubmitApartment()
      .expect.section('@successModal').to.be.visible;
    common.waitForText(apartmentForm.section.successModal, '@successTitle', 'העלאת הדירה הושלמה!' );
    browser.end();
  },
  'should successfully submit a new apartment with logged out user': function (browser) {
    apartmentForm
        .navigateToOpenHouseEventSection()
        .fillOpenHouseEventDetailsAllFields();
    loginOnStep3();
    apartmentForm
      .submitApartment()
      .expect.section('@successModal').to.be.visible;
    common.waitForText(apartmentForm.section.successModal, '@successTitle', 'העלאת הדירה הושלמה!' );
    browser.end();
  }    
};