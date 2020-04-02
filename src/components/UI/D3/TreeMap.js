import React from 'react';
import * as d3 from 'd3';
import guide from './Guide.css';

class TreeMap extends React.Component {

    componentDidMount() {

        const names = this.props.emotionNames;
        const colors = this.props.emotionColors;
        const texts = this.props.emotionText;
        const retrievedData = this.props.data;
        const data = [];
        data.push({
            name: "Origin",
            parent: "",
            value: ""
        });

        names.forEach((n,i) => {
            let total = 0;
            retrievedData.forEach(d => {
                total += d[n];
            });
            data.push({
                name: texts[i],
                parent: "Origin",
                value: total
            });
        }); 


        var margin = {top: 32, right: 0, bottom: 32, left: 0},
            width = d3.selectAll("#treemap").node().getBoundingClientRect().width - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var color = d3.scaleOrdinal().domain(texts).range(colors);

        var Tooltip = d3.select("#treemap")
                            .append("div")
                            .style("position", "absolute")
                            .style("visibility", "hidden")
                            .style("background-color", "white")
                            .style("border", "solid")
                            .style("border-width", "1px")
                            .style("border-radius", "4px")
                            .style("padding", "5px")

        var mouseover = function(d) {
            Tooltip
                .style("visibility", "visible");
        }
        
        var mousemove = function(d) {
            Tooltip
                .html(d.value)
                .style("left", (d3.mouse(this)[0]+630) + "px")
                .style("top", (d3.mouse(this)[1]+50) + "px")
        }

        var mouseleave = function(d) {
            Tooltip
                .style("visibility", "hidden")
        }

        // append the svg object to the body of the page
        var svg = d3.select("#treemap")
                        .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform",
                                "translate(" + margin.left + "," + margin.top + ")");

        var root = d3.stratify()
            .id(function(d) { return d.name; })
            .parentId(function(d) { return d.parent; })  
            (data);
        root.sum(function(d) { return +d.value })  
        
        d3.treemap()
            .size([width, height])
            .padding(4)
            (root)

        svg.selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            // .style("stroke", "black")
            .style("fill", function(d) {
                return color(d.data.name);
            })
            .on("mouseover", mouseover) 
            .on("mousemove", mousemove)
            .on("mouseout", mouseleave)

        // and to add the text labels
        svg.selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
            .attr("x", function(d){ return d.x0+10})    // +10 to adjust position (more right)
            .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
            .text(function(d){ return d.data.name})
            .attr("font-size", "18px")
            .attr("fill", "white")

        d3.selectAll('rect').on("mouseenter", function(d){

            d3.selectAll("rect").style("opacity", 0.4)
            d3.select(this).style("opacity", 1)
        
        })

        d3.selectAll('rect').on("mouseleave", function(d){
        
            d3.selectAll("rect").style("opacity", 1)
            
        })


    }

    render () {

        return (
            <React.Fragment>
                <div id="treemap"></div>
            </React.Fragment>
        );
    }
}

export default TreeMap;