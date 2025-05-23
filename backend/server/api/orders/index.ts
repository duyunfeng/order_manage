import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async event => {
  const method = event.node.req.method

  if (method === 'GET') {
    // 获取订单列表
    const orders = await prisma.order.findMany()
    return { code: 0, data: orders }
  }

  if (method === 'POST') {
    // 创建订单
    const body = await readBody(event)
    const order = await prisma.order.create({
      data: {
        ...body,
        id: body.id || `ORDER_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
    return { code: 0, data: order }
  }

  // 其他方法不支持
  return { code: 1, message: 'Method Not Allowed' }
})
