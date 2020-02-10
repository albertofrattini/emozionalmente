import React from 'react';
import vibesImg from '../../assets/images/main.png';
import classes from './LandingDescription.css';
import { NavLink } from 'react-router-dom';
import { MdMic, MdPlayArrow } from 'react-icons/md';

import log from '../../logger';


const description = (props) => (
    <div className={classes.Description}>
        <div className={classes.Image}>
            <img src={vibesImg} alt="vibes"></img>
        </div>
        <div className={classes.Container}>
            <h1>
                {props.title}
            </h1>
            <p>
                {props.subtitle}
            </p>
            <div className={classes.ButtonSection}>
                <div className={classes.Column}>
                    <NavLink to="/record" style={{ textDecoration: 'none' }}>
                        <div className={classes.Record} onClick={() => log('@Home: btn Record -> @Record')}>
                            <MdMic size="60px" color="white"/>
                        </div>
                    </NavLink>
                    <div className={classes.Text} style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        {props.buttonsxtitle}
                    </div>
                    <div className={classes.Text}>
                        {props.buttonsxsub}
                    </div>
                </div>
                <div className={classes.Column}>
                    <NavLink to="/evaluate" style={{ textDecoration: 'none' }}>
                        <div className={classes.Evaluate} onClick={() => log('@Home: btn Evaluate -> @Evaluate')}>
                            <MdPlayArrow size="64px" color="white"/>
                        </div>
                    </NavLink>
                    <div className={classes.Text} style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        {props.buttondxtitle}
                    </div>
                    <div className={classes.Text}>
                        {props.buttondxsub}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default description;