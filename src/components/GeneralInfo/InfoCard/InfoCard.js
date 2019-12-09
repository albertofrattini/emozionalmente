import React from 'react';
import classes from './InfoCard.css';
import { Link } from 'react-router-dom';

const infoCard = (props) => (
    <div className={classes.Card}>
        <div className={classes.Description}>
            <div className={classes.Image}>
                {props.img}
            </div>
            <h3>{props.text}</h3>
        </div>
        <Link to={props.path}>
            <button>
                    {props.action}
            </button>
        </Link>
    </div>
);

export default infoCard;