import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARCHIVE_FILES = ["data/cycles.js", "data/cycle-updates.js"];
const DAILY_FILE = path.join(ROOT, "data", "daily-limit-ups.js");
const OUTPUT_FILE = path.join(ROOT, "data", "leader-volume-analysis.js");
const EASTMONEY_ENDPOINT = "https://push2his.eastmoney.com/api/qt/stock/kline/get";

const EXTRA_BOARD_DATES = {
  "lixin-power-2026-07": ["2026-07-16"]
};

const AVERAGE_VOLUME_THRESHOLDS = {
  shrink: 0.6,
  rising: 0.9,
  half: 1.3
};

const EVENT_CONFIG = {
  "huadian-power-2026-03": [
    ["2026-03-17", "首次换手", "二板开板换手，次日缩量一字。", true, false],
    ["2026-03-20", "主升确认", "五板分化放量，仍然完成回封。", false, false],
    ["2026-03-26", "高位分歧", "九板附近爆量滞涨，次日量能继续处于高位。", false, true]
  ],
  "jinyao-medicine-2026-04": [
    ["2026-03-31", "首次换手", "三板分化放量，次日转强缩量。", true, false],
    ["2026-04-03", "监管前换手", "六板重新放量，强势封住。", false, false],
    ["2026-04-07", "渡劫爆量", "七板炸开回封，承接仍在。", false, false],
    ["2026-04-08", "退潮爆量", "高位放量未能封板，周期转弱。", false, true]
  ],
  "shengyang-compute-2026-04": [
    ["2026-04-10", "首次爆量", "二板成交和换手同时放大，随后缩量晋级。", true, false],
    ["2026-04-14", "二次爆量", "四板分歧换手，全天反复开板。", false, false],
    ["2026-04-20", "尾盘吹哨", "高位尾盘炸板爆量，次日跌停确认。", false, true]
  ],
  "datang-power-2026-05": [
    ["2026-05-08", "首次爆量", "三板T字反复开板，完成第一次大换手。", true, false],
    ["2026-05-12", "二次换手", "五板回封放量，主升继续。", false, false],
    ["2026-05-14", "末端兑现", "连续加速后爆出周期最大成交额，收盘未封板。", false, true]
  ],
  "haya-medicine-2026-07": [
    ["2026-07-14", "换龙确认", "三板分化放量，接过板块身位。", true, false],
    ["2026-07-16", "高位换手", "五板T字开板换手，辨识度开始吹哨。", false, false],
    ["2026-07-17", "断板爆量", "成交额和换手率升至周期峰值，断板进入大分歧。", false, true]
  ],
  "lixin-power-2026-07": [
    ["2026-07-20", "首次放量", "三板换手放量，题材预期由三天抬升到五天。", false, false],
    ["2026-07-21", "分化爆量", "四板T字反复开板，次日缩量弱转强。", true, false],
    ["2026-07-23", "二次分歧", "六板再次放量回封，板块回流延续。", false, false],
    ["2026-07-24", "监管吹哨", "午后情绪转弱，放量开板后未能封住。", false, true]
  ],
  "chuanzhi-ai-2026-08": [
    ["2026-07-28", "首次换手", "二板回封放量，次日缩成一字。", true, false],
    ["2026-07-30", "回流换手", "一字后重新放量，超强回流确认。", false, false],
    ["2026-07-31", "分化换手", "五板T字放量，随后再次缩成一字。", false, false],
    ["2026-08-04", "高位换手", "六板一字后七板重新放量。", false, false],
    ["2026-08-05", "高位爆量", "八板末封拖到下午，次日出现更大分歧量。", false, true]
  ],
  "baihua-medicine-2026-08": [
    ["2026-08-06", "首次爆量", "三板大换手后封住，完成龙头切换。", true, false],
    ["2026-08-11", "开板换手", "五板一字后六板T字放量。", false, false],
    ["2026-08-12", "高位爆量", "七板换手率再创新高，尾盘资金开始抢跑。", false, true]
  ],
  "wanxiang-agri-2026-09": [
    ["2026-08-19", "窗口前首爆", "当前记录窗口前已出现第一次大换手，随后分歧失败。", false, false],
    ["2026-08-26", "二波换手", "二波连续换手后，次日明显缩量。", true, false],
    ["2026-09-01", "回流爆量", "六板回封重新放量，次日进入周期最大换手。", false, true]
  ]
};

