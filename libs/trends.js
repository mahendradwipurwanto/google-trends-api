const googleTrends = require("google-trends-api");
const { translate_text } = require("./translate");

const foreign = ["th", "sa", "ua", "qa"];

async function daily(geo = "id", date = null) {
    if (date == null) date = new Date().toISOString().slice(0, 10);

    try {
        // Use async/await with googleTrends
        const response = await googleTrends.dailyTrends({
            trendDate: new Date(date),
            geo: geo.toUpperCase(),
        });

        const googleData = JSON.parse(response);
        const translated = foreign.includes(geo);

        // Translate test word "บอยปกรณ์" (optional check)
        console.log(await translate_text("บอยปกรณ์", geo));

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
            source: googleData.default.rssFeedPageUrl,
            trending: flattenedTrendingData,
        };
    } catch (error) {
        return {
            status: false,
            error: "Server error: " + error.message,
        };
    }
}

module.exports = {
    daily,
};
