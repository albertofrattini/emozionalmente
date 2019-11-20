import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem'; 
import classes from './NavigationItems.css';

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        {/* These are the two ways to pass a boolean */}
        <NavigationItem link="/record" >RECORD</NavigationItem>
        <NavigationItem link="/evaluate" >EVALUATE</NavigationItem>
        <NavigationItem link="/database" >DATABASE</NavigationItem>
        <NavigationItem link="/about-us" >ABOUT US</NavigationItem>
    </ul>
);

export default navigationItems;