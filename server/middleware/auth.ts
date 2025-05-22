import jwt from 'jsonwebtoken'

/**
 * JWT认证中间件
 * 验证请求头中的Authorization令牌
 * 将解码后的用户信息添加到事件上下文中
 */
export default defineEventHandler(async event => {
  const path = event.node.req.url || ''
  const method = event.node.req.method || 'GET'

  // 只拦截 /api/ 开头的接口
  if (!path.startsWith('/api/')) {
    return
  }

  // 不需要认证的公共接口
  const publicPaths = [
    '/api/user', // 登录接口
    '/api/upload', // 文件上传
  ]
  const isPublicRoute = publicPaths.some(publicPath => path.startsWith(publicPath))

  if (isPublicRoute) {
    return
  }

  const authHeader = event.node.req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return createError({
      statusCode: 401,
      statusMessage: '未授权访问',
      data: { code: 401, message: '请先登录' },
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'order_manage_secret_key')
    event.context.user = decoded
  } catch (error) {
    return createError({
      statusCode: 401,
      statusMessage: '令牌无效',
      data: { code: 401, message: '登录已过期，请重新登录' },
    })
  }
})
