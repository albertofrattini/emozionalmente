import React from 'react';
import ActionCard from './ActionCard/ActionCard';
import classes from './ActionCards.css';

const actionCards = (props) => (
    <div className={classes.ActionCards}>
        <ActionCard 
        title="Record"
        description="In this section you will be able to record your voice, giving the world
                    the possibility to analyze it and detect emotions out of it."/>
        <ActionCard 
        title="Evaluate"
        description="In this section you will be presented some voice samples expressing some
                    emotions and you will help us understand which emotion is present in it."/>
    </div>
);

export default actionCards;