import json
from datetime import date
from pathlib import Path

import requests


ROOT = Path(__file__).resolve().parent
OUTPUT_JS = ROOT / "intraday-data.js"
OUTPUT_JSON = ROOT / "intraday-data.json"

SOURCE_URL = "https://ifzq.gtimg.cn/appstock/app/kline/mkline"
HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Referer": "https://gu.qq.com/",
}

SCALES = [
    ("m1", "1分钟"),
    ("m5", "5分钟"),
    ("m15", "15分钟"),
    ("m30", "30分钟"),
    ("m60", "60分钟"),
]

CHART_PLAN = [
    {
        "cycleId": "cycle-01",
        "stockName": "豫能控股",
        "code": "001896",
        "marketCode": "sz001896",
        "date": "2026-02-12",
        "label": "电力一周期启动观察",
        "note": "周期标题首个龙头票，对应电力大周期起点。",
    },
    {
        "cycleId": "cycle-01",
        "stockName": "顺纳股份",
        "code": "000533",
        "marketCode": "sz000533",
        "date": "2026-03-17",
        "label": "过渡接力观察",
        "note": "Notion 标题写作顺纳股份，行情代码按顺钠股份 000533 抓取。",
    },
    {
        "cycleId": "cycle-01",
        "stockName": "华电辽能",
        "code": "600396",
        "marketCode": "sh600396",
        "date": "2026-03-23",
        "label": "右侧确认买点",
        "note": "复盘中标记为六板缩量转强、最佳右侧买点。",
    },
    {
        "cycleId": "cycle-02",
        "stockName": "美诺华",
        "code": "603538",
        "marketCode": "sh603538",
        "date": "2026-03-25",
        "label": "新题材试错起高度",
        "note": "创新药周期旧电力退潮时的新龙试错节点。",
    },
    {
        "cycleId": "cycle-02",
        "stockName": "万邦德",
        "code": "002082",
        "marketCode": "sz002082",
        "date": "2026-03-30",
        "label": "趋势龙站住前排",
        "note": "复盘中作为创新药趋势龙观察。",
    },
    {
        "cycleId": "cycle-02",
        "stockName": "津药药业",
        "code": "600488",
        "marketCode": "sh600488",
        "date": "2026-04-01",
        "label": "新龙接替确认",
        "note": "复盘中写作金耀/津药接替美诺华继续带队。",
    },
    {
        "cycleId": "cycle-03",
        "stockName": "中嘉博创",
        "code": "000889",
        "marketCode": "sz000889",
        "date": "2026-04-10",
        "label": "算力升位龙头",
        "note": "算力/电池周期内明确提到的 3 板升位龙头。",
    },
    {
        "cycleId": "cycle-04",
        "stockName": "华电辽能",
        "code": "600396",
        "marketCode": "sh600396",
        "date": "2026-05-07",
        "label": "旧辨识度龙助攻",
        "note": "电力三周期中与大唐发电形成双龙出海。",
    },
    {
        "cycleId": "cycle-04",
        "stockName": "大唐发电",
        "code": "601991",
        "marketCode": "sh601991",
        "date": "2026-05-11",
        "label": "四板右侧确定买点",
        "note": "复盘标记为弱转强确定、最佳买点。",
    },
]


def fetch_rows(session, market_code, scale):
    response = session.get(
        SOURCE_URL,
        params={"param": f"{market_code},{scale},,640"},
        headers=HEADERS,
        timeout=20,
    )
    response.raise_for_status()
    payload = response.json()
    return payload.get("data", {}).get(market_code, {}).get(scale, []) or []


def normalize_row(row):
    timestamp, open_price, close, high, low, volume = row[:6]
    return {
        "time": f"{timestamp[8:10]}:{timestamp[10:12]}",
        "open": float(open_price),
        "close": float(close),
        "high": float(high),
        "low": float(low),
        "volume": float(volume),
    }


def build_chart(session, item):
    target_date = item["date"].replace("-", "")
    chart = {
        key: item[key]
        for key in ("cycleId", "stockName", "code", "marketCode", "date", "label", "note")
    }

    for scale, label in SCALES:
        rows = fetch_rows(session, item["marketCode"], scale)
        matched = [row for row in rows if row[0].startswith(target_date)]
        if matched:
            chart.update(
                {
                    "resolution": scale,
                    "resolutionLabel": label,
                    "source": "Tencent ifzq historical minute kline",
                    "points": [normalize_row(row) for row in matched],
                }
            )
            return chart

    chart.update(
        {
            "resolution": None,
            "resolutionLabel": None,
            "source": "Tencent ifzq historical minute kline",
            "points": [],
            "message": "历史分钟接口未返回该日期数据。",
        }
    )
    return chart


def main():
    session = requests.Session()
    session.trust_env = False

    charts = [build_chart(session, item) for item in CHART_PLAN]
    charts_by_cycle = {}
    for chart in charts:
        charts_by_cycle.setdefault(chart["cycleId"], []).append(chart)

    payload = {
        "generatedAt": date.today().isoformat(),
        "source": "Tencent ifzq historical minute kline",
        "chartsByCycle": charts_by_cycle,
    }

    OUTPUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    OUTPUT_JS.write_text(
        "window.LONGTOU_INTRADAY = "
        + json.dumps(payload, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUTPUT_JS.name} with {len(charts)} charts")


if __name__ == "__main__":
    main()
