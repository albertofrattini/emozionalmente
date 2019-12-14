let db;

module.exports.setupUsersDb = async function (database) {
    db = database;
    await db.raw('create extension if not exists "uuid-ossp"');
    return db.schema.hasTable('users').then(exists => {
        if (!exists) {
            return db.schema.createTable('users', table => {
                table.uuid('id').defaultTo(db.raw('uuid_generate_v4()'));
                table.boolean('confirmed');
                table.boolean('admin');
                table.text('username');
                table.text('email');
                table.text('password');
                table.enum('sex', ['male', 'female', 'notspecified']);
                table.text('nationality');
                table.integer('age');
                table.float('points');
            });
        }
        db.raw('drop extension if exists "uuid-ossp"');
    });
}

module.exports.signup = function (user) {
    return db('users').insert(user).returning('id');
}

module.exports.login = function (email, password) {
    return db('users').where('email', email).andWhere('password', password).first();
}

module.exports.findUserByEmail = function (email) {
    return db('users').where('email', email).first();
}

module.exports.findUserByUsername = function (username) {
    return db('users').where('username', username).first();
}

module.exports.findUserById = function (userid) {
    return db('users').where('id', userid).first();
}

module.exports.confirmUser = function (userid, confirmation) {
    return db('users')
        .where('id', userid)
        .update(confirmation);
}


/********************** 
 **** CRUD section
***********************/

// GET
module.exports.getUser = function (username) {
    return db.select('id', 'username', 'email', 'sex', 'nationality', 'age', 'points')
        .from('users')
        .where('username', username);
}
// GET ALL
module.exports.getAllUsers = function () {
    return db.select('id', 'username', 'email', 'sex', 'nationality', 'age', 'points')
        .from('users');
}
// UPDATE
module.exports.updateUser = function (id, updates) {
    return db('users')
        .where('id', id)
        .update(updates);
}
// DELETE
module.exports.deleteUser = function (id) {
    // TODO: insert chain effect -> delete samples? evaluations?
    return db('users')
        .where('id', id)
        .del();
}