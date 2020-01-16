import React from 'react';
import classes from './EmotionBall.css';

const emotionBall = (props) => (

    // <div className={classes.EmotionBall} 
    //     style={{ backgroundColor: props.color }} 
    //     onMouseOver={props.over}
    //     onClick={props.clicked} 
    //     id={props.id}>
    // </div>

    <div className={classes.Column}>
        <div className={classes.Emoji}>
            <img src={props.imgSrc} alt={props.emotion}/>
        </div>
        <div 
            className={classes.Emotion}
            style={{ backgroundColor: props.color }}>
                {props.emotion}
        </div>
    </div>
);

export default emotionBall;