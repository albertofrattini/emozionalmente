const express = require('express');
const app = express();
const session = require('express-session');
const { setupDb } = require('./database/builder');
const bodyParser = require('body-parser');
const path = require('path');
const serverPort = process.env.PORT || 8080
const router = require('./routers/index')(express); 

var requestTime = function (req, res, next) {
	req.requestTime = Date.now();
	next();
}

app.use(session({
	secret: 'segreto_da_sostituire_prima_del_deployment',
	resave: false,
	saveUninitialized: true
}));
app.use(requestTime);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/data/samples', function (req, res, next) {
	req.samplesUrl = path.join(__dirname, '/database/samples/');
	req.sentenceid = req.query.sentenceid;
	req.emotion = req.query.emotion;
	next();
});
app.use('/api/data/download', function (req, res, next) {
	req.samplesUrl = path.join(__dirname, '/database/samples/');
	next();
});

app.use('/api', router);

app.listen(
	serverPort,
	() => {
		setupDb();
		console.log(`\nBackend is now alive and listening on PORT: ${serverPort}...\n`);
	}
);
