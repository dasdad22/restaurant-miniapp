import { useStore } from '../store/useStore'
import { getDishById } from '../data/menu'

interface Props {
  onNavigate: (page: { name: 'checkout' }) => void
}

export default function CartPage({ onNavigate }: Props) {
  const cart = useStore(s => s.cart)
  const addToCart = useStore(s => s.addToCart)
  const removeFromCart = useStore(s => s.removeFromCart)
  const updateQuantity = useStore(s => s.updateQuantity)
  const clearCart = useStore(s => s.clearCart)

  const cartItems = cart
    .map(item => ({ ...item, dish: getDishById(item.dishId) }))
    .filter(item => item.dish)

  const total = cartItems.reduce((sum, item) => sum + (item.dish?.price || 0) * item.quantity, 0)
  const discount = total >= 200 ? Math.floor(total * 0.1) : total >= 100 ? 5 : 0
  const finalTotal = total - discount

  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <header className="bg-white px-5 pt-10 pb-3 flex-shrink-0 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-800 text-center">🛒 购物车</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-base">购物车空空如也</p>
            <p className="text-sm mt-1">快去点菜吧~</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-white px-5 pt-10 pb-3 flex-shrink-0 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">🛒 购物车</h1>
        <button
          onClick={clearCart}
          className="text-xs text-gray-400 active:text-primary"
        >
          🗑️ 清空
        </button>
      </header>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="space-y-2">
          {cartItems.map(({ dishId, quantity, dish }) => (
            <div key={dishId} className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                {dish?.image}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 truncate">{dish?.name}</h3>
                <p className="text-primary font-bold text-sm mt-1">¥{dish?.price}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => updateQuantity(dishId, quantity - 1)}
                  className="w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-500 active:bg-gray-50"
                >
                  −
                </button>
                <span className="text-sm font-semibold text-gray-800 w-6 text-center">{quantity}</span>
                <button
                  onClick={() => addToCart(dishId)}
                  className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center active:scale-90 transition-transform"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Discount Info */}
        <div className="mt-3 bg-orange-50 rounded-xl p-3 text-xs text-orange-700">
          💡 {total >= 200 ? '已满200元，享9折优惠' : total >= 100 ? '已满100元，立减5元' : `再买¥${100 - total}即可享满100减5元优惠`}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-3 safe-bottom">
        <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
          <span>小计: ¥{total}</span>
          {discount > 0 && <span className="text-primary">优惠: -¥{discount}</span>}
        </div>
        <button
          onClick={() => onNavigate({ name: 'checkout' })}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-base flex items-center justify-center gap-2 active:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
        >
          <span>💳</span>
          <span>去结算 ¥{finalTotal}</span>
        </button>
      </div>
    </div>
  )
}
