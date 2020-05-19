import React, { Component } from 'react';
import classes from './Database.css';
import axios from 'axios';
import CircularPacking from '../../components/UI/D3/CircularPacking';
import BasicBarPlot from '../../components/UI/D3/BasicBarPlot';
import ConnectedScatterPlot from '../../components/UI/D3/ConnectedScatterPlot';
import ConnectedScatter from '../../components/UI/D3/ConnectedScatter';
import StackedAreaChart from '../../components/UI/D3/StackedAreaChart';
import BeeSwarm from '../../components/UI/D3/BeeSwarm';
import TreeMap from '../../components/UI/D3/TreeMap';

class Database extends Component {

    state = {
        sexFilter: '',
        nationalityFilter: '',
        minAge: 0,
        maxAge: 100,
        isDownloading: true,
        graphId: 'bee',
        nationalitiesDict: null,
        genderDict: null,
        content: {},
        languages: [],
        currentLanguage: 'it',
        overallLanguage: 'it',
        otherGraph: false
    }

    async componentDidMount () {

        const lang = await axios.get('/api/availablelanguages');
        const languages = lang.data.available;
        const currlang = lang.data.curr;
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
        const colors = {}
        const names = {}
        for(var i = 0; i < emotionNames.length; i++) {
            colors[emotionNames[i]] = emotionColors[i];
            names[emotionNames[i]] = emotionText[i];
        }
        const users = await axios.get('/api/data/database/users' + '?min=' + this.state.minAge 
                                        + '&max=' + this.state.maxAge + '&l=' + currlang);
        const data = users.data;
        const nationalitiesDict = {};
        const genderDict = {
            male: content['db-male'],
            female: content['db-female']
        };
        users.data.forEach(e => {
            if (!nationalitiesDict[e.nationality]) {
                nationalitiesDict[e.nationality] = 0;
            }
            nationalitiesDict[e.nationality] += 1;
        });
        const samples = await axios.get('/api/data/database/samples' + '?min=' + this.state.minAge 
                                        + '&max=' + this.state.maxAge + '&l=' + currlang);
        const evaluations = await axios.get('/api/data/database/evaluations' + '?min=' + this.state.minAge 
                                        + '&max=' + this.state.maxAge + '&l=' + currlang);
        let maxDaySamples = 0;
        samples.data.forEach(e => {
            let t = 0;
            emotionNames.forEach(n => {
                t += e[n];
            });
            if (t > maxDaySamples) maxDaySamples = t;
        });
        let maxDayEvaluations = 0;
        evaluations.data.scatter.forEach(e => {
            if (e.value > maxDayEvaluations) maxDayEvaluations = e.value;
        });

        let allDays = [];
        if (samples.data.length > 0) {
            const db = samples.data[0].date.substring(7,9) + " " 
                        + samples.data[0].date.substring(3,6) + " " 
                        + samples.data[0].date.substring(0,2) + " 00:00:00 GMT";
            allDays = getDates(new Date(Date.parse(db)), new Date(Date.now()));
        }

        this.setState({
            languages: languages,
            currentLanguage: currlang,
            overallLanguage: currlang,
            content: content,
            emotionText: emotionText,
            emotionNames: emotionNames,
            emotionColors: emotionColors,
            nationalitiesDict: nationalitiesDict,
            genderDict: genderDict,
            colorDict: colors,
            textDict: names,
            data: data,
            selectedEmotion: emotionNames[0],
            isDownloading: false,
            allDays: allDays,
            maxDaySamples: maxDaySamples,
            maxDayEvaluations: maxDayEvaluations
        });

    }

    componentDidUpdate () {

        if (this.state.isDownloading) {

            this.downloadData();
            
        }
            
    }

