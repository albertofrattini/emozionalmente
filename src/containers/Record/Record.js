import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import SentenceCard from '../../components/SentenceCard/SentenceCard';
import RecordButton from '../../components/RecordButton/RecordButton';
import StopButton from '../../components/StopButton/StopButton';
import CheckListen from '../../components/CheckListen/CheckListen';
import axios from 'axios';
// import Encoder from '../../hoc/WavEncoder/WavEncoder'; 
import { startRecording, stopRecording } from '../../hoc/Recorder/Recorder';


class Record extends Component {

    state = {
        index: 0,
        progress: 0,
        sentences: [],
        isRecording: false,
        sampleUrl: '',
    }

    mediaRecorder;
    audioChunks;
    blobUrl;
    audioType = 'audio/webm';
    audioBlob;

    startRecording = () => {

        this.setState({ isRecording: true });
        startRecording();
        
        // navigator.mediaDevices.getUserMedia({ audio: true })
        //     .then(stream => {
        //         this.mediaRecorder = new MediaRecorder(stream);
        //         this.audioChunks = [];
        //         this.setState({ isRecording: true });
        //         this.mediaRecorder.ondataavailable = event => {
        //             this.audioChunks.push(event.data);
        //         }
        //         this.mediaRecorder.addEventListener("stop", () => {
        //             // this.audioBlob = new Blob(this.audioChunks, { type: this.audioType });
        //             // const audioUrl = URL.createObjectURL(this.audioBlob);
        //             this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        //             this.audioBlob.arrayBuffer().then( buffer => {
        //                 const res = toBuffer(buffer);
        //                 console.log(buffer);
        //                 console.log(res.length);
        //                 const encoder = new Encoder(44100, 2);
        //                 encoder.encode(res);
        //                 const blob = encoder.finish();
        //                 const audioUrl = URL.createObjectURL(blob);
        //                 createAudioElement(audioUrl);
        //                 this.setState({
        //                     sampleUrl: audioUrl,
        //                     isRecording: false
        //                 });
        //             });
        //         });
        //         this.mediaRecorder.start();
        //     });

    } 

    stopRecording = () => {

        const blob = stopRecording();
        const audioUrl = URL.createObjectURL(blob);
        this.setState({
            sampleUrl: audioUrl,
            isRecording: false
        });

        // this.mediaRecorder.stop();
    }

    saveSample = () => {

        let data = new FormData();
        data.append('audio', this.audioBlob);

        const sentenceid = this.state.sentences[this.state.index].id;
        // TODO: how do we choose the emotion?
        const emotion = 'disgust';

        axios.post(
            `/api/data/samples?sentenceid=${sentenceid}&emotion=${emotion}`, 
            data
            )
            .then(response => {
                console.log(response.data.message);
                const currentprogress = this.state.progress;
                this.setState({ 
                    sampleUrl: '',
                    progress: currentprogress + 1
                });
                // TODO: delete sentence just recorded.
                this.changeSentence();
            })
            .catch(error => {
                console.log(error.message);
            });
    }

    componentDidMount () {  

        axios.get('/api/data/sentences?quantity=4')
            .then(response => {
                this.setState({
                    sentences: response.data,
                });
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

    render () {
        return (
            <Aux>
                <SentenceCard 
                    sentence={this.state.sentences.length > 0 ? 
                        this.state.sentences[this.state.index].sentence
                        : 'Loading...'
                    } 
                    clicked={this.changeSentence}
                    emotion={"Emotion"}  
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
            </Aux>
        );
    }

}

export default Record;

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