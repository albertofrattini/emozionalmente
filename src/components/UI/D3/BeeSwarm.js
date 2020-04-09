import React from 'react';
import * as d3 from 'd3';
import classes from './BeeSwarm.css';
import guide from './Guide.css';




class BeeSwarm extends React.Component {

    componentDidMount () {

        const data = this.props.data;
        const nationalities_dict = this.props.nationalities;
        const keys = Object.keys(nationalities_dict).length;

        var margin = {top: 64, right: 32, bottom: 64, left: 32},
            width = d3.selectAll("#killingbees").node().getBoundingClientRect().width,
            height = 230 * keys - margin.top - margin.bottom,
            padding = window.innerWidth * 0.08;

        if (width > 670) {
            padding = window.innerWidth * 0.06;
        }

        let svg = d3.select('#killingbees').append('svg')
                        .attr('width', width)
                        .attr('height', height);

        let colors = d3.scaleOrdinal()
                        .domain(['male', 'female'])
                        .range(['#1c77c3', '#f285a5']);

        let x = d3.scaleLinear()
                    .range([0 + padding * 0.1, width - padding * 2]);


        let y = d3.scaleLinear().range([0 + padding, height - 5]);

        let y1 = d3.scalePoint()
                    .domain([...Object.keys(nationalities_dict)].sort())
                    .range([0 + 70, height - 100]);
        
        let y2 = d3.scalePoint()
                    .domain(["male", "female"])
                    .range([0 + 70, height - 100]);

        let size = d3.scaleSqrt()
                        .range([1,15]);

        let ageAxis = d3.axisBottom(x)
                            .tickSize(height - 20);
        let nationalityAxis = d3.axisRight(y1).ticks().tickSize(width - window.innerWidth * 2);
        let genderAxis = d3.axisRight(y2).ticks().tickSize(width - window.innerWidth * 2);

        // starting visualization with:
        let data_setX = "age";
        let data_set = "none";

        let xdom = d3.extent(data, function(d) {
            d.age = +d.age;
            return d.age;
        });
        x.domain([xdom[0] - 8, xdom[1] + 5]);

        y.domain(d3.extent(data, function (d) {
            return parseInt(d.number);
        }));

        size.domain(d3.extent(data, function(d) {
            return d.number / 1.4; }
        ));

        function tick(){
            d3.selectAll('.circ')
                .attr('cx', function(d){return d.x})
                .attr('cy', function(d){return d.y})
        };

        var Tooltip = d3.select("body").append("div")
            .attr("class", guide.Tooltip)
            .style("opacity", 0)
            .style("font-size", "18px");

        var mover = function(d) {
            Tooltip.transition()
                .duration(200)
                .style("opacity", 1);
            Tooltip.html(d.number)
                .style("left", (d3.event.pageX + 16) + "px")
                .style("top", (d3.event.pageY - 24) + "px");
        } 

        var mmove = function(d) {
            Tooltip
                .html(d.number)
                .style("left", (d3.event.pageX + 16) + "px")
                .style("top", (d3.event.pageY - 24) + "px")
        }

        var mleave = function(d) {
            Tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        }

        svg.append("g")
            .call(ageAxis)
            .classed(classes.xAxis, true);


        svg.append("g")
            .attr("transform","translate(" + ( width - padding * 1.5 ) + ",0)")
            .classed(classes.yAxis, true)
            .attr("id", "ya");

        svg.selectAll('.circ').data(data).enter()
            .append('circle').classed('circ', true)
            .attr('r', function(d) { return size(d.number) })
            .attr('cx', function(d){ return x(d.age); })
            .attr('cy', function(d){ return height/2; })
            .attr("fill", function(d) { return colors(d.sex); })
            .on("mouseover", mover) 
            .on("mousemove", mmove)
            .on("mouseout", mleave)

        let simulation = d3.forceSimulation(data)
                            .force('x', d3.forceX( function(d){
                                return x(d[data_setX])
                            }).strength(0.99))
                            .force('y', d3.forceY( height/2 ).strength(0.99))
                            .force('collide', d3.forceCollide(function(d) {
                                return size(d.number) + 1
                            }).iterations(32))
                            .alphaDecay(0)
                            .alpha(0.1)
                            .on('tick', tick);

        simulation.force('collide', d3.forceCollide(function(d) {
            return size(d.number) + 1
        }).iterations(32));

        d3.selectAll('.circ').on("mouseenter", function(d){

            d3.selectAll(".circ").style("opacity", 0.5)
            d3.select(this).style("opacity", 1)
        
        })
      
        d3.selectAll('.circ').on("mouseleave", function(d){
      
            d3.selectAll(".circ").style("opacity", 1)
          
        })




        d3.selectAll('#btn_sel').on('click', function () {

            data_set = this.value;

            if (data_set === "nationality") {

                let axisSelection = d3.select("#ya")
                                        .call(nationalityAxis)
                                        .classed(classes.yAxis, true)

                axisSelection.selectAll('.tick text')
                                .text(function(d){
                                    return d;
                                })
                
            } else if (data_set === "sex") {

                let axisSelection = d3.select("#ya")
                                        .call(genderAxis)
                                        .classed(classes.yAxis, true)
                                    
                axisSelection.selectAll('.tick text')
                                .text(function(d){
                                    switch(d){
                                        case "male":
                                            return "Male";
                                            break;
                                        case "female":
                                            return "Female";
                                            break;
                                    }
                                })
                                    
            }


            simulation.force('y', d3.forceY(function(d){

                if (data_set === "nationality"){
                  return y1(d[data_set])
                }else if(data_set === "sex"){
                  return y2(d[data_set])
                }

            }).strength(0.5))

            simulation.force('collide', d3.forceCollide(function(d) {
                return size(d.number) + 1
            }).iterations(32))
        
            simulation
              .alphaDecay(0.1)
              .alpha(0.5)
              .restart()


        })
    }


    render () {

        let genders = (
            <React.Fragment>
                {
                    [...Object.keys(this.props.genders)].map(e => {
                        return (
                            <div key={e} className={guide.GuideContainer}>
                                <div className={guide.Square} style={{ backgroundColor: e === 'male' ? '#1c77c3' : '#f285a5' }}></div>
                                <div className={guide.Text}>{this.props.genders[e]}</div>
                            </div>
                        );
                    })
                }
            </React.Fragment>
        );

        return (
            <React.Fragment>
                {genders}
                <div id="killingbees" className={classes.Container}></div>
            </React.Fragment>
        );

    }







}


export default BeeSwarm;