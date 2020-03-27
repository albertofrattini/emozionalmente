import React from 'react';
import * as d3 from 'd3';

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

class ConnectedScatter extends React.Component {


    componentDidMount () {

        var data = this.props.data;
        if (data.length === 1) {
            const begin = {
                date: '20-Mar-01',
                value: 0
            }
            data.unshift(begin);
        } else {
            const l = data.length - 1;
            const db = data[0].date.substring(7,9) + " " + data[0].date.substring(3,6) + " " + data[0].date.substring(0,2) + " 00:00:00 GMT";
            const de = data[l].date.substring(7,9) + " " + data[l].date.substring(3,6) + " " + data[l].date.substring(0,2) + " 00:00:00 GMT";
            const begin = Date.parse(db);
            const end = Date.parse(de);
            const alldays = getDates(new Date(begin), new Date(end));
            const alldates = alldays.map(element => {
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
        }

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
                .style("opacity", function(d) { 
                    if(d.value === 0) return 0; 
                    else return 1;
                })


    }


    render () {

        return (<div id="chartscatter"></div>);
    }
}

export default ConnectedScatter;