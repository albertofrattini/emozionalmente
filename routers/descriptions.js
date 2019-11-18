const descriptionsdb = require('../database/descriptions');

module.exports = function (router) {
    
    /*
    router.get('/', function (req, res) {
        res.send('descriptions /');
    });
    */

    router.get('/home', function (req, res) {
        res.status(200).send({
            title: "Emozionalmente is an emotional speech recognition database",
            subtitle: "Speak and listen to help us giving researchers samples that can help reaching greater goals in the emotional speech recognition field"
        });
        /*
        descriptionsdb.getdescriptionsof('home').then(result => {
            res.status(200).send(result);
        });
        */
    });

    router.get('/area', function (req, res) {
        res.send('descriptions /area');
    });

    router.get('/emotions', function (req, res) {
        res.send('Happiness, Sadness, Anger, Disgust, Surprise, Fear!');
    });

    return router;

}