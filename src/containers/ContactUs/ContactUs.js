import React, { Component } from 'react';
import classes from './ContactUs.css';
import axios from 'axios';

class ContactUs extends Component {

    state = {
        fullName: '',
        email: '',
        message: ''
    }

    componentDidMount () {
        axios.get('/api/descriptions/contactus')
            .then(response => {
                this.setState({ content: response.data[0].content });
            });
    }

    sendContact = () => {
        axios.post('/api/contact/contact',
            {
                sender: this.state.fullName,
                email: this.state.email,
                content: this.state.message
            })  
            .then(response => {
                console.log(response.data);
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    }

    render () {
        return (
            <div className={classes.Container}>
                <div className={classes.Description}
                    dangerouslySetInnerHTML={{
                        __html: this.state.content
                    }}></div>
                <div className={classes.Form}>
                    <input placeholder="Full Name"
                        onChange={event => this.setState({ fullName: event.target.value})}/>
                    <input placeholder="Email Address"
                        onChange={event => this.setState({ email: event.target.value})}/>
                    <textarea placeholder="Message"
                        rows="5"
                        onChange={event => this.setState({ message: event.target.value})}>
                    </textarea>
                    <button 
                        onClick={this.sendContact}>SUBMIT</button>
                </div>
            </div>
        );
    }

}

export default ContactUs;