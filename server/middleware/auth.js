import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'restaurant-secret-key-2024'

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, phone: user.phone },
    JWT_SECRET,
    { expiresIn: '30d' }
  )
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '请先登录' })
  }

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: '登录已过期，请重新登录' })
  }
}
