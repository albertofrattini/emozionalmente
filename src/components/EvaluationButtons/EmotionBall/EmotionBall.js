import React from 'react';
import classes from './EmotionBall.css';

const emotionBall = (props) => (

    <div className={classes.EmotionBall} 
        style={{ backgroundColor: props.color }} 
        onMouseOver={props.over}
        onClick={props.clicked} 
        id={props.id}>
    </div>

);

export default emotionBall;