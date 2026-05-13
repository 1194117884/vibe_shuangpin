# Coding Rules

## TypeScript

- 使用 strict 模式，禁用 `strict: false` 覆盖
- 禁止 `any` 类型；使用 `unknown` 替代
- 禁止 `@ts-ignore`、`@ts-expect-error`、`@ts-nocheck`
- 函数和方法必须有显式返回类型
- 导出类型必须有意义命名，避免导出匿名类型
- 使用 `interface` 定义对象类型，使用 `type` 定义联合/交叉类型

## 命名规范

- 组件：PascalCase — `UserAvatar.tsx`
- Hook：camelCase 以 `use` 开头 — `usePinyin.ts`
- 工具函数：camelCase — `formatPinyin.ts`
- 常量/枚举：PascalCase — `PinyinScheme.ts`
- CSS 类名：kebab-case
- 文件命名与导出内容一致

## React

- 一个文件一个主要组件
- Props 类型定义为 `{Name}Props`
- 避免 `useEffect` 依赖链；优先使用派生状态或事件驱动
- 禁止在渲染函数中定义组件
- 组件保持纯函数；副作用隔离在 hooks 或事件处理器中

## 代码质量

- 函数不超过 80 行
- 组件不超过 300 行
- 禁止 magic number / string — 使用常量或枚举
- 禁止循环依赖 — 保持单向数据流
