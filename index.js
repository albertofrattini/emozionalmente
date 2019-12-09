const express = require('express');
const app = express();
const session = require('express-session');
const morgan = require('morgan');
const { setupDb } = require('./api/database/builder');
const bodyParser = require('body-parser');
const path = require('path');
const serverPort = process.env.PORT || 8080

var requestTime = function (req, res, next) {
	req.requestTime = Date.now();
	next();
}

var dataPath = function (req, res, next) {
	req.samplesUrl = path.join(__dirname, '/api/database/samples/');
	next();
}

var engDefault = function (req, res, next) {
	if (!req.session.lang) {
		req.session.lang = 'en';
	}
	next();
}

app.use(session({
	secret: 'segreto_da_sostituire_prima_del_deployment',
	resave: false,
	saveUninitialized: true
}));
app.use(engDefault);
app.use(requestTime);
app.use(dataPath);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./api/router')(app);

app.listen(
	serverPort,
	() => {
		setupDb();
		console.log(`\nThe server is now listening on PORT ${serverPort}...\n`);
	}
);
