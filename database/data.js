let db;

module.exports.setupDataDb = function (database) {

    db = database;
    let initSentences = require('./init/sentences.json');
    let initSamples = require('./init/samples.json');
    let initEvaluated = require('./init/evaluated.json');

    return db.schema.hasTable('sentences').then(exists => {

        if (!exists) {
            db.schema.createTable('sentences', table => {
                table.increments('id');
                table.text('sentence');
            })
            .then(() => {
                return db('sentences').insert(initSentences);
            })
            .then(() => {
                return db.schema.createTable('samples', table => {
                    table.increments('id');
                    table.text('speaker');
                    table.integer('sentenceid');
                    table.text('timestamp');
                    table.enum('emotion', ['happiness', 'sadness', 'fear', 
                                            'anger', 'surprise', 'disgust', 'neutral']);
                });
            })
            .then(() => {
                return db('samples').insert(initSamples);
            })
            .then(() => {
                return db.schema.createTable('evaluated', table => {
                    table.increments('id');
                    table.integer('sampleid');
                    table.text('evaluator');
                    table.text('timestamp');
                    table.boolean('correct');
                    table.enum('quality', ['bad', 'good', 'perfect', 'reported']);
                    table.enum('accuracy', ['0.5', '1'])
                });
            })
            .then(() => {
                return db('evaluated').insert(initEvaluated);
            });
        }
    });
}

// method to extract sentences for RECORD page
module.exports.getsentences = function (quantity, currentuser) {
    // Returns a fixed amount of random sentences, excluding the ones already sampled
    return db.select('*').from('sentences')
        .whereNotIn('id', db.select('sentenceid').from('samples').where('speaker', currentuser))
        .orderBy(db.raw('RANDOM()'))
        .limit(quantity);
}

// method to extract samples for EVALUATE page
module.exports.getsamples = function (quantity, currentuser) {
    // Returns a fixed amount of random samples, excluding the ones recorded by the user
    // itself and the ones already evaluated by the user.
    return db.select('*').from('samples')
        .whereNot('speaker', currentuser)
        .whereNotIn('id', db.select('sampleid').from('evaluated').where('evaluator', currentuser))
        .orderBy(db.raw('RANDOM()'))
        .limit(quantity);
}

module.exports.uploadSample = function (sample) {
    return db('samples').insert(sample);
}