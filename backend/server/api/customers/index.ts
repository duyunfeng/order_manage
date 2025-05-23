import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/**
 * 客户管理API
 * 支持获取客户列表和创建新客户
 */
export default defineEventHandler(async event => {
  const method = event.node.req.method

  if (method === 'GET') {
    // 获取客户列表
    const customers = await prisma.customer.findMany()
    return { code: 0, data: customers }
  }

  if (method === 'POST') {
    // 创建客户
    const body = await readBody(event)
    const customer = await prisma.customer.create({
      data: {
        ...body,
        id: body.id || `CUS_${Date.now()}`, // 如果没有提供ID，则自动生成
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
    return { code: 0, data: customer }
  }

  // 其他方法不支持
  return { code: 1, message: 'Method Not Allowed' }
})
