import React, { Component } from 'react';
import classes from './Contribute.css';
import axios from 'axios';

class Contribute extends Component {

    state = {
        fullName: '',
        email: '',
        message: ''
    }

    componentDidMount () {
        axios.get('/api/descriptions/contribute')
            .then(response => {
                this.setState({ content: response.data[0].content });
            });
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
                <div className={classes.Description}
                    dangerouslySetInnerHTML={{
                        __html: this.state.content
                    }}>
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