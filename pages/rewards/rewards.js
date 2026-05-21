const { getRewards, defaultPunishments } = require('../../utils/data');
const app = getApp();

Page({
  data: {
    role: 'beauty',
    totalPoints: 0,
    rewards: getRewards(),
    punishments: defaultPunishments,
    redeemedList: []
  },

  onShow() {
    if (!app.ensureRoom()) return;
    const room = app.globalData.roomData || {};
    const redeemed = room.redeemed || [];
    this.setData({
      role: app.globalData.currentRole,
      totalPoints: app.globalData.totalPoints,
      rewards: getRewards(),
      redeemedList: redeemed
    });
  },

  redeemReward(e) {
    if (this.data.role === 'supervisor') {
      wx.showToast({ title: '监督者可在“我的”管理奖励', icon: 'none' });
      return;
    }

    const item = e.currentTarget.dataset.item;
    const { totalPoints } = this.data;

    if (totalPoints < item.points) {
      const need = item.points - totalPoints;
      wx.showToast({
        title: `积分不足，还差${need}分`,
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '确认兑换',
      content: `使用 ${item.points} 积分兑换"${item.name}"？\n ${item.desc}`,
      confirmText: '兑换',
      confirmColor: '#FF6B8A',
      success: (res) => {
        if (res.confirm) {
          app.globalData.totalPoints -= item.points;
          const room = app.globalData.roomData;

          const redeemed = room.redeemed || [];
          redeemed.unshift({
            ...item,
            date: app.getDateString()
          });
          room.redeemed = redeemed;
          room.pointLogs = room.pointLogs || [];
          room.pointLogs.unshift({
            id: 'plog_' + Date.now(),
            date: app.getDateString(),
            amount: -item.points,
            reason: `兑换奖励：${item.name}`,
            operator: '变美者'
          });
          app.saveData();

          this.setData({
            totalPoints: app.globalData.totalPoints,
            redeemedList: redeemed
          });

          wx.showToast({
            title: '兑换成功！找男友兑现吧~',
            icon: 'none',
            duration: 2000
          });
        }
      }
    });
  },

  randomPunishment() {
    const list = this.data.punishments;
    const idx = Math.floor(Math.random() * list.length);
    const pun = list[idx];
    wx.showModal({
      title: '😈 被抽中的惩罚',
      content: `${pun.icon} ${pun.name}`,
      confirmText: '接受惩罚',
      confirmColor: '#FF3B30',
      showCancel: true,
      cancelText: '再抽一个',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '认罚就是好宝宝~',
            icon: 'none'
          });
        } else {
          this.randomPunishment();
        }
      }
    });
  }
});
