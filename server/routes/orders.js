import { Router } from 'express'
import { findUserById, updateUser, createOrder, findOrdersByUserId, findOrderByIdAndUser } from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// 获取用户信息
router.get('/profile', authMiddleware, (req, res) => {
  const user = findUserById(req.user.id)
  if (!user) {
    return res.status(404).json({ error: '用户不存在' })
  }

  res.json({
    id: user.id,
    phone: user.phone,
    name: user.name,
    avatar: user.avatar,
    points: user.points,
    membershipLevel: user.membership_level,
    totalSpent: user.total_spent,
    joinDate: user.created_at,
  })
})

// 创建订单
router.post('/', authMiddleware, (req, res) => {
  const { items, total, discount, finalTotal, pointsEarned, pointsUsed, tableNumber, remark } = req.body

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: '请添加菜品' })
  }

  const orderId = 'ORD' + Date.now().toString(36).toUpperCase()

  createOrder({
    id: orderId,
    user_id: req.user.id,
    items: JSON.stringify(items),
    total,
    discount: discount || 0,
    final_total: finalTotal,
    points_earned: pointsEarned || 0,
    points_used: pointsUsed || 0,
    status: 'confirmed',
    table_number: tableNumber || null,
    remark: remark || null,
    created_at: new Date().toISOString(),
  })

  // 更新用户积分和消费
  const user = findUserById(req.user.id)
  const newPoints = user.points - (pointsUsed || 0) + (pointsEarned || 0)
  const newTotalSpent = user.total_spent + finalTotal

  let membershipLevel = user.membership_level
  if (newTotalSpent >= 10000) membershipLevel = '钻石会员'
  else if (newTotalSpent >= 5000) membershipLevel = '金卡会员'
  else if (newTotalSpent >= 2000) membershipLevel = '银卡会员'

  updateUser(req.user.id, {
    points: newPoints,
    total_spent: newTotalSpent,
    membership_level: membershipLevel,
  })

  console.log(`[订单] 用户${user.phone} 下单 ${orderId} 金额¥${finalTotal}`)

  res.json({
    success: true,
    order: {
      id: orderId,
      items,
      total,
      discount: discount || 0,
      finalTotal,
      pointsEarned: pointsEarned || 0,
      pointsUsed: pointsUsed || 0,
      status: 'confirmed',
      tableNumber: tableNumber || null,
      remark: remark || null,
    },
    user: {
      points: newPoints,
      membershipLevel,
      totalSpent: newTotalSpent,
    },
  })
})

// 获取订单列表
router.get('/', authMiddleware, (req, res) => {
  const orders = findOrdersByUserId(req.user.id)

  const result = orders.map(order => ({
    id: order.id,
    user_id: order.user_id,
    items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
    total: order.total,
    discount: order.discount || 0,
    finalTotal: order.final_total,
    pointsEarned: order.points_earned || 0,
    pointsUsed: order.points_used || 0,
    status: order.status,
    tableNumber: order.table_number,
    remark: order.remark,
    createdAt: order.created_at,
  }))

  res.json({ orders: result })
})

// 获取单个订单
router.get('/:id', authMiddleware, (req, res) => {
  const order = findOrderByIdAndUser(req.params.id, req.user.id)

  if (!order) {
    return res.status(404).json({ error: '订单不存在' })
  }

  res.json({
    id: order.id,
    user_id: order.user_id,
    items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
    total: order.total,
    discount: order.discount || 0,
    finalTotal: order.final_total,
    pointsEarned: order.points_earned || 0,
    pointsUsed: order.points_used || 0,
    status: order.status,
    tableNumber: order.table_number,
    remark: order.remark,
    createdAt: order.created_at,
  })
})

export default router
