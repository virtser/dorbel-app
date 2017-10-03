import React, { Component } from 'react';
import autobind from 'react-autobind';
import { Tabs, Tab, Grid, Row, Button } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import { find } from 'lodash';
import { getMyProfilePath } from '~/routesHelper';
import SubmitButton from '~/components/SubmitButton/SubmitButton';
import TenantProfile from '~/components/Tenants/TenantProfile/TenantProfile';
import MySettingsFields from './MyProfile/MySettingsFields';
import MyProfileFields from './MyProfile/MyProfileFields';
import MyTenantProfileFields from './MyProfile/MyTenantProfileFields';

import './MyProfile.scss';

@inject('appStore', 'appProviders', 'router') @observer
class MyProfile extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.tabs = [
      { key: 'settings', title: 'הגדרות', content: MySettingsFields, submitText: 'שמור שינויים' },
      { key: 'me', title: 'פרטי קשר', content: MyProfileFields },
      { key: 'tenant', section: 'tenant_profile', title: 'פרופיל דייר', content: MyTenantProfileFields }
    ];

    const activeTab = find(this.tabs, { key: props.tab }) || this.tabs[0];

    this.state = {
      activeTab: activeTab,
      isValid: false,
      section: props.appStore.authStore.profile[activeTab.section]
    };
  }

  submit() {
/*    if (formsy.isChanged()) {
      const profile = formsy.getModel();
      const notificationProvider = this.props.appProviders.notificationProvider;
      return this.props.appProviders.authProvider.updateUserProfile(profile)
        .then(() => { notificationProvider.success('הפרטים עודכנו בהצלחה'); })
        .catch(notificationProvider.error);
    }*/
  }

  handleInputChange(e) {
    const newSection = this.state.section;
    newSection[e.target.name] = e.target.value;
    this.setState({section: newSection});
  }

  renderActiveSection(activeTab, section) {
    return (<activeTab.content section={section} onChange={this.handleInputChange}/>);
  }

  showPreview(profile) {
    this.props.appProviders.modalProvider.showInfoModal({
      closeButton: true,
      body: <TenantProfile profile={profile} isPreview={true}/>,
      modalSize: 'large'
    });
  }

  handleTabSelect(e) {
    this.props.router.setRoute(getMyProfilePath(e.key));
  }

  render() {
    const { authStore } = this.props.appStore;
    const fullProfile = authStore.profile;
    const formChanged = false;

    return (
      <Grid fluid className="profile-container">
        <Tabs className="tab-menu" activeKey={this.state.activeTab}
          onSelect={this.handleTabSelect} id="my-profile-tabs">
          {this.tabs.map(tab =>
            <Tab eventKey={tab} key={tab.key} title={tab.title}></Tab>
          )}
        </Tabs>
        <Row className="profile-edit-wrapper">
          <div className="profile-header">
            <div className="profile-title pull-right">{this.state.activeTab.title}</div>
            <Button className={'profile-preview pull-left profile-preview-' + this.state.activeTab.key} onClick={() => { this.showPreview(fullProfile); }}>
              תצוגה מקדימה
            </Button>
          </div>
          <div className="profile-edit-container">
            <div className={this.state.activeTab.content.showPicture ? 'profile-picture-container' : 'hidden'}>
              <img className="profile-picture" src={fullProfile.picture} />
            </div>
            <Row>
              <form className="profile-form" onSubmit={this.submit}>
                {this.renderActiveSection(this.state.activeTab, this.state.section)}
                <Row>
                  <SubmitButton disabled={!formChanged || !this.state.isValid} onClick={this.submit} className="profile-submit"
                    bsStyle="success">
                    {this.state.activeTab.submitText || 'עדכון פרטים'}
                  </SubmitButton>
                </Row>
              </form>
            </Row>
          </div>
        </Row>
      </Grid>
    );
  }
}

MyProfile.wrappedComponent.propTypes = {
  appStore: React.PropTypes.object.isRequired,
  appProviders: React.PropTypes.object.isRequired,
  router: React.PropTypes.object,
  tab: React.PropTypes.string
};

export default MyProfile;
