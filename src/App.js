import React, { Component } from 'react';
import LoginSignup from './containers/LoginSignup/LoginSignup';
import DefaultContainer from './hoc/DefaultContainer/DefaultContainer';

import { Route, BrowserRouter, Switch } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login-signup" component={LoginSignup} />
          <Route component={DefaultContainer} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
