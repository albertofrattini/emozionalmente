import React from 'react';
import classes from './CurrentDatabase.css';
import BubbleChart from '../UI/BubbleChart/BubbleChart';

const currentDatabase = (props) => (
    <div className={classes.CurrentDatabase}>
        <div className={classes.Container}>
            <div className={classes.Card}>
                <BubbleChart width="400"/>
            </div>
            <div className={classes.Text}>
                <h1>{props.title}</h1>
                <p>{props.subtitle}</p>
            </div>
        </div>
    </div>
);

export default currentDatabase;