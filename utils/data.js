/**
 * 大学生校园减肥食物库 & 运动 & 奖励数据
 * 所有食物均为大学食堂/超市/宿舍可直接获取，无需烹饪
 * 清真饮食标准：无猪肉、无酒精
 */

// ==================== 食物分类 ====================
const foodCategories = [
  { id: 'canteen', name: '食堂减脂餐', icon: '🥗', desc: '食堂窗口直接打' },
  { id: 'grain', name: '粗粮主食', icon: '🌽', desc: '食堂/超市/路边摊' },
  { id: 'protein', name: '蛋白质', icon: '🥚', desc: '食堂/超市轻松买' },
  { id: 'fruit', name: '水果', icon: '🍎', desc: '水果店/超市/美团' },
  { id: 'veggie', name: '蔬菜', icon: '🥬', desc: '食堂/沙拉店/便利店' },
  { id: 'drink', name: '饮品', icon: '🥛', desc: '超市/便利店/咖啡店' },
  { id: 'snack', name: '零食加餐', icon: '🍫', desc: '控制量可以吃' },
  { id: 'custom', name: '⭐ 自定义', icon: '✏️', desc: '自己添加的食物' }
];

// ==================== 校园食物库 ====================
const defaultFoods = [
  // ---------- 食堂减脂餐 ----------
  { id: 'c1', category: 'canteen', name: '食堂减脂餐（一荤两素）', calories: 450, unit: '份', icon: '🥗', protein: 28, carbs: 45, fat: 12, isCustom: false },
  { id: 'c2', category: 'canteen', name: '食堂减脂餐（两素）', calories: 300, unit: '份', icon: '🥬', protein: 12, carbs: 35, fat: 8, isCustom: false },
  { id: 'c3', category: 'canteen', name: '食堂清真鸡腿饭（去皮）', calories: 420, unit: '份', icon: '🍗', protein: 32, carbs: 40, fat: 14, isCustom: false },
  { id: 'c4', category: 'canteen', name: '食堂清真牛肉面（少面多菜）', calories: 480, unit: '碗', icon: '🍜', protein: 25, carbs: 50, fat: 16, isCustom: false },
  { id: 'c5', category: 'canteen', name: '食堂素菜麻辣烫（清汤）', calories: 280, unit: '碗', icon: '🥘', protein: 10, carbs: 25, fat: 12, isCustom: false },
  { id: 'c6', category: 'canteen', name: '食堂清真麻辣烫（加牛肉）', calories: 420, unit: '碗', icon: '🥘', protein: 28, carbs: 30, fat: 18, isCustom: false },
  { id: 'c7', category: 'canteen', name: '食堂素馅包子（2个）', calories: 280, unit: '份', icon: '🥟', protein: 10, carbs: 42, fat: 8, isCustom: false },
  { id: 'c8', category: 'canteen', name: '清真食堂炒菜（少油）', calories: 380, unit: '份', icon: '🍳', protein: 22, carbs: 30, fat: 16, isCustom: false },
  { id: 'c9', category: 'canteen', name: '食堂凉皮/凉面（小份）', calories: 300, unit: '份', icon: '🍝', protein: 8, carbs: 48, fat: 10, isCustom: false },

  // ---------- 粗粮主食 ----------
  { id: 'g1', category: 'grain', name: '煮玉米（中等1根）', calories: 150, unit: '根', icon: '🌽', protein: 5, carbs: 30, fat: 2, isCustom: false },
  { id: 'g2', category: 'grain', name: '烤红薯（中等1个）', calories: 180, unit: '个', icon: '🍠', protein: 3, carbs: 40, fat: 1, isCustom: false },
  { id: 'g3', category: 'grain', name: '即食燕麦片（40g）', calories: 150, unit: '份', icon: '🥣', protein: 5, carbs: 27, fat: 3, isCustom: false },
  { id: 'g4', category: 'grain', name: '全麦面包（2片）', calories: 160, unit: '份', icon: '🍞', protein: 6, carbs: 28, fat: 4, isCustom: false },
  { id: 'g5', category: 'grain', name: '杂粮煎饼（不加脆饼）', calories: 250, unit: '个', icon: '🫓', protein: 8, carbs: 40, fat: 6, isCustom: false },
  { id: 'g6', category: 'grain', name: '紫薯（中等1个）', calories: 130, unit: '个', icon: '🟣', protein: 3, carbs: 28, fat: 1, isCustom: false },
  { id: 'g7', category: 'grain', name: '南瓜（食堂蒸南瓜1份）', calories: 60, unit: '份', icon: '🎃', protein: 2, carbs: 13, fat: 1, isCustom: false },
  { id: 'g8', category: 'grain', name: '糙米饭（食堂1两）', calories: 120, unit: '份', icon: '🍚', protein: 3, carbs: 26, fat: 1, isCustom: false },

  // ---------- 蛋白质 ----------
  { id: 'p1', category: 'protein', name: '水煮蛋（1个）', calories: 75, unit: '个', icon: '🥚', protein: 7, carbs: 1, fat: 5, isCustom: false },
  { id: 'p2', category: 'protein', name: '水煮蛋（2个）', calories: 150, unit: '份', icon: '🥚🥚', protein: 14, carbs: 2, fat: 10, isCustom: false },
  { id: 'p3', category: 'protein', name: '纯牛奶（250ml）', calories: 135, unit: '盒', icon: '🥛', protein: 8, carbs: 12, fat: 7, isCustom: false },
  { id: 'p4', category: 'protein', name: '无糖酸奶（200g）', calories: 100, unit: '杯', icon: '🍶', protein: 8, carbs: 10, fat: 3, isCustom: false },
  { id: 'p5', category: 'protein', name: '即食鸡胸肉（100g）', calories: 130, unit: '袋', icon: '🍗', protein: 28, carbs: 1, fat: 3, isCustom: false },
  { id: 'p6', category: 'protein', name: '即食牛肉（100g）', calories: 160, unit: '袋', icon: '🥩', protein: 30, carbs: 2, fat: 5, isCustom: false },
  { id: 'p7', category: 'protein', name: '卤豆干/豆腐干（100g）', calories: 140, unit: '份', icon: '🫘', protein: 16, carbs: 4, fat: 8, isCustom: false },
  { id: 'p8', category: 'protein', name: '水浸金枪鱼罐头（100g）', calories: 100, unit: '罐', icon: '🐟', protein: 22, carbs: 0, fat: 2, isCustom: false },
  { id: 'p9', category: 'protein', name: '食堂清真红烧鱼块', calories: 220, unit: '份', icon: '🐠', protein: 24, carbs: 5, fat: 14, isCustom: false },

  // ---------- 水果 ----------
  { id: 'f1', category: 'fruit', name: '苹果（中等1个）', calories: 90, unit: '个', icon: '🍎', protein: 0, carbs: 22, fat: 0, isCustom: false },
  { id: 'f2', category: 'fruit', name: '香蕉（中等1根）', calories: 105, unit: '根', icon: '🍌', protein: 1, carbs: 27, fat: 0, isCustom: false },
  { id: 'f3', category: 'fruit', name: '圣女果（15颗）', calories: 60, unit: '份', icon: '🍅', protein: 2, carbs: 12, fat: 1, isCustom: false },
  { id: 'f4', category: 'fruit', name: '橘子/橙子（1个）', calories: 65, unit: '个', icon: '🍊', protein: 1, carbs: 16, fat: 0, isCustom: false },
  { id: 'f5', category: 'fruit', name: '猕猴桃（2个）', calories: 80, unit: '份', icon: '🥝', protein: 2, carbs: 18, fat: 1, isCustom: false },
  { id: 'f6', category: 'fruit', name: '火龙果（半个）', calories: 100, unit: '份', icon: '🐲', protein: 2, carbs: 22, fat: 1, isCustom: false },
  { id: 'f7', category: 'fruit', name: '草莓（15颗）', calories: 70, unit: '份', icon: '🍓', protein: 1, carbs: 16, fat: 0, isCustom: false },
  { id: 'f8', category: 'fruit', name: '蓝莓（1盒125g）', calories: 70, unit: '盒', icon: '🫐', protein: 1, carbs: 17, fat: 0, isCustom: false },
  { id: 'f9', category: 'fruit', name: '西瓜（1牙约300g）', calories: 90, unit: '片', icon: '🍉', protein: 2, carbs: 20, fat: 0, isCustom: false },
  { id: 'f10', category: 'fruit', name: '葡萄（1小串约150g）', calories: 100, unit: '份', icon: '🍇', protein: 1, carbs: 24, fat: 0, isCustom: false },
  { id: 'f11', category: 'fruit', name: '梨（中等1个）', calories: 80, unit: '个', icon: '🍐', protein: 0, carbs: 20, fat: 0, isCustom: false },
  { id: 'f12', category: 'fruit', name: '柚子（3瓣）', calories: 70, unit: '份', icon: '🍈', protein: 1, carbs: 16, fat: 0, isCustom: false },

  // ---------- 蔬菜 ----------
  { id: 'v1', category: 'veggie', name: '食堂清炒时蔬', calories: 80, unit: '份', icon: '🥬', protein: 3, carbs: 10, fat: 5, isCustom: false },
  { id: 'v2', category: 'veggie', name: '凉拌黄瓜', calories: 45, unit: '份', icon: '🥒', protein: 2, carbs: 6, fat: 3, isCustom: false },
  { id: 'v3', category: 'veggie', name: '食堂蔬菜沙拉（无酱）', calories: 80, unit: '份', icon: '🥗', protein: 3, carbs: 12, fat: 2, isCustom: false },
  { id: 'v4', category: 'veggie', name: '食堂蔬菜沙拉（油醋汁）', calories: 140, unit: '份', icon: '🥗', protein: 3, carbs: 14, fat: 8, isCustom: false },
  { id: 'v5', category: 'veggie', name: '水煮西兰花', calories: 50, unit: '份', icon: '🥦', protein: 4, carbs: 8, fat: 1, isCustom: false },
  { id: 'v6', category: 'veggie', name: '凉拌海带丝', calories: 40, unit: '份', icon: '🌿', protein: 2, carbs: 6, fat: 2, isCustom: false },
  { id: 'v7', category: 'veggie', name: '食堂番茄炒蛋', calories: 160, unit: '份', icon: '🍳', protein: 10, carbs: 10, fat: 10, isCustom: false },

  // ---------- 饮品 ----------
  { id: 'd1', category: 'drink', name: '黑咖啡（无糖无奶）', calories: 5, unit: '杯', icon: '☕', protein: 0, carbs: 0, fat: 0, isCustom: false },
  { id: 'd2', category: 'drink', name: '拿铁（无糖）', calories: 120, unit: '杯', icon: '☕', protein: 6, carbs: 10, fat: 6, isCustom: false },
  { id: 'd3', category: 'drink', name: '无糖豆浆（300ml）', calories: 80, unit: '杯', icon: '💧', protein: 6, carbs: 6, fat: 3, isCustom: false },
  { id: 'd4', category: 'drink', name: '零度可乐', calories: 0, unit: '罐', icon: '🥤', protein: 0, carbs: 0, fat: 0, isCustom: false },
  { id: 'd5', category: 'drink', name: '无糖乌龙茶/绿茶', calories: 0, unit: '瓶', icon: '🍵', protein: 0, carbs: 0, fat: 0, isCustom: false },
  { id: 'd6', category: 'drink', name: '柠檬水（无糖）', calories: 10, unit: '杯', icon: '🍋', protein: 0, carbs: 2, fat: 0, isCustom: false },
  { id: 'd7', category: 'drink', name: '白开水', calories: 0, unit: '杯', icon: '💧', protein: 0, carbs: 0, fat: 0, isCustom: false },

  // ---------- 零食加餐 ----------
  { id: 's1', category: 'snack', name: '每日坚果（1包25g）', calories: 140, unit: '包', icon: '🥜', protein: 4, carbs: 5, fat: 12, isCustom: false },
  { id: 's2', category: 'snack', name: '黑巧克力（2小块）', calories: 80, unit: '份', icon: '🍫', protein: 1, carbs: 8, fat: 6, isCustom: false },
  { id: 's3', category: 'snack', name: '红枣（5颗）', calories: 50, unit: '份', icon: '🫘', protein: 1, carbs: 12, fat: 0, isCustom: false },
  { id: 's4', category: 'snack', name: '核桃（3颗）', calories: 70, unit: '份', icon: '🥜', protein: 2, carbs: 2, fat: 7, isCustom: false },
  { id: 's5', category: 'snack', name: '海苔（1小包）', calories: 30, unit: '包', icon: '🫧', protein: 2, carbs: 3, fat: 2, isCustom: false },
  { id: 's6', category: 'snack', name: '蒟蒻果冻（1个）', calories: 20, unit: '个', icon: '🍮', protein: 0, carbs: 5, fat: 0, isCustom: false },
  { id: 's7', category: 'snack', name: '蛋白棒（1根）', calories: 180, unit: '根', icon: '🍫', protein: 15, carbs: 15, fat: 6, isCustom: false },
  { id: 's8', category: 'snack', name: '无糖酸奶+燕麦', calories: 180, unit: '杯', icon: '🍶', protein: 10, carbs: 22, fat: 5, isCustom: false }
];

