import React, { Component } from 'react';
import classes from './CheckListen.css';
import { MdPlayArrow, MdDone, MdPause } from 'react-icons/md';

class CheckListen extends Component {

    state = { isPlaying : false };

    context; analyser; canvas; ctx; audio; source;
    fbc_array; bars; bar_x; bar_width; bar_height; grd;

    componentDidMount () {
        this.context = new AudioContext();
        this.analyser = this.context.createAnalyser();
        this.canvas = document.getElementById('voicesignal');
        this.ctx = this.canvas.getContext('2d');
        this.grd = this.ctx.createLinearGradient(0, 0, 170, 0);
        this.grd.addColorStop(0, '#8c93d8');
        this.grd.addColorStop(1, '#89c8e5');
        this.audio = document.getElementById('voicesample');
        this.source = this.context.createMediaElementSource(this.audio);
        this.source.connect(this.analyser);
        this.analyser.connect(this.context.destination);
        this.frameLooper();
    }

    frameLooper = () => {
        window.requestAnimationFrame(this.frameLooper);
        this.fbc_array = new Uint8Array(this.analyser.frequencyBinCount);
        console.log('ciao', this.fbc_array.length);
        this.analyser.getByteFrequencyData(this.fbc_array);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.grd;
        this.bars = 1024;
        for (var i=0; i<this.bars; i+=2) {
            this.bar_x = i * 1;
            this.bar_width = 1;
            this.bar_height = -(this.fbc_array[i] / 4);
            this.ctx.fillRect(this.bar_x, this.canvas.height / 2 - 1, this.bar_width, this.bar_height);
            this.ctx.fillRect(this.bar_x, this.canvas.height / 2 + 1 , this.bar_width, -this.bar_height);
        }
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
                <button className={classes.Done} onClick={this.props.clicked}>
                    <MdDone size="48px" color="var(--greener)"/>
                </button>
            </div>
        );
    }
}

export default CheckListen;