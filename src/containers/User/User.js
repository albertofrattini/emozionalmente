import React, { Component } from 'react';
import classes from './User.css';
import axios from 'axios';
import { MdMic, MdPlayArrow } from 'react-icons/md';
import Loader from '../../components/UI/Loader/Loader';

class User extends Component {

    state = {
        username: null,
        sampleContribution: null,
        evaluationContribution: null,
        emotions: [],
        content: {},
        isLoading: true
    }

    async componentDidMount () {

        const descriptions = await axios.get('/api/descriptions/user');
        const content = {};
        descriptions.data.map(el => {
                return content[el.position] = el.content;
            });
        const user = await axios.get('/api/users/loggedin');
        const contribution = await axios.get('/api/users/contribution');
        const emotions = await axios.get('/api/data/emotions');
        let emotionDict = {};
        emotions.data.map((el, i) => {
            return emotionDict[el.name] = [el.emotion, el.color];
        })
        this.setState({
            username: user.data.user.username,
            sampleContribution: contribution.data.sampleContribution,
            evaluationContribution: contribution.data.evaluationContribution,
            emotions: emotionDict,
            content: content,
            isLoading: false
        });

    }

    render () {

        let recordingBlocks = this.state.sampleContribution ?
                    [...Object.keys(this.state.sampleContribution)].map((el, i) => {
                        const height = this.state.sampleContribution.total === 0 ? 
                                    0 :
                                    (this.state.sampleContribution[el] * 220) / this.state.sampleContribution.total;
                        return (
                            <div key={i} className={classes.BlockContainer}>
                                {this.state.sampleContribution[el]}
                                <div key={i} className={classes.Block}>
                                    <div className={classes.BlockText}>
                                        {el === 'total' ? 'TOT' : this.state.emotions[el][0]}
                                    </div>
                                    <div 
                                        className={classes.Data} 
                                        style={{ 
                                            height: height + 'px', 
                                            backgroundColor: el === 'total' ? 'var(--text-dark)' : this.state.emotions[el][1] 
                                        }}>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                    : 
                    null;

        let evaluatingBlocks = this.state.evaluationContribution ?
                    [...Object.keys(this.state.evaluationContribution)].map((el, i) => {
                        const height = this.state.evaluationContribution.total === 0 ? 
                            0 :
                            (this.state.evaluationContribution[el] * 220) / this.state.evaluationContribution.total;
                        return (
                            <div key={i} className={classes.BlockContainer}>
                                {this.state.evaluationContribution[el]}
                                <div key={i} className={classes.Block}>
                                    <div className={classes.BlockText} style={{ display: 'block' }}>
                                        {el === 'total' ? 'TOT' : this.state.content['block-' + el]}
                                    </div>
                                    <div className={classes.Data} style={{ height: height + 'px' }}>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                    : 
                    null;



        return (
            <React.Fragment>
                {
                    this.state.isLoading ?
                        <Loader pageLoading/>
                        :
                        <div className={classes.Content}>
                            <div className={classes.Introduction}>
                                <div className={classes.Welcome}>
                                    <p style={{ fontSize: '42px', fontWeight: '500', marginTop: '0px' }}>
                                        {this.state.username},
                                    </p> 
                                    <p dangerouslySetInnerHTML={{
                                        __html: this.state.content['user-intro']
                                    }}></p>
                                </div>
                                <div className={classes.Column}>
                                    <div className={classes.Values}>
                                        <MdMic size="48px" color="var(--logo-red)"/>
                                        {this.state.sampleContribution.total}
                                    </div>
                                    <div className={classes.Values}>
                                        <MdPlayArrow size="48px" color="var(--logo-violet)"/>
                                        {this.state.evaluationContribution.total}
                                    </div>
                                </div>
                            </div>
                            <div className={classes.MainGraph}>
                                <div className={classes.MainCard}>
                                    {recordingBlocks}
                                </div>
                                <div className={classes.MainCard}>
                                    {evaluatingBlocks}
                                </div>
                            </div>
                        </div>
                }
            </React.Fragment>
        );

    }
}


export default User;