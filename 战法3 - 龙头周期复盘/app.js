const EXCLUDED_TITLE =
  "Seedance超小周期（2026/2/9 - 2026/2/13）- 技术革新硬逻辑 - 掌阅科技 风语筑";

let allCycles = [];
let filteredCycles = [];
let intradayChartsByCycle = {};

const byId = (id) => document.getElementById(id);
const formatIndex = (index) => String(index + 1).padStart(2, "0");

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const hashCode = (value) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

const slugify = (cycle, index) => cycle.id || `cycle-${formatIndex(index)}-${hashCode(cycle.title)}`;

const normalizeCycles = (cycles) =>
  cycles
    .filter((cycle) => cycle.title !== EXCLUDED_TITLE)
    .map((cycle) => ({
      leaders: [],
      tags: [],
      overview: [],
      insights: [],
      timeline: [],
      hierarchy: [],
      lessons: [],
      sections: [],
      ...cycle
    }));

const loadCycles = () => {
  if (Array.isArray(window.LONGTOU_CYCLES)) return window.LONGTOU_CYCLES;
  return [];
};

const loadIntradayCharts = () => {
  const charts = window.LONGTOU_INTRADAY?.chartsByCycle;
  return charts && typeof charts === "object" ? charts : {};
};

const renderMetrics = () => {
  const leaders = allCycles.flatMap((cycle) => cycle.leaders || []).filter(Boolean);
  const timelineNodes = allCycles.reduce((sum, cycle) => sum + (cycle.timeline?.length || 0), 0);
  const insightNodes = allCycles.reduce((sum, cycle) => sum + (cycle.insights?.length || 0), 0);
  const intradayNodes = Object.values(intradayChartsByCycle).reduce((sum, charts) => sum + (charts?.length || 0), 0);
  const metrics = [
    ["纳入周期", allCycles.length],
    ["排除周期", "1"],
    ["核心标的", new Set(leaders).size],
    ["规律总结", insightNodes],
    ["分时图", intradayNodes],
    ["时间节点", timelineNodes]
  ];

  byId("metrics").innerHTML = metrics
    .map(
      ([label, value]) => `
        <div>
          <dt>${escapeHtml(label)}</dt>
          <dd>${escapeHtml(value)}</dd>
        </div>
      `
    )
    .join("");
};

const renderFilter = () => {
  const filter = byId("stage-filter");
  const tags = [...new Set(allCycles.flatMap((cycle) => cycle.tags || []).filter(Boolean))];
  filter.innerHTML = [
    `<option value="all">全部周期</option>`,
    ...tags.map((tag) => `<option value="${escapeHtml(tag)}">${escapeHtml(tag)}</option>`)
  ].join("");
};

const renderToc = () => {
  const toc = byId("toc-list");
  const mobileSelect = byId("mobile-cycle-select");
  const chips = byId("cycle-chips");

  toc.innerHTML = filteredCycles
    .map((cycle, index) => {
      const id = slugify(cycle, index);
      return `
        <li>
          <a href="#${id}">
            <span>${formatIndex(index)}</span>
            <strong>${escapeHtml(cycle.shortTitle || cycle.title)}</strong>
            <small>${escapeHtml(cycle.dateRange || "时间待补")}</small>
          </a>
        </li>
      `;
    })
    .join("");

  mobileSelect.innerHTML = filteredCycles
    .map((cycle, index) => `<option value="${slugify(cycle, index)}">${escapeHtml(cycle.shortTitle || cycle.title)}</option>`)
    .join("");

  chips.innerHTML = filteredCycles
    .map((cycle, index) => `<a class="chip" href="#${slugify(cycle, index)}">${formatIndex(index)} ${escapeHtml(cycle.shortTitle || cycle.dateRange)}</a>`)
    .join("");
};

const renderTags = (tags = []) => {
  if (!tags.length) return "";
  return tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
};

const renderOverview = (items = []) => {
  if (!items.length) return `<p class="empty-note">概览待补充。</p>`;
  return `
    <div class="overview-grid">
      ${items
        .map(
          (item) => `
            <div class="overview-item">
              <dt>${escapeHtml(item.label)}</dt>
              <dd>${escapeHtml(item.value)}</dd>
            </div>
          `
        )
        .join("")}
    </div>
  `;
};

const renderInsightBody = (node) => {
  const text = node.text ? `<p>${escapeHtml(node.text)}</p>` : "";
  const children = (node.children || []).map(renderArticleBlock).join("");
  return `${text}${children}`;
};

