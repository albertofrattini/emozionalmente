import React from 'react';
import * as d3 from 'd3';
import classes from './BeeSwarm.css';
import guide from './Guide.css';




class BeeSwarm extends React.Component {

    componentDidMount () {

        const data = this.props.data;
        const nationalities_dict = this.props.nationalities;

        var margin = {top: 64, right: 32, bottom: 64, left: 32},
            width = d3.selectAll("#killingbees").node().getBoundingClientRect().width,
            height = 700 - margin.top - margin.bottom,
            padding = window.innerWidth * 0.08; 

        let svg = d3.select('#killingbees').append('svg')
                        .attr('width', width)
                        .attr('height', height);

        let colors = d3.scaleOrdinal()
                        .domain(['male', 'female'])
                        .range(['#1c77c3', '#f285a5']);

        let x = d3.scaleLinear()
                    .range([0 + padding, width - padding]);

        let y = d3.scalePoint()
                    .domain([...Object.keys(nationalities_dict)].sort())
                    .range([0 + 80, height - 80]);

        let size = d3.scaleSqrt()
                        .range([2,20]);

        let ageAxis = d3.axisBottom(x)
                            .tickSize(height - 10);

        let nationalityAxis = d3.axisLeft(y).ticks().tickSize(width - window.innerWidth * 0.15).tickPadding(10);

        let data_setX = "age";
        let data_setY = "nationality";

        x.domain(d3.extent(data, function(d) {
            d.age = +d.age;
            return d.age;
        }));

        size.domain(d3.extent(data, function(d) {
            return d.number * 2 / 3; }
        ));

        // start ticks for animations and transitions

        function tick(){
            d3.selectAll('.circ')
                .attr('cx', function(d){return d.x})
                .attr('cy', function(d){return d.y})
        };

        var Tooltip = d3.select("#tooltip")
            .style("opacity", 0)
            .style("background-color", "white")
            .style("height", "32px")
            .style("padding", "5px")
            .style("margin", "16px")
            .style("font-size", "18px")

        var mouseover = function(d) {
            Tooltip
            .html('<b>' + d.number + '</b>' +  ' are ' + '<u>' + d.age + '</u>' + ' years old')
            .style("opacity", 1);
        }

        var mouseleave = function(d) {
            Tooltip
            .style("opacity", 0)
        }

        svg.append("g")
            .call(ageAxis)
            .classed(classes.xAxis, true);


        svg.append("g")
            .call(nationalityAxis)
            .attr("transform","translate(" + ( width - padding ) + ",0)")
            .classed(classes.yAxis, true);

        // Draw circles
        svg.selectAll('.circ').data(data).enter()
            // .filter(function(d) { return d.number > 3 })
            .append('circle').classed('circ', true)
            .attr('r', function(d) { return size(d.number) })
            .attr('cx', function(d){ return x(d.age); })
            .attr('cy', function(d){ return y(d.nationality); })
            .attr("fill", function(d) { return colors(d.sex); })
            .on("mouseover", mouseover) // What to do when hovered
            // .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            // .attr("stroke", "rgba(0,0,0,.2)")
            // .attr("stroke-width", 1)
            .call(d3.drag() // call specific function when circle is dragged
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // Start force layout
        let simulation = d3.forceSimulation(data)
                            .force('x', d3.forceX( function(d){
                                return x(d[data_setX])
                            }).strength(0.99))
                            .force('y', d3.forceY( function(d) {
                                return y(d[data_setY])
                            } ).strength(0.99))
                            .force('collide', d3.forceCollide(function(d) {
                                return size(d.number) + 1
                            }).iterations(32))
                            .alphaDecay(0)
                            .alpha(0.1)
                            .on('tick', tick);

        simulation.force('collide', d3.forceCollide(function(d) {
            return size(d.number) + 1
        }).iterations(32));

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
                <div className={guide.GuideContainer}>
                    <div className={guide.Square} style={{ backgroundColor: '#1c77c3' }}></div>
                    <div className={guide.Text}>male</div>
                </div>
                <div className={guide.GuideContainer}>
                    <div className={guide.Square} style={{ backgroundColor: '#f285a5'}}></div>
                    <div className={guide.Text}>female</div>
                </div>
                <div id="killingbees" className={classes.Container}></div>
                <div id="tooltip"></div>
            </React.Fragment>
        );

    }







}


export default BeeSwarm;