// ==================== 运动项目（校园友好版） ====================
const defaultExercises = [
  { id: 'ex1', name: '操场慢跑', icon: '🏃‍♀️', calPer30min: 200, unit: '30分钟', isCustom: false },
  { id: 'ex2', name: '操场快走', icon: '🚶‍♀️', calPer30min: 120, unit: '30分钟', isCustom: false },
  { id: 'ex3', name: '宿舍跳绳', icon: '🪢', calPer30min: 280, unit: '30分钟', isCustom: false },
  { id: 'ex4', name: '宿舍瑜伽/拉伸', icon: '🧘‍♀️', calPer30min: 100, unit: '30分钟', isCustom: false },
  { id: 'ex5', name: '帕梅拉/HIIT跟练', icon: '💃', calPer30min: 250, unit: '30分钟', isCustom: false },
  { id: 'ex6', name: '爬楼梯', icon: '🪜', calPer30min: 350, unit: '30分钟', isCustom: false },
  { id: 'ex7', name: '宿舍跳操', icon: '🤸‍♀️', calPer30min: 220, unit: '30分钟', isCustom: false },
  { id: 'ex8', name: '校园骑行', icon: '🚴‍♀️', calPer30min: 180, unit: '30分钟', isCustom: false },
  { id: 'ex9', name: '呼啦圈', icon: '⭕', calPer30min: 150, unit: '30分钟', isCustom: false },
  { id: 'ex10', name: '羽毛球', icon: '🏸', calPer30min: 180, unit: '30分钟', isCustom: false },
  { id: 'ex11', name: '乒乓球', icon: '🏓', calPer30min: 130, unit: '30分钟', isCustom: false },
  { id: 'ex12', name: '篮球（半场）', icon: '🏀', calPer30min: 250, unit: '30分钟', isCustom: false },
  { id: 'ex13', name: '健身房力量训练', icon: '🏋️', calPer30min: 200, unit: '30分钟', isCustom: false },
  { id: 'ex14', name: '游泳', icon: '🏊‍♀️', calPer30min: 300, unit: '30分钟', isCustom: false }
];

