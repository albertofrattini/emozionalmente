import React, { Component } from 'react';
import classes from './Record.css';
import SentenceCard from '../../components/SentenceCard/SentenceCard';
import RecordButton from '../../components/RecordButton/RecordButton';
import StopButton from '../../components/StopButton/StopButton';
import CheckListen from '../../components/CheckListen/CheckListen';
import GuideCard from '../../components/GuideCard/GuideCard';
import axios from 'axios';
import { startRecording, stopRecording } from '../../hoc/Recorder/Recorder';


class Record extends Component {

    state = {
        index: 0,
        progress: 0,
        sentences: [],
        isRecording: false,
        sampleUrl: '',
        newUser: false,
        emotions: [],
        currentEmotion: 'none',
        recordingAvailable: false
    }

    blob = null;

    componentDidMount () {  

        axios.get('/api/sentences?quantity=4')
            .then(response => {
                this.setState({ sentences: response.data });
            });

        axios.get('/api/users/hassamples')
            .then(response => {
                this.setState({ newUser: response.data.newUser });
            });
        
        axios.get('/api/data/emotions?lang=it')
            .then(response => {
                this.setState({ emotions: response.data });
            });

    }

    guideExecuted = () => {
        this.setState({ newUser: false });
    }

    startRecording = () => {

        if (!this.state.recordingAvailable) return;
        this.setState({ isRecording: true });
        startRecording();

    } 

    stopRecording = () => {

        this.blob = stopRecording();
        const audioUrl = URL.createObjectURL(this.blob);
        this.setState({
            sampleUrl: audioUrl,
            isRecording: false
        });

    }

    saveSample = () => {

        let data = new FormData();
        data.append('audio', this.blob);

        const sentenceid = this.state.sentences[this.state.index].id;
        const emotion = this.state.currentEmotion.toLowerCase();

        axios.post(
            `/api/data/samples?sentenceid=${sentenceid}&emotion=${emotion}`, 
            data
            )
            .then(response => {
                console.log(response.data.message);
                const currentprogress = this.state.progress;
                this.state.sentences.splice(this.state.index, 1);
                return this.setState({ 
                    sampleUrl: '',
                    progress: currentprogress + 1
                });
            })
            .catch(error => {
                console.log(error.message);
            });
    }

    changeSentence = () => {
        let currIndex = this.state.index;
        if (currIndex < this.state.sentences.length - 1) {
            this.setState({index: currIndex + 1});
        } else {
            this.setState({index: 0});
        }
    }

    changeEmotion = (event) => {
        if (event.target.value === 'random') {
            const index = getRandomInt(this.state.emotions.length);
            this.setState({ 
                currentEmotion: this.state.emotions[index].emotion,
                recordingAvailable: true,
            })
        } else if (event.target.value === 'none'){
            this.setState({ 
                recordingAvailable: false,
                currentEmotion: 'none'
            });
        } else {
            this.setState({ 
                currentEmotion: event.target.value,
                recordingAvailable: true
            });
        }
    }

    render () {

        return (
            <div className={classes.Content}>
                <div className={classes.Overlay}>
                    {this.state.newUser ?
                        <GuideCard 
                            record
                            end={this.guideExecuted}/>
                        : null
                    }
                </div>
                <div className={classes.Record}>
                    <SentenceCard 
                        sentence={this.state.sentences.length > 0 ? 
                            this.state.sentences[this.state.index].sentence
                            : 'Loading...'
                        } 
                        record
                        clicked={this.changeSentence}
                        emotions={this.state.emotions}
                        change={this.changeEmotion}
                        emotion={this.state.currentEmotion}  
                        progress={this.state.progress}  
                    /> 
                    {this.state.isRecording ? 
                        <StopButton clicked={this.stopRecording}/>
                        :
                        <RecordButton clicked={this.startRecording}/>
                    }
                    {this.state.sampleUrl === '' ?
                        null
                        :
                        <CheckListen 
                            sampleUrl={this.state.sampleUrl}
                            type={this.audioType}
                            clicked={this.saveSample}/>
                    }
                </div>
            </div>
        );
    }

}

export default Record;


function getRandomInt(max) {
    var min = 0;
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

// function createAudioElement(blobUrl) {
//     const downloadEl = document.createElement('a');
//     downloadEl.style = 'display: block';
//     downloadEl.innerHTML = 'download';
//     downloadEl.download = 'audio.wav';
//     downloadEl.href = blobUrl;
//     const audioEl = document.createElement('audio');
//     audioEl.controls = true;
//     const sourceEl = document.createElement('source');
//     sourceEl.src = blobUrl;
//     sourceEl.type = 'audio/wav';
//     audioEl.appendChild(sourceEl);
//     document.body.appendChild(audioEl);
//     document.body.appendChild(downloadEl);
// }