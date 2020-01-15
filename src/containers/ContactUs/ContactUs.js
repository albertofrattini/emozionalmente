import React, { Component } from 'react';
import classes from './ContactUs.css';
import axios from 'axios';

class ContactUs extends Component {

    state = {
        fullName: '',
        email: '',
        message: ''
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
                <div className={classes.Description}>
                    <h1>Un po' di testo</h1>
                    <p>
                        Cosa scrivere: se hanno domande sul funzionamento, perchè lo facciamo,
                        se possono ottenere i dati, qualsiasi cosa che interessi per il progetto.
                    </p>
                </div>
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