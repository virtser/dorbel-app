'use strict';
const ApiClient = require('./apiClient.js');
const __ = require('hamjest');
const _ = require('lodash');
const moment = require('moment');
const faker = require('../shared/fakeObjectGenerator');

function getOhe(listingId, startsIn) {
  return {
    start_time: moment().add(startsIn, 'hours').toISOString(),
    end_time: moment().add(startsIn + 1, 'hours').toISOString(),
    listing_id: listingId,
    publishing_user_id: faker.getFakeUser().id,
    max_attendies: 15
  };
}

describe('Open House Events By Listing API Integration', function () {
  before(function* () {
    this.apiClient = yield ApiClient.init(faker.getFakeUser());
  });

  describe('/events/by-listing/', function () {
    describe('GET', function () {
      it('should get all events per listing id', function* () {
        const listingId = faker.getRandomNumber();
        const ohe1 = getOhe(listingId, -2);
        const ohe2 = getOhe(listingId, -4);
        yield this.apiClient.createNewEvent(ohe1).end();
        yield this.apiClient.createNewEvent(ohe2).expect(201).end();
        const response = yield this.apiClient.findEventsByListing(listingId).expect(200).end();
        __.assertThat(response.body.length, __.is(2));
      });

      it('should return an empty array given no events per listing id', function* () {
        const response = yield this.apiClient.findEventsByListing(0).expect(200).end();
        __.assertThat(response.body.length, __.is(0));
      });
    });
  });
});
