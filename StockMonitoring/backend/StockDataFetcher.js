const fetch = require("node-fetch");

class StockDataFetcher {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async getStockPrice(symbol) {
    const apiUrl = `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${this.apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.latestPrice === null) {
      throw new Error(`Unable to fetch stock data for symbol: ${symbol}`);
    }

    return data.latestPrice;
  }
}

module.exports = StockDataFetcher;
