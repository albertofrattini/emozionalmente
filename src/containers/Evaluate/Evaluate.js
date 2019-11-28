import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import SentenceCard from '../../components/SentenceCard/SentenceCard';
import ListenButton from '../../components/ListenButton/ListenButton';
import EvaluationButtons from '../../components/EvaluationButtons/EvaluationButtons';
import axios from 'axios';

class Evaluate extends Component {

    emotions = [
        "Happiness",
        "Sadness",
        "Fear",
        "Neutral",
        "Anger",
        "Surprise",
        "Disgust"
    ];

    state = {
        index: 0,
        progress: 0,
        sentences: [],
        isPlaying: false,
        emotionIndex: 0,
        sampleUrl: ''
    }

    componentDidMount () {

        axios.get('/api/data/samples')
            .then(response => {
                this.setState({ sentences: response.data });
            })
            .then(() => {
                const sentenceid = this.state.sentences[this.state.index].sentenceid;
                const timestamp = this.state.sentences[this.state.index].timestamp;
                this.setState({ sampleUrl: `/api/data/download?sentenceid=${sentenceid}&timestamp=${timestamp}` });
            });

    }

    changeSentence = () => {
        let currIndex = this.state.index;
        if (this.state.isPlaying) {
            document.getElementById('voicesample').pause();
        }
        if (currIndex < this.state.sentences.length - 1) {
            const sentenceid = this.state.sentences[currIndex + 1].sentenceid;
            const timestamp = this.state.sentences[currIndex + 1].timestamp;
            this.setState({ 
                isPlaying: false,
                index: currIndex + 1,
                sampleUrl: `/api/data/download?sentenceid=${sentenceid}&timestamp=${timestamp}`
            });
        } else {
            const sentenceid = this.state.sentences[0].sentenceid;
            const timestamp = this.state.sentences[0].timestamp;
            this.setState({ 
                isPlaying: false,
                index: 0,
                sampleUrl: `/api/data/download?sentenceid=${sentenceid}&timestamp=${timestamp}`
            });
        }
    }

    changeEmotion = (event) => {
        this.setState({ emotionIndex: event.target.id })
    }

    playOrPauseSample = () => {
        const isPlaying = this.state.isPlaying;
        if (isPlaying) {
            this.setState({ isPlaying: !isPlaying });
            document.getElementById('voicesample').pause();
        } else {
            this.setState({ isPlaying: !isPlaying });
            document.getElementById('voicesample').play();
        }
    }

    restorePlayButton = () => {
        this.setState({ isPlaying: false });
    }

    


    render () {

        console.log(this.state.sampleUrl);

        const audioFile = (
            <audio id="voicesample" onEnded={this.restorePlayButton}>
                <source src={this.state.sampleUrl} type={'audio/wav'}/>
            </audio>
        );

        return (
            <Aux>
                <SentenceCard 
                    sentence={ this.state.sentences.length > 0 ?
                        this.state.sentences[this.state.index].sentence
                        : 'Loading...'
                    } 
                    clicked={this.changeSentence}   
                />
                {this.state.sampleUrl === '' ?
                    null
                    :
                    audioFile
                }
                <ListenButton 
                    clicked={this.playOrPauseSample}
                    isPlaying={this.state.isPlaying}/>
                <EvaluationButtons 
                    emotion={this.emotions[this.state.emotionIndex]} 
                    over={this.changeEmotion.bind(this.state.emotionIndex)}/>
            </Aux>
        );
    }

}

export default Evaluate;


function createAudioElement(blobUrl) {
    const audioEl = document.createElement('audio');
    audioEl.controls = true;
    const sourceEl = document.createElement('source');
    sourceEl.src = blobUrl;
    sourceEl.type = 'audio/wav';
    audioEl.appendChild(sourceEl);
    document.body.appendChild(audioEl);
}