import React, { Component } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import classes from './Database.css';
import axios from 'axios';

class Database extends Component {

    state = {
        data: null,
        accuracy: 0,
        maxValue: 0,
        percentage: 0,
        mainEmotion: null,
        recognizedEmotion: null,
        emotions: [],
        showUpEmotionModal: false,
        showDownEmotionModal: false,
        content: {}
    }

    componentDidMount () {

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

        axios.get('/api/descriptions/database')
            .then(response => {
                const content = {};
                response.data.map(el => {
                    return content[el.position] = el.content;
                });
                this.setState({ content: content });
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
                                {this.state.content[this.state.data[el].content]}
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
                            <div style={{ fontSize: '15px', textAlign: 'center', lineHeight: '1.63' }}
                                dangerouslySetInnerHTML={{
                                    __html: this.state.content['comparison1'] + this.state.mainEmotion.emotion
                                                + this.state.content['comparison2'] + this.state.recognizedEmotion.emotion
                                }}></div>
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
                <div className={classes.MainGraph}>
                    <div className={classes.Database}>
                        <p style={{ fontSize: '36px', fontWeight: '500', margin: '0px' }}
                            dangerouslySetInnerHTML={{
                                __html: this.state.content['general-title']
                            }}></p>
                        <p dangerouslySetInnerHTML={{
                            __html: this.state.content['general-subtitle']
                        }}></p>
                    </div>
                    <div className={classes.MainCard}>
                        {dataBlocks}
                    </div>
                    <div className={classes.Card}>
                        <div className={classes.Column} style={{ fontSize: '15px' }}>
                            <p style={{ fontSize: '28px', fontWeight: '800', margin: '0px' }}>
                                {this.state.content['accuracy-title']}
                            </p>
                            <p dangerouslySetInnerHTML={{
                                __html: this.state.content['accuracy-subtitle']
                            }}></p>
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