import React from 'react';
import classes from './LoginButton.css';
import log from '../../../../logger';

const loginBtn = (props) => (
    <button className={classes.LoginBtn} 
        onClick={() => log('@Toolbar: btn LoginSignup -> @LoginSignup')}>
        LOGIN / SIGNUP
    </button>
);

export default loginBtn;