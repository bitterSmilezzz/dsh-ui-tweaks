/**
 * dsh-ui-tweaks — browser half (single self-contained bundle, 2026-08-19 merge).
 *
 * 架构：本文件是浏览器半区的唯一事实来源。宿主以 classic script 加载 client
 * bundle（不允许顶层 import/export），故全部能力内联在同一 load：
 *
 *   window.__ModuleLoader__.load({ id: 'dsh-ui-tweaks', factory })
 *   ├─ sub_modelSelector / sub_pasteInput / sub_atFile /
 *   │  sub_attachmentRemoveAlwaysVisible — 4 个 client factory
 *   │  （原 dsh-essentials 半区，2026-08-19 内联；独立的
 *   │   lib/{at-file,paste-input,model-selector}/client.js 子文件已删除）
 *   └─ applyEssentialsClient(require) 组合 4 factory（共享同一 fiber）
 *      + 本文件主体：locale/设置 UI/开关（plugin-inventory、auto-hide、
 *        immersive、shortcuts、notify、retry-settings）
 *
 * 统一约定（2026-08-19 合并重构）：
 * - 统一 locale 命名空间（NS = 'ui-tweaks'），替代合并前 6 个散落的 NS
 * - 统一配置对象（localStorage key 'dsh-ui-tweaks.settings'），替代合并前 3 个散落的 storage key
 * - 通用设置下挂一个「界面增强」总入口（settings.general.item，id=ui-tweaks），
 *   展开后内部分组展示全部功能开关/选项
 * - 三个同构开关（auto-hide / immersive / shortcuts）抽成统一 ToggleCard
 * - notify（桌面通知）作为独立子模块并入：sessions 监听 + 四类事件开关 + 权限行
 * - plugin-inventory 保留插件设置 tab（受开关控制，默认开）
 * - retry-settings 保留 host 路由（/api/retry-settings）+ 通用设置里的次数输入
 *
 * 所有副作用挂在同一 fiber：ctx.effect / ctx.slots.inject 随插件卸载全部回收。
 * 只走官方扩展点：settings.general.item / settings.plugins.tab / webServer 路由。
 */
