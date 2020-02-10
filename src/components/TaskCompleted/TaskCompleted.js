import React, { Component } from 'react';
import axios from 'axios';
import classes from './TaskCompleted.css';
import happy from '../../assets/images/user.png';
import { Link } from 'react-router-dom';

class TaskCompleted extends Component {

    state = {
        content: null,
    }

    componentDidMount () {

        let query = this.props.record ? 'recordcompleted' : 'evaluationcompleted';

        axios.get('/api/descriptions/' + query)
            .then(response => {
                this.setState({ content: response.data[0].content });
            }); 
    }

    render() {

        return (
            <div className={classes.Container}>
                <div className={classes.Card}>
                    <img src={happy} alt="happy emoji" />
                    <div className={classes.Text} dangerouslySetInnerHTML={{
                        __html: this.state.content
                    }}>
                    </div>
                    <div className={classes.Row}>
                        <Link to="/record" style={{ textDecoration: 'none' }}>
                            <div className={classes.Button} style={{ backgroundColor: 'var(--logo-red)' }}>
                                Record
                            </div>
                        </Link>
                        <Link to="/evaluate" style={{ textDecoration: 'none' }}>
                            <div className={classes.Button} style={{ backgroundColor: 'var(--logo-violet)' }}>
                                Evaluate
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default TaskCompleted;