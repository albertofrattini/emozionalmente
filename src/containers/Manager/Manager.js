import React, { Component } from 'react';
import axios from 'axios';
import Aux from '../../hoc/Aux/Aux';
import classes from './Manager.css';

class Manager extends Component {

    state = {
        isAuthorized: false,
        request: {
            method: '',
            url: '',
            data: {}
        },
        target: '',
        id: '',
        additionalPutParameters: 0,
        showPreview: false,
        showData: false,
        responseData: []
    }

    componentDidMount () {

        
        axios.get('/api/users/isAuthorized')
            .then(response => {
                this.setState({ isAuthorized: response.data.authorized });
            })
            .catch(error => {
                console.error(error);
            });
        

    }


    setMethod = (event) => {
        this.setState({ 
            request: { 
                ...this.state.request,
                method : event.target.value,
                data: {} 
            },
            additionalPutParameters: 0,
            showPreview: false,
            showData: false,
            id: ''
        });
    }

    setTarget = (event) => {
        let url;
        if (event.target.value === '') {
            url = '';
        } else {
            url = `/api/rest/${event.target.value}`;
        }
        this.setState({
            request: {
                ...this.state.request,
                url: url,
                data: {}
            },
            target: event.target.value,
            showPreview: false,
            showData: false,
            id: ''
        });
    }

    updateId = (event) => {
        this.setState({ 
            id: event.target.value,
            showPreview: false,
            showData: false
        });
    }

    addLanguageToData = (event) => {
        this.setState({
            request: {
                ...this.state.request,
                data: {
                    ...this.state.request.data,
                    language: event.target.value
                }
            },
            showPreview: false,
            showData: false
        });
    }

    addSentenceToData = (event) => {
        this.setState({
            request: {
                ...this.state.request,
                data: {
                    ...this.state.request.data,
                    sentence: event.target.value
                }
            },
            showPreview: false,
            showData: false  
        });
    }

    addPageToData = (event) => {
        this.setState({
            request: {
                ...this.state.request,
                data: {
                    ...this.state.request.data,
                    page: event.target.value
                }
            },
            showPreview: false,
            showData: false  
        });
    } 

    addPositionToData = (event) => {
        this.setState({
            request: {
                ...this.state.request,
                data: {
                    ...this.state.request.data,
                    position: event.target.value
                }
            },
            showPreview: false,
            showData: false 
        });
    } 

    addContentToData = (event) => {
        this.setState({
            request: {
                ...this.state.request,
                data: {
                    ...this.state.request.data,
                    content: event.target.value
                }
            },
            showPreview: false,
            showData: false  
        });
    } 

    addAdditionalToData = (event) => {
        this.setState({
            request: {
                ...this.state.request,
                data: {
                    ...this.state.request.data,
                    additional: event.target.value
                }
            },
            showPreview: false,
            showData: false  
        });
    } 

    addParameters = () => {
        const newValue = this.state.additionalPutParameters + 1;
        this.setState({ 
            additionalPutParameters: newValue,
            showPreview: false,
            showData: false
        });
    }

    addParameterToData = () => {
        var attributes = document.querySelectorAll('input.inputAttribute');
        var values = document.querySelectorAll('input.inputValue');
        var parameters = {};
        for (var i=0; i<attributes.length; i++) {
            if (attributes[i].value !== '' && values[i].value !== '') {
                parameters[attributes[i].value] = values[i].value;
            }
        }
        this.setState({
            request: {
                ...this.state.request,
                data: parameters
            },
            showPreview: false,
            showData: false
        });
    }

    performQuery = () => {
        if (!this.state.showPreview) return this.setState({ showPreview: true });
        if (this.state.request.method === '' || this.state.request.url === '') {
            return console.log('You need to provide both a method and a target!');
        }
        if (this.state.id === '') {
            axios(this.state.request)
                .then(response => {
                    this.setState({
                        showData: true,
                        responseData: response.data
                    });
                });
        } else {
            let options = {
                method: this.state.request.method,
                url: `${this.state.request.url}/${this.state.id}`,
            };
            if (this.state.request.method === 'put') {
                options = {
                    ...options,
                    data: this.state.request.data
                }
            }
            axios(options)
                .then(response => {
                    this.setState({
                        showData: true,
                        responseData: response.data
                    });
                });
        }
    }