/**
 * dsh-ui-tweaks — essentials browser half (inlined from dsh-essentials, 2026-08-19).
 *
 * model-selector / paste-input / at-file / attachment-remove 的 client factory。
 * 原为 dsh-essentials 的独立打包模块（`window.__ModuleLoader__.load({ id: 'dsh-essentials' })`），
 * 并入 dsh-ui-tweaks 后以函数包装内联，由 applyEssentialsClient 统一组合 apply。
 * 这些 factory 是本文件的唯一事实来源（独立子文件已删除，勿再建双份）。
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

function sub_atFile(require) { var module = { exports: {} }; var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var import_client = require("@deepseek-ai/dsh-client-runtime/client");

/* zod 子集（生成代码，2026-08-19 tree-shake 替换）：zod@4.4.3 具名导入 8 API（string/object/enum/boolean/union/array/discriminatedUnion/literal）经 esbuild --bundle --minify 打包，IIFE 包裹隔离变量；替换原完整内联 zod（529KB）。重建方法见 dsh-plugins/NOTES。 */
var external_exports = (function () {
var Vn=Object.defineProperty;var Wn=(e,r)=>{for(var t in r)Vn(e,t,{get:r[t],enumerable:!0})};var nr;function u(e,r,t){function o(c,a){if(c._zod||Object.defineProperty(c,"_zod",{value:{def:a,constr:s,traits:new Set},enumerable:!1}),c._zod.traits.has(e))return;c._zod.traits.add(e),r(c,a);let p=s.prototype,l=Object.keys(p);for(let h=0;h<l.length;h++){let m=l[h];m in c||(c[m]=p[m].bind(c))}}let n=t?.Parent??Object;class i extends n{}Object.defineProperty(i,"name",{value:e});function s(c){var a;let p=t?.Parent?new i:this;o(p,c),(a=p._zod).deferred??(a.deferred=[]);for(let l of p._zod.deferred)l();return p}return Object.defineProperty(s,"init",{value:o}),Object.defineProperty(s,Symbol.hasInstance,{value:c=>t?.Parent&&c instanceof t.Parent?!0:c?._zod?.traits?.has(e)}),Object.defineProperty(s,"name",{value:e}),s}var T=class extends Error{constructor(){super("Encountered Promise during synchronous parse. Use .parseAsync() instead.")}},J=class extends Error{constructor(r){super(`Encountered unidirectional transform during encode: ${r}`),this.name="ZodEncodeError"}};(nr=globalThis).__zod_globalConfig??(nr.__zod_globalConfig={});var B=globalThis.__zod_globalConfig;function A(e){return e&&Object.assign(B,e),B}var g={};Wn(g,{BIGINT_FORMAT_RANGES:()=>lr,Class:()=>be,NUMBER_FORMAT_RANGES:()=>pr,aborted:()=>D,allowsEval:()=>ke,assert:()=>Xn,assertEqual:()=>Kn,assertIs:()=>qn,assertNever:()=>Yn,assertNotEqual:()=>Gn,assignProp:()=>R,base64ToUint8Array:()=>dr,base64urlToUint8Array:()=>_s,cached:()=>W,captureStackTrace:()=>ce,cleanEnum:()=>hs,cleanRegex:()=>Q,clone:()=>E,cloneDef:()=>es,createTransparentProxy:()=>is,defineLazy:()=>_,esc:()=>ie,escapeRegex:()=>C,explicitlyAborted:()=>Se,extend:()=>as,finalizeIssue:()=>N,floatSafeRemainder:()=>ir,getElementAtPath:()=>rs,getEnumValues:()=>X,getLengthableOrigin:()=>re,getParsedType:()=>ss,getSizableOrigin:()=>fr,hexToUint8Array:()=>xs,isObject:()=>F,isPlainObject:()=>U,issue:()=>K,joinValues:()=>Hn,jsonStringifyReplacer:()=>V,merge:()=>ls,mergeDefs:()=>j,normalizeParams:()=>d,nullish:()=>H,numKeys:()=>ns,objectClone:()=>Qn,omit:()=>us,optionalKeys:()=>Pe,parsedType:()=>ms,partial:()=>fs,pick:()=>cs,prefixIssues:()=>ee,primitiveTypes:()=>ur,promiseAllObject:()=>ts,propertyKeyTypes:()=>Ze,randomString:()=>os,required:()=>ds,safeExtend:()=>ps,shallowClone:()=>cr,slugify:()=>we,stringifyPrimitive:()=>ar,uint8ArrayToBase64:()=>mr,uint8ArrayToBase64url:()=>gs,uint8ArrayToHex:()=>zs,unwrapMessage:()=>Y});function Kn(e){return e}function Gn(e){return e}function qn(e){}function Yn(e){throw new Error("Unexpected value in exhaustive check")}function Xn(e){}function X(e){let r=Object.values(e).filter(o=>typeof o=="number");return Object.entries(e).filter(([o,n])=>r.indexOf(+o)===-1).map(([o,n])=>n)}function Hn(e,r="|"){return e.map(t=>ar(t)).join(r)}function V(e,r){return typeof r=="bigint"?r.toString():r}function W(e){return{get value(){{let t=e();return Object.defineProperty(this,"value",{value:t}),t}throw new Error("cached value already set")}}}function H(e){return e==null}function Q(e){let r=e.startsWith("^")?1:0,t=e.endsWith("$")?e.length-1:e.length;return e.slice(r,t)}function ir(e,r){let t=e/r,o=Math.round(t),n=Number.EPSILON*Math.max(Math.abs(t),1);return Math.abs(t-o)<n?0:t-o}var sr=Symbol("evaluating");function _(e,r,t){let o;Object.defineProperty(e,r,{get(){if(o!==sr)return o===void 0&&(o=sr,o=t()),o},set(n){Object.defineProperty(e,r,{value:n})},configurable:!0})}function Qn(e){return Object.create(Object.getPrototypeOf(e),Object.getOwnPropertyDescriptors(e))}function R(e,r,t){Object.defineProperty(e,r,{value:t,writable:!0,enumerable:!0,configurable:!0})}function j(...e){let r={};for(let t of e){let o=Object.getOwnPropertyDescriptors(t);Object.assign(r,o)}return Object.defineProperties({},r)}function es(e){return j(e._zod.def)}function rs(e,r){return r?r.reduce((t,o)=>t?.[o],e):e}function ts(e){let r=Object.keys(e),t=r.map(o=>e[o]);return Promise.all(t).then(o=>{let n={};for(let i=0;i<r.length;i++)n[r[i]]=o[i];return n})}function os(e=10){let r="abcdefghijklmnopqrstuvwxyz",t="";for(let o=0;o<e;o++)t+=r[Math.floor(Math.random()*r.length)];return t}function ie(e){return JSON.stringify(e)}function we(e){return e.toLowerCase().trim().replace(/[^\w\s-]/g,"").replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"")}var ce="captureStackTrace"in Error?Error.captureStackTrace:(...e)=>{};function F(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}var ke=W(()=>{if(B.jitless||typeof navigator<"u"&&navigator?.userAgent?.includes("Cloudflare"))return!1;try{let e=Function;return new e(""),!0}catch{return!1}});function U(e){if(F(e)===!1)return!1;let r=e.constructor;if(r===void 0||typeof r!="function")return!0;let t=r.prototype;return!(F(t)===!1||Object.prototype.hasOwnProperty.call(t,"isPrototypeOf")===!1)}function cr(e){return U(e)?{...e}:Array.isArray(e)?[...e]:e instanceof Map?new Map(e):e instanceof Set?new Set(e):e}function ns(e){let r=0;for(let t in e)Object.prototype.hasOwnProperty.call(e,t)&&r++;return r}var ss=e=>{let r=typeof e;switch(r){case"undefined":return"undefined";case"string":return"string";case"number":return Number.isNaN(e)?"nan":"number";case"boolean":return"boolean";case"function":return"function";case"bigint":return"bigint";case"symbol":return"symbol";case"object":return Array.isArray(e)?"array":e===null?"null":e.then&&typeof e.then=="function"&&e.catch&&typeof e.catch=="function"?"promise":typeof Map<"u"&&e instanceof Map?"map":typeof Set<"u"&&e instanceof Set?"set":typeof Date<"u"&&e instanceof Date?"date":typeof File<"u"&&e instanceof File?"file":"object";default:throw new Error(`Unknown data type: ${r}`)}},Ze=new Set(["string","number","symbol"]),ur=new Set(["string","number","bigint","boolean","symbol","undefined"]);function C(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function E(e,r,t){let o=new e._zod.constr(r??e._zod.def);return(!r||t?.parent)&&(o._zod.parent=e),o}function d(e){let r=e;if(!r)return{};if(typeof r=="string")return{error:()=>r};if(r?.message!==void 0){if(r?.error!==void 0)throw new Error("Cannot specify both `message` and `error` params");r.error=r.message}return delete r.message,typeof r.error=="string"?{...r,error:()=>r.error}:r}function is(e){let r;return new Proxy({},{get(t,o,n){return r??(r=e()),Reflect.get(r,o,n)},set(t,o,n,i){return r??(r=e()),Reflect.set(r,o,n,i)},has(t,o){return r??(r=e()),Reflect.has(r,o)},deleteProperty(t,o){return r??(r=e()),Reflect.deleteProperty(r,o)},ownKeys(t){return r??(r=e()),Reflect.ownKeys(r)},getOwnPropertyDescriptor(t,o){return r??(r=e()),Reflect.getOwnPropertyDescriptor(r,o)},defineProperty(t,o,n){return r??(r=e()),Reflect.defineProperty(r,o,n)}})}function ar(e){return typeof e=="bigint"?e.toString()+"n":typeof e=="string"?`"${e}"`:`${e}`}function Pe(e){return Object.keys(e).filter(r=>e[r]._zod.optin==="optional"&&e[r]._zod.optout==="optional")}var pr={safeint:[Number.MIN_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],int32:[-2147483648,2147483647],uint32:[0,4294967295],float32:[-34028234663852886e22,34028234663852886e22],float64:[-Number.MAX_VALUE,Number.MAX_VALUE]},lr={int64:[BigInt("-9223372036854775808"),BigInt("9223372036854775807")],uint64:[BigInt(0),BigInt("18446744073709551615")]};function cs(e,r){let t=e._zod.def,o=t.checks;if(o&&o.length>0)throw new Error(".pick() cannot be used on object schemas containing refinements");let i=j(e._zod.def,{get shape(){let s={};for(let c in r){if(!(c in t.shape))throw new Error(`Unrecognized key: "${c}"`);r[c]&&(s[c]=t.shape[c])}return R(this,"shape",s),s},checks:[]});return E(e,i)}function us(e,r){let t=e._zod.def,o=t.checks;if(o&&o.length>0)throw new Error(".omit() cannot be used on object schemas containing refinements");let i=j(e._zod.def,{get shape(){let s={...e._zod.def.shape};for(let c in r){if(!(c in t.shape))throw new Error(`Unrecognized key: "${c}"`);r[c]&&delete s[c]}return R(this,"shape",s),s},checks:[]});return E(e,i)}function as(e,r){if(!U(r))throw new Error("Invalid input to extend: expected a plain object");let t=e._zod.def.checks;if(t&&t.length>0){let i=e._zod.def.shape;for(let s in r)if(Object.getOwnPropertyDescriptor(i,s)!==void 0)throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.")}let n=j(e._zod.def,{get shape(){let i={...e._zod.def.shape,...r};return R(this,"shape",i),i}});return E(e,n)}function ps(e,r){if(!U(r))throw new Error("Invalid input to safeExtend: expected a plain object");let t=j(e._zod.def,{get shape(){let o={...e._zod.def.shape,...r};return R(this,"shape",o),o}});return E(e,t)}function ls(e,r){if(e._zod.def.checks?.length)throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");let t=j(e._zod.def,{get shape(){let o={...e._zod.def.shape,...r._zod.def.shape};return R(this,"shape",o),o},get catchall(){return r._zod.def.catchall},checks:r._zod.def.checks??[]});return E(e,t)}function fs(e,r,t){let n=r._zod.def.checks;if(n&&n.length>0)throw new Error(".partial() cannot be used on object schemas containing refinements");let s=j(r._zod.def,{get shape(){let c=r._zod.def.shape,a={...c};if(t)for(let p in t){if(!(p in c))throw new Error(`Unrecognized key: "${p}"`);t[p]&&(a[p]=e?new e({type:"optional",innerType:c[p]}):c[p])}else for(let p in c)a[p]=e?new e({type:"optional",innerType:c[p]}):c[p];return R(this,"shape",a),a},checks:[]});return E(r,s)}function ds(e,r,t){let o=j(r._zod.def,{get shape(){let n=r._zod.def.shape,i={...n};if(t)for(let s in t){if(!(s in i))throw new Error(`Unrecognized key: "${s}"`);t[s]&&(i[s]=new e({type:"nonoptional",innerType:n[s]}))}else for(let s in n)i[s]=new e({type:"nonoptional",innerType:n[s]});return R(this,"shape",i),i}});return E(r,o)}function D(e,r=0){if(e.aborted===!0)return!0;for(let t=r;t<e.issues.length;t++)if(e.issues[t]?.continue!==!0)return!0;return!1}function Se(e,r=0){if(e.aborted===!0)return!0;for(let t=r;t<e.issues.length;t++)if(e.issues[t]?.continue===!1)return!0;return!1}function ee(e,r){return r.map(t=>{var o;return(o=t).path??(o.path=[]),t.path.unshift(e),t})}function Y(e){return typeof e=="string"?e:e?.message}function N(e,r,t){let o=e.message?e.message:Y(e.inst?._zod.def?.error?.(e))??Y(r?.error?.(e))??Y(t.customError?.(e))??Y(t.localeError?.(e))??"Invalid input",{inst:n,continue:i,input:s,...c}=e;return c.path??(c.path=[]),c.message=o,r?.reportInput&&(c.input=s),c}function fr(e){return e instanceof Set?"set":e instanceof Map?"map":e instanceof File?"file":"unknown"}function re(e){return Array.isArray(e)?"array":typeof e=="string"?"string":"unknown"}function ms(e){let r=typeof e;switch(r){case"number":return Number.isNaN(e)?"nan":"number";case"object":{if(e===null)return"null";if(Array.isArray(e))return"array";let t=e;if(t&&Object.getPrototypeOf(t)!==Object.prototype&&"constructor"in t&&t.constructor)return t.constructor.name}}return r}function K(...e){let[r,t,o]=e;return typeof r=="string"?{message:r,code:"custom",input:t,inst:o}:{...r}}function hs(e){return Object.entries(e).filter(([r,t])=>Number.isNaN(Number.parseInt(r,10))).map(r=>r[1])}function dr(e){let r=atob(e),t=new Uint8Array(r.length);for(let o=0;o<r.length;o++)t[o]=r.charCodeAt(o);return t}function mr(e){let r="";for(let t=0;t<e.length;t++)r+=String.fromCharCode(e[t]);return btoa(r)}function _s(e){let r=e.replace(/-/g,"+").replace(/_/g,"/"),t="=".repeat((4-r.length%4)%4);return dr(r+t)}function gs(e){return mr(e).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")}function xs(e){let r=e.replace(/^0x/,"");if(r.length%2!==0)throw new Error("Invalid hex string length");let t=new Uint8Array(r.length/2);for(let o=0;o<r.length;o+=2)t[o/2]=Number.parseInt(r.slice(o,o+2),16);return t}function zs(e){return Array.from(e).map(r=>r.toString(16).padStart(2,"0")).join("")}var be=class{constructor(...r){}};var hr=(e,r)=>{e.name="$ZodError",Object.defineProperty(e,"_zod",{value:e._zod,enumerable:!1}),Object.defineProperty(e,"issues",{value:r,enumerable:!1}),e.message=JSON.stringify(r,V,2),Object.defineProperty(e,"toString",{value:()=>e.message,enumerable:!1})},ue=u("$ZodError",hr),Oe=u("$ZodError",hr,{Parent:Error});function _r(e,r=t=>t.message){let t={},o=[];for(let n of e.issues)n.path.length>0?(t[n.path[0]]=t[n.path[0]]||[],t[n.path[0]].push(r(n))):o.push(r(n));return{formErrors:o,fieldErrors:t}}function gr(e,r=t=>t.message){let t={_errors:[]},o=(n,i=[])=>{for(let s of n.issues)if(s.code==="invalid_union"&&s.errors.length)s.errors.map(c=>o({issues:c},[...i,...s.path]));else if(s.code==="invalid_key")o({issues:s.issues},[...i,...s.path]);else if(s.code==="invalid_element")o({issues:s.issues},[...i,...s.path]);else{let c=[...i,...s.path];if(c.length===0)t._errors.push(r(s));else{let a=t,p=0;for(;p<c.length;){let l=c[p];p===c.length-1?(a[l]=a[l]||{_errors:[]},a[l]._errors.push(r(s))):a[l]=a[l]||{_errors:[]},a=a[l],p++}}}};return o(e),t}var ae=e=>(r,t,o,n)=>{let i=o?{...o,async:!1}:{async:!1},s=r._zod.run({value:t,issues:[]},i);if(s instanceof Promise)throw new T;if(s.issues.length){let c=new(n?.Err??e)(s.issues.map(a=>N(a,i,A())));throw ce(c,n?.callee),c}return s.value};var pe=e=>async(r,t,o,n)=>{let i=o?{...o,async:!0}:{async:!0},s=r._zod.run({value:t,issues:[]},i);if(s instanceof Promise&&(s=await s),s.issues.length){let c=new(n?.Err??e)(s.issues.map(a=>N(a,i,A())));throw ce(c,n?.callee),c}return s.value};var te=e=>(r,t,o)=>{let n=o?{...o,async:!1}:{async:!1},i=r._zod.run({value:t,issues:[]},n);if(i instanceof Promise)throw new T;return i.issues.length?{success:!1,error:new(e??ue)(i.issues.map(s=>N(s,n,A())))}:{success:!0,data:i.value}},xr=te(Oe),oe=e=>async(r,t,o)=>{let n=o?{...o,async:!0}:{async:!0},i=r._zod.run({value:t,issues:[]},n);return i instanceof Promise&&(i=await i),i.issues.length?{success:!1,error:new e(i.issues.map(s=>N(s,n,A())))}:{success:!0,data:i.value}},zr=oe(Oe),vr=e=>(r,t,o)=>{let n=o?{...o,direction:"backward"}:{direction:"backward"};return ae(e)(r,t,n)};var yr=e=>(r,t,o)=>ae(e)(r,t,o);var $r=e=>async(r,t,o)=>{let n=o?{...o,direction:"backward"}:{direction:"backward"};return pe(e)(r,t,n)};var br=e=>async(r,t,o)=>pe(e)(r,t,o);var wr=e=>(r,t,o)=>{let n=o?{...o,direction:"backward"}:{direction:"backward"};return te(e)(r,t,n)};var kr=e=>(r,t,o)=>te(e)(r,t,o);var Zr=e=>async(r,t,o)=>{let n=o?{...o,direction:"backward"}:{direction:"backward"};return oe(e)(r,t,n)};var Pr=e=>async(r,t,o)=>oe(e)(r,t,o);var Sr=/^[cC][0-9a-z]{6,}$/,Or=/^[0-9a-z]+$/,Er=/^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/,Ir=/^[0-9a-vA-V]{20}$/,Tr=/^[A-Za-z0-9]{27}$/,Nr=/^[a-zA-Z0-9_-]{21}$/,Ar=/^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;var jr=/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,Ee=e=>e?new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`):/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;var Cr=/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;var ys="^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";function Rr(){return new RegExp(ys,"u")}var Dr=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,Lr=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;var Fr=/^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,Ur=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,Mr=/^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,Ie=/^[A-Za-z0-9_-]*$/;var Jr=/^https?$/,Br=/^\+[1-9]\d{6,14}$/,Vr="(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))",Wr=new RegExp(`^${Vr}$`);function Kr(e){let r="(?:[01]\\d|2[0-3]):[0-5]\\d";return typeof e.precision=="number"?e.precision===-1?`${r}`:e.precision===0?`${r}:[0-5]\\d`:`${r}:[0-5]\\d\\.\\d{${e.precision}}`:`${r}(?::[0-5]\\d(?:\\.\\d+)?)?`}function Gr(e){return new RegExp(`^${Kr(e)}$`)}function qr(e){let r=Kr({precision:e.precision}),t=["Z"];e.local&&t.push(""),e.offset&&t.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");let o=`${r}(?:${t.join("|")})`;return new RegExp(`^${Vr}T(?:${o})$`)}var Yr=e=>{let r=e?`[\\s\\S]{${e?.minimum??0},${e?.maximum??""}}`:"[\\s\\S]*";return new RegExp(`^${r}$`)};var Xr=/^(?:true|false)$/i;var Hr=/^[^A-Z]*$/,Qr=/^[^a-z]*$/;var S=u("$ZodCheck",(e,r)=>{var t;e._zod??(e._zod={}),e._zod.def=r,(t=e._zod).onattach??(t.onattach=[])});var et=u("$ZodCheckMaxLength",(e,r)=>{var t;S.init(e,r),(t=e._zod.def).when??(t.when=o=>{let n=o.value;return!H(n)&&n.length!==void 0}),e._zod.onattach.push(o=>{let n=o._zod.bag.maximum??Number.POSITIVE_INFINITY;r.maximum<n&&(o._zod.bag.maximum=r.maximum)}),e._zod.check=o=>{let n=o.value;if(n.length<=r.maximum)return;let s=re(n);o.issues.push({origin:s,code:"too_big",maximum:r.maximum,inclusive:!0,input:n,inst:e,continue:!r.abort})}}),rt=u("$ZodCheckMinLength",(e,r)=>{var t;S.init(e,r),(t=e._zod.def).when??(t.when=o=>{let n=o.value;return!H(n)&&n.length!==void 0}),e._zod.onattach.push(o=>{let n=o._zod.bag.minimum??Number.NEGATIVE_INFINITY;r.minimum>n&&(o._zod.bag.minimum=r.minimum)}),e._zod.check=o=>{let n=o.value;if(n.length>=r.minimum)return;let s=re(n);o.issues.push({origin:s,code:"too_small",minimum:r.minimum,inclusive:!0,input:n,inst:e,continue:!r.abort})}}),tt=u("$ZodCheckLengthEquals",(e,r)=>{var t;S.init(e,r),(t=e._zod.def).when??(t.when=o=>{let n=o.value;return!H(n)&&n.length!==void 0}),e._zod.onattach.push(o=>{let n=o._zod.bag;n.minimum=r.length,n.maximum=r.length,n.length=r.length}),e._zod.check=o=>{let n=o.value,i=n.length;if(i===r.length)return;let s=re(n),c=i>r.length;o.issues.push({origin:s,...c?{code:"too_big",maximum:r.length}:{code:"too_small",minimum:r.length},inclusive:!0,exact:!0,input:o.value,inst:e,continue:!r.abort})}}),ne=u("$ZodCheckStringFormat",(e,r)=>{var t,o;S.init(e,r),e._zod.onattach.push(n=>{let i=n._zod.bag;i.format=r.format,r.pattern&&(i.patterns??(i.patterns=new Set),i.patterns.add(r.pattern))}),r.pattern?(t=e._zod).check??(t.check=n=>{r.pattern.lastIndex=0,!r.pattern.test(n.value)&&n.issues.push({origin:"string",code:"invalid_format",format:r.format,input:n.value,...r.pattern?{pattern:r.pattern.toString()}:{},inst:e,continue:!r.abort})}):(o=e._zod).check??(o.check=()=>{})}),ot=u("$ZodCheckRegex",(e,r)=>{ne.init(e,r),e._zod.check=t=>{r.pattern.lastIndex=0,!r.pattern.test(t.value)&&t.issues.push({origin:"string",code:"invalid_format",format:"regex",input:t.value,pattern:r.pattern.toString(),inst:e,continue:!r.abort})}}),nt=u("$ZodCheckLowerCase",(e,r)=>{r.pattern??(r.pattern=Hr),ne.init(e,r)}),st=u("$ZodCheckUpperCase",(e,r)=>{r.pattern??(r.pattern=Qr),ne.init(e,r)}),it=u("$ZodCheckIncludes",(e,r)=>{S.init(e,r);let t=C(r.includes),o=new RegExp(typeof r.position=="number"?`^.{${r.position}}${t}`:t);r.pattern=o,e._zod.onattach.push(n=>{let i=n._zod.bag;i.patterns??(i.patterns=new Set),i.patterns.add(o)}),e._zod.check=n=>{n.value.includes(r.includes,r.position)||n.issues.push({origin:"string",code:"invalid_format",format:"includes",includes:r.includes,input:n.value,inst:e,continue:!r.abort})}}),ct=u("$ZodCheckStartsWith",(e,r)=>{S.init(e,r);let t=new RegExp(`^${C(r.prefix)}.*`);r.pattern??(r.pattern=t),e._zod.onattach.push(o=>{let n=o._zod.bag;n.patterns??(n.patterns=new Set),n.patterns.add(t)}),e._zod.check=o=>{o.value.startsWith(r.prefix)||o.issues.push({origin:"string",code:"invalid_format",format:"starts_with",prefix:r.prefix,input:o.value,inst:e,continue:!r.abort})}}),ut=u("$ZodCheckEndsWith",(e,r)=>{S.init(e,r);let t=new RegExp(`.*${C(r.suffix)}$`);r.pattern??(r.pattern=t),e._zod.onattach.push(o=>{let n=o._zod.bag;n.patterns??(n.patterns=new Set),n.patterns.add(t)}),e._zod.check=o=>{o.value.endsWith(r.suffix)||o.issues.push({origin:"string",code:"invalid_format",format:"ends_with",suffix:r.suffix,input:o.value,inst:e,continue:!r.abort})}});var at=u("$ZodCheckOverwrite",(e,r)=>{S.init(e,r),e._zod.check=t=>{t.value=r.tx(t.value)}});var fe=class{constructor(r=[]){this.content=[],this.indent=0,this&&(this.args=r)}indented(r){this.indent+=1,r(this),this.indent-=1}write(r){if(typeof r=="function"){r(this,{execution:"sync"}),r(this,{execution:"async"});return}let o=r.split(`
`).filter(s=>s),n=Math.min(...o.map(s=>s.length-s.trimStart().length)),i=o.map(s=>s.slice(n)).map(s=>" ".repeat(this.indent*2)+s);for(let s of i)this.content.push(s)}compile(){let r=Function,t=this?.args,n=[...(this?.content??[""]).map(i=>`  ${i}`)];return new r(...t,n.join(`
`))}};var lt={major:4,minor:4,patch:3};var $=u("$ZodType",(e,r)=>{var t;e??(e={}),e._zod.def=r,e._zod.bag=e._zod.bag||{},e._zod.version=lt;let o=[...e._zod.def.checks??[]];e._zod.traits.has("$ZodCheck")&&o.unshift(e);for(let n of o)for(let i of n._zod.onattach)i(e);if(o.length===0)(t=e._zod).deferred??(t.deferred=[]),e._zod.deferred?.push(()=>{e._zod.run=e._zod.parse});else{let n=(s,c,a)=>{let p=D(s),l;for(let h of c){if(h._zod.def.when){if(Se(s)||!h._zod.def.when(s))continue}else if(p)continue;let m=s.issues.length,f=h._zod.check(s);if(f instanceof Promise&&a?.async===!1)throw new T;if(l||f instanceof Promise)l=(l??Promise.resolve()).then(async()=>{await f,s.issues.length!==m&&(p||(p=D(s,m)))});else{if(s.issues.length===m)continue;p||(p=D(s,m))}}return l?l.then(()=>s):s},i=(s,c,a)=>{if(D(s))return s.aborted=!0,s;let p=n(c,o,a);if(p instanceof Promise){if(a.async===!1)throw new T;return p.then(l=>e._zod.parse(l,a))}return e._zod.parse(p,a)};e._zod.run=(s,c)=>{if(c.skipChecks)return e._zod.parse(s,c);if(c.direction==="backward"){let p=e._zod.parse({value:s.value,issues:[]},{...c,skipChecks:!0});return p instanceof Promise?p.then(l=>i(l,s,c)):i(p,s,c)}let a=e._zod.parse(s,c);if(a instanceof Promise){if(c.async===!1)throw new T;return a.then(p=>n(p,o,c))}return n(a,o,c)}}_(e,"~standard",()=>({validate:n=>{try{let i=xr(e,n);return i.success?{value:i.data}:{issues:i.error?.issues}}catch{return zr(e,n).then(s=>s.success?{value:s.data}:{issues:s.error?.issues})}},vendor:"zod",version:1}))}),he=u("$ZodString",(e,r)=>{$.init(e,r),e._zod.pattern=[...e?._zod.bag?.patterns??[]].pop()??Yr(e._zod.bag),e._zod.parse=(t,o)=>{if(r.coerce)try{t.value=String(t.value)}catch{}return typeof t.value=="string"||t.issues.push({expected:"string",code:"invalid_type",input:t.value,inst:e}),t}}),z=u("$ZodStringFormat",(e,r)=>{ne.init(e,r),he.init(e,r)}),vt=u("$ZodGUID",(e,r)=>{r.pattern??(r.pattern=jr),z.init(e,r)}),yt=u("$ZodUUID",(e,r)=>{if(r.version){let o={v1:1,v2:2,v3:3,v4:4,v5:5,v6:6,v7:7,v8:8}[r.version];if(o===void 0)throw new Error(`Invalid UUID version: "${r.version}"`);r.pattern??(r.pattern=Ee(o))}else r.pattern??(r.pattern=Ee());z.init(e,r)}),$t=u("$ZodEmail",(e,r)=>{r.pattern??(r.pattern=Cr),z.init(e,r)}),bt=u("$ZodURL",(e,r)=>{z.init(e,r),e._zod.check=t=>{try{let o=t.value.trim();if(!r.normalize&&r.protocol?.source===Jr.source&&!/^https?:\/\//i.test(o)){t.issues.push({code:"invalid_format",format:"url",note:"Invalid URL format",input:t.value,inst:e,continue:!r.abort});return}let n=new URL(o);r.hostname&&(r.hostname.lastIndex=0,r.hostname.test(n.hostname)||t.issues.push({code:"invalid_format",format:"url",note:"Invalid hostname",pattern:r.hostname.source,input:t.value,inst:e,continue:!r.abort})),r.protocol&&(r.protocol.lastIndex=0,r.protocol.test(n.protocol.endsWith(":")?n.protocol.slice(0,-1):n.protocol)||t.issues.push({code:"invalid_format",format:"url",note:"Invalid protocol",pattern:r.protocol.source,input:t.value,inst:e,continue:!r.abort})),r.normalize?t.value=n.href:t.value=o;return}catch{t.issues.push({code:"invalid_format",format:"url",input:t.value,inst:e,continue:!r.abort})}}}),wt=u("$ZodEmoji",(e,r)=>{r.pattern??(r.pattern=Rr()),z.init(e,r)}),kt=u("$ZodNanoID",(e,r)=>{r.pattern??(r.pattern=Nr),z.init(e,r)}),Zt=u("$ZodCUID",(e,r)=>{r.pattern??(r.pattern=Sr),z.init(e,r)}),Pt=u("$ZodCUID2",(e,r)=>{r.pattern??(r.pattern=Or),z.init(e,r)}),St=u("$ZodULID",(e,r)=>{r.pattern??(r.pattern=Er),z.init(e,r)}),Ot=u("$ZodXID",(e,r)=>{r.pattern??(r.pattern=Ir),z.init(e,r)}),Et=u("$ZodKSUID",(e,r)=>{r.pattern??(r.pattern=Tr),z.init(e,r)}),It=u("$ZodISODateTime",(e,r)=>{r.pattern??(r.pattern=qr(r)),z.init(e,r)}),Tt=u("$ZodISODate",(e,r)=>{r.pattern??(r.pattern=Wr),z.init(e,r)}),Nt=u("$ZodISOTime",(e,r)=>{r.pattern??(r.pattern=Gr(r)),z.init(e,r)}),At=u("$ZodISODuration",(e,r)=>{r.pattern??(r.pattern=Ar),z.init(e,r)}),jt=u("$ZodIPv4",(e,r)=>{r.pattern??(r.pattern=Dr),z.init(e,r),e._zod.bag.format="ipv4"}),Ct=u("$ZodIPv6",(e,r)=>{r.pattern??(r.pattern=Lr),z.init(e,r),e._zod.bag.format="ipv6",e._zod.check=t=>{try{new URL(`http://[${t.value}]`)}catch{t.issues.push({code:"invalid_format",format:"ipv6",input:t.value,inst:e,continue:!r.abort})}}});var Rt=u("$ZodCIDRv4",(e,r)=>{r.pattern??(r.pattern=Fr),z.init(e,r)}),Dt=u("$ZodCIDRv6",(e,r)=>{r.pattern??(r.pattern=Ur),z.init(e,r),e._zod.check=t=>{let o=t.value.split("/");try{if(o.length!==2)throw new Error;let[n,i]=o;if(!i)throw new Error;let s=Number(i);if(`${s}`!==i)throw new Error;if(s<0||s>128)throw new Error;new URL(`http://[${n}]`)}catch{t.issues.push({code:"invalid_format",format:"cidrv6",input:t.value,inst:e,continue:!r.abort})}}});function Lt(e){if(e==="")return!0;if(/\s/.test(e)||e.length%4!==0)return!1;try{return atob(e),!0}catch{return!1}}var Ft=u("$ZodBase64",(e,r)=>{r.pattern??(r.pattern=Mr),z.init(e,r),e._zod.bag.contentEncoding="base64",e._zod.check=t=>{Lt(t.value)||t.issues.push({code:"invalid_format",format:"base64",input:t.value,inst:e,continue:!r.abort})}});function $s(e){if(!Ie.test(e))return!1;let r=e.replace(/[-_]/g,o=>o==="-"?"+":"/"),t=r.padEnd(Math.ceil(r.length/4)*4,"=");return Lt(t)}var Ut=u("$ZodBase64URL",(e,r)=>{r.pattern??(r.pattern=Ie),z.init(e,r),e._zod.bag.contentEncoding="base64url",e._zod.check=t=>{$s(t.value)||t.issues.push({code:"invalid_format",format:"base64url",input:t.value,inst:e,continue:!r.abort})}}),Mt=u("$ZodE164",(e,r)=>{r.pattern??(r.pattern=Br),z.init(e,r)});function bs(e,r=null){try{let t=e.split(".");if(t.length!==3)return!1;let[o]=t;if(!o)return!1;let n=JSON.parse(atob(o));return!("typ"in n&&n?.typ!=="JWT"||!n.alg||r&&(!("alg"in n)||n.alg!==r))}catch{return!1}}var Jt=u("$ZodJWT",(e,r)=>{z.init(e,r),e._zod.check=t=>{bs(t.value,r.alg)||t.issues.push({code:"invalid_format",format:"jwt",input:t.value,inst:e,continue:!r.abort})}});var Bt=u("$ZodBoolean",(e,r)=>{$.init(e,r),e._zod.pattern=Xr,e._zod.parse=(t,o)=>{if(r.coerce)try{t.value=!!t.value}catch{}let n=t.value;return typeof n=="boolean"||t.issues.push({expected:"boolean",code:"invalid_type",input:n,inst:e}),t}});var Vt=u("$ZodUnknown",(e,r)=>{$.init(e,r),e._zod.parse=t=>t}),Wt=u("$ZodNever",(e,r)=>{$.init(e,r),e._zod.parse=(t,o)=>(t.issues.push({expected:"never",code:"invalid_type",input:t.value,inst:e}),t)});function ft(e,r,t){e.issues.length&&r.issues.push(...ee(t,e.issues)),r.value[t]=e.value}var Kt=u("$ZodArray",(e,r)=>{$.init(e,r),e._zod.parse=(t,o)=>{let n=t.value;if(!Array.isArray(n))return t.issues.push({expected:"array",code:"invalid_type",input:n,inst:e}),t;t.value=Array(n.length);let i=[];for(let s=0;s<n.length;s++){let c=n[s],a=r.element._zod.run({value:c,issues:[]},o);a instanceof Promise?i.push(a.then(p=>ft(p,t,s))):ft(a,t,s)}return i.length?Promise.all(i).then(()=>t):t}});function me(e,r,t,o,n,i){let s=t in o;if(e.issues.length){if(n&&i&&!s)return;r.issues.push(...ee(t,e.issues))}if(!s&&!n){e.issues.length||r.issues.push({code:"invalid_type",expected:"nonoptional",input:void 0,path:[t]});return}e.value===void 0?s&&(r.value[t]=void 0):r.value[t]=e.value}function Gt(e){let r=Object.keys(e.shape);for(let o of r)if(!e.shape?.[o]?._zod?.traits?.has("$ZodType"))throw new Error(`Invalid element at key "${o}": expected a Zod schema`);let t=Pe(e.shape);return{...e,keys:r,keySet:new Set(r),numKeys:r.length,optionalKeys:new Set(t)}}function qt(e,r,t,o,n,i){let s=[],c=n.keySet,a=n.catchall._zod,p=a.def.type,l=a.optin==="optional",h=a.optout==="optional";for(let m in r){if(m==="__proto__"||c.has(m))continue;if(p==="never"){s.push(m);continue}let f=a.run({value:r[m],issues:[]},o);f instanceof Promise?e.push(f.then(x=>me(x,t,m,r,l,h))):me(f,t,m,r,l,h)}return s.length&&t.issues.push({code:"unrecognized_keys",keys:s,input:r,inst:i}),e.length?Promise.all(e).then(()=>t):t}var ws=u("$ZodObject",(e,r)=>{if($.init(e,r),!Object.getOwnPropertyDescriptor(r,"shape")?.get){let c=r.shape;Object.defineProperty(r,"shape",{get:()=>{let a={...c};return Object.defineProperty(r,"shape",{value:a}),a}})}let o=W(()=>Gt(r));_(e._zod,"propValues",()=>{let c=r.shape,a={};for(let p in c){let l=c[p]._zod;if(l.values){a[p]??(a[p]=new Set);for(let h of l.values)a[p].add(h)}}return a});let n=F,i=r.catchall,s;e._zod.parse=(c,a)=>{s??(s=o.value);let p=c.value;if(!n(p))return c.issues.push({expected:"object",code:"invalid_type",input:p,inst:e}),c;c.value={};let l=[],h=s.shape;for(let m of s.keys){let f=h[m],x=f._zod.optin==="optional",q=f._zod.optout==="optional",w=f._zod.run({value:p[m],issues:[]},a);w instanceof Promise?l.push(w.then(ye=>me(ye,c,m,p,x,q))):me(w,c,m,p,x,q)}return i?qt(l,p,c,a,o.value,e):l.length?Promise.all(l).then(()=>c):c}}),Yt=u("$ZodObjectJIT",(e,r)=>{ws.init(e,r);let t=e._zod.parse,o=W(()=>Gt(r)),n=m=>{let f=new fe(["shape","payload","ctx"]),x=o.value,q=I=>{let y=ie(I);return`shape[${y}]._zod.run({ value: input[${y}], issues: [] }, ctx)`};f.write("const input = payload.value;");let w=Object.create(null),ye=0;for(let I of x.keys)w[I]=`key_${ye++}`;f.write("const newResult = {};");for(let I of x.keys){let y=w[I],Z=ie(I),tr=m[I],or=tr?._zod?.optin==="optional",Bn=tr?._zod?.optout==="optional";f.write(`const ${y} = ${q(I)};`),or&&Bn?f.write(`
        if (${y}.issues.length) {
          if (${Z} in input) {
            payload.issues = payload.issues.concat(${y}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${Z}, ...iss.path] : [${Z}]
            })));
          }
        }
        
        if (${y}.value === undefined) {
          if (${Z} in input) {
            newResult[${Z}] = undefined;
          }
        } else {
          newResult[${Z}] = ${y}.value;
        }
        
      `):or?f.write(`
        if (${y}.issues.length) {
          payload.issues = payload.issues.concat(${y}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${Z}, ...iss.path] : [${Z}]
          })));
        }
        
        if (${y}.value === undefined) {
          if (${Z} in input) {
            newResult[${Z}] = undefined;
          }
        } else {
          newResult[${Z}] = ${y}.value;
        }
        
      `):f.write(`
        const ${y}_present = ${Z} in input;
        if (${y}.issues.length) {
          payload.issues = payload.issues.concat(${y}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${Z}, ...iss.path] : [${Z}]
          })));
        }
        if (!${y}_present && !${y}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${Z}]
          });
        }

        if (${y}_present) {
          if (${y}.value === undefined) {
            newResult[${Z}] = undefined;
          } else {
            newResult[${Z}] = ${y}.value;
          }
        }

      `)}f.write("payload.value = newResult;"),f.write("return payload;");let Jn=f.compile();return(I,y)=>Jn(m,I,y)},i,s=F,c=!B.jitless,p=c&&ke.value,l=r.catchall,h;e._zod.parse=(m,f)=>{h??(h=o.value);let x=m.value;return s(x)?c&&p&&f?.async===!1&&f.jitless!==!0?(i||(i=n(r.shape)),m=i(m,f),l?qt([],x,m,f,h,e):m):t(m,f):(m.issues.push({expected:"object",code:"invalid_type",input:x,inst:e}),m)}});function dt(e,r,t,o){for(let i of e)if(i.issues.length===0)return r.value=i.value,r;let n=e.filter(i=>!D(i));return n.length===1?(r.value=n[0].value,n[0]):(r.issues.push({code:"invalid_union",input:r.value,inst:t,errors:e.map(i=>i.issues.map(s=>N(s,o,A())))}),r)}var Ne=u("$ZodUnion",(e,r)=>{$.init(e,r),_(e._zod,"optin",()=>r.options.some(o=>o._zod.optin==="optional")?"optional":void 0),_(e._zod,"optout",()=>r.options.some(o=>o._zod.optout==="optional")?"optional":void 0),_(e._zod,"values",()=>{if(r.options.every(o=>o._zod.values))return new Set(r.options.flatMap(o=>Array.from(o._zod.values)))}),_(e._zod,"pattern",()=>{if(r.options.every(o=>o._zod.pattern)){let o=r.options.map(n=>n._zod.pattern);return new RegExp(`^(${o.map(n=>Q(n.source)).join("|")})$`)}});let t=r.options.length===1?r.options[0]._zod.run:null;e._zod.parse=(o,n)=>{if(t)return t(o,n);let i=!1,s=[];for(let c of r.options){let a=c._zod.run({value:o.value,issues:[]},n);if(a instanceof Promise)s.push(a),i=!0;else{if(a.issues.length===0)return a;s.push(a)}}return i?Promise.all(s).then(c=>dt(c,o,e,n)):dt(s,o,e,n)}});var Xt=u("$ZodDiscriminatedUnion",(e,r)=>{r.inclusive=!1,Ne.init(e,r);let t=e._zod.parse;_(e._zod,"propValues",()=>{let n={};for(let i of r.options){let s=i._zod.propValues;if(!s||Object.keys(s).length===0)throw new Error(`Invalid discriminated union option at index "${r.options.indexOf(i)}"`);for(let[c,a]of Object.entries(s)){n[c]||(n[c]=new Set);for(let p of a)n[c].add(p)}}return n});let o=W(()=>{let n=r.options,i=new Map;for(let s of n){let c=s._zod.propValues?.[r.discriminator];if(!c||c.size===0)throw new Error(`Invalid discriminated union option at index "${r.options.indexOf(s)}"`);for(let a of c){if(i.has(a))throw new Error(`Duplicate discriminator value "${String(a)}"`);i.set(a,s)}}return i});e._zod.parse=(n,i)=>{let s=n.value;if(!F(s))return n.issues.push({code:"invalid_type",expected:"object",input:s,inst:e}),n;let c=o.value.get(s?.[r.discriminator]);return c?c._zod.run(n,i):r.unionFallback||i.direction==="backward"?t(n,i):(n.issues.push({code:"invalid_union",errors:[],note:"No matching discriminator",discriminator:r.discriminator,options:Array.from(o.value.keys()),input:s,path:[r.discriminator],inst:e}),n)}}),Ht=u("$ZodIntersection",(e,r)=>{$.init(e,r),e._zod.parse=(t,o)=>{let n=t.value,i=r.left._zod.run({value:n,issues:[]},o),s=r.right._zod.run({value:n,issues:[]},o);return i instanceof Promise||s instanceof Promise?Promise.all([i,s]).then(([a,p])=>mt(t,a,p)):mt(t,i,s)}});function Te(e,r){if(e===r)return{valid:!0,data:e};if(e instanceof Date&&r instanceof Date&&+e==+r)return{valid:!0,data:e};if(U(e)&&U(r)){let t=Object.keys(r),o=Object.keys(e).filter(i=>t.indexOf(i)!==-1),n={...e,...r};for(let i of o){let s=Te(e[i],r[i]);if(!s.valid)return{valid:!1,mergeErrorPath:[i,...s.mergeErrorPath]};n[i]=s.data}return{valid:!0,data:n}}if(Array.isArray(e)&&Array.isArray(r)){if(e.length!==r.length)return{valid:!1,mergeErrorPath:[]};let t=[];for(let o=0;o<e.length;o++){let n=e[o],i=r[o],s=Te(n,i);if(!s.valid)return{valid:!1,mergeErrorPath:[o,...s.mergeErrorPath]};t.push(s.data)}return{valid:!0,data:t}}return{valid:!1,mergeErrorPath:[]}}function mt(e,r,t){let o=new Map,n;for(let c of r.issues)if(c.code==="unrecognized_keys"){n??(n=c);for(let a of c.keys)o.has(a)||o.set(a,{}),o.get(a).l=!0}else e.issues.push(c);for(let c of t.issues)if(c.code==="unrecognized_keys")for(let a of c.keys)o.has(a)||o.set(a,{}),o.get(a).r=!0;else e.issues.push(c);let i=[...o].filter(([,c])=>c.l&&c.r).map(([c])=>c);if(i.length&&n&&e.issues.push({...n,keys:i}),D(e))return e;let s=Te(r.value,t.value);if(!s.valid)throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(s.mergeErrorPath)}`);return e.value=s.data,e}var Qt=u("$ZodEnum",(e,r)=>{$.init(e,r);let t=X(r.entries),o=new Set(t);e._zod.values=o,e._zod.pattern=new RegExp(`^(${t.filter(n=>Ze.has(typeof n)).map(n=>typeof n=="string"?C(n):n.toString()).join("|")})$`),e._zod.parse=(n,i)=>{let s=n.value;return o.has(s)||n.issues.push({code:"invalid_value",values:t,input:s,inst:e}),n}}),eo=u("$ZodLiteral",(e,r)=>{if($.init(e,r),r.values.length===0)throw new Error("Cannot create literal schema with no valid values");let t=new Set(r.values);e._zod.values=t,e._zod.pattern=new RegExp(`^(${r.values.map(o=>typeof o=="string"?C(o):o?C(o.toString()):String(o)).join("|")})$`),e._zod.parse=(o,n)=>{let i=o.value;return t.has(i)||o.issues.push({code:"invalid_value",values:r.values,input:i,inst:e}),o}});var ro=u("$ZodTransform",(e,r)=>{$.init(e,r),e._zod.optin="optional",e._zod.parse=(t,o)=>{if(o.direction==="backward")throw new J(e.constructor.name);let n=r.transform(t.value,t);if(o.async)return(n instanceof Promise?n:Promise.resolve(n)).then(s=>(t.value=s,t.fallback=!0,t));if(n instanceof Promise)throw new T;return t.value=n,t.fallback=!0,t}});function ht(e,r){return r===void 0&&(e.issues.length||e.fallback)?{issues:[],value:void 0}:e}var Ae=u("$ZodOptional",(e,r)=>{$.init(e,r),e._zod.optin="optional",e._zod.optout="optional",_(e._zod,"values",()=>r.innerType._zod.values?new Set([...r.innerType._zod.values,void 0]):void 0),_(e._zod,"pattern",()=>{let t=r.innerType._zod.pattern;return t?new RegExp(`^(${Q(t.source)})?$`):void 0}),e._zod.parse=(t,o)=>{if(r.innerType._zod.optin==="optional"){let n=t.value,i=r.innerType._zod.run(t,o);return i instanceof Promise?i.then(s=>ht(s,n)):ht(i,n)}return t.value===void 0?t:r.innerType._zod.run(t,o)}}),to=u("$ZodExactOptional",(e,r)=>{Ae.init(e,r),_(e._zod,"values",()=>r.innerType._zod.values),_(e._zod,"pattern",()=>r.innerType._zod.pattern),e._zod.parse=(t,o)=>r.innerType._zod.run(t,o)}),oo=u("$ZodNullable",(e,r)=>{$.init(e,r),_(e._zod,"optin",()=>r.innerType._zod.optin),_(e._zod,"optout",()=>r.innerType._zod.optout),_(e._zod,"pattern",()=>{let t=r.innerType._zod.pattern;return t?new RegExp(`^(${Q(t.source)}|null)$`):void 0}),_(e._zod,"values",()=>r.innerType._zod.values?new Set([...r.innerType._zod.values,null]):void 0),e._zod.parse=(t,o)=>t.value===null?t:r.innerType._zod.run(t,o)}),no=u("$ZodDefault",(e,r)=>{$.init(e,r),e._zod.optin="optional",_(e._zod,"values",()=>r.innerType._zod.values),e._zod.parse=(t,o)=>{if(o.direction==="backward")return r.innerType._zod.run(t,o);if(t.value===void 0)return t.value=r.defaultValue,t;let n=r.innerType._zod.run(t,o);return n instanceof Promise?n.then(i=>_t(i,r)):_t(n,r)}});function _t(e,r){return e.value===void 0&&(e.value=r.defaultValue),e}var so=u("$ZodPrefault",(e,r)=>{$.init(e,r),e._zod.optin="optional",_(e._zod,"values",()=>r.innerType._zod.values),e._zod.parse=(t,o)=>(o.direction==="backward"||t.value===void 0&&(t.value=r.defaultValue),r.innerType._zod.run(t,o))}),io=u("$ZodNonOptional",(e,r)=>{$.init(e,r),_(e._zod,"values",()=>{let t=r.innerType._zod.values;return t?new Set([...t].filter(o=>o!==void 0)):void 0}),e._zod.parse=(t,o)=>{let n=r.innerType._zod.run(t,o);return n instanceof Promise?n.then(i=>gt(i,e)):gt(n,e)}});function gt(e,r){return!e.issues.length&&e.value===void 0&&e.issues.push({code:"invalid_type",expected:"nonoptional",input:e.value,inst:r}),e}var co=u("$ZodCatch",(e,r)=>{$.init(e,r),e._zod.optin="optional",_(e._zod,"optout",()=>r.innerType._zod.optout),_(e._zod,"values",()=>r.innerType._zod.values),e._zod.parse=(t,o)=>{if(o.direction==="backward")return r.innerType._zod.run(t,o);let n=r.innerType._zod.run(t,o);return n instanceof Promise?n.then(i=>(t.value=i.value,i.issues.length&&(t.value=r.catchValue({...t,error:{issues:i.issues.map(s=>N(s,o,A()))},input:t.value}),t.issues=[],t.fallback=!0),t)):(t.value=n.value,n.issues.length&&(t.value=r.catchValue({...t,error:{issues:n.issues.map(i=>N(i,o,A()))},input:t.value}),t.issues=[],t.fallback=!0),t)}});var uo=u("$ZodPipe",(e,r)=>{$.init(e,r),_(e._zod,"values",()=>r.in._zod.values),_(e._zod,"optin",()=>r.in._zod.optin),_(e._zod,"optout",()=>r.out._zod.optout),_(e._zod,"propValues",()=>r.in._zod.propValues),e._zod.parse=(t,o)=>{if(o.direction==="backward"){let i=r.out._zod.run(t,o);return i instanceof Promise?i.then(s=>de(s,r.in,o)):de(i,r.in,o)}let n=r.in._zod.run(t,o);return n instanceof Promise?n.then(i=>de(i,r.out,o)):de(n,r.out,o)}});function de(e,r,t){return e.issues.length?(e.aborted=!0,e):r._zod.run({value:e.value,issues:e.issues,fallback:e.fallback},t)}var ao=u("$ZodReadonly",(e,r)=>{$.init(e,r),_(e._zod,"propValues",()=>r.innerType._zod.propValues),_(e._zod,"values",()=>r.innerType._zod.values),_(e._zod,"optin",()=>r.innerType?._zod?.optin),_(e._zod,"optout",()=>r.innerType?._zod?.optout),e._zod.parse=(t,o)=>{if(o.direction==="backward")return r.innerType._zod.run(t,o);let n=r.innerType._zod.run(t,o);return n instanceof Promise?n.then(xt):xt(n)}});function xt(e){return e.value=Object.freeze(e.value),e}var po=u("$ZodCustom",(e,r)=>{S.init(e,r),$.init(e,r),e._zod.parse=(t,o)=>t,e._zod.check=t=>{let o=t.value,n=r.fn(o);if(n instanceof Promise)return n.then(i=>zt(i,t,o,e));zt(n,t,o,e)}});function zt(e,r,t,o){if(!e){let n={code:"custom",input:t,inst:o,path:[...o._zod.def.path??[]],continue:!o._zod.def.abort};o._zod.def.params&&(n.params=o._zod.def.params),r.issues.push(K(n))}}var lo;var je=class{constructor(){this._map=new WeakMap,this._idmap=new Map}add(r,...t){let o=t[0];return this._map.set(r,o),o&&typeof o=="object"&&"id"in o&&this._idmap.set(o.id,r),this}clear(){return this._map=new WeakMap,this._idmap=new Map,this}remove(r){let t=this._map.get(r);return t&&typeof t=="object"&&"id"in t&&this._idmap.delete(t.id),this._map.delete(r),this}get(r){let t=r._zod.parent;if(t){let o={...this.get(t)??{}};delete o.id;let n={...o,...this._map.get(r)};return Object.keys(n).length?n:void 0}return this._map.get(r)}has(r){return this._map.has(r)}};function ks(){return new je}(lo=globalThis).__zod_globalRegistry??(lo.__zod_globalRegistry=ks());var M=globalThis.__zod_globalRegistry;function fo(e,r){return new e({type:"string",...d(r)})}function mo(e,r){return new e({type:"string",format:"email",check:"string_format",abort:!1,...d(r)})}function Ce(e,r){return new e({type:"string",format:"guid",check:"string_format",abort:!1,...d(r)})}function ho(e,r){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,...d(r)})}function _o(e,r){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v4",...d(r)})}function go(e,r){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v6",...d(r)})}function xo(e,r){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v7",...d(r)})}function zo(e,r){return new e({type:"string",format:"url",check:"string_format",abort:!1,...d(r)})}function vo(e,r){return new e({type:"string",format:"emoji",check:"string_format",abort:!1,...d(r)})}function yo(e,r){return new e({type:"string",format:"nanoid",check:"string_format",abort:!1,...d(r)})}function $o(e,r){return new e({type:"string",format:"cuid",check:"string_format",abort:!1,...d(r)})}function bo(e,r){return new e({type:"string",format:"cuid2",check:"string_format",abort:!1,...d(r)})}function wo(e,r){return new e({type:"string",format:"ulid",check:"string_format",abort:!1,...d(r)})}function ko(e,r){return new e({type:"string",format:"xid",check:"string_format",abort:!1,...d(r)})}function Zo(e,r){return new e({type:"string",format:"ksuid",check:"string_format",abort:!1,...d(r)})}function Po(e,r){return new e({type:"string",format:"ipv4",check:"string_format",abort:!1,...d(r)})}function So(e,r){return new e({type:"string",format:"ipv6",check:"string_format",abort:!1,...d(r)})}function Oo(e,r){return new e({type:"string",format:"cidrv4",check:"string_format",abort:!1,...d(r)})}function Eo(e,r){return new e({type:"string",format:"cidrv6",check:"string_format",abort:!1,...d(r)})}function Io(e,r){return new e({type:"string",format:"base64",check:"string_format",abort:!1,...d(r)})}function To(e,r){return new e({type:"string",format:"base64url",check:"string_format",abort:!1,...d(r)})}function No(e,r){return new e({type:"string",format:"e164",check:"string_format",abort:!1,...d(r)})}function Ao(e,r){return new e({type:"string",format:"jwt",check:"string_format",abort:!1,...d(r)})}function jo(e,r){return new e({type:"string",format:"datetime",check:"string_format",offset:!1,local:!1,precision:null,...d(r)})}function Co(e,r){return new e({type:"string",format:"date",check:"string_format",...d(r)})}function Ro(e,r){return new e({type:"string",format:"time",check:"string_format",precision:null,...d(r)})}function Do(e,r){return new e({type:"string",format:"duration",check:"string_format",...d(r)})}function Lo(e,r){return new e({type:"boolean",...d(r)})}function Fo(e){return new e({type:"unknown"})}function Uo(e,r){return new e({type:"never",...d(r)})}function _e(e,r){return new et({check:"max_length",...d(r),maximum:e})}function G(e,r){return new rt({check:"min_length",...d(r),minimum:e})}function ge(e,r){return new tt({check:"length_equals",...d(r),length:e})}function Re(e,r){return new ot({check:"string_format",format:"regex",...d(r),pattern:e})}function De(e){return new nt({check:"string_format",format:"lowercase",...d(e)})}function Le(e){return new st({check:"string_format",format:"uppercase",...d(e)})}function Fe(e,r){return new it({check:"string_format",format:"includes",...d(r),includes:e})}function Ue(e,r){return new ct({check:"string_format",format:"starts_with",...d(r),prefix:e})}function Me(e,r){return new ut({check:"string_format",format:"ends_with",...d(r),suffix:e})}function L(e){return new at({check:"overwrite",tx:e})}function Je(e){return L(r=>r.normalize(e))}function Be(){return L(e=>e.trim())}function Ve(){return L(e=>e.toLowerCase())}function We(){return L(e=>e.toUpperCase())}function Ke(){return L(e=>we(e))}function Mo(e,r,t){return new e({type:"array",element:r,...d(t)})}function Jo(e,r,t){return new e({type:"custom",check:"custom",fn:r,...d(t)})}function Bo(e,r){let t=Zs(o=>(o.addIssue=n=>{if(typeof n=="string")o.issues.push(K(n,o.value,t._zod.def));else{let i=n;i.fatal&&(i.continue=!1),i.code??(i.code="custom"),i.input??(i.input=o.value),i.inst??(i.inst=t),i.continue??(i.continue=!t._zod.def.abort),o.issues.push(K(i))}},e(o.value,o)),r);return t}function Zs(e,r){let t=new S({check:"custom",...d(r)});return t._zod.check=e,t}function Ge(e){let r=e?.target??"draft-2020-12";return r==="draft-4"&&(r="draft-04"),r==="draft-7"&&(r="draft-07"),{processors:e.processors??{},metadataRegistry:e?.metadata??M,target:r,unrepresentable:e?.unrepresentable??"throw",override:e?.override??(()=>{}),io:e?.io??"output",counter:0,seen:new Map,cycles:e?.cycles??"ref",reused:e?.reused??"inline",external:e?.external??void 0}}function k(e,r,t={path:[],schemaPath:[]}){var o;let n=e._zod.def,i=r.seen.get(e);if(i)return i.count++,t.schemaPath.includes(e)&&(i.cycle=t.path),i.schema;let s={schema:{},count:1,cycle:void 0,path:t.path};r.seen.set(e,s);let c=e._zod.toJSONSchema?.();if(c)s.schema=c;else{let l={...t,schemaPath:[...t.schemaPath,e],path:t.path};if(e._zod.processJSONSchema)e._zod.processJSONSchema(r,s.schema,l);else{let m=s.schema,f=r.processors[n.type];if(!f)throw new Error(`[toJSONSchema]: Non-representable type encountered: ${n.type}`);f(e,r,m,l)}let h=e._zod.parent;h&&(s.ref||(s.ref=h),k(h,r,l),r.seen.get(h).isParent=!0)}let a=r.metadataRegistry.get(e);return a&&Object.assign(s.schema,a),r.io==="input"&&P(e)&&(delete s.schema.examples,delete s.schema.default),r.io==="input"&&"_prefault"in s.schema&&((o=s.schema).default??(o.default=s.schema._prefault)),delete s.schema._prefault,r.seen.get(e).schema}function qe(e,r){let t=e.seen.get(r);if(!t)throw new Error("Unprocessed schema. This is a bug in Zod.");let o=new Map;for(let s of e.seen.entries()){let c=e.metadataRegistry.get(s[0])?.id;if(c){let a=o.get(c);if(a&&a!==s[0])throw new Error(`Duplicate schema id "${c}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);o.set(c,s[0])}}let n=s=>{let c=e.target==="draft-2020-12"?"$defs":"definitions";if(e.external){let h=e.external.registry.get(s[0])?.id,m=e.external.uri??(x=>x);if(h)return{ref:m(h)};let f=s[1].defId??s[1].schema.id??`schema${e.counter++}`;return s[1].defId=f,{defId:f,ref:`${m("__shared")}#/${c}/${f}`}}if(s[1]===t)return{ref:"#"};let p=`#/${c}/`,l=s[1].schema.id??`__schema${e.counter++}`;return{defId:l,ref:p+l}},i=s=>{if(s[1].schema.$ref)return;let c=s[1],{ref:a,defId:p}=n(s);c.def={...c.schema},p&&(c.defId=p);let l=c.schema;for(let h in l)delete l[h];l.$ref=a};if(e.cycles==="throw")for(let s of e.seen.entries()){let c=s[1];if(c.cycle)throw new Error(`Cycle detected: #/${c.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`)}for(let s of e.seen.entries()){let c=s[1];if(r===s[0]){i(s);continue}if(e.external){let p=e.external.registry.get(s[0])?.id;if(r!==s[0]&&p){i(s);continue}}if(e.metadataRegistry.get(s[0])?.id){i(s);continue}if(c.cycle){i(s);continue}if(c.count>1&&e.reused==="ref"){i(s);continue}}}function Ye(e,r){let t=e.seen.get(r);if(!t)throw new Error("Unprocessed schema. This is a bug in Zod.");let o=c=>{let a=e.seen.get(c);if(a.ref===null)return;let p=a.def??a.schema,l={...p},h=a.ref;if(a.ref=null,h){o(h);let f=e.seen.get(h),x=f.schema;if(x.$ref&&(e.target==="draft-07"||e.target==="draft-04"||e.target==="openapi-3.0")?(p.allOf=p.allOf??[],p.allOf.push(x)):Object.assign(p,x),Object.assign(p,l),c._zod.parent===h)for(let w in p)w==="$ref"||w==="allOf"||w in l||delete p[w];if(x.$ref&&f.def)for(let w in p)w==="$ref"||w==="allOf"||w in f.def&&JSON.stringify(p[w])===JSON.stringify(f.def[w])&&delete p[w]}let m=c._zod.parent;if(m&&m!==h){o(m);let f=e.seen.get(m);if(f?.schema.$ref&&(p.$ref=f.schema.$ref,f.def))for(let x in p)x==="$ref"||x==="allOf"||x in f.def&&JSON.stringify(p[x])===JSON.stringify(f.def[x])&&delete p[x]}e.override({zodSchema:c,jsonSchema:p,path:a.path??[]})};for(let c of[...e.seen.entries()].reverse())o(c[0]);let n={};if(e.target==="draft-2020-12"?n.$schema="https://json-schema.org/draft/2020-12/schema":e.target==="draft-07"?n.$schema="http://json-schema.org/draft-07/schema#":e.target==="draft-04"?n.$schema="http://json-schema.org/draft-04/schema#":e.target,e.external?.uri){let c=e.external.registry.get(r)?.id;if(!c)throw new Error("Schema is missing an `id` property");n.$id=e.external.uri(c)}Object.assign(n,t.def??t.schema);let i=e.metadataRegistry.get(r)?.id;i!==void 0&&n.id===i&&delete n.id;let s=e.external?.defs??{};for(let c of e.seen.entries()){let a=c[1];a.def&&a.defId&&(a.def.id===a.defId&&delete a.def.id,s[a.defId]=a.def)}e.external||Object.keys(s).length>0&&(e.target==="draft-2020-12"?n.$defs=s:n.definitions=s);try{let c=JSON.parse(JSON.stringify(n));return Object.defineProperty(c,"~standard",{value:{...r["~standard"],jsonSchema:{input:se(r,"input",e.processors),output:se(r,"output",e.processors)}},enumerable:!1,writable:!1}),c}catch{throw new Error("Error converting schema to JSON.")}}function P(e,r){let t=r??{seen:new Set};if(t.seen.has(e))return!1;t.seen.add(e);let o=e._zod.def;if(o.type==="transform")return!0;if(o.type==="array")return P(o.element,t);if(o.type==="set")return P(o.valueType,t);if(o.type==="lazy")return P(o.getter(),t);if(o.type==="promise"||o.type==="optional"||o.type==="nonoptional"||o.type==="nullable"||o.type==="readonly"||o.type==="default"||o.type==="prefault")return P(o.innerType,t);if(o.type==="intersection")return P(o.left,t)||P(o.right,t);if(o.type==="record"||o.type==="map")return P(o.keyType,t)||P(o.valueType,t);if(o.type==="pipe")return e._zod.traits.has("$ZodCodec")?!0:P(o.in,t)||P(o.out,t);if(o.type==="object"){for(let n in o.shape)if(P(o.shape[n],t))return!0;return!1}if(o.type==="union"){for(let n of o.options)if(P(n,t))return!0;return!1}if(o.type==="tuple"){for(let n of o.items)if(P(n,t))return!0;return!!(o.rest&&P(o.rest,t))}return!1}var Vo=(e,r={})=>t=>{let o=Ge({...t,processors:r});return k(e,o),qe(o,e),Ye(o,e)},se=(e,r,t={})=>o=>{let{libraryOptions:n,target:i}=o??{},s=Ge({...n??{},target:i,io:r,processors:t});return k(e,s),qe(s,e),Ye(s,e)};var Ps={guid:"uuid",url:"uri",datetime:"date-time",json_string:"json-string",regex:""},Wo=(e,r,t,o)=>{let n=t;n.type="string";let{minimum:i,maximum:s,format:c,patterns:a,contentEncoding:p}=e._zod.bag;if(typeof i=="number"&&(n.minLength=i),typeof s=="number"&&(n.maxLength=s),c&&(n.format=Ps[c]??c,n.format===""&&delete n.format,c==="time"&&delete n.format),p&&(n.contentEncoding=p),a&&a.size>0){let l=[...a];l.length===1?n.pattern=l[0].source:l.length>1&&(n.allOf=[...l.map(h=>({...r.target==="draft-07"||r.target==="draft-04"||r.target==="openapi-3.0"?{type:"string"}:{},pattern:h.source}))])}};var Ko=(e,r,t,o)=>{t.type="boolean"};var Go=(e,r,t,o)=>{t.not={}};var qo=(e,r,t,o)=>{};var Yo=(e,r,t,o)=>{let n=e._zod.def,i=X(n.entries);i.every(s=>typeof s=="number")&&(t.type="number"),i.every(s=>typeof s=="string")&&(t.type="string"),t.enum=i},Xo=(e,r,t,o)=>{let n=e._zod.def,i=[];for(let s of n.values)if(s===void 0){if(r.unrepresentable==="throw")throw new Error("Literal `undefined` cannot be represented in JSON Schema")}else if(typeof s=="bigint"){if(r.unrepresentable==="throw")throw new Error("BigInt literals cannot be represented in JSON Schema");i.push(Number(s))}else i.push(s);if(i.length!==0)if(i.length===1){let s=i[0];t.type=s===null?"null":typeof s,r.target==="draft-04"||r.target==="openapi-3.0"?t.enum=[s]:t.const=s}else i.every(s=>typeof s=="number")&&(t.type="number"),i.every(s=>typeof s=="string")&&(t.type="string"),i.every(s=>typeof s=="boolean")&&(t.type="boolean"),i.every(s=>s===null)&&(t.type="null"),t.enum=i};var Ho=(e,r,t,o)=>{if(r.unrepresentable==="throw")throw new Error("Custom types cannot be represented in JSON Schema")};var Qo=(e,r,t,o)=>{if(r.unrepresentable==="throw")throw new Error("Transforms cannot be represented in JSON Schema")};var en=(e,r,t,o)=>{let n=t,i=e._zod.def,{minimum:s,maximum:c}=e._zod.bag;typeof s=="number"&&(n.minItems=s),typeof c=="number"&&(n.maxItems=c),n.type="array",n.items=k(i.element,r,{...o,path:[...o.path,"items"]})},rn=(e,r,t,o)=>{let n=t,i=e._zod.def;n.type="object",n.properties={};let s=i.shape;for(let p in s)n.properties[p]=k(s[p],r,{...o,path:[...o.path,"properties",p]});let c=new Set(Object.keys(s)),a=new Set([...c].filter(p=>{let l=i.shape[p]._zod;return r.io==="input"?l.optin===void 0:l.optout===void 0}));a.size>0&&(n.required=Array.from(a)),i.catchall?._zod.def.type==="never"?n.additionalProperties=!1:i.catchall?i.catchall&&(n.additionalProperties=k(i.catchall,r,{...o,path:[...o.path,"additionalProperties"]})):r.io==="output"&&(n.additionalProperties=!1)},tn=(e,r,t,o)=>{let n=e._zod.def,i=n.inclusive===!1,s=n.options.map((c,a)=>k(c,r,{...o,path:[...o.path,i?"oneOf":"anyOf",a]}));i?t.oneOf=s:t.anyOf=s},on=(e,r,t,o)=>{let n=e._zod.def,i=k(n.left,r,{...o,path:[...o.path,"allOf",0]}),s=k(n.right,r,{...o,path:[...o.path,"allOf",1]}),c=p=>"allOf"in p&&Object.keys(p).length===1,a=[...c(i)?i.allOf:[i],...c(s)?s.allOf:[s]];t.allOf=a};var nn=(e,r,t,o)=>{let n=e._zod.def,i=k(n.innerType,r,o),s=r.seen.get(e);r.target==="openapi-3.0"?(s.ref=n.innerType,t.nullable=!0):t.anyOf=[i,{type:"null"}]},sn=(e,r,t,o)=>{let n=e._zod.def;k(n.innerType,r,o);let i=r.seen.get(e);i.ref=n.innerType},cn=(e,r,t,o)=>{let n=e._zod.def;k(n.innerType,r,o);let i=r.seen.get(e);i.ref=n.innerType,t.default=JSON.parse(JSON.stringify(n.defaultValue))},un=(e,r,t,o)=>{let n=e._zod.def;k(n.innerType,r,o);let i=r.seen.get(e);i.ref=n.innerType,r.io==="input"&&(t._prefault=JSON.parse(JSON.stringify(n.defaultValue)))},an=(e,r,t,o)=>{let n=e._zod.def;k(n.innerType,r,o);let i=r.seen.get(e);i.ref=n.innerType;let s;try{s=n.catchValue(void 0)}catch{throw new Error("Dynamic catch values are not supported in JSON Schema")}t.default=s},pn=(e,r,t,o)=>{let n=e._zod.def,i=n.in._zod.traits.has("$ZodTransform"),s=r.io==="input"?i?n.out:n.in:n.out;k(s,r,o);let c=r.seen.get(e);c.ref=s},ln=(e,r,t,o)=>{let n=e._zod.def;k(n.innerType,r,o);let i=r.seen.get(e);i.ref=n.innerType,t.readOnly=!0};var Xe=(e,r,t,o)=>{let n=e._zod.def;k(n.innerType,r,o);let i=r.seen.get(e);i.ref=n.innerType};var Ls=u("ZodISODateTime",(e,r)=>{It.init(e,r),v.init(e,r)});function fn(e){return jo(Ls,e)}var Fs=u("ZodISODate",(e,r)=>{Tt.init(e,r),v.init(e,r)});function dn(e){return Co(Fs,e)}var Us=u("ZodISOTime",(e,r)=>{Nt.init(e,r),v.init(e,r)});function mn(e){return Ro(Us,e)}var Ms=u("ZodISODuration",(e,r)=>{At.init(e,r),v.init(e,r)});function hn(e){return Do(Ms,e)}var Vs=(e,r)=>{ue.init(e,r),e.name="ZodError",Object.defineProperties(e,{format:{value:t=>gr(e,t)},flatten:{value:t=>_r(e,t)},addIssue:{value:t=>{e.issues.push(t),e.message=JSON.stringify(e.issues,V,2)}},addIssues:{value:t=>{e.issues.push(...t),e.message=JSON.stringify(e.issues,V,2)}},isEmpty:{get(){return e.issues.length===0}}})};var O=u("ZodError",Vs,{Parent:Error});var _n=ae(O),gn=pe(O),xn=te(O),zn=oe(O),vn=vr(O),yn=yr(O),$n=$r(O),bn=br(O),wn=wr(O),kn=kr(O),Zn=Zr(O),Pn=Pr(O);var Sn=new WeakMap;function ve(e,r,t){let o=Object.getPrototypeOf(e),n=Sn.get(o);if(n||(n=new Set,Sn.set(o,n)),!n.has(r)){n.add(r);for(let i in t){let s=t[i];Object.defineProperty(o,i,{configurable:!0,enumerable:!1,get(){let c=s.bind(this);return Object.defineProperty(this,i,{configurable:!0,writable:!0,enumerable:!0,value:c}),c},set(c){Object.defineProperty(this,i,{configurable:!0,writable:!0,enumerable:!0,value:c})}})}}}var b=u("ZodType",(e,r)=>($.init(e,r),Object.assign(e["~standard"],{jsonSchema:{input:se(e,"input"),output:se(e,"output")}}),e.toJSONSchema=Vo(e,{}),e.def=r,e.type=r.type,Object.defineProperty(e,"_def",{value:r}),e.parse=(t,o)=>_n(e,t,o,{callee:e.parse}),e.safeParse=(t,o)=>xn(e,t,o),e.parseAsync=async(t,o)=>gn(e,t,o,{callee:e.parseAsync}),e.safeParseAsync=async(t,o)=>zn(e,t,o),e.spa=e.safeParseAsync,e.encode=(t,o)=>vn(e,t,o),e.decode=(t,o)=>yn(e,t,o),e.encodeAsync=async(t,o)=>$n(e,t,o),e.decodeAsync=async(t,o)=>bn(e,t,o),e.safeEncode=(t,o)=>wn(e,t,o),e.safeDecode=(t,o)=>kn(e,t,o),e.safeEncodeAsync=async(t,o)=>Zn(e,t,o),e.safeDecodeAsync=async(t,o)=>Pn(e,t,o),ve(e,"ZodType",{check(...t){let o=this.def;return this.clone(g.mergeDefs(o,{checks:[...o.checks??[],...t.map(n=>typeof n=="function"?{_zod:{check:n,def:{check:"custom"},onattach:[]}}:n)]}),{parent:!0})},with(...t){return this.check(...t)},clone(t,o){return E(this,t,o)},brand(){return this},register(t,o){return t.add(this,o),this},refine(t,o){return this.check(Ri(t,o))},superRefine(t,o){return this.check(Di(t,o))},overwrite(t){return this.check(L(t))},optional(){return In(this)},exactOptional(){return wi(this)},nullable(){return Tn(this)},nullish(){return In(Tn(this))},nonoptional(t){return Ei(this,t)},array(){return Qe(this)},or(t){return er([this,t])},and(t){return zi(this,t)},transform(t){return Nn(this,$i(t))},default(t){return Pi(this,t)},prefault(t){return Oi(this,t)},catch(t){return Ti(this,t)},pipe(t){return Nn(this,t)},readonly(){return ji(this)},describe(t){let o=this.clone();return M.add(o,{description:t}),o},meta(...t){if(t.length===0)return M.get(this);let o=this.clone();return M.add(o,t[0]),o},isOptional(){return this.safeParse(void 0).success},isNullable(){return this.safeParse(null).success},apply(t){return t(this)}}),Object.defineProperty(e,"description",{get(){return M.get(e)?.description},configurable:!0}),e)),An=u("_ZodString",(e,r)=>{he.init(e,r),b.init(e,r),e._zod.processJSONSchema=(o,n,i)=>Wo(e,o,n,i);let t=e._zod.bag;e.format=t.format??null,e.minLength=t.minimum??null,e.maxLength=t.maximum??null,ve(e,"_ZodString",{regex(...o){return this.check(Re(...o))},includes(...o){return this.check(Fe(...o))},startsWith(...o){return this.check(Ue(...o))},endsWith(...o){return this.check(Me(...o))},min(...o){return this.check(G(...o))},max(...o){return this.check(_e(...o))},length(...o){return this.check(ge(...o))},nonempty(...o){return this.check(G(1,...o))},lowercase(o){return this.check(De(o))},uppercase(o){return this.check(Le(o))},trim(){return this.check(Be())},normalize(...o){return this.check(Je(...o))},toLowerCase(){return this.check(Ve())},toUpperCase(){return this.check(We())},slugify(){return this.check(Ke())}})}),Ks=u("ZodString",(e,r)=>{he.init(e,r),An.init(e,r),e.email=t=>e.check(mo(Gs,t)),e.url=t=>e.check(zo(qs,t)),e.jwt=t=>e.check(Ao(pi,t)),e.emoji=t=>e.check(vo(Ys,t)),e.guid=t=>e.check(Ce(On,t)),e.uuid=t=>e.check(ho(ze,t)),e.uuidv4=t=>e.check(_o(ze,t)),e.uuidv6=t=>e.check(go(ze,t)),e.uuidv7=t=>e.check(xo(ze,t)),e.nanoid=t=>e.check(yo(Xs,t)),e.guid=t=>e.check(Ce(On,t)),e.cuid=t=>e.check($o(Hs,t)),e.cuid2=t=>e.check(bo(Qs,t)),e.ulid=t=>e.check(wo(ei,t)),e.base64=t=>e.check(Io(ci,t)),e.base64url=t=>e.check(To(ui,t)),e.xid=t=>e.check(ko(ri,t)),e.ksuid=t=>e.check(Zo(ti,t)),e.ipv4=t=>e.check(Po(oi,t)),e.ipv6=t=>e.check(So(ni,t)),e.cidrv4=t=>e.check(Oo(si,t)),e.cidrv6=t=>e.check(Eo(ii,t)),e.e164=t=>e.check(No(ai,t)),e.datetime=t=>e.check(fn(t)),e.date=t=>e.check(dn(t)),e.time=t=>e.check(mn(t)),e.duration=t=>e.check(hn(t))});function jn(e){return fo(Ks,e)}var v=u("ZodStringFormat",(e,r)=>{z.init(e,r),An.init(e,r)}),Gs=u("ZodEmail",(e,r)=>{$t.init(e,r),v.init(e,r)});var On=u("ZodGUID",(e,r)=>{vt.init(e,r),v.init(e,r)});var ze=u("ZodUUID",(e,r)=>{yt.init(e,r),v.init(e,r)});var qs=u("ZodURL",(e,r)=>{bt.init(e,r),v.init(e,r)});var Ys=u("ZodEmoji",(e,r)=>{wt.init(e,r),v.init(e,r)});var Xs=u("ZodNanoID",(e,r)=>{kt.init(e,r),v.init(e,r)});var Hs=u("ZodCUID",(e,r)=>{Zt.init(e,r),v.init(e,r)});var Qs=u("ZodCUID2",(e,r)=>{Pt.init(e,r),v.init(e,r)});var ei=u("ZodULID",(e,r)=>{St.init(e,r),v.init(e,r)});var ri=u("ZodXID",(e,r)=>{Ot.init(e,r),v.init(e,r)});var ti=u("ZodKSUID",(e,r)=>{Et.init(e,r),v.init(e,r)});var oi=u("ZodIPv4",(e,r)=>{jt.init(e,r),v.init(e,r)});var ni=u("ZodIPv6",(e,r)=>{Ct.init(e,r),v.init(e,r)});var si=u("ZodCIDRv4",(e,r)=>{Rt.init(e,r),v.init(e,r)});var ii=u("ZodCIDRv6",(e,r)=>{Dt.init(e,r),v.init(e,r)});var ci=u("ZodBase64",(e,r)=>{Ft.init(e,r),v.init(e,r)});var ui=u("ZodBase64URL",(e,r)=>{Ut.init(e,r),v.init(e,r)});var ai=u("ZodE164",(e,r)=>{Mt.init(e,r),v.init(e,r)});var pi=u("ZodJWT",(e,r)=>{Jt.init(e,r),v.init(e,r)});var li=u("ZodBoolean",(e,r)=>{Bt.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>Ko(e,t,o,n)});function Cn(e){return Lo(li,e)}var fi=u("ZodUnknown",(e,r)=>{Vt.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>qo(e,t,o,n)});function En(){return Fo(fi)}var di=u("ZodNever",(e,r)=>{Wt.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>Go(e,t,o,n)});function mi(e){return Uo(di,e)}var hi=u("ZodArray",(e,r)=>{Kt.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>en(e,t,o,n),e.element=r.element,ve(e,"ZodArray",{min(t,o){return this.check(G(t,o))},nonempty(t){return this.check(G(1,t))},max(t,o){return this.check(_e(t,o))},length(t,o){return this.check(ge(t,o))},unwrap(){return this.element}})});function Qe(e,r){return Mo(hi,e,r)}var _i=u("ZodObject",(e,r)=>{Yt.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>rn(e,t,o,n),g.defineLazy(e,"shape",()=>r.shape),ve(e,"ZodObject",{keyof(){return rr(Object.keys(this._zod.def.shape))},catchall(t){return this.clone({...this._zod.def,catchall:t})},passthrough(){return this.clone({...this._zod.def,catchall:En()})},loose(){return this.clone({...this._zod.def,catchall:En()})},strict(){return this.clone({...this._zod.def,catchall:mi()})},strip(){return this.clone({...this._zod.def,catchall:void 0})},extend(t){return g.extend(this,t)},safeExtend(t){return g.safeExtend(this,t)},merge(t){return g.merge(this,t)},pick(t){return g.pick(this,t)},omit(t){return g.omit(this,t)},partial(...t){return g.partial(Un,this,t[0])},required(...t){return g.required(Mn,this,t[0])}})});function Rn(e,r){let t={type:"object",shape:e??{},...g.normalizeParams(r)};return new _i(t)}var Dn=u("ZodUnion",(e,r)=>{Ne.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>tn(e,t,o,n),e.options=r.options});function er(e,r){return new Dn({type:"union",options:e,...g.normalizeParams(r)})}var gi=u("ZodDiscriminatedUnion",(e,r)=>{Dn.init(e,r),Xt.init(e,r)});function Ln(e,r,t){return new gi({type:"union",options:r,discriminator:e,...g.normalizeParams(t)})}var xi=u("ZodIntersection",(e,r)=>{Ht.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>on(e,t,o,n)});function zi(e,r){return new xi({type:"intersection",left:e,right:r})}var He=u("ZodEnum",(e,r)=>{Qt.init(e,r),b.init(e,r),e._zod.processJSONSchema=(o,n,i)=>Yo(e,o,n,i),e.enum=r.entries,e.options=Object.values(r.entries);let t=new Set(Object.keys(r.entries));e.extract=(o,n)=>{let i={};for(let s of o)if(t.has(s))i[s]=r.entries[s];else throw new Error(`Key ${s} not found in enum`);return new He({...r,checks:[],...g.normalizeParams(n),entries:i})},e.exclude=(o,n)=>{let i={...r.entries};for(let s of o)if(t.has(s))delete i[s];else throw new Error(`Key ${s} not found in enum`);return new He({...r,checks:[],...g.normalizeParams(n),entries:i})}});function rr(e,r){let t=Array.isArray(e)?Object.fromEntries(e.map(o=>[o,o])):e;return new He({type:"enum",entries:t,...g.normalizeParams(r)})}var vi=u("ZodLiteral",(e,r)=>{eo.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>Xo(e,t,o,n),e.values=new Set(r.values),Object.defineProperty(e,"value",{get(){if(r.values.length>1)throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");return r.values[0]}})});function Fn(e,r){return new vi({type:"literal",values:Array.isArray(e)?e:[e],...g.normalizeParams(r)})}var yi=u("ZodTransform",(e,r)=>{ro.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>Qo(e,t,o,n),e._zod.parse=(t,o)=>{if(o.direction==="backward")throw new J(e.constructor.name);t.addIssue=i=>{if(typeof i=="string")t.issues.push(g.issue(i,t.value,r));else{let s=i;s.fatal&&(s.continue=!1),s.code??(s.code="custom"),s.input??(s.input=t.value),s.inst??(s.inst=e),t.issues.push(g.issue(s))}};let n=r.transform(t.value,t);return n instanceof Promise?n.then(i=>(t.value=i,t.fallback=!0,t)):(t.value=n,t.fallback=!0,t)}});function $i(e){return new yi({type:"transform",transform:e})}var Un=u("ZodOptional",(e,r)=>{Ae.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>Xe(e,t,o,n),e.unwrap=()=>e._zod.def.innerType});function In(e){return new Un({type:"optional",innerType:e})}var bi=u("ZodExactOptional",(e,r)=>{to.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>Xe(e,t,o,n),e.unwrap=()=>e._zod.def.innerType});function wi(e){return new bi({type:"optional",innerType:e})}var ki=u("ZodNullable",(e,r)=>{oo.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>nn(e,t,o,n),e.unwrap=()=>e._zod.def.innerType});function Tn(e){return new ki({type:"nullable",innerType:e})}var Zi=u("ZodDefault",(e,r)=>{no.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>cn(e,t,o,n),e.unwrap=()=>e._zod.def.innerType,e.removeDefault=e.unwrap});function Pi(e,r){return new Zi({type:"default",innerType:e,get defaultValue(){return typeof r=="function"?r():g.shallowClone(r)}})}var Si=u("ZodPrefault",(e,r)=>{so.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>un(e,t,o,n),e.unwrap=()=>e._zod.def.innerType});function Oi(e,r){return new Si({type:"prefault",innerType:e,get defaultValue(){return typeof r=="function"?r():g.shallowClone(r)}})}var Mn=u("ZodNonOptional",(e,r)=>{io.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>sn(e,t,o,n),e.unwrap=()=>e._zod.def.innerType});function Ei(e,r){return new Mn({type:"nonoptional",innerType:e,...g.normalizeParams(r)})}var Ii=u("ZodCatch",(e,r)=>{co.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>an(e,t,o,n),e.unwrap=()=>e._zod.def.innerType,e.removeCatch=e.unwrap});function Ti(e,r){return new Ii({type:"catch",innerType:e,catchValue:typeof r=="function"?r:()=>r})}var Ni=u("ZodPipe",(e,r)=>{uo.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>pn(e,t,o,n),e.in=r.in,e.out=r.out});function Nn(e,r){return new Ni({type:"pipe",in:e,out:r})}var Ai=u("ZodReadonly",(e,r)=>{ao.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>ln(e,t,o,n),e.unwrap=()=>e._zod.def.innerType});function ji(e){return new Ai({type:"readonly",innerType:e})}var Ci=u("ZodCustom",(e,r)=>{po.init(e,r),b.init(e,r),e._zod.processJSONSchema=(t,o,n)=>Ho(e,t,o,n)});function Ri(e,r={}){return Jo(Ci,e,r)}function Di(e,r){return Bo(e,r)}var na={string:jn,object:Rn,enum:rr,boolean:Cn,union:er,array:Qe,discriminatedUnion:Ln,literal:Fn};;
return na;
})();
// src/contract.ts
var sessionIdSchema = external_exports.string().min(1);
var fileEntrySchema = external_exports.object({
  path: external_exports.string().min(1),
  relative: external_exports.string().min(1),
  kind: external_exports.enum(["file", "dir"])
}).readonly();
var fileIgnoreRuleSchema = external_exports.object({
  kind: external_exports.enum(["exact", "regex"]),
  pattern: external_exports.string().min(1),
  caseSensitive: external_exports.boolean()
}).readonly().superRefine((rule, context) => {
  if (rule.kind !== "regex") return;
  try {
    new RegExp(rule.pattern, rule.caseSensitive ? "" : "i");
  } catch (error51) {
    const message = error51 instanceof Error ? error51.message : "Invalid regular expression";
    context.addIssue({ code: "custom", message });
  }
});
var fileIgnoreRuleInputSchema = external_exports.union([external_exports.string(), fileIgnoreRuleSchema]);
var workspaceIgnoreFilesSchema = external_exports.object({
  workspace: external_exports.string().min(1),
  ignoreFiles: external_exports.array(fileIgnoreRuleInputSchema)
}).readonly();
var atFileSettingsSchema = external_exports.object({
  enabled: external_exports.boolean(),
  ignoreFiles: external_exports.array(fileIgnoreRuleInputSchema),
  workspaceIgnoreFiles: external_exports.array(workspaceIgnoreFilesSchema)
}).readonly();
var atFileSettingsUpdateSchema = external_exports.discriminatedUnion("field", [
  external_exports.object({ field: external_exports.literal("enabled"), value: external_exports.boolean() }).readonly(),
  external_exports.object({ field: external_exports.literal("ignoreFiles"), value: external_exports.array(fileIgnoreRuleInputSchema) }).readonly(),
  external_exports.object({
    field: external_exports.literal("workspaceIgnoreFiles"),
    value: external_exports.array(workspaceIgnoreFilesSchema)
  }).readonly()
]);
var AT_FILE_INVOCATIONS = [
  {
    id: "dsh-at-file#atFile/search",
    service: "atFile",
    namespace: "atFile",
    method: "search",
    invocation: { kind: "direct" },
    parameters: [
      {
        name: "agent",
        wire: "agentId",
        source: "lookup",
        lookup: "agent",
        // The type symbol must equal the agent lookup provider's wire identity
        // exactly — the gateway's strict path rejects a mismatched symbol.
        codec: { mode: "strict", typeSymbol: "@deepseek-ai/dsh-session/types#SessionId", schema: sessionIdSchema }
      }
    ],
    cancellation: { parameter: "signal" },
    result: {
      mode: "strict",
      typeSymbol: "dsh-at-file#FileEntry[]",
      schema: external_exports.array(fileEntrySchema)
    }
  },
  {
    id: "dsh-at-file#atFile/getSettings",
    service: "atFile",
    namespace: "atFile",
    method: "getSettings",
    invocation: { kind: "direct" },
    parameters: [],
    result: {
      mode: "strict",
      typeSymbol: "dsh-at-file#AtFileSettings",
      schema: atFileSettingsSchema
    }
  },
  {
    id: "dsh-at-file#atFile/updateSettings",
    service: "atFile",
    namespace: "atFile",
    method: "updateSettings",
    invocation: { kind: "direct" },
    parameters: [
      {
        name: "update",
        wire: "update",
        source: "json",
        codec: {
          mode: "strict",
          typeSymbol: "dsh-at-file#AtFileSettingsUpdate",
          schema: atFileSettingsUpdateSchema
        }
      }
    ],
    result: {
      mode: "strict",
      typeSymbol: "dsh-at-file#AtFileSettings",
      schema: atFileSettingsSchema
    }
  }
];

// src/client/remote.ts
var AT_FILE_REMOTE = {
  package: "dsh-at-file",
  descriptors: AT_FILE_INVOCATIONS
};

// src/client/model.ts
function dirnameOf(relative) {
  const at = relative.lastIndexOf("/");
  return at < 0 ? "" : relative.slice(0, at);
}
function basenameOf(relative) {
  const at = relative.lastIndexOf("/");
  return at < 0 ? relative : relative.slice(at + 1);
}

// src/client/search.ts
function rankFiles(files, query, limit) {
  const q = query.trim().toLowerCase();
  if (q === "") {
    return partialDefaultSort(files, limit);
  }
  const normalizedQuery = q.replaceAll("\\", "/");
  const querySegments = normalizedQuery.split("/").filter(Boolean);
  const hasSlash = normalizedQuery.includes("/");
  const isDirBrowse = normalizedQuery.endsWith("/");
  const prefix = isDirBrowse ? normalizedQuery.slice(0, -1) : "";
  return files.map((file2) => ({ file: file2, score: scorePath(file2.relative, q, normalizedQuery, querySegments, hasSlash, isDirBrowse, prefix) })).filter((entry) => entry.score >= 0).sort((a, b) => b.score - a.score || (a.file.kind === "dir" ? 1 : 0) - (b.file.kind === "dir" ? 1 : 0) || a.file.relative.length - b.file.relative.length || (a.file.relative < b.file.relative ? -1 : 1)).slice(0, limit).map((entry) => entry.file);
}
function partialDefaultSort(files, limit) {
  const dirs = [];
  const filesOut = [];
  for (const file2 of files) {
    if (file2.kind === "dir") {
      if (dirs.length < limit) dirs.push(file2);
    } else {
      if (filesOut.length < limit) filesOut.push(file2);
    }
    if (dirs.length >= limit && filesOut.length >= limit) break;
  }
  dirs.sort((a, b) => a.relative < b.relative ? -1 : 1);
  filesOut.sort((a, b) => a.relative < b.relative ? -1 : 1);
  const merged = [...dirs, ...filesOut];
  return merged.slice(0, limit);
}
function scorePath(path, q, normalizedQuery, querySegments, hasSlash, isDirBrowse, prefix) {
  const lowerPath = path.toLowerCase();
  const pathSegments = lowerPath.split("/");
  if (!hasSlash) return scoreName(pathSegments.at(-1), querySegments[0]);
  if (querySegments.length === 0) return -1;
  if (isDirBrowse) {
    if (!lowerPath.startsWith(`${prefix}/`)) return -1;
    const depth = lowerPath.slice(prefix.length + 1).split("/").length;
    return 6e3 - (depth - 1) * 100 - path.length;
  }
  let cursor = 0;
  let total = 0;
  let lastMatch = -1;
  for (const querySegment of querySegments) {
    let matchedIndex = -1;
    let matchedScore = -1;
    for (let index = cursor; index < pathSegments.length; index++) {
      const score = scoreName(pathSegments[index], querySegment);
      if (score < 0) continue;
      matchedScore = score;
      matchedIndex = index;
      break;
    }
    if (matchedIndex < 0) return -1;
    total += matchedScore;
    lastMatch = matchedIndex;
    cursor = matchedIndex + 1;
  }
  const basenameBonus = lastMatch === pathSegments.length - 1 ? 1e3 : 0;
  return total + basenameBonus - path.length;
}
function scoreName(name, query) {
  if (name === query) return 5e3;
  if (name.startsWith(query)) return 4500 - name.length;
  const contained = name.indexOf(query);
  if (contained >= 0) return 4e3 - contained * 10 - name.length;
  let first = -1;
  let previous = -1;
  let gaps = 0;
  let at = 0;
  for (const ch of query) {
    const found = name.indexOf(ch, at);
    if (found < 0) return -1;
    if (first < 0) first = found;
    if (previous >= 0) gaps += found - previous - 1;
    previous = found;
    at = found + 1;
  }
  return 3e3 - first * 10 - gaps * 5 - name.length;
}

// src/client/icons.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var CODE_EXTENSIONS = /* @__PURE__ */ new Set([
  "c",
  "cc",
  "cpp",
  "cs",
  "css",
  "dart",
  "go",
  "h",
  "hpp",
  "html",
  "java",
  "js",
  "jsx",
  "kt",
  "kts",
  "lua",
  "mjs",
  "php",
  "py",
  "rb",
  "rs",
  "scss",
  "sh",
  "sql",
  "svelte",
  "swift",
  "ts",
  "tsx",
  "vue"
]);
var TEXT_EXTENSIONS = /* @__PURE__ */ new Set(["adoc", "log", "md", "mdx", "rst", "text", "txt"]);
var IMAGE_EXTENSIONS = /* @__PURE__ */ new Set(["avif", "bmp", "gif", "ico", "jpeg", "jpg", "png", "svg", "webp"]);
var DATA_EXTENSIONS = /* @__PURE__ */ new Set(["conf", "config", "csv", "ini", "json", "jsonl", "toml", "tsv", "xml", "yaml", "yml"]);
var ARCHIVE_EXTENSIONS = /* @__PURE__ */ new Set(["7z", "bz2", "gz", "jar", "rar", "tar", "tgz", "war", "xz", "zip"]);
var TEXT_NAMES = /* @__PURE__ */ new Set(["authors", "changelog", "copying", "license", "readme"]);
var CODE_NAMES = /* @__PURE__ */ new Set(["dockerfile", "gemfile", "makefile", "rakefile"]);
function fileIconKind(file2) {
  if (file2.kind === "dir") return "folder";
  const basename = file2.relative.slice(file2.relative.lastIndexOf("/") + 1).toLowerCase();
  const dot = basename.lastIndexOf(".");
  const extension = dot > 0 ? basename.slice(dot + 1) : "";
  if (extension === "pdf") return "pdf";
  if (IMAGE_EXTENSIONS.has(extension)) return "image";
  if (ARCHIVE_EXTENSIONS.has(extension)) return "archive";
  if (CODE_EXTENSIONS.has(extension) || CODE_NAMES.has(basename)) return "code";
  if (DATA_EXTENSIONS.has(extension) || basename === ".env" || basename.startsWith(".env.")) return "data";
  if (TEXT_EXTENSIONS.has(extension) || TEXT_NAMES.has(basename)) return "text";
  return "file";
}
function IconFrame({ kind, color, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "svg",
    {
      width: "16",
      height: "16",
      viewBox: "0 0 16 16",
      fill: "none",
      "aria-hidden": true,
      "data-file-icon": kind,
      style: { color },
      children
    }
  );
}
var ICONS = {
  folder: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconFrame, { kind: "folder", color: "#e8a23a", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M1.75 4.25A1.25 1.25 0 0 1 3 3h3l1.25 1.5H13A1.25 1.25 0 0 1 14.25 5.75v6A1.25 1.25 0 0 1 13 13H3a1.25 1.25 0 0 1-1.25-1.25v-7.5Z", stroke: "currentColor", strokeWidth: "1.3", strokeLinejoin: "round" }) }),
  code: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconFrame, { kind: "code", color: "#4d9de0", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m6.25 4.25-3 3.75 3 3.75M9.75 4.25l3 3.75-3 3.75", stroke: "currentColor", strokeWidth: "1.35", strokeLinecap: "round", strokeLinejoin: "round" }) }),
  text: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(IconFrame, { kind: "text", color: "#8c98a5", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 1.75h6l4 4v8.5H3V1.75Z", stroke: "currentColor", strokeWidth: "1.2", strokeLinejoin: "round" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 1.75v4h4M5.25 8.25h5.5M5.25 10.75h4", stroke: "currentColor", strokeWidth: "1.1", strokeLinecap: "round" })
  ] }),
  pdf: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(IconFrame, { kind: "pdf", color: "#e15b64", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 1.75h6l4 4v8.5H3V1.75Z", stroke: "currentColor", strokeWidth: "1.2", strokeLinejoin: "round" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 1.75v4h4M5 10.75c1.25-2.5 2.25-3.75 3-3.75.9 0 .85 3 2.75 3", stroke: "currentColor", strokeWidth: "1.05", strokeLinecap: "round", strokeLinejoin: "round" })
  ] }),
  image: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(IconFrame, { kind: "image", color: "#55a875", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "2", y: "2.5", width: "12", height: "11", rx: "1.5", stroke: "currentColor", strokeWidth: "1.2" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "5.25", cy: "5.75", r: "1", fill: "currentColor" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m3.5 12 3.25-3.5 2 2 1.5-1.5 2.25 3", stroke: "currentColor", strokeWidth: "1.1", strokeLinecap: "round", strokeLinejoin: "round" })
  ] }),
  data: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(IconFrame, { kind: "data", color: "#9a78d1", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", { cx: "8", cy: "4", rx: "5", ry: "2", stroke: "currentColor", strokeWidth: "1.2" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 4v4c0 1.1 2.24 2 5 2s5-.9 5-2V4M3 8v4c0 1.1 2.24 2 5 2s5-.9 5-2V8", stroke: "currentColor", strokeWidth: "1.2" })
  ] }),
  archive: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(IconFrame, { kind: "archive", color: "#c18752", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.25 3h11.5v3H2.25V3ZM3.25 6h9.5v7.5h-9.5V6Z", stroke: "currentColor", strokeWidth: "1.2", strokeLinejoin: "round" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6.25 8.5h3.5", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" })
  ] }),
  file: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(IconFrame, { kind: "file", color: "#8c98a5", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 1.75h6l4 4v8.5H3V1.75Z", stroke: "currentColor", strokeWidth: "1.2", strokeLinejoin: "round" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 1.75v4h4", stroke: "currentColor", strokeWidth: "1.2", strokeLinejoin: "round" })
  ] })
};
function fileIcon(file2) {
  return ICONS[fileIconKind(file2)];
}

