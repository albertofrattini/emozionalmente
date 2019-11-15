import React from 'react';
import classes from './IntroductionAndData.css';

const introductionAndData = (props) => (
    <div className={classes.IntroductionAndData}>
        <div className={classes.Element}>
            <div className={classes.Description}>
                <h1>Descrizione del primo grafico</h1>
                <p>Parliamo un po' del primo grafico e di cose facciamo per passare il tempo</p>
            </div>
            <div className={classes.Graph}>
            </div>
        </div>
        <div className={classes.Element}>
            <div className={classes.Description}>
                <h1>Descrizione del primo grafico</h1>
                <p>Parliamo un po' del primo grafico e di cose facciamo per passare il tempo</p>
            </div>
            <div className={classes.Graph}>
            </div>
        </div>
    </div>
);

export default introductionAndData;