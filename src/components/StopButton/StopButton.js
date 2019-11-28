import React from 'react';
import { MdStop } from 'react-icons/md';
import classes from './StopButton.css';

const stopButton = (props) => (
    <div className={classes.Box}>
        <button className={classes.Stop} onClick={props.clicked}>
            <MdStop size="48px" color="var(--logo-red)"/>
        </button>
    </div>
);

export default stopButton;