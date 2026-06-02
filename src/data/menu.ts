import { Category, Dish, Coupon } from '../types'

export const categories: Category[] = [
  { id: 'recommend', name: '推荐', icon: '🔥', sort: 0 },
  { id: 'cold', name: '凉菜', icon: '🥗', sort: 1 },
  { id: 'hot', name: '热菜', icon: '🍳', sort: 2 },
  { id: 'soup', name: '汤品', icon: '🍲', sort: 3 },
  { id: 'staple', name: '主食', icon: '🍚', sort: 4 },
  { id: 'drink', name: '饮品', icon: '🧃', sort: 5 },
  { id: 'dessert', name: '甜品', icon: '🍰', sort: 6 },
]

export const dishes: Dish[] = [
  // 推荐
  { id: 'd1', name: '招牌红烧肉', categoryId: 'recommend', price: 58, description: '精选五花肉，慢炖两小时，肥而不腻入口即化', image: '🍖', isRecommended: true, salesCount: 3280, ingredients: ['五花肉', '冰糖', '酱油', '八角', '桂皮'], cookingTime: '约25分钟', likes: 1280, rating: 4.8, reviewCount: 356 },
  { id: 'd2', name: '清蒸鲈鱼', categoryId: 'recommend', price: 68, description: '新鲜鲈鱼清蒸，保留原汁原味，鲜嫩爽滑', image: '🐟', isRecommended: true, salesCount: 2560, ingredients: ['鲈鱼', '姜丝', '葱段', '蒸鱼豉油'], cookingTime: '约20分钟', likes: 980, rating: 4.7, reviewCount: 245 },
  { id: 'd3', name: '口水鸡', categoryId: 'recommend', price: 38, description: '麻辣鲜香，鸡肉嫩滑，经典川味凉菜', image: '🐔', spicyLevel: 2, isRecommended: true, salesCount: 1890, ingredients: ['鸡腿肉', '花椒', '辣椒油', '芝麻', '花生碎'], cookingTime: '约15分钟', likes: 756, rating: 4.6, reviewCount: 189 },
  { id: 'd4', name: '糖醋里脊', categoryId: 'recommend', price: 42, description: '外酥里嫩，酸甜可口，老少皆宜', image: '🍯', isRecommended: true, salesCount: 2150, ingredients: ['猪里脊', '番茄酱', '白糖', '白醋', '淀粉'], cookingTime: '约20分钟', likes: 890, rating: 4.5, reviewCount: 210 },

  // 凉菜
  { id: 'd5', name: '蒜泥白肉', categoryId: 'cold', price: 32, description: '薄切五花肉配蒜泥酱汁，蒜香浓郁', image: '🥩', spicyLevel: 1, salesCount: 980, ingredients: ['五花肉', '蒜泥', '生抽', '辣椒油'], cookingTime: '约10分钟', likes: 420, rating: 4.4, reviewCount: 98 },
  { id: 'd6', name: '凉拌黄瓜', categoryId: 'cold', price: 16, description: '清脆爽口，解腻开胃', image: '🥒', salesCount: 1560, ingredients: ['黄瓜', '蒜末', '醋', '香油', '盐'], cookingTime: '约5分钟', likes: 520, rating: 4.2, reviewCount: 134 },
  { id: 'd7', name: '皮蛋豆腐', categoryId: 'cold', price: 18, description: '嫩滑豆腐配松花蛋，经典搭配', image: '🥚', salesCount: 1200, ingredients: ['内酯豆腐', '松花蛋', '生抽', '香油'], cookingTime: '约5分钟', likes: 380, rating: 4.3, reviewCount: 87 },
  { id: 'd8', name: '夫妻肺片', categoryId: 'cold', price: 36, description: '牛肉牛杂切片，红油麻辣鲜香', image: '🌶️', spicyLevel: 3, salesCount: 850, ingredients: ['牛肉', '牛肚', '牛舌', '红油', '花椒'], cookingTime: '约10分钟', likes: 340, rating: 4.6, reviewCount: 76 },
  { id: 'd9', name: '凉拌木耳', categoryId: 'cold', price: 22, description: '脆嫩黑木耳配香菜辣椒油', image: '🫘', spicyLevel: 1, salesCount: 670, ingredients: ['黑木耳', '香菜', '辣椒油', '醋'], cookingTime: '约8分钟', likes: 280, rating: 4.1, reviewCount: 54 },

  // 热菜
  { id: 'd10', name: '麻婆豆腐', categoryId: 'hot', price: 28, description: '麻辣嫩滑，下饭神器', image: '🧈', spicyLevel: 2, salesCount: 2100, ingredients: ['嫩豆腐', '牛肉末', '豆瓣酱', '花椒粉'], cookingTime: '约15分钟', likes: 850, rating: 4.7, reviewCount: 256 },
  { id: 'd11', name: '宫保鸡丁', categoryId: 'hot', price: 38, description: '花生鸡丁爆炒，甜辣适中', image: '🍗', spicyLevel: 1, salesCount: 1850, ingredients: ['鸡胸肉', '花生米', '干辣椒', '黄瓜丁'], cookingTime: '约15分钟', likes: 720, rating: 4.5, reviewCount: 198 },
  { id: 'd12', name: '鱼香肉丝', categoryId: 'hot', price: 32, description: '酸甜微辣，肉丝嫩滑', image: '🥢', spicyLevel: 1, salesCount: 1980, ingredients: ['猪里脊', '木耳', '胡萝卜', '泡椒'], cookingTime: '约12分钟', likes: 680, rating: 4.4, reviewCount: 176 },
  { id: 'd13', name: '干煸四季豆', categoryId: 'hot', price: 26, description: '四季豆干煸至表皮微焦，椒盐风味', image: '🫛', salesCount: 1320, ingredients: ['四季豆', '猪肉末', '干辣椒', '花椒'], cookingTime: '约12分钟', likes: 450, rating: 4.3, reviewCount: 98 },
  { id: 'd14', name: '水煮牛肉', categoryId: 'hot', price: 58, description: '牛肉片嫩滑，麻辣汤底配豆芽', image: '🥘', spicyLevel: 3, salesCount: 1650, ingredients: ['牛肉', '豆芽', '干辣椒', '花椒', '豆瓣酱'], cookingTime: '约20分钟', likes: 620, rating: 4.8, reviewCount: 187 },
  { id: 'd15', name: '回锅肉', categoryId: 'hot', price: 36, description: '五花肉配蒜苗豆瓣酱爆炒', image: '🥓', spicyLevel: 1, salesCount: 1430, ingredients: ['五花肉', '蒜苗', '豆瓣酱', '豆豉'], cookingTime: '约15分钟', likes: 540, rating: 4.6, reviewCount: 145 },
  { id: 'd16', name: '红烧排骨', categoryId: 'hot', price: 52, description: '排骨软烂入味，酱汁浓郁', image: '🦴', salesCount: 1780, ingredients: ['猪排骨', '冰糖', '酱油', '料酒', '姜'], cookingTime: '约35分钟', likes: 710, rating: 4.7, reviewCount: 198 },
  { id: 'd17', name: '蒜蓉西兰花', categoryId: 'hot', price: 24, description: '清炒西兰花，蒜香清爽', image: '🥦', salesCount: 920, ingredients: ['西兰花', '蒜末', '盐', '蚝油'], cookingTime: '约8分钟', likes: 320, rating: 4.2, reviewCount: 67 },

  // 汤品
  { id: 'd18', name: '酸辣汤', categoryId: 'soup', price: 22, description: '酸辣开胃，料足味浓', image: '🥣', spicyLevel: 2, salesCount: 1100, ingredients: ['豆腐', '木耳', '鸡蛋', '胡椒粉', '醋'], cookingTime: '约10分钟', likes: 380, rating: 4.3, reviewCount: 89 },
  { id: 'd19', name: '番茄蛋花汤', categoryId: 'soup', price: 18, description: '经典家常汤品，酸甜可口', image: '🍅', salesCount: 1450, ingredients: ['番茄', '鸡蛋', '葱花', '盐'], cookingTime: '约8分钟', likes: 450, rating: 4.1, reviewCount: 102 },
  { id: 'd20', name: '排骨莲藕汤', categoryId: 'soup', price: 38, description: '慢炖排骨配粉糯莲藕', image: '🫕', salesCount: 890, ingredients: ['排骨', '莲藕', '枸杞', '姜片'], cookingTime: '约40分钟', likes: 340, rating: 4.6, reviewCount: 78 },
  { id: 'd21', name: '菌菇鸡汤', categoryId: 'soup', price: 48, description: '土鸡配多种菌菇，鲜美滋补', image: '🍄', salesCount: 760, ingredients: ['土鸡', '香菇', '姬松茸', '枸杞'], cookingTime: '约50分钟', likes: 310, rating: 4.7, reviewCount: 65 },

  // 主食
  { id: 'd22', name: '蛋炒饭', categoryId: 'staple', price: 18, description: '粒粒分明的经典蛋炒饭', image: '🍳', salesCount: 2300, ingredients: ['米饭', '鸡蛋', '葱花', '胡萝卜丁'], cookingTime: '约8分钟', likes: 680, rating: 4.2, reviewCount: 186 },
  { id: 'd23', name: '手工水饺', categoryId: 'staple', price: 28, description: '猪肉白菜馅，现包现煮', image: '🥟', salesCount: 1680, ingredients: ['面粉', '猪肉', '白菜', '姜'], cookingTime: '约20分钟', likes: 590, rating: 4.5, reviewCount: 134 },
  { id: 'd24', name: '阳春面', categoryId: 'staple', price: 16, description: '清汤细面，简单美味', image: '🍜', salesCount: 1340, ingredients: ['面条', '葱花', '酱油', '猪油'], cookingTime: '约10分钟', likes: 420, rating: 4.0, reviewCount: 89 },
  { id: 'd25', name: '白米饭', categoryId: 'staple', price: 3, description: '东北优质大米', image: '🍚', salesCount: 5200, ingredients: ['东北大米'], cookingTime: '约30分钟', likes: 200, rating: 4.0, reviewCount: 45 },
  { id: 'd26', name: '葱油饼', categoryId: 'staple', price: 12, description: '外酥里软，葱香四溢', image: '🫓', salesCount: 980, ingredients: ['面粉', '葱花', '油', '五香粉'], cookingTime: '约10分钟', likes: 360, rating: 4.3, reviewCount: 67 },

  // 饮品
  { id: 'd27', name: '冰镇酸梅汤', categoryId: 'drink', price: 12, description: '古法熬制，解腻消暑', image: '🧊', salesCount: 2100, ingredients: ['乌梅', '山楂', '桂花', '冰糖'], cookingTime: '即上', likes: 780, rating: 4.6, reviewCount: 210 },
  { id: 'd28', name: '现榨橙汁', categoryId: 'drink', price: 18, description: '新鲜橙子现榨，维C满满', image: '🍊', salesCount: 1560, ingredients: ['新鲜橙子'], cookingTime: '即上', likes: 540, rating: 4.4, reviewCount: 134 },
  { id: 'd29', name: '龙井茶', categoryId: 'drink', price: 28, description: '西湖龙井，清香回甘', image: '🍵', salesCount: 890, ingredients: ['西湖龙井茶叶'], cookingTime: '即上', likes: 320, rating: 4.5, reviewCount: 76 },
  { id: 'd30', name: '椰奶', categoryId: 'drink', price: 10, description: '清甜椰奶，冰镇更佳', image: '🥥', salesCount: 1340, ingredients: ['椰浆', '牛奶', '白糖'], cookingTime: '即上', likes: 410, rating: 4.2, reviewCount: 89 },

  // 甜品
  { id: 'd31', name: '红豆双皮奶', categoryId: 'dessert', price: 16, description: '奶香浓郁，红豆甜蜜', image: '🍮', salesCount: 1250, ingredients: ['牛奶', '鸡蛋清', '红豆', '白糖'], cookingTime: '约15分钟', likes: 560, rating: 4.5, reviewCount: 145 },
  { id: 'd32', name: '芒果布丁', categoryId: 'dessert', price: 15, description: '新鲜芒果制作，Q弹爽滑', image: '🥭', salesCount: 1100, ingredients: ['芒果', '牛奶', '吉利丁', '奶油'], cookingTime: '约10分钟', likes: 480, rating: 4.3, reviewCount: 98 },
  { id: 'd33', name: '桂花糯米藕', categoryId: 'dessert', price: 22, description: '糯米灌藕，桂花蜜汁', image: '🌸', salesCount: 780, ingredients: ['莲藕', '糯米', '桂花', '蜂蜜'], cookingTime: '约25分钟', likes: 290, rating: 4.6, reviewCount: 56 },
  { id: 'd34', name: '酒酿圆子', categoryId: 'dessert', price: 14, description: '软糯小圆子配甜酒酿', image: '🫕', salesCount: 920, ingredients: ['糯米粉', '酒酿', '枸杞', '冰糖'], cookingTime: '约10分钟', likes: 350, rating: 4.4, reviewCount: 72 },
]

