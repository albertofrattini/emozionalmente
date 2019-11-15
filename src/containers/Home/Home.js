import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import LandingDescription from '../../components/LandingDescription/LandingDescription';
import IntroductionAndData from '../../components/IntroductionAndData/IntroductionAndData';

class Home extends Component {

    style = {
        backgroundColor: '#b4c1cc',
        width: '100%',
        height: '512px'
    }

    render () {
        return (
            <Aux>
                <LandingDescription />
                {/**
                 * <ActionCards />
                 * <ActionImages />
                 */}
                <IntroductionAndData />
            </Aux>
        );
    }
}

export default Home;