'use strict';
const ApiClient = require('./apiClient.js');
const __ = require('hamjest');
const moment = require('moment');
const faker = require('../shared/fakeObjectGenerator');
const fakeUser = faker.getFakeUser();
const today = moment().hours(0).minutes(0).seconds(0).add(1, 'days');

function getOhe(listingId, startsIn) {
  return {
    start_time: today.add(startsIn, 'hours').toISOString(),
    end_time: today.add(startsIn + 1, 'hours').toISOString(),
    listing_id: listingId,
    publishing_user_id: fakeUser.id,
    listing_publishing_user_id: fakeUser.id,
    max_attendies: 15
  };
}

describe('Open House Events By Listing API Integration', function () {
  before(function* () {
    this.apiClient = yield ApiClient.init(fakeUser);
  });

  describe('/events/by-listing/', function () {
    describe('GET', function () {
      it('should get all events per listing id', function* () {
        const listingId = faker.getRandomNumber();
        const ohe1 = getOhe(listingId, 15);
        const ohe2 = getOhe(listingId, 16);
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
