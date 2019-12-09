import React, { Component } from 'react';
import classes from './Toolbar.css';
import NavigationItems from '../NavigationItems/NavigationItems';
import Logo from '../../Logo/Logo';
import HamburgerBtn from '../SideDrawer/HamburgerToggle/HamburgerToggle';
import LoginBtn from '../../UI/Buttons/Login/LoginButton';
import { Link } from 'react-router-dom';

class Toolbar extends Component {

    state = {
        opacity: 0
    }

    componentDidMount () {
        window.addEventListener('scroll', this.updateColor);
    }

    updateColor = () => {
        let opacity = (window.scrollY / window.innerHeight) * 3;
        this.setState({ opacity: opacity });
    } 

    render () {

        const navItems = [classes.DesktopOnly, classes.LinksAndLogin].join(' ');

        return (
            <header className={classes.Toolbar} 
                style={{ backgroundColor: `rgba(255,255,255,${this.state.opacity})` }}>
                <div className={classes.Container}>
                    <div className={classes.Logo}>
                        <Logo />
                    </div>
                    <div className={navItems}>
                        
                        {/* 
                        <nav> is used to put all the navigation links of the Toolbar.
                        They may be inserted inside the sideDrawer when dimension gets too small.
                            */}
                        <nav>
                            <NavigationItems items={this.props.navitems}/>
                        </nav>
                        {
                            this.props.user.username ? 
                            <span onClick={this.props.logout}>{this.props.user.username}</span>
                            :
                            <Link to="/login-signup">
                                <LoginBtn />
                            </Link>
                        }
                    </div>
                    <HamburgerBtn 
                        clicked={this.props.open}/>
                </div>
            </header>      
        );
    }
}

export default Toolbar;