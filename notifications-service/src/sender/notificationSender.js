/**
 * This module will handle messages coming from the events queue
 * Will get target user id's and send to segment
 */
'use strict';
const shared = require('dorbel-shared');
const logger = shared.logger.getLogger(module);
const dataRetrieval = require('./dataRetrieval');
const analytics = shared.utils.analytics;


// TODO : move out of application code
const eventConfigurations = require('./eventConfigurations.json');

function handleMessage(payload) {
  logger.debug(payload, 'handeling app event');
  return Promise.all( 
    eventConfigurations
      .filter(eventConfig => eventConfig.eventType === payload.eventType)
      .map(eventConfig => sendEvent(eventConfig, payload.dataPayload))
  );
}

function sendEvent(eventConfig, eventData) {
  return dataRetrieval.getAdditonalData(eventConfig, eventData)
  .then(additonalData => {
    const recipients = additonalData.customRecipients || [ eventData.user_uuid ];    
    const trackedEventData = Object.assign({}, eventData, additonalData);

    return Promise.all(
      recipients.map(recipient => analytics.track(recipient, eventConfig.notificationType, trackedEventData))
    );
  });  
}

// TODO: this should go somewhere generic
function handleMessageWrapper(handleFunc, message, done) {
  const messageBody = JSON.parse(message.Body);
  const messageDataPayload = JSON.parse(messageBody.Message);
  
  handleFunc(messageDataPayload)
    .then(() => done())
    .catch(err => done(err));
}

module.exports = {
  handleMessage: handleMessageWrapper.bind(null, handleMessage)  
};