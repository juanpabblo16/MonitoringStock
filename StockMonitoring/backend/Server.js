const fs = require('fs');

class Server {
  constructor() {
    this.stocks = [];
    this.filePath = './stocks.json';
  }

  async loadStocks() {
    try {
      const data = await fs.promises.readFile(this.filePath);
      const stocks = JSON.parse(data);
      this.stocks = stocks.map((stockData) => {
        const stock = new Stock(stockData.symbol, stockData.companyName, stockData.logoUrl);
        stock.price = stockData.price;
        stock.priceChange = stockData.priceChange;
        return stock;
      });
    } catch (error) {
      console.log(`Failed to load stocks from file: ${error}`);
    }
  }

  async saveStocks() {
    const stocksData = JSON.stringify(this.stocks);
    try {
      await fs.promises.writeFile(this.filePath, stocksData);
    } catch (error) {
      console.log(`Failed to save stocks to file: ${error}`);
    }
  }

  async addStock(symbol) {
    const existingStock = this.stocks.find((stock) => stock.symbol === symbol);
    if (existingStock) {
      console.log(`Stock with symbol ${symbol} already exists.`);
      return;
    }

    const stock = new Stock(symbol, '', '');
    await stock.updatePrice();
    this.stocks.push(stock);
    await this.saveStocks();
  }

  async removeStock(symbol) {
    this.stocks = this.stocks.filter((stock) => stock.symbol !== symbol);
    await this.saveStocks();
  }

  async updateStockPrice(symbol) {
    const stock = this.stocks.find((stock) => stock.symbol === symbol);
    if (!stock) {
      console.log(`Stock with symbol ${symbol} not found.`);
      return;
    }

    await stock.updatePrice();
    await this.saveStocks();
  }
}
