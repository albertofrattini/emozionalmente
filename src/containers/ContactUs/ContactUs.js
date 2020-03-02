import React, { Component } from 'react';
import classes from './ContactUs.css';
import axios from 'axios';

class ContactUs extends Component {

    state = {
        fullName: '',
        email: '',
        message: '',
        content: {}
    }

    componentDidMount () {
        axios.get('/api/descriptions/contactus')
            .then(response => {
                const content = {};
                response.data.map(e => {
                    return content[e.position] = e.content;
                });
                this.setState({ content: content });
            });

        axios.get('/api/users/loggedin')
            .then(response => {
                this.setState({ userEmail: response.data.user.email });
            });
    }

    sendContact = () => {
        
        if (this.state.fullName === '' || this.state.message === '') return;
        if (this.state.email === '' && !this.state.userEmail) return;

        axios.post('/api/contact/contact',
            {
                sender: this.state.fullName,
                email: this.state.userEmail ? this.state.userEmail : this.state.email,
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
                        __html: this.state.content['intro']
                    }}></div>
                <div className={classes.Form}>
                    <input placeholder="Full Name"
                        onChange={event => this.setState({ fullName: event.target.value})}/>
                    {
                        this.state.userEmail ?
                            null
                            :
                            <input placeholder="Email Address"
                                onChange={event => this.setState({ email: event.target.value})}/>
                    }
                    <textarea placeholder="Message"
                        rows="5"
                        onChange={event => this.setState({ message: event.target.value})}>
                    </textarea>
                    <button 
                        onClick={this.sendContact}>{this.state.content['btn']}</button>
                </div>
            </div>
        );
    }

}

export default ContactUs;