import React from 'react';
import classes from './ProgressBall.css';

const progressBall = (props) => {

    let ballClass = props.active ? classes.Active : classes.Inactive;

    return (
        <div className={ballClass}></div>
    );
}

export default progressBall;