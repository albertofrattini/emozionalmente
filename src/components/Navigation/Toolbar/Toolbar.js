import React from 'react';
import classes from './Toolbar.css';
import NavigationItems from '../NavigationItems/NavigationItems';
import Logo from '../../Logo/Logo';
import HamburgerBtn from '../SideDrawer/HamburgerToggle/HamburgerToggle';
import LoginBtn from '../../UI/Buttons/Login/LoginButton';
import { Link } from 'react-router-dom';

const toolbar = (props) => {

    const navItems = [classes.DesktopOnly, classes.LinksAndLogin].join(' ');

    return (
        <header className={classes.Toolbar}>
            <div className={classes.Container}>
                <HamburgerBtn clicked={props.open}/>
                <div className={classes.Logo}>
                    <Logo />
                </div>
                <div className={navItems}>
                    
                    {/* 
                    <nav> is used to put all the navigation links of the Toolbar.
                    They may be inserted inside the sideDrawer when dimension gets too small.
                        */}
                    <nav>
                        <NavigationItems items={props.navitems}/>
                    </nav>
                    {
                        props.user.username ? 
                        <span onClick={props.logout}>{props.user.username}</span>
                        :
                        <Link to="/login-signup">
                            <LoginBtn />
                        </Link>
                    }
                </div>
            </div>
        </header>      
    );
}

export default toolbar;