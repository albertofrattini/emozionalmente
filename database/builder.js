const sqlDatabaseConstructor = require('knex');
const environment = process.env.NODE_ENV || 'development';
const conf = require('./settings');
const envConfig = conf[environment];
const database = sqlDatabaseConstructor(envConfig);

let { setupSamplesDb } = require('./samples');
let { setupDescriptionsDb } = require('./descriptions');
let { setupUsersDb } = require('./users');

function setupDb () {
	setupSamplesDb(database);
	setupDescriptionsDb(database);
	setupUsersDb(database);
}

module.exports = { database: database, setupDb };