// dashboard 饼状图数据
export const pieChartData = [
  { value: 40, name: "stock" },
  { value: 30, name: "cash" },
  { value: 20, name: "crypto" },
];

export const lineChartData = [
  { name: "Cash", data: [1000, 1200, 1500, 1300, 1600, 1800, 1555] }, // 账户余额变化
  { name: "Portfolio", data: [150, 200, 250, 300, 350, 400, 450] }, // 投资总值变化
  { name: "Profit", data: [50, 80, 100, 120, 150, 180, 200] }, // 总利润变化
];

export const accountOverview = [
  {
    name: "Portfolio A",
    ticker: "AAPL",
    amount: 150,
    profit: 1999,
    current_price: 214.05,
  },
  {
    name: "Portfolio B",
    ticker: "TSLA",
    amount: 80,
    profit: -230,
    current_price: 298.12,
  },
  {
    name: "Portfolio C",
    ticker: "MSFT",
    amount: 120,
    profit: 3100,
    current_price: 345.67,
  },
  {
    name: "Portfolio D",
    ticker: "BTC",
    amount: 0.75,
    profit: 4200,
    current_price: 29850.25,
  },
  {
    name: "Portfolio E",
    ticker: "ETH",
    amount: 5,
    profit: -950,
    current_price: 1985.6,
  },
  {
    name: "Portfolio F",
    ticker: "FUND001",
    amount: 1000,
    profit: 320,
    current_price: 2.45,
  },
  {
    name: "Portfolio G",
    ticker: "NVDA",
    amount: 60,
    profit: 4000,
    current_price: 460.2,
  },
  {
    name: "Portfolio H",
    ticker: "SOL",
    amount: 120,
    profit: 650,
    current_price: 24.8,
  },
  {
    name: "Portfolio I",
    ticker: "PDD",
    amount: 200,
    profit: 2800,
    current_price: 156.3,
  },
  {
    name: "Portfolio J",
    ticker: "FUND005",
    amount: 500,
    profit: 120,
    current_price: 3.15,
  },
];

// crypto meta 用 https://api.tiingo.com/tiingo/crypto?tickers=curebtc&token=2024e73ccc9807945e3d335776aec49535858db3
// stock meta 用 https://api.tiingo.com/tiingo/fundamentals/meta?token=2024e73ccc9807945e3d335776aec49535858db3
// price 用 https://api.tiingo.com/tiingo/daily/aapl/prices?startDate=2025-7-1&token=2024e73ccc9807945e3d335776aec49535858db3
// 请求携带ticker或者name，模糊匹配，返回所有符合数据
export const stocksData = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    detail: {
      date: "2025-07-28T00:00:00.000Z",
      close: 214.05,
      high: 214.845,
      low: 213.06,
      open: 214.03,
      volume: 37858017,
      adjClose: 214.05,
      adjHigh: 214.845,
      adjLow: 213.06,
      adjOpen: 214.03,
      adjVolume: 37858017,
      divCash: 0.0,
      splitFactor: 1.0,
    },
  },
];
