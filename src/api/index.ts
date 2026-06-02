const API_BASE = '/api'

function getToken(): string | null {
  return localStorage.getItem('token')
}

async function request<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || '请求失败')
  }

  return data
}

export const api = {
  // 发送验证码
  sendCode: (phone: string) =>
    request<{ success: boolean; code?: string }>('/auth/send-code', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  // 登录/注册
  login: (phone: string, code: string) =>
    request<{
      success: boolean
      token: string
      user: {
        id: number
        phone: string
        name: string
        avatar: string
        points: number
        membershipLevel: string
        totalSpent: number
        joinDate: string
      }
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    }),

  // 获取用户信息
  getProfile: () => request('/orders/profile'),

  // 创建订单
  createOrder: (data: {
    items: { dishId: string; quantity: number }[]
    total: number
    discount: number
    finalTotal: number
    pointsEarned: number
    pointsUsed: number
    tableNumber?: string
    remark?: string
  }) =>
    request<{
      success: boolean
      order: any
      user: { points: number; membershipLevel: string; totalSpent: number }
    }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 获取订单列表
  getOrders: () => request<{ orders: any[] }>('/orders'),

  // 获取订单详情
  getOrder: (id: string) => request<any>(`/orders/${id}`),
}