const COMPLETED_CYCLES = new Set([
  "huadian-power-2026-03",
  "jinyao-medicine-2026-04",
  "shengyang-compute-2026-04",
  "datang-power-2026-05",
  "haya-medicine-2026-07",
  "lixin-power-2026-07"
]);

const TRADE_CONFIG = {
  "huadian-power-2026-03": {
    preBuy: ["2026-03-17", "爆量弱转强", "二板开板换手回封，前置试错点成立。"],
    standardBuy: ["2026-03-18", "缩量转强确认", "次日缩量一字，确认筹码锁定；属于确认成立但难成交。"],
    standardSell: ["2026-03-26", "高位爆量分歧", "九板附近放量滞涨，按标准卖点处理。"],
    regulation: ["2026-03-24", "2026-03-26", "进入高位监管观察后仍延续，卖点后置到爆量滞涨日。"]
  },
  "jinyao-medicine-2026-04": {
    preBuy: ["2026-03-31", "爆量弱转强", "三板分化换手回封，前置参与点。"],
    standardBuy: ["2026-04-01", "缩量转强确认", "次日缩量秒板，板块强回流同步确认。"],
    standardSell: ["2026-04-08", "高位爆量分歧", "爆量炸板跳水，标准卖点成立。"],
    regulation: ["2026-04-07", "2026-04-08", "监管观察日七板回封，按后置逻辑持有到次日爆量失败。"]
  },
  "shengyang-compute-2026-04": {
    preBuy: ["2026-04-10", "爆量弱转强", "二板大换手封住，龙头从混乱题材中开始走出。"],
    standardBuy: ["2026-04-13", "缩量转强确认", "次日成交额明显收缩，三板回封确认。"],
    standardSell: ["2026-04-20", "高位炸板爆量", "尾盘炸板爆量，次日跌停完成确认。"],
    regulation: ["2026-04-17", "2026-04-20", "七板后进入红线观察，高位卖点后置到下一交易日炸板爆量。"]
  },
  "datang-power-2026-05": {
    preBuy: ["2026-05-08", "爆量弱转强", "三板T字反复开板后回封，完成大市值龙头第一次换手。"],
    standardBuy: ["2026-05-11", "缩量转强确认", "次日成交额收缩约75%，四板早盘封住。"],
    standardSell: ["2026-05-14", "高位炸板爆量", "连续加速失败并爆出周期最大成交额。"],
    regulation: null
  },
  "haya-medicine-2026-07": {
    preBuy: ["2026-07-14", "爆量弱转强", "三板分化回封并完成换龙，前置买点最清晰。"],
    standardBuy: ["2026-07-15", "缩量转强确认", "次日缩量秒板，板块再次强回流。"],
    standardSell: ["2026-07-17", "高位爆量分歧", "五板后断板爆量，主升阶段结束。"],
    regulation: null
  },
  "lixin-power-2026-07": {
    preBuy: ["2026-07-21", "爆量弱转强", "四板T字充分换手，次日弱转强预期形成。"],
    standardBuy: ["2026-07-22", "缩量转强确认", "次日缩量秒板并带动板块强回流。"],
    standardSell: ["2026-07-24", "高位爆量分歧", "午后炸板未回封并进入监管风险段。"],
    regulation: null
  },
  "chuanzhi-ai-2026-08": {
    preBuy: ["2026-07-28", "爆量弱转强", "二板回封完成第一次有效换手。"],
    standardBuy: ["2026-07-29", "缩量转强确认", "次日缩成一字，确认成立但没有舒适成交点。"],
    standardSell: ["2026-08-06", "窗口后爆量分歧", "八板后次日成交和换手翻倍，收盘转弱。"],
    regulation: ["2026-08-05", "2026-08-06", "八板进入100%红线观察，卖点后置到次日爆量分歧。"]
  },
  "baihua-medicine-2026-08": {
    preBuy: ["2026-08-06", "爆量弱转强", "三板大换手回封，完成医药内部龙头切换。"],
    standardBuy: ["2026-08-07", "缩量转强确认", "次日缩量四板，板块强回流同步确认。"],
    standardSell: ["2026-08-13", "窗口后爆量分歧", "七板后次日换手升至48.1%，未能继续封板。"],
    regulation: ["2026-08-12", "2026-08-13", "七板进入100%红线观察，后置到次日周期峰值量兑现。"]
  },
  "wanxiang-agri-2026-09": {
    preBuy: ["2026-08-26", "爆量弱转强", "前一轮失败后，二波连续换手回封。"],
    standardBuy: ["2026-08-27", "缩量转强确认", "次日成交额收缩约62%，早盘秒板确认。"],
    standardSell: ["2026-09-02", "窗口后爆量分歧", "六板后次日换手升至34.9%，未能封板。"],
    regulation: null
  }
};

