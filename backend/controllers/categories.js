import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()

// 获取所有类目
export async function listCategories(req, res) {
  const categories = await prisma.category.findMany({ orderBy: { createdAt: 'desc' } })
  res.json({ code: 0, data: categories })
}

// 添加类目
export async function addCategory(req, res) {
  try {
    const { name, description } = req.body
    const category = await prisma.category.create({ data: { name, description, createdAt: new Date(), updatedAt: new Date() } })
    res.json({ code: 0, data: category })
  } catch (e) {
    res.status(500).json({ code: 1, msg: '添加失败', error: e.message })
  }
}

// 编辑类目
export async function updateCategory(req, res) {
  try {
    const { id } = req.params
    const { name, description } = req.body
    const category = await prisma.category.update({ where: { id }, data: { name, description, updatedAt: new Date() } })
    res.json({ code: 0, data: category })
  } catch (e) {
    res.status(500).json({ code: 1, msg: '编辑失败', error: e.message })
  }
}

// 删除类目
export async function deleteCategory(req, res) {
  try {
    const { id } = req.params
    await prisma.category.delete({ where: { id } })
    res.json({ code: 0, message: '删除成功' })
  } catch (e) {
    res.status(500).json({ code: 1, msg: '删除失败', error: e.message })
  }
} 