import React from 'react';
import classes from './ActionImages.css';
import recordImg from '../../../assets/images/home-record.jpg';
import evaluateImg from '../../../assets/images/home-evaluate.jpg';

const actionImages = (props) => (
    <div className={classes.ActionImages}>
        <img src={recordImg} alt="Record"></img>
        <img src={evaluateImg} alt="Evaluate"></img>
    </div>    
);

export default actionImages;