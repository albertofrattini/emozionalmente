import React from 'react';
import classes from './LoginButton.css';

const loginBtn = (props) => (
    <button className={classes.LoginBtn} onClick={props.clicked}>
        Log In / Sign Up
    </button>
);

export default loginBtn;