import { useStore } from '../store/useStore'
import { PageTab } from '../types'

const tabs: { key: PageTab; label: string; icon: string }[] = [
  { key: 'home', label: '首页', icon: '🏠' },
  { key: 'menu', label: '点菜', icon: '📋' },
  { key: 'cart', label: '购物车', icon: '🛒' },
  { key: 'account', label: '我的', icon: '👤' },
]

export default function BottomNav({
  activeTab,
  onTabChange,
}: {
  activeTab: PageTab
  onTabChange: (tab: PageTab) => void
}) {
  const cartCount = useStore(s => s.cartCount())

  return (
    <nav className="flex-shrink-0 bg-white border-t border-gray-200 safe-bottom">
      <div className="flex items-center justify-around h-14">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex flex-col items-center justify-center w-full h-full relative transition-colors ${
              activeTab === tab.key ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            <span className="text-xs mt-1">{tab.label}</span>
            {tab.key === 'cart' && cartCount > 0 && (
              <span className="absolute top-0 right-1/3 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 cart-bounce">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
