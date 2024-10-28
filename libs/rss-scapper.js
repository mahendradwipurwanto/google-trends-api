const axios = require('axios');
const xml2js = require('xml2js');
const { translate_text } = require("./translate");

const foreign = ["th", "sa", "ua", "qa", "kz"];

async function fetchGoogleTrendsRSS(geo) {

    try {
        const response = await axios.get(`https://trends.google.com/trending/rss?geo=${geo.toUpperCase()}`);

        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(response.data);

        const translated = foreign.includes(geo);

        const trends = await Promise.all(
            result.rss.channel[0].item.map(async item => {
                const query = translated
                    ? await translate_text(item.title[0], geo)
                    : item.title[0];
                const traffic = item['ht:approx_traffic'] ? item['ht:approx_traffic'][0] : 'N/A';

                const articles = await Promise.all(
                    (item['ht:news_item'] || []).map(async newsItem => ({
                        title: translated
                            ? await translate_text(newsItem['ht:news_item_title'][0], geo)
                            : newsItem['ht:news_item_title'][0],
                        timeAgo: newsItem['ht:news_item_snippet'][0],
                        source: newsItem['ht:news_item_source'][0],
                        url: newsItem['ht:news_item_url'][0]
                    }))
                );

                return { query, traffic, articles };
            })
        );

        return {
            source: `https://trends.google.com/trending/rss?geo=${geo}`,
            trending: trends
        };

    } catch (error) {
        console.error("Error fetching or parsing RSS feed:", error);
    }
}

module.exports = {
    fetchGoogleTrendsRSS
};
