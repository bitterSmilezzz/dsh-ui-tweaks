# dsh-ui-tweaks

基础输入 + 界面增强 + 桌面通知的单一 bundle。
2026-08-19 由 `dsh-ui-tweaks` 并入原 `dsh-essentials` 的剩余能力（去预设）合并重构而来。

## 包含功能

| 功能 | 说明 |
|---|---|
| model-selector | 模型选择器（搜索 + 分组，增强版） |
| paste-input | 粘贴/拖拽上传（批量/暂存/清理） |
| at-file | @文件引用（`lib/at-file/`，settings/typert 依赖） |
| 无损省 token | 官方 ToolResultPruner + shell/read 溢出 spill（见 `cordis.patch.yml`） |
| plugin-inventory | 插件列表增强（全部/内置/自定义分类 tab + 搜索） |
| auto-hide-composer | 输入框自动隐藏（贴近恢复，延迟/阈值可调） |
| retry-settings | 请求重试次数设置（host `/api/retry-settings` 路由） |
| immersive-mode | 沉浸模式（隐藏侧栏/详情/会话头，右下角悬浮按钮） |
| keyboard-shortcuts | 全局快捷键（帮助/沉浸/自动隐藏/聚焦/导航） |
| notify | 桌面通知（审批/提问/轮次/后台会话完成，四类事件可分别开关） |

> 原 `dsh-essentials` 的路由预设（Router Standard/Spec）与梁神模式已按用户要求删除（2026-08-19）。

## 设置

所有功能的开关与选项统一放在 **「设置 → 通用设置 → 界面增强」** 总入口下，内部分组展示。
配置统一存于浏览器 localStorage 单 key（`dsh-ui-tweaks.settings`）。

## 设计

- 单 bundle 工具数 = 0（纯 client + 1 个 webServer 路由），不注册 LLM 工具，不增加模型 context 开销
- 浏览器半区 = `lib/client.js`（UI 增强）+ `lib/essentials-client.js`（原 essentials 四个 client factory），
  同一 `__ModuleLoader__.load` 组合 apply，共享同一 fiber
- 宿主半区 = 基础输入子模块（`lib/{at-file,model-selector,paste-input}/`）+ retry-settings 路由
- 统一 locale 命名空间（`ui-tweaks`）+ 统一配置对象
- 所有副作用挂在同一 fiber，插件卸载全部回收

## 安装

```bash
# 推荐：场景化安装
bash scripts/install.sh --scenario essentials

# 或低层直接装
node scripts/install-plugins.mjs -p web --only dsh-ui-tweaks
```

bundle 自带 `cordis.patch.yml`，安装后自动插入 entry（id: `dsh-ui-tweaks`）。
依赖 `dsh-core`（`github:bitterSmilezzz/dsh-core`）与官方 `@deepseek-ai/*` rc.7 包。

## License

MIT
