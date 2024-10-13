var express = require('express');
var router = express.Router();
var {daily} = require('../libs/trends');

router.get('/daily', async function (req, res, next) {
    try {
        const {geo, date} = req.query;

        response = await daily(geo, date);

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
