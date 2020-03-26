import React from 'react';
import * as d3 from 'd3';
import guide from './Guide.css';

class PieChart extends React.Component {

    componentDidMount() {

        const names = this.props.emotionNames;
        const colors = this.props.emotionColors;
        const retrievedData = this.props.data;
        const isSamples = this.props.samples;
        const data = {};
        let total = 0;
        let foundEmotions = [];
        if (isSamples) {
            retrievedData.forEach(element => {
                names.forEach(e => {
                    if (!data[e]) data[e] = 0;
                    data[e] += parseInt(element[e]);
                });
            });
        } else {
            foundEmotions = retrievedData.map(e => {
                data[e.emotion] = parseInt(e.value);
                total += data[e.emotion];
                return e.emotion;
            });
            names.filter(e => {
                if (!foundEmotions.includes(e)) data[e] = 0;
                return e;
            });
        }




        // set the dimensions and margins of the graph
        var width = d3.selectAll("#" + this.props.vizid).node().getBoundingClientRect().width,
        height = 450,
        margin = 40;

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        var radius = Math.min(width, height) / 2 - margin

        // append the svg object to the div called 'my_dataviz'
        var svg = d3.select("#" + this.props.vizid)
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Create dummy data
        // var data = {a: 9, b: 20, c:30, d:8, e:12}

        // set the color scale
        var color = d3.scaleOrdinal()
                        .domain(names)
                        .range(colors);

        // Compute the position of each group on the pie:
        var pie = d3.pie()
                        .value(function(d) {return d.value; })
        var data_ready = pie(d3.entries(data))
        // Now I know that group A goes from 0 degrees to x degrees and so on.

        // shape helper to build arcs:
        var arcGenerator = d3.arc()
                                .innerRadius(0)
                                .outerRadius(radius)

        var mouseover = function(d) {
            d3.select(this).style("opacity", 1)
        }

        var mouseleave = function(d) {
            d3.select(this).style("opacity", 0)
        }

        // Build the pie chartpie: Basically, each part of the pie is a path that we build using the arc function.
        svg.selectAll('mySlices')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .attr('fill', function(d){ return(color(d.data.key)) })
            .style("opacity", 1)

        // Now add the annotation. Use the centroid method to get the best coordinates
        svg.selectAll('mySlices')
            .data(data_ready)
            .enter()
            .append('text')
            .text(function(d){ 
                if (!d.value) return;
                if (isSamples) return d.value;
                else {
                    if ((d.value / total) > 0.04) return parseInt(Math.round((d.value / total) * 100, 1)) + "%";
                    else return '';
                }
            })
            .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
            .attr("fill", "var(--text-darker)")
            .style("text-anchor", "middle")
            .style("font-size", 18)
        

        d3.selectAll('path').on("mouseover", function(d){

            d3.selectAll("path").style("opacity", 0.8)
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
                <div id={this.props.vizid}></div>
            </React.Fragment>
        );
    }
}

export default PieChart;