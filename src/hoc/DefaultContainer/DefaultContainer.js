import React from 'react';
import Home from '../../containers/Home/Home';
import Database from '../../containers/Database/Database';
import AboutUs from '../../containers/AboutUs/AboutUs';
import ContactUs from '../../containers/ContactUs/ContactUs';
import Contribute from '../../containers/Contribute/Contribute';
import Manager from '../../containers/Manager/Manager';
import Confirm from '../../containers/Confirm/Confirm';
import Layout from '../Layout/Layout';
import { Route } from 'react-router-dom';

const defaultContainer = () => (

    <Layout>
        <Route path="/" exact component={Home} />
        <Route path="/database" component={Database} />
        <Route path="/about-us" component={AboutUs} />
        <Route path="/contact-us" component={ContactUs} />
        <Route path="/manager" component={Manager} />
        <Route path="/confirm/:id" component={Confirm} />
    </Layout>

);

export default defaultContainer;