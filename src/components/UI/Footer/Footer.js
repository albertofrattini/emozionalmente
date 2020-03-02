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
                <Link to="/faq" className={classes.Link}>
                    FAQ
                </Link>
                <Link to="#" className={classes.NullLink}>
                    Privacy
                </Link>
                <Link to="#" className={classes.NullLink}>
                    Terms
                </Link>
            </div>
        </div>
    </div>
);

export default footer;