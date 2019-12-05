import React, { Component } from 'react';
import classes from './Faq.css';
import Question from './Question/Question';
import axios from 'axios';

class Faq extends Component {

    state = {
        openedQuestion: -1,
        faqs: null
    }

    componentDidMount () {

        axios.get('/api/descriptions/faq?lang=it')
            .then(response => {
                const faqs = [];
                response.data.map((el, i) => {
                    return faqs[i] = [el.content, el.additional];
                });
                this.setState({ faqs: faqs });
            });

    }

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

        let renderedQuestions = 
            this.state.faqs === null ?
                null 
                :
                this.state.faqs.map((faq, i) => {
                    const isActive = i === currQuestion;
                    return <Question 
                                key={i}
                                open={() => this.openQuestion(i)}
                                close={this.closeQuestion}
                                active={isActive} 
                                question={faq[0]}
                                answer={isActive ? this.state.faqs[1][i] : null}  />
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