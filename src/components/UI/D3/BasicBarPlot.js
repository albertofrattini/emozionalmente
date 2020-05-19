import React from 'react';
import * as d3 from 'd3';
import guide from './Guide.css';

class BasicBarPlot extends React.Component {

    componentDidMount() {

        const emotions = this.props.emotionNames;
        const stacked = this.props.stacked;

        const userid = this.props.data.uid;
        const texts = this.props.textDict;
        const coldict = this.props.colorDict;
        const selectEmotion = this.props.selectedEmotion;
        const retrievedData = userid ? this.props.data.values : this.props.data
        const valuesCallback = this.props.valuesCallback;
        let total = 0, max = 0, userlistens = 0;
        let notFounds = {...texts};
        let data_ready = [];
        if (stacked) {
            const speakperid = [];
            let userindex = -1;
            let sum = 0;
            let refid = -1;
            let obj = {};
            retrievedData.forEach(e => {
                if (e.id !== refid) {
                    const keys = Object.keys(obj);
                    if (keys.length > 0) {
                        this.props.emotionNames.forEach(en => {
                            if (!keys.includes(en)) {
                                obj[en] = 0;
                            }
                        });
                        data_ready.push({...obj});
                        speakperid.push(sum);
                    }
                    sum = 0;
                    obj = {}
                    refid = e.id;
                    obj['name'] = e.id;
                    if (e.id === userid) {
                        userindex = data_ready.length;
                    }
                }
                obj[e.emotion] = parseInt(e.value);
                sum += parseInt(e.value);
            });

            const userperformance = userindex !== -1 ? speakperid[userindex] : 0;
            let betterthan = 0;
            speakperid.forEach((e,i) => {
                max = e > max ? e : max
                if (i !== userindex) {
                    if (e < userperformance) {
                        betterthan += 1;
                    }
                } else {
                    betterthan += 1;
                }
            });
            const percbetterperf = Math.round((betterthan / speakperid.length) * 100);
            data_ready.sort((a,b) => {
                let suma = 0;
                let sumb = 0;
                emotions.forEach(e => {
                    suma += a[e];
                    sumb += b[e];
                });
                if (suma === sumb) {
                    if (a.name === userid) return -1;
                    else if (b.name === userid) return 1;
                    else return -1;
                } else {
                    return suma >= sumb ? -1 : 1;
                }
            });
            var meanSpeak = d3.mean(data_ready, function(d) { return d3.sum(emotions, function(em) { return d[em]; }); })
            this.props.valuesCallback(userperformance, percbetterperf, meanSpeak);
        } else {
            const data = [...retrievedData].map(elem => {
                const v = parseInt(elem.value)
                total += v
                max = v > max ? v : max
                if (!userid) delete notFounds[elem.emotion]
                else userlistens = userid === elem.id ? v : userlistens
                return {
                    name: userid ? elem.id : texts[elem.emotion],
                    value: v,
                    color: coldict ? coldict[elem.emotion] : elem.id === userid ? "var(--logo-red)" : "var(--logo-violet)"
                }
            })
            let missing = []
            if (!userid) {
                missing = [...Object.keys(notFounds)].map(elem => {
                    return {
                        name: notFounds[elem],
                        value: 0,
                        color: coldict[elem]
                    }
                })
            }
            data_ready = [...data, ...missing]
            if (!userid) data_ready.sort((a, b) => a.name > b.name ? 1 : -1)
            else data_ready.sort((a, b) => a.value > b.value ? -1 : 1)
    
            const mean = d3.mean(data_ready, function(d) { return d.value });
            if (userid) {
                const betterthan = data_ready.filter(e => {
                    return userlistens >= e.value;
                });
                const percperformance = Math.round((betterthan.length / data_ready.length) * 100);
                this.props.valuesCallback(userlistens, percperformance, mean);
            }
        }

        var margin = {top: 30, right: 30, bottom: 70, left: 60},
                width = d3.selectAll("#basicbarplot").node().getBoundingClientRect().width - margin.left - margin.right,
                        height = 370 - margin.top - margin.bottom;


        var Tooltip = d3.select("body").append("div")
            .attr("class", guide.Tooltip)
            .style("opacity", 0);

        var svg = d3.select("#basicbarplot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(data_ready.map(function(d) { return d.name; }))
            .padding(0.1);
        
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

        var y = d3.scaleLinear()
            .domain([0, userid ? max : 100])
            .range([ height, 0]);
        
        svg.append("g")
            .call(d3.axisLeft(y));
        
        if (stacked) {
            svg.append("g")
                .selectAll("g")
                .data(d3.stack().keys(emotions)(data_ready))
                .enter().append("g")
                .attr("fill", function(d) { return coldict[d.key]; })
                .selectAll("rect")
                .data(function(d) { return d; })
                .enter().append("rect")
                    .style("opacity", function(d){
                        if (d.data.name === userid) return 1;
                        else return 0.6;
                    })
                    .attr("x", function(d) { return x(d.data.name); })
                    .attr("y", function(d) { return y(d[1]); })
                    .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                    .attr("width",x.bandwidth())
        } else {
            svg.selectAll("mybar")
                .data(data_ready)
                .enter()
                .append("rect")
                    .attr("x", function(d) { 
                        if (!userid) {
                            if (d.name === texts[selectEmotion] && valuesCallback) {
                                valuesCallback(total, parseInt(Math.round((d.value / total) * 100, 1)));
                            }
                        }
                        return x(d.name); 
                    })
                    .attr("y", function(d) { return y(userid ? d.value : (d.value / total) * 100); })
                    .attr("width", x.bandwidth())
                    .attr("height", function(d) { return height - y(userid ? d.value : (d.value / total) * 100); })
                    .attr("fill", function(d) { return d.color })
        }



        d3.selectAll('rect').on("mouseover", function(d){

            const v = userid ? 
                        d.value ? 
                            d.value 
                            : 
                            Object.values(d.data).reduce((x,y) => typeof y === "string" ? x : x + y, 0) 
                        : 
                        Math.round((d.value/total) * 100)
            const color = d.color ? d.color : "var(--blue)"
            const name = d.name ? d.name : d.data.name

            if (!stacked) {
                d3.selectAll("rect").style("opacity", 0.5)
                d3.select(this).style("opacity", 1)
            }
            Tooltip.transition()
                .duration(200)
                .style("opacity", 1);
            Tooltip.html('<div style="background-color:' + color + '; padding: 8px; margin-bottom: 8px; color: white;">' 
                        + name + '</div><div style="font-size: 16px; font-weight: 800;">' 
                        + v + (userid ? "" : "%") + '</div>')
                .style("left", (d3.event.pageX + 16) + "px")
                .style("top", (d3.event.pageY - 24) + "px");
        
        })

        d3.selectAll('rect').on("mousemove", function(d){

            const v = userid ? 
                        d.value ? 
                            d.value 
                            : 
                            Object.values(d.data).reduce((x,y) => typeof y === "string" ? x : x + y, 0) 
                        : 
                        Math.round((d.value/total) * 100)
            const color = d.color ? d.color : "var(--blue)"
            const name = d.name ? d.name : d.data.name

            Tooltip
                .html('<div style="background-color:' + color + '; padding: 8px; margin-bottom: 8px; color: white;">' 
                        + name + '</div><div style="font-size: 16px; font-weight: 800;">' 
                        + v + (userid ? "" : "%") + '</div>')
                .style("left", (d3.event.pageX + 16) + "px")
                .style("top", (d3.event.pageY - 24) + "px")
            
        
        })
        
        d3.selectAll('rect').on("mouseleave", function(d){
        
            if (!stacked) d3.selectAll("rect").style("opacity", 1)
            Tooltip.transition()
                .duration(200)
                .style("opacity", 0);
            
        })
    }

    render () {

        return (
            <React.Fragment>
                <div id="basicbarplot"></div>
            </React.Fragment>
        );
    }
}

export default BasicBarPlot;