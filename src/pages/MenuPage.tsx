import { useState } from 'react'
import { categories, dishes, getDishesByCategory } from '../data/menu'
import { useStore } from '../store/useStore'

interface Props {
  onNavigate: (page: { name: 'checkout' }) => void
}

export default function MenuPage({ onNavigate }: Props) {
  const [activeCategory, setActiveCategory] = useState('recommend')
  const cart = useStore(s => s.cart)
  const addToCart = useStore(s => s.addToCart)
  const updateQuantity = useStore(s => s.updateQuantity)
  const cartCount = useStore(s => s.cartCount())

  const displayDishes = getDishesByCategory(activeCategory)

  const getCartQty = (dishId: string) => {
    const item = cart.find(i => i.dishId === dishId)
    return item?.quantity || 0
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-white px-5 pt-10 pb-3 flex-shrink-0 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-800 text-center">📋 扫码点餐</h1>
      </header>

      {/* Category Tabs */}
      <div className="bg-white flex-shrink-0 overflow-x-auto border-b border-gray-100">
        <div className="flex px-2 py-2 gap-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-primary text-white shadow-sm shadow-primary/30'
                  : 'bg-gray-50 text-gray-600 active:bg-gray-100'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dish List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 pb-4">
        <div className="space-y-2">
          {displayDishes.map(dish => {
            const qty = getCartQty(dish.id)
            return (
              <div key={dish.id} className="dish-card bg-white rounded-xl p-3 flex gap-3 shadow-sm">
                {/* Dish Image */}
                <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                  {dish.image}
                </div>

                {/* Dish Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">{dish.name}</h3>
                      {dish.isNew && (
                        <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded">新品</span>
                      )}
                      {dish.isRecommended && (
                        <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">推荐</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{dish.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-primary font-bold text-base">¥{dish.price}</span>
                      {dish.originalPrice && (
                        <span className="text-xs text-gray-300 line-through">¥{dish.originalPrice}</span>
                      )}
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center gap-2">
                      {qty > 0 && (
                        <>
                          <button
                            onClick={() => updateQuantity(dish.id, qty - 1)}
                            className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center text-gray-500 text-sm active:bg-gray-50"
                          >
                            −
                          </button>
                          <span className="text-sm font-semibold text-gray-800 w-5 text-center">{qty}</span>
                        </>
                      )}
                      <button
                        onClick={() => addToCart(dish.id)}
                        className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm active:scale-90 transition-transform"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {displayDishes.length === 0 && (
          <div className="text-center text-gray-400 py-20">
            <div className="text-5xl mb-3">🍽️</div>
            <p className="text-sm">暂无菜品</p>
          </div>
        )}
      </div>

      {/* Cart Bar */}
      {cartCount > 0 && (
        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-3 safe-bottom">
          <button
            onClick={() => onNavigate({ name: 'checkout' })}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-base flex items-center justify-center gap-2 active:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
          >
            <span>🛒</span>
            <span>去结算 ({cartCount}件)</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  )
}
