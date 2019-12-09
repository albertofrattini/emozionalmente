import React from 'react';
import classes from './RecordCardsLayer.css';
// import Aux from '../../hoc/Aux/Aux';
// import { MdMic } from 'react-icons/md';
// import { MdArrowForward } from 'react-icons/md';

const SET_COUNT = 5;

const recordCardsLayer = (props) => {

    const activeIndex = props.active;
    const cardClass = [classes.Card]

    let isDone = function () {
        return props.sentences.length > 0;
    }
    
    
    return (

        <div className={classes.CardsContainer}>
            {
                props.sentences.map((sentence, i) => {
                    const activeSentenceIndex = isDone ? SET_COUNT - 1 : activeIndex;
                    const isActive = i === activeSentenceIndex;
                    const tempClass = [...cardClass, (isActive ? '' : 'inactive')];
                    return (
                        <div 
                            key={sentence}
                            className={tempClass.join(' ')}
                            style={{
                                transform: [
                                    `scale(${isActive ? 1 : 0.9})`,
                                    `translateX(${(document.dir === 'rtl' ? -1 : 1) * 
                                    (i - activeSentenceIndex) * -130}%)`,
                                ].join(' '),
                                opacity: i < activeSentenceIndex ? 0 : 1,
                            }}>
                            <div style={{ margin: 'auto', width: '100%' }}>
                                {sentence}
                            </div>
                        </div>
                    ); 
                })
            }
        </div>

    );
}

export default recordCardsLayer;

/* <div className={classes.Options}>
    <button className={classes.Record}>
        <MdMic size="48px" color="#e54040"/>
    </button>
    <button className={classes.Skip}>
        <MdArrowForward size="24px" color="#344955"/>
    </button>
</div> 

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


*/