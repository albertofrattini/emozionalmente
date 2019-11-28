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

        var user = req.session.user ? req.session.user.username : 'unknown';
        const sample = {
            speaker: user,
            sentenceid: req.sentenceid,
            timestamp: req.requestTime,
            emotion: req.emotion
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
        
        const quantity = req.query.quantity ? req.qeury.quantity : 10;
        const curruser = req.session.user ? req.session.user.username : null;

        // const filePath = path.join(req.samplesUrl, 'unknown_10_1574951524665.wav');
        // res.download(filePath);
            

        datadb.getsamples(quantity, curruser)
            .then(result => {
                res.send(result);
            });

        // TODO: find and return also audio files of the corresponding samples

    });

    router.get('/download', (req, res) => {

        const sentenceid = req.query.sentenceid;
        const timestamp = req.query.timestamp;

        console.log(sentenceid, timestamp);

        let filePath;
        if (sentenceid > 8) {
            filePath = path.join(req.samplesUrl, 'unknown_10_1574951524665.wav');
        } else {
            filePath = path.join(req.samplesUrl, 'unknown_14_1574966864490.wav');
        }
        res.download(filePath);

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