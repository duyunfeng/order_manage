# 前端项目说明

## 1. 安装依赖

```bash
pnpm install
```

## 2. 启动开发环境

```bash
pnpm dev
```

## 3. 生产构建

```bash
pnpm build
```

构建产物位于 `dist/` 目录，可部署到 Nginx、Apache 等静态服务器。

## 4. 自动化部署（可选）

推荐使用 GitHub Actions 自动化部署：

- 参考 `.github/workflows/deploy.yml`，推送代码到 main 分支自动构建并上传服务器。
- 需配置服务器 SSH 信息到 GitHub Secrets。

## 5. 环境变量

在 `frontend/` 目录下新建 `.env` 文件，常见配置：

```
VITE_API_BASE_URL=/api
```

## 6. API 代理

开发环境下通过 Vite 配置代理 `/api` 到后端服务，详见 `vite.config.ts`。

## 7. 常见问题

- **接口跨域**：请确保前端代理配置正确，生产环境建议 Nginx 配置反向代理。
- **构建后页面空白**：检查 `base` 配置和资源路径。

## 8. 推荐工具

- 代码规范：ESLint、Prettier
- 单元测试：Vitest

## 9. 贡献

欢迎提 issue 或 PR 参与项目改进！
