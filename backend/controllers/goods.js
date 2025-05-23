import pkg from '@prisma/client'
const { PrismaClient } = pkg

const prisma = new PrismaClient()

export async function listGoods(req, res) {
  const { name, code, category, status, page = 1, pageSize = 20 } = req.query
  const where = {}
  if (name) where.name = { contains: name }
  if (code) where.code = { contains: code }
  if (category) where.category = { contains: category }
  if (status) where.status = status
  const [total, goods] = await Promise.all([
    prisma.good.count({ where }),
    prisma.good.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: Number(pageSize),
      orderBy: { createdAt: 'desc' },
      include: {
        factories: {
          include: {
            factory: true
          }
        }
      }
    })
  ])
  res.json({ code: 0, data: goods, total })
}

export async function createGood(req, res) {
  const data = { ...req.body, createdAt: new Date(), updatedAt: new Date() }
  const good = await prisma.good.create({ data })
  res.json({ code: 0, data: good })
}

export async function getGoodById(req, res) {
  const good = await prisma.good.findUnique({ where: { id: req.params.id } })
  if (!good) return res.json({ code: 1, message: '商品不存在' })
  res.json({ code: 0, data: good })
}

export async function updateGood(req, res) {
  const { id } = req.params
  const { factories, ...otherData } = req.body
  const data = { ...otherData, updatedAt: new Date() }

  if (factories) {
    data.factories = {
      set: factories.map(factoryId => ({ factoryId })),
    }
  }

  const good = await prisma.good.update({
    where: { id },
    data,
    include: {
      factories: {
        include: { factory: true }
      }
    }
  })
  res.json({ code: 0, data: good })
}

export async function deleteGood(req, res) {
  const { id } = req.params
  await prisma.good.delete({ where: { id } })
  res.json({ code: 0, message: '删除成功' })
} 