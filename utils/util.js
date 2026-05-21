/**
 * 格式化日期
 */
function formatDate(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * 计算 BMI
 */
function calcBMI(weight, height) {
  const h = height / 100;
  return (weight / (h * h)).toFixed(1);
}

/**
 * 获取 BMI 描述
 */
function getBMIDesc(bmi) {
  if (bmi < 18.5) return '偏瘦';
  if (bmi < 24) return '标准';
  if (bmi < 28) return '偏胖';
  return '肥胖';
}

/**
 * 计算已减重量
 */
function calcLost(start, current) {
  return (start - current).toFixed(1);
}

/**
 * 计算减肥进度百分比
 */
function calcProgress(start, current, target) {
  if (start <= target) return 0;
  const total = start - target;
  const done = start - current;
  return Math.min(100, Math.max(0, Math.round((done / total) * 100)));
}

/**
 * 获取今天的日期字符串
 */
function getToday() {
  return formatDate();
}

/**
 * 获取一周日期数组
 */
function getWeekDates() {
  const dates = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.push(formatDate(d));
  }
  return dates;
}

/**
 * 随机鼓励语
 */
function getEncourageMsg() {
  const msgs = [
    '亲爱的，你今天的坚持，是明天最美的自己 ❤️',
    '每天变轻一点点，就像我对你的爱多一点点 💕',
    '你的努力我都看在眼里，真的太棒了！',
    '健康地瘦下来，我们要一起走很远很远 🥰',
    '你是我心中最美的女孩，不管什么体重 💖',
    '为了健康和漂亮的你，我们一起加油！',
    '今天也要元气满满地运动哦～',
    '吃清真健康餐的你，美得像Elsa ✨',
    '不管减不减肥，你在我心里永远是满分 💯',
    '坚持下去，我一直在你身边 👫'
  ];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

module.exports = {
  formatDate,
  calcBMI,
  getBMIDesc,
  calcLost,
  calcProgress,
  getToday,
  getWeekDates,
  getEncourageMsg
};
