import React from 'react';
import axios from 'axios';
import classes from '../Database.css';
import ConnectedScatter from '../../../components/UI/D3/ConnectedScatter';
import StackedAreaChart from '../../../components/UI/D3/StackedAreaChart';
import BeeSwarm from '../../../components/UI/D3/BeeSwarm';

class UserSection extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            samplesData: [],
            usersData: [],
            evaluationsQuantitiesPerDay: [],
            nationalitiesDict: {},
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

        // BEE SWARM
        const users = await axios.get('/api/data/database/users' + filter);
        const usersData = users.data;
        const nationalitiesDict = {};
        usersData.forEach(e => {
            if (!nationalitiesDict[e.nationality]) {
                nationalitiesDict[e.nationality] = 0;
            } 
            nationalitiesDict[e.nationality] += 1;
        });
        // STACKED AREA CHART
        const samples = await axios.get('/api/data/database/samples' + filter);
        const samplesData = samples.data;
        // CIRCULAR PACKING
        const evaluations = await axios.get('/api/data/database/evaluations' + filter);
        const evaluationsQuantitiesPerDay = evaluations.data.scatter;

        this.setState({
            samplesData: samplesData,
            evaluationsQuantitiesPerDay: evaluationsQuantitiesPerDay,
            usersData: usersData,
            nationalitiesDict: nationalitiesDict,
            isDownloading: false
        });

    }

    applyFilters = () => {
        this.setState({ isDownloading: true });
    }

    resetFilters = () => {
        document.getElementById('user-nationalities-select').selectedIndex = 0;
        document.getElementById('user-gender-select').selectedIndex = 0;
        document.getElementById('user-min-age').value = 0;
        document.getElementById('user-max-age').value = 100;
        this.setState({
            sexFilter: '',
            nationalityFilter: '',
            minAge: 0,
            maxAge: 100,
            isDownloading: true
        });
    }

    render () {

        let usersFilters = null;

        if (!this.state.isDownloading) {
            usersFilters = (
                <div className={classes.FilterRow}>
                    <input id="user-min-age" defaultValue={this.state.minAge} type="number" 
                        onChange={e => this.setState({ minAge: e.target.value })}></input>
                    <input id="user-max-age" defaultValue={this.state.maxAge} type="number"
                        onChange={e => this.setState({ maxAge: e.target.value })}></input>
                    <select id="user-gender-select" value={this.state.sexFilter}
                        onChange={event => this.setState({ sexFilter: event.target.value })}>
                        <option value="">Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <select id="user-nationalities-select" value={this.state.nationalityFilter}
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
                            {usersFilters}
                            <h4>Users divided by age, gender and nationality</h4>
                            <BeeSwarm 
                                data={this.state.usersData}
                                nationalities={this.state.nationalitiesDict}/>
                            <h4>Users recordings over time</h4>
                            <StackedAreaChart
                                data={this.state.samplesData}
                                emotionText={this.state.emotionText}
                                emotionNames={this.state.emotionNames}
                                emotionColors={this.state.emotionColors}/>
                            <h4>Users evaluations over time</h4>
                            <ConnectedScatter
                                data={this.state.evaluationsQuantitiesPerDay}/>
                        </React.Fragment>
                }
            </React.Fragment>
        );

    }
}

export default UserSection;
