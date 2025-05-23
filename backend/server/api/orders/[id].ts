import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async event => {
  const id = event.context.params?.id
  const method = event.node.req.method

  if (!id) {
    return { code: 1, message: '缺少订单ID' }
  }

  if (method === 'GET') {
    // 查询单个订单
    const order = await prisma.order.findUnique({ where: { id } })
    return { code: 0, data: order }
  }

  if (method === 'PUT') {
    // 更新订单
    const body = await readBody(event)
    const order = await prisma.order.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    })
    return { code: 0, data: order }
  }

  if (method === 'DELETE') {
    // 删除订单
    await prisma.order.delete({ where: { id } })
    return { code: 0, message: '删除成功' }
  }

  return { code: 1, message: 'Method Not Allowed' }
})
