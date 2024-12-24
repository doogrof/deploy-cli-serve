const { spawn } = require('child_process')
const { bar, updateBar, colors } = require('./bar.js')
const { feishuConfig } = require('./config.js')

/**
 * 飞书相关函数
 */

// 发送机器人消息到飞书群聊
const sendMessage = async messageText => {
  return new Promise((resolve, reject) => {
    bar.start(50, 0, { title: '飞书消息发送中...' })
    updateBar(50)
    // 消息体
    const message = {
      msg_type: 'text',
      content: {
        text: messageText,
      },
    }
    // 发送群组消息的命令
    const messageStr = JSON.stringify(message)
    const curl = spawn('curl', ['-X', 'POST', '-H', 'Content-Type: application/json; charset=utf-8;', '-d', messageStr, feishuConfig.webhookUrl])
    curl.on('close', code => {
      if (code === 0) {
        bar.update(50, { title: colors.green(`飞书消息发送成功`) })
      } else {
        bar.update(50, { title: colors.red(`飞书消息发送失败`) })
      }
      bar.stop()
      resolve()
    })
  })
}
module.exports = {
  sendMessage: sendMessage,
}
