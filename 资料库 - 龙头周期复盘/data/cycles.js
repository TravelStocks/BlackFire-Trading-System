const makeCycleRecord = (date, weekday, phase, direction, intensity, board, note, extra = {}) => ({
  date,
  shortDate: date.replace("2026/", ""),
  weekday,
  phase,
  direction,
  intensity,
  board,
  keySignals: extra.keySignals || [note],
  leaderMove: extra.leaderMove || note,
  core: extra.core || note,
  ladder: extra.ladder || `短线侠连板天梯：${board}`,
  risk: extra.risk || "锚定龙头反馈和后排负反馈强度。",
  raw: extra.raw || `${phase}\n${note}\n短线侠连板天梯：${board}`
});

window.LEADER_CYCLE_ARCHIVE = {
  generatedAt: "2026-09-06",
  source: {
    file: "7.26 题材节奏表.xlsx",
    workbookPath: "C:/Users/Administrator/Documents/xwechat_files/wxid_8bxd1e705gqw22_69b9/msg/file/2026-09/7.26 题材节奏表.xlsx",
    sheet: "Sheet1",
    range: "DD243:DI243"
  },
  patterns: {
    thesis:
      "要么高潮启动后直接延续强势，形成强上强；要么分化后走出超强回流，完成题材持续性的确认。二者出现其一，才有资格从轮动题材升级为龙头周期。",
    rules: [
      {
        title: "启动次日看超预期",
        text: "高潮启动只是入场券，第二个交易日必须看到前排继续顶强、后排仍有首板或二板扩散；如果启动后马上缩量熄火，就仍然按轮动处理。"
      },
      {
        title: "分化日不是结束日",
        text: "真正的确认点常出现在第一次分化之后，龙头如果能弱转强、爆量回封或被板块反推上板，题材预期会从小周期抬升到主升周期。"
      },
      {
        title: "连续回流决定高度",
        text: "强回流之后还能继续强回流，说明资金不是做一天修复，而是在给题材加持续性溢价；这类结构最容易走出六板以上的标杆。"
      },
      {
        title: "吹哨先看中位和辨识度",
        text: "龙头断板前，中位票大面、辨识度尾盘跳水、批量炸板往往先出现；这些信号比板块当天涨停数量更重要。"
      },
      {
        title: "高位滞涨后看高低切",
        text: "龙头进监管或高位滞涨时，若低位首板和二板重新批量出现，周期可能进入补涨和高低切；若低位也没有承接，退潮概率更高。"
      },
      {
        title: "龙头负反馈定退潮",
        text: "周期龙跌停、连续加速失败或断板后次日不能修复，才是主升结束的硬信号；断板后的反核更适合按退潮反弹看，不能自动视为二波。"
      }
    ]
  },
  cycles: [
    {
      id: "haya-medicine-2026-07",
      name: "哈药股份周期",
      leader: "哈药股份",
      code: "600664.SH",
      sector: "医药",
      theme: "低位医药趋势",
      dateRange: "2026/7/10-2026/7/17",
      startDate: "2026-07-10",
      endDate: "2026-07-17",
      tradingDays: 6,
      status: "已完成",
      source: {
        file: "7.19 题材节奏表.xlsx",
        workbookPath: "C:/Users/Administrator/Documents/xwechat_files/wxid_8bxd1e705gqw22_69b9/msg/file/2026-09/7.19 题材节奏表.xlsx",
        sheet: "Sheet1",
        range: "CY241:DD241"
      },
      rhythm: "强回流启动 -> 弱回流延续 -> 弱分化 -> 再次强回流 -> 分化吹哨 -> 大分歧",
      oneLine:
        "医药从强回流启动进入低位趋势，哈药股份在弱分化中换手三板接过身位，四板弱转强带动板块主升，随后美诺华吹哨、后排负反馈扩大，7/17进入大分歧。",
      tags: ["医药", "低位趋势", "哈药股份", "弱转强", "美诺华吹哨", "大分歧"],
      limitBoard: {
        sourceName: "短线侠连板天梯",
        sourceUrl: "http://duanxianxia.cn/web/lianban/",
        range: "2026-07-10 - 2026-07-17",
        sourceNote: "2026/9/6 抓取；晋级标记来自短线侠原表",
        summary: "短线侠天梯显示哈药股份从7/10首板推进到7/16五板，7/17未进入连板天梯，对应题材表的断板大分歧。",
        items: [
          { date: "2026/7/10", board: "1板", status: "晋级标记", statusTone: "up", note: "连板链条起点，次日晋级。" },
          { date: "2026/7/13", board: "2板", status: "晋级标记", statusTone: "up", note: "弱回流延续中继续换手晋级。" },
          { date: "2026/7/14", board: "3板", status: "晋级标记", statusTone: "up", note: "分化中带动板块回流，完成换龙确认。" },
          { date: "2026/7/15", board: "4板", status: "晋级标记", statusTone: "up", note: "弱转强秒板，题材主升确认。" },
          { date: "2026/7/16", board: "5板", status: "无晋级标记", statusTone: "warn", note: "T字回封但辨识度吹哨，次日断板。" },
          { date: "2026/7/17", board: "断板", status: "题材表记录", statusTone: "down", note: "短线侠天梯未收录；题材表记录为捞尾盘未封板。" }
        ]
      },
      phaseLine: [
        { date: "7/10", title: "高潮启动", tone: "up", note: "立方制药二板，哈药股份秒板，医药批量首板。" },
        { date: "7/13", title: "弱回流延续", tone: "up", note: "立方三板，哈药和联环二板，万邦医药趋势加速。" },
        { date: "7/14", title: "弱分化换龙", tone: "warn", note: "立方冲高回落，哈药三板带动医药回流。" },
        { date: "7/15", title: "主升确认", tone: "up", note: "哈药四板秒板弱转强，板块再次强回流。" },
        { date: "7/16", title: "分化吹哨", tone: "down", note: "哈药T字回封，但美诺华跳水，后排负反馈出现。" },
        { date: "7/17", title: "大分歧", tone: "down", note: "哈药断板未封，美诺华跌停带崩，主升基本结束。" }
      ],
      records: [
        {
          date: "2026/7/10",
          shortDate: "7/10",
          weekday: "周五",
          phase: "强回流 - 高潮启动",
          direction: "up",
          intensity: "启动",
          board: "立方二板",
          keySignals: ["立方制药换手二板", "哈药股份秒板", "美诺华、双鹭药业首板"],
          leaderMove: "哈药股份秒板",
          core: "立方制药换手二板，哈药股份秒板",
          ladder: "美诺华、双鹭药业首板；板块批量首板",
          risk: "板块有趋势味道，先看低位趋势能否延续",
          raw:
            "医药：强回流 - 高潮启动↑\n身位：立方制药换手二板\n核心：哈药药业秒板\n辨识度：美诺华双鹭药业首板\n\n板块批量首板，有趋势的味道"
        },
        {
          date: "2026/7/13",
          shortDate: "7/13",
          weekday: "周一",
          phase: "弱回流延续",
          direction: "up",
          intensity: "延续",
          board: "哈药二板",
          keySignals: ["立方制药换手三板", "哈药股份和联环药业换手二板", "万邦医药强趋势加速"],
          leaderMove: "哈药股份换手二板",
          core: "哈药股份和联环药业换手二板",
          ladder: "立方制药三板；板块批量首板；万邦医药强趋势加速",
          risk: "低位最强趋势",
          raw:
            "医药：弱回流延续↑\n身位：立方制药换手三板\n核心：哈药股份和联环药业换手二板\n板块批量首板\n弹性趋势：万邦医药强趋势加速\n\n低位最强趋势"
        },
        {
          date: "2026/7/14",
          shortDate: "7/14",
          weekday: "周二",
          phase: "弱分化",
          direction: "warn",
          intensity: "换龙",
          board: "哈药三板",
          keySignals: ["立方制药冲高回落", "哈药股份换手三板带动板块回流", "科技回流时医药没有批量炸板"],
          leaderMove: "哈药股份换手三板，带动板块回流",
          core: "万邦药业进监管后负反馈，水下震荡",
          ladder: "前身位立方制药冲高回落；板块批量首板",
          risk: "医药未被科技回流批量跷跷板，是盘面转暖信号",
          raw:
            "医药：弱分化↑\n前身位：立方制药冲高回落\n身位：哈药股份换手三板，带动板块回流\n强趋势：万邦药业进监管后负反馈，水下震荡\n板块批量首板\n\n亮点是下午科技回流医药并没有批量炸板跷跷板，这是盘面转暖的信号，总算不是极端拉扯行情了"
        },
        {
          date: "2026/7/15",
          shortDate: "7/15",
          weekday: "周三",
          phase: "再次强回流",
          direction: "up",
          intensity: "主升",
          board: "哈药四板",
          keySignals: ["哈药股份换手四板秒板弱转强", "九安医疗、昭衍新药、蓝帆医疗三个一字开", "万邦药业无惧监管尾盘封板"],
          leaderMove: "哈药股份换手四板秒板弱转强，带动板块强回流",
          core: "迪哲医药和人民同泰换手二板；万邦药业尾盘封板；药明康德趋势向上",
          ladder: "昭衍新药、蓝帆医疗换手回封；美诺华炸板回封；板块批量首板",
          risk: "可定义为板块主升二，次日看分化",
          raw:
            "医药：再次强回流↑\n身位：哈药股份换手四板秒板弱转强带动板块强回流\n情绪：开盘九安医疗、昭衍新药和蓝帆医疗三个一字板，后两个换手回封\n核心：迪哲医药和人民同泰换手二板\n强趋势核心：万邦药业无惧监管强趋势向上，尾盘封板\n辨识度：美诺华炸板回封\n中军：药明康德趋势向上\n板块批量首板\n\n低位最强强趋势，可以定义为板块主升二，明天看分化"
        },
        {
          date: "2026/7/16",
          shortDate: "7/16",
          weekday: "周四",
          phase: "分化",
          direction: "down",
          intensity: "吹哨",
          board: "哈药五板",
          keySignals: ["哈药股份T字板换手回封", "美诺华下午跳水吹哨", "后排负反馈出现"],
          leaderMove: "哈药股份T字板换手回封",
          core: "万邦医药强趋势向上延续；药明康德水下震荡",
          ladder: "永安药业、南华生物、海南海药换手二板涨停；批量首板",
          risk: "低位最强趋势开始出现负反馈，次日更谨慎，锚定哈药反馈",
          raw:
            "医药：分化↓\n板块龙：哈药股份T字板换手回封\n二板：永安药业、南华生物、海南海药换手二板涨停\n强趋势：万邦医药强趋势向上延续\n辨识度：美诺华下午跳水吹哨\n中军：药明康德水下震荡\n批量首板，后排有负反馈了\n\n低位最强趋势，今天出现负反馈了，明天需要更谨慎，锚定哈药的反馈即可"
        },
        {
          date: "2026/7/17",
          shortDate: "7/17",
          weekday: "周五",
          phase: "大分歧",
          direction: "down",
          intensity: "退潮",
          board: "断板",
          keySignals: ["哈药股份断板捞尾盘未封板", "美诺华跌停带崩板块", "板块后排批量跌停"],
          leaderMove: "哈药股份断板捞尾盘未封板",
          core: "万邦医药小红小绿震荡；珍宝岛换手反包板",
          ladder: "珍宝岛换手反包板；板块后排批量跌停",
          risk: "降低预期，主升基本结束",
          raw:
            "医药：大分歧↓\n板块龙：哈药股份断板捞尾盘未封板\n二板：珍宝岛换手反包板\n强趋势：万邦医药小红小绿震荡\n辨识度：美诺华昨天吹哨，周五跌停带崩板块\n板块后排批量跌停\n\n降低预期，主升基本结束"
        }
      ]
    },
    {
      id: "lixin-power-2026-07",
      name: "立新能源周期",
      leader: "立新能源",
      code: "001258.SZ",
      sector: "电力",
      theme: "高温用电负荷新高",
      dateRange: "2026/7/17-2026/7/24",
      startDate: "2026-07-17",
      endDate: "2026-07-24",
      tradingDays: 6,
      status: "已完成",
      source: {
        file: "7.26 题材节奏表.xlsx",
        workbookPath: "C:/Users/Administrator/Documents/xwechat_files/wxid_8bxd1e705gqw22_69b9/msg/file/2026-09/7.26 题材节奏表.xlsx",
        sheet: "Sheet1",
        range: "DD243:DI243"
      },
      rhythm: "轮动爆发 -> 连续加强 -> 分化 -> 强回流 -> 高潮延续 -> 大分歧",
      oneLine:
        "电力在高温和用电负荷新高催化下启动，立新能源从二板露头到四板分化验龙，五板强回流确认，七板后进入大分歧。",
      tags: ["电力", "新题材卡位", "分化验龙", "强回流", "大分歧"],
      limitBoard: {
        sourceName: "短线侠连板天梯",
        sourceUrl: "http://duanxianxia.cn/web/lianban/",
        range: "2026-07-16 - 2026-07-24",
        sourceNote: "2026/9/6 抓取；7/24为题材表补充断板记录",
        summary: "短线侠天梯显示立新能源从7/16首板推进到7/23六板；题材观察从7/17二板开始，7/24未进入连板天梯，对应大分歧。",
        items: [
          { date: "2026/7/16", board: "1板", status: "晋级标记", statusTone: "up", note: "连板链条起点，次日晋级。" },
          { date: "2026/7/17", board: "2板", status: "晋级标记", statusTone: "up", note: "周期观察起点，换手二板占身位。" },
          { date: "2026/7/20", board: "3板", status: "晋级标记", statusTone: "up", note: "连续加强，预期从三天小题材提高。" },
          { date: "2026/7/21", board: "4板", status: "晋级标记", statusTone: "up", note: "分化验龙，后排开始出现负反馈。" },
          { date: "2026/7/22", board: "5板", status: "晋级标记", statusTone: "up", note: "极致弱转强，带动板块强回流。" },
          { date: "2026/7/23", board: "6板", status: "无晋级标记", statusTone: "warn", note: "强回流延续，但华银电力尾盘吹哨。" },
          { date: "2026/7/24", board: "断板", status: "题材表记录", statusTone: "down", note: "短线侠天梯未收录；题材表记录午后情绪带崩。" }
        ]
      },
      phaseLine: [
        { date: "7/17", title: "轮动爆发", tone: "up", note: "题材从低位启动，立新能源二板占身位。" },
        { date: "7/20", title: "连续加强", tone: "up", note: "立新能源三板，二板梯队批量跟随。" },
        { date: "7/21", title: "分化验龙", tone: "down", note: "后排负反馈出现，重点转向龙头能否晋级。" },
        { date: "7/22", title: "强回流", tone: "up", note: "立新能源极致弱转强秒板，板块回流。" },
        { date: "7/23", title: "高潮吹哨", tone: "warn", note: "30+涨停，但华银电力尾盘跳水提示风险。" },
        { date: "7/24", title: "大分歧", tone: "down", note: "立新能源午后被情绪带崩，后排批量跌停。" }
      ],
      records: [
        {
          date: "2026/7/17",
          shortDate: "7/17",
          weekday: "周五",
          phase: "轮动爆发日",
          direction: "up",
          intensity: "启动",
          board: "二板",
          keySignals: ["全球多地高温持续", "全国用电负荷再创新高", "华银电力秒板带动"],
          leaderMove: "立新能源换手二板",
          core: "湖南发展强势反包板",
          ladder: "板块批量首板",
          risk: "先按三天小题材观察",
          raw:
            "电力：轮动爆发日↑全球多地高温持续；全国用电负荷再创新高\n身位：立新能源换手二板\n核心：湖南发展强势反包板\n日内情绪：华银电力秒板涨停带动板块\n板块批量首板\n\n目前先看三天小题材"
        },
        {
          date: "2026/7/20",
          shortDate: "7/20",
          weekday: "周一",
          phase: "连续加强",
          direction: "up",
          intensity: "升维",
          board: "三板",
          keySignals: ["立新能源爆量三板", "湖南发展反包二板", "后排二板梯队扩散"],
          leaderMove: "立新能源换手爆量三板",
          core: "湖南发展强趋势延续向上，反包二板",
          ladder: "乐山电力、华银电力、桂冠电力、深南电换手二板；板块批量首板，老龙华电和大唐涨停",
          risk: "预期从三天小题材提高到五天题材",
          raw:
            "电力：连续加强↑\n身位：立新能源换手爆量三板\n核心：湖南发展强趋势延续向上，反包二板\n批量二板：乐山电力、华银电力、桂冠电力和深南电换手二板\n板块批量首板，老龙华电和大唐涨停\n\n超预期走势，后续锚定立新的走势即可，预期提高到五天题材"
        },
        {
          date: "2026/7/21",
          shortDate: "7/21",
          weekday: "周二",
          phase: "分化",
          direction: "down",
          intensity: "验龙",
          board: "四板",
          keySignals: ["立新能源爆量四板", "华银电力换手三板", "后排小红小绿震荡"],
          leaderMove: "立新能源换手爆量四板",
          core: "华银电力换手三板",
          ladder: "板块后排出现负反馈",
          risk: "次日大分歧预期，重点看立新能源能否晋级",
          raw:
            "电力：分化↓\n板块龙：立新能源换手爆量四板\n核心：华银电力换手三板\n板块后排出现负反馈，小红小绿震荡\n\n明天大分歧预期，重点看立新能源能否晋级"
        },
        {
          date: "2026/7/22",
          shortDate: "7/22",
          weekday: "周三",
          phase: "强回流",
          direction: "up",
          intensity: "确认",
          board: "五板",
          keySignals: ["立新能源极致弱转强秒板", "华银电力尾盘四板", "反包板批量出现"],
          leaderMove: "立新能源极致弱转强秒板带动板块强回流",
          core: "华银电力下午尾盘换手四板",
          ladder: "华电辽能、乐山电力、华电能源反包板；板块批量首板",
          risk: "目前低位最强题材，继续锚定立新走势",
          raw:
            "电力：强回流↑\n板块龙：立新能源极致弱转强秒板带动板块强回流\n核心：华银电力下午尾盘换手四板\n反包板：华电辽能、乐山电力和华电能源反包板\n板块批量首板\n\n后续继续锚定立新走势即可，目前低位最强题材"
        },
        {
          date: "2026/7/23",
          shortDate: "7/23",
          weekday: "周四",
          phase: "强回流延续",
          direction: "warn",
          intensity: "高潮",
          board: "六板",
          keySignals: ["30+涨停", "立新能源超预期回封", "华银电力尾盘跳水吹哨"],
          leaderMove: "立新能源继续超预期回封，带动板块强回流向上",
          core: "新能股份一字板；华银电力尾盘跳水吹哨",
          ladder:
            "长缆科技换手三板；中电电机、新中港秒板二板，华电辽能换手二板；顺钠股份和积成电子秒板助攻",
          risk: "明天分化预期，需要非常小心",
          raw:
            "电力：强回流延续↑30+涨停\n板块龙：立新能源继续超预期回封，带动板块强回流向上↑\n情绪：新能股份一字板\n核心：华银电力尾盘跳水吹哨，明天需要非常小心\n三板：长缆科技换手三板\n批量二板：中电电机、新中港秒板二板，华电辽能换手二板\n板块批量首板\n顺钠股份和积成电子秒板助攻\n\n明天分化预期，继续锚定立新的走势即可"
        },
        {
          date: "2026/7/24",
          shortDate: "7/24",
          weekday: "周五",
          phase: "大分歧",
          direction: "down",
          intensity: "退潮",
          board: "七板断板",
          keySignals: ["立新能源午后被带崩进监管", "长缆科技T字四板", "后排批量跌停"],
          leaderMove: "立新能源上午被反推上板，午后情绪太差带崩进监管",
          core: "长缆科技T字四板，新能股份T字三板",
          ladder: "顺钠股份一字二板；汉缆股份、中电鑫龙、太阳电缆换手二板",
          risk: "板块后排批量跌停，周期进入大分歧",
          raw:
            "电力：大分歧↓\n板块龙：立新能源上午被反推上板，午后情绪太差带崩进监管\n身位：长缆科技T字四板\n核心：新能股份T字三板\n批量二板：顺钠股份一字板，汉缆股份、中电鑫龙和太阳电缆换手二板\n板块后排批量跌停\n\n继续锚定立新的走势即可"
        }
      ]
    },
    {
      id: "chuanzhi-ai-2026-08",
      name: "传智教育周期",
      leader: "传智教育",
      code: "003032.SZ",
      sector: "AI应用",
      theme: "AI应用连板主升",
      dateRange: "2026/7/27-2026/8/6",
      startDate: "2026-07-27",
      endDate: "2026-08-06",
      tradingDays: 9,
      status: "已完成",
      source: { file: "用户本轮节奏总结 + 短线侠连板天梯", sheet: "节奏序列", range: "2026/7/27-2026/8/6" },
      rhythm: "高潮启动 - 强 -> 强势弱延续 - 更强 -> 分化 - 弱强 -> 分歧 - 弱 -> 超强回流 - 更强 -> 分歧 - 弱强 -> 强回流 - 强 -> 分歧 - 弱强 -> 分歧延续 - 弱",
      oneLine:
        "传智教育从7/27首板一路推进到8/5八板，前四板放量不足，五板完成二次全放量；周期中多次分化和分歧都能被回流修复，8/6进入分歧延续确认风险。",
      tags: ["AI应用", "传智教育", "八板高度", "两次超强回流", "分化修复"],
      limitBoard: {
        sourceName: "短线侠连板天梯",
        sourceUrl: "http://duanxianxia.cn/web/lianban/",
        range: "2026-07-27 - 2026-08-05",
        sourceNote: "2026/9/6 抓取；晋级标记来自短线侠原表",
        summary: "短线侠天梯显示传智教育从7/27首板推进到8/5八板，7/27-8/4连续带晋级标记，8/5为八板但无后续晋级标记。",
        items: [
          { date: "2026/7/27", board: "1板", status: "晋级标记", statusTone: "up", note: "连板链条起点。" },
          { date: "2026/7/28", board: "2板", status: "晋级标记", statusTone: "up", note: "启动后延续，具备观察价值。" },
          { date: "2026/7/29", board: "3板", status: "晋级标记", statusTone: "up", note: "分化后仍能晋级。" },
          { date: "2026/7/30", board: "4板", status: "晋级标记", statusTone: "up", note: "第一次超强回流确认。" },
          { date: "2026/7/31", board: "5板", status: "晋级标记", statusTone: "up", note: "高位继续打开空间。" },
          { date: "2026/8/3", board: "6板", status: "晋级标记", statusTone: "up", note: "节后继续晋级，持续性增强。" },
          { date: "2026/8/4", board: "7板", status: "晋级标记", statusTone: "up", note: "第二次超强回流后再晋级。" },
          { date: "2026/8/5", board: "8板", status: "无晋级标记", statusTone: "warn", note: "高度打满后进入分歧延续观察。" }
        ]
      },
      phaseLine: [
        { date: "7/27", title: "高潮启动", tone: "up", note: "首板起链，AI应用进入周期观察。" },
        { date: "7/28", title: "强势弱延续", tone: "up", note: "二板确认延续，强度偏超预期。" },
        { date: "7/29", title: "分化", tone: "warn", note: "题材分化但龙头继续晋级，强度为弱强。" },
        { date: "7/30", title: "分歧", tone: "down", note: "四板位置仍处在分歧消化。" },
        { date: "7/31", title: "超强回流", tone: "up", note: "五板全放量，完成二次放量确认。" },
        { date: "8/3", title: "分歧", tone: "warn", note: "六板缩量一字后进入高位分歧观察。" },
        { date: "8/4", title: "强回流", tone: "up", note: "七板回流，强度回到正向。" },
        { date: "8/5", title: "分歧", tone: "warn", note: "八板高位分歧，仍属弱强。" },
        { date: "8/6", title: "分歧延续", tone: "down", note: "断板/炸板后进入分歧延续，风险确认。" }
      ],
      records: [
        makeCycleRecord("2026/7/27", "周一", "高潮启动", "up", "强", "1板", "传智教育进入短线侠首板，AI应用周期开始观察。", { risk: "启动后重点看次日是否强势延续。" }),
        makeCycleRecord("2026/7/28", "周二", "强势弱延续", "up", "更强", "2板", "二板继续晋级，启动后完成第一天延续。", { risk: "只要龙头不弱，题材预期可抬升。" }),
        makeCycleRecord("2026/7/29", "周三", "分化", "warn", "弱强", "3板", "题材进入分化，传智教育仍处在连板链条。", { risk: "分化日看龙头是否能继续承接。" }),
        makeCycleRecord("2026/7/30", "周四", "分歧", "down", "弱", "4板", "四板位置仍处在分歧消化，等待后续是否能做超强回流。", { risk: "分歧日要看龙头是否率先上板。" }),
        makeCycleRecord("2026/7/31", "周五", "超强回流", "up", "更强", "5板", "五板全放量后继续晋级，完成二次放量确认。", { risk: "五板后开始进入高度压力区。" }),
        makeCycleRecord("2026/8/3", "周一", "分歧", "warn", "弱强", "6板", "六板缩量后进入高位分歧观察。", { risk: "缩量一字后留意次日换手压力。" }),
        makeCycleRecord("2026/8/4", "周二", "强回流", "up", "强", "7板", "七板继续晋级，板块回流强度回到正向。", { risk: "高位分歧阶段看中位是否先杀。" }),
        makeCycleRecord("2026/8/5", "周三", "分歧", "warn", "弱强", "8板", "短线侠记录八板但无后续晋级标记，高位分歧加重。", { risk: "高度打满后不再按新启动处理。" }),
        makeCycleRecord("2026/8/6", "周四", "分歧延续", "down", "弱", "断板", "八板后断板/炸板，周期进入分歧延续和风险确认。", { risk: "高位爆量后重点防退潮确认。" })
      ]
    },
    {
      id: "baihua-medicine-2026-08",
      name: "百花医药周期",
      leader: "百花医药",
      code: "600721.SH",
      sector: "医药",
      theme: "医药高低切",
      dateRange: "2026/8/4-2026/8/12",
      startDate: "2026-08-04",
      endDate: "2026-08-12",
      tradingDays: 7,
      status: "已完成",
      source: { file: "用户本轮节奏总结 + 短线侠连板天梯", sheet: "节奏序列", range: "2026/8/4-2026/8/12" },
      rhythm: "弱启动 -> 强势弱延续 -> 弱分化换龙 -> 分歧延续 -> 大分歧延续 -> 内部强回流高低切",
      oneLine:
        "百花医药不是标准强启动，而是弱启动后逐步强起来；周期核心在弱分化中完成龙头切换，末端靠内部强回流和高低切维持强度。",
      tags: ["医药", "百花医药", "弱启动", "龙头切换", "高低切", "七板"],
      limitBoard: {
        sourceName: "短线侠连板天梯",
        sourceUrl: "http://duanxianxia.cn/web/lianban/",
        range: "2026-08-04 - 2026-08-12",
        sourceNote: "2026/9/6 抓取；晋级标记来自短线侠原表",
        summary: "短线侠天梯显示百花医药从8/4首板推进到8/12七板，8/4-8/11连续带晋级标记，8/12为七板但无后续晋级标记。",
        items: [
          { date: "2026/8/4", board: "1板", status: "晋级标记", statusTone: "up", note: "弱启动首板。" },
          { date: "2026/8/5", board: "2板", status: "晋级标记", statusTone: "up", note: "弱启动后强势延续。" },
          { date: "2026/8/6", board: "3板", status: "晋级标记", statusTone: "up", note: "弱分化中完成换龙观察。" },
          { date: "2026/8/7", board: "4板", status: "晋级标记", statusTone: "up", note: "分歧延续但高度继续抬升。" },
          { date: "2026/8/10", board: "5板", status: "晋级标记", statusTone: "up", note: "大分歧延续中继续晋级。" },
          { date: "2026/8/11", board: "6板", status: "晋级标记", statusTone: "up", note: "内部强回流，高低切继续。" },
          { date: "2026/8/12", board: "7板", status: "无晋级标记", statusTone: "warn", note: "七板后转向高位风险观察。" }
        ]
      },
      phaseLine: [
        { date: "8/4", title: "弱启动", tone: "warn", note: "强度不如高潮启动，但进入首板链条。" },
        { date: "8/5", title: "强势弱延续", tone: "up", note: "弱启动后仍能二板，预期抬升。" },
        { date: "8/6", title: "弱分化换龙", tone: "warn", note: "分化中龙头切换，百花站上身位。" },
        { date: "8/7", title: "分歧延续", tone: "down", note: "题材分歧仍未直接退潮。" },
        { date: "8/10", title: "大分歧延续", tone: "down", note: "高位承压但龙头继续晋级。" },
        { date: "8/11", title: "高低切", tone: "up", note: "内部强回流，资金向低位补涨扩散。" },
        { date: "8/12", title: "高度尾声", tone: "warn", note: "七板后无晋级标记，进入兑现观察。" }
      ],
      records: [
        makeCycleRecord("2026/8/4", "周二", "弱启动", "warn", "弱强", "1板", "百花医药首板，弱启动但进入周期观察。", { risk: "弱启动先降低预期，等延续确认。" }),
        makeCycleRecord("2026/8/5", "周三", "强势弱延续", "up", "更强", "2板", "二板晋级，弱启动后走出强势延续。"),
        makeCycleRecord("2026/8/6", "周四", "弱分化", "warn", "强", "3板", "分化中百花医药继续晋级，出现龙头切换信号。"),
        makeCycleRecord("2026/8/7", "周五", "分歧延续", "down", "弱", "4板", "题材分歧延续，龙头高度仍向上。"),
        makeCycleRecord("2026/8/10", "周一", "大分歧延续", "down", "更弱", "5板", "高位压力加大，仍保留连板身位。"),
        makeCycleRecord("2026/8/11", "周二", "内部强回流高低切", "up", "更强", "6板", "内部强回流，低位补涨和高低切是关键观察点。"),
        makeCycleRecord("2026/8/12", "周三", "高度尾声", "warn", "高位", "7板", "短线侠记录七板但无后续晋级标记。", { risk: "七板后重点防高位兑现。" })
      ]
    },
    {
      id: "wanxiang-agri-2026-09",
      name: "万向德农周期",
      leader: "万向德农",
      code: "600371.SH",
      sector: "农业",
      theme: "农业连板主升",
      dateRange: "2026/8/25-2026/9/1",
      startDate: "2026-08-25",
      endDate: "2026-09-01",
      tradingDays: 6,
      status: "已完成",
      source: { file: "用户本轮节奏总结 + 短线侠连板天梯", sheet: "节奏序列", range: "2026/8/25-2026/9/1" },
      rhythm: "高潮启动 -> 强势弱延续 -> 大分化 -> 超强回流 -> 加速延续 -> 大分歧",
      oneLine:
        "万向德农先在8/18-8/19试错二板失败，8/25重新首板后走出六板主链；周期关键在大分化后能否超强回流，最终9/1六板无晋级标记进入大分歧。",
      tags: ["农业", "万向德农", "六板", "试错后再启动", "超强回流"],
      limitBoard: {
        sourceName: "短线侠连板天梯",
        sourceUrl: "http://duanxianxia.cn/web/lianban/",
        range: "2026-08-18 - 2026-09-01",
        sourceNote: "2026/9/6 抓取；主链取8/25-9/1",
        summary: "短线侠天梯显示万向德农8/18-8/19有一次二板试错，8/25重新首板后连续晋级到9/1六板。",
        items: [
          { date: "2026/8/18", board: "1板", status: "晋级标记", statusTone: "warn", note: "前置试错首板。" },
          { date: "2026/8/19", board: "2板", status: "无晋级标记", statusTone: "down", note: "试错二板失败，不计入主链。" },
          { date: "2026/8/25", board: "1板", status: "晋级标记", statusTone: "up", note: "主链重新启动。" },
          { date: "2026/8/26", board: "2板", status: "晋级标记", statusTone: "up", note: "启动后强势延续。" },
          { date: "2026/8/27", board: "3板", status: "晋级标记", statusTone: "up", note: "大分化中仍晋级。" },
          { date: "2026/8/28", board: "4板", status: "晋级标记", statusTone: "up", note: "超强回流确认。" },
          { date: "2026/8/31", board: "5板", status: "晋级标记", statusTone: "up", note: "回流后继续加速。" },
          { date: "2026/9/1", board: "6板", status: "无晋级标记", statusTone: "warn", note: "六板后进入大分歧观察。" }
        ]
      },
      phaseLine: [
        { date: "8/25", title: "高潮启动", tone: "up", note: "重新首板，农业主链启动。" },
        { date: "8/26", title: "强势弱延续", tone: "up", note: "二板延续，强度抬升。" },
        { date: "8/27", title: "大分化", tone: "down", note: "分化考验中继续晋级。" },
        { date: "8/28", title: "超强回流", tone: "up", note: "四板确认持续性。" },
        { date: "8/31", title: "加速延续", tone: "up", note: "五板继续打开高度。" },
        { date: "9/1", title: "大分歧", tone: "down", note: "六板后无晋级标记，进入退潮观察。" }
      ],
      records: [
        makeCycleRecord("2026/8/25", "周二", "高潮启动", "up", "强", "1板", "万向德农重新首板，农业主链启动。"),
        makeCycleRecord("2026/8/26", "周三", "强势弱延续", "up", "更强", "2板", "二板继续晋级，启动后延续成立。"),
        makeCycleRecord("2026/8/27", "周四", "大分化", "down", "更弱", "3板", "大分化中龙头仍晋级，进入验龙。"),
        makeCycleRecord("2026/8/28", "周五", "超强回流", "up", "更强", "4板", "分化后超强回流，周期持续性确认。"),
        makeCycleRecord("2026/8/31", "周一", "加速延续", "up", "更强", "5板", "回流后继续加速，题材高度抬升。"),
        makeCycleRecord("2026/9/1", "周二", "大分歧", "down", "更弱", "6板", "短线侠记录六板但无后续晋级标记。", { risk: "六板后注意农业板块补跌。" })
      ]
    },
    {
      id: "datang-power-2026-05",
      name: "大唐发电周期",
      leader: "大唐发电",
      code: "601991.SH",
      sector: "电力",
      theme: "电力强回流",
      dateRange: "2026/5/6-2026/5/14",
      startDate: "2026-05-06",
      endDate: "2026-05-14",
      tradingDays: 7,
      status: "已完成",
      source: {
        file: "7.19 题材节奏表.xlsx",
        workbookPath: "C:/Users/Administrator/Documents/xwechat_files/wxid_8bxd1e705gqw22_69b9/msg/file/2026-09/7.19 题材节奏表.xlsx",
        sheet: "Sheet1",
        range: "BD198:BJ198"
      },
      rhythm: "高潮启动 -> 强势延续 -> 大分化 -> 强回流 -> 强势延续 -> 强势延续 -> 大分歧",
      oneLine:
        "大唐发电5/6首板后连续推进到5/13六板，5/8经历分化，5/11强回流确认，5/12-5/13继续延续，5/14连续加速失败进入大分歧。",
      tags: ["电力", "大唐发电", "六板", "强回流确认", "连续加速失败"],
      limitBoard: {
        sourceName: "短线侠连板天梯",
        sourceUrl: "http://duanxianxia.cn/web/lianban/",
        range: "2026-05-06 - 2026-05-14",
        sourceNote: "2026/9/6 抓取；5/14为题材表补充断板记录",
        summary: "短线侠天梯显示大唐发电5/6首板到5/13六板连续晋级，5/14未进入天梯，题材表记录为连续加速失败。",
        items: [
          { date: "2026/5/6", board: "1板", status: "晋级标记", statusTone: "up", note: "T字板带动电力回流。" },
          { date: "2026/5/7", board: "2板", status: "晋级标记", statusTone: "up", note: "换手二板秒板。" },
          { date: "2026/5/8", board: "3板", status: "晋级标记", statusTone: "warn", note: "T字三板，板块分化。" },
          { date: "2026/5/11", board: "4板", status: "晋级标记", statusTone: "up", note: "强回流确认。" },
          { date: "2026/5/12", board: "5板", status: "晋级标记", statusTone: "up", note: "超预期五板。" },
          { date: "2026/5/13", board: "6板", status: "无晋级标记", statusTone: "warn", note: "弱转强秒板后进入高度压力。" },
          { date: "2026/5/14", board: "断板", status: "题材表记录", statusTone: "down", note: "连续加速失败，板块大分歧。" }
        ]
      },
      phaseLine: [
        { date: "5/6", title: "高潮启动", tone: "up", note: "T字首板带动板块回流。" },
        { date: "5/7", title: "强势延续", tone: "up", note: "换手二板秒板，题材强势。" },
        { date: "5/8", title: "大分化", tone: "down", note: "三板晋级但板块轮动分化。" },
        { date: "5/11", title: "强回流", tone: "up", note: "四板带动板块批量首板。" },
        { date: "5/12", title: "强势延续", tone: "up", note: "五板继续强回流延续。" },
        { date: "5/13", title: "再延续", tone: "warn", note: "六板弱转强，提示次日分歧。" },
        { date: "5/14", title: "大分歧", tone: "down", note: "连续加速失败，回到轮动。" }
      ],
      records: [
        makeCycleRecord("2026/5/6", "周三", "中回流", "up", "更强", "1板", "大唐发电T字板带动电力回流；前龙华电辽能卡科技分歧。", { raw: "电力：中回流↑\n情绪：大唐发电T字板带动板块回流\n首板：节能风电、晶科科技等\n前龙：华电辽能继续卡科技分歧回流\n\n轮动预期" }),
        makeCycleRecord("2026/5/7", "周四", "强回流", "up", "更强", "2板", "大唐发电换手二板秒板，华电辽能继续卡位分歧首板。", { raw: "电力：强回流↑\n情绪：大唐发电换手二板秒板\n辨识度：华电辽能继续卡位分歧首板\n大连热电换手二板\n4个首板\n\n强势轮动预期" }),
        makeCycleRecord("2026/5/8", "周五", "分化", "down", "更弱", "3板", "大唐发电T字晋级三板，华电辽能冲高炸板回落。", { raw: "电力：分化↓\n情绪：大唐发电T字晋级三板\n辨识度：华电辽能冲高炸板回落\n\n轮动预期，一般的题材回流三天都是冲高S点" }),
        makeCycleRecord("2026/5/11", "周一", "中回流", "up", "强", "4板", "大唐发电四板带动板块强回流，华电辽能再度反包。", { raw: "电力：中回流↑\n板块龙：大唐发电晋级四板带动板块强回流\n辨识度：华电辽能再度反包板\n板块批量首板\n\n锚定大唐发电的节奏即可，大唐结束板块短期见顶预期" }),
        makeCycleRecord("2026/5/12", "周二", "强回流延续", "up", "强", "5板", "大唐发电超预期五板，华电辽能反包二板。", { raw: "电网：强回流延续↑\n板块龙：大唐发电超预期上板五板，带动板块强回流\n辨识度：华电辽能强势反包二板\n板块再次批量首板，中位没有晋级个股\n\n重视前排辨识度" }),
        makeCycleRecord("2026/5/13", "周三", "强回流", "up", "更强", "6板", "大唐发电弱转强秒板，韶能、通达、晋控、汉缆批量秒板晋级。", { raw: "电力：强回流↑\n板块龙：大唐发电弱转强秒板带动板块强回流延续\n辨识度：华电辽能跟随换手反包三板\n情绪：万控智造一字板\n核心：韶能、通达、晋控、汉缆批量秒板晋级\n板块批量首板\n\n锚定大唐发电即可，明天如果大唐加速需要小心盘中分歧" }),
        makeCycleRecord("2026/5/14", "周四", "大分歧", "down", "更弱", "断板", "大唐发电连续加速失败，华电辽能冲高回落，后排水下震荡。", { raw: "电力：大分歧↓\n板块龙：大唐发电连续加速失败\n辨识度：华电辽能冲高回落\n后排基本都是水下震荡\n\n回到轮动板块中，又没有锚定了" })
      ]
    },
    {
      id: "shengyang-compute-2026-04",
      name: "圣阳股份周期",
      leader: "圣阳股份",
      code: "002580.SZ",
      sector: "算力",
      theme: "算力轮动主升",
      dateRange: "2026/4/9-2026/4/21",
      startDate: "2026-04-09",
      endDate: "2026-04-21",
      tradingDays: 9,
      status: "已完成",
      source: {
        file: "7.19 题材节奏表.xlsx",
        workbookPath: "C:/Users/Administrator/Documents/xwechat_files/wxid_8bxd1e705gqw22_69b9/msg/file/2026-09/7.19 题材节奏表.xlsx",
        sheet: "Sheet1",
        range: "AM174:AU174"
      },
      rhythm: "高潮启动 -> 分化 -> 超强回流 -> 分化 -> 超强回流 -> 分歧 -> 分歧延续",
      oneLine:
        "圣阳股份从4/9首板推进到4/17七板，4/13后逐渐从混乱轮动里卡成最高标，4/16-4/20强势延续，4/21低开跌停确认情绪主升结束。",
      tags: ["算力", "圣阳股份", "七板", "混乱轮动", "最高标", "跌停确认"],
      limitBoard: {
        sourceName: "短线侠连板天梯",
        sourceUrl: "http://duanxianxia.cn/web/lianban/",
        range: "2026-04-09 - 2026-04-21",
        sourceNote: "2026/9/6 抓取；4/20-4/21为题材表补充记录",
        summary: "短线侠天梯显示圣阳股份4/9首板到4/17七板连续晋级；4/20题材表记录秒板后尾盘炸板爆量，4/21跌停。",
        items: [
          { date: "2026/4/9", board: "1板", status: "晋级标记", statusTone: "up", note: "连板链条起点。" },
          { date: "2026/4/10", board: "2板", status: "晋级标记", statusTone: "up", note: "液冷/算力辨识度延续。" },
          { date: "2026/4/13", board: "3板", status: "晋级标记", statusTone: "up", note: "修复中晋级。" },
          { date: "2026/4/14", board: "4板", status: "晋级标记", statusTone: "warn", note: "大烂板晋级，轮动仍混乱。" },
          { date: "2026/4/15", board: "5板", status: "晋级标记", statusTone: "up", note: "卡位成为最高标。" },
          { date: "2026/4/16", board: "6板", status: "晋级标记", statusTone: "up", note: "加速晋级，日内最强板块。" },
          { date: "2026/4/17", board: "7板", status: "无晋级标记", statusTone: "warn", note: "高开上板补量后进入高位压力。" },
          { date: "2026/4/20", board: "炸板", status: "题材表记录", statusTone: "warn", note: "秒板后尾盘炸板爆量。" },
          { date: "2026/4/21", board: "跌停", status: "题材表记录", statusTone: "down", note: "低开不及预期跌停，主升结束。" }
        ]
      },
      phaseLine: [
        { date: "4/9", title: "前置分歧", tone: "down", note: "算力大分歧，圣阳首板起链。" },
        { date: "4/10", title: "分歧延续", tone: "down", note: "二板延续但题材仍弱。" },
        { date: "4/13", title: "超强回流", tone: "up", note: "修复中三板晋级。" },
        { date: "4/14", title: "分化", tone: "warn", note: "大烂板四板，板块中位熄火。" },
        { date: "4/15", title: "超强回流", tone: "up", note: "卡成最高标，反包二板批量出现。" },
        { date: "4/16", title: "强势延续", tone: "up", note: "六板加速，算力日内最强。" },
        { date: "4/17", title: "分歧", tone: "warn", note: "七板补量，中位继续跟随。" },
        { date: "4/20", title: "分歧延续", tone: "warn", note: "尾盘炸板爆量，吹哨。" },
        { date: "4/21", title: "大分歧", tone: "down", note: "跌停确认主升结束。" }
      ],
      records: [
        makeCycleRecord("2026/4/9", "周四", "大分歧", "down", "弱", "1板", "算力大分歧，圣阳股份在短线侠天梯形成首板。", { raw: "算力：大分歧干进ICU↓\n身位：中安科炸板大面\n板块基本都是小红小绿震荡" }),
        makeCycleRecord("2026/4/10", "周五", "分歧延续", "down", "弱", "2板", "短线侠记录圣阳股份二板，题材表为算力分歧延续。", { raw: "算力：分歧延续↓\n液冷：圣阳股份换手二板，弱趋势预期" }),
        makeCycleRecord("2026/4/13", "周一", "中修复", "up", "强", "3板", "圣阳股份换手三板晋级，中安科强势反包。", { raw: "算力：中修复↑\n身位：圣阳股份换手三板晋级\n辨识度：中安科强势反包板\n低位基本都是小红小绿震荡，其他是超跌反弹首板\n\n混乱的弱趋势" }),
        makeCycleRecord("2026/4/14", "周二", "继续轮动", "warn", "弱", "4板", "圣阳股份大烂板四板，板块中位又全熄火。", { raw: "算力：继续轮动→\n身位：圣阳股份大烂板晋级四板\n弹性：协创数据秒板涨停\n核心：京泉华秒板涨停\n辨识度：利通电子弱转强上板\n板块中位又全熄火，批量炸板\n\n混乱的弱趋势" }),
        makeCycleRecord("2026/4/15", "周三", "强势轮动", "up", "更强", "5板", "圣阳股份卡位成为最高标，反包二板批量出现。", { raw: "算力：强势轮动↑\n身位：圣阳股份卡位成为最高标\n核心：奥尼电子换手二板\n板块批量反包二板：利通电子、中嘉博创和长源东谷反包\n老辨识度：豫能控股涨停首板\n新弹性：奥尼电子弹性二板超预期\n\n极度混乱的板块，轮动" }),
        makeCycleRecord("2026/4/16", "周四", "强势延续", "up", "更强", "6板", "圣阳股份加速六板，批量首板爆发，日内最强。", { raw: "算力：强势延续↑\n板块龙：圣阳股份加速晋级六板，概念王，目前先当做算力板块看\n核心：盛视科技换手三板\n弹性强趋势：宏景科技弹性趋势加速\n辨识度：美利云高位平台首板\n批量首板爆发，日内最强板块\n\n继续强势轮动" }),
        makeCycleRecord("2026/4/17", "周五", "强势延续", "up", "强", "7板", "圣阳股份高开上板补量，中位盛视科技四板。", { raw: "算力：强势延续↑有龙头就是强\n板块龙：圣阳股份高开上板补量晋级\n中位：盛视科技换手四板\n批量换手二板：品高股份、华升股份和福鞍股份\n辨识度：利通电子换手反包\n真视通炸板大面，近期竞价加单都是不及预期\n\n板块强势延续" }),
        makeCycleRecord("2026/4/20", "周一", "强势延续", "warn", "弱", "炸板", "圣阳股份秒板后尾盘炸板爆量，吹哨信号出现。", { raw: "算力：强势延续↑\n板块龙：圣阳股份秒板涨停，带动板块继续高潮，下午被航天拉扯炸板温和放量，尾盘炸板爆量\n最强小弟：华升股份秒板晋级3板\n核心：合力泰秒板二板\n低位批量首板\n\n继续锚定圣阳爆量即可" }),
        makeCycleRecord("2026/4/21", "周二", "大分歧", "down", "弱", "跌停", "圣阳股份低开不及预期跌停，情绪主升结束。", { raw: "算力：大分歧↓\n板块龙：圣阳股份低开不及预期跌停\n最强小弟：华升股份炸板跳水大面\n板块基本全绿\n\n情绪主升结束" })
      ]
    },
    {
      id: "jinyao-medicine-2026-04",
      name: "津药药业周期",
      leader: "津药药业",
      code: "600488.SH",
      sector: "医药",
      theme: "医药穿越补涨",
      dateRange: "2026/3/27-2026/4/8",
      startDate: "2026-03-27",
      endDate: "2026-04-08",
      tradingDays: 8,
      status: "已完成",
      source: {
        file: "7.19 题材节奏表.xlsx",
        workbookPath: "C:/Users/Administrator/Documents/xwechat_files/wxid_8bxd1e705gqw22_69b9/msg/file/2026-09/7.19 题材节奏表.xlsx",
        sheet: "Sheet1",
        range: "AE185:AL185"
      },
      rhythm: "高潮启动 -> 分化 -> 龙头切换 -> 超强回流 -> 强势延续 -> 分歧 -> 强回流 -> 大分歧",
      oneLine:
        "津药药业在医药高低切中从3/27首板推到4/7七板，3/31分化后4/1-4/2连续回流，4/7渡劫回封后4/8抗监管失败，确认主升结束。",
      tags: ["医药", "津药药业", "七板", "龙头切换", "穿越", "监管失败"],
      limitBoard: {
        sourceName: "短线侠连板天梯",
        sourceUrl: "http://duanxianxia.cn/web/lianban/",
        range: "2026-03-27 - 2026-04-08",
        sourceNote: "2026/9/6 抓取；4/8为题材表补充断板记录",
        summary: "短线侠天梯显示津药药业3/27首板到4/7七板连续晋级；4/8未进入天梯，题材表记录为炸板跳水大面。",
        items: [
          { date: "2026/3/27", board: "1板", status: "晋级标记", statusTone: "up", note: "医药高低切中起链。" },
          { date: "2026/3/30", board: "2板", status: "晋级标记", statusTone: "up", note: "二板核心，继续加速。" },
          { date: "2026/3/31", board: "3板", status: "晋级标记", statusTone: "warn", note: "分化中成为活口。" },
          { date: "2026/4/1", board: "4板", status: "晋级标记", statusTone: "up", note: "强回流，身位加速。" },
          { date: "2026/4/2", board: "5板", status: "晋级标记", statusTone: "up", note: "强回流延续，一字板。" },
          { date: "2026/4/3", board: "6板", status: "晋级标记", statusTone: "warn", note: "大分歧中站稳六板。" },
          { date: "2026/4/7", board: "7板", status: "无晋级标记", statusTone: "warn", note: "顶住分歧回封，次日进监管。" },
          { date: "2026/4/8", board: "断板", status: "题材表记录", statusTone: "down", note: "炸板跳水大面，抗监管失败。" }
        ]
      },
      phaseLine: [
        { date: "3/27", title: "高潮启动", tone: "up", note: "BD出海逻辑强势延续，津药首板。" },
        { date: "3/30", title: "强势延续", tone: "up", note: "二板核心，医药高低切最强。" },
        { date: "3/31", title: "分化换龙", tone: "warn", note: "美诺华分化，津药成为活口。" },
        { date: "4/1", title: "超强回流", tone: "up", note: "四板加速，医药穿越退潮。" },
        { date: "4/2", title: "强势延续", tone: "up", note: "五板一字，低位题材确认。" },
        { date: "4/3", title: "分歧", tone: "warn", note: "大分歧中站稳六板。" },
        { date: "4/7", title: "强回流", tone: "up", note: "顶住分歧后炸板回封。" },
        { date: "4/8", title: "大分歧", tone: "down", note: "监管失败，板块基本结束。" }
      ],
      records: [
        makeCycleRecord("2026/3/27", "周五", "强势延续", "up", "强", "1板", "BD出海逻辑强势延续，津药药业首板起链。", { raw: "医药：BD出海逻辑，强势延续↑\n板块龙：美诺华换手晋级四板\n核心：万邦德强势反包二板\n弹性：舒泰神换手弹性首板\n板块批量首板\n\n超预期走势，后续先看趋势预期" }),
        makeCycleRecord("2026/3/30", "周一", "连续强势", "up", "更强", "2板", "津药药业与双鹭、联环换手二板晋级。", { raw: "医药：连续强势三天，高低切最强题材↑\n板块龙：美诺华秒板涨停，带动板块继续加速\n情绪：东诚药业一字板\n二板核心：双鹭药业、津药药业、联环药业换手晋级二板\n辨识度：九安医疗切题材回到医药板块" }),
        makeCycleRecord("2026/3/31", "周二", "分化", "warn", "弱", "3板", "美诺华低开低走，津药药业换手三板成为板块活口。", { raw: "医药:分化→\n板块龙：美诺华低开低走水下震荡\n弹性：舒泰神红盘震荡\n板块活口：津药药业换手三板\n板块四个首板\n\n明天日内分歧接回流预期" }),
        makeCycleRecord("2026/4/1", "周三", "强回流", "up", "更强", "4板", "津药药业加速四板，医药成为穿越退潮的低位题材。", { raw: "医药：强回流↑\n板块新龙：万邦德强势表态穿越\n身位：津药药业加速四板\n强趋势：九安医疗断板反包向上\n前核心：美诺华跌停深水捞起来\n\n最强低位题材，市场地位需要重视" }),
        makeCycleRecord("2026/4/2", "周四", "强回流延续", "up", "强", "5板", "津药药业继续一字五板，医药基本确认穿越。", { raw: "医药：强回流延续↑\n板块新龙：万邦德监管压制震荡\n身位：津药药业继续一字板\n新情绪：重药控股一字板\n核心：美诺华强势反包炸板回落震荡\n\n最强低位题材，基本可以确认穿越出来" }),
        makeCycleRecord("2026/4/3", "周五", "大分歧", "warn", "弱", "6板", "津药药业秒板站稳六板，板块需要下周继续表态。", { raw: "医药：大分歧↓\n板块新龙：津药药业秒板站稳6板，下周一必须表态模仿华电辽能板块才有预期，否则看退潮\n低位核心：重药控股换手二板\n高位双辨识度：万邦德强承接，美诺华反杀\n\n下周重点看津药药业反馈" }),
        makeCycleRecord("2026/4/7", "周二", "中回流", "up", "强", "7板", "津药药业顶住分歧秒板后炸板回封，算渡劫成功。", { raw: "医药：中回流↑\n板块龙头：津药药业顶住分歧秒板后炸板回封，强势带动板块中回流\n辨识度：万邦德极限压异动\n美诺华主动性较差\n低位批量首板\n\n今天算是渡劫成功，明天进监管第一天很重要" }),
        makeCycleRecord("2026/4/8", "周三", "大分歧", "down", "更弱", "断板", "津药药业炸板跳水大面，抗监管失败，主升基本结束。", { raw: "医药：大分歧↓\n板块龙头：津药药业炸板跳水大面，抗监管失败，电力周期下的补涨产物\n辨识度：美诺华涨停\n身位活口：金陵药业T字二板\n情绪：百花医药一字板\n板块后排基本都是深水震荡\n\n基本结束，需要明天分歧延续确认" })
      ]
    },
    {
      id: "huadian-power-2026-03",
      name: "华电辽能周期",
      leader: "华电辽能",
      code: "600396.SH",
      sector: "电力",
      theme: "电网报团穿越",
      dateRange: "2026/3/18-2026/3/27",
      startDate: "2026-03-18",
      endDate: "2026-03-27",
      tradingDays: 8,
      status: "已完成",
      source: {
        file: "7.19 题材节奏表.xlsx",
        workbookPath: "C:/Users/Administrator/Documents/xwechat_files/wxid_8bxd1e705gqw22_69b9/msg/file/2026-09/7.19 题材节奏表.xlsx",
        sheet: "Sheet1",
        range: "X162:AE162"
      },
      rhythm: "高潮启动 -> 超强回流 -> 小分化 -> 小分歧 -> 分歧延续 -> 超强回流 -> 强势延续 -> 内部强回流高低切",
      oneLine:
        "华电辽能是电网报团穿越样本，3/18三板超预期一字后持续推进，3/24强回流高潮、3/25站稳八板开创新周期，随后高位滞涨进入低位补涨和高低切。",
      tags: ["电力", "华电辽能", "电网", "报团穿越", "八板", "高低切"],
      limitBoard: {
        sourceName: "短线侠连板天梯",
        sourceUrl: "http://duanxianxia.cn/web/lianban/",
        range: "2026-03-16 - 2026-03-27",
        sourceNote: "2026/9/6 抓取；3/26题材表写9板但短线侠接口未返回，已按源间差异标注",
        summary: "短线侠天梯显示华电辽能3/16首板到3/25八板连续晋级；本地题材表3/26记录为九板延续，和本次短线侠接口返回不一致。",
        items: [
          { date: "2026/3/16", board: "1板", status: "晋级标记", statusTone: "up", note: "前置首板。" },
          { date: "2026/3/17", board: "2板", status: "晋级标记", statusTone: "up", note: "华电辽宁一字开板换手二板。" },
          { date: "2026/3/18", board: "3板", status: "晋级标记", statusTone: "up", note: "超预期一字，周期观察起点。" },
          { date: "2026/3/19", board: "4板", status: "晋级标记", statusTone: "up", note: "换手四板，电力回流延续。" },
          { date: "2026/3/20", board: "5板", status: "晋级标记", statusTone: "warn", note: "分化中游资接力。" },
          { date: "2026/3/23", board: "6板", status: "晋级标记", statusTone: "up", note: "弱转强加速，后排掉队。" },
          { date: "2026/3/24", board: "7板", status: "晋级标记", statusTone: "up", note: "强回流高潮，低位批量反包。" },
          { date: "2026/3/25", board: "8板", status: "无晋级标记", statusTone: "warn", note: "站稳八板，尾盘弱分化。" },
          { date: "2026/3/26", board: "9板", status: "题材表记录", statusTone: "warn", note: "短线侠接口未返回该日记录，题材表记录为爆量分歧晋级。" },
          { date: "2026/3/27", board: "高位滞涨", status: "题材表记录", statusTone: "warn", note: "周期龙小红震荡，低位补涨阶段。" }
        ]
      },
      phaseLine: [
        { date: "3/18", title: "高潮启动", tone: "up", note: "三板超预期一字，竞价抢筹。" },
        { date: "3/19", title: "超强回流", tone: "up", note: "四板换手，电力回流延续。" },
        { date: "3/20", title: "小分化", tone: "warn", note: "五板接力，后排震荡。" },
        { date: "3/23", title: "小分歧", tone: "warn", note: "六板加速，后排掉队。" },
        { date: "3/24", title: "超强回流", tone: "up", note: "强回流高潮，近20家涨停。" },
        { date: "3/25", title: "强势延续", tone: "up", note: "八板站稳，开创新周期。" },
        { date: "3/26", title: "分歧延续", tone: "warn", note: "爆量分歧，低位不断切换。" },
        { date: "3/27", title: "高低切", tone: "warn", note: "高位滞涨，低位补涨阶段。" }
      ],
      records: [
        makeCycleRecord("2026/3/18", "周三", "强回流", "up", "强", "3板", "华电辽能超预期一字，竞价抢筹，电力方向强回流。", { raw: "电力方向：强回流↑\n穿越报团：顺钠股份冲高回落\n身位：华电辽能超预期一字，竞价抢筹\n情绪：韶能股份和粤电力A一字板\n核心：深南电换手核心\n\n后续弱趋势轮动，高低永远不能联动" }),
        makeCycleRecord("2026/3/19", "周四", "回流延续", "up", "更强", "4板", "华电辽能换手四板，韶能股份继续一字，粤电力二板。", { raw: "电力：回流延续↑\n身位：华电辽能换手四板\n情绪：韶能股份继续一字\n核心：粤电力换手二板\n辨识度：华电能源强势反包板\n前穿越：顺钠股份水下震荡\n\n弱趋势轮动，高潮日，明天不能接力" }),
        makeCycleRecord("2026/3/20", "周五", "分化", "warn", "弱强", "5板", "华电辽能游资接力五板，后排基本水下震荡。", { raw: "电力：分化↓\n板块龙：华电辽能游资接力晋级5板\n情绪：韶能股份秒板顶死3板\n核心小弟：华电能源高位反包二板\n板块后排基本都是水下震荡\n\n报团高位，后续重点看华电能否带队破局" }),
        makeCycleRecord("2026/3/23", "周一", "高位继续向上", "warn", "弱强", "6板", "华电辽能弱转强加速六板，后排掉队。", { raw: "电网：高位继续向上，后排掉队↓\n板块龙：华电辽能弱转强加速6板，明天进监管\n低位立新能源和新宏泰反包首板\n三变、百利炸板，掉队韶能跌停\n\n高位报团华电，明天无买点" }),
        makeCycleRecord("2026/3/24", "周二", "强回流高潮", "up", "更强", "7板", "华电辽能平开冲高进监管，低位批量反包板和首板，近20家涨停。", { raw: "电网：强回流高潮↑\n板块龙：华电辽能平开冲高进监管\n情绪：新能泰山一字板\n最强小弟：辽宁能源秒板助攻龙头\n核心：浙江新能换手晋级二板\n板块低位批量反包板和首板，主线强度，近20家涨停\n\n板块非常超预期" }),
        makeCycleRecord("2026/3/25", "周三", "回流延续", "up", "更强", "8板", "华电辽能高开高举涨停站稳八板，开创新周期。", { raw: "电网：回流延续，尾盘弱分化↓\n板块龙：华电辽能高开高举涨停站稳8板，开创新周期\n情绪：湖南发展和新能泰山一字板\n三板核心：辽宁能源秒回封，浙江新能换手板\n辨识度：华电能源换手板反包成功\n板块批量首板和二板\n尾盘豫能控股跳水带分歧\n\n锚定华电，龙头信仰和高低切都可以" }),
        makeCycleRecord("2026/3/26", "周四", "分化抱团", "warn", "强", "9板", "题材表记录华电辽能爆量分歧九板，短线侠接口本次未返回该日记录。", { raw: "电网：分化，高位抱团，先杀中位→\n周期龙：华电辽能爆量分歧晋级9板，新周期延续\n情绪：新能泰山、中闽能源和中超控股一字板\n核心：湖南发展秒板晋级三板\n辨识度：华电能源跟随拉高震荡\n辽宁能源杀到深水拉回\n板块后排负反馈较大\n\n周期龙不跌停不看退潮" }),
        makeCycleRecord("2026/3/27", "周五", "高低切", "warn", "强", "高位滞涨", "华电辽能小红震荡，低位新能泰山和晋控电力补涨。", { raw: "电网：分化，高位大分歧，低位补涨阶段→\n周期龙：华电辽能小红盘震荡\n补涨龙：广西能源两次卡位大分歧，加速\n低位新核心：新能泰山+晋控电力换手二板\n板块反包板较多\n\n华电辽能不跌停板块仍然不看结束，目前是高位滞涨，低位补涨阶段" })
      ]
    }
  ]
};
