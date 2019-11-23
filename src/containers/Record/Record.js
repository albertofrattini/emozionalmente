import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import SentenceCard from '../../components/SentenceCard/SentenceCard';
import RecordButton from '../../components/RecordButton/RecordButton';
// import Progress from '../../components/Progress/Progress';
import CheckListen from '../../components/CheckListen/CheckListen';
import axios from 'axios';

class Record extends Component {

    state = {
        index: 0,
        progress: 0,
        sentences: []
    }

    componentDidMount () {  
        axios.get('/api/data/sentences?quantity=4')
            .then(response => {
                this.setState({
                    sentences: response.data,
                });
            });
    }

    changeSentence = () => {
        let currIndex = this.state.index;
        if (currIndex < this.state.sentences.length - 1) {
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
                    sentence={this.state.sentences.length > 0 ? 
                        this.state.sentences[this.state.index].sentence
                        : 'Loading...'
                    } 
                    clicked={this.changeSentence}
                    emotion={"Emotion"}    
                /> 
                <RecordButton />
                <CheckListen />
            </Aux>
        );
    }

}

export default Record;