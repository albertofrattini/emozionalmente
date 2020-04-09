import React, { Component } from 'react';
import classes from './Toolbar.css';
import NavigationItems from '../NavigationItems/NavigationItems';
import Logo from '../../Logo/Logo';
import HamburgerBtn from '../SideDrawer/HamburgerToggle/HamburgerToggle';
import LoginBtn from '../../UI/Buttons/Login/LoginButton';
import { Link } from 'react-router-dom';
import axios from 'axios';
import userEmoji from '../../../assets/images/user.png';

class Toolbar extends Component {

    state = {
        opacity: 0,
        languages: {},
        currLanguage: ''
    }

    componentDidMount () {
        window.addEventListener('scroll', this.updateColor);

        axios.get('/api/availablelanguages')
            .then(response => {
                this.setState({ 
                    languages: response.data.available,
                    currLanguage: response.data.curr
                });
            });

    }

    updateColor = () => {
        let opacity = (window.scrollY / window.innerHeight) * 3;
        this.setState({ opacity: opacity });
    }

    changeLanguage = (event) => {
        axios.get(`/api/language/set?lang=${event.target.value}`)
            .then(_ => {
                window.location.reload();
            });
    }

    render () {

        const navItems = [classes.DesktopOnly, classes.LinksAndLogin].join(' ');
        let languages = [...Object.keys(this.state.languages)]
        let languageOptions = languages.length > 0 ?
            languages.map((el, i) => {
                    return (
                        <option key={i} value={el}>
                            {this.state.languages[this.state.currLanguage][el]}
                        </option>   
                    ); 
            })
            :
            null;

        let languageSelector = languages.length > 0 ?
            <select className={classes.Select} defaultValue={this.state.currLanguage} 
                onChange={this.changeLanguage.bind(this)}>
                {languageOptions}
            </select>
            :
            null;

        return (
            <header className={classes.Toolbar} 
                style={{ backgroundColor: `rgba(255,255,255,${this.state.opacity})` }}>
                <div className={classes.Container}>
                    <div className={classes.Logo}>
                        <Logo />
                    </div>
                    <div className={navItems}>
                        <nav>
                            <NavigationItems items={this.props.navitems}/>
                        </nav>
                        {
                            this.props.user.username ? 
                            <div className={classes.Username}>
                                <Link to="/user" style={{ textDecoration: 'none' }}>
                                        <p className={classes.UsernameText}>{this.props.user.username}</p>
                                </Link>
                                <img src={userEmoji} alt="user icon" />
                                <span className={classes.Tooltip} onClick={this.props.logout}>
                                    Logout
                                </span>
                            </div>
                            :
                            <Link to="/login-signup">
                                <LoginBtn />
                            </Link>
                        }
                        {languageSelector}
                    </div>
                    <HamburgerBtn 
                        clicked={this.props.open}/>
                </div>
            </header>      
        );
    }
}

export default Toolbar;