import React, { Component } from 'react';
import Spinner from 'react-spinkit';

import './LoadingSpinner.scss';

class LoadingSpinner extends Component {
  render() {
    return (
      <Spinner spinnerName="three-bounce" noFadeIn />
    );
  }
}

export default LoadingSpinner;
