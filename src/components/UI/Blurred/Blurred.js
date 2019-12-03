import React from 'react';

import classes from './Blurred.css';

const blurred = (props) => (
    props.show ? <div className={classes.Blurred}></div> : null
);

export default blurred;