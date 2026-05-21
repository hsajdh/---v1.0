const DEFAULT_USER_INFO = {
  avatar: '',
  nickname: '亲爱的',
  currentWeight: 65,
  targetWeight: 55,
  startWeight: 70,
  startDate: '2026-05-01',
  height: 165
};

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

const DEFAULT_ACTIVITIES = [
  {
    id: 'act1',
    name: '晚饭后散步 30 分钟',
    icon: '🚶‍♀️',
    desc: '饭后轻松走一走，完成后可领积分。',
    points: 8,
    active: true,
    isCustom: false
  },
  {
    id: 'act2',
    name: '无糖饮料日',
    icon: '🥤',
    desc: '今天只喝水、茶或无糖饮品。',
    points: 6,
    active: true,
    isCustom: false
  },
  {
    id: 'act3',
    name: '早睡挑战',
    icon: '😴',
    desc: '23:30 前准备睡觉，精神和状态都要美。',
    points: 10,
    active: true,
    isCustom: false
  }
];

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

function createDefaultRoomData(roomId, password) {
  return {
    roomId,
    password,
    createdAt: new Date().toISOString(),
    lastDate: '',
    userInfo: clone(DEFAULT_USER_INFO),
    todayData: createTodayData(),
    totalPoints: 0,
    checkinDays: 0,
    history: [],
    customFoods: [],
    customExercises: [],
    customRewards: [],
    activities: clone(DEFAULT_ACTIVITIES),
    applications: [],
    redeemed: [],
    pointLogs: [],
    activityLogs: []
  };
}

