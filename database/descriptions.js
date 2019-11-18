let db;

module.exports.setupDescriptionsDb = function (database) {
    db = database;
    let initDescriptions = require('./init/descriptions.json');
    return db.schema.hasTable('descriptions').then(exists => {
        if (!exists) {
            db.schema.createTable('descriptions', table => {
                table.increments();
                table.text('page');
                table.text('position');
                table.text('content');
            }).then((_) => {
                return db('descriptions').insert(initDescriptions);
            });
        }
    });
}

module.exports.getdescriptionsof = function (page) {
    return db('descriptions').where('page', page);
}