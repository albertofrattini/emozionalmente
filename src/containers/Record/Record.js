import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Progress from '../../components/Progress/Progress';
import RecordCardsLayer from '../../components/RecordCardsLayer/RecordCardsLayer';

class Record extends Component {

    render () {
        return (
            <Aux>
                <Progress progNum={0}/>
                <RecordCardsLayer />
            </Aux>
        );
    }

}

export default Record;