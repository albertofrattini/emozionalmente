import React from 'react';
import classes from './Loader.css';
import { FiLoader } from 'react-icons/fi';

const loader = (props) => {

    let container = classes.Container;

    if (!props.pageLoading) {
        container = [classes.Container, classes.Transparent].join(' ');
    } 

    return (

        <div className={container}>
            <FiLoader className={classes.Loader}/>
        </div>

    );

}

export default loader;