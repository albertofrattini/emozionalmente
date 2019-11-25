import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import SentenceCard from '../../components/SentenceCard/SentenceCard';
import RecordButton from '../../components/RecordButton/RecordButton';
// import Progress from '../../components/Progress/Progress';
import CheckListen from '../../components/CheckListen/CheckListen';
import axios from 'axios';

function createAudioElement(blobUrl) {
    const downloadEl = document.createElement('a');
    downloadEl.style = 'display: block';
    downloadEl.innerHTML = 'download';
    downloadEl.download = 'audio.webm';
    downloadEl.href = blobUrl;
    const audioEl = document.createElement('audio');
    audioEl.controls = true;
    const sourceEl = document.createElement('source');
    sourceEl.src = blobUrl;
    sourceEl.type = 'audio/webm';
    audioEl.appendChild(sourceEl);
    document.body.appendChild(audioEl);
    document.body.appendChild(downloadEl);
}

class Record extends Component {

    startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();

                const audioChunks = [];

                mediaRecorder.addEventListener("dataavailable", event => {
                    audioChunks.push(event.data);
                });

                mediaRecorder.addEventListener("stop", () => {
                    const audioBlob = new Blob(audioChunks, {type: 'audio/webm'});
                    createAudioElement(URL.createObjectURL(audioBlob));
                    // const audioUrl = URL.createObjectURL(audioBlob);
                    // const audio = new Audio(audioUrl);
                    // let link = document.createElement('a');
                    // link.href = audioUrl;
                    // link.click();
                    // audio.play();
                    // URL.revokeObjectURL(audioUrl);
                });

                setTimeout(() => {
                    mediaRecorder.stop();
                }, 3000);
            });
    } 

    state = {
        index: 0,
        progress: 0,
        sentences: []
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
                {/* <Progress progNum={this.state.progress}/> */}
                <SentenceCard 
                    sentence={this.state.sentences.length > 0 ? 
                        this.state.sentences[this.state.index].sentence
                        : 'Loading...'
                    } 
                    clicked={this.changeSentence}
                    emotion={"Emotion"}    
                /> 
                <RecordButton clicked={this.startRecording}/>
                <CheckListen />
            </Aux>
        );
    }

}

export default Record;