// src/client/source.ts
var SOURCE_NAME = "at-file";
var MAX_CANDIDATES = 12;
var INDEX_TTL_MS = 3e5;
var MAX_SESSION_CACHES = 20;
function candidateRows(files) {
  const counts = /* @__PURE__ */ new Map();
  for (const file2 of files) {
    const basename = basenameOf(file2.relative);
    counts.set(basename, (counts.get(basename) ?? 0) + 1);
  }
  return files.map((file2) => {
    const basename = basenameOf(file2.relative);
    const directory = dirnameOf(file2.relative);
    const duplicate = counts.get(basename) > 1;
    return {
      name: duplicate && directory !== "" ? `${basename} - ${directory}` : basename,
      value: file2.relative,
      atFileKind: file2.kind,
      // The standing contract types icons as text. React renders this in-memory
      // element directly; no icon markup crosses the Host boundary.
      icon: fileIcon(file2),
      ...directory === "" ? {} : { description: directory }
    };
  });
}
function createAtFileSource(deps) {
  const now = deps.now ?? (() => Date.now());
  const fetches = /* @__PURE__ */ new Map();
  const lexiconListeners = /* @__PURE__ */ new Map();
  const notifyLexicon = (sessionId) => {
    for (const listener of [...lexiconListeners.get(sessionId) ?? []]) {
      try {
        listener();
      } catch (error51) {
        console.error("[dsh-at-file] lexicon listener failed:", error51);
      }
    }
  };
  const fetchIndex = (sessionId, signal) => {
    const existing = fetches.get(sessionId);
    const fresh = existing !== void 0 && now() - existing.at < INDEX_TTL_MS;
    if (fresh) {
      if (existing.settled !== void 0) return Promise.resolve(existing.settled);
      return existing.promise;
    }
    if (existing !== void 0) {
      fetches.delete(sessionId);
      existing.abort.abort();
    }
    if (fetches.size >= MAX_SESSION_CACHES) {
      const oldest = fetches.entries().next().value;
      oldest[1].abort.abort();
      fetches.delete(oldest[0]);
    }
    const abort = new AbortController();
    const promise2 = deps.search(sessionId, abort.signal);
    const entry = { promise: promise2, abort, at: now() };
    fetches.set(sessionId, entry);
    promise2.then(
      (files) => {
        entry.settled = files;
        notifyLexicon(sessionId);
      },
      () => {
        if (fetches.get(sessionId) === entry) fetches.delete(sessionId);
      }
    );
    if (signal !== void 0) {
      return promise2.then((files) => signal.aborted ? [] : files);
    }
    return promise2;
  };
  const findEntry = (sessionId, relative) => fetches.get(sessionId)?.settled?.find((file2) => file2.relative === relative);
  const invalidateAll = () => {
    for (const [key, entry] of [...fetches]) {
      fetches.delete(key);
      entry.abort.abort();
    }
    for (const listeners of [...lexiconListeners.values()]) {
      for (const listener of listeners) listener();
    }
  };
  const source = {
    trigger: "@",
    name: SOURCE_NAME,
    async candidates(session, { query, signal }) {
      const files = await fetchIndex(session.sessionId, signal);
      if (signal.aborted) return [];
      return candidateRows(rankFiles(files, query, MAX_CANDIDATES));
    },
    warm(session) {
      fetchIndex(session.sessionId).catch(() => {
      });
    },
    onPick({ candidate, session }) {
      const file2 = candidate.value === void 0 ? void 0 : findEntry(session.sessionId, candidate.value);
      if (file2 === void 0) return void 0;
      const suffix = file2.kind === "dir" ? "/" : "";
      return { text: `@${file2.relative}${suffix} ` };
    },
    lexicon(session) {
      return fetches.get(session.sessionId)?.settled?.map((file2) => file2.relative);
    },
    subscribeLexicon(session, listener) {
      const key = session.sessionId;
      const listeners = lexiconListeners.get(key) ?? /* @__PURE__ */ new Set();
      listeners.add(listener);
      lexiconListeners.set(key, listeners);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) lexiconListeners.delete(key);
      };
    }
  };
  return { source, invalidateAll };
}

