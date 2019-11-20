import React from 'react';
import classes from './InfoCard.css';

const infoCard = (props) => (
    <div className={classes.Card}>
        {props.svg}
        <h3>{props.text}</h3>
        <button 
            style={{ backgroundColor: props.btncolor }}>
                {props.action}
        </button>
    </div>
);

export default infoCard;