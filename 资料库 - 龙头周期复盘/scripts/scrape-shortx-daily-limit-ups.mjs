import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const CYCLES_FILE = path.join(ROOT, "data", "cycles.js");
const CYCLE_UPDATES_FILE = path.join(ROOT, "data", "cycle-updates.js");
const OUTPUT_FILE = path.join(ROOT, "data", "daily-limit-ups.js");
const SHORTX_ENDPOINT = "http://duanxianxia.cn/api/getFupanByYidong";
const SHORTX_SOURCE_URL = "http://duanxianxia.cn/web/fupan/";

const EXTRA_LEADER_DATES = {
  "lixin-power-2026-07": ["2026/7/16"]
};

const MATCH_CONFIG = {
  "haya-medicine-2026-07": {
    titles: ["医药", "医药医疗", "创新药", "中药"],
    keywords: ["医药", "药", "创新药", "中药", "医疗", "疫苗", "原料药"]
  },
  "lixin-power-2026-07": {
    titles: ["电力", "电网", "电力/电网", "电力/储能", "电力/燃气轮机", "风电"],
    keywords: ["电力", "电网", "发电", "用电", "火电", "绿色电力", "虚拟电厂", "特高压", "能源", "风电"]
  },
  "chuanzhi-ai-2026-08": {
    titles: ["AI应用", "AI终端", "教育", "文化传媒"],
    keywords: ["AI应用", "AI", "AIGC", "教育", "传媒", "短剧", "影视", "软件", "智能体"]
  },
  "baihua-medicine-2026-08": {
    titles: ["医药", "医药医疗", "创新药", "中药"],
    keywords: ["医药", "药", "创新药", "中药", "医疗", "疫苗", "原料药"]
  },
  "wanxiang-agri-2026-09": {
    titles: ["大农业", "农业", "种业"],
    keywords: ["农业", "大农业", "种业", "转基因", "玉米", "农作物", "粮食", "种植"]
  },
  "datang-power-2026-05": {
    titles: ["电力", "电网", "电力/电网", "电力/储能", "电力/燃气轮机", "风电"],
    keywords: ["电力", "电网", "发电", "用电", "火电", "绿色电力", "虚拟电厂", "特高压", "燃气轮机", "风电"]
  },
  "shengyang-compute-2026-04": {
    titles: ["算力", "算力租赁", "算力产业链", "算力/半导体产业链", "液冷服务器", "液冷", "光通信"],
    keywords: ["算力", "数据中心", "液冷", "服务器", "光通信", "光模块", "云计算", "UPS"]
  },
  "jinyao-medicine-2026-04": {
    titles: ["医药", "医药医疗", "创新药", "中药"],
    keywords: ["医药", "药", "创新药", "中药", "医疗", "疫苗", "原料药", "BD"]
  },
  "huadian-power-2026-03": {
    titles: ["电力", "电网", "电力/电网", "电力/储能", "电力/燃气轮机", "风电"],
    keywords: ["电力", "电网", "发电", "用电", "火电", "绿色电力", "虚拟电厂", "特高压", "能源", "风电"]
  }
};

function loadArchive() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(CYCLES_FILE, "utf8"), sandbox, { filename: CYCLES_FILE });
  if (fs.existsSync(CYCLE_UPDATES_FILE)) {
    vm.runInContext(fs.readFileSync(CYCLE_UPDATES_FILE, "utf8"), sandbox, { filename: CYCLE_UPDATES_FILE });
  }
  return sandbox.window.LEADER_CYCLE_ARCHIVE;
}

