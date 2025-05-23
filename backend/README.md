# 后端服务说明

## 1. 安装依赖

```bash
pnpm install
```

## 2. 启动开发环境

```bash
pnpm dev
```

## 3. 生产构建与部署

如有构建脚本：
```bash
pnpm build
```

推荐使用 [PM2](https://pm2.keymetrics.io/) 进行进程管理：

```bash
pm install -g pm2
pm run build # 如有
pm run start # 或 pm2 start ecosystem.config.js
```

## 4. 环境变量

请在 `backend/` 目录下新建 `.env` 文件，参考如下：

```
DATABASE_URL=mysql://user:password@host:3306/dbname
PORT=3000
```

## 5. 数据库

- 使用 [Prisma](https://www.prisma.io/) 作为 ORM，连接 MySQL。
- 数据库 schema 及种子脚本位于 `prisma/` 目录。
- 初始化数据库：

```bash
pnpm prisma migrate dev
pnpm prisma db seed
```

## 6. 常见问题

- **端口冲突**：请确保 `.env` 中的端口未被占用。
- **数据库连接失败**：检查 `DATABASE_URL` 配置和数据库服务状态。

## 7. 其他

- 代码规范：建议使用 ESLint、Prettier。
- 贡献：欢迎提 issue 或 PR 参与项目改进。 