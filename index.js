const express = require('express');
const app = express();
const session = require('express-session');
const { setupDb } = require('./database/builder');
const bodyParser = require('body-parser');

const serverPort = process.env.PORT || 8080
const router = require('./routers/index')(express); 


app.use(session({
	/*
	genid: (request) => {
		return uuid();
	},
	*/
	secret: 'segreto_da_sostituire_prima_del_deployment',
	resave: false,
	saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', router);

app.listen(
	serverPort,
	() => {
		setupDb();
		console.log(`\nBackend is now alive and listening on PORT: ${serverPort}...\n`);
	}
);
