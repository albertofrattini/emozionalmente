import React, { Component } from 'react';
import GeneralInfo from '../../components/GeneralInfo/GeneralInfo';
import Faq from '../../components/Faq/Faq';
import Aux from '../../hoc/Aux/Aux';
import Footer from '../../components/UI/Footer/Footer';
import axios from 'axios';

class AboutUs extends Component {

    state = {
        content: null
    }

    componentDidMount () {

        axios.get('/api/descriptions/aboutus?lang=it')
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
            <Aux>
                { this.state.content === null ?
                    null
                    :
                    <GeneralInfo 
                        cardsx={this.state.content['cards-sx']}
                        btnsx={this.state.content['cards-sx-btn']}
                        carddx={this.state.content['cards-dx']}
                        btndx={this.state.content['cards-dx-btn']}/>
                }
                <Faq />
                <Footer />
            </Aux>
        );
    }

}

export default AboutUs;