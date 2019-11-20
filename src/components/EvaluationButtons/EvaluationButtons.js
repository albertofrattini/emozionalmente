import React from 'react';
import classes from './EvaluationButtons.css';
import { MdThumbUp, MdThumbDown, MdStars } from 'react-icons/md';

const evaluationButtons = (props) => (


    <div className={classes.EvaluationButtons}>
        <div className={classes.Container}>
            <div className={classes.EmotionExpressed}>
                <div className={classes.Emotions}>
                    <div className={classes.EmotionBall} style={{ backgroundColor: "var(--logo-green)" }} 
                        onMouseOver={props.over} id="0"></div>
                    <div className={classes.EmotionBall} style={{ backgroundColor: "var(--logo-orange)" }}
                        onMouseOver={props.over} id="1"></div>
                    <div className={classes.EmotionBall} style={{ backgroundColor: "var(--logo-red)" }}
                        onMouseOver={props.over} id="2"></div>
                    <div className={classes.EmotionBall} style={{ backgroundColor: "var(--neutral)" }}
                        onMouseOver={props.over} id="3"></div>
                    <div className={classes.EmotionBall} style={{ backgroundColor: "var(--logo-pink)" }}
                        onMouseOver={props.over} id="4"></div>
                    <div className={classes.EmotionBall} style={{ backgroundColor: "var(--logo-violet)" }}
                        onMouseOver={props.over} id="5"></div>
                    <div className={classes.EmotionBall} style={{ backgroundColor: "var(--logo-blue)" }}
                        onMouseOver={props.over} id="6"></div>
                </div>
                <div className={classes.ShowEmotion}>{props.emotion}</div>
            </div>
            <div className={classes.AudioQuality}>
                <MdThumbDown size="24px" color="var(--logo-red)" />
                <MdThumbUp size="24px" color="var(--greener)" />
                <MdStars size="32px" color="var(--logo-orange)" />
            </div>
        </div>
    </div>

);

export default evaluationButtons;