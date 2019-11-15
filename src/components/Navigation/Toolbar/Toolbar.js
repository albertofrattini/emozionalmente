import React from 'react';
import classes from './Toolbar.css';
import NavigationItems from '../NavigationItems/NavigationItems';
import Logo from '../../Logo/Logo';
import HamburgerBtn from '../SideDrawer/HamburgerToggle/HamburgerToggle';
import LoginBtn from '../../UI/Buttons/Login/LoginButton';

const toolbar = (props) => (

    <header className={classes.Toolbar}>
        <HamburgerBtn clicked={props.open}/>
        <div className={classes.LogoAndLinks}>
            <div className={classes.Logo}>
                <Logo />
            </div>
            {/* 
            <nav> is used to put all the navigation links of the Toolbar.
            They may be inserted inside the sideDrawer when dimension gets too small.
                */}
            <nav className={classes.DesktopOnly}>
                <NavigationItems />
            </nav>
        </div>
        <LoginBtn />
    </header>      
    
);

export default toolbar;