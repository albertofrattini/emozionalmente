import React, { Component } from 'react';
import GeneralInfo from '../../components/GeneralInfo/GeneralInfo';
import classes from './AboutUs.css';
import Footer from '../../components/UI/Footer/Footer';
import axios from 'axios';
import { Link } from 'react-router-dom';

class AboutUs extends Component {

    state = {
        content: {}
    }

    componentDidMount () {

        axios.get('/api/descriptions/aboutus')
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
            <div className={classes.Content}>
                { this.state.content === null ?
                    null
                    :
                    <GeneralInfo 
                        cardsx={this.state.content['cards-sx']}
                        carddx={this.state.content['cards-dx']}/>
                }
                <Link to="contact-us" style={{ textDecoration: 'none' }}>
                    <div className={classes.Contact}>
                        {this.state.content['contactus-btn']}
                    </div>
                </Link>
                <Footer />
            </div>
        );
    }

}

export default AboutUs;