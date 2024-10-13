const googleTrends = require("google-trends-api");

async function daily(geo = "id", date = null) {

    if (date == null) date = new Date().toISOString().slice(0, 10);

    const google = await googleTrends.dailyTrends(
        {
            trendDate: new Date(date),
            geo: geo.toUpperCase(),
        },
        function (error, response) {
            if (error) {
                return {
                    status: false,
                    error: "Server error: " + error
                };
            } else {
                return {
                    status: true,
                    data: JSON.parse(response)
                }
            }
        }
    );

    if (google.status) {
        return {
            source: google.data.default.rssFeedPageUrl,
            trending: google.data.default.trendingSearchesDays.flatMap(day =>
                day.trendingSearches.map(search => ({
                    query: search.title.query,
                    traffic: search.formattedTraffic,
                    articles: search.articles.map(article => ({
                        title: article.title,
                        timeAgo: article.timeAgo,
                        source: article.source,
                        url: article.url
                    }))
                }))
            )
        }
    }

    return google.error
}

module.exports = {
    daily
};
