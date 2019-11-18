import React from 'react';
import databaseImg from '../../assets/images/home-database.png';
import classes from './LandingDescription.css';

const description = (props) => (
    <div className={classes.Description}>
        <div className={classes.DescriptionText}>
            <h1>
                {props.title}
            </h1>
            <p>
                {props.subtitle}
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