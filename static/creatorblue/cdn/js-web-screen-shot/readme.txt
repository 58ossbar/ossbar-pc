修改了screenShotPlugin.umd.js中

1、大概在14133行，将代码 

 // html2canvas截屏
        html2canvas_default()(document.body, {})

修改为如下代码

 // html2canvas截屏
        html2canvas_default()(document.body, {
            useCORS: true, // 自己修改 ---- 解决图片跨域空白问题
            allowTaint: true // 自己修改 ---- 解决图片跨域空白问题
        })

2、大概在12321行，将代码 （ drawCutOutBox方法中）

context.drawImage(imageController, 0, 0, imgWidth, imgHeight);

修改为如下代码

context.drawImage(imageController, 0, 0, imgWidth, imgHeight, 0, 0, window.innerWidth, window.innerHeight); // 自己修改 ---解决 截图模糊问题

3、大概在13009行，将代码 （ drawRectangle方法中）

context.drawImage(imageController, 0, 0, controller === null || controller === void 0 ? void 0 : controller.width, controller === null || controller === void 0 ? void 0 : controller.height); // 绘制结束

修改为如下代码

context.drawImage(imageController, 0, 0, controller === null || controller === void 0 ? void 0 : controller.width, controller === null || controller === void 0 ? void 0 : controller.height, 0, 0, window.innerWidth, window.innerHeight); // 绘制结束 // 自己修改 -----解决 截图模糊问题



