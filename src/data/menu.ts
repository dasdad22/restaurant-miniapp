import { Category, Dish } from '../types'

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
  { id: 'd1', name: '招牌红烧肉', categoryId: 'recommend', price: 58, description: '精选五花肉，慢炖两小时，肥而不腻入口即化', image: '🍖', isRecommended: true, salesCount: 3280 },
  { id: 'd2', name: '清蒸鲈鱼', categoryId: 'recommend', price: 68, description: '新鲜鲈鱼清蒸，保留原汁原味，鲜嫩爽滑', image: '🐟', isRecommended: true, salesCount: 2560 },
  { id: 'd3', name: '口水鸡', categoryId: 'recommend', price: 38, description: '麻辣鲜香，鸡肉嫩滑，经典川味凉菜', image: '🐔', spicyLevel: 2, isRecommended: true, salesCount: 1890 },
  { id: 'd4', name: '糖醋里脊', categoryId: 'recommend', price: 42, description: '外酥里嫩，酸甜可口，老少皆宜', image: '🍯', isRecommended: true, salesCount: 2150 },

  // 凉菜
  { id: 'd5', name: '蒜泥白肉', categoryId: 'cold', price: 32, description: '薄切五花肉配蒜泥酱汁，蒜香浓郁', image: '🥩', spicyLevel: 1, salesCount: 980 },
  { id: 'd6', name: '凉拌黄瓜', categoryId: 'cold', price: 16, description: '清脆爽口，解腻开胃', image: '🥒', salesCount: 1560 },
  { id: 'd7', name: '皮蛋豆腐', categoryId: 'cold', price: 18, description: '嫩滑豆腐配松花蛋，经典搭配', image: '🥚', salesCount: 1200 },
  { id: 'd8', name: '夫妻肺片', categoryId: 'cold', price: 36, description: '牛肉牛杂切片，红油麻辣鲜香', image: '🌶️', spicyLevel: 3, salesCount: 850 },
  { id: 'd9', name: '凉拌木耳', categoryId: 'cold', price: 22, description: '脆嫩黑木耳配香菜辣椒油', image: '🫘', spicyLevel: 1, salesCount: 670 },

  // 热菜
  { id: 'd10', name: '麻婆豆腐', categoryId: 'hot', price: 28, description: '麻辣嫩滑，下饭神器', image: '🧈', spicyLevel: 2, salesCount: 2100 },
  { id: 'd11', name: '宫保鸡丁', categoryId: 'hot', price: 38, description: '花生鸡丁爆炒，甜辣适中', image: '🍗', spicyLevel: 1, salesCount: 1850 },
  { id: 'd12', name: '鱼香肉丝', categoryId: 'hot', price: 32, description: '酸甜微辣，肉丝嫩滑', image: '🥢', spicyLevel: 1, salesCount: 1980 },
  { id: 'd13', name: '干煸四季豆', categoryId: 'hot', price: 26, description: '四季豆干煸至表皮微焦，椒盐风味', image: '🫛', salesCount: 1320 },
  { id: 'd14', name: '水煮牛肉', categoryId: 'hot', price: 58, description: '牛肉片嫩滑，麻辣汤底配豆芽', image: '🥘', spicyLevel: 3, salesCount: 1650 },
  { id: 'd15', name: '回锅肉', categoryId: 'hot', price: 36, description: '五花肉配蒜苗豆瓣酱爆炒', image: '🥓', spicyLevel: 1, salesCount: 1430 },
  { id: 'd16', name: '红烧排骨', categoryId: 'hot', price: 52, description: '排骨软烂入味，酱汁浓郁', image: '🦴', salesCount: 1780 },
  { id: 'd17', name: '蒜蓉西兰花', categoryId: 'hot', price: 24, description: '清炒西兰花，蒜香清爽', image: '🥦', salesCount: 920 },

  // 汤品
  { id: 'd18', name: '酸辣汤', categoryId: 'soup', price: 22, description: '酸辣开胃，料足味浓', image: '🥣', spicyLevel: 2, salesCount: 1100 },
  { id: 'd19', name: '番茄蛋花汤', categoryId: 'soup', price: 18, description: '经典家常汤品，酸甜可口', image: '🍅', salesCount: 1450 },
  { id: 'd20', name: '排骨莲藕汤', categoryId: 'soup', price: 38, description: '慢炖排骨配粉糯莲藕', image: '🫕', salesCount: 890 },
  { id: 'd21', name: '菌菇鸡汤', categoryId: 'soup', price: 48, description: '土鸡配多种菌菇，鲜美滋补', image: '🍄', salesCount: 760 },

  // 主食
  { id: 'd22', name: '蛋炒饭', categoryId: 'staple', price: 18, description: '粒粒分明的经典蛋炒饭', image: '🍳', salesCount: 2300 },
  { id: 'd23', name: '手工水饺', categoryId: 'staple', price: 28, description: '猪肉白菜馅，现包现煮', image: '🥟', salesCount: 1680 },
  { id: 'd24', name: '阳春面', categoryId: 'staple', price: 16, description: '清汤细面，简单美味', image: '🍜', salesCount: 1340 },
  { id: 'd25', name: '白米饭', categoryId: 'staple', price: 3, description: '东北优质大米', image: '🍚', salesCount: 5200 },
  { id: 'd26', name: '葱油饼', categoryId: 'staple', price: 12, description: '外酥里软，葱香四溢', image: '🫓', salesCount: 980 },

  // 饮品
  { id: 'd27', name: '冰镇酸梅汤', categoryId: 'drink', price: 12, description: '古法熬制，解腻消暑', image: '🧊', salesCount: 2100 },
  { id: 'd28', name: '现榨橙汁', categoryId: 'drink', price: 18, description: '新鲜橙子现榨，维C满满', image: '🍊', salesCount: 1560 },
  { id: 'd29', name: '龙井茶', categoryId: 'drink', price: 28, description: '西湖龙井，清香回甘', image: '🍵', salesCount: 890 },
  { id: 'd30', name: '椰奶', categoryId: 'drink', price: 10, description: '清甜椰奶，冰镇更佳', image: '🥥', salesCount: 1340 },

  // 甜品
  { id: 'd31', name: '红豆双皮奶', categoryId: 'dessert', price: 16, description: '奶香浓郁，红豆甜蜜', image: '🍮', salesCount: 1250 },
  { id: 'd32', name: '芒果布丁', categoryId: 'dessert', price: 15, description: '新鲜芒果制作，Q弹爽滑', image: '🥭', salesCount: 1100 },
  { id: 'd33', name: '桂花糯米藕', categoryId: 'dessert', price: 22, description: '糯米灌藕，桂花蜜汁', image: '🌸', salesCount: 780 },
  { id: 'd34', name: '酒酿圆子', categoryId: 'dessert', price: 14, description: '软糯小圆子配甜酒酿', image: '🫕', salesCount: 920 },
]

export const getDishById = (id: string): Dish | undefined => dishes.find(d => d.id === id)

export const getDishesByCategory = (categoryId: string): Dish[] => {
  if (categoryId === 'recommend') {
    return dishes.filter(d => d.isRecommended)
  }
  return dishes.filter(d => d.categoryId === categoryId)
}

export const getCategoryName = (categoryId: string): string => {
  const cat = categories.find(c => c.id === categoryId)
  return cat?.name || ''
}
