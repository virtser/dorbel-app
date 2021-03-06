import React from 'react';
import DorbelModal from '~/components/DorbelModal/DorbelModal';
import { Button, Col, Grid, Row } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import UploadApartmentBaseStep from './UploadApartmentBaseStep';
import FormWrapper from '~/components/FormWrapper/FormWrapper';
import SubmitButton from '~/components/SubmitButton/SubmitButton';
import ReactTooltip from 'react-tooltip';
import { getDashMyPropsPath } from '~/routesHelper';

@inject('appStore', 'appProviders', 'router') @observer
class UploadApartmentStep3 extends UploadApartmentBaseStep.wrappedComponent {

  componentDidMount() {
    // load form with existing values from store
    const { newListingStore } = this.props.appStore;
    const { formsy } = this.refs.form.refs;
    formsy.reset(newListingStore.formValues);
  }

  getHourOptions(hoursArray) {
    return hoursArray.map((hour) => ({ label: hour }));
  }

  clickNext() {
    const formsy = this.refs.form.refs.formsy;
    if (formsy.state.isValid) {
      this.props.appStore.newListingStore.updateFormValues(this.refs.form.refs.formsy.getCurrentValues());
      return super.clickNext();
    } else {
      this.props.appStore.newListingStore.isFromValid = formsy.state.isValid;
      this.props.onValidationError(formsy);
    }
  }

  onCloseSuccessModal() {
    const { createdListingId, appProviders, appStore } = this.props;

    appStore.newListingStore.reset();
    appProviders.navProvider.setRoute(getDashMyPropsPath({ id: createdListingId }, '/stats'));
  }

  renderUserDetails() {
    const { authStore } = this.props.appStore;
    const { authProvider } = this.props.appProviders;
    const FRC = FormWrapper.FRC;

    if (authStore.isLoggedIn) {
      // setting this up specifically because somehow it gets lost when logging in
      const { publishing_user_type } = this.props.appStore.newListingStore.formValues.publishing_user_type;

      return (
        <Row className="form-section">
          <div className="form-section-headline">פרטי קשר</div>
          <div>
            <Row>
              <Col md={6}>
                <FRC.Input name="user.firstname" label="שם פרטי" value={authStore.profile.first_name} required />
              </Col>
              <Col md={6}>
                <FRC.Input name="user.lastname" label="שם משפחה" value={authStore.profile.last_name} required
                  placeholder="(לא יוצג באתר)" />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FRC.Input name="user.email" label="מייל" value={authStore.profile.email}
                  type="email" validations="isEmail" validationError="כתובת מייל לא תקינה" required />
              </Col>
              <Col md={6}>
                <FRC.Input validations="isNumeric" name="user.phone" label="טלפון" value={authStore.profile.phone} validationError="מספר טלפון לא תקין" required />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FRC.RadioGroup name="publishing_user_type" value={publishing_user_type} type="inline" label="הגדר אותי במודעה כ:"
                  options={[{ label: 'בעל הדירה', value: 'landlord' }, { label: 'הדייר הנוכחי', value: 'tenant' }]} />
              </Col>
            </Row>
          </div>
        </Row>
      );
    } else {
      return (
        <Row className="form-section">
          <div className="form-section-headline">פרטי קשר</div>
          <Col sm={6}>
            <Button bsStyle="success" className="verify-user" block onClick={authProvider.showLoginModal}>וידוא פרטי קשר</Button>
          </Col>
        </Row>
      );
    }
  }

  renderSidePanel() {
    return (
      <Col md={5} className="upload-apt-right-container">
        <div className="upload-apt-right-container-text-wrapper">
          <div className="upload-apt-right-container-text-container">
            <h1>פרטי קשר וסיום</h1>
            <ul className="upload-apt-right-container-step3-text-ul">
              <li>לסיום התהליך וודאו שפרטי הקשר שלכם נכונים</li>
              <li>פרטי הקשר שלכם ישמשו לעדכונים חשובים בלבד!</li>
            </ul>
          </div>
        </div>
        <img src="https://static.dorbel.com/images/upload-apt-form/icon-signup-card.svg" alt="" />
      </Col>
    );
  }

  renderPopupBodyText() {
    return <div className="modal-text">
      <h4><b>עכשיו תורכם!</b><br /><br />המשיכו לחשבון הדירה שלכם, ממנו תשתפו את המודעה.</h4>
      <span className="upload-apt-success-modal-sub-text">כשתקבלו פניות מדיירים שמעוניינים בדירה, תוכלו לגלות מי הם וליצור קשר עם אלו שמתאימים לכם!</span>
    </div>;
  }

  render() {
    const { authStore, newListingStore } = this.props.appStore;
    let createdListingIdAttr = { 'data-attr': this.props.createdListingId };

    return (
      <Grid fluid className="upload-apt-wrapper">
        {this.renderSidePanel()}

        <Col md={7} className="upload-apt-left-container contact-details-step">
          <FormWrapper.Wrapper layout="vertical" onChange={this.handleChanges} ref="form">
            {this.renderUserDetails()}
          </FormWrapper.Wrapper>
          <Col xs={12} md={7} className="form-nav bottom">
            <span className="prev-step step3" onClick={this.clickBack.bind(this)}>
              <i className="open-house-event-previous-step fa fa-arrow-circle-o-right fa-2x" aria-hidden="true"></i>&nbsp; חזור
            </span>
            <span>3/3</span>
            <span className="next-step" data-tip="שדה חובה חסר">
              <SubmitButton onClick={this.clickNext.bind(this)} className="step-btn step3"
                bsStyle={authStore.isLoggedIn ? 'success' : 'default'}
                disabled={!authStore.isLoggedIn} >שליחה וסיום</SubmitButton>
            </span>
            <ReactTooltip type="dark" effect="solid" place="top" disable={newListingStore.isFromValid} />
          </Col>
        </Col>
        <DorbelModal
          show={this.props.showSuccessModal}
          onClose={this.onCloseSuccessModal.bind(this)}
          title="פרטי הדירה שלכם עלו בהצלחה!"
          body={
            <div className="modal-container" {...createdListingIdAttr}>
              {this.renderPopupBodyText()}
              <p className="text-center">
                <Button bsStyle="info" className="submit-success" onClick={this.onCloseSuccessModal.bind(this)}>קחו אותי לחשבון שלי</Button>
              </p>
            </div>
          }
        />
      </Grid >
    );
  }
}

export default UploadApartmentStep3;
