import React, { Component } from 'react';
import axios from 'axios';
import classes from './TaskCompleted.css';

class TaskCompleted extends Component {

    state = {
        content: null,
    }

    componentDidMount () {
        axios.get('/api/descriptions/recordcompleted')
            .then(response => {
                this.setState({ content: response.data[0].content });
            }); 
    }

    render() {
        return (
            <div className={classes.Container}>
                <div className={classes.Card}>
                    {this.state.content}
                </div>
            </div>
        );
    }
}

export default TaskCompleted;