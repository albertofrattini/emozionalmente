import React from 'react';
import * as d3 from 'd3';
import guide from './Guide.css';


class ConnectedScatter extends React.Component {


    componentDidMount () {

        var data = this.props.data;
        const alldates = this.props.allDays.map(element => {
            let values = null;
            const str = element.toString();
            const strDate = str.substring(13,15) + '-' + str.substring(4,7) + '-' + str.substring(8,10);
            data.forEach(d => {
                if (d.date === strDate) {
                    values = d;
                }
            });
            if (values) return values;
            values = {
                date: strDate,
                value: 0
            }
            return values;
        });
        data = alldates;



        var margin = {top: 64, right: 32, bottom: 64, left: 32},
            width = d3.selectAll("#chartscatter").node().getBoundingClientRect().width - margin.left - margin.right,
            height = 550 - margin.top - margin.bottom;

        var svg = d3.select("#chartscatter")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        // var minValue = 0;
        // var maxValue = 0;
        var dataReady = data.map(e => {
            // if (e.value > maxValue) {
            //     maxValue = e.value;
            // }
            return {
                date: d3.timeParse("%y-%b-%d")(e.date),
                value: e.value
            };
        });


        var Tooltip = d3.select("body").append("div")
                .attr("class", guide.Tooltip)
                .style("opacity", 0);

        var mover = function(d) {
            Tooltip.transition()
                .duration(200)
                .style("opacity", 1);
            Tooltip.html('<div style="background-color: #efefef; padding: 8px; margin-bottom: 8px">' 
                        + d3.timeFormat("%e/%m/%Y")(d.date) + '</div><div style="font-size: 16px; font-weight: 800;">' 
                        + d.value + '</div>')
                .style("left", (d3.event.pageX + 8) + "px")
                .style("top", (d3.event.pageY - 24) + "px");
        } 

        var mleave = function(d) {
            Tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        }


        
        var x = d3.scaleTime()
                        .domain(d3.extent(dataReady, function(d) { return d.date; }))
                        .range([ 0, width ]);
        
        svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).ticks(d3.timeDay.every(4)).tickFormat(d3.timeFormat('%d/%m')));
                
        var y = d3.scaleLinear()
                    .domain( [0, this.props.maxValue + 10])
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

        


        svg.append("g")
            .selectAll("dot")
            .data(dataReady)
            .enter()
            .append("circle")
                .attr("cx", function(d) { return x(d.date) } )
                .attr("cy", function(d) { return y(d.value) } )
                .attr("r", 4)
                .attr("fill", "#69b3a2")
                .style("opacity", function(d) { 
                    if(d.value === 0) return 0; 
                    else return 1;
                })
                .on("mouseover", mover)
                .on("mouseout", mleave)
        
        d3.selectAll('circle').on("mouseenter", function(d){

            d3.selectAll("circle").style("opacity", 0)
            d3.select(this).style("opacity", 1)

        
        })

        d3.selectAll('circle').on("mouseleave", function(d){
      
            d3.selectAll("circle").style("opacity", function(d) { 
                if(d.value === 0) return 0; 
                else return 1;
            })
          
        })

        


    }


    render () {

        return (<div id="chartscatter"></div>);
    }
}

export default ConnectedScatter;