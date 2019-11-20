import React from 'react';
import classes from './CheckListen.css';
import { MdPlayArrow, MdDone } from 'react-icons/md';

const checkListen = (props) => (
    <div className={classes.Options}>
        <button className={classes.Play}>
            <MdPlayArrow size="48px" color="var(--bluer)"/>
        </button>
        <div className={classes.Signal}></div>
        <button className={classes.Done}>
            <MdDone size="48px" color="var(--greener)"/>
        </button>
    </div>
);

export default checkListen;