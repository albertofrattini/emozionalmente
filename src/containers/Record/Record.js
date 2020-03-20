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
// import { convertToWav } from '../../hoc/Recorder/iRecorder';
import ActivityOptions from '../../components/Navigation/ActivityOptions/ActivityOptions';
import Loader from '../../components/UI/Loader/Loader';

// import '../../hoc/Recorder/p5.sound';
// import * as p5 from '../../hoc/Recorder/p5';


class Record extends Component {

    // constructor (props) {
    //     super(props);
    //     this.myRef = React.createRef();
    // }

    state = {
        isLoading: true,
        isUploading: false,
        index: 0,
        progress: [],
        sentences: [],
        isRecording: false,
        sampleUrl: '',
        newUser: false,
        showGuide: false,
        isHelpGuide: false,
        emotions: [],
        currentEmotion: '',
        content: {},
        toBeRecordedSamples: [],
        isTaskCompleted: false,
        noSentenceAvailable: false,
        isUnsupportedPlatform: false
    }

    blob = null;
    // mic = null;
    // recorder = null;
    // soundFile = null;

    async componentDidMount () {
        
        let isMicrophoneSupported = (navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        let isAudioRecordingSupported = typeof MediaRecorder !== 'undefined';
        if (!isAudioRecordingSupported || !isMicrophoneSupported) {
            this.setState({ isUnsupportedPlatform: true })
        } 
        let sentences = await axios.get('/api/sentences?quantity=20');
        let hassamples = await axios.get('/api/users/hassamples');
        let emotions = await axios.get('/api/data/emotions');
        let descriptions = await axios.get('/api/descriptions/record');
        const content = {};
        descriptions.data.map(e => {
            return content[e.position] = e.content;
        });
        this.setState({
            sentences: sentences.data,
            newUser: hassamples.data.newUser,
            showGuide: hassamples.data.newUser,
            toBeRecordedSamples: hassamples.data.samples,
            noSentenceAvailable: hassamples.data.samples.length === 0,
            isTaskCompleted: hassamples.data.samples.length === 0,
            emotions: emotions.data,
            content: content,
            isLoading: false
        });
        this.changeSentence();

        // this.myP5 = new p5(this.Sketch, this.myRef.current);

    }




    // Sketch = (p) => {

    //     p.setup = () => {
    //         p.createCanvas(window.innerWidth, window.innerHeight);
    //         this.mic = new p5.AudioIn();
    //     }

    //     p.start = () => {
    //         this.mic.start();
    //         this.recorder = new p5.SoundRecorder();
    //         this.recorder.setInput(this.mic);
    //         this.soundFile = new p5.SoundFile();
    //         this.recorder.record(this.soundFile);
    //     }

    //     p.stop = () => {
    //         this.recorder.stop();
    //     }
    // }






    guideExecuted = () => {
        this.setState({ newUser: false, isHelpGuide: false });
    }

    startRecording = () => {

        if (this.state.sentences.length < 1) return;

        // this.myRef.setup();
        // this.myRef.start();

        setTimeout(
            () => {
                this.setState({ 
                    isRecording: true,
                    sampleUrl: ''
                });
                startRecording();
            }, 100);

    } 

    stopRecording = async () => {

        let obj = await stopRecording();
        this.blob = obj.blob;
        const audioUrl = obj.url;
        // this.myRef.stop();
        // let view = convertToWav(this.soundFile);
        // let blob = new Blob([view], { type: 'audio/wav' });
        // const audioUrl = URL.createObjectURL(blob);
        this.setState({
            sampleUrl: audioUrl,
            isRecording: false
        });

    }

    saveSample = () => {

        if (this.state.sentences.length < 1) return;

        this.setState({ isUploading: true });

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
                this.state.toBeRecordedSamples = this.state.toBeRecordedSamples.filter(e => {
                    return !(e.sentenceid === sentenceid && e.emotion === emotion);
                });
                if (this.state.toBeRecordedSamples.length < 1) {
                    this.state.noSentenceAvailable = true;
                } else {
                    this.changeSentence();
                }
                if (this.state.progress.length === 5 || this.state.noSentenceAvailable) {
                    setTimeout(() => this.setState({ isTaskCompleted: true }), 2000);
                }
                this.setState({ 
                    sampleUrl: '',
                    isUploading: false
                });
            })
            .catch(error => {
                console.log(error.message);
            });
    }

    changeSentence = () => {

        let sentenceIndex;
        let currEmotion;

        const index = getRandomInt(this.state.toBeRecordedSamples.length);
        const newTuple = this.state.toBeRecordedSamples[index];
        this.state.sentences.filter((e, i) => {
            if (e.id === newTuple.sentenceid) {
                sentenceIndex = i;
            }
            return e;
        });
        const currEmotionArr = this.state.emotions.filter(e => {
            return e.name === newTuple.emotion;
        });
        if (currEmotionArr.length === 1) {
            currEmotion = currEmotionArr[0];
        } else {
            console.log('An error occured while retrieving the emotion...');
        }
        this.setState({
            sampleUrl: '',
            index: sentenceIndex,
            currentEmotion: currEmotion
        });
    }

    changeEmotion = (index) => {

        let newemotion;

        if (index === 'random') {
            const idx = getRandomInt(this.state.emotions.length);
            newemotion = this.state.emotions[idx];
        } else {
            newemotion = this.state.emotions[index];
        }

        const currentSentenceid = this.state.sentences[this.state.index].id;
        const isValid = this.state.toBeRecordedSamples.filter(e => {
            return e.sentenceid === currentSentenceid && e.emotion === newemotion.name;
        }).length > 0;

        if (isValid) {
            // Dopo aver cambiato l'emozione, la frase corrente non viene cambiata perchè
            // ancora da fare la registrazione con la nuova emozione e la vecchia frase.
            this.setState({
                currentEmotion: newemotion,
                showGuide: false,
                sampleUrl: ''
            });
        } else {
            // Cerco una frase diversa perchè quella attuale, cioè, la combinazione attuale scelta,
            // non è più disponibile. Guarda quali sono le tuple ancora disponibili con l'emozione
            // appena selezionata. Se ce ne sono, ne prende una a caso e aggiorna, se no...
            const tmpArr = this.state.toBeRecordedSamples.filter(e => {
                return e.emotion === newemotion.name;
            });
            if (tmpArr.length > 0) {
                const idx = getRandomInt(tmpArr.length);
                const newTuple = tmpArr[idx];
                let newSentenceIndex;
                this.state.sentences.filter((e, i) => {
                    if (e.id === newTuple.sentenceid) {
                        newSentenceIndex = i;
                    }
                    return e;
                });
                this.setState({
                    currentEmotion: newemotion,
                    showGuide: false,
                    sampleUrl: '',
                    index: newSentenceIndex
                });
            } else {
                // ... non ci sono più frasi da registrare con l'emozione che è stata selezionata,
                // quindi avvisa l'utente, così che possa scegliere un'altra emozione.
                alert('Hai già registrato tutte le frasi disponibili con quella emozione. Provane altre! :)');
            }
        }
    }

    toggleHelp = () => {
        this.setState({
            newUser: true,
            isHelpGuide: true
        });
    }

    render () {

        return (

            <React.Fragment>
                {
                    this.state.isLoading ?
                        <Loader pageLoading/>
                        :
                        <div className={classes.Content}>
                            {
                                this.state.isUploading ?
                                    <div className={classes.Uploading}>
                                        <Loader/>
                                    </div>
                                    :
                                    null
                            }
                            {
                                this.state.newUser && !this.state.isUnsupportedPlatform ?
                                <GuideCard 
                                record
                                end={this.guideExecuted}
                                help={this.state.isHelpGuide}/>
                                : 
                                this.state.isTaskCompleted ?
                                <TaskCompleted record
                                    noSentenceAvailable={this.state.noSentenceAvailable}/>
                                :
                                this.state.isUnsupportedPlatform ?
                                <div className={classes.Record}>
                                    <ActivityOptions 
                                        recLabel={this.state.content['options-rec-label']} 
                                        evalLabel={this.state.content['options-eval-label']} />
                                        La piattaforma in uso non è attulamente supportata. Puoi utilizzare Chrome o Firefox su computer desktop.
                                </div>
                                :
                                <div className={classes.Record}>
                                    <ActivityOptions 
                                        recLabel={this.state.content['options-rec-label']} 
                                        evalLabel={this.state.content['options-eval-label']} />
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
                                        guidetop={this.state.content['guide1']}
                                        nextbtn={this.state.content['next-btn']}
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
                }       
            </React.Fragment>
        );
    }

}

export default Record;


function getRandomInt(max) {
    var min = 0;
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}