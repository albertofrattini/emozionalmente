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
        let style = {};
        if (i >= numSamples - props.prog.length) {
            const index = numSamples - i - 1;
            color = props.prog[index].color;
            imgSrc = props.prog[index].uncorrect ? 
                Emojis[props.prog[index].name] : EmojisCheck[props.prog[index].name];
            let evaluations = "";
            if (props.evaluate) {
                if (props.prog[index].otherEvaluations.total === 0) {
                    tooltip = props.tooltip_first;
                    style.top = '-50%';
                } else {
                    evaluations += (props.tup + " " + props.prog[index].otherEvaluations.good + "%<br>");
                    evaluations += (props.tdown + " " + props.prog[index].otherEvaluations.bad + "%<br>");
                    props.emotions.map(e => {
                        return evaluations += (e.emotion + " " + props.prog[index].otherEvaluations[e.name] + "%<br>");
                    })
                    tooltip = props.tooltip_sentence + ":<br>" + evaluations;
                }
            }
            active = true;
        } else {
            color = '#aaaaaa';
            imgSrc = null;
            active = false;
        }
        return <ProgressBall key={i} active={active} tooltip={tooltip} style={style}
                                color={color} imgSrc={imgSrc}/>
    });


    return (
        <div className={classes.Container}>
            {getColorBalls}
        </div>
    );
}

export default progress;