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
        
        var margin = {top: 64, right: 32, bottom: 64, left: 32};
        var width = d3.selectAll("#chartpacking").node().getBoundingClientRect().width;
        var height = 600 - margin.top - margin.bottom;

        var svg = d3.select("#chartpacking")
                    .append("svg")
                        .attr("width", width)
                        .attr("height", height)


        // Filter a bit the data -> more than 1 million inhabitants
        // data = data.filter(function(d){ return d.value>10000000 })

        // Color palette for continents?
        var color = d3.scaleOrdinal()
            // .domain(["Asia", "Europe", "Africa", "Oceania", "Americas"])
            .domain(counts)
            .range(d3.schemeCategory10);

        // Size scale for countries
        var size = d3.scaleSqrt()
            .domain([minCount, maxCount])
            .range([10,80])  // circle will be between 7 and 55 px wide

        // create a tooltip
        var Tooltip = d3.select("#packingtooltip")
            .style("height", "32px")
            .style("opacity", 0)
            .style("background-color", "white")
            .style("padding", "5px")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function(d) {
            Tooltip
            .html('<b>' + d.quantity + '</b> samples where evaluated ' + '<u>' + d.count + '</u> times')
            .style("opacity", 1);
        }
        // var mousemove = function(d) {
        //     Tooltip
        //     .html('<u>' + d.key + '</u>' + "<br>" + d.value + " inhabitants")
        //     .style("left", (d3.mouse(this)[0]+20) + "px")
        //     .style("top", (d3.mouse(this)[1]) + "px")
        // }
        var mouseleave = function(d) {
            Tooltip
            .style("opacity", 0)
        }

        // Initialize the circle: all located at the center of the svg area
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
            .style("fill-opacity", 0.8)
            // .attr("stroke", "black")
            // .style("stroke-width", 1)
            .on("mouseover", mouseover) // What to do when hovered
            // .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .call(d3.drag() // call specific function when circle is dragged
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // Features of the forces applied to the nodes:
        var simulation = d3.forceSimulation()
            .force("center", d3.forceCenter(width / 2, height / 2)) // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.quantity)+3) }).iterations(1))


        // Apply these forces to the nodes and update their positions.
        // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
        simulation
            .nodes(data)
            .on("tick", function(d){
                node
                    .attr("cx", function(d){ return d.x; })
                    .attr("cy", function(d){ return d.y; })
            });


        // What happens when a circle is dragged?
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(.03).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(.03);
            d.fx = null;
            d.fy = null;
        }


    }

    render () {
        return (
            <React.Fragment>
                <div id="chartpacking"></div>
                <div id="packingtooltip"></div>
            </React.Fragment>

        );
    }
}

export default CircularPacking;