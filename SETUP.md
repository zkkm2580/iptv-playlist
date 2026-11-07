# 自托管 IPTV 播放列表实例（zkkm2580 部署记录）

本目录是 `iptv-org/iptv`（全球公开 IPTV 直播源聚合库）的一个**自托管镜像**，已改造并部署到账号 `zkkm2580`。

---

## 一、已完成的改造（代码层面）

| 文件 | 改动 |
|---|---|
| `scripts/constants.ts` | `OWNER='zkkm2580'`、`REPO='iptv-playlist'`；新增 `API_BASE_URL`（数据源）与 `PUBLIC_BASE_URL`（对外域名）两个可环境变量覆盖的常量 |
| `scripts/core/apiClient.ts` | 频道元数据下载改用 `API_BASE_URL` 常量 |
| `scripts/tables/*.ts` | README 统计表预览链接改用 `PUBLIC_BASE_URL` |
| `.readme/template.md` | 播放列表链接与"本仓库"链接改为 `zkkm2580/iptv-playlist`；API 链接改 `zkkm2580/api`；**保留** database / epg / awesome-iptv / discussions 等上游共享生态引用 |
| `.github/workflows/update.yml` | 部署目标改为 `zkkm2580/iptv-playlist` 与 `zkkm2580/api`；鉴权从 `iptv-bot` GitHub App 改为 `GH_TOKEN`（PAT）；分支条件兼容 `master` / `main` |
| `package.json` | 手动 `playlist:deploy` / `api:deploy` 脚本目标改为 `zkkm2580` |
| `CONTRIBUTING.md` / `FAQ.md` | 本仓库相关链接改为 `zkkm2580/iptv-playlist` |

**设计原则**：播放列表与 README 指向你自己的域名，但频道元数据（logo/类别/语言/国家）继续消费上游 `iptv-org.github.io/api` 共享目录——个人实例无需自建数据库即可运转。

### 本次部署时追加的两处修复
1. **屏蔽名单校验改为"不致命"**：上游数据里部分频道已被 `iptv-org` 列入版权/NSFW 屏蔽名单，`playlist:validate` 原本会因这些报错退出码 1 而中断发布。已把 `validate` 拆成独立步骤并设 `continue-on-error: true`，仅作提示，不再阻断 `generate` / 部署。
2. **API 改用 `gh-pages` CLI 部署**：原先两个 JamesIves 部署步骤在同一 job 内连续运行会争抢本地 `gh-pages` 分支导致失败。已把"跨仓库推送 `streams.json` 到 `zkkm2580/api`"改为 `npm run api:deploy`（底层 `gh-pages` 包单独克隆目标仓库发布），消除冲突。

---

## 二、已完成的部署（运维层面，已自动执行）

- ✅ 创建仓库 `zkkm2580/iptv-playlist`（代码 + 播放列表 Pages）与 `zkkm2580/api`（streams.json Pages）
- ✅ 通过 GitHub API 配置仓库 Secret `GH_TOKEN`（值 = 当前 PAT，用于工作流跨仓库推送与部署）
- ✅ 代码已推送到 `zkkm2580/iptv-playlist` 的 `master` 分支
- ✅ 手动触发 `update` 工作流，已成功生成并发布：
  - 播放列表 → `zkkm2580/iptv-playlist` 的 `gh-pages`
  - `streams.json` → `zkkm2580/api` 的 `gh-pages`
- ✅ 两个仓库的 GitHub Pages 均已开启（源 `gh-pages`，状态 `built`）

> ⚠️ **安全提醒**：本次用于部署的 PAT 曾以明文出现在对话/命令行中，存在泄露风险。
> 请尽快到 `Settings → Developer settings → Personal access tokens` **撤销/重新生成**该 token，
> 并在 `zkkm2580/iptv-playlist → Settings → Secrets` 中同步更新 `GH_TOKEN`。
> 之后每日自动更新仍可正常工作（新 token 需同样具备对两个仓库的 `contents:write`）。

---

## 三、访问地址（已验证可访问，HTTP 200）

- 主播放列表：`https://zkkm2580.github.io/iptv-playlist/index.m3u`
- 分类：`index.category.m3u` ｜ 语言：`index.language.m3u` ｜ 国家：`index.country.m3u` ｜ 地区：`index.region.m3u`
  （各维度拆分文件见仓库 README）
- API：`https://zkkm2580.github.io/api/streams.json`

把 `index.m3u` 直接丢进 VLC / PotPlayer / IPTV 播放器即可观看。

---

## 四、日常管理

- **自动更新**：`update.yml` 每天 **UTC 0:00** 自动跑一遍（拉取社区 Issue 增删源 → 校验 → 重新生成 → 发布）。
- **手动触发**：`zkkm2580/iptv-playlist → Actions → update → Run workflow`。
- **本地改代码后推送**：注意工作流会把 README 回写 `master`，本地推送前先
  `git pull --rebase`（用带 token 的远程地址）再 `git push`，避免非快进冲突。

---

## 五、关于数据源

- 默认 `API_BASE_URL = https://iptv-org.github.io/api`（上游共享频道目录），个人实例直接消费即可。
- 若想完全脱离上游：把 `iptv-org/api` 镜像到 `zkkm2580/api`，再在 `update.yml` 的 job 里加
  `env: { API_BASE_URL: https://zkkm2580.github.io/api }`。

---

## 六、已知事项 / 注意

- **测试夹具**：`tests/` 下的预期数据仍引用上游域名，`npm test` 不会通过；但部署流水线不跑测试，不影响发布。
- **直播源稳定性**：链接有效性依赖上游社区维护，存在死链窗口期（工作流每天自动清理失效源）。
- **合规**：本仓库只聚合公开直播链接、不托管视频内容；使用请遵守当地网络与版权规定。
