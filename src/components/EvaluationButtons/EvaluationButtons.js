import React from 'react';
import classes from './EvaluationButtons.css';
import EmotionBall from './EmotionBall/EmotionBall';
import Emojis from '../UI/Emojis/Emojis';

const evaluationButtons = (props) => {

    let getEmotionBalls = props.emotions.length > 0 ?
        props.emotions.map((el, i) => {
            return <EmotionBall key={i}
                        imgSrc={Emojis[el.name]}
                        emotion={el}
                        clicked={props.clicked} />
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