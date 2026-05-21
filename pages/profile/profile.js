const util = require('../../utils/util');
const {
  getExercises, addCustomExercise, deleteCustomExercise,
  getRewards, addCustomReward, deleteCustomReward
} = require('../../utils/data');
const app = getApp();

Page({
  data: {
    userInfo: {},
    totalPoints: 0,
    checkinDays: 0,
    lostWeight: 0,
    bmi: 0,
    weightChange7d: 0,
    remainDays: '-',
    // 管理面板
    showExercisePanel: false,
    showRewardPanel: false,
    customExercises: [],
    customRewards: [],
    customCounts: { foods: 0, exercises: 0, rewards: 0 },
    // 弹窗
    showAddExModal: false,
    exForm: { name: '', cal: '', icon: '' },
    showAddRwModal: false,
    rwForm: { name: '', points: '', desc: '', icon: '' }
  },

  onShow() {
    this.loadAll();
  },

  loadAll() {
    const ui = app.globalData.userInfo;
    const lost = util.calcLost(ui.startWeight, ui.currentWeight);
    const bmi = util.calcBMI(ui.currentWeight, ui.height);
    const change7d = this.calc7DayChange();
    const remain = this.calcRemainDays();

    // 获取自定义数据统计
    const customFoods = wx.getStorageSync('customFoods') || [];
    const allExercises = getExercises();
    const customExercises = allExercises.filter(e => e.isCustom);
    const allRewards = getRewards();
    const customRewards = allRewards.filter(r => r.isCustom);

    this.setData({
      userInfo: { ...ui },
      totalPoints: app.globalData.totalPoints,
      checkinDays: app.globalData.checkinDays,
      lostWeight: lost,
      bmi: bmi,
      weightChange7d: change7d,
      remainDays: remain,
      customExercises: customExercises,
      customRewards: customRewards,
      customCounts: {
        foods: customFoods.length,
        exercises: customExercises.length,
        rewards: customRewards.length
      }
    });
  },

  calc7DayChange() {
    const history = app.globalData.history || [];
    if (history.length < 2) return 0;
    const now = history[0].weight;
    const weekAgo = history.find(h => {
      const d = new Date(h.date);
      const daysAgo = (new Date() - d) / (1000 * 60 * 60 * 24);
      return daysAgo >= 6 && daysAgo <= 8;
    });
    if (!weekAgo) return 0;
    return (weekAgo.weight - now).toFixed(1);
  },

  calcRemainDays() {
    const ui = app.globalData.userInfo;
    const toLose = ui.currentWeight - ui.targetWeight;
    if (toLose <= 0) return '🎉';
    const history = app.globalData.history || [];
    if (history.length < 3) return '-';
    return Math.ceil(toLose / 0.5 * 7);
  },

  onFieldChange(e) {
    const field = e.currentTarget.dataset.field;
    const val = parseFloat(e.detail.value);
    if (isNaN(val)) return;
    const ui = this.data.userInfo;
    ui[field] = val;
    this.setData({ userInfo: ui });
  },

  onDateChange(e) {
    const ui = this.data.userInfo;
    ui.startDate = e.detail.value;
    this.setData({ userInfo: ui });
  },

  saveSettings() {
    const ui = this.data.userInfo;
    app.globalData.userInfo = { ...ui };
    app.saveData();
    this.loadAll();
    wx.showToast({ title: '设置已保存', icon: 'success' });
  },

  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        app.globalData.userInfo.avatar = res.tempFilePaths[0];
        app.saveData();
        this.loadAll();
      }
    });
  },

  /* ===== 食物管理 ===== */
  manageFoods() {
    wx.switchTab({ url: '/pages/recipes/recipes' });
  },

  /* ===== 运动管理 ===== */
  toggleExercisePanel() {
    this.setData({ showExercisePanel: !this.data.showExercisePanel });
  },

  deleteExercise(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复',
      confirmColor: '#FF3B30',
      success: (res) => {
        if (res.confirm) {
          deleteCustomExercise(id);
          this.loadAll();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  showAddExercise() {
    this.setData({ showAddExModal: true, exForm: { name: '', cal: '', icon: '' } });
  },

  closeAddEx() { this.setData({ showAddExModal: false }); },
  onExName(e) { this.setData({ 'exForm.name': e.detail.value }); },
  onExCal(e) { this.setData({ 'exForm.cal': e.detail.value }); },
  onExIcon(e) { this.setData({ 'exForm.icon': e.detail.value }); },

  saveExercise() {
    const f = this.data.exForm;
    if (!f.name.trim()) { wx.showToast({ title: '请输入运动名称', icon: 'none' }); return; }
    const cal = parseFloat(f.cal);
    if (!cal || cal <= 0 || cal > 2000) { wx.showToast({ title: '请输入合理热量', icon: 'none' }); return; }
    addCustomExercise({
      name: f.name.trim(),
      calPer30min: cal,
      unit: '30分钟',
      icon: f.icon.trim() || '🏃‍♀️'
    });
    this.setData({ showAddExModal: false });
    this.loadAll();
    wx.showToast({ title: '添加成功', icon: 'success' });
  },

  /* ===== 奖励管理 ===== */
  toggleRewardPanel() {
    this.setData({ showRewardPanel: !this.data.showRewardPanel });
  },

  deleteReward(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复',
      confirmColor: '#FF3B30',
      success: (res) => {
        if (res.confirm) {
          deleteCustomReward(id);
          this.loadAll();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  showAddReward() {
    this.setData({ showAddRwModal: true, rwForm: { name: '', points: '', desc: '', icon: '' } });
  },

  closeAddRw() { this.setData({ showAddRwModal: false }); },
  onRwName(e) { this.setData({ 'rwForm.name': e.detail.value }); },
  onRwPoints(e) { this.setData({ 'rwForm.points': e.detail.value }); },
  onRwDesc(e) { this.setData({ 'rwForm.desc': e.detail.value }); },
  onRwIcon(e) { this.setData({ 'rwForm.icon': e.detail.value }); },

  saveReward() {
    const f = this.data.rwForm;
    if (!f.name.trim()) { wx.showToast({ title: '请输入奖励名称', icon: 'none' }); return; }
    const pts = parseInt(f.points);
    if (!pts || pts < 1 || pts > 10000) { wx.showToast({ title: '请输入合理积分', icon: 'none' }); return; }
    addCustomReward({
      name: f.name.trim(),
      points: pts,
      desc: f.desc.trim() || f.name.trim(),
      icon: f.icon.trim() || '🎁',
      category: 'custom'
    });
    this.setData({ showAddRwModal: false });
    this.loadAll();
    wx.showToast({ title: '添加成功', icon: 'success' });
  },

  /* ===== 其他 ===== */
  goRewards() {
    wx.navigateTo({ url: '/pages/rewards/rewards' });
  },

  goRecipes() {
    wx.switchTab({ url: '/pages/recipes/recipes' });
  },

  resetToday() {
    wx.showModal({
      title: '重置今日数据',
      content: '确定要重置今天的所有数据吗？',
      confirmColor: '#FF3B30',
      success: (res) => {
        if (res.confirm) {
          app.globalData.todayData = {
            waterCount: 0, waterTarget: 8,
            caloriesIn: 0, caloriesTarget: 1500,
            caloriesBurned: 0, weight: null,
            exercises: [], photoTaken: false, checkedIn: false
          };
          app.saveData();
          this.loadAll();
          wx.showToast({ title: '已重置', icon: 'success' });
        }
      }
    });
  },

  clearAll() {
    wx.showModal({
      title: '⚠️ 危险操作',
      content: '将清除所有数据（包括积分、打卡记录、体重历史），且不可恢复！',
      confirmText: '确认清除',
      confirmColor: '#FF3B30',
      success: (res) => {
        if (res.confirm) {
          wx.showModal({
            title: '再次确认',
            content: '真的要删除全部数据吗？你的男朋友会心疼的 😢',
            confirmText: '我确定',
            confirmColor: '#FF3B30',
            success: (res2) => {
              if (res2.confirm) {
                wx.clearStorageSync();
                app.globalData = {
                  userInfo: {
                    avatar: '', nickname: '亲爱的',
                    currentWeight: 65, targetWeight: 55,
                    startWeight: 70, startDate: '2026-05-01', height: 165
                  },
                  todayData: {
                    waterCount: 0, waterTarget: 8,
                    caloriesIn: 0, caloriesTarget: 1500,
                    caloriesBurned: 0, weight: null,
                    exercises: [], photoTaken: false, checkedIn: false
                  },
                  totalPoints: 0, checkinDays: 0, history: []
                };
                this.loadAll();
                wx.showToast({ title: '已全部清除', icon: 'success' });
              }
            }
          });
        }
      }
    });
  }
});
