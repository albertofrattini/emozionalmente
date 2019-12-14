const descriptionsdb = require('./database/descriptions');
const userdb = require('./database/users');
const datadb = require('./database/data');

var isAdmin = function (req, res, next) {
    if (!req.session) return res.status(403).send({ message: 'Forbidden!' });
    if (req.session.admin) {
        next();
    } else {
        return res.status(403).send({ message: 'Forbidden!' });
    }
}

module.exports = function (app) {

    /******************
     ******** DESCRIPTIONS
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









    /******************
     ******** SENTENCES
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








    /******************
     ******** SAMPLES
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








    /******************
     ******** EVALUATIONS
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






    /******************
     ******** USERS
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