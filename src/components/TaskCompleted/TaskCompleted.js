import React, { Component } from 'react';
import axios from 'axios';
import classes from './TaskCompleted.css';
import happy from '../../assets/images/user.png';
import { Link } from 'react-router-dom';

class TaskCompleted extends Component {

    state = {
        content: {},
    }

    componentDidMount () {

        let query = this.props.record ? 'recordcompleted' : 'evaluationcompleted';

        axios.get('/api/descriptions/' + query)
            .then(response => {
                const content = {};
                response.data.map(el => {
                    return content[el.position] = el.content;
                });
                this.setState({ content: content });
            }); 
    }

    render() {

        let recordButton = null;
        let evaluationButton = null;

        if (this.props.record) {
            if (!this.props.noSentenceAvailable) {
                recordButton = (
                    <div className={classes.Button} style={{ backgroundColor: 'var(--logo-red)' }}
                        onClick={() => window.location.reload()}>
                        {this.state.content['record-btn']}
                    </div>
                );
            }
            evaluationButton = (
                <Link to="/evaluate" style={{ textDecoration: 'none' }}>
                    <div className={classes.Button} style={{ backgroundColor: 'var(--logo-violet)' }}>
                        {this.state.content['eval-btn']}
                    </div>
                </Link>
            );
        } else {
            recordButton = (
                <Link to="/record" style={{ textDecoration: 'none' }}>
                    <div className={classes.Button} style={{ backgroundColor: 'var(--logo-red)' }}>
                        {this.state.content['record-btn']}
                    </div>
                </Link>
            );
            evaluationButton = (
                <div className={classes.Button} style={{ backgroundColor: 'var(--logo-violet)' }}
                    onClick={() => window.location.reload()}>
                    {this.state.content['eval-btn']}
                </div>
            );
        }

        return (
            <div className={classes.Container}>
                <div className={classes.Card}>
                    <img src={happy} alt="happy emoji" />
                    <div className={classes.Text} dangerouslySetInnerHTML={{
                        __html: this.props.noSentenceAvailable ? 
                                this.state.content['alternative-content'] : this.state.content['main-content']
                    }}>
                    </div>
                    <div className={classes.Row}>
                        {recordButton}
                        {evaluationButton}
                    </div>
                </div>
            </div>
        );
    }
}

export default TaskCompleted;