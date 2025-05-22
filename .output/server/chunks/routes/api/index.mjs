import { c as defineEventHandler, r as readBody } from '../../_/nitro.mjs';
import { PrismaClient } from '@prisma/client';
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
const index = defineEventHandler(async (event) => {
  const method = event.node.req.method;
  if (method === "GET") {
    const customers = await prisma.customer.findMany();
    return { code: 0, data: customers };
  }
  if (method === "POST") {
    const body = await readBody(event);
    const customer = await prisma.customer.create({
      data: {
        ...body,
        id: body.id || `CUS_${Date.now()}`,
        // 如果没有提供ID，则自动生成
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    return { code: 0, data: customer };
  }
  return { code: 1, message: "Method Not Allowed" };
});

export { index as default };
//# sourceMappingURL=index.mjs.map
