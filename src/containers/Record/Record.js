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
import ActivityOptions from '../../components/Navigation/ActivityOptions/ActivityOptions';


class Record extends Component {

    state = {
        index: 0,
        progress: [],
        sentences: [],
        isRecording: false,
        sampleUrl: '',
        newUser: false,
        showGuide: false,
        emotions: [],
        currentEmotion: '',
        content: {},
        alreadyRecordedSamples: [],
        checkFirstSentence: true
    }

    blob = null;

    componentDidMount () {

        axios.get('/api/sentences?quantity=20')
            .then(response => {
                this.setState({ sentences: response.data });
            });

        axios.get('/api/users/hassamples')
            .then(response => {
                this.setState({ 
                    newUser: response.data.newUser, 
                    showGuide: response.data.newUser,
                    alreadyRecordedSamples: response.data.samples
                });
            });
        
        axios.get('/api/data/emotions')
            .then(response => {
                const index = getRandomInt(response.data.length);
                this.setState({ 
                    currentEmotion: response.data[index],
                    emotions: response.data
                });
            });

        axios.get('/api/descriptions/record')
            .then(response => {
                const content = {};
                response.data.map(el => {
                    return content[el.position] = el.content;
                });
                this.setState({ content: content });
            });

    }

    componentDidUpdate () {

        if (this.state.checkFirstSentence &&
            this.state.sentences.length > 0 &&
            this.state.currentEmotion !== '' &&
            (this.state.newUser || this.state.alreadyRecordedSamples.length > 0)) {
                this.state.checkFirstSentence = false;
                this.changeSentence();
            }
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

        if (this.state.sentences.length < 1) return;

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
                this.state.alreadyRecordedSamples.push({
                    sentenceid: sentenceid,
                    emotion: emotion 
                });
                this.changeEmotion('random');
                this.setState({ 
                    sampleUrl: ''
                });
            })
            .catch(error => {
                console.log(error.message);
            });
    }

    checkTuple = (sentenceid, emotioncode) => {

        let result = this.state.alreadyRecordedSamples.filter(e => {
            return e.sentenceid === sentenceid && e.emotion === emotioncode;
        });
        return result.length > 0;

    }   

    changeSentence = () => {

        let idx = this.state.index;
        let exists;
        let newemotion;

        // TODO: casi limite, ci metterebbe un po' a trovare le tuple
        do {
            newemotion = null;
            if (idx < this.state.sentences.length - 1) {
                idx = idx + 1;
            } else {
                idx = 0;
            }
            exists = this.checkTuple(
                this.state.sentences[idx].id,
                this.state.currentEmotion.name
            );
            if (exists) {
                const ranidx = getRandomInt(this.state.emotions.length);
                newemotion = this.state.emotions[ranidx];
                exists = this.checkTuple(
                    this.state.sentences[idx].id,
                    newemotion.name
                );
            }
        } while (exists);
        
        if (newemotion) {
            this.setState({
                sampleUrl: '',
                index: idx,
                currentEmotion: newemotion
            });
        } else {
            this.setState({ 
                sampleUrl: '', 
                index: idx 
            });
        }

    }

    changeEmotion = (index) => {

        let idx;
        let newemotion;
        let exists;

        // TODO: casi limite, ci metterebbe un po' a trovare le tuple
        do {
            idx = this.state.index;
            if (index === 'random') {
                const idx = getRandomInt(this.state.emotions.length);
                newemotion = this.state.emotions[idx];
            } else {
                newemotion = this.state.emotions[index];
            }
            exists = this.checkTuple(
                this.state.sentences[idx].id,
                newemotion.name
            );
            if (exists) {
                if (idx < this.state.sentences.length - 1) {
                    idx = idx + 1;
                } else {
                    idx = 0;
                }
                exists = this.checkTuple(
                    this.state.sentences[idx].id,
                    newemotion.name
                );
            }
        } while(exists);

        if (idx !== this.state.index) {
            this.setState({
                currentEmotion: newemotion,
                showGuide: false,
                sampleUrl: '',
                index: idx
            });
        } else {
            this.setState({ 
                currentEmotion: newemotion,
                showGuide: false,
                sampleUrl: ''
            });
        }
    }

    toggleHelp = () => {
        this.setState({
            newUser: true
        });
    }

    render () {

        return (
            <div className={classes.Content}>
                {
                this.state.newUser ?
                    <GuideCard 
                        record
                        end={this.guideExecuted}/>
                    : 
                    this.state.progress.length === 5 ?
                    <TaskCompleted record/>
                    :
                    <div className={classes.Record}>
                        <ActivityOptions recLabel="Parla" evalLabel="Ascolta" />
                        <SentenceCard 
                            toggleHelp={this.toggleHelp}
                            new={this.state.showGuide}
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
                            guidetop={this.state.content['guide1-1of3']}
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
                                clicked={this.saveSample}
                                guide2_1of4={this.state.content['guide2-1of4']}
                                guide2_2of4={this.state.content['guide2-2of4']}
                                guide2_3of4={this.state.content['guide2-3of4']}
                                guide2_4of4={this.state.content['guide2-4of4']}
                            />
                        }
                    </div>
                }
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