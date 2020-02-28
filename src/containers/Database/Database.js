import React, { Component } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import classes from './Database.css';
import axios from 'axios';
import { MdMic, MdPlayArrow } from 'react-icons/md';

class Database extends Component {

    state = {
        loggedin: false,
        username: null,
        userContribution: null,
        data: null,
        accuracy: 0,
        maxValue: 0,
        percentage: 0,
        mainEmotion: null,
        recognizedEmotion: null,
        emotions: [],
        showUpEmotionModal: false,
        showDownEmotionModal: false
    }

    componentDidMount () {

        axios.get('/api/users/loggedin')
            .then(response => {
                const username = response.data.user.username;
                this.setState({
                    loggedin: username !== null
                });
                if (username) {
                    axios.get('/api/users/contribution')
                        .then(response => {
                            this.setState({
                                userContribution: response.data
                            })
                        });
                }
            })

        axios.get('/api/data/database')
            .then(response => {
                let max = 0;
                [...Object.keys(response.data)].map((el, _) => {
                    const value = parseInt(response.data[el].value, 10);
                    if (value > max) {
                        max = value;
                    }
                    return null;
                });
                this.setState({ 
                    data: response.data,
                    maxValue: max
                });
            });

        axios.get('/api/data/emotions')
            .then(response => {

                const currEm = response.data[0];
                this.setState({ 
                    mainEmotion: currEm,
                    recognizedEmotion: currEm,
                    emotions: response.data 
                });

                axios.get(`/api/data/comparison?first=${currEm.name}&second=${currEm.name}`)
                    .then(response => {
                        this.setState({ percentage: parseInt(response.data.value, 10) });
                    });

                axios.get('/api/data/accuracy')
                    .then(response => {
                        this.setState({ accuracy: parseInt(response.data.value, 10) });
                    });
            });

        

    }

    changeUpEmotion = (index) => {
        axios.get(`/api/data/comparison?first=${this.state.emotions[index].name}&second=${this.state.recognizedEmotion.name}`)
                    .then(response => {
                        this.setState({ 
                            percentage: parseInt(response.data.value, 10),
                            mainEmotion: this.state.emotions[index],
                            showUpEmotionModal: false
                        });
                    });
    }

    changeDownEmotion = (index) => {
        axios.get(`/api/data/comparison?first=${this.state.mainEmotion.name}&second=${this.state.emotions[index].name}`)
                    .then(response => {
                        this.setState({ 
                            percentage: parseInt(response.data.value, 10),
                            recognizedEmotion: this.state.emotions[index],
                            showDownEmotionModal: false
                        });
                    });
    }

