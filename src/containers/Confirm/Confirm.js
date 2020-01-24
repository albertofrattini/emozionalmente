import React, { Component } from 'react';
import axios from 'axios';
import classes from './Confirm.css';
import happyUser from '../../assets/images/user.png';

class Confirm extends Component {

    state = {
        confirming: true
    }

    componentDidMount () {
        const { id } = this.props.match.params;

        axios.get('/api/users/confirmation/' + id)
            .then(response => {
                console.log(response.data);
                this.setState({ confirming: false });
            })
            .catch(error => {
                console.log(error);
            });
    }


    render () {
        
        return (
            <div>
            {
                this.state.confirming ?
                <div></div>
                :
                <div className={classes.Confirm}>
                    <img src={happyUser} alt="happy face"/>
                    <h1>Thank you for confirming your email!</h1>
                    <h4>Now you can start having fun on Emozionalmente</h4>
                </div>

            }
            </div>
        );

    }

}

export default Confirm;