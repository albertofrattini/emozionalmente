import React, { useState } from 'react';
import classes from './SentenceCard.css';
import Emojis from '../UI/Emojis/Emojis';
import Progress from '../Progress/Progress';
import { MdArrowForward } from 'react-icons/md';

const sentenceCard = (props) => {

    const [showEmotionModal, setEmotionModal] = useState(false);

    let emotionsModal = props.record ?
        props.emotions.length > 0 ?
            props.emotions.map((el, i) => {
                return <span key={i} style={{ color: el.color }}
                    onClick={() => changeEmotion(el)}>{el.emotion}</span>
            })
            : null
        : null;
    
    let modal = null;

    const changeEmotion = (value) => {
        props.change(value);
        setEmotionModal(false);
    }

    if (showEmotionModal) {
        modal = (
            <div className={classes.EmotionsModal}>
                <div className={classes.EmotionsList}>
                    {emotionsModal}
                </div>
            </div>
        );
    }

    let selectEmotionButton = null;

    if (props.record) {
        selectEmotionButton = (
            <div className={classes.Column} onClick={() => setEmotionModal(true)}>
                <img src={Emojis[props.emotion.toLowerCase()]} alt={props.emotion}/>
                <div className={classes.SelectedEmotion} style={{ color: props.emotioncolor}}>
                        {props.emotion}
                </div>
            </div>
        );
    }
        
    return (
        <div className={classes.Box}>
            <div className={classes.Left}>
                <Progress prog={props.progress} evaluate={props.evaluate} emotions={props.emotions}/>
            </div>
            <div className={classes.CardContainer}>
                <div className={classes.EmotionContainer}>
                    {selectEmotionButton}
                </div>
                {modal}
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