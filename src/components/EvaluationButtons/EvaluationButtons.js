import React from 'react';
import classes from './EvaluationButtons.css';
import EmotionBall from './EmotionBall/EmotionBall';
import Emojis from '../UI/Emojis/Emojis';
import { GoArrowRight } from 'react-icons/go';

const evaluationButtons = (props) => {

    let getEmotionBalls = props.emotions.length > 0 ?
        props.emotions.map((el, i) => {
            if (props.selected === el.name) {
                return <EmotionBall key={i} highlight
                            imgSrc={Emojis[el.name]}
                            emotion={el}
                            clicked={props.clicked} />
            }
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
                    { props.showGuide ? <GoArrowRight className={classes.PointArrow} size="32px"></GoArrowRight> : null }
                    {getEmotionBalls}
                </div>
            </div>
        </div>
    );

}

export default evaluationButtons;