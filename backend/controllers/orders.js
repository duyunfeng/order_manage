import pkg from '@prisma/client'
const { PrismaClient } = pkg

const prisma = new PrismaClient()

export async function listOrders(req, res) {
  const { customerId, status, page = 1, pageSize = 20 } = req.query
  const where = {}
  if (customerId) where.customerId = customerId
  if (status) where.status = status
  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: Number(pageSize),
      orderBy: { createdAt: 'desc' }
    })
  ])
  res.json({ code: 0, data: orders, total })
}

export async function createOrder(req, res) {
  const id = req.body.id || `ORDER_${Date.now()}`;
  const data = { ...req.body, id, createdAt: new Date(), updatedAt: new Date() };
  const order = await prisma.order.create({ data })
  res.json({ code: 0, data: order })
}

export async function getOrderById(req, res) {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } })
  if (!order) return res.json({ code: 1, message: '订单不存在' })
  res.json({ code: 0, data: order })
}

export async function updateOrder(req, res) {
  const { id } = req.params
  const data = { ...req.body, updatedAt: new Date() }
  const order = await prisma.order.update({ where: { id }, data })
  res.json({ code: 0, data: order })
}

export async function deleteOrder(req, res) {
  const { id } = req.params
  await prisma.order.delete({ where: { id } })
  res.json({ code: 0, message: '删除成功' })
} 