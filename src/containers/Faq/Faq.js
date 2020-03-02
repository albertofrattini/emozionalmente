import React, { Component } from 'react';
import classes from './Faq.css';
import Question from './Question/Question';
import axios from 'axios';
import log from '../../logger';

class Faq extends Component {

    state = {
        openedQuestion: -1,
        content: {},
        faqs: null
    }

    componentDidMount () {

        axios.get('/api/descriptions/faq?lang=it')
            .then(response => {
                const faqs = [];
                const content = {};
                response.data.map((el, _) => {
                    if (el.position) {
                        return content[el.position] = el.content;
                    }
                    return faqs.push({
                        question: el.content,
                        answer: el.additional
                    });
                });
                this.setState({ faqs: faqs, content: content });
            });

    }

    openQuestion = (index) => {
        log('@AboutUs: Faq opened question');
        this.setState({
            openedQuestion: index
        });
    }

    closeQuestion = () => {
        this.setState({
            openedQuestion: -1
        })
    }

    toggleQuestion = (index) => {
        if (this.state.openedQuestion === index) {
            this.setState({
                openedQuestion: -1
            })
        } else {
            this.setState({
                openedQuestion: index
            });
        }
    }



    render () {

        const currQuestion = this.state.openedQuestion;

        let renderedQuestions = 
            this.state.faqs === null ?
                null 
                :
                this.state.faqs.map((el, i) => {
                    const isActive = i === currQuestion;
                    return <Question 
                                key={i}
                                toggleQuestion={() => this.toggleQuestion(i)}
                                active={isActive} 
                                question={el.question}
                                answer={isActive ? el.answer : null}  />
                });

        return (
            <div className={classes.Container}>
                <p style={{ fontSize: '32px' }} dangerouslySetInnerHTML={{
                    __html: this.state.content['intro1']
                }}></p>
                <p dangerouslySetInnerHTML={{
                    __html: this.state.content['intro2']
                }}></p>
                <div className={classes.Faq}>
                    <div className={classes.Questions}>
                        {renderedQuestions}
                    </div>
                </div>
            </div>
        );
    }
}

export default Faq;