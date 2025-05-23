import pkg from '@prisma/client'
const { PrismaClient } = pkg
import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function listUsers(req, res) {
  const { username, name, email, status, role, page = 1, pageSize = 20 } = req.query
  const where = {}
  if (username) where.username = { contains: username }
  if (name) where.name = { contains: name }
  if (email) where.email = { contains: email }
  if (status) where.status = status
  if (role) where.role = role
  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: Number(pageSize),
      orderBy: { createdAt: 'desc' },
      select: { id: true, username: true, name: true, email: true, avatar: true, role: true, status: true, createdAt: true, updatedAt: true }
    })
  ])
  res.json({ code: 0, data: users, total })
}

export async function createOrLoginUser(req, res) {
  const body = req.body
  // 登录
  if (body.action === 'login') {
    const user = await prisma.user.findUnique({ where: { username: body.username } })
    if (!user) return res.json({ code: 1, message: '用户不存在' })
    if (user.status !== 'active') return res.json({ code: 1, message: '用户已被禁用' })
    const isPasswordValid = await compare(body.password, user.password)
    if (!isPasswordValid) return res.json({ code: 1, message: '密码错误' })
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'order_manage_secret_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )
    return res.json({
      code: 0,
      data: {
        token,
        user: { id: user.id, username: user.username, name: user.name, role: user.role }
      }
    })
  }
  // 注册
  const exist = await prisma.user.findUnique({ where: { username: body.username } })
  if (exist) return res.json({ code: 1, message: '用户名已存在' })
  const hashedPassword = await hash(body.password, 10)
  const user = await prisma.user.create({
    data: {
      ...body,
      password: hashedPassword,
      id: body.id || `USER_${Date.now()}`,
      status: body.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  res.json({ code: 0, data: user })
}

export async function getUserById(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: { id: true, username: true, name: true, email: true, avatar: true, role: true, status: true, createdAt: true, updatedAt: true }
  })
  if (!user) return res.json({ code: 1, message: '用户不存在' })
  res.json({ code: 0, data: user })
}

export async function updateUser(req, res) {
  const { id } = req.params
  const data = { ...req.body, updatedAt: new Date() }
  if (data.password) {
    data.password = await hash(data.password, 10)
  }
  const user = await prisma.user.update({ where: { id }, data })
  res.json({ code: 0, data: user })
}

export async function deleteUser(req, res) {
  const { id } = req.params
  await prisma.user.delete({ where: { id } })
  res.json({ code: 0, message: '删除成功' })
} 