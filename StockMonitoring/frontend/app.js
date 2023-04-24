const apiUrl = 'http://localhost:3000/api';

const stocksList = document.getElementById('stocks-list');
const addStockForm = document.getElementById('add-stock-form');
const symbolInput = document.getElementById('symbol-input');

let monitoringList = [];

// Render the list of stocks on the page
function renderStocksList() {
    stocksList.innerHTML = '';

    monitoringList.forEach((stock) => {
        const stockElement = document.createElement('div');
        stockElement.className = 'stock';

        const logoElement = document.createElement('img');
        logoElement.src = stock.logoUrl;
        logoElement.alt = `${stock.companyName} logo`;

        const companyNameElement = document.createElement('span');
        companyNameElement.className = 'company-name';
        companyNameElement.textContent = stock.companyName;

        const priceElement = document.createElement('span');
        priceElement.className = 'price';
        priceElement.textContent = `$${stock.price}`;
        if (stock.priceChange > 0) {
            priceElement.style.color = 'green';
        } else if (stock.priceChange < 0) {
            priceElement.style.color = 'red';
        }

        const updateButton = document.createElement('button');
        updateButton.className = 'update-button';
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', () => {
            updateStockPrice(stock);
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            removeStockFromMonitoringList(stock);
        });

        stockElement.appendChild(logoElement);
        stockElement.appendChild(companyNameElement);
        stockElement.appendChild(priceElement);
        stockElement.appendChild(updateButton);
        stockElement.appendChild(deleteButton);

        stocksList.appendChild(stockElement);
    });
}

// Add a stock to the monitoring list
async function addStockToMonitoringList(symbol) {
    try {
        const response = await axios.post(`${apiUrl}/stocks`, { symbol });
        monitoringList.push(response.data);
        renderStocksList();
    } catch (error) {
        console.error(error);
    }
}

// Remove a stock from the monitoring list
async function removeStockFromMonitoringList(stock) {
    try {
        await axios.delete(`${apiUrl}/stocks/${stock.id}`);
        monitoringList = monitoringList.filter((s) => s.id !== stock.id);
        renderStocksList();
    } catch (error) {
        console.error(error);
    }
}

// Update the price of a stock
async function updateStockPrice(stock) {
    try {
        const response = await axios.put(`${apiUrl}/stocks/${stock.id}`);
        monitoringList = monitoringList.map((s) => (s.id === response.data.id ? response.data : s));
        renderStocksList();
    } catch (error) {
        console.error(error);
    }
}

// Load the monitoring
// Load the monitoring list from the server and render it
async function loadMonitoringList() {
    const response = await fetch('/monitoring-list');
    const monitoringList = await response.json();
    monitoringList.forEach(stockData => {
      const stock = new Stock(stockData.symbol, stockData.companyName, stockData.latestPrice, stockData.change, stockData.logoUrl);
      monitoringList.addStock(stock);
      renderStock(stock);
    });
  }
  
  // Render a stock element
  function renderStock(stock) {
    const stockList = document.querySelector('#stock-list');
  
    // Create the stock element
    const stockElement = document.createElement('div');
    stockElement.classList.add('stock');
  
    // Add the stock information to the element
    stockElement.innerHTML = `
      <img class="logo" src="${stock.logoUrl}" alt="${stock.companyName} logo">
      <div class="name">${stock.companyName}</div>
      <div class="price ${stock.change >= 0 ? 'positive' : 'negative'}">$${stock.latestPrice}</div>
      <button class="update-button">Update</button>
      <button class="remove-button">Remove</button>
    `;
  
    // Add event listeners to the update and remove buttons
    stockElement.querySelector('.update-button').addEventListener('click', async () => {
      await stock.updatePrice();
      renderStock(stock);
    });
  
    stockElement.querySelector('.remove-button').addEventListener('click', async () => {
      await monitoringList.removeStock(stock);
      stockElement.remove();
    });
  
    // Add the stock element to the stock list
    stockList.appendChild(stockElement);
  }
  
  // Add event listener to the add stock form
    addStockForm = document.querySelector('#add-stock-form');
  addStockForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const symbolInput = addStockForm.querySelector('#symbol-input');
    const symbol = symbolInput.value.toUpperCase();
    const stockData = await stockDataFetcher.getStockData(symbol);
    const stock = new Stock(symbol, stockData.companyName, stockData.latestPrice, stockData.change, stockData.logoUrl);
    await monitoringList.addStock(stock);
    renderStock(stock);
    symbolInput.value = '';
  });
  
  // Load the monitoring list when the page loads
  loadMonitoringList();  
