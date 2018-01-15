# JGBVue前端文件

------

**Quickstart：**

**安装**

clone项目

    $ git clone http://192.168.0.179:8080/tfs/DefaultCollection/_git/JGBVue
    
切换目录，安装依赖，已安装淘宝镜像用cnpm代替npm

    $ cd JGBVue&& npm i
    
**使用**

开发者模式，项目在端口号3001打开，端口被占用请关闭占用端口或更改server.js文件端口号

    npm start

**目录结构**

    ├── server.js   # Express Server
    ├── dist     # 编译压缩目录
    │   └── index.html      # 主页
    │   └── locking.html    # 锁屏页面
    │   └── login.html      #  登陆页面
    │   └── assets  # 静态资源文件
    │       ├── img
    │       ├── js
    │       ├── css
    │       └── views
    │
    ├── gulpfile.js  # Gulp配置文件
    ├── package.json
    ├── src       # 开发目录
    │   └── index.html      # 主页
    │   └── locking.html    # 锁屏页面
    │   └── login.html      #  登陆页面
    │   └── assets  # 静态资源文件
    │       ├── img
    │       ├── js
    │       ├── css
    │       ├── sass    # scss格式
    │       └── views
    ├── routes
    │   ├── views       # iframe引用页面对应的路由
    │   ├── login.js
    │   ├── index.js
    │   └── locking.js
    └── api      # 每个页面对应的交互json格式数据
        ├── upload      # 上传资源统一存放路径
        ├── views       # iframe引用页面对应的json数据
        └── login.json

