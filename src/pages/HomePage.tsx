import { dishes } from '../data/menu'
import { useStore } from '../store/useStore'
import { PageTab } from '../types'

interface Props {
  onNavigate: (page: { name: 'checkout' } | { name: 'orderDetail'; orderId: string }) => void
  onSwitchTab: (tab: PageTab) => void
}

export default function HomePage({ onSwitchTab }: Props) {
  const user = useStore(s => s.user)
  const cartCount = useStore(s => s.cartCount())
  const orders = useStore(s => s.orders)

  const recommendedDishes = dishes.filter(d => d.isRecommended)
  const hotDishes = [...dishes].sort((a, b) => b.salesCount - a.salesCount).slice(0, 4)

  const getLevelBadge = (level: string) => {
    const map: Record<string, string> = {
      '普通会员': 'bg-gray-200 text-gray-600',
      '银卡会员': 'bg-gray-300 text-gray-700',
      '金卡会员': 'bg-yellow-200 text-yellow-800',
      '钻石会员': 'bg-purple-200 text-purple-800',
    }
    return map[level] || map['普通会员']
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary to-red-500 text-white px-5 pt-10 pb-8 rounded-b-3xl flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold">🏮 美味餐厅</h1>
            <p className="text-white/70 text-xs mt-1">中式家常菜 · 用心做好每一餐</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getLevelBadge(user.membershipLevel)}`}>
              {user.membershipLevel}
            </span>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="flex gap-3 mt-2">
          <div className="flex-1 bg-white/15 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-2xl font-bold">{user.points}</div>
            <div className="text-xs text-white/70">会员积分</div>
          </div>
          <div className="flex-1 bg-white/15 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-2xl mb-1">📋</div>
            <div className="text-2xl font-bold">{orders.length}</div>
            <div className="text-xs text-white/70">历史订单</div>
          </div>
          <div className="flex-1 bg-white/15 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-2xl mb-1">💰</div>
            <div className="text-2xl font-bold">¥{user.totalSpent}</div>
            <div className="text-xs text-white/70">累计消费</div>
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="px-5 -mt-4 z-10 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-around">
          <button onClick={() => onSwitchTab('menu')} className="flex flex-col items-center gap-1">
            <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center text-2xl">
              📋
            </div>
            <span className="text-xs text-gray-600">扫码点餐</span>
          </button>
          <button onClick={() => onSwitchTab('cart')} className="flex flex-col items-center gap-1 relative">
            <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center text-2xl">
              🛒
            </div>
            <span className="text-xs text-gray-600">购物车</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 right-2 min-w-[16px] h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={() => onSwitchTab('account')} className="flex flex-col items-center gap-1">
            <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
              🎫
            </div>
            <span className="text-xs text-gray-600">我的订单</span>
          </button>
          <button onClick={() => onSwitchTab('menu')} className="flex flex-col items-center gap-1">
            <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center text-2xl">
              🔥
            </div>
            <span className="text-xs text-gray-600">今日推荐</span>
          </button>
        </div>
      </div>

      {/* Recommended Dishes */}
      <section className="px-5 mt-5 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-800">🌟 主厨推荐</h2>
          <button onClick={() => onSwitchTab('menu')} className="text-xs text-primary">
            查看全部 →
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {recommendedDishes.map(dish => (
            <DishCardMini key={dish.id} dish={dish} onAdd={() => useStore.getState().addToCart(dish.id)} />
          ))}
        </div>
      </section>

      {/* Hot Dishes */}
      <section className="px-5 mt-5 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-800">🔥 热销排行</h2>
          <button onClick={() => onSwitchTab('menu')} className="text-xs text-primary">
            查看全部 →
          </button>
        </div>
        <div className="space-y-2">
          {hotDishes.map((dish, idx) => (
            <HotDishRow key={dish.id} dish={dish} rank={idx + 1} onAdd={() => useStore.getState().addToCart(dish.id)} />
          ))}
        </div>
      </section>
    </div>
  )
}

function DishCardMini({ dish, onAdd }: { dish: typeof dishes[number]; onAdd: () => void }) {
  return (
    <div className="dish-card bg-white rounded-xl p-3 shadow-sm flex flex-col">
      <div className="text-4xl text-center mb-2">{dish.image}</div>
      <h3 className="text-sm font-medium text-gray-800 truncate">{dish.name}</h3>
      <p className="text-xs text-gray-400 truncate mt-0.5">{dish.description}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-primary font-bold text-sm">¥{dish.price}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onAdd() }}
          className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold active:scale-90 transition-transform"
        >
          +
        </button>
      </div>
    </div>
  )
}

function HotDishRow({ dish, rank, onAdd }: { dish: typeof dishes[number]; rank: number; onAdd: () => void }) {
  const rankColors = ['text-yellow-500', 'text-gray-400', 'text-orange-400']
  return (
    <div className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm">
      <span className={`text-lg font-bold w-6 text-center ${rankColors[rank - 1] || 'text-gray-300'}`}>
        {rank}
      </span>
      <span className="text-3xl">{dish.image}</span>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-800 truncate">{dish.name}</h3>
        <p className="text-xs text-gray-400">{dish.salesCount} 人已点</p>
      </div>
      <span className="text-primary font-bold text-sm mr-2">¥{dish.price}</span>
      <button
        onClick={onAdd}
        className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold active:scale-90 transition-transform flex-shrink-0"
      >
        +
      </button>
    </div>
  )
}
