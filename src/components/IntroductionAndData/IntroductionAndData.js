import React from 'react';
import classes from './IntroductionAndData.css';
import { FaDatabase } from 'react-icons/fa';

const introductionAndData = (props) => (
    <div className={classes.IntroductionAndData}>
        <div className={classes.Container}>
            <div className={classes.Element}>
                <FaDatabase size="48px" color="var(--logo-green)" />
                <h1>Emotional database</h1>
                <p>We want to create a new database, available to everyone that wants to do researches in this field</p>
            </div>
            <div className={classes.Element}>
                <FaDatabase size="48px" color="var(--logo-orange)" />
                <h1>Emotional database</h1>
                <p>We want to create a new database, available to everyone that wants to do researches in this field</p>
            </div>
            <div className={classes.Element}>
                <FaDatabase size="48px" color="var(--logo-blue)" />
                <h1>Emotional database</h1>
                <p>We want to create a new database, available to everyone that wants to do researches in this field</p>
            </div>
        </div>
    </div>
);

export default introductionAndData;