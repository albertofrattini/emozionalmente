import React from 'react';
import classes from './Question.css';
import Aux from '../../../hoc/Aux/Aux';
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md';


const question = (props) => (
    <Aux>
        <div className={classes.DivLine}></div>
        <div className={classes.Container}>
            { 
                props.active ? 
                    <div className={classes.ArrowDown} onClick={props.close}>
                        <MdKeyboardArrowDown size="32px" color="var(--text-darker)" />
                    </div> 
                    : 
                    <div className={classes.ArrowRight} onClick={props.open}>
                        <MdKeyboardArrowRight size="32px" color="var(--text-darker)" />
                    </div> 
            }
            <div className={classes.Text}>
                <div className={classes.Question}>
                    {props.question}
                </div>
                { 
                    props.active ? 
                        <div className={classes.Answer}>
                            {props.answer}
                        </div> 
                        : 
                        null 
                }
            </div>
        </div>
    </Aux>
);

export default question;