import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

/**
 * 用户详情API
 * 支持查询、更新和删除单个用户
 */
export default defineEventHandler(async event => {
  const id = event.context.params?.id
  const method = event.node.req.method

  if (!id) {
    return { code: 1, message: '缺少用户ID' }
  }

  if (method === 'GET') {
    // 查询单个用户
    const user = await prisma.user.findUnique({
      where: { id },
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
    return { code: 0, data: user }
  }

  if (method === 'PUT') {
    // 更新用户
    const body = await readBody(event)

    // 如果更新包含密码，需要加密
    if (body.password) {
      body.password = await hash(body.password, 10)
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...body,
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

  if (method === 'DELETE') {
    // 删除用户
    await prisma.user.delete({ where: { id } })
    return { code: 0, message: '删除成功' }
  }

  return { code: 1, message: 'Method Not Allowed' }
})
