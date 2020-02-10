import React, { Component } from 'react';
import classes from './LoginSignup.css';
import Logo from '../../components/Logo/Logo';
import allCountriesSelect from '../../components/UI/AllCountriesSelect/AllCountriesSelect';

const initialState = {
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

class LoginSignup extends Component {

    constructor (props) {
        super(props);
        this.state = {
            ...initialState,
            loginPage: true
        };
    }

    resetState () {
        this.setState( initialState );
        document.getElementById('sexselect').selectedIndex = 0;
    }

    toggleSignup = () => {
        this.setState({
            loginPage: false
        })
    }

    toggleLogin = () => {
        this.setState({
            loginPage: true
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

    login = () => {
        this.props.login(this.state.loginEmail, this.state.loginPassword);
    }

    signup = () => {
        if (this.state.age === '' || this.state.signupEmail === '' || 
            this.state.signupUsername === '' || this.state.signupPassword === '' ||
            this.state.nationality === '' || this.state.sex === '') return;
        this.props.signup(
            this.state.signupUsername, this.state.signupEmail, 
            this.state.signupPassword, this.state.nationality,
            this.state.age, this.state.sex);
        this.resetState();
    }
    

    render () {
        return (
            <div className={classes.Container}>
                <div className={classes.Card}>
                    <div className={classes.Logo}>
                        <Logo nolink/>
                    </div>
                    { this.state.loginPage 
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
                                    onClick={this.login}
                                    style={{ backgroundColor: 'var(--logo-green)' }}>LOGIN</button>
                            </div>
                            :
                            <div className={classes.InputColumn}>
                                <div className={classes.InputText}>Username</div>
                                <input placeholder="Username must be at least 5 characters long"
                                    value={this.state.signupUsername}
                                    onChange={event => this.setState({signupUsername: event.target.value})}/>
                                <div className={classes.InputText}>Email</div>
                                <input placeholder="Insert a valid email"
                                    value={this.state.signupEmail}
                                    type="email"
                                    onChange={event => this.setState({signupEmail: event.target.value})}/>
                                <div className={classes.InputText}>Password</div>
                                <input placeholder="Password must be at least 5 characters long"
                                    value={this.state.signupPassword}
                                    type="password"
                                    onChange={event => this.setState({signupPassword: event.target.value})}/>
                                <div className={classes.InputText}>Nationality</div>
                                <select className={classes.Select} style={{ marginLeft: '0px' }}
                                    onChange={event => this.setState({ nationality: event.target.value })}>
                                    {allCountriesSelect}
                                </select>
                                <div className={classes.InputRow}>
                                    <div className={classes.InputColumn}>
                                        <div className={classes.InputText}>Age</div>
                                        <input placeholder="24, 56 ..."
                                            value={this.state.age}
                                            type="number"
                                            onChange={event => this.setState({age: event.target.value})}/>
                                    </div>
                                    <div className={classes.InputColumn}>
                                        <div className={classes.InputText}>Sex</div>
                                        <select id="sexselect" className={classes.Select} onChange={this.toggleSex}>
                                            <option value=""></option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="notspecified">I prefer not to say it</option>
                                        </select>
                                    </div>
                                </div>
                                <button 
                                    onClick={this.signup}
                                    style={{ backgroundColor: 'var(--logo-blue)' }}>SIGNUP</button>
                            </div>
                    }
                </div>
            </div>
        );
    }

}

export default LoginSignup;