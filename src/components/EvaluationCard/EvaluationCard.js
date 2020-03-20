import React from 'react';
import classes from './EvaluationCard.css';
import correct from '../../assets/images/correct.png';
import incorrect from '../../assets/images/thinking_face.png';

const evaluationCard = (props) => {

    let content = (
        <div style={{ marginTop: '16px' }}>
            {props.sentence} 
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{props.emotion}</span>
        </div>
    );

    return (
        <div id="modal" className={classes.Modal}>
            <div id="card" className={classes.EvaluationCard}>
                {   
                props.correct ? 
                    <img src={correct} alt="correct answer"/>
                    :
                    <img src={incorrect} alt="not correct"/>
                }
                {content}
                <div className={classes.Button} onClick={() => props.clicked()}>OK</div>
            </div>
        </div>
    );
}

export default evaluationCard;