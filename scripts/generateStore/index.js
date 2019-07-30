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
    storeTemplate,
    storeRegisterImportTemplate,
    storeRegisterExportTemplate
} = require('./template')

log('请输入要生成的store名称、会生成在 store/modules/目录下,名称各单词之间用|隔开,单个单词如home|,多个单词如home|index')
let componentName = ''
process.stdin.on('data', async chunk => {
    // store名称
    const inputName = String(chunk).trim().toString()
    // 获取要创建的store名称
    if (inputName.includes('/')) {
        const inputArr = inputName.split('/')
        componentName = inputArr[inputArr.length - 1]
    } else {
        componentName = inputName
    }
    //判断名字是否包含|,不包含提示错误,重新输入,包含则按大驼峰拼接
    componentName = resolveComponentName(componentName);
    if (!componentName) {
        return;
    }
    //store用小驼峰
    componentName = componentName.substring(0, 1).toLowerCase() + componentName.substring(1);
    // store跟页面路径
    const storePath = resolvePath('../src', "store")
    if (!fs.existsSync(storePath)) {
        log(`正在生成 store 文件夹`)
        await dotExistDirectoryCreate(storePath)
    }
    // store跟页面路径
    const componentPath = resolvePath(storePath, "modules")
    if (!fs.existsSync(componentPath)) {
        log(`正在生成 modules 文件夹`)
        await dotExistDirectoryCreate(componentPath)
    }
    // store文件
    const storeFile = resolvePath(componentPath, `${componentName}.js`)
    
    // 判断要创建的store文件是否存在
    const hasComponentExists = fs.existsSync(storeFile)
    if (hasComponentExists) {
        errorLog(`${inputName}文件已存在，请重新输入`)
        return
    } 
    try {
        log(`正在生成 store 文件 ${storeFile}`)
        await generateFile(storeFile, storeTemplate(componentName))
        log(`正在注册store文件 ${storeFile}`)
        await addStore(componentName);
        successLog('store生成成功')
    } catch (e) {
        errorLog(e.message)
    }

    process.stdin.emit('end')
})
process.stdin.on('end', () => {
    log('exit')
    process.exit()
})

function addStore(fileName) {
    const file = resolvePath('../src/store', 'index.js');
    let storeListItem;
    return new Promise((resolve,reject)=>{
        if (fs.existsSync(file)) {
            fs.readFile(file, 'utf-8', (err, data) => {
                if (err) {
                    errorLog(err.message);
                    reject(err.message);
                } else {
                    let dataStr = data.toString();
                    if (!dataStr) {
                        emptyIndexAdd(file, fileName).then(() => {
                            resolve();
                        });;
                    } else {
                        addStoreResgiter(dataStr, fileName).then(() => {
                            resolve();
                        });;
                    }
                }
            });
        } else {
            emptyIndexAdd(file, fileName).then(()=>{
                resolve();
            });
        }
    })

    function addStoreResgiter(dataStr, fileName) {
        return new Promise((resolve,reject)=>{
            //1.根据Vue.use(Vuex)分割,0是import注册部分,1是引入部分
            let storeRegisterList = dataStr.split('Vue.use(Vuex)');
            if (storeRegisterList && storeRegisterList.length==2)
            {
                let storeRegisterImport = storeRegisterList[0];
                storeRegisterImport +=storeRegisterImportTemplate(fileName);
                let storeRegisterUse = storeRegisterList[1];
                //匹配modules:{},往modules对象中加内容
                let reg = /(modules\s*:\s*\{)((.|\s)*?)\}/;
                let storeList = storeRegisterUse.match(reg);
                if (storeList && storeList.input) {
                    storeListItem = storeList[1] + storeList[2] + (storeList[2].trim()?",":"") + storeRegisterExportTemplate(fileName) + "\n}";
                    dataStr = storeRegisterUse.replace(reg, storeListItem);
                    dataStr = storeRegisterImport + "\nVue.use(Vuex)" + dataStr;
                    console.log(dataStr);
                    writeDataToFile(file, dataStr).then(()=>{
                        resolve();
                    });
                } else {
                    errorLog("store/index.js页面结构不正确,本次注册store失败!");
                    reject();
                }
            }else{
                errorLog("store/index.js页面结构不正确,本次注册store失败!");
                reject();
            }
        })
       
    }

    function emptyIndexAdd(file, fileName) {
        let importStr = `import Vue from 'vue'
import Vuex from 'vuex'
import types from './mutationTypes'
import ${fileName} from './modules/${fileName}'
Vue.use(Vuex)
export default new Vuex.Store({
    types,
    modules: {
        ${fileName}
    }
})`;
        return writeDataToFile(file, importStr);
    }

    function writeDataToFile(file, data) {
        return new Promise((resolve,reject)=>{
            fs.writeFile(file, data, function (err) {
                console.log(err);
                if (err) {
                    errorLog(err.message);
                    reject(err.message);
                }
                successLog('store注册成功!');
                resolve();
            });
        });
        
    }
}
