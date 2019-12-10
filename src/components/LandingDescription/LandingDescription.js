import React from 'react';
import vibesImg from '../../assets/images/prova.png';
import classes from './LandingDescription.css';
import { NavLink } from 'react-router-dom';


const description = (props) => (
    <div className={classes.Description}>
        <div className={classes.Image}>
            <img src={vibesImg} alt="vibes"></img>
            {/* <div className={classes.Inside}>
                <div className={classes.InsideIn}></div>
            </div> */}
        </div>
        <div className={classes.Container}>
            <h1>
                {props.title}
            </h1>
            <p>
                {props.subtitle}
            </p>
            <div className={classes.ButtonSection}>
                <NavLink to="/record" >
                    <button className={classes.Record}>{props.buttonsx}</button>
                </NavLink>
                <NavLink to="/evaluate" >
                    <button className={classes.Evaluate}>{props.buttondx}</button>
                </NavLink>
            </div>
        </div>
    </div>
);

export default description;