const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const resolvePath = (...file) => path.resolve(__dirname, ...file)
const log = message => console.log(chalk.green(`${message}`))
const successLog = message => console.log(chalk.blue(`${message}`))
const errorLog = error => console.log(chalk.red(`${error}`))
const resolveComponentName = componentName => {
    componentName = componentName.toLowerCase();
    //截取单词,按大驼峰命名拼接
    let componentNameStr = componentName.split("|");
    if (componentNameStr.length > 1) {
        componentNameStr = componentNameStr.map((item) => {
            if (item.trim()) {
                return item.substring(0, 1).toUpperCase() + item.substring(1);
            }
            return '';
        });
        return componentNameStr.join('');
    } else {
        errorLog('格式错误!名称各单词之间用|隔开,单个单词如home|,多个单词如home|index')
        return '';
    }
}

// 递归创建目录
const mkdirs=(directory, callback)=> {
    var exists = fs.existsSync(directory)
    if (exists) {
        callback()
    } else {
        mkdirs(path.dirname(directory), function () {
            fs.mkdirSync(directory)
            callback()
        })
    }
}

module.exports ={
    dotExistDirectoryCreate : (directory) => {
        return new Promise((resolve) => {
            mkdirs(directory, function () {
                resolve(true)
            })
        })
    },
    generateFile : (path, data) => {
        if (fs.existsSync(path)) {
            errorLog(`${path}文件已存在`)
            return
        }
        return new Promise((resolve, reject) => {
            fs.writeFile(path, data, 'utf8', err => {
                if (err) {
                    errorLog(err.message)
                    reject(err)
                } else {
                    resolve(true)
                }
            })
        })
    },
    path: path,
    chalk: chalk,
    fs: fs,
    log: log,
    successLog: successLog,
    errorLog: errorLog,
    resolvePath: resolvePath,
    resolveComponentName: resolveComponentName

}