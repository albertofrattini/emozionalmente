import React from 'react';
import * as d3 from 'd3';
import guide from './Guide.css';

class LoadingBar extends React.Component {

    componentDidMount() {

        const total = this.props.data.total;
        const correct = this.props.data.correct;
        let accuracy;
        if (total === 0) {
            accuracy = 0;
        } else {
            accuracy = Math.round((correct / total) * 100)
        } 
        this.props.valuesCallback(accuracy, total);

        var width = d3.selectAll("#loadingbar").node().getBoundingClientRect().width,
            height = 500;
        const svg = d3.select('#loadingbar').append('svg')
            .attr('width', width)
            .attr('height', height);
        const outerRadius = Math.min(width, height) * 0.45;
        const thickness = 10;
        let value = 0;
        
        const mainArc = d3.arc()
            .startAngle(0)
            .endAngle(Math.PI * 2)
            .innerRadius(outerRadius-thickness)
            .outerRadius(outerRadius)

        svg.append("path")
            .attr('class', guide.progressBarBg)
            .attr('transform', `translate(${width/2},${height/2})`)
            .attr('d', mainArc())
        
        const mainArcPath = svg.append("path")
            .attr('class', guide.progressBar)
            .attr('transform', `translate(${width/2},${height/2})`)
        
        svg.append("circle")
            .attr('class', guide.progressBar)
            .attr('transform', `translate(${width/2},${height/2-outerRadius+thickness/2})`)
            .attr('width', thickness)
            .attr('height', thickness)
            .attr('r', thickness/2)

        const end = svg.append("circle")
            .attr('class', guide.progressBar)
            .attr('transform', `translate(${width/2},${height/2-outerRadius+thickness/2})`)
            .attr('width', thickness)
            .attr('height', thickness)
            .attr('r', thickness/2)
        
        let percentLabel = svg.append("text")
            .attr('class', guide.progressLabel)
            .attr('transform', `translate(${width/2},${height/2})`)
            .text('0')

        var update = function(progressPercent) {
            const startValue = value
            const startAngle = Math.PI * startValue / 50
            const angleDiff = Math.PI * progressPercent / 50 - startAngle;
            const startAngleDeg = startAngle / Math.PI * 180
            const angleDiffDeg = angleDiff / Math.PI * 180
            const transitionDuration = 1500

            mainArcPath.transition().duration(transitionDuration).attrTween('d', function(){
                return function(t) {
                mainArc.endAngle(startAngle + angleDiff * t)
                return mainArc();
                }
            })

            end.transition().duration(transitionDuration).attrTween('transform', function(){
                return function(t) {
                return `translate(${width/2},${height/2})`+
                    `rotate(${(startAngleDeg + angleDiffDeg * t)})`+
                    `translate(0,-${outerRadius-thickness/2})`
                }
            })

            percentLabel.transition().duration(transitionDuration).tween('bla', function() {
                return function(t) {
                percentLabel.text(Math.round(startValue + (progressPercent - startValue) * t) + "%");
                }
            })

            value = progressPercent;
            
        }

        update(accuracy);

    }

    render () {

        return (
            <React.Fragment>
                <div id="loadingbar"></div>
            </React.Fragment>
        );
    }
}

export default LoadingBar;