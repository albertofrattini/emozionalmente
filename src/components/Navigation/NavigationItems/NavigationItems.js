import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem'; 
import classes from './NavigationItems.css';

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        {/* These are the two ways to pass a boolean */}
        <NavigationItem link="/record" >Record</NavigationItem>
        <NavigationItem link="/evaluate" >Evaluate</NavigationItem>
        <NavigationItem link="/database" >Database</NavigationItem>
        <NavigationItem link="/about-us" >About Us</NavigationItem>
    </ul>
);

export default navigationItems;