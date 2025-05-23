import pkg from '@prisma/client'
const { PrismaClient } = pkg

const prisma = new PrismaClient()

export async function listCustomers(req, res) {
  const { name, contact, phone, address, email, status, page = 1, pageSize = 20 } = req.query
  const where = {}
  if (name) where.name = { contains: name }
  if (contact) where.contact = { contains: contact }
  if (phone) where.phone = { contains: phone }
  if (address) where.address = { contains: address }
  if (email) where.email = { contains: email }
  if (status) where.status = status
  const [total, customers] = await Promise.all([
    prisma.customer.count({ where }),
    prisma.customer.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: Number(pageSize),
      orderBy: { createdAt: 'desc' }
    })
  ])
  res.json({ code: 0, data: customers, total })
}

export async function createCustomer(req, res) {
  const data = { ...req.body, createdAt: new Date(), updatedAt: new Date() }
  const customer = await prisma.customer.create({ data })
  res.json({ code: 0, data: customer })
}

export async function getCustomerById(req, res) {
  const customer = await prisma.customer.findUnique({ where: { id: req.params.id } })
  if (!customer) return res.json({ code: 1, message: '客户不存在' })
  res.json({ code: 0, data: customer })
}

export async function updateCustomer(req, res) {
  const { id } = req.params
  const data = { ...req.body, updatedAt: new Date() }
  const customer = await prisma.customer.update({ where: { id }, data })
  res.json({ code: 0, data: customer })
}

export async function deleteCustomer(req, res) {
  const { id } = req.params
  await prisma.customer.delete({ where: { id } })
  res.json({ code: 0, message: '删除成功' })
} 