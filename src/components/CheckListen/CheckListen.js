import React, { Component } from 'react';
import classes from './CheckListen.css';
import { MdPlayArrow, MdDone, MdPause } from 'react-icons/md';
import { createAnalyser, killWave } from '../UI/AudioWave/AudioWave';

class CheckListen extends Component {


    state = { isPlaying : false };

    componentDidMount () {
        createAnalyser();
    }

    playOrPauseSample = () => {
        const isPlaying = this.state.isPlaying;
        if (isPlaying) {
            document.getElementById('voicesample').pause();
            this.setState({ isPlaying: false });
        } else {
            document.getElementById('voicesample').play();
            this.setState({ isPlaying: true });
        }
    }

    restorePlayButton = () => {
        this.setState({ isPlaying: false });
    }

    done = () => {
        this.props.clicked();
        killWave();
    }


    render () {

        return (
            <div className={classes.Options}>
                <button className={classes.Play} onClick={this.playOrPauseSample}>
                    {this.state.isPlaying ?
                        <MdPause size="48px" color="var(--bluer)"/>
                        :
                        <MdPlayArrow size="48px" color="var(--bluer)"/>
                    }
                </button>
                <canvas id="voicesignal" className={classes.Signal}>
                    <audio id="voicesample" onEnded={this.restorePlayButton}>
                        <source src={this.props.sampleUrl} type={this.props.type}/>
                    </audio>
                </canvas>
                <button className={classes.Done} onClick={this.done}>
                    <MdDone size="48px" color="var(--greener)"/>
                </button>
            </div>
        );
    }
}

export default CheckListen;