import React from 'react';
import classes from './ProgressBall.css';

const progressBall = (props) => {

    let color = props.active ? '4px solid ' + props.color : '1px solid ' + props.color;

    return (
        <div className={classes.Ball} style={{ border: color }}>
            {
                props.imgSrc === null ?
                    null :
                    <img src={props.imgSrc} alt={props.color} />
            }
        </div>
    );
}

export default progressBall;