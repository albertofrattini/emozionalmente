let db;

module.exports.setupDescriptionsDb = function (database) {
    db = database;
    return db.schema.hasTable('descriptions').then(exists => {
        if (!exists) {
            db.schema.createTable('descriptions', table => {
                table.increments();
                table.text('page');
                table.text('id');
                table.text('content');
            });
        }
    });
}

module.exports.getdescription = function (page, id) {
    return db('descriptions').where('page', page).andWhere('id', id).first();
}