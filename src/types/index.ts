export interface Dish {
  id: string
  name: string
  categoryId: string
  price: number
  originalPrice?: number
  description: string
  image: string // emoji
  spicyLevel?: 0 | 1 | 2 | 3
  isRecommended?: boolean
  isNew?: boolean
  salesCount: number
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

export interface Order {
  id: string
  items: CartItem[]
  total: number
  discount: number
  finalTotal: number
  pointsEarned: number
  pointsUsed: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
  tableNumber?: string
  remark?: string
}

export interface User {
  name: string
  phone: string
  avatar: string
  points: number
  membershipLevel: '普通会员' | '银卡会员' | '金卡会员' | '钻石会员'
  totalSpent: number
  joinDate: string
}

export type PageTab = 'home' | 'menu' | 'cart' | 'account'
