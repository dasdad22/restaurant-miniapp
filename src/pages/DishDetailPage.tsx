import { getDishById, mockReviews } from '../data/menu'
import { useStore } from '../store/useStore'

interface Props {
  dishId: string
  onBack: () => void
}

export default function DishDetailPage({ dishId, onBack }: Props) {
  const dish = getDishById(dishId)
  const cart = useStore(s => s.cart)
  const addToCart = useStore(s => s.addToCart)
  const updateQuantity = useStore(s => s.updateQuantity)
  const toggleFavorite = useStore(s => s.toggleFavorite)
  const isFavorite = useStore(s => s.isFavorite)

  if (!dish) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-400">菜品不存在</p>
      </div>
    )
  }

  const qty = cart.find(i => i.dishId === dishId)?.quantity || 0
  const fav = isFavorite(dishId)
  const reviews = mockReviews.filter(r => r.dishId === dishId)

  const spicyLabels = ['', '微辣', '中辣', '重辣']

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-y-auto">
      {/* Hero Image */}
      <div className="relative bg-gradient-to-br from-orange-100 to-red-100 h-56 flex items-center justify-center flex-shrink-0">
        <button onClick={onBack} className="absolute top-12 left-4 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center text-gray-600 backdrop-blur-sm shadow-sm">←</button>
        <button
          onClick={() => toggleFavorite(dishId)}
          className={`absolute top-12 right-4 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm ${fav ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400'}`}
        >
          {fav ? '❤️' : '🤍'}
        </button>
        <span className="text-8xl">{dish.image}</span>
      </div>

      {/* Info Card */}
      <div className="bg-white -mt-6 rounded-t-3xl px-5 pt-6 pb-4 flex-shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{dish.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{dish.description}</p>
          </div>
          {dish.spicyLevel ? (
            <span className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded-full">{spicyLabels[dish.spicyLevel]}</span>
          ) : null}
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm font-semibold text-gray-700">{dish.rating}</span>
            <span className="text-xs text-gray-400">({dish.reviewCount}条评价)</span>
          </div>
          <span className="text-xs text-gray-300">|</span>
          <span className="text-xs text-gray-500">月售 {dish.salesCount}</span>
          <span className="text-xs text-gray-300">|</span>
          <span className="text-xs text-gray-500">⏱️ {dish.cookingTime}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">¥{dish.price}</span>
            {dish.originalPrice && <span className="text-sm text-gray-300 line-through ml-2">¥{dish.originalPrice}</span>}
          </div>
          <div className="flex items-center gap-2">
            {qty > 0 && (
              <>
                <button onClick={() => updateQuantity(dishId, qty - 1)} className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center text-gray-500">−</button>
                <span className="text-base font-semibold w-6 text-center">{qty}</span>
              </>
            )}
            <button onClick={() => addToCart(dishId)} className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-xl active:scale-90 transition-transform shadow-lg shadow-primary/30">+</button>
          </div>
        </div>
      </div>

      {/* Ingredients */}
      {dish.ingredients && (
        <div className="bg-white mt-2 mx-4 rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">🥬 主要食材</h3>
          <div className="flex flex-wrap gap-2">
            {dish.ingredients.map(ing => (
              <span key={ing} className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">{ing}</span>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="bg-white mt-2 mx-4 rounded-xl p-4 shadow-sm mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">💬 食客评价 ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">暂无评价，快来第一个评价吧~</p>
        ) : (
          <div className="space-y-3">
            {reviews.map(r => (
              <div key={r.id} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{r.userName}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-xs">{i < r.rating ? '⭐' : '☆'}</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{r.content}</p>
                <p className="text-xs text-gray-300 mt-1">{r.createdAt}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
