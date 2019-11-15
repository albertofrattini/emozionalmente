let db;

module.exports.setupSamplesDb = function (database) {
    db = database;
    return db.schema.hasTable('samples').then(exists => {
        if (!exists) {
            db.schema.createTable('samples', table => {
                table.increments();
                table.text('identifier');
                table.text('emotion');
                table.timestamp('timestamp');
                table.text('recorder');
            });
        }
    });
}

module.exports.getsample = function (id) {
    return db('samples').where('identifier', id).first();
}