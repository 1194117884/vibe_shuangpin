# Frontend Architecture

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | React 18+ |
| 语言 | TypeScript (strict) |
| 构建 | Vite |
| 测试 | Vitest + React Testing Library |
| 样式 | CSS Modules |
| PWA | vite-plugin-pwa |

## 目录结构

```
src/
├── components/       # 通用 UI 组件
│   └── {Component}/
│       ├── {Component}.tsx
│       ├── {Component}.module.css
│       └── {Component}.test.tsx
├── features/         # 功能模块
│   └── {feature}/
├── hooks/            # 通用自定义 hooks
├── utils/            # 工具函数
├── types/            # 全局类型定义
├── constants/        # 常量与枚举
├── data/             # 静态数据（双拼方案表等）
├── App.tsx
└── main.tsx
```

## 数据流

- 用户交互 → 事件处理器 → 状态更新 → UI 重新渲染
- 数据持久化使用 localStorage / IndexedDB
- 双拼方案表等静态数据作为 TypeScript 常量管理

## 双拼方案

每个方案定义为独立的数据模块：
- 声母韵母映射表
- 特殊规则（单字音、模糊音等）
- 示例词汇

## 练习引擎

练习模块的核心逻辑应作为纯函数实现，便于测试：
- generateQuestion() → { prompt, answer, options? }
- checkAnswer(input, correct) → { correct: boolean, feedback? }
- calculateAccuracy(results) → number
