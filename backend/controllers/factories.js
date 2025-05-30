import pkg from '@prisma/client'
const { PrismaClient } = pkg

const prisma = new PrismaClient()

export async function listFactories(req, res) {
  const { name, contact, phone, address, email, manager, status, mainCategories, page = 1, pageSize = 20 } = req.query
  const where = {}
  if (name) where.name = { contains: name }
  if (contact) where.contact = { contains: contact }
  if (phone) where.phone = { contains: phone }
  if (address) where.address = { contains: address }
  if (email) where.email = { contains: email }
  if (manager) where.manager = { contains: manager }
  if (status) where.status = status
  if (mainCategories) where.mainCategories = { some: { id: { in: Array.isArray(mainCategories) ? mainCategories : [mainCategories] } } }
  const [total, factories] = await Promise.all([
    prisma.factory.count({ where }),
    prisma.factory.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: Number(pageSize),
      orderBy: { createdAt: 'desc' },
      include: { mainCategories: true },
    })
  ])
  res.json({ code: 0, data: factories, total })
}

export async function createFactory(req, res) {
  try {
    const id = req.body.id || `FACTORY_${Date.now()}`;
    const data = { ...req.body, id, createdAt: new Date(), updatedAt: new Date() };
    const factory = await prisma.factory.create({ data });
    res.json({ code: 0, data: factory });
  } catch (error) {
    console.error("Error creating factory:", error);
    res.status(500).json({ code: -1, message: "Failed to create factory", error: error.message });
  }
}

export async function getFactoryById(req, res) {
  const factory = await prisma.factory.findUnique({ where: { id: req.params.id } })
  if (!factory) return res.json({ code: 1, message: '工厂不存在' })
  res.json({ code: 0, data: factory })
}

export async function updateFactory(req, res) {
  try {
    const { id } = req.params
    const { name, contact, phone, address, email, manager, status, mainCategories = [] } = req.body
    const factory = await prisma.factory.update({
      where: { id },
      data: {
        name, contact, phone, address, email, manager, status,
        mainCategories: {
          set: mainCategories.map(id => ({ id }))
        }
      },
      include: { mainCategories: true },
    })
    res.json({ code: 0, data: factory })
  } catch (e) {
    res.status(500).json({ code: 1, msg: '编辑失败', error: e.message })
  }
}

export async function deleteFactory(req, res) {
  const { id } = req.params
  await prisma.factory.delete({ where: { id } })
  res.json({ code: 0, message: '删除成功' })
}

export async function addFactory(req, res) {
  try {
    const { name, contact, phone, address, email, manager, status, mainCategories = [] } = req.body
    const factory = await prisma.factory.create({
      data: {
        name, contact, phone, address, email, manager, status,
        mainCategories: {
          connect: mainCategories.map(id => ({ id }))
        }
      },
      include: { mainCategories: true },
    })
    res.json({ code: 0, data: factory })
  } catch (e) {
    res.status(500).json({ code: 1, msg: '添加失败', error: e.message })
  }
} 