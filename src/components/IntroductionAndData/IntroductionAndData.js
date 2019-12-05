import React from 'react';
import classes from './IntroductionAndData.css';
import { MdKeyboardVoice, MdPlayArrow, MdStorage } from 'react-icons/md';

const introductionAndData = (props) => (
    <div className={classes.IntroductionAndData}>
        <div className={classes.Container}>
            <div className={classes.Element}>
                <MdKeyboardVoice size="56px" color="var(--bluer)" />
                <h1>{props.cardsx[0]}</h1>
                <p>{props.cardsx[1]}</p>
            </div>
            <div className={classes.Element}>
                <MdPlayArrow size="56px" color="var(--greener)" />
                <h1>{props.cardcn[0]}</h1>
                <p>{props.cardcn[1]}</p>
            </div>
            <div className={classes.Element}>
                <MdStorage size="56px" color="var(--logo-orange)" />
                <h1>{props.carddx[0]}</h1>
                <p>{props.carddx[1]}</p>
            </div>
        </div>
    </div>
);

export default introductionAndData;