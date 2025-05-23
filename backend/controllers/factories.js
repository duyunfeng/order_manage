import pkg from '@prisma/client'
const { PrismaClient } = pkg

const prisma = new PrismaClient()

export async function listFactories(req, res) {
  const { name, contact, phone, address, email, manager, status, page = 1, pageSize = 20 } = req.query
  const where = {}
  if (name) where.name = { contains: name }
  if (contact) where.contact = { contains: contact }
  if (phone) where.phone = { contains: phone }
  if (address) where.address = { contains: address }
  if (email) where.email = { contains: email }
  if (manager) where.manager = { contains: manager }
  if (status) where.status = status
  const [total, factories] = await Promise.all([
    prisma.factory.count({ where }),
    prisma.factory.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: Number(pageSize),
      orderBy: { createdAt: 'desc' }
    })
  ])
  res.json({ code: 0, data: factories, total })
}

export async function createFactory(req, res) {
  const data = { ...req.body, createdAt: new Date(), updatedAt: new Date() }
  const factory = await prisma.factory.create({ data })
  res.json({ code: 0, data: factory })
}

export async function getFactoryById(req, res) {
  const factory = await prisma.factory.findUnique({ where: { id: req.params.id } })
  if (!factory) return res.json({ code: 1, message: '工厂不存在' })
  res.json({ code: 0, data: factory })
}

export async function updateFactory(req, res) {
  const { id } = req.params
  const data = { ...req.body, updatedAt: new Date() }
  const factory = await prisma.factory.update({ where: { id }, data })
  res.json({ code: 0, data: factory })
}

export async function deleteFactory(req, res) {
  const { id } = req.params
  await prisma.factory.delete({ where: { id } })
  res.json({ code: 0, message: '删除成功' })
} 