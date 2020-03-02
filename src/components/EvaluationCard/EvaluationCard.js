import React from 'react';
import classes from './EvaluationCard.css';
import correct from '../../assets/images/correct.png';
import incorrect from '../../assets/images/thinking_face.png';

const evaluationCard = (props) => {

    let content = (
        <React.Fragment>
            {props.sentence} 
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{props.emotion}</span>
        </React.Fragment>
    );

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