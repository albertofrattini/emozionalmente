import React from 'react';
import classes from './HamburgerToggle.css';

const hamburgerBtn = (props) => (
    <div className={classes.HamburgerBtn} onClick={props.clicked}>
        <div></div>
        <div></div>
        <div></div>
    </div>
);

export default hamburgerBtn;