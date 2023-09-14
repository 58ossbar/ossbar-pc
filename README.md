# creatorblue-evgl

> 创蓝布道师

## 体验地址

[https://www.budaos.com]
### 老师账号：15886345118 老师密码：123456
### 学生账号：18229962587 学生密码：123456)

## 规范、约束

### 命名及目录规范
  1. 变量，函数等遵循常规的驼峰命名规则
  2. 文件夹，文件，路由，自定义组件等采用全小写，单词之间使用横杠分隔
  3. 自定义组件：同类别多个组件放在一个单独的文件夹下，与业务无关的通用组件，使用cb-开头，方便其他工程复用
  4. 不再使用的文件应立即删除，如果实在需要保留在工程里做代码对照，需在文件名后面追加“-过时文件”，方便后续清除

### 代码注释规范
  1. 每个vue文件中在最顶部写上文档注释：详细写明该vue页面是做什么功能用的
  2. 业务逻辑代码尽量多的写明注释，从哪里开始到哪里结束是做什么逻辑处理。
  3. 在任何页面引入其他组件或样式时，使用@/开头的绝对路径，禁止使用../开头的引用方式

### 开发规范
  1. 安装引用第三方组件时，一定要在安装指令后面追加-save或--save-dev，将依赖添加到package.json配置文件中，便于团队协作开发 例如：npm install echarts -save。修改组件版本号时也一定要记得修改package.json中的对应组件版本号。
  2. 如果引用的第三方组件只是个别一两个页面用到，请勿在main.js中注册全局组件，在使用到的页面中单独引入。

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 如何启动项目

- 自己电脑需启动后台服务

```
npm run dev
```

- 前端开发人员使用这个

```
npm run test
```

