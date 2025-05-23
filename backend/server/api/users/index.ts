import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const router = Router()

/**
 * 用户管理API
 * 支持用户列表获取、用户创建和用户登录
 */

// 用户列表获取
router.get('/', async (req, res) => {
  const { username, role, status, registeredAtStart, registeredAtEnd } = req.query
  const where: any = {}
  if (username) where.username = { contains: username as string }
  if (role) where.role = role
  if (status) where.status = status
  if (registeredAtStart && registeredAtEnd) {
    where.createdAt = {
      gte: new Date(registeredAtStart as string),
      lte: new Date(registeredAtEnd as string)
    }
  }
  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      avatar: true,
    },
  })
  res.json({ code: 0, data: users })
})

// 用户创建和登录
router.post('/', async (req, res) => {
  const body = req.body
  // 登录
  if (body.action === 'login') {
    return handleLogin(body, res)
  }
  // 创建用户
  const existingUser = await prisma.user.findUnique({ where: { username: body.username } })
  if (existingUser) {
    return res.json({ code: 1, message: '用户名已存在' })
  }
  const hashedPassword = await hash(body.password, 10)
  const user = await prisma.user.create({
    data: {
      ...body,
      id: body.id || `USER_${Date.now()}`,
      password: hashedPassword,
      role: body.role || 'user',
      status: body.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  res.json({ code: 0, data: user })
})

/**
 * 处理用户登录
 * @param {Object} body 登录信息
 * @returns {Object} 登录结果
 */
async function handleLogin(body, res) {
  const { username, password } = body
  if (!username || !password) {
    return res.json({ code: 1, message: '用户名和密码不能为空' })
  }
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) {
    return res.json({ code: 1, message: '用户不存在' })
  }
  if (user.status !== 'active') {
    return res.json({ code: 1, message: '用户已被禁用' })
  }
  const isPasswordValid = await compare(password, user.password)
  if (!isPasswordValid) {
    return res.json({ code: 1, message: '密码错误' })
  }
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET || 'order_manage_secret_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  )
  return res.json({
    code: 0,
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    },
  })
}

export default router
