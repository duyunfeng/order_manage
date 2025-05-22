import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/**
 * 客户详情API
 * 支持查询、更新和删除单个客户
 */
export default defineEventHandler(async event => {
  const id = event.context.params?.id
  const method = event.node.req.method

  if (!id) {
    return { code: 1, message: '缺少客户ID' }
  }

  if (method === 'GET') {
    // 查询单个客户
    const customer = await prisma.customer.findUnique({ where: { id } })
    return { code: 0, data: customer }
  }

  if (method === 'PUT') {
    // 更新客户
    const body = await readBody(event)
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    })
    return { code: 0, data: customer }
  }

  if (method === 'DELETE') {
    // 删除客户
    await prisma.customer.delete({ where: { id } })
    return { code: 0, message: '删除成功' }
  }

  return { code: 1, message: 'Method Not Allowed' }
})
