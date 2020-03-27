import React from 'react';
import * as d3 from 'd3';
import guide from './Guide.css';

class ConnectedScatterPlot extends React.Component {

    componentDidMount() {
        
        const data = this.props.data;
        const names = this.props.emotionNames;
        const colors = this.props.emotionColors;     
        if (data.length === 1) {
            const begin = {
                date: '20-Mar-01'
            }
            names.map(e => {
                return begin[e] = 0
            });
            data.unshift(begin);
        }


        var margin = {top: 32, right: 32, bottom: 64, left: 32},
            width = d3.selectAll("#chartscatterplot").node().getBoundingClientRect().width - margin.left - margin.right,
            height = 520 - margin.top - margin.bottom;

        var parseDate = d3.timeParse("%y-%b-%d");

        var x = d3.scaleTime()
                    .range([0, width]);

        var y = d3.scaleLinear()
                    .range([height, 0]);

        var color = d3.scaleOrdinal().domain([...names, 'avg']).range([...colors, '#000']);

        var line = d3.line()
                    .x(function(d) { return x(d.date) })
                    .y(function(d) { return y(d.value) });
        
        
        var svg = d3.select("#chartscatterplot")
                        .append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                            .attr("transform",
                                "translate(" + margin.left + "," + margin.top + ")");
          
        var lowestValue = 100;
        var highestValue = 0;


        var dataReady = names.map(e => { 
            return {
                name: e,
                values: data.map(function(d) {
                    if (d[e] < lowestValue) {
                        lowestValue = d[e];
                    }
                    if (d[e] > highestValue) {
                        highestValue = d[e];
                    }
                    return {date: parseDate(d.date), value: d[e]};
                })
            };
        });

        var avgData = {
            name: 'avg',
            values: data.map(function(d) {
                let sum = 0;
                names.forEach(e => {
                    sum += d[e];
                });
                sum /= names.length;
                return {date: parseDate(d.date), value: sum};
            })
        }

        dataReady.push(avgData);

        if (lowestValue < 5) {
            lowestValue += 5;
        }

        x.domain(d3.extent(data, function(d) { return parseDate(d.date); }));
        y.domain([lowestValue - 5, highestValue + 5]);


        svg.selectAll("myLines")
            .data(dataReady)
            .enter()
            .append("path")
                .attr("d", function(d){ return line(d.values) } )
                .attr("stroke", function(d){ return color(d.name) })
                .style("stroke-width", function(d) {
                    if (d.name === 'avg') return 3.5;
                    else return 2; 
                })
                .style("fill", "none")
                .attr("opacity", 0.85)

        svg.selectAll("myDots")
            .data(dataReady)
            .enter()
                .append('g')
                .style("fill", function(d){ return color(d.name) })
            .selectAll("myPoints")
            .data(function(d){ return d.values })
            .enter()
            .append("circle")
                .attr("cx", function(d) { return x(d.date) } )
                .attr("cy", function(d) { return y(d.value) } )
                .attr("r", 4)
                .attr("stroke", "white")
                .style("opacity", 1)

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        
        svg.append("g")
            .call(d3.axisLeft(y));

        d3.selectAll('path').on("mouseenter", function(d){

            d3.selectAll("path").style("opacity", 0.2)
            d3.selectAll("circle").style("opacity", 0.0)
            d3.select(this).style("opacity", 1)
        
        })
        
        d3.selectAll('path').on("mouseleave", function(d){
        
            d3.selectAll("path").style("opacity", 1)
            d3.selectAll("circle").style("opacity", 1)
            
        })

    }

    render () {

        let emotions = this.props.emotionNames.map((e,i) => {
            return (
                <div className={guide.GuideContainer} key={e}>
                    <div className={guide.Square} style={{ backgroundColor: this.props.emotionColors[i] }}></div>
                    <div className={guide.Text}>{this.props.emotionText[i]}</div>
                </div>
            );
        });

        

        return (
            <React.Fragment>
                {emotions}
                <div className={guide.GuideContainer}>
                    <div className={guide.Square} style={{ backgroundColor: '#000' }}></div>
                    <div className={guide.Text}>Totale</div>
                </div>
                <div id="chartscatterplot"></div>
            </React.Fragment>
        );
    }
}

export default ConnectedScatterPlot;