import React from 'react';
import { Link } from 'react-router-dom';
import classes from './Logo.css';
import signalLogo from '../../assets/images/logo.png';
/**
 * Better to import the image in this way and then assign it to the 'src' property
 * of <img>, because the way React works, re-creating an optimized folder of the
 * website, the path may not be the same one again.
 */

const logo = (props) => {

    let logo;

    if (props.nolink) {
        logo = (
            <img src={signalLogo} alt="Signal Logo"/>
        );
    } else {
        logo = (
            <Link to="/">
                <img src={signalLogo} alt="Signal Logo"/>
            </Link>
        );
    }
    return (
        <div className={classes.Logo}>
            {logo}
        </div>
    );
}

export default logo;