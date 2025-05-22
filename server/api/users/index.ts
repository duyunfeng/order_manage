import { PrismaClient } from '@prisma/client'
import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

/**
 * 用户管理API
 * 支持用户列表获取、用户创建和用户登录
 */
export default defineEventHandler(async event => {
  const method = event.node.req.method

  if (method === 'GET') {
    // 获取查询参数
    const query = getQuery(event)
    const where: any = {}
    if (query.username) {
      where.username = { contains: query.username }
    }
    if (query.role) {
      where.role = query.role
    }
    if (query.status) {
      where.status = query.status
    }
    // 支持注册时间范围查询
    if (query.registeredAtStart && query.registeredAtEnd) {
      where.createdAt = {
        gte: new Date(query.registeredAtStart),
        lte: new Date(query.registeredAtEnd)
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
        // 不返回密码字段
      },
    })
    return { code: 0, data: users }
  }

  if (method === 'POST') {
    const body = await readBody(event)

    // 检查是否为登录请求
    if (body.action === 'login') {
      return await handleLogin(body)
    }

    // 创建用户
    // 检查用户名是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username: body.username },
    })

    if (existingUser) {
      return { code: 1, message: '用户名已存在' }
    }

    // 密码加密
    const hashedPassword = await hash(body.password, 10)

    const user = await prisma.user.create({
      data: {
        ...body,
        id: body.id || `USER_${Date.now()}`, // 如果没有提供ID，则自动生成
        password: hashedPassword,
        role: body.role || 'user', // 默认角色
        status: body.status || 'active', // 默认状态
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
        // 不返回密码字段
      },
    })

    return { code: 0, data: user }
  }

  // 其他方法不支持
  return { code: 1, message: 'Method Not Allowed' }
})

/**
 * 处理用户登录
 * @param {Object} body 登录信息
 * @returns {Object} 登录结果
 */
async function handleLogin(body) {
  const { username, password } = body

  if (!username || !password) {
    return { code: 1, message: '用户名和密码不能为空' }
  }

  // 查找用户
  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    return { code: 1, message: '用户不存在' }
  }

  // 检查用户状态
  if (user.status !== 'active') {
    return { code: 1, message: '用户已被禁用' }
  }

  // 验证密码
  const isPasswordValid = await compare(password, user.password)

  if (!isPasswordValid) {
    return { code: 1, message: '密码错误' }
  }

  // 生成JWT令牌
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET || 'order_manage_secret_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  )

  return {
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
  }
}