App({
  globalData: {
    currentRoomId: '',
    currentRole: '',
    roleName: '',
    roomData: null,
    userInfo: clone(DEFAULT_USER_INFO),
    todayData: createTodayData(),
    totalPoints: 0,
    checkinDays: 0,
    history: []
  },

  onLaunch() {
    const session = wx.getStorageSync('currentSession');
    if (session && session.roomId) {
      const room = this.getRoom(session.roomId);
      if (room) {
        this.hydrateRoom(room, session.role || 'beauty', false);
        this.checkNewDay();
      }
    }
  },

  getRoomKey(roomId) {
    return `love_room_${String(roomId || '').trim()}`;
  },

  getDateString(date) {
    const d = date ? new Date(date) : new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  getRoom(roomId) {
    return wx.getStorageSync(this.getRoomKey(roomId)) || null;
  },

  enterRoom(roomId, password, role) {
    const id = String(roomId || '').trim();
    const pwd = String(password || '').trim();
    const selectedRole = role || 'beauty';

    if (!id || !pwd) {
      return { ok: false, message: '请输入房间号和统一密码' };
    }

    let room = this.getRoom(id);
    if (room && room.password !== pwd) {
      return { ok: false, message: '房间密码不正确' };
    }

    if (!room) {
      room = createDefaultRoomData(id, pwd);
      wx.setStorageSync(this.getRoomKey(id), room);
    }

    this.hydrateRoom(room, selectedRole, true);
    this.checkNewDay();
    return { ok: true, room: this.globalData.roomData };
  },

  hydrateRoom(room, role, persistSession) {
    const normalized = this.normalizeRoomData(room);
    const selectedRole = role === 'supervisor' ? 'supervisor' : 'beauty';

    this.globalData.currentRoomId = normalized.roomId;
    this.globalData.currentRole = selectedRole;
    this.globalData.roleName = selectedRole === 'supervisor' ? '监督者' : '变美者';
    this.globalData.roomData = normalized;
    this.globalData.userInfo = normalized.userInfo;
    this.globalData.todayData = normalized.todayData;
    this.globalData.totalPoints = normalized.totalPoints;
    this.globalData.checkinDays = normalized.checkinDays;
    this.globalData.history = normalized.history;

    if (persistSession) {
      wx.setStorageSync('currentSession', {
        roomId: normalized.roomId,
        role: selectedRole,
        loginAt: new Date().toISOString()
      });
    }
  },

  normalizeRoomData(room) {
    const fallback = createDefaultRoomData(room.roomId || '', room.password || '');
    return {
      ...fallback,
      ...room,
      userInfo: { ...fallback.userInfo, ...(room.userInfo || {}) },
      todayData: { ...fallback.todayData, ...(room.todayData || {}) },
      history: room.history || [],
      customFoods: room.customFoods || [],
      customExercises: room.customExercises || [],
      customRewards: room.customRewards || [],
      activities: room.activities || clone(DEFAULT_ACTIVITIES),
      applications: room.applications || [],
      redeemed: room.redeemed || [],
      pointLogs: room.pointLogs || [],
      activityLogs: room.activityLogs || []
    };
  },

  syncRoomData() {
    const room = this.globalData.roomData;
    if (!room) return null;

    room.userInfo = this.globalData.userInfo;
    room.todayData = this.globalData.todayData;
    room.totalPoints = this.globalData.totalPoints;
    room.checkinDays = this.globalData.checkinDays;
    room.history = this.globalData.history;
    return room;
  },

  saveData() {
    const room = this.syncRoomData();
    if (room && room.roomId) {
      wx.setStorageSync(this.getRoomKey(room.roomId), room);
      return;
    }

    wx.setStorageSync('appData', {
      userInfo: this.globalData.userInfo,
      todayData: this.globalData.todayData,
      totalPoints: this.globalData.totalPoints,
      checkinDays: this.globalData.checkinDays,
      history: this.globalData.history
    });
  },

  checkNewDay() {
    if (!this.globalData.currentRoomId || !this.globalData.roomData) return;

    const today = this.getDateString();
    const room = this.globalData.roomData;
    if (room.lastDate !== today) {
      this.globalData.todayData = createTodayData();
      room.todayData = this.globalData.todayData;
      room.lastDate = today;
      this.saveData();
    }
  },

  ensureRoom() {
    if (this.globalData.currentRoomId) return true;
    wx.reLaunch({ url: '/pages/room/room' });
    return false;
  },

  isSupervisor() {
    return this.globalData.currentRole === 'supervisor';
  },

  addPointLog(points, reason) {
    const amount = Number(points) || 0;
    const room = this.globalData.roomData;
    if (!room || !amount) return;

    this.globalData.totalPoints = Math.max(0, this.globalData.totalPoints + amount);
    room.pointLogs = room.pointLogs || [];
    room.pointLogs.unshift({
      id: makeId('plog'),
      date: this.getDateString(),
      amount,
      reason: reason || '积分调整',
      operator: this.globalData.roleName || '系统'
    });
    this.saveData();
  },

  addApplication(type, title, content) {
    const room = this.globalData.roomData;
    if (!room) return null;

    const appItem = {
      id: makeId('apply'),
      type,
      title,
      content,
      status: 'pending',
      reply: '',
      createdAt: new Date().toISOString(),
      createdDate: this.getDateString()
    };
    room.applications = room.applications || [];
    room.applications.unshift(appItem);
    this.saveData();
    return appItem;
  },

  updateApplication(id, status, reply) {
    const room = this.globalData.roomData;
    if (!room) return;

    const target = (room.applications || []).find(item => item.id === id);
    if (!target) return;
    target.status = status;
    target.reply = reply || (status === 'approved' ? '已同意，监督者会安排～' : '这次先不安排，换个更适合的吧');
    target.handledAt = new Date().toISOString();
    this.saveData();
  },

  leaveRoom() {
    wx.removeStorageSync('currentSession');
    this.globalData.currentRoomId = '';
    this.globalData.currentRole = '';
    this.globalData.roleName = '';
    this.globalData.roomData = null;
    this.globalData.userInfo = clone(DEFAULT_USER_INFO);
    this.globalData.todayData = createTodayData();
    this.globalData.totalPoints = 0;
    this.globalData.checkinDays = 0;
    this.globalData.history = [];
    wx.reLaunch({ url: '/pages/room/room' });
  }
});
