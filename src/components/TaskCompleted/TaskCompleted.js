import React, { Component } from 'react';
import axios from 'axios';
import classes from './TaskCompleted.css';
import thinking from '../../assets/images/thinking.png';
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

        let homeColor = this.props.record ? 'var(--logo-red)' : 'var(--logo-violet)';

        return (
            <div className={classes.Container}>
                <div className={classes.Card}>
                    <img src={thinking} alt="thinking person" />
                    <div className={classes.Text}>
                        {this.state.content}
                    </div>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <div className={classes.Button} style={{ backgroundColor: homeColor }}>
                            HOME
                        </div>
                    </Link>
                </div>
            </div>
        );
    }
}

export default TaskCompleted;