import React, { Component } from 'react';
import classes from './Record.css';
import SentenceCard from '../../components/SentenceCard/SentenceCard';
import RecordButton from '../../components/RecordButton/RecordButton';
import StopButton from '../../components/StopButton/StopButton';
import CheckListen from '../../components/CheckListen/CheckListen';
import GuideCard from '../../components/GuideCard/GuideCard';
import TaskCompleted from '../../components/TaskCompleted/TaskCompleted';
import axios from 'axios';
import { startRecording, stopRecording } from '../../hoc/Recorder/Recorder';
import Aux from '../../hoc/Aux/Aux';


class Record extends Component {

    state = {
        index: 0,
        progress: [],
        sentences: [],
        isRecording: false,
        sampleUrl: '',
        newUser: false,
        emotions: [],
        currentEmotion: ''
    }

    blob = null;

    componentDidMount () {

        axios.get('/api/sentences?quantity=20')
            .then(response => {
                this.setState({ sentences: response.data });
            });

        axios.get('/api/users/hassamples')
            .then(response => {
                this.setState({ newUser: response.data.newUser });
            });
        
        axios.get('/api/data/emotions')
            .then(response => {
                const index = getRandomInt(response.data.length);
                this.setState({ 
                    currentEmotion: response.data[index],
                    emotions: response.data 
                });
            });

    }

    guideExecuted = () => {
        this.setState({ newUser: false });
    }

    startRecording = () => {

        if (this.state.sentences.length < 1) return;

        this.setState({ 
            isRecording: true,
            sampleUrl: ''
        });
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
        const emotion = this.state.currentEmotion.name;

        axios.post(
            `/api/data/samples?sentenceid=${sentenceid}&emotion=${emotion}`, 
            data
            )
            .then(() => {
                this.state.progress.push(this.state.currentEmotion);
                this.state.sentences.splice(this.state.index, 1);
                return this.setState({ 
                    sampleUrl: ''
                });
            })
            .catch(error => {
                console.log(error.message);
            });
    }

    changeSentence = () => {
        let idx = this.state.index;
        if (idx < this.state.sentences.length - 1) {
            idx = idx + 1;
        } else {
            idx = 0;
        }
        this.setState({ sampleUrl: '', index: idx });
    }

    changeEmotion = (index) => {
        const element = this.state.emotions[index];
        this.setState({ 
            currentEmotion: element
        });
    }

    render () {

        return (
            <Aux>
                {
                this.state.newUser ?
                    <GuideCard 
                        record
                        end={this.guideExecuted}/>
                    : 
                    this.state.progress === 5 ?
                    <TaskCompleted record/>
                    :
                    <div className={classes.Record}>
                        <SentenceCard 
                            sentence={this.state.sentences.length > 0 ? 
                                this.state.sentences[this.state.index].sentence
                                : 'Loading...'
                            } 
                            record
                            clicked={this.changeSentence}
                            emotions={this.state.emotions}
                            currentEmotion={this.state.currentEmotion}
                            change={this.changeEmotion}
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
                }
            </Aux>
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