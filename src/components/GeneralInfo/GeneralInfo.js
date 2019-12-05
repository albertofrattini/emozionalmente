import React from 'react';
import classes from './GeneralInfo.css';
import InfoCard from './InfoCard/InfoCard';
import { MdStoreMallDirectory } from 'react-icons/md';

const generalInfo = (props) => (
    <div className={classes.GeneralInfo}>
        <div className={classes.Container}>
            <InfoCard 
                svg={<MdStoreMallDirectory size="48px" color="var(--bluer)" />}
                text={props.cardsx[0]}
                action={props.btnsx[0]}
                path={props.btnsx[1]} />
            <InfoCard 
                svg={<MdStoreMallDirectory size="48px" color="var(--bluer)" />}
                text={props.carddx[0]}
                action={props.btndx[0]} 
                path={props.btndx[1]} /> 
        </div>
    </div>
);

export default generalInfo;