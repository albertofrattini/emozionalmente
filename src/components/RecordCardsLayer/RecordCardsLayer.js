import React from 'react';
import classes from './RecordCardsLayer.css';
import Aux from '../../hoc/Aux/Aux';
import { MdMic } from 'react-icons/md';
import { MdArrowForward } from 'react-icons/md';


const recordCardsLayer = (props) => (
    <Aux>
        <div className={classes.PositionedContainer}>
            <div className={classes.LowerCards}>
                <div className={classes.SmallCard}>
                    Lorem ipsum dolor sit amet
                </div>
                <div className={classes.SmallCard}>
                    Lorem ipsum dolor sit amet
                </div>
            </div>
            <div className={classes.MiddleCards}>
                <div className={classes.MediumCard}>
                    Lorem ipsum dolor sit amet
                </div>
                <div className={classes.MediumCard}>
                    Lorem ipsum dolor sit amet
                </div>
            </div>
            <div className={classes.Backdrop}></div>
            <div className={classes.MainCard}>
                <div className={classes.Card}>
                    Lorem ipsum dolor sit amet
                </div>
            </div>
        </div>

        <div className={classes.Options}>
            <button className={classes.Record}>
                <MdMic size="48px" color="#e54040"/>
            </button>
            <button className={classes.Skip}>
                <MdArrowForward size="24px" color="#344955"/>
            </button>
        </div>
    </Aux>
);

export default recordCardsLayer;