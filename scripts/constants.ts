export const ROOT_DIR = process.env.ROOT_DIR || './'
export const STREAMS_DIR = process.env.STREAMS_DIR || './streams'
export const PUBLIC_DIR = process.env.PUBLIC_DIR || './.gh-pages'
export const README_DIR = process.env.README_DIR || './.readme'
export const API_DIR = process.env.API_DIR || './.api'
export const DATA_DIR = process.env.DATA_DIR || './temp/data'
export const LOGS_DIR = process.env.LOGS_DIR || './temp/logs'
export const TESTING = process.env.NODE_ENV === 'test' ? true : false
export const OWNER = 'zkkm2580'
export const REPO = 'iptv-playlist'

// 频道元数据（logo/类别/语言/国家等）的数据源。
// 个人实例默认直接消费上游 iptv-org 的公开 API 目录即可，
// 如需完全离线/独立，可把这里改成你自己的 api 仓库 Pages 地址。
export const API_BASE_URL = process.env.API_BASE_URL || 'https://iptv-org.github.io/api'

// 公开播放列表对外访问的基础域名（GitHub Pages），
// 用于 README 预览链接与统计表格。改成你自己的 Pages 域名。
export const PUBLIC_BASE_URL =
  process.env.PUBLIC_BASE_URL || 'https://zkkm2580.github.io/iptv-playlist'
