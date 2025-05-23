import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/**
 * 商品管理API
 * 支持获取商品列表和创建新商品
 */
export default defineEventHandler(async event => {
  const method = event.node.req.method

  if (method === 'GET') {
    // 获取商品列表，带出工厂信息
    const goods = await prisma.good.findMany({
      include: {
        factories: {
          include: {
            factory: true
          }
        }
      }
    })
    return { code: 0, data: goods }
  }

  if (method === 'POST') {
    // 创建商品
    const body = await readBody(event)
    const { factories, ...goodData } = body

    // 1. 创建商品
    const good = await prisma.good.create({
      data: {
        ...goodData,
        id: goodData.id || `GOOD_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    // 2. 创建商品-工厂关联
    if (factories && Array.isArray(factories) && factories.length > 0) {
      await prisma.goodFactory.createMany({
        data: factories.map((factoryId: string) => ({
          goodId: good.id,
          factoryId
        }))
      })
    }

    // 3. 返回带工厂信息的商品
    const goodWithFactories = await prisma.good.findUnique({
      where: { id: good.id },
      include: {
        factories: {
          include: {
            factory: true
          }
        }
      }
    })

    return { code: 0, data: goodWithFactories }
  }

  // 其他方法不支持
  return { code: 1, message: 'Method Not Allowed' }
})