// ==================== 奖励列表 ====================
const defaultRewards = [
  { id: 'r1', name: '男友按摩30分钟', icon: '💆‍♀️', points: 50, desc: '专业级肩颈按摩，缓解运动疲劳～', category: 'spa', isCustom: false },
  { id: 'r2', name: '帮拿快递一周', icon: '📦', points: 60, desc: '这一周所有快递我帮你拿！', category: 'lazy', isCustom: false },
  { id: 'r3', name: '约会电影之夜', icon: '🎬', points: 100, desc: '选一部你想看的电影，我备好低脂零食', category: 'date', isCustom: false },
  { id: 'r4', name: '学校周边一日游', icon: '🚗', points: 150, desc: '周末一起去学校周边好玩的地方逛逛', category: 'date', isCustom: false },
  { id: 'r5', name: '新运动服/运动鞋', icon: '👚', points: 300, desc: '选一套你喜欢的运动装备，我来买单', category: 'gift', isCustom: false },
  { id: 'r6', name: '食堂大餐一顿', icon: '🍽️', points: 80, desc: '食堂随便点，今天不计算热量！', category: 'food', isCustom: false },
  { id: 'r7', name: '美甲/美容一次', icon: '💅', points: 200, desc: '预约你最喜欢的美甲店', category: 'spa', isCustom: false },
  { id: 'r8', name: '甜品自由日', icon: '🍰', points: 80, desc: '今天允许吃一块你最爱的甜品', category: 'food', isCustom: false },
  { id: 'r9', name: '男友唱歌给你听', icon: '🎤', points: 40, desc: '点歌服务！3首以内', category: 'fun', isCustom: false },
  { id: 'r10', name: '一束鲜花送到宿舍', icon: '💐', points: 100, desc: '一束精心搭配的鲜花送到你楼下', category: 'gift', isCustom: false },
  { id: 'r11', name: '周末睡到自然醒', icon: '😴', points: 60, desc: '周末不叫你起床，保证不打扰', category: 'lazy', isCustom: false },
  { id: 'r12', name: '情侣校园写真', icon: '📸', points: 350, desc: '约摄影师在校园里拍一组情侣照', category: 'date', isCustom: false },
  { id: 'r13', name: '替他选衣服一次', icon: '👔', points: 50, desc: '他的穿搭你说了算，一天有效', category: 'fun', isCustom: false },
  { id: 'r14', name: '帮你写作业/论文辅助', icon: '📝', points: 500, desc: '帮你查资料、排版、校对（不代写哦）', category: 'lazy', isCustom: false },
  { id: 'r15', name: '图书馆陪学一天', icon: '📚', points: 120, desc: '全程陪你在图书馆学习+端茶递水', category: 'date', isCustom: false }
];

