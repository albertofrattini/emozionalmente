import React, { useState } from 'react';
import classes from './SentenceCard.css';
import Emojis from '../UI/Emojis/Emojis';
import Progress from '../Progress/Progress';
import { MdDone, MdPlayArrow, MdNavigateNext, MdHelpOutline } from 'react-icons/md';
import { GoArrowLeft } from 'react-icons/go';

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
                { props.new ? <GoArrowLeft className={classes.PointArrow} size="32px"></GoArrowLeft> : null }
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
                {props.guidetop}
            </div>
        );
    } else {
        topInstruction = (
            <div className={classes.TopInstruction}>
                {props.guide1_1of2}
                <MdPlayArrow size="24px" color="var(--logo-violet)" style={{ margin: '0px 8px' }}/>
                {props.guide1_2of2}
            </div>
        );
    }
        
    return (
        <div className={classes.Box}>
            <div className={classes.Left}>
                <Progress prog={props.progress} evaluate={props.evaluate} 
                            emotions={props.emotions} tooltip_sentence={props.tooltip_sentence}/>
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
                <MdHelpOutline size="20px" color="var(--text-lighter)"
                    className={classes.Help} onClick={props.toggleHelp}/>
                    {props.sentence}
                </div>
            </div>
            <div className={classes.Right}>
                <button className={classes.SkipButton} onClick={props.clicked}>
                    <MdNavigateNext size="24px" color="var(--text-dark)"/>
                </button>
            </div>
        </div>
    );
}

export default sentenceCard;