    fetchBase = async () => {

        const users = await axios.get('/api/data/database/users' + '?min=' + 0 
                                        + '&max=' + 100 + '&l=' + this.state.currentLanguage);
        const nationalitiesDict = {};
        users.data.forEach(e => {
            if (!nationalitiesDict[e.nationality]) {
                nationalitiesDict[e.nationality] = 0;
            }
            nationalitiesDict[e.nationality] += 1;
        });
        const samples = await axios.get('/api/data/database/samples' + '?min=' + 0 
                                        + '&max=' + 100 + '&l=' + this.state.currentLanguage);
        const evaluations = await axios.get('/api/data/database/evaluations' + '?min=' + 0 
                                        + '&max=' + 100 + '&l=' + this.state.currentLanguage);
        let maxDaySamples = 0;
        samples.data.forEach(e => {
            let t = 0;
            this.state.emotionNames.forEach(n => {
                t += e[n];
            });
            if (t > maxDaySamples) maxDaySamples = t;
        });
        let maxDayEvaluations = 0;
        evaluations.data.scatter.forEach(e => {
            if (e.value > maxDayEvaluations) maxDayEvaluations = e.value;
        });

        let allDays = [];
        if (samples.data.length > 0) {
            const db = samples.data[0].date.substring(7,9) + " " 
                        + samples.data[0].date.substring(3,6) + " " 
                        + samples.data[0].date.substring(0,2) + " 00:00:00 GMT";
            allDays = getDates(new Date(Date.parse(db)), new Date(Date.now()));
        }

        this.setState({
            allDays: allDays,
            maxDaySamples: maxDaySamples,
            maxDayEvaluations: maxDayEvaluations,
            nationalitiesDict: nationalitiesDict
        });
    }

    downloadData = async () => {

        let data = [];

        if (this.state.allDays) {
            if (!(this.state.allDays.length > 0)) this.fetchBase();
        }

        let filter = '?min=' + this.state.minAge + '&max=' + this.state.maxAge + '&l=' + this.state.currentLanguage;
        if (this.state.sexFilter !== '') {
            filter = filter + '&s=' + this.state.sexFilter;
        }
        if (this.state.nationalityFilter !== '') {
            filter = filter + '&n=' + this.state.nationalityFilter;
        }
        let otherGraph = this.state.otherGraph;

        switch(this.state.graphId) {
            case 'bee':
                const users = await axios.get('/api/data/database/users' + filter);
                data = users.data;
                break;
            case 'stacked':
                otherGraph = true;
                const samples = await axios.get('/api/data/database/samples' + filter);
                data = samples.data;
                break;
            case 'scatter':
                otherGraph = true;
                const evaluations = await axios.get('/api/data/database/evaluations' + filter);
                data = evaluations.data.scatter;
                break;
            case 'packing':
                otherGraph = true;
                const evaluationsp = await axios.get('/api/data/database/evaluations' + filter);
                data = evaluationsp.data.quantity;
                break;
            case 'comppie':
                otherGraph = true;
                const comparison = await axios.get('/api/data/database/comparison' + filter + '&e=' + this.state.selectedEmotion);
                data = comparison.data;
                break;
            case 'scatterplot':
                otherGraph = true;
                const accuracy = await axios.get('/api/data/database/accuracy' + filter);
                data = accuracy.data;
                break;
            case 'treemap':
                otherGraph = true;
                const totSamples = await axios.get('/api/data/database/samples' + filter);
                data = totSamples.data;
            default:
                console.log('graph not found!');    
        }

        this.setState({
            isDownloading: false,
            data: data,
            otherGraph: otherGraph
        });

    }

    changeGraph = (graph) => {
        this.setState({
            isDownloading: true,
            graphId: graph
        });
    }

    resetFilters = () => {
        if (document.getElementById('nationalities-select')) {
            document.getElementById('nationalities-select').selectedIndex = 0;
            document.getElementById('gender-select').selectedIndex = 0;
            document.getElementById('min-age').value = 0;
            document.getElementById('max-age').value = 100;
        }

        this.setState({
            sexFilter: '',
            nationalityFilter: '',
            minAge: 0,
            maxAge: 100,
            isDownloading: true
        });
    }

