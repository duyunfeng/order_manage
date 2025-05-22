import { c as defineEventHandler, r as readBody } from '../../../_/nitro.mjs';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'ipx';
import 'node:path';

const prisma = new PrismaClient();
const _id_ = defineEventHandler(async (event) => {
  var _a;
  const id = (_a = event.context.params) == null ? void 0 : _a.id;
  const method = event.node.req.method;
  if (!id) {
    return { code: 1, message: "\u7F3A\u5C11\u7528\u6237ID" };
  }
  if (method === "GET") {
    const user = await prisma.user.findUnique({
      where: { id },
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
    return { code: 0, data: user };
  }
  if (method === "PUT") {
    const body = await readBody(event);
    if (body.password) {
      body.password = await hash(body.password, 10);
    }
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...body,
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
  if (method === "DELETE") {
    await prisma.user.delete({ where: { id } });
    return { code: 0, message: "\u5220\u9664\u6210\u529F" };
  }
  return { code: 1, message: "Method Not Allowed" };
});

export { _id_ as default };
//# sourceMappingURL=_id_.mjs.map
