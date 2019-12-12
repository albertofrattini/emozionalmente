import React from 'react';
import NavigationItems from '../NavigationItems/NavigationItems';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Aux from '../../../hoc/Aux/Aux';
import classes from './SideDrawer.css';
import { Link } from 'react-router-dom';

const sideDrawer = (props) => {

    let attachedClasses = [classes.SideDrawer, classes.Close];

    if (props.open) {
        attachedClasses = [classes.SideDrawer, classes.Open];
    }

    return (
        <Aux>
            {/**
             * Whenever I click on the backdrop, the Menu is closing because I trigget the 
             * .sideDrawerClosedHandler that changes the state of the Layout. The page is then
             * loaded again and the show property of the Backdrop will be set to false.
             */}
            <Backdrop show={props.open} clicked={props.closed}/>
            <div className={attachedClasses.join(' ')}>
                <nav>
                    <NavigationItems clicked={props.toggleClose} items={props.navitems}/>
                </nav>
                <div className={classes.Login}>
                    {
                        props.user.username ?
                            <div onClick={props.logout}>{props.user.username}</div>
                            :
                            <Link to="/login-signup">Login / Signup</Link>
                    }     
                </div>
            </div>

        </Aux>
    );
};

export default sideDrawer;