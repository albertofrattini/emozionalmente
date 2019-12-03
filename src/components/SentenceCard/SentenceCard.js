import React from 'react';
import classes from './SentenceCard.css';
import Progress from '../Progress/Progress';
import { MdArrowForward } from 'react-icons/md';

const sentenceCard = (props) => {

    let emotionsList = props.record ?
        props.emotions.length > 0 ?
            props.emotions.map((el, i) => {
                if (el.emotion === props.emotion) {
                    return <option key={i} selected="selected" value={el.emotion}>{el.emotion}</option>
                }
                return <option key={i} value={el.emotion}>{el.emotion}</option>
            })
            : null
        : null;


        
        
    return (
        <div className={classes.Box}>
            <div className={classes.Left}>
                <Progress progNum={props.progress} />
            </div>
            <div className={classes.CardContainer}>
                <div className={classes.EmotionContainer}>
                    {props.record ? 
                        <select className={classes.Emotion} onChange={props.change}> 
                            <option value='none'>choose</option>
                            <option value='random'>Random</option>
                            {emotionsList}
                        </select>
                        : null 
                    }
                </div>
                <div className={classes.Card}>
                    {props.sentence}
                </div>
            </div>
            <div className={classes.Right}>
                <button className={classes.SkipButton} onClick={props.clicked}>
                    <MdArrowForward size="24px" color="var(--text-dark)"/>
                </button>
            </div>
        </div>
    );
}

export default sentenceCard;