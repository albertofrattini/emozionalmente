import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem'; 
import classes from './NavigationItems.css';

const navigationItems = (props) => {

    let navigationItems = Object.keys(props.items).map((key, i) => {
        return <NavigationItem clicked={props.clicked} key={key} link={props.items[key]}>{key}</NavigationItem>;
    });

    return (
        <ul className={classes.NavigationItems}>
            {navigationItems}
        </ul>
    );
}

export default navigationItems;