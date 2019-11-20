import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import SentenceCard from '../../components/SentenceCard/SentenceCard';
import ListenButton from '../../components/ListenButton/ListenButton';
import EvaluationButtons from '../../components/EvaluationButtons/EvaluationButtons';

class Evaluate extends Component {

    phrases = [
        "Il Duomo ha un portale gotico del Quattrocento.",
        "Tale cappella è ora in ristrutturazione.",
        "Ha avuto due figli da un matrimonio precedente.",
        "Ciò potrebbe fornire una spiegazione al fenomeno della cosiddetta materia oscura.",
        "Durante la seconda guerra mondiale si impegnò in Indocina contro l'esercito giapponese.",
        "Successivamente trascorse cinque anni come legato di Cesare durante le campagne in Gallia."
    ];

    emotions = [
        "Happiness",
        "Sadness",
        "Fear",
        "Neutral",
        "Anger",
        "Surprise",
        "Disgust"
    ];

    state = {
        index: 0,
        progress: 0,
        emotionIndex: 0
    }

    changeSentence = () => {
        let currIndex = this.state.index;
        if (currIndex < this.phrases.length) {
            this.setState({index: currIndex + 1});
        } else {
            this.setState({index: 0});
        }
    }

    changeEmotion = (event) => {
        this.setState({ emotionIndex: event.target.id })
    }


    render () {
        return (
            <Aux>
                <SentenceCard 
                    sentence={this.phrases[this.state.index]} 
                    clicked={this.changeSentence}   
                />
                <ListenButton />
                <EvaluationButtons 
                    emotion={this.emotions[this.state.emotionIndex]} 
                    over={this.changeEmotion.bind(this.state.emotionIndex)}/>
            </Aux>
        );
    }

}

export default Evaluate;