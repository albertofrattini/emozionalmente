import React from 'react';
import ProgressBall from './ProgressBall/ProgressBall';
import classes from './Progress.css';
import { FaSadCry, FaMeh, FaSmile, FaSmileBeam, FaGrinBeam, FaGrinHearts } from 'react-icons/fa';

const progress = (props) => {

    let active = false;

    const numSamples = 5;

    let getColorBalls = [...Array( numSamples + 1 )].map( (_, i) => {
        if (i === 0) {
            switch (props.progNum) {
                case 1:
                    return <FaMeh key={i} size="40px" color="var(--bluer)"/>;
                case 2:
                    return <FaSmile key={i} size="40px" color="var(--bluer)"/>;
                case 3:
                    return <FaSmileBeam key={i} size="40px" color="var(--bluer)"/>;
                case 4:
                    return <FaGrinBeam key={i} size="40px" color="var(--bluer)"/>;
                case 5:
                    return <FaGrinHearts key={i} size="40px" color="var(--bluer)"/>;
                default:
                    return <FaSadCry key={i} size="40px" color="var(--bluer)"/>;

            }  
        }
        if (i > numSamples - props.progNum) {
            active = true;
        } else {
            active = false;
        }
        return <ProgressBall key={i} active={active}/>
    });

    return (
        <div className={classes.Container}>
            {getColorBalls}
        </div>
    );
}

export default progress;