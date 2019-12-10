import React, { Component } from 'react';
import * as d3 from 'd3';
import classes from './BubbleChart.css';
// import axios from 'axios';

class BubbleChart extends Component {

    state = {
        data: [6, 17, 34, 55, 78],
        colors: ['var(--logo-green)', 'var(--logo-orange)', 'var(--logo-red)', 'var(--logo-violet)', 'var(--logo-blue)']
    }

    // componentDidMount () {
    //     axios.get('/api/sentences?quantity=5')
    //         .then(response => {
    //             this.setState({ data: response.data });
    //         });
    // }

    renderData = () => {
        var x = d3.scaleLinear()
            .domain([0, d3.max(this.state.data)])
            .range([0, this.props.width * 0.8]);

        d3.select('#chart')
            .selectAll('div')
                .data(this.state.data)
            .enter().append('div')
                .style('width', (d) => x(d) + 'px')
                .style('background-color', (d, i) => this.state.colors[i])
                .text((d) => d);
    }

    render () {

        this.renderData();

        return (
            <div id="chart" className={classes.chart}></div>
        );
    }

    

}

export default BubbleChart;