// src/client/FilesDock.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var MENTION_PATTERN = /@([^\s@]+)/g;
function draftMentions(draft) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const match of draft.matchAll(MENTION_PATTERN)) {
    const raw = match[1];
    const relative = raw.endsWith("/") ? raw.slice(0, -1) : raw;
    if (relative === "" || seen.has(relative)) continue;
    seen.add(relative);
    out.push({ relative, start: match.index, end: match.index + match[0].length });
  }
  return out;
}
function withoutToken(draft, start, end) {
  return draft.slice(0, start) + draft.slice(end);
}
function FilesDock({ input, inputActions, onOpen, useScope, t }) {
  const enabled = useScope((snapshot) => snapshot.value?.enabled ?? true);
  if (!enabled) return null;
  const mentions = draftMentions(input.draft);
  if (mentions.length === 0) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dsh_atFile_rail", role: "group", "aria-label": t("dock.aria"), "data-at-file-dock": true, children: mentions.map((mention) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "dsh_atFile_row", "data-at-file-row": true, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      "button",
      {
        type: "button",
        className: "dsh_atFile_path",
        title: mention.relative,
        onClick: () => {
          onOpen(mention.relative);
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("svg", { className: "dsh_atFile_icon", viewBox: "0 0 16 16", "aria-hidden": true, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M3 2.5A1.5 1.5 0 0 1 4.5 1h3l3 3v9.5A1.5 1.5 0 0 1 9 15H4.5A1.5 1.5 0 0 1 3 13.5v-11Z", fill: "none", stroke: "currentColor", strokeWidth: "1.2" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M7.5 1v3h3", fill: "none", stroke: "currentColor", strokeWidth: "1.2" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M13 4.5v8A1.5 1.5 0 0 1 11.5 14H5", fill: "none", stroke: "currentColor", strokeWidth: "1.2" })
          ] }),
          mention.relative
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "button",
      {
        type: "button",
        className: "dsh_atFile_remove",
        "aria-label": t("dock.remove", { name: mention.relative }),
        onClick: () => {
          inputActions.setDraft(withoutToken(input.draft, mention.start, mention.end));
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { viewBox: "0 0 16 16", "aria-hidden": true, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M4 4l8 8M12 4l-8 8", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" }) })
      }
    )
  ] }, `${mention.start}:${mention.relative}`)) });
}

