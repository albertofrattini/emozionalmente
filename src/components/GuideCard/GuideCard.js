import React, { Component } from 'react';
import classes from './GuideCard.css';
import { withRouter } from 'react-router-dom';
import random from '../../assets/images/thumb-up.png';
import { Link } from 'react-router-dom';
import thinking from '../../assets/images/thinking.png';
import axios from 'axios';
import { MdArrowBack } from 'react-icons/md';


class GuideCard extends Component {

    state = {
        guide: [],
        loggedin: false
    }

    text = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.';

    componentDidMount () {

        if (this.props.record) {
            axios.get('/api/descriptions/recordguide')
                .then(response => {
                    this.setState({ guide: response.data });
                }); 
        } else {
            axios.get('/api/descriptions/evaluateguide')
                .then(response => {
                    this.setState({ guide: response.data });
                });
        }

        axios.get('/api/users/loggedin')
            .then(response => {
                this.setState({ loggedin: response.data.user.username !== null});
            });

    }

    render () {

        let btnLabel = this.state.loggedin ? 'Start' : 'Login';

        return (
            <div className={classes.Container}>
                <div className={classes.Card}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <div className={classes.Back}>
                            <MdArrowBack size="40px" color="var(--text-dark)"/>
                        </div>
                    </Link>
                    <img src={thinking} alt="thinking person" />
                    <div className={classes.Text}>
                        { this.state.guide.length > 0 ? this.state.guide[0].content : null }
                    </div>
                    {
                        this.state.loggedin ?
                            <div className={classes.Button} onClick={this.props.end}>
                                {btnLabel}
                            </div>
                            :
                            <Link to="/login-signup" style={{ textDecoration: 'none' }}>
                                <div className={classes.Button}>
                                    {btnLabel}
                                </div>
                            </Link>
                    }
                </div>
            </div>
        );
    }

}

export default withRouter(GuideCard);