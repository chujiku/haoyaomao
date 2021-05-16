## Github Action 部署

### 由@[ZFeng3242](https://github.com/ZFeng3242/)整理      参考至@[lxk0301](https://gitee.com/lxk0301/)
### !注意：环境变量最大不能超过4kb，故不能添加过多的ck，如需放置相当数量的ck，请自行更改`JD-Cookie`与`TENCENT_FUNCTION_NAME`后创建新的云函数放置  


## 环境变量说明


| NAME | 归属                         | 属性                       | 说明                                                                            |
| ---- | :------------------------------: | :-------------------------: | :-------------------------------------------------------------------------------: |
| TENCENT_SECRET_ID      | 腾讯云函数     | 必须                      |腾讯云函数API密钥 [SecretId](https://console.cloud.tencent.com/cam/capi)  |
| TENCENT_SECRET_KEY     | 腾讯云函数     | 必须                      |腾讯云函数API密钥 [SecretKey](https://console.cloud.tencent.com/cam/capi)  |
| SCF_REGION             | 腾讯云函数     | 必须                      |腾讯云函数目前所支持的地域信息，[参考取值](https://cloud.tencent.com/document/product/583/17299)  |
| TENCENT_FUNCTION_NAME  | 腾讯云函数     | 必须                      |腾讯云函数名称，例：`JDscripts`|
| TENCENTSCF_SOURCE_TYPE | 腾讯云函数     | 非必须                      |腾讯云函数执行文件类型,默认使用gitee，详细请前往 index.js文件中[查看](https://github.com/ZFeng3242/JD-haoyangmao/blob/main/index.js)|
| TENCENTSCF_SOURCE_URL  | 腾讯云函数     | 非必须                      |当选择自定义模式，定义执行自定义远端js文件网址|


#### 请将以上环境变量填写完全，环境变量的获取方法详见[下方](https://github.com/ZFeng3242/JD-haoyangmao/blob/main/TencentScf/tencentscf.md#2-%E5%9C%A8%E8%BF%99%E9%87%8C%E6%96%B0%E5%BB%BA%E4%B8%80%E4%B8%AA%E8%AE%BF%E9%97%AE%E5%AF%86%E9%92%A5%E6%96%B0%E5%BB%BA%E5%AF%86%E9%92%A5)  



### 1. 开通服务

依次登录 [SCF 云函数控制台](https://console.cloud.tencent.com/scf) 和 [SLS 控制台](https://console.cloud.tencent.com/sls) 开通相关服务，确保账户下已开通服务并创建相应[服务角色](https://console.cloud.tencent.com/cam/role) **SCF_QcsRole、SLS_QcsRole**

> 注意！为了确保权限足够，获取这两个参数时不要使用子账户！此外，腾讯云账户需要[实名认证](https://console.cloud.tencent.com/developer/auth)。  



### 2. 在这里新建一个访问密钥[新建密钥](https://console.cloud.tencent.com/cam/capi)

> 将SecretId和SecretKey分别配置在仓库的secrets变量里面

> `TENCENT_SECRET_ID`对应你的SecretId的值，`TENCENT_SECRET_KEY`对应你的SecretKey的值

> `TENCENT_FUNCTION_NAME`对应你的函数名称，请自行决定
 
> `SCF_REGION`参照下方表格或腾讯云函数官方环境变量说明的[参考取值](https://cloud.tencent.com/document/product/583/17299)，对应地区自行选择（推荐中国香港）  

| 地域 | 取值                         | 
| ---- | :------------------------------: | 
| 华南地区（广州）	| `ap-guangzhou` | 
| 华东地区（上海）	| `ap-shanghai` | 
| 华北地区（北京）	| `ap-beijing` | 
| 西南地区（成都）	| `ap-chengdu` | 
| 港澳台地区（中国香港）	| `ap-hongkong` | 
| 亚太南部（孟买）	| `ap-mumbai` | 
| 亚太东南（新加坡）	| `ap-singapore` | 
| 亚太东北（东京）	| `ap-tokyo` | 
| 北美地区（多伦多）	| `na-toronto` | 
| 美国西部（硅谷）	| `na-siliconvalley` |    

> `TENCENTSCF_SOURCE_TYPE`对应腾讯云函数执行远端js文件的模式，`local`代表执行本地（即云函数内）文件；`git`代表执行远端github中的文件，因github的raw类型的文件被墙,此方法云函数不推荐；`custom`代表执行自定义链接的js文件，需要配合`TENCENTSCF_SOURCE_URL`变量使用，不填写默认执行给gitee远端js文件。  


### 3. 配置自己需要secrets变量到github中[参考这里](githubAction.md)

#### 如果涉及一个变量配置多个值，如多个cookie，多个取消订阅关键字，去掉里面的 *__[空格]()__* 和 __*[换行]()*__ 使用 `&` 连接  


### 4.执行action workflow进行部署，workflow未报错即部署成功
![image](https://user-images.githubusercontent.com/6993269/99513289-6a152980-29c5-11eb-9266-3f56ba13d3b2.png)  


### 5. 查看和测试
登录后，在 [腾讯云函数地址](https://console.cloud.tencent.com/scf/index) 点击管理控制台，查看最新部署的函数。

在左侧栏的日志查询中，可以查看到触发的日志，包括是否打卡成功等。

![测试函数](https://user-images.githubusercontent.com/6993269/99628053-5a9eea80-2a70-11eb-906f-f1d5ea2bfa3a.png)  

> 排查问题第一步先看自己[腾讯云函数](https://console.cloud.tencent.com/scf/list-detail?rid=5&ns=default&id=scf-jdscript)那边的环境变量跟自己在仓库配置的 `secrets` 是否一致
![image](https://user-images.githubusercontent.com/6993269/99937191-06617680-2da0-11eb-99ea-033f2c655683.png)
