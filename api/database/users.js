let db;

module.exports.setupUsersDb = async function (database) {
    db = database;
    return db.schema.hasTable('users').then(exists => {
        if (!exists) {
            return db.schema.createTable('users', table => {
                table.increments('id');
                table.boolean('confirmed');
                table.boolean('admin');
                table.text('username');
                table.text('email');
                table.text('password');
                table.enum('sex', ['male', 'female', 'notspecified']);
                table.text('nationality');
                table.integer('age');
            });
        }
    });
}

module.exports.signup = function (user) {
    return db('users').insert(user);
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

module.exports.confirmUser = function (username, confirmation) {
    return db('users')
        .where('username', username)
        .update(confirmation);
}

module.exports.getAllUsers = function (minAge, maxAge, gender, nationality, lang) {
    let query = db('users')
                    .where('users.age', '>=', minAge)
                    .where('users.age', '<=', maxAge)
                    .whereNot('users.username', 'emovo')
                    .whereIn('username', db.select('speaker').from('samples').where('language', lang).groupBy('speaker'));
    if (gender !== '') {
        query = query.where('sex', gender);
    }
    if (nationality !== '') {
        query = query.where('nationality', nationality);
    }
    query = query.groupBy('age', 'nationality', 'sex');
    return query.select('sex', 'nationality', 'age').count('* as number');
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
// INSERT
module.exports.insertUser = function (user) {
    return db('users').insert(user);
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