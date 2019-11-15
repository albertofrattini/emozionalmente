import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

/** 
 * This is the entry point of our React application. Here we reach the element with ID=root
 * and we substitute the innerHTML with what has been returned by the App component.
**/
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

/** 
 **************************
 *******   NOTES   ********
 ************************** 
 * 
 * ClassBased Component : when we create a class that extends 'component'. Better to use these ones
 * when we want to manage the state of our application, i.e. we are dealing with a stateful component.
 * 
 * Functional Component : it is created as an arrow function assigned to a const. We then export the 
 * constant and make it available to other components. Better to use when no state needs to be updated, 
 * i.e. it is a stateless component.
 * 
 * Stateful components are also known as Containers and will be put inside the 'components' folder.
 * Statelss components are just known as Components and inserted in the folder of the same name.
 * 
 * 
 *******   Using CSS modules   *******
 * Save everything with Git
 * npm run eject
 * ./config/webpack.config.dev.js and ./config/webpack.config.prod.js and insert:
 *      modules: true,
 *      localIdentName: '[name]__[local]__[hash:base64:5]'
 * inside 'css-loader' options.
 *******
 *
 * 
 * To do INPUT VALIDATION for 'props', we need to install some dependency: npm install --save prop-types
 * It's like Joi for NodeJS  Backend
 * -> see lesson 10 / module burger basic 
 * 
 * Transform an Array of key-value pairs into an array of Components (2x salad, 1x meat, ecc...)
 * 
 * 
 * Remember that:
 *      import classes from 'something.css';
 * imports just a set of strings adjusted to the specific component in which they have been imported. 
 * 
 * For better PERFORMANCE understanding, go to module8/lesson37 -> shouldComponentUpdate?
 * Other component lifecycles: componentDidMount, componentDidUpdate, ecc...
 * 
 * 
 * CURRENTLY LOADED PATH: this.props.match.url
 * To go to 'website.com/page/new-page' from '/page' we need to do 
 * <Link to={{pathname: this.props.match.url + '/new-page'}}
 * i.e. we are creating a Relative path, normally we have Absolute path.
 * 
 * #446099 nice blue
 * 
 * 
**/