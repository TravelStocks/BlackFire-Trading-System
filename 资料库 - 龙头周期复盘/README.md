# 资料库 - 龙头周期复盘

这是从 Notion 页面“龙头周期复盘”整理出的静态网页第一版。页面会把每个 toggle heading1 单独渲染成一个周期板块，并排除：

`Seedance超小周期（2026/2/9 - 2026/2/13）- 技术革新硬逻辑 - 掌阅科技 风语筑`

## 当前内容

- 电力大周期（2026/2/12 - 2026/3/25）
- 创新药周期（2026/3/25 - 2026/4/8）
- 算力/电池周期（2026/4/10 - 2026/4/18）
- 电力三周期（2026/5/6 - 2026/5/14）

## 文件说明

- `index.html`：页面入口。
- `styles.css`：清爽三栏投研工作台样式，移动端自动单栏。
- `app.js`：目录、筛选、搜索、展开收起、右侧锚点。
- `cycles-data.js`：页面实际读取的数据。
- `cycles-data.json`：同一份数据的 JSON 备份，方便后续处理。
- `intraday-data.js`：龙头票关键日期分钟线静态数据。
- `intraday-data.json`：同一份分时数据的 JSON 备份。
- `export_notion_cycles.py`：从 Notion 桌面端本地缓存只读导出数据。
- `build_intraday_data.py`：从腾讯历史分钟线接口生成分时数据。

## 本地预览

```powershell
cd C:\Users\abcha\Desktop\codes\longtou-cycle-review-page
python -m http.server 4173 --bind 127.0.0.1
```

然后打开 `http://127.0.0.1:4173/`。
