/**
 * dsh-ui-tweaks — host half（单一 bundle，2026-08-19 架构级合并）。
 *
 * 架构：本文件是唯一入口（组合器），统一挂载全部领域模块与官方扩展。
 *
 *   ┌─ host 半区（本文件）
 *   │    ├─ model-selector  — 纯 UI，host 空 apply（占位，client 半区实现）
 *   │    ├─ paste-input     — 附件上传协议 v1（webServer 路由 + TTL 清理）
 *   │    ├─ at-file         — @文件路径引用（typert + settings + agent pre-step）
 *   │    ├─ ToolResultPruner— 官方工具结果剪枝（无损省 token）
 *   │    └─ retry-settings  — /api/retry-settings 宿主路由（读写 settings 服务）
 *   │
 *   └─ client 半区（lib/client.js 单一自包含 bundle）
 *        4 个 client factory（model-selector/paste-input/at-file/attachment-remove）
 *        已内联为唯一事实来源；独立的 lib/{at-file,paste-input,model-selector}/client.js
 *        子文件已删除（2026-08-19 架构级合并——消除双份维护）。
 *
 * 配置契约（apply 的 config 为扁平对象，逐模块透传）：
 *   - toolResultPruner: ToolResultPruner 配置（默认 undefined → 官方默认）
 *   - atFile:           { maxIndexedFiles, ignoreDirs } → at-file（默认 Config 兜底）
 *   - pasteInput:       { limits: { maxFileBytes, maxBatchBytes, maxFiles, maxDepth,
 *                       maxConcurrentUploads } } → paste-input（默认 DEFAULT_LIMITS 兜底）
 *
 * inject 为各领域模块并集（Cordis 服务名，非 entry id）：
 *   fs/webServer/loader/sessions（paste-input）+ settings/typert（at-file）
 *   + webServer/settings（retry 路由）。model-selector 无 host 依赖。
 */
import { apply as applyModelSelector } from './model-selector/index.js'
import { apply as applyPasteInput } from './paste-input/index.js'
import { apply as applyAtFile } from './at-file/index.js'
import ToolResultPruner from '@deepseek-ai/dsh-compaction-tool-result-pruner'

// Vendored from dsh-core (2026-08-19 清理：dsh-core 无多消费者，内联进消费方后删除独立仓库)。

/** Deduplicate an array by a string key. Keeps first occurrence. */
function dedupeBy(items, keyFn) {
  const seen = new Set()
  const out = []
  for (const item of items) {
    const key = keyFn(item)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  return out
}

/** Deep-merge plain objects/arrays (arrays are concatenated then deduped). */
function mergeConfig(base, patch) {
  if (Array.isArray(base) || Array.isArray(patch)) {
    return dedupeBy([...(Array.isArray(base) ? base : []), ...(Array.isArray(patch) ? patch : [])], (x) =>
      JSON.stringify(x),
    )
  }
  if (base && patch && typeof base === 'object' && typeof patch === 'object') {
    const out = { ...base }
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined) continue
      out[key] = key in out ? mergeConfig(out[key], value) : value
    }
    return out
  }
  return patch === undefined ? base : patch
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

// 单提供方适配器：retryPolicy 在命名空间顶层，即使当前没显式配置也允许写入。
const SINGLE_PROVIDER_NAMESPACES = new Set(['llm-deepseek'])

function retryPolicyOf(profileOrSection) {
  if (!isPlainObject(profileOrSection)) return {}
  const rp = profileOrSection.retryPolicy
  return isPlainObject(rp) ? rp : {}
}

/** 收集当前所有可写 retryPolicy 的 LLM 条目，供 UI 展示。 */
function collectEntries(descriptors) {
  const entries = []
  for (const desc of descriptors) {
    const ns = desc && desc.ns
    const value = desc && desc.value
    if (typeof ns !== 'string' || !ns.startsWith('llm-') || !isPlainObject(value)) continue
    if (isPlainObject(value.providers)) {
      for (const [provider, profile] of Object.entries(value.providers)) {
        if (!isPlainObject(profile)) continue
        const rp = retryPolicyOf(profile)
        entries.push({
          ns,
          provider,
          mode: rp.mode === 'always' ? 'always' : 'normal',
          maxRetries: typeof rp.maxRetries === 'number' ? rp.maxRetries : 2,
        })
      }
    } else if (Object.prototype.hasOwnProperty.call(value, 'retryPolicy') || SINGLE_PROVIDER_NAMESPACES.has(ns)) {
      const rp = retryPolicyOf(value)
      entries.push({
        ns,
        provider: null,
        mode: rp.mode === 'always' ? 'always' : 'normal',
        maxRetries: typeof rp.maxRetries === 'number' ? rp.maxRetries : 2,
      })
    }
  }
  return entries
}

