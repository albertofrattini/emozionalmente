import React from 'react';
import Home from '../../containers/Home/Home';
import Database from '../../containers/Database/Database';
import User from '../../containers/User/User';
import AboutUs from '../../containers/AboutUs/AboutUs';
import ContactUs from '../../containers/ContactUs/ContactUs';
import Manager from '../../containers/Manager/Manager';
import Confirm from '../../containers/Confirm/Confirm';
import Faq from '../../containers/Faq/Faq';
import Privacy from '../../containers/Privacy/Privacy';
import Terms from '../../containers/Terms/Terms';
import Layout from '../Layout/Layout';
import { Route } from 'react-router-dom';

const defaultContainer = () => (

    <Layout>
        <Route path="/" exact component={Home} />
        <Route path="/database" component={Database} />
        <Route path="/user" component={User} />
        <Route path="/about-us" component={AboutUs} />
        <Route path="/contact-us" component={ContactUs} />
        <Route path="/manager" component={Manager} />
        <Route path="/faq" component={Faq} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/confirm/:id" component={Confirm} />
    </Layout>

);

export default defaultContainer;