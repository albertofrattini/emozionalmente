const express = require('express');
const app = express();
const session = require('express-session');
const morgan = require('morgan');
const { setupDb } = require('./database/builder');
const bodyParser = require('body-parser');
const path = require('path');
const serverPort = process.env.PORT || 8080
// const router = require('./routers/index')(express);

var requestTime = function (req, res, next) {
	req.requestTime = Date.now();
	next();
}

var dataPath = function (req, res, next) {
	req.samplesUrl = path.join(__dirname, '/database/samples/');
	next();
}

// app.use(morgan('tiny'));
app.use(session({
	secret: 'segreto_da_sostituire_prima_del_deployment',
	resave: false,
	saveUninitialized: true
}));
app.use(requestTime);
app.use(dataPath);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routers/router')(app);

// app.use('/api', router);

app.listen(
	serverPort,
	() => {
		setupDb();
		console.log(`\nBackend is now alive and listening on PORT: ${serverPort}...\n`);
	}
);
