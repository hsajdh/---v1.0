const { getFoods, getFoodCategories, deleteCustomFood } = require('../../utils/data');
const app = getApp();

Page({
  data: {
    food: null,
    categoryName: ''
  },

  onLoad(options) {
    const id = options.id;
    const allFoods = getFoods();
    const food = allFoods.find(f => f.id === id);
    if (food) {
      const categories = getFoodCategories();
      const cat = categories.find(c => c.id === food.category);
      this.setData({
        food: food,
        categoryName: cat ? (cat.icon + ' ' + cat.name) : '自定义'
      });
      wx.setNavigationBarTitle({ title: food.name });
    }
  },

  recordCalories() {
    const food = this.data.food;
    if (!food) return;

    wx.showModal({
      title: '记录饮食',
      content: `确定吃了"${food.name}"（${food.calories}大卡）吗？`,
      confirmText: '确定',
      confirmColor: '#FF6B8A',
      success: (res) => {
        if (res.confirm) {
          app.globalData.todayData.caloriesIn += food.calories;
          app.globalData.totalPoints += 2;
          app.saveData();

          wx.showToast({ title: '已记录 +2分', icon: 'success' });
        }
      }
    });
  },

  editFood() {
    const food = this.data.food;
    if (!food || !food.isCustom) return;

    // Navigate to food library page and trigger edit
    wx.switchTab({ url: '/pages/recipes/recipes' });
    // Store edit target in global for recipes page to pick up
    app.globalData._editFood = food;
  },

  deleteFood() {
    const food = this.data.food;
    if (!food || !food.isCustom) return;

    wx.showModal({
      title: '确认删除',
      content: `删除"${food.name}"后将无法恢复`,
      confirmColor: '#FF3B30',
      success: (res) => {
        if (res.confirm) {
          deleteCustomFood(food.id);
          wx.showToast({ title: '已删除', icon: 'success' });
          setTimeout(() => {
            wx.navigateBack();
          }, 1200);
        }
      }
    });
  }
});
