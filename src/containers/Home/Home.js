import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import LandingDescription from '../../components/LandingDescription/LandingDescription';
import IntroductionAndData from '../../components/IntroductionAndData/IntroductionAndData';
import CurrentDatabase from '../../components/CurrentDatabase/CurrentDatabase';
import Footer from '../../components/UI/Footer/Footer';
import axios from 'axios';

class Home extends Component {

    state = {
        content: {}
    }

    componentDidMount () {

        axios.get('/api/descriptions/home')
            .then(response => {
                const content = {};
                response.data.map(el => {
                    return content[el.position] = el.content;
                });
                this.setState({ content: content });
            });

    }

    render () {

        return (
            <Aux>
                <LandingDescription 
                    title={this.state.content['landing-title']} 
                    subtitle={this.state.content['landing-subtitle']}
                    buttonsx={this.state.content['landing-btn-sx']}
                    buttondx={this.state.content['landing-btn-dx']}/>
                <IntroductionAndData 
                    cardsx={ [ this.state.content['cards-sx-title'], 
                        this.state.content['cards-sx-subtitle'] ] }
                    cardcn={ [ this.state.content['cards-center-title'], 
                        this.state.content['cards-center-subtitle'] ] }
                    carddx={ [ this.state.content['cards-dx-title'], 
                        this.state.content['cards-dx-subtitle'] ] }/>
                <CurrentDatabase 
                    title={this.state.content['graphic-title']}
                    subtitle={this.state.content['graphic-subtitle']}/>
                <Footer />
            </Aux>
        );
    }
}

export default Home;