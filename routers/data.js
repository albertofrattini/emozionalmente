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
const fs = require('fs');
const path = require('path');

function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}


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

        // /path/.../database/samples/unknown_6_1574862996937.webm
        const filePath = path.join(req.samplesUrl, 'unknown_6_1574862996937.webm');
        res.download(filePath);

        // res.sendFile(filePath);
        // var stat = fs.statSync(filePath);
        // var file = fs.readFile(filePath, function(err, data) {
        //     const buf = toArrayBuffer(data);
        //     res.setHeader('Content-Length', stat.size);
        //     res.setHeader('Content-Type', 'application/octet-stream');
        //     res.setHeader('Content-Disposition', 'attachment; filename=unknown_6_1574862996937');
        //     res.send(data);
        // });
            

        // datadb.getsamples(quantity, curruser)
        //     .then(result => {
        //         res.send(result);
        //     });

        // TODO: find and return also audio files of the corresponding samples

    })

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