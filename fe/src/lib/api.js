// 模拟股票数据
export const mockStocks = [
  { ticker: "AAPL", name: "Apple Inc.", price: 175.6 },
  { ticker: "TSLA", name: "Tesla Inc.", price: 225.3 },
  { ticker: "AMZN", name: "Amazon.com Inc.", price: 135.8 },
  { ticker: "BABA", name: "Alibaba Group", price: 95.2 },
  { ticker: "MSFT", name: "Microsoft Corp.", price: 315.7 },
  { ticker: "GOOG", name: "Alphabet Inc.", price: 2800.4 },
  { ticker: "NVDA", name: "NVIDIA Corp.", price: 450.5 },
  { ticker: "META", name: "Meta Platforms", price: 330.6 },
  { ticker: "NFLX", name: "Netflix Inc.", price: 440.1 },
  { ticker: "ORCL", name: "Oracle Corp.", price: 120.8 },
  { ticker: "INTC", name: "Intel Corp.", price: 35.9 },
  { ticker: "AMD", name: "Advanced Micro Devices", price: 105.4 },
  { ticker: "UBER", name: "Uber Technologies", price: 45.7 },
  { ticker: "LYFT", name: "Lyft Inc.", price: 12.3 },
  { ticker: "DIS", name: "Walt Disney Co.", price: 98.5 },
  { ticker: "SONY", name: "Sony Group Corp.", price: 88.4 },
  { ticker: "PFE", name: "Pfizer Inc.", price: 38.2 },
  { ticker: "JNJ", name: "Johnson & Johnson", price: 165.4 },
  { ticker: "MRNA", name: "Moderna Inc.", price: 120.3 },
  { ticker: "BA", name: "Boeing Co.", price: 210.7 },
  { ticker: "XOM", name: "Exxon Mobil Corp.", price: 105.2 },
  { ticker: "CVX", name: "Chevron Corp.", price: 160.1 },
  { ticker: "BP", name: "BP Plc", price: 35.8 },
  { ticker: "T", name: "AT&T Inc.", price: 14.7 },
  { ticker: "VZ", name: "Verizon Communications", price: 34.5 },
  { ticker: "SHOP", name: "Shopify Inc.", price: 70.2 },
  { ticker: "JD", name: "JD.com Inc.", price: 32.5 },
  { ticker: "PDD", name: "Pinduoduo Inc.", price: 145.6 },
  { ticker: "NIO", name: "NIO Inc.", price: 9.4 },
  { ticker: "LI", name: "Li Auto Inc.", price: 27.3 },
];

// 随机生成每只股票 30 天的价格数据
function generatePriceSeries(days = 30, base = 100) {
  const series = [];
  for (let i = 0; i < days; i++) {
    const date = `2024/07/${String(i + 1).padStart(2, "0")}`;
    const open = +(base + Math.random() * 20 - 10).toFixed(2);
    const close = +(open + Math.random() * 20 - 10).toFixed(2);
    const low = +(Math.min(open, close) - Math.random() * 5).toFixed(2);
    const high = +(Math.max(open, close) + Math.random() * 5).toFixed(2);
    series.push({ date, open, close, low, high });
  }
  return series;
}

// 每只股票附带 30 天价格历史
export const stockPrices = mockStocks.map((stock) => ({
  ticker: stock.ticker,
  name: stock.name,
  priceHistory: generatePriceSeries(30, stock.price),
}));

// 生成 30 天基金价格数据（基金净值一般 1~5 美元/人民币）
function generateFundPriceSeries(days = 30, base = 1.5) {
  const series = [];
  for (let i = 0; i < days; i++) {
    const date = `2024/07/${String(i + 1).padStart(2, "0")}`;
    const open = +(base + Math.random() * 0.2 - 0.1).toFixed(4);
    const close = +(open + Math.random() * 0.2 - 0.1).toFixed(4);
    const low = +(Math.min(open, close) - Math.random() * 0.05).toFixed(4);
    const high = +(Math.max(open, close) + Math.random() * 0.05).toFixed(4);
    series.push({ date, open, close, low, high });
  }
  return series;
}

// 基金基础信息
export const mockFunds = [
  { ticker: "FUND001", name: "华夏成长基金", price: 2.356 },
  { ticker: "FUND002", name: "易方达债券基金", price: 1.045 },
  { ticker: "FUND003", name: "南方平衡混合", price: 1.782 },
  { ticker: "FUND004", name: "嘉实货币市场", price: 1.003 },
  { ticker: "FUND005", name: "广发中证500ETF", price: 3.21 },
  { ticker: "FUND006", name: "汇添富成长精选", price: 2.874 },
  { ticker: "FUND007", name: "工银瑞信信用债", price: 1.096 },
  { ticker: "FUND008", name: "博时中证新能源", price: 3.568 },
  { ticker: "FUND009", name: "招商稳健混合", price: 1.543 },
  { ticker: "FUND010", name: "华宝科技ETF", price: 4.025 },
];

// 每只基金生成 30 天价格历史
export const fundPrices = mockFunds.map((fund) => ({
  ticker: fund.ticker,
  name: fund.name,
  priceHistory: generateFundPriceSeries(30, fund.price),
}));

// 生成 30 天加密货币价格数据
function generateCryptoPriceSeries(days = 30, base = 20000) {
  const series = [];
  for (let i = 0; i < days; i++) {
    const date = `2024/07/${String(i + 1).padStart(2, "0")}`;
    const open = +(base + Math.random() * base * 0.1 - base * 0.05).toFixed(2); // ±5% 波动
    const close = +(open + Math.random() * base * 0.1 - base * 0.05).toFixed(2);
    const low = +(Math.min(open, close) - Math.random() * base * 0.03).toFixed(
      2,
    );
    const high = +(Math.max(open, close) + Math.random() * base * 0.03).toFixed(
      2,
    );
    series.push({ date, open, close, low, high });
  }
  return series;
}

// 加密货币基础信息
export const mockCryptos = [
  { ticker: "BTC", name: "Bitcoin", price: 30000 },
  { ticker: "ETH", name: "Ethereum", price: 2000 },
  { ticker: "BNB", name: "Binance Coin", price: 300 },
  { ticker: "XRP", name: "Ripple", price: 0.65 },
  { ticker: "DOGE", name: "Dogecoin", price: 0.08 },
  { ticker: "SOL", name: "Solana", price: 25 },
  { ticker: "ADA", name: "Cardano", price: 0.35 },
  { ticker: "DOT", name: "Polkadot", price: 6 },
  { ticker: "MATIC", name: "Polygon", price: 0.9 },
  { ticker: "LTC", name: "Litecoin", price: 100 },
];

// 每个币生成 30 天历史价格
export const cryptoPrices = mockCryptos.map((coin) => ({
  ticker: coin.ticker,
  name: coin.name,
  priceHistory: generateCryptoPriceSeries(30, coin.price),
}));