    render () {

        let modalUp = null;
        let modalDown = null;

        if (this.state.showUpEmotionModal) {

            let emotionsModal = this.state.emotions.length > 0 ?
                this.state.emotions.map((el, i) => {
                    return <span key={i} style={{ color: el.color }}
                        onClick={() => this.changeUpEmotion(i)}>{el.emotion}</span>
                })
                : null;

            modalUp = (
                <div className={classes.EmotionsModal}>
                    <div className={classes.EmotionsList}>
                        {emotionsModal}
                    </div>
                </div>
            );
        }

        if (this.state.showDownEmotionModal) {

            let emotionsModal = this.state.emotions.length > 0 ?
                this.state.emotions.map((el, i) => {
                    return <span key={i} style={{ color: el.color }}
                        onClick={() => this.changeDownEmotion(i)}>{el.emotion}</span>
                })
                : null;

            modalDown = (
                <div className={classes.EmotionsModal}>
                    <div className={classes.EmotionsList}>
                        {emotionsModal}
                    </div>
                </div>
            );
        }

        let dataBlocks = this.state.data ?
            [...Object.keys(this.state.data)].map((el, i) => {
                const height = (this.state.data[el].value * 220) / this.state.maxValue;
                return (
                    <div key={i} className={classes.BlockContainer}>
                        {this.state.data[el].value}
                        <div key={i} className={classes.Block}>
                            <div className={classes.BlockText}>
                                {this.state.data[el].content}
                            </div>
                            <div className={classes.Data} style={{ height: height + 'px' }}>
                            </div>
                        </div>
                    </div>
                );
            })
            : 
            null;
            
        let accuracyData = (
            <div className={classes.Column}>
                <div className={classes.Percentage} style={{ color: 'var(--logo-orange)' }}>
                    {this.state.accuracy}%
                </div>
                <CircularProgressbar value={this.state.accuracy}
                    styles={{
                        path: {
                            stroke: 'var(--logo-orange)',
                        },
                        trail: {
                            stroke: 'var(--logo-orange)',
                            opacity: '0.2'
                        }
                    }}>
                </CircularProgressbar>
            </div>
        );

        let querySelectors = (
            <div className={classes.Column} style={{ color: 'var(--text-dark)' }}>
                {modalUp}
                {modalDown}
                {
                    this.state.mainEmotion === null ||
                    this.state.recognizedEmotion === null ? 
                        null : 
                        <React.Fragment>
                            <div className={classes.ButtonSelector} 
                                onClick={() => this.setState({ showUpEmotionModal: true })}>
                                    {this.state.mainEmotion.emotion}
                            </div>
                            <div style={{ fontSize: '15px', textAlign: 'center', lineHeight: '1.63' }}>
                                Samples expressing {this.state.mainEmotion.emotion} that have
                                been recognized as {this.state.recognizedEmotion.emotion}
                            </div>
                            <div className={classes.ButtonSelector} 
                                onClick={() => this.setState({ showDownEmotionModal: true })}>
                                    {this.state.recognizedEmotion.emotion}
                            </div>
                        </React.Fragment>
                }
            </div>
        );

        let dataDisplayed = this.state.mainEmotion === null ? null : (
            <div className={classes.Column}>
                <div className={classes.Percentage} style={{ color: this.state.recognizedEmotion.color }}>
                    {this.state.percentage}%
                </div>
                <CircularProgressbar value={this.state.percentage}
                    styles={{
                        path: {
                            stroke: this.state.mainEmotion.color,
                        },
                        trail: {
                            stroke: this.state.mainEmotion.color,
                            opacity: '0.2'
                        }
                    }}>
                </CircularProgressbar>
            </div>
        );


        return (
            <div className={classes.Content}>
                {
                    this.state.userContribution ? 
                        <div className={classes.Introduction}>
                            <div className={classes.Welcome}>
                                <p style={{ fontSize: '28px', fontWeight: '800', marginTop: '0px' }}>Ciao Alberto,</p> 
                                ecco i risultati che fino ad ora hai ottenuto su Emozionalmente. Speriamo
                                di riceverne presto altri
                            </div>
                            <div className={classes.Column}>
                                <div className={classes.Values}>
                                    <MdMic size="48px" color="var(--logo-red)"/>
                                    {this.state.userContribution.samples}
                                </div>
                                <div className={classes.Values}>
                                    <MdPlayArrow size="48px" color="var(--logo-violet)"/>
                                    {this.state.userContribution.evaluations}
                                </div>
                            </div>
                        </div>
                        :
                        null
                }
                <div className={classes.MainGraph}>
                    <div className={classes.Database}>
                        <p style={{ fontSize: '28px', fontWeight: '800', marginTop: '0px' }}>
                            Il nostro Database di voci
                        </p>
                        La sezione seguente è un resoconto della situazione attuale del database. 
                        Partendo dalla precisione per arrivare alle percentuale che spiega come le 
                        varie emozioni sono state percepite da coloro che hanno valutato i sample.
                    </div>
                    <div className={classes.MainCard}>
                        {dataBlocks}
                    </div>
                    <div className={classes.Card}>
                        <div className={classes.Column} style={{ fontSize: '15px' }}>
                            <p style={{ fontSize: '28px', fontWeight: '800', marginTop: '0px' }}>Precisione</p>
                            Il grafico riporta la quantità di sample in cui l'emozione che si è stata espressa
                            è anche stata riconosciuta dagli altri
                        </div>
                        {accuracyData}
                    </div>
                    <div className={classes.Card}>
                        {querySelectors}
                        {dataDisplayed}
                    </div>
                </div>
            </div>
        );
    }

}

export default Database;