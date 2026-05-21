App({
  globalData: {
    userInfo: {
      avatar: '',
      nickname: '亲爱的',
      currentWeight: 65,
      targetWeight: 55,
      startWeight: 70,
      startDate: '2026-05-01',
      height: 165
    },
    todayData: {
      waterCount: 0,
      waterTarget: 8,
      caloriesIn: 0,
      caloriesTarget: 1500,
      caloriesBurned: 0,
      weight: null,
      exercises: [],
      photoTaken: false,
      checkedIn: false
    },
    totalPoints: 0,
    checkinDays: 0,
    history: []
  },

  onLaunch() {
    const stored = wx.getStorageSync('appData');
    if (stored) {
      this.globalData = { ...this.globalData, ...stored };
    }
    this.checkNewDay();
  },

  checkNewDay() {
    const today = this.getDateString();
    const lastDate = wx.getStorageSync('lastDate');
    if (lastDate !== today) {
      this.globalData.todayData = {
        waterCount: 0,
        waterTarget: 8,
        caloriesIn: 0,
        caloriesTarget: 1500,
        caloriesBurned: 0,
        weight: null,
        exercises: [],
        photoTaken: false,
        checkedIn: false
      };
      wx.setStorageSync('lastDate', today);
      this.saveData();
    }
  },

  getDateString(date) {
    const d = date ? new Date(date) : new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  saveData() {
    wx.setStorageSync('appData', this.globalData);
  }
});
