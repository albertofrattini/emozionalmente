import React from 'react';
import * as d3 from 'd3';
import guide from './Guide.css';

class ConnectedScatterPlot extends React.Component {

    componentDidMount() {
        
        const data = this.props.data;
        const names = this.props.emotionNames;
        const colors = this.props.emotionColors;        

        var margin = {top: 32, right: 32, bottom: 64, left: 32},
            width = d3.selectAll("#chartscatterplot").node().getBoundingClientRect().width - margin.left - margin.right,
            height = 520 - margin.top - margin.bottom;

        var parseDate = d3.timeParse("%y-%b-%d");

        var x = d3.scaleTime()
                    .range([0, width]);

        var y = d3.scaleLinear()
                    .range([height, 0]);

        var color = d3.scaleOrdinal().domain(names).range(colors);

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
                                
        var dataReady = names.map(e => { 
            return {
                name: e,
                values: data.map(function(d) {
                    return {date: parseDate(d.date), value: d[e]};
                })
            };
        });

        x.domain(d3.extent(data, function(d) { return parseDate(d.date); }));
        y.domain([0, 100]);


        svg.selectAll("myLines")
            .data(dataReady)
            .enter()
            .append("path")
                .attr("d", function(d){ return line(d.values) } )
                .attr("stroke", function(d){ return color(d.name) })
                .style("stroke-width", 2)
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

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        
        svg.append("g")
            .call(d3.axisLeft(y));

        d3.selectAll('path').on("mouseenter", function(d){

            d3.selectAll("path").style("opacity", 0.2)
            d3.select(this).style("opacity", 1)
        
        })
        
        d3.selectAll('path').on("mouseleave", function(d){
        
            d3.selectAll("path").style("opacity", 1)
            
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
                <div id="chartscatterplot"></div>
            </React.Fragment>
        );
    }
}

export default ConnectedScatterPlot;