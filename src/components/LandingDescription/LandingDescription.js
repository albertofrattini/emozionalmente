import React from 'react';
import vibesImg from '../../assets/images/main.png';
import classes from './LandingDescription.css';
import { NavLink } from 'react-router-dom';
import { MdMic, MdPlayArrow } from 'react-icons/md';


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
                        <div className={classes.Record}>
                            {/* {props.buttonsx} */}
                            <MdMic size="60px" color="white"/>
                        </div>
                    </NavLink>
                    <div className={classes.Text} style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        Registra
                    </div>
                    <div className={classes.Text}>
                        Registra la tua voce esprimendo un'emozione da te scelta
                    </div>
                </div>
                <div className={classes.Column}>
                    <NavLink to="/evaluate" style={{ textDecoration: 'none' }}>
                        <div className={classes.Evaluate}>
                            {/* {props.buttondx} */}
                            <MdPlayArrow size="64px" color="white"/>
                        </div>
                    </NavLink>
                    <div className={classes.Text} style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        Valuta
                    </div>
                    <div className={classes.Text}>
                        Ascolta la voce di altre persone e valuta quale emozione hanno voluto esprimere 
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default description;