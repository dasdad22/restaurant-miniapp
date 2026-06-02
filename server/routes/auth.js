import { Router } from 'express'
import { findUserByPhone, createUser, saveCode, verifyCode } from '../db.js'
import { generateToken } from '../middleware/auth.js'

const router = Router()

// 发送验证码
router.post('/send-code', (req, res) => {
  const { phone } = req.body

  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ error: '请输入正确的手机号' })
  }

  const code = String(Math.floor(100000 + Math.random() * 900000))
  saveCode(phone, code)

  console.log(`[短信] 手机号 ${phone} 验证码: ${code}`)

  res.json({
    success: true,
    message: '验证码已发送',
    code: process.env.NODE_ENV === 'production' ? undefined : code,
  })
})

// 手机号+验证码登录/注册
router.post('/login', (req, res) => {
  const { phone, code } = req.body

  if (!phone || !code) {
    return res.status(400).json({ error: '请输入手机号和验证码' })
  }

  const result = verifyCode(phone, code)
  if (!result.valid) {
    return res.status(400).json({ error: result.error })
  }

  let user = findUserByPhone(phone)
  const isNew = !user

  if (!user) {
    user = createUser(phone)
    console.log(`[注册] 新用户 ${phone} 注册成功`)
  } else {
    console.log(`[登录] 用户 ${phone} 登录成功`)
  }

  const token = generateToken(user)

  res.json({
    success: true,
    token,
    isNew,
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name,
      avatar: user.avatar,
      points: user.points,
      membershipLevel: user.membership_level,
      totalSpent: user.total_spent,
      joinDate: user.created_at,
    },
  })
})

export default router
