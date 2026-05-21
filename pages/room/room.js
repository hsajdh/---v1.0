const app = getApp();

Page({
  data: {
    roomId: '',
    password: '',
    role: 'beauty',
    lastSession: null
  },

  onLoad() {
    const lastSession = wx.getStorageSync('currentSession') || null;
    this.setData({
      lastSession,
      roomId: lastSession ? lastSession.roomId : '',
      role: lastSession ? lastSession.role : 'beauty'
    });
  },

  onRoomInput(e) {
    this.setData({ roomId: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  selectRole(e) {
    this.setData({ role: e.currentTarget.dataset.role });
  },

  continueLastRoom() {
    const session = this.data.lastSession;
    if (!session || !session.roomId) return;
    const room = app.getRoom(session.roomId);
    if (!room) {
      wx.showToast({ title: '上次房间不存在了', icon: 'none' });
      return;
    }
    app.hydrateRoom(room, session.role || 'beauty', true);
    app.checkNewDay();
    this.goHome(session.role || 'beauty');
  },

  joinRoom() {
    const result = app.enterRoom(this.data.roomId, this.data.password, this.data.role);
    if (!result.ok) {
      wx.showToast({ title: result.message, icon: 'none' });
      return;
    }

    wx.showToast({
      title: this.data.role === 'supervisor' ? '监督者已进入' : '变美者已进入',
      icon: 'success',
      duration: 700
    });
    setTimeout(() => this.goHome(this.data.role), 500);
  },

  goHome(role) {
    wx.switchTab({
      url: role === 'supervisor' ? '/pages/profile/profile' : '/pages/index/index'
    });
  }
});
