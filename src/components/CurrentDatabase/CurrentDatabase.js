import React from 'react';
import classes from './CurrentDatabase.css';

const currentDatabase = (props) => (
    <div className={classes.CurrentDatabase}>
        <div className={classes.Container}>
            <div className={classes.Card}>
                Graphic
            </div>
            <div className={classes.Text}>
                <h1>{props.title}</h1>
                <p>{props.subtitle}</p>
            </div>
        </div>
    </div>
);

export default currentDatabase;