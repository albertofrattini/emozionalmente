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
    const stillNotEvaluatedEnough = await db.select('samples.id')
            .from('samples')
            // samples that have been evaluated less than 3 times
            .whereIn('samples.id', db.select('sampleid')
                                    .from('evaluated')
                                    .groupBy('sampleid')
                                    .having(db.raw('count(*) < 3')))
            // samples that have never been evaluated
            .orWhereNotIn('samples.id', db.select('sampleid')
                                        .from('evaluated')
                                        .groupBy('sampleid'));
    if (stillNotEvaluatedEnough.length > 0) {
        console.log(stillNotEvaluatedEnough.length);
        const arrayStillNotEvaluatedEnough = stillNotEvaluatedEnough.map(e => {
            return e.id;
        });
        return db.select('samples.id', 'emotion', 'sentence')
            .from('samples')
            .whereIn('samples.id', arrayStillNotEvaluatedEnough)
            .where('samples.language', language)
            .whereNot('samples.speaker', currentuser)
            .whereNotIn('samples.id', db.select('sampleid').from('evaluated').where('evaluator', currentuser))
            .join('sentences', 'samples.sentenceid', '=', 'sentences.id')
            .orderBy(db.raw('RANDOM()'))
            .limit(quantity);
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

module.exports.getTotalSamples = function () {
    return db('samples').count('id as value').first();
}

module.exports.getTotalEvaluations = function () {
    return db('evaluated').count('id as value').first();
}

module.exports.getSamplesOfLanguage = function (language) {
    return db('samples').where('language', language).count('id as value').first();
}

module.exports.getAccuracy = async function () {
    const corr = await db('evaluated').where('correct', true).count('id').first(); 
    const tot = await db('evaluated').count('id').first();
    const res = tot.count == 0 ? 0 : corr.count / tot.count;
    return { value : res };
}

module.exports.getSamplesEmotionRecognizedAs = async function (mainEmotion, recognizedEmotion) {
    const tot = await db('samples').where('samples.emotion', mainEmotion)
                        .join('evaluated', 'samples.id', '=', 'evaluated.sampleid')
                        .count('evaluated.id').first();
    const rec = await db('samples').where('samples.emotion', mainEmotion)
                        .join('evaluated', 'samples.id', '=', 'evaluated.sampleid')
                        .where('evaluated.emotion', recognizedEmotion).count('evaluated.id').first();
    const res = tot.count == 0 ? 0 : (rec.count / tot.count) * 100;
    return { value: res };
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

// GET
module.exports.getAllSamples = function () {
    return db('samples');
}

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

// GET
module.exports.getAllEvaluations = function () {
    return db('evaluated');
}

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