function loadData() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  ARCHIVE_FILES.forEach((file) => {
    const fullPath = path.join(ROOT, file);
    if (fs.existsSync(fullPath)) vm.runInContext(fs.readFileSync(fullPath, "utf8"), sandbox, { filename: fullPath });
  });
  vm.runInContext(fs.readFileSync(DAILY_FILE, "utf8"), sandbox, { filename: DAILY_FILE });
  return {
    archive: sandbox.window.LEADER_CYCLE_ARCHIVE,
    daily: sandbox.window.LEADER_CYCLE_DAILY_LIMIT_UPS
  };
}

function normalizeDate(value) {
  const parts = String(value || "").replaceAll("/", "-").split("-");
  if (parts.length !== 3) return String(value || "");
  return `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
}

function slashDate(value) {
  return normalizeDate(value).replaceAll("-", "/").replace(/\/0(?=\d(?:\/|$))/g, "/");
}

function shiftDate(value, days) {
  const date = new Date(`${normalizeDate(value)}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function secid(code) {
  const market = String(code).endsWith(".SH") ? "1" : "0";
  return `${market}.${String(code).slice(0, 6)}`;
}

function median(values) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

async function fetchKlines(cycle, firstDate, lastDate) {
  const url = new URL(EASTMONEY_ENDPOINT);
  url.search = new URLSearchParams({
    secid: secid(cycle.code),
    klt: "101",
    fqt: "1",
    beg: shiftDate(firstDate, -45).replaceAll("-", ""),
    end: shiftDate(lastDate, 10).replaceAll("-", ""),
    fields1: "f1,f2,f3,f4,f5,f6",
    fields2: "f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61"
  });
  const response = await fetch(url, { headers: { Referer: "https://quote.eastmoney.com/" } });
  if (!response.ok) throw new Error(`${cycle.name} Eastmoney request failed: ${response.status}`);
  const payload = await response.json();
  return (payload.data?.klines || []).map((line, index) => {
    const fields = line.split(",");
    return {
      index,
      date: fields[0],
      open: Number(fields[1]),
      close: Number(fields[2]),
      high: Number(fields[3]),
      low: Number(fields[4]),
      volume: Number(fields[5]),
      amount: Number(fields[6]),
      amplitude: Number(fields[7]),
      pct: Number(fields[8]),
      change: Number(fields[9]),
      turnover: Number(fields[10])
    };
  });
}

function findLeaderStock(daily, cycle, date) {
  const record = daily.cycles?.[cycle.id]?.records?.[slashDate(date)];
  const history = daily.cycles?.[cycle.id]?.leaderHistory?.[slashDate(date)];
  if (history?.leaderStock) return history.leaderStock;
  if (!record) return null;
  if (record.leaderStock) return record.leaderStock;
  const code = String(cycle.code || "").slice(0, 6);
  return (record.stocks || []).find((stock) => stock.name === cycle.leader || stock.code === code) || null;
}

function classifyBoardVolume(ratio) {
  if (ratio < AVERAGE_VOLUME_THRESHOLDS.shrink) return "缩量";
  if (ratio < AVERAGE_VOLUME_THRESHOLDS.rising) return "起量";
  if (ratio < AVERAGE_VOLUME_THRESHOLDS.half) return "半放量";
  return "全放量";
}

function findBoard(cycle, date, stock) {
  if (stock?.board) return stock.board;
  const target = normalizeDate(date);
  const item = cycle.limitBoard?.items?.find((entry) => normalizeDate(entry.date) === target);
  return item?.board || "-";
}

function makeMetrics(rows, row) {
  const previous = rows[row.index - 1];
  const previousFive = rows.slice(Math.max(0, row.index - 5), row.index).map((item) => item.amount);
  const base = median(previousFive);
  return {
    amount: row.amount,
    amountYi: Number((row.amount / 100000000).toFixed(1)),
    turnover: Number(row.turnover.toFixed(1)),
    pct: Number(row.pct.toFixed(2)),
    previousRatio: Number((previous?.amount ? row.amount / previous.amount : 0).toFixed(2)),
    medianFiveRatio: Number((base ? row.amount / base : 0).toFixed(2))
  };
}

function relationToWindow(date, firstDate, lastDate) {
  if (date < firstDate) return "窗口前";
  if (date > lastDate) return "窗口后";
  return "周期内";
}

function makeEvent(cycle, daily, rows, byDate, config, firstDate, lastDate) {
  const [date, kind, note, firstExchange, terminal] = config;
  const row = byDate.get(date);
  if (!row) return null;
  const stock = findLeaderStock(daily, cycle, date);
  const record = cycle.records.find((item) => normalizeDate(item.date) === date);
  return {
    date,
    displayDate: slashDate(date),
    kind,
    note,
    firstExchange,
    terminal,
    relation: relationToWindow(date, firstDate, lastDate),
    phase: record?.phase || relationToWindow(date, firstDate, lastDate),
    board: findBoard(cycle, date, stock),
    type: stock?.type || (row.pct >= 9.5 ? "涨停" : row.pct <= -9.5 ? "跌停" : "未封板"),
    firstSeal: stock?.firstSeal || "-",
    lastSeal: stock?.lastSeal || "-",
    openCount: stock?.openCount || "-",
    ...makeMetrics(rows, row)
  };
}

function makeTradeSignal(cycle, daily, rows, byDate, config, firstDate, lastDate) {
  if (!config) return null;
  const [date, title, note] = config;
  const row = byDate.get(date);
  if (!row) return null;
  const stock = findLeaderStock(daily, cycle, date);
  const record = cycle.records.find((item) => normalizeDate(item.date) === date);
  return {
    date,
    displayDate: slashDate(date),
    title,
    note,
    relation: relationToWindow(date, firstDate, lastDate),
    phase: record?.phase || relationToWindow(date, firstDate, lastDate),
    board: findBoard(cycle, date, stock),
    type: stock?.type || (row.pct >= 9.5 ? "涨停" : row.pct <= -9.5 ? "跌停" : "未封板"),
    firstSeal: stock?.firstSeal || "-",
    lastSeal: stock?.lastSeal || "-",
    openCount: stock?.openCount || "-",
    ...makeMetrics(rows, row)
  };
}

async function main() {
  const { archive, daily } = loadData();
  const output = {
    generatedAt: new Date().toISOString(),
    method: "关键爆量点按相对成交额识别，并结合换手率、开板次数、封板窗口和原始复盘语义复核。成交额与换手率来自东方财富日K，封板时间来自短线侠每日复盘。",
    source: {
      marketName: "东方财富历史日K",
      marketUrl: "https://quote.eastmoney.com/center/",
      shortxName: daily.sourceName,
      shortxUrl: daily.sourceUrl,
      regulationName: "交易所严重异常波动口径",
      regulationUrl: "https://www.sse.com.cn/disclosure/diclosure/ycjyxx/main/"
    },
    stats: {},
    findings: [],
    tradeLogic: [
      "爆量弱转强：买点前置",
      "次日缩量转强确认：标准买点",
      "高位炸板爆量分歧：标准卖点",
      "监管红线100%异动：卖点后置"
    ],
    tradeStats: {},
    boardVolumeMethod: "四档量能标签统一按本轮成功封住的连板日平均成交额判断，断板或炸板日不计入均值，但继续与均值比较：x<0.60缩量、0.60<=x<0.90起量、0.90<=x<1.30半放量、x>=1.30全放量。首板成交额固定为1.00倍，仅在旁边显示当日是首板的几倍，不参与四档分类。",
    boardVolumeStats: {},
    boardVolumeFindings: [],
    boardVolumeRules: [
      {
        title: "全放量弱转强后的次日确认",
        text: "题材分化或分歧延续后，龙头当天全放量弱转强；次日如果缩量或降档转强，并且板块同步强回流，就是最舒服的确认买点。代表：百花四板、立新五板、哈药四板、大唐四板、圣阳五板、津药四板。"
      },
      {
        title: "该全放量却未全放量",
        text: "分化分歧节点如果走一字、高开秒板或只起量/半放量，说明龙头量能准备没有彻底完成；这种结构容易把二次放量后移到五板，并且五板往往会率先上板。代表：传智教育、华电辽能、豫能控股。"
      },
      {
        title: "四板前的仓位节奏",
        text: "四板及以前，半放量当日回封可半仓；连续两天放量后的第三天缩量转强，或单次全放量后的次日缩量转强，可以提高仓位。五板才第一次全放量时，要确认它是否属于补足量能而不是末端兑现。"
      }
    ],
    boardVolumeCombinations: [
      {
        code: "A",
        name: "均匀放量型",
        sequence: "起量/全放量交替 -> 少见极致缩量 -> 龙头换手稳定",
        rule: "类型：量能结构",
        cycles: [
          { id: "shengyang-compute-2026-04", note: "一板起量、二板全放量，随后起量/全量交替，没有长时间极致缩量。代表均匀换手型。" }
        ]
      },
      {
        code: "B",
        name: "缩量放量型",
        sequence: "首板缩量 -> 前置无全量 -> 首次全放量 -> 次日缩量/降档转强",
        rule: "类型：首板低量启动",
        cycles: [
          { id: "jinyao-medicine-2026-04", note: "启动首板就是缩量板，前面没有充分放量；三板半放量、四板缩量转强，后续六七板再全放量。" },
          { id: "haya-medicine-2026-07", note: "首板缩量，三板全放量完成换龙，四板缩量秒板确认。" },
          { id: "datang-power-2026-05", note: "一二板缩量，三板全放量，四板缩量转强确认。" },
          { id: "baihua-medicine-2026-08", note: "一二板缩量，三板全放量，四板降档转强确认龙头切换。" },
          { id: "lixin-power-2026-07", note: "一二板缩量，四板全放量，五板降档转强并带动题材强回流。" }
        ]
      },
      {
        code: "C",
        name: "分歧全放量确认型",
        sequence: "题材分化/分歧延续 -> 龙头全放量弱转强 -> 次日缩量/降档转强共振板块回流",
        rule: "对应规律 1",
        cycles: [
          { id: "baihua-medicine-2026-08", note: "三板全放量后，四板转强确认并与医药强回流共振。" },
          { id: "lixin-power-2026-07", note: "四板全放量后，五板转强确认并与电力强回流共振。" },
          { id: "haya-medicine-2026-07", note: "三板全放量后，四板弱转强秒板确认医药主升。" },
          { id: "datang-power-2026-05", note: "三板全放量后，四板带动电力强回流确认。" },
          { id: "shengyang-compute-2026-04", note: "四板全放量后，五板卡成最高标确认。" },
          { id: "jinyao-medicine-2026-04", note: "三板半放量后，四板缩量转强确认医药穿越。" }
        ]
      },
      {
        code: "D",
        name: "五板二次放量型",
        sequence: "前四板缩/起/半放量 -> 该全量节点未全量 -> 五板率先上板补足全放量",
        rule: "对应规律 2",
        cycles: [
          { id: "chuanzhi-ai-2026-08", note: "前四板缩、半、缩、起，五板全放量，完成五板前的量能补课。" },
          { id: "huadian-power-2026-03", note: "前四板缩、起、缩、半，五板全放量，先上板再接受分歧检验。" },
          { id: "yunneng-power-2026-03", name: "豫能控股周期（待补全）", note: "同属五板二次放量逻辑，后续补入完整周期数据后再纳入统计。" }
        ]
      }
    ],
    cycles: {}
  };
  const firstChecks = [];
  const terminalChecks = [];

  for (const cycle of archive.cycles || []) {
    const cycleDates = cycle.records.map((record) => normalizeDate(record.date)).sort();
    const firstDate = cycleDates[0];
    const lastDate = cycleDates.at(-1);
    const extraBoardDates = EXTRA_BOARD_DATES[cycle.id] || [];
    const configuredDates = [...(EVENT_CONFIG[cycle.id] || []).map((item) => item[0]), ...extraBoardDates];
    const fetchFirst = [firstDate, ...configuredDates].sort()[0];
    const rows = await fetchKlines(cycle, fetchFirst, lastDate);
    const byDate = new Map(rows.map((row) => [row.date, row]));
    const events = (EVENT_CONFIG[cycle.id] || [])
      .map((config) => makeEvent(cycle, daily, rows, byDate, config, firstDate, lastDate))
      .filter(Boolean);
    const cycleRows = cycleDates.map((date) => byDate.get(date)).filter(Boolean);
    const endIndex = byDate.get(lastDate)?.index ?? -1;
    const nextRow = endIndex >= 0 ? rows[endIndex + 1] : null;
    const postWindow = nextRow
      ? {
          date: nextRow.date,
          displayDate: slashDate(nextRow.date),
          ...makeMetrics(rows, nextRow)
        }
      : null;
    const tradeConfig = TRADE_CONFIG[cycle.id] || {};
    const tradePlan = {
      preBuy: makeTradeSignal(cycle, daily, rows, byDate, tradeConfig.preBuy, firstDate, lastDate),
      standardBuy: makeTradeSignal(cycle, daily, rows, byDate, tradeConfig.standardBuy, firstDate, lastDate),
      standardSell: makeTradeSignal(cycle, daily, rows, byDate, tradeConfig.standardSell, firstDate, lastDate),
      regulation: tradeConfig.regulation
        ? {
            status: "红线观察",
            watch: makeTradeSignal(
              cycle,
              daily,
              rows,
              byDate,
              [tradeConfig.regulation[0], "100%异动红线观察", tradeConfig.regulation[2]],
              firstDate,
              lastDate
            ),
            delayedSell: makeTradeSignal(
              cycle,
              daily,
              rows,
              byDate,
              [tradeConfig.regulation[1], "后置卖点", tradeConfig.regulation[2]],
              firstDate,
              lastDate
            ),
            note: tradeConfig.regulation[2]
          }
        : {
            status: "未进入红线观察",
            watch: null,
            delayedSell: null,
            note: "周期高度未满足本模型的100%异动红线观察条件，按标准卖点执行。"
          }
    };
    const dailyCycle = daily.cycles?.[cycle.id] || {};
    const capturedBoardDates = Object.values(dailyCycle.records || {})
      .filter((record) => record.leaderStock)
      .map((record) => normalizeDate(record.date));
    const boardDates = [...new Set([...capturedBoardDates, ...extraBoardDates])]
      .filter((date) => byDate.get(date)?.pct >= 9.5)
      .sort();
    const boardRows = boardDates.map((date) => byDate.get(date)).filter(Boolean);
    const firstBoardRow = boardRows[0];
    const firstBoardAmount = firstBoardRow?.amount || 1;
    const averageAmount = boardRows.reduce((sum, row) => sum + row.amount, 0) / Math.max(1, boardRows.length);
    const averageTurnover = boardRows.reduce((sum, row) => sum + row.turnover, 0) / Math.max(1, boardRows.length);
    const terminalDate = tradePlan.standardSell?.date;
    const comparisonDates = [...new Set([...boardDates, terminalDate].filter(Boolean))].sort();
    const boardIndex = new Map(boardDates.map((date, index) => [date, index + 1]));
    const boardVolumeDays = comparisonDates.map((date) => {
      const row = byDate.get(date);
      const stock = findLeaderStock(daily, cycle, date);
      const record = cycle.records.find((item) => normalizeDate(item.date) === date);
      const averageRatio = Number((row.amount / averageAmount).toFixed(2));
      const firstBoardRatio = Number((row.amount / firstBoardAmount).toFixed(2));
      const sequence = boardIndex.get(date);
      return {
        date,
        displayDate: slashDate(date),
        relation: relationToWindow(date, firstDate, lastDate),
        phase: record?.phase || relationToWindow(date, firstDate, lastDate),
        board: sequence ? `${sequence}板` : "断板/炸板",
        boardDetail: stock?.board || (sequence ? `${sequence}板` : "未封板"),
        isBoardDay: Boolean(sequence),
        isTerminal: date === terminalDate,
        type: stock?.type || (row.pct >= 9.5 ? "涨停" : row.pct <= -9.5 ? "跌停" : "未封板"),
        firstSeal: stock?.firstSeal || "-",
        lastSeal: stock?.lastSeal || "-",
        openCount: stock?.openCount || "-",
        averageRatio,
        averageVolumeState: classifyBoardVolume(averageRatio),
        firstBoardRatio,
        ...makeMetrics(rows, row)
      };
    });
    const averageFullDays = boardVolumeDays.filter((day) => day.isBoardDay && day.averageVolumeState === "全放量");
    const firstAverageFullDay = averageFullDays[0] || null;
    const firstAverageFullPosition = firstAverageFullDay
      ? boardVolumeDays.findIndex((day) => day.date === firstAverageFullDay.date)
      : -1;
    const nextBoardAfterFirstAverageFull = firstAverageFullPosition >= 0
      ? boardVolumeDays.slice(firstAverageFullPosition + 1).find((day) => day.isBoardDay)
      : null;
    const terminalDay = boardVolumeDays.find((day) => day.isTerminal) || null;
    const terminalRankByAmount = terminalDay
      ? [...boardVolumeDays].sort((a, b) => b.amount - a.amount).findIndex((day) => day.date === terminalDay.date) + 1
      : null;
    const boardVolume = {
      averageAmount: Number(averageAmount.toFixed(0)),
      averageAmountYi: Number((averageAmount / 100000000).toFixed(1)),
      averageTurnover: Number(averageTurnover.toFixed(1)),
      firstBoardDate: boardDates[0] || "",
      firstBoardAmount: Number(firstBoardAmount.toFixed(0)),
      firstBoardAmountYi: Number((firstBoardAmount / 100000000).toFixed(1)),
      firstBoardTurnover: Number((firstBoardRow?.turnover || 0).toFixed(1)),
      boardDayCount: boardDates.length,
      averageFullVolumeBoardCount: averageFullDays.length,
      firstAverageFullDate: firstAverageFullDay?.date || "",
      nextBoardAfterFirstAverageFullState: nextBoardAfterFirstAverageFull?.averageVolumeState || "",
      terminalAverageRatio: terminalDay?.averageRatio || 0,
      terminalFirstBoardRatio: terminalDay?.firstBoardRatio || 0,
      terminalRankByAmount,
      days: boardVolumeDays
    };
    const firstEvent = events.find((event) => event.firstExchange);
    if (firstEvent) {
      const firstRow = byDate.get(firstEvent.date);
      const next = firstRow ? rows[firstRow.index + 1] : null;
      firstChecks.push({
        board: Number(findLeaderStock(daily, cycle, firstEvent.date)?.streak || 0),
        contraction: Boolean(next && next.amount <= firstRow.amount * 0.65)
      });
    }
    if (COMPLETED_CYCLES.has(cycle.id)) {
      const terminal = events.find((event) => event.terminal);
      const rankedAmounts = [...cycleRows].sort((a, b) => b.amount - a.amount).slice(0, 2).map((row) => row.date);
      terminalChecks.push({
        lastTwo: Boolean(terminal && cycleDates.slice(-2).includes(terminal.date)),
        topTwoAmount: Boolean(terminal && rankedAmounts.includes(terminal.date))
      });
    }

    output.cycles[cycle.id] = {
      name: cycle.name,
      leader: cycle.leader,
      code: cycle.code,
      sector: cycle.sector,
      dateRange: cycle.dateRange,
      events,
      postWindow,
      tradePlan,
      boardVolume,
      peakAmountDate: [...cycleRows].sort((a, b) => b.amount - a.amount)[0]?.date || "",
      peakTurnoverDate: [...cycleRows].sort((a, b) => b.turnover - a.turnover)[0]?.date || ""
    };
  }

  output.stats = {
    cycleCount: Object.keys(output.cycles).length,
    earlyBoardCount: firstChecks.filter((item) => item.board >= 2 && item.board <= 4).length,
    contractionCount: firstChecks.filter((item) => item.contraction).length,
    completedCount: terminalChecks.length,
    terminalLastTwoCount: terminalChecks.filter((item) => item.lastTwo).length,
    terminalTopTwoCount: terminalChecks.filter((item) => item.topTwoAmount).length
  };
  output.findings = [
    {
      title: "首次有效爆量集中在二至四板",
      text: `${output.stats.earlyBoardCount}/${output.stats.cycleCount} 个样本的第一次有效筹码交换落在二至四板，通常对应换龙、分化回封或题材持续性确认。`
    },
    {
      title: "爆量后的次日缩量才是确认",
      text: `${output.stats.contractionCount}/${output.stats.cycleCount} 个样本在首次有效爆量后的下一交易日成交额收缩超过 35%，但价格仍保持强势。爆量本身不是买点，缩量承接才说明筹码被锁住。`
    },
    {
      title: "主升常走放量、缩量、再放量",
      text: "第一次放量解决分歧，缩量加速建立身位，第二次放量检验承接。第二次放量还能早封，周期延续；末封拖到午后或无法封住，通常进入风险段。"
    },
    {
      title: "终局爆量落在最后一至两日",
      text: `${output.stats.terminalLastTwoCount}/${output.stats.completedCount} 个已明确结束的周期都在最后一至两个交易日出现终局爆量，且 ${output.stats.terminalTopTwoCount}/${output.stats.completedCount} 位列周期成交额前二。`
    }
  ];
  const tradePlans = Object.values(output.cycles).map((cycle) => cycle.tradePlan);
  output.tradeStats = {
    cycleCount: tradePlans.length,
    confirmedBuyCount: tradePlans.filter((plan) => plan.standardBuy?.previousRatio <= 0.65 && plan.standardBuy?.pct >= 9.5).length,
    executableConfirmCount: tradePlans.filter(
      (plan) => plan.standardBuy?.previousRatio <= 0.65 && plan.standardBuy?.pct >= 9.5 && plan.standardBuy?.type !== "一字板"
    ).length,
    regulationCount: tradePlans.filter((plan) => plan.regulation?.watch).length,
    postWindowSellCount: tradePlans.filter((plan) => plan.standardSell?.relation === "窗口后").length
  };
  const boardVolumes = Object.values(output.cycles).map((cycle) => cycle.boardVolume);
  const terminalAverageRatios = boardVolumes.map((item) => item.terminalAverageRatio).filter(Number.isFinite);
  const terminalFirstBoardRatios = boardVolumes.map((item) => item.terminalFirstBoardRatio).filter(Number.isFinite);
  output.boardVolumeStats = {
    cycleCount: boardVolumes.length,
    boardDayCount: boardVolumes.reduce((sum, item) => sum + item.boardDayCount, 0),
    dualAnchorCount: boardVolumes.filter(
      (item) => item.averageAmount > 0 && item.days.find((day) => day.isBoardDay)?.firstBoardRatio === 1
    ).length,
    averageTwoFullVolumeCount: boardVolumes.filter((item) => item.averageFullVolumeBoardCount >= 2).length,
    averageFirstFullResetCount: boardVolumes.filter(
      (item) => item.nextBoardAfterFirstAverageFullState && item.nextBoardAfterFirstAverageFullState !== "全放量"
    ).length,
    terminalAverageFullVolumeCount: boardVolumes.filter(
      (item) => item.terminalAverageRatio >= AVERAGE_VOLUME_THRESHOLDS.half
    ).length,
    terminalTopTwoCount: boardVolumes.filter((item) => item.terminalRankByAmount && item.terminalRankByAmount <= 2).length,
    terminalAverageMultiple: Number(
      (terminalAverageRatios.reduce((sum, value) => sum + value, 0) / Math.max(1, terminalAverageRatios.length)).toFixed(2)
    ),
    terminalFirstBoardMultiple: Number(
      (terminalFirstBoardRatios.reduce((sum, value) => sum + value, 0) / Math.max(1, terminalFirstBoardRatios.length)).toFixed(2)
    )
  };
  output.boardVolumeFindings = [
    {
      title: "先分两类底层量能结构",
      text: `均匀放量型不依赖极致缩量一字板，成交更平滑，代表是圣阳股份；缩量放量型通常首板缩量、前面无充分换手，后面必须等首次全放量或次日降档转强确认，代表是津药药业。`
    },
    {
      title: "全放量不是单独买点",
      text: `题材分化或分歧延续后，龙头全放量弱转强只是前置信号；次日缩量或降档转强，并且题材强回流共振，才是仓位提高的确认。`
    },
    {
      title: "五板二次放量是补课节点",
      text: `如果四板及以前该全放量的位置没有真正全放量，或者连续出现缩量、一字、起量和半放量，五板全放量往往是在补足龙头量能准备，关键看它是否能率先上板。`
    },
    {
      title: "终结日均量信号最稳定",
      text: `${output.boardVolumeStats.terminalAverageFullVolumeCount}/${output.boardVolumeStats.cycleCount} 个终结日达到均量全放量，平均为连板均量的 ${output.boardVolumeStats.terminalAverageMultiple} 倍；${output.boardVolumeStats.terminalTopTwoCount}/${output.boardVolumeStats.cycleCount} 个位列本轮成交额前二。`
    }
  ];

  fs.writeFileSync(OUTPUT_FILE, `window.LEADER_CYCLE_VOLUME_ANALYSIS = ${JSON.stringify(output, null, 2)};\n`, "utf8");
  console.log(`Wrote ${OUTPUT_FILE}`);
  console.table(
    Object.values(output.cycles).map((cycle) => ({
      cycle: cycle.name,
      events: cycle.events.map((event) => `${event.displayDate} ${event.kind}`).join(" / "),
      post: cycle.postWindow ? `${cycle.postWindow.displayDate} ${cycle.postWindow.amountYi}亿 ${cycle.postWindow.turnover}%` : "-"
    }))
  );
  console.log(output.stats);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