/** 为单个命名空间构造 mutate ops：把所有提供方/顶层 retryPolicy 改成 normal + maxRetries。 */
function buildOpsForNamespace(ns, value, maxRetries) {
  const ops = []
  if (isPlainObject(value.providers)) {
    for (const provider of Object.keys(value.providers)) {
      ops.push({ op: 'set', path: ['providers', provider, 'retryPolicy', 'mode'], value: 'normal' })
      ops.push({ op: 'set', path: ['providers', provider, 'retryPolicy', 'maxRetries'], value: maxRetries })
    }
  } else if (Object.prototype.hasOwnProperty.call(value, 'retryPolicy') || SINGLE_PROVIDER_NAMESPACES.has(ns)) {
    ops.push({ op: 'set', path: ['retryPolicy', 'mode'], value: 'normal' })
    ops.push({ op: 'set', path: ['retryPolicy', 'maxRetries'], value: maxRetries })
  }
  return ops
}

async function readBody(req) {
  let data = ''
  for await (const chunk of req) data += chunk
  return data
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  })
  res.end(JSON.stringify(payload))
}

export const name = 'dsh-ui-tweaks'

export const inject = [
  // paste-input
  'fs', 'webServer', 'loader', 'sessions',
  // at-file
  'settings', 'typert',
]

export function apply(ctx, config = {}) {
  const cfg = mergeConfig({}, config)

  // 启用官方工具结果剪枝：压缩/上下文溢出时把超大 tool/result 改写成有界
  // head + marker + tail，避免"单条超大工具结果"导致压缩后仍 400
  // CONTEXT_WINDOW_EXCEEDED。
  ctx.plugin(ToolResultPruner, cfg.toolResultPruner)

  // 领域模块挂载（顺序：占位 → 协议 → 引用）。配置逐模块透传，未配置时
  // 各模块内部默认值兜底。
  applyModelSelector(ctx) // 纯 UI，host 无逻辑
  applyPasteInput(ctx, cfg.pasteInput) // 附件上传协议（limits 可配）
  applyAtFile(ctx, cfg.atFile) // @文件路径引用（maxIndexedFiles/ignoreDirs 可配）

  // 请求重试设置路由
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/api/retry-settings',
    handler: async (req, res) => {
      try {
        if (req.method === 'GET') {
          const descriptors = ctx.settings.describe()
          const entries = collectEntries(descriptors)
          const maxes = entries.map((e) => e.maxRetries).filter((n) => typeof n === 'number')
          const current = maxes.length > 0 && maxes.every((n) => n === maxes[0]) ? maxes[0] : null
          const modes = entries.map((e) => e.mode)
          const mode = modes.length > 0 && modes.every((m) => m === modes[0]) ? modes[0] : null
          return sendJson(res, 200, { ok: true, entries, current, mode, defaultMaxRetries: 2 })
        }
        if (req.method === 'POST') {
          let patch
          try {
            patch = JSON.parse(await readBody(req))
          } catch {
            return sendJson(res, 400, { ok: false, reason: '请求体不是合法 JSON' })
          }
          if (patch === null || typeof patch !== 'object' || Array.isArray(patch)) {
            return sendJson(res, 400, { ok: false, reason: '请求体必须是 JSON 对象' })
          }
          const maxRetries = patch.maxRetries
          if (typeof maxRetries !== 'number' || !Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 100) {
            return sendJson(res, 400, { ok: false, reason: 'maxRetries 必须是 0–100 的整数' })
          }
          const descriptors = ctx.settings.describe()
          const touched = []
          for (const desc of descriptors) {
            const ns = desc && desc.ns
            const value = desc && desc.value
            if (typeof ns !== 'string' || !ns.startsWith('llm-') || !isPlainObject(value)) continue
            const ops = buildOpsForNamespace(ns, value, maxRetries)
            if (ops.length === 0) continue
            await ctx.settings.mutate(ns, ops)
            touched.push(ns)
          }
          return sendJson(res, 200, { ok: true, updated: touched.length, namespaces: touched })
        }
        return sendJson(res, 405, { ok: false, reason: 'method-not-allowed' })
      } catch (error) {
        return sendJson(res, 500, { ok: false, reason: String((error && error.message) || error) })
      }
    },
  }), 'dsh-ui-tweaks: retry-settings route')
}
