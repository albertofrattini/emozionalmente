import React from 'react';
import databaseImg from '../../assets/images/home-database.png';
import classes from './LandingDescription.css';

const description = (props) => (
    <div className={classes.Description}>
        <div className={classes.DescriptionText}>
            <h1>
                Emozionalmente wants to do some good stuff
            </h1>
            <p>
                Sto scrivendo un po' di cagate
            </p>
            <div className={classes.ButtonSection}>
                <button className={classes.Record}>Record</button>
                <button className={classes.Evaluate}>Evaluate</button>
            </div>
        </div>
        <div className={classes.DescriptionImage}>
            <img src={databaseImg} alt="Emoticon database"></img>
        </div>
    </div>
);

export default description;