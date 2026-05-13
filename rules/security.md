# Security Rules

## 通用

- 禁止硬编码密钥、token 或凭证
- 用户输入必须经过验证和净化
- 外部 URL 打开必须使用 `rel="noopener noreferrer"`

## 内容安全

- 如果渲染用户提供的内容，必须做 XSS 防护
- 动态 HTML 插入必须使用 DOMPurify 或类似库
- 禁止使用 `dangerouslySetInnerHTML`，除非经过安全审查

## 依赖

- 引入新依赖前审查其安全记录和维护状态
- 定期运行 `npm audit`
- 禁止使用已知有 CVE 漏洞的版本

## 存储

- 用户数据存储（localStorage）必须考虑隐私
- 不收集或上传用户个人数据
- 如果使用 IndexedDB，确保数据隔离
