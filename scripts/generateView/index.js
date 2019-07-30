// index.js
//导入公用方法
const {
    dotExistDirectoryCreate,
    generateFile,
    fs,
    log,
    resolvePath,
    successLog,
    errorLog,
    resolveComponentName
} = require('../common.js');
// 导入模板
const {
    viewTemplate,
    entryTemplate,
    viewRouterTemplate
} = require('./template');


log('请输入要生成的页面名称、会生成在 views/目录下,页面名称各单词之间用|隔开,单个单词如home|,多个单词如home|index')
let componentName = ''
process.stdin.on('data', async chunk => {
    // 组件名称
    const inputName = String(chunk).trim().toString()
    // 获取组件名
    if (inputName.includes('/')) {
        const inputArr = inputName.split('/')
        componentName = inputArr[inputArr.length - 1]
    } else {
        componentName = inputName
    }
    //判断名字是否包含|,不包含提示错误,重新输入,包含则按大驼峰拼接
    componentName = resolveComponentName(componentName);
    if (!componentName)
    {
        return;
    }
    // Vue页面组件路径
    const componentPath = resolvePath('../src/views', componentName)
    // vue文件
    const vueFile = resolvePath(componentPath, `${componentName}.vue`)
    // 入口文件
    const entryFile = resolvePath(componentPath, 'index.js')
    // 判断组件文件夹是否存在
    const hasComponentExists = fs.existsSync(componentPath)
    if (hasComponentExists) {
        errorLog(`${inputName}页面组件已存在，请重新输入`)
        return
    } else {
        log(`正在生成 view 目录 ${componentPath}`)
        await dotExistDirectoryCreate(componentPath)
    }
    try {
        log(`正在生成 vue 文件 ${vueFile}`)
        await generateFile(vueFile, viewTemplate(componentName))
        log(`正在生成 entry 文件 ${entryFile}`)
        await generateFile(entryFile, entryTemplate(componentName))
        log(`正在注册路由文件 ${componentName}`)
        await addRouter(componentName);
        successLog('页面生成成功')
    } catch (e) {
        errorLog(e.message)
    }

    process.stdin.emit('end')
})
process.stdin.on('end', () => {
    log('exit')
    process.exit()
})

function addRouter(fileName) {
    const file = resolvePath('../src/router', 'index.js');
    let reg = /(routes\s*:\s*\[)((.|\s)*?)\]/;
    let routerListItem;
    return new Promise((resolve, reject) => {
        if (fs.existsSync(file)) {
                fs.readFile(file, 'utf-8', (err, data) => {
                    if (err) {
                        errorLog(err.message);
                        reject();
                    } else {
                        let dataStr = data.toString();
                        if (!dataStr) {
                            emptyIndexAdd(file, fileName).then(()=>{
                                resolve();
                            });
                        } else {
                            let routerList = dataStr.match(reg);
                            if (routerList && routerList.input) {
                                routerListItem = routerList[1] + routerList[2] + (routerList[2].trim() ?
                                    "," : '') + viewRouterTemplate(fileName) + "]";
                                dataStr = dataStr.replace(reg, routerListItem);
                                writeDataToFile(file, dataStr).then(()=>{
                                    resolve();
                                });
                                
                            } else {
                                errorLog("router/index.js页面结构不正确,本次注册路由失败!");
                                reject();
                            }
                        }
                    }
            
            })
        } else {
            emptyIndexAdd(file, fileName).then(()=>{
                resolve();
            });
        }
    });

    function emptyIndexAdd(file, fileName) {
       
        let importStr = `
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
let router = new Router({
        mode: 'hash',
        routes: [
            {
                path: '/${fileName}',
                name: ${fileName},
                component: () => import("@/views/${fileName}/${fileName}") 
            }
        ]
})
router.beforeEach((to, from, next) => {
next();
})
export default router
`
        return writeDataToFile(file, importStr);
    }

    function writeDataToFile(file, data) {
        return new Promise((resolve,reject)=>{
            fs.writeFile(file, data, {
                'flag': 'w'
            }, function (err) {
                if (err) {
                    errorLog(err.message);
                    reject(err.message);
                }
                successLog('路由注册成功!');
                resolve();
            });
        })
        
    }
}
