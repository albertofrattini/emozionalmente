import React from 'react';
import * as d3 from 'd3';
import guide from './Guide.css';

class RadarChart extends React.Component {

    componentDidMount() {

        const data = this.props.data;
        const ptt1 = this.props.personal_tooltip_1;
        const tt1 = this.props.tooltip_1;
        const texts = this.props.emotionText;
        const colors = this.props.emotionColors;

        console.log(data)
        let obj = {};
        data.forEach((e,i)  => {
            obj[i] = 0;
            e.forEach(j => {
                obj[i] += j.value;
            });
            obj[i] = Math.round((obj[i] / texts.length) * 100);
        });

        console.log(obj[1], obj[0])
        this.props.valuesCallback(obj[1], obj[0]);

        const id = "#radarchart";

        var color = d3.scaleOrdinal().range(["#CC333F","#00A0B0"]);

        var margin = {top: 32, right: 32, bottom: 32, left: 32};

        var cfg = {
            w: d3.selectAll(id).node().getBoundingClientRect().width - margin.right - margin.left,
            h: 436,		
            margin: margin, 
            levels: 3,			
            maxValue: 1, 		
            labelFactor: 1.12, 
            wrapWidth: 60, 	
            opacityArea: 0.35, 
            dotRadius: 4,		
            opacityCircles: 0.1, 	
            strokeWidth: 2, 	
            roundStrokes: false,	
            color: color
        };
            
        var allAxis = (data[0].map(function(i, j){return i.axis})),	
            total = allAxis.length,					
            radius = Math.min(cfg.w/2, cfg.h/2), 	
            Format = function(v) { return Math.round(v * 100) + "%"; },
            angleSlice = Math.PI * 2 / total;		
        
        var rScale = d3.scaleLinear()
            .range([0, radius])
            .domain([0, cfg.maxValue]);

        d3.select(id).select("svg").remove();
        
        var svg = d3.select(id).append("svg")
                .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
                .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
        var g = svg.append("g")
                .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
        
        var filter = g.append('defs').append('filter').attr('id','glow'),
            feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
            feMerge = filter.append('feMerge'),
            feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
            feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');
        
        var axisGrid = g.append("g").attr("class", "axisWrapper");
        
        axisGrid.selectAll(".levels")
            .data(d3.range(1,(cfg.levels+1)).reverse())
            .enter()
            .append("circle")
            .attr("class", "gridCircle")
            .attr("r", function(d, i){return radius/cfg.levels*d;})
            .style("fill", "#ffffff")
            .style("stroke", "rgba(0, 0, 0, 0.2)")
            .style("fill-opacity", cfg.opacityCircles)
            .style("filter" , "url(#glow)");
    
        axisGrid.selectAll(".axisLabel")
            .data(d3.range(1,(cfg.levels+1)).reverse())
            .enter().append("text")
            .attr("class", "axisLabel")
            .attr("x", 4)
            .attr("y", function(d){return -d*radius/cfg.levels;})
            .attr("dy", "0.4em")
            .style("font-size", "10px")
            .attr("fill", "#000000")
            .text(function(d,i) { return Format(cfg.maxValue * d/cfg.levels); });
    
        var axis = axisGrid.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");

        axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", function(d, i){ return rScale(cfg.maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
            .attr("y2", function(d, i){ return rScale(cfg.maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
            .attr("class", "line")
            .style("stroke", function(d){
                const idx = texts.findIndex(e => {
                    return e === d;
                });
                return colors[idx];
            })
            .style("stroke-width", "1px");
    
        axis.append("text")
            .attr("class", "legend")
            .style("font-size", "11px")
            .style("font-weight", "800")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("x", function(d, i){ return rScale(cfg.maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
            .attr("y", function(d, i){ return rScale(cfg.maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
            .text(function(d){return d})
            .attr("fill", function(d) {
                const idx = texts.findIndex(e => {
                    return e === d;
                });
                return colors[idx];
            })
            .call(wrap, cfg.wrapWidth);
    
        var radarLine = d3.lineRadial()
            .radius(function(d) { return rScale(d.value); })
            .angle(function(d,i) {	return i*angleSlice; })
            .curve(d3.curveCardinalClosed);
            
        // if(cfg.roundStrokes) {
        //     radarLine.interpolate("cardinal-closed");
        // }

        var Tooltip = d3.select("body").append("div")
            .attr("class", guide.Tooltip)
            .style("opacity", 0)
            .style("font-size", "15px")
            .style("padding", "8px")
            .style("max-width", "128px")
            .style("text-align", "center");
                    
        var blobWrapper = g.selectAll(".radarWrapper")
            .data(data)
            .enter().append("g")
            .attr("class", "radarWrapper");
                
        blobWrapper
            .append("path")
            .attr("class", "radarArea")
            .attr("d", function(d,i) { return radarLine(d); })
            .style("fill", function(d,i) { return cfg.color(i); })
            .style("fill-opacity", cfg.opacityArea)
            .on('mouseover', function (d,i){
                d3.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", 0.1); 
                d3.select(this)
                    .transition().duration(200)
                    .style("fill-opacity", 0.7);	
                if (i === 0) {
                    Tooltip.transition()
                        .duration(200)
                        .style("opacity", 1);
                    Tooltip.html(tt1 + obj[i] + "%")
                        .style("left", (d3.event.pageX + 16) + "px")
                        .style("top", (d3.event.pageY - 24) + "px");
                } else {
                    Tooltip.transition()
                        .duration(200)
                        .style("opacity", 1);
                    Tooltip.html(ptt1 + obj[i] + "%")
                        .style("left", (d3.event.pageX + 16) + "px")
                        .style("top", (d3.event.pageY - 24) + "px");
                }
                
            })
            .on("mousemove", function(d,i){
                if (i === 0) {
                    Tooltip.transition()
                        .duration(200)
                        .style("opacity", 1);
                    Tooltip.html("Gli altri utenti hanno, in media, un'accuratezza del " + obj[i] + "%")
                        .style("left", (d3.event.pageX + 16) + "px")
                        .style("top", (d3.event.pageY - 24) + "px");
                } else {
                    Tooltip.transition()
                        .duration(200)
                        .style("opacity", 1);
                    Tooltip.html("Hai un'accuratezza media del " + obj[i] + "%")
                        .style("left", (d3.event.pageX + 16) + "px")
                        .style("top", (d3.event.pageY - 24) + "px");
                }
            })
            .on('mouseout', function(){
                d3.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", cfg.opacityArea);
                Tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
            });
            
        blobWrapper.append("path")
            .attr("class", "radarStroke")
            .attr("d", function(d,i) { return radarLine(d); })
            .style("stroke-width", cfg.strokeWidth + "px")
            .style("stroke", function(d,i) { return cfg.color(i); })
            .style("fill", "none")
            .style("filter" , "url(#glow)");		
        
        blobWrapper.selectAll(".radarCircle")
            .data(function(d,i) { return d; })
            .enter().append("circle")
            .attr("class", "radarCircle")
            .attr("r", cfg.dotRadius)
            .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
            .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
            .style("fill", function(d,i,j) { return cfg.color(j); })
            .style("fill-opacity", 0.8);
    
        
        var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
            .data(data)
            .enter().append("g")
            .attr("class", "radarCircleWrapper");
            
        blobCircleWrapper.selectAll(".radarInvisibleCircle")
            .data(function(d,i) { return d; })
            .enter().append("circle")
            .attr("class", "radarInvisibleCircle")
            .attr("r", cfg.dotRadius*1.5)
            .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
            .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function(d,i) {
                let newX =  parseFloat(d3.select(this).attr('cx')) - 10;
                let newY =  parseFloat(d3.select(this).attr('cy')) - 10;
                        
                tooltip
                    .attr('x', newX)
                    .attr('y', newY)
                    .text(Format(d.value))
                    .transition().duration(200)
                    .style('opacity', 1);
            })
            .on("mouseout", function(){
                tooltip.transition().duration(200)
                    .style("opacity", 0);
            });
            
        var tooltip = g.append("text")
            .attr("class", "tooltip")
            .style("opacity", 0);
        
    
        function wrap(text, width) {
            text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.4, // ems
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
                
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
            });
        }
    }

    render () {

        return (
            <React.Fragment>
                <div id="radarchart"></div>
            </React.Fragment>
        );
    }
}

export default RadarChart;