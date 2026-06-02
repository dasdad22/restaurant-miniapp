import { useState, useRef } from 'react'
import { api } from '../api'

interface Props {
  onLoginSuccess: () => void
  onGuestLogin: () => void
}

export default function LoginPage({ onLoginSuccess, onGuestLogin }: Props) {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const timerRef = useRef<number>(0)

  const startCountdown = () => {
    setCountdown(60)
    timerRef.current = window.setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSendCode = async () => {
    setError('')
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入正确的手机号')
      return
    }
    setLoading(true)
    try {
      const res = await api.sendCode(phone)
      setCodeSent(true)
      startCountdown()

      if (res.code) {
        setCode(res.code)
      }
    } catch (err: any) {
      setError(err.message || '发送失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    setError('')
    if (!code || code.length < 6) {
      setError('请输入6位验证码')
      return
    }
    setLoading(true)
    try {
      const res = await api.login(phone, code)
      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.user))
      localStorage.removeItem('isGuest')
      onLoginSuccess()
    } catch (err: any) {
      setError(err.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-red-500 px-6 pt-16 pb-12 rounded-b-3xl flex-shrink-0">
        <div className="text-center">
          <div className="text-6xl mb-3">🏮</div>
          <h1 className="text-2xl font-bold text-white">美味餐厅</h1>
          <p className="text-white/70 text-sm mt-1">登录享受会员积分与专属优惠</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pt-8 flex flex-col">
        <div className="space-y-4 flex-1">
          {/* Phone Input */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">📱 手机号</label>
            <div className="flex gap-3">
              <input
                type="tel"
                maxLength={11}
                value={phone}
                onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setError('') }}
                placeholder="输入手机号"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              <button
                onClick={handleSendCode}
                disabled={loading || countdown > 0}
                className={`flex-shrink-0 px-5 py-3 rounded-xl text-sm font-medium transition-colors ${
                  countdown > 0
                    ? 'bg-gray-200 text-gray-400'
                    : 'bg-primary text-white active:bg-primary-dark'
                }`}
              >
                {loading ? '发送中...' : countdown > 0 ? `${countdown}s` : codeSent ? '重新获取' : '获取验证码'}
              </button>
            </div>
          </div>

          {/* Code Input */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">🔑 验证码</label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setError('') }}
              placeholder="输入6位验证码"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors tracking-widest text-center text-lg"
            />
            <p className="text-xs text-gray-400 mt-1 text-center">
              {codeSent ? '验证码已发送，5分钟内有效' : '请输入手机号获取验证码'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded-xl text-center">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading || !phone || !code}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold text-base active:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30"
          >
            {loading ? '登录中...' : '登 录'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            未注册手机号将自动注册 · 新用户送50积分
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">其他方式</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Guest Login */}
        <button
          onClick={onGuestLogin}
          className="w-full bg-gray-100 text-gray-600 py-3.5 rounded-xl font-medium text-base active:bg-gray-200 transition-colors mb-8"
        >
          👤 游客登录 · 直接进入
        </button>
      </div>
    </div>
  )
}
