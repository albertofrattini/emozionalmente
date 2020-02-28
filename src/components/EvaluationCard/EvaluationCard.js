import React from 'react';
import classes from './EvaluationCard.css';
import correct from '../../assets/images/correct.png';
import incorrect from '../../assets/images/thinking_face.png';

const evaluationCard = (props) => {

    let content = null;

    if (props.correct) {
        content = "You got it right, the speaker wanted to express " + props.emotion;
    } else {
        content = "You didn't catch which emotion the speaker wanted to express... It was supposed to be " + props.emotion;
    }

    return (
        <div className={classes.Modal}>
            <div className={classes.EvaluationCard}>
                {   
                props.correct ? 
                    <img src={correct} alt="correct answer"/>
                    :
                    <img src={incorrect} alt="not correct"/>
                }
                {content}
            </div>
        </div>
    );
}

export default evaluationCard;