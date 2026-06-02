import { useState } from 'react'
import { useStore } from '../store/useStore'
import { dishes, categories, getDishById } from '../data/menu'
import { Order } from '../types'

interface Props {
  onBack: () => void
}

type AdminTab = 'orders' | 'menu' | 'coupons' | 'analytics'

export default function AdminPage({ onBack }: Props) {
  const [tab, setTab] = useState<AdminTab>('orders')
  const [pin, setPin] = useState('')
  const [authorized, setAuthorized] = useState(false)
  const orders = useStore(s => s.orders)
  const updateOrderStatus = useStore(s => s.updateOrderStatus)

  // Simple PIN: 8888
  const handleLogin = () => {
    if (pin === '8888') setAuthorized(true)
    else alert('密码错误（默认: 8888）')
  }

  if (!authorized) {
    return (
      <div className="h-full flex flex-col bg-white">
        <header className="bg-white px-5 pt-10 pb-3 flex-shrink-0 border-b border-gray-100 flex items-center gap-3">
          <button onClick={onBack} className="text-gray-500 text-lg">←</button>
          <h1 className="text-lg font-bold text-gray-800">🔐 商家管理</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-lg font-semibold mb-4">请输入管理密码</h2>
          <input
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value)}
            placeholder="输入管理密码"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center text-lg tracking-widest outline-none focus:border-primary mb-3"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} className="w-full bg-primary text-white py-3 rounded-xl font-semibold">进入后台</button>
          <p className="text-xs text-gray-400 mt-3">默认密码: 8888</p>
        </div>
      </div>
    )
  }

  const tabs: { key: AdminTab; label: string; icon: string }[] = [
    { key: 'orders', label: '订单', icon: '📋' },
    { key: 'menu', label: '菜单', icon: '🍽️' },
    { key: 'coupons', label: '优惠券', icon: '🎫' },
    { key: 'analytics', label: '数据', icon: '📊' },
  ]

  const statusLabels: Record<string, string> = { pending: '待确认', confirmed: '已确认', preparing: '制作中', ready: '待上菜', served: '已上菜', completed: '已完成', cancelled: '已取消' }
  const nextStatus: Record<string, string> = { confirmed: 'preparing', preparing: 'ready', ready: 'served', served: 'completed' }
  const nextStatusLabel: Record<string, string> = { confirmed: '开始制作', preparing: '制作完成', ready: '已上菜', served: '完成订单' }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <header className="bg-white px-5 pt-10 pb-3 flex-shrink-0 border-b border-gray-100 flex items-center gap-3">
        <button onClick={onBack} className="text-gray-500 text-lg">←</button>
        <h1 className="text-lg font-bold text-gray-800">🏪 商家管理后台</h1>
      </header>

      {/* Tab Bar */}
      <div className="bg-white flex-shrink-0 border-b border-gray-100">
        <div className="flex">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key ? 'border-primary text-primary' : 'border-transparent text-gray-400'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ===== 订单管理 ===== */}
        {tab === 'orders' && (
          <div className="p-3 space-y-2">
            {orders.length === 0 ? (
              <div className="text-center text-gray-400 py-20">暂无订单</div>
            ) : (
              orders.map(order => {
                const next = nextStatus[order.status]
                return (
                  <div key={order.id} className="bg-white rounded-xl p-3 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400">{order.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'cancelled' ? 'bg-gray-100 text-gray-500' :
                        'bg-blue-100 text-blue-700'
                      }`}>{statusLabels[order.status]}</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {order.items.length}个菜品 · ¥{order.finalTotal}
                      {order.tableNumber && ` · ${order.tableNumber}号桌`}
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {order.items.map(item => {
                        const d = getDishById(item.dishId)
                        return d ? <span key={item.dishId} className="text-xs bg-gray-50 px-2 py-1 rounded">{d.name}×{item.quantity}</span> : null
                      })}
                    </div>
                    {next && (
                      <button
                        onClick={() => updateOrderStatus(order.id, next as Order['status'])}
                        className="mt-2 w-full bg-primary/10 text-primary py-1.5 rounded-lg text-sm font-medium active:bg-primary/20"
                      >
                        {nextStatusLabel[order.status]} →
                      </button>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* ===== 菜单管理 ===== */}
        {tab === 'menu' && (
          <div className="p-3 space-y-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">共 {dishes.length} 个菜品</span>
              <button className="text-xs bg-primary text-white px-3 py-1 rounded-lg">+ 添加菜品</button>
            </div>
            {dishes.map(dish => (
              <div key={dish.id} className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm">
                <span className="text-2xl">{dish.image}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-700">{dish.name}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">¥{dish.price}</span>
                    <span className="text-xs text-gray-300">|</span>
                    <span className="text-xs text-gray-400">⭐{dish.rating}</span>
                    <span className="text-xs text-gray-300">|</span>
                    <span className="text-xs text-gray-400">售{dish.salesCount}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">编辑</button>
                  <button className="text-xs bg-red-50 text-red-400 px-2 py-1 rounded">下架</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== 优惠券管理 ===== */}
        {tab === 'coupons' && <CouponManager />}

        {/* ===== 数据分析 ===== */}
        {tab === 'analytics' && <AnalyticsDashboard orders={orders} />}
      </div>
    </div>
  )
}

function CouponManager() {
  const user = useStore(s => s.user)
  const addCoupon = useStore(s => s.addCoupon)
  const [selectedUser, setSelectedUser] = useState('')

  const templates = [
    { id: 'c_new_user', name: '新客专享券', desc: '满50减10', icon: '🎁' },
    { id: 'c_100_15', name: '满100减15', desc: '满100减15', icon: '🎫' },
    { id: 'c_200_30', name: '满200减30', desc: '满200减30', icon: '🏷️' },
    { id: 'c_85', name: '全场8.5折', desc: '无门槛8.5折', icon: '💎' },
    { id: 'c_90', name: '全场9折', desc: '无门槛9折', icon: '🎟️' },
    { id: 'c_weekend', name: '周末特惠', desc: '满80减12', icon: '🎉' },
  ]

  return (
    <div className="p-3 space-y-4">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">📱 给用户发优惠券</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={selectedUser}
            onChange={e => setSelectedUser(e.target.value)}
            placeholder="输入手机号"
            className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none"
          />
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm">发送</button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">🎫 优惠券模板</h3>
        <div className="space-y-2">
          {templates.map(t => (
            <div key={t.id} className="flex items-center gap-3 p-2">
              <span className="text-2xl">{t.icon}</span>
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">{t.name}</span>
                <span className="text-xs text-gray-400 ml-2">{t.desc}</span>
              </div>
              <button
                onClick={() => addCoupon({ id: t.id, name: t.name, type: 'full_reduction' as any, threshold: 50, reduce: 10, expireDays: 30 })}
                className="text-xs bg-primary text-white px-3 py-1 rounded-lg"
              >
                发放
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AnalyticsDashboard({ orders }: { orders: Order[] }) {
  const today = orders.filter(o => o.createdAt && new Date(o.createdAt).toDateString() === new Date().toDateString())
  const todayRevenue = today.reduce((s, o) => s + o.finalTotal, 0)
  const monthRevenue = orders.reduce((s, o) => s + o.finalTotal, 0)

  // Popular dishes
  const dishCount: Record<string, number> = {}
  orders.forEach(o => o.items.forEach(item => { dishCount[item.dishId] = (dishCount[item.dishId] || 0) + item.quantity }))
  const popular = Object.entries(dishCount).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <div className="p-3 space-y-3">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-2xl mb-1">📋</div>
          <div className="text-2xl font-bold text-gray-800">{today.length}</div>
          <div className="text-xs text-gray-400">今日订单</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-2xl mb-1">💰</div>
          <div className="text-2xl font-bold text-primary">¥{todayRevenue}</div>
          <div className="text-xs text-gray-400">今日营收</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-2xl mb-1">📊</div>
          <div className="text-2xl font-bold text-gray-800">{orders.length}</div>
          <div className="text-xs text-gray-400">总订单数</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-2xl mb-1">💵</div>
          <div className="text-2xl font-bold text-primary">¥{monthRevenue}</div>
          <div className="text-xs text-gray-400">总营收</div>
        </div>
      </div>

      {/* Popular Dishes */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">🔥 热门菜品 TOP5</h3>
        {popular.map(([dishId, count], idx) => {
          const d = getDishById(dishId)
          return d ? (
            <div key={dishId} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <span className="text-lg font-bold text-gray-300 w-6">{idx + 1}</span>
              <span className="text-2xl">{d.image}</span>
              <span className="flex-1 text-sm text-gray-700">{d.name}</span>
              <span className="text-xs text-gray-400">{count}份</span>
            </div>
          ) : null
        })}
      </div>
    </div>
  )
}