// ==================== 惩罚列表 ====================
const defaultPunishments = [
  { id: 'p1', name: '加练15分钟平板支撑', icon: '😤' },
  { id: 'p2', name: '今天多喝3杯水', icon: '💧' },
  { id: 'p3', name: '明天只吃减脂餐', icon: '🥗' },
  { id: 'p4', name: '给他带一周早餐', icon: '🍳' },
  { id: 'p5', name: '额外操场跑3圈', icon: '🏃‍♀️' },
  { id: 'p6', name: '写一篇减肥日记反思', icon: '📝' },
  { id: 'p7', name: '今晚11点前必须睡', icon: '😴' },
  { id: 'p8', name: '明天多爬一趟楼梯', icon: '🪜' }
];

// ==================== 数据管理函数 ====================

/** 获取所有食物（默认+自定义） */
function getFoods() {
  const customFoods = wx.getStorageSync('customFoods') || [];
  return [...defaultFoods, ...customFoods];
}

/** 获取食物分类列表 */
function getFoodCategories() {
  return foodCategories;
}

/** 添加自定义食物 */
function addCustomFood(food) {
  const customFoods = wx.getStorageSync('customFoods') || [];
  food.id = 'cu_' + Date.now();
  food.isCustom = true;
  food.category = food.category || 'custom';
  customFoods.push(food);
  wx.setStorageSync('customFoods', customFoods);
  return food;
}

