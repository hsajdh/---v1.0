const util = require('../../utils/util');
const {
  addCustomExercise, updateCustomExercise, deleteCustomExercise,
  addCustomReward, updateCustomReward, deleteCustomReward
} = require('../../utils/data');
const app = getApp();

const applicationTypes = [
  { value: 'recipe', label: '食谱申请' },
  { value: 'reward', label: '奖励申请' },
  { value: 'activity', label: '活动申请' },
  { value: 'other', label: '其他愿望' }
];

function createTodayData() {
  return {
    waterCount: 0,
    waterTarget: 8,
    caloriesIn: 0,
    caloriesTarget: 1500,
    caloriesBurned: 0,
    weight: null,
    exercises: [],
    photoTaken: false,
    photoPath: '',
    checkedIn: false
  };
}

Page({
  data: {
    role: 'beauty',
    roleName: '',
    currentRoomId: '',
    userInfo: {},
    totalPoints: 0,
    checkinDays: 0,
    lostWeight: 0,
    bmi: 0,
    weightChange7d: 0,
    remainDays: '-',
    history: [],
    pointLogs: [],
    activities: [],
    applications: [],
    pendingApplications: [],
    applicationTypes,
    applicationTypeNames: applicationTypes.map(item => item.label),
    appForm: { typeIdx: 0, title: '', content: '' },
    pointForm: { amount: '', reason: '' },
    customExercises: [],
    customRewards: [],
    customCounts: { foods: 0, exercises: 0, rewards: 0, activities: 0 },
    editingExercise: null,
    editingReward: null,
    editingActivity: null,
    showExercisePanel: false,
    showRewardPanel: false,
    showActivityPanel: false,
    showAddExModal: false,
    exForm: { name: '', cal: '', icon: '' },
    showAddRwModal: false,
    rwForm: { name: '', points: '', desc: '', icon: '' },
    showAddActModal: false,
    actForm: { name: '', points: '', desc: '', icon: '' }
  },

  onShow() {
    if (!app.ensureRoom()) return;
    this.loadAll();
  },

  loadAll() {
    const room = app.globalData.roomData || {};
    const ui = app.globalData.userInfo;
    const lost = util.calcLost(ui.startWeight, ui.currentWeight);
    const bmi = util.calcBMI(ui.currentWeight, ui.height);
    const change7d = this.calc7DayChange();
    const remain = this.calcRemainDays();
    const applications = (room.applications || []).map(item => ({
      ...item,
      typeLabel: this.getApplicationTypeLabel(item.type),
      statusText: this.getStatusText(item.status),
      statusClass: 'status-' + item.status
    }));

    this.setData({
      role: app.globalData.currentRole,
      roleName: app.globalData.roleName,
      currentRoomId: app.globalData.currentRoomId,
      userInfo: { ...ui },
      totalPoints: app.globalData.totalPoints,
      checkinDays: app.globalData.checkinDays,
      lostWeight: lost,
      bmi,
      weightChange7d: change7d,
      remainDays: remain,
      history: (app.globalData.history || []).slice(0, 20),
      pointLogs: (room.pointLogs || []).slice(0, 20),
      activities: room.activities || [],
      applications,
      pendingApplications: applications.filter(item => item.status === 'pending'),
      customExercises: room.customExercises || [],
      customRewards: room.customRewards || [],
      customCounts: {
        foods: (room.customFoods || []).length,
        exercises: (room.customExercises || []).length,
        rewards: (room.customRewards || []).length,
        activities: (room.activities || []).filter(item => item.isCustom).length
      }
    });
  },

  getApplicationTypeLabel(type) {
    const found = applicationTypes.find(item => item.value === type);
    return found ? found.label : '其他愿望';
  },

  getStatusText(status) {
    if (status === 'approved') return '已同意';
    if (status === 'rejected') return '已拒绝';
    return '待处理';
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
    app.globalData.userInfo = { ...this.data.userInfo };
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

  manageFoods() {
    wx.switchTab({ url: '/pages/recipes/recipes' });
  },

  goRewards() {
    wx.navigateTo({ url: '/pages/rewards/rewards' });
  },

  goRecipes() {
    wx.switchTab({ url: '/pages/recipes/recipes' });
  },

  goCheckin() {
    wx.switchTab({ url: '/pages/checkin/checkin' });
  },

  toggleExercisePanel() {
    this.setData({ showExercisePanel: !this.data.showExercisePanel });
  },

  showAddExercise() {
    this.setData({
      showAddExModal: true,
      editingExercise: null,
      exForm: { name: '', cal: '', icon: '' }
    });
  },

  editExercise(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      showAddExModal: true,
      editingExercise: item,
      exForm: {
        name: item.name || '',
        cal: item.calPer30min || '',
        icon: item.icon || ''
      }
    });
  },

  closeAddEx() {
    this.setData({ showAddExModal: false, editingExercise: null });
  },

  onExName(e) { this.setData({ 'exForm.name': e.detail.value }); },
  onExCal(e) { this.setData({ 'exForm.cal': e.detail.value }); },
  onExIcon(e) { this.setData({ 'exForm.icon': e.detail.value }); },

  saveExercise() {
    const f = this.data.exForm;
    if (!f.name.trim()) {
      wx.showToast({ title: '请输入运动名称', icon: 'none' });
      return;
    }
    const cal = parseFloat(f.cal);
    if (!cal || cal <= 0 || cal > 2000) {
      wx.showToast({ title: '请输入合理热量', icon: 'none' });
      return;
    }
    const payload = {
      name: f.name.trim(),
      calPer30min: cal,
      unit: '30分钟',
      icon: f.icon.trim() || '🏃‍♀️'
    };
    const isEditing = !!this.data.editingExercise;
    if (isEditing) {
      updateCustomExercise(this.data.editingExercise.id, payload);
    } else {
      addCustomExercise(payload);
    }
    this.setData({ showAddExModal: false, editingExercise: null });
    this.loadAll();
    wx.showToast({ title: isEditing ? '已更新' : '添加成功', icon: 'success' });
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

  toggleRewardPanel() {
    this.setData({ showRewardPanel: !this.data.showRewardPanel });
  },

  showAddReward() {
    this.setData({
      showAddRwModal: true,
      editingReward: null,
      rwForm: { name: '', points: '', desc: '', icon: '' }
    });
  },

  editReward(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      showAddRwModal: true,
      editingReward: item,
      rwForm: {
        name: item.name || '',
        points: item.points || '',
        desc: item.desc || '',
        icon: item.icon || ''
      }
    });
  },

  closeAddRw() {
    this.setData({ showAddRwModal: false, editingReward: null });
  },

  onRwName(e) { this.setData({ 'rwForm.name': e.detail.value }); },
  onRwPoints(e) { this.setData({ 'rwForm.points': e.detail.value }); },
  onRwDesc(e) { this.setData({ 'rwForm.desc': e.detail.value }); },
  onRwIcon(e) { this.setData({ 'rwForm.icon': e.detail.value }); },

  saveReward() {
    const f = this.data.rwForm;
    if (!f.name.trim()) {
      wx.showToast({ title: '请输入奖励名称', icon: 'none' });
      return;
    }
    const pts = parseInt(f.points);
    if (!pts || pts < 1 || pts > 10000) {
      wx.showToast({ title: '请输入合理积分', icon: 'none' });
      return;
    }
    const payload = {
      name: f.name.trim(),
      points: pts,
      desc: f.desc.trim() || f.name.trim(),
      icon: f.icon.trim() || '🎁',
      category: 'custom'
    };
    const isEditing = !!this.data.editingReward;
    if (isEditing) {
      updateCustomReward(this.data.editingReward.id, payload);
    } else {
      addCustomReward(payload);
    }
    this.setData({ showAddRwModal: false, editingReward: null });
    this.loadAll();
    wx.showToast({ title: isEditing ? '已更新' : '添加成功', icon: 'success' });
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

  toggleActivityPanel() {
    this.setData({ showActivityPanel: !this.data.showActivityPanel });
  },

  showAddActivity() {
    this.setData({
      showAddActModal: true,
      editingActivity: null,
      actForm: { name: '', points: '', desc: '', icon: '' }
    });
  },

  editActivity(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      showAddActModal: true,
      editingActivity: item,
      actForm: {
        name: item.name || '',
        points: item.points || '',
        desc: item.desc || '',
        icon: item.icon || ''
      }
    });
  },

  closeAddAct() {
    this.setData({ showAddActModal: false, editingActivity: null });
  },

  onActName(e) { this.setData({ 'actForm.name': e.detail.value }); },
  onActPoints(e) { this.setData({ 'actForm.points': e.detail.value }); },
  onActDesc(e) { this.setData({ 'actForm.desc': e.detail.value }); },
  onActIcon(e) { this.setData({ 'actForm.icon': e.detail.value }); },

  saveActivity() {
    const f = this.data.actForm;
    if (!f.name.trim()) {
      wx.showToast({ title: '请输入活动名称', icon: 'none' });
      return;
    }
    const pts = parseInt(f.points);
    if (!pts || pts < 1 || pts > 1000) {
      wx.showToast({ title: '请输入合理积分', icon: 'none' });
      return;
    }
    const room = app.globalData.roomData;
    room.activities = room.activities || [];
    const payload = {
      name: f.name.trim(),
      points: pts,
      desc: f.desc.trim() || '完成后可领取积分',
      icon: f.icon.trim() || '🌟',
      active: true
    };
    const isEditing = !!this.data.editingActivity;
    if (isEditing) {
      const target = room.activities.find(item => item.id === this.data.editingActivity.id);
      if (target) Object.assign(target, payload);
    } else {
      room.activities.push({
        id: 'act_cu_' + Date.now(),
        ...payload,
        isCustom: true
      });
    }
    app.saveData();
    this.setData({ showAddActModal: false, editingActivity: null });
    this.loadAll();
    wx.showToast({ title: isEditing ? '活动已更新' : '活动已添加', icon: 'success' });
  },

  toggleActivity(e) {
    const id = e.currentTarget.dataset.id;
    const room = app.globalData.roomData;
    const target = (room.activities || []).find(item => item.id === id);
    if (!target) return;
    target.active = !target.active;
    app.saveData();
    this.loadAll();
  },

  deleteActivity(e) {
    const id = e.currentTarget.dataset.id;
    const room = app.globalData.roomData;
    const target = (room.activities || []).find(item => item.id === id);
    if (!target) return;

    if (!target.isCustom) {
      target.active = false;
      app.saveData();
      this.loadAll();
      wx.showToast({ title: '默认活动已停用', icon: 'none' });
      return;
    }

    room.activities = room.activities.filter(item => item.id !== id);
    app.saveData();
    this.loadAll();
    wx.showToast({ title: '活动已删除', icon: 'success' });
  },

  onPointAmount(e) {
    this.setData({ 'pointForm.amount': e.detail.value });
  },

  onPointReason(e) {
    this.setData({ 'pointForm.reason': e.detail.value });
  },

  adjustPoints(e) {
    const mode = e.currentTarget.dataset.mode;
    const amount = Math.abs(parseInt(this.data.pointForm.amount));
    if (!amount || amount > 10000) {
      wx.showToast({ title: '请输入合理积分', icon: 'none' });
      return;
    }
    const delta = mode === 'sub' ? -amount : amount;
    const reason = this.data.pointForm.reason.trim()
      || (delta > 0 ? '监督者手动奖励' : '监督者手动扣分');
    app.addPointLog(delta, reason);
    this.setData({ pointForm: { amount: '', reason: '' } });
    this.loadAll();
    wx.showToast({ title: delta > 0 ? '已加分' : '已扣分', icon: 'success' });
  },

  onAppType(e) {
    this.setData({ 'appForm.typeIdx': e.detail.value });
  },

  onAppTitle(e) {
    this.setData({ 'appForm.title': e.detail.value });
  },

  onAppContent(e) {
    this.setData({ 'appForm.content': e.detail.value });
  },

  submitApplication() {
    const form = this.data.appForm;
    const title = form.title.trim();
    const content = form.content.trim();
    if (!title) {
      wx.showToast({ title: '写一下想申请什么吧', icon: 'none' });
      return;
    }
    const type = applicationTypes[form.typeIdx].value;
    app.addApplication(type, title, content || '没有补充说明');
    this.setData({ appForm: { typeIdx: 0, title: '', content: '' } });
    this.loadAll();
    wx.showToast({ title: '申请已提交', icon: 'success' });
  },

  handleApplication(e) {
    const id = e.currentTarget.dataset.id;
    const status = e.currentTarget.dataset.status;
    app.updateApplication(id, status);
    this.loadAll();
    wx.showToast({ title: status === 'approved' ? '已同意' : '已拒绝', icon: 'success' });
  },

  switchRole() {
    const room = app.globalData.roomData;
    const nextRole = app.globalData.currentRole === 'supervisor' ? 'beauty' : 'supervisor';
    app.hydrateRoom(room, nextRole, true);
    this.loadAll();
    wx.showToast({ title: nextRole === 'supervisor' ? '已切为监督者' : '已切为变美者', icon: 'none' });
  },

  leaveRoom() {
    wx.showModal({
      title: '退出房间',
      content: '退出后下次需要重新输入房间号和密码。',
      confirmText: '退出',
      confirmColor: '#FF3B30',
      success: (res) => {
        if (res.confirm) app.leaveRoom();
      }
    });
  },

  resetToday() {
    wx.showModal({
      title: '重置今日数据',
      content: '确定要重置今天的所有数据吗？',
      confirmColor: '#FF3B30',
      success: (res) => {
        if (res.confirm) {
          app.globalData.todayData = createTodayData();
          app.saveData();
          this.loadAll();
          wx.showToast({ title: '已重置', icon: 'success' });
        }
      }
    });
  },

  clearRoom() {
    wx.showModal({
      title: '删除当前房间',
      content: '这会清除当前房间的所有本地数据，无法恢复。',
      confirmText: '确认删除',
      confirmColor: '#FF3B30',
      success: (res) => {
        if (!res.confirm) return;
        wx.removeStorageSync(app.getRoomKey(app.globalData.currentRoomId));
        app.leaveRoom();
      }
    });
  }
});
