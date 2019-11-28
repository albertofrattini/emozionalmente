import React, { Component } from 'react';
import { MdPlayArrow, MdPause } from 'react-icons/md';
import classes from './ListenButton.css';

class ListenButton extends Component {

    render () {

        return (
            <div className={classes.Box}>
                <button className={classes.Listen} onClick={this.props.clicked}>
                    { this.props.isPlaying ?
                        <MdPause size="48px" color="var(--logo-violet)"/>
                        :
                        <MdPlayArrow size="48px" color="var(--logo-violet)"/>
                    }
                </button>
            </div>
        );    
    }
}

export default ListenButton;