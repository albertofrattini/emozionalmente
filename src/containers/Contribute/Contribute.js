import React, { Component } from 'react';
import classes from './Contribute.css';

class Contribute extends Component {

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
                        onClick={() => console.log('pressed')}>SUBMIT</button>
                </div>
            </div>
        );
    }

}

export default Contribute;