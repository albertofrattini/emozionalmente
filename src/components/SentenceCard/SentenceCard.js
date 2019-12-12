import React, { useState } from 'react';
import classes from './SentenceCard.css';
import Progress from '../Progress/Progress';
import { MdArrowForward } from 'react-icons/md';

const sentenceCard = (props) => {

    const [showEmotionModal, setEmotionModal] = useState(false);

    let emotionsList = props.record ?
        props.emotions.length > 0 ?
            props.emotions.map((el, i) => {
                if (el.emotion === props.emotion) {
                    return <option key={i} selected="selected" 
                        value={el.emotion}>{el.emotion}</option>
                }
                return <option key={i} value={el.emotion}>{el.emotion}</option>
            })
            : null
        : null;

    let emotionsModal = props.record ?
        props.emotions.length > 0 ?
            props.emotions.map((el, i) => {
                return <span key={i} onClick={() => changeEmotion(el.emotion)}>{el.emotion}</span>
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
                    <span style={{ color: 'var(--logo-red)' }} 
                        onClick={() => changeEmotion('Random')}>Random</span>
                    {emotionsModal}
                </div>
            </div>
        );
    }

    let selectEmotionButton = null;

    if (props.record) {
        const content = props.emotion === '' ? 'Select an emotion' : props.emotion;
        selectEmotionButton = (
            <div className={classes.SelectedEmotion} 
                onClick={() => setEmotionModal(true)}>{content}</div>
        );
    }
        
        
    return (
        <div className={classes.Box}>
            <div className={classes.Left}>
                <Progress progNum={props.progress} />
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