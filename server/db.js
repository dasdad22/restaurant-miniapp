import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, 'data.json')

// 初始化数据文件
function initDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({
      users: [],
      codes: [],
      orders: [],
    }, null, 2))
  }
}

function readDB() {
  initDB()
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

// ===== User =====
export function findUserByPhone(phone) {
  const db = readDB()
  return db.users.find(u => u.phone === phone) || null
}

export function findUserById(id) {
  const db = readDB()
  return db.users.find(u => u.id === id) || null
}

export function createUser(phone) {
  const db = readDB()
  const id = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1
  const user = {
    id,
    phone,
    name: '美食爱好者',
    avatar: '😊',
    points: 50,
    membership_level: '普通会员',
    total_spent: 0,
    created_at: new Date().toISOString(),
  }
  db.users.push(user)
  writeDB(db)
  return user
}

export function updateUser(id, updates) {
  const db = readDB()
  const idx = db.users.findIndex(u => u.id === id)
  if (idx === -1) return null
  db.users[idx] = { ...db.users[idx], ...updates }
  writeDB(db)
  return db.users[idx]
}

// ===== Verification Code =====
export function saveCode(phone, code) {
  const db = readDB()
  const record = {
    id: db.codes.length > 0 ? Math.max(...db.codes.map(c => c.id)) + 1 : 1,
    phone,
    code,
    expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    used: 0,
  }
  db.codes.push(record)
  // 标记旧验证码为已使用
  db.codes.forEach(c => {
    if (c.phone === phone && c.id !== record.id && !c.used) {
      c.used = 1
    }
  })
  writeDB(db)
  return record
}

export function verifyCode(phone, code) {
  const db = readDB()
  const record = db.codes
    .filter(c => c.phone === phone && c.code === code && !c.used)
    .sort((a, b) => b.id - a.id)[0]

  if (!record) return { valid: false, error: '验证码错误' }
  if (new Date(record.expires_at) < new Date()) return { valid: false, error: '验证码已过期' }

  // 标记已使用
  const idx = db.codes.findIndex(c => c.id === record.id)
  db.codes[idx].used = 1
  writeDB(db)
  return { valid: true }
}

// ===== Orders =====
export function createOrder(orderData) {
  const db = readDB()
  db.orders.push(orderData)
  writeDB(db)
  return orderData
}

export function findOrdersByUserId(userId) {
  const db = readDB()
  return db.orders
    .filter(o => o.user_id === userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

export function findOrderByIdAndUser(id, userId) {
  const db = readDB()
  return db.orders.find(o => o.id === id && o.user_id === userId) || null
}

export { initDB, readDB, writeDB }
