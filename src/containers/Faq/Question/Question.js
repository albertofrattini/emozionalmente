import React from 'react';
import classes from './Question.css';
import Aux from '../../../hoc/Aux/Aux';
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md';


const question = (props) => (
    
    <Aux>
        <div className={classes.Container}>
            { 
                props.active ? 
                    <div className={classes.ArrowDown} onClick={props.toggleQuestion}>
                        <MdKeyboardArrowDown size="32px" color="var(--text-darker)" />
                    </div> 
                    : 
                    <div className={classes.ArrowRight} onClick={props.toggleQuestion}>
                        <MdKeyboardArrowRight size="32px" color="var(--text-darker)" />
                    </div> 
            }
            <div className={classes.Text}>
                <div className={classes.Question} onClick={props.toggleQuestion}>
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