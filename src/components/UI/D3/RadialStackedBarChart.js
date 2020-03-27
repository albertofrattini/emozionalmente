import React from 'react';
import * as d3 from 'd3';
import guide from './Guide.css';

class RadialStackedBarChart extends React.Component {

    componentDidMount() {

        const user = this.props.data.uid[0].id;
        const emotions = this.props.emotionNames;
        const texts = this.props.emotionText;
        const colors = this.props.emotionColors;
        const data = [];
        const speakperid = [];
        let userindex = -1;
        let sum;
        let refid = -1;
        let obj = {};
        this.props.data.values.forEach(e => {
            if (e.id !== refid) {
                const keys = Object.keys(obj);
                if (keys.length > 0) {
                    this.props.emotionNames.forEach(en => {
                        if (!keys.includes(en)) {
                            obj[en] = 0;
                        }
                    });
                    data.push({...obj});
                    speakperid.push(sum);
                }
                sum = 0;
                obj = {}
                refid = e.id;
                obj['id'] = e.id;
                if (e.id === user) {
                    userindex = data.length;
                }
            } else {
                obj[e.emotion] = parseInt(e.value);
                sum += parseInt(e.value);
            }
        });

        const userperformance = speakperid[userindex];
        let betterthan = 0;
        speakperid.forEach((e,i) => {
            if (i !== userindex) {
                if (e < userperformance) {
                    betterthan += 1;
                }
            }
        });
        const percbetterperf = Math.round((betterthan / speakperid.length) * 100);
        data.sort((a,b) => {
            let suma = 0;
            let sumb = 0;
            emotions.forEach(e => {
                suma += a[e];
                sumb += b[e];
            });
            return suma >= sumb ? -1 : 1;
        });

        this.props.valuesCallback(userperformance, percbetterperf);




        var width = d3.selectAll("#radialstackedbarchart").node().getBoundingClientRect().width,
            height = 500,
            innerRadius = 80,
            outerRadius = Math.min(width, height) / 2;

        var svg = d3.select('#radialstackedbarchart')
                    .append("svg")
                        .attr("width", width/* + margin.left + margin.right*/)
                        .attr("height", height/* + margin.top + margin.bottom*/)
                        .style("transform", "rotate(-80deg)")
                    .append("g")
                        .attr("transform", "translate(" + width / 2 + "," + ( height / 2 )+ ")")


        var x = d3.scaleBand()
            .range([0, 2 * Math.PI])
            .align(0);

        var y = d3.scaleLinear()
            .range([innerRadius, outerRadius]);

        var z = d3.scaleOrdinal()
            .range(colors);

        var zClasses = texts;

        var keys = emotions;
        var meanSpeak = d3.mean(data, function(d) { return d3.sum(keys, function(key) { return d[key]; }); })

        var maxY = d3.max(data, function(d) { 
            let m = 0;
            emotions.forEach(e => {
                m += d[e];
            }); 
            return m;
        });

        x.domain(data.map(function(d) { return d.id; }));
        y.domain([0, maxY]);
        z.domain(keys);
        
        // Accidents
        svg.append('g')
            .selectAll("g")
            .data(d3.stack().keys(keys)(data))
            .enter().append("g")
            .attr("fill", function(d) { return z(d.key); })
            .selectAll("path")
            .data(function(d) { return d; })
            .enter().append("path")
            .style("opacity", function(d){
                if (d.data.id === user) return 1;
                else return 0.6;
            })
            .attr("d", d3.arc()
                .innerRadius(function(d) { return y(d[0]); })
                .outerRadius(function(d) { return y(d[1]); })
                .startAngle(function(d) { return x(d.data.id); })
                .endAngle(function(d) { return x(d.data.id) + x.bandwidth(); })
                .padAngle(0.05)
                .padRadius(innerRadius));

        var yAxis = svg.append("g")
            .attr("text-anchor", "middle");

        var yTicksValues = d3.ticks(0, maxY, 4);

        var yMeanTick = yAxis
            .append("g")
            .datum([meanSpeak]);

        yMeanTick.append("circle")
            .attr("fill", "none")
            .attr("stroke", "rgba(0, 0, 0, 0.5)")
            .attr("stroke-dasharray", "5 2")
            .attr("r", y);

        var yTick = yAxis
            .selectAll("g")
            .data(yTicksValues)
            .enter().append("g");

        yTick.append("circle")
            .attr("fill", "none")
            .attr("stroke", "rgba(0, 0, 0, 0.08)")
            .attr("r", y);

        yTick.append("text")
            .attr("y", function(d) { return -y(d); })
            .attr("dy", "0.35em")
            .attr("fill", "none")
            .style("fill", "rgba(0, 0, 0, 0.6)")

        // Legend
        // var legend = svg.append("g")
        //     .selectAll("g")
        //     .data(zClasses)
        //     .enter().append("g")
        //     .attr("transform", function(d, i) { return "translate(-35," + (i - (zClasses.length - 1) / 2) * 15+ ")"; });

        // legend.append("circle")
        //     .attr("r", 3)
        //     .attr("fill", z);

        // legend.append("text")
        //     .attr("x", 8)
        //     .attr("y", 0)
        //     .attr("dy", "0.35em")
        //     .text(function(d) { return d; });

    }

    render () {

        return (
            <React.Fragment>
                <div id="radialstackedbarchart"></div>
            </React.Fragment>
        );
    }
}

export default RadialStackedBarChart;