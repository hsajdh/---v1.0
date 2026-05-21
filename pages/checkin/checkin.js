const { getExercises } = require('../../utils/data');
const util = require('../../utils/util');
const app = getApp();

Page({
  data: {
    streak: 0,
    weekLabels: ['日', '一', '二', '三', '四', '五', '六'],
    calendarDays: [],
    todayChecked: false,
    weightInput: '',
    selectedExercises: [],
    todayWater: 0,
    photoPath: '',
    waterQuickBtns: [2, 4, 6, 8],
    exercises: getExercises(),
    history: []
  },

  onShow() {
    const td = app.globalData.todayData;
    this.setData({
      todayChecked: td.checkedIn,
      weightInput: td.weight || '',
      selectedExercises: (td.exercises || []).map(e => e.id),
      todayWater: td.waterCount,
      history: (app.globalData.history || []).slice(0, 14)
    });
    this.buildCalendar();
    this.calcStreak();
  },

  buildCalendar() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 0).getDate() - new Date(year, month, 1).getDay();
    const todayStr = util.getToday();
    const historyMap = {};
    (app.globalData.history || []).forEach(h => {
      historyMap[h.date] = true;
    });

    const calendarDays = [];
    // fill first row from previous month
    const prevMonthStart = firstDay;
    for (let i = prevMonthStart; i <= new Date(year, month, 0).getDate(); i++) {
      const d = new Date(year, month - 1, i);
      calendarDays.push({
        day: i,
        date: util.formatDate(d),
        checked: !!historyMap[util.formatDate(d)],
        isToday: false,
        isFuture: false
      });
    }
    // current month
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      const dateStr = util.formatDate(d);
      calendarDays.push({
        day: i,
        date: dateStr,
        checked: !!historyMap[dateStr],
        isToday: dateStr === todayStr,
        isFuture: d > today
      });
    }
    // fill remaining to complete final row
    const remaining = (7 - (calendarDays.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      calendarDays.push({
        day: i,
        date: util.formatDate(d),
        checked: false,
        isToday: false,
        isFuture: true
      });
    }

    this.setData({ calendarDays });
  },

  calcStreak() {
    const history = app.globalData.history || [];
    let streak = 0;
    const today = new Date();
    for (let i = 0; ; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = util.formatDate(d);
      if (history.some(h => h.date === dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      } else {
        break;
      }
    }
    // if not checked in today, streak is from yesterday
    if (!this.data.todayChecked) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = util.formatDate(yesterday);
      if (!history.some(h => h.date === yStr)) {
        streak = 0;
      }
    }
    this.setData({ streak });
  },

  onWeightInput(e) {
    this.setData({ weightInput: e.detail.value });
  },

  toggleExercise(e) {
    const id = e.currentTarget.dataset.id;
    let selected = [...this.data.selectedExercises];
    const idx = selected.indexOf(id);
    if (idx > -1) {
      selected.splice(idx, 1);
    } else {
      selected.push(id);
    }
    this.setData({ selectedExercises: selected });
  },

  setWater(e) {
    const count = parseInt(e.currentTarget.dataset.count);
    app.globalData.todayData.waterCount = count;
    app.saveData();
    this.setData({ todayWater: count });
  },

  takePhoto() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: (res) => {
        this.setData({ photoPath: res.tempFilePaths[0] });
      }
    });
  },

  submitCheckin() {
    const { weightInput, selectedExercises } = this.data;
    const weight = parseFloat(weightInput);

    if (!weight || weight < 30 || weight > 200) {
      wx.showToast({ title: '请输入正确的体重', icon: 'none' });
      return;
    }

    const td = app.globalData.todayData;
    td.weight = weight;
    td.checkedIn = true;

    // 更新当前体重
    app.globalData.userInfo.currentWeight = weight;

    // 累计运动消耗
    let totalBurned = 0;
    const exList = [];
    const allExercises = getExercises();
    selectedExercises.forEach(id => {
      const ex = allExercises.find(e => e.id === id);
      if (ex) {
        totalBurned += ex.calPer30min;
        exList.push({ ...ex, calBurned: ex.calPer30min });
      }
    });
    td.exercises = exList;
    td.caloriesBurned = totalBurned;

    // 计算积分
    let pointsEarned = 5; // 基础打卡分
    if (td.waterCount >= 8) pointsEarned += 3;
    if (exList.length > 0) pointsEarned += exList.length * 10;
    if (weightInput && parseFloat(weightInput) < app.globalData.userInfo.startWeight) pointsEarned += 5;

    app.globalData.totalPoints += pointsEarned;
    app.globalData.checkinDays++;

    // 保存到历史
    const history = app.globalData.history || [];
    const todayStr = util.getToday();
    const existingIdx = history.findIndex(h => h.date === todayStr);
    const record = {
      date: todayStr,
      weight: weight,
      exercises: exList,
      water: td.waterCount,
      pointsEarned: pointsEarned
    };
    if (existingIdx > -1) {
      history[existingIdx] = record;
    } else {
      history.unshift(record);
    }
    app.globalData.history = history;
    app.saveData();

    this.setData({
      todayChecked: true,
      history: history.slice(0, 14)
    });

    wx.showToast({
      title: `打卡成功! +${pointsEarned}分`,
      icon: 'success',
      duration: 2000
    });
  }
});
