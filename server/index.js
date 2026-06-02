import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import orderRoutes from './routes/orders.js'

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`\n🍽️  餐厅后端服务已启动`)
  console.log(`📍 API 地址: http://localhost:${PORT}`)
  console.log(`📱 短信验证码: 开发模式，验证码会返回在响应中\n`)
})
