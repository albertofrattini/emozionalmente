import React, { useState } from 'react';
import classes from './SentenceCard.css';
import Emojis from '../UI/Emojis/Emojis';
import Progress from '../Progress/Progress';
import { MdArrowForward, MdDone, MdMic, MdPlayArrow } from 'react-icons/md';
import { FiThumbsDown, FiThumbsUp } from 'react-icons/fi';

const sentenceCard = (props) => {

    const [showEmotionModal, setEmotionModal] = useState(false);

    let emotionsModal = props.record ?
        props.emotions.length > 0 ?
            props.emotions.map((el, i) => {
                return <span key={i} style={{ color: el.color }}
                    onClick={() => changeEmotion(i)}>{el.emotion}</span>
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
                    <span style={{ color: 'var(--text-light)', marginBottom: '24px' }} 
                        onClick={() => changeEmotion('random')}>
                        Random
                    </span>
                    {emotionsModal}
                </div>
            </div>
        );
    }

    let selectEmotionButton = null;
    let doneButton = null;
    let topInstruction = (<div className={classes.TopInstruction}></div>);
    let doneInstruction = null;

    if (props.record) {
        const curr = props.currentEmotion;
        selectEmotionButton = (
            <div className={classes.Column} onClick={() => setEmotionModal(true)}>
                <img className={classes.Emoji} src={Emojis[curr.name]} alt={curr.emotion}/>
                <div className={classes.SelectedEmotion} style={{ color: curr.color }}>
                        {curr.emotion}
                </div>
            </div>
        );
    } else {
        const curr = props.currentEmotion;
        selectEmotionButton = (
            <div className={classes.Row}>
                {
                    curr ?
                        <div className={classes.Column}>
                            <img className={classes.Emoji} src={Emojis[curr.name]} alt={curr.emotion}/>
                        </div>
                        : 
                        null
                }
                {
                    props.currentReview === '' ? 
                        null
                        :
                        props.currentReview === 'good' ? 
                            <div className={classes.Column}>
                                <FiThumbsUp size="36px" color="var(--greener)"/>
                            </div>
                            :
                            <div className={classes.Column}>
                                <FiThumbsDown size="36px" color="var(--logo-red)"/>
                            </div>

                }
            </div>
        );
        
    }

    if (props.hasevaluation) {
        doneButton = (
            <button className={classes.Done} onClick={props.done}>
                <MdDone size="48px" color="var(--greener)"/>
            </button>
        );

        doneInstruction = (
            <div className={classes.DoneInstruction}>
                {props.guide2_1of2}
                <MdDone size="24px" color="var(--greener)" style={{ margin: '0px 8px' }}/>
                {props.guide2_2of2}
            </div>
        );

    }

    if (props.record) {
        topInstruction = (
            <div className={classes.TopInstruction}>
                {props.guide1_1of3}
                <img className={classes.EmojiInstruction} 
                    src={Emojis[props.currentEmotion.name]} alt={props.currentEmotion.emotion}/>
                {props.guide1_2of3}
                <MdMic size="24px" color="var(--logo-red)" style={{ margin: '0px 8px' }}/>
                {props.guide1_3of3}
            </div>
        );
    } else {
        topInstruction = (
            <div className={classes.TopInstruction}>
                {props.guide1_1of4}
                <MdPlayArrow size="24px" color="var(--logo-violet)" style={{ margin: '0px 8px' }}/>
                {props.guide1_2of4}
                <FiThumbsDown size="20px" color="var(--logo-red)" style={{ margin: '0px 8px' }}/>
                {props.guide1_3of4}
                <FiThumbsUp size="20px" color="var(--greener)" style={{ margin: '0px 8px' }}/>
                {props.guide1_4of4}
            </div>
        );
    }
        
    return (
        <div className={classes.Box}>
            <div className={classes.Left}>
                <Progress prog={props.progress} evaluate={props.evaluate} emotions={props.emotions}/>
            </div>
            <div className={classes.CardContainer}>
                {topInstruction}
                {doneInstruction}
                <div className={classes.EmotionContainer}>
                    {selectEmotionButton}
                </div>
                {modal}
                {doneButton}
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