const renderInsights = (items = []) => {
  if (!items.length) return `<p class="empty-note">周期规律总结待补充。</p>`;
  return `
    <div class="insight-grid">
      ${items
        .map(
          (item, index) => `
            <article class="insight-card">
              <div class="insight-card-head">
                <span>${formatIndex(index)}</span>
                <strong>${item.type === "quote" ? "核心规律" : "龙特点总结"}</strong>
              </div>
              <div class="article-copy">${renderInsightBody(item)}</div>
            </article>
          `
        )
        .join("")}
    </div>
  `;
};

const renderHierarchy = (rows = []) => {
  if (!rows.length) return `<p class="empty-note">龙头梯队待补充。</p>`;
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>角色</th>
            <th>标的</th>
            <th>地位 / 备注</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
                <tr>
                  <td>${escapeHtml(row.role)}</td>
                  <td>${escapeHtml(row.names)}</td>
                  <td>${escapeHtml(row.note)}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
};

const renderTimeline = (timeline = []) => {
  if (!timeline.length) return `<p class="empty-note">时间轴待补充。</p>`;
  return `
    <ol class="timeline">
      ${timeline
        .map(
          (item) => `
            <li>
              <time>${escapeHtml(item.date)}</time>
              <p>${escapeHtml(item.event)}</p>
            </li>
          `
        )
        .join("")}
    </ol>
  `;
};

const formatNumber = (value, digits = 2) => {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(digits) : "--";
};

const formatPct = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return "--";
  return `${number > 0 ? "+" : ""}${number.toFixed(2)}%`;
};

