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
    const goods = await prisma.good.findMany({
      include: {
        factories: {
          include: {
            factory: true
          }
        }
      }
    });
    return { code: 0, data: goods };
  }
  if (method === "POST") {
    const body = await readBody(event);
    const { factories, ...goodData } = body;
    const good = await prisma.good.create({
      data: {
        ...goodData,
        id: goodData.id || `GOOD_${Date.now()}`,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    if (factories && Array.isArray(factories) && factories.length > 0) {
      await prisma.goodFactory.createMany({
        data: factories.map((factoryId) => ({
          goodId: good.id,
          factoryId
        }))
      });
    }
    const goodWithFactories = await prisma.good.findUnique({
      where: { id: good.id },
      include: {
        factories: {
          include: {
            factory: true
          }
        }
      }
    });
    return { code: 0, data: goodWithFactories };
  }
  return { code: 1, message: "Method Not Allowed" };
});

export { index as default };
//# sourceMappingURL=index3.mjs.map
