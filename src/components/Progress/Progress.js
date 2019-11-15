import React from 'react';
import ProgressBall from './ProgressBall/ProgressBall';
import classes from './Progress.css';
// import { MdHelpOutline } from 'react-icons/md';

const progress = (props) => {

    let active = false;

    const numSamples = 5;

    let getColorBalls = [...Array( numSamples )].map( (_, i) => {
        if (i < props.progNum) {
            active = true;
        } else {
            active = false;
        }
        return <ProgressBall key={i} active={active}/>
    });

    console.log(getColorBalls)

    return (
        <div className={classes.FirstRow}>
            <div className={classes.Help}>
                {/*<MdHelpOutline />*/}
            </div>
            <div className={classes.Container}>
                {getColorBalls}
            </div>
        </div>
    );
}

export default progress;