import React, { Component } from 'react';
import classes from './Database.css';
import axios from 'axios';
import CircularPacking from '../../components/UI/D3/CircularPacking';
import PieChart from '../../components/UI/D3/PieChart';
import ConnectedScatterPlot from '../../components/UI/D3/ConnectedScatterPlot';
import ConnectedScatter from '../../components/UI/D3/ConnectedScatter';
import StackedAreaChart from '../../components/UI/D3/StackedAreaChart';
import BeeSwarm from '../../components/UI/D3/BeeSwarm';

class Database extends Component {

    state = {
        sexFilter: '',
        nationalityFilter: '',
        minAge: 0,
        maxAge: 100,
        isDownloading: true,
        graphId: 'bee',
        nationalitiesDict: null
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
        const users = await axios.get('/api/data/database/users' + '?min=' + this.state.minAge + '&max=' + this.state.maxAge);
        const data = users.data;
        const nationalitiesDict = {};
        data.forEach(e => {
            if (!nationalitiesDict[e.nationality]) {
                nationalitiesDict[e.nationality] = 0;
            } 
            nationalitiesDict[e.nationality] += 1;
        });
        
        this.setState({
            content: content,
            emotionText: emotionText,
            emotionNames: emotionNames,
            emotionColors: emotionColors,
            nationalitiesDict: nationalitiesDict,
            data: data,
            selectedEmotion: emotionNames[0],
            isDownloading: false
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
            case 'sumpie':
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

        if (this.state.nationalitiesDict) {
            filters = (
                <div className={classes.FilterRow}>
                    <p>Click on the buttons to create personalized filters, then click Apply. Click on Clear to reset the filters.</p>
                    <input id="min-age" defaultValue={this.state.minAge} type="number" 
                        onChange={e => this.setState({ minAge: e.target.value })}></input>
                    <input id="max-age" defaultValue={this.state.maxAge} type="number"
                        onChange={e => this.setState({ maxAge: e.target.value })}></input>
                    <select id="gender-select" value={this.state.sexFilter}
                        onChange={event => this.setState({ sexFilter: event.target.value })}>
                        <option value="">Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <select id="nationalities-select" value={this.state.nationalityFilter}
                        onChange={event => this.setState({ nationalityFilter: event.target.value })}>
                        <option value="">Nationality</option>
                        {
                            [...Object.keys(this.state.nationalitiesDict)].map((e,i) => {
                                return <option key={i} value={e}>{e}</option>
                            })
                        }
                    </select>
                    <button onClick={this.resetFilters}>Clear Filters</button>
                    <button onClick={this.applyFilters}>Apply</button>
                </div>
            );

            if (!this.state.isDownloading) {

                switch(this.state.graphId) {
                    case 'bee':
                        let totalusers = 0;
                        this.state.data.forEach(e => {
                            totalusers += parseInt(e.number);
                        });
                        graphDescription = (
                            <React.Fragment>
                                <h3>
                                    This graph shows our users and only the ones that contributed at least once with a recording or an evaluation.
                                    The vertical axe shows the nationality, while the horizontal one the age. We have <b>{totalusers}</b> users that contributed!
                                </h3>
                                <p>
                                    Hover on the circles to know more.
                                </p>
                            </React.Fragment>
                        );
                        filteredGraph = (
                            <BeeSwarm 
                                data={this.state.data}
                                nationalities={this.state.nationalitiesDict}/>
                        );
                        break;
                    case 'stacked':
                        graphDescription = (
                            <React.Fragment>
                                <h3>
                                    This graph shows the amount of samples recorded by the users in time, divided by emotion.
                                </h3>
                                <p>
                                    Try to move on the graph to highlight an emotion.
                                </p>
                            </React.Fragment>
                        );
                        filteredGraph = (
                            <StackedAreaChart
                                    data={this.state.data}
                                    emotionText={this.state.emotionText}
                                    emotionNames={this.state.emotionNames}
                                    emotionColors={this.state.emotionColors}/>
                        );
                        break;
                    case 'scatter':
                        graphDescription = (
                            <React.Fragment>
                                <h3>
                                    This graph shows the amount of vocal samples listened each day.
                                </h3>
                            </React.Fragment>
                        );
                        filteredGraph = (
                            <ConnectedScatter
                                    data={this.state.data}/>
                        );
                        break;
                    case 'packing':
                        let totaleval = 0;
                        this.state.data.forEach(e => {
                            totaleval += e.quantity * e.count;
                        })
                        graphDescription = (
                            <React.Fragment>
                                <h3>
                                    Every circle represents a number. The bigger the circle, the more samples have been evaluated
                                    that specific amount of times. Until now, there has been <b>{totaleval}</b> evaluations
                                    on Emozionalmente!
                                </h3>
                                <p>
                                    Hover on the circles to know more.
                                </p>
                            </React.Fragment>
                        );
                        filteredGraph = (
                            <CircularPacking 
                                    data={this.state.data}/>
                        );
                        break;
                    case 'comppie':
                        graphDescription = (
                            <React.Fragment>
                                <h3>
                                    This pie tells how every emotion has been recognized by the users. 
                                </h3>
                                <p>
                                    Only percentage higher than 3% are reported. Hover on one to highlight the slice.
                                </p>
                            </React.Fragment>
                        );
                        emotionSelect = (
                            <select className={classes.EmotionSelect} id="emotion-select" value={this.state.selectedEmotion}
                                onChange={e => {
                                    this.setState({
                                        isDownloading: true,
                                        selectedEmotion: e.target.value
                                    });
                                }}>
                                {
                                    this.state.emotionNames.map((e,i) => {
                                        return <option key={i} value={e}>{this.state.emotionText[i]}</option>
                                    })
                                }
                            </select>
                        );
                        filteredGraph = (
                            <PieChart 
                                vizid={"comparisonchartpie"}
                                data={this.state.data}
                                emotionText={this.state.emotionText}
                                emotionNames={this.state.emotionNames}
                                emotionColors={this.state.emotionColors}/>
                        );
                        break;
                    case 'scatterplot':
                        graphDescription = (
                            <React.Fragment>
                                <h3>
                                    This graph represents the accuracy of recognition in time for each emotion.
                                </h3>
                                <p>
                                    Hover on one line to highlight it.
                                </p>
                            </React.Fragment>
                        );
                        filteredGraph = (
                            <ConnectedScatterPlot
                                data={this.state.data}
                                emotionText={this.state.emotionText}
                                emotionNames={this.state.emotionNames}
                                emotionColors={this.state.emotionColors}/>
                        );
                        break;
                    case 'sumpie':
                        let total = 0;
                        this.state.data.forEach(e => {
                            this.state.emotionNames.forEach(n => {
                                total += e[n];
                            });
                        });
                        graphDescription = (
                            <React.Fragment>
                                <h3>
                                    This graph represents the amount of samples recorded for each emotion. Until now,
                                    we count <b>{total}</b> samples on Emozionalmente!
                                </h3>
                                <p>
                                    Hover on one to highlight the slice.
                                </p>
                            </React.Fragment>
                        );
                        filteredGraph = (
                            <PieChart 
                                samples
                                vizid={"sampleschartpie"}
                                data={this.state.data}
                                emotionText={this.state.emotionText}
                                emotionNames={this.state.emotionNames}
                                emotionColors={this.state.emotionColors}/>
                        );
                    default:
                        console.log('graph not found!');    
                }
            }

        }

        return (
            <div className={classes.Content}>
                <div className={classes.Filters}>
                    <div className={classes.SectionFilter}>
                        <div className={classes.Drawer}>
                            <div className={classes.SectionElement}>
                                Users
                                <div className={classes.SectionDrawer}>
                                    <div onClick={() => this.changeGraph('bee')}>BeeSwarm</div>
                                    <div onClick={() => this.changeGraph('stacked')}>StackedAreaChart</div>
                                    <div onClick={() => this.changeGraph('scatter')}>ConnectedScatter</div>
                                </div>
                            </div>
                            <div className={classes.SectionElement}>
                                Listen
                                <div className={classes.SectionDrawer}>
                                    <div onClick={() => this.changeGraph('packing')}>CircularPacking</div>
                                    <div onClick={() => this.changeGraph('comppie')}>ComparisonPieChart</div>
                                    <div onClick={() => this.changeGraph('scatterplot')}>ConnectedScatterPlot</div>
                                </div>
                            </div>
                            <div className={classes.SectionElement}>
                                Speak
                                <div className={classes.SectionDrawer}>
                                    <div onClick={() => this.changeGraph('sumpie')}>TotalSamplesPie</div>
                                </div>
                            </div>
                        </div>
                        Choose Graph
                        <div className={classes.Icon}>
                            <div style={{ width: '24px' }}></div>
                            <div style={{ width: '16px' }}></div>
                            <div style={{ width: '24px' }}></div>
                        </div>
                    </div>
                    {filters}
                </div>
                <div className={classes.Graph}>
                    <h1>The Emotional Database</h1>
                    {graphDescription}
                    {emotionSelect}
                    {filteredGraph}
                </div>
            </div>
        );
    }

}

export default Database;