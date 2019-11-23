import React, { Component } from 'react';
import classes from './LoginSignup.css';
import Logo from '../../components/Logo/Logo';
// import sinImg from '../../assets/images/sin.png';

class LoginSignup extends Component {

    state = {
        login: true,
        passwordType: 'password',
        age: '',
        nationality: '',
        sex: '',
        loginEmail: '',
        loginPassword: '',
        signupUsername: '',
        signupEmail: '',
        signupPassword: ''
    }

    toggleSignup = () => {
        this.setState({
            login: false
        })
    }

    toggleLogin = () => {
        this.setState({
            login: true
        })
    }

    togglePassword = (event) => {
        if (this.state.passwordType === 'password') {
            this.setState({ passwordType: 'text' });
        } else {
            this.setState({ passwordType: 'password' })
        }
    }

    toggleSex = (event) => {
        this.setState({
            sex: event.target.value
        });
    }

    render () {
        console.log(this.state.sex);
        return (
            <div className={classes.Container}>
                {/*
                <div className={classes.Sin}>
                    <img src={sinImg} alt="sin"></img>
                </div>
                */}

                <div className={classes.Card}>
                    <div className={classes.Logo}>
                        <Logo />
                    </div>
                    { this.state.login 
                            ?
                            <div className={classes.InputColumn}>
                                <span className={classes.GoToSignUp} onClick={this.toggleSignup}>Sign up</span>
                                <input placeholder="Insert your email"
                                    type="email"
                                    onChange={event => this.setState({loginEmail: event.target.value})}/>
                                <input placeholder="Insert your password"
                                    type={this.state.passwordType}
                                    onChange={event => this.setState({loginPassword: event.target.value})}/>
                                <button 
                                    onClick={() => this.props.login(this.state.loginEmail, this.state.loginPassword)}
                                    style={{ backgroundColor: 'var(--logo-green)' }}>LOGIN</button>
                            </div>
                            :
                            <div className={classes.InputRow}>
                                <div className={classes.InputColumn}>
                                    <input placeholder="Insert your username"
                                        onChange={event => this.setState({signupUsername: event.target.value})}/>
                                    <input placeholder="Insert your email"
                                        type="email"
                                        onChange={event => this.setState({signupEmail: event.target.value})}/>
                                    <input placeholder="Insert your password"
                                        type="password"
                                        onChange={event => this.setState({signupPassword: event.target.value})}/>
                                </div>
                                <div className={classes.InputColumn}>
                                    <span className={classes.TextInfo}>Age</span>
                                    <input placeholder="24, 56 ..."
                                        type="number"
                                        onChange={event => this.setState({age: event.target.value})}/>
                                    <span className={classes.TextInfo}>Nationality</span>
                                    <input placeholder="Italian, English, Spanish ..."
                                        onChange={event => this.setState({nationality: event.target.value})}/>
                                    <span className={classes.TextInfo}>Sex</span>
                                    <select className={classes.SexSelect} onChange={this.toggleSex}>
                                        <option></option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="notspecified">I prefer not to say it</option>
                                    </select>
                                    <button 
                                        onClick={() => this.props.signup(
                                            this.state.signupUsername, this.state.signupEmail, 
                                            this.state.signupPassword, this.state.nationality,
                                            this.state.age, this.state.sex)}
                                        style={{ backgroundColor: 'var(--logo-blue)' }}>SIGNUP</button>
                                </div>
                            </div>
                    }
                </div>
            </div>
        );
    }

}

export default LoginSignup;