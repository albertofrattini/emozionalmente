import React, { Component } from 'react';
import classes from './Evaluate.css';
import SentenceCard from '../../components/SentenceCard/SentenceCard';
import ListenButton from '../../components/ListenButton/ListenButton';
import EvaluationButtons from '../../components/EvaluationButtons/EvaluationButtons';
import axios from 'axios';
import GuideCard from '../../components/GuideCard/GuideCard';
import TaskCompleted from '../../components/TaskCompleted/TaskCompleted';

class Evaluate extends Component {

    state = {
        index: 0,
        progress: 0,
        samples: [],
        emotions: [],
        isPlaying: false,
        emotionIndex: 0,
        sampleUrl: '',
        selectedEmotion: '',
        selectedReview: '',
        newUser: false,
        hasAudio: false
    }

    componentDidMount () {

        axios.get('/api/data/samples?quantity=20')
            .then(response => {
                return this.setState({ samples: response.data });
            })
            .then(_ => {
                console.log(this.state.samples);
                axios.get(`/api/data/download/${this.state.samples[this.state.index].id}`)
                    .then(response => {
                        this.setState({ sampleUrl: response.data });
                    });
            });
        
        axios.get('/api/users/hasevaluations')
            .then(response => {
                this.setState({ newUser: response.data.newUser });
            });
        
        axios.get('/api/data/emotions')
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
            this.setState({ 
                isPlaying: false,
                index: currIndex + 1,
                sampleUrl: `/api/data/download/${this.state.samples[currIndex + 1].id}`
            });
        } else {
            this.setState({ 
                isPlaying: false,
                index: 0,
                sampleUrl: `/api/data/download/${this.state.samples[0].id}`
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

        console.log(this.state);

        const audioFile = (
            <audio id="voicesample" onEnded={this.restorePlayButton}>
                <source src={this.state.sampleUrl} type={'audio/wav'}/>
            </audio>
        );

        return (
            <div>
                {
                this.state.newUser ?

                    <GuideCard end={this.guideExecuted}/>
                    :
                    this.state.progress === 5 ?
                    <TaskCompleted />
                    :
                    <div className={classes.Content}>
                        <div className={classes.Evaluate}>
                            <SentenceCard 
                                sentence={ this.state.samples.length > 0 ?
                                    this.state.samples[this.state.index].sentence
                                    : 'Loading...'
                                } 
                                clicked={this.changeSentence}   
                            />
                            {this.state.hasAudio ?
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
                }
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