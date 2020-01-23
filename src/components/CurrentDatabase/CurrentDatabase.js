import React from 'react';
import classes from './CurrentDatabase.css';
import safety from '../../assets/images/safety.png';
import deepLearning from '../../assets/images/deep-learning.png';

const currentDatabase = (props) => (
    <div className={classes.CurrentDatabase}>
        <div className={classes.Container}>
            <img src={safety} alt="safety"/>
            <div className={classes.Text} style={{ textAlign: 'right' }}
                dangerouslySetInnerHTML={{
                    __html: props.safety
                }}></div>
        </div>
        <div className={classes.Container}>
            <div className={classes.Text} style={{ textAlign: 'left' }}
                dangerouslySetInnerHTML={{
                    __html: props.deepLearning
                }}></div>
            <img src={deepLearning} alt="safety"/>
        </div>
    </div>
);

export default currentDatabase;
            // <div className={classes.Card}>
            //     <BubbleChart width="400"/>
            // </div>
            // <div className={classes.Text}>
            //     <h1>{props.title}</h1>
            //     <p>{props.subtitle}</p>
            // </div>