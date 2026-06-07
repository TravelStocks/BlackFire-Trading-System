from __future__ import annotations

import json
import re
import sqlite3
from pathlib import Path


NOTION_DB = Path.home() / "AppData" / "Roaming" / "Notion" / "notion.db"
PAGE_TITLE = "资料库 - 龙头周期复盘"
OUTPUT_JS = Path(__file__).with_name("cycles-data.js")
OUTPUT_JSON = Path(__file__).with_name("cycles-data.json")

TYPE_TO_LEVEL = {
    "header": 2,
    "sub_header": 3,
    "sub_sub_header": 4,
}


def rich_text_to_plain(value: object) -> str:
    if not isinstance(value, list):
        return ""
    parts: list[str] = []
    for item in value:
        if isinstance(item, list) and item:
            parts.append(str(item[0]))
    return "".join(parts).strip()


def parse_json(value: str | None, fallback: object) -> object:
    if not value:
        return fallback
    try:
        return json.loads(value)
    except json.JSONDecodeError:
        return fallback


def block_text(properties: str | None) -> str:
    props = parse_json(properties, {})
    if not isinstance(props, dict):
        return ""
    if "title" in props:
        return rich_text_to_plain(props["title"])
    texts = [rich_text_to_plain(value) for value in props.values()]
    return " | ".join(text for text in texts if text).strip()


class NotionCache:
    def __init__(self, db_path: Path) -> None:
        self.connection = sqlite3.connect(f"file:{db_path}?mode=ro", uri=True)

    def close(self) -> None:
        self.connection.close()

    def row(self, block_id: str) -> sqlite3.Row | tuple | None:
        return self.connection.execute(
            """
            select id, type, properties, content, format
            from block
            where id = ? and alive = 1
            """,
            (block_id,),
        ).fetchone()

    def find_page_id(self, title: str) -> str:
        for block_id, properties in self.connection.execute(
            "select id, properties from block where type = 'page' and alive = 1"
        ):
            if block_text(properties) == title:
                return block_id
        raise RuntimeError(f"Cannot find Notion page: {title}")

    def children(self, block_id: str) -> list[str]:
        row = self.row(block_id)
        if not row:
            return []
        content = parse_json(row[3], [])
        return content if isinstance(content, list) else []


def is_toggle_heading(row: tuple) -> bool:
    block_type = row[1]
    fmt = parse_json(row[4], {})
    return block_type == "header" and isinstance(fmt, dict) and fmt.get("toggleable") is True


def is_cycle_insight(row: tuple) -> bool:
    return row[1] in {"callout", "quote"}


def extract_date_range(title: str) -> str:
    match = re.search(r"(\d{4}/\d{1,2}/\d{1,2})\s*-\s*(\d{4}/\d{1,2}/\d{1,2})", title)
    if match:
        return f"{match.group(1)} - {match.group(2)}"
    return "时间待补"


def clean_short_title(title: str) -> str:
    head = re.split(r"（|\(", title, maxsplit=1)[0].strip(" -")
    return head or title[:24]


def infer_tags(title: str) -> list[str]:
    tags: list[str] = []
    checks = [
        ("电力", "电力"),
        ("政策", "政策催化"),
        ("创新药", "创新药"),
        ("算力", "算力"),
        ("电池", "电池"),
        ("退潮", "退潮复盘"),
        ("大市值", "大市值龙头"),
        ("趋势", "趋势"),
    ]
    for keyword, tag in checks:
        if keyword in title and tag not in tags:
            tags.append(tag)
    return tags or ["周期复盘"]


def infer_leaders(title: str) -> list[str]:
    known = [
        "豫能控股",
        "顺纳股份",
        "华电辽能",
        "华电能源",
        "辽宁能源",
        "广西能源",
        "美诺华",
        "万邦德",
        "津药药业",
        "大唐发电",
        "汉缆股份",
        "大唐电信",
    ]
    return [name for name in known if name in title]


def block_to_node(cache: NotionCache, block_id: str, depth: int = 0) -> dict[str, object] | None:
    row = cache.row(block_id)
    if not row:
        return None
    block_type = row[1]
    text = block_text(row[2])
    children = [
        child
        for child in (block_to_node(cache, child_id, depth + 1) for child_id in cache.children(block_id))
        if child
    ]

    if block_type in TYPE_TO_LEVEL:
        return {
            "type": "heading",
            "level": TYPE_TO_LEVEL[block_type],
            "text": text,
            "children": children,
        }

    if block_type in {"toggle", "callout", "quote", "numbered_list", "bulleted_list", "divider"}:
        return {"type": block_type, "text": text, "children": children}

    return {"type": "text", "text": text, "children": children}


