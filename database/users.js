let db;

module.exports.setupUsersDb = function (database) {
    db = database;
    return db.schema.hasTable('users').then(exists => {
        if (!exists) {
            db.schema.createTable('users', table => {
                table.increments();
                table.text('username');
                table.text('email');
                table.text('nationality');
                table.integer('age');
                table.text('password');
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

module.exports.finduser = function (email) {
    return db('users').where('email', email).first();
}