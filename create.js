const fs      = require('fs')
const path    = require('path')
const ejs     = require('ejs')
const yargs   = require('yargs')
const extract = require('extract-zip')
const argv    = yargs.alias('n', 'name').alias('p', 'port').alias('t', 'tpl').argv


function fristWorldToLocaleUpperCase (str) {
    if (typeof str === 'string') {
        let first = str.substr(0, 1)
        first = first.toLocaleUpperCase();
        let result = first + str.substr(1);
        return result
    }
    return str;
}

function ejsTo (jspath, obj) {
    var js_str =  fs.readFileSync(jspath, 'utf8');
    const ejs_js_str = ejs.render(js_str, obj);
    var fd = fs.openSync(jspath, 'w');
    fs.writeSync(fd, ejs_js_str);
}


function create () {
    let basePath = './components';
    let projectName = fristWorldToLocaleUpperCase(argv.name);
    let tplName = argv.tpl || 'component';
    const PROJECT_PATH = path.join(__dirname, `${basePath}/${projectName}`);
    const TEMPLATE_PROJECT = path.join(__dirname, `templates/${tplName}.zip`);

    fs.exists(PROJECT_PATH, function (exists) {
        if(exists){
            console.error('项目已存在, 请更换名称')
        } else {
            // 创建模版目录
            extract(TEMPLATE_PROJECT, {dir: PROJECT_PATH}, function (err) {
                  if (!err) {
                    // 读取js文件，那么进行ejs
                    ejsTo(`${PROJECT_PATH}/src/template.js`,  { name: projectName })
                    // 读取index.html文件的话，那么进行ejs
                    ejsTo(`${PROJECT_PATH}/index.html`,  { name: projectName })
                    
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
    });
}

create()