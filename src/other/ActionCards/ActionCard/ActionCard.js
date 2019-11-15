import React from 'react';
import classes from './ActionCard.css';

const actionCard = (props) => (
    <div className={classes.ActionCard}>
        <h1>{props.title}</h1>
        <p>{props.description}</p>
    </div>
);

export default actionCard;