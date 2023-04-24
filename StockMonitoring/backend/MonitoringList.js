class MonitoringList {
    constructor() {
      this.stocks = [];
    }
  
    addStock(stock) {
      this.stocks.push(stock);
    }
  
    removeStock(symbol) {
      const index = this.stocks.findIndex((stock) => stock.symbol === symbol);
      if (index !== -1) {
        this.stocks.splice(index, 1);
      }
    }
  
    updateStockPrice(symbol, newPrice) {
      const stock = this.stocks.find((stock) => stock.symbol === symbol);
      if (stock) {
        stock.updatePrice(newPrice);
      }
    }
  
    getStocks() {
      return this.stocks;
    }
  }
  
  module.exports = MonitoringList;
  