/**
 * Nav provider handles navigation across the app
 */
'use strict';
import autobind from 'react-autobind';

class NavProvider {
  constructor(router) {
    this.router = router;
    autobind(this);
  }

  handleHrefClick(e) {
    e.preventDefault(); // cancel the event so we don't get a reload.
    if ((e.metaKey || e.ctrlKey) && window) {
      window.open(e.currentTarget.href);
    }
    else {
      // check if href is an external link
      if (location.host != e.currentTarget.host) {
        location.href = e.currentTarget.href;
      }
      else {
        this.router.setRoute(e.currentTarget.pathname);
      }
    }
    return false;
  }
}

module.exports = NavProvider;
