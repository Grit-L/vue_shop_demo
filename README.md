## 项目结构

1. vue_shop 是vue前端项目
2. 
   vue_api_server 是api服务

3. 
   具体api内容可查看接口文档

4. dist是压缩后生成的生产环境项目



## 项目启动

1. 进入vue_api_server文件夹：  

   ```nodejs
   启动后台api项目
   node app.js
   ```

2. 进入vue_shop文件夹

   ```
   启动vue项目
   npm run server
   ```

3. 输入地址， 进入项目

   ```
   http://localhost:8080/ 
   ```

4. 修改运行端口号

   所在目录：node_modules\@vue\cli-service\lib\commands

   需要修改的文件：serve.js

   ![image-20201224140443694](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20201224140443694.png)

   

