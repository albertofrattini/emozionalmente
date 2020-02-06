import React from 'react';
import classes from './CurrentDatabase.css';
import safety from '../../assets/images/safety.png';
import deepLearning from '../../assets/images/deep-learning.png';

const currentDatabase = (props) => {

    return (
        <div className={classes.CurrentDatabase}>
            <div className={classes.Container}>
                <img src={safety} alt="safety"/>
                <div className={classes.TextRight}
                    dangerouslySetInnerHTML={{
                        __html: props.safety
                    }}></div>
            </div>
            <div className={classes.ContainerReverse}>
                <img src={deepLearning} alt="safety"/>
                <div className={classes.TextLeft}
                    dangerouslySetInnerHTML={{
                        __html: props.deepLearning
                    }}></div>
            </div>
        </div>
    );
}

export default currentDatabase;