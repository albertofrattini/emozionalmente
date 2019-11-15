module.exports = function (router) {
    
    /*
    router.get('/', function (req, res) {
        res.send('descriptions /');
    });
    */

    router.get('/page', function (req, res) {
        res.send('descriptions /page');
    });

    router.get('/area', function (req, res) {
        res.send('descriptions /area');
    });

    router.get('/emotions', function (req, res) {
        res.send('Happiness, Sadness, Anger, Disgust, Surprise, Fear!');
    });

    return router;

}