import pkg from '@prisma/client'
import { connect } from 'http2'
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
        factories: true
      }
    })
  ])
  res.json({ code: 0, data: goods, total })
}

export async function createGood(req, res) {
  const {
    name, product_id, tw_id, price, priceCurrency, factory_price,
    spec, unit, spec_color, image, status, factories = []
  } = req.body
  const id = req.body.id || `GOOD_${Date.now()}`;
  const data = {
    id,
    name, product_id, tw_id, price, priceCurrency, factory_price,
    spec, unit, spec_color, image, status,
    createdAt: new Date(),
    updatedAt: new Date(),
    factories: { connect: factories.map(id => ({ id })) },
  };
  console.log('data:', data);
  const good = await prisma.good.create({ data }, { include: { factories: true } });
  console.log('创建后返回:', good);
  res.json({ code: 0, data: good })
}

export async function getGoodById(req, res) {
  const good = await prisma.good.findUnique({ where: { id: req.params.id } })
  if (!good) return res.json({ code: 1, message: '商品不存在' })
  res.json({ code: 0, data: good })
}

export async function updateGood(req, res) {
  const { id } = req.params
  const {
    name, product_id, tw_id, price, priceCurrency, factory_price,
    spec, unit, spec_color, image, status, factories = []
  } = req.body
  const data = {
    name, product_id, tw_id, price, priceCurrency, factory_price,
    spec, unit, spec_color, image, status,
    factories: { connect: factories.map(id => ({ id })) }
  }
  console.log('data:', data);
  const good = await prisma.good.update({
    where: { id },
    data,
    include: { factories: true }
  })
  console.log('更新后返回:', good);
  res.json({ code: 0, data: good })
}

export async function deleteGood(req, res) {
  const { id } = req.params
  await prisma.good.delete({ where: { id } })
  res.json({ code: 0, message: '删除成功' })
} 