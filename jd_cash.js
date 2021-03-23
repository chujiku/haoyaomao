/ *
签到领现金，每日2毛〜5毛
可互助，助力码每日不变，只变日期
活动入口：京东APP搜索领现金进入
已支持IOS双京东账号，Node.js支持N个京东账号
脚本兼容：QuantumultX，Surge，Loon，JSBox，Node.js
============ Quantumultx ===============
[task_local]
＃签到领现金
2 0-23 / 4 * * * https://gitee.com/lxk0301/jd_scripts/raw/master/ jd_cash .js，tag =签到领现金，img-url = https：//raw.githubusercontent.com/Orz -3 / mini / master / Color / jd.png，启用= true
===============月球===============
[脚本]
cron“ 2 0-23 / 4 * * *” script-path = https：//gitee.com/lxk0301/jd_scripts/raw/master/ jd_cash .js，tag =签到领现金
==============浪涌==================
签到领现金= type = cron，cronexp =“ 2 0-23 / 4 * * *”，唤醒系统= 1，超时= 3600，脚本路径= https：//gitee.com/lxk0301/jd_scripts/raw/ master / jd_cash .js
============小火箭=========
签到领现金= type = cron，script-path = https：//gitee.com/lxk0301/jd_scripts/raw/master/ jd_cash .js，cronexpr =“ 2 0-23 / 4 * * *”，超时= 3600， enable = true
 * /
