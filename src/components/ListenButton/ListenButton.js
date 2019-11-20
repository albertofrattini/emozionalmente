import React from 'react';
import { MdPlayArrow } from 'react-icons/md';
import classes from './ListenButton.css';

const listenButton = (props) => (
    <div className={classes.Box}>
        <button className={classes.Listen}>
            <MdPlayArrow size="48px" color="var(--logo-violet)"/>
        </button>
    </div>
);

export default listenButton;