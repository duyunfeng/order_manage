import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ code: 401, message: '未登录' })
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'order_manage_secret_key')
    req.user = user
    next()
  } catch (e) {
    res.status(401).json({ code: 401, message: '登录已过期' })
  }
}

// 只允许admin或本人
export function canEditUser(req, res, next) {
  const { id } = req.params
  if (req.user.role === 'admin' || req.user.id === id) {
    return next()
  }
  return res.status(403).json({ code: 403, message: '无权限修改他人信息' })
}

// 只允许前端调用（通过X-Requested-With校验）
export function onlyFrontend(req, res, next) {
  const xrw = req.headers['x-requested-with']
  if (xrw === 'XMLHttpRequest') {
    return next()
  }
  return res.status(403).json({ code: 403, message: '只允许前端调用' })
} 