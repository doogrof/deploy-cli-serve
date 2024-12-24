// 进度条
const colors = require('ansi-colors') // 终端字体颜色模块
const cliProgress = require('cli-progress')
const bar = new cliProgress.SingleBar({ format: colors.cyan('{bar}') + ' | {percentage}% | {title}' })

// 定时更新进度条
let time = 0
const updateBar = totalTime => {
  // 每隔一定时间更新进度条的百分比
  const timer = setInterval(() => {
    time++
    bar.update(time)
    // 当达到100%时清除计时器
    if (time >= totalTime) {
      clearInterval(timer)
      time = 0
    }
  }, 100)
}

module.exports = {
  bar: bar,
  updateBar: updateBar,
  colors: colors
}
