// 工具函数库
const fs = require('fs')
const path = require('path')
const colors = require('ansi-colors') // 终端字体颜色模块
const { exec, execSync, spawn } = require('child_process')

// 判断是否npm install
const isNpmInstalled = rootDir => {
  const nodeModulesExists = fs.existsSync(path.join(rootDir, 'node_modules'))
  return nodeModulesExists
}

// 判断模块是否安装
const isPackageInstalled = packageName => {
  try {
    require.resolve(packageName) // 尝试解析模块
    return true // 如果能解析，说明模块已安装
  } catch (err) {
    return false // 如果抛出错误，说明模块未安装
  }
}

// 执行exec
const runExecSync = async command => {
  return new Promise((resolve, reject) => {
    const res = execSync(`${command}`, { cwd: process.cwd() })
    console.log(res.toString())
    resolve()
  })
}

// 执行spawn
const runSpawn = async command => {
  return new Promise((resolve, reject) => {
    // windows下npm,yarn需要以npm.cmd,yarn.cmd执行spawn
    const commandArgs = command.split(' ')
    let commandPath = commandArgs[0]
    if (inArray(commandArgs[0], ['npm', 'yarn'])) {
      commandPath = process.platform === 'win32' ? `${commandArgs[0]}.cmd` : commandArgs[0]
    }
    commandArgs.shift()
    const res = spawn(commandPath, commandArgs, { cwd: process.cwd() })
    res.stdout.on('data', data => {
      console.log(`${data}`)
    })
    res.stderr.on('data', data => {
      console.log(`${data}`)
    })
    res.on('close', code => {
      console.log(`${command} exited with code ${code}`)
      if (code !== 0) {
        process.exit()
      }
      resolve()
    })
  })
}

// 判断是否安装yarn
const isYarnInstalled = async () => {
  return new Promise((resolve, reject) => {
    exec('yarn --version', { cwd: process.cwd() }, async (error, stdout, stderr) => {
      if (error) {
        console.error('yarn 没有安装, 执行安装 yarn ...')
        await runSpawn('npm install -g yarn')
      }
      resolve()
    })
  })
}

const isProjectInstalled = async () => {
  if (!isNpmInstalled(process.cwd())) {
    try {
      console.log('项目尚未 install, 执行 install 中...')
      await runSpawn('yarn install')
    } catch (error) {
      console.log(colors.red('项目install 失败'))
    }
  }
}

// 判断数组中是否包含某个元素
const inArray = (val, arr) => {
  if (!arr) return false
  var testStr = ',' + arr.join(',') + ','
  return testStr.indexOf(',' + val + ',') != -1
}

// 获取项目package.json数据
const projectInfo = require(`${process.cwd()}\\package.json`)

// 包配置信息
const packageInfo = require('../package.json')

module.exports = {
  isNpmInstalled: isNpmInstalled,
  isPackageInstalled: isPackageInstalled,
  runExecSync: runExecSync,
  runSpawn: runSpawn,
  isYarnInstalled: isYarnInstalled,
  isProjectInstalled: isProjectInstalled,
  projectInfo: projectInfo,
  packageInfo: packageInfo,
  inArray: inArray,
}
