import React from 'react';
import ProgressBall from './ProgressBall/ProgressBall';
import classes from './Progress.css';
import EmojisCheck from '../UI/Emojis/EmojisCheck';
import Emojis from '../UI/Emojis/Emojis';


const progress = (props) => {

    let color = '';
    let imgSrc = '';
    let active = false;
    let tooltip = null;

    const numSamples = 5;

    let getColorBalls = [...Array( numSamples )].map( (_, i) => {
        if (i >= numSamples - props.prog.length) {
            const index = numSamples - i - 1;
            color = props.prog[index].color;
            imgSrc = props.prog[index].uncorrect ? 
                Emojis[props.prog[index].name] : EmojisCheck[props.prog[index].name];
            tooltip = props.prog[index].uncorrect ? 
                props.prog[index].uncorrectPercentage + "%" + props.tooltip_sentence : null;
            active = true;
        } else {
            color = '#aaaaaa';
            imgSrc = null;
            active = false;
        }
        return <ProgressBall key={i} active={active} tooltip={tooltip} color={color} imgSrc={imgSrc}/>
    });


    return (
        <div className={classes.Container}>
            {getColorBalls}
        </div>
    );
}

export default progress;