var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    return res.json({
        data: "Google Trend API Sequence",
        author: "mahendradwipurwanto@gmail.com"
    });
});

module.exports = router;
