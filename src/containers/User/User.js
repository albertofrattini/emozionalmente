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
        genderDict: null,
        languages: [],
        currentLanguage: 'it',
        overallLanguage: 'it'
    }

    async componentDidMount () {

        const lang = await axios.get('/api/availablelanguages');
        const languages = lang.data.available;
        const currlang = lang.data.curr;
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
        const totallisten = await axios.get('/api/data/database/user/listencomparison?u=' + user.data.user.username + '&l=' + currlang);
        const data = totallisten.data;

        this.setState({
            languages: languages,
            currentLanguage: currlang,
            overallLanguage: currlang,
            user: user.data.user,
            content: content,
            emotionText: emotionText,
            emotionNames: emotionNames,
            emotionColors: emotionColors,
            colorDict: colors,
            textDict: names,
            data: data,
            selectedEmotion: emotionNames[0],
            isDownloading: false
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
                const totallisten = await axios.get('/api/data/database/user/listencomparison?u=' + this.state.user.username + '&l=' + this.state.currentLanguage);
                data = totallisten.data;
                break;
            case 'radar':
                const accuracycomparison = await axios.get('/api/data/database/user/accuracy?u=' + this.state.user.username + '&l=' + this.state.currentLanguage);
                data = accuracycomparison.data;
                break;
            case 'listenpie':
                const emotioncomparison = await axios.get('/api/data/database/comparison?u=' + this.state.user.username + '&e=' + this.state.selectedEmotion + '&l=' + this.state.currentLanguage);
                data = emotioncomparison.data;
                break;
            case 'radial':
                const totalspeak = await axios.get('/api/data/database/user/speakcomparison?u=' + this.state.user.username + '&l=' + this.state.currentLanguage);
                data = totalspeak.data;
                break;
            case 'loadbar':
                const speakaccuracy = await axios.get('/api/data/database/user/actor?u=' + this.state.user.username + '&l=' + this.state.currentLanguage);
                data = speakaccuracy.data;
                break;
            case 'speakpie':
                const speakcomparison = await axios.get('/api/data/database/comparison?u=' + this.state.user.username + '&e=' + this.state.selectedEmotion+ '&v=others' + '&l=' + this.state.currentLanguage);
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

    setValues = (total, percentage, mean=-1) => {
        this.setState({
            graphTotal: total,
            graphPercentage: percentage,
            graphMean: mean
        });
    }

    render () {

        let filteredGraph = null;
        let graphDescription = null;
        let emotionSelect = null;
        let errorNotFound = null;
        let total = this.state.graphTotal;
        let performance = this.state.graphPercentage;
        let mean = this.state.graphMean;

        let part1 = this.state.content['graph-' + this.state.graphId + '-1'];
        let part2 = this.state.content['graph-' + this.state.graphId + '-2'];
        let part3 = this.state.content['graph-' + this.state.graphId + '-3'];

        if (!this.state.isDownloading && this.state.user) {

                switch(this.state.graphId) {
                    case 'circular':
                        if (performance < 30) {
                            part2 = this.state.content['graph-' + this.state.graphId + '-2-alt'];
                            part3 = this.state.content['graph-' + this.state.graphId + '-3-alt'];
                            performance = 100 - performance;
                        } else if (total > mean) {
                            part3 += this.state.content['graph-' + this.state.graphId + '-4-alt']
                        }

                        if (this.state.data.values.length > 5) {
                            filteredGraph = (
                                <CircularBarPlot 
                                    data={this.state.data}
                                    valuesCallback={this.setValues}
                                    personal_tooltip_1={this.state.content['graph-circular-tooltip-personal-1']}
                                    personal_tooltip_2={this.state.content['graph-circular-tooltip-personal-2']}
                                    tooltip_1={this.state.content['graph-circular-tooltip-1']}
                                    tooltip_2={this.state.content['graph-circular-tooltip-2']}
                                    mean={this.state.content['user-mean']}/>
                            );
                        } else {
                            total = 0;
                            this.state.data.values.forEach(e => {
                                if (e.id === this.state.data.uid) return total = parseInt(e.value);
                            });
                            part2 = this.state.content['graph-' + this.state.graphId + '-5-alt'];
                            part3 = '';
                            performance = '';
                            filteredGraph = null;
                            errorNotFound = (<h2>{this.state.content['graph-' + this.state.graphId + '-6-alt']}</h2>);
                        }
                        break;
                    case 'radar':
                        if (total === 0) {
                            part1 = this.state.content['graph-' + this.state.graphId + '-1-alt'];
                            part2 = this.state.content['graph-' + this.state.graphId + '-2-alt'];
                            part3 = this.state.content['graph-' + this.state.graphId + '-3-alt'];
                            total = '';
                        }
                        filteredGraph = (
                            <RadarChart
                                data={this.state.data}
                                emotionText={this.state.emotionText}
                                emotionNames={this.state.emotionNames}
                                emotionColors={this.state.emotionColors}
                                valuesCallback={this.setValues}
                                personal_tooltip_1={this.state.content['graph-radar-tooltip-personal-1']}
                                tooltip_1={this.state.content['graph-radar-tooltip-1']}/>
                        );
                        break;
                    case 'listenpie':
                        total = this.state.textDict[this.state.selectedEmotion];
                        if (!performance) {
                            performance = 0;
                        } 
                        if (this.state.data.length === 0) {
                            part1 = this.state.content['graph-' + this.state.graphId + '-1-alt'];
                            part2 = this.state.content['graph-' + this.state.graphId + '-2-alt'];
                            part3 = '';
                            performance = '';
                        }
                        emotionSelect = (
                            <div className={classes.EmotionsTab}>
                                {
                                    this.state.emotionNames.map((e, i) => {
                                        return  <div className={classes.Emotion}
                                                    style={{ 
                                                        backgroundColor: this.state.colorDict[e], 
                                                        padding: this.state.selectedEmotion === e ? '14px' : '8px',
                                                        boxShadow: this.state.selectedEmotion === e ? 
                                                                    '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none'
                                                    }}
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
                        if (performance < 30) {
                            part2 = this.state.content['graph-' + this.state.graphId + '-2-alt'];
                            part3 = this.state.content['graph-' + this.state.graphId + '-3-alt'];
                            performance = 100 - performance;
                        } else if (total > mean) {
                            part3 += this.state.content['graph-' + this.state.graphId + '-4-alt']
                        }
                        if (this.state.data.values.length > 5) {
                            filteredGraph = (
                                <RadialStackedBarChart
                                    data={this.state.data}
                                    emotionText={this.state.emotionText}
                                    emotionNames={this.state.emotionNames}
                                    emotionColors={this.state.emotionColors}
                                    valuesCallback={this.setValues}
                                    personal_tooltip_1={this.state.content['graph-radial-tooltip-personal-1']}
                                    personal_tooltip_2={this.state.content['graph-radial-tooltip-personal-2']}
                                    tooltip_1={this.state.content['graph-radial-tooltip-1']}
                                    tooltip_2={this.state.content['graph-radial-tooltip-2']}
                                    mean={this.state.content['user-mean']}/>
                            );
                        } else {
                            total = 0;
                            this.state.data.values.forEach(e => {
                                if (e.id === this.state.data.uid) {
                                    total += parseInt(e.value);
                                }
                            });
                            part2 = this.state.content['graph-' + this.state.graphId + '-5-alt'];
                            part3 = '';
                            performance = '';
                            filteredGraph = null;
                            errorNotFound = (<h2>{this.state.content['graph-' + this.state.graphId + '-6-alt']}</h2>);
                        }
                        break;
                    case 'loadbar':
                        if (performance === 0) {
                            part1 = this.state.content['graph-' + this.state.graphId + '-1-alt'];
                            part2 = '';
                            part3 = '';
                            total = '';
                        }
                        performance = '';
                        filteredGraph = (
                            <LoadingBar
                                data={this.state.data}
                                valuesCallback={this.setValues}/>
                        );
                        break;
                    case 'speakpie':
                        total = this.state.textDict[this.state.selectedEmotion];
                        if (!performance) {
                            performance = 0;
                        }
                        if (this.state.data.length === 0) {
                            part1 = this.state.content['graph-' + this.state.graphId + '-1-alt'];
                            part2 = this.state.content['graph-' + this.state.graphId + '-2-alt'];
                            part3 = '';
                            performance = '';
                        }
                        emotionSelect = (
                            <div className={classes.EmotionsTab}>
                                {
                                    this.state.emotionNames.map((e, i) => {
                                        return  <div className={classes.Emotion}
                                                    style={{ 
                                                        backgroundColor: this.state.colorDict[e], 
                                                        padding: this.state.selectedEmotion === e ? '14px' : '8px',
                                                        boxShadow: this.state.selectedEmotion === e ? 
                                                                    '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none'
                                                    }}
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
                        {part1} 
                        {total} 
                        {part2}
                        {performance}
                        {part3}
                    </h3>
                    <p>
                        {this.state.content['graph-' + this.state.graphId + '-sub']}
                    </p>
                </React.Fragment>
            );

            if (this.state.data.length === 0) {
                errorNotFound = (
                    <h2>{this.state.content['user-error']}</h2>
                );
                filteredGraph = null;
            }



        }

        let languages = [...Object.keys(this.state.languages)];
        let languageOptions = languages.length > 0 ?
            languages.map((el, i) => {
                return (
                    <option key={i} value={el}>
                        {this.state.content['user-lang-only']}{this.state.languages[this.state.overallLanguage][el]}
                    </option>
                );    
            })
            :
            null;

        let languageSelector = languages.length > 0 ?
            <select defaultValue={this.state.currentLanguage} 
                style={{ 
                    color: 'var(--text-dark)', 
                    border: '1px solid var(--text-dark)',
                    minWidth: 'auto',
                    fontSize: '12px',
                    minWidth: '92px',
                    height: '32px'
                }}
                onChange={event => this.setState({ 
                    currentLanguage: event.target.value,
                    isDownloading: true 
                    })}>
                <option value="">{this.state.content['user-lang-tot']}</option>
                {languageOptions}
            </select>
            :
            null;

        let langSelect = (
            <div className={classes.FilterRow} style={{ marginBottom: '8px' }}>
                <h4>{this.state.content['user-lang']}</h4>
                {languageSelector}
            </div>
        );

        return (
            <div className={classes.Content}>
                <div className={classes.Filters}>
                    {
                        this.state.user ?
                            <React.Fragment>
                                <h1>{this.state.content['user-title']} {this.state.user.username},</h1>
                                <h3>{this.state.content['user-subtitle']}</h3>
                                <p style={{ margin: '8px 0px 0px 0px' }}>{this.state.content['user-email']} {this.state.user.email}</p>
                                <p style={{ margin: '8px 0px 0px 0px' }}>{this.state.content['user-sex']} {this.state.user.sex}</p>
                                <p style={{ margin: '8px 0px 0px 0px' }}>{this.state.content['user-nationality']} {this.state.user.nationality}</p>
                                <p style={{ margin: '8px 0px 0px 0px' }}>{this.state.content['user-age']} {this.state.user.age}</p>
                            </React.Fragment>
                            :
                            null
                    }
                    {langSelect}
                    <div className={classes.SectionFilter}>
                        <div className={classes.Drawer}>
                            <div className={classes.SectionElement}>
                                {this.state.content['user-listen']}
                                <div className={classes.SectionDrawer}>
                                    <div onClick={() => this.changeGraph('circular')}>{this.state.content['graph-circular-name']}</div>
                                    <div onClick={() => this.changeGraph('radar')}>{this.state.content['graph-radar-name']}</div>
                                    <div onClick={() => this.changeGraph('listenpie')}>{this.state.content['graph-listenpie-name']}</div>
                                </div>
                            </div>
                            <div className={classes.SectionElement}>
                                {this.state.content['user-speak']}
                                <div className={classes.SectionDrawer}>
                                    <div onClick={() => this.changeGraph('radial')}>{this.state.content['graph-radial-name']}</div>
                                    <div onClick={() => this.changeGraph('loadbar')}>{this.state.content['graph-loadbar-name']}</div>
                                    <div onClick={() => this.changeGraph('speakpie')}>{this.state.content['graph-speakpie-name']}</div>
                                </div>
                            </div>
                        </div>
                        {this.state.content['graph-' + this.state.graphId + '-name']}
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