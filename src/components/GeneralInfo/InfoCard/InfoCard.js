import React from 'react';
import classes from './InfoCard.css';
import { Link } from 'react-router-dom';

const infoCard = (props) => (
    <div className={classes.Card}>
        {props.svg}
        <h3>{props.text}</h3>
        <Link to={props.path}>
            <button>
                    {props.action}
            </button>
        </Link>
    </div>
);

export default infoCard;