import React from 'react';
import * as d3 from 'd3';
import guide from './Guide.css';

class PieChart extends React.Component {

    componentDidMount() {

        const names = this.props.emotionNames;
        const colors = this.props.emotionColors;
        const texts = this.props.textDict;
        const selectEmotion = this.props.selectedEmotion;
        const valuesCallback = this.props.valuesCallback;
        const retrievedData = this.props.data;
        const isSamples = this.props.samples;
        const data = {};
        let total = 0;
        let foundEmotions = [];
        if (isSamples) {
            retrievedData.forEach(element => {
                names.forEach(e => {
                    if (!data[e]) data[e] = 0;
                    data[e] += parseInt(element[e]);
                });
            });
        } else {
            foundEmotions = retrievedData.map(e => {
                data[e.emotion] = parseInt(e.value);
                total += data[e.emotion];
                return e.emotion;
            });
            names.filter(e => {
                if (!foundEmotions.includes(e)) data[e] = 0;
                return e;
            });
        }

        var width = d3.selectAll("#comparisonchartpie").node().getBoundingClientRect().width,
                height = 370;

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        var radius = Math.min(width, height) / 2

        // append the svg object to the div called 'my_dataviz'
        var svg = d3.select("#comparisonchartpie")
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Create dummy data
        // var data = {a: 9, b: 20, c:30, d:8, e:12}

        // set the color scale
        var color = d3.scaleOrdinal()
                        .domain(names)
                        .range(colors);


        var Tooltip = d3.select("#comparisonchartpie")
                            .append("div")
                            .style("position", "absolute")
                            .style("visibility", "hidden")
                            .style("background-color", "white")
                            .style("border", "solid")
                            .style("border-width", "1px")
                            .style("border-radius", "4px")
                            .style("padding", "8px")

        // Compute the position of each group on the pie:
        var pie = d3.pie()
                        .value(function(d) {return d.value; })
        var data_ready = pie(d3.entries(data))
        // Now I know that group A goes from 0 degrees to x degrees and so on.

        // shape helper to build arcs:
        var arcGenerator = d3.arc()
                                .innerRadius(0)
                                .outerRadius(radius)

        // Build the pie chartpie: Basically, each part of the pie is a path that we build using the arc function.
        svg.selectAll('mySlices')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .attr('fill', function(d){ return(color(d.data.key)) })
            .style("opacity", 1)

        // Now add the annotation. Use the centroid method to get the best coordinates
        svg.selectAll('mySlices')
            .data(data_ready)
            .enter()
            .append('text')
            .text(function(d){ 
                if (d.data.key === selectEmotion && valuesCallback) {
                    valuesCallback(texts[d.data.key], parseInt(Math.round((d.value / total) * 100, 1)));
                }
            })
            .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
            .attr("fill", "var(--text-darker)")
            .style("text-anchor", "middle")
            .style("font-size", 18)
        

        d3.selectAll('path').on("mouseover", function(d){

            Tooltip.style("visibility", "visible");
            d3.selectAll("path").style("opacity", 0.5)
            d3.select(this).style("opacity", 1)
        
        })

        d3.selectAll('path').on("mousemove", function(d){

            Tooltip
                .html(Math.round((d.value/total) * 100) + "%")
                .style("left", (d3.mouse(this)[0]+800) + "px")
                .style("top", (d3.mouse(this)[1]+200) + "px")
            
        
        })
        
        d3.selectAll('path').on("mouseleave", function(d){
        
            d3.selectAll("path").style("opacity", 1)
            Tooltip.style("visibility", "hidden")
            
        })

    }

    render () {

        let orderedData = this.props.data.sort((a, b) => a.value <= b.value ? 1 : -1);
        let emotions = orderedData.map(e => {
            let style = {
                backgroundColor: this.props.colorDict[e.emotion]
            }
            let text = this.props.textDict[e.emotion] + (e.emotion === this.props.selectedEmotion ? ' (Emozione Corretta)' : '');
            return (
                <div className={guide.GuideContainer} key={e.emotion}>
                    <div className={guide.Square} style={style}></div>
                    <div className={guide.Text}>{text}</div>
                </div>
            );
        });

        return (
            <React.Fragment>
                {emotions}
                <div style={{ marginTop: '16px' }} id="comparisonchartpie"></div>
            </React.Fragment>
        );
    }
}

export default PieChart;