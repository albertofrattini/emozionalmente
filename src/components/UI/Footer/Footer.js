import React from 'react';
import classes from './Footer.css';
import logo from '../../../assets/images/logo.png';
import polimiLogo from '../../../assets/images/polimi-logo.png';
import { Link } from 'react-router-dom';

const footer = (props) => (
    <div className={classes.Footer}>
        <div className={classes.Container}>
            <div className={classes.Logos}>
                <img src={logo} alt="Logo"/>
                <img src={polimiLogo} alt="Logo polimi"/>
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
            <div className={classes.Other}>
                Scriviamo qualche altra cosa giusto per far sembrare che siamo molto seri con i nostri clienti
            </div>
        </div>
    </div>
);

export default footer;