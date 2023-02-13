const stocks = JSON.parse(localStorage.getItem('stocks') || '["AAPL", "GOOG", "MSFT"]');

// function to retrieve stock data from an API
async function getStockData(symbol) {
  const response = await fetch(`https://api.iextrading.com/1.0/stock/${symbol}/chart/1m`);
  const data = await response.json();
  return data;
}

// function to format stock data for Plotly chart
function formatStockData(data) {
  const dates = data.map(d => d.date);
  const prices = data.map(d => d.close);
  return { x: dates, y: prices, type: 'scatter', mode: 'lines', name: data[0].symbol };
}

// function to retrieve and display stock data
async function displayStocks() {
  const stockData = await Promise.all(stocks.map(getStockData));
  const chartData = stockData.map(formatStockData);
  Plotly.newPlot('plot', chartData);
}

// function to add a stock to the list
function addStock(symbol) {
  if (!stocks.includes(symbol)) {
    stocks.push(symbol);
    localStorage.setItem('stocks', JSON.stringify(stocks));
    displayStocks();
  }
}

// function to remove a stock from the list
function removeStock(symbol) {
  const index = stocks.indexOf(symbol);
  if (index !== -1) {
    stocks.splice(index, 1);
    localStorage.setItem('stocks', JSON.stringify(stocks));
    displayStocks();
  }
}

// event listener for form submission to add a new stock
const form = document.getElementById('add-stock-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  const input = document.getElementById('add-stock-input');
  addStock(input.value.toUpperCase());
  input.value = '';
});

// event listener for removing a stock
const plot = document.getElementById('plot');
plot.on('plotly_legendclick', event => {
  const symbol = event.data[event.curveNumber].name;
  removeStock(symbol);
});

displayStocks();
