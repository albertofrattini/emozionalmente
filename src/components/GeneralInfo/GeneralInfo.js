import React from 'react';
import classes from './GeneralInfo.css';
import InfoCard from './InfoCard/InfoCard';
import poliLogo from '../../assets/images/polimi-logo.png';
import i3labLogo from '../../assets/images/i3lab.png';

const generalInfo = (props) => (
    <div className={classes.GeneralInfo}>
        <div className={classes.Container}>
            <InfoCard 
                img={<img src={poliLogo} alt="polimi logo"/>}
                text={props.cardsx}/>
            <InfoCard 
                img={<img src={i3labLogo} alt="i3lab logo"/>}
                text={props.carddx}/> 
        </div>
    </div>
);

export default generalInfo;