function toApiDate(date) {
  return date.replaceAll("/", "-");
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function includesAny(text, needles) {
  const normalized = normalizeText(text).toLowerCase();
  return needles.some((needle) => normalized.includes(String(needle).toLowerCase()));
}

function exactTitleMatch(title, titles) {
  const cleanTitle = normalizeText(title);
  return titles.some((item) => cleanTitle === item || cleanTitle.includes(item) || item.includes(cleanTitle));
}

function titleMatchScore(title, titles) {
  const cleanTitle = normalizeText(title);
  let best = 0;
  titles.forEach((item, index) => {
    const needle = normalizeText(item);
    if (!needle) return;
    if (cleanTitle === needle) best = Math.max(best, 190 - index * 6);
    else if (cleanTitle.includes(needle) || needle.includes(cleanTitle)) best = Math.max(best, 170 - index * 6);
  });
  return best;
}

function scoreGroup(group, cycle, record) {
  const config = MATCH_CONFIG[cycle.id] || { titles: [cycle.sector, cycle.theme], keywords: [cycle.sector, cycle.theme] };
  let score = 0;
  const title = group.title || "";
  const haystack = `${group.title} ${group.head} ${group.catalyst}`;

  score += titleMatchScore(title, config.titles || []);
  if (includesAny(title, config.keywords || [])) score += 65;
  else if (includesAny(haystack, config.keywords || [])) score += 35;
  if (group.stocks.some((stock) => stockMatchesCycle(stock, cycle))) score += 45;
  if (includesAny(haystack, [cycle.sector, cycle.theme])) score += 25;
  if (title.includes("其他概念")) score -= 30;

  const raw = `${record.raw || ""} ${record.leaderMove || ""} ${record.core || ""}`;
  group.stocks.forEach((stock) => {
    if (stock.name && raw.includes(stock.name)) score += 8;
  });

  return score;
}

function stockMatchesCycle(stock, cycle) {
  const cycleCode = String(cycle.code || "").slice(0, 6);
  return stock.name === cycle.leader || (cycleCode && stock.code === cycleCode);
}

function findLeaderStock(groups, cycle) {
  for (const group of groups) {
    const stock = group.stocks.find((item) => stockMatchesCycle(item, cycle));
    if (stock) return { plate: group.title, stock };
  }
  return { plate: "", stock: null };
}

async function fetchDailyGroups(page, date) {
  const response = await page.request.post(SHORTX_ENDPOINT, {
    form: { type: "plate", date },
    headers: {
      Referer: SHORTX_SOURCE_URL,
      Origin: "http://duanxianxia.cn",
      "X-Requested-With": "XMLHttpRequest"
    }
  });

  if (!response.ok()) {
    throw new Error(`${date} request failed: ${response.status()} ${response.statusText()}`);
  }

  const payload = await response.json();
  if (payload.result !== "success" || !payload.html) {
    return [];
  }

  await page.setContent(`<main id="shortx-root">${payload.html}</main>`);
  return page.evaluate(() => {
    const cellText = (cell) => (cell ? cell.innerText.replace(/\s+/g, " ").trim() : "");
    const groups = [];

    document.querySelectorAll(".ztitem").forEach((item) => {
      const tableWrap = item.nextElementSibling;
      const rows = tableWrap
        ? Array.from(tableWrap.querySelectorAll("table tr")).filter((row) => row.querySelector("td:first-child .kline"))
        : [];
      const stockRows = rows.map((row) => {
        const cells = Array.from(row.cells);
        const reasonCell = cells[16];
        return {
          name: cellText(cells[0]),
          code: cellText(cells[1]),
          price: cellText(cells[2]),
          pct: cellText(cells[3]),
          type: cellText(cells[4]),
          board: cellText(cells[5]),
          streak: cellText(cells[6]),
          firstSeal: cellText(cells[7]),
          lastSeal: cellText(cells[8]),
          openCount: cellText(cells[9]),
          sealAmount: cellText(cells[10]),
          amount: cellText(cells[11]),
          turnover: cellText(cells[12]),
          floatCap: cellText(cells[13]),
          floatMarketCap: cellText(cells[14]),
          totalMarketCap: cellText(cells[15]),
          reason: reasonCell?.querySelector("span") ? cellText(reasonCell.querySelector("span")) : cellText(reasonCell),
          longhu: cellText(cells[17])
        };
      });

      const title = item.querySelector("b")?.innerText.trim() || "";
      const headText = item.innerText.replace(/\s+/g, " ").trim();
      const countText = item.querySelector(".ztnum div")?.innerText.trim() || String(stockRows.length);
      const catalyst = headText
        .replace(/\s*\d+\s*涨停\s*$/, "")
        .replace(new RegExp(`^${title}[：:]?`), "")
        .trim();

      groups.push({
        title,
        catalyst,
        head: headText,
        count: Number.parseInt(countText, 10) || stockRows.length,
        stocks: stockRows
      });
    });

    return groups;
  });
}

function selectGroup(groups, cycle, record) {
  const ranked = groups
    .map((group) => ({ group, score: scoreGroup(group, cycle, record) }))
    .sort((a, b) => b.score - a.score || b.group.count - a.group.count);

  const best = ranked[0];
  if (!best || best.score <= 0) {
    return {
      title: "未匹配",
      catalyst: "",
      count: 0,
      stocks: [],
      matchScore: 0,
      matchNote: "短线侠当日按概念分组中未匹配到该周期题材。"
    };
  }

  const config = MATCH_CONFIG[cycle.id] || { titles: [cycle.sector, cycle.theme], keywords: [cycle.sector, cycle.theme] };
  const hasTitleMatch = titleMatchScore(best.group.title, config.titles || []) > 0 || includesAny(best.group.title, config.keywords || []);
  const hasLeader = best.group.stocks.some((stock) => stockMatchesCycle(stock, cycle));
  const matchNote = hasTitleMatch && hasLeader
    ? "题材标题匹配，且分组内包含周期龙头。"
    : hasTitleMatch
      ? "按短线侠题材标题匹配。"
      : hasLeader
        ? "短线侠当日未出现对应板块标题，按周期龙头所在分组记录。"
        : "按题材同义词与原始复盘记录匹配。";

  return {
    ...best.group,
    matchScore: best.score,
    matchNote
  };
}

async function main() {
  const archive = loadArchive();
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  });
  const page = await browser.newPage();
  const dateCache = new Map();
  const output = {
    generatedAt: new Date().toISOString(),
    sourceName: "短线侠每日复盘-涨停复盘（按概念）",
    sourceUrl: SHORTX_SOURCE_URL,
    endpoint: SHORTX_ENDPOINT,
    cycles: {}
  };
  const summaryRows = [];

  for (const cycle of archive.cycles || []) {
    output.cycles[cycle.id] = {
      name: cycle.name,
      leader: cycle.leader,
      sector: cycle.sector,
      leaderHistory: {},
      records: {}
    };

    for (const record of cycle.records || []) {
      const apiDate = toApiDate(record.date);
      if (!dateCache.has(apiDate)) {
        const groups = await fetchDailyGroups(page, apiDate);
        dateCache.set(apiDate, groups);
      }

      const groups = dateCache.get(apiDate);
      const selected = selectGroup(groups, cycle, record);
      const leaderMatch = findLeaderStock(groups, cycle);
      output.cycles[cycle.id].records[record.date] = {
        date: record.date,
        sourceDate: apiDate,
        plate: selected.title,
        catalyst: selected.catalyst,
        count: selected.count,
        matchScore: selected.matchScore,
        matchNote: selected.matchNote,
        leaderPlate: leaderMatch.plate,
        leaderStock: leaderMatch.stock,
        stocks: selected.stocks
      };
      summaryRows.push({
        cycle: cycle.name,
        date: record.date,
        plate: selected.title,
        count: selected.count,
        score: selected.matchScore,
        leaderInGroup: selected.stocks.some((stock) => stockMatchesCycle(stock, cycle)) ? "Y" : "",
        leaderPlate: leaderMatch.plate,
        firstStocks: selected.stocks.slice(0, 3).map((stock) => `${stock.name} ${stock.firstSeal}`).join(" / ")
      });
    }

    for (const extraDate of EXTRA_LEADER_DATES[cycle.id] || []) {
      const apiDate = toApiDate(extraDate);
      if (!dateCache.has(apiDate)) {
        const groups = await fetchDailyGroups(page, apiDate);
        dateCache.set(apiDate, groups);
      }
      const leaderMatch = findLeaderStock(dateCache.get(apiDate), cycle);
      output.cycles[cycle.id].leaderHistory[extraDate] = {
        date: extraDate,
        sourceDate: apiDate,
        leaderPlate: leaderMatch.plate,
        leaderStock: leaderMatch.stock
      };
      summaryRows.push({
        cycle: `${cycle.name}（补链）`,
        date: extraDate,
        plate: leaderMatch.plate,
        count: leaderMatch.stock ? 1 : 0,
        score: "-",
        leaderInGroup: leaderMatch.stock ? "Y" : "",
        leaderPlate: leaderMatch.plate,
        firstStocks: leaderMatch.stock ? `${leaderMatch.stock.name} ${leaderMatch.stock.firstSeal}` : ""
      });
    }
  }

  await browser.close();
  fs.writeFileSync(
    OUTPUT_FILE,
    `window.LEADER_CYCLE_DAILY_LIMIT_UPS = ${JSON.stringify(output, null, 2)};\n`,
    "utf8"
  );
  console.table(summaryRows);
  console.log(`Wrote ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
