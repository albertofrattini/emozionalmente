const express = require('express');
const app = express();
const sqlDatabaseConstructor = require('knex');

const serverPort = process.env.PORT || 8080

app.get('/v2/emotions', (request, response) => {
	response.send('Happiness, Sadness, Anger, Disgust, Surprise, Fear!');
})

app.listen(
	serverPort,
	() => {
		console.log(`Backend is now alive and listening on PORT: ${serverPort}...`);
		
	}
);
