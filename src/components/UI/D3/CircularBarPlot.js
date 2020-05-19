import React from 'react';
import * as d3 from 'd3';
import guide from './Guide.css';

class CircularBarPlot extends React.Component {

    componentDidMount() {

        let data = this.props.data.values;
        const ptt1 = this.props.personal_tooltip_1;
        const ptt2 = this.props.personal_tooltip_2;
        const tt1 = this.props.tooltip_1;
        const tt2 = this.props.tooltip_2;
        const tmean = this.props.mean;
        const user = this.props.data.uid;
        let userlistens = 0;
        data.forEach(e => {
            if (e.id === user) userlistens = parseInt(e.value);
        });
        
        var width = d3.selectAll("#circularbarplot").node().getBoundingClientRect().width,
        height = 500,
        innerRadius = 80,
        outerRadius = Math.min(width, height) / 1.6;
        
        // append the svg object to the body of the page
        var svg = d3.select('#circularbarplot')
                        .append("svg")
                        .attr("width", width/* + margin.left + margin.right*/)
                        .attr("height", height/* + margin.top + margin.bottom*/)
                        //.style("transform", "rotate(-92deg)")
                        .append("g")
                        .attr("transform", "translate(" + width / 2 + "," + ( height / 1.4 )+ ")"); 
        
        var maxY = 0;
        data.forEach(e => {
            e.value = parseInt(e.value);
            if (e.value > maxY) maxY = e.value;
        });

        const betterthan = data.filter(e => {
            return userlistens >= e.value;
        });
        const percperformance = Math.round((betterthan.length / data.length) * 100);
        
        var mean = d3.mean(data, function(d) { return d.value });
        this.props.valuesCallback(userlistens, percperformance, mean);
        
        data = data.sort((a,b) => {
            if (a.value === b.value) {
                if (a.id === user) return -1;
                else if (b.id === user) return 1;
                else return -1;
            } else {
                return a.value >= b.value ? -1 : 1;
            }
        
        });

        var xScaleOffset = -(Math.PI * 1/data.length); 
        var x = d3.scaleBand()
                    .range([xScaleOffset, 2 * Math.PI + xScaleOffset])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
                    .align(0)                  // This does nothing ?
                    .domain( data.map(function(d) { return d.id; }) ); 

        var y = d3.scaleLinear()
            .range([innerRadius, outerRadius])
            .domain([0, maxY]); // Domain of Y is from 0 to the max seen in the data



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
            Tooltip.html(user === d.id ? 
                            ptt1 + d.value + ptt2
                            :
                            d.id + tt1 + d.value + tt2)
                .style("left", (d3.event.pageX + 16) + "px")
                .style("top", (d3.event.pageY - 24) + "px");
        } 

        var mmove = function(d) {
            Tooltip
                .html(user === d.id ? 
                        ptt1 + d.value + ptt2
                        :
                        d.id + tt1 + d.value + tt2)
                .style("left", (d3.event.pageX + 16) + "px")
                .style("top", (d3.event.pageY - 24) + "px")
        }

        var mleave = function(d) {
            Tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        }
            
        console.log(data)
            
        svg.append("g")
            .selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .style("opacity", function(d){
                if (d.id === user) return 1;
                else return 0.5;
            })
            .attr("fill", function(d){
                if (d.id === user) return "var(--logo-red)";
                else return "var(--logo-violet)";
            })
            .attr("d", d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(function(d) { return y(d.value); })
            .startAngle(function(d) { return x(d.id); })
            .endAngle(function(d) { return x(d.id) + x.bandwidth(); })
            .padAngle(0.05)
            .padRadius(innerRadius))
            .on("mouseover", mover) 
            .on("mousemove", mmove)
            .on("mouseout", mleave)

        svg.append("g")
            .datum([mean])
            .append("circle")
            .attr("fill", "none")
            .attr("stroke", "rgba(0, 0, 0, 0.3)")
            .attr("stroke-dasharray", "8 3")
            .attr("r", y)
            .on("mouseover", function(d){
                Tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);
                Tooltip.html(tmean + parseFloat(mean).toFixed(2))
                    .style("left", (d3.event.pageX + 16) + "px")
                    .style("top", (d3.event.pageY - 24) + "px")
            })
            .on("mouseout", function(d){
                Tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

    }

    render () {

        return (
            <React.Fragment>
                <div id="circularbarplot"></div>
            </React.Fragment>
        );
    }
}

export default CircularBarPlot;