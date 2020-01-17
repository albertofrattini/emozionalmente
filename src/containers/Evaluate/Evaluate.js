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
        progress: [],
        samples: [],
        emotions: [],
        isPlaying: false,
        emotionIndex: 0,
        sampleUrl: '',
        selectedEmotion: '',
        selectedReview: '',
        newUser: false
    }

    componentDidMount () {

        axios.get('/api/data/samples?quantity=20')
            .then(response => {
                this.setState({ samples: response.data });
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

    componentDidUpdate () {
        if (this.state.sampleUrl === '' && this.state.samples.length > 0) {
            this.setState({ 
                sampleUrl: '/api/data/download/' + this.state.samples[this.state.index].id 
            });
        }
    }

    guideExecuted = () => {
        this.setState({ newUser: false });
    }

    changeSentence = () => {
        let currIndex = this.state.index;
        if (currIndex < this.state.samples.length - 1) {
            currIndex = currIndex + 1;
        } else {
            currIndex = 0;
        }
        this.setState({ 
            isPlaying: false,
            index: currIndex,
            sampleUrl: ''
        });
    }

    postEvaluation = () => {

        if (this.state.selectEmotion === '' || this.state.selectedReview === '') return;

        this.saveEvaluation();

    }

    saveEvaluation = () => {

        const correct = this.state.selectedEmotion.toLowerCase() 
                        === this.state.samples[this.state.index].emotion;
        const quality = this.state.selectedReview.toLowerCase();
        const accuracy = correct ? 1 : 0.5;
        const sampleid = this.state.samples[this.state.index].id;

        const data = {
            sampleid: sampleid,
            correct: correct,
            quality: quality,
            accuracy: accuracy
        } 

        axios.post('/api/data/evaluations',
            data
            )
            .then(response => {
                console.log(response.data.message);
                const currentprogress = this.state.progress;
                this.state.samples.splice(this.state.index, 1);
                return this.setState({ 
                    sampleUrl: '',
                    progress: currentprogress + 1,
                    selectedEmotion: '',
                    selectedReview: ''
                });
            })
            .catch(error => {
                console.error(error);
            });
        
    }

    playOrPauseSample = () => {
        if (this.state.sampleUrl === '') return;
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

    selectEmotion = (emotion) => {
        this.setState({ selectedEmotion: emotion });
    }

    selectReview = (review) => {
        this.setState({ selectedReview: review });
    }


    render () {


        let audioFile = null;
        
        if (this.state.sampleUrl !== '') {
            audioFile = (
                <audio id="voicesample" onEnded={this.restorePlayButton}>
                <source src={this.state.sampleUrl} type={'audio/wav'}/>
            </audio>
            );
        }

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
                                evaluate
                                progress={this.state.progress} 
                            />
                            {this.state.sampleUrl === '' ?
                                null
                                :
                                audioFile
                            }
                            <ListenButton 
                                clicked={this.playOrPauseSample}
                                isPlaying={this.state.isPlaying}
                                clickedreview={this.selectReview}
                                done={this.postEvaluation}/>
                            <EvaluationButtons 
                                emotions={this.state.emotions}
                                clickedemotion={this.selectEmotion}/>
                        </div>
                    </div>
                }
            </div>
        );
    }

}

export default Evaluate;