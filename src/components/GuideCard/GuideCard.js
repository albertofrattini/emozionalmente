import React, { Component } from 'react';
import classes from './GuideCard.css';
import { withRouter } from 'react-router-dom';
import random from '../../assets/images/evaluate-false.png';

import axios from 'axios';


class GuideCard extends Component {

    state = {
        step: 0,
        stepButton: 'Next',
        sentences: [],
        loggedin: false
    }

    numSteps = 4;
    images = [];

    text = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.';

    componentDidMount () {

        if (this.props.record) {
            axios.get('/api/descriptions/recordguide')
                .then(response => {
                    this.images = [random, random, random, random];
                    this.setState({ sentences: response.data });
                }); 
        } else {
            axios.get('/api/descriptions/evaluateguide')
                .then(response => {
                    this.images = [random, random, random, random];
                    this.setState({ sentences: response.data });
                });
        }

        axios.get('/api/users/loggedin')
            .then(response => {
                this.setState({ loggedin: response.data.user.username !== null});
            });

    }

    clicked = () => {

        const currStep = this.state.step;
        if (currStep === this.numSteps - 1) {
            if (this.state.loggedin) {
                this.props.end();
            } else {
                let path = '/login-signup';
                this.props.history.push(path);
            }
        } else {
            this.nextPage(currStep);
        }
    }

    nextPage = (currStep) => {

        if (currStep === this.numSteps - 2) {
            const stepButton = this.state.loggedin === false ? 'Login' : 'Start'; 
            this.setState({
                step: currStep + 1,
                stepButton: stepButton
            });
        } else {
            this.setState({ step: currStep + 1 });
        }

    }

    render () {

        const explanationCard = (
            <div className={classes.Content}>
                <div className={classes.Image}>
                    <img src={this.images.length > 0 ?
                        this.images[this.state.step] 
                        : random
                        } 
                        alt="sentence guide"></img>
                </div>
                <div className={classes.Description}>
                    {this.state.sentences.length > 0 ?
                        this.state.sentences[this.state.step].content
                        : null
                    }
                </div>
            </div>
        );

        const progressBalls = [...Array( this.numSteps )].map((_, i) => {
            if (i === this.state.step) {
                return <div key={i} className={classes.Filled}></div>;
            } else {
                return <div key={i} className={classes.Empty}></div>;
            } 
        });

        return (
            <div className={classes.Container}>
                <div className={classes.Card}>
                    {explanationCard}
                    <div className={classes.Progress}>
                        {progressBalls}
                    </div>
                    <div className={classes.Next} 
                        onClick={this.clicked}>
                            {this.state.stepButton}
                    </div>
                </div>
            </div>
        );
    }

}

export default withRouter(GuideCard);