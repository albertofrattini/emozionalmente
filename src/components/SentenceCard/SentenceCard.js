import React, { useState } from 'react';
import classes from './SentenceCard.css';
import Emojis from '../UI/Emojis/Emojis';
import Progress from '../Progress/Progress';
import { MdArrowForward, MdDone } from 'react-icons/md';
import ThumbsDown from '../../assets/images/thumb-down.png';
import ThumbsUp from '../../assets/images/thumb-up.png';

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
                    {emotionsModal}
                </div>
            </div>
        );
    }

    let selectEmotionButton = null;
    let doneButton = null;

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
                            {/* <div className={classes.SelectedEmotion} style={{ color: curr.color }}>
                                    {curr.emotion}
                                </div> */}
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
                                <img className={classes.Evaluation} src={ThumbsUp} alt="thumbsdown" />
                            </div>
                            :
                            <div className={classes.Column}>
                                <img className={classes.Evaluation} src={ThumbsDown} alt="thumbsdown" />
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