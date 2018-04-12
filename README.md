# JGBVue前端文件

------

**Quickstart：**

**安装**

clone项目

    $ git clone http://192.168.0.179:8080/tfs/DefaultCollection/_git/JGBVue
    
切换目录，安装依赖

    $ cd JGBVue&&yarn

**使用**

开发模式，具备热更新，边修改浏览器边刷新，dev 端口 7000，配置项端口为 3333

    $ yarn run dev

构建项目，将文件压缩、打包、编译，输出 dist 目录

    $ yarn run build

生产模式，不具备热更新，运行在 3333 端口

    $ yarn/npm run start
    
**详细使用教程**

#### 初次使用

克隆仓库文件至本地

    $ git clone http://192.168.0.180:8080/tfs/DefaultCollection
    
跳转至文件目录下

    $ e:
	$ cd JGBVue

安装依赖包

    $ yarn

运行

    $ yarn run start
    
#### 更新代码

    $ git pull
    
#### 添加文件
    $ git add '文件名.后缀'
    $ git commit -m'输入说明'
    $ git push origin master 

**目录结构**

    ├── app.js   # Express Server
    ├── dist     # 编译压缩目录
    │   └── views   # iframe引用html
    │   └── index.html      # 主页
    │   └── locking.html    # 锁屏页面
    │   └── login.html      #  登陆页面
    │   └── assets  # 静态资源文件
    │       ├── img
    │       ├── js
    │       └── views
    │
    ├── bin
    │   └── www   # 启动server
    │
    ├── gulpfile.js  # Gulp配置文件
    ├── package.json
    ├── src       # 开发目录
    │   └── index.html      # 主页
    │   └── locking.html    # 锁屏页面
    │   └── login.html      #  登陆页面
    │   └── include      #  复用模板页面
    │   └── assets  # 静态资源文件
    │       ├── img
    │       ├── js
    │       ├── css
    │       ├── sass    # scss格式
    │       └── views
    ├── static  # 引用的静态资源文件
    │   ├── axios   # axios
    │   ├── vue     # vue源文件
    │   ├── font-awesome    # icon
    │   └── element-ui      # element框架
    │
    ├── routes
    │   ├── views       # iframe引用页面对应的路由
    │   ├── login.js
    │   ├── index.js
    │   └── locking.js
    └── api      # 每个页面对应的交互json格式数据
        ├── upload      # 上传资源统一存放路径
        ├── views       # iframe引用页面对应的json数据
        └── login.json


**公共组件**
#### 组件 设置成员
  created by lanw 2018-4-8
  @param {Array} value 绑定选中的用户数组
  @param {Array, Object} companyList 规则-Array:公司列表 规则-Object {label, value}:公司名,公司编号
  @param {Array} departmentList 部门数据
  @param {Array} userList 用户数据
  @param {Array} checkedList 选中人员数据
  @param {Object} companyProps 公司传入对象的key属性 e.g. { label: "label", value: "number"}
  @param {Object} departmentProps 部门 传入对象的key属性 e.g. { label: "label", value: "value"}
  @param {Object} userProps 用户、选中人员 同上 {userName: "name", userId: "uid", userPic: "src", departmentName: "department", companyName: "companyName"}

  @return {Array} 绑定选中的用户数组

  @event company-change
  @event department-change
  @event search 