// src/client/SettingsSection.tsx
var import_react = require("react");

// src/defaults.ts
var DEFAULT_IGNORE_FILES = [
  "desktop.ini",
  "Thumbs.db",
  ".DS_Store"
];
function defaultAtFileSettings() {
  return {
    enabled: true,
    ignoreFiles: [...DEFAULT_IGNORE_FILES],
    workspaceIgnoreFiles: []
  };
}
function normalizeIgnoreFiles(values) {
  const seen = /* @__PURE__ */ new Set();
  const normalized = [];
  for (const value of values) {
    const rule = normalizeIgnoreRule(value);
    if (rule === void 0) continue;
    const key = ignoreRuleKey(rule);
    if (seen.has(key)) continue;
    seen.add(key);
    normalized.push(typeof value === "string" && rule.kind === "exact" && !rule.caseSensitive ? rule.pattern : rule);
  }
  return normalized;
}
function normalizeIgnoreRule(value) {
  if (typeof value === "string") {
    const pattern2 = value.trim();
    return pattern2 === "" ? void 0 : { kind: "exact", pattern: pattern2, caseSensitive: false };
  }
  const pattern = value.pattern.trim();
  if (pattern === "") return void 0;
  const rule = {
    kind: value.kind,
    pattern,
    caseSensitive: value.caseSensitive
  };
  if (rule.kind === "regex") {
    try {
      new RegExp(rule.pattern, rule.caseSensitive ? "" : "i");
    } catch (error51) {
      const message = error51 instanceof Error ? error51.message : String(error51);
      throw new Error(`Invalid regular expression "${rule.pattern}": ${message}`);
    }
  }
  return rule;
}
function ignoreRuleKey(value) {
  const rule = normalizeIgnoreRule(value);
  if (rule === void 0) return "";
  const pattern = rule.kind === "exact" && !rule.caseSensitive ? rule.pattern.toLowerCase() : rule.pattern;
  return JSON.stringify([rule.kind, pattern, rule.caseSensitive]);
}
function workspacePathKey(value) {
  const slashed = value.replace(/\\/gu, "/");
  const withoutTrailing = slashed === "/" || /^[a-z]:\/$/iu.test(slashed) ? slashed : slashed.replace(/\/+$/u, "");
  return /^[a-z]:\//iu.test(withoutTrailing) || withoutTrailing.startsWith("//") ? withoutTrailing.toLowerCase() : withoutTrailing;
}
function normalizeWorkspaceIgnoreFiles(entries) {
  const order = [];
  const byWorkspace = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    const key = workspacePathKey(entry.workspace);
    if (key === "") continue;
    const current = byWorkspace.get(key);
    if (current === void 0) order.push(key);
    byWorkspace.set(key, {
      workspace: current?.workspace ?? entry.workspace,
      ignoreFiles: normalizeIgnoreFiles([
        ...current?.ignoreFiles ?? [],
        ...entry.ignoreFiles
      ])
    });
  }
  return order.map((key) => byWorkspace.get(key));
}
function workspaceIgnoreFilesFor(entries, workspace) {
  const key = workspacePathKey(workspace);
  const entry = normalizeWorkspaceIgnoreFiles(entries).find((candidate) => workspacePathKey(candidate.workspace) === key);
  return entry?.ignoreFiles ?? [];
}
function ignoreFilesSettingsKey(settings) {
  const global = normalizeIgnoreFiles(settings.ignoreFiles).map(ignoreRuleKey).sort();
  const workspaces = normalizeWorkspaceIgnoreFiles(settings.workspaceIgnoreFiles ?? []).map((entry) => ({
    workspace: workspacePathKey(entry.workspace),
    ignoreFiles: entry.ignoreFiles.map(ignoreRuleKey).sort()
  })).sort((left, right) => left.workspace.localeCompare(right.workspace));
  return JSON.stringify({ global, workspaces });
}

