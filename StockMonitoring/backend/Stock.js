class Stock {
    constructor(symbol, companyName, logoUrl) {
      this.symbol = symbol;
      this.companyName = companyName;
      this.logoUrl = logoUrl;
      this.price = null;
      this.priceChange = null;
    }
  
    async updatePrice() {
      const apiKey = process.env.IEXCLOUD_API_KEY;
      const apiUrl = `https://cloud.iexapis.com/stable/stock/${this.symbol}/quote?token=${apiKey}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      this.price = data.latestPrice;
      this.priceChange = data.change;
    }
  }
  