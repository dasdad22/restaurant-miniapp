import { useState, useEffect } from 'react'
import { useStore } from './store/useStore'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import AccountPage from './pages/AccountPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderDetailPage from './pages/OrderDetailPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import { api } from './api'

type SubPage = { name: 'checkout' } | { name: 'orderDetail'; orderId: string } | { name: 'admin' } | null

const guestUser = {
  id: -1,
  phone: '',
  name: '游客',
  avatar: '👤',
  points: 0,
  membershipLevel: '普通会员' as const,
  totalSpent: 0,
  joinDate: '',
  favoriteDishes: [] as string[],
  coupons: [] as any[],
}

export default function App() {
  const activeTab = useStore(s => s.activeTab)
  const setActiveTab = useStore(s => s.setActiveTab)
  const setUser = useStore(s => s.setUser)
  const setOrders = useStore(s => s.setOrders)
  const [subPage, setSubPage] = useState<SubPage>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isGuest, setIsGuest] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [needLogin, setNeedLogin] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    const guestFlag = localStorage.getItem('isGuest')

    if (token && savedUser) {
      // 真实用户
      try {
        const user = JSON.parse(savedUser)
        setUser(user)
        setIsLoggedIn(true)
        setIsGuest(false)
        api.getProfile().then(u => {
          setUser(u)
          localStorage.setItem('user', JSON.stringify(u))
        }).catch(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setIsLoggedIn(false)
        })
        api.getOrders().then(({ orders }) => {
          setOrders(orders)
        }).catch(() => {})
      } catch {
        setIsLoggedIn(false)
      }
    } else if (guestFlag) {
      // 游客
      setUser(guestUser)
      setIsLoggedIn(true)
      setIsGuest(true)
    }

    setAuthChecked(true)
  }, [])

  const handleLoginSuccess = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {}
    }
    setIsLoggedIn(true)
    setIsGuest(false)
    setNeedLogin(false)
    api.getOrders().then(({ orders }) => {
      setOrders(orders)
    }).catch(() => {})
  }

  const handleGuestLogin = () => {
    localStorage.setItem('isGuest', '1')
    setUser(guestUser)
    setIsLoggedIn(true)
    setIsGuest(true)
    setNeedLogin(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('isGuest')
    setUser({
      name: '美食爱好者',
      phone: '',
      avatar: '😊',
      points: 0,
      membershipLevel: '普通会员',
      totalSpent: 0,
      joinDate: '',
    })
    setOrders([])
    useStore.getState().clearCart()
    setIsLoggedIn(false)
    setIsGuest(false)
    setSubPage(null)
  }

  // 切换为真实登录
  const handleSwitchToRealLogin = () => {
    setIsLoggedIn(false)
    setIsGuest(false)
    setNeedLogin(true)
  }

  const navigateTo = (page: SubPage) => {
    // 游客点击结算时，提示登录
    if (isGuest && page?.name === 'checkout') {
      handleSwitchToRealLogin()
      return
    }
    setSubPage(page)
  }
  const goBack = () => setSubPage(null)

  if (!authChecked) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-4">🏮</div>
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onGuestLogin={handleGuestLogin}
      />
    )
  }

  const hideBottomNav = subPage !== null

  const renderPage = () => {
    if (subPage?.name === 'checkout') {
      return <CheckoutPage onBack={goBack} />
    }
    if (subPage?.name === 'orderDetail') {
      return <OrderDetailPage orderId={subPage.orderId} onBack={goBack} />
    }
    if (subPage?.name === 'admin') {
      return <AdminPage onBack={goBack} />
    }

    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={navigateTo} onSwitchTab={setActiveTab} />
      case 'menu':
        return <MenuPage onNavigate={navigateTo} />
      case 'cart':
        return <CartPage onNavigate={navigateTo} />
      case 'account':
        return isGuest
          ? <GuestAccountPage onLogin={handleSwitchToRealLogin} />
          : <AccountPage onNavigate={navigateTo} onLogout={handleLogout} />
      default:
        return <HomePage onNavigate={navigateTo} onSwitchTab={setActiveTab} />
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 max-w-lg mx-auto relative overflow-hidden">
      {/* Guest Banner */}
      {isGuest && !subPage && (
        <div className="flex-shrink-0 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-4 py-2 text-xs text-center flex items-center justify-center gap-2">
          <span>👤 游客模式 · 部分功能受限</span>
          <button
            onClick={handleSwitchToRealLogin}
            className="underline font-medium"
          >
            立即登录
          </button>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        {renderPage()}
      </div>
      {!hideBottomNav && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  )
}

// 游客看到的个人中心页
function GuestAccountPage({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <header className="bg-gradient-to-br from-gray-400 to-gray-500 text-white px-5 pt-10 pb-8 rounded-b-3xl flex-shrink-0">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
            👤
          </div>
          <div>
            <h2 className="text-lg font-bold">游客</h2>
            <p className="text-white/70 text-xs mt-0.5">登录后享受会员服务</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-20">
        <div className="text-6xl mb-4">🔐</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">登录解锁更多功能</h3>
        <ul className="text-sm text-gray-500 space-y-2 mb-6">
          <li>⭐ 消费积分，兑换优惠</li>
          <li>📋 查看历史订单</li>
          <li>🎫 会员专属优惠</li>
          <li>💳 在线下单结算</li>
        </ul>
        <button
          onClick={onLogin}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold active:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
        >
          手机号登录 / 注册
        </button>
      </div>
    </div>
  )
}
