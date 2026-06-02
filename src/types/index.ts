export interface Dish {
  id: string
  name: string
  categoryId: string
  price: number
  originalPrice?: number
  description: string
  image: string
  spicyLevel?: 0 | 1 | 2 | 3
  isRecommended?: boolean
  isNew?: boolean
  salesCount: number
  ingredients?: string[]
  cookingTime?: string // 如 "15分钟"
  likes: number
  rating: number // 1-5
  reviewCount: number
}

export interface Category {
  id: string
  name: string
  icon: string
  sort: number
}

export interface CartItem {
  dishId: string
  quantity: number
}

export interface Review {
  id: string
  dishId: string
  userId: number
  userName: string
  rating: number
  content: string
  createdAt: string
}

export interface Coupon {
  id: string
  name: string
  type: 'full_reduction' | 'discount' | 'free_dish'
  threshold: number // 满多少可用
  reduce: number // 减多少 / 折扣率(如85表示8.5折)
  freeDishId?: string
  expireDays: number
  isUsed?: boolean
  acquiredAt?: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  discount: number
  finalTotal: number
  pointsEarned: number
  pointsUsed: number
  couponUsed?: Coupon
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled'
  createdAt: string
  tableNumber?: string
  remark?: string
}

export interface User {
  id: number
  phone: string
  name: string
  avatar: string
  points: number
  membershipLevel: '普通会员' | '银卡会员' | '金卡会员' | '钻石会员'
  totalSpent: number
  joinDate: string
  favoriteDishes: string[]
  coupons: Coupon[]
}

export type PageTab = 'home' | 'menu' | 'cart' | 'account'

export interface Analytics {
  todayOrders: number
  todayRevenue: number
  weekRevenue: number
  monthRevenue: number
  popularDishes: { dishId: string; count: number }[]
  hourlyOrders: { hour: number; count: number }[]
  membershipDistribution: { level: string; count: number }[]
}
