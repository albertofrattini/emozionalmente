import React, { Component } from 'react';
import classes from './User.css';
import axios from 'axios';
import RadarChart from '../../components/UI/D3/RadarChart';
import PieChart from '../../components/UI/D3/PieChart';
import CircularBarPlot from '../../components/UI/D3/CircularBarPlot';
import RadialStackedBarChart from '../../components/UI/D3/RadialStackedBarChart';
import LoadingBar from '../../components/UI/D3/LoadingBar';

class User extends Component {

    state = {
        user: null,
        content: {},
        sexFilter: '',
        nationalityFilter: '',
        minAge: 0,
        maxAge: 100,
        isDownloading: true,
        graphId: 'circular',
        nationalitiesDict: null,
        genderDict: null
    }

    async componentDidMount () {

        const descriptions = await axios.get('/api/descriptions/user');
        const content = {};
        descriptions.data.map(el => {
                return content[el.position] = el.content;
            });
        const user = await axios.get('/api/users/loggedin');
        const emotions = await axios.get('/api/data/emotions');
        const emotionText = [];
        const emotionNames = [];
        const emotionColors = [];
        emotions.data.map(e => {
            emotionText.push(e.emotion);
            emotionNames.push(e.name);
            return emotionColors.push(e.color);
        });
        const colors = {}
        const names = {}
        for(var i = 0; i < emotionNames.length; i++) {
            colors[emotionNames[i]] = emotionColors[i];
            names[emotionNames[i]] = emotionText[i];
        }
        const totallisten = await axios.get('/api/data/database/user/listencomparison?u=' + user.data.user.username);
        const data = totallisten.data;

        this.setState({
            user: user.data.user,
            content: content,
            emotionText: emotionText,
            emotionNames: emotionNames,
            emotionColors: emotionColors,
            colorDict: colors,
            textDict: names,
            data: data,
            selectedEmotion: emotionNames[0],
            isDownloading: false,
            content: content
        });

    }

    componentDidUpdate () {

        if (this.state.isDownloading && this.state.user) {

            this.downloadData();
            
        }
            
    }

    downloadData = async () => {

        let data = [];

        switch(this.state.graphId) {
            case 'circular':
                const totallisten = await axios.get('/api/data/database/user/listencomparison?u=' + this.state.user.username);
                data = totallisten.data;
                break;
            case 'radar':
                const accuracycomparison = await axios.get('/api/data/database/user/accuracy?u=' + this.state.user.username);
                data = accuracycomparison.data;
                break;
            case 'listenpie':
                const emotioncomparison = await axios.get('/api/data/database/comparison?u=' + this.state.user.username + '&e=' + this.state.selectedEmotion);
                data = emotioncomparison.data;
                break;
            case 'radial':
                const totalspeak = await axios.get('/api/data/database/user/speakcomparison?u=' + this.state.user.username);
                data = totalspeak.data;
                break;
            case 'loadbar':
                const speakaccuracy = await axios.get('/api/data/database/user/actor?u=' + this.state.user.username);
                data = speakaccuracy.data;
                break;
            case 'speakpie':
                const speakcomparison = await axios.get('/api/data/database/comparison?u=' + this.state.user.username + '&e=' + this.state.selectedEmotion+ '&v=others');
                data = speakcomparison.data;
                break;
            default:
                console.log('graph not found!');    
        }

        this.setState({
            isDownloading: false,
            data: data
        });

    }

    changeGraph = (graph) => {
        this.setState({
            isDownloading: true,
            graphId: graph,
            graphTotal: null,
            graphPercentage: null
        });
    }

    setValues = (total, percentage) => {
        this.setState({
            graphTotal: total,
            graphPercentage: percentage
        });
    }

