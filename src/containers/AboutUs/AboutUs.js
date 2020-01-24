import React, { Component } from 'react';
import GeneralInfo from '../../components/GeneralInfo/GeneralInfo';
import Faq from '../../components/Faq/Faq';
import classes from './AboutUs.css';
import Footer from '../../components/UI/Footer/Footer';
import axios from 'axios';

class AboutUs extends Component {

    state = {
        content: null
    }

    componentDidMount () {

        axios.get('/api/descriptions/aboutus')
            .then(response => {
                const content = {};
                response.data.map(el => {
                    return content[el.position] = [el.content, el.additional];
                });
                this.setState({ content: content });
            });

    }

    render () {

        return (
            <div className={classes.Content}>
                { this.state.content === null ?
                    null
                    :
                    <GeneralInfo 
                        cardsx={this.state.content['cards-sx']}
                        btnsx={this.state.content['cards-sx-btn']}
                        carddx={this.state.content['cards-dx']}
                        btndx={this.state.content['cards-dx-btn']}/>
                }
                <div className={classes.Faq}>FAQ</div>
                <Faq />
                <Footer />
            </div>
        );
    }

}

export default AboutUs;