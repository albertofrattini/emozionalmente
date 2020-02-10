import React from 'react';
import classes from './EmotionBall.css';
import log from '../../../logger';

const emotionBall = (props) => (

    <div className={classes.Column} onClick={() => {
        props.clicked(props.emotion);
        log('@Evaluate: Clicked emotion');
        }}>
        <div className={classes.Emoji}>
            <img src={props.imgSrc} alt={props.emotion.emotion}/>
        </div>
        <div className={classes.Emotion} style={{ color: props.emotion.color }}>
            {props.emotion.emotion}
        </div>
    </div>
);

export default emotionBall;