/**
 * dsh-ui-tweaks — browser half (single self-contained bundle, 2026-08-19 merge).
 *
 * 架构：本文件是浏览器半区的唯一事实来源。宿主以 classic script 加载 client
 * bundle（不允许顶层 import/export），故全部能力内联在同一 load：
 *
 *   window.__ModuleLoader__.load({ id: 'dsh-ui-tweaks', factory })
 *   ├─ sub_modelSelector / sub_pasteInput /
 *   │  sub_attachmentRemoveAlwaysVisible — 3 个 client factory
 *   │  （原 dsh-essentials 半区，2026-08-19 内联；独立的
 *   │   lib/{paste-input,model-selector}/client.js 子文件已删除；
 *   │   at-file 已于 2026-08-20 移除——官方 rc.8 @ 菜单支持文件/会话引用）
 *   └─ applyEssentialsClient(require) 组合 3 factory（共享同一 fiber）
 *      + 本文件主体：locale/设置 UI/开关（plugin-inventory、shortcuts、
 *        notify、retry-settings）
 *
 * 统一约定（2026-08-19 合并重构）：
 * - 统一 locale 命名空间（NS = 'ui-tweaks'），替代合并前 6 个散落的 NS
 * - 统一配置对象（localStorage key 'dsh-ui-tweaks.settings'），替代合并前 3 个散落的 storage key
 * - 通用设置下挂一个「界面增强」总入口（settings.general.item，id=ui-tweaks），
 *   展开后内部分组展示全部功能开关/选项
 * - 同构开关（shortcuts / notify）抽成统一 ToggleCard
 * - notify（桌面通知）作为独立子模块并入：sessions 监听 + 四类事件开关 + 权限行
 * - plugin-inventory 保留插件设置 tab（受开关控制，默认开）
 * - retry-settings 保留 host 路由（/api/retry-settings）+ 通用设置里的次数输入
 * - auto-hide（输入框自动隐藏）与 immersive（沉浸模式）已于 2026-08-20 移除（精简）
 *
 * 所有副作用挂在同一 fiber：ctx.effect / ctx.slots.inject 随插件卸载全部回收。
 * 只走官方扩展点：settings.general.item / settings.plugins.tab / webServer 路由。
 */
/**
 * dsh-ui-tweaks — essentials browser half (inlined from dsh-essentials, 2026-08-19).
 *
 * model-selector / paste-input / attachment-remove 的 client factory。
 * 原为 dsh-essentials 的独立打包模块（`window.__ModuleLoader__.load({ id: 'dsh-essentials' })`），
 * 并入 dsh-ui-tweaks 后以函数包装内联，由 applyEssentialsClient 统一组合 apply。
 * 这些 factory 是本文件的唯一事实来源（独立子文件已删除，勿再建双份）。
 * at-file 的 client factory 已于 2026-08-20 移除（官方 rc.8 @ 菜单覆盖）。
 */
