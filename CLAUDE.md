# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# Project Overview

vibe_shuangpin 是一个双拼学习平台，帮助用户高效学习和掌握双拼输入法。

## 目标

- 提供直观的双拼学习体验，降低学习门槛
- 支持多种双拼方案（小鹤、微软、搜狗、自然码等）
- 通过交互式练习帮助用户形成肌肉记忆
- 开源社区驱动，持续迭代优化

## 架构

- frontend: React + TypeScript (Vite)
- 纯前端应用，无后端服务
- 本地存储优先（无需账号）
- PWA 支持，可离线使用

---

# Engineering Principles

- **优先稳定性**，而非炫技 — 选择成熟可靠的方案
- **不允许大规模重构** — 重构必须在独立 task 中计划并审批
- **不允许未经确认修改架构** — 组件结构、数据流变更需先讨论
- **小步修改** — 每次提交聚焦一个原子变更
- **每次修改必须可验证** — 无验证不合并
- **优先可维护性** — 代码是写给人读的，其次才是机器执行
- **避免 magic behavior** — 显式优于隐式，禁止意外副作用
- **用户价值驱动** — 每个功能都要回答"解决了什么实际问题"

---

# Workflow

任何开发任务必须遵循以下流程：

1. **阅读相关 docs** — 先理解已有设计和决策
2. **分析问题** — 明确问题范围、约束、影响面
3. **输出 plan** — 描述方案、列出待修改文件、风险评估
4. **等待确认** — 获得批准后开始实施
5. **小步实施** — 一次修改不超过 3-5 个文件
6. **执行验证** — lint → typecheck → test → build
7. **输出风险与后续建议** — 每次任务收尾时总结

## 禁止

- 未分析直接修改代码
- 一次修改过多文件（超过 5 个需说明理由）
- 擅自重构未在 plan 中提及的部分
- 跳过验证步骤

---

# Context Rules

在开始特定类型的修改前，必须先阅读对应的文档：

## 修改前端组件前
- docs/architecture/frontend.md
- rules/frontend.md

## 修改数据/状态管理层
- docs/architecture/frontend.md

## 新增功能前
- docs/decisions/ 下的相关 ADR
- docs/business/ 下的相关说明

## 修复 Bug 前
- docs/known-issues/ 下的相关记录

---

# Coding Rules

## 通用
- 使用 TypeScript **strict 模式**
- 禁止 `any` — 使用 `unknown` 代替
- 禁止 `@ts-ignore` / `@ts-expect-error`
- 函数不超过 80 行（超过说明需要拆分）
- 不允许循环依赖（使用 eslint import/no-cycle 检测）
- 禁止 silent error — 所有异常必须被处理或显式忽略

## React 与组件
- 组件文件使用 PascalCase：`UserProfile.tsx`
- hooks 文件使用 camelCase：`useKeyboard.ts`
- 一个文件只导出一个主要组件
- Props 接口命名为 `{ComponentName}Props`
- 自定义 hook 必须以 `use` 开头
- 禁止在 useEffect 中直接修改 state 以外的变量

## 异步与副作用
- async 函数必须 try/catch
- 用户交互产生的错误必须显示友好的错误提示
- 禁止未清理的副作用（effect 清理、事件监听、定时器）

## 测试
- 每个工具函数必须有单元测试
- 每个组件至少有一个渲染测试
- Bug fix 必须附带对应的回归测试

---

# Safety Rules

以下操作**必须**获得明确授权后才能执行：

## 绝对禁止（除非明确授权）
- 修改 TypeScript / Vite 配置文件（tsconfig.json, vite.config.ts）
- 修改 ESLint / Prettier 配置
- 修改 package.json 的 dependencies/scripts
- 修改 CI/CD 配置
- 修改项目目录结构（移动/重命名已存在的目录）

## 必须批准（plan 中需包含）
- 引入新的外部依赖
- 修改状态管理方案
- 更改组件层级结构
- 影响现有用户数据兼容性的变更

---

# Verification

任何代码修改后必须执行以下验证：

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## 规则

- 如果任一步骤失败：**停止继续修改**
- 分析失败原因，修复后再继续
- 不允许跳过失败的验证
- 不允许提交未通过验证的代码

---

# Output Rules

每次任务完成后的输出必须包含以下内容：

## 修改摘要
- 修改了什么、为什么修改

## 修改文件列表
- 列出所有新增/修改的文件

## 风险点
- 本次变更可能影响的范围
- 已知的注意事项

## 验证结果
- lint / typecheck / test / build 的通过状态

## 后续建议（可选）
- 遗留问题、可优化的方向