const makeChartPath = (points, width, height, padding) => {
  const prices = points.map((point) => Number(point.close)).filter(Number.isFinite);
  if (!prices.length) return "";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  return points
    .map((point, index) => {
      const x = padding.left + (points.length === 1 ? innerWidth / 2 : (index / (points.length - 1)) * innerWidth);
      const y = padding.top + (1 - (Number(point.close) - min) / range) * innerHeight;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
};

const makeVolumeBars = (points, width, height, padding) => {
  const volumes = points.map((point) => Number(point.volume)).filter(Number.isFinite);
  if (!volumes.length) return "";
  const maxVolume = Math.max(...volumes) || 1;
  const innerWidth = width - padding.left - padding.right;
  const barWidth = Math.max(1.8, innerWidth / points.length - 1);
  const baseY = height - padding.bottom;
  const maxBarHeight = 26;

  return points
    .map((point, index) => {
      const volume = Number(point.volume) || 0;
      const x = padding.left + (index / Math.max(1, points.length - 1)) * innerWidth - barWidth / 2;
      const barHeight = (volume / maxVolume) * maxBarHeight;
      return `<rect x="${x.toFixed(2)}" y="${(baseY - barHeight).toFixed(2)}" width="${barWidth.toFixed(2)}" height="${barHeight.toFixed(2)}" />`;
    })
    .join("");
};

const renderIntradayChart = (chart) => {
  const points = chart.points || [];
  if (!points.length) {
    return `
      <article class="intraday-card intraday-card-empty">
        <div class="intraday-head">
          <div>
            <h3>${escapeHtml(chart.stockName || "标的")}</h3>
            <p>${escapeHtml(chart.date || "日期待确认")} · ${escapeHtml(chart.code || "")}</p>
          </div>
        </div>
        <p class="empty-note">${escapeHtml(chart.message || "暂未抓到可用分时数据。")}</p>
      </article>
    `;
  }

  const width = 320;
  const height = 152;
  const padding = { top: 14, right: 12, bottom: 28, left: 12 };
  const first = points[0];
  const last = points[points.length - 1];
  const closes = points.map((point) => Number(point.close)).filter(Number.isFinite);
  const highs = points.map((point) => Number(point.high)).filter(Number.isFinite);
  const lows = points.map((point) => Number(point.low)).filter(Number.isFinite);
  const start = Number(first.close);
  const end = Number(last.close);
  const pct = start ? ((end - start) / start) * 100 : 0;
  const tone = pct >= 0 ? "up" : "down";
  const path = makeChartPath(points, width, height, padding);
  const bars = makeVolumeBars(points, width, height, padding);
  const high = Math.max(...highs);
  const low = Math.min(...lows);

  return `
    <article class="intraday-card ${tone}">
      <div class="intraday-head">
        <div>
          <h3>${escapeHtml(chart.stockName)} <span>${escapeHtml(chart.code)}</span></h3>
          <p>${escapeHtml(chart.date)} · ${escapeHtml(chart.label || "关键节点")} · ${escapeHtml(chart.resolutionLabel || chart.resolution || "分时")}</p>
        </div>
        <strong>${formatPct(pct)}</strong>
      </div>
      <svg class="intraday-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(chart.stockName)} ${escapeHtml(chart.date)} 分时走势">
        <line class="intraday-axis" x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" />
        <g class="intraday-volume">${bars}</g>
        <path class="intraday-line" d="${path}" />
      </svg>
      <div class="intraday-stats">
        <span>收 ${formatNumber(end)}</span>
        <span>高 ${formatNumber(high)}</span>
        <span>低 ${formatNumber(low)}</span>
      </div>
      <p class="intraday-note">${escapeHtml(chart.note || "")}</p>
    </article>
  `;
};

const renderIntraday = (cycle) => {
  const charts = intradayChartsByCycle[cycle.id] || [];
  if (!charts.length) return `<p class="empty-note">龙头分时待补充。</p>`;
  return `<div class="intraday-grid">${charts.map(renderIntradayChart).join("")}</div>`;
};

const renderList = (items = [], emptyText) => {
  if (!items.length) return `<p class="empty-note">${emptyText}</p>`;
  return `<ul class="note-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
};

const renderArticleBlock = (block) => {
  const children = (block.children || []).map(renderArticleBlock).join("");

  if (block.type === "heading") {
    const level = Math.min(Math.max(block.level || 2, 2), 4);
    return `<h${level} class="article-heading article-heading-${level}">${escapeHtml(block.text)}</h${level}>${children}`;
  }

  if (block.type === "toggle") {
    return `
      <details class="article-toggle">
        <summary>${escapeHtml(block.text || "展开")}</summary>
        <div>${children}</div>
      </details>
    `;
  }

  if (block.type === "callout" || block.type === "quote") {
    return `<div class="article-callout">${block.text ? `<p>${escapeHtml(block.text)}</p>` : ""}${children}</div>`;
  }

  if (block.type === "numbered_list" || block.type === "bulleted_list") {
    const tag = block.type === "numbered_list" ? "ol" : "ul";
    return `<${tag} class="article-list"><li>${escapeHtml(block.text)}${children}</li></${tag}>`;
  }

  if (block.type === "divider") {
    return `<hr class="article-divider" />`;
  }

  if (!block.text && !children) return "";
  return `<p>${escapeHtml(block.text)}</p>${children}`;
};

const renderSections = (sections = []) => {
  if (!sections.length) return `<p class="empty-note">正文待补充。</p>`;
  return sections.map(renderArticleBlock).join("");
};

const renderCycles = () => {
  const list = byId("cycle-list");
  if (!filteredCycles.length) {
    list.innerHTML = `<p class="empty-state">没有匹配的周期。</p>`;
    return;
  }

  list.innerHTML = filteredCycles
    .map((cycle, index) => {
      const id = slugify(cycle, index);
      const leaders = cycle.leaders?.length ? cycle.leaders.join(" / ") : "核心标的待确认";
      const defaultOpen = index < 2 ? "true" : "false";

      return `
        <article class="cycle-section${index >= 2 ? " collapsed" : ""}" id="${id}" data-cycle-title="${escapeHtml(cycle.shortTitle || cycle.title)}">
          <button class="cycle-toggle" type="button" aria-expanded="${defaultOpen}" aria-controls="${id}-body">
            <span class="cycle-number">${formatIndex(index)}</span>
            <span>
              <span class="cycle-date">${escapeHtml(cycle.dateRange || "时间待补")}</span>
              <span class="cycle-title">${escapeHtml(cycle.title)}</span>
            </span>
            <span class="toggle-mark">${index >= 2 ? "展开" : "收起"}</span>
          </button>

          <div class="cycle-body" id="${id}-body">
            <div class="cycle-meta">
              ${renderTags(cycle.tags)}
              <span>${escapeHtml(leaders)}</span>
            </div>
            <p class="cycle-summary">${escapeHtml(cycle.summary || "复盘摘要待补充。")}</p>

            <section class="content-block" id="${id}-overview">
              <h2>一屏概览</h2>
              ${renderOverview(cycle.overview)}
            </section>

            <section class="content-block" id="${id}-insights">
              <h2>龙特点与周期规律</h2>
              ${renderInsights(cycle.insights)}
            </section>

            <section class="content-block" id="${id}-intraday">
              <h2>龙头分时</h2>
              ${renderIntraday(cycle)}
            </section>

            <section class="content-block" id="${id}-timeline">
              <h2>时间轴</h2>
              ${renderTimeline(cycle.timeline)}
            </section>

            <section class="content-block" id="${id}-hierarchy">
              <h2>龙头与梯队</h2>
              ${renderHierarchy(cycle.hierarchy)}
            </section>

            <section class="content-block" id="${id}-lessons">
              <h2>复盘结论</h2>
              ${renderList(cycle.lessons, "复盘结论待补充。")}
            </section>

            <section class="content-block" id="${id}-article">
              <h2>原文整理</h2>
              <div class="article-copy">${renderSections(cycle.sections)}</div>
            </section>
          </div>
        </article>
      `;
    })
    .join("");
};

const applyFilters = () => {
  const query = byId("search-input").value.trim().toLowerCase();
  const tag = byId("stage-filter").value;
  filteredCycles = allCycles.filter((cycle) => {
    const haystack = [
      cycle.title,
      cycle.shortTitle,
      cycle.dateRange,
      cycle.summary,
      ...(cycle.tags || []),
      ...(cycle.leaders || []),
      ...((intradayChartsByCycle[cycle.id] || []).flatMap((chart) => [chart.stockName, chart.code, chart.date, chart.label])),
      ...((cycle.insights || []).flatMap((node) => [node.text || "", ...((node.children || []).map((child) => child.text || ""))])),
      ...(cycle.lessons || [])
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesTag = tag === "all" || (cycle.tags || []).includes(tag);
    return matchesQuery && matchesTag;
  });
  renderToc();
  renderCycles();
  bindCycleToggles();
  updateScrollState();
};

const bindCycleToggles = () => {
  document.querySelectorAll(".cycle-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      button.closest(".cycle-section").classList.toggle("collapsed", expanded);
      button.querySelector(".toggle-mark").textContent = expanded ? "展开" : "收起";
      updateScrollState();
    });
  });
};

const expandCycleSection = (section) => {
  if (!section?.classList.contains("collapsed")) return;
  const button = section.querySelector(".cycle-toggle");
  section.classList.remove("collapsed");
  if (button) {
    button.setAttribute("aria-expanded", "true");
    const mark = button.querySelector(".toggle-mark");
    if (mark) mark.textContent = "收起";
  }
};

const scrollInstantTo = (top) => {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, Math.max(0, top));
  root.style.scrollBehavior = previousBehavior;
};

const jumpToTarget = (hash) => {
  if (!hash || hash === "#") return;
  if (hash === "#top") {
    scrollInstantTo(0);
    history.replaceState(null, "", hash);
    return;
  }

  const target = document.getElementById(hash.slice(1));
  if (!target) return;
  expandCycleSection(target.closest(".cycle-section"));
  history.replaceState(null, "", hash);
  requestAnimationFrame(() => {
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    scrollInstantTo(top);
    updateScrollState();
  });
};

const updateRightAnchors = (section) => {
  const name = byId("active-cycle-name");
  const anchors = byId("section-anchors");
  if (!section) {
    name.textContent = "待选择";
    anchors.innerHTML = "";
    return;
  }
  name.textContent = section.dataset.cycleTitle || "当前周期";
  anchors.innerHTML = [
    ["overview", "一屏概览"],
    ["insights", "龙特点规律"],
    ["intraday", "龙头分时"],
    ["timeline", "时间轴"],
    ["hierarchy", "龙头梯队"],
    ["lessons", "复盘结论"],
    ["article", "原文整理"]
  ]
    .map(([suffix, label]) => `<a href="#${section.id}-${suffix}">${label}</a>`)
    .join("");
};

const updateScrollState = () => {
  const progress = byId("progress");
  const floatBacktop = byId("floating-backtop");
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  floatBacktop.classList.toggle("visible", window.scrollY > 520);

  const sections = Array.from(document.querySelectorAll(".cycle-section"));
  const links = Array.from(document.querySelectorAll("#toc-list a"));
  const threshold = window.scrollY + 110;
  let current = sections[0] || null;
  sections.forEach((section) => {
    if (section.offsetTop <= threshold) current = section;
  });
  links.forEach((link) => link.classList.toggle("active", current && link.hash === `#${current.id}`));
  updateRightAnchors(current);
};

const bindControls = () => {
  byId("search-input").addEventListener("input", applyFilters);
  byId("stage-filter").addEventListener("change", applyFilters);
  byId("mobile-cycle-select").addEventListener("change", (event) => {
    jumpToTarget(`#${event.target.value}`);
  });

  const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  byId("toolbar-backtop").addEventListener("click", goTop);
  byId("floating-backtop").addEventListener("click", goTop);
  document.addEventListener("click", (event) => {
    const anchor = event.target.closest("a[href^='#']");
    if (!anchor?.closest("#toc-list, #cycle-chips, #section-anchors, .brand")) return;
    event.preventDefault();
    jumpToTarget(anchor.getAttribute("href"));
  });
  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("resize", updateScrollState);
};

const init = () => {
  allCycles = normalizeCycles(loadCycles());
  intradayChartsByCycle = loadIntradayCharts();
  filteredCycles = [...allCycles];
  renderMetrics();
  renderFilter();
  renderToc();
  renderCycles();
  bindControls();
  bindCycleToggles();
  updateScrollState();
};

init();
