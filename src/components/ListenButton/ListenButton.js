import React, { Component } from 'react';
import { MdPlayArrow, MdPause } from 'react-icons/md';
import { FiThumbsDown, FiThumbsUp } from 'react-icons/fi';
import classes from './ListenButton.css';

class ListenButton extends Component {

    hoverColor = () => {
        if (this.props.isPlaying) {
            document.getElementById('pausebtn').style.color = 'white';
        } else {
            document.getElementById('playbtn').style.color = 'white';
        }
    }

    leaveColor = () => {
        if (this.props.isPlaying) {
            document.getElementById('pausebtn').style.color = 'var(--logo-violet)';
        } else {
            document.getElementById('playbtn').style.color = 'var(--logo-violet)';
        }
    }

    render () {

        return (
            <div className={classes.Box}>
                <div className={classes.ReviewCard} onClick={() => this.props.clickedreview('bad')}>
                    <FiThumbsDown size="28px" color="var(--logo-red)"/>
                    <span>{this.props.tdown}</span>
                </div>
                <button className={classes.Listen} onClick={this.props.clicked} >
                    { this.props.isPlaying ?
                        <MdPause id="pausebtn" size="56px" color="var(--logo-violet)"/>
                        :
                        <MdPlayArrow id="playbtn" size="56px" color="var(--logo-violet)"/>
                    }
                </button>
                <div className={classes.ReviewCard} onClick={() => this.props.clickedreview('good')}>
                    <FiThumbsUp size="28px" color="var(--greener)"/>
                    <span>{this.props.tup}</span>
                </div>
            </div>
        );    
    }
}

export default ListenButton;