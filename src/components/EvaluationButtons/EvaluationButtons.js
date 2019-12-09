import React from 'react';
import classes from './EvaluationButtons.css';
import { MdThumbUp, MdThumbDown, MdStars } from 'react-icons/md';
import EmotionBall from './EmotionBall/EmotionBall';

const evaluationButtons = (props) => {

    let getEmotionBalls = props.emotions.length > 0 ?
        props.emotions.map((emotion, i) => {
            return <EmotionBall key={i}
                        color={emotion.color}
                        over={props.over}
                        clicked={props.clickedemotion}
                        id={i} />
        })
        : null;

    return (
        <div className={classes.EvaluationButtons}>
            <div className={classes.Container}>
                <div className={classes.EmotionExpressed}>
                    <div className={classes.Emotions}>
                        {getEmotionBalls}
                    </div>
                    <div className={classes.ShowEmotion}>{props.emotion}</div>
                </div>
                <div className={classes.AudioQuality}>
                    <div className={classes.Bad}>
                        <MdThumbDown size="32px" color="var(--logo-red)" 
                            onClick={() => props.clickedreview('Bad')}/>
                    </div>
                    <div className={classes.Good}>
                        <MdThumbUp size="32px" color="var(--greener)" 
                            onClick={() => props.clickedreview('Good')}/>
                    </div>
                    <div className={classes.Perfect}>
                        <MdStars size="40px" color="var(--logo-orange)" 
                            onClick={() => props.clickedreview('Perfect')}/>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default evaluationButtons;