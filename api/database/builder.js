const sqlDatabaseConstructor = require('knex');
const environment = process.env.NODE_ENV || 'development';
const conf = require('./settings');
const envConfig = conf[environment];
const database = sqlDatabaseConstructor(envConfig);

let { setupDataDb } = require('./data');
let { setupDescriptionsDb } = require('./descriptions');
let { setupUsersDb } = require('./users');
let { setupContactDb } = require('./contact');
let { setupContributeDb } = require('./contribute');

function setupDb () {
	setupDataDb(database);
	setupDescriptionsDb(database);
	setupUsersDb(database);
	setupContactDb(database);
	setupContributeDb(database);
}

module.exports = { database: database, setupDb };