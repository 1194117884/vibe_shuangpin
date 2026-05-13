# Frontend Rules

## 技术栈

- React 18+ with Hooks
- TypeScript strict mode
- Vite 作为构建工具
- Vitest 作为测试框架
- React Testing Library 组件测试

## 状态管理

- 优先使用 React 内置状态（useState, useReducer）
- 跨组件状态使用 React Context
- 复杂状态逻辑提取为自定义 hook
- 避免引入外部状态管理库，除非有充分理由

## 样式方案

- CSS Modules
- 禁止内联样式（动态样式除外）
- 颜色、间距等 token 从统一的设计变量引用

## 性能

- 适当使用 React.memo、useMemo、useCallback
- 列表渲染必须有 key
- 大列表使用虚拟滚动
- 图片懒加载

## 可访问性

- 所有交互元素必须有键盘支持
- 表单元素必须有 label
- 颜色对比度符合 WCAG AA 标准

## PWA

- Service Worker 需要经过 review
- 缓存策略需要文档化
