import React, { Component } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import classes from './Database.css';
import axios from 'axios';
import { timeHours } from 'd3';

class Database extends Component {

    state = {
        data: null,
        maxValue: 0,
        percentage: 0,
        mainEmotion: null,
        recognizedEmotion: null,
        emotions: [],
        showUpEmotionModal: false,
        showDownEmotionModal: false
    }

    componentDidMount () {

        axios.get('/api/data/database')
            .then(response => {
                let max = 0;
                [...Object.keys(response.data)].map((el, _) => {
                    const value = parseInt(response.data[el].value);
                    if (value > max) {
                        max = value;
                    }
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
                        this.setState({ percentage: parseInt(response.data.value) });
                    });
            });

        

    }

    changeUpEmotion = (index) => {
        axios.get(`/api/data/comparison?first=${this.state.emotions[index].name}&second=${this.state.recognizedEmotion.name}`)
                    .then(response => {
                        this.setState({ 
                            percentage: parseInt(response.data.value),
                            mainEmotion: this.state.emotions[index],
                            showUpEmotionModal: false
                        });
                    });
    }

    changeDownEmotion = (index) => {
        axios.get(`/api/data/comparison?first=${this.state.mainEmotion.name}&second=${this.state.emotions[index].name}`)
                    .then(response => {
                        this.setState({ 
                            percentage: parseInt(response.data.value),
                            recognizedEmotion: this.state.emotions[index],
                            showDownEmotionModal: false
                        });
                    });
    }

    render () {

        console.log(this.state);

        let modalUp = (<div></div>);
        let modalDown = (<div></div>);

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
                const height = (this.state.data[el].value * 250) / this.state.maxValue;
                return (
                    <div key={i} className={classes.Block}>
                        <div className={classes.Data} style={{ height: height + 'px' }}>
                            {this.state.data[el].value}
                        </div>
                    </div>
                );
            })
            : 
            null;

        let querySelectors = (
            <div className={classes.Column}>
                {modalUp}
                {modalDown}
                {
                    this.state.mainEmotion === null ? 
                        null : 
                        <div className={classes.ButtonSelector} 
                            onClick={() => this.setState({ showUpEmotionModal: true })}>
                                {this.state.mainEmotion.emotion}
                        </div>
                }
                <div className={classes.QueryText}>samples recognized as</div>
                {
                    this.state.recognizedEmotion === null ? 
                        null : 
                        <div className={classes.ButtonSelector} 
                            onClick={() => this.setState({ showDownEmotionModal: true })}>
                                {this.state.recognizedEmotion.emotion}
                        </div>
                }
            </div>
        );

        let dataDisplayed = this.state.mainEmotion === null ? null : (
            <div className={classes.Column}>
                <CircularProgressbar value={this.state.percentage} 
                    text={`${this.state.percentage}%`}
                    styles={{
                        path: {
                            stroke: this.state.mainEmotion.color,
                        },
                        trail: {
                            stroke: this.state.mainEmotion.color,
                            opacity: '0.2'
                        },
                        text: {
                            fill: this.state.recognizedEmotion.color,
                            transform: 'translateX(-22px) translateY(6px)',
                            fontSize: '24px'
                        }
                    }}>
                </CircularProgressbar>
            </div>
        );


        return (
            <div className={classes.Content}>
                <div className={classes.MainGraph}>
                    <div className={classes.Card}>
                        {dataBlocks}
                    </div>
                </div>
                <div className={classes.EmotionsGraph}>
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