    queryParameters = () => {
        switch (this.state.request.method) {
            // GET
            case 'get':
                switch (this.state.target) {
                    case 'descriptions':
                        return (
                            <div className={classes.Row}>
                                <div className={classes.Column}>
                                    <span>
                                        The name of the page in which the description is...
                                        If you don't provide a name, all pages' descriptions will be retrieved
                                    </span>
                                    <input onChange={this.updateId}
                                        placeholder="PAGE">
                                    </input>
                                </div>
                                <button onClick={this.performQuery}>SUBMIT</button>
                            </div>
                        );
                    case 'samples':
                        return (
                            <div className={classes.Row}>
                                <div className={classes.Column}>
                                    <span>
                                        The username of the samples' speaker...
                                        If you don't provide a value, all samples will be retrieved
                                    </span>
                                    <input onChange={this.updateId}
                                        placeholder="USERNAME">
                                    </input>
                                </div>
                                <button onClick={this.performQuery}>SUBMIT</button>
                            </div>
                        );
                    case 'evaluations':
                            return (
                                <div className={classes.Row}>
                                    <div className={classes.Column}>
                                        <span>
                                            The username of the samples' evaluator...
                                            If you don't provide a value, all evaluations will be retrieved
                                        </span>
                                        <input onChange={this.updateId}
                                            placeholder="USERNAME">
                                        </input>
                                    </div>
                                    <button onClick={this.performQuery}>SUBMIT</button>
                                </div>
                            );
                    case 'sentences':
                            return (
                                <div className={classes.Row}>
                                    <div className={classes.Column}>
                                        <span>
                                            The id of the sentence you want to retrieve...
                                            If you don't provide an id, all sentences will be retrieved
                                        </span>
                                        <input onChange={this.updateId}
                                            placeholder="ID">
                                        </input>
                                    </div>
                                    <button onClick={this.performQuery}>SUBMIT</button>
                                </div>
                            );
                    case 'users':
                            return (
                                <div className={classes.Row}>
                                    <div className={classes.Column}>
                                        <span>
                                            The username of the user you want to retrieve...
                                            If you don't provide a value, all users will be retrieved
                                        </span>
                                        <input onChange={this.updateId}
                                            placeholder="USERNAME">
                                        </input>
                                    </div>
                                    <button onClick={this.performQuery}>SUBMIT</button>
                                </div>
                            );
                    default:
                        return null;
                }
            // POST
            case 'post':
                switch (this.state.target) {
                    case 'descriptions':
                        return (
                            <div className={classes.Put}>
                                <div className={classes.Row}>
                                    <div className={classes.Column}>
                                        <span>
                                            Select a language
                                        </span>
                                        <select onChange={this.addLanguageToData}>
                                            <option value=""></option>
                                            <option value="it">Italian</option>
                                            <option value="en">English</option>
                                        </select>
                                    </div>
                                    <div className={classes.Column}>
                                        <span>
                                            The PAGE in which the description will be inserted...
                                            It is recommended!
                                        </span>
                                        <input placeholder="PAGE" onChange={this.addPageToData}/>
                                    </div>
                                    <div className={classes.Column}>
                                        <span>
                                            The POSITION name identifier...
                                        </span>
                                        <input placeholder="POSITION" onChange={this.addPositionToData}/>
                                    </div>
                                    <div className={classes.Column}>
                                        <span>
                                            The CONTENT...
                                        </span>
                                        <input placeholder="CONTENT" onChange={this.addContentToData}/>
                                    </div>
                                    <div className={classes.Column}>
                                        <span>
                                            ADDITIONAL text, useful for FAQ answers or button urls (e.g. '/record')
                                        </span>
                                        <input placeholder="ADDITIONAL" onChange={this.addAdditionalToData}/>
                                    </div>
                                    <button onClick={this.performQuery}>SUBMIT</button>
                                </div>
                            </div>
                        );
                    case 'sentences':
                        return (
                            <div className={classes.Row}>
                                <div className={classes.Column}>
                                    <span>
                                        Select a language (Required)
                                    </span>
                                    <select onChange={this.addLanguageToData}>
                                        <option value=""></option>
                                        <option value="it">Italian</option>
                                        <option value="en">English</option>
                                    </select>
                                </div>
                                <div className={classes.Column}>
                                    <span>
                                        Write the sentence (Required)
                                    </span>
                                    <input placeholder="SENTENCE" onChange={this.addSentenceToData}/>
                                </div>
                                <button onClick={this.performQuery}>SUBMIT</button>
                            </div>
                        );
                    default:
                        return null;

                }
            // UPDATE
            case 'put':
                return (
                    <div id="putelements" className={classes.Put}>
                        <div className={classes.Row}>
                            <div className={classes.Column}>
                                <span>
                                    The id of the element you want to update...
                                    An id is mandatory to complete the operation
                                </span>
                                <input onChange={this.updateId}
                                    placeholder="ID">
                                </input>
                            </div>
                            <button onClick={this.performQuery}>SUBMIT</button>
                        </div>
                        <div className={classes.Row}>
                            <div className={classes.Column}>
                                <span>
                                    Click here to add more parameters to the update.
                                    If they are too many just leave them blank!
                                </span>
                                <button onClick={this.addParameters}>MORE</button>
                            </div>
                            <div className={classes.Column}>
                                <span>
                                    Click this button when you have finished adding parameters.
                                    They will then be added to the request.
                                </span>
                                <button onClick={this.addParameterToData}>ADD</button>
                            </div>
                        </div>
                    </div>
                );
            // DELETE
            case 'delete':
                return (
                    <div className={classes.Row}>
                        <div className={classes.Column}>
                            <span>
                                The id of the element you want to delete...
                                An id is mandatory to complete the operation
                            </span>
                            <input onChange={this.updateId}
                                placeholder="ID">
                            </input>
                        </div>
                        <button onClick={this.performQuery}>SUBMIT</button>
                    </div>
                );
            default:
                return null;
        }
    }







