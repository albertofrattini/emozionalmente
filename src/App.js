import React, { Component } from 'react';
import Layout from './hoc/Layout/Layout';

import Home from './containers/Home/Home';
import Record from './containers/Record/Record';
import Evaluate from './containers/Evaluate/Evaluate';
import Database from './containers/Database/Database';
import AboutUs from './containers/AboutUs/AboutUs';

import { Route, BrowserRouter } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Layout>
            {/**
             * Everytime there is a request for a page, these Routes are parsed in order of appearance.
             * In particular, we add 'exact' because every path here containes '/' and we would always end
             * up in the Home page + the exact page that we wanted:
             * e.g. if I want to end in '/record', React would load the Home page and under it, it would
             * append the Record page.
             * The order is important also because if we would want to filter the Home page following
             * some id of a thing, we would put '/:id'. But this means 'go to page /*something*' and this
             * means we would end up always in this page if it was positioned right after '/'.
             * So, putting it as last element, let's React check if there is some corresponding element
             * in the previous ones, and then finally go to that page if no connection has been
             * found yet.
             * 
             * Going to specific ID element: module11/lesson16
             */}
            <Route path="/" exact component={Home} />
            <Route path="/record" component={Record} />
            <Route path="/evaluate" component={Evaluate} />
            <Route path="/database" component={Database} />
            <Route path="/about-us" component={AboutUs} />
          </Layout>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
