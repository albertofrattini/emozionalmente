let db;

module.exports.setupContributeDb = async function (database) {
    db = database;
    return db.schema.hasTable('contribute').then(exists => {
        if (!exists) {
            return db.schema.createTable('contribute', table => {
                table.increments('id');
                table.text('sender');
                table.text('email');
                table.text('content');
            });
        }
    });
}

module.exports.insert = function (element) {
    return db('contribute').insert(element);
}