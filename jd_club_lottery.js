/*
* @Author: LXK9301
* @Date: 2020-11-03 20:35:07
* @Last Modified by: LXK9301
* @Last Modified time: 2021-4-2 12:27:09
*/
/*
活动入口：京东APP首页-领京豆-摇京豆/京东APP首页-我的-京东会员-摇京豆
增加京东APP首页超级摇一摇(不定时有活动)(此功能部分京东API抓包自：https://github.com/i-chenzhe/qx/blob/main/jd_shake.js)
Modified from https://github.com/Zero-S1/JD_tools/blob/master/JD_vvipclub.py
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============QuantumultX==============
[task_local]
#摇京豆
5 0,23 * * * https://gitee.com/lxk0301/jd_scripts/raw/master/jd_club_lottery.js, tag=摇京豆, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdyjd.png, enabled=true
=================Loon===============
[Script]
cron "5 0,23 * * *" script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_club_lottery.js,tag=摇京豆
=================Surge==============
[Script]
摇京豆 = type=cron,cronexp="5 0,23 * * *",wake-system=1,timeout=3600,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_club_lottery.js
============小火箭=========
摇京豆 = type=cron,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_club_lottery.js, cronexpr="5 0,23 * * *", timeout=3600, enable=true
*/

const $ = new Env('摇京豆');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message = '', allMessage = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
let superShakeBeanConfig = {
  "superShakeUlr": "",//超级摇一摇活动链接
  "superShakeBeanFlag": false,
  "superShakeTitle": "",
  "taskVipName": "",
}
const JD_API_HOST = 'https://api.m.jd.com/client.action';
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  await welcomeHome()
  if (superShakeBeanConfig['superShakeUlr']) await getActInfo(superShakeBeanConfig['superShakeUlr']);
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.freeTimes = 0;
      $.prizeBeanCount = 0;
      $.totalBeanCount = 0;
      $.isLogin = true;
      $.nickName = '';
      message = ''
      await TotalBean();
      console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await clubLottery();
      // await shakeSign();
      await showMsg();
    }
  }
  if (allMessage) {
    if ($.isNode()) await notify.sendNotify($.name, allMessage);
  }
  if (superShakeBeanConfig.superShakeBeanFlag) {
    const scaleUl = { "category": "jump", "des": "m", "url": superShakeBeanConfig['superShakeUlr'] };
    const openjd = `openjd://virtual?params=${encodeURIComponent(JSON.stringify(scaleUl))}`;
    if ($.isNode()) await notify.sendNotify($.name, `【${superShakeBeanConfig['superShakeTitle']}】活动再次开启\n【${superShakeBeanConfig['taskVipName'] || '开通会员'}】如需做此任务,请点击链接直达活动页面\n${superShakeBeanConfig['superShakeUlr']}`, { url: openjd });
    $.msg($.name, superShakeBeanConfig['superShakeTitle'], `【超级摇一摇】活动再次开启\n【${superShakeBeanConfig['taskVipName'] || '开通会员'}】如需做此任务,请点击弹窗直达活动页面`, { 'open-url': openjd })
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })

