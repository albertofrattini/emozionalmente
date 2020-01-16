import React from 'react';
import classes from './EvaluationButtons.css';
import EmotionBall from './EmotionBall/EmotionBall';
import Emojis from '../UI/Emojis/Emojis';

const evaluationButtons = (props) => {

    let getEmotionBalls = props.emotions.length > 0 ?
        props.emotions.map((emotion, i) => {
            return <EmotionBall key={i}
                        imgSrc={Emojis[emotion.emotion.toLowerCase()]}
                        emotion={emotion.emotion}
                        color={emotion.color}
                        clicked={props.clickedemotion}
                        id={i} />
        })
        : null;

    return (
        <div className={classes.EvaluationButtons}>
            <div className={classes.Container}>
                <div className={classes.Emotions}>
                    {getEmotionBalls}
                </div>
            </div>
        </div>
    );

}

export default evaluationButtons;