import { useState } from 'react'
import { useStore } from '../store/useStore'
import { getDishById } from '../data/menu'
import { Order } from '../types'
import { api } from '../api'

interface Props {
  onBack: () => void
}

export default function CheckoutPage({ onBack }: Props) {
  const cart = useStore(s => s.cart)
  const user = useStore(s => s.user)
  const setUser = useStore(s => s.setUser)
  const addToCart = useStore(s => s.addToCart)
  const updateQuantity = useStore(s => s.updateQuantity)
  const clearCart = useStore(s => s.clearCart)
  const addOrder = useStore(s => s.addOrder)
  const setOrders = useStore(s => s.setOrders)

  const [tableNumber, setTableNumber] = useState('')
  const [remark, setRemark] = useState('')
  const [usePoints, setUsePoints] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastOrder, setLastOrder] = useState<Order | null>(null)
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [paymentDone, setPaymentDone] = useState(false)

  const useCoupon = useStore(s => s.useCoupon)
  const availableCoupons = user.coupons.filter(c => !c.isUsed && total >= c.threshold)

  const cartItems = cart
    .map(item => ({ ...item, dish: getDishById(item.dishId) }))
    .filter(item => item.dish)

  const total = cartItems.reduce((sum, item) => sum + (item.dish?.price || 0) * item.quantity, 0)
  const discount = total >= 200 ? Math.floor(total * 0.1) : total >= 100 ? 5 : 0
  const pointsDiscount = usePoints ? Math.min(user.points, Math.floor(total * 0.2)) : 0

  // 优惠券折扣
  let couponDiscount = 0
  if (selectedCoupon) {
    const coupon = availableCoupons.find(c => c.id === selectedCoupon)
    if (coupon) {
      if (coupon.type === 'full_reduction') couponDiscount = coupon.reduce
      else if (coupon.type === 'discount') couponDiscount = Math.floor(total * (100 - coupon.reduce) / 100)
    }
  }
  const activeCoupon = selectedCoupon ? availableCoupons.find(c => c.id === selectedCoupon) : null

  const finalTotal = Math.max(0, total - discount - pointsDiscount - couponDiscount)
  const pointsEarned = Math.floor(finalTotal * 0.1)

  const handleConfirmOrder = async () => {
    setSubmitting(true)
    try {
      const res = await api.createOrder({
        items: [...cart],
        total,
        discount: discount + pointsDiscount + couponDiscount,
        finalTotal,
        pointsEarned,
        pointsUsed: pointsDiscount,
        tableNumber: tableNumber || undefined,
        remark: remark || undefined,
      })

      // 更新本地状态
      setUser({ ...user, points: res.user.points, membershipLevel: res.user.membershipLevel as any, totalSpent: res.user.totalSpent })
      setLastOrder(res.order)
      addOrder(res.order)

      // 使用优惠券
      if (selectedCoupon) useCoupon(selectedCoupon)

      // 同步订单列表
      api.getOrders().then(({ orders }) => setOrders(orders)).catch(() => {})

      // 进入付款步骤
      setShowPayment(true)
    } catch (err: any) {
      alert(err.message || '下单失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePaymentDone = () => {
    setPaymentDone(true)
    setShowSuccess(true)
    clearCart()
  }

  const handleDone = () => {
    setShowSuccess(false)
    setShowPayment(false)
    setPaymentDone(false)
    setLastOrder(null)
    onBack()
  }

  // ===== 付款页面 =====
  if (showPayment && lastOrder) {
    return (
      <div className="h-full flex flex-col bg-white">
        <header className="bg-white px-5 pt-10 pb-3 flex-shrink-0 border-b border-gray-100 flex items-center gap-3">
          <button onClick={handleDone} className="text-gray-500 text-lg">←</button>
          <h1 className="text-lg font-bold text-gray-800">💳 扫码付款</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Amount */}
          <p className="text-sm text-gray-500 mb-2">请扫描下方二维码支付</p>
          <p className="text-3xl font-bold text-primary mb-6">¥{lastOrder.finalTotal}</p>

          {/* Payment QR Code Placeholder */}
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-4 w-full max-w-xs text-center">
            <div className="text-6xl mb-3">💚</div>
            <div className="bg-white rounded-xl p-4 mb-3">
              <div className="text-5xl mb-2">📱</div>
              <p className="text-sm font-bold text-gray-800">微信收款码</p>
              <p className="text-xs text-gray-500 mt-1">
                请将你的微信收款码图片<br/>替换此处占位图
              </p>
            </div>
            <p className="text-xs text-green-700 font-medium">
              🟢 收款方：餐厅老板微信
            </p>
          </div>

          <p className="text-xs text-gray-400 mb-6">订单号: {lastOrder.id}</p>

          {!paymentDone ? (
            <button
              onClick={handlePaymentDone}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold text-base active:bg-green-600 transition-colors shadow-lg shadow-green-500/30"
            >
              ✅ 我已付款
            </button>
          ) : (
            <div className="text-center">
              <div className="text-5xl mb-2">✅</div>
              <p className="text-green-600 font-semibold">付款确认成功</p>
            </div>
          )}
        </div>

        {paymentDone && (
          <div className="flex-shrink-0 p-4 safe-bottom">
            <button
              onClick={handleDone}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold active:bg-primary-dark transition-colors"
            >
              完成
            </button>
          </div>
        )}
      </div>
    )
  }

  // ===== 成功页 =====
  if (showSuccess && lastOrder) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">下单成功!</h2>
          <p className="text-sm text-gray-500 mb-6">订单号: {lastOrder.id}</p>

          <div className="w-full bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">订单金额</span>
              <span className="text-gray-800">¥{lastOrder.total}</span>
            </div>
            {lastOrder.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">优惠减免</span>
                <span className="text-primary">-¥{lastOrder.discount}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold border-t border-gray-200 pt-2">
              <span className="text-gray-700">实付金额</span>
              <span className="text-primary text-lg">¥{lastOrder.finalTotal}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">获得积分</span>
              <span className="text-orange-500">+{lastOrder.pointsEarned}</span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 p-4 safe-bottom space-y-2">
          <button
            onClick={handleDone}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold active:bg-primary-dark transition-colors"
          >
            完成
          </button>
          <button onClick={handleDone} className="w-full text-gray-400 text-sm py-2">
            返回首页
          </button>
        </div>
      </div>
    )
  }

  // ===== 确认订单页 =====
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <header className="bg-white px-5 pt-10 pb-3 flex-shrink-0 border-b border-gray-100 flex items-center gap-3">
        <button onClick={onBack} className="text-gray-500 text-lg">←</button>
        <h1 className="text-lg font-bold text-gray-800">💳 确认订单</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Order Items */}
        <div className="bg-white mt-2 mx-3 rounded-xl p-3 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">📋 已点菜品</h2>
          <div className="space-y-2">
            {cartItems.map(({ dishId, quantity, dish }) => (
              <div key={dishId} className="flex items-center gap-2">
                <span className="text-xl">{dish?.image}</span>
                <span className="flex-1 text-sm text-gray-700 truncate">{dish?.name}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(dishId, quantity - 1)}
                    className="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-xs"
                  >
                    −
                  </button>
                  <span className="text-sm w-5 text-center text-gray-700">{quantity}</span>
                  <button
                    onClick={() => addToCart(dishId)}
                    className="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-xs"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm font-medium text-gray-800 w-16 text-right">
                  ¥{(dish?.price || 0) * quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Table & Remark */}
        <div className="bg-white mt-2 mx-3 rounded-xl p-3 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 flex-shrink-0">🪑 桌号</span>
            <input
              type="text"
              value={tableNumber}
              onChange={e => setTableNumber(e.target.value)}
              placeholder="请输入桌号（选填）"
              className="flex-1 text-sm text-right text-gray-700 outline-none placeholder-gray-300"
            />
          </div>
          <div className="flex items-center gap-3 border-t border-gray-50 pt-3">
            <span className="text-sm text-gray-600 flex-shrink-0">📝 备注</span>
            <input
              type="text"
              value={remark}
              onChange={e => setRemark(e.target.value)}
              placeholder="口味要求等（选填）"
              className="flex-1 text-sm text-right text-gray-700 outline-none placeholder-gray-300"
            />
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-white mt-2 mx-3 rounded-xl p-3 shadow-sm space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">菜品金额</span>
            <span className="text-gray-800">¥{total}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">满减优惠</span>
              <span className="text-primary">-¥{discount}</span>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-gray-50 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">🎫 积分抵扣</span>
              <span className="text-xs text-orange-500">{user.points}积分可用</span>
            </div>
            <button
              onClick={() => setUsePoints(!usePoints)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                usePoints ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  usePoints ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
          {usePoints && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">积分抵现</span>
              <span className="text-orange-500">-¥{pointsDiscount}</span>
            </div>
          )}

          {/* Coupon Selection */}
          <div className="border-t border-gray-50 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">🎟️ 优惠券</span>
              <select
                value={selectedCoupon || ''}
                onChange={e => setSelectedCoupon(e.target.value || null)}
                className="text-sm text-right text-gray-700 bg-transparent outline-none max-w-[60%]"
              >
                <option value="">不使用优惠券</option>
                {availableCoupons.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type === 'full_reduction' ? `减¥${c.reduce}` : `${c.reduce}折`})
                  </option>
                ))}
              </select>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-400">{activeCoupon?.name}</span>
                <span className="text-green-500">-¥{couponDiscount}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between border-t border-gray-100 pt-2">
            <span className="font-semibold text-gray-700">实付金额</span>
            <span className="text-xl font-bold text-primary">¥{finalTotal}</span>
          </div>
          <div className="text-xs text-gray-400 text-right">
            付款后可获得 <span className="text-orange-500">{pointsEarned}</span> 积分
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex-shrink-0 p-4 safe-bottom">
        <button
          onClick={handleConfirmOrder}
          disabled={submitting}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-base active:bg-primary-dark transition-colors shadow-lg shadow-primary/30 disabled:opacity-50"
        >
          {submitting ? '提交中...' : `🔔 确认下单 · ¥${finalTotal}`}
        </button>
      </div>
    </div>
  )
}
