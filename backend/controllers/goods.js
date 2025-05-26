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
  const id = req.body.id || `GOOD_${Date.now()}`;
  const { factories, ...otherGoodData } = req.body;
  const data = { ...otherGoodData, id: id, createdAt: new Date(), updatedAt: new Date() };

  if (factories && Array.isArray(factories)) {
    data.factories = {
      create: factories.map(factoryId => ({
        factory: {
          connect: { id: factoryId }
        }
      }))
    };
  } else if (factories && Object.keys(factories).length === 0 && factories.constructor === Object) {
    // Factories is an empty object {}, do nothing or log if necessary
  } else if (typeof factories !== 'undefined'){
    // Handle cases where factories is present but not an array or empty object
    console.warn("Received factories in unexpected format during create:", factories);
    // Optionally, you might want to prevent creation or strip the factories field
    delete data.factories; // Example: strip a malformed factories field
  }

  try {
    const good = await prisma.good.create({
      data,
      include: {
        factories: {
          include: {
            factory: true
          }
        }
      }
    });
    res.json({ code: 0, data: good });
  } catch (error) {
    console.error("Error creating good:", error.message);
    res.status(500).json({ code: -1, message: "Failed to create good", error: error.message, meta: error.meta });
  }
}

export async function getGoodById(req, res) {
  const good = await prisma.good.findUnique({ where: { id: req.params.id } })
  if (!good) return res.json({ code: 1, message: '商品不存在' })
  res.json({ code: 0, data: good })
}

export async function updateGood(req, res) {
  const { id } = req.params;
  const { factories, ...otherData } = req.body;
  const data = { ...otherData, updatedAt: new Date() };

  if (typeof factories !== 'undefined') { // Check if factories field is present
    data.factories = {
      set: [], // Disconnect all existing relations
      create: (factories || []).map(factoryId => ({ // Create new relations
        factory: {
          connect: { id: factoryId }
        }
      }))
    };
  }

  try {
    const good = await prisma.good.update({
      where: { id },
      data,
      include: {
        factories: {
          include: { factory: true }
        }
      }
    });
    res.json({ code: 0, data: good });
  } catch (error) {
    console.error("Error updating good:", error.message);
    res.status(500).json({ code: -1, message: "Failed to update good", error: error.message, meta: error.meta });
  }
}

export async function deleteGood(req, res) {
  const { id } = req.params
  await prisma.good.delete({ where: { id } })
  res.json({ code: 0, message: '删除成功' })
} 