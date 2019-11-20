import React from 'react';
import databaseImg from '../../assets/images/home-database.png';
// import sinImg from '../../assets/images/sin.png';
import classes from './LandingDescription.css';
import { NavLink } from 'react-router-dom';


const description = (props) => (
    <div className={classes.Description}>
        <div className={classes.Container}>
            <div className={classes.DescriptionText}>
                <h1>
                    {props.title}
                </h1>
                <p>
                    {props.subtitle}
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
            <img src={databaseImg} alt="Emoticon database"></img>
        </div>
    </div>
);

/*
const description = (props) => (
    <div style={{ width: '100%', height: 'auto' , textAlign: 'center' }}>
        <img src={sinImg} alt="ciao" style={{ width: '100%', maxWidth: '1800px', height: 'auto' }}></img>
    </div>
);
*/

export default description;