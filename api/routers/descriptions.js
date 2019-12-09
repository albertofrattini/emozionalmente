const descriptionsdb = require('../database/descriptions');
const recordguide = require('../database/init/recordguide.json');

module.exports = function (router) {

    router.get('/:page', function (req, res) {

        const page = req.params.page;
        const language = req.query.lang;

        descriptionsdb.getDescriptions(language, page)
            .then(result => {
                res.send(result);
            });

    });

    router.get('/area', function (req, res) {
        res.send('descriptions /area');
    });

    router.get('/recordguide', (req, res) => {

        res.send( recordguide );

    });

    router.get('/evaluateguide', (req, res) => {

        res.send( recordguide );

    });

    return router;

}