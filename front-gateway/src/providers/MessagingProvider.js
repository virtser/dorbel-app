'use strict';

import _ from 'lodash';
import { getUserNickname, hideIntercom } from '~/providers/utils';

const TALKJS_USER_OBJ_EXTRA = {configuration: 'general'};

// TalkJS wrapper provider, see docs: https://talkjs.com/docs/index.html
class MessagingProvider {
  constructor(authStore) {
    this.authStore = authStore;

    // will only work on client side
    global.window && process.env.TALKJS_PUBLISHABLE_KEY &&
      this.talkjs(global.window, document, []) &&
      this.initTalkSession();
  }

  // If active user is logged in and an active TalkJS user was not
  // already created, create an active TalkJS user using the logged in user profile.
  initTalkUser() {
    if (!this.talkUser) {
      if (this.authStore.isLoggedIn) {
        const profile = this.authStore.profile;

        this.talkUser = new global.window.Talk.User(_.defaults({
          id: profile.dorbel_user_id,
          name: getUserNickname(profile),
          email: profile.email,
          photoUrl: profile.picture
        }, TALKJS_USER_OBJ_EXTRA));
      } else {
        return false;
      }
    }

    return true;
  }

  // If an active TalkJS user was created, create a new TalkJS session.
  initTalkSession() {
    if (!this.initTalkUser()) {
      return false;
    }

    if (!this.talkSession) {
      this.talkSession = new global.window.Talk.Session({
        appId: global.window.dorbelConfig.TALKJS_APP_ID,
        publishableKey: global.window.dorbelConfig.TALKJS_PUBLISHABLE_KEY,
        me: this.talkUser
      });
    }

    return true;
  }

  // TalkJS loader script, which creates a global.window.Talk object.
  talkjs(t,a,l,k,j,s) {
    s=a.createElement('script');s.async=1;s.src='https://cdn.talkjs.com/talk.js';a.getElementsByTagName('head')[0].appendChild(s);k=t.Promise;
    t.Talk={ready:{then:function(f){if(k){return new k(function(r,e){l.push([f,r,e]);});}l.push([f]);},catch:function(){return k&&new k();},c:l}};
  }

  // Create a TalkJS user and start a conversation between the active
  // TalkJS user and the newly created TalkJS user using a new TalkJS session.
  getOrStartConversation(withUserObj, options) {
    return global.window.Talk.ready.then(
      this.getOrStartConversationOnReady.bind(this, withUserObj, options)
    );
  }

  getOrStartConversationOnReady(withUserObj, options) {
    if (this.initTalkSession() && this.talkUser.id !== withUserObj.id) {
      const withUser = new global.window.Talk.User(_.defaults(withUserObj, TALKJS_USER_OBJ_EXTRA));

      const conversation = this.talkSession.getOrStartConversation(withUser, options || {});
      const popup = this.talkSession.createPopup(conversation);
      popup.mount();

      hideIntercom(true);

      return popup;
    } else {
      throw new Error('MessagingProvider.getOrStartConversation');
    }
  }

  // Create an inbox for the active TalkJS user using a new TalkJS session.
  createInbox(element) {
    return global.window.Talk.ready.then(
      this.createInboxOnReady.bind(this, element)
    );
  }

  createInboxOnReady(element) {
    if (this.initTalkSession()) {
      const inbox = this.talkSession.createInbox();
      inbox.mount(element);
    } else {
      throw new Error('MessagingProvider.createInbox');
    }
  }
}

module.exports = MessagingProvider;