function sub_modelSelector(require) {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/ModelSelect.tsx
		/**
		* ModelSelect: the enhanced composer model seat (`conversation.input.model`).
		*
		* A faithful superset of the shipped `ui-model-selection` seat: the trigger and
		* the two-level root menu (Model / Effort) are preserved, while the model pane
		* gains two additions the user asked for —
		*
		*  1. a name search box that flattens matching models across providers, and
		*  2. collapsible provider groups (chevron toggles, in-memory only).
		*
		* Data and submission ride the SAME per-session directory the /model popup
		* shares (via `modelDirectories`), so a switch made here is what the popup
		* shows next and vice versa. Icons are inline SVG paths copied from
		* @deepseek-ai/dsh-client-ui-primitives (no runtime dependency); colors
		* come from `--dsw-*` tokens in the injected stylesheet.
		*/
		function IconChevronDown() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: "14",
				height: "14",
				viewBox: "0 0 14 14",
				fill: "none",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M11.8486 5.5L11.4238 5.92383L8.69727 8.65137C8.44157 8.90706 8.21562 9.13382 8.01172 9.29785C7.79912 9.46883 7.55595 9.61756 7.25 9.66602C7.08435 9.69222 6.91565 9.69222 6.75 9.66602C6.44405 9.61756 6.20088 9.46883 5.98828 9.29785C5.78438 9.13382 5.55843 8.90706 5.30273 8.65137L2.57617 5.92383L2.15137 5.5L3 4.65137L3.42383 5.07617L6.15137 7.80273C6.42595 8.07732 6.59876 8.24849 6.74023 8.3623C6.87291 8.46904 6.92272 8.47813 6.9375 8.48047C6.97895 8.48703 7.02105 8.48703 7.0625 8.48047C7.07728 8.47813 7.12709 8.46904 7.25977 8.3623C7.40124 8.24849 7.57405 8.07732 7.84863 7.80273L10.5762 5.07617L11 4.65137L11.8486 5.5Z",
					fill: "currentColor"
				})
			});
		}
		function IconChevronRight() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: "14",
				height: "14",
				viewBox: "0 0 14 14",
				fill: "none",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M5.5 2.15137L5.92383 2.57617L8.65137 5.30273C8.90706 5.55843 9.13382 5.78438 9.29785 5.98828C9.46883 6.20088 9.61756 6.44405 9.66602 6.75C9.69222 6.91565 9.69222 7.08435 9.66602 7.25C9.61756 7.55595 9.46883 7.79912 9.29785 8.01172C9.13382 8.21561 8.90706 8.44157 8.65137 8.69727L5.92383 11.4238L5.5 11.8486L4.65137 11L5.07617 10.5762L7.80273 7.84863C8.07732 7.57405 8.24849 7.40124 8.3623 7.25977C8.46904 7.12709 8.47813 7.07728 8.48047 7.0625C8.48703 7.02105 8.48703 6.97895 8.48047 6.9375C8.47813 6.92272 8.46904 6.87291 8.3623 6.74023C8.24848 6.59876 8.07732 6.42595 7.80273 6.15137L5.07617 3.42383L4.65137 3L5.5 2.15137Z",
					fill: "currentColor"
				})
			});
		}
		function IconCheck() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: "14",
				height: "14",
				viewBox: "0 0 14 14",
				fill: "none",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M11.5635 4.58984L7.61426 9.07715C7.35154 9.37561 7.11346 9.64812 6.89453 9.84668C6.66593 10.054 6.38519 10.2506 6.01465 10.3164C5.82079 10.3508 5.62207 10.3529 5.42773 10.3213C5.0561 10.2609 4.77266 10.0674 4.54102 9.86328C4.31926 9.66791 4.07752 9.39911 3.81055 9.10449L2.44531 7.59863L3.55664 6.59082L4.92188 8.09766C5.21256 8.41844 5.38878 8.61191 5.53223 8.73828C5.61022 8.80699 5.65253 8.83192 5.66895 8.83984C5.69648 8.84429 5.72449 8.84467 5.75195 8.83984C5.72657 8.84451 5.75564 8.85422 5.88672 8.73535C6.02833 8.60692 6.20225 8.41088 6.48828 8.08594L10.4385 3.59961L11.5635 4.58984Z",
					fill: "currentColor"
				})
			});
		}
		function IconClear() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: "14",
				height: "14",
				viewBox: "0 0 14 14",
				fill: "none",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M10.6074 4.40278L8.00975 6.99973L10.6074 9.59739L9.59736 10.6074L6.9997 8.00978L4.40274 10.6074L3.3927 9.59739L5.98966 6.99973L3.3927 4.40278L4.40274 3.39273L6.9997 5.98969L9.59736 3.39273L10.6074 4.40278Z",
					fill: "currentColor"
				})
			});
		}
		/** Canonical strength order of pi-ai thinking levels (strongest = highest). */
		const EFFORT_RANK = {
			off: 0,
			minimal: 1,
			low: 2,
			medium: 3,
			high: 4,
			xhigh: 5,
			max: 6
		};
		/** The strongest thinking level a model offers, or undefined for none. */
		function maxEffortOf(reasoning) {
			let best;
			for (const effort of reasoning.efforts) {
				const rank = EFFORT_RANK[effort.id] ?? 0;
				if (best === void 0 || rank > best.rank) best = {
					id: effort.id,
					rank
				};
			}
			return best?.id;
		}
		/**
		* How long a successfully loaded directory snapshot is trusted before the
		* menu re-fetches it over RPC. The snapshot lives in the per-session store,
		* so reopening the menu within this window costs zero RPC and zero re-render.
		*/
		const DIRECTORY_STALE_MS = 3e4;
		function ModelSelect({ locked, available, directory, load, select, t }) {
			const state = (0, react.useSyncExternalStore)(directory.subscribe, directory.getSnapshot);
			const [open, setOpen] = (0, react.useState)(false);
			const [pane, setPane] = (0, react.useState)("root");
			const [query, setQuery] = (0, react.useState)("");
			const [collapsed, setCollapsed] = (0, react.useState)(() => /* @__PURE__ */ new Set());
			const [notice, setNotice] = (0, react.useState)(null);
			const lastActionRef = (0, react.useRef)("load");
			const rootRef = (0, react.useRef)(null);
			const triggerRef = (0, react.useRef)(null);
			const searchRef = (0, react.useRef)(null);
			const itemRefs = (0, react.useRef)([]);
			const lastLoadRef = (0, react.useRef)(0);
			const id = (0, react.useId)();
			const choices = (0, react.useMemo)(() => state.groups.flatMap((group) => group.models.map((model) => ({
				group,
				model,
				haystack: `${model.name}\n${model.description ?? ""}\n${group.name}\n${model.id}\n${group.id}`.toLowerCase(),
				selection: {
					provider: group.id,
					model: model.id,
					...model.reasoning?.defaultEffort === void 0 ? {} : { reasoningEffort: model.reasoning.defaultEffort }
				}
			}))), [state.groups]);
			const currentChoice = choices[(0, react.useMemo)(() => state.current === null ? -1 : choices.findIndex((c) => c.selection.provider === state.current?.provider && c.selection.model === state.current.model), [choices, state.current])];
			const reasoning = currentChoice?.model.reasoning;
			const effectiveEffort = state.current?.reasoningEffort ?? reasoning?.defaultEffort;
			const effortLabel = reasoning === void 0 ? void 0 : effectiveEffort === void 0 ? t("effort.providerDefault") : reasoning.efforts.find((level) => level.id === effectiveEffort)?.name ?? effectiveEffort;
			const effortChoices = (0, react.useMemo)(() => reasoning === void 0 ? [] : [...reasoning.defaultEffort === void 0 ? [{
				key: "provider-default",
				effort: void 0,
				label: t("effort.providerDefault")
			}] : [], ...reasoning.efforts.map((effort) => ({
				key: `effort:${effort.id}`,
				effort: effort.id,
				label: effort.name,
				...effort.description === void 0 ? {} : { description: effort.description }
			}))], [reasoning, t]);
			const busy = state.status === "selecting";
			const normalized = query.trim().toLowerCase();
			const hits = (0, react.useMemo)(() => {
				if (normalized === "") return null;
				const found = [];
				for (const choice of choices) if (choice.haystack.includes(normalized)) found.push({
					group: choice.group,
					model: choice.model
				});
				return found;
			}, [choices, normalized]);
			const reload = () => {
				lastActionRef.current = "load";
				lastLoadRef.current = Date.now();
				load();
			};
			(0, react.useEffect)(() => {
				if (available) {
					lastActionRef.current = "load";
					load();
				}
			}, [available, load]);
			(0, react.useEffect)(() => {
				if (!open) return;
				const closeOutside = (event) => {
					if (!rootRef.current?.contains(event.target)) setOpen(false);
				};
				document.addEventListener("mousedown", closeOutside);
				return () => {
					document.removeEventListener("mousedown", closeOutside);
				};
			}, [open]);
			const resetTransient = () => {
				setPane("root");
				setQuery("");
			};
			const goPane = (next) => {
				setNotice(null);
				setPane(next);
				requestAnimationFrame(() => {
					if (next === "model") searchRef.current?.focus();
					else itemRefs.current.find((item) => item !== null && !item.disabled)?.focus();
				});
			};
			(0, react.useEffect)(() => {
				if (!open) return;
				if (pane === "model") {
					searchRef.current?.focus();
					return;
				}
				itemRefs.current.find((item) => item !== null && !item.disabled)?.focus();
			}, [pane, open]);
			if (!available) return null;
			const show = () => {
				setPane("root");
				setOpen(true);
				if (state.status === "error" || state.groups.length === 0 || Date.now() - lastLoadRef.current > DIRECTORY_STALE_MS) reload();
			};
			const close = (restoreFocus = false) => {
				setOpen(false);
				setNotice(null);
				resetTransient();
				if (restoreFocus) queueMicrotask(() => {
					triggerRef.current?.focus();
				});
			};
			const moveFocus = (offset) => {
				const items = itemRefs.current.filter((item) => item !== null);
				if (items.length === 0) return;
				const active = items.findIndex((item) => item === document.activeElement);
				items[((active < 0 ? offset > 0 ? -1 : 0 : active) + offset + items.length) % items.length]?.focus();
			};
			const onRootKeyDown = (event) => {
				if (event.key === "Escape" && open) {
					event.preventDefault();
					if (pane !== "root") goPane("root");
					else close(true);
					return;
				}
				if (!open) return;
				if ((event.key === "ArrowDown" || event.key === "ArrowUp") && !(event.target instanceof HTMLInputElement)) {
					event.preventDefault();
					moveFocus(event.key === "ArrowDown" ? 1 : -1);
				}
			};
			const onBlur = (event) => {
				if (busy) return;
				const related = event.relatedTarget;
				if (related instanceof Node) {
					if (rootRef.current?.contains(related)) return;
					close();
					return;
				}
			};
			const choose = (selection) => {
				if (state.current?.provider === selection.provider && state.current.model === selection.model) {
					setNotice(t("notice.already"));
					return;
				}
				const target = choices.find((c) => c.selection.provider === selection.provider && c.selection.model === selection.model);
				const max = target?.model.reasoning === void 0 ? void 0 : maxEffortOf(target.model.reasoning);
				const effort = max === "off" ? void 0 : max;
				const full = {
					provider: selection.provider,
					model: selection.model,
					...effort === void 0 ? {} : { reasoningEffort: effort }
				};
				lastActionRef.current = "select";
				select(full).then((accepted) => {
					if (accepted && rootRef.current !== null) close(true);
				});
			};
			const chooseEffort = (effort) => {
				if (state.current === null) return;
				if (effectiveEffort === effort) {
					setNotice(t("notice.alreadyEffort"));
					return;
				}
				const selection = {
					provider: state.current.provider,
					model: state.current.model,
					...effort === void 0 ? {} : { reasoningEffort: effort }
				};
				lastActionRef.current = "select";
				select(selection).then((accepted) => {
					if (accepted && rootRef.current !== null) close(true);
				});
			};
			const toggleCollapse = (groupId) => {
				setCollapsed((prev) => {
					const next = new Set(prev);
					if (next.has(groupId)) next.delete(groupId);
					else next.add(groupId);
					return next;
				});
			};
			const modelLabel = currentChoice?.model.name ?? t("trigger.fallback");
			const providerLabel = currentChoice?.group.name;
			const triggerLabel = effortLabel === void 0 ? modelLabel : `${modelLabel} · ${effortLabel}`;
			const triggerTitle = providerLabel === void 0 ? triggerLabel : `${providerLabel} · ${triggerLabel}`;
			const triggerAria = currentChoice === void 0 ? t("trigger.selectAria") : effortLabel === void 0 ? t("trigger.aria", { model: providerLabel === void 0 ? modelLabel : `${providerLabel} ${modelLabel}` }) : t("trigger.ariaEffort", {
				model: providerLabel === void 0 ? modelLabel : `${providerLabel} ${modelLabel}`,
				effort: effortLabel
			});
			itemRefs.current.length = 0;
			let itemIndex = 0;
			const itemRef = () => {
				const at = itemIndex++;
				return (node) => {
					itemRefs.current[at] = node;
				};
			};
			const renderModelOption = (group, model, showProvider) => {
				const selected = state.current?.provider === group.id && state.current.model === model.id;
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					ref: itemRef(),
					type: "button",
					className: `dms-option${selected ? " dms-selected" : ""}`,
					title: model.name,
					disabled: busy,
					onClick: () => {
						choose({
							provider: group.id,
							model: model.id
						});
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "dms-optionCopy",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: "dms-nameRow",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dms-modelName",
									children: model.name
								}), model.reasoning !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dms-badge",
									title: t("badge.reasoningHint"),
									children: t("badge.reasoning")
								})]
							}),
							model.description !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dms-description",
								children: model.description
							}),
							showProvider && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dms-providerTag",
								children: group.name
							})
						]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dms-check",
						children: selected ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconCheck, {}) : null
					})]
				}, `${group.id}/${model.id}`);
			};
			const renderErrorStrip = () => {
				if (state.error !== null && lastActionRef.current === "load") return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "dms-error",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("error.action", { message: state.error }) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "dms-retry",
						onClick: reload,
						children: t("action.reload")
					})]
				});
				if (state.error !== null && lastActionRef.current === "select") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dms-error",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("error.action", { message: state.error }) })
				});
				return null;
			};
			const renderFailures = (failures) => failures.map((failure) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dms-warning",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("warning.groupLoad", {
					name: failure.name,
					message: failure.message
				}) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: "dms-retry",
					onClick: reload,
					children: t("action.reload")
				})]
			}, failure.id));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				ref: rootRef,
				className: "dms-root",
				onKeyDown: onRootKeyDown,
				onBlur,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					ref: triggerRef,
					type: "button",
					className: "dms-trigger",
					"aria-label": triggerAria,
					"aria-haspopup": "true",
					"aria-expanded": open,
					"aria-controls": open ? `${id}-menu` : void 0,
					title: triggerTitle,
					disabled: locked,
					onClick: () => open ? close() : show(),
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dms-triggerLabel",
							children: modelLabel
						}),
						providerLabel !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dms-triggerProvider",
							children: providerLabel
						}),
						effortLabel !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dms-triggerEffort",
							children: effortLabel
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: `dms-chevron${open ? " dms-chevronOpen" : ""}`,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconChevronDown, {})
						})
					]
				}), open && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					id: `${id}-menu`,
					className: "dms-menu" + (pane === "model" ? " dms-menuModel" : ""),
					"aria-busy": state.status === "loading" || busy,
					children: [
						pane === "root" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							ref: itemRef(),
							type: "button",
							className: "dms-cell",
							disabled: busy,
							onClick: () => {
								goPane("model");
							},
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dms-cellLabel",
									children: t("menu.model")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dms-cellValue",
									children: modelLabel
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dms-cellChevron",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconChevronRight, {})
								})
							]
						}), reasoning !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							ref: itemRef(),
							type: "button",
							className: "dms-cell",
							disabled: busy,
							onClick: () => {
								goPane("effort");
							},
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dms-cellLabel",
									children: t("menu.effort")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dms-cellValue",
									children: effortLabel
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dms-cellChevron",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconChevronRight, {})
								})
							]
						})] }),
						pane === "model" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
							state.status === "loading" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dms-status",
								children: t("status.loading")
							}),
							renderErrorStrip(),
							state.failures.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "dms-failures",
								children: renderFailures(state.failures)
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dms-search",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									ref: searchRef,
									type: "text",
									className: "dms-searchInput",
									value: query,
									placeholder: t("search.placeholder"),
									"aria-label": t("search.placeholder"),
									onChange: (event) => {
										setNotice(null);
										setQuery(event.target.value);
									}
								}), query !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "dms-searchClear",
									"aria-label": t("search.clearAria"),
									onClick: () => {
										setNotice(null);
										setQuery("");
										searchRef.current?.focus();
									},
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconClear, {})
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dms-groups",
								children: [hits !== null ? hits.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "dms-empty",
									children: t("search.noMatch", { query: query.trim() })
								}) : hits.map((hit) => renderModelOption(hit.group, hit.model, true)) : state.groups.map((group) => {
									const headingId = `${id}-${group.id}`;
									const isCollapsed = collapsed.has(group.id);
									return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
										role: "group",
										"aria-labelledby": headingId,
										className: "dms-group",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
											type: "button",
											id: headingId,
											className: "dms-groupHeader",
											"aria-expanded": !isCollapsed,
											"aria-label": t("group.toggleAria", {
												name: group.name,
												count: String(group.models.length)
											}),
											onClick: () => {
												toggleCollapse(group.id);
											},
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: `dms-groupChevron${isCollapsed ? " dms-groupChevronClosed" : ""}`,
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconChevronDown, {})
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: "dms-groupName",
													children: group.name
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: "dms-groupCount",
													children: group.models.length
												})
											]
										}), !isCollapsed && group.models.map((model) => renderModelOption(group, model, false))]
									}, group.id);
								}), hits === null && state.status === "ready" && choices.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "dms-empty",
									children: t("empty.models")
								})]
							})
						] }),
						pane === "effort" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [state.error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dms-error",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("error.action", { message: state.error }) }), lastActionRef.current === "load" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "dms-retry",
								onClick: reload,
								children: t("action.reload")
							})]
						}), effortChoices.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dms-empty",
							children: t("empty.efforts")
						}) : effortChoices.map((level) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							ref: itemRef(),
							type: "button",
							className: `dms-option${effectiveEffort === level.effort ? " dms-selected" : ""}`,
							disabled: busy,
							onClick: () => {
								chooseEffort(level.effort);
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: "dms-optionCopy",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dms-modelName",
									children: level.label
								}), level.description !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dms-description",
									children: level.description
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dms-check",
								children: effectiveEffort === level.effort ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconCheck, {}) : null
							})]
						}, level.key))] }),
						notice !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "dms-notice",
							role: "status",
							children: notice
						})
					]
				})]
			});
		}
		//#endregion
		//#region src/client/locales.ts
		/**
		* `modelSelector` namespace dictionaries for the enhanced model seat.
		*
		* Simplified Chinese is the key-set source of truth; the English dictionary is
		* checked complete against it. Product copy is Chinese-first per repo style.
		*/
		const zh = {
			"trigger.fallback": "选择模型",
			"trigger.selectAria": "选择模型",
			"trigger.aria": "选择模型，当前 {model}",
			"trigger.ariaEffort": "选择模型，当前 {model}，推理等级 {effort}",
			"menu.model": "模型",
			"menu.effort": "推理等级",
			"search.placeholder": "搜索模型",
			"search.clearAria": "清除搜索",
			"search.noMatch": "没有匹配“{query}”的模型。",
			"group.toggleAria": "{name}（{count} 个模型）",
			"effort.providerDefault": "Default",
			"status.loading": "正在刷新模型列表…",
			"error.action": "模型操作失败：{message}",
			"action.reload": "重新加载",
			"warning.groupLoad": "{name} 加载失败：{message}",
			"empty.models": "没有可用的模型。",
			"empty.efforts": "当前模型未提供推理等级。",
			"notice.already": "已是当前模型，无需切换",
			"notice.alreadyEffort": "已是当前推理等级",
			"badge.reasoning": "推理",
			"badge.reasoningHint": "支持思考等级，切换后自动选到最大思考强度"
		};
		const en = {
			"trigger.fallback": "Select model",
			"trigger.selectAria": "Select model",
			"trigger.aria": "Select model, current {model}",
			"trigger.ariaEffort": "Select model, current {model}, reasoning effort {effort}",
			"menu.model": "Model",
			"menu.effort": "Effort",
			"search.placeholder": "Search models",
			"search.clearAria": "Clear search",
			"search.noMatch": "No models match “{query}”.",
			"group.toggleAria": "{name} ({count} models)",
			"effort.providerDefault": "Default",
			"status.loading": "Refreshing model list…",
			"error.action": "Model operation failed: {message}",
			"action.reload": "Reload",
			"warning.groupLoad": "{name} failed to load: {message}",
			"empty.models": "No models available.",
			"empty.efforts": "This model provides no reasoning effort levels.",
			"notice.already": "Already the current model",
			"notice.alreadyEffort": "Already the current effort",
			"badge.reasoning": "Reasoning",
			"badge.reasoningHint": "Supports reasoning levels; switches land on the strongest"
		};
		//#endregion
		//#region src/client/styles.ts
		/**
		* Stylesheet for the enhanced model seat.
		*
		* Injected as one `<style data-plugin="dsh-model-selector">` tag by the client
		* apply and removed again on unload. Class names are prefixed `dms-` so they
		* cannot collide with CSS-module hashes from other plugins. Colors come only
		* from `--dsw-*` theme tokens, matching the shipped Menu material.
		*/
		const CSS = `
.dms-root {
  position: relative;
  min-width: 0;
}

.dms-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  max-width: min(420px, calc(100vw - 48px));
  height: 28px;
  padding: 0 4px 0 8px;
  border: none;
  border-radius: 24px;
  outline: none;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  cursor: pointer;
}
.dms-trigger:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); }
.dms-trigger:focus-visible { box-shadow: 0 0 0 2px var(--dsw-alias-border-l3); }
.dms-trigger:disabled { color: var(--dsw-alias-label-dimmed); cursor: default; }

.dms-triggerLabel {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 20px;
}
.dms-triggerEffort {
  flex: 0 0 auto;
  line-height: 20px;
  color: var(--dsw-alias-label-caption);
}
.dms-triggerProvider {
  flex: 0 0 auto;
  max-width: 88px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--dsw-alias-label-caption);
  font-size: 11px;
  line-height: 20px;
  font-weight: 400;
}

.dms-chevron,
.dms-groupChevron,
.dms-cellChevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  line-height: 0;
}
.dms-chevron {
  color: var(--dsw-alias-label-caption);
  transition: transform 120ms ease;
}
.dms-chevronOpen { transform: rotate(180deg); }
.dms-groupChevron {
  color: var(--dsw-alias-label-tertiary);
  transition: transform 120ms ease;
}
.dms-groupChevronClosed { transform: rotate(-90deg); }
.dms-cellChevron { color: var(--dsw-alias-label-tertiary); }
.dms-check svg { display: block; }

.dms-menu {
  position: absolute;
  right: 0;
  bottom: calc(100% + 8px);
  z-index: 20;
  display: flex;
  flex-direction: column;
  width: min(280px, calc(100vw - 32px));
  max-height: min(420px, calc(100vh - 96px));
  overflow: hidden;
  padding: 4px 0 4px 4px;
  border: 1px solid var(--dsw-alias-border-inverted);
  border-radius: 12px;
  background: var(--dsw-specific-menu);
  box-shadow: var(--dsw-shadow-lv3);
  color: var(--dsw-alias-label-primary);
  --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);
  --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);
}
.dms-menuModel { border-right: none; }

.dms-status,
.dms-empty {
  flex: 0 0 auto;
  padding: 10px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 13px;
  line-height: 20px;
}

/* Provider-load failure strip: capped and scrollable so a long list of failed
   groups can never squeeze the model list out of the menu (E4). */
.dms-failures {
  flex: 0 0 auto;
  max-height: 96px;
  min-height: 0;
  overflow-y: auto;
}

.dms-error,
.dms-warning {
  flex: 0 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
  padding: 7px 8px;
  border-radius: 8px;
  background: var(--dsw-alias-interactive-bg-hover-danger);
  color: var(--dsw-alias-state-error-primary);
  font-size: 12px;
  line-height: 18px;
}
.dms-warning {
  background: var(--dsw-alias-bg-module-platform);
  color: var(--dsw-alias-state-warn-label);
}
.dms-retry {
  flex: 0 0 auto;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

/* Search box pinned above the scrollable list. */
.dms-search {
  position: relative;
  margin-bottom: 4px;
  margin-right: 4px;
  flex: 0 0 auto;
}
.dms-searchInput {
  box-sizing: border-box;
  width: 100%;
  height: 30px;
  padding: 0 30px 0 10px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  outline: none;
  background: var(--dsw-alias-bg-input);
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  line-height: 18px;
}
.dms-searchInput::placeholder { color: var(--dsw-alias-label-tertiary); }
.dms-searchInput:focus-visible { box-shadow: 0 0 0 2px var(--dsw-alias-border-l3); }
.dms-searchClear {
  position: absolute;
  top: 0;
  right: 0;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
}
.dms-searchClear:hover { color: var(--dsw-alias-label-primary); }

.dms-groups { flex: 1 1 auto; min-height: 0; overflow-y: auto; }
.dms-group + .dms-group { margin-top: 4px; }

/* Collapsible provider header: a full-width toggle button. */
.dms-groupHeader {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 5px 8px 3px;
  border: none;
  outline: none;
  background: var(--dsw-specific-menu);
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
}
.dms-groupHeader:hover { color: var(--dsw-alias-label-primary); }
.dms-groupName {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dms-groupCount { flex: 0 0 auto; color: var(--dsw-alias-label-dimmed); font-weight: 400; }

.dms-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 38px;
  padding: 6px 8px;
  border: none;
  border-radius: 10px;
  outline: none;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}
.dms-option:hover:not(:disabled),
.dms-option:focus-visible { background: var(--dsw-alias-interactive-bg-hover); }
.dms-option.dms-selected { background: var(--dsw-alias-interactive-bg-hover); }
.dms-option:disabled { color: var(--dsw-alias-label-dimmed); cursor: default; }

.dms-optionCopy {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}
.dms-nameRow {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.dms-modelName {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  color: inherit;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dms-badge {
  flex: 0 0 auto;
  padding: 0 6px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  color: var(--dsw-alias-label-caption);
  font-size: 10px;
  line-height: 16px;
  font-weight: 500;
}
.dms-notice {
  flex: 0 0 auto;
  margin: 4px 0 0;
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
}
.dms-description {
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dms-providerTag {
  overflow: hidden;
  color: var(--dsw-alias-label-dimmed);
  font-size: 12px;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dms-check {
  display: grid;
  place-items: center;
  flex: 0 0 18px;
  color: var(--dsw-alias-label-primary);
}

/* Two-level root cells. */
.dms-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 40px;
  padding: 0 10px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  line-height: 22px;
  cursor: pointer;
  text-align: left;
}
.dms-cell:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dms-cell + .dms-cell { margin-top: 6px; }
.dms-cellLabel {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dms-cellValue {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--dsw-alias-label-tertiary);
}
.dms-cellChevron { flex: 0 0 auto; color: var(--dsw-alias-label-tertiary); }
`;
		//#endregion
		//#region src/client/index.ts
		/**
		* dsh-model-selector — browser half.
		*
		* Replaces the shipped `conversation.input.model` seat with an enhanced one
		* (provider-group collapse + name search) while keeping the exact shared
		* per-session directory (`ctx.modelDirectories`) the /model popup reads, so
		* both entries stay in sync. Shadowing is the sanctioned seam: the slot is
		* `single`, so a registration at a LOWER priority than the shipped occupant
		* (default 0) becomes the rendered winner.
		*/
		/** Dictionary namespace owned by this plugin. */
		const NS = "modelSelector";
		/** Required services: the registry, session lookup, locale, and the slot seat. */
		const inject = [
			"slots",
			"sessions",
			"locale"
		];
		/**
		* Client plugin body: register the dictionaries and stylesheet, then take the
		* model seat over the shared directory once `modelDirectories` appears.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "dsh-model-selector: dictionaries");
			ctx.effect(() => {
				const tag = document.createElement("style");
				tag.dataset.plugin = "dsh-model-selector";
				tag.textContent = CSS;
				document.head.appendChild(tag);
				return () => {
					tag.remove();
				};
			}, "dsh-model-selector: styles");
			ctx.inject(["modelDirectories"], (scope) => {
				const models = scope.modelDirectories;
				const sessions = scope.sessions;
				scope.slots.inject("conversation.input.model", () => scope.slots.register({
					name: "conversation.input.model",
					locale: NS,
					priority: -1,
					inject: (sessionId) => {
						const directory = models.directoryFor(sessionId);
						const available = sessions.subagentAddress(sessionId) === void 0;
						return {
							available,
							directory: directory.store,
							load: () => {
								if (available) directory.load().catch(() => {});
							},
							select: (selection) => available ? directory.select(selection).then(() => true, () => false) : Promise.resolve(false)
						};
					}
				}, ModelSelect));
			});
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}

function sub_pasteInput(require) {
    const React = require('react');
    const h = React.createElement;
    const SOURCE = 'dsh-paste-input';
    const API = '/dsh-paste-input/v1';
    const records = new Map();
    const listeners = new Set();
    let revision = 0;

    // ── locale: prefer the harness locale service (follows the app/system
    // language, including the DSH Language setting); fall back to the
    // browser language. `uiZh()` reads the live state at call time.
    let localeService = undefined;
    function uiZh() {
      try {
        const active = localeService?.getLocale?.()?.active;
        if (typeof active === 'string') return active.toLowerCase().startsWith('zh');
      } catch { /* locale service is optional */ }
      return typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh');
    }

    const css = `
      .dshca-wrap{position:relative;display:inline-flex;align-items:center}
      .dshca-button{width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer;padding:0}
      .dshca-button:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}
      .dshca-button:disabled{opacity:.4;cursor:default}
      .dshca-menu{position:absolute;left:0;bottom:34px;z-index:20;min-width:142px;padding:5px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-base);box-shadow:var(--dsw-shadow-lv3);display:grid;gap:2px}
      .dshca-menu button{border:0;border-radius:7px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:28px;text-align:left;padding:0 9px;cursor:pointer}
      .dshca-menu button:hover{background:var(--dsw-alias-interactive-bg-hover)}
      .dshca-dock{box-sizing:border-box;width:calc(100% - 32px);max-width:var(--dsh-composer-card-max-width,960px);margin:0 auto;display:flex;flex-wrap:wrap;gap:6px;padding:0 2px 6px}
      .dshca-chip{max-width:100%;min-width:min(180px,100%);height:32px;box-sizing:border-box;display:flex;align-items:center;gap:7px;padding:0 7px 0 10px;border:1px solid var(--dsw-alias-border-l1);border-radius:9px;background:var(--dsw-specific-tip);color:var(--dsw-alias-label-primary);font-size:12px}
      .dshca-chip[data-status=uploading]{border-color:var(--dsw-alias-state-business-primary)}
      .dshca-chip[data-status=error]{border-color:var(--dsw-alias-state-error-primary)}
      .dshca-chip-icon{flex:none;display:inline-flex;align-items:center;color:var(--dsw-alias-label-secondary)}
      .dshca-chip-icon svg{width:14px;height:14px}
      .dshca-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:320px}
      .dshca-meta{flex:none;color:var(--dsw-alias-label-caption);white-space:nowrap}
      .dshca-remove{flex:none;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:50%;background:transparent;color:var(--dsw-alias-label-caption);cursor:pointer;padding:0;font-size:16px;line-height:1}
      .dshca-remove:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
      .dshca-error{max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-state-error-primary)}
      .dshca-settings{display:flex;flex-direction:column;gap:18px;width:100%;color:var(--dsw-alias-label-primary)}
      .dshca-settings-head{display:flex;flex-direction:column;gap:5px}
      .dshca-settings-title{font-size:18px;line-height:26px;font-weight:600}
      .dshca-settings-copy{max-width:620px;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px}
      .dshca-settings-card{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;padding:16px;border:1px solid var(--dsw-alias-border-l1);border-radius:14px;background:var(--dsw-alias-bg-layer-1)}
      .dshca-settings-scope{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:-10px;color:var(--dsw-alias-label-secondary);font-size:12px}
      .dshca-stat{display:flex;flex-direction:column;gap:4px;min-width:0}
      .dshca-stat strong{font-size:20px;line-height:28px;font-weight:600;font-variant-numeric:tabular-nums}
      .dshca-stat span{color:var(--dsw-alias-label-caption);font-size:12px}
      .dshca-settings-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
      .dshca-settings-action{height:32px;padding:0 12px;border:1px solid var(--dsw-alias-border-l1);border-radius:9px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;cursor:pointer}
      .dshca-settings-action:hover{background:var(--dsw-alias-interactive-bg-hover)}
      .dshca-settings-action[data-danger=true]{color:var(--dsw-alias-state-error-primary)}
      .dshca-settings-action:disabled{opacity:.45;cursor:default}
      .dshca-settings-status{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}
      @media(max-width:720px){.dshca-settings-card{grid-template-columns:1fr}.dshca-dock{width:calc(100% - 16px)}}
      .dshca-notice-overlay{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;background:var(--dsw-alias-bg-mask-1);backdrop-filter:var(--dsw-mask-blur)}
      .dshca-notice{width:min(420px,calc(100vw - 48px));box-sizing:border-box;padding:18px;border:1px solid var(--dsw-alias-border-l1);border-radius:14px;background:var(--dsw-alias-bg-base);box-shadow:var(--dsw-shadow-lv3);display:flex;flex-direction:column;gap:10px;color:var(--dsw-alias-label-primary)}
      .dshca-notice-title{font-size:15px;font-weight:600}
      .dshca-notice-copy{font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary)}
      .dshca-notice-check{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--dsw-alias-label-secondary);cursor:pointer;user-select:none}
      .dshca-notice-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:2px}
      .dshca-notice-actions button{height:30px;padding:0 14px;border:1px solid var(--dsw-alias-border-l1);border-radius:9px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;cursor:pointer}
      .dshca-notice-actions button:hover{background:var(--dsw-alias-interactive-bg-hover)}
      .dshca-notice-actions .dshca-notice-ok{background:var(--dsw-alias-button-primary-fill);border-color:transparent;color:var(--dsw-alias-label-primary-foreground)}
      .dshca-toast{position:fixed;left:50%;bottom:64px;transform:translateX(-50%);z-index:100;max-width:min(560px,calc(100vw - 48px));box-sizing:border-box;padding:9px 14px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-base);box-shadow:var(--dsw-shadow-lv3);color:var(--dsw-alias-label-primary);font-size:13px;line-height:18px;pointer-events:none;opacity:0;transition:opacity .18s ease}
      .dshca-toast[data-show=true]{opacity:1}
      .dshca-chat-attachments{display:flex;flex-wrap:wrap;gap:6px;padding:0}
      .dshca-chat-chip{position:relative;max-width:100%;min-width:0;height:30px;box-sizing:border-box;display:inline-flex;align-items:center;gap:7px;padding:0 10px;border:1px solid var(--dsw-alias-border-l1);border-radius:9px;background:var(--dsw-specific-tip);color:var(--dsw-alias-label-primary);font-size:12px;cursor:pointer}
      .dshca-chat-chip:hover{border-color:var(--dsw-alias-state-business-primary)}
      .dshca-chat-chip-icon{flex:none;display:inline-flex;align-items:center;color:var(--dsw-alias-label-secondary)}
      .dshca-chat-chip-icon svg{width:14px;height:14px}
      .dshca-chat-chip-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .dshca-chat-chip-meta{flex:none;color:var(--dsw-alias-label-caption);white-space:nowrap}
      .dshca-chat-tip{display:none;position:absolute;bottom:calc(100% + 6px);left:0;z-index:40;min-width:260px;max-width:min(520px,78vw);box-sizing:border-box;padding:10px 12px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-base);box-shadow:var(--dsw-shadow-lv3);font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary);white-space:pre-wrap;word-break:break-all;pointer-events:none}
      .dshca-chat-chip:hover .dshca-chat-tip{display:block}
      [data-paste-folded="1"]{display:none!important}
      .dshca-chat-usertext{flex:0 0 100%;white-space:pre-wrap;word-break:break-word;color:inherit;font:inherit}
    `;

    if (document.querySelector('style[data-plugin-css="@dsh-community/dsh-paste-input"]') === null) {
      const style = document.createElement('style');
      style.dataset.plugin = '@dsh-community/dsh-paste-input';
      style.dataset.pluginCss = '@dsh-community/dsh-paste-input';
      style.textContent = css;
      document.head.appendChild(style);
    }

    function changed() {
      revision += 1;
      for (const listener of [...listeners]) listener();
    }

    function useRevision() {
      return React.useSyncExternalStore(
        listener => {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
        () => revision,
        () => revision,
      );
    }

    function id() {
      return globalThis.crypto?.randomUUID?.()
        ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    }

    function humanBytes(value) {
      if (value < 1024) return `${value} B`;
      const units = ['KiB', 'MiB', 'GiB', 'TiB'];
      let next = value / 1024;
      let unit = units[0];
      for (let index = 1; index < units.length && next >= 1024; index += 1) {
        next /= 1024;
        unit = units[index];
      }
      return `${next >= 10 ? next.toFixed(0) : next.toFixed(1)} ${unit}`;
    }

    function compactReferenceLabel(label) {
      const prefix = label.length > 8 ? `${label.slice(0, 8)}…` : label;
      return `📎 ${prefix}`;
    }

    function normalizeRelativePath(value, fallback) {
      const path = (value || fallback).replaceAll('\\', '/').replace(/^\/+/, '');
      const parts = path.split('/').filter(Boolean);
      if (parts.length === 0 || parts.some(part => part === '.' || part === '..')) {
        throw new Error(`Unsafe attachment path: ${path}`);
      }
      return parts.join('/');
    }

    function validateItems(items) {
      if (items.length === 0) throw new Error('No files were selected');
      if (items.length > 10_000) throw new Error('Selection exceeds 10,000 files');
      let total = 0;
      const paths = new Set();
      for (const item of items) {
        if (item.path.split('/').length > 64) throw new Error(`${item.path} exceeds 64 directory levels`);
        if (item.file.size > 1024 ** 3) throw new Error(`${item.path} exceeds 1 GiB`);
        total += item.file.size;
        if (total > 2 * 1024 ** 3) throw new Error('Selection exceeds 2 GiB');
        if (paths.has(item.path)) throw new Error(`Duplicate attachment path: ${item.path}`);
        paths.add(item.path);
      }
      return total;
    }

    function filesFromList(list) {
      return [...list].map(file => ({
        file,
        path: normalizeRelativePath(file.webkitRelativePath, file.name),
      }));
    }

    function entryFile(entry) {
      return new Promise((resolve, reject) => entry.file(resolve, reject));
    }

    async function readAllEntries(reader) {
      const output = [];
      while (true) {
        const batch = await new Promise((resolve, reject) => reader.readEntries(resolve, reject));
        if (batch.length === 0) return output;
        output.push(...batch);
      }
    }

    async function walkEntry(entry, prefix = '') {
      const relative = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
      if (entry.isFile) {
        const file = await entryFile(entry);
        return [{ file, path: normalizeRelativePath(relative, file.name) }];
      }
      if (!entry.isDirectory) return [];
      const children = await readAllEntries(entry.createReader());
      const nested = await Promise.all(children.map(child => walkEntry(child, relative)));
      return nested.flat();
    }

    async function filesFromDrop(dataTransfer) {
      const itemEntries = [...dataTransfer.items]
        .filter(item => item.kind === 'file')
        .map(item => item.webkitGetAsEntry?.())
        .filter(Boolean);
      if (itemEntries.length === 0) return filesFromList(dataTransfer.files);
      const nested = await Promise.all(itemEntries.map(entry => walkEntry(entry)));
      return nested.flat();
    }

    async function responseJson(response) {
      let value;
      try {
        value = await response.json();
      } catch {
        throw new Error(`Attachment Host returned HTTP ${response.status}`);
      }
      if (!response.ok || value?.ok !== true) {
        throw new Error(value?.error?.message ?? `Attachment Host returned HTTP ${response.status}`);
      }
      return value;
    }

    function modelMessage(committed) {
      const visible = committed.files.slice(0, 50);
      const lines = [
        // Leading/trailing blank lines keep the markers on their own lines
        // even when the user typed words right before/after the chip.
        '',
        '==== DSH_PASTE_INPUT_V1 ====',
        committed.root,
        '',
        `Files: ${committed.files.length}`,
        `Manifest: ${committed.manifest.slice(committed.root.length + 1)}`,
        'Attached files (paths are relative to the root above):',
        ...visible.map(file => `- ${JSON.stringify(file.actualPath)} (${humanBytes(file.size)})${file.originalPath === file.actualPath ? '' : `; original=${JSON.stringify(file.originalPath)}`}`),
      ];
      if (committed.files.length > visible.length) {
        lines.push(`- ... ${committed.files.length - visible.length} more; read the manifest for the complete mapping`);
      }
      lines.push('==== END DSH_PASTE_INPUT ====', '');
      return lines.join('\n');
    }

    async function upload(record, signal) {
      if (record.committed !== undefined) return record.modelText;
      if (record.inflight !== undefined) return record.inflight;
      const task = (async () => {
        record.status = 'uploading';
        record.error = undefined;
        record.uploaded = 0;
        changed();
        let batchId;
        try {
          const created = await responseJson(await fetch(`${API}/batches`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              sessionId: record.sessionId,
              files: record.items.map(item => ({
                path: item.path,
                size: item.file.size,
                type: item.file.type,
                lastModified: item.file.lastModified,
              })),
            }),
            signal,
          }));
          batchId = created.batchId;
          let cursor = 0;
          // Throttle progress notifications: per-file changed() storms the
          // chips' sync-external-store re-render on large batches (N files =
          // N renders). Batch at ~120ms; the commit path always fires a final
          // changed(), so the settled state is never missed.
          let lastProgressAt = 0;
          const worker = async () => {
            while (cursor < record.items.length) {
              const index = cursor++;
              const item = record.items[index];
              await responseJson(await fetch(`${API}/batches/${encodeURIComponent(batchId)}/files/${index}`, {
                method: 'PUT',
                headers: { 'content-type': 'application/octet-stream' },
                body: item.file,
                signal,
              }));
              record.uploaded += 1;
              const now = Date.now();
              if (now - lastProgressAt >= 120 || record.uploaded === record.items.length) {
                lastProgressAt = now;
                changed();
              }
            }
          };
          await Promise.all(Array.from({ length: Math.min(2, record.items.length) }, worker));
          const committed = await responseJson(await fetch(
            `${API}/batches/${encodeURIComponent(batchId)}/commit`,
            { method: 'POST', signal },
          ));
          record.committed = committed;
          record.modelText = modelMessage(committed);
          record.status = 'uploaded';
          // Release the File references as soon as the batch is committed:
          // upload() early-returns once `committed` is set, and the dock chip
          // only reads items.length while status is 'uploading', so the files
          // are dead weight here (and can keep large blobs/handles alive for
          // the whole page lifetime otherwise).
          record.items = [];
          changed();
          return record.modelText;
        } catch (cause) {
          if (batchId !== undefined) {
            fetch(`${API}/batches/${encodeURIComponent(batchId)}`, { method: 'DELETE' }).catch(() => {});
          }
          record.status = 'error';
          record.error = cause instanceof Error ? cause.message : String(cause);
          changed();
          throw cause;
        } finally {
          record.inflight = undefined;
        }
      })();
      record.inflight = task;
      return task;
    }

    function pick(kind, onFiles, onError) {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      if (kind === 'folder') input.setAttribute('webkitdirectory', '');
      input.addEventListener('change', () => {
        try {
          onFiles(filesFromList(input.files ?? []));
        } catch (cause) {
          onError(cause);
        }
      }, { once: true });
      input.click();
    }

        // ── paste support: clipboard files (screenshots, copied images) ──────────
    const NOTICE_KEY = 'dsh-paste-input.notice-dismissed.v1';
    let noticeDismissed = false;
    try { noticeDismissed = localStorage.getItem(NOTICE_KEY) === '1'; } catch { /* storage unavailable */ }

    // Reuse a single toast element: rapid consecutive failures would
    // otherwise stack N toasts + 2N timers in the DOM.
    let currentToast = null;
    function showToast(message) {
      if (currentToast !== null) {
        clearTimeout(currentToast._timer);
        clearTimeout(currentToast._removeTimer);
        currentToast.remove();
        currentToast = null;
      }
      const toast = document.createElement('div');
      toast.className = 'dshca-toast';
      toast.textContent = message;
      document.body.appendChild(toast);
      requestAnimationFrame(() => { toast.dataset.show = 'true'; });
      toast._timer = setTimeout(() => {
        toast.dataset.show = 'false';
        toast._removeTimer = setTimeout(() => toast.remove(), 220);
      }, 4000);
      currentToast = toast;
    }

    function showPasteNotice(onConfirm, onCancel) {
      const overlay = document.createElement('div');
      overlay.className = 'dshca-notice-overlay';
      const card = document.createElement('div');
      card.className = 'dshca-notice';
      const zh = uiZh();
      card.setAttribute('role', 'dialog');
      card.setAttribute('aria-modal', 'true');
      card.setAttribute('aria-label', zh ? '粘贴文件提示' : 'Paste file notice');
      const title = document.createElement('div');
      title.className = 'dshca-notice-title';
      title.textContent = zh ? '粘贴文件提示' : 'Paste file notice';
      const copy = document.createElement('div');
      copy.className = 'dshca-notice-copy';
      copy.textContent = zh
        ? '你粘贴了图片或文件。DSH Paste Input 会把它们复制到当前会话工作区的临时附件目录（.dsh/tmp/attachments/），并在发送时随消息一起交给模型。'
        : 'You pasted an image or file. DSH Paste Input copies it into the current session workspace temporary attachments directory (.dsh/tmp/attachments/) and hands it to the model with your message.';
      const label = document.createElement('label');
      label.className = 'dshca-notice-check';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = true;
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(zh ? ' 我已了解，不再提示' : ' Got it \u2014 don\u2019t ask again'));
      const actions = document.createElement('div');
      actions.className = 'dshca-notice-actions';
      const cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.className = 'dshca-notice-cancel';
      cancel.textContent = zh ? '取消' : 'Cancel';
      const ok = document.createElement('button');
      ok.type = 'button';
      ok.className = 'dshca-notice-ok';
      ok.textContent = zh ? '确定' : 'OK';
      actions.appendChild(cancel);
      actions.appendChild(ok);
      card.appendChild(title);
      card.appendChild(copy);
      card.appendChild(label);
      card.appendChild(actions);
      overlay.appendChild(card);
      document.body.appendChild(overlay);
      ok.addEventListener('click', () => {
        try { if (checkbox.checked) localStorage.setItem(NOTICE_KEY, '1'); } catch { /* storage unavailable */ }
        noticeDismissed = noticeDismissed || checkbox.checked;
        overlay.remove();
        onConfirm();
      });
      cancel.addEventListener('click', () => { overlay.remove(); onCancel?.(); });
      overlay.addEventListener('click', event => { if (event.target === overlay) { overlay.remove(); onCancel?.(); } });
    }

    function Paperclip() {
      return h('svg', { width: 15, height: 15, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('path', {
          d: 'M5.2 8.6 9.8 4a2.1 2.1 0 1 1 3 3l-5.9 5.9a3.4 3.4 0 0 1-4.8-4.8l6-6',
          stroke: 'currentColor',
          strokeWidth: 1.4,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }));
    }

    function AttachButton(props) {
      const [open, setOpen] = React.useState(false);
      const [busy, setBusy] = React.useState(false);
      const [message, setMessage] = React.useState('');
      const closeTimer = React.useRef(null);
      const locked = props.input.phase !== 'plain';

      const cancelAutoClose = React.useCallback(() => {
        if (closeTimer.current) {
          clearTimeout(closeTimer.current);
          closeTimer.current = null;
        }
      }, []);

      const scheduleAutoClose = React.useCallback(() => {
        cancelAutoClose();
        closeTimer.current = setTimeout(() => setOpen(false), 150);
      }, [cancelAutoClose]);

      React.useEffect(() => cancelAutoClose, [cancelAutoClose]);

      const accept = React.useCallback(async (itemsOrPromise) => {
        setBusy(true);
        setMessage('');
        try {
          const items = await itemsOrPromise;
          await props.add(items);
          setOpen(false);
        } catch (cause) {
          setMessage(cause instanceof Error ? cause.message : String(cause));
        } finally {
          setBusy(false);
        }
      }, [props.add]);

      return h('div', {
        className: 'dshca-wrap',
        onMouseEnter: cancelAutoClose,
        onMouseLeave: scheduleAutoClose,
      },
        h('button', {
          type: 'button',
          className: 'dshca-button',
          title: message || (uiZh() ? '附加文件或文件夹' : 'Attach files or a folder'),
          'aria-label': message || (uiZh() ? '附加文件或文件夹' : 'Attach files or a folder'),
          'aria-expanded': open,
          disabled: locked || busy,
          onClick: () => setOpen(value => !value),
        }, h(Paperclip)),
        open && h('div', { className: 'dshca-menu', role: 'menu' },
          h('button', {
            type: 'button',
            role: 'menuitem',
            onClick: () => pick('files', items => void accept(items), cause => setMessage(String(cause))),
          }, uiZh() ? '选择文件' : 'Choose files'),
          h('button', {
            type: 'button',
            role: 'menuitem',
            onClick: () => pick('folder', items => void accept(items), cause => setMessage(String(cause))),
          }, uiZh() ? '选择文件夹' : 'Choose folder')));
    }

    function AttachmentChips(props, className) {
      const occurrences = props.input.occurrences.filter(item => item.source === SOURCE);
      if (occurrences.length === 0) return null;
      return h('div', { className }, ...occurrences.map(occurrence => {
        const record = records.get(occurrence.ref);
        const status = record?.status ?? 'missing';
        const meta = status === 'uploading'
          ? `${record.uploaded}/${record.items.length}`
          : status === 'uploaded' ? 'copied' : record === undefined ? 'unavailable' : humanBytes(record.total);
        return h('div', { className: 'dshca-chip', 'data-status': status, key: occurrence.occurrenceId },
          h('span', { className: 'dshca-chip-icon', 'aria-hidden': true }, h(Paperclip)),
          h('span', { className: 'dshca-name', title: record?.label ?? occurrence.label }, record?.label ?? occurrence.label),
          h('span', { className: status === 'error' ? 'dshca-error' : 'dshca-meta', title: record?.error },
            status === 'error' ? record.error : meta),
          h('button', {
            type: 'button',
            className: 'dshca-remove',
            'aria-label': `Remove ${record?.label ?? occurrence.label}`,
            disabled: props.input.phase !== 'plain',
            onClick: () => props.remove(occurrence),
          }, '×'));
      }));
    }

    function AttachmentDock(props) {
      useRevision();
      return AttachmentChips(props, 'dshca-dock');
    }

    function attachmentCopy() {
      const zh = uiZh();
      return zh ? {
        nav: '多媒体输入',
        title: '多媒体输入与文件管理',
        copy: '附件只在发送时复制到当前会话工作区；从输入框删除的附件不会上传。空间统计仅在打开本页或手动刷新时执行。',
        sends: '已发送批次',
        files: '文件',
        size: '占用空间',
        refresh: '刷新统计',
        currentScope: '当前会话',
        workspaceScope: usage => `当前工作区 · ${usage.sessionDirectories} 个有附件的会话`,
        cleanCurrent: '清理当前会话附件',
        cleanWorkspace: '清理当前工作区全部会话附件',
        confirmCurrent: '将只删除当前会话中由 DSH Paste Input 创建的临时附件。请再次点击确认。',
        confirmWorkspace: '将删除当前工作区所有会话由 DSH Paste Input 创建的临时附件；不会影响其他工作区。请再次点击确认。',
        confirmCurrentButton: '再次点击：清理当前会话',
        confirmWorkspaceButton: '再次点击：清理当前工作区',
        cancel: '取消',
        noSession: '请先打开一个会话。',
        loading: '正在读取当前会话附件…',
        cleanedCurrent: result => `已清理当前会话 ${result.deletedFiles} 个文件（${humanBytes(result.deletedBytes)}）。`,
        cleanedWorkspace: result => `已清理当前工作区 ${result.deletedSessionDirectories} 个会话目录、${result.deletedFiles} 个文件（${humanBytes(result.deletedBytes)}）。`,
      } : {
        nav: 'Multimedia input',
        title: 'Multimedia input & file management',
        copy: 'Attachments are copied into the active workspace only when you send. Removing one from the composer cancels it. Usage is read only when this page opens or you refresh it.',
        sends: 'Sent batches',
        files: 'Files',
        size: 'Disk usage',
        refresh: 'Refresh usage',
        currentScope: 'Active session',
        workspaceScope: usage => `Active workspace · ${usage.sessionDirectories} sessions with attachments`,
        cleanCurrent: 'Clean active session',
        cleanWorkspace: 'Clean every session in this workspace',
        confirmCurrent: 'Only temporary attachments created by DSH Paste Input in the active session will be deleted. Click again to confirm.',
        confirmWorkspace: 'Temporary attachments created by DSH Paste Input in every session in this workspace will be deleted. Other workspaces are not affected. Click again to confirm.',
        confirmCurrentButton: 'Confirm: clean active session',
        confirmWorkspaceButton: 'Confirm: clean workspace',
        cancel: 'Cancel',
        noSession: 'Open a session first.',
        loading: 'Reading attachments for the active session…',
        cleanedCurrent: result => `Removed ${result.deletedFiles} files from the active session (${humanBytes(result.deletedBytes)}).`,
        cleanedWorkspace: result => `Removed ${result.deletedFiles} files from ${result.deletedSessionDirectories} session directories in this workspace (${humanBytes(result.deletedBytes)}).`,
      };
    }

    async function sessionRequest(path, sessionId, signal) {
      return responseJson(await fetch(`${API}${path}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sessionId }),
        signal,
      }));
    }

    function AttachmentSettings(props) {
      const copy = attachmentCopy();
      const list = React.useSyncExternalStore(
        listener => props.sessions.list.subscribe(listener),
        () => props.sessions.list.getSnapshot(),
        () => props.sessions.list.getSnapshot(),
      );
      const sessionId = list.current;
      const [usage, setUsage] = React.useState({ sends: 0, files: 0, bytes: 0 });
      const [workspaceUsage, setWorkspaceUsage] = React.useState({ sessionDirectories: 0, sends: 0, files: 0, bytes: 0 });
      const [status, setStatus] = React.useState(sessionId === undefined ? copy.noSession : copy.loading);
      const [busy, setBusy] = React.useState(false);
      const [confirming, setConfirming] = React.useState(null);

      const load = React.useCallback(async (signal) => {
        if (sessionId === undefined) {
          setUsage({ sends: 0, files: 0, bytes: 0 });
          setWorkspaceUsage({ sessionDirectories: 0, sends: 0, files: 0, bytes: 0 });
          setStatus(copy.noSession);
          return;
        }
        setBusy(true);
        setStatus(copy.loading);
        try {
          const [next, workspace] = await Promise.all([
            sessionRequest('/usage/session', sessionId, signal),
            sessionRequest('/usage/workspace', sessionId, signal),
          ]);
          setUsage({ sends: next.sends, files: next.files, bytes: next.bytes });
          setWorkspaceUsage({
            sessionDirectories: workspace.sessionDirectories,
            sends: workspace.sends,
            files: workspace.files,
            bytes: workspace.bytes,
          });
          setStatus('');
        } catch (cause) {
          if (cause?.name !== 'AbortError') setStatus(cause instanceof Error ? cause.message : String(cause));
        } finally {
          if (!signal?.aborted) setBusy(false);
        }
      }, [sessionId]);

      React.useEffect(() => {
        const controller = new AbortController();
        void load(controller.signal);
        return () => controller.abort();
      }, [load]);

      const clean = async (scope) => {
        if (sessionId === undefined) return;
        if (confirming !== scope) {
          setConfirming(scope);
          setStatus(scope === 'session' ? copy.confirmCurrent : copy.confirmWorkspace);
          return;
        }
        setConfirming(null);
        setBusy(true);
        setStatus('');
        try {
          const result = await sessionRequest(`/cleanup/${scope}`, sessionId);
          if (scope === 'workspace') {
            setUsage({ sends: 0, files: 0, bytes: 0 });
            setWorkspaceUsage({ sessionDirectories: 0, sends: 0, files: 0, bytes: 0 });
            setStatus(copy.cleanedWorkspace(result));
          } else {
            setUsage({ sends: 0, files: 0, bytes: 0 });
            setWorkspaceUsage(current => ({
              sessionDirectories: Math.max(0, current.sessionDirectories - 1),
              sends: Math.max(0, current.sends - result.deletedSends),
              files: Math.max(0, current.files - result.deletedFiles),
              bytes: Math.max(0, current.bytes - result.deletedBytes),
            }));
            setStatus(copy.cleanedCurrent(result));
          }
        } catch (cause) {
          setStatus(cause instanceof Error ? cause.message : String(cause));
        } finally {
          setBusy(false);
        }
      };

      return h('div', { className: 'dshca-settings' },
        h('div', { className: 'dshca-settings-head' },
          h('div', { className: 'dshca-settings-title' }, copy.title),
          h('div', { className: 'dshca-settings-copy' }, copy.copy)),
        h('div', { className: 'dshca-settings-scope' }, h('span', null, copy.currentScope)),
        h('div', { className: 'dshca-settings-card' },
          h('div', { className: 'dshca-stat' }, h('strong', null, String(usage.sends)), h('span', null, copy.sends)),
          h('div', { className: 'dshca-stat' }, h('strong', null, String(usage.files)), h('span', null, copy.files)),
          h('div', { className: 'dshca-stat' }, h('strong', null, humanBytes(usage.bytes)), h('span', null, copy.size))),
        h('div', { className: 'dshca-settings-actions' },
          h('button', {
            type: 'button',
            className: 'dshca-settings-action',
            disabled: busy || sessionId === undefined,
            onClick: () => void load(),
          }, copy.refresh),
          h('button', {
            type: 'button',
            className: 'dshca-settings-action',
            'data-danger': true,
            disabled: busy || sessionId === undefined || usage.sends === 0,
            onClick: () => void clean('session'),
          }, confirming === 'session' ? copy.confirmCurrentButton : copy.cleanCurrent),
          h('button', {
            type: 'button',
            className: 'dshca-settings-action',
            'data-danger': true,
            disabled: busy || sessionId === undefined || workspaceUsage.sends === 0,
            onClick: () => void clean('workspace'),
          }, confirming === 'workspace' ? copy.confirmWorkspaceButton : copy.cleanWorkspace),
          confirming !== null && h('button', {
            type: 'button',
            className: 'dshca-settings-action',
            disabled: busy,
            onClick: () => {
              setConfirming(null);
              setStatus('');
            },
          }, copy.cancel)),
        h('div', { className: 'dshca-settings-status' }, copy.workspaceScope(workspaceUsage), ' · ', humanBytes(workspaceUsage.bytes)),
        status && h('div', { className: 'dshca-settings-status', role: 'status' }, status));
    }

        // ── bubble-side attachment folding: hide the raw path block in user
    // bubbles and render attachment chips in its place (DOM projection; the
    // original text stays in the DOM for copy/logs, React re-renders are
    // re-folded by the observer).
    function parseAttachmentBlock(text) {
      const startMarker = '==== DSH_PASTE_INPUT_V1 ====';
      const endMarker = '==== END DSH_PASTE_INPUT ====';
      const lines = text.split('\n');
      // Marker format only: legacy unmarked history is intentionally not
      // folded. Prefix matching: user words typed right after the attachment
      // chip can land on the same line as the end marker.
      const startIdx = lines.findIndex(line => line.trim().startsWith(startMarker));
      const endIdx = startIdx !== -1 ? lines.findIndex((line, i) => i > startIdx && line.trim().startsWith(endMarker)) : -1;
      if (startIdx === -1 || endIdx === -1) return null;
      const startMatch = /^(==== DSH_PASTE_INPUT_V1 ====)/.exec(lines[startIdx].trim());
      const endMatch = /^(==== END DSH_PASTE_INPUT ====)/.exec(lines[endIdx].trim());
      if (startMatch === null || endMatch === null) return null;
      const root = lines[startIdx + 1].trim();
      if (root === '') return null;
      // Line start offsets, to slice the exact attachment block out of the
      // bubble text while keeping the user's own words around it.
      const lineStarts = [0];
      for (let i = 0; i < text.length; i += 1) {
        if (text.charCodeAt(i) === 10) lineStarts.push(i + 1);
      }
      let manifest = '';
      const manifestLine = lines[startIdx + 4];
      if (typeof manifestLine === 'string' && manifestLine.startsWith('Manifest: ')) {
        manifest = manifestLine.slice('Manifest: '.length);
      }
      const listIndex = lines.findIndex(line => line.startsWith('Attached files'));
      if (listIndex === -1) return null;
      const files = [];
      const blockStart = lineStarts[startIdx];
      // End marker matched to its own length, so user words on the same
      // line stay outside the folded block.
      const blockEnd = lineStarts[endIdx] + endMatch[1].length;
      for (let index = listIndex + 1; index < endIdx; index += 1) {
        const line = lines[index];
        if (!line.startsWith('- ')) continue;
        const match = /^- "((?:[^"\\]|\\.)*)" \((\d+(?:\.\d+)? (?:B|KiB|MiB|GiB|TiB))\)(?:; original=("(?:[^"\\]|\\.)*"))?/.exec(line);
        if (match === null) continue;
        let original = undefined;
        if (match[3] !== undefined) {
          try { original = JSON.parse(match[3]); } catch { original = match[3]; }
        }
        files.push({ path: match[1], size: match[2], original });
      }
      if (files.length === 0) {
        console.warn('dsh-paste-input: attachment block parsed with no files:', text.slice(0, 200));
        return null;
      }
      return { root, manifest, files, blockStart, blockEnd, raw: text.slice(blockStart, blockEnd) };
    }

    /** Parse every attachment block in a bubble text (multi-file sends produce one block per file). */
    function parseAttachmentBlocks(text) {
      const blocks = [];
      let cursor = 0;
      while (cursor < text.length) {
        const remaining = text.slice(cursor);
        const parsed = parseAttachmentBlock(remaining);
        if (parsed === null) break;
        const blockStart = parsed.blockStart + cursor;
        const blockEnd = parsed.blockEnd + cursor;
        blocks.push({
          root: parsed.root,
          manifest: parsed.manifest,
          files: parsed.files,
          blockStart,
          blockEnd,
          raw: text.slice(blockStart, blockEnd),
        });
        cursor = blockEnd;
      }
      return blocks;
    }

    // ── bubble-side attachment folding: hide the raw path block in user
    // bubbles and render attachment chips in its place (DOM projection; the
    // original text stays in the DOM for copy/logs, React re-renders are
    // re-folded by the observer).
    // WeakSet: DOM nodes only — entries are released when the bubble is
    // removed, instead of holding node references for the page lifetime.
    const warned = new WeakSet();
    function foldAttachmentDiv(div) {
      const text = div.textContent ?? '';
      // Marker-only format; the original text div is hidden with CSS (React
      // never rewrites data attributes the way it rewrites textContent), and
      // the user's own words plus chips render into one owned wrap.
      if (!text.includes('==== DSH_PASTE_INPUT_V1 ====')) return;
      const blocks = parseAttachmentBlocks(text);
      if (blocks.length === 0) {
        // Not a foldable block; warn once per container (the sweep retries,
        // so an earlier parse miss can still fold later).
        if (!warned.has(div)) {
          warned.add(div);
          console.warn('dsh-paste-input: fold skipped (parse failed):', text.slice(0, 300));
        }
        return;
      }
      if (div.dataset.pasteFolded === undefined) div.dataset.pasteFolded = '1';
      if (div.dataset.pasteId === undefined) div.dataset.pasteId = id();
      const pasteId = div.dataset.pasteId;
      // If this exact container already has a live wrap, leave it. The
      // container's textContent is unchanged (a React rebuild would hand us a
      // fresh element without our data-paste-id), so the existing chips are
      // still valid. Rebuilding on every observer tick tears the subtree down
      // and re-inserts it ~8×/s for nothing, janking the page. Stale wraps from
      // React-rebuilt siblings are reaped by the orphan sweep in foldScan().
      if (div.parentElement !== null) {
        const existing = div.parentElement.querySelector('[data-paste-folded="container"][data-for="' + pasteId + '"]');
        if (existing !== null) return;
      }
      const wrap = document.createElement('div');
      wrap.className = 'dshca-chat-attachments';
      wrap.dataset.pasteFolded = 'container';
      wrap.dataset.for = pasteId;
      // Interleaved projection in source order: the user's own words before
      // each attachment block, then that block's file chips. Words around
      // different blocks keep their relative order (a multi-file send renders
      // text/chip/text/chip instead of pooling every chip after one merged
      // text block), and whitespace-only gaps between adjacent blocks collapse
      // so their chips flow as one run. Segments are trimmed of the protocol's
      // guard blank lines (the marker block owns those, not the user's text).
      let pos = 0;
      for (const block of blocks) {
        const before = text.slice(pos, block.blockStart).trim();
        if (before !== '') {
          const words = document.createElement('div');
          words.className = 'dshca-chat-usertext';
          words.textContent = before;
          wrap.appendChild(words);
        }
        for (const file of block.files) {
          const chip = document.createElement('div');
          chip.className = 'dshca-chat-chip';
          const icon = document.createElement('span');
          icon.className = 'dshca-chat-chip-icon';
          icon.setAttribute('aria-hidden', 'true');
          icon.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M5.2 8.6 9.8 4a2.1 2.1 0 1 1 3 3l-5.9 5.9a3.4 3.4 0 0 1-4.8-4.8l6-6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          const name = document.createElement('span');
          name.className = 'dshca-chat-chip-name';
          name.textContent = file.path;
          const meta = document.createElement('span');
          meta.className = 'dshca-chat-chip-meta';
          meta.textContent = file.size;
          const absolute = block.root + '/' + file.path;
          const tip = document.createElement('div');
          tip.className = 'dshca-chat-tip';
          const zh = uiZh();
          const tipLines = [];
          if (block.raw !== undefined) {
            // Full original attachment block, exactly as sent (root path,
            // protocol header, manifest, file list).
            tipLines.push(block.raw);
            if (file.original !== undefined && file.original !== file.path) {
              tipLines.push((zh ? '原始：' : 'Original: ') + file.original);
            }
            tipLines.push(zh ? '点击复制完整路径' : 'Click to copy the full path');
          } else {
            // Legacy folded rows (parsed before the raw slice existed).
            tipLines.push(file.path, (zh ? '大小：' : 'Size: ') + file.size, (zh ? '位置：' : 'Location: ') + absolute);
            if (block.manifest !== '') tipLines.push((zh ? '清单：' : 'Manifest: ') + block.manifest);
            if (file.original !== undefined && file.original !== file.path) tipLines.push((zh ? '原始：' : 'Original: ') + file.original);
            tipLines.push(zh ? '点击复制完整路径' : 'Click to copy the full path');
          }
          tip.textContent = tipLines.join('\n');
          chip.appendChild(icon);
          chip.appendChild(name);
          chip.appendChild(meta);
          chip.appendChild(tip);
          chip.addEventListener('click', () => {
            navigator.clipboard?.writeText(absolute).then(
              () => showToast((zh ? '已复制路径：' : 'Copied path: ') + absolute),
              () => showToast((zh ? '复制失败：' : 'Copy failed: ') + absolute),
            );
          });
          wrap.appendChild(chip);
        }
        pos = block.blockEnd;
      }
      const after = text.slice(pos).trim();
      if (after !== '') {
        const words = document.createElement('div');
        words.className = 'dshca-chat-usertext';
        words.textContent = after;
        wrap.appendChild(words);
      }
      div.parentElement?.insertBefore(wrap, div.nextSibling);
    }

    function foldScan() {
      // Remove orphan wraps whose owning text div no longer exists (React
      // rebuilds elements and may leave our old wraps behind).
      for (const wrap of document.querySelectorAll('[data-paste-folded="container"]')) {
        const owner = wrap.dataset.for;
        if (owner === undefined) { wrap.remove(); continue; }
        if (document.querySelector('[data-paste-id="' + owner + '"]') === null) wrap.remove();
      }
      // The settings nav icon patch shares this scan instead of running its
      // own body-wide MutationObserver (two full-tree observers on every DOM
      // mutation is pure waste). It is a fast no-op unless the settings
      // dialog is open; the 300ms debounce is imperceptible for the icon.
      try { patchAttachmentNavIcon(); } catch { /* best-effort */ }
      // Hidden tabs keep firing MutationObserver callbacks (observers are not
      // throttled like timers) while background streaming mutates the DOM, so
      // the full-body text walk would otherwise run every ~300ms invisibly.
      // Folding is cosmetic and unseen while hidden; the next visible-state
      // mutation or the 8s sweep folds everything within one sweep period.
      if (document.hidden) return;
      // Text-driven scan: no dependency on DSH's internal DOM markers (they
      // differ across dist builds). Any text node carrying the attachment
      // header gets its container folded into chips.
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const seen = new Set();
      let node;
      while ((node = walker.nextNode()) !== null) {
        const text = node.textContent ?? '';
        if (!text.includes('DSH_PASTE_INPUT_V1')) continue;
        const container = node.parentElement;
        if (container === null || seen.has(container)) continue;
        // Never fold inside our own injected wraps: the file tooltip quotes the
        // raw attachment block verbatim, so its text carries the same marker we
        // scan for. Folding it would mint a fresh tooltip that again carries
        // the marker, and this live TreeWalker would visit that new text node,
        // fold it, mint another tooltip, ... forever — freezing the page.
        if (container.closest('[data-paste-folded="container"]') !== null) continue;
        seen.add(container);
        if (container.dataset.pasteFolded !== undefined) {
          // Skip the full re-parse when our chip wrap is still alive; only
          // re-insert (re-parse) when React re-rendered the bubble and dropped
          // the wrap. This keeps per-scan cost O(1) per folded bubble instead
          // of re-parsing every attachment block on every scan.
          const pasteId = container.dataset.pasteId;
          if (pasteId !== undefined && container.parentElement !== null
              && container.parentElement.querySelector('[data-paste-folded="container"][data-for="' + pasteId + '"]') !== null) {
            continue;
          }
          try { foldAttachmentDiv(container); } catch { /* best-effort */ }
          continue;
        }
        try { foldAttachmentDiv(container); } catch (cause) { console.warn('dsh-paste-input fold failed:', cause); }
      }
    }

    // ---- Settings nav icon --------------------------------------------------
    // The settings shell's navIcon() is hardcoded: non-builtin section ids
    // (like ours) always fall back to the gear, and there is no slot hook.
    // Swap the gear of the attachment row for DSH's OWN paperclip glyph
    // (ic_ds_paperclip_outline_16 from @deepseek-ai/dsh-client-ui-primitives)
    // at the DOM level — keep the shell's <svg> (class/size/color context),
    // replace only its glyph paths. Every side effect lives in this process
    // (observer + DOM nodes), so removing the plugin and restarting restores
    // the stock gear.
    const NAV_ICON_LABELS = ['多媒体输入', 'Multimedia input']
    const PAPERCLIP_PATH = 'M5.5498 9.75V5H6.9502V9.75C6.9502 10.3299 7.4201 10.7998 8 10.7998C8.5799 10.7998 9.0498 10.3299 9.0498 9.75V4.5C9.0498 2.9536 7.7964 1.7002 6.25 1.7002C4.7036 1.7002 3.4502 2.9536 3.4502 4.5V9.75C3.4502 12.2629 5.4871 14.2998 8 14.2998C10.5129 14.2998 12.5498 12.2629 12.5498 9.75V4H13.9502V9.75C13.9502 13.0361 11.2861 15.7002 8 15.7002C4.71391 15.7002 2.0498 13.0361 2.0498 9.75V4.5C2.04981 2.1804 3.9304 0.299806 6.25 0.299805C8.5696 0.299805 10.4502 2.1804 10.4502 4.5V9.75C10.4502 11.1031 9.3531 12.2002 8 12.2002C6.6469 12.2002 5.5498 11.1031 5.5498 9.75Z'
    // Cached dialog shell: avoids a full-tree querySelector('[role="dialog"]')
    // per foldScan when no dialog is open (the common case — that query
    // traverses the whole tree on a miss, same order as the fold walk itself).
    let lastNavDialog = null;
    function patchAttachmentNavIcon() {
      if (lastNavDialog !== null && !lastNavDialog.isConnected) lastNavDialog = null;
      const dialog = lastNavDialog !== null ? lastNavDialog : document.querySelector('[role="dialog"]');
      lastNavDialog = dialog;
      if (!dialog) return
      const buttons = dialog.querySelectorAll('nav button')
      for (const button of buttons) {
        if (!NAV_ICON_LABELS.includes(button.textContent.trim())) continue
        const svg = button.querySelector('svg')
        if (!svg) continue
        // Match by glyph CONTENT, not node identity: React may re-render the
        // same svg node back to the gear (or rewrite path `d` attributes),
        // and identity-based bookkeeping would silently skip re-patching it.
        const first = svg.querySelector('path')
        if (first && first.getAttribute('d') === PAPERCLIP_PATH) continue
        svg.innerHTML = ''
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('d', PAPERCLIP_PATH)
        path.setAttribute('fill', 'currentColor')
        svg.appendChild(path)
      }
    }
    function installNavIconPatch() {
      if (typeof document === 'undefined' || typeof MutationObserver !== 'function') return () => {}
      let raf = 0
      const schedulePatch = () => {
        if (raf) return
        raf = requestAnimationFrame(() => {
          raf = 0
          try { patchAttachmentNavIcon() } catch { /* best-effort */ }
        })
      }
      const observer = new MutationObserver(() => {
        // 资源：patch 幂等（已修则跳过），仅 rAF 节流调度即可；同步跑是冗余的
        // 全量扫描（每次 DOM 变化都多一次），去掉后图标修复延迟一帧、肉眼无感。
        schedulePatch()
      })
      // Observe the body for the plugin's lifetime instead of switching to the
      // dialog element: the settings dialog is destroyed/recreated on each
      // open, and an observer parked on a detached dialog would stop seeing
      // the next dialog entirely (gear icon stays until another scan finds it).
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['d'] })
      return () => {
        if (raf) cancelAnimationFrame(raf)
        observer.disconnect()
      }
    }

    const inject = ['slots', 'locale', 'conversation', 'sessions', 'inputTriggers'];

    function apply(ctx) {
      try { localeService = ctx.get('locale'); } catch { localeService = undefined; }
      ctx.effect(() => installNavIconPatch(), 'dsh-paste-input: settings nav icon');
      const sessions = ctx.get('sessions');
      const conversation = ctx.get('conversation');
      const inputTriggers = ctx.get('inputTriggers');

      // Bubble folding observer, registered first so later apply failures can
      // never disable it; every chat-flow mutation re-scans (debounced).
      // Resource note: characterData is intentionally NOT observed — assistant
      // streaming mutates text nodes at high frequency while folding only ever
      // reacts to user-message nodes, which arrive as childList insertions.
      // Dropping it keeps the page idle during streams; the 300ms debounce
      // absorbs DOM-change storms and the 8s sweep stays as a cheap fallback
      // for observer loss / late-mounted bubbles.
      let foldTimer = null;
      const chatObserver = new MutationObserver(() => {
        if (foldTimer !== null) return;
        foldTimer = setTimeout(() => {
          foldTimer = null;
          try { foldScan(); } catch { /* folding is best-effort */ }
        }, 300);
      });
      try {
        if (document.body !== null) {
          // Live diagnostic marker: the rev of the bundle the browser really
          // loaded (from the boot graph, so it stays correct across rebuilds).
          const boot = globalThis.__DSH_BOOT__;
          const self = boot?.entries?.find(entry => entry.id === '@dsh-community/dsh-paste-input');
          document.body.dataset.pasteInputRev = self?.rev ?? 'unknown';
        }
        chatObserver.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          // 'd' covers the nav-icon glyph path rewrite (foldScan re-patches
          // it together with folding, so both stay consistent on one scan).
          attributeFilter: ['style', 'class', 'data-paste-folded', 'd'],
        });
      } catch (cause) { console.warn('dsh-paste-input: observer setup failed:', cause); }
      // Fallback sweeps: cover observer loss and late-mounted bubbles.
      const sweep = setInterval(() => { try { foldScan(); } catch { /* best-effort */ } }, 8000);
      try { foldScan(); } catch (cause) { console.warn('dsh-paste-input: initial fold failed:', cause); }
      ctx.effect(() => () => {
        chatObserver.disconnect();
        clearInterval(sweep);
        if (foldTimer !== null) clearTimeout(foldTimer);
      }, 'dsh-paste-input: bubble fold observer');

      const source = {
        trigger: '@',
        name: SOURCE,
        order: 1000,
        candidates: () => Promise.resolve([]),
        onPick: () => undefined,
        codec: {
          clipboardText: ref => records.get(ref)?.label ?? `attachment:${ref}`,
          serialize: (ref, signal) => {
            const record = records.get(ref);
            if (record === undefined) return Promise.reject(new Error('Attachment selection is no longer available in this browser tab'));
            return upload(record, signal);
          },
        },
      };
      ctx.effect(() => inputTriggers.registerSource(source), 'dsh-paste-input: reference codec');

      // Global paste interception: clipboard files become attachments; plain
      // text keeps the browser default. First-time paste shows a notice modal.
      const onPaste = event => {
        const files = [...(event.clipboardData?.files ?? [])];
        if (files.length === 0) return;
        event.preventDefault();
        const proceed = () => {
          const sessionId = sessions.list?.getSnapshot()?.current;
          if (sessionId === undefined) { showToast(uiZh() ? '请先打开一个会话。' : 'Open a session first.'); return; }
          let items;
          try { items = filesFromList(files); } catch (cause) {
            showToast(cause instanceof Error ? cause.message : String(cause));
            return;
          }
          add(sessionId, items).catch(cause => {
            showToast(cause instanceof Error ? cause.message : String(cause));
          });
        };
        if (noticeDismissed) proceed();
        else showPasteNotice(proceed, () => {});
      };
      document.addEventListener('paste', onPaste);
      ctx.effect(() => () => document.removeEventListener('paste', onPaste), 'dsh-paste-input: paste listener');

      // Whole-page file drop, registered at apply level (independent of any
      // slot rendering): files dropped anywhere join the attachment queue.
      // `types.includes('Files')` is a cheap string check — no array spread
      // + iteration per dragover (fired ~60×/s while dragging).
      const dragHasFiles = dt => {
        const types = dt?.types;
        return types !== undefined && types !== null && Array.prototype.includes.call(types, 'Files');
      };
      const onDragover = event => {
        if (dragHasFiles(event.dataTransfer)) event.preventDefault();
      };
      const onDrop = event => {
        const hasFiles = dragHasFiles(event.dataTransfer);
        if (!hasFiles) return;
        event.preventDefault();
        const sessionId = sessions.list?.getSnapshot()?.current;
        if (sessionId === undefined) { showToast(uiZh() ? '请先打开一个会话。' : 'Open a session first.'); return; }
        filesFromDrop(event.dataTransfer).then(
          items => add(sessionId, items).catch(cause => {
            showToast(cause instanceof Error ? cause.message : String(cause));
          }),
          cause => showToast(cause instanceof Error ? cause.message : String(cause)),
        );
      };
      document.addEventListener('dragover', onDragover);
      document.addEventListener('drop', onDrop);
      ctx.effect(() => () => {
        document.removeEventListener('dragover', onDragover);
        document.removeEventListener('drop', onDrop);
      }, 'dsh-paste-input: page drop listener');



      const inputFor = sessionId => {
        const actx = sessions.scope(sessionId);
        if (actx === undefined) throw new Error(`Attachment session is not active: ${sessionId}`);
        return conversation.input.for(actx);
      };

      const add = async (sessionId, items) => {
        validateItems(items);
        const input = inputFor(sessionId);
        let snapshot = input.state.getSnapshot();
        if (snapshot.phase !== 'plain') throw new Error('Wait for the current input operation to finish');
        if (snapshot.draft !== '' && !/\s$/u.test(snapshot.draft)) {
          input.setDraft(`${snapshot.draft} `);
          snapshot = input.state.getSnapshot();
        }
        // One record per file: every file gets its own chip in the composer,
        // its own upload batch, and its own bubble chip, so the user can
        // remove a single file instead of the whole selection.
        for (const item of items) {
          const ref = id();
          const label = item.path;
          const record = { ref, sessionId, items: [item], total: item.file.size, label, status: 'ready', uploaded: 0 };
          records.set(ref, record);
          const accepted = input.insertReference({
            source: SOURCE,
            ref,
            // DSH's textarea reference cell is a fixed-width compact chip. Keep
            // both the file affordance and the beginning of its name visible;
            // the full label and size remain in our dock immediately above it.
            label: compactReferenceLabel(label),
            clipboardText: `[attachment: ${label}]`,
          }, {
            start: snapshot.draft.length,
            end: snapshot.draft.length,
            draftRev: snapshot.draftRev,
          });
          if (!accepted) {
            records.delete(ref);
            throw new Error('The DSH composer changed before the attachment could be inserted');
          }
          snapshot = input.state.getSnapshot();
          if (typeof input.state.subscribe === 'function') {
            const unsubscribe = input.state.subscribe(() => {
              // Dock-removal while an upload is in flight deletes the record
              // but leaves `inflight` set; without this check the subscription
              // would linger until some later state change (and emit a
              // redundant changed() for an already-gone record). refs are
              // unique and never re-inserted, so a missing record means the
              // chip is gone for good — unsubscribe immediately.
              if (!records.has(ref)) { unsubscribe(); return; }
              const current = input.state.getSnapshot();
              const alive = current.occurrences.some(occurrence => occurrence.source === SOURCE && occurrence.ref === ref);
              if (alive || record.inflight !== undefined) return;
              unsubscribe();
              records.delete(ref);
              changed();
            });
          }
        }
        changed();
      };

      const remove = (sessionId, occurrence) => {
        const input = inputFor(sessionId);
        const snapshot = input.state.getSnapshot();
        if (snapshot.phase !== 'plain') return;
        input.setDraft(snapshot.draft.slice(0, occurrence.offset) + snapshot.draft.slice(occurrence.offset + 1));
        records.delete(occurrence.ref);
        changed();
      };

      ctx.inject(['slots', 'conversation', 'sessions', 'inputTriggers'], scope => {
        scope.slots.inject('conversation.input.left', () => scope.slots.register({
          name: 'conversation.input.left',
          id: 'dsh-paste-input-button',
          order: -100,
          inject: sessionId => ({ add: items => add(sessionId, items) }),
        }, AttachButton));
        scope.slots.inject('conversation.input.dock', () => scope.slots.register({
          name: 'conversation.input.dock',
          id: 'dsh-paste-input-dock',
          order: 5,
          inject: sessionId => ({ remove: occurrence => remove(sessionId, occurrence) }),
        }, AttachmentDock));
        scope.slots.inject('settings.section', () => scope.slots.register({
          name: 'settings.section',
          id: 'attachments',
          order: 20,
          label: () => attachmentCopy().nav,
          inject: () => ({ sessions }),
        }, AttachmentSettings));
      });
    }

    return { apply, inject };
}


function sub_attachmentRemoveAlwaysVisible(require) {
  // Core AttachmentRail hides the per-image remove button until hover/focus.
  // Users on non-hover setups (or after a failed image send) see no close
  // button at all, so force it visible inside the composer seat. The stable
  // hook is the localized aria-label; the hashed CSS class changes per build.
  const CSS = `
[data-composer-seat] button[aria-label^="\u79fb\u9664\u56fe\u7247"],
[data-composer-seat] button[aria-label^="Remove image"] {
  opacity: 1 !important;
}
`;
  function apply(ctx) {
    if (typeof document === 'undefined') return;
    const tag = document.createElement('style');
    tag.dataset.plugin = 'dsh-essentials';
    tag.dataset.pluginCss = 'dsh-essentials/attachment-remove-visible';
    tag.textContent = CSS;
    document.head.appendChild(tag);
    if (typeof ctx.effect === 'function') {
      ctx.effect(() => () => tag.remove(), 'dsh-essentials: attachment remove always visible');
    }
  }
  return { inject: [], apply };
}

/**
 * 从原 dsh-essentials 合并而来（2026-08-19）：
 * model-selector / paste-input / attachment-remove 的浏览器半区
 * （at-file 已于 2026-08-20 移除，官方 rc.8 @ 菜单覆盖）。
 * 原为独立 `window.__ModuleLoader__.load({ id: 'dsh-essentials' })` 打包模块；
 * 并入 dsh-ui-tweaks 后改为导出 factory，由 client.js 的 load 统一组合 apply。
 */
function applyEssentialsClient(require) {
  const parts = [
    sub_modelSelector(require),
    sub_pasteInput(require),
    sub_attachmentRemoveAlwaysVisible(require),
  ]
  const inject = [...new Set(parts.flatMap((p) => (Array.isArray(p.inject) ? p.inject : [])))]
  function apply(ctx) {
    for (const p of parts) {
      if (typeof p.apply === 'function') p.apply(ctx)
    }
  }
  return { name: 'dsh-essentials', inject, apply }
}

window.__ModuleLoader__.load({
  id: 'dsh-ui-tweaks',
  factory: (require) => {
    let react_jsx_runtime = require('react/jsx-runtime')
    let react = require('react')
    let primitives = require('@deepseek-ai/dsh-client-ui-primitives')

    // ── 统一 locale 命名空间 ──────────────────────────────────────────
    const NS = 'ui-tweaks'
    const zh = {
      masterTitle: '界面增强',
      masterDesc: 'UI 微调与桌面通知：插件列表、快捷键、重试、通知',
      groupGeneral: '通用',
      groupComposer: '输入框',
      groupNotify: '桌面通知',
      groupRetry: '请求重试',
      pluginInventoryTitle: '插件列表增强',
      pluginInventoryDesc: '插件列表分类 tab（全部/内置/自定义）+ 搜索',
      keyboardTitle: '全局快捷键',
      keyboardDesc: '聚焦输入框 / 切换侧边栏 / 快捷键帮助等',
      keyboardHint: '按 ? 或 Ctrl+/ 随时查看快捷键帮助。',
      retryTitle: '请求重试',
      retryDesc: '模型请求失败重试次数',
      retryCurrent: '当前生效',
      retryMixed: '各提供商不一致',
      retrySave: '保存',
      retrySaving: '保存中…',
      retrySaved: '已保存',
      retryLoadFailed: '读取失败',
      retrySaveFailed: '保存失败',
      retryInputHint: '模型请求失败后的重试次数（0 = 不重试，默认 2）。保存后应用到所有已配置的 LLM 提供商。',
      retryProviders: '已应用到 {n} 个提供商',
      notifyTitle: '桌面通知',
      notifyDesc: '你在其他标签页时弹出系统通知',
      notifyApproval: '需要审批时提醒',
      notifyQuestion: '需要回答时提醒',
      notifyTurn: '轮次完成时提醒',
      notifySessionDone: '后台会话完成时提醒',
      notifySound: '通知声音',
      notifySoundDesc: '弹出通知时播放提示音，四类通知音效各不相同',
      notifyTest: '试听',
      notifyApprovalTitle: '需要审批',
      notifyApprovalBody: '工具 {toolName} 请求越权执行',
      notifyQuestionTitle: '需要你的回答',
      notifyQuestionBody: 'Agent 有一个问题需要你回答',
      notifyTurnTitle: '轮次完成',
      notifyTurnBody: '第 {turn} 轮已完成',
      notifySessionDoneTitle: '会话完成',
      notifySessionDoneBody: '该会话已完成，可以切回查看',
      notifyPermission: '通知权限',
      notifyPermissionGranted: '已开启',
      notifyPermissionDenied: '已被浏览器阻止',
      notifyPermissionDefault: '未授权',
      notifyPermissionUnsupported: '浏览器不支持',
      notifyRequest: '开启桌面通知',
      close: '关闭',
      keys: {
        help: '打开/关闭快捷键帮助',
        escape: '关闭帮助面板',
        focusComposer: '聚焦聊天输入框',
        sidebar: '切换侧边栏',
        newChat: '新建会话',
        settings: '打开设置',
        usage: '打开用量统计',
        plugins: '打开插件设置',
        scrollBottom: '滚动到底部',
        scrollTop: '滚动到顶部',
      },
    }
    const en = {
      masterTitle: 'UI Enhancements',
      masterDesc: 'UI tweaks & desktop notifications: plugins, shortcuts, retries, notify',
      groupGeneral: 'General',
      groupComposer: 'Composer',
      groupNotify: 'Desktop notifications',
      groupRetry: 'Request retries',
      pluginInventoryTitle: 'Plugin list enhancement',
      pluginInventoryDesc: 'Categorized plugin tabs (all/builtin/custom) + search',
      keyboardTitle: 'Keyboard shortcuts',
      keyboardDesc: 'Focus composer / toggle sidebar / shortcut help, etc.',
      keyboardHint: 'Press ? or Ctrl+/ anytime to view shortcut help.',
      retryTitle: 'Request retries',
      retryDesc: 'Model request retry count',
      retryCurrent: 'Current',
      retryMixed: 'Providers differ',
      retrySave: 'Save',
      retrySaving: 'Saving…',
      retrySaved: 'Saved',
      retryLoadFailed: 'Failed to load',
      retrySaveFailed: 'Failed to save',
      retryInputHint: 'Number of retries after a failed model request (0 = no retry, default 2). Applies to all configured LLM providers.',
      retryProviders: 'Applied to {n} providers',
      notifyTitle: 'Desktop notifications',
      notifyDesc: 'Show system notifications while you are on another tab',
      notifyApproval: 'Remind on approval requests',
      notifyQuestion: 'Remind on questions',
      notifyTurn: 'Remind on turn finish',
      notifySessionDone: 'Remind on background session finish',
      notifySound: 'Notification sound',
      notifySoundDesc: 'Play a distinct sound for each notification type',
      notifyTest: 'Preview',
      notifyApprovalTitle: 'Approval required',
      notifyApprovalBody: 'Tool {toolName} requests privileged execution',
      notifyQuestionTitle: 'Your answer is needed',
      notifyQuestionBody: 'The agent has a question for you',
      notifyTurnTitle: 'Turn finished',
      notifyTurnBody: 'Turn {turn} completed',
      notifySessionDoneTitle: 'Session finished',
      notifySessionDoneBody: 'This session finished — switch over to see the result',
      notifyPermission: 'Notification permission',
      notifyPermissionGranted: 'On',
      notifyPermissionDenied: 'Blocked by the browser',
      notifyPermissionDefault: 'Not granted',
      notifyPermissionUnsupported: 'Not supported',
      notifyRequest: 'Enable desktop notifications',
      close: 'Close',
      keys: {
        help: 'Toggle shortcut help',
        escape: 'Close help panel',
        focusComposer: 'Focus chat input',
        sidebar: 'Toggle sidebar',
        newChat: 'New conversation',
        settings: 'Open settings',
        usage: 'Open usage stats',
        plugins: 'Open plugin settings',
        scrollBottom: 'Scroll to bottom',
        scrollTop: 'Scroll to top',
      },
    }

    // ── 统一配置对象（localStorage 单 key）─────────────────────────────
    const CONFIG_KEY = 'dsh-ui-tweaks.settings'
    const DEFAULTS = {
      pluginInventory: true,
      keyboard: { enabled: true },
      notify: { approval: true, question: true, turn: true, sessionDone: true, sound: true },
    }
    const config = { ...DEFAULTS, keyboard: { ...DEFAULTS.keyboard }, notify: { ...DEFAULTS.notify } }
    function loadConfig() {
      try {
        const raw = JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}')
        if (raw && typeof raw === 'object') {
          for (const k of Object.keys(DEFAULTS)) {
            const v = raw[k]
            if (v === undefined) continue
            if (k === 'keyboard' || k === 'notify') {
              if (v && typeof v === 'object') Object.assign(config[k], v)
            } else config[k] = v
          }
        }
      } catch { /* storage unavailable — keep defaults */ }
    }
    function saveConfig() {
      try { localStorage.setItem(CONFIG_KEY, JSON.stringify(config)) } catch { /* storage unavailable */ }
    }

    // ── 通知声音（Web Audio 合成，按通知类型区分音效）─────────────────
    let audioCtx = null
    let audioReady = false
    const ensureAudio = () => {
      try {
        if (typeof window === 'undefined') return false
        const AC = window.AudioContext || window.webkitAudioContext
        if (!AC) return false
        if (audioCtx === null) audioCtx = new AC()
        if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {})
        audioReady = true
      } catch { audioReady = false }
      return audioReady
    }
    // 首次用户交互时预热 AudioContext，否则后台页面弹出的通知无法出声
    const warmAudio = () => { if (!audioReady) ensureAudio() }
    if (typeof document !== 'undefined') {
      document.addEventListener('pointerdown', warmAudio, { passive: true })
      document.addEventListener('keydown', warmAudio, { passive: true })
    }
    const tone = (freq, start, dur, type = 'sine', gain = 0.16) => {
      if (!audioCtx) return
      const t0 = audioCtx.currentTime + start
      const osc = audioCtx.createOscillator()
      const g = audioCtx.createGain()
      osc.type = type
      osc.frequency.value = freq
      g.gain.setValueAtTime(0.0001, t0)
      g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
      osc.connect(g).connect(audioCtx.destination)
      osc.start(t0)
      osc.stop(t0 + dur + 0.05)
    }
    // 四类通知各自的音效（频率/时长/波形各不相同，便于区分）
    const SOUND_PATTERNS = {
      approval: () => { tone(988, 0, 0.16, 'square', 0.10); tone(988, 0.2, 0.16, 'square', 0.10); tone(740, 0.4, 0.24, 'square', 0.10) },
      question: () => { tone(659, 0, 0.16); tone(880, 0.2, 0.3) },
      turn: () => { tone(523, 0, 0.16) },
      sessionDone: () => { tone(523, 0, 0.16); tone(659, 0.18, 0.16); tone(784, 0.36, 0.32) },
    }
    const playSound = (kind) => {
      if (!config.notify.sound) return
      if (!ensureAudio()) return
      const pattern = SOUND_PATTERNS[kind]
      if (pattern) pattern()
    }

    // ── 共享样式（单 style 标签）───────────────────────────────────────
    const CSS = `
.dshut-card{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:10px;overflow:hidden;list-style:none}
.dshut-header{width:100%;box-sizing:border-box;display:flex;align-items:center;gap:10px;border:0;background:none;color:var(--dsw-alias-label-primary);font:inherit;text-align:left;padding:14px 16px;cursor:pointer}
.dshut-header:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dshut-headtext{flex:1;min-width:0;display:grid;gap:2px}
.dshut-name{font-size:14px;line-height:20px;font-weight:500}
.dshut-desc{margin:0;color:var(--dsw-alias-label-tertiary);font-size:12.5px;line-height:18px}
.dshut-chevron{flex:none;width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;color:var(--dsw-alias-label-tertiary);transform:rotate(0deg);transition:transform .15s ease}
.dshut-chevron.dshut-open{transform:rotate(180deg)}
.dshut-body{box-sizing:border-box;border-top:1px solid var(--dsw-alias-border-l2);padding:4px 16px 14px;display:grid;gap:4px}
.dshut-group{display:grid;gap:4px;padding-top:10px}
.dshut-groupTitle{margin:0;font-size:12px;font-weight:600;color:var(--dsw-alias-label-tertiary);text-transform:uppercase;letter-spacing:.04em}
.dshut-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}
.dshut-row:last-child{border-bottom:0}
.dshut-rowText{flex:1;min-width:0;display:grid;gap:2px}
.dshut-rowTitle{font-size:14px;line-height:20px;color:var(--dsw-alias-label-primary)}
.dshut-rowDesc{margin:0;color:var(--dsw-alias-label-tertiary);font-size:12.5px;line-height:18px}
.dshut-field{display:flex;align-items:center;gap:8px}
.dshut-field input[type=checkbox]{flex:none;width:16px;height:16px;accent-color:var(--dsw-alias-state-business-primary)}
.dshut-num{box-sizing:border-box;width:88px;height:30px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;padding:0 8px}
.dshut-num:focus{outline:none;border-color:var(--dsw-alias-state-business-primary)}
.dshut-button{height:30px;border:0;border-radius:8px;background:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-label-primary-foreground);font:inherit;font-size:13px;padding:0 14px;cursor:pointer}
.dshut-button:disabled{opacity:.5;cursor:default}
.dshut-status{font-size:12.5px;line-height:18px;color:var(--dsw-alias-label-secondary)}
.dshut-status.dshut-err{color:var(--dsw-alias-state-danger-fill,#F87171)}
.dshut-hint{margin:0;color:var(--dsw-alias-label-tertiary);font-size:12.5px;line-height:18px}
.dshut-badges{display:flex;gap:6px;flex-wrap:wrap}
.dshut-badge{font-size:12px;line-height:18px;padding:2px 8px;border-radius:999px;background:var(--dsw-alias-bg-mask-2);color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l2)}
.dsh-ks-help{position:fixed;inset:0;z-index:10000;background:color-mix(in srgb, var(--dsw-alias-bg-mask-2,#14171B) 55%, transparent);display:flex;align-items:center;justify-content:center;padding:24px}
.dsh-ks-helpPanel{box-sizing:border-box;width:min(520px,100%);max-height:80vh;overflow:auto;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:14px;box-shadow:var(--dsw-shadow-lv3);padding:20px;display:grid;gap:14px}
.dsh-ks-helpHead{display:flex;align-items:center;justify-content:space-between;gap:12px}
.dsh-ks-helpTitle{margin:0;font-size:16px;font-weight:600;color:var(--dsw-alias-label-primary)}
.dsh-ks-close{border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12.5px;padding:5px 12px;cursor:pointer}
.dsh-ks-close:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}
.dsh-ks-group{display:grid;gap:8px}
.dsh-ks-groupTitle{margin:0;font-size:12px;font-weight:600;color:var(--dsw-alias-label-tertiary);text-transform:uppercase;letter-spacing:.04em}
.dsh-ks-row{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:13px;line-height:20px;color:var(--dsw-alias-label-primary)}
.dsh-ks-keys{display:inline-flex;gap:4px;flex-wrap:wrap;justify-content:flex-end}
.dsh-ks-key{display:inline-flex;align-items:center;height:22px;padding:0 7px;border:1px solid var(--dsw-alias-border-l2);border-bottom-width:2px;border-radius:6px;background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;white-space:nowrap}
`

    // ── 统一 ToggleRow：通用设置里的一个开关行 ─────────────────────────
    function ToggleRow({ title, desc, checked, onChange }) {
      return react_jsx_runtime.jsx("div", {
        className: "dshut-row",
        children: [
          react_jsx_runtime.jsx("div", {
            className: "dshut-rowText",
            children: [
              react_jsx_runtime.jsx("span", { className: "dshut-rowTitle", children: title }),
              desc ? react_jsx_runtime.jsx("p", { className: "dshut-rowDesc", children: desc }) : null,
            ],
          }),
          react_jsx_runtime.jsx("label", {
            className: "dshut-field",
            children: react_jsx_runtime.jsx("input", { type: "checkbox", checked: checked, onChange: onChange }),
          }),
        ],
      })
    }

    // ── 通用设置总入口：settings.general.item ─────────────────────────
    function UiTweaksMasterCard({ t }) {
      const [open, setOpen] = react.useState(false)
      const [, force] = react.useReducer((x) => x + 1, 0)
      // 外部改配置（悬浮按钮/快捷键）时同步重渲染，让开关状态保持最新
      react.useEffect(() => {
        const onConfig = () => force()
        window.addEventListener('dsh-ui-tweaks:config', onConfig)
        return () => window.removeEventListener('dsh-ui-tweaks:config', onConfig)
      }, [])
      const setConfig = (mutator) => {
        mutator()
        saveConfig()
        force()
        window.dispatchEvent(new CustomEvent('dsh-ui-tweaks:config', { detail: config }))
      }
      const [retry, setRetry] = react.useState({ value: '2', meta: null, status: { kind: 'idle', text: '' }, busy: false })
      const loadRetry = react.useCallback(async () => {
        try {
          const res = await fetch('/api/retry-settings', { cache: 'no-store' })
          const data = await res.json()
          if (!res.ok || !data.ok) throw new Error(data.reason || 'load failed')
          setRetry((s) => ({ ...s, meta: data, value: data.current !== null && data.current !== undefined ? String(data.current) : '2', status: { kind: 'ok', text: '' } }))
        } catch (error) {
          setRetry((s) => ({ ...s, status: { kind: 'err', text: t('retryLoadFailed') + ': ' + String((error && error.message) || error) } }))
        }
      }, [])
      react.useEffect(() => { if (open) loadRetry() }, [open, loadRetry])
      const saveRetry = async () => {
        const maxRetries = Number(retry.value)
        if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 100) {
          setRetry((s) => ({ ...s, status: { kind: 'err', text: t('retrySaveFailed') + ': 0–100' } }))
          return
        }
        setRetry((s) => ({ ...s, busy: true }))
        try {
          const res = await fetch('/api/retry-settings', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ maxRetries }),
          })
          const data = await res.json()
          if (!res.ok || !data.ok) throw new Error(data.reason || 'save failed')
          await loadRetry()
          setRetry((s) => ({ ...s, status: { kind: 'ok', text: t('retrySaved') + (data.updated ? ' · ' + t('retryProviders').replace('{n}', String(data.updated)) : '') } }))
        } catch (error) {
          setRetry((s) => ({ ...s, status: { kind: 'err', text: t('retrySaveFailed') + ': ' + String((error && error.message) || error) } }))
        } finally {
          setRetry((s) => ({ ...s, busy: false }))
        }
      }

      const [perm, setPerm] = react.useState(() => {
        if (typeof Notification === 'undefined') return 'unsupported'
        return Notification.permission
      })
      const requestPermission = async () => {
        if (typeof Notification === 'undefined') return
        setPerm(await Notification.requestPermission())
      }

      const badges = []
      if (retry.meta) {
        if (retry.meta.current !== null && retry.meta.current !== undefined) badges.push(react_jsx_runtime.jsx("span", { className: "dshut-badge", children: t('retryCurrent') + ' ' + retry.meta.current }))
        else badges.push(react_jsx_runtime.jsx("span", { className: "dshut-badge", children: t('retryMixed') }))
        if (retry.meta.mode === 'always') badges.push(react_jsx_runtime.jsx("span", { className: "dshut-badge", children: '∞' }))
        else if (retry.meta.mode === 'normal') badges.push(react_jsx_runtime.jsx("span", { className: "dshut-badge", children: 'normal' }))
        if (retry.meta.entries && retry.meta.entries.length > 0) badges.push(react_jsx_runtime.jsx("span", { className: "dshut-badge", children: t('retryProviders').replace('{n}', String(retry.meta.entries.length)) }))
      }

      const chevron = react_jsx_runtime.jsx("svg", {
        className: "dshut-chevron" + (open ? " dshut-open" : ""),
        width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", "aria-hidden": true,
        children: react_jsx_runtime.jsx("path", {
          d: "M3.5 5.75 8 10.25l4.5-4.5", stroke: "currentColor",
          strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round",
        }),
      })

      return react_jsx_runtime.jsx("li", {
        className: "dshut-card",
        children: [
          react_jsx_runtime.jsx("button", {
            type: "button", className: "dshut-header", "aria-expanded": open, onClick: () => setOpen(!open),
            children: [
              react_jsx_runtime.jsx("span", {
                className: "dshut-headtext",
                children: [
                  react_jsx_runtime.jsx("span", { className: "dshut-name", children: t('masterTitle') }),
                  react_jsx_runtime.jsx("p", { className: "dshut-desc", children: t('masterDesc') }),
                ],
              }),
              chevron,
            ],
          }),
          open ? react_jsx_runtime.jsx("div", {
            className: "dshut-body",
            children: [
              react_jsx_runtime.jsxs("div", {
                className: "dshut-group",
                children: [
                  react_jsx_runtime.jsx("p", { className: "dshut-groupTitle", children: t('groupGeneral') }),
                  react_jsx_runtime.jsx(ToggleRow, {
                    title: t('pluginInventoryTitle'), desc: t('pluginInventoryDesc'),
                    checked: config.pluginInventory,
                    onChange: () => setConfig(() => { config.pluginInventory = !config.pluginInventory }),
                  }),
                  react_jsx_runtime.jsx(ToggleRow, {
                    title: t('keyboardTitle'), desc: t('keyboardDesc'),
                    checked: config.keyboard.enabled,
                    onChange: () => setConfig(() => { config.keyboard.enabled = !config.keyboard.enabled }),
                  }),
                ],
              }),
              react_jsx_runtime.jsxs("div", {
                className: "dshut-group",
                children: [
                  react_jsx_runtime.jsx("p", { className: "dshut-groupTitle", children: t('groupNotify') }),
                  react_jsx_runtime.jsx(ToggleRow, {
                    title: t('notifyApproval'),
                    checked: config.notify.approval,
                    onChange: () => setConfig(() => { config.notify.approval = !config.notify.approval }),
                  }),
                  react_jsx_runtime.jsx(ToggleRow, {
                    title: t('notifyQuestion'),
                    checked: config.notify.question,
                    onChange: () => setConfig(() => { config.notify.question = !config.notify.question }),
                  }),
                  react_jsx_runtime.jsx(ToggleRow, {
                    title: t('notifyTurn'),
                    checked: config.notify.turn,
                    onChange: () => setConfig(() => { config.notify.turn = !config.notify.turn }),
                  }),
                  react_jsx_runtime.jsx(ToggleRow, {
                    title: t('notifySessionDone'),
                    checked: config.notify.sessionDone,
                    onChange: () => setConfig(() => { config.notify.sessionDone = !config.notify.sessionDone }),
                  }),
                  react_jsx_runtime.jsx("div", {
                    className: "dshut-row",
                    children: [
                      react_jsx_runtime.jsx("div", {
                        className: "dshut-rowText",
                        children: [
                          react_jsx_runtime.jsx("span", { className: "dshut-rowTitle", children: t('notifySound') }),
                          react_jsx_runtime.jsx("p", { className: "dshut-rowDesc", children: t('notifySoundDesc') }),
                        ],
                      }),
                      react_jsx_runtime.jsx("div", {
                        className: "dshut-field",
                        children: [
                          react_jsx_runtime.jsx("input", {
                            type: "checkbox",
                            checked: config.notify.sound,
                            onChange: () => setConfig(() => { config.notify.sound = !config.notify.sound }),
                          }),
                          react_jsx_runtime.jsx("button", {
                            type: "button", className: "dshut-button", onClick: () => playSound('sessionDone'),
                            children: t('notifyTest'),
                          }),
                        ],
                      }),
                    ],
                  }),
                  react_jsx_runtime.jsx("div", {
                    className: "dshut-row",
                    children: [
                      react_jsx_runtime.jsx("div", {
                        className: "dshut-rowText",
                        children: [
                          react_jsx_runtime.jsx("span", { className: "dshut-rowTitle", children: t('notifyPermission') }),
                          react_jsx_runtime.jsx("p", { className: "dshut-rowDesc", children: t('notifyDesc') }),
                        ],
                      }),
                      react_jsx_runtime.jsx("div", {
                        className: "dshut-field",
                        children: [
                          react_jsx_runtime.jsx("span", { className: "dshut-badge", children: t('notifyPermission' + (perm === 'granted' ? 'Granted' : perm === 'denied' ? 'Denied' : perm === 'default' ? 'Default' : 'Unsupported')) }),
                          perm !== 'granted' && perm !== 'unsupported'
                            ? react_jsx_runtime.jsx("button", {
                                type: "button", className: "dshut-button", onClick: requestPermission,
                                children: t('notifyRequest'),
                              })
                            : null,
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              react_jsx_runtime.jsxs("div", {
                className: "dshut-group",
                children: [
                  react_jsx_runtime.jsx("p", { className: "dshut-groupTitle", children: t('groupRetry') }),
                  react_jsx_runtime.jsx("div", {
                    className: "dshut-row",
                    children: [
                      react_jsx_runtime.jsx("div", {
                        className: "dshut-rowText",
                        children: [
                          react_jsx_runtime.jsx("span", { className: "dshut-rowTitle", children: t('retryTitle') }),
                          react_jsx_runtime.jsx("p", { className: "dshut-rowDesc", children: t('retryInputHint') }),
                        ],
                      }),
                      react_jsx_runtime.jsx("div", {
                        className: "dshut-field",
                        children: [
                          react_jsx_runtime.jsx("input", {
                            className: "dshut-num", type: "number", min: 0, max: 100, step: 1,
                            value: retry.value, disabled: retry.busy,
                            onChange: (e) => setRetry((s) => ({ ...s, value: e.target.value })),
                          }),
                          react_jsx_runtime.jsx("button", {
                            type: "button", className: "dshut-button", disabled: retry.busy, onClick: saveRetry,
                            children: retry.busy ? t('retrySaving') : t('retrySave'),
                          }),
                        ],
                      }),
                    ],
                  }),
                  badges.length > 0 ? react_jsx_runtime.jsx("div", { className: "dshut-badges", children: badges }) : null,
                  retry.status.text ? react_jsx_runtime.jsx("p", { className: "dshut-status" + (retry.status.kind === 'err' ? " dshut-err" : ""), children: retry.status.text }) : null,
                ],
              }),
            ],
          }) : null,
        ],
      })
    }

    // ── keyboard shortcuts 控制器（DOM keydown，读统一配置）───────────
    function applyKeyboard(ctx, t) {
      const SHORTCUTS = [
        { group: 'groupGeneral', id: 'help', keys: ['?', 'Ctrl+/'] },
        { group: 'groupGeneral', id: 'escape', keys: ['Esc'] },
        { group: 'groupGeneral', id: 'sidebar', keys: ['Ctrl+Shift+S'] },
        { group: 'groupGeneral', id: 'newChat', keys: ['Ctrl+Alt+N'] },
        { group: 'groupGeneral', id: 'settings', keys: ['Ctrl+,'] },
        { group: 'groupGeneral', id: 'usage', keys: ['Ctrl+Shift+U'] },
        { group: 'groupGeneral', id: 'plugins', keys: ['Ctrl+Shift+P'] },
        { group: 'groupComposer', id: 'focusComposer', keys: ['Ctrl+Shift+C'] },
        { group: 'groupComposer', id: 'scrollBottom', keys: ['Ctrl+Shift+End'] },
        { group: 'groupComposer', id: 'scrollTop', keys: ['Ctrl+Shift+Home'] },
      ]
      function isEditable(target) {
        if (!target || typeof target.closest !== 'function') return false
        return !!target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false'])")
      }
      function clickByText(texts) {
        const el = Array.from(document.querySelectorAll('button, [role="button"], a, [role="tab"], [role="menuitem"]')).find((e) => { const txt = (e.textContent || '').trim(); return texts.some((x) => txt === x || txt.startsWith(x)) })
        if (el) { el.click(); return true }
        return false
      }
      function clickByAria(texts) {
        const el = Array.from(document.querySelectorAll('[aria-label]')).find((e) => texts.some((x) => (e.getAttribute('aria-label') || '').trim() === x))
        if (el) { el.click(); return true }
        return false
      }
      function toggleSidebar() {
        if (clickByAria(['打开侧边栏', '收起侧边栏', 'Open sidebar', 'Collapse sidebar'])) return
        clickByText(['打开侧边栏', '收起侧边栏', 'Open sidebar', 'Collapse sidebar'])
      }
      function newChat() {
        if (clickByAria(['新会话', 'New chat', 'New conversation'])) return
        clickByText(['新会话', 'New chat', 'New conversation'])
      }
      function openSettings() {
        if (clickByText(['设置', 'Settings'])) return
        clickByAria(['设置', 'Settings'])
      }
      function openUsageStats() { clickByText(['用量统计', 'Usage stats']) }
      function openPluginsSettings() { clickByText(['插件', 'Plugins']) }
      function scrollChat(bottom) {
        const scroller = document.querySelector('[data-conversation-scroll]')
        if (scroller) { scroller.scrollTop = bottom ? scroller.scrollHeight : 0; return }
        const el = document.scrollingElement || document.documentElement
        el.scrollTop = bottom ? el.scrollHeight : 0
      }

      ctx.effect(() => {
        if (typeof document === 'undefined') return () => {}
        let enabled = config.keyboard.enabled
        let helpOpen = false
        let helpEl = null

        const closeHelp = () => { helpOpen = false; if (helpEl !== null && helpEl.isConnected) helpEl.remove(); helpEl = null }
        const renderHelp = () => {
          closeHelp()
          helpOpen = true
          helpEl = document.createElement('div')
          helpEl.className = 'dsh-ks-help'
          helpEl.setAttribute('role', 'dialog')
          helpEl.setAttribute('aria-modal', 'true')
          const groups = {}
          for (const s of SHORTCUTS) { if (!groups[s.group]) groups[s.group] = []; groups[s.group].push(s) }
          const rows = Object.keys(groups).map((group) => `
            <div class="dsh-ks-group">
              <p class="dsh-ks-groupTitle">${t(group)}</p>
              ${groups[group].map((s) => `<div class="dsh-ks-row"><span>${t('keys.' + s.id)}</span><span class="dsh-ks-keys">${s.keys.map((k) => `<span class="dsh-ks-key">${k.replace(/</g, '&lt;')}</span>`).join('')}</span></div>`).join('')}
            </div>`).join('')
          helpEl.innerHTML = `<div class="dsh-ks-helpPanel"><div class="dsh-ks-helpHead"><h2 class="dsh-ks-helpTitle">Keyboard shortcuts</h2><button type="button" class="dsh-ks-close" data-dsh-ks-close>${t('close')}</button></div>${rows}</div>`
          const closeBtn = helpEl.querySelector('[data-dsh-ks-close]')
          if (closeBtn) closeBtn.addEventListener('click', closeHelp)
          document.body.appendChild(helpEl)
          if (closeBtn) closeBtn.focus()
        }
        const onKeyDown = (event) => {
          if (!enabled) return
          const mod = event.metaKey || event.ctrlKey
          const shift = event.shiftKey
          const key = (event.key || '').toLowerCase()
          if (helpOpen) {
            if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeHelp() }
            return
          }
          if (isEditable(event.target)) return
          if (event.key === '?' || (mod && key === '/')) { event.preventDefault(); renderHelp(); return }
          if (mod && shift && key === 'c') {
            event.preventDefault()
            const editable = document.querySelector('[data-composer-seat] textarea, [data-composer-seat] [contenteditable="true"], [data-composer-seat] [contenteditable=""]')
            if (editable) editable.focus()
            else { const fallback = document.querySelector('[data-composer-seat]'); if (fallback) fallback.scrollIntoView({ block: 'end' }) }
            return
          }
          if (mod && shift && key === 's') { event.preventDefault(); toggleSidebar(); return }
          if (mod && event.altKey && key === 'n') { event.preventDefault(); newChat(); return }
          if (mod && key === ',') { event.preventDefault(); openSettings(); return }
          if (mod && shift && key === 'u') { event.preventDefault(); openUsageStats(); return }
          if (mod && shift && key === 'p') { event.preventDefault(); openPluginsSettings(); return }
          if (mod && shift && key === 'end') { event.preventDefault(); scrollChat(true); return }
          if (mod && shift && key === 'home') { event.preventDefault(); scrollChat(false); return }
        }
        const onConfig = (e) => { enabled = Boolean(e.detail && e.detail.keyboard && e.detail.keyboard.enabled) }
        document.addEventListener('keydown', onKeyDown, true)
        window.addEventListener('dsh-ui-tweaks:config', onConfig)
        return () => {
          document.removeEventListener('keydown', onKeyDown, true)
          window.removeEventListener('dsh-ui-tweaks:config', onConfig)
          closeHelp()
        }
      }, 'ui-tweaks: keyboard shortcuts controller')
    }

    // ── notify 控制器（sessions 监听 + 桌面通知，读统一配置）─────────
    function applyNotify(ctx, t) {
      const SUMMARY_MAX = 80
      const SESSION_LABEL_MAX = 40
      const sessions = ctx.sessions
      const hiddenNow = () => typeof document !== 'undefined' && document.visibilityState === 'hidden'
      const notificationUsable = () => typeof Notification !== 'undefined' && Notification.permission === 'granted'
      const withClickFocus = (n, onOpen) => { n.onclick = () => { window.focus(); onOpen(); n.close() }; return n }
      const titled = (kindTitle, label) => label === '' ? kindTitle : label + ' · ' + kindTitle
      // silent:true 关掉系统自带提示音，改用我们按类型区分的合成音效
      const show = (kind, title, body, tag, target) => {
        playSound(kind)
        return withClickFocus(new Notification(title, { body, tag, requireInteraction: true, silent: true }), target.onOpen)
      }
      const fireNotification = (wait, target) => {
        if (wait.kind === 'approval') {
          if (!config.notify.approval) return
          const body = wait.payload.reason ?? t('notifyApprovalBody').replace('{toolName}', String(wait.payload.toolName ?? ''))
          return show('approval', titled(t('notifyApprovalTitle'), target.label), body, wait.key, target)
        }
        if (wait.kind !== 'question') return // 未知 pending 类型：不弹，避免构造异常通知
        if (!config.notify.question) return
        const first = wait.payload.questions && wait.payload.questions[0]
        const body = first && first.question ? first.question : t('notifyQuestionBody')
        return show('question', titled(t('notifyQuestionTitle'), target.label), body, wait.key, target)
      }
      const fireTurnNotification = (turn, summary, target) => {
        if (!config.notify.turn) return
        const body = summary !== undefined && summary !== '' ? summary : t('notifyTurnBody').replace('{turn}', String(turn))
        return show('turn', titled(t('notifyTurnTitle'), target.label), body, 'turn:' + turn, target)
      }
      const fireSessionDoneNotification = (target) => {
        if (!config.notify.sessionDone) return
        return show('sessionDone', titled(t('notifySessionDoneTitle'), target.label), t('notifySessionDoneBody'), target.tag, target)
      }
      const turnSummaryOf = (nodes, turn) => {
        let text = ''
        for (const node of nodes) {
          if (node.kind !== 'assistant' || node.turn !== turn) continue
          let joined = ''
          for (const block of node.blocks) if (block.kind === 'text') joined += block.text
          if (joined !== '') text = joined
        }
        if (text === '') return undefined
        const trimmed = text.replace(/\s+/gu, ' ').trim()
        return trimmed.length > SUMMARY_MAX ? trimmed.slice(0, SUMMARY_MAX) + '…' : trimmed
      }

      const notified = new Set()
      const completedNotified = new Set()
      const seenTurns = new Map()
      let unsubSession
      let watched
      const labelOf = (sid) => {
        const label = sessions.list.getSnapshot().byId[sid]?.displayTitle ?? sid
        return label.length > SESSION_LABEL_MAX ? label.slice(0, SESSION_LABEL_MAX) + '…' : label
      }
      const openOf = (sid) => () => { if (sessions.list.getSnapshot().byId[sid] !== undefined) sessions.open(sid) }
      const scan = () => {
        const current = sessions.list.getSnapshot().current
        if (current === undefined) return
        const session = sessions.binding(current)?.session
        if (session === undefined) return
        const snapshot = session.getSnapshot()
        if (snapshot.openState !== 'open') return
        let turns = seenTurns.get(current)
        if (turns === undefined) { seenTurns.set(current, new Set(snapshot.turnEnds.keys())); return }
        for (const turn of snapshot.turnEnds.keys()) {
          if (turns.has(turn)) continue
          turns.add(turn)
          if (hiddenNow() && notificationUsable()) fireTurnNotification(turn, turnSummaryOf(snapshot.nodes, turn), { label: labelOf(current), onOpen: openOf(current) })
        }
      }
      const scanList = () => {
        const list = sessions.list.getSnapshot()
        const current = list.current
        for (const sid of list.ids) {
          const summary = list.byId[sid]
          if (summary === undefined) continue
          if (summary.pendingInteraction !== undefined) {
            const session = sessions.binding(sid)?.session
            if (session !== undefined) for (const wait of session.getSnapshot().pending) {
              const key = sid + ':' + wait.key
              if (notified.has(key)) continue
              notified.add(key)
              if (hiddenNow() && notificationUsable()) fireNotification(wait, { label: labelOf(sid), onOpen: openOf(sid) })
            }
          }
          if (sid !== current && summary.completed === true) {
            if (!completedNotified.has(sid)) {
              completedNotified.add(sid)
              if (hiddenNow() && notificationUsable()) fireSessionDoneNotification({ label: labelOf(sid), onOpen: openOf(sid), tag: sid + ':done' })
            }
          } else if (summary.completed !== true) completedNotified.delete(sid)
        }
        for (const sid of completedNotified) if (list.byId[sid] === undefined) completedNotified.delete(sid)
        // 清理已消失会话的残留去重状态（notified / seenTurns），避免长期运行内存增长
        for (const key of notified) {
          if (key.indexOf(':') > 0 && list.byId[key.slice(0, key.indexOf(':'))] === undefined) notified.delete(key)
        }
        for (const sid of seenTurns.keys()) if (list.byId[sid] === undefined) seenTurns.delete(sid)
      }
      const watchCurrent = () => {
        const current = sessions.list.getSnapshot().current
        if (current === watched) return
        unsubSession?.()
        unsubSession = undefined
        watched = current
        if (current === undefined) return
        const session = sessions.binding(current)?.session
        if (session === undefined) return
        unsubSession = session.subscribe(scan)
        scan()
      }
      const unsubList = sessions.list.subscribe(() => { watchCurrent(); scanList() })
      watchCurrent()
      scanList()
      ctx.effect(() => () => { unsubList(); unsubSession?.() }, 'ui-tweaks: notify subscription')
    }

    // ── plugin-inventory 控制器（settings.plugins.tab 增强，受开关控制）─
    function applyPluginInventory(ctx, t) {
      const zhTab = {
        tab: '插件列表', all: '全部', builtin: '内置', custom: '自定义', loading: '正在读取插件…',
        error: '暂时无法读取插件。', retry: '重试', search: '搜索插件', catalog: '插件列表', empty: '暂无插件。',
        emptySearch: '没有匹配的插件。', enabledTag: '已启用', disabledTag: '已停用', configuration: '配置状态',
        cordis: 'Cordis 状态', unobserved: '未挂载', pending: '等待依赖', loadingPhase: '加载中', active: '已挂载',
        failed: '挂载失败', unloading: '卸载中',
      }
      const enTab = {
        tab: 'Plugin list', all: 'All', builtin: 'Built-in', custom: 'Custom', loading: 'Reading plugins…',
        error: 'Plugins are temporarily unavailable.', retry: 'Retry', search: 'Search plugins', catalog: 'Plugin list', empty: 'No plugins are available.',
        emptySearch: 'No matching plugins.', enabledTag: 'Enabled', disabledTag: 'Disabled', configuration: 'Configuration',
        cordis: 'Cordis status', unobserved: 'Unmounted', pending: 'Waiting for dependencies', loadingPhase: 'Loading', active: 'Active',
        failed: 'Failed to mount', unloading: 'Unloading',
      }
      const NS_TAB = 'ui-tweaks.pluginInventory'
      ctx.effect(() => ctx.locale.register(NS_TAB, { zh: zhTab, en: enTab }), 'ui-tweaks: plugin inventory dictionaries')
      const tt = ctx.locale.bind(NS_TAB)
      const CSS_TAB = `
.dspi-section{width:100%;max-width:760px;color:var(--dsw-alias-label-primary);flex-direction:column;gap:14px;display:flex}
.dspi-status{margin:0;color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px}
.dspi-failure{color:var(--dsw-alias-state-error-primary);align-items:center;gap:10px;display:flex}
.dspi-failure p{margin:0;color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px}
.dspi-failure button{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary);font:inherit;cursor:pointer;background:0 0;border-radius:6px;padding:4px 10px}
.dspi-catalog{flex-direction:column;gap:12px;display:flex}
.dspi-tabs{display:flex;gap:8px;flex-wrap:wrap}
.dspi-tab{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font:inherit;font-size:13px;line-height:20px;cursor:pointer}
.dspi-tab:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dspi-tabActive{background:var(--dsw-alias-button-primary-fill);border-color:transparent;color:var(--dsw-alias-label-primary-foreground)}
.dspi-count{font-variant-numeric:tabular-nums;font-size:12px;opacity:.85}
.dspi-search{width:100%;color:var(--dsw-alias-label-tertiary);align-items:center;display:flex;position:relative}
.dspi-search>svg{pointer-events:none;position:absolute;left:12px}
.dspi-search input{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);width:100%;height:36px;color:var(--dsw-alias-label-primary);font:inherit;border-radius:8px;outline:none;padding:0 34px 0 36px;font-size:13px}
.dspi-search input::placeholder{color:var(--dsw-alias-label-tertiary)}
.dspi-catalogHeading{align-items:baseline;gap:7px;padding:0 2px;display:flex}
.dspi-catalogHeading h3{margin:0;font-size:13px;font-weight:600;line-height:20px}
.dspi-catalogHeading span{color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums;font-size:12px;line-height:18px}
.dspi-cards{grid-template-columns:repeat(2,minmax(0,1fr));align-items:start;gap:10px;margin:0;padding:0;list-style:none;display:grid}
.dspi-card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:10px;min-width:0;overflow:hidden}
.dspi-cardContent{box-sizing:border-box;width:100%;min-height:52px;color:inherit;font:inherit;text-align:left;cursor:pointer;background:0 0;border:0;justify-content:space-between;align-items:center;gap:12px;padding:12px 14px;display:flex}
.dspi-cardContent:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dspi-cardTitle{text-overflow:ellipsis;white-space:nowrap;min-width:0;font-size:14px;font-weight:600;line-height:20px;overflow:hidden}
.dspi-cardTrailing{color:var(--dsw-alias-label-tertiary);flex:none;align-items:center;gap:7px;display:inline-flex}
.dspi-statusDot{background:var(--dsw-alias-label-tertiary);border-radius:999px;flex:none;width:7px;height:7px;display:inline-block}
.dspi-statusDot[data-phase=active]{background:var(--dsw-alias-state-success-primary)}
.dspi-statusDot[data-phase=failed]{background:var(--dsw-alias-state-error-primary)}
.dspi-statusDot[data-phase=loading]{background:var(--dsw-alias-state-business-primary)}
.dspi-configTag{background:var(--dsw-alias-bg-layer-1);min-height:20px;color:var(--dsw-alias-label-secondary);white-space:nowrap;border-radius:5px;align-items:center;padding:1px 6px;font-size:11px;line-height:16px;display:inline-flex}
.dspi-configTag[data-enabled=true]{background:color-mix(in srgb, var(--dsw-alias-state-success-primary) 10%, transparent);color:var(--dsw-alias-state-success-primary)}
.dspi-chevron{color:var(--dsw-alias-label-tertiary);flex:none}
.dspi-card[data-open=true] .dspi-chevron{transform:rotate(180deg)}
.dspi-cardDetails{border-top:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-module-platform);padding:10px 14px 12px}
.dspi-entryValue{overflow-wrap:anywhere;color:var(--dsw-alias-label-primary);font-family:var(--ds-font-family-code);font-size:12px;line-height:18px;display:block}
.dspi-details{grid-template-columns:76px minmax(0,1fr);gap:6px 10px;margin:8px 0 0;display:grid}
.dspi-details div{display:contents}
.dspi-details dt{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:17px}
.dspi-details dd{overflow-wrap:anywhere;min-width:0;color:var(--dsw-alias-label-secondary);margin:0;font-size:12px;line-height:17px}
@media (width<=680px){.dspi-cards{grid-template-columns:minmax(0,1fr)}}
`
      ctx.effect(() => {
        const tag = document.createElement('style')
        tag.dataset.plugin = 'dsh-ui-tweaks'
        tag.dataset.pluginCss = 'dsh-ui-tweaks/plugin-inventory'
        tag.textContent = CSS_TAB
        document.head.appendChild(tag)
        return () => tag.remove()
      }, 'ui-tweaks: plugin inventory styles')

      const PHASE_KEYS = { pending: 'pending', loading: 'loadingPhase', active: 'active', failed: 'failed', unloading: 'unloading' }
      const phaseLabel = (phase) => phase === null ? tt('unobserved') : tt(PHASE_KEYS[phase] || phase)
      const moduleShortName = (moduleName) => {
        if (typeof moduleName !== 'string') return ''
        const parts = moduleName.split('/')
        return parts[parts.length - 1] || moduleName
      }
      // 内置/自定义按模块名（真实包名）判定，而不是按 loader 的 entryId：
      // entryId 只是配置行标识，未显式声明 id 的行会被 loader 生成随机 hex
      // （如 "3f2a9c1d"），且官方 host 行（llm/session/agent/timer…）的 id
      // 并不遵循 ui-/dsh-/cordis- 前缀，按 entryId 判断会把它们全部误归为
      // 自定义。官方内置插件一律来自 @deepseek-ai/*，框架级内置则是
      // cordis:*（如 cordis:include / cordis:group），第三方插件（dsh-memory、
      // dsh-visualize、dsh-usage-plugin、@arcships/* 等）则不是，因此按
      // moduleName 前缀判定最可靠。分类与启用/禁用状态无关（禁用仅用配置
      // 标签展示，不应把禁用的内置插件归为自定义）。
      const kindOf = (entry) => {
        const moduleName = entry && entry.moduleName
        if (typeof moduleName === 'string' && (moduleName.startsWith('@deepseek-ai/') || moduleName.startsWith('cordis:'))) return 'builtin'
        return 'custom'
      }
      const matches = (entry, q) => {
        if (q.length === 0) return true
        return [entry.moduleName, entry.entryId].some((v) => String(v || '').toLocaleLowerCase().includes(q))
      }

      function PluginInventoryTab({ list }) {
        const catalogId = react.useId()
        const [request, setRequest] = react.useState(0)
        const [query, setQuery] = react.useState('')
        const [filter, setFilter] = react.useState('all')
        const [expanded, setExpanded] = react.useState(null)
        const [state, setState] = react.useState({ status: 'loading' })
        react.useEffect(() => {
          let current = true
          Promise.resolve().then(() => list()).then((snapshot) => { if (current) setState({ status: 'ready', snapshot }) }, () => { if (current) setState({ status: 'error' }) })
          return () => { current = false }
        }, [list, request])
        const normalizedQuery = query.trim().toLocaleLowerCase()
        const dedupedEntries = react.useMemo(() => {
          if (state.status !== 'ready') return []
          const seen = new Set()
          return state.snapshot.entries.filter((entry) => { const key = entry.moduleName || entry.entryId; if (seen.has(key)) return false; seen.add(key); return true })
        }, [state])
        const counts = react.useMemo(() => {
          if (state.status !== 'ready') return { all: 0, builtin: 0, custom: 0 }
          const builtin = dedupedEntries.filter((e) => kindOf(e) === 'builtin').length
          return { all: dedupedEntries.length, builtin, custom: dedupedEntries.length - builtin }
        }, [dedupedEntries])
        const filteredEntries = react.useMemo(() => dedupedEntries.filter((e) => (filter === 'all' || kindOf(e) === filter) && matches(e, normalizedQuery)), [filter, normalizedQuery, dedupedEntries])
        react.useEffect(() => { if (expanded !== null && !filteredEntries.some((e) => e.entryId === expanded)) setExpanded(null) }, [expanded, filteredEntries])
        const retry = () => { setState({ status: 'loading' }); setRequest((v) => v + 1) }
        return react_jsx_runtime.jsxs('div', {
          className: 'dspi-section', 'aria-busy': state.status === 'loading',
          children: [
            state.status === 'loading' ? react_jsx_runtime.jsx('p', { className: 'dspi-status', children: tt('loading') }) : null,
            state.status === 'error' ? react_jsx_runtime.jsxs('div', { className: 'dspi-failure', children: [react_jsx_runtime.jsx('p', { role: 'alert', children: tt('error') }), react_jsx_runtime.jsx('button', { type: 'button', onClick: retry, children: tt('retry') })] }) : null,
            state.status === 'ready' ? react_jsx_runtime.jsxs('div', {
              className: 'dspi-catalog',
              children: [
                react_jsx_runtime.jsxs('div', { className: 'dspi-tabs', role: 'tablist', 'aria-label': tt('tab'), children: ['all', 'builtin', 'custom'].map((key) => react_jsx_runtime.jsxs('button', { type: 'button', role: 'tab', 'aria-selected': filter === key ? 'true' : 'false', className: 'dspi-tab' + (filter === key ? ' dspi-tabActive' : ''), onClick: () => setFilter(key), children: [tt(key), react_jsx_runtime.jsx('span', { className: 'dspi-count', children: counts[key] })] }, key)) }),
                react_jsx_runtime.jsxs('label', { className: 'dspi-search', children: [react_jsx_runtime.jsx(primitives.IconSearchOutline16, { 'aria-hidden': 'true' }), react_jsx_runtime.jsx('input', { type: 'search', value: query, placeholder: tt('search'), 'aria-label': tt('search'), onChange: (e) => setQuery(e.currentTarget.value) })] }),
                react_jsx_runtime.jsxs('div', { className: 'dspi-catalogHeading', children: [react_jsx_runtime.jsx('h3', { children: tt('catalog') }), react_jsx_runtime.jsx('span', { 'data-plugin-count': filteredEntries.length, children: filteredEntries.length })] }),
                state.status === 'ready' && dedupedEntries.length === 0 ? react_jsx_runtime.jsx('p', { className: 'dspi-status', children: tt('empty') }) : null,
                state.status === 'ready' && dedupedEntries.length > 0 && filteredEntries.length === 0 ? react_jsx_runtime.jsx('p', { className: 'dspi-status', children: tt('emptySearch') }) : null,
                filteredEntries.length > 0 ? react_jsx_runtime.jsx('ul', {
                  className: 'dspi-cards',
                  children: filteredEntries.map((entry) => {
                    const status = phaseLabel(entry.fiberPhase)
                    const title = moduleShortName(entry.moduleName)
                    const configuration = tt(entry.enabled ? 'enabledTag' : 'disabledTag')
                    const open = expanded === entry.entryId
                    const detailId = catalogId + '-details-' + encodeURIComponent(entry.entryId)
                    return react_jsx_runtime.jsxs('li', {
                      className: 'dspi-card', 'data-plugin-entry': entry.entryId, 'data-open': open ? 'true' : undefined,
                      children: [
                        react_jsx_runtime.jsxs('button', {
                          className: 'dspi-cardContent', type: 'button', 'aria-expanded': open, 'aria-controls': detailId,
                          'aria-label': entry.enabled ? title + ', ' + status + ', ' + configuration : title + ', ' + configuration,
                          onClick: () => setExpanded((c) => c === entry.entryId ? null : entry.entryId),
                          children: [
                            react_jsx_runtime.jsx('strong', { className: 'dspi-cardTitle', title: entry.moduleName, children: title }),
                            react_jsx_runtime.jsxs('span', { className: 'dspi-cardTrailing', children: [
                              entry.enabled ? react_jsx_runtime.jsx('span', { className: 'dspi-statusDot', 'data-phase': entry.fiberPhase ?? 'unobserved', role: 'img', 'aria-label': status, title: status }) : null,
                              react_jsx_runtime.jsx('span', { className: 'dspi-configTag', 'data-enabled': entry.enabled ? 'true' : 'false', children: configuration }),
                              react_jsx_runtime.jsx(primitives.IconChevronDownOutline14, { className: 'dspi-chevron', size: 12, 'aria-hidden': 'true' }),
                            ] }),
                          ],
                        }),
                        open ? react_jsx_runtime.jsxs('div', { className: 'dspi-cardDetails', id: detailId, children: [
                          react_jsx_runtime.jsx('code', { className: 'dspi-entryValue', 'data-loader-entry': true, children: entry.entryId }),
                          react_jsx_runtime.jsxs('dl', { className: 'dspi-details', children: [
                            react_jsx_runtime.jsxs('div', { children: [react_jsx_runtime.jsx('dt', { children: tt('configuration') }), react_jsx_runtime.jsx('dd', { children: configuration })] }),
                            entry.enabled ? react_jsx_runtime.jsxs('div', { children: [react_jsx_runtime.jsx('dt', { children: tt('cordis') }), react_jsx_runtime.jsx('dd', { children: status })] }) : null,
                          ] }),
                        ] }) : null,
                      ],
                    }, entry.entryId)
                  }),
                }) : null,
              ],
            }) : null,
          ],
        })
      }

      // 双保险：即使官方 tab 被缓存加载，也 DOM 去重只保留增强版
      function installPluginTabDedupe() {
        if (typeof document === 'undefined' || typeof MutationObserver !== 'function') return () => {}
        const LABELS = ['插件列表', 'Plugin list']
        let raf = 0
        const patch = () => {
          raf = 0
          // 资源：设置面板未挂载时整段都是 no-op——先查面板快速失败，
          // 避免聊天流式更新时对全文档 'button[aria-controls]' 反复扫描。
          if (document.querySelector('[id$="-panel-all"]') === null) return
          const buttons = Array.from(document.querySelectorAll('button[aria-controls]')).filter((b) => LABELS.includes((b.textContent || '').trim()))
          if (buttons.length > 1) {
            const keep = buttons.find((b) => { const id = b.getAttribute('aria-controls'); const panel = id ? document.getElementById(id) : null; return panel !== null && panel.querySelector('.dspi-section') !== null }) || buttons[0]
            for (const b of buttons) if (b !== keep) b.remove()
          }
          const panels = Array.from(document.querySelectorAll('[id$="-panel-all"]'))
          if (panels.length > 1) {
            const keepPanel = panels.find((p) => p.querySelector('.dspi-section') !== null) || panels[0]
            for (const p of panels) if (p !== keepPanel) p.remove()
          }
          for (const panel of Array.from(document.querySelectorAll('[id$="-panel-all"]'))) {
            const sections = Array.from(panel.querySelectorAll('.dspi-section'))
            for (const s of sections.slice(1)) s.remove()
          }
        }
        const schedule = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; patch() }) }
        const observer = new MutationObserver(schedule)
        observer.observe(document.body, { childList: true, subtree: true })
        schedule()
        return () => { if (raf) cancelAnimationFrame(raf); observer.disconnect() }
      }

      ctx.effect(() => installPluginTabDedupe(), 'ui-tweaks: plugin tab dedupe')
      // 受「插件列表增强」开关控制：关闭时不注册增强 tab（官方已禁用，则插件设置页无增强）
      ctx.slots.inject('settings.plugins.tab', () => {
        if (!config.pluginInventory) return
        return ctx.slots.register({
          name: 'settings.plugins.tab',
          id: 'all',
          order: 10,
          priority: -1,
          label: () => tt('tab'),
          locale: NS_TAB,
          inject: () => ({ list: () => ctx.remote.pluginInventory.list().then((r) => { if (!r.ok) throw new Error((r.error && r.error.message) || 'list failed'); return r.value }) }),
        }, PluginInventoryTab)
      })
    }

    // ── 统一入口 apply ────────────────────────────────────────────────
    // 原 dsh-essentials 的浏览器半区（model-selector / paste-input /
    // attachment-remove；at-file 已于 2026-08-20 移除）在 ./essentials-client.js，
    // 作为同一 load 下的子 factory 组合进来，共享同一 fiber 与 require。
    const essentials = applyEssentialsClient(require)
    const inject = [...new Set([
      'slots',
      'locale',
      'remote',
      'remote.pluginInventory',
      'sessions',
      ...essentials.inject,
    ])]
    function apply(ctx) {
      loadConfig()
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-tweaks: dictionaries')
      ctx.effect(() => {
        const tag = document.createElement('style')
        tag.dataset.plugin = 'dsh-ui-tweaks'
        tag.dataset.pluginCss = 'dsh-ui-tweaks'
        tag.textContent = CSS
        document.head.appendChild(tag)
        return () => tag.remove()
      }, 'ui-tweaks: styles')
      const t = ctx.locale.bind(NS)

      // 基础输入能力（原 dsh-essentials：model-selector / paste-input / attachment-remove）
      essentials.apply(ctx)

      // 通用设置总入口
      ctx.slots.inject('settings.general.item', () => ctx.slots.register({
        name: 'settings.general.item',
        id: 'ui-tweaks',
        order: 30,
        locale: NS,
      }, () => react_jsx_runtime.jsx(UiTweaksMasterCard, { t: t })))

      // 功能控制器
      applyPluginInventory(ctx, t)
      applyKeyboard(ctx, t)
      applyNotify(ctx, t)

      // 卸载时持久化当前配置
      ctx.effect(() => () => saveConfig(), 'ui-tweaks: config persist')
    }
    return { name: 'dsh-ui-tweaks', inject, apply }
  },
})
