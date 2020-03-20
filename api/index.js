require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const { setupDb } = require('./database/builder');
const bodyParser = require('body-parser');
const path = require('path');
const serverPort = 8080;


function test (req,res,next){
	console.log("url: " +req.originalUrl);
	console.log(__dirname);
		next();
	}

var requestTime = function (req, res, next) {
	req.requestTime = Date.now();
	next();
}

var dataPath = function (req, res, next) {
	req.samplesUrl = path.join(__dirname, '/database/samples/');
	next();
}

var itDefault = function (req, res, next) {
	if (!req.session.lang) {
		req.session.lang = 'it';
	}
	next();
}

// app.use(test);
app.use(express.static(__dirname + "/../build"));

app.use(session({
	secret: 'segreto_da_sostituire_prima_del_deployment',
	resave: false,
	saveUninitialized: true
}));
app.use(itDefault);
app.use(requestTime);
app.use(dataPath);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./router')(app);
require('./managerrouter')(app);

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + "/../build/index.html"))
});

app.listen(
	serverPort,
	() => {
		setupDb();
		console.log(`\nThe server is now listening on PORT ${serverPort}...\n`);
	}
);
