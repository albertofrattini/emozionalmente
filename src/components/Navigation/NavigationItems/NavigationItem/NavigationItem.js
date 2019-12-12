import React from 'react';
import classes from './NavigationItem.css';
import { NavLink } from 'react-router-dom';

// TODO: remove inline-styling in favor of CSS. It was not working...

const navigationItem = (props) => (
    <li className={classes.NavigationItem} onClick={props.clicked}>
        <NavLink to={props.link}
        activeStyle={{
            backgroundColor: 'transparent',
            color: '#f9aa33',
            borderBottom: '2px solid #f9aa33'
        }}>{props.children}</NavLink>
    </li>
);

export default navigationItem;