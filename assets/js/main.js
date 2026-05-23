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
    body: "只在主线明确、真龙已被市场选择时提高仓位。弱转强优质机会多出现在个股逆势抗跌分歧日，次日确认转强即可进场，首次转强盈亏比最优。",
    bg: "#f5faf7",
    border: "rgba(7, 135, 93, 0.24)"
  },
  relay: {
    title: "无龙：轻仓试错，做低位1进2",
    body: "没有高位总龙时，只做三种允许场景：冰点后新题材共振、分歧活口反包、硬逻辑趋势股回踩。晋级2板无龙头属性减半，三板依规减半，四板分批减仓离场。",
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
  backtop.classList.toggle("is-visible", scrollTop > 520);
}

function updateToc() {
  const marker = window.scrollY + 120;
  let activeId = sections[0]?.id;

  for (const section of sections) {
    if (section.offsetTop <= marker) {
      activeId = section.id;
    }
  }

  tocLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
  });
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
    compareTable.classList.remove("mode-dragon", "mode-relay", "mode-defense");
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

backtop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  updateProgress();
  updateToc();
}, { passive: true });

window.addEventListener("resize", updateProgress);

updateProgress();
updateToc();
