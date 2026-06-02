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
import { api } from './api'

type SubPage = { name: 'checkout' } | { name: 'orderDetail'; orderId: string } | null

export default function App() {
  const activeTab = useStore(s => s.activeTab)
  const setActiveTab = useStore(s => s.setActiveTab)
  const setUser = useStore(s => s.setUser)
  const setOrders = useStore(s => s.setOrders)
  const [subPage, setSubPage] = useState<SubPage>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  // 启动时检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setUser(user)
        setIsLoggedIn(true)
        // 异步同步后端数据
        api.getProfile().then(u => {
          setUser(u)
          localStorage.setItem('user', JSON.stringify(u))
        }).catch(() => {
          // token过期，清除
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
    // 加载订单
    api.getOrders().then(({ orders }) => {
      setOrders(orders)
    }).catch(() => {})
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
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
    setSubPage(null)
  }

  const navigateTo = (page: SubPage) => setSubPage(page)
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
    return <LoginPage onLoginSuccess={handleLoginSuccess} />
  }

  const hideBottomNav = subPage !== null

  const renderPage = () => {
    if (subPage?.name === 'checkout') {
      return <CheckoutPage onBack={goBack} />
    }
    if (subPage?.name === 'orderDetail') {
      return <OrderDetailPage orderId={subPage.orderId} onBack={goBack} />
    }

    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={navigateTo} onSwitchTab={setActiveTab} />
      case 'menu':
        return <MenuPage onNavigate={navigateTo} />
      case 'cart':
        return <CartPage onNavigate={navigateTo} />
      case 'account':
        return <AccountPage onNavigate={navigateTo} onLogout={handleLogout} />
      default:
        return <HomePage onNavigate={navigateTo} onSwitchTab={setActiveTab} />
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 max-w-lg mx-auto relative overflow-hidden">
      <div className="flex-1 overflow-hidden">
        {renderPage()}
      </div>
      {!hideBottomNav && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  )
}
