import React from 'react';
import classes from './IntroductionAndData.css';
import { MdKeyboardVoice, MdPlayArrow, MdStorage } from 'react-icons/md';

const introductionAndData = (props) => (
    <div className={classes.IntroductionAndData}>
        <div className={classes.Container}>
            <div 
                className={classes.Element}    
                style={{ backgroundColor: 'rgba(143, 234, 149, 0.3)' }}>
                    <MdKeyboardVoice size="96px" color="rgba(137, 227, 143, 1)" />
                    <h1>{props.cardsx[0]}</h1>
                    <p>{props.cardsx[1]}</p>
            </div>
            <div 
                className={classes.Element}
                style={{ backgroundColor: 'rgba(229, 64, 64, 0.3)' }}>
                    <MdPlayArrow size="96px" color="rgba(229, 64, 64, 0.9)" />
                    <h1>{props.cardcn[0]}</h1>
                    <p>{props.cardcn[1]}</p>
            </div>
            <div 
                className={classes.Element}
                style={{ backgroundColor: 'rgba(137, 200, 229, 0.4)' }}>
                    <MdStorage size="96px" color="rgba(133, 193, 221, 1)" />
                    <h1>{props.carddx[0]}</h1>
                    <p>{props.carddx[1]}</p>
            </div>
        </div>
    </div>
);

export default introductionAndData;