const stateCopies = {
  earn: {
    tag: "允许动作",
    title: "赚钱效应明确时，围绕抱团高标和最小阻力方向。",
    body: "看涨停原因、封板质量、炸板反馈和隔日溢价，确认资金是在做高标抱团、高低切，还是做新题材试错。",
    items: ["优先观察强者是否继续给溢价。", "板块内梯队是否完整，核心是否被市场选择。", "没有明确信号时，高位不主观做切换。"],
    tone: "earn"
  },
  loss: {
    tag: "禁止冲动",
    title: "亏钱效应扩散时，先看风险，不用个股幻想替代市场信号。",
    body: "炸板率上升、核心低开、失败票核按钮，说明资金风险偏好下降。此时高位穿越很难。",
    items: ["优先降低仓位或空仓观察。", "不做亏后报复性买入。", "等待新的右侧修复信号。"],
    tone: "loss"
  },
  repair: {
    tag: "开仓窗口",
    title: "情绪修复右侧出现时，才允许寻找模式内买点。",
    body: "右侧修复不是主观判断，而是由核心票反馈、题材承接、炸板修复和隔日溢价共同确认。",
    items: ["目标必须属于当前赚钱效应方向。", "买点仍然限定为三板以上回封。", "仓位先保守，再随确认加大。"],
    tone: "repair"
  },
  negative: {
    tag: "防守优先",
    title: "高位出现负反馈时，不轻易博弈个股穿越。",
    body: "高位核按钮会改变资金偏好，资金更容易选择高低切或直接防守。阻力最小方向往往不在原高标。",
    items: ["不主观做高位切换。", "不拿单一强票对抗周期。", "先看低位是否有新共振。"],
    tone: "negative"
  }
};

const tabs = [...document.querySelectorAll(".market-tab")];
const stateBoard = document.querySelector("#stateBoard");
const stateTag = document.querySelector("#stateTag");
const stateTitle = document.querySelector("#stateTitle");
const stateBody = document.querySelector("#stateBody");
const stateList = document.querySelector("#stateList");

function setState(name) {
  const copy = stateCopies[name] || stateCopies.earn;
  tabs.forEach((tab) => {
    const active = tab.dataset.state === name;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  stateTag.textContent = copy.tag;
  stateTitle.textContent = copy.title;
  stateBody.textContent = copy.body;
  stateList.innerHTML = copy.items.map((item) => `<li>${item}</li>`).join("");

  stateBoard.style.background = copy.tone === "loss" || copy.tone === "negative" ? "#fff7f7" : "#f5faf7";
  stateBoard.style.borderColor = copy.tone === "loss" || copy.tone === "negative"
    ? "rgba(223, 44, 44, 0.24)"
    : "rgba(7, 135, 93, 0.22)";
  stateTag.style.color = copy.tone === "loss" || copy.tone === "negative" ? "var(--red)" : "var(--green)";
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setState(tab.dataset.state));
});

const checks = [...document.querySelectorAll(".gate-check")];
const gateResult = document.querySelector("#gateResult");

function updateGate() {
  const count = checks.filter((check) => check.checked).length;
  const ready = count === checks.length;
  gateResult.classList.toggle("is-ready", ready);
  gateResult.querySelector("strong").textContent = ready ? "可开仓" : count >= 3 ? "只观察" : "禁止开仓";
  gateResult.querySelector("span").textContent = ready
    ? "五项全部通过，仍按固定买点和仓位纪律执行。"
    : `已通过 ${count}/${checks.length} 项，至少通过 5 项才允许开仓。`;
}

checks.forEach((check) => {
  check.addEventListener("change", updateGate);
});

updateGate();
