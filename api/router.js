const sendEmail = require('./utilities/emailsend');
const emailTemplates = require('./utilities/emailtemplates');
const descriptionsdb = require('./database/descriptions');
const userdb = require('./database/users');
const datadb = require('./database/data');
const contactdb = require('./database/contact');
const contributedb = require('./database/contribute');

const emotions = require('./database/init/emotions.json');

const path = require('path');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'api/database/samples')
    },
    filename: function (req, file, cb) {
        cb(null, req.query.sentenceid + '_' + req.requestTime + '.wav');
    }
});
const upload = multer({ storage: storage });

var emotionLanguage = function (req, res, next) {
    if (req.session.lang !== 'en') {
        switch (req.session.lang) {
            case 'it': 
                req.query.emotion = fromItalianToEnglish(req.query.emotion);
            default:
                console.log('Language not recognized...');
        }
    }
    next();
} 





module.exports = function (app) {





    /***************
     **** OTHER
     ******************/

    app.get('/api/data/emotions', (req, res) => {

        res.send(emotions[req.session.lang]);

    });

    app.get('/api/language/set', (req, res) => {

        req.session.lang = req.query.lang;
        res.send({ message: `Language changed to ${req.session.lang}` });
        
    });








    /***************
     **** DESCRIPTIONS
     ******************/

    app.get('/api/descriptions/:page', function (req, res) {

        const page = req.params.page;
        const language = req.session.lang;

        descriptionsdb.getDescriptions(language, page)
            .then(result => {
                res.send(result);
            });

    });










    /***************
     **** SENTENCES
     ******************/

    app.get('/api/sentences', (req, res) => {
        
        const quantity = req.query.quantity ? req.query.quantity : 10;
        const curruser = req.session.user ? req.session.user.username : null;
        const language = req.session.lang;

        datadb.getSentencesToRecord(quantity, curruser, language)
            .then(result => {
                res.send(result);
            });

    });









    /***************
     **** SAMPLES
     ******************/

    // POST new sample inside database
    app.post('/api/data/samples', upload.single('audio'), emotionLanguage, (req, res, next) => {

        const user = req.session.user ? req.session.user.username : 'unknown';
        const sentenceid = req.query.sentenceid;
        const emotion = req.query.emotion;
        const language = req.session.lang;
        const sample = {
            speaker: user,
            sentenceid: sentenceid,
            language: language,
            timestamp: req.requestTime,
            emotion: emotion
        }

        datadb.insertSample(sample)
            .then(() => {
                res.status(200).send({
                    message: 'Upload successful!'
                });
            })
            .catch(error => {
                console.error(error);
            });

    });










    /***************
     **** EVALUATIONS
     ******************/

    // GET sentences of samples to evaluate
    app.get('/api/data/samples', (req, res) => {
        
        const quantity = req.query.quantity ? req.query.quantity : 10;
        const curruser = req.session.user ? req.session.user.username : null;
        const language = req.session.lang;

        datadb.getSamplesToEvaluate(quantity, curruser, language)
            .then(result => {
                if (req.session.lang !== 'en'){
                    const enEmotion = result.emotion;
                    result.emotion = fromEnglishToItalian(enEmotion);
                }
                res.send(result);
            });

    });

    app.get('/api/data/download/:id', (req, res) => {

        datadb.findSample(req.params.id)
            .then(result => {
                
                let filePath = 
                    path.join(req.samplesUrl, `${result.sentenceid}_${result.timestamp}.wav`);
                res.download(filePath);
            });

    });

    app.post('/api/data/evaluations', (req, res, next) => {

        const evaluator = req.session.user ? req.session.user.username : null;
        const language = req.session.lang;
        
        const evaluation = {
            sampleid: req.body.sampleid,
            correct: req.body.correct,
            accuracy: req.body.accuracy,
            quality: req.body.quality,
            evaluator: evaluator,
            language: language,
            timestamp: req.requestTime
        }

        datadb.insertEvaluation(evaluation)
        .then(() => {
            res.status(200).send({
                message: 'Upload successful!'
            });
        })
        .catch(error => {
            console.error(error);
        });

    });









    /***************
     **** USERS
     ******************/

    app.post('/api/users/signup', async function (req, res) {

        let user = req.body;

        const { error } = validateUser(user);
        if (error) return res.status(400).send(error.details[0].message);

        const mailRegistered = await userdb.findUserByEmail(user.email);
        if (mailRegistered) return res.status(400).send('User already registered!');

        const usernameRegistered = await userdb.findUserByEmail(user.username);
        if (usernameRegistered) return res.status(400).send('User already registered!');

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        userdb.signup(user)
            .then((id) => {
                sendEmail(user.email, emailTemplates.confirm(id[0]));
            })
            .then(() => {
                res.status(200).send({
                    message: 'Signup successful!'
                });
            }).catch(error => {
                res.status(400).send({
                    message: 'Something went wrong...'
                });
            });

    });

    app.get('/api/users/confirmation/:id', async function (req, res) {

        const userid = req.params.id;

        const user = await userdb.findUserById(userid);
        if (!user) return res.status(400).send('You are not allowed to complete this operation!');

        const confirmation = { confirmed: true };

        userdb.confirmUser(userid, confirmation)
            .then(_ => {
                res.status(200).send({
                    message: 'Confirmation successful!'
                });
            })
            .catch(error => {
                console.log(error);
                res.status(400).send({
                    message: 'Something went wrong...'
                });
            });

    });

    app.post('/api/users/login', async function (req, res) {

        const credentials = req.body;

        const { error } = validateCredentials(credentials);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await userdb.findUserByEmail(credentials.email);
        if (!user) return res.status(400).send('Invalid email or password!');

        if (!user.confirmed) return res.status(200).send('You are already registered but the email has not been confirmed...');

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return res.status(400).send('Invalid email or password!');

        res.status(200).send(
            {
                message: 'Login successful!',
                user: {
                    username: user.username,
                    email: user.email
                }
            }
        );

        
        req.session.user = {
            username: user.username,
            email: user.email
        };
        req.session.admin = user.admin;
        // req.session.lang = user.favlang;
        req.session.loggedin = true;
        req.session.save();

    });

    app.get('/api/users/logout', (req, res) => {

        req.session.destroy();

        res.status(200).send({
            message: 'Logout successful!'
        });

    });

    app.get('/api/users/loggedin', (req, res) => {

        if (req.session.loggedin) {
            res.status(200).send({
                message: 'The user currently logged in is ...',
                user: req.session.user
            });
        } else {
            res.status(200).send({
                message: 'No user is logged in...',
                user: {
                    username: null,
                    email: null
                }
            });
        }

    });

    app.get('/api/users/isAuthorized', (req, res) => {

        if (req.session.admin) {
            res.status(200).send({ authorized: true });
        } else {
            res.status(403).send({ authorized: false });
        }

    });

    app.get('/api/users/hassamples', (req, res) => {

        // IMPORTANT !! ONLY TEMPORARY
        return res.send({ newUser: false });

        if (!req.session.user) return res.send({ newUser: true });

        datadb.getUserSamples(req.session.user.username)
            .then(result => {
                if (result.length > 0) {
                    res.send({ newUser: false });
                } else {
                    res.send({ newUser: true });
                }
            });

    });

    app.get('/api/users/hasevaluations', (req, res) => {

        // IMPORTANT !! ONLY TEMPORARY
        return res.send({ newUser: false });

        if (!req.session.user) return res.send({ newUser: true });

        datadb.getUserEvaluations(req.session.user.username)
            .then(result => {
                if (result.length > 0) {
                    res.send({ newUser: false });
                } else {
                    res.send({ newUser: true });
                }
            });

    });




    app.post('/api/contact/contact', (req, res) => {

        const element = req.body;

        contactdb.insert(element)
            .then(() => sendEmail(process.env.MAIL_USER, emailTemplates.mycontact(element)))
            .then(() => sendEmail(element.email, emailTemplates.contact()))
            .then(() => {
                res.status(200).send({
                    message: 'Contact successful!'
                });
            })
            .catch(error => {
                console.log(error);
            });
    });

    app.post('/api/contact/contribute', (req, res) => {

        const element = req.body;

        contributedb.insert(element)
            .then(() => sendEmail(process.env.MAIL_USER, emailTemplates.mycontribute(element)))
            .then(() => sendEmail(element.email, emailTemplates.contribute()))
            .then(() => {
                res.status(200).send({
                    message: 'Contribution successful!'
                });
            })
            .catch(error => {
                console.log(error);
            });
    });








    return app;

}







function validateUser(user) {
    const schema = {
        username: Joi.string().min(5).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        nationality: Joi.string(),
        age: Joi.string(),
        sex: Joi.string()
    };
    return Joi.validate(user, schema);
}

function validateCredentials(credentials) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(credentials, schema);
}

function fromItalianToEnglish(emotion) {
    switch (emotion) {
        case 'felicità': 
            return 'happiness';
        case 'tristezza':
            return 'sadness';
        case 'paura':
            return 'fear';
        case 'disgusto':
            return 'disgust';
        case 'rabbia':
            return 'anger';
        case 'sorpresa':
            return 'surprise';
        default:
            return 'neutral';
    }
}

function fromEnglishToItalian(emotion){
    switch (emotion) {
        case 'happiness': 
            return 'felicità';
        case 'sadness':
            return 'tristezza';
        case 'fear':
            return 'paura';
        case 'disgust':
            return 'disgusto';
        case 'anger':
            return 'rabbia';
        case 'surprise':
            return 'sorpresa';
        default:
            return 'neutrale';
    }
}