import React from 'react';
import classes from './InfoCard.css';
import { Link } from 'react-router-dom';
import log from '../../../logger';

const infoCard = (props) => (
    <div className={classes.Card}>
        <div className={classes.Description}>
            <div className={classes.Image}>
                {props.img}
            </div>
            <div className={classes.Text} dangerouslySetInnerHTML={{
                __html: props.text,
            }}></div>
        </div>
        <Link to={props.path}>
            <button onClick={() => log('@AboutUs: clicked btn -> ' + props.path)}>
                    {props.action}
            </button>
        </Link>
    </div>
);

export default infoCard;