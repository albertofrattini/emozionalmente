import React from 'react';
import ProgressBall from './ProgressBall/ProgressBall';
import classes from './Progress.css';
import Emojis from '../UI/Emojis/EmojisCheck';

const progress = (props) => {

    let color = '';
    let imgSrc = '';
    let active = false;

    const numSamples = 5;

    let getColorBalls = [...Array( numSamples )].map( (_, i) => {
        if (i >= numSamples - props.prog.length) {
            const index = numSamples - i - 1;
            color = props.prog[index].color;
            imgSrc = Emojis[props.prog[index].name];
            active = true;
        } else {
            color = '#aaaaaa';
            imgSrc = null;
            active = false;
        }
        return <ProgressBall key={i} active={active} color={color} imgSrc={imgSrc}/>
    });


    return (
        <div className={classes.Container}>
            {getColorBalls}
        </div>
    );
}

export default progress;