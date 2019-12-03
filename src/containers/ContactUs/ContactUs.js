import React, { Component } from 'react';
import classes from './ContactUs.css';

class ContactUs extends Component {

    state = {
        fullName: '',
        email: '',
        message: ''
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
                        onClick={() => console.log('pressed')}>SUBMIT</button>
                </div>
            </div>
        );
    }

}

export default ContactUs;