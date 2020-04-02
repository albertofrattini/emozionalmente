import React, { Component } from 'react';
import classes from './Database.css';
import axios from 'axios';
import CircularPacking from '../../components/UI/D3/CircularPacking';
import PieChart from '../../components/UI/D3/PieChart';
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
        content: {}
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
        const colors = {}
        const names = {}
        for(var i = 0; i < emotionNames.length; i++) {
            colors[emotionNames[i]] = emotionColors[i];
            names[emotionNames[i]] = emotionText[i];
        }
        const users = await axios.get('/api/data/database/users' + '?min=' + this.state.minAge + '&max=' + this.state.maxAge);
        const data = users.data;
        const nationalitiesDict = {};
        const genderDict = {};
        users.data.forEach(e => {
            if (!nationalitiesDict[e.nationality]) {
                nationalitiesDict[e.nationality] = 0;
            }
            if (!genderDict[e.sex]) {
                genderDict[e.sex] = 0;
            } 
            nationalitiesDict[e.nationality] += 1;
            genderDict[e.sex] += 1;
        });
        
        this.setState({
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
            content: content
        });

    }

    componentDidUpdate () {

        if (this.state.isDownloading) {

            this.downloadData();
            
        }
            
    }

    downloadData = async () => {

        let data = [];

        let filter = '?min=' + this.state.minAge + '&max=' + this.state.maxAge;
        if (this.state.sexFilter !== '') {
            filter = filter + '&s=' + this.state.sexFilter;
        }
        if (this.state.nationalityFilter !== '') {
            filter = filter + '&n=' + this.state.nationalityFilter;
        }

        switch(this.state.graphId) {
            case 'bee':
                const users = await axios.get('/api/data/database/users' + filter);
                data = users.data;
                break;
            case 'stacked':
                const samples = await axios.get('/api/data/database/samples' + filter);
                data = samples.data;
                break;
            case 'scatter':
                const evaluations = await axios.get('/api/data/database/evaluations' + filter);
                data = evaluations.data.scatter;
                break;
            case 'packing':
                const evaluationsp = await axios.get('/api/data/database/evaluations' + filter);
                data = evaluationsp.data.quantity;
                break;
            case 'comppie':
                const comparison = await axios.get('/api/data/database/comparison' + filter + '&e=' + this.state.selectedEmotion);
                data = comparison.data;
                break;
            case 'scatterplot':
                const accuracy = await axios.get('/api/data/database/accuracy' + filter);
                data = accuracy.data;
                break;
            case 'treemap':
                const totSamples = await axios.get('/api/data/database/samples' + filter);
                data = totSamples.data;
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
            graphId: graph
        });
    }

    applyFilters = () => {
        this.setState({ isDownloading: true });
    }

    resetFilters = () => {
        document.getElementById('nationalities-select').selectedIndex = 0;
        document.getElementById('gender-select').selectedIndex = 0;
        document.getElementById('min-age').value = 0;
        document.getElementById('max-age').value = 100;
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
                    <input id="min-age" defaultValue={this.state.minAge} type="number" 
                        onChange={e => this.setState({ minAge: e.target.value })}></input>
                    <input id="max-age" defaultValue={this.state.maxAge} type="number"
                        onChange={e => this.setState({ maxAge: e.target.value })}></input>
                    <select id="gender-select" value={this.state.sexFilter}
                        onChange={event => this.setState({ sexFilter: event.target.value })}>
                        <option value="">{this.state.content['db-gender']}</option>
                        {
                            [...Object.keys(this.state.genderDict)].map((e,i) => {
                                return <option key={i} value={e}>{this.state.content['db-' + e]}</option>
                            })
                        }
                    </select>
                    <select id="nationalities-select" value={this.state.nationalityFilter}
                        onChange={event => this.setState({ nationalityFilter: event.target.value })}>
                        <option value="">{this.state.content['db-nationality']}</option>
                        {
                            [...Object.keys(this.state.nationalitiesDict)].map((e,i) => {
                                return <option key={i} value={e}>{e}</option>
                            })
                        }
                    </select>
                    <button onClick={this.resetFilters}>{this.state.content['db-clear']}</button>
                    <button onClick={this.applyFilters}>{this.state.content['db-apply']}</button>
                </div>
            );

            if (!this.state.isDownloading) {

                switch(this.state.graphId) {
                    case 'bee':
                        total = 0;
                        this.state.data.forEach(e => {
                            total += parseInt(e.number);
                        });
                        filteredGraph = (
                            <BeeSwarm 
                                data={this.state.data}
                                nationalities={this.state.nationalitiesDict}
                                genders={this.state.genderDict}/>
                        );
                        break;
                    case 'stacked':
                        filteredGraph = (
                            <StackedAreaChart
                                    data={this.state.data}
                                    emotionText={this.state.emotionText}
                                    emotionNames={this.state.emotionNames}
                                    emotionColors={this.state.emotionColors}/>
                        );
                        break;
                    case 'scatter':
                        filteredGraph = (
                            <ConnectedScatter
                                    data={this.state.data}/>
                        );
                        break;
                    case 'packing':
                        total = 0;
                        this.state.data.forEach(e => {
                            total += e.quantity * e.count;
                        })
                        filteredGraph = (
                            <CircularPacking 
                                    data={this.state.data}/>
                        );
                        break;
                    case 'comppie':
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

                }

                if (this.state.data.length === 0) {
                    emotionSelect = null;
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
        
        return (
            <div className={classes.Content}>
                <div className={classes.Filters}>
                    <h1>{this.state.content['db-title']}</h1>
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
                        {this.state.content['db-select']}
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

export default Database;