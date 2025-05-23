import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/**
 * 工厂管理API
 * 支持获取工厂列表和创建新工厂
 */
export default defineEventHandler(async event => {
  const method = event.node.req.method

  if (method === 'GET') {
    // 获取工厂列表
    const factories = await prisma.factory.findMany()
    return { code: 0, data: factories }
  }

  if (method === 'POST') {
    // 创建工厂
    const body = await readBody(event)
    const factory = await prisma.factory.create({
      data: {
        ...body,
        id: body.id || `FAC_${Date.now()}`, // 如果没有提供ID，则自动生成
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
    return { code: 0, data: factory }
  }

  // 其他方法不支持
  return { code: 1, message: 'Method Not Allowed' }
})
