import { useState } from 'react'
import { useStore } from '../store/useStore'
import { getDishById, getCategoryName } from '../data/menu'
import { Review } from '../types'

interface Props {
  orderId: string
  onBack: () => void
}

export default function OrderDetailPage({ orderId, onBack }: Props) {
  const orders = useStore(s => s.orders)
  const updateOrderStatus = useStore(s => s.updateOrderStatus)
  const addReview = useStore(s => s.addReview)
  const reviews = useStore(s => s.reviews)
  const user = useStore(s => s.user)
  const order = orders.find(o => o.id === orderId)

  const [showReview, setShowReview] = useState(false)
  const [reviewDish, setReviewDish] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewContent, setReviewContent] = useState('')

  if (!order) {
    return (
      <div className="h-full flex flex-col">
        <header className="bg-white px-5 pt-10 pb-3 flex-shrink-0 border-b border-gray-100 flex items-center gap-3">
          <button onClick={onBack} className="text-gray-500 text-lg">←</button>
          <h1 className="text-lg font-bold text-gray-800">订单详情</h1>
        </header>
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center"><div className="text-5xl mb-3">🔍</div><p className="text-sm">未找到订单</p></div>
        </div>
      </div>
    )
  }

  const statusFlow = ['confirmed', 'preparing', 'ready', 'served', 'completed']
  const statusLabels: Record<string, string> = { pending: '待确认', confirmed: '已确认', preparing: '制作中', ready: '待上菜', served: '已上菜', completed: '已完成', cancelled: '已取消' }
  const statusIcons: Record<string, string> = { pending: '🕐', confirmed: '✅', preparing: '👨‍🍳', ready: '🔔', served: '🍽️', completed: '🎉', cancelled: '❌' }
  const statusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', preparing: 'bg-orange-100 text-orange-700', ready: 'bg-purple-100 text-purple-700', served: 'bg-teal-100 text-teal-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-gray-100 text-gray-500' }

  const currentIdx = statusFlow.indexOf(order.status)

  const handleSubmitReview = () => {
    if (!reviewContent.trim()) return
    const review: Review = {
      id: 'r' + Date.now(),
      dishId: reviewDish || order.items[0]?.dishId || '',
      userId: user.id,
      userName: user.name,
      rating: reviewRating,
      content: reviewContent,
      createdAt: new Date().toISOString().split('T')[0],
    }
    addReview(review)
    setShowReview(false)
    setReviewContent('')
    setReviewRating(5)
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-y-auto">
      <header className="bg-white px-5 pt-10 pb-3 flex-shrink-0 border-b border-gray-100 flex items-center gap-3">
        <button onClick={onBack} className="text-gray-500 text-lg">←</button>
        <h1 className="text-lg font-bold text-gray-800">📋 订单详情</h1>
      </header>

      {/* Status */}
      <div className="bg-white mt-2 mx-3 rounded-xl p-4 shadow-sm text-center">
        <div className="text-4xl mb-2">{statusIcons[order.status]}</div>
        <span className={`text-sm px-3 py-1 rounded-full ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
        <p className="text-xs text-gray-400 mt-2">订单号: {order.id}</p>
        <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleString('zh-CN')}</p>
        {order.tableNumber && <p className="text-xs text-gray-400">桌号: {order.tableNumber}</p>}
      </div>

      {/* Status Timeline */}
      {order.status !== 'cancelled' && (
        <div className="bg-white mt-2 mx-3 rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">📡 订单进度</h3>
          <div className="flex items-center justify-between">
            {statusFlow.map((s, idx) => (
              <div key={s} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  idx <= currentIdx ? 'bg-primary text-white' : 'bg-gray-100 text-gray-300'
                }`}>
                  {idx < currentIdx ? '✓' : statusIcons[s]}
                </div>
                <span className={`text-[10px] mt-1 ${idx <= currentIdx ? 'text-primary font-medium' : 'text-gray-300'}`}>
                  {statusLabels[s]}
                </span>
                {idx < statusFlow.length - 1 && (
                  <div className={`absolute h-0.5 w-[calc(100%/5)] mt-4 ${idx < currentIdx ? 'bg-primary' : 'bg-gray-100'}`} style={{ display: 'none' }} />
                )}
              </div>
            ))}
          </div>
          {/* Simplified progress bar */}
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(currentIdx + 1) / statusFlow.length * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Dish List */}
      <div className="bg-white mt-2 mx-3 rounded-xl p-3 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">🍽️ 菜品清单</h3>
        <div className="divide-y divide-gray-50">
          {order.items.map(({ dishId, quantity }) => {
            const dish = getDishById(dishId)
            if (!dish) return null
            const hasReviewed = reviews.some(r => r.dishId === dishId)
            return (
              <div key={dishId} className="flex items-center gap-3 py-2">
                <span className="text-2xl">{dish.image}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{dish.name}</p>
                  <p className="text-xs text-gray-400">{getCategoryName(dish.categoryId)}</p>
                </div>
                <span className="text-xs text-gray-400">×{quantity}</span>
                <span className="text-sm font-medium text-gray-800 w-16 text-right">¥{dish.price * quantity}</span>
                {order.status === 'completed' && !hasReviewed && (
                  <button
                    onClick={() => { setReviewDish(dishId); setShowReview(true) }}
                    className="text-xs text-primary border border-primary px-2 py-0.5 rounded-full flex-shrink-0"
                  >评价</button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-white mt-2 mx-3 rounded-xl p-3 shadow-sm space-y-2">
        <div className="flex justify-between text-sm"><span className="text-gray-500">菜品金额</span><span className="text-gray-800">¥{order.total}</span></div>
        {order.discount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">优惠减免</span><span className="text-primary">-¥{order.discount}</span></div>}
        {order.pointsUsed > 0 && <div className="flex justify-between text-sm"><span className="text-gray-400">积分抵扣</span><span className="text-orange-500">-¥{order.pointsUsed}</span></div>}
        <div className="flex justify-between border-t border-gray-100 pt-2"><span className="font-semibold text-gray-700">实付金额</span><span className="text-lg font-bold text-primary">¥{order.finalTotal}</span></div>
        <div className="flex justify-between text-xs"><span className="text-gray-400">获得积分</span><span className="text-orange-500">+{order.pointsEarned}</span></div>
        {order.remark && <div className="text-xs text-gray-400 mt-1 border-t border-gray-50 pt-2">备注: {order.remark}</div>}
      </div>

      {/* Review Modal */}
      {showReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={() => setShowReview(false)}>
          <div className="bg-white rounded-t-3xl p-5 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-800 mb-4">✍️ 评价菜品</h3>
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} onClick={() => setReviewRating(s)} className={`text-3xl transition-transform ${s <= reviewRating ? 'scale-110' : 'opacity-30'}`}>
                  {s <= reviewRating ? '⭐' : '☆'}
                </button>
              ))}
            </div>
            <textarea
              value={reviewContent}
              onChange={e => setReviewContent(e.target.value)}
              placeholder="说说这道菜怎么样..."
              className="w-full bg-gray-50 rounded-xl p-3 text-sm outline-none resize-none h-24 mb-4"
            />
            <button onClick={handleSubmitReview} className="w-full bg-primary text-white py-3 rounded-xl font-semibold">提交评价</button>
          </div>
        </div>
      )}

      <div className="p-4">
        <button onClick={onBack} className="w-full bg-gray-200 text-gray-600 py-3 rounded-xl font-medium active:bg-gray-300">返回</button>
      </div>
    </div>
  )
}
