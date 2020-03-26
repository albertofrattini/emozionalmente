import React from 'react';
import * as d3 from 'd3';

class ConnectedScatter extends React.Component {


    componentDidMount () {

        var data = this.props.data;

        var margin = {top: 16, right: 32, bottom: 64, left: 32},
            width = d3.selectAll("#chartscatter").node().getBoundingClientRect().width - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var svg = d3.select("#chartscatter")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        var minValue = 0;
        var maxValue = 0;
        var dataReady = data.map(e => {
            if (e.value > maxValue) {
                maxValue = e.value;
            }
            return {
                date: d3.timeParse("%y-%b-%d")(e.date),
                value: e.value
            };
        });

        
        var x = d3.scaleTime()
                        .domain(d3.extent(dataReady, function(d) { return d.date; }))
                        .range([ 0, width ]);
        
        svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));
                
        var y = d3.scaleLinear()
                    .domain( [minValue, maxValue + 10])
                    .range([ height, 0 ]);
       
        svg.append("g")
                .call(d3.axisLeft(y));

        svg.append("path")
            .datum(dataReady)
            .attr("fill", "none")
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.value) })
                )

        svg
            .append("g")
            .selectAll("dot")
            .data(dataReady)
            .enter()
            .append("circle")
                .attr("cx", function(d) { return x(d.date) } )
                .attr("cy", function(d) { return y(d.value) } )
                .attr("r", 5)
                .attr("fill", "#69b3a2")


    }


    render () {

        return (<div id="chartscatter"></div>);
    }
}

export default ConnectedScatter;