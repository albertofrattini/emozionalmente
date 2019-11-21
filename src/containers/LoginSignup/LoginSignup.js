import React, { Component } from 'react';
import classes from './LoginSignup.css';
import Logo from '../../components/Logo/Logo';

import sinImg from '../../assets/images/sin.png';

class LoginSignup extends Component {

    state = {
        loginEmail: '',
        loginPassword: '',
        signupEmail: '',
        signupPassword: ''
    }

    login = () => {
        console.log(this.state);
    }

    signup = () => {
        console.log(this.state);
    }

    render () {
        return (
            <div className={classes.Container}>
                <div className={classes.Sin}>
                    <img src={sinImg} alt="sin"></img>
                </div>
                <div className={classes.Card}>
                    <div className={classes.Logo}>
                        <Logo />
                    </div>
                    <input placeholder="Insert your email" 
                        onChange={event => this.setState({loginEmail: event.target.value})}/>
                    <input placeholder="Insert your password"
                        onChange={event => this.setState({loginPassword: event.target.value})}/>
                    <button onClick={this.login}>LOGIN</button>
                    <div className={classes.DivLine}></div>
                    <input placeholder="Insert your email"
                        onChange={event => this.setState({signupEmail: event.target.value})}/>
                    <input placeholder="Insert your password"
                        onChange={event => this.setState({signupPassword: event.target.value})}/>
                    <button onClick={this.signup}>SIGNUP</button>
                </div>
            </div>
        );
    }

}

export default LoginSignup;