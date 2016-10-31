'use strict';
import React from 'react';
import { Provider } from 'mobx-react';
import { startRouter } from '~/routes';
import AppStore from '~/stores/AppStore';
import AppProviders from '~/providers/AppProviders';
import App from '~/components/App';

function injectStores(initialState) {
  const appStore = new AppStore(initialState);
  const appProviders = new AppProviders(appStore);
  const router = startRouter(appStore);

  const app = (
    <Provider appStore={appStore} router={router} appProviders={appProviders}>
      <App />
    </Provider>
  );

  return { app, appStore, router };
}

module.exports = {
  injectStores
};