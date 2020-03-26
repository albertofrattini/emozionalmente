let db;

module.exports.setupDataDb = function (database) {

    db = database;
    let initSentences = require('./init/sentences.json');

    return db.schema.hasTable('sentences').then(exists => {

        if (!exists) {
            return db.schema.createTable('sentences', table => {
                table.increments('id');
                table.text('language');
                table.text('sentence');
            })
            .then(() => {
                return db('sentences').insert(initSentences);
            })
            .then(() => {
                return db.schema.createTable('samples', table => {
                    table.increments('id');
                    table.text('speaker');
                    table.text('language');
                    table.integer('sentenceid');
                    table.text('timestamp');
                    table.enum('emotion', ['hp', 'sd', 'fr', 
                                            'an', 'sr', 'ds', 'nt']);
                });
            })
            .then(() => {
                return db.schema.createTable('evaluated', table => {
                    table.increments('id');
                    table.integer('sampleid');
                    table.text('evaluator');
                    table.text('language');
                    table.text('timestamp');
                    table.boolean('correct');
                    table.enum('quality', ['bad', 'good']);
                    table.enum('emotion', ['hp', 'sd', 'fr', 
                                            'an', 'sr', 'ds', 'nt']);
                });
            });
        }
    });
}

module.exports.getSentencesToRecord = function (quantity, language) {
    return db.select('*').from('sentences')
        .where('language', language)
        .orderBy(db.raw('RANDOM()'))
        .limit(quantity);
}

module.exports.getSamplesToEvaluate = async function (quantity, currentuser, language) {

    if (currentuser === 'alberto' || currentuser === 'fabio') {
        return db.select('samples.id', 'emotion', 'sentence')
            .from('samples')
            .where('samples.language', language)
            // .whereNot('samples.speaker', currentuser)
            .where('samples.speaker', 'emovo')
            .whereNotIn('samples.id', db.select('sampleid').from('evaluated').where('evaluator', currentuser))
            .join('sentences', 'samples.sentenceid', '=', 'sentences.id')
            .orderBy(db.raw('RANDOM()'))
            .limit(quantity);
    }
    
    const mustBeEvaluated = await db.select('samples.id', 'emotion', 'sentence')
                                    .from('samples')
                                    .whereIn('samples.id', db.select('samples.id')
                                                            .from('samples')
                                                            .whereIn('samples.id', db.select('sampleid')
                                                                                    .from('evaluated')
                                                                                    .groupBy('sampleid')
                                                                                    .having(db.raw('count(*) < 3')))
                                                            .orWhereNotIn('samples.id', db.select('sampleid')
                                                                                        .from('evaluated')
                                                                                        .groupBy('sampleid')))
                                    .where('samples.language', language)
                                    .whereNot('samples.speaker', currentuser)
                                    .whereNotIn('samples.id', db.select('sampleid').from('evaluated').where('evaluator', currentuser))
                                    .join('sentences', 'samples.sentenceid', '=', 'sentences.id')
                                    .orderBy(db.raw('RANDOM()'))
                                    .limit(quantity);

    if (mustBeEvaluated.length > 0) {
        return mustBeEvaluated;
    } else {
        return db.select('samples.id', 'emotion', 'sentence')
            .from('samples')
            .where('samples.language', language)
            .whereNot('samples.speaker', currentuser)
            .whereNotIn('samples.id', db.select('sampleid').from('evaluated').where('evaluator', currentuser))
            .join('sentences', 'samples.sentenceid', '=', 'sentences.id')
            .orderBy(db.raw('RANDOM()'))
            .limit(quantity);
    }
}

