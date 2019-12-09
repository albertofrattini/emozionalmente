import React, { Component } from 'react';
import { MdPlayArrow, MdPause, MdDone } from 'react-icons/md';
import classes from './ListenButton.css';

class ListenButton extends Component {

    render () {

        return (
            <div className={classes.Box}>
                <div className={classes.Emotion}>{this.props.emotion}</div>
                <button className={classes.Listen} onClick={this.props.clicked}>
                    { this.props.isPlaying ?
                        <MdPause size="48px" color="var(--logo-violet)"/>
                        :
                        <MdPlayArrow size="48px" color="var(--logo-violet)"/>
                    }
                </button>
                <div className={classes.Review}>{this.props.review}</div>
                <button className={classes.Done} onClick={this.props.done}>
                    <MdDone size="48px" color="var(--greener)"/>
                </button>
            </div>
        );    
    }
}

export default ListenButton;