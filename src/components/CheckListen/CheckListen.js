import React, { Component } from 'react';
import classes from './CheckListen.css';
import { MdPlayArrow, MdDone, MdPause, MdMic } from 'react-icons/md';
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
                <div className={classes.TopInstruction}>
                    {this.props.guide2_1of4}
                    <MdPlayArrow size="24px" color="var(--bluer)" style={{ margin: '0px 8px' }}/>
                    {this.props.guide2_2of4}
                    <MdDone size="24px" color="var(--greener)" style={{ margin: '0px 8px' }}/>
                    {this.props.guide2_3of4}
                    <MdMic size="24px" color="var(--logo-red)" style={{ margin: '0px 8px' }}/>
                    {this.props.guide2_4of4}
                </div>
                <button className={classes.Play} onClick={this.playOrPauseSample}>
                    {this.state.isPlaying ?
                        <MdPause size="56px" color="var(--bluer)"/>
                        :
                        <MdPlayArrow size="56px" color="var(--bluer)"/>
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