    render () {

        let filters = null;
        let filteredGraph = null;
        let graphDescription = null;
        let emotionSelect = null;
        let total = null;

        if (this.state.nationalitiesDict) {
            filters = (
                <div className={classes.FilterRow}>
                    <p>{this.state.content['db-filters']}</p>
                    <div className={classes.Column}>
                        <input id="min-age" value={this.state.minAge} type="number" 
                            onChange={e => { if (e.target.value) this.setState({ minAge: e.target.value, isDownloading: true }) }}></input>
                        <p style={{ position: 'absolute', top: '-30px', color: 'var(--text-dark)' }}>Età minima</p> 
                    </div>
                    <div className={classes.Column}>
                        <input id="max-age" value={this.state.maxAge} type="number"
                            onChange={e => { if (e.target.value) this.setState({ maxAge: e.target.value, isDownloading: true }) }}></input>
                        <p style={{ position: 'absolute', top: '-30px', color: 'var(--text-dark)' }}>Età massima</p> 
                    </div>
                    <select id="gender-select" value={this.state.sexFilter}
                        onChange={event => this.setState({ sexFilter: event.target.value, isDownloading: true })}>
                        <option value="">{this.state.content['db-gender']}</option>
                        {
                            [...Object.keys(this.state.genderDict)].map((e,i) => {
                                return <option key={i} value={e}>{this.state.content['db-' + e]}</option>
                            })
                        }
                    </select>
                    <select id="nationalities-select" value={this.state.nationalityFilter}
                        onChange={event => this.setState({ nationalityFilter: event.target.value, isDownloading: true })}>
                        <option value="">{this.state.content['db-nationality']}</option>
                        {
                            [...Object.keys(this.state.nationalitiesDict)].map((e,i) => {
                                return <option key={i} value={e}>{e}</option>
                            })
                        }
                    </select>
                    <button onClick={this.resetFilters}>{this.state.content['db-clear']}</button>
                </div>
            );

            if (!this.state.isDownloading) {

                switch(this.state.graphId) {
                    case 'bee':
                        total = 0;
                        this.state.data.forEach(e => {
                            if (this.state.minAge <= e.age && e.age <= this.state.maxAge) total += parseInt(e.number);
                        });
                        filters = (
                            <div className={classes.FilterRow}>
                                <p>{this.state.content['db-filters']}</p>
                                <div className={classes.Column}>
                                    <input id="sel-min-age" value={this.state.minAge} type="number" 
                                        onChange={e => this.setState({ minAge: e.target.value })}></input>
                                    <p style={{ position: 'absolute', top: '-30px', color: 'var(--text-dark)' }}>Età minima</p>    
                                </div>
                                <div className={classes.Column}>
                                    <input id="sel-max-age" value={this.state.maxAge} type="number"
                                        onChange={e => this.setState({ maxAge: e.target.value })}></input>
                                    <p style={{ position: 'absolute', top: '-30px', color: 'var(--text-dark)' }}>Età massima</p>    
                                </div>
                                <button id="btn_sel" value="sex">{this.state.content['db-gender']}</button>
                                <button id="btn_sel" value="nationality">{this.state.content['db-nationality']}</button>
                                <button id="btn_sel" value="none" onClick={() => {
                                    console.log(this.state.otherGraph)
                                    if (this.state.otherGraph) {
                                        this.setState({
                                            minAge: 0,
                                            maxAge: 100,
                                            isDownloading: true
                                        });    
                                    } else {
                                        this.setState({
                                            minAge: 0,
                                            maxAge: 100
                                        });
                                    }

                                }}>{this.state.content['db-clear']}</button>
                            </div>
                        );
                        if (Object.keys(this.state.nationalitiesDict).length > 0) {
                            filteredGraph = (
                                <BeeSwarm 
                                    data={this.state.data}
                                    nationalities={this.state.nationalitiesDict}
                                    genders={this.state.genderDict}/>
                            );
                        } else {
                            filteredGraph = null;
                        }
                        break;
                    case 'stacked':
                        if (this.state.allDays.length > 0) {
                            filteredGraph = (
                                <StackedAreaChart
                                        data={this.state.data}
                                        emotionText={this.state.emotionText}
                                        emotionNames={this.state.emotionNames}
                                        emotionColors={this.state.emotionColors}
                                        allDays={this.state.allDays}
                                        maxValue={this.state.maxDaySamples}/>
                            );
                        } else {
                            filteredGraph = null;
                        }
                        break;
                    case 'scatter':
                        if (this.state.allDays.length > 0) {
                            filteredGraph = (
                                <ConnectedScatter
                                        data={this.state.data}
                                        allDays={this.state.allDays}
                                        maxValue={this.state.maxDayEvaluations}/>
                            );
                        } else {
                            filteredGraph = null;
                        } 
                        break;
                    case 'packing':
                        total = 0;
                        this.state.data.forEach(e => {
                            total += e.quantity * e.count;
                        })
                        filteredGraph = (
                            <CircularPacking 
                                    data={this.state.data}
                                    tooltip_1={this.state.content['db-packing-tooltip-1']}
                                    tooltip_2={this.state.content['db-packing-tooltip-2']}/>
                        );
                        break;
                    case 'comppie':
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
                            <BasicBarPlot 
                                data={this.state.data}
                                emotionText={this.state.emotionText}
                                emotionNames={this.state.emotionNames}
                                emotionColors={this.state.emotionColors}
                                selectedEmotion={this.state.selectedEmotion}
                                textDict={this.state.textDict}
                                colorDict={this.state.colorDict}/>
                        );
                        break;
                    case 'scatterplot':
                        filteredGraph = (
                            <ConnectedScatterPlot
                                data={this.state.data}
                                emotionText={this.state.emotionText}
                                emotionNames={this.state.emotionNames}
                                emotionColors={this.state.emotionColors}/>
                        );
                        break;
                    case 'treemap':
                        total = 0;
                        this.state.data.forEach(e => {
                            this.state.emotionNames.forEach(n => {
                                total += e[n];
                            });
                        });
                        filteredGraph = (
                            <TreeMap 
                                data={this.state.data}
                                emotionText={this.state.emotionText}
                                emotionNames={this.state.emotionNames}
                                emotionColors={this.state.emotionColors}/>
                        );
                    default:
                        console.log('graph not found!');  
                        break;  

                }

                if (this.state.data.length === 0) {
                    // emotionSelect = null;
                    filteredGraph = (
                        <h2>{this.state.content['db-error']}</h2>
                    );
                }
            }
            
        }