def flatten_text(nodes: list[dict[str, object]]) -> list[str]:
    output: list[str] = []

    def visit(node: dict[str, object]) -> None:
        text = str(node.get("text") or "").strip()
        if text:
            output.append(text)
        for child in node.get("children") or []:
            if isinstance(child, dict):
                visit(child)

    for node in nodes:
        visit(node)
    return output


def extract_timeline(nodes: list[dict[str, object]]) -> list[dict[str, str]]:
    timeline: list[dict[str, str]] = []

    def visit(node: dict[str, object]) -> None:
        text = str(node.get("text") or "")
        match = re.match(r"((?:\d{4}/)?\d{1,2}/\d{1,2})\s*[-—:：]\s*(.+)", text)
        if match and len(timeline) < 24:
            timeline.append({"date": match.group(1), "event": match.group(2).strip()})
        for child in node.get("children") or []:
            if isinstance(child, dict):
                visit(child)

    for node in nodes:
        visit(node)
    return timeline


def extract_lessons(texts: list[str]) -> list[str]:
    keywords = ("结论", "核心", "铁律", "准则", "启示", "买点", "卖点", "风险", "节奏")
    lessons: list[str] = []
    for text in texts:
        if any(keyword in text for keyword in keywords) and 18 <= len(text) <= 180:
            lessons.append(text)
        if len(lessons) == 8:
            break
    return lessons


def build_hierarchy(title: str, leaders: list[str], texts: list[str]) -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    if leaders:
        rows.append({"role": "标题识别标的", "names": " / ".join(leaders), "note": "从周期标题自动抽取"})
    role_keywords = [
        ("龙头", "龙头"),
        ("补涨", "补涨"),
        ("跟风", "跟风"),
        ("掉队", "掉队 / 风险"),
    ]
    for keyword, role in role_keywords:
        for text in texts:
            if keyword in text and 10 <= len(text) <= 140:
                rows.append({"role": role, "names": "见备注", "note": text})
                break
    return rows[:6]


def build_cycle(cache: NotionCache, root_id: str, index: int, insights: list[dict[str, object]]) -> dict[str, object]:
    row = cache.row(root_id)
    if not row:
        raise RuntimeError(f"Missing root block: {root_id}")

    title = block_text(row[2])
    children = [
        child
        for child in (block_to_node(cache, child_id) for child_id in cache.children(root_id))
        if child
    ]
    texts = flatten_text(children)
    insight_texts = flatten_text(insights)
    leaders = infer_leaders(title)
    date_range = extract_date_range(title)
    tags = infer_tags(title)
    short_title = clean_short_title(title)
    summary_source = next((text for text in texts if 24 <= len(text) <= 220), "")
    summary = summary_source or f"{short_title}的 Notion 原文已接入，正文保留在下方原文整理模块。"
    timeline = extract_timeline(children)

    overview = [
        {"label": "周期", "value": date_range},
        {"label": "主线", "value": " / ".join(tags[:3])},
        {"label": "核心标的", "value": " / ".join(leaders) if leaders else "待从正文继续提炼"},
        {"label": "原文块数", "value": str(len(texts))},
    ]

    return {
        "id": f"cycle-{index:02d}",
        "title": title,
        "shortTitle": short_title,
        "dateRange": date_range,
        "tags": tags,
        "leaders": leaders,
        "summary": summary,
        "overview": overview,
        "insights": insights,
        "timeline": timeline,
        "hierarchy": build_hierarchy(title, leaders, texts),
        "lessons": extract_lessons(insight_texts + texts),
        "sections": children,
    }


def main() -> None:
    cache = NotionCache(NOTION_DB)
    try:
        page_id = cache.find_page_id(PAGE_TITLE)
        roots: list[str] = []
        insight_map: dict[str, list[dict[str, object]]] = {}
        active_root_id: str | None = None
        for child_id in cache.children(page_id):
            row = cache.row(child_id)
            if not row:
                continue
            if is_toggle_heading(row):
                title = block_text(row[2])
                if title.startswith("Seedance"):
                    active_root_id = None
                    continue
                roots.append(child_id)
                insight_map[child_id] = []
                active_root_id = child_id
                continue
            if active_root_id and is_cycle_insight(row):
                node = block_to_node(cache, child_id)
                if node:
                    insight_map[active_root_id].append(node)

        cycles = [
            build_cycle(cache, root_id, index, insight_map.get(root_id, []))
            for index, root_id in enumerate(roots, start=1)
        ]
    finally:
        cache.close()

    payload = json.dumps(cycles, ensure_ascii=False, indent=2)
    OUTPUT_JSON.write_text(payload + "\n", encoding="utf-8")
    OUTPUT_JS.write_text(f"window.LONGTOU_CYCLES = {payload};\n", encoding="utf-8")
    print(f"Exported {len(cycles)} cycles to {OUTPUT_JS}")


if __name__ == "__main__":
    main()
