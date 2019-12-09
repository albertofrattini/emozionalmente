import React from 'react';
import classes from './GeneralInfo.css';
import InfoCard from './InfoCard/InfoCard';
import { FaDatabase } from 'react-icons/fa';
import poliLogo from '../../assets/images/polimi-logo.png';

const generalInfo = (props) => (
    <div className={classes.GeneralInfo}>
        <div className={classes.Container}>
            <InfoCard 
                img={<img src={poliLogo} alt="polimi logo"/>}
                text={props.cardsx[0]}
                action={props.btnsx[0]}
                path={props.btnsx[1]} />
            <InfoCard 
                img={<FaDatabase size="80px" color="var(--text-light)" />}
                text={props.carddx[0]}
                action={props.btndx[0]} 
                path={props.btndx[1]} /> 
        </div>
    </div>
);

export default generalInfo;