import React from 'react';
import classes from './GeneralInfo.css';
import InfoCard from './InfoCard/InfoCard';
import { MdStoreMallDirectory } from 'react-icons/md';

const generalInfo = (props) => (
    <div className={classes.GeneralInfo}>
        <div className={classes.Container}>
            <InfoCard 
                svg={<MdStoreMallDirectory size="48px" color="var(--bluer)" />}
                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                action="CONTACT US"
                path="/contact-us" />
            <InfoCard 
                svg={<MdStoreMallDirectory size="48px" color="var(--bluer)" />}
                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                action="CONTRIBUTE" 
                path="/contribute" /> 
        </div>
    </div>
);

export default generalInfo;