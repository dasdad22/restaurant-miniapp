import { useStore } from '../store/useStore'
import { getDishById, getCategoryName } from '../data/menu'

interface Props {
  orderId: string
  onBack: () => void
}

export default function OrderDetailPage({ orderId, onBack }: Props) {
  const orders = useStore(s => s.orders)
  const order = orders.find(o => o.id === orderId)

  if (!order) {
    return (
      <div className="h-full flex flex-col">
        <header className="bg-white px-5 pt-10 pb-3 flex-shrink-0 border-b border-gray-100 flex items-center gap-3">
          <button onClick={onBack} className="text-gray-500 text-lg">←</button>
          <h1 className="text-lg font-bold text-gray-800">订单详情</h1>
        </header>
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-sm">未找到订单</p>
          </div>
        </div>
      </div>
    )
  }

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
    <div className="h-full flex flex-col bg-gray-50 overflow-y-auto">
      {/* Header */}
      <header className="bg-white px-5 pt-10 pb-3 flex-shrink-0 border-b border-gray-100 flex items-center gap-3">
        <button onClick={onBack} className="text-gray-500 text-lg">←</button>
        <h1 className="text-lg font-bold text-gray-800">📋 订单详情</h1>
      </header>

      {/* Order Status */}
      <div className="bg-white mt-2 mx-3 rounded-xl p-4 shadow-sm text-center">
        <div className="text-5xl mb-2">
          {order.status === 'completed' ? '✅' : order.status === 'cancelled' ? '❌' : '🕐'}
        </div>
        <span className={`text-sm px-3 py-1 rounded-full ${statusColors[order.status]}`}>
          {statusLabels[order.status]}
        </span>
        <p className="text-xs text-gray-400 mt-2">订单号: {order.id}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {new Date(order.createdAt).toLocaleString('zh-CN')}
        </p>
        {order.tableNumber && (
          <p className="text-xs text-gray-400 mt-0.5">桌号: {order.tableNumber}</p>
        )}
      </div>

      {/* Dish List */}
      <div className="bg-white mt-2 mx-3 rounded-xl p-3 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">🍽️ 菜品清单</h3>
        <div className="divide-y divide-gray-50">
          {order.items.map(({ dishId, quantity }) => {
            const dish = getDishById(dishId)
            if (!dish) return null
            return (
              <div key={dishId} className="flex items-center gap-3 py-2">
                <span className="text-2xl">{dish.image}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{dish.name}</p>
                  <p className="text-xs text-gray-400">{getCategoryName(dish.categoryId)}</p>
                </div>
                <span className="text-xs text-gray-400">×{quantity}</span>
                <span className="text-sm font-medium text-gray-800 w-16 text-right">
                  ¥{dish.price * quantity}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-white mt-2 mx-3 rounded-xl p-3 shadow-sm space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">菜品金额</span>
          <span className="text-gray-800">¥{order.total}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">优惠减免</span>
            <span className="text-primary">-¥{order.discount}</span>
          </div>
        )}
        {order.pointsUsed > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">积分抵扣</span>
            <span className="text-orange-500">-¥{order.pointsUsed}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-gray-100 pt-2">
          <span className="font-semibold text-gray-700">实付金额</span>
          <span className="text-lg font-bold text-primary">¥{order.finalTotal}</span>
        </div>
        {order.pointsEarned > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">获得积分</span>
            <span className="text-orange-500">+{order.pointsEarned}</span>
          </div>
        )}
        {order.remark && (
          <div className="text-xs text-gray-400 mt-1 border-t border-gray-50 pt-2">
            备注: {order.remark}
          </div>
        )}
      </div>

      <div className="p-4">
        <button
          onClick={onBack}
          className="w-full bg-gray-200 text-gray-600 py-3 rounded-xl font-medium active:bg-gray-300 transition-colors"
        >
          返回
        </button>
      </div>
    </div>
  )
}
