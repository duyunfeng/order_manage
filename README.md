
---

## 快速开始

### 1. 安装依赖

分别安装前后端依赖：

```bash
cd frontend
pnpm install

cd ../backend
pnpm install
```

### 2. 启动开发环境

分别启动前后端：

```bash
# 启动前端
cd frontend
pnpm dev

# 启动后端
cd ../backend
pnpm dev
```

### 3. 生产构建

前端：

```bash
cd frontend
pnpm build
```

后端（如有构建脚本）：

```bash
cd backend
pnpm build
```

---

## 其他说明

- **API 代理**：前端开发时通过 Vite 配置代理 `/api` 到后端服务端口。
- **数据库**：后端使用 Prisma 连接 MySQL，相关 schema 和 seed 脚本在 `backend/prisma/`。
- **环境变量**：前后端分别维护各自的 `.env` 文件。

---

## 推荐工具

- 代码规范：ESLint、Prettier
- 单元测试：Vitest（前端）
- 进程管理：PM2（后端，见 `ecosystem.config.js`）

---

## 贡献

欢迎提 issue 或 PR 参与项目改进！
