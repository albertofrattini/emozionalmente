import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import LandingDescription from '../../components/LandingDescription/LandingDescription';
import IntroductionAndData from '../../components/IntroductionAndData/IntroductionAndData';
import axios from 'axios';

class Home extends Component {

    state = {
        title: "",
        subtitle: ""
    }

    componentDidMount () {

        axios.get('/api/descriptions/home')
            .then(response => { 
                console.log(response);
                this.setState({
                    title: response.data.title,
                    subtitle: response.data.subtitle
                });
            });

    }

    render () {

        return (
            <Aux>
                <LandingDescription title={this.state.title} subtitle={this.state.subtitle}/>
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