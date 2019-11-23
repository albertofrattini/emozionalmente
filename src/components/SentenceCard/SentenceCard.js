import React from 'react';
import classes from './SentenceCard.css';
import { MdArrowForward } from 'react-icons/md';

const recordCard = (props) => (
    <div className={classes.Box}>
        <div style={{ width: '72px', height: '40px' }}></div>
        <div className={classes.CardContainer}>
            <div className={classes.EmotionContainer}>
                <div className={classes.Emotion}> 
                    {props.emotion}
                </div>
            </div>
            <div className={classes.Card}>
                {props.sentence}
            </div>
        </div>
        <div>
            <button className={classes.SkipButton} onClick={props.clicked}>
                <MdArrowForward size="24px" color="var(--text-dark)"/>
            </button>
        </div>
    </div>
);

export default recordCard;