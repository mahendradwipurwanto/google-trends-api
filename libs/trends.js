const googleTrends = require("google-trends-api");
const {translate_text} = require("./translate");
const {fetchGoogleTrendsRSS} = require("./rss-scapper");

const foreign = ["th", "sa", "ua", "qa", "kz"];

async function daily(geo = "id", date = null) {
    if (date == null) date = new Date().toISOString().slice(0, 10);

    try {
        // Use async/await with googleTrends
        const response = await googleTrends.dailyTrends({
            trendDate: new Date(date),
            geo: geo.toUpperCase(),
        });

        //check if response is html
        if (response.includes("<html "))
            return fetchGoogleTrendsRSS(geo);

        const googleData = JSON.parse(response);
        const translated = foreign.includes(geo);

        // Process trending searches and articles
        const trendingData = await Promise.all(
            googleData.default.trendingSearchesDays.map(async (day) => {
                // For each trending day, get the trending searches
                return await Promise.all(
                    day.trendingSearches.map(async (search) => {
                        // Translate query if necessary
                        const translatedQuery = translated
                            ? await translate_text(search.title.query, geo)
                            : search.title.query;

                        // Translate articles' titles if necessary
                        const translatedArticles = await Promise.all(
                            search.articles.map(async (article) => ({
                                title: translated
                                    ? await translate_text(article.title, geo)
                                    : article.title,
                                timeAgo: article.timeAgo,
                                source: article.source,
                                url: article.url,
                            }))
                        );

                        return {
                            query: translatedQuery,
                            traffic: search.formattedTraffic,
                            articles: translatedArticles,
                        };
                    })
                );
            })
        );

        // Flatten the array after the asynchronous operations are done
        const flattenedTrendingData = trendingData.flat();

        return {
            status: 200,
            source: googleData.default.rssFeedPageUrl,
            trending: flattenedTrendingData,
        };
    } catch (error) {
        return {
            status: 500,
            error: "Server error: " + error.message,
        };
    }
}

module.exports = {
    daily,
};
