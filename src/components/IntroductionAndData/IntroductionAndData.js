import React from 'react';
import classes from './IntroductionAndData.css';
import { MdKeyboardVoice, MdPlayArrow, MdStorage } from 'react-icons/md';

const introductionAndData = (props) => (
    <div className={classes.IntroductionAndData}>
        <div className={classes.Container}>
            <div 
                className={classes.Element}    
                style={{ backgroundColor: '#CCEABE' }}>
                    <MdKeyboardVoice size="96px" color="#78CC51" />
                    <h1>{props.cardsx[0]}</h1>
                    <p>{props.cardsx[1]}</p>
            </div>
            <div 
                className={classes.Element}
                style={{ backgroundColor: '#EAC0BE' }}>
                    <MdPlayArrow size="96px" color="#CC5751" />
                    <h1>{props.cardcn[0]}</h1>
                    <p>{props.cardcn[1]}</p>
            </div>
            <div 
                className={classes.Element}
                style={{ backgroundColor: '#BDD5EA' }}>
                    <MdStorage size="96px" color="#5192CC" />
                    <h1>{props.carddx[0]}</h1>
                    <p>{props.carddx[1]}</p>
            </div>
        </div>
    </div>
);

export default introductionAndData;