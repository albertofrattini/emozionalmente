import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import LandingDescription from '../../components/LandingDescription/LandingDescription';
import IntroductionAndData from '../../components/IntroductionAndData/IntroductionAndData';
import CurrentDatabase from '../../components/CurrentDatabase/CurrentDatabase';
import Footer from '../../components/UI/Footer/Footer';
import axios from 'axios';

class Home extends Component {

    state = {
        title: "",
        subtitle: ""
    }

    componentDidMount () {

        axios.get('/api/descriptions/home')
            .then(response => {
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
                <IntroductionAndData />
                <CurrentDatabase />
                <Footer />
            </Aux>
        );
    }
}

export default Home;