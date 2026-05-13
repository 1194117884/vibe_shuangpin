# Conventions

> 记录开发过程中建立的惯例和风格选择。

## Git

- 分支命名: `feature/{short-description}`、`fix/{short-description}`
- 提交信息: 中文描述，简明扼要

## 代码风格

- 使用 2 空格缩进
- 行尾不加分号
- 文件末尾保留一个空行

## 组件

- 页面级组件放在 `src/features/` 下
- 通用组件放在 `src/components/` 下
- 每个组件一个目录，包含样式和测试
