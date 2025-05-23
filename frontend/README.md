# Order Manage 前端

本项目为前端部分，基于 Vite + Vue3 + Element Plus + Pinia + Vue Router。

## 目录结构

```
frontend/
├── assets/           # 静态资源
├── components/       # 组件
├── composables/      # 组合式函数
├── layouts/          # 布局组件
├── pages/            # 页面组件
├── plugins/          # 插件
├── public/           # 静态公开资源
├── store/            # 状态管理
├── utils/            # 工具函数
├── mock/             # mock 数据
├── types/            # 类型声明（可选）
├── tests/            # 单元测试（可选）
├── app.vue           # 应用主入口
├── main.ts           # 入口文件
├── router/           # 路由配置
├── package.json      # 依赖与脚本
├── vite.config.ts    # Vite 配置
├── tsconfig.json     # TS 配置
├── .prettierrc       # Prettier 配置
├── eslint.config.js  # ESLint 配置
├── README.md         # 说明文档
```

## 快速开始

```bash
pnpm install
pnpm run dev
```

## 生产构建

```bash
pnpm run build
```

## 环境变量

- `.env` 用于本地开发环境，`.env.production` 用于生产环境。
- 主要变量：
  - `VITE_API_BASE_URL`：API 基础地址，axios 会自动读取。
- 示例见 `.env.example`。

## 说明

- 路由请在 `router/routes.ts` 中配置，已内置 404 页面。
- 页面组件请放在 `pages/` 目录下。
- 环境变量请在 `.env` 文件中配置，如 `VITE_API_BASE_URL=/api`。
- TypeScript 配置已完善，详见 `tsconfig.json`。
- 单元测试配置见 `vitest.config.ts`，测试文件建议放在 `tests/` 目录。
- 其他配置请参考 Vite 官方文档。
