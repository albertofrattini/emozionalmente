import React, { Component } from 'react'; 
import LandingDescription from '../../components/LandingDescription/LandingDescription';
import IntroductionAndData from '../../components/IntroductionAndData/IntroductionAndData';
import CurrentDatabase from '../../components/CurrentDatabase/CurrentDatabase';
import Footer from '../../components/UI/Footer/Footer';
import Loader from '../../components/UI/Loader/Loader';
import axios from 'axios';

class Home extends Component {

    state = {
        content: {},
        isLoading: true
    }

    componentDidMount () {

        axios.get('/api/descriptions/home')
            .then(response => {
                const content = {};
                response.data.map(el => {
                    return content[el.position] = el.content;
                });
                this.setState({ content: content, isLoading: false });
            });

    }

    render () {

        return (
            <React.Fragment>
                {
                    this.state.isLoading ?
                        <Loader pageLoading/>
                        :
                        <React.Fragment>   
                            <LandingDescription 
                            title={this.state.content['landing-title']} 
                            subtitle={this.state.content['landing-subtitle']}
                            buttonsxtitle={this.state.content['landing-btn-sx']}
                            buttonsxsub={this.state.content['landing-btn-sub-sx']}
                            buttondxtitle={this.state.content['landing-btn-dx']}
                            buttondxsub={this.state.content['landing-btn-sub-dx']}/>
                            <IntroductionAndData 
                            cardsx={ [ this.state.content['cards-sx-title'], 
                            this.state.content['cards-sx-subtitle'] ] }
                            cardcn={ [ this.state.content['cards-center-title'], 
                            this.state.content['cards-center-subtitle'] ] }
                            carddx={ [ this.state.content['cards-dx-title'], 
                            this.state.content['cards-dx-subtitle'] ] }/>
                            <CurrentDatabase 
                            safety={this.state.content['graphic-safety']}
                            deepLearning={this.state.content['graphic-deep-learning']}/>
                            <Footer />
                        </React.Fragment>
                }
            </React.Fragment>       
        );  
    }
}

export default Home;