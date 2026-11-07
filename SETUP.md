# 改成自己的部署（zkkm2580 实例）

本目录已改造为可独立部署到你本人 GitHub 账号（`zkkm2580`）的 IPTV 播放列表实例。
下面说明**已改了什么**以及**怎么跑起来**。

---

## 一、已经完成的改动

| 文件 | 改动 |
|---|---|
| `scripts/constants.ts` | `OWNER='zkkm2580'`、`REPO='iptv-playlist'`；新增 `API_BASE_URL`（数据源，默认上游）与 `PUBLIC_BASE_URL`（对外域名，默认 `https://zkkm2580.github.io/iptv-playlist`） |
| `scripts/core/apiClient.ts` | 频道元数据下载地址改用 `API_BASE_URL` 常量（支持环境变量覆盖） |
| `scripts/tables/*.ts` | README 统计表的预览链接改用 `PUBLIC_BASE_URL` |
| `.readme/template.md` | 播放列表链接与"本仓库"链接改为 `zkkm2580/iptv-playlist`；API 链接改 `zkkm2580/api`；**保留** database / epg / awesome-iptv / discussions 等上游共享生态引用 |
| `.github/workflows/update.yml` | 部署目标改为 `zkkm2580/iptv-playlist` 与 `zkkm2580/api`；鉴权从 `iptv-bot` GitHub App 改为 `GH_TOKEN`（PAT）；分支条件兼容 `master` / `main` |
| `package.json` | 手动 `playlist:deploy` / `api:deploy` 脚本目标改为 `zkkm2580` |
| `CONTRIBUTING.md` / `FAQ.md` | 本仓库相关链接改为 `zkkm2580/iptv-playlist` |

> 设计原则：**播放列表与 README 指向你自己的域名**，但**频道元数据（logo/类别/语言/国家）继续消费上游 `iptv-org.github.io/api` 共享目录**——个人实例无需自建数据库即可运转。

---

## 二、部署步骤

1. **建两个仓库**（都在 `zkkm2580` 账号下）
   - `zkkm2580/iptv-playlist`：放代码 + 公开播放列表（GitHub Pages）
   - `zkkm2580/api`：放 `streams.json`（API 数据，GitHub Pages）

2. **开启 GitHub Pages**
   - 两个仓库都进 `Settings → Pages`
   - Source 选 **Deploy from a branch → `gh-pages`**（首次部署后该分支会自动生成）

3. **生成 Fine-grained PAT**
   - `Settings → Developer settings → Personal access tokens → Fine-grained`
   - 分别给 `zkkm2580/iptv-playlist` 和 `zkkm2580/api` 授权 **Contents: Read and write**
   - 复制生成的 token

4. **配置 Secret**
   - 进 `zkkm2580/iptv-playlist → Settings → Secrets and variables → Actions`
   - 新建仓库 Secret：名称 `GH_TOKEN`，值 = 上一步的 PAT

5. **推送代码**
   ```bash
   cd iptv-org
   git remote set-url origin https://github.com/zkkm2580/iptv-playlist.git
   git push -u origin master        # 若你的默认分支是 main，用 main 即可（工作流已兼容）
   ```

6. **触发首次构建**
   - 进 `zkkm2580/iptv-playlist → Actions → update` 点 **Run workflow**（手动）
   - 或等每天 **UTC 0:00** 的定时任务自动跑

---

## 三、关于数据源

- 默认 `API_BASE_URL = https://iptv-org.github.io/api`（上游共享频道目录）。
  个人实例**直接消费即可**，不要求自建。
- 若想完全脱离上游：把 `iptv-org/api` 镜像到 `zkkm2580/api`，再在 `update.yml` 里加一行
  `env: { API_BASE_URL: https://zkkm2580.github.io/api }` 即可。

---

## 四、访问地址（部署成功后）

- 主播放列表：`https://zkkm2580.github.io/iptv-playlist/index.m3u`
- 分类：`index.category.m3u` ｜ 语言：`index.language.m3u` ｜ 国家：`index.country.m3u` ｜ 地区：`index.region.m3u`
  （各维度拆分文件见 README）
- API：`https://zkkm2580.github.io/api/streams.json`

把 `index.m3u` 直接丢进 VLC / PotPlayer / IPTV 播放器即可观看。

---

## 五、已知事项 / 注意

- **测试夹具**：`tests/` 下的预期数据仍引用上游域名，`npm test` 不会通过。但部署流水线（`update.yml`）只跑 `lint + validate + generate`，**不跑测试**，不影响发布。若希望 CI 也跑测试，需要同步更新 `tests/__data__/`。
- **直播源稳定性**：链接有效性依赖上游社区维护，存在死链窗口期（工作流每天自动清理失效源）。
- **合规**：本仓库只聚合公开直播链接、不托管视频内容；使用请遵守当地网络与版权规定。
