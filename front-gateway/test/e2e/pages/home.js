'use stric';
const common = require('../common');

module.exports = {
  url: function () {
    return common.getBaseUrl();
  },
  elements: {
    loginLink: {
      selector: '.user-profile-badge-auth'
    },
    userProfileBadge: {
      selector: '.user-profile-badge'
    },
    userProfileBadgeMenu: {
      selector: '.user-profile-badge-menu-desktop'
    },
    loggedInIndication: {
      selector: '.user-profile-badge-name'
    },
    loggedOutIndication: {
      selector: '.user-profile-badge-anonymous-icon'
    },
    loginTab: {
      selector: '.auth0-lock-tabs > li:nth-of-type(1) > a'
    },
    emailField: {
      selector: '.auth0-lock-input-email input[name=email]'
    },
    passwordField: {
      selector: '.auth0-lock-input-password input[name="password"]'
    },
    submit: {
      selector: 'button.auth0-lock-submit'
    },
    submitLogin: {
      selector: '.upload-apt-left-container button.btn-success'
    },
    dismissLoginButton: {
      selector: '.auth0-lock-close-button'
    }
  },
  commands: [{
    resizeDesktop: function (browser) {
      browser.resizeWindow(1280, 1024);
    },
    resizeMobile: function (browser) {
      browser.resizeWindow(320, 800);
    },
    clickProfileBadgeMenuItem: function (itemSelector) {
      this
        .moveToElement('@userProfileBadge', 5, 5)
        .moveToElement(itemSelector, 5, 5)
        .click(itemSelector);
      return this;
    },
    fillSignIn: function (user) {
      return this
        .waitForElementVisible('@loginTab')
        .click('@loginTab')
        .setValue('@emailField', user.email)
        .setValue('@passwordField', user.password)
        .click('@submit');
    },
    signUp: function (user) {
      this
        .waitForElementVisible('@loginLink')
        .click('@loginLink')
        .setValue('@emailField', user.email)
        .setValue('@passwordField', user.password)
        .click('@submit')
        .validateSignIn();
    },
    signIn: function (user) {
      this
        .clickProfileBadgeMenuItem('@loginLink')
        .fillSignIn(user)
        .validateSignIn();
      return this;
    },
    signUpInForm: function (user) {
      this
        .waitForElementVisible('@submitLogin')
        .click('@submitLogin');
      this.signUp(user);
      return this;
    },
    singInListing: function (user) {
      this
        .fillSignIn(user)
        .validateSignIn();
    },
    signOut: function () {
      this
        .clickProfileBadgeMenuItem('@loginLink')
        .waitForElementVisible('@loggedOutIndication');
      return this;
    },
    validateSignIn: function () {
      this.waitForElementVisible('@loggedInIndication');
      return this;
    },
    dismissSingInForm: function () {
      this.waitForElementVisible('@loginTab')
        .click('@dismissLoginButton');
      return this;
    }
  }]
};
