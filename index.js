const express = require('express');
const app = express();
const { setupDb } = require('./database/builder');
const bodyParser = require('body-parser');

const serverPort = process.env.PORT || 8080
const router = require('./routers/index')(express); 


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
