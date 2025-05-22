import { c as defineEventHandler, g as getQuery, r as readBody } from '../../_/nitro.mjs';
import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'ipx';
import 'node:path';

const prisma = new PrismaClient();
const index = defineEventHandler(async (event) => {
  const method = event.node.req.method;
  if (method === "GET") {
    const query = getQuery(event);
    const where = {};
    if (query.username) {
      where.username = { contains: query.username };
    }
    if (query.role) {
      where.role = query.role;
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.registeredAtStart && query.registeredAtEnd) {
      where.createdAt = {
        gte: new Date(query.registeredAtStart),
        lte: new Date(query.registeredAtEnd)
      };
    }
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        avatar: true
        // 不返回密码字段
      }
    });
    return { code: 0, data: users };
  }
  if (method === "POST") {
    const body = await readBody(event);
    if (body.action === "login") {
      return await handleLogin(body);
    }
    const existingUser = await prisma.user.findUnique({
      where: { username: body.username }
    });
    if (existingUser) {
      return { code: 1, message: "\u7528\u6237\u540D\u5DF2\u5B58\u5728" };
    }
    const hashedPassword = await hash(body.password, 10);
    const user = await prisma.user.create({
      data: {
        ...body,
        id: body.id || `USER_${Date.now()}`,
        // 如果没有提供ID，则自动生成
        password: hashedPassword,
        role: body.role || "user",
        // 默认角色
        status: body.status || "active",
        // 默认状态
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
        // 不返回密码字段
      }
    });
    return { code: 0, data: user };
  }
  return { code: 1, message: "Method Not Allowed" };
});
async function handleLogin(body) {
  const { username, password } = body;
  if (!username || !password) {
    return { code: 1, message: "\u7528\u6237\u540D\u548C\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A" };
  }
  const user = await prisma.user.findUnique({
    where: { username }
  });
  if (!user) {
    return { code: 1, message: "\u7528\u6237\u4E0D\u5B58\u5728" };
  }
  if (user.status !== "active") {
    return { code: 1, message: "\u7528\u6237\u5DF2\u88AB\u7981\u7528" };
  }
  const isPasswordValid = await compare(password, user.password);
  if (!isPasswordValid) {
    return { code: 1, message: "\u5BC6\u7801\u9519\u8BEF" };
  }
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    process.env.JWT_SECRET || "order_manage_secret_key",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
  return {
    code: 0,
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    }
  };
}

export { index as default };
//# sourceMappingURL=index6.mjs.map
