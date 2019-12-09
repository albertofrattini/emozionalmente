let db;

module.exports.setupDescriptionsDb = function (database) {
    db = database;
    let initDescriptions = require('./init/descriptions.json');
    return db.schema.hasTable('descriptions').then(exists => {
        if (!exists) {
            db.schema.createTable('descriptions', table => {
                table.increments();
                table.text('language');
                table.text('page');
                table.text('position');
                table.text('content');
                table.text('additional');
            }).then((_) => {
                return db('descriptions').insert(initDescriptions);
            });
        } 
        else {
            db('descriptions').del()
                .then(() => {
                    return db('descriptions').insert(initDescriptions);
                });
        }
    });
}

module.exports.getDescriptions = function (language, page) {
    return db('descriptions')
        .where('page', page)
        .andWhere('language', language);
}

/********************** 
 **** CRUD section
***********************/

// POST
module.exports.postDescriptions = function (descriptions) {
    return db('descriptions')
        .insert(descriptions);
}
// DELETE
module.exports.deleteDescription = function (id) {
    return db('descriptions')
        .where('id', id)
        .del();
}
// GET
module.exports.getAllDescriptions = function () {
    return db('descriptions');
}
// GET PAGE
module.exports.getPageDescriptions = function (page) {
    return db('descriptions')
        .where('page', page);
}
// UPDATE
module.exports.updateDescription = function (id, updates) {
    return db('descriptions')
        .where('id', id)
        .update(updates);
}