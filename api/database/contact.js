let db;

module.exports.setupContactDb = async function (database) {
    db = database;
    return db.schema.hasTable('contact').then(exists => {
        if (!exists) {
            return db.schema.createTable('contact', table => {
                table.increments('id');
                table.text('sender');
                table.text('email');
                table.text('content');
            });
        }
    });
}

module.exports.insert = function (element) {
    return db('contact').insert(element);
}