/** 删除自定义食物 */
function deleteCustomFood(foodId) {
  let customFoods = wx.getStorageSync('customFoods') || [];
  customFoods = customFoods.filter(f => f.id !== foodId);
  wx.setStorageSync('customFoods', customFoods);
  return customFoods;
}

/** 更新自定义食物 */
function updateCustomFood(foodId, updates) {
  let customFoods = wx.getStorageSync('customFoods') || [];
  const idx = customFoods.findIndex(f => f.id === foodId);
  if (idx > -1) {
    customFoods[idx] = { ...customFoods[idx], ...updates };
    wx.setStorageSync('customFoods', customFoods);
  }
  return customFoods;
}

/** 获取所有运动（默认+自定义） */
function getExercises() {
  const customExercises = wx.getStorageSync('customExercises') || [];
  return [...defaultExercises, ...customExercises];
}

/** 添加自定义运动 */
function addCustomExercise(exercise) {
  const customExercises = wx.getStorageSync('customExercises') || [];
  exercise.id = 'ex_cu_' + Date.now();
  exercise.isCustom = true;
  customExercises.push(exercise);
  wx.setStorageSync('customExercises', customExercises);
  return exercise;
}

/** 删除自定义运动 */
function deleteCustomExercise(exerciseId) {
  let customExercises = wx.getStorageSync('customExercises') || [];
  customExercises = customExercises.filter(e => e.id !== exerciseId);
  wx.setStorageSync('customExercises', customExercises);
  return customExercises;
}

/** 获取所有奖励（默认+自定义） */
function getRewards() {
  const customRewards = wx.getStorageSync('customRewards') || [];
  return [...defaultRewards, ...customRewards];
}

/** 添加自定义奖励 */
function addCustomReward(reward) {
  const customRewards = wx.getStorageSync('customRewards') || [];
  reward.id = 'r_cu_' + Date.now();
  reward.isCustom = true;
  customRewards.push(reward);
  wx.setStorageSync('customRewards', customRewards);
  return reward;
}

/** 删除自定义奖励 */
function deleteCustomReward(rewardId) {
  let customRewards = wx.getStorageSync('customRewards') || [];
  customRewards = customRewards.filter(r => r.id !== rewardId);
  wx.setStorageSync('customRewards', customRewards);
  return customRewards;
}

module.exports = {
  foodCategories,
  defaultFoods,
  getFoods,
  getFoodCategories,
  addCustomFood,
  deleteCustomFood,
  updateCustomFood,
  defaultExercises,
  getExercises,
  addCustomExercise,
  deleteCustomExercise,
  defaultRewards,
  getRewards,
  addCustomReward,
  deleteCustomReward,
  defaultPunishments
};
