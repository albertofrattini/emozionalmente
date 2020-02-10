let db;

module.exports.setupLogger = function(database) {

    db = database;

    return db.schema.hasTable('logger').then(exists => {
        if (!exists) {
            return db.schema.createTable('logger', table => {
                table.increments('id');
                table.text('timestamp');
                table.text('username');
                table.text('info');
            });
        }
    });
}

module.exports.insertLog = function (log) {
    return db('logger').insert(log);
}