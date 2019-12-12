import React, { Component } from 'react';
import Aux from '../Aux/Aux';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import classes from './Layout.css';
import { userContext } from '../Context/UserContext';
import axios from 'axios';

class Layout extends Component {

    state = {
        showSideDrawer: false,
        items: null
    }

    prova = {
        "Record": "/record",
        "Evaluate": "/evaluate"
    }

    componentDidMount () {

        axios.get('/api/descriptions/navbar')
            .then(response => {
                const items = {};
                response.data.map(el => {
                    return items[el.content] = el.additional;
                });
                this.setState({ items: items });
            });

    }

    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer: false});
    }

    sideDrawerOpenedHandler = () => {
        this.setState((prevState) => {
            return {showSideDrawer: !prevState.showSideDrawer};
        });
    }

    render () {

        /**  
         * I cannot simply output 2 elements one after the other, we need to return only one element
         * with others nested inside of it. There are two solutions:
         *  - one <div> container
         *  - an auxiliary component (we will create a folder named ./hoc where we store Aux.js that
         *   will do the job we need)
         * 
         * We will manage here the clicking of the menu button, the opening of the SideDrawer and
         * the appearance of the Backdrop in the background. Consequently, we want to close the SD
         * and delete the Backdrop when the menu closes.
         * To manage this state change, we need to manage the state of the application, and so we need
         * to make this component, a Classbased component to manage the State.
        **/
        return (
            <Aux>
                {this.state.items === null ?
                    null
                    :
                    <userContext.Consumer>
                        {
                            ({ user, logout }) => 
                            (
                            <React.Fragment>
                                <Toolbar 
                                    navitems={this.state.items}
                                    user={user}
                                    logout={logout}
                                    open={this.sideDrawerOpenedHandler}/>
                                <SideDrawer 
                                    open={this.state.showSideDrawer} 
                                    closed={this.sideDrawerClosedHandler}
                                    toggleClose={this.sideDrawerClosedHandler}
                                    navitems={this.state.items}
                                    user={user}
                                    logout={logout}/>
                            </React.Fragment>)
                        }
                    </userContext.Consumer>                
                }
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        );
    }

}

export default Layout; 