async function clubLottery() {
  try {
    await doTasks();//做任务
    await getFreeTimes();//获取摇奖次数
    await vvipclub_receive_lottery_times();//京东会员：领取一次免费的机会
    await vvipclub_shaking_info();//京东会员：查询多少次摇奖次数
    await shaking();//开始摇奖
    await superShakeBean();//京东APP首页超级摇一摇
  } catch (e) {
    $.logErr(e)
  }
}
async function doTasks() {
  const browseTaskRes = await getTask('browseTask');
  if (browseTaskRes.success) {
    const { totalPrizeTimes, currentFinishTimes, taskItems } = browseTaskRes.data[0];
    const taskTime = totalPrizeTimes - currentFinishTimes;
    if (taskTime > 0) {
      let taskID = [];
      taskItems.map(item => {
        if (!item.finish) {
          taskID.push(item.id);
        }
      });
      console.log(`开始做浏览页面任务`)
      for (let i = 0; i < new Array(taskTime).fill('').length; i++) {
        await $.wait(1000);
        await doTask('browseTask', taskID[i]);
      }
    }
  } else {
    console.log(`${JSON.stringify(browseTaskRes)}`)
  }
  const attentionTaskRes = await getTask('attentionTask');
  if (attentionTaskRes.success) {
    const { totalPrizeTimes, currentFinishTimes, taskItems } = attentionTaskRes.data[0];
    const taskTime = totalPrizeTimes - currentFinishTimes;
    if (taskTime > 0) {
      let taskID = [];
      taskItems.map(item => {
        if (!item.finish) {
          taskID.push(item.id);
        }
      });
      console.log(`开始做关注店铺任务`)
      for (let i = 0; i < new Array(taskTime).fill('').length; i++) {
        await $.wait(1000);
        await doTask('attentionTask', taskID[i].toString());
      }
    }
  }
}
async function shaking() {
  for (let i = 0; i < new Array($.leftShakingTimes).fill('').length; i++) {
    console.log(`开始 【京东会员】 摇奖`)
    await $.wait(1000);
    const newShakeBeanRes = await vvipclub_shaking_lottery();
    if (newShakeBeanRes.success) {
      console.log(`京东会员-剩余摇奖次数：${newShakeBeanRes.data.remainLotteryTimes}`)
      if (newShakeBeanRes.data && newShakeBeanRes.data.rewardBeanAmount) {
        $.prizeBeanCount += newShakeBeanRes.data.rewardBeanAmount;
        console.log(`恭喜你，京东会员中奖了，获得${newShakeBeanRes.data.rewardBeanAmount}京豆\n`)
      } else {
        console.log(`未中奖\n`)
      }
    }
  }
  for (let i = 0; i < new Array($.freeTimes).fill('').length; i++) {
    console.log(`开始 【摇京豆】 摇奖`)
    await $.wait(1000);
    const shakeBeanRes = await shakeBean();
    if (shakeBeanRes.success) {
      console.log(`剩余摇奖次数：${shakeBeanRes.data.luckyBox.freeTimes}`)
      if (shakeBeanRes.data && shakeBeanRes.data.prizeBean) {
        console.log(`恭喜你，中奖了，获得${shakeBeanRes.data.prizeBean.count}京豆\n`)
        $.prizeBeanCount += shakeBeanRes.data.prizeBean.count;
        $.totalBeanCount = shakeBeanRes.data.luckyBox.totalBeanCount;
      } else if (shakeBeanRes.data && shakeBeanRes.data.prizeCoupon) {
        console.log(`获得优惠券：${shakeBeanRes.data.prizeCoupon['limitStr']}\n`)
      } else {
        console.log(`摇奖其他未知结果：${JSON.stringify(shakeBeanRes)}\n`)
      }
    }
  }
  if ($.prizeBeanCount > 0) message += `摇京豆：获得${$.prizeBeanCount}京豆`;
}
function showMsg() {
  return new Promise(resolve => {
    if (message) {
      $.msg(`${$.name}`, `京东账号${$.index} ${$.nickName}`, message);
    }
    resolve();
  })
}
//====================API接口=================
//查询剩余摇奖次数API
function vvipclub_shaking_info() {
  return new Promise(resolve => {
    const options = {
      url: `https://api.m.jd.com/?t=${Date.now()}&appid=sharkBean&functionId=vvipclub_shaking_info`,
      headers: {
        "accept": "application/json",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9",
        "cookie": cookie,
        "origin": "https://skuivip.jd.com",
        "referer": "https://skuivip.jd.com/",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          // console.log(data)
          data = JSON.parse(data);
          if (data.success) {
            $.leftShakingTimes = data.data.leftShakingTimes;//剩余抽奖次数
            console.log(`京东会员——摇奖次数${$.leftShakingTimes}`);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
//京东会员摇奖API
function vvipclub_shaking_lottery() {
  return new Promise(resolve => {
    const options = {
      url: `https://api.m.jd.com/?t=${Date.now()}&appid=sharkBean&functionId=vvipclub_shaking_lottery&body=%7B%7D`,
      headers: {
        "accept": "application/json",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9",
        "cookie": cookie,
        "origin": "https://skuivip.jd.com",
        "referer": "https://skuivip.jd.com/",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          // console.log(data)
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
//领取京东会员本摇一摇一次免费的次数
function vvipclub_receive_lottery_times() {
  return new Promise(resolve => {
    const options = {
      url: `https://api.m.jd.com/?t=${Date.now()}&appid=sharkBean&functionId=vvipclub_receive_lottery_times`,
      headers: {
        "accept": "application/json",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9",
        "cookie": cookie,
        "origin": "https://skuivip.jd.com",
        "referer": "https://skuivip.jd.com/",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          // console.log(data)
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
//查询多少次机会
function getFreeTimes() {
  return new Promise(resolve => {
    $.get(taskUrl('vvipclub_luckyBox', { "info": "freeTimes" }), (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          // console.log(data)
          data = JSON.parse(data);
          if (data.success) {
            $.freeTimes = data.data.freeTimes;
            console.log(`摇京豆——摇奖次数${$.freeTimes}`);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function getTask(info) {
  return new Promise(resolve => {
    $.get(taskUrl('vvipclub_lotteryTask', { info, "withItem": true }), (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          // console.log(data)
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function doTask(taskName, taskItemId) {
  return new Promise(resolve => {
    $.get(taskUrl('vvipclub_doTask', { taskName, taskItemId }), (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          // console.log(data)
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function shakeBean() {
  return new Promise(resolve => {
    $.get(taskUrl('vvipclub_shaking', { "type": '0' }), (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          // console.log(`摇奖结果:${data}`)
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
//超级摇一摇(此处功能部分京东API抓包自：https://github.com/i-chenzhe/qx/blob/main/jd_shake.js)
async function superShakeBean() {
  if ($.ActInfo) {
    await fc_getHomeData($.ActInfo);//获取任务列表
    await doShakeTask($.ActInfo);//做任务
    await fc_getHomeData($.ActInfo, true);//做完任务后查询多少次摇奖次数
    await superShakeLottery($.ActInfo);//开始摇奖
  } else {
    console.log(`\n\n京东APP首页超级摇一摇：目前暂无活动\n\n`)
  }
}
function welcomeHome() {
  return new Promise(resolve => {
    const data = {
      "homeAreaCode": "",
      "identity": "",
      "fQueryStamp": "",
      "globalUIStyle": "",
      "showCate": "",
      "tSTimes": "",
      "geoLast": "",
      "geo": "",
      "cycFirstTimeStamp": "",
      "displayVersion": "",
      "geoReal": "",
      "controlMaterials": "",
      "xviewGuideFloor": "",
      "fringe": "",
      "receiverGeo": ""
    }
    const options = {
      url: `https://api.m.jd.com/client.action?functionId=welcomeHome&body=${escape(JSON.stringify(data))}&uuid=8888888&client=apple&clientVersion=9.4.1&st=1617337078035&sign=c14a3ca716d6dd4de373cafdea4f81c3&sv=122`,
      body: `body=${escape(JSON.stringify(data))}`,
      headers: {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-Hans-CN;q=1, zh-Hant-CN;q=0.9",
        "Connection": "keep-alive",
        "Content-Length": "1761",
        "Content-Type": "application/x-www-form-urlencoded",
        "Host": "api.m.jd.com",
        "User-Agent": "JD4iPhone/167588 (iPhone; iOS 14.3; Scale/2.00)"
      }
    }
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} welcomeHome API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['floorList'] && data['floorList'].length) {
              const jump = data['floorList'].filter(vo => !!vo && vo.type === 'shakeFloorNew')[0]['jump'];
              if (jump && jump.params && jump['params']['url']) {
                superShakeBeanConfig['superShakeUlr'] = jump.params.url;
                console.log(`【超级摇一摇】活动链接：${superShakeBeanConfig['superShakeUlr']}`);
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function getActInfo(url) {
  return new Promise(resolve => {
    $.get({
      url,
      headers:{
        // 'Cookie': cookie,
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      },
      timeout: 10000
    },async (err,resp,data)=>{
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = data && data.match(/window\.__FACTORY__TAOYIYAO__STATIC_DATA__ = (.*)}/)
          if (data) {
            data = JSON.parse(data[1] + '}');
            if (data['pageConfig']) superShakeBeanConfig['superShakeTitle'] = data['pageConfig']['htmlTitle'];
            if (data['taskConfig']) {
              $.ActInfo = data['taskConfig']['taskAppId'];
              console.log(`\n获取【${superShakeBeanConfig['superShakeTitle']}】活动ID成功：${$.ActInfo}\n`);
            }
          }
        }
      } catch (e) {
        console.log(e)
      }
      finally {
        resolve()
      }
    })
  })
}
function fc_getHomeData(appId, flag = false) {
  return new Promise(resolve => {
    const body = { appId }
    const options = taskPostUrl('fc_getHomeData', body)
    $.taskVos = [];
    $.lotteryNum = 0;
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} fc_getHomeData API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data && data['data']['bizCode'] === 0) {
              const taskVos = data['data']['result']['taskVos'] || [];
              if (flag && $.index === 1) {
                superShakeBeanConfig['superShakeBeanFlag'] = true;
                superShakeBeanConfig['taskVipName'] = taskVos.filter(vo => !!vo && vo['taskType'] === 21)[0]['taskName'];
              }
              $.taskVos = taskVos.filter(item => !!item && item['status'] === 1) || [];
              $.lotteryNum = parseInt(data['data']['result']['lotteryNum']);
              $.lotTaskId = parseInt(data['data']['result']['lotTaskId']);
            } else if (data && data['data']['bizCode'] === 101) {
              console.log(`京东APP首页超级摇一摇： ${data['data']['bizMsg']}`);
            } else {
              console.log(`获取超级摇一摇任务数据异常： ${JSON.stringify(data)}`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
async function doShakeTask(appId) {
  for (let vo of $.taskVos) {
    if (vo['taskType'] === 21) {
      console.log(`${vo['taskName']} 跳过`);
      continue
    }
    if (vo['taskType'] === 9) {
      console.log(`开始做 ${vo['taskName']}，等10秒`);
      const shoppingActivityVos = vo['shoppingActivityVos'];
      for (let task of shoppingActivityVos) {
        await fc_collectScore({
          appId,
          "taskToken": task['taskToken'],
          "taskId": vo['taskId'],
          "itemId": task['itemId'],
          "actionType": 1
        })
        await $.wait(10000)
        await fc_collectScore({
          appId,
          "taskToken": task['taskToken'],
          "taskId": vo['taskId'],
          "itemId": task['itemId'],
          "actionType": 0
        })
      }
    }
    if (vo['taskType'] === 1) {
      console.log(`开始做 ${vo['taskName']}， 等8秒`);
      const followShopVo = vo['followShopVo'];
      for (let task of followShopVo) {
        await fc_collectScore({
          appId,
          "taskToken": task['taskToken'],
          "taskId": vo['taskId'],
          "itemId": task['itemId'],
          "actionType": 1
        })
        await $.wait(9000)
        await fc_collectScore({
          appId,
          "taskToken": task['taskToken'],
          "taskId": vo['taskId'],
          "itemId": task['itemId'],
          "actionType": 0
        })
      }
    }
  }
}
function fc_collectScore(body) {
  return new Promise(resolve => {
    const options = taskPostUrl('fc_collectScore', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} fc_collectScore API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            console.log(`${JSON.stringify(data)}`)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
async function superShakeLottery(appId) {
  $.superShakeBeanNum = 0;
  if ($.lotteryNum) console.log(`\n\n开始京东APP首页超级摇一摇 摇奖`);
  for (let i = 0; i < new Array($.lotteryNum).fill('').length; i++) {
    await fc_getLottery(appId);//抽奖
    await $.wait(1000)
  }
  if ($.superShakeBeanNum > 0) {
    message += `${message ? '\n' : ''}${superShakeBeanConfig['superShakeTitle']}：获得${$.superShakeBeanNum}京豆`
    allMessage += `京东账号${$.index}${$.nickName || $.UserName}\n${superShakeBeanConfig['superShakeTitle']}：获得${$.superShakeBeanNum}京豆${$.index !== cookiesArr.length ? '\n\n' : ''}`;
  }
}
function fc_getLottery(appId) {
  return new Promise(resolve => {
    const body = {appId, "taskId": $.lotTaskId}
    const options = taskPostUrl('fc_getLotteryResult', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} fc_collectScore API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data && data['data']['bizCode'] === 0) {
              $.myAwardVo = data['data']['result']['myAwardVo'];
              if ($.myAwardVo) {
                console.log(`超级摇一摇 抽奖结果:${JSON.stringify($.myAwardVo)}`)
                if ($.myAwardVo['type'] === 2) {
                  $.superShakeBeanNum = $.superShakeBeanNum + parseInt($.myAwardVo['jBeanAwardVo']['quantity']);
                }
              }
            } else {
              console.log(`超级摇一摇 抽奖异常： ${JSON.stringify(data)}`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
//京东会员签到
async function shakeSign() {
  let body = {"floorToken": "df6e1996-0f6f-4c29-92b9-22416fc1f68a", "dataSourceCode": "popUpInfo", "argMap": {}};
  const res = await pg_interact_interface_invoke(body);
  if (res.success && res.data) {
    body = {"floorToken":"f1d574ec-b1e9-43ba-aa84-b7a757f27f0e","dataSourceCode":"signIn","argMap":{"currSignCursor": res['data']['dayBeanAmount']}}
    const signRes = await pg_interact_interface_invoke(body);
    console.log(`京东会员第${res['data']['dayBeanAmount']}天签到结果；${JSON.stringify(signRes)}`)
    if (signRes.success && signRes['data']) {
      console.log(`京东会员第${res['data']['dayBeanAmount']}天签到成功。获得${signRes['data']['rewardVos'] && signRes['data']['rewardVos'][0]['jingBeanVo'] && signRes['data']['rewardVos'][0]['jingBeanVo']['beanNum']}京豆\n`)
    }
    // if (res['data']['popUpRemainTimes'] > 0) {
    //   //可签到
    //   body = {"floorToken":"f1d574ec-b1e9-43ba-aa84-b7a757f27f0e","dataSourceCode":"signIn","argMap":{"currSignCursor": res['data']['dayBeanAmount']}}
    //   const signRes = await pg_interact_interface_invoke(body);
    //   console.log(`京东会员第${res['data']['dayBeanAmount']}天签到结果；${JSON.stringify(signRes)}`)
    //   if (signRes.success && signRes['data']) {
    //     console.log(`京东会员第${res['data']['dayBeanAmount']}天签到成功。获得${signRes['data']['rewardVos'] && signRes['data']['rewardVos'][0]['jingBeanVo'] && signRes['data']['rewardVos'][0]['jingBeanVo']['beanNum']}京豆\n`)
    //   }
    // } else {
    //   console.log(`京东会员第${res['data']['dayBeanAmount'] - 1}天已经签到了`)
    // }
  }
}
function pg_interact_interface_invoke(body) {
  return new Promise(resolve => {
    const options = {
      url: `https://api.m.jd.com/?appid=sharkBean&functionId=pg_interact_interface_invoke&body=${escape(JSON.stringify(body))}`,
      headers: {
        'Cookie': cookie,
        'Host': 'api.m.jd.com',
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'Referer': 'https://spa.jd.com',
        'origin': 'https://spa.jd.com'
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data || {});
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
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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
function taskUrl(function_id, body = {}, appId = 'vip_h5') {
  return {
    url: `${JD_API_HOST}?functionId=${function_id}&appid=${appId}&body=${escape(JSON.stringify(body))}&_=${Date.now()}`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Referer': 'https://vip.m.jd.com/newPage/reward/123dd/slideContent?page=focus',
    }
  }
}
function taskPostUrl(function_id, body) {
  return {
    url: `https://api.m.jd.com/client.action?functionId=${function_id}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/4SXuJSqKganGpDSEMEkJWyBrBHcM/index.html',
    }
  }
}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,o)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=e&&e.timeout?e.timeout:o;const[r,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":r,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),o=JSON.stringify(this.data);s?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(e,o):this.fs.writeFileSync(t,o)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return s;return o}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),o=s?this.getval(s):"";if(o)try{const t=JSON.parse(o);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(e),r=this.getval(i),h=i?"null"===r?null:r||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,o,t),s=this.setval(JSON.stringify(e),i)}catch(e){const r={};this.lodash_set(r,o,t),s=this.setval(JSON.stringify(r),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t)))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t))}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",o){const r=t=>{if(!t||!this.isLoon()&&this.isSurge())return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,r(o)):this.isQuanX()&&$notify(e,s,i,r(o)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
