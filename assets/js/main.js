const progress = document.querySelector("#progress");
const backtop = document.querySelector("#backtop");
const tocLinks = [...document.querySelectorAll(".toc-link")];
const sections = tocLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const stateCards = [...document.querySelectorAll(".state-card")];
const modePanel = document.querySelector("#modePanel");
const compareTable = document.querySelector("#compareTable");

const modeCopy = {
  dragon: {
    title: "有龙：聚焦真龙，做主升浪",
    body: "只在主线明确、真龙已被市场选择时提高仓位。情绪连板题材看高度和卡位，趋势题材看抗跌与修复；三板确认真龙后汰弱留强。",
    bg: "#f5faf7",
    border: "rgba(7, 135, 93, 0.24)"
  },
  institution: {
    title: "趋势：做业绩披露窗口里的均线主升",
    body: "机构趋势按先大盘、再板块、再个股、再买点执行；业绩披露窗口是重点观察期。主买点只做大阳线回踩一半、回踩5日线、强势突破近期前高后确认；卖出买前先设止损，破位看收盘价，强趋势用三日移动或平台底部止盈，逻辑变化无脑止盈。",
    bg: "#f5f8ff",
    border: "rgba(56, 103, 214, 0.24)"
  },
  relay: {
    title: "无龙：轻仓试错，做低位1进2",
    body: "没有高位总龙时，只做三种允许场景：冰点后新题材共振、分歧活口反包、硬逻辑趋势股回踩。只盯板块前排，晋级2板无龙头属性减半。",
    bg: "#f3fbfb",
    border: "rgba(0, 140, 140, 0.24)"
  },
  defense: {
    title: "退潮：停止幻想，空仓防守",
    body: "高潮次日、竞价崩盘、涨停指数走弱、题材电风扇轮动，都优先清仓或空仓。没有合格机会时，空仓就是正确动作。",
    bg: "#fff7f7",
    border: "rgba(223, 44, 44, 0.24)"
  }
};

function updateProgress() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? scrollTop / scrollable : 0;
  progress.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
  backtop?.classList.toggle("is-visible", scrollTop > 520);
}

function updateToc() {
  let activeId = sections[0]?.id;
  let maxVisible = 0;

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    const visible = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
    if (visible > maxVisible) {
      maxVisible = visible;
      activeId = section.id;
    }
  }

  tocLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
  });
}

function queueTocUpdate() {
  updateToc();
  requestAnimationFrame(updateToc);
  window.setTimeout(updateToc, 80);
  window.setTimeout(updateToc, 220);
}

function alignHashTarget() {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - 88;
  window.scrollTo({ top, behavior: "auto" });
  queueTocUpdate();
}

function setMode(mode) {
  const copy = modeCopy[mode];
  if (!copy || !modePanel) return;

  stateCards.forEach((card) => {
    const isActive = card.dataset.mode === mode;
    card.classList.toggle("is-active", isActive);
    card.setAttribute("aria-pressed", String(isActive));
  });

  if (compareTable) {
    compareTable.classList.remove("mode-dragon", "mode-institution", "mode-relay", "mode-defense");
    compareTable.classList.add(`mode-${mode}`);
  }

  modePanel.style.background = copy.bg;
  modePanel.style.borderColor = copy.border;
  modePanel.querySelector("h3").textContent = copy.title;
  modePanel.querySelector("p").textContent = copy.body;
}

stateCards.forEach((card) => {
  card.addEventListener("click", () => setMode(card.dataset.mode));
});

backtop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  updateProgress();
  updateToc();
}, { passive: true });

window.addEventListener("resize", () => {
  updateProgress();
  queueTocUpdate();
});
window.addEventListener("hashchange", alignHashTarget);

updateProgress();
queueTocUpdate();
window.setTimeout(alignHashTarget, 120);
