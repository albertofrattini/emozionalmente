import React, { Component } from 'react';
import classes from './Evaluate.css';
import SentenceCard from '../../components/SentenceCard/SentenceCard';
import ListenButton from '../../components/ListenButton/ListenButton';
import EvaluationButtons from '../../components/EvaluationButtons/EvaluationButtons';
import axios from 'axios';
import GuideCard from '../../components/GuideCard/GuideCard';

class Evaluate extends Component {

    state = {
        index: 0,
        progress: 0,
        sentences: [],
        emotions: [],
        isPlaying: false,
        emotionIndex: 0,
        sampleUrl: '',
        selectedEmotion: '',
        selectedReview: '',
        newUser: false
    }

    componentDidMount () {

        axios.get('/api/data/samples')
            .then(response => {
                this.setState({ sentences: response.data });
            });
            /*
            .then(() => {
                const sentenceid = this.state.sentences[this.state.index].sentenceid;
                const timestamp = this.state.sentences[this.state.index].timestamp;
                this.setState({ sampleUrl: `/api/data/download?sentenceid=${sentenceid}&timestamp=${timestamp}` });
            });*/
        
        axios.get('/api/users/hasevaluations')
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

    changeSentence = () => {
        let currIndex = this.state.index;
        if (this.state.isPlaying) {
            document.getElementById('voicesample').pause();
        }
        if (currIndex < this.state.sentences.length - 1) {
            // const sentenceid = this.state.sentences[currIndex + 1].sentenceid;
            // const timestamp = this.state.sentences[currIndex + 1].timestamp;
            this.setState({ 
                isPlaying: false,
                index: currIndex + 1,
                sampleUrl: `/api/data/download/${this.state.sentences[currIndex + 1].id}`
            });
        } else {
            // const sentenceid = this.state.sentences[0].sentenceid;
            // const timestamp = this.state.sentences[0].timestamp;
            this.setState({ 
                isPlaying: false,
                index: 0,
                sampleUrl: `/api/data/download/${this.state.sentences[0].id}`
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

    selectEmotion = (event) => {
        this.setState({ selectedEmotion: this.emotions[event.target.id] });
    }

    selectReview = (event) => {
        this.setState({ selectedReview: event.target.id });
    }


    render () {

        const audioFile = (
            <audio id="voicesample" onEnded={this.restorePlayButton}>
                <source src={this.state.sampleUrl} type={'audio/wav'}/>
            </audio>
        );

        return (
            <div className={classes.Content}>
                <div className={classes.Overlay}>
                    {this.state.newUser ?
                        <GuideCard end={this.guideExecuted}/>               
                        : null
                    }
                </div>
                <div className={classes.Evaluate}>
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
                        emotions={this.state.emotions}
                        emotion={ this.state.emotions.length > 0 ?
                            this.state.emotions[this.state.emotionIndex].emotion
                            : null
                        } 
                        over={this.changeEmotion.bind(this.state.emotionIndex)}
                        clickedemotion={this.selectEmotion}
                        clickedreview={this.selectReview}/>
                </div>
            </div>
        );
    }

}

export default Evaluate;


// function createAudioElement(blobUrl) {
//     const audioEl = document.createElement('audio');
//     audioEl.controls = true;
//     const sourceEl = document.createElement('source');
//     sourceEl.src = blobUrl;
//     sourceEl.type = 'audio/wav';
//     audioEl.appendChild(sourceEl);
//     document.body.appendChild(audioEl);
// }