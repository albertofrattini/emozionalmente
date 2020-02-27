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
    </div>
);

export default infoCard;