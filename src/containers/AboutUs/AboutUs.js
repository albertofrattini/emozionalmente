import React, { Component } from 'react';
import GeneralInfo from '../../components/GeneralInfo/GeneralInfo';
import Faq from '../../components/Faq/Faq';
import Aux from '../../hoc/Aux/Aux';
import Footer from '../../components/UI/Footer/Footer';

class AboutUs extends Component {

    render () {
        return (
            <Aux>
                <GeneralInfo />
                <Faq />
                <Footer />
            </Aux>
        );
    }

}

export default AboutUs;