    render () {

        let filteredGraph = null;
        let graphDescription = null;
        let emotionSelect = null;
        let errorNotFound = null;
        let total = this.state.graphTotal;
        let performance = this.state.graphPercentage;

        if (!this.state.isDownloading && this.state.user) {

                switch(this.state.graphId) {
                    case 'circular':
                        filteredGraph = (
                            <CircularBarPlot 
                                data={this.state.data}
                                valuesCallback={this.setValues}/>
                        );
                        break;
                    case 'radar':
                        filteredGraph = (
                            <RadarChart
                                data={this.state.data}
                                emotionText={this.state.emotionText}
                                emotionNames={this.state.emotionNames}
                                emotionColors={this.state.emotionColors}
                                valuesCallback={this.setValues}/>
                        );
                        break;
                    case 'listenpie':
                        if (!performance) {
                            total = this.state.textDict[this.state.selectedEmotion];
                            performance = 0;
                        }
                        emotionSelect = (
                            <div className={classes.EmotionsTab}>
                                {
                                    this.state.emotionNames.map((e, i) => {
                                        return  <div className={classes.Emotion}
                                                    style={{ backgroundColor: this.state.colorDict[e] }}
                                                    onClick={() => this.setState({
                                                        isDownloading: true,
                                                        selectedEmotion: e,
                                                        graphTotal: null,
                                                        graphPercentage: null
                                                    })}
                                                    key={i}>
                                                    {this.state.textDict[e]}
                                                </div>
                                    })
                                }
                            </div>
                        );
                        filteredGraph = (
                            <PieChart
                                data={this.state.data}
                                emotionText={this.state.emotionText}
                                emotionNames={this.state.emotionNames}
                                emotionColors={this.state.emotionColors}
                                selectedEmotion={this.state.selectedEmotion}
                                textDict={this.state.textDict}
                                colorDict={this.state.colorDict}
                                valuesCallback={this.setValues}/>
                        );
                        break;
                    case 'radial':
                        filteredGraph = (
                            <RadialStackedBarChart
                                data={this.state.data}
                                emotionText={this.state.emotionText}
                                emotionNames={this.state.emotionNames}
                                emotionColors={this.state.emotionColors}
                                valuesCallback={this.setValues}/>
                        );
                        break;
                    case 'loadbar':
                        filteredGraph = (
                            <LoadingBar
                                data={this.state.data}
                                valuesCallback={this.setValues}/>
                        );
                        break;
                    case 'speakpie':
                        if (!performance) {
                            total = this.state.textDict[this.state.selectedEmotion];
                            performance = 0;
                        }
                        emotionSelect = (
                            <div className={classes.EmotionsTab}>
                                {
                                    this.state.emotionNames.map((e, i) => {
                                        return  <div className={classes.Emotion}
                                                    style={{ backgroundColor: this.state.colorDict[e] }}
                                                    onClick={() => this.setState({
                                                        isDownloading: true,
                                                        selectedEmotion: e,
                                                        graphTotal: null,
                                                        graphPercentage: null
                                                    })}
                                                    key={i}>
                                                    {this.state.textDict[e]}
                                                </div>
                                    })
                                }
                            </div>
                        );
                        filteredGraph = (
                            <PieChart
                                data={this.state.data}
                                emotionText={this.state.emotionText}
                                emotionNames={this.state.emotionNames}
                                emotionColors={this.state.emotionColors}
                                selectedEmotion={this.state.selectedEmotion}
                                textDict={this.state.textDict}
                                colorDict={this.state.colorDict}
                                valuesCallback={this.setValues}/>
                        );
                        break;
                    default:
                        console.log('graph not found!');   
                }


            graphDescription = (
                <React.Fragment>
                    <h3>
                        {this.state.content['graph-' + this.state.graphId + '-1']} 
                        {total} 
                        {this.state.content['graph-' + this.state.graphId + '-2']}
                        {performance}
                        {this.state.content['graph-' + this.state.graphId + '-3']}
                    </h3>
                    <p>
                        {this.state.content['graph-' + this.state.graphId + '-sub']}
                    </p>
                </React.Fragment>
            );

            if (this.state.data.length === 0) {
                errorNotFound = (
                    <h2>Mi dispiace, ma non abbiamo trovato nessuna informazione</h2>
                );
            }



        }

        return (
            <div className={classes.Content}>
                <div className={classes.Filters}>
                    {
                        this.state.user ?
                            <React.Fragment>
                                <h1>{this.state.content['user-title']} {this.state.user.username},</h1>
                                <h3>{this.state.content['user-subtitle']}</h3>
                                <p>Email: {this.state.user.email}</p>
                                <p>Sesso: {this.state.user.sex}</p>
                                <p>Nazionalità: {this.state.user.nationality}</p>
                            </React.Fragment>
                            :
                            null
                    }
                    <div className={classes.SectionFilter}>
                        <div className={classes.Drawer}>
                            <div className={classes.SectionElement}>
                                Ascolti
                                <div className={classes.SectionDrawer}>
                                    <div onClick={() => this.changeGraph('circular')}>Ascolti effettuati</div>
                                    <div onClick={() => this.changeGraph('radar')}>Sei un bravo ascoltatore?</div>
                                    <div onClick={() => this.changeGraph('listenpie')}>Emozioni riconosciute</div>
                                </div>
                            </div>
                            <div className={classes.SectionElement}>
                                Registrazioni
                                <div className={classes.SectionDrawer}>
                                    <div onClick={() => this.changeGraph('radial')}>Registrazioni effettuate</div>
                                    <div onClick={() => this.changeGraph('loadbar')}>Sei un bravo attore?</div>
                                    <div onClick={() => this.changeGraph('speakpie')}>Come hai recitato</div>
                                </div>
                            </div>
                        </div>
                        Selezione Grafico
                        <div className={classes.Icon}>
                            <div style={{ width: '24px' }}></div>
                            <div style={{ width: '16px' }}></div>
                            <div style={{ width: '24px' }}></div>
                        </div>
                    </div>
                    {graphDescription}
                </div>
                <div className={classes.Graph}>       
                    {emotionSelect}
                    {errorNotFound}
                    {filteredGraph}
                </div>
            </div>
        );
    }
}


export default User;