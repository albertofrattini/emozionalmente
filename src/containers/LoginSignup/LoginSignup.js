import React, { Component } from 'react';
import classes from './LoginSignup.css';
import Logo from '../../components/Logo/Logo';
import allCountriesSelect from '../../components/UI/AllCountriesSelect/AllCountriesSelect';
import axios from 'axios';

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
            loginPage: true,
            content: {}
        };
    }

    componentDidMount () {

        axios.get('/api/descriptions/loginsignup')
            .then(response => {
                const content = {};
                response.data.map(el => {
                    return content[el.position] = el.content;
                });
                this.setState({ content: content });
            });

        document.getElementById("loginEmail").addEventListener("keyup", function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                document.getElementById("submitLogin").click();
            }
        });

        document.getElementById("loginPassword").addEventListener("keyup", function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                document.getElementById("submitLogin").click();
            }
        });

    }

    resetState () {
        this.setState({...initialState, loginPage: false });
        document.getElementById('sexselect').selectedIndex = 0;
        document.getElementById('nationalityselect').selectedIndex = 0;
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
        if(this.state.loginEmail === '' || this.state.loginPassword === '') return;
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
                                <span className={classes.GoToSignUp} onClick={this.toggleSignup}>
                                    {this.state.content['login-signup-btn']}
                                </span>
                                <input placeholder={this.state.content['login-email']} id="loginEmail"
                                    type="email"
                                    onChange={event => this.setState({loginEmail: event.target.value})}/>
                                <input placeholder={this.state.content['login-password']} id="loginPassword"
                                    type={this.state.passwordType}
                                    onChange={event => this.setState({loginPassword: event.target.value})}/>
                                <div style={{ width: '256px', margin: 'auto', textAlign: 'center'}}>
                                    <button id="submitLogin" onClick={this.login}>
                                            {this.state.content['login-btn']}
                                    </button>
                                </div>
                            </div>
                            :
                            <div className={classes.InputColumn}>
                                <span>
                                    {this.state.content['signup-username-title']}
                                </span>
                                <span className={classes.InputText} style={{ fontSize: '14px' }}>
                                    {this.state.content['signup-username-subtitle']}
                                </span>
                                <input placeholder={this.state.content['signup-username-placeholder']}
                                    value={this.state.signupUsername}
                                    onChange={event => this.setState({signupUsername: event.target.value})}/>
                                <span>
                                    {this.state.content['signup-email-title']}
                                </span>
                                <input placeholder={this.state.content['signup-email-placeholder']}
                                    value={this.state.signupEmail}
                                    type="email"
                                    onChange={event => this.setState({signupEmail: event.target.value})}/>
                                <span>
                                    {this.state.content['signup-password-title']}
                                </span>
                                <span className={classes.InputText} style={{ fontSize: '14px' }}>
                                    {this.state.content['signup-password-subtitle']}
                                </span>
                                <input placeholder={this.state.content['signup-password-placeholder']}
                                    value={this.state.signupPassword}
                                    type="password"
                                    onChange={event => this.setState({signupPassword: event.target.value})}/>
                                <span className={classes.InputText}>
                                    {this.state.content['signup-nationality-title']}
                                </span>
                                <select id="nationalityselect" className={classes.Select} style={{ marginLeft: '0px' }}
                                    onChange={event => this.setState({ nationality: event.target.value })}>
                                    {allCountriesSelect}
                                </select>
                                <div className={classes.InputRow}>
                                    <div className={classes.InputColumn}>
                                        <span className={classes.InputText}>
                                            {this.state.content['signup-age-title']}
                                        </span>
                                        <input placeholder={this.state.content['signup-age-placeholder']}
                                            value={this.state.age}
                                            type="number"
                                            onChange={event => this.setState({age: event.target.value})}/>
                                    </div>
                                    <div className={classes.InputColumn}>
                                        <span className={classes.InputText} style={{ marginLeft: '8px' }}>
                                            {this.state.content['signup-sex-title']}
                                        </span>
                                        <select id="sexselect" className={classes.Select} onChange={this.toggleSex}>
                                            <option value=""></option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="notspecified">I prefer not to say it</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ width: '256px', margin: 'auto', textAlign: 'center'}}>
                                    <button onClick={this.signup}>
                                            {this.state.content['signup-btn']}
                                    </button>
                                </div>
                            </div>
                    }
                </div>
            </div>
        );
    }

}

export default LoginSignup;