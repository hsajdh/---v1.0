const util = require('../../utils/util');
const app = getApp();

Page({
  data: {
    role: 'beauty',
    roleName: '',
    currentRoomId: '',
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
    weekWeights: [],
    activities: [],
    activityLogs: [],
    pendingApplications: 0,
    recentHistory: []
  },

  onShow() {
    if (!app.ensureRoom()) return;
    this.loadData();
    this.setData({ encourageMsg: util.getEncourageMsg() });
  },

  loadData() {
    const g = app.globalData;
    const room = g.roomData || {};
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
    const applications = room.applications || [];

    this.setData({
      role: g.currentRole,
      roleName: g.roleName,
      currentRoomId: g.currentRoomId,
      userInfo: ui,
      todayData: td,
      totalPoints: g.totalPoints,
      checkinDays: g.checkinDays,
      lostWeight: lost,
      totalTarget: total,
      progressPercent: progress,
      bmi,
      bmiDesc,
      waterDots,
      calPercent,
      weekWeights,
      activities: (room.activities || []).filter(item => item.active),
      activityLogs: (room.activityLogs || []).slice(0, 8),
      pendingApplications: applications.filter(item => item.status === 'pending').length,
      recentHistory: (g.history || []).slice(0, 5)
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
    if (this.data.role === 'supervisor') return;
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

  completeActivity(e) {
    if (this.data.role === 'supervisor') {
      wx.showToast({ title: '监督者可在我的页面管理活动', icon: 'none' });
      return;
    }

    const item = e.currentTarget.dataset.item;
    const room = app.globalData.roomData;
    if (!item || !room) return;

    const today = util.getToday();
    const logs = room.activityLogs || [];
    if (logs.some(log => log.date === today && log.activityId === item.id)) {
      wx.showToast({ title: '今天已经完成过这个活动啦', icon: 'none' });
      return;
    }

    wx.showModal({
      title: '完成活动',
      content: `确认完成「${item.name}」并领取 ${item.points} 积分吗？`,
      confirmText: '领取',
      confirmColor: '#FF6B8A',
      success: (res) => {
        if (!res.confirm) return;
        app.addPointLog(item.points, `完成活动：${item.name}`);
        room.activityLogs = room.activityLogs || [];
        room.activityLogs.unshift({
          id: 'alog_' + Date.now(),
          activityId: item.id,
          activityName: item.name,
          points: item.points,
          date: today
        });
        app.saveData();
        this.loadData();
        wx.showToast({ title: `已领取 +${item.points}分`, icon: 'success' });
      }
    });
  },

  goRecipes() {
    wx.switchTab({ url: '/pages/recipes/recipes' });
  },

  goCheckin() {
    wx.switchTab({ url: '/pages/checkin/checkin' });
  },

  goRewards() {
    wx.navigateTo({ url: '/pages/rewards/rewards' });
  },

  goProfile() {
    wx.switchTab({ url: '/pages/profile/profile' });
  }
});
