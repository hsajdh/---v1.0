const util = require('../../utils/util');
const app = getApp();

Page({
  data: {
    userInfo: {},
    todayData: {},
    totalPoints: 0,
    checkinDays: 0,
    encourageMsg: '',
    lostWeight: 0,
    totalTarget: 0,
    progressPercent: 0,
    bmi: 0,
    bmiDesc: '',
    waterDots: [],
    calPercent: 0,
    weekWeights: []
  },

  onShow() {
    this.loadData();
    this.setData({ encourageMsg: util.getEncourageMsg() });
  },

  loadData() {
    const g = app.globalData;
    const ui = g.userInfo;
    const td = g.todayData;
    const lost = util.calcLost(ui.startWeight, ui.currentWeight);
    const total = util.calcLost(ui.startWeight, ui.targetWeight);
    const progress = util.calcProgress(ui.startWeight, ui.currentWeight, ui.targetWeight);
    const bmi = util.calcBMI(ui.currentWeight, ui.height);
    const bmiDesc = util.getBMIDesc(bmi);
    const waterDots = new Array(td.waterTarget).fill(false).map((_, i) => i < td.waterCount);
    const calPercent = td.caloriesTarget > 0
      ? Math.min(100, Math.round((td.caloriesIn / td.caloriesTarget) * 100))
      : 0;

    const weekWeights = this.buildWeekChart();

    this.setData({
      userInfo: ui,
      todayData: td,
      totalPoints: g.totalPoints,
      checkinDays: g.checkinDays,
      lostWeight: lost,
      totalTarget: total,
      progressPercent: progress,
      bmi: bmi,
      bmiDesc: bmiDesc,
      waterDots: waterDots,
      calPercent: calPercent,
      weekWeights: weekWeights
    });
  },

  buildWeekChart() {
    const dates = util.getWeekDates();
    const maxW = app.globalData.userInfo.startWeight;
    const minW = app.globalData.userInfo.targetWeight;
    const range = maxW - minW || 10;
    const historyMap = {};
    (app.globalData.history || []).forEach(h => {
      if (h.weight) historyMap[h.date] = h.weight;
    });

    const days = ['日', '一', '二', '三', '四', '五', '六'];
    const today = util.getToday();

    return dates.map(dateStr => {
      const d = new Date(dateStr);
      const w = historyMap[dateStr];
      const height = w ? 40 + ((maxW - w) / range) * 140 : 20;
      return {
        date: dateStr,
        dayLabel: days[d.getDay()],
        weight: w || '',
        height: Math.max(8, Math.min(180, height)),
        isToday: dateStr === today
      };
    });
  },

  addWater() {
    const td = app.globalData.todayData;
    if (td.waterCount < td.waterTarget) {
      td.waterCount++;
      app.saveData();
      this.loadData();
      wx.vibrateShort({ type: 'light' });
      if (td.waterCount === td.waterTarget) {
        wx.showToast({ title: '今日饮水目标达成! 🎉', icon: 'none' });
      }
    }
  },

  goRecipes() {
    wx.switchTab({ url: '/pages/recipes/recipes' });
  },

  goCheckin() {
    wx.switchTab({ url: '/pages/checkin/checkin' });
  },

  goRewards() {
    wx.navigateTo({ url: '/pages/rewards/rewards' });
  }
});