export const getDishById = (id: string): Dish | undefined => dishes.find(d => d.id === id)

export const getDishesByCategory = (categoryId: string): Dish[] => {
  if (categoryId === 'recommend') return dishes.filter(d => d.isRecommended)
  return dishes.filter(d => d.categoryId === categoryId)
}

export const searchDishes = (keyword: string): Dish[] => {
  if (!keyword.trim()) return []
  const kw = keyword.toLowerCase()
  return dishes.filter(d =>
    d.name.toLowerCase().includes(kw) ||
    d.description.toLowerCase().includes(kw) ||
    d.ingredients?.some(i => i.toLowerCase().includes(kw))
  )
}

export const getCategoryName = (categoryId: string): string => {
  return categories.find(c => c.id === categoryId)?.name || ''
}

// ===== 优惠券模板 =====
export const couponTemplates: Coupon[] = [
  { id: 'c_new_user', name: '新客专享券', type: 'full_reduction', threshold: 50, reduce: 10, expireDays: 7 },
  { id: 'c_100_15', name: '满100减15', type: 'full_reduction', threshold: 100, reduce: 15, expireDays: 30 },
  { id: 'c_200_30', name: '满200减30', type: 'full_reduction', threshold: 200, reduce: 30, expireDays: 30 },
  { id: 'c_85', name: '全场8.5折', type: 'discount', threshold: 0, reduce: 85, expireDays: 15 },
  { id: 'c_90', name: '全场9折', type: 'discount', threshold: 0, reduce: 90, expireDays: 30 },
  { id: 'c_weekend', name: '周末特惠券', type: 'full_reduction', threshold: 80, reduce: 12, expireDays: 3 },
]

