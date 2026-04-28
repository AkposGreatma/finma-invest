const axios = require("axios");

exports.getMarketNews = async (req, res) => {
  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        country: "us",
        category: "business",
        pageSize: 5,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    const articles = (response.data.articles || [])
        .filter((article) => article.title && article.url)
        .map((article) => ({
            title: article.title,
            source: article.source?.name || "Unknown source",
            url: article.url,
            publishedAt: article.publishedAt,
            imageUrl: article.urlToImage,
        }));

    res.json(articles);
  } catch (error) {
    console.error("Market news error:", error.response?.data || error.message);

    res.status(500).json({
      message: "Failed to fetch market news",
      error: error.response?.data?.message || error.message,
    });
  }
};