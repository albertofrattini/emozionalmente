import React from 'react';
import axios from 'axios';
import classes from '../Database.css';
import CircularPacking from '../../../components/UI/D3/CircularPacking';
import PieChart from '../../../components/UI/D3/PieChart';
import ConnectedScatterPlot from '../../../components/UI/D3/ConnectedScatterPlot';

class UserSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            evaluationsData: [],
            comparisonData: [],
            accuracyData: [],
            isDownloading: true,
            minAge: 0,
            maxAge: 100,
            sexFilter: '',
            nationalityFilter: '',
            emotionText: props.emotionText,
            emotionNames: props.emotionNames,
            emotionColors: props.emotionColors,
            selectedEmotion: props.emotionNames[0]
        }
    }

    componentDidMount() {

        this.downloadData();

    }

    componentDidUpdate () {

        if (this.state.isDownloading) {
            this.downloadData();
        }

    }

    downloadData = async () => {

        let filter = '?min=' + this.state.minAge + '&max=' + this.state.maxAge;
        if (this.state.sexFilter !== '') {
            filter = filter + '&s=' + this.state.sexFilter;
        }
        if (this.state.nationalityFilter !== '') {
            filter = filter + '&n=' + this.state.nationalityFilter;
        }

        const users = await axios.get('/api/data/database/users' + filter);
        const usersData = users.data;
        const nationalitiesDict = {};
        usersData.forEach(e => {
            if (!nationalitiesDict[e.nationality]) {
                nationalitiesDict[e.nationality] = 0;
            } 
            nationalitiesDict[e.nationality] += 1;
        });
        // CIRCULAR PACKING
        const evaluations = await axios.get('/api/data/database/evaluations' + filter);
        const evaluationsData = evaluations.data.quantity;
        // PIE CHART
        const comparison = await axios.get('/api/data/database/comparison' + filter + '&e=' + this.state.selectedEmotion);
        const comparisonData = comparison.data;
        // CONNECTED SCATTER PLOT
        const accuracy = await axios.get('/api/data/database/accuracy' + filter);
        const accuracyData = accuracy.data;

        this.setState({
            accuracyData: accuracyData,
            comparisonData: comparisonData,
            evaluationsData: evaluationsData,
            nationalitiesDict: nationalitiesDict,
            isDownloading: false
        });

    }

    applyFilters = () => {
        this.setState({ isDownloading: true });
    }

    resetFilters = () => {
        document.getElementById('listen-nationalities-select').selectedIndex = 0;
        document.getElementById('listen-gender-select').selectedIndex = 0;
        document.getElementById('listen-min-age').value = 0;
        document.getElementById('listen-max-age').value = 100;
        this.setState({
            sexFilter: '',
            nationalityFilter: '',
            minAge: 0,
            maxAge: 100,
            isDownloading: true
        });
    }

    render () {

        let listenFilters = null;
        let emotionSelect = null;



        if (!this.state.isDownloading) {

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


            listenFilters = (
                <div className={classes.FilterRow}>
                    <input id="listen-min-age" defaultValue={this.state.minAge} type="number" 
                        onChange={e => this.setState({ minAge: e.target.value })}></input>
                    <input id="listen-max-age" defaultValue={this.state.maxAge} type="number"
                        onChange={e => this.setState({ maxAge: e.target.value })}></input>
                    <select id="listen-gender-select" value={this.state.sexFilter}
                        onChange={event => this.setState({ sexFilter: event.target.value })}>
                        <option value="">Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <select id="listen-nationalities-select" value={this.state.nationalityFilter}
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
        }

        return (
            <React.Fragment>
                {
                    this.state.isDownloading ?
                        null
                        :
                        <React.Fragment>
                            {listenFilters}
                            <h4>Amount of samples evaluated n times</h4>
                            <CircularPacking 
                                data={this.state.evaluationsData}/>
                            <h4>Recognition of selected emotion</h4>
                            {emotionSelect}
                            <PieChart 
                                vizid={"comparisonchartpie"}
                                data={this.state.comparisonData}
                                emotionText={this.state.emotionText}
                                emotionNames={this.state.emotionNames}
                                emotionColors={this.state.emotionColors}/> 
                            <h4>Accuracy of recognition over time</h4>
                            <ConnectedScatterPlot
                                data={this.state.accuracyData}
                                emotionText={this.state.emotionText}
                                emotionNames={this.state.emotionNames}
                                emotionColors={this.state.emotionColors}/>
                        </React.Fragment>
                }
            </React.Fragment>
        );

    }
}

export default UserSection;
