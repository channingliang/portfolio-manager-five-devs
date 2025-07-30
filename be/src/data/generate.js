// data/fill-eod-missing.js
const fs = require("fs");
const path = require("path");

const FLOAT_PERCENT = 0.05; // ±5%

function genNextEOD(prev) {
  const randFloat = (val, percent) =>
    Number((val * (1 + (Math.random() * 2 * percent - percent))).toFixed(2));
  const nextDate = new Date(prev.date);
  nextDate.setDate(nextDate.getDate() + 1);
  let day = nextDate.getDay();
  if (day === 6) nextDate.setDate(nextDate.getDate() + 2); // Sat -> Mon
  if (day === 0) nextDate.setDate(nextDate.getDate() + 1); // Sun -> Mon
  let base = prev.close;
  let open = randFloat(base, FLOAT_PERCENT);
  let close = randFloat(open, FLOAT_PERCENT);
  let high = Math.max(open, close) + randFloat(base * 0.01, 1);
  let low = Math.min(open, close) - randFloat(base * 0.01, 1);
  let volume = Math.round(prev.volume * (1 + (Math.random() * 0.2 - 0.1)));
  return {
    ...prev,
    date: nextDate.toISOString().slice(0, 10) + "T00:00:00.000Z",
    close: close,
    high: Number(high.toFixed(2)),
    low: Number(low.toFixed(2)),
    open: open,
    volume: volume,
    adjClose: close,
    adjHigh: Number(high.toFixed(2)),
    adjLow: Number(low.toFixed(2)),
    adjOpen: open,
    adjVolume: volume,
    divCash: 0.0,
    splitFactor: 1.0,
  };
}

function fillToYesterday(data) {
  if (!data.length) return data;
  let result = [...data];
  let last = result[result.length - 1];
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  let yesterdayStr = yesterday.toISOString().slice(0, 10);

  while (last.date.slice(0, 10) < yesterdayStr) {
    let next = genNextEOD(last);
    result.push(next);
    last = next;
  }
  return result;
}

function main() {
  const dir = __dirname;
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.startsWith("end-of-day-") && f.endsWith(".json"));

  for (const file of files) {
    const fullPath = path.join(dir, file);
    let arr = [];
    try {
      arr = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
    } catch (e) {
      console.error(`Error reading ${file}:`, e);
      continue;
    }
    if (!arr.length) continue;
    const filledArr = fillToYesterday(arr);

    if (filledArr.length > arr.length) {
      fs.writeFileSync(fullPath, JSON.stringify(filledArr, null, 2));
      console.log(`补全完成：${file} 新增${filledArr.length - arr.length}天`);
    } else {
      console.log(`${file} 已是最新`);
    }
  }
}

main();
