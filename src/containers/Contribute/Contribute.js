import React, { Component } from 'react';
import classes from './Contribute.css';
import axios from 'axios';

class Contribute extends Component {

    state = {
        fullName: '',
        email: '',
        message: ''
    }

    sendContribution = () => {
        axios.post('/api/contact/contribute',
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
                        Una guida sulle frasi che possono essere proposte. Ringraziamo
                        per essere interessati ad arricchire il nostro database di frasi. 
                        Vogliamo evitare insulti, parolacce o inviti all'odio e altre cose 
                        del genere. Le frasi possono avere significato o non, evitiamo 
                        domande perchè potrebbero influire sulla lettura quando dobbiamo
                        simulare la sorpresa. La cosa migliore è generare frasi che non 
                        abbiano un vero e proprio senso, pur avendo una corretta sintassi.
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
                        onClick={this.sendContribution}>SUBMIT</button>
                </div>
            </div>
        );
    }

}

export default Contribute;