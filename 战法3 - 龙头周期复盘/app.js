const EXCLUDED_TITLE =
  "Seedance超小周期（2026/2/9 - 2026/2/13）- 技术革新硬逻辑 - 掌阅科技 风语筑";

let allCycles = [];
let filteredCycles = [];

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

const renderMetrics = () => {
  const leaders = allCycles.flatMap((cycle) => cycle.leaders || []).filter(Boolean);
  const timelineNodes = allCycles.reduce((sum, cycle) => sum + (cycle.timeline?.length || 0), 0);
  const insightNodes = allCycles.reduce((sum, cycle) => sum + (cycle.insights?.length || 0), 0);
  const metrics = [
    ["纳入周期", allCycles.length],
    ["排除周期", "1"],
    ["核心标的", new Set(leaders).size],
    ["规律总结", insightNodes],
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
    document.getElementById(event.target.value)?.scrollIntoView({ behavior: "smooth" });
  });

  const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  byId("toolbar-backtop").addEventListener("click", goTop);
  byId("floating-backtop").addEventListener("click", goTop);
  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("resize", updateScrollState);
};

const init = () => {
  allCycles = normalizeCycles(loadCycles());
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
