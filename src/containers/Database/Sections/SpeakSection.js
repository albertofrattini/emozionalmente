import React from 'react';
import axios from 'axios';
import classes from '../Database.css';
import PieChart from '../../../components/UI/D3/PieChart';

class UserSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            samplesData: [],
            isDownloading: true,
            minAge: 0,
            maxAge: 100,
            sexFilter: '',
            nationalityFilter: '',
            emotionText: props.emotionText,
            emotionNames: props.emotionNames,
            emotionColors: props.emotionColors
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
        // PIE CHART
        const samples = await axios.get('/api/data/database/samples' + filter);
        const samplesData = samples.data;

        this.setState({
            samplesData: samplesData,
            nationalitiesDict: nationalitiesDict,
            isDownloading: false
        });

    }

    applyFilters = () => {
        this.setState({ isDownloading: true });
    }

    resetFilters = () => {
        document.getElementById('speak-nationalities-select').selectedIndex = 0;
        document.getElementById('speak-gender-select').selectedIndex = 0;
        document.getElementById('speak-min-age').value = 0;
        document.getElementById('speak-max-age').value = 100;
        this.setState({
            sexFilter: '',
            nationalityFilter: '',
            minAge: 0,
            maxAge: 100,
            isDownloading: true
        });
    }

    render () {

        let speakFilters = null;

        if (!this.state.isDownloading) {
            speakFilters = (
                <div className={classes.FilterRow}>
                    <input id="speak-min-age" defaultValue={this.state.minAge} type="number" 
                        onChange={e => this.setState({ minAge: e.target.value })}></input>
                    <input id="speak-max-age" defaultValue={this.state.maxAge} type="number"
                        onChange={e => this.setState({ maxAge: e.target.value })}></input>
                    <select id="speak-gender-select" value={this.state.sexFilter}
                        onChange={event => this.setState({ sexFilter: event.target.value })}>
                        <option value="">Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <select id="speak-nationalities-select" value={this.state.nationalityFilter}
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
                            {speakFilters}
                            <h4>Amount of samples per emotion</h4>
                            <PieChart 
                                samples
                                vizid={"sampleschartpie"}
                                data={this.state.samplesData}
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
