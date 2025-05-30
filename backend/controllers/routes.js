import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()

// 获取所有路由
export async function listRoutes(req, res) {
  const routes = await prisma.route.findMany({ orderBy: { index: 'asc' } })
  res.json({ code: 0, data: routes })
}

// 添加路由
export async function addRoute(req, res) {
  try {
    const { path, name, title, icon, parentId, index, show } = req.body
    const route = await prisma.route.create({ data: { path, name, title, icon, parentId, index, show } })
    res.json({ code: 0, data: route })
  } catch (e) {
    res.status(500).json({ code: 1, msg: '添加失败', error: e.message })
  }
}

// 编辑路由
export async function updateRoute(req, res) {
  try {
    const { id } = req.params
    const { path, name, title, icon, parentId, index, show } = req.body
    const route = await prisma.route.update({ where: { id }, data: { path, name, title, icon, parentId, index, show } })
    res.json({ code: 0, data: route })
  } catch (e) {
    res.status(500).json({ code: 1, msg: '编辑失败', error: e.message })
  }
}

// 删除路由
export async function deleteRoute(req, res) {
  try {
    const { id } = req.params
    await prisma.route.delete({ where: { id } })
    res.json({ code: 0, message: '删除成功' })
  } catch (e) {
    res.status(500).json({ code: 1, msg: '删除失败', error: e.message })
  }
} 