    render () {

        const additionalPutParameters = [...Array( this.state.additionalPutParameters )].map( (_, i) => {
            return (
                <div key={i} className={classes.Row}>
                    <div className={classes.Column}>
                        <span>
                            Attribute you want to change
                        </span>
                        <input className="inputAttribute" placeholder="ATTRIBUTE" />
                    </div>
                    <div className={classes.Column}>
                        <span>
                            The new value you want to give
                        </span>
                        <input className="inputValue" placeholder="NEW VALUE" />
                    </div>
                </div>
            );
        });

        const preview = (
            <div className={classes.Column}>
                <h4>
                    This is how your request looks like. If you want to perform the request, click SUBMIT again.
                    Otherwise, just reload the page or change method, parameters or target to refresh the body of the request.
                </h4>
                <div className={classes.Row}>
                    <div className={classes.Column}>
                        <h5>Method</h5>
                        <span>{this.state.request.method}</span>
                    </div>
                    <div className={classes.Column}>
                        <h5>Url</h5>
                        <span>
                            {
                            this.state.id === '' ? 
                            this.state.request.url 
                            :
                            `${this.state.request.url}/${this.state.id}`
                            }
                        </span>
                    </div>
                </div>
                <div className={classes.Column}>
                    <h5>Data</h5>
                    <div className={classes.Row}>
                            {Object.keys(this.state.request.data).map((key, i) => {
                                return (
                                    <div key={i} className={classes.Column}>
                                        <span style={{ textDecoration: 'underline' }}>{key}</span>
                                        <span>{this.state.request.data[key]}</span>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        );

        const fetchedData = (
            <div className={classes.Column}>
                {this.state.responseData.map((el, i) => {
                    return (
                        <div key={i} className={classes.Row}>
                            <p> {i + 1} </p>
                            <p>{JSON.stringify(el, null, '\t')}</p>
                        </div>
                    );
                })}
            </div>
        );

        return (
            <Aux>
                { this.state.isAuthorized ?
                    <div className={classes.Container}>
                        <div className={classes.MainRow}>
                            <div className={classes.Column}>
                                <span>Method</span>
                                <select onChange={this.setMethod}>
                                    <option value=""></option>
                                    <option value="get">GET</option>
                                    <option value="delete">DELETE</option>
                                    <option value="put">PUT</option>
                                    <option value="post">POST</option>
                                </select>
                            </div>
                            <div className={classes.Column}>
                                <span>Target</span>
                                <select onChange={this.setTarget}>
                                    <option value=""></option>
                                    <option value="sentences">SENTENCES</option>
                                    <option value="descriptions">DESCRIPTIONS</option>
                                    <option value="samples">SAMPLES</option>
                                    <option value="evaluations">EVALUATIONS</option>
                                    <option value="users">USERS</option>
                                </select>
                            </div>
                        </div>
                        {this.queryParameters()}
                        {additionalPutParameters}
                        {this.state.showPreview ? preview : null}
                        {this.state.showData ? 
                            this.state.responseData.length > 0 ? 
                                fetchedData 
                                :
                                <h4>No elements has been found...</h4>
                                : 
                                null}
                    </div>
                    :
                    <div className={classes.Container}>
                        <div className={classes.Forbidden}>
                            <h1>403</h1>
                            <h3>Access forbidden! You must be an administrator to access this page!</h3>
                        </div>
                    </div>
                }
            </Aux>
        );

    }
}

export default Manager;