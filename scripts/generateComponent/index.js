// index.js`
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
const {
    componentTemplate,
    entryTemplate,
    globalRegisterImportTemplate,
    globalRegisterExportTemplate
} = require('./template')

log('请输入要生成的组件名称、会生成在 components/目录下,如需生成全局组件，请加 g/ 前缀,名称各单词之间用|隔开,单个单词如home|,多个单词如home|index')
let componentName = ''
let isGlobal=false
process.stdin.on('data', async chunk => {
    const inputName = String(chunk).trim().toString()
    if (inputName.includes('/')) {
        const inputArr = inputName.split('/')
        componentName = inputArr[inputArr.length - 1]
        if (inputArr[0]=='g')
        {
            isGlobal=true;
        }
        else{
            isGlobal = false;
            errorLog("设置全局参数前缀错误,无法全局注册");
        }
    } else {
        componentName = inputName
    }
    //判断名字是否包含|,不包含提示错误,重新输入,包含则按大驼峰拼接
    componentName = resolveComponentName(componentName);
    if (!componentName) {
        return;
    }
    /**
     * 组件目录路径
     */
    const componentDirectory = resolvePath('../src/components', componentName)

    /**
     * vue组件路径
     */
    const componentVueName = resolvePath(componentDirectory, `${componentName}.vue`)
    /**
     * 入口文件路径
     */
    const entryComponentName = resolvePath(componentDirectory, 'index.js')

    const hasComponentDirectory = fs.existsSync(componentDirectory)
    if (hasComponentDirectory) {
        errorLog(`${componentName}组件目录已存在，请重新输入`)
        return
    } else {
        log(`正在生成 component 目录 ${componentDirectory}`)
        await dotExistDirectoryCreate(componentDirectory)
    }
    try {
        log(`正在生成 vue 文件 ${componentVueName}`)
        await generateFile(componentVueName, componentTemplate(componentName))
        log(`正在生成 entry 文件 ${entryComponentName}`)
        await generateFile(entryComponentName, entryTemplate(componentName))
        if (isGlobal)
        {
            log(`正在注册全局组件文件 ${componentName}`)
            await addGlobalComponent(componentName);
        }
        successLog('组件生成成功')
    } catch (e) {
        errorLog(e.message)
    }

    process.stdin.emit('end')
})
process.stdin.on('end', () => {
    log('exit')
    process.exit()
})

//添加全局注册
function addGlobalComponent(fileName) {
    const file = resolvePath('../src/components', 'index.js');
    return new Promise((resolve,reject)=>{
        if (fs.existsSync(file)) {
            fs.readFile(file, 'utf-8', (err, data) => {
                if (err) {
                    errorLog(err.message);
                    reject();
                } else {
                    let dataStr = data.toString();
                    let importStr, exportStr;
                    if (!dataStr) {
                        emptyComponentAdd(file, fileName).then(()=>{
                            resolve();
                        });
                        return;
                    }
                    let dataList = dataStr.split("export");
                    if (dataList && dataList.length == 2) {
                        importStr = dataList[0];
                        importStr += globalRegisterImportTemplate(fileName);
                        exportStr = 'export' + dataList[1];
                        exportStr = exportStr.replace(/}/, globalRegisterExportTemplate(fileName));
                        let writeStr = importStr + '\n' + exportStr;
                        writeDataToFile(file, writeStr).then(() => {
                            resolve();
                        });;
                    } else {
                        errorLog("components/index.js格式不规范,请调整为标准格式后重试");
                        reject();
                    }
                }
            });
        } else {
            emptyComponentAdd(file, fileName).then(()=>{
                resolve();
            });
        }
    })
    

    function emptyComponentAdd(file,fileName) {
        let importStr = globalRegisterImportTemplate(fileName);
        let exportStr = `export default (Vue) => {\n${globalRegisterExportTemplate(fileName)}`;
        let writeStr = importStr + '\n' + exportStr;
        return writeDataToFile(file, writeStr);
    }

    function writeDataToFile(file, data) {
        return new Promise((resolve,reject)=>{
            fs.writeFile(file, data, {
                'flag': 'w'
            }, function (err) {
                if (err) {
                    errorLog(err.message);
                    reject();
                }
                successLog('全局注册成功!');
                resolve();
            });
        })
        
    }
}
