import React, { Component } from 'react';
import { MdPlayArrow, MdPause, /*MdDone*/ } from 'react-icons/md';
import ThumbsDown from '../../assets/images/thumb-down.png';
import ThumbsUp from '../../assets/images/thumb-up.png';
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
                    <img src={ThumbsDown} alt="thumbsdown" />
                </div>
                <button className={classes.Listen} onClick={this.props.clicked} >
                    { this.props.isPlaying ?
                        <MdPause id="pausebtn" size="56px" color="var(--logo-violet)"/>
                        :
                        <MdPlayArrow id="playbtn" size="56px" color="var(--logo-violet)"/>
                    }
                </button>
                <div className={classes.ReviewCard} onClick={() => this.props.clickedreview('good')}>
                    <img src={ThumbsUp} alt="thumbsup" />
                </div>
                {/* <button className={classes.Done} onClick={this.props.done}>
                    <MdDone size="48px" color="var(--greener)"/>
                </button> */}
            </div>
        );    
    }
}

export default ListenButton;