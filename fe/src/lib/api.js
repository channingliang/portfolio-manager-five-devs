// 模拟股票数据
// --- Complete Fake Stock Data (30 days for each) ---
function genKLine(startPrice) {
  const result = [];
  let price = startPrice;
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today.getTime() - i * 24 * 3600 * 1000);
    const open = +(price + (Math.random() - 0.5) * 3).toFixed(2);
    const close = +(open + (Math.random() - 0.5) * 5).toFixed(2);
    const high = Math.max(open, close) + +(Math.random() * 3).toFixed(2);
    const low = Math.min(open, close) - +(Math.random() * 3).toFixed(2);
    price = close; // chain effect
    result.unshift({
      date: date.toISOString().slice(0, 10),
      open: open,
      close: close,
      low: +low.toFixed(2),
      high: +high.toFixed(2),
      volume: Math.floor(30000000 + Math.random() * 10000000),
      adjClose: close,
      adjHigh: high,
      adjLow: low,
      adjOpen: open,
      adjVolume: Math.floor(30000000 + Math.random() * 10000000),
      divCash: 0,
      splitFactor: 1,
    });
  }
  return result;
}

export const mockStocks = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    price: null, // fill below
    kline: genKLine(215),
  },
  {
    ticker: "GOOG",
    name: "Alphabet Inc.",
    price: null,
    kline: genKLine(2850),
  },
  {
    ticker: "TSLA",
    name: "Tesla Inc.",
    price: null,
    kline: genKLine(750),
  },
];

// Patch price with last close for each stock
mockStocks.forEach((s) => {
  s.price = s.kline[s.kline.length - 1].close;
});

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