// Mock reviews data
export const mockReviews: import('../types').Review[] = [
  { id: 'r1', dishId: 'd1', userId: 1, userName: '老顾客张', rating: 5, content: '每次来都必点！肉炖得特别烂，入口即化', createdAt: '2026-05-28' },
  { id: 'r2', dishId: 'd1', userId: 2, userName: '吃货小李', rating: 5, content: '分量足，味道正宗，就是稍微有点甜', createdAt: '2026-05-25' },
  { id: 'r3', dishId: 'd1', userId: 3, userName: '美食达人', rating: 4, content: '色香味俱全，配米饭绝了', createdAt: '2026-05-20' },
  { id: 'r4', dishId: 'd3', userId: 1, userName: '老顾客张', rating: 5, content: '麻辣适中，鸡肉很嫩，红油特别香', createdAt: '2026-05-26' },
  { id: 'r5', dishId: 'd10', userId: 2, userName: '吃货小李', rating: 4, content: '下饭一绝！豆腐嫩滑，但是花椒再多一点就好了', createdAt: '2026-05-22' },
  { id: 'r6', dishId: 'd14', userId: 3, userName: '美食达人', rating: 5, content: '牛肉片切得很薄，入口即化，配豆芽绝配', createdAt: '2026-05-18' },
]