module.exports.getOtherEvaluationsOfSample = async function (sampleid, evaluator) {
    const result = {};
    const total = await db('evaluated').where('sampleid', sampleid).whereNot('evaluator', evaluator).count('id').first();
    if (total.count == 0) return { total: 0 };
    result.total = total.count;
    result.good = parseInt((((await db('evaluated').where('sampleid', sampleid).whereNot('evaluator', evaluator)
                    .where('quality', 'good').count('id').first()).count) / total.count) * 100, 10);
    result.bad = parseInt((((await db('evaluated').where('sampleid', sampleid).whereNot('evaluator', evaluator)
                    .where('quality', 'bad').count('id').first()).count) / total.count) * 100, 10);
    result.hp = parseInt((((await db('evaluated').where('sampleid', sampleid).whereNot('evaluator', evaluator)
                    .where('emotion', 'hp').count('id').first()).count) / total.count) * 100, 10);
    result.sd = parseInt((((await db('evaluated').where('sampleid', sampleid).whereNot('evaluator', evaluator)
                    .where('emotion', 'sd').count('id').first()).count) / total.count) * 100, 10);
    result.ds = parseInt((((await db('evaluated').where('sampleid', sampleid).whereNot('evaluator', evaluator)
                    .where('emotion', 'ds').count('id').first()).count) / total.count) * 100, 10);
    result.fr = parseInt((((await db('evaluated').where('sampleid', sampleid).whereNot('evaluator', evaluator)
                    .where('emotion', 'fr').count('id').first()).count) / total.count) * 100, 10);
    result.sr = parseInt((((await db('evaluated').where('sampleid', sampleid).whereNot('evaluator', evaluator)
                    .where('emotion', 'sr').count('id').first()).count) / total.count) * 100, 10);
    result.nt = parseInt((((await db('evaluated').where('sampleid', sampleid).whereNot('evaluator', evaluator)
                    .where('emotion', 'nt').count('id').first()).count) / total.count) * 100, 10);
    result.an = parseInt((((await db('evaluated').where('sampleid', sampleid).whereNot('evaluator', evaluator)
                    .where('emotion', 'an').count('id').first()).count) / total.count) * 100, 10);
    return result;
}

module.exports.getUserSampleContribution = async function (user) {
    const result = {};
    result.total = (await db('samples').where('samples.speaker', user).count('id').first()).count;
    result.hp = (await db('samples').where('samples.speaker', user).andWhere('emotion', 'hp').count('id').first()).count;
    result.sd = (await db('samples').where('samples.speaker', user).andWhere('emotion', 'sd').count('id').first()).count;
    result.an = (await db('samples').where('samples.speaker', user).andWhere('emotion', 'an').count('id').first()).count;
    result.fr = (await db('samples').where('samples.speaker', user).andWhere('emotion', 'fr').count('id').first()).count;
    result.ds = (await db('samples').where('samples.speaker', user).andWhere('emotion', 'ds').count('id').first()).count;
    result.nt = (await db('samples').where('samples.speaker', user).andWhere('emotion', 'nt').count('id').first()).count;
    result.sr = (await db('samples').where('samples.speaker', user).andWhere('emotion', 'sr').count('id').first()).count;
    return result;
}

module.exports.getUserEvaluationContribution = async function (user) {
    const result = {};
    result.total = (await db('evaluated').where('evaluated.evaluator', user).count('id').first()).count;
    result.correct = (await db('evaluated').where('evaluated.evaluator', user).andWhere('correct', true).count('id').first()).count;
    result.notcorrect = (await db('evaluated').where('evaluated.evaluator', user).andWhere('correct', false).count('id').first()).count;
    return result;
}




