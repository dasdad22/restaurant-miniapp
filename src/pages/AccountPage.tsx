import { useStore } from '../store/useStore'
import { getDishById } from '../data/menu'

interface Props {
  onNavigate: (page: { name: 'orderDetail'; orderId: string }) => void
  onLogout: () => void
}

export default function AccountPage({ onNavigate, onLogout }: Props) {
  const user = useStore(s => s.user)
  const orders = useStore(s => s.orders)
  const favDishes = user.favoriteDishes.map(id => getDishById(id)).filter(Boolean)

  const getLevelColor = (level: string) => {
    const map: Record<string, string> = {
      '普通会员': 'from-gray-400 to-gray-500',
      '银卡会员': 'from-gray-500 to-gray-600',
      '金卡会员': 'from-yellow-400 to-orange-400',
      '钻石会员': 'from-purple-400 to-pink-400',
    }
    return map[level] || map['普通会员']
  }

  const getNextLevel = () => {
    if (user.totalSpent >= 10000) return { name: '已达最高等级', need: 0 }
    if (user.totalSpent >= 5000) return { name: '钻石会员', need: 10000 - user.totalSpent }
    if (user.totalSpent >= 2000) return { name: '金卡会员', need: 5000 - user.totalSpent }
    return { name: '银卡会员', need: 2000 - user.totalSpent }
  }

  const nextLevel = getNextLevel()
  const progressPercent = user.totalSpent >= 10000
    ? 100
    : user.totalSpent >= 5000
      ? ((user.totalSpent - 5000) / 5000) * 100
      : user.totalSpent >= 2000
        ? ((user.totalSpent - 2000) / 3000) * 100
        : (user.totalSpent / 2000) * 100

  const statusLabels: Record<string, string> = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消',
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-500',
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      {/* User Header */}
      <header className={`bg-gradient-to-br ${getLevelColor(user.membershipLevel)} text-white px-5 pt-10 pb-6 rounded-b-3xl flex-shrink-0`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
            {user.avatar}
          </div>
          <div>
            <h2 className="text-lg font-bold">{user.name}</h2>
            <p className="text-white/70 text-xs mt-0.5">{user.phone}</p>
            <span className="inline-block mt-1 text-xs bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
              {user.membershipLevel}
            </span>
          </div>
        </div>

        {/* Points Display */}
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-white/15 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-xs text-white/70 mb-1">⭐ 当前积分</div>
            <div className="text-2xl font-bold">{user.points}</div>
          </div>
          <div className="flex-1 bg-white/15 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-xs text-white/70 mb-1">💰 累计消费</div>
            <div className="text-2xl font-bold">¥{user.totalSpent}</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-3 bg-white/15 rounded-xl p-3 backdrop-blur-sm">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/70">会员成长</span>
            {nextLevel.need > 0 && (
              <span className="text-white/70">再消费¥{nextLevel.need}升级{nextLevel.name}</span>
            )}
            {nextLevel.need === 0 && (
              <span className="text-white/70">{nextLevel.name}</span>
            )}
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            />
          </div>
        </div>
      </header>

      {/* Menu Grid */}
      <div className="px-5 -mt-3 z-10 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm p-3 grid grid-cols-4 gap-2">
          <MenuItem icon="📋" label="我的订单" />
          <MenuItem icon="🎫" label="积分商城" />
          <MenuItem icon="🎁" label="优惠券" />
          <MenuItem icon="⭐" label="收藏" />
        </div>
      </div>

      {/* Favorites */}
      {favDishes.length > 0 && (
        <section className="px-5 mt-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">❤️ 我的收藏</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {favDishes.map(dish => dish && (
              <div key={dish.id} className="bg-white rounded-xl p-2 flex-shrink-0 w-24 text-center shadow-sm">
                <div className="text-3xl mb-1">{dish.image}</div>
                <p className="text-xs text-gray-700 truncate">{dish.name}</p>
                <p className="text-xs text-primary font-medium">¥{dish.price}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Orders */}
      <section className="px-5 mt-4 pb-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">📋 最近订单</h3>
        {orders.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-sm">暂无订单记录</p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 10).map(order => (
              <div
                key={order.id}
                onClick={() => onNavigate({ name: 'orderDetail', orderId: order.id })}
                className="bg-white rounded-xl p-3 shadow-sm active:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">{order.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {order.items.length}个菜品
                    {order.tableNumber && ` · ${order.tableNumber}号桌`}
                  </span>
                  <span className="text-base font-bold text-primary">¥{order.finalTotal}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-300">
                    {new Date(order.createdAt).toLocaleString('zh-CN')}
                  </span>
                  <span className="text-xs text-orange-400">+{order.pointsEarned}积分</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Logout */}
      <div className="px-5 pb-8">
        <button
          onClick={onLogout}
          className="w-full bg-white text-gray-400 py-3 rounded-xl text-sm font-medium border border-gray-200 active:bg-gray-50 transition-colors"
        >
          退出登录
        </button>
      </div>
    </div>
  )
}

function MenuItem({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="flex flex-col items-center gap-1 py-2 active:bg-gray-50 rounded-xl transition-colors">
      <span className="text-2xl">{icon}</span>
      <span className="text-xs text-gray-600">{label}</span>
    </button>
  )
}
