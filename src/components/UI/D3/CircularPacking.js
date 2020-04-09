import React from 'react';
import * as d3 from 'd3';
import guide from './Guide.css';

class CircularPacking extends React.Component {

    componentDidMount() {
        
        const data = this.props.data;
        const tt1 = this.props.tooltip_1;
        const tt2 = this.props.tooltip_2;
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

        var Tooltip = d3.select("body").append("div")
            .attr("class", guide.Tooltip)
            .style("opacity", 0)
            .style("font-size", "15px")
            .style("padding", "8px")
            .style("max-width", "128px")
            .style("text-align", "center");

        var mover = function(d) {
            Tooltip.transition()
                .duration(200)
                .style("opacity", 1);
            Tooltip.html(d.quantity + tt1 + d.count + tt2)
                .style("left", (d3.event.pageX + 16) + "px")
                .style("top", (d3.event.pageY - 24) + "px");
        } 

        var mmove = function(d) {
            Tooltip
                .html(d.quantity + tt1 + d.count + tt2)
                .style("left", (d3.event.pageX + 16) + "px")
                .style("top", (d3.event.pageY - 24) + "px")
        }

        var mleave = function(d) {
            Tooltip.transition()
                .duration(500)
                .style("opacity", 0);
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
            .on("mouseover", mover) 
            .on("mousemove", mmove)
            .on("mouseout", mleave)

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