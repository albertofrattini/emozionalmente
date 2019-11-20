import React, { Component } from 'react';
// import classes from './Record.css';
import Aux from '../../hoc/Aux/Aux';
// import RecordCardsLayer from '../../components/RecordCardsLayer/RecordCardsLayer';
import SentenceCard from '../../components/SentenceCard/SentenceCard';
import RecordButton from '../../components/RecordButton/RecordButton';
// import Progress from '../../components/Progress/Progress';
import CheckListen from '../../components/CheckListen/CheckListen';

class Record extends Component {

    phrases = [
        "Il Duomo ha un portale gotico del Quattrocento.",
        "Tale cappella è ora in ristrutturazione.",
        "Ha avuto due figli da un matrimonio precedente.",
        "Ciò potrebbe fornire una spiegazione al fenomeno della cosiddetta materia oscura.",
        "Durante la seconda guerra mondiale si impegnò in Indocina contro l'esercito giapponese.",
        "Successivamente trascorse cinque anni come legato di Cesare durante le campagne in Gallia."
    ];
    state = {
        index: 0,
        progress: 0
    }

    changeSentence = () => {
        let currIndex = this.state.index;
        if (currIndex < this.phrases.length) {
            this.setState({index: currIndex + 1});
        } else {
            this.setState({index: 0});
        }
    }

    render () {
        return (
            <Aux>
                {/* <Progress progNum={this.state.progress}/> */}
                <SentenceCard 
                    sentence={this.phrases[this.state.index]} 
                    clicked={this.changeSentence}
                    emotion={"Disgust"}    
                />
                <RecordButton />
                <CheckListen />
            </Aux>
        );
    }

}

export default Record;