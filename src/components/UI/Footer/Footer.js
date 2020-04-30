import React from 'react';
import classes from './Footer.css';
import logo from '../../../assets/images/logo.png';
import poli from '../../../assets/images/polimi-logo-w.png';
import i3lab from '../../../assets/images/i3lab-w.png';
import { Link } from 'react-router-dom';

const footer = (props) => (
    <div className={classes.Footer}>
        <div className={classes.Container}>
            <div className={classes.Logos}>
                <img src={logo} alt="Logo"/>
                <img src={poli} alt="Logo"/>
                <img src={i3lab} alt="Logo"/>
            </div>
            <div className={classes.Links}>
                <Link to="/faq" className={classes.Link}>
                    FAQ
                </Link>
                <Link to="/privacy" className={classes.Link}>
                    Privacy
                </Link>
                <Link to="/terms" className={classes.Link}>
                    Terms and Conditions
                </Link>
            </div>
        </div>
    </div>
);

export default footer;