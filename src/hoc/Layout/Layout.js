import React, { Component } from 'react';
import Aux from '../Aux/Aux';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import classes from './Layout.css';
import { userContext } from '../Context/UserContext';

class Layout extends Component {

    state = {
        showSideDrawer: false
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
                <userContext.Consumer>
                    {
                        ({ user, logout }) => 
                        (<Toolbar 
                            user={user}
                            logout={logout}
                            open={this.sideDrawerOpenedHandler}/>)
                    }
                </userContext.Consumer>                
                <SideDrawer 
                    open={this.state.showSideDrawer} 
                    closed={this.sideDrawerClosedHandler}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        );
    }

}

export default Layout; 