/***************************************************************************************************
 * DATABASE
 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

module.exports.getEvaluationsPerQuantity = async function (minAge, maxAge, gender, nationality) {
    let countQuery = db('evaluated')
                        .join('users', 'evaluated.evaluator', '=', 'users.username')
                        .where('users.age', '>=', minAge)
                        .where('users.age', '<=', maxAge)
                        .whereNot('users.username', 'emovo');
    if (gender !== '') {
        countQuery = countQuery.where('users.sex', gender);
    }
    if (nationality !== '') {
        countQuery = countQuery.where('users.nationality', nationality);
    }
    countQuery = countQuery.groupBy('sampleid').as('ignored_alias');
    const quantities = await db.min('myCount').max('myCount').from(countQuery.select('sampleid').count('sampleid as myCount')).first();
    const result = []
    for(var i = quantities.min; i <= quantities.max; i++) {
        let query = db('evaluated')
                        .join('users', 'evaluated.evaluator', '=', 'users.username')
                        .where('users.age', '>=', minAge)
                        .where('users.age', '<=', maxAge);
        if (gender !== '') {
            query = query.where('users.sex', gender);
        }
        if (nationality !== '') {
            query = query.where('users.nationality', nationality);
        }
        query = query.groupBy('sampleid').having(db.raw('count(*) = ' + i));
        const obj = await db.count('*').from('samples').whereIn('id', query.select('sampleid')).first();
        if (obj.count > 0) {
            result.push({
                count: parseInt(i),
                quantity: parseInt(obj.count)
            });
        }
    }
    return result;
}

module.exports.getSamplesEmotionRecognizedAs = function (minAge, maxAge, gender, nationality, refEmotion) {
    let query = db('samples')
                    .join('users', 'samples.speaker', '=', 'users.username')
                    .where('users.age', '>=', minAge)
                    .where('users.age', '<=', maxAge)
                    .whereNot('users.username', 'emovo');
    if (gender !== '') {
        query = query.where('users.sex', gender);
    }
    if (nationality !== '') {
        query = query.where('users.nationality', nationality);
    }
    query = query.where('samples.emotion', refEmotion)
                    .join('evaluated', 'samples.id', '=', 'evaluated.sampleid')
                    .groupBy('samples.emotion', 'evaluated.emotion');
    return query.select('samples.emotion', 'evaluated.emotion').count('* as value');
}

module.exports.getAllSamples = function (minAge, maxAge, gender, nationality) {
    let query = db('samples')
                    .join('users', 'samples.speaker', '=', 'users.username')
                    .where('users.age', '>=', minAge)
                    .where('users.age', '<=', maxAge)
                    .whereNot('users.username', 'emovo');
    if (gender !== '') {
        query = query.where('users.sex', gender);
    }
    if (nationality !== '') {
        query = query.where('users.nationality', nationality);
    }
    query = query.orderBy('samples.timestamp');
    return query.select('*');
}

module.exports.getAllEvaluations = function (minAge, maxAge, gender, nationality) {
    let query = db('evaluated')
                .join('samples', 'evaluated.sampleid', '=', 'samples.id')
                .join('users', 'evaluated.evaluator', '=', 'users.username')
                .where('users.age', '>=', minAge)
                .where('users.age', '<=', maxAge)
                .whereNot('users.username', 'emovo');
    if (gender !== '') {
        query = query.where('users.sex', gender);
    }
    if (nationality !== '') {
        query = query.where('users.nationality', nationality);
    }
    query = query.orderBy('evaluated.timestamp');
    return query.select('evaluated.emotion as recognized', 'samples.emotion as real', 'evaluated.timestamp as timestamp');
}

/***************************************************************************************************
 * DATABASE
 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/







module.exports.findSample = function (id) {
    return db('samples').where('id', id).first();
}

module.exports.insertSample = function (sample) {
    return db('samples').insert(sample);
}

module.exports.insertEvaluation = function (evaluation) {
    return db('evaluated').insert(evaluation);
} 

module.exports.getUserSamples = function (user) {
    return db('samples').where('samples.speaker', user);
}

module.exports.getUserEvaluations = function (user) {
    return db('evaluated').where('evaluated.evaluator', user);
}


/********************** 
 **** CRUD section
***********************/

/**** SENTENCES ****/

// POST
module.exports.postSentences = function (sentences) {
    return db('sentences')
        .insert(sentences);
}
// DELETE
module.exports.deleteSentence = function (id) {
    return db('sentences')
        .where('id', id)
        .del();
}
// GET
module.exports.getSentence = function (id) {
    return db('sentences')
        .where('id', id);
}
// GET ALL
module.exports.getAllSentences = function () {
    return db('sentences');
}
// UPDATE
module.exports.updateSentence = function (id, updates) {
    return db('sentences')
        .where('id', id)
        .update(updates);
}

/**** SAMPLES ****/

// GET USER SAMPLES
module.exports.getSamplesOfUser = function (username) {
    return db('samples')
        .where('speaker', username);
}

// UPDATE
module.exports.updateSample = function (id, updates) {
    return db('samples')
        .where('id', id)
        .update(updates);
}

// DELETE
module.exports.deleteSample = function (id) {
    return db('samples')
        .where('id', id)
        .del();
}

/**** EVALUATED ****/

// GET USER EVALUATIONS
module.exports.getEvaluationsOfUser = function (username) {
    return db('evaluated')
        .where('evaluator', username);
}

// UPDATE
module.exports.updateEvaluation = function (id, updates) {
    return db('evaluated')
        .where('id', id)
        .update(updates);
}

// DELETE
module.exports.deleteEvaluation = function (id) {
    return db('evaluated')
        .where('id', id)
        .del();
}