        graphDescription = (
            <React.Fragment>
                <h3>{this.state.content['db-' + this.state.graphId + '-1']}{total}</h3>
                <p>{this.state.content['db-' + this.state.graphId + '-2']}</p>
            </React.Fragment>
        );

        let languages = [...Object.keys(this.state.languages)];
        let languageOptions = languages.length > 0 ?
            languages.map((el, i) => {
                return (
                    <option key={i} value={el}>
                        {this.state.languages[this.state.overallLanguage][el]}
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
                {languageOptions}
            </select>
            :
            null;

        let langSelect = (
            <div className={classes.FilterRow} style={{ marginBottom: '8px' }}>
                <h4>{this.state.content['db-lang-select']}</h4>
                {languageSelector}
            </div>
        );

        
        return (
            <div className={classes.Content}>
                <div className={classes.Filters}>
                    <h1>{this.state.content['db-title']}</h1>
                    {langSelect}
                    {filters}
                    <div className={classes.SectionFilter}>
                        <div className={classes.Drawer}>
                            <div className={classes.SectionElement}>
                                {this.state.content['db-users']}
                                <div className={classes.SectionDrawer}>
                                    <div onClick={() => this.changeGraph('bee')}>{this.state.content['db-bee-name']}</div>
                                    <div onClick={() => this.changeGraph('stacked')}>{this.state.content['db-stacked-name']}</div>
                                    <div onClick={() => this.changeGraph('scatter')}>{this.state.content['db-scatter-name']}</div>
                                </div>
                            </div>
                            <div className={classes.SectionElement}>
                                {this.state.content['db-listen']}
                                <div className={classes.SectionDrawer}>
                                    <div onClick={() => this.changeGraph('packing')}>{this.state.content['db-packing-name']}</div>
                                    <div onClick={() => this.changeGraph('comppie')}>{this.state.content['db-comppie-name']}</div>
                                    <div onClick={() => this.changeGraph('scatterplot')}>{this.state.content['db-scatterplot-name']}</div>
                                </div>
                            </div>
                            <div className={classes.SectionElement}>
                                {this.state.content['db-speak']}
                                <div className={classes.SectionDrawer}>
                                    <div onClick={() => this.changeGraph('treemap')}>{this.state.content['db-treemap-name']}</div>
                                </div>
                            </div>
                        </div>
                        {this.state.content['db-' + this.state.graphId + '-name']}
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
                    {filteredGraph}
                </div>
            </div>
        );
    }

}



Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

export default Database;