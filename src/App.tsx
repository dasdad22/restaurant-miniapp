import { useState } from 'react'
import { useStore } from './store/useStore'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import AccountPage from './pages/AccountPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderDetailPage from './pages/OrderDetailPage'

type SubPage = { name: 'checkout' } | { name: 'orderDetail'; orderId: string } | null

export default function App() {
  const activeTab = useStore(s => s.activeTab)
  const setActiveTab = useStore(s => s.setActiveTab)
  const [subPage, setSubPage] = useState<SubPage>(null)

  const navigateTo = (page: SubPage) => setSubPage(page)
  const goBack = () => setSubPage(null)

  // Determine if sub-page should hide bottom nav
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
        return <AccountPage onNavigate={navigateTo} />
      default:
        return <HomePage onNavigate={navigateTo} onSwitchTab={setActiveTab} />
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 max-w-lg mx-auto relative overflow-hidden">
      {/* Page Content */}
      <div className="flex-1 overflow-hidden">
        {renderPage()}
      </div>

      {/* Bottom Navigation */}
      {!hideBottomNav && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  )
}
