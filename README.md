# Nuxt Minimal Starter

本项目基于 Nuxt 3 + TypeScript，已集成 Element Plus、Pinia、Axios、ESLint、Prettier、Vitest、Cypress 等主流工具。

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 生产构建与预览

```bash
pnpm build
pnpm preview
```

## 环境变量

在根目录下创建 `.env` 文件，参考 `.env.example`，用于配置不同环境的变量，例如：

```env
API_BASE_URL=https://api.example.com
```

## 目录结构建议

- `components/`：全局/局部组件
- `pages/`：页面文件
- `store/`：Pinia 状态管理
- `composables/`：组合式函数
- `utils/`：工具函数
- `plugins/`：Nuxt 插件

## 代码规范与测试

- 格式化代码：
  ```bash
  pnpm format
  ```
- 代码检查：
  ```bash
  pnpm lint
  ```
- 单元测试：
  ```bash
  pnpm test
  ```

## 推荐：Git Hooks 自动化

建议集成 [lint-staged](https://github.com/okonet/lint-staged) 和 [husky](https://github.com/typicode/husky)，实现提交前自动格式化和 lint。

安装依赖：

```bash
pnpm add -D lint-staged husky
```

初始化 husky 并添加 pre-commit 钩子：

```bash
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

在 `package.json` 增加 lint-staged 配置：

```json
"lint-staged": {
  "*.{js,ts,vue}": ["eslint --fix", "prettier --write"]
}
```

## 参考文档

- [Nuxt 官方文档](https://nuxt.com/docs/getting-started/introduction)
