import React from 'react';
import classes from './Footer.css';
import logo from '../../../assets/images/logo.png';
import { Link } from 'react-router-dom';

const footer = (props) => (
    <div className={classes.Footer}>
        <div className={classes.Container}>
            <div className={classes.Logos}>
                <img src={logo} alt="Logo"/>
            </div>
            <div className={classes.Links}>
                <Link to="/privacy" className={classes.Link}>
                    Privacy
                </Link>
                <Link to="/terms" className={classes.Link}>
                    Terms
                </Link>
                <Link to="/about-us" className={classes.Link}>
                    FAQ
                </Link>
                <Link to="/cookies" className={classes.Link}>
                    Cookies
                </Link>
            </div>
            {/* <div className={classes.Other}>
                <div className={classes.Languages}>
                    <button onClick={props.clicked}>it</button>
                    <button onClick={props.clicked}>en</button>
                </div>
            </div> */}
        </div>
    </div>
);

export default footer;