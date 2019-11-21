import React from 'react';
import vibesImg from '../../assets/images/vibes.png';
import classes from './LandingDescription.css';
import { NavLink } from 'react-router-dom';


const description = (props) => (
    <div className={classes.Description}>
        <div className={classes.Image}>
            <img src={vibesImg} alt="vibes"></img>
        </div>
        <div className={classes.Container}>
            <h1>
                Let's be emotional, together.
            </h1>
            <p>
                Speak, evaluate and play to help machines recognize our emotions.
            </p>
            <div className={classes.ButtonSection}>
                <NavLink to="/record" >
                    <button className={classes.Record}>RECORD</button>
                </NavLink>
                <NavLink to="/evaluate" >
                    <button className={classes.Evaluate}>EVALUATE</button>
                </NavLink>
            </div>
        </div>
    </div>
);

export default description;