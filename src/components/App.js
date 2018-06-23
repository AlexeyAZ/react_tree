import React, { Component } from 'react';
import styled from 'styled-components';
import baseStyles from '../base-styles.js';

import Scene from './Scene';

const AppWrap = styled.div``;

class App extends Component {
  render() {
    baseStyles();
    return (
      <AppWrap>
        <Scene />
      </AppWrap>
    );
  }
}

export default App;