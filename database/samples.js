let db;

module.exports.setupSamplesDb = function (database) {
    db = database;
    let initSamples = require('./init/samples.json');
    return db.schema.hasTable('samples').then(exists => {
        if (!exists) {
            db.schema.createTable('samples', table => {
                table.increments();
                table.text('identifier');
                table.text('emotion');
                table.text('timestamp');
                table.text('speaker');
            }).then((_) => {
                return db('samples').insert(initSamples);
            });
        }
    });
}

module.exports.getsample = function (id) {
    return db('samples').where('identifier', id).first();
}