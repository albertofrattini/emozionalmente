const descriptionsdb = require('../database/descriptions');
const userdb = require('../database/users');
const datadb = require('../database/data');

const recordguide = require('../database/init/recordguide.json');
const emotions = require('../database/init/emotions.json');

const path = require('path');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'database/samples')
    },
    filename: function (req, file, cb) {
        var user = req.session.user ? req.session.user.username : 'unknown';
        cb(null, user + '_' + req.sentenceid + '_' + req.requestTime + '.wav');
    }
});
const upload = multer({ storage: storage });

var isAdmin = function (req, res, next) {
    if (!req.session) return res.status(403).send({ message: 'Forbidden!' });
    if (req.session.admin) {
        next();
    } else {
        return res.status(403).send({ message: 'Forbidden!' });
    }
}





module.exports = function (app) {

    /***************
     **** OTHER
     ******************/

    app.get('/api/data/emotions', (req, res) => {

        res.send(emotions[req.query.lang]);

    });


    /***************
     **** DESCRIPTIONS
     ******************/

    app.get('/api/descriptions/:page', function (req, res) {

        const page = req.params.page;
        const language = req.query.lang;

        descriptionsdb.getDescriptions(language, page)
            .then(result => {
                res.send(result);
            });

    });

    app.get('/api/descriptions/recordguide', (req, res) => {

        res.send( recordguide );

    });

    app.get('/api/descriptions/evaluateguide', (req, res) => {

        res.send( recordguide );

    });

    /******************
     ******** CRUD
     ******************/

    app.get('/api/rest/descriptions', isAdmin, function (req, res) {

        descriptionsdb.getAllDescriptions()
            .then(result => {
                res.status(200).send(result);
            });
    });

    app.get('/api/rest/descriptions/:page', isAdmin, function (req, res) {

        descriptionsdb.getPageDescriptions(req.params.page)
            .then(result => {
                res.status(200).send(result);
            });
    });

    app.post('/api/rest/descriptions', isAdmin, function (req, res) {

        descriptionsdb.postDescriptions(req.body)
            .then(result => {
                res.status(200).send([{ message: 'Description posted' }]);
            })
            .catch(error => {
                res.send([{ 
                    message: 'An ERROR occured! Check out attribute names or values constraints.' 
                }])
            });
    });

    app.delete('/api/rest/descriptions/:id', isAdmin, function (req, res) {

        descriptionsdb.deleteDescription(req.params.id)
            .then(result => {
                res.status(200).send([{ message: 'Description deleted' }]);
            })
            .catch(error => {
                res.send([{ 
                    message: 'An ERROR occured! Check out attribute names or values constraints.' 
                }])
            });
    });

    app.put('/api/rest/descriptions/:id', isAdmin, function (req, res) {

        descriptionsdb.updateDescription(req.params.id, req.body)
            .then(result => {
                res.status(200).send([{ message: 'Description updated' }]);
            })
            .catch(error => {
                res.send([{ 
                    message: 'An ERROR occured! Check out attribute names or values constraints.' 
                }])
            });
    });







    /***************
     **** SENTENCES
     ******************/

    app.get('/api/sentences', (req, res) => {
        
        const quantity = req.query.quantity ? req.query.quantity : 20;
        const curruser = req.session.user ? req.session.user.username : null;

        datadb.getSentencesToRecord(quantity, curruser)
            .then(result => {
                res.send(result);
            });

    });

    /******************
     ******** CRUD
     ******************/

    app.get('/api/rest/sentences', isAdmin, function (req, res) {

        datadb.getAllSentences()
            .then(result => {
                res.status(200).send(result);
            });
    });

    app.get('/api/rest/sentences/:id', isAdmin, function (req, res) {

        datadb.getSentence(req.params.id)
            .then(result => {
                res.status(200).send(result);
            });
    });

    app.post('/api/rest/sentences', isAdmin, function (req, res) {
        
        datadb.postSentences(req.body)
            .then(result => {
                res.status(200).send([{ message: 'Sentence posted' }]);
            })
            .catch(error => {
                res.send([{ 
                    message: 'An ERROR occured! Check out attribute names or values constraints.' 
                }])
            });
    });

    app.delete('/api/rest/sentences/:id', isAdmin, function (req, res) {

        datadb.deleteSentence(req.params.id)
            .then(result => {
                res.status(200).send([{ message: 'Sentence deleted' }]);
            })
            .catch(error => {
                res.send([{ 
                    message: 'An ERROR occured! Check out attribute names or values constraints.' 
                }])
            });
    });

    app.put('/api/rest/sentences/:id', isAdmin, function (req, res) {

        datadb.updateSentence(req.params.id, req.body)
            .then(result => {
                res.status(200).send([{ message: 'Sentence updated' }]);
            })
            .catch(error => {
                res.send([{ 
                    message: 'An ERROR occured! Check out attribute names or values constraints.' 
                }])
            });
    });







    /***************
     **** SAMPLES
     ******************/

    // POST new sample inside database
    app.post('/api/data/samples', upload.single('audio'), (req, res, next) => {

        const user = req.session.user ? req.session.user.username : 'unknown';
        const sentenceid = req.query.sentenceid;
        const emotion = req.query.emotion;
        const sample = {
            speaker: user,
            sentenceid: sentenceid,
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

    /******************
     ******** CRUD
     ******************/

    app.get('/api/rest/samples', isAdmin, function (req, res) {

        datadb.getAllSamples()
            .then(result => {
                res.status(200).send(result);
            });
    });

    app.get('/api/rest/samples/:username', isAdmin, function (req, res) {

        datadb.getSamplesOfUser(req.params.username)
            .then(result => {
                res.status(200).send(result);
            });
    });

    app.delete('/api/rest/samples/:id', isAdmin, function (req, res) {

        datadb.deleteSample(req.params.id)
            .then(result => {
                res.status(200).send([{ message: 'Sample deleted' }]);
            })
            .catch(error => {
                res.send([{ 
                    message: 'An ERROR occured! Check out attribute names or values constraints.' 
                }])
            });
    });

    app.put('/api/rest/samples/:id', isAdmin, function (req, res) {

        datadb.updateSample(req.params.id, req.body)
            .then(result => {
                res.status(200).send([{ message: 'Sample updated' }]);
            })
            .catch(error => {
                res.send([{ 
                    message: 'An ERROR occured! Check out attribute names or values constraints.' 
                }])
            });
    });








    /***************
     **** EVALUATIONS
     ******************/

    // GET sentences of samples to evaluate
    app.get('/api/data/samples', (req, res) => {
        
        const quantity = req.query.quantity ? req.query.quantity : 10;
        const curruser = req.session.user ? req.session.user.username : null;

        datadb.getSamplesToEvaluate(quantity, curruser)
            .then(result => {
                res.send(result);
            });

    });

    // GET url of sample to be listened
    app.get('/api/data/download/:id', (req, res) => {

        datadb.findSample(req.params.id)
            .then(result => {
                
                let filePath = 
                    path.join(req.samplesUrl, `${result.sentenceid}_${result.timestamp}.wav`);
                // res.download(filePath);
                res.send(filePath);

            });

        /*
        let filePath;
        if (sentenceid > 8) {
            filePath = path.join(req.samplesUrl, 'unknown_10_1574951524665.wav');
        } else {
            filePath = path.join(req.samplesUrl, 'unknown_14_1574966864490.wav');
        }
        res.download(filePath);
        */

    });

    /******************
     ******** CRUD
     ******************/

    app.get('/api/rest/evaluations', isAdmin, function (req, res) {

        datadb.getAllEvaluations()
            .then(result => {
                res.status(200).send(result);
            });
    });

    app.get('/api/rest/evaluations/:username', isAdmin, function (req, res) {

        datadb.getEvaluationsOfUser(req.params.username)
            .then(result => {
                res.status(200).send(result);
            });
    });

    app.delete('/api/rest/evaluations/:id', isAdmin, function (req, res) {

        datadb.deleteEvaluation(req.params.id)
            .then(result => {
                res.status(200).send([{ message: 'Evaluation deleted' }]);
            })
            .catch(error => {
                res.send([{ 
                    message: 'An ERROR occured! Check out attribute names or values constraints.' 
                }])
            });
    });

    app.put('/api/rest/evaluations/:id', isAdmin, function (req, res) {

        datadb.updateEvaluation(req.params.id, req.body)
            .then(result => {
                res.status(200).send([{ message: 'Evaluation updated' }]);
            })
            .catch(error => {
                res.send([{ 
                    message: 'An ERROR occured! Check out attribute names or values constraints.' 
                }])
            });
    });







    /***************
     **** USERS
     ******************/

    app.post('/api/users/signup', async function (req, res) {

        let user = req.body;

        const { error } = validateUser(user);
        if (error) return res.status(400).send(error.details[0].message);

        const isRegistered = await userdb.finduser(user.email);
        if (isRegistered) return res.status(400).send('User already registered!');

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        userdb.signup(user)
            .then(result => {
                res.status(200).send({
                    message: 'Signup successful!'
                });
            }).catch(error => {
                res.status(400).send({
                    message: 'Something went wrong...'
                });
            });

    });

    app.post('/api/users/login', async function (req, res) {

        const credentials = req.body;

        const { error } = validateCredentials(credentials);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await userdb.finduser(credentials.email);
        if (!user) return res.status(400).send('Invalid email or password!');

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

    /******************
     ******** CRUD
     ******************/

    app.get('/api/rest/users', isAdmin, function (req, res) {

        userdb.getAllUsers()
            .then(result => {
                res.status(200).send(result);
            });
    });

    app.get('/api/rest/users/:username', isAdmin, function (req, res) {

        userdb.getUser(req.params.username)
            .then(result => {
                res.status(200).send(result);
            });
    });

    app.delete('/api/rest/users/:id', isAdmin, function (req, res) {

        userdb.deleteUser(req.params.id)
            .then(result => {
                res.status(200).send([{ message: 'User deleted' }]);
            })
            .catch(error => {
                res.send([{ 
                    message: 'An ERROR occured!' 
                }])
            });
    });

    app.put('/api/rest/users/:id', isAdmin, function (req, res) {

        userdb.updateUser(req.params.id, req.body)
            .then(result => {
                res.status(200).send([{ message: 'User updated' }]);
            })
            .catch(error => {
                res.send([{ 
                    message: 'An ERROR occured! Check out attribute names or values constraints. ' 
                     + 'Remember, for example, that sex can be male, female or not specified...' 
                }])
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