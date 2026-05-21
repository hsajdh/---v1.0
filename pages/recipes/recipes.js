const { getFoodCategories, getFoods, addCustomFood, deleteCustomFood, updateCustomFood } = require('../../utils/data');
const app = getApp();

Page({
  data: {
    categories: [],
    categoryNames: [],
    activeCategory: 'canteen',
    currentCategoryInfo: {},
    filteredFoods: [],
    allFoods: [],
    showAdd: false,
    editingFood: null,
    formData: {
      name: '', calories: '', unit: '', icon: '', protein: '', carbs: '', fat: '', catIdx: 0
    }
  },

  onShow() {
    this.loadFoods();
  },

  loadFoods() {
    const categories = getFoodCategories();
    const allFoods = getFoods();
    const categoryNames = categories.map(c => c.icon + ' ' + c.name);
    this.setData({ categories, categoryNames, allFoods });
    this.filterFoods(this.data.activeCategory);
  },

  switchCategory(e) {
    const id = e.currentTarget.dataset.id;
    this.filterFoods(id);
  },

  filterFoods(catId) {
    const info = this.data.categories.find(c => c.id === catId) || {};
    let filtered;
    if (catId === 'custom') {
      filtered = this.data.allFoods.filter(f => f.isCustom);
    } else {
      filtered = this.data.allFoods.filter(f => f.category === catId && !f.isCustom);
    }
    this.setData({ activeCategory: catId, currentCategoryInfo: info, filteredFoods: filtered });
  },

  goDetail(e) {
    const { id, custom } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/recipe-detail/recipe-detail?id=${id}&custom=${custom || ''}` });
  },

  onLongPress(e) {
    const item = e.currentTarget.dataset.item;
    if (!item.isCustom) {
      wx.showToast({ title: '默认食物不可删除', icon: 'none' });
      return;
    }
    wx.showModal({
      title: '删除食物',
      content: `确定删除"${item.name}"吗？`,
      confirmColor: '#FF3B30',
      success: (res) => {
        if (res.confirm) {
          deleteCustomFood(item.id);
          this.loadFoods();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  /* ===== 添加/编辑弹窗 ===== */
  showAddModal() {
    this.setData({
      showAdd: true,
      editingFood: null,
      formData: { name: '', calories: '', unit: '', icon: '', protein: '', carbs: '', fat: '', catIdx: 0 }
    });
  },

  hideAddModal() {
    this.setData({ showAdd: false, editingFood: null });
  },

  onFormName(e) { this.setData({ 'formData.name': e.detail.value }); },
  onFormCal(e) { this.setData({ 'formData.calories': e.detail.value }); },
  onFormUnit(e) { this.setData({ 'formData.unit': e.detail.value }); },
  onFormIcon(e) { this.setData({ 'formData.icon': e.detail.value }); },
  onFormProtein(e) { this.setData({ 'formData.protein': e.detail.value }); },
  onFormCarbs(e) { this.setData({ 'formData.carbs': e.detail.value }); },
  onFormFat(e) { this.setData({ 'formData.fat': e.detail.value }); },
  onFormCat(e) { this.setData({ 'formData.catIdx': e.detail.value }); },

  saveFood() {
    const fd = this.data.formData;
    if (!fd.name.trim()) {
      wx.showToast({ title: '请输入食物名称', icon: 'none' });
      return;
    }
    const calories = parseFloat(fd.calories);
    if (!calories || calories <= 0 || calories > 2000) {
      wx.showToast({ title: '请输入合理的热量（1-2000大卡）', icon: 'none' });
      return;
    }

    const { editingFood } = this.data;
    if (editingFood) {
      // Editing existing custom food
      updateCustomFood(editingFood.id, {
        name: fd.name.trim(),
        calories: calories,
        category: this.data.categories[fd.catIdx]?.id || 'custom',
        unit: fd.unit.trim() || '份',
        icon: fd.icon.trim() || '🍽️',
        protein: parseFloat(fd.protein) || 0,
        carbs: parseFloat(fd.carbs) || 0,
        fat: parseFloat(fd.fat) || 0
      });
      wx.showToast({ title: '已更新', icon: 'success' });
    } else {
      // Adding new
      addCustomFood({
        name: fd.name.trim(),
        calories: calories,
        category: this.data.categories[fd.catIdx]?.id || 'custom',
        unit: fd.unit.trim() || '份',
        icon: fd.icon.trim() || '🍽️',
        protein: parseFloat(fd.protein) || 0,
        carbs: parseFloat(fd.carbs) || 0,
        fat: parseFloat(fd.fat) || 0
      });
      wx.showToast({ title: '添加成功', icon: 'success' });
    }

    this.hideAddModal();
    this.loadFoods();
  },

  deleteEditingFood() {
    const { editingFood } = this.data;
    if (!editingFood) return;
    wx.showModal({
      title: '确认删除',
      content: `删除"${editingFood.name}"？`,
      confirmColor: '#FF3B30',
      success: (res) => {
        if (res.confirm) {
          deleteCustomFood(editingFood.id);
          this.hideAddModal();
          this.loadFoods();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  }
});
