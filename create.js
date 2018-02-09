const fs      = require('fs')
const path    = require('path')
const ejs     = require('ejs')
const yargs   = require('yargs')
const extract = require('extract-zip')
const argv    = yargs.alias('n', 'name').alias('p', 'port').alias('t', 'tpl').argv

// 字符串中第一个英文变大写
function fristWorldToLocaleUpperCase (str) {
    if (typeof str === 'string') {
        let first = str.substr(0, 1)
        first = first.toLocaleUpperCase()
        let result = first + str.substr(1)
        return result
    }
    return str
}

// ejs编译
function compile (jspath, obj) {
    var js_str =  fs.readFileSync(jspath, 'utf8')
    const ejs_js_str = ejs.render(js_str, obj)
    var fd = fs.openSync(jspath, 'w')
    fs.writeSync(fd, ejs_js_str)
}


// 人机交互
function readSyncByfs(tips) {
    tips = tips || '> '
    process.stdout.write(tips)
    process.stdin.pause()

    const buf = Buffer.allocUnsafe(10000)
    let response = fs.readSync(process.stdin.fd, buf, 0, 10000, 0)
    process.stdin.end()

    return buf.toString('utf8', 0, response).trim()
}

// 删除文件夹
function deleteall(path) {  
    var files = []  
    if(fs.existsSync(path)) {  
        files = fs.readdirSync(path)  
        files.forEach(function(file, index) {  
            var curPath = path + "/" + file  
            if(fs.statSync(curPath).isDirectory()) {   
                deleteall(curPath)  
            } else { 
                fs.unlinkSync(curPath)  
            }  
        })  
        fs.rmdirSync(path)  
    }  
}  

function create () {
    // 解压路径
    let basePath = './components'
    let projectName = fristWorldToLocaleUpperCase(argv.name)
    const PROJECT_PATH = path.join(__dirname, `${basePath}/${projectName}`)
    // 模板名称
    let tplName = argv.tpl || 'component'
    const TEMPLATE_PROJECT = path.join(__dirname, `templates/${tplName}.zip`)
    fs.exists(PROJECT_PATH, function (exists) {
        if (exists) {
            console.error('项目已存在, 请更换名称')
            var a = readSyncByfs("是否要强制替换？(y/n)")
            if (a.toLocaleLowerCase() === 'y') {
                deleteall(PROJECT_PATH)
                create()
            }
        } else {
            // 创建模版目录
            extract(TEMPLATE_PROJECT, {dir: PROJECT_PATH}, function (err) {
                  if (!err) {
                        // 读取js文件，那么进行ejs
                        compile(`${PROJECT_PATH}/src/template.js`,  { name: projectName })
                        // 读取index.html文件的话，那么进行ejs
                        compile(`${PROJECT_PATH}/index.html`,  { name: projectName })
                        // 修改src/template.scss 文件名
                        fs.renameSync(path.join(PROJECT_PATH, 'src/template.scss'), path.join(PROJECT_PATH, `src/${projectName}.scss`))
                        // 修改src/template.js 文件名
                        fs.renameSync(path.join(PROJECT_PATH, 'src/template.js'), path.join(PROJECT_PATH, `src/${projectName}.js`))
                        // 提示一下
                        console.log(`创建${projectName}组件成功：${PROJECT_PATH}`)
                  } else {
                        console.error(err)
                  }
            })
        }
    })
}

create()