const  $  =  new  Env （'签到领现金' ）；
const  notify  =  $ 。isNode （）吗？要求（'./sendNotify' ）：'' ;
//Node.js用户请在jdCookie.js处填充京东ck;
const  jdCookieNode  =  $ 。isNode （）吗？require （'./jdCookie.js' ）：'' ;
让jdNotify = true ; //是否关闭通知，false打开通知推送，true关闭通知推送   
// IOS等用户直接用NobyDa的jd cookie
让 cookiesArr  =  [ ] ， cookie  =  '' ， 消息;
const  randomCount  =  $ 。isNode （）吗？20：5 ;
const  InvitationCodes  =  [
  `` ，
  ``
]
如果 （$ 。isNode （）） {
  对象。键（jdCookieNode ）。forEach （（项目） =>  {
    cookiesArr 。推送（jdCookieNode [ item ] ）
  } ）
  如果 （过程。ENV 。JD_DEBUG  && 过程。ENV 。JD_DEBUG  ===  '假' ） 的控制台。log  =  （） =>  { } ;
} 其他 {
  cookiesArr  =  [ $ 。getdata （'CookieJD' ）， $ 。getdata （'CookieJD2' ）， ... jsonParse （$ 。getdata （'CookiesJD' ） ||  “ []” ）。映射（项 => 项。饼干）] 。滤波器（项目 => ！ ！项）;
}
const  JD_API_HOST  =  'https: //api.m.jd.com/client.action ' ;
让 allMessage  =  '' ;
！（异步 （） =>  {
  如果 （！cookiesArr [ 0 ] ） {
    $ 。msg （$ 。name ， '【提示】请先获取京东账号一cookie \ n直接使用NobyDa的京东签到获取' ， 'https: //bean.m.jd.com/bean/signIndex.action ' ， { “ open-url“：” https://bean.m.jd.com/bean/signIndex.action“ } ）；
    回报;
  }
  等待 requireConfig （）
  等待 getAuthorShareCode （）;
  对于 （让 我 =  0 ; 我 <  cookiesArr 。长度; 我++ ） {
    如果 （cookiesArr [ i ] ） {
      cookie  =  cookiesArr [ i ] ；
      $ 。用户名 =  decodeURIComponent （饼干。匹配（/ pt_pin = （。+？） ; /） && 饼干。匹配（/ pt_pin = （。+？） ; /）[ 1 ] ）
      $ 。指数 =  i  +  1 ;
      $ 。isLogin  =  true ;
      $ 。nickName  =  '' ;
      消息 =  '' ;
      等待 TotalBean （）;
      控制台。日志（`\ n ******开始【京东账号$ { $ 。索引}】$ { $ 。昵称 ||  $ 。用户名} ********* \ N` ）;
      如果 （！$ 。isLogin ） {
        $ 。味精（$ 。名称， `【提示】饼干已失效` ， `京东账号$ { $ 。指数}  $ { $ 。绰号 ||  $ 。用户名} \ n请重新登录获取\ nhttps：//bean.m。 jd.com / bean / signIndex.action` ， { “ open-url”：“ https://bean.m.jd.com/bean/signIndex.action” } ）；

        如果 （$ 。isNode （）） {
          等待 通知。sendNotify （` $ { $ 。名}饼干已失效- $ { $ 。用户名} ` ， `京东账号$ { $ 。指数}  $ { $ 。用户名} \ n请重新登录获取cookie` ）;
        }
        继续
      }
      等待 jdCash （）
    }
  }
  如果 （allMessage ） {
    如果 （$ 。isNode （） &&  （过程。ENV 。CASH_NOTIFY_CONTROL？过程。ENV 。CASH_NOTIFY_CONTROL  ===  '假'：！！1 ）） 的await 通知。sendNotify （$ 。name ， allMessage ）;
    $ 。msg （$ 。name ， '' ， allMessage ）;
  }
} ）（）
    。抓（（e ） =>  {
      $ 。日志（'' ， `❌ $ { $ 。名字}，失败原因：$ { é } `！ ， '' ）
    } ）
    。最后（（） =>  {
      $ 。完成（）;
    } ）
异步 功能 jdCash （） {
  等待 索引（）
  等待 shareCodesFormat （）
  等待 帮助朋友（）
  等待 getReward （）
  等待 getReward （'2' ）
  等待 索引（true ）
  等待 showMsg （）
}
函数 索引（info = false ） {
  返回 新的 Promise （（resolve ） =>  {
    $ 。get （taskUrl （“ cash_mob_home” ，）， async  （err ， resp ， data ） =>  {
      尝试 {
        如果 （err ） {
          控制台。日志（` $ { JSON 。字符串化（ERR ）} ` ）
          控制台。日志（` $ { $ 。名} API请求失败，请检查网路重试` ）
        } 其他 {
          如果 （safeGet （数据）） {
            数据 =  JSON 。解析（数据）;
            如果（数据。代码=== 0  && 数据。数据。结果）{
              如果（info ）{
                如果 （讯息） {
                  message  + =  `当前现金：$ { data 。数据。结果。signMoney }元` ;
                  allMessage  + =  `京东账号$ { $ 。索引} $ { $ 。昵称} \ n $ {消息} $ { $ 。索引 ！==  cookiesArr 。长度？'\ n \ n'：'' } ` ;
                }
                message  + =  `当前现金：$ { data 。数据。结果。signMoney }元` ;
                返回
              }
              // console.log（`您的助力码为$ {data.data.result.inviteCode}`）
              控制台。日志（`\ n【京东账号$ { $ 。指数}（ $ { $ 。绰号 ||  $ 。用户名}）的$ { $ 。名}好友互助码】$ {数据。数据。结果。inviteCode } \ n ` ）;
              让 helpInfo  =  {
                'inviteCode'：数据。数据。结果。邀请代码，
                'shareDate'：数据。数据。结果。shareDate
              }
              $ 。shareDate  = 数据。数据。结果。shareDate ;
              // $ .log（`shareDate：$ {$。shareDate}`）
              // console.log（helpInfo）
              对于（让 任务 的 数据。数据。结果。taskInfos ）{
                如果 （任务。键入 ===  4 ） {
                  对于 （让 我 = 任务。doTimes ; 我 < 任务。倍;  ++我） {
                    控制台。日志（`去做$ {任务。名}任务$ {我+ 1 } / $ {任务。倍} ` ）
                    的await  doTask （任务，类型， 任务。跳。PARAMS 。skuId ）
                    等待 $ 。等待（5000 ）
                  }
                }
                否则 ，如果 （任务。键入 ===  2 ） {
                  对于 （让 我 = 任务。doTimes ; 我 < 任务。倍;  ++我） {
                    控制台。日志（`去做$ {任务。名}任务$ {我+ 1 } / $ {任务。倍} ` ）
                    的await  doTask （任务，类型， 任务。跳。PARAMS 。shopId ）
                    等待 $ 。等待（5000 ）
                  }
                }
                否则 如果 （任务。键入 ===  16  || 任务。键入=== 3  || 任务。键入=== 5  || 任务。键入=== 17  || 任务。键入=== 21 ） {
                  对于 （让 我 = 任务。doTimes ; 我 < 任务。倍;  ++我） {
                    控制台。日志（`去做$ {任务。名}任务$ {我+ 1 } / $ {任务。倍} ` ）
                    的await  doTask （任务，类型， 任务。跳。PARAMS 。网址）
                    等待 $ 。等待（5000 ）
                  }
                }
              }
            }
          }
        }
      } 抓住 （e ） {
        $ 。logErr （e ， resp ）
      } 最后 {
        解决（数据）;
      }
    } ）
  } ）
}
异步 功能 helpFriends （） {
  $ 。canHelp  =  true
  对于 （让 代码 的 $ 。newShareCodes ） {
    控制台。日志（`去帮助好友$ { code [ 'inviteCode' ] } ` ）
    等待 helpFriend （代码）
    如果（！$ 。canHelp ） 中断
    等待 $ 。等待（1000 ）
  }
  //如果（（helpAuthor && $ .authorCode）{
  // for（让$ .authorCode的helpInfo）{
  // console.log（`去帮助好友$ {helpInfo ['inviteCode']}`）
  //等待helpFriend（helpInfo）
  // if（！$。canHelp）中断
  //等待$ .wait（1000）
  //}
  //}
}
函数 helpFriend （helpInfo ） {
  返回 新的 Promise （（resolve ） =>  {
    $ 。get （taskUrl （“ cash_mob_assist” ， { ... helpInfo ，“ source”：1 } ）， （err ， resp ， data ） =>  {
      尝试 {
        如果 （err ） {
          控制台。日志（` $ { JSON 。字符串化（ERR ）} ` ）
          控制台。日志（` $ { $ 。名} API请求失败，请检查网路重试` ）
        } 其他 {
          如果 （safeGet （数据）） {
            数据 =  JSON 。解析（数据）;
            如果（ 数据。代码 ===  0  && 数据。数据。bizCode  ===  0 ）{
              控制台。日志（`助力成功，获得$ {数据。数据。结果。cashStr } ` ）
              // console.log（data.data.result.taskInfos）
            } 否则 如果 （数据。数据。bizCode === 207 ）{
              控制台。日志（数据。数据。bizMsg ）
              $ 。canHelp  = 假
            } 其他{
              控制台。日志（数据。数据。bizMsg ）
            }
          }
        }
      } 抓住 （e ） {
        $ 。logErr （e ， resp ）
      } 最后 {
        解决（数据）;
      }
    } ）
  } ）
}
函数 doTask （type ，taskInfo ） {
  返回 新的 Promise （（resolve ） =>  {
    $ 。get （taskUrl （“ cash_doTask” ，{ “ type”：type ，“ taskInfo”：taskInfo } ）， （err ， resp ， data ） =>  {
      尝试 {
        如果 （err ） {
          控制台。日志（` $ { JSON 。字符串化（ERR ）} ` ）
          控制台。日志（` $ { $ 。名} API请求失败，请检查网路重试` ）
        } 其他 {
          如果 （safeGet （数据）） {
            数据 =  JSON 。解析（数据）;
            如果（ 数据。代码 ===  0 ）{
              控制台。日志（`任务完成成功` ）
              // console.log（data.data.result.taskInfos）
            }其他{
              控制台。日志（数据）
            }
          }
        }
      } 抓住 （e ） {
        $ 。logErr （e ， resp ）
      } 最后 {
        解决（数据）;
      }
    } ）
  } ）
}
函数 getReward （source  =  1 ） {
  返回 新的 Promise （（resolve ） =>  {
    $ 。得到（taskUrl （“cash_mob_reward” ，{ “源”：数（源），“rewardNode” ：“” } ）， （ERR ， RESP ， 数据） =>  {
      尝试 {
        如果 （err ） {
          控制台。日志（` $ { JSON 。字符串化（ERR ）} ` ）
          控制台。日志（` $ { $ 。名} API请求失败，请检查网路重试` ）
        } 其他 {
          如果 （safeGet （数据）） {
            数据 =  JSON 。解析（数据）;
            如果 （数据。代码 ===  0  && 数据。数据。bizCode  ===  0 ） {
              控制台。日志（`领奖成功，$ {数据。数据。结果。shareRewardTip }【$ {数据。数据。结果。shareRewardAmount }】` ）
              message  + =  `领奖成功，$ { data 。数据。结果。shareRewardTip }【$ {数据。数据。结果。shareRewardAmount }元】\ n` ;
              // console.log（data.data.result.taskInfos）
            } 其他 {
              // console.log（`领奖失败，$ {data.data.bizMsg}`）
            }
          }
        }
      } 抓住 （e ） {
        $ 。logErr （e ， resp ）
      } 最后 {
        解决（数据）;
      }
    } ）
  } ）
}

函数 showMsg （） {
  返回 新的 Promise （resolve  =>  {
    如果 （！jdNotify ） {
      $ 。msg （$ 。name ， '' ， ` $ { message } ` ）;
    } 其他 {
      $ 。日志（`京东账号$ { $ 。索引} $ { $ 。昵称} \ n $ {消息} ` ）;
    }
    解决（）
  } ）
}
函数 readShareCode （） {
  控制台。日志（`开始` ）
  返回 新的 Promise （异步 resolve  =>  {
    $ 。get （{ url：“ https://github.com/ZFeng3242/RandomShareCode/raw/main/JD_Cash.json” ，标头：{
        “ User-Agent”：“ Mozilla / 5.0（iPhone； CPU iPhone OS 13_2_3，如Mac OS X）AppleWebKit / 605.1.15（KHTML，如Gecko）版本/13.0.3 Mobile / 15E148 Safari / 604.1 Edg / 87.0.4280.88”
      } } ， 异步 （err ， resp ， data ） =>  {
      尝试 {
        如果 （err ） {
          控制台。日志（` $ { JSON 。字符串化（ERR ）} ` ）
          控制台。日志（` $ { $ 。名} API请求失败，请检查网路重试` ）
        } 其他 {
          如果 （数据） {
            控制台。log （`随机取助力码放到您固定的互助码后面（不影响现有固定互助）` ）
            数据 =  JSON 。解析（数据）;
          }
        }
      } 抓住 （e ） {
        $ 。logErr （e ， resp ）
      } 最后 {
        解决（数据）;
      }
    } ）
    等待 $ 。等待（10000 ）;
    解决（）
  } ）
}
//格式化助力码
函数 shareCodesFormat （） {
  返回 新的 Promise （异步 resolve  =>  {
    // console.log（`第$ {$。index}个京东账号的助力码:::: $ {$。shareCodesArr [$。index-1]}`）
    $ 。newShareCodes  =  [ ] ;
    如果 （$ 。shareCodesArr [ $ 。索引 -  1 ] ） {
      $ 。newShareCodes  =  $ 。shareCodesArr [ $ 。索引 -  1 ] 。分割（'@' ）;
    } 其他 {
      控制台。日志（`由于您第$ { $ 。指数}个京东账号未提供shareCode，将采纳本脚本自带的助力码\ N` ）
      const  tempIndex  =  $ 。index  > 邀请代码。长度？（inviteCodes 。长度 -  1 ）：（$ 。索引 -  1 ）;
      $ 。newShareCodes  = 邀请代码[ tempIndex ] 。分割（'@' ）;
      让 authorCode  =  deepCopy （$ 。authorCode ）
      $ 。newShareCodes  =  [ ... （authorCode 。映射（（项目， 指数） =>  authorCode [索引]  = 项[ 'inviteCode' ] ））， ... $ 。newShareCodes ] ;
    }
    const  readShareCodeRes  = 等待 readShareCode （）;
    如果 （readShareCodeRes  &&  readShareCodeRes 。代码 ===  200 ） {
      $ 。newShareCodes  =  [ ...新 集（[ ... $ 。newShareCodes ， ... （readShareCodeRes 。数据 ||  [ ] ）] ）] ;
    }
    $ 。newShareCodes 。映射（（项目， 指数） =>  $ 。newShareCodes [索引]  =  {  “inviteCode” ：项， “shareDate” ：$ 。shareDate  } ）
    控制台。日志（`第$ { $ 。指数}个京东账号将要助力的好友$ { JSON 。字符串化（$ 。newShareCodes ）} ` ）
    解决（）;
  } ）
}

函数 requireConfig （） {
  返回 新的 Promise （resolve  =>  {
    控制台。日志（`开始获取$ { $ 。名}配置文件\ N` ）;
    让 shareCodes  =  [ ] ;
    如果 （$ 。isNode （）） {
      如果 （过程。ENV 。JD_CASH_SHARECODES ） {
        如果 （过程。ENV 。JD_CASH_SHARECODES 。的indexOf （'\ n' ） >  - 1 ） {
          shareCodes  = 流程。ENV 。JD_CASH_SHARECODES 。分割（'\ n' ）;
        } 其他 {
          shareCodes  = 流程。ENV 。JD_CASH_SHARECODES 。分割（'＆' ）;
        }
      }
    }
    控制台。日志（`共$ { cookiesArr 。长度}个京东账号\ N` ）;
    $ 。shareCodesArr  =  [ ] ；
    如果 （$ 。isNode （）） {
      对象。密钥（shareCodes ）。forEach （（项目） =>  {
        如果 （shareCodes [项目] ） {
          $ 。shareCodesArr 。推送（shareCodes [ item ] ）
        }
      } ）
    }
    控制台。日志（`您提供了$ { $ 。shareCodesArr 。长度}个账号的$ { $ 。名}助力码\ N` ）;
    解决（）
  } ）
}
函数 deepCopy （obj ） {
  让 objClone  =  Array 。isArray （obj ）吗？[ ]：{ } ;
  如果 （obj  &&  typeof  obj  ===  “ object” ） {
    对于 （让 关键 的 OBJ ） {
      如果 （OBJ 。hasOwnProperty （键）） {
        //判断ojb子元素是否为对象，如果是，递归复制
        if  （obj [ key ]  &&  typeof  obj [ key ]  ===  “ object” ） {
          objClone [键]  =  deepCopy （obj [键] ）;
        } 其他 {
          //如果不是，简单复制
          objClone [键]  =  obj [键] ;
        }
      }
    }
  }
  返回 objClone ;
}
函数 taskUrl （functionId ， body  =  { } ） {
  返回 {
    网址：` $ { JD_API_HOST }？functionId = $ { functionId }＆身体= $ {逃生（JSON 。字符串化（体））}＆的appid = CashRewardMiniH5Env＆的appid = 9.1.0` ，
    标头：{
      “ Cookie”：cookie ，
      '主机'：'api.m.jd.com' ，
      '连接'：'保持活动状态' ，
      'Content-Type'：'application / json' ，
      'Referer'：'http : //wq.jd.com/wxapp/pages/hd-interaction/index/index ' ，
      “用户代理”：$ 。isNode （）吗？（过程。ENV 。JD_USER_AGENT？过程。ENV 。JD_USER_AGENT：（要求（'./USER_AGENTS' ）。 USER_AGENT ））：（$ 。的GetData （'JDUA' ）？ $ 。的GetData （'JDUA' ）： “jdapp; iPhone ; 9.2.2; 14.2;％E4％BA％AC％E4％B8％9C / 9.2.2 CFNetwork / 1206 Darwin / 20.1.0“），
      'Accept-Language'：'zh-cn' ，
      'Accept-Encoding'：'gzip，deflate，br' ，
    }
  }
}

函数 getAuthorShareCode （url  =  “ https://github.com/ZFeng3242/updateTeam/raw/master/shareCodes/jd_updateCash.json” ） {
  return new Promise(resolve => {
    $.get({url, headers:{
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }}, async (err, resp, data) => {
      $.authorCode = [];
      try {
        if (err) {
        } else {
          $.authorCode = JSON.parse(data)
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
