const descriptionsdb = require('../database/descriptions');
const recordguide = require('../database/init/recordguide.json');

module.exports = function (router) {

    router.get('/home', function (req, res) {
        res.status(200).send({
            title: "Emozionalmente is an emotional speech recognition database",
            subtitle: "Speak and listen to help us giving researchers samples that can help reaching greater goals in the emotional speech recognition field"
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