import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Order, User, PageTab, Coupon, Review } from '../types'

interface AppState {
  cart: CartItem[]
  addToCart: (dishId: string) => void
  removeFromCart: (dishId: string) => void
  updateQuantity: (dishId: string, quantity: number) => void
  clearCart: () => void
  cartCount: () => number

  user: User
  setUser: (user: User) => void
  updateUser: (updates: Partial<User>) => void
  addPoints: (points: number) => void
  deductPoints: (points: number) => void

  // Favorites
  toggleFavorite: (dishId: string) => void
  isFavorite: (dishId: string) => boolean

  // Coupons
  addCoupon: (coupon: Coupon) => void
  useCoupon: (couponId: string) => void

  // Reviews
  reviews: Review[]
  addReview: (review: Review) => void

  orders: Order[]
  setOrders: (orders: Order[]) => void
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: Order['status']) => void

  activeTab: PageTab
  setActiveTab: (tab: PageTab) => void
}

const defaultUser: User = {
  id: -1,
  phone: '',
  name: '美食爱好者',
  avatar: '😊',
  points: 0,
  membershipLevel: '普通会员',
  totalSpent: 0,
  joinDate: '',
  favoriteDishes: [],
  coupons: [],
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      user: defaultUser,
      orders: [],
      reviews: [],
      activeTab: 'home',

      addToCart: (dishId) => {
        const cart = get().cart
        const existing = cart.find(item => item.dishId === dishId)
        if (existing) {
          set({ cart: cart.map(item => item.dishId === dishId ? { ...item, quantity: item.quantity + 1 } : item) })
        } else {
          set({ cart: [...cart, { dishId, quantity: 1 }] })
        }
      },
      removeFromCart: (dishId) => set({ cart: get().cart.filter(item => item.dishId !== dishId) }),
      updateQuantity: (dishId, quantity) => {
        if (quantity <= 0) { get().removeFromCart(dishId); return }
        set({ cart: get().cart.map(item => item.dishId === dishId ? { ...item, quantity } : item) })
      },
      clearCart: () => set({ cart: [] }),
      cartCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),

      setUser: (user) => set({ user }),
      updateUser: (updates) => set({ user: { ...get().user, ...updates } }),
      addPoints: (points) => {
        const user = get().user
        const np = user.points + points
        const ts = user.totalSpent + points
        let ml = user.membershipLevel
        if (ts >= 10000) ml = '钻石会员'
        else if (ts >= 5000) ml = '金卡会员'
        else if (ts >= 2000) ml = '银卡会员'
        set({ user: { ...user, points: np, totalSpent: ts, membershipLevel: ml } })
      },
      deductPoints: (points) => set({ user: { ...get().user, points: Math.max(0, get().user.points - points) } }),

      toggleFavorite: (dishId) => {
        const favs = get().user.favoriteDishes
        const newFavs = favs.includes(dishId) ? favs.filter(id => id !== dishId) : [...favs, dishId]
        set({ user: { ...get().user, favoriteDishes: newFavs } })
      },
      isFavorite: (dishId) => get().user.favoriteDishes.includes(dishId),

      addCoupon: (coupon) => {
        set({ user: { ...get().user, coupons: [...get().user.coupons, { ...coupon, acquiredAt: new Date().toISOString() }] } })
      },
      useCoupon: (couponId) => {
        set({ user: { ...get().user, coupons: get().user.coupons.map(c => c.id === couponId ? { ...c, isUsed: true } : c) } })
      },

      addReview: (review) => set({ reviews: [...get().reviews, review] }),

      setOrders: (orders) => set({ orders }),
      addOrder: (order) => set({ orders: [order, ...get().orders] }),
      updateOrderStatus: (orderId, status) => {
        set({ orders: get().orders.map(o => o.id === orderId ? { ...o, status } : o) })
      },

      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'restaurant-storage',
      partialize: (state) => ({
        cart: state.cart,
        user: state.user,
        orders: state.orders,
        reviews: state.reviews,
      }),
    }
  )
)
