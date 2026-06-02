import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Order, User, PageTab } from '../types'

interface AppState {
  // Cart
  cart: CartItem[]
  addToCart: (dishId: string) => void
  removeFromCart: (dishId: string) => void
  updateQuantity: (dishId: string, quantity: number) => void
  clearCart: () => void
  cartCount: () => number

  // User
  user: User
  setUser: (user: User) => void
  updateUser: (updates: Partial<User>) => void
  addPoints: (points: number) => void
  deductPoints: (points: number) => void

  // Orders
  orders: Order[]
  setOrders: (orders: Order[]) => void
  addOrder: (order: Order) => void

  // UI State
  activeTab: PageTab
  setActiveTab: (tab: PageTab) => void
}

const defaultUser: User = {
  name: '美食爱好者',
  phone: '',
  avatar: '😊',
  points: 0,
  membershipLevel: '普通会员',
  totalSpent: 0,
  joinDate: '',
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      user: defaultUser,
      orders: [],
      activeTab: 'home',

      addToCart: (dishId) => {
        const cart = get().cart
        const existing = cart.find(item => item.dishId === dishId)
        if (existing) {
          set({
            cart: cart.map(item =>
              item.dishId === dishId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          })
        } else {
          set({ cart: [...cart, { dishId, quantity: 1 }] })
        }
      },

      removeFromCart: (dishId) => {
        set({ cart: get().cart.filter(item => item.dishId !== dishId) })
      },

      updateQuantity: (dishId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(dishId)
          return
        }
        set({
          cart: get().cart.map(item =>
            item.dishId === dishId ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => set({ cart: [] }),

      cartCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),

      setUser: (user) => set({ user }),

      updateUser: (updates) => {
        set({ user: { ...get().user, ...updates } })
      },

      addPoints: (points) => {
        const user = get().user
        const newPoints = user.points + points
        const totalSpent = user.totalSpent + points
        let membershipLevel = user.membershipLevel
        if (totalSpent >= 10000) membershipLevel = '钻石会员'
        else if (totalSpent >= 5000) membershipLevel = '金卡会员'
        else if (totalSpent >= 2000) membershipLevel = '银卡会员'

        set({
          user: { ...user, points: newPoints, totalSpent, membershipLevel },
        })
      },

      deductPoints: (points) => {
        const user = get().user
        set({ user: { ...user, points: Math.max(0, user.points - points) } })
      },

      setOrders: (orders) => set({ orders }),

      addOrder: (order) => {
        set({ orders: [order, ...get().orders] })
      },

      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'restaurant-storage',
      partialize: (state) => ({
        cart: state.cart,
      }),
    }
  )
)
