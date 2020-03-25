import React, { Component } from 'react';
import classes from './Database.css';
import axios from 'axios';
import UserSection from './Sections/UserSection';
import ListenSection from './Sections/ListenSection';
import SpeakSection from './Sections/SpeakSection';

class Database extends Component {

    state = {
        emotionsDownloaded: false
    }

    async componentDidMount () {

        const descriptions = await axios.get('/api/descriptions/database');
        const content = {};
        descriptions.data.map(el => {
            return content[el.position] = el.content;
        });
        const emotions = await axios.get('/api/data/emotions');
        const emotionText = [];
        const emotionNames = [];
        const emotionColors = [];
        emotions.data.map(e => {
            emotionText.push(e.emotion);
            emotionNames.push(e.name);
            return emotionColors.push(e.color);
        });
        
        this.setState({
            content: content,
            emotionText: emotionText,
            emotionNames: emotionNames,
            emotionColors: emotionColors,
            emotionsDownloaded: true
        });

    }

    render () {

        return (
            <div className={classes.Content}>
                <h1>The Emotional Database</h1>
                <h3>
                    In the following sections, data will be visualized in different ways but collected in three main groups: 
                    Users, Recordings and Evaluations.
                </h3>
                {
                    this.state.emotionsDownloaded ?
                    <React.Fragment>
                            <h2>Our Users</h2>
                            <p>Click on the buttons to create personalized filters, then click <i>Apply</i>. Click on <i>Clear</i> to reset the filters.</p>
                            <UserSection
                                emotionText={this.state.emotionText}
                                emotionNames={this.state.emotionNames}
                                emotionColors={this.state.emotionColors}/>
                            <h2>Evaluations</h2>
                            <p>Click on the buttons to create personalized filters, then click <i>Apply</i>. Click on <i>Clear</i> to reset the filters.</p>
                            <ListenSection
                                emotionText={this.state.emotionText}
                                emotionNames={this.state.emotionNames}
                                emotionColors={this.state.emotionColors}/>
                            <h2>Recordings</h2>
                            <p>Click on the buttons to create personalized filters, then click <i>Apply</i>. Click on <i>Clear</i> to reset the filters.</p>
                            <SpeakSection
                                emotionText={this.state.emotionText}
                                emotionNames={this.state.emotionNames}
                                emotionColors={this.state.emotionColors}/>
                        </React.Fragment>
                        :
                        null
                }
            </div>
        );
    }

}

export default Database;