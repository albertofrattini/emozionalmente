import React from 'react';
import * as d3 from 'd3';
import './StackedAreaChart.css';
import guide from './Guide.css';

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.subDay = function() {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() - 1);
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


class StackedAreaChart extends React.Component {


    componentDidMount() {

        let data = [...this.props.data];
        const names = this.props.emotionNames;
        const colors = this.props.emotionColors;
        if (data.length === 1) {
            const begin = {
                date: '20-Mar-04'
            }
            names.map(e => {
                return begin[e] = 0
            });
            data.unshift(begin);
        }

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
                date: strDate
            }
            names.map(e => {
                return values[e] = 0
            });
            return values;
        });
        data = alldates;



        var margin = {top: 32, right: 32, bottom: 64, left: 32},
            width = d3.selectAll("#chartstacked").node().getBoundingClientRect().width - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var parseDate = d3.timeParse("%y-%b-%d");

        var x = d3.scaleTime()
                    .range([0, width]);
                
        var y = d3.scaleLinear()
                    .range([height, 0]);
                
        var color = d3.scaleOrdinal().domain(names).range(colors);

        var xAxis = d3.axisBottom(x);

        var yAxis = d3.axisLeft(y);

        var area = d3.area()
                    .x(function(d) { return x(d.data.date); })
                    .y0(function(d) { return y(d[0]); })
                    .y1(function(d) { return y(d[1]); })
                    .curve(d3.curveMonotoneX);

        var stack = d3.stack()
                        .keys(names)
                        .order(d3.stackOrderNone)
                        .offset(d3.stackOffsetNone);

        var series = stack(data);

        var svg = d3.select('#chartstacked').append('svg')
                                        .attr('width', width + margin.left + margin.right)
                                        .attr('height', height + margin.top + margin.bottom)
                                        .append('g')
                                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");     
                                            

        // color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));
        data.forEach(d => {
            d.date = parseDate(d.date);
        });

        var maxDateVal = d3.max(data, function(d){
            var vals = d3.keys(d).map(function(key){ return key !== "date" ? d[key] : 0 });
            return d3.sum(vals);
        });

        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, maxDateVal + 20]);

        var browser = svg.selectAll(".browser")
                            .data(series)
                            .enter()
                            .append("g")
                                .attr("class", "browser")
                                .attr("opacity", 0.85);

        browser.append("path")
                .attr("class", "area")
                .attr("d", function(d) { return area(d); })
                .style("fill", function(d) { return color(d.key); });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        d3.selectAll('path').on("mouseenter", function(d){

            d3.selectAll("path").style("opacity", 0.7)
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
                <div id="chartstacked"></div>
            </React.Fragment>

        );
    }


} 




export default StackedAreaChart;