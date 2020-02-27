import React from 'react';
import classes from './EmotionBall.css';
import log from '../../../logger';

const emotionBall = (props) => {

    let selectedEmotion = classes.Column;
    let style = {
        border: "2px solid transparent"
    }

    if (props.highlight) {
        selectedEmotion = [classes.Column, classes.Highlight].join(' ');
        style = {
            border: "2px solid " + props.emotion.color,
        }
    } 

    return (

        <div className={selectedEmotion} style={style} onClick={() => {
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
}

export default emotionBall;