// src/client/SettingsSection.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function workspaceTitle(path) {
  const trimmed = path.replace(/[\\/]+$/u, "");
  return trimmed.split(/[\\/]/u).pop() || path;
}
function rulePattern(value) {
  return typeof value === "string" ? value : value.pattern;
}
function ruleKind(value) {
  return typeof value === "string" ? "exact" : value.kind;
}
function ruleCaseSensitive(value) {
  return typeof value === "string" ? false : value.caseSensitive;
}
function ruleLabel(value) {
  return rulePattern(value);
}
function validateDraft(kind, pattern, caseSensitive) {
  const trimmed = pattern.trim();
  if (kind === "exact" && /[\\/]/u.test(trimmed)) return "settings.invalidName";
  if (kind === "regex") {
    try {
      new RegExp(trimmed, caseSensitive ? "" : "i");
    } catch {
      return "settings.invalidRegex";
    }
  }
  return void 0;
}
function candidateValue(kind, pattern, caseSensitive) {
  const trimmed = pattern.trim();
  if (trimmed === "" || validateDraft(kind, trimmed, caseSensitive) !== void 0) return void 0;
  if (kind === "exact" && !caseSensitive) return trimmed;
  return { kind, pattern: trimmed, caseSensitive };
}
function fileListKey(values) {
  return normalizeIgnoreFiles(values).map(ignoreRuleKey).join("\n");
}
function PlusIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("svg", { viewBox: "0 0 16 16", "aria-hidden": true, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M8 3v10M3 8h10", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) });
}
function RemoveIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("svg", { viewBox: "0 0 16 16", "aria-hidden": true, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "m4 4 8 8m0-8-8 8", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" }) });
}
function AtFileSection({
  useScope,
  useSessions,
  useWorkspaces,
  setEnabled,
  setIgnoreFiles,
  setWorkspaceIgnoreFiles,
  t
}) {
  const settings = useScope((snapshot) => snapshot.value);
  const enabled = settings?.enabled ?? true;
  const globalFiles = normalizeIgnoreFiles(settings?.ignoreFiles ?? DEFAULT_IGNORE_FILES);
  const workspaceRules = settings?.workspaceIgnoreFiles ?? [];
  const workspaces = useWorkspaces((snapshot) => snapshot.items);
  const recentWorkspaceId = useWorkspaces((snapshot) => snapshot.recentWorkspaceId);
  const currentCwd = useSessions((snapshot) => {
    const current = snapshot.current;
    return current === void 0 ? void 0 : snapshot.byId[current]?.cwd;
  });
  const workspaceOptions = (0, import_react.useMemo)(() => {
    const rows = workspaces.map((workspace) => ({ path: workspace.path, title: workspace.title }));
    if (currentCwd !== void 0 && !rows.some((row) => workspacePathKey(row.path) === workspacePathKey(currentCwd))) {
      rows.unshift({ path: currentCwd, title: workspaceTitle(currentCwd) });
    }
    return rows;
  }, [currentCwd, workspaces]);
  const preferredWorkspace = currentCwd ?? workspaces.find((workspace) => workspace.workspaceId === recentWorkspaceId)?.path ?? workspaceOptions[0]?.path ?? "";
  const [filterScope, setFilterScope] = (0, import_react.useState)("global");
  const [selectedWorkspace, setSelectedWorkspace] = (0, import_react.useState)(preferredWorkspace);
  const [draft, setDraft] = (0, import_react.useState)("");
  const [ruleKindChoice, setRuleKindChoice] = (0, import_react.useState)("exact");
  const [caseSensitive, setCaseSensitive] = (0, import_react.useState)(false);
  const [saving, setSaving] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    if (workspaceOptions.length === 0) {
      if (selectedWorkspace !== "") setSelectedWorkspace("");
      return;
    }
    if (!workspaceOptions.some((option) => workspacePathKey(option.path) === workspacePathKey(selectedWorkspace))) {
      setSelectedWorkspace(preferredWorkspace);
    }
  }, [preferredWorkspace, selectedWorkspace, workspaceOptions]);
  (0, import_react.useEffect)(() => {
    setDraft("");
  }, [filterScope, selectedWorkspace, ruleKindChoice]);
  const selectedWorkspaceValue = workspaceOptions.some(
    (option) => workspacePathKey(option.path) === workspacePathKey(selectedWorkspace)
  ) ? selectedWorkspace : "";
  const workspaceFiles = selectedWorkspaceValue === "" ? [] : workspaceIgnoreFilesFor(workspaceRules, selectedWorkspaceValue);
  const activeFiles = filterScope === "global" ? globalFiles : workspaceFiles;
  const candidate = candidateValue(ruleKindChoice, draft, caseSensitive);
  const draftErrorKey = draft.trim() === "" ? void 0 : validateDraft(ruleKindChoice, draft, caseSensitive);
  const activeKeys = new Set(activeFiles.map(ignoreRuleKey));
  const globalKeys = new Set(globalFiles.map(ignoreRuleKey));
  const candidateErrorKey = candidate === void 0 ? draftErrorKey : activeKeys.has(ignoreRuleKey(candidate)) ? "settings.duplicateName" : filterScope === "workspace" && globalKeys.has(ignoreRuleKey(candidate)) ? "settings.inheritedName" : void 0;
  const candidateError = candidateErrorKey === void 0 ? void 0 : t(candidateErrorKey);
  const workspaceAvailable = selectedWorkspaceValue !== "";
  const canAdd = candidate !== void 0 && candidateError === void 0 && !saving && (filterScope === "global" || workspaceAvailable);
  const commit = async (files) => {
    setSaving(true);
    try {
      if (filterScope === "global") await setIgnoreFiles(normalizeIgnoreFiles(files));
      else await setWorkspaceIgnoreFiles(selectedWorkspaceValue, normalizeIgnoreFiles(files));
    } finally {
      setSaving(false);
    }
  };
  const add = async () => {
    if (!canAdd || candidate === void 0) return;
    await commit([...activeFiles, candidate]);
    setDraft("");
  };
  const remove = async (value) => {
    const key = ignoreRuleKey(value);
    await commit(activeFiles.filter((entry) => ignoreRuleKey(entry) !== key));
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: "dsh_atFile_section", "aria-labelledby": "dsh-at-file-settings-title", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { id: "dsh-at-file-settings-title", className: "dsh_atFile_title", children: t("settings.title") }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: "dsh_atFile_card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "input",
        {
          type: "checkbox",
          className: "dsh_atFile_checkbox",
          checked: enabled,
          onChange: (event) => {
            void setEnabled(event.target.checked);
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "dsh_atFile_cardText", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh_atFile_cardTitle", children: t("settings.enabled") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh_atFile_cardDesc", children: t("settings.enabledDesc") })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh_atFile_filter", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh_atFile_filterHeading", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh_atFile_filterHeadingText", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh_atFile_filterTitle", children: t("settings.ignoreFiles") }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh_atFile_filterDesc", children: t("settings.ignoreFilesDesc") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh_atFile_scopeTabs", role: "tablist", "aria-label": t("settings.scope"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": filterScope === "global",
              className: "dsh_atFile_scopeTab",
              onClick: () => {
                setFilterScope("global");
              },
              children: t("settings.global")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": filterScope === "workspace",
              className: "dsh_atFile_scopeTab",
              onClick: () => {
                setFilterScope("workspace");
              },
              children: t("settings.workspace")
            }
          )
        ] })
      ] }),
      filterScope === "workspace" && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: "dsh_atFile_workspaceField", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: t("settings.workspaceSelect") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          "select",
          {
            className: "dsh_atFile_workspaceSelect",
            value: selectedWorkspaceValue,
            disabled: workspaceOptions.length === 0 || saving,
            onChange: (event) => {
              setSelectedWorkspace(event.target.value);
            },
            children: [
              workspaceOptions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("option", { value: "", children: t("settings.noWorkspace") }),
              workspaceOptions.map((option) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("option", { value: option.path, children: [
                option.title,
                " - ",
                option.path
              ] }, workspacePathKey(option.path)))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh_atFile_filterToolbar", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dsh_atFile_filterGroupTitle", children: filterScope === "global" ? t("settings.globalTitle") : t("settings.workspaceTitle") }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dsh_atFile_filterHint", children: filterScope === "global" ? t("settings.globalDesc") : t("settings.workspaceDesc") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "button",
          {
            type: "button",
            className: "dsh_atFile_secondaryButton",
            disabled: saving || (filterScope === "global" ? fileListKey(globalFiles) === fileListKey(DEFAULT_IGNORE_FILES) : workspaceFiles.length === 0),
            onClick: () => {
              void commit(filterScope === "global" ? DEFAULT_IGNORE_FILES : []);
            },
            children: filterScope === "global" ? t("settings.restoreDefaults") : t("settings.clearWorkspace")
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh_atFile_filterList", "aria-live": "polite", children: [
        activeFiles.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dsh_atFile_filterEmpty", children: filterScope === "global" ? t("settings.emptyGlobal") : t("settings.emptyWorkspace") }),
        activeFiles.map((value) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh_atFile_filterRow", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh_atFile_ruleMain", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("code", { className: "dsh_atFile_filterName", children: ruleLabel(value) }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh_atFile_ruleBadge", children: t(`settings.kind.${ruleKind(value)}`) }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh_atFile_ruleBadge", children: t(ruleCaseSensitive(value) ? "settings.caseSensitive" : "settings.caseInsensitive") })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "button",
            {
              type: "button",
              className: "dsh_atFile_filterRemove",
              title: t("settings.remove", { name: ruleLabel(value) }),
              "aria-label": t("settings.remove", { name: ruleLabel(value) }),
              disabled: saving,
              onClick: () => {
                void remove(value);
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(RemoveIcon, {})
            }
          )
        ] }, ignoreRuleKey(value)))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh_atFile_ruleMode", role: "group", "aria-label": t("settings.ruleType"), children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "button",
          {
            type: "button",
            className: "dsh_atFile_ruleModeButton",
            "aria-pressed": ruleKindChoice === "exact",
            onClick: () => {
              setRuleKindChoice("exact");
            },
            children: t("settings.kind.exact")
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "button",
          {
            type: "button",
            className: "dsh_atFile_ruleModeButton",
            "aria-pressed": ruleKindChoice === "regex",
            onClick: () => {
              setRuleKindChoice("regex");
            },
            children: t("settings.kind.regex")
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh_atFile_filterAddRow", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "input",
          {
            className: "dsh_atFile_filterInput",
            value: draft,
            placeholder: t(ruleKindChoice === "regex" ? "settings.regexPlaceholder" : "settings.namePlaceholder"),
            spellCheck: false,
            disabled: saving || filterScope === "workspace" && !workspaceAvailable,
            "aria-invalid": candidateError !== void 0,
            "aria-describedby": "dsh-at-file-filter-message",
            onChange: (event) => {
              setDraft(event.target.value);
            },
            onKeyDown: (event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              void add();
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          "button",
          {
            type: "button",
            className: "dsh_atFile_addButton",
            disabled: !canAdd,
            onClick: () => {
              void add();
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(PlusIcon, {}),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: saving ? t("settings.saving") : t("settings.add") })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: "dsh_atFile_caseToggle", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "input",
          {
            type: "checkbox",
            checked: caseSensitive,
            onChange: (event) => {
              setCaseSensitive(event.target.checked);
            },
            disabled: saving
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: t("settings.caseSensitiveOption") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "div",
        {
          id: "dsh-at-file-filter-message",
          className: candidateError === void 0 ? "dsh_atFile_filterHint" : "dsh_atFile_filterError",
          children: candidateError ?? t(ruleKindChoice === "regex" ? "settings.regexHint" : "settings.nameHint")
        }
      ),
      filterScope === "workspace" && globalFiles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh_atFile_inherited", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh_atFile_inheritedTitle", children: t("settings.inherited") }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dsh_atFile_inheritedList", children: globalFiles.map((value) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("code", { children: ruleLabel(value) }, ignoreRuleKey(value))) })
      ] })
    ] })
  ] });
}

// src/client/locales.ts
var zh = {
  "dock.aria": "\u5DF2\u5F15\u7528\u7684\u5DE5\u4F5C\u533A\u8DEF\u5F84",
  "dock.remove": "\u79FB\u9664 {name}",
  "nav": "\u6587\u4EF6\u63D0\u53CA",
  "settings.title": "\u5DE5\u4F5C\u533A\u6587\u4EF6\u63D0\u53CA",
  "settings.subtitle": "\u5728\u8F93\u5165\u6846\u8F93\u5165 @ \u641C\u7D22\u5E76\u5F15\u7528\u5DE5\u4F5C\u533A\u8DEF\u5F84\uFF1B\u63D2\u4EF6\u53EA\u4F20\u9012\u8DEF\u5F84\uFF0C\u4E0D\u8BFB\u53D6\u6587\u4EF6\u5185\u5BB9\u3002",
  "settings.enabled": "\u542F\u7528 @ \u6587\u4EF6\u63D0\u53CA",
  "settings.enabledDesc": "\u5173\u95ED\u540E\u9690\u85CF @ \u8DEF\u5F84\u9009\u62E9\u5668\u4E0E\u5F15\u7528\u6761\uFF0C\u5E76\u505C\u6B62\u5411\u6A21\u578B\u6807\u8BB0\u6240\u9009\u8DEF\u5F84\u3002",
  "settings.ignoreFiles": "\u6587\u4EF6\u8FC7\u6EE4",
  "settings.ignoreFilesDesc": "\u89C4\u5219\u53EA\u5339\u914D\u6587\u4EF6\u540D\uFF0C\u4E0D\u5339\u914D\u76EE\u5F55\u8DEF\u5F84\u3002\u53EF\u4EE5\u4F7F\u7528\u5B8C\u6574\u540D\u79F0\u6216\u6B63\u5219\u8868\u8FBE\u5F0F\uFF0C\u5E76\u5355\u72EC\u8BBE\u7F6E\u5927\u5C0F\u5199\u3002",
  "settings.scope": "\u8FC7\u6EE4\u8303\u56F4",
  "settings.global": "\u5168\u5C40",
  "settings.workspace": "\u5DE5\u4F5C\u533A",
  "settings.globalTitle": "\u5168\u5C40\u89C4\u5219",
  "settings.globalDesc": "\u5E94\u7528\u4E8E\u6240\u6709\u5DE5\u4F5C\u533A\u3002",
  "settings.workspaceTitle": "\u5DE5\u4F5C\u533A\u89C4\u5219",
  "settings.workspaceDesc": "\u53EA\u5E94\u7528\u4E8E\u5F53\u524D\u9009\u62E9\u7684\u5DE5\u4F5C\u533A\uFF0C\u5E76\u4E0E\u5168\u5C40\u89C4\u5219\u540C\u65F6\u751F\u6548\u3002",
  "settings.workspaceSelect": "\u5DE5\u4F5C\u533A",
  "settings.noWorkspace": "\u6CA1\u6709\u53EF\u7528\u7684\u5DE5\u4F5C\u533A",
  "settings.restoreDefaults": "\u6062\u590D\u9ED8\u8BA4",
  "settings.clearWorkspace": "\u6E05\u7A7A\u6B64\u5DE5\u4F5C\u533A",
  "settings.emptyGlobal": "\u5F53\u524D\u6CA1\u6709\u5168\u5C40\u8FC7\u6EE4\u89C4\u5219\u3002",
  "settings.emptyWorkspace": "\u6B64\u5DE5\u4F5C\u533A\u6CA1\u6709\u5355\u72EC\u7684\u8FC7\u6EE4\u89C4\u5219\u3002",
  "settings.namePlaceholder": "\u4F8B\u5982 desktop.ini",
  "settings.regexPlaceholder": "\u4F8B\u5982 \\.map$ \u6216 ^test-",
  "settings.nameHint": "\u586B\u5199\u5B8C\u6574\u6587\u4EF6\u540D\uFF0C\u4E0D\u8981\u5305\u542B\u8DEF\u5F84\u3002",
  "settings.regexHint": "\u6B63\u5219\u8868\u8FBE\u5F0F\u4F5C\u7528\u4E8E\u5B8C\u6574\u6587\u4EF6\u540D\uFF0C\u4E0D\u5305\u542B\u76EE\u5F55\u8DEF\u5F84\u3002",
  "settings.invalidName": "\u6587\u4EF6\u540D\u4E0D\u80FD\u5305\u542B\u8DEF\u5F84\u5206\u9694\u7B26\u3002",
  "settings.invalidRegex": "\u6B63\u5219\u8868\u8FBE\u5F0F\u65E0\u6548\u3002",
  "settings.duplicateName": "\u8FD9\u4E2A\u6587\u4EF6\u540D\u5DF2\u7ECF\u5728\u5F53\u524D\u5217\u8868\u4E2D\u3002",
  "settings.inheritedName": "\u8FD9\u4E2A\u6587\u4EF6\u540D\u5DF2\u7ECF\u7531\u5168\u5C40\u89C4\u5219\u8FC7\u6EE4\u3002",
  "settings.add": "\u6DFB\u52A0",
  "settings.saving": "\u6B63\u5728\u4FDD\u5B58",
  "settings.remove": "\u79FB\u9664 {name}",
  "settings.inherited": "\u540C\u65F6\u751F\u6548\u7684\u5168\u5C40\u89C4\u5219",
  "settings.ruleType": "\u89C4\u5219\u7C7B\u578B",
  "settings.kind.exact": "Exact",
  "settings.kind.regex": "Regex",
  "settings.caseSensitive": "\u533A\u5206\u5927\u5C0F\u5199",
  "settings.caseInsensitive": "\u5FFD\u7565\u5927\u5C0F\u5199",
  "settings.caseSensitiveOption": "\u533A\u5206\u5927\u5C0F\u5199"
};
var en = {
  "dock.aria": "Referenced workspace paths",
  "dock.remove": "Remove {name}",
  "nav": "File mentions",
  "settings.title": "Workspace file mentions",
  "settings.subtitle": "Type @ to search and reference a workspace path; the plugin passes the path without reading file content.",
  "settings.enabled": "Enable @ file mentions",
  "settings.enabledDesc": "Turning this off hides the @ path picker and reference dock, and stops marking selected paths for the model.",
  "settings.ignoreFiles": "File filters",
  "settings.ignoreFilesDesc": "Rules match basenames only, never directory paths. Use exact names or regular expressions with independent case settings.",
  "settings.scope": "Filter scope",
  "settings.global": "Global",
  "settings.workspace": "Workspace",
  "settings.globalTitle": "Global rules",
  "settings.globalDesc": "Applied to every workspace.",
  "settings.workspaceTitle": "Workspace rules",
  "settings.workspaceDesc": "Applied only to the selected workspace, alongside the global rules.",
  "settings.workspaceSelect": "Workspace",
  "settings.noWorkspace": "No workspace is available",
  "settings.restoreDefaults": "Restore defaults",
  "settings.clearWorkspace": "Clear this workspace",
  "settings.emptyGlobal": "There are no global file filters.",
  "settings.emptyWorkspace": "This workspace has no additional file filters.",
  "settings.namePlaceholder": "For example, desktop.ini",
  "settings.regexPlaceholder": "For example, \\.map$ or ^test-",
  "settings.nameHint": "Enter a complete file name without a path.",
  "settings.regexHint": "The regular expression runs against the complete basename, without its directory path.",
  "settings.invalidName": "A file name cannot contain path separators.",
  "settings.invalidRegex": "The regular expression is invalid.",
  "settings.duplicateName": "This file name is already in the current list.",
  "settings.inheritedName": "This file name is already filtered globally.",
  "settings.add": "Add",
  "settings.saving": "Saving",
  "settings.remove": "Remove {name}",
  "settings.inherited": "Global rules also applied",
  "settings.ruleType": "Rule type",
  "settings.kind.exact": "Exact",
  "settings.kind.regex": "Regex",
  "settings.caseSensitive": "Case-sensitive",
  "settings.caseInsensitive": "Case-insensitive",
  "settings.caseSensitiveOption": "Case-sensitive"
};
var NS = "at-file";

// src/client/styles.ts
var STYLE_ID = "dsh-at-file-style";
var cssText = `
.dsh_atFile_rail {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}
.dsh_atFile_row {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  min-width: 0;
  max-width: 100%;
  height: 28px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 14px;
  background: var(--dsw-alias-bg-layer-1);
}
.dsh_atFile_path {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  max-width: 360px;
  height: 100%;
  padding: 0 6px 0 10px;
  border: 0;
  background: none;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  line-height: 18px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh_atFile_path:hover {
  color: var(--dsw-alias-brand-primary);
}
.dsh_atFile_icon {
  flex: none;
  width: 14px;
  height: 14px;
}
.dsh_atFile_remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  border: 0;
  border-radius: 10px;
  background: none;
  color: var(--dsw-alias-label-dimmed);
  cursor: pointer;
}
.dsh_atFile_remove svg {
  width: 12px;
  height: 12px;
}
.dsh_atFile_remove:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.dsh_atFile_section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}
.dsh_atFile_title {
  margin: 0;
  color: var(--dsw-alias-label-primary);
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
}
.dsh_atFile_card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
  padding: 14px 16px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1);
  cursor: pointer;
}
.dsh_atFile_checkbox {
  flex: none;
  width: 18px;
  height: 18px;
  margin: 2px 0 0;
  accent-color: var(--dsw-alias-brand-primary);
  cursor: pointer;
}
.dsh_atFile_cardText {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.dsh_atFile_cardTitle {
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  line-height: 22px;
}
.dsh_atFile_cardDesc {
  color: var(--dsw-alias-label-tertiary);
  font-size: 13px;
  line-height: 20px;
}
.dsh_atFile_filter {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  padding-top: 4px;
}
.dsh_atFile_filterHeading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  min-width: 0;
}
.dsh_atFile_filterHeadingText {
  display: flex;
  flex: 1 1 280px;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.dsh_atFile_filterTitle {
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  line-height: 22px;
  font-weight: 600;
}
.dsh_atFile_filterDesc,
.dsh_atFile_filterHint,
.dsh_atFile_workspaceField > span {
  color: var(--dsw-alias-label-tertiary);
  font-size: 13px;
  line-height: 20px;
}
.dsh_atFile_scopeTabs {
  display: inline-flex;
  flex: 0 1 auto;
  min-width: 220px;
  padding: 3px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
}
.dsh_atFile_scopeTab {
  flex: 1 1 0;
  min-width: 0;
  height: 30px;
  padding: 0 14px;
  border: 0;
  border-radius: 6px;
  background: none;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  cursor: pointer;
}
.dsh_atFile_scopeTab:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.dsh_atFile_scopeTab[aria-selected='true'] {
  background: var(--dsw-alias-button-ghost-active-fill);
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
}
.dsh_atFile_workspaceField {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}
.dsh_atFile_workspaceSelect,
.dsh_atFile_filterInput {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  outline: none;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  line-height: 20px;
}
.dsh_atFile_workspaceSelect:focus,
.dsh_atFile_filterInput:focus {
  border-color: var(--dsw-alias-brand-primary);
}
.dsh_atFile_workspaceSelect:disabled,
.dsh_atFile_filterInput:disabled {
  opacity: 0.55;
}
.dsh_atFile_filterToolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}
.dsh_atFile_filterGroupTitle {
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  line-height: 22px;
  font-weight: 600;
}
.dsh_atFile_secondaryButton {
  flex: none;
  min-height: 30px;
  padding: 0 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 15px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
}
.dsh_atFile_secondaryButton:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.dsh_atFile_secondaryButton:disabled,
.dsh_atFile_filterRemove:disabled,
.dsh_atFile_addButton:disabled {
  opacity: 0.45;
  cursor: default;
}
.dsh_atFile_filterList {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
}
.dsh_atFile_filterRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
  min-height: 40px;
  padding: 0 8px 0 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
}
.dsh_atFile_filterRow:last-child {
  border-bottom: 0;
}
.dsh_atFile_filterName {
  min-width: 0;
  overflow: hidden;
  color: var(--dsw-alias-label-primary);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh_atFile_ruleMain {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex: 1 1 auto;
  gap: 8px;
  min-width: 0;
}
.dsh_atFile_ruleBadge {
  flex: none;
  padding: 2px 6px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 4px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  line-height: 16px;
}
.dsh_atFile_ruleMain .dsh_atFile_filterName {
  flex: 1 1 180px;
}
.dsh_atFile_filterRemove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 14px;
  background: none;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
}
.dsh_atFile_filterRemove:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover-danger);
  color: var(--dsw-alias-state-error-primary);
}
.dsh_atFile_filterRemove svg,
.dsh_atFile_addButton svg {
  width: 15px;
  height: 15px;
}
.dsh_atFile_filterEmpty {
  padding: 16px 12px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 13px;
  line-height: 20px;
  text-align: center;
}
.dsh_atFile_filterAddRow {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}
.dsh_atFile_ruleMode {
  display: inline-flex;
  align-self: flex-start;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
}
.dsh_atFile_ruleModeButton {
  min-width: 72px;
  height: 28px;
  padding: 0 10px;
  border: 0;
  border-radius: 5px;
  background: none;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.dsh_atFile_ruleModeButton[aria-pressed='true'] {
  background: var(--dsw-alias-button-ghost-active-fill);
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
}
.dsh_atFile_caseToggle {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 7px;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
}
.dsh_atFile_caseToggle input {
  width: 15px;
  height: 15px;
  margin: 0;
  accent-color: var(--dsw-alias-brand-primary);
}
.dsh_atFile_filterAddRow .dsh_atFile_filterInput {
  flex: 1 1 240px;
  width: auto;
}
.dsh_atFile_filterInput[aria-invalid='true'] {
  border-color: var(--dsw-alias-state-error-primary);
}
.dsh_atFile_addButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: none;
  height: 36px;
  padding: 0 14px;
  border: 0;
  border-radius: 18px;
  background: var(--dsw-alias-button-primary-fill);
  color: var(--dsw-alias-label-primary-inverted);
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  cursor: pointer;
}
.dsh_atFile_filterError {
  color: var(--dsw-alias-state-error-primary);
  font-size: 13px;
  line-height: 20px;
}
.dsh_atFile_inherited {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
  padding-top: 4px;
}
.dsh_atFile_inheritedTitle {
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
}
.dsh_atFile_inheritedList {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}
.dsh_atFile_inheritedList code {
  max-width: 100%;
  overflow: hidden;
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-secondary);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@media (max-width: 560px) {
  .dsh_atFile_scopeTabs {
    width: 100%;
  }
  .dsh_atFile_addButton {
    flex: 1 1 auto;
  }
}
`;
function adoptStyles() {
  if (document.getElementById(STYLE_ID) !== null) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = cssText;
  document.head.appendChild(style);
}

// src/client/FolderNavigator.tsx
var import_react2 = require("react");
function isFolderNavigationKey(event) {
  return event.key === "ArrowRight" && !event.defaultPrevented && !event.isComposing && event.keyCode !== 229 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
}
function folderNavigationTarget(menu, input, selection) {
  if (!menu.open || menu.hit === null || menu.highlight === null) return void 0;
  const { hit, highlight } = menu;
  if (hit.trigger !== "@" || highlight.source !== SOURCE_NAME || hit.span.draftRev !== input.draftRev) return void 0;
  if (selection.start !== selection.end || selection.start !== hit.span.end) return void 0;
  if (input.phase !== "plain" && input.phase !== "claimed") return void 0;
  const group = menu.groups.find((candidate2) => candidate2.source === SOURCE_NAME);
  if (group?.status !== "ready") return void 0;
  const candidate = group.items[highlight.index];
  if (candidate?.atFileKind !== "dir" || candidate.value === void 0) return void 0;
  const token = `@${candidate.value}/`;
  return {
    draft: input.draft.slice(0, hit.span.start) + token + input.draft.slice(hit.span.end),
    caret: hit.span.start + token.length,
    tier: input.phase
  };
}
function FolderNavigator({ controller, useInput, inputActions }) {
  const input = useInput((state) => state);
  const pending = (0, import_react2.useRef)(null);
  (0, import_react2.useLayoutEffect)(() => {
    const navigation = pending.current;
    if (navigation === null) return;
    pending.current = null;
    controller.track(input.draft, navigation.caret, { tier: navigation.tier }, input.draftRev);
    navigation.textarea.setSelectionRange(navigation.caret, navigation.caret);
  }, [controller, input.draft, input.draftRev]);
  (0, import_react2.useEffect)(() => {
    const onKeyDown = (event) => {
      if (!isFolderNavigationKey(event)) return;
      if (!(event.target instanceof HTMLTextAreaElement)) return;
      const target = folderNavigationTarget(controller.menu.getSnapshot(), input, {
        start: event.target.selectionStart,
        end: event.target.selectionEnd
      });
      if (target === void 0) return;
      event.preventDefault();
      event.stopPropagation();
      pending.current = { ...target, textarea: event.target };
      inputActions.setDraft(target.draft);
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [controller, input, inputActions]);
  return null;
}

// src/client/index.ts
var inject = ["inputTriggers", "sessions", "connection", "remote", "slots", "locale"];
var NAV_ICON_LABEL = "\u6587\u4EF6\u63D0\u53CA";
var FILE_ICON_PATHS = [
  "M11.2426 4.80473V6.10551H4.75819V4.80473H11.2426Z",
  "M9.40858 7.84478V9.14557H4.75819V7.84478H9.40858Z",
  "M9.23438 0.546389C10.1941 0.546389 10.9683 0.544914 11.5859 0.611819C12.2161 0.680096 12.7634 0.825745 13.2393 1.17139C13.5172 1.3733 13.7619 1.61812 13.9639 1.896C14.3096 2.37183 14.4551 2.91922 14.5234 3.54932C14.5903 4.16686 14.5889 4.94133 14.5889 5.90088V10.0981C14.5889 11.0576 14.5903 11.8321 14.5234 12.4497C14.4552 13.0798 14.3094 13.6272 13.9639 14.103C13.7619 14.381 13.5172 14.6257 13.2393 14.8276C12.7633 15.1734 12.2163 15.3189 11.5859 15.3872C10.9683 15.4541 10.1942 15.4536 9.23438 15.4536H6.76563C5.80591 15.4536 5.03168 15.4541 4.41407 15.3872C3.78385 15.3189 3.23665 15.1734 2.76074 14.8276C2.48291 14.6257 2.23802 14.3809 2.03614 14.103C1.69066 13.6272 1.54483 13.0798 1.47657 12.4497C1.40973 11.8321 1.41114 11.0576 1.41114 10.0981V5.90088C1.41113 4.94132 1.40966 4.16686 1.47657 3.54932C1.54488 2.91921 1.69042 2.37184 2.03614 1.896C2.2381 1.61807 2.4828 1.37333 2.76074 1.17139C3.23665 0.825682 3.78386 0.680109 4.41407 0.611819C5.03168 0.544905 5.80591 0.546389 6.76563 0.546389H9.23438ZM6.76563 1.896C5.77586 1.896 5.0876 1.89738 4.55957 1.95459C4.0443 2.01043 3.76214 2.11349 3.55469 2.26416C3.39135 2.38284 3.24761 2.52662 3.12891 2.68994C2.97821 2.89736 2.8752 3.17967 2.81934 3.69483C2.76214 4.22279 2.76075 4.91131 2.76074 5.90088V10.0981C2.76074 11.0876 2.76221 11.7762 2.81934 12.3042C2.87516 12.8194 2.97829 13.1026 3.12891 13.3101C3.24754 13.4733 3.39147 13.6172 3.55469 13.7358C3.76213 13.8865 4.04438 13.9896 4.55957 14.0454C5.0876 14.1026 5.77586 14.103 6.76563 14.103H9.23438C10.2242 14.103 10.9124 14.1026 11.4404 14.0454C11.9556 13.9896 12.2379 13.8865 12.4453 13.7358C12.6086 13.6172 12.7525 13.4733 12.8711 13.3101C13.0217 13.1026 13.1248 12.8195 13.1807 12.3042C13.2378 11.7762 13.2393 11.0876 13.2393 10.0981V5.90088C13.2393 4.91131 13.2379 4.22279 13.1807 3.69483C13.1248 3.17969 13.0218 2.89736 12.8711 2.68994C12.7524 2.52667 12.6086 2.38281 12.4453 2.26416C12.2379 2.11355 11.9556 2.01041 11.4404 1.95459C10.9124 1.8974 10.2241 1.896 9.23438 1.896H6.76563Z"
];
function patchAtFileNavIcon() {
  const dialog = document.querySelector('[role="dialog"]');
  if (!dialog) return;
  const buttons = dialog.querySelectorAll("nav button");
  for (const button of buttons) {
    if (button.textContent.trim() !== NAV_ICON_LABEL) continue;
    const svg = button.querySelector("svg");
    if (!svg) continue;
    const first = svg.querySelector("path");
    if (first && first.getAttribute("d") === FILE_ICON_PATHS[0]) continue;
    svg.innerHTML = "";
    for (const d of FILE_ICON_PATHS) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      path.setAttribute("fill", "currentColor");
      svg.appendChild(path);
    }
  }
}
function installNavIconPatch() {
  if (typeof document === "undefined" || typeof MutationObserver !== "function") return () => {
  };
  let raf = 0;
  const schedulePatch = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      patchAtFileNavIcon();
    });
  };
  patchAtFileNavIcon();
  const observer = new MutationObserver(() => {
    // 资源：patch 幂等（已是目标图标则跳过），仅 rAF 节流调度即可；
    // 同步跑 + rAF 双跑是冗余的全量扫描（见 paste-input 同款注释）。
    schedulePatch();
  });
  // Observe the body for the plugin's lifetime instead of switching to the
  // dialog element: the settings dialog is destroyed/recreated on each open,
  // and an observer parked on a detached dialog would stop seeing the next
  // dialog entirely (gear icon stays until another scan finds it).
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["d"] });
  return () => {
    if (raf) cancelAnimationFrame(raf);
    observer.disconnect();
  };
}
function apply(ctx) {
  adoptStyles();
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-at-file: dictionaries");
  ctx.effect(() => installNavIconPatch(), "dsh-at-file: settings nav icon");
  const scope = (0, import_client.createSnapshotStore)({ value: defaultAtFileSettings() });
  let settingsGeneration = 0;
  let settingsTail = Promise.resolve();
  const reportSettingsError = (operation, error51) => {
    if (typeof error51 === "object" && error51 !== null && "code" in error51 && "message" in error51) {
      const remoteError = error51;
      console.error(`[dsh-at-file] settings ${operation} failed: ${remoteError.code}: ${remoteError.message}`);
      return;
    }
    console.error(`[dsh-at-file] settings ${operation} failed:`, error51);
  };
  let atFile;
  const loadSettings = async () => {
    const remote = atFile;
    if (remote === void 0) return;
    const generation = ++settingsGeneration;
    try {
      const result = await remote.getSettings();
      if (atFile !== remote || generation !== settingsGeneration) return;
      if (!result.ok) {
        reportSettingsError("read", result.error);
        return;
      }
      scope.set({ value: result.value });
    } catch (error51) {
      if (atFile === remote && generation === settingsGeneration) reportSettingsError("read", error51);
    }
  };
  const updateSettings = (update) => {
    const operation = settingsTail.then(async () => {
      const remote = atFile;
      if (remote === void 0) {
        reportSettingsError("update", new Error("the atFile Remote is not mounted"));
        return;
      }
      const generation = ++settingsGeneration;
      try {
        const result = await remote.updateSettings(update);
        if (atFile !== remote || generation !== settingsGeneration) return;
        if (!result.ok) {
          reportSettingsError("update", result.error);
          return;
        }
        scope.set({ value: result.value });
      } catch (error51) {
        if (atFile === remote && generation === settingsGeneration) reportSettingsError("update", error51);
      }
    });
    settingsTail = operation.catch(
      /* v8 ignore next -- every Remote and publication failure is contained inside operation. */
      () => {
      }
    );
    return operation;
  };
  ctx.effect(async () => {
    const dispose = await ctx.remote.$mount(AT_FILE_REMOTE);
    atFile = ctx.reflect.get("remote.atFile");
    if (atFile === void 0) {
      throw new Error("dsh-at-file: the atFile Remote namespace did not mount");
    }
    await loadSettings();
    return () => {
      settingsGeneration += 1;
      atFile = void 0;
      void dispose();
    };
  }, "dsh-at-file: remote");
  const connection = ctx.get("connection");
  const inputTriggers = ctx.get("inputTriggers");
  const sessions = ctx.get("sessions");
  const t = ctx.locale.bind(NS);
  const entryByRel = /* @__PURE__ */ new Map();
  const search = async (sessionId, signal) => {
    if (atFile === void 0) throw new Error("dsh-at-file: the atFile Remote is not mounted");
    const result = await atFile.search(sessionId, signal);
    if (!result.ok) throw new Error(`search failed: ${result.error.code}: ${result.error.message}`);
    for (const entry of result.value) entryByRel.set(entry.relative, entry.path);
    return result.value;
  };
  const { source, invalidateAll } = createAtFileSource({ search });
  ctx.on("connection/reset", () => {
    invalidateAll();
    entryByRel.clear();
    void loadSettings();
  });
  let sourceRegistered = false;
  let sourceDispose = () => {
  };
  let ignoreFilesKey;
  const syncSource = () => {
    const value = scope.getSnapshot().value;
    const enabled = value.enabled;
    const nextIgnoreFilesKey = ignoreFilesSettingsKey(value);
    if (ignoreFilesKey !== void 0 && ignoreFilesKey !== nextIgnoreFilesKey) {
      invalidateAll();
      entryByRel.clear();
    }
    ignoreFilesKey = nextIgnoreFilesKey;
    if (enabled && !sourceRegistered) {
      sourceDispose = inputTriggers.registerSource(source);
      sourceRegistered = true;
    } else if (!enabled && sourceRegistered) {
      sourceDispose();
      sourceDispose = () => {
      };
      sourceRegistered = false;
    }
  };
  ctx.effect(() => {
    syncSource();
    const off = scope.subscribe(syncSource);
    return () => {
      off();
      sourceDispose();
    };
  }, "dsh-at-file: source (settings-gated)");
  const openPath = (path) => {
    void connection.api.host.openPath({ path }).then((response) => {
      if (!response.result.ok) console.error("[dsh-at-file] open failed:", response.result.error.message);
    }, (error51) => {
      console.error("[dsh-at-file] open failed:", error51);
    });
  };
  const openRelative = (relative) => {
    const path = entryByRel.get(relative);
    if (path === void 0) {
      console.error("[dsh-at-file] open failed: no index entry for", relative);
      return;
    }
    openPath(path);
  };
  ctx.slots.inject("conversation.input.dock", () => ctx.slots.register({
    name: "conversation.input.dock",
    id: "at-file",
    order: 20,
    locale: NS,
    inject: () => ({
      onOpen: openRelative,
      hooks: { scope }
    })
  }, FilesDock));
  ctx.slots.inject("conversation.input.overlay", () => ctx.slots.register({
    name: "conversation.input.overlay",
    id: "at-file-folder-navigation",
    order: 1,
    inject: (sessionId) => {
      const actx = sessions.scope(sessionId);
      if (actx === void 0) throw new Error(`dsh-at-file: session "${String(sessionId)}" has no client scope`);
      return { controller: inputTriggers.sessionOf(actx) };
    }
  }, FolderNavigator));
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "at-file",
    order: 55,
    label: () => t("nav"),
    locale: NS,
    inject: () => ({
      hooks: { scope },
      setEnabled: async (enabled) => {
        await updateSettings({ field: "enabled", value: enabled });
      },
      setIgnoreFiles: async (ignoreFiles) => {
        await updateSettings({ field: "ignoreFiles", value: [...ignoreFiles] });
      },
      setWorkspaceIgnoreFiles: async (workspace, ignoreFiles) => {
        const current = normalizeWorkspaceIgnoreFiles(scope.getSnapshot().value.workspaceIgnoreFiles);
        const target = workspacePathKey(workspace);
        const next = current.filter((entry) => workspacePathKey(entry.workspace) !== target);
        const normalized = normalizeIgnoreFiles(ignoreFiles);
        if (normalized.length > 0) next.push({ workspace, ignoreFiles: normalized });
        await updateSettings({ field: "workspaceIgnoreFiles", value: next });
      }
    })
  }, AtFileSection));
}
return module.exports; }

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
 * model-selector / paste-input / at-file / attachment-remove 的浏览器半区。
 * 原为独立 `window.__ModuleLoader__.load({ id: 'dsh-essentials' })` 打包模块；
 * 并入 dsh-ui-tweaks 后改为导出 factory，由 client.js 的 load 统一组合 apply。
 */
function applyEssentialsClient(require) {
  const parts = [
    sub_modelSelector(require),
    sub_pasteInput(require),
    sub_atFile(require),
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
      masterDesc: 'UI 微调与桌面通知：插件列表、输入框、沉浸、快捷键、重试、通知',
      groupGeneral: '通用',
      groupImmersive: '沉浸',
      groupComposer: '输入框',
      groupNotify: '桌面通知',
      groupRetry: '请求重试',
      pluginInventoryTitle: '插件列表增强',
      pluginInventoryDesc: '插件列表分类 tab（全部/内置/自定义）+ 搜索',
      autoHideTitle: '输入框自动隐藏',
      autoHideDesc: '鼠标离开对话底部后隐藏输入框，贴近底边或聚焦时恢复',
      autoHideDelay: '隐藏延迟 (ms)',
      autoHideThreshold: '底部触发距离 (px)',
      immersiveTitle: '沉浸模式',
      immersiveDesc: '隐藏侧栏/详情/会话头，对话铺满页面；右下角悬浮按钮随时切换',
      immersiveEnter: '进入沉浸',
      immersiveExit: '退出沉浸',
      keyboardTitle: '全局快捷键',
      keyboardDesc: '沉浸切换 / 自动隐藏切换 / 聚焦输入框 / 快捷键帮助等',
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
      toastOn: '已开启',
      toastOff: '已关闭',
      close: '关闭',
      keys: {
        help: '打开/关闭快捷键帮助',
        escape: '关闭帮助面板',
        immersive: '切换沉浸模式',
        autoHide: '切换输入框自动隐藏',
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
      masterDesc: 'UI tweaks & desktop notifications: plugins, composer, immersive, shortcuts, retries, notify',
      groupGeneral: 'General',
      groupImmersive: 'Immersive',
      groupComposer: 'Composer',
      groupNotify: 'Desktop notifications',
      groupRetry: 'Request retries',
      pluginInventoryTitle: 'Plugin list enhancement',
      pluginInventoryDesc: 'Categorized plugin tabs (all/builtin/custom) + search',
      autoHideTitle: 'Auto-hide composer',
      autoHideDesc: 'Hide the composer when the mouse leaves the bottom; reveal near the edge or on focus',
      autoHideDelay: 'Hide delay (ms)',
      autoHideThreshold: 'Bottom trigger distance (px)',
      immersiveTitle: 'Immersive mode',
      immersiveDesc: 'Hide sidebar/details/header so the chat fills the page; toggle from the floating button',
      immersiveEnter: 'Enter immersive',
      immersiveExit: 'Exit immersive',
      keyboardTitle: 'Keyboard shortcuts',
      keyboardDesc: 'Immersive / auto-hide / focus composer / shortcut help, etc.',
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
      toastOn: 'Enabled',
      toastOff: 'Disabled',
      close: 'Close',
      keys: {
        help: 'Toggle shortcut help',
        escape: 'Close help panel',
        immersive: 'Toggle immersive mode',
        autoHide: 'Toggle auto-hide composer',
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
      autoHide: { enabled: true, delayMs: 600, threshold: 64 },
      immersive: { enabled: false },
      keyboard: { enabled: true },
      notify: { approval: true, question: true, turn: true, sessionDone: true },
    }
    const config = { ...DEFAULTS, autoHide: { ...DEFAULTS.autoHide }, immersive: { ...DEFAULTS.immersive }, keyboard: { ...DEFAULTS.keyboard }, notify: { ...DEFAULTS.notify } }
    function loadConfig() {
      try {
        const raw = JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}')
        if (raw && typeof raw === 'object') {
          for (const k of Object.keys(DEFAULTS)) {
            const v = raw[k]
            if (v === undefined) continue
            if (k === 'autoHide' || k === 'immersive' || k === 'keyboard' || k === 'notify') {
              if (v && typeof v === 'object') Object.assign(config[k], v)
            } else config[k] = v
          }
        }
      } catch { /* storage unavailable — keep defaults */ }
    }
    function saveConfig() {
      try { localStorage.setItem(CONFIG_KEY, JSON.stringify(config)) } catch { /* storage unavailable */ }
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
.dsh-composer-hidden{display:none !important}
html.dsh-immersive [data-phase] > [data-slot="conversation.session.header"]{display:none !important}
html.dsh-immersive [data-shell-overlay]{display:none !important}
.dsh-im-button{position:fixed;right:14px;top:14px;z-index:9999;display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-secondary);font:inherit;font-size:12.5px;line-height:20px;cursor:pointer;box-shadow:var(--dsw-shadow-lv1)}
.dsh-im-button:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}
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
.dshut-toast{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:20000;display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);font-size:14px;line-height:20px;box-shadow:var(--dsw-shadow-lv3);pointer-events:none;opacity:0;transition:opacity .2s ease}
.dshut-toast.dshut-toast-show{opacity:1}
`

    // ── 通用 toast（共享实现）──────────────────────────────────────────
    function showToast(text) {
      let el = document.querySelector('.dshut-toast')
      if (el) el.remove()
      el = document.createElement('div')
      el.className = 'dshut-toast'
      el.textContent = text
      document.body.appendChild(el)
      requestAnimationFrame(() => el.classList.add('dshut-toast-show'))
      setTimeout(() => {
        el.classList.remove('dshut-toast-show')
        setTimeout(() => { if (el.isConnected) el.remove() }, 200)
      }, 1500)
    }

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
                    title: t('immersiveTitle'), desc: t('immersiveDesc'),
                    checked: config.immersive.enabled,
                    onChange: () => setConfig(() => { config.immersive.enabled = !config.immersive.enabled }),
                  }),
                  react_jsx_runtime.jsx(ToggleRow, {
                    title: t('keyboardTitle'), desc: t('keyboardDesc'),
                    checked: config.keyboard.enabled,
                    onChange: () => setConfig(() => { config.keyboard.enabled = !config.keyboard.enabled }),
                  }),
                  react_jsx_runtime.jsx(ToggleRow, {
                    title: t('autoHideTitle'), desc: t('autoHideDesc'),
                    checked: config.autoHide.enabled,
                    onChange: () => setConfig(() => { config.autoHide.enabled = !config.autoHide.enabled }),
                  }),
                  config.autoHide.enabled ? react_jsx_runtime.jsxs("div", {
                    className: "dshut-row",
                    children: [
                      react_jsx_runtime.jsx("div", {
                        className: "dshut-rowText",
                        children: react_jsx_runtime.jsx("span", { className: "dshut-rowTitle", children: t('autoHideDelay') + ' / ' + t('autoHideThreshold') }),
                      }),
                      react_jsx_runtime.jsx("div", {
                        className: "dshut-field",
                        children: [
                          react_jsx_runtime.jsx("input", {
                            className: "dshut-num", type: "number", min: 0, max: 5000, step: 50,
                            value: config.autoHide.delayMs,
                            onChange: (e) => setConfig(() => { config.autoHide.delayMs = Number(e.target.value) || 600 }),
                          }),
                          react_jsx_runtime.jsx("input", {
                            className: "dshut-num", type: "number", min: 8, max: 400, step: 8,
                            value: config.autoHide.threshold,
                            onChange: (e) => setConfig(() => { config.autoHide.threshold = Number(e.target.value) || 64 }),
                          }),
                        ],
                      }),
                    ],
                  }) : null,
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

    // ── auto-hide 控制器（DOM 监听，读统一配置）──────────────────────
    function applyAutoHide(ctx, t) {
      ctx.effect(() => {
        if (typeof document === 'undefined') return () => {}
        let enabled = config.autoHide.enabled
        const HIDDEN_CLASS = 'dsh-composer-hidden'
        let hideTimer = 0
        let hidden = false

        const applyHidden = () => {
          for (const seat of document.querySelectorAll('[data-composer-seat]')) {
            seat.classList.toggle(HIDDEN_CLASS, hidden)
          }
        }
        const setHidden = (v) => { if (hidden === v) return; hidden = v; applyHidden() }
        const show = () => { if (hideTimer) { clearTimeout(hideTimer); hideTimer = 0 } setHidden(false) }
        const scheduleHide = () => {
          if (hideTimer) clearTimeout(hideTimer)
          hideTimer = setTimeout(() => setHidden(true), config.autoHide.delayMs)
        }
        const onMove = (e) => {
          if (!enabled) { show(); return }
          const nearBottom = window.innerHeight - e.clientY < config.autoHide.threshold
          const focusIn = document.activeElement && document.activeElement.closest && document.activeElement.closest('[data-composer-seat]')
          if (nearBottom || focusIn) show()
          else scheduleHide()
        }
        const onFocusIn = (e) => {
          if (e.target && e.target.closest && e.target.closest('[data-composer-seat]')) show()
        }
        const onScroll = () => {
          if (!enabled) return
          const scroller = document.querySelector('[data-conversation-scroll]')
          const el = scroller || document.scrollingElement || document.documentElement
          if (el.scrollHeight - el.scrollTop - el.clientHeight < config.autoHide.threshold) show()
        }
        const onPointerDown = (e) => {
          if (enabled && window.innerHeight - e.clientY < 96) show()
        }
        const onConfig = (e) => {
          enabled = Boolean(e.detail && e.detail.autoHide && e.detail.autoHide.enabled)
          if (!enabled) show()
        }
        document.addEventListener('mousemove', onMove, { passive: true })
        document.addEventListener('pointermove', onMove, { passive: true })
        document.addEventListener('pointerdown', onPointerDown, { passive: true })
        document.addEventListener('focusin', onFocusIn)
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('dsh-ui-tweaks:config', onConfig)
        const observer = new MutationObserver(() => { if (hidden) applyHidden() })
        observer.observe(document.body, { childList: true, subtree: true })
        return () => {
          document.removeEventListener('mousemove', onMove)
          document.removeEventListener('pointermove', onMove)
          document.removeEventListener('pointerdown', onPointerDown)
          document.removeEventListener('focusin', onFocusIn)
          window.removeEventListener('scroll', onScroll)
          window.removeEventListener('dsh-ui-tweaks:config', onConfig)
          observer.disconnect()
          if (hideTimer) clearTimeout(hideTimer)
        }
      }, 'ui-tweaks: auto-hide controller')
    }

    // ── immersive 控制器（DOM + 悬浮按钮，读统一配置）────────────────
    function applyImmersive(ctx, t) {
      ctx.effect(() => {
        if (typeof document === 'undefined') return () => {}
        let enabled = config.immersive.enabled
        const ROOT_CLASS = 'dsh-immersive'
        const BUTTON_CLASS = 'dsh-im-button'
        const ENTER_SVG = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6.5 2.5H2.5v4M9.5 2.5h4v4M6.5 13.5h-4v-4M9.5 13.5h4v-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        const EXIT_SVG = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2.5 6.5h4v-4M13.5 9.5h-4v4M2.5 9.5h4v4M13.5 6.5h-4v-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        let button = null
        let originalGrid = null
        let frame = null
        let raf = 0
        let observer = null

        const findFrame = () => {
          const sidebar = document.querySelector('[data-slot="sidebar"]')
          if (sidebar) { const col = sidebar.parentElement; if (col && col.parentElement) return col.parentElement }
          const details = document.querySelector('[data-slot="details"]')
          if (details) { const col = details.parentElement; if (col && col.parentElement) return col.parentElement }
          const candidates = Array.from(document.querySelectorAll('div')).filter((el) => el.style && typeof el.style.gridTemplateColumns === 'string' && /px\s+minmax\(0,\s*1fr\)\s+px/.test(el.style.gridTemplateColumns))
          return candidates[0] || null
        }
        const applyFrame = () => {
          if (!enabled) return
          if (frame === null || !frame.isConnected) {
            frame = findFrame()
            if (frame === null) return
            if (originalGrid === null) originalGrid = frame.style.gridTemplateColumns || ''
          }
          if (frame) frame.style.gridTemplateColumns = '0px minmax(0, 1fr) 0px'
        }
        const renderButton = () => {
          if (button !== null && button.isConnected) {
            button.setAttribute('aria-label', enabled ? t('immersiveExit') : t('immersiveEnter'))
            button.title = enabled ? t('immersiveExit') : t('immersiveEnter')
            button.innerHTML = (enabled ? EXIT_SVG : ENTER_SVG) + '<span>' + (enabled ? t('immersiveExit') : t('immersiveEnter')) + '</span>'
            return
          }
          button = document.createElement('button')
          button.type = 'button'
          button.className = BUTTON_CLASS
          button.setAttribute('aria-label', enabled ? t('immersiveExit') : t('immersiveEnter'))
          button.innerHTML = (enabled ? EXIT_SVG : ENTER_SVG) + '<span>' + (enabled ? t('immersiveExit') : t('immersiveEnter')) + '</span>'
          button.addEventListener('click', () => {
            config.immersive.enabled = !config.immersive.enabled
            saveConfig()
            window.dispatchEvent(new CustomEvent('dsh-ui-tweaks:config', { detail: config }))
          })
          document.body.appendChild(button)
        }
        const removeButton = () => { if (button !== null && button.isConnected) button.remove(); button = null }
        const refresh = () => {
          document.documentElement.classList.toggle(ROOT_CLASS, enabled)
          if (enabled) { applyFrame(); renderButton() }
          else {
            removeButton()
            if (frame !== null && frame.isConnected && originalGrid !== null) frame.style.gridTemplateColumns = originalGrid
            originalGrid = null
            frame = null
          }
        }
        const scheduleRefresh = () => {
          if (raf) return
          raf = requestAnimationFrame(() => { raf = 0; refresh() })
        }
        const onConfig = () => {
          const next = config.immersive.enabled
          if (next === enabled) return
          enabled = next
          refresh()
          showToast(enabled ? t('toastOn') : t('toastOff'))
        }
        window.addEventListener('dsh-ui-tweaks:config', onConfig)
        // 资源：disabled 时 observer 不调度（refresh 在 disabled 下本就是 no-op），
        // 避免聊天流式更新时每帧都排一个 rAF；enabled 由 onConfig 翻转并直刷。
        observer = new MutationObserver(() => { if (enabled) scheduleRefresh() })
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] })
        refresh()
        return () => {
          window.removeEventListener('dsh-ui-tweaks:config', onConfig)
          if (raf) cancelAnimationFrame(raf)
          if (observer) observer.disconnect()
          removeButton()
          if (frame !== null && frame.isConnected && originalGrid !== null) frame.style.gridTemplateColumns = originalGrid
          document.documentElement.classList.remove(ROOT_CLASS)
        }
      }, 'ui-tweaks: immersive controller')
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
        { group: 'groupImmersive', id: 'immersive', keys: ['Ctrl+Shift+F'] },
        { group: 'groupComposer', id: 'autoHide', keys: ['Ctrl+Shift+H'] },
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
          if (mod && shift && key === 'f') {
            event.preventDefault()
            config.immersive.enabled = !config.immersive.enabled
            saveConfig()
            window.dispatchEvent(new CustomEvent('dsh-ui-tweaks:config', { detail: config }))
            return
          }
          if (mod && shift && key === 'h') {
            event.preventDefault()
            config.autoHide.enabled = !config.autoHide.enabled
            saveConfig()
            window.dispatchEvent(new CustomEvent('dsh-ui-tweaks:config', { detail: config }))
            return
          }
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
      const show = (title, body, tag, target) => withClickFocus(new Notification(title, { body, tag, requireInteraction: true }), target.onOpen)
      const fireNotification = (wait, target) => {
        if (wait.kind === 'approval') {
          if (!config.notify.approval) return
          const body = wait.payload.reason ?? t('notifyApprovalBody').replace('{toolName}', String(wait.payload.toolName ?? ''))
          return show(titled(t('notifyApprovalTitle'), target.label), body, wait.key, target)
        }
        if (wait.kind !== 'question') return // 未知 pending 类型：不弹，避免构造异常通知
        if (!config.notify.question) return
        const first = wait.payload.questions && wait.payload.questions[0]
        const body = first && first.question ? first.question : t('notifyQuestionBody')
        return show(titled(t('notifyQuestionTitle'), target.label), body, wait.key, target)
      }
      const fireTurnNotification = (turn, summary, target) => {
        if (!config.notify.turn) return
        const body = summary !== undefined && summary !== '' ? summary : t('notifyTurnBody').replace('{turn}', String(turn))
        return show(titled(t('notifyTurnTitle'), target.label), body, 'turn:' + turn, target)
      }
      const fireSessionDoneNotification = (target) => {
        if (!config.notify.sessionDone) return
        return show(titled(t('notifySessionDoneTitle'), target.label), t('notifySessionDoneBody'), target.tag, target)
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
      const kindOf = (entry) => {
        if (!entry.enabled) return 'custom'
        const entryId = entry.entryId
        if (typeof entryId === 'string' && entryId) {
          if (entryId.startsWith('@deepseek-ai/') || /^(ui-|dsh-|cordis-)/.test(entryId)) return 'builtin'
        }
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
    // 原 dsh-essentials 的浏览器半区（model-selector / paste-input / at-file /
    // attachment-remove）在 ./essentials-client.js，作为同一 load 下的子 factory
    // 组合进来，共享同一 fiber 与 require。
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

      // 基础输入能力（原 dsh-essentials：model-selector / paste-input / at-file / attachment-remove）
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
      applyAutoHide(ctx, t)
      applyImmersive(ctx, t)
      applyKeyboard(ctx, t)
      applyNotify(ctx, t)

      // 卸载时持久化当前配置
      ctx.effect(() => () => saveConfig(), 'ui-tweaks: config persist')
    }
    return { name: 'dsh-ui-tweaks', inject, apply }
  },
})
