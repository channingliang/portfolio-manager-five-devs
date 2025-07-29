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
