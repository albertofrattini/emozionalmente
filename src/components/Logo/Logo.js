import React from 'react';
import { Link } from 'react-router-dom';
import classes from './Logo.css';
import signalLogo from '../../assets/images/logo.png';
/**
 * Better to import the image in this way and then assign it to the 'src' property
 * of <img>, because the way React works, re-creating an optimized folder of the
 * website, the path may not be the same one again.
 */

const logo = (props) => (
    <div className={classes.Logo}>
        <Link to="/">
            <img src={signalLogo} alt="Signal Logo"/>
        </Link>
    </div>
);

export default logo;