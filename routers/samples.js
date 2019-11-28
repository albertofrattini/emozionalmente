const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'database/samples')
    },
    filename: function (req, file, cb) {
        var user = req.session.user ? req.session.user.username : 'unknown';
        cb(null, user + '_' + req.sentenceid + '_' + req.requestTime + '.webm');
    }
});
const upload = multer({ storage: storage });
const datadb = require('../database/data');

module.exports = function (router) {

    router.post('/upload', upload.single('audio'), (req, res, next) => {

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

    return router;
}