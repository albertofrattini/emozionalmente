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
const datadb = require('../database/data');
const emotions = require('../database/init/emotions.json');
const fs = require('fs');
const path = require('path');


module.exports = function (router) {

    router.get('/sentences', (req, res) => {
        
        const quantity = req.query.quantity ? req.query.quantity : 20;
        const curruser = req.session.user ? req.session.user.username : null;

        datadb.getsentences(quantity, curruser)
            .then(result => {
                res.send(result);
            });

    });

    router.post('/samples', upload.single('audio'), (req, res, next) => {

        const user = req.session.user ? req.session.user.username : 'unknown';
        const sentenceid = req.query.sentenceid;
        const emotion = req.query.emotion;
        const sample = {
            speaker: user,
            sentenceid: sentenceid,
            timestamp: req.requestTime,
            emotion: emotion
        }

        datadb.uploadSample(sample)
            .then(() => {
                res.status(200).send({
                    message: 'Upload successful!'
                });
            })
            .catch(error => {
                console.error(error);
            });

    });

    router.get('/samples', (req, res) => {
        
        const quantity = req.query.quantity ? req.query.quantity : 10;
        const curruser = req.session.user ? req.session.user.username : null;

        datadb.getsamples(quantity, curruser)
            .then(result => {
                res.send(result);
            });

    });

    router.get('/download/:id', (req, res) => {

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

    router.get('/emotions', (req, res) => {
        res.send(emotions);
    });

    router.get('/evaluated', (req, res) => {
        res.send('Section for downloading the evaluated samples. Mainly for data analysis.');
    });

    router.post('/samples', (req, res) => {
        res.send('Section for uploading new recorded sentences.');
    });

    router.post('/evaluated', (req, res) => {
        res.send('Section for uploading new evaluated samples.');
    });

    return router;

}