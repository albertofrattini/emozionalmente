import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import classes from './ActivityOptions.css';

const activityOptions = (props) => (
    <div className={classes.Options}>
                            <Link to="/" style={{ textDecoration: 'none' }}>
                                <div className={classes.BackButton} >
                                    <MdArrowBack size="24px" color="var(--text-dark)"/>
                                </div>
                            </Link>
                            <NavLink className={classes.Link} to="/record" activeStyle={{
                                    backgroundColor: 'transparent',
                                    color: '#f9aa33',
                                    borderBottom: '2px solid #f9aa33'
                                }}>{props.recLabel}</NavLink>
                            <NavLink className={classes.Link} to="/evaluate" activeStyle={{
                                    backgroundColor: 'transparent',
                                    color: '#f9aa33',
                                    borderBottom: '2px solid #f9aa33'
                                }}>{props.evalLabel}</NavLink>
                        </div>
);

export default activityOptions;