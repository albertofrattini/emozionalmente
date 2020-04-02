import React from 'react';
import * as d3 from 'd3';

class CircularPacking extends React.Component {

    componentDidMount() {
        
        const data = this.props.data;
        const counts = data.map(e => {
            return e.count;
        });
        const quantities = data.map(e => {
            return e.quantity;
        }); 
        const minCount = Math.min(...quantities);
        const maxCount = Math.max(...quantities);
        
        var margin = {top: 0, right: 32, bottom: 64, left: 32};
        var width = d3.selectAll("#chartpacking").node().getBoundingClientRect().width;
        var height = 550 - margin.top - margin.bottom;

        var svg = d3.select("#chartpacking")
                    .append("svg")
                        .attr("width", width)
                        .attr("height", height)

        
                        
        var color = d3.scaleOrdinal()
            .domain(counts)
            .range(['rgba(249, 170, 51, 1)']);

        var size = d3.scaleSqrt()
            .domain([minCount, maxCount])
            .range([5,70])

        var Tooltip = d3.select("#chartpacking")
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
                .html('<b>' + d.quantity + '</b> samples where evaluated ' + '<u>' + d.count + '</u> times')
                .style("left", (d3.mouse(this)[0]+200) + "px")
                .style("top", (d3.mouse(this)[1]+100) + "px")
        }

        var mouseleave = function(d) {
            Tooltip
                .style("visibility", "hidden")
        }

        var node = svg.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", function(d){ return size(d.quantity); })
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .style("fill", function(d){ return color(d.count)})
            .style("fill-opacity", 1)
            .on("mouseover", mouseover) 
            .on("mousemove", mousemove)
            .on("mouseout", mouseleave)

        var simulation = d3.forceSimulation()
            .force("center", d3.forceCenter(width / 2, height / 2)) // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.quantity)+3) }).iterations(1))

        simulation
            .nodes(data)
            .on("tick", function(d){
                node
                    .attr("cx", function(d){ return d.x; })
                    .attr("cy", function(d){ return d.y; })
            });

        d3.selectAll('circle').on("mouseenter", function(d){

            d3.selectAll("circle").style("opacity", 0.5)
            d3.select(this).style("opacity", 1)
        
        })
      
        d3.selectAll('circle').on("mouseleave", function(d){
      
            d3.selectAll("circle").style("opacity", 1)
          
        })


    }

    render () {
        return (
            <React.Fragment>
                <div id="chartpacking"></div>
            </React.Fragment>

        );
    }
}

export default CircularPacking;