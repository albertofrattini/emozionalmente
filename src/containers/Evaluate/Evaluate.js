import React, { Component } from 'react';
import classes from './Evaluate.css';
import SentenceCard from '../../components/SentenceCard/SentenceCard';
import ListenButton from '../../components/ListenButton/ListenButton';
import EvaluationButtons from '../../components/EvaluationButtons/EvaluationButtons';
import axios from 'axios';
import GuideCard from '../../components/GuideCard/GuideCard';
import TaskCompleted from '../../components/TaskCompleted/TaskCompleted';
import ActivityOptions from '../../components/Navigation/ActivityOptions/ActivityOptions';

class Evaluate extends Component {

    state = {
        index: 0,
        progress: [],
        samples: [],
        emotions: [],
        isPlaying: false,
        emotionIndex: 0,
        sampleUrl: '',
        selectedEmotion: null,
        selectedReview: '',
        newUser: false,
        showGuide: false,
        reviewArrow: false,
        emotionsArrow: false,
        content: {},
        evaluationModal: false,
        evaluationResult: null,
        chosenEmotion: ''
    }

    componentDidMount () {

        axios.get('/api/data/samples?quantity=20')
            .then(response => {
                this.setState({ samples: response.data });
            });
        
        axios.get('/api/users/hasevaluations')
            .then(response => {
                this.setState({ 
                    newUser: response.data.newUser,
                    showGuide: response.data.newUser
                });
            });
        
        axios.get('/api/data/emotions')
            .then(response => {
                this.setState({ emotions: response.data });
            });

        axios.get('/api/descriptions/evaluate')
            .then(response => {
                const content = {};
                response.data.map(el => {
                    return content[el.position] = el.content;
                });
                this.setState({ content: content });
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
            sampleUrl: '',
            selectedEmotion: null,
            selectedReview: ''
        });
    }

    postEvaluation = () => {

        if (this.state.selectEmotion === null || 
            this.state.selectedReview === '' ||
            this.state.samples.length < 1) return;

        this.saveEvaluation();

    }

    saveEvaluation = () => {

        if (this.state.samples.length < 1) return;

        const sample = this.state.samples[this.state.index];

        const emotion = this.state.selectedEmotion.name;
        const correct = emotion === sample.emotion;
        this.setState({ 
            evaluationModal: true,
            evaluationResult: correct,
            chosenEmotion: emotion
        });
        const quality = this.state.selectedReview.toLowerCase();
        const sampleid = sample.id;

        const data = {
            sampleid: sampleid,
            correct: correct,
            quality: quality,
            emotion: emotion
        } 

        axios.post('/api/data/evaluations',
            data
            )
            .then(response => {
                console.log(response.data.message);
                this.state.progress.push(this.state.selectedEmotion);
                this.state.samples.splice(this.state.index, 1);
                return this.setState({ 
                    sampleUrl: '',
                    selectedEmotion: null,
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
            this.setState({ 
                isPlaying: !isPlaying,
                reviewArrow: true
            });
            document.getElementById('voicesample').pause();
        } else {
            var playPromise = document.getElementById('voicesample').play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    this.setState({ isPlaying: !isPlaying });
                })  
                .catch(error => {
                    console.log(error);
                });
            }

        }
    }

    restorePlayButton = () => {
        this.setState({ 
            isPlaying: false,
            reviewArrow: true
        });
    }

    selectEmotion = (element) => {
        this.setState({ 
            selectedEmotion: element,
            emotionsArrow: false
        });
    }

    selectReview = (review) => {
        this.setState({ 
            selectedReview: review,
            reviewArrow: false,
            emotionsArrow: true
        });
    }

    toggleHelp = () => {
        this.setState({
            newUser: true
        });
    }


    render () {


        let audioFile = null;
        let modal = null;


        if (this.state.evaluationModal) {
            setTimeout(() => {
                this.setState({ evaluationModal: false, evaluationResult: null })
            }, 4000);
            if (this.state.evaluationResult) {
                modal = (
                    <div className={classes.Modal}>
                        <div className={classes.EvaluationCard}>
                            You got it right, the speaker wanted to express Emotion!
                        </div>
                    </div>
                );
            } else {
                modal = (
                    <div className={classes.Modal}>
                        <div className={classes.EvaluationCard}>
                            You didn't catch which emotion the speaker wanted to express... that's fine, other Percentage said the same as you!
                        </div>
                    </div>
                );
            }
        }
        
        if (this.state.sampleUrl !== '') {
            audioFile = (
                <audio id="voicesample" onEnded={this.restorePlayButton}>
                    <source src={this.state.sampleUrl} type={'audio/wav'}/>
                </audio>
            );
        }

        return (
            <div>
                {modal}
                {
                this.state.newUser ?

                    <GuideCard end={this.guideExecuted}/>
                    :
                    this.state.progress.length === 5 ?
                    <TaskCompleted />
                    :
                    <div className={classes.Evaluate}>
                        <ActivityOptions recLabel="Parla" evalLabel="Ascolta" />
                        <SentenceCard 
                            toggleHelp={this.toggleHelp}
                            new={this.state.newUser}
                            sentence={ this.state.samples.length > 0 ?
                                this.state.samples[this.state.index].sentence
                                : 'Loading...'
                            } 
                            evaluate
                            hasevaluation={this.state.selectedEmotion !== null 
                                &&
                                this.state.selectedReview !== '' ?
                                true : false
                            }
                            done={this.postEvaluation}
                            currentEmotion={this.state.selectedEmotion}
                            currentReview={this.state.selectedReview}
                            clicked={this.changeSentence}  
                            progress={this.state.progress} 
                            guide1_1of2={this.state.content['guide1-1of4']}
                            guide1_2of2={this.state.content['guide1-2of4']}
                            guide2_1of2={this.state.content['guide2-1of2']}
                            guide2_2of2={this.state.content['guide2-2of2']}
                        />
                        {this.state.sampleUrl === '' ?
                            null
                            :
                            audioFile
                        }
                        <ListenButton 
                            selected={this.state.selectedReview}
                            clicked={this.playOrPauseSample}
                            isPlaying={this.state.isPlaying}
                            clickedreview={this.selectReview}
                            showGuide={this.state.reviewArrow && this.state.showGuide}
                            tdown={this.state.content['review-tdown']}
                            tup={this.state.content['review-tup']}
                        />
                        <EvaluationButtons 
                            selected={this.state.selectedEmotion ? this.state.selectedEmotion.name : null}
                            showGuide={this.state.emotionsArrow && this.state.showGuide}
                            emotions={this.state.emotions}
                            clicked={this.selectEmotion}
                        />
                    </div>
                }
            </div>
        );
    }

}

export default Evaluate;