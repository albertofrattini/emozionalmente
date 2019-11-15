module.exports = function (router) {

    /*
    router.get('/', function (req, res) {
        res.send('samples /');
    });
    */

    router.get('/record', function (req, res) {
        res.send('samples /record');
    });

    router.get('/evaluate', function (req, res) {
        res.send('samples /evaluate');
    });

    return router;

}