import React, { Component } from 'react';
import classes from './Faq.css';
import Question from './Question/Question';

class Faq extends Component {

    state = {
        openedQuestion: -1
    }

    questions = [
        "Il Duomo ha un portale gotico del Quattrocento.",
        "Tale cappella è ora in ristrutturazione.",
        "Ha avuto due figli da un matrimonio precedente.",
        "Ciò potrebbe fornire una spiegazione al fenomeno della cosiddetta materia oscura.",
        "Durante la seconda guerra mondiale si impegnò in Indocina contro l'esercito giapponese.",
        "Successivamente trascorse cinque anni come legato di Cesare durante le campagne in Gallia."
    ];

    answers = [
        "Ciao1",
        "Ciao2",
        "Ciao3",
        "Ciao4",
        "Ciao5",
        "Ciao6"
    ];

    openQuestion = (index) => {
        this.setState({
            openedQuestion: index
        });
    }

    closeQuestion = () => {
        this.setState({
            openedQuestion: -1
        })
    }



    render () {

        const currQuestion = this.state.openedQuestion;

        let renderedQuestions = this.questions.map((question, i) => {
                                    const isActive = i === currQuestion;
                                    return <Question 
                                                key={i}
                                                open={() => this.openQuestion(i)}
                                                close={this.closeQuestion}
                                                active={isActive} 
                                                question={question}
                                                answer={isActive ? this.answers[i] : null}  />
                                });

        return (
            <div className={classes.Faq}>
                <div className={classes.Container}>
                    {renderedQuestions}
                </div>
            </div>
        );
    }
}

export default Faq;