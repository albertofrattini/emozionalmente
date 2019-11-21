import React from 'react';
import classes from './LoginButton.css';

const loginBtn = (props) => (
    <button className={classes.LoginBtn} onClick={props.clicked}>
        LOGIN / SIGNUP
    </button>
);

export default loginBtn;