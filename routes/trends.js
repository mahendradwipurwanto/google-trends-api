var express = require('express');
var router = express.Router();
var {daily, realtime} = require('../libs/trends');

router.get('/daily', async function (req, res, next) {
    try {
        const {geo, date} = req.query;

        response = daily(geo, date);

        res.json({
            status: 'ok',
            data: response,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
        });
    }
});

router.get('/realtime', async function (req, res, next) {
    try {
        const {geo, category} = req.query;

        response = realtime(geo, category);

        res.json({
            status: 'ok',
            data: response,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
        });
    }
});

module.exports = router;
