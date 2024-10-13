const googleTrends = require("google-trends-api");

const daily = (geo = "id", date = null) => {

    if (date == null) date = new Date().toISOString().slice(0, 10);

    googleTrends.dailyTrends(
        {
            trendDate: new Date(date),
            geo: geo.toUpperCase(),
        },
        function (error, response) {
            if (error) {
                return {
                    status: false,
                    data: null
                };
            } else {
                return {
                    status: true,
                    data: JSON.parse(response)
                }
            }
        }
    );
};

const realtime = (geo = "id", category = "all") => {

    googleTrends.realTimeTrends(
        {
            geo: geo.toUpperCase(),
            category: category,
        },
        function (error, response) {
            if (error) {
                return {
                    status: false,
                    data: null
                };
            } else {
                return {
                    status: true,
                    data: JSON.parse(response)
                }
            }
        }
    );
};

module.exports = {
    daily,
    realtime,
};
