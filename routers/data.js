const datadb = require('../database/data');

module.exports = function (router) {

    router.get('/sentences', (req, res) => {
        
        const quantity = req.query.quantity ? req.query.quantity : 20;
        const curruser = req.session.user ? req.session.user.username : null;

        datadb.getsentences(quantity, curruser)
            .then(result => {
                res.send(result);
            });

    });

    router.get('/samples', (req, res) => {
        
        const quantity = req.query.quantity ? req.qeury.quantity : 10;
        const curruser = req.session.user ? req.session.user.username : null;

        datadb.getsamples(quantity, curruser)
            .then(result => {
                res.send(result);
            });

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