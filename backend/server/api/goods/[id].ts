import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/**
 * 商品详情API
 * 支持查询、更新和删除单个商品
 */
export default defineEventHandler(async event => {
  const id = event.context.params?.id
  const method = event.node.req.method

  if (!id) {
    return { code: 1, message: '缺少商品ID' }
  }

  if (method === 'GET') {
    // 查询单个商品
    const good = await prisma.good.findUnique({
      where: { id },
      include: {
        factories: {
          include: { factory: true }
        }
      }
    })
    return { code: 0, data: good }
  }

  if (method === 'PUT') {
    // 更新商品
    const body = await readBody(event)
    const { factories, ...goodData } = body
    // 1. 更新商品本身
    const good = await prisma.good.update({
      where: { id },
      data: {
        ...goodData,
        updatedAt: new Date(),
      },
    })
    // 2. 更新工厂关联
    await prisma.goodFactory.deleteMany({ where: { goodId: id } })
    if (factories && Array.isArray(factories) && factories.length > 0) {
      await prisma.goodFactory.createMany({
        data: factories.map((factoryId: string) => ({
          goodId: id,
          factoryId
        }))
      })
    }
    // 3. 返回带工厂信息的商品
    const goodWithFactories = await prisma.good.findUnique({
      where: { id },
      include: {
        factories: {
          include: { factory: true }
        }
      }
    })
    return { code: 0, data: goodWithFactories }
  }

  if (method === 'DELETE') {
    // 删除商品
    await prisma.good.delete({ where: { id } })
    return { code: 0, message: '删除成功' }
  }

  return { code: 1, message: 'Method Not Allowed' }
})
