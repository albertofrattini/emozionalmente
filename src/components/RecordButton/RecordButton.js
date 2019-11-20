import React from 'react';
import { MdMic } from 'react-icons/md';
import classes from './RecordButton.css';

const recordButton = (props) => (
    <div className={classes.Box}>
        <button className={classes.Record}>
            <MdMic size="48px" color="var(--logo-red)"/>
        </button>
    </div>
);

export default recordButton;