

const $ = new Env('city');
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let cookiesArr = [], cookie = '', message;
//此处为助力码填写区
//docker用法 打开脚本填好自己的id然后保存 上传到自己的脚本文件夹 点开手动执行  输入 city  冲
let inviteId1 = 'RtGKz-6nEw6rfoqcHtZi0ATiPJjizJ0h6jv0MgN0r7aaPJirFw';//正常的拉人邀请ID，自己抓包找，敢问我怎么抓包锤死你
let inviteId2 = 'RtGKz-6nEw6rfoqcHtZi0ATiPJrizJ0h6jv0MgN0r7btKi16_A';//右下角赏金拉人ID，自己抓包找，敢问我怎么抓包锤死你
let encryptedPin = 'RnFsxmIPbzDYwtRP--twX0BSAI8y6esSRQWr';//分享链接里面有encryptedPin，自己抓包找，敢问我怎么抓包锤死你
//此处为助力码填写区
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
  };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      $.beans = 0
      message = '';
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      console.log(`此js脚本仅供学习交流，严禁用于非法用途，请于下载后的24小时之内自行删除，如若产生相关后续法律责任，本人不承担任何后续连带责任`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/`, {"open-url": "https://bean.m.jd.com/"});
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        } else {
          $.setdata('', `CookieJD${i ? i + 1 : ""}`);//cookie失效，故清空cookie。$.setdata('', `CookieJD${i ? i + 1 : "" }`);//cookie失效，故清空cookie。
        }
        continue
      }
      try {
        await jdMh()

      } catch (e) {
        $.logErr(e)
      }
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdMh() {
  try {
    await wuzhi()
  } catch (e) {
    $.logErr(e)
  }
}

var _0xodl='jsjiami.com.v6',_0x24da=[_0xodl,'HCrDjRDCsCTDvVjCtcOQ','wrs/BVzChcK9Tg==','wo5PwojChsKE','H8Odw7rCpMKe','wo8ewpJew60=','PcOdLG1vw6bDkFFXwpLDpy4TWMOsYMKBSsOKw6QPZ8KiecKSw7HCpcKPwqYTfsOaw4nCi8Oaw705w4pZw5DCucOGw4XCgl/CksKQclAPw4HDlsKnVXrDjU7ClHVTJMOPbDvCrcOCwq8LwoBoPXA9w5FGRm3DvcOJCsKkFcO1wqkBwp58w4vCnsOqCw==','w5jCgUh7w5vDocKlMBDDgQ==','LMO5worCqifChVXClnzCtwVGw7VyDhTDuDHClwcJWGgL','wrjCvUhPw58=','LwzDpiHCmwzDlXPCssOgw7VJw6zDrC3DqcOUTsKON8O7wpZHZsOdwqg8BcKqwp/CkhZ2wrdvw6vCjXsJwpAuRMOkZjnDtsOINjBQLFDCusKCR8OoOsOyw7DCnnAHw6nClsOoGcKwLsO+wr/CvAzCvlvCp8Ogw7dEw70nFzw=','w6sLwoPChMOGwrzDscO4AMO6wopSWVwqw6FZJMOjw7jDmgbDo8Oewrp/woLCpiTDssKfwqUew7fCilLCkQIlw7wSdEICW8KsdjPDtsOaOcOyM8Ouw6LCkhNGCAsxcsKADnzDuzHDrFTClBwMU8Ke','wr7Ch1DDhA==','w5jDg8OlSmI=','w4rCjsO5w7TCnA==','wrhFwpXDkMOu','w5MtwoQEbsOB','w5/Dj8Ov','w67CqXPDueisieaxkeWlvei1k++/sOivuuajhOafjee/oOi2gumFoeitrw==','XWFV','w44Nw65V','w7/Dm8KpH8KR','NALCksKgw5Q=','ayUZw7sA','Ix1Ww6DCmA==','HcKGw4HDgBfDrQ==','w6daWsOIwrM=','w7FSw6YgBg==','F8OFw7vCpMKlwqc=','dxMEw7Mz','wq7DiGg/GA==','w7xOWsOwwq4=','csOcaMOHw5XChcKiLy/CnsOFwqk=','wr0qAVTCjcKqTsO7w7HDtMK+YsOkcMOOwqDCuMOvwpp6cWU/w5ZBVsKxw6TCjX7CgcO6GA==','GcKdw5LDtRbCpQNqPxzDmW7CqsObw57DqcKDAX1KF3wpwqok','U1LDrsO3w6zCgFnDmBTCjnQGXm7CisK+wrc=','w7LDpsO3J8OCK8Klw4ohKg==','wo9jw4HDmcOvw58Nw6TDu2LCvAzCscOYwoHDjWnCgsORGcOGwp1LETUlw4hmRcOkwrpSHQ==','wpIHw7AfKXNsc8KDasO4Ywk=','wp3CnsKTwrY=','KyU/XsK1wpDChcKrwqZIw5AWZyIaAXjCgDEVwojCk8KhwqzCnTo0w69Pw5DDu1fCiVbDmcOMdMO/eE8Nw5LDh8KiwoM2w4bDo8OdwrLCiEjDpsOqBMOxNMKHw7/Di3HDsynCmMKia8KUwp0kwp45QcOGDw7Ctz0=','S2YfQzQ=','fi4jw64M','w5vDlMO8TWLCjW7Cq8KMw5rDs3E7woLDrH/CpGYFwpwYUXZoSMOARRzDtQjCu1jConY=','wrhqw6HDnMOx','w4kpw7FYwow=','wqPCs8Kvwr3Cjg==','VgNNw5LDnA==','eBdCw4vDnQ==','ccOGNMKLwoQ=','DcOoa293wpQ=','csKSGw==','wpFXQMKWScKQQcKYFgvDqsO9Ww==','Z8O4LA==','w5QKwqNvwpgqGsOKchXDgEs/','DRLCtMKYw7E=','W0TDrcOXwoI=','w5DCnMOqw4HCi1fDhnDCscOo','wp/DmVINPwnDhg==','wpTCoG/Du8Ks','w7krwohewqobKQ==','wrBwwqLCiMKf','w6jDicOxO8Ke','woJMwprCs8K+ZWVgwrtcw5s+WMOmwpbCkw7Cg3dFw6zCgE4XPAHCqWFow4XDncKxw5QQRMO7w43CqQXDghXCiCcjw5PDqcKiw6QjdF9QwoHDrsKZw5TCi043X8KhAT40w5XDs8O4wo3CjMOawpfDpQfCo8O3BG7DrsK0Cy0mOxTDnMOtIhLCo8ONQw==','F2dcVjPCncOtRBTCiw==','wqPCo8OBw7TDqTDDrVTCi8KBCsKgwqXCmsOfS8OnwonCjcOVb8KSw54X','PcK4SBJ7','GSsZw59wwqXCrWhnwrViw7HDoB0aw47DljPCicOkPVbCtwVSw6twwq/DisOKw6jCkMOmDWHDrcKsSnzDlD9VLcKsw6fDgzbCs3fDvMOgwo98KsK5AsK/wojDjcOGC8OHwqjCtsO/worDrcOewq5HRcKNKywgwrTCvMKDfsOEwotu','IMK6eMKpwpLCr8KMP8OZwqrCkQTDvybCgsKZLADCrsK1B8Oaw47CtT/CncK+T8K/w7UCdSVEwpPDlcO7w6HDrsOIwo/Dk8OxwqHCtxfCoCQ9C8KJw5Fyw54hw4Znw6DDm3YtOMOoVMO4wonCjAzDhMOIEBRywqg=','w7XCoMOcw6c=','ccO3KhHDiA==','w7R+w4YGOQ==','w6kmP3N8','w4t/wrw=','w48RMVw=','w7NdwoDDnOitnOays+Wlq+i2uO+8tOitn+aiieadmOe/oOi1oOmGu+islw==','wplBTcKaXQ==','KwzClXTCow==','LBzChA==','YsKjFjE=','wqrCnWfDosKz','ZVXDgcOswok=','NiI0QMKo','YsKhFSvCig==','JRbDrw==','w53DgcOlWA==','NcKDLwzorJDmsoTlpaXotKfvv7jorIvmorvmn4Pnvr3ot7bphonor5A=','w7/DucKBLMKCBw==','DSTCkWXCqQ==','w4hbwrfDtMKO','XBMew5I1','IhzCoVXCsA==','wqY/wqdPw5g=','YXHDrMOqwpE=','w78+wpUUwqZBIsOxHTHDqmg=','w4AALFVAwqFIw5DDnCVZworCrB5xwpTDqcOSUA3CmcOvwrjCt8OxaDPCtMOVDsOyQwU=','f8KIGcK4LXPDq8KqRivDuhQZWUjDosKSw60Zw4Q0wqQiHcK+','wp/Dhk8Zcl3Dg8Ofw59fNMK9MCAOw410','fsKnGjXDisKnOGvCgsKZ','wpnDjFYFNx7DhsOOw5BcO8OmP39Bw4EqXcOHw4Fkw4UYaF/ChitrdsKAXMKaQQ==','wrBhwqlpwo49F8OUdBfDi1E4','wop2w4zDlg==','w5MIw6ZRwqtbw5jCrcO4H8KiWcKQw51cJwohHMO7w6HCvMKWw5nDpF8EJMOrw4xuw6F1wpjDjcKpU8K3w6QyYMKawrjDqn3DjGLCiMOSw7fCu1rDkGvDgUrDuMO4EcKheBbChifCtRZEwq7CmsOnw4TDu1nCozc8Aw==','BTZaw59q','wqbCr0/DtMKL','WD9qw5DDqg==','w4LClcO6w73CrA==','wq1iwrvCrcK1','e8KTCg==','wrVycsKm','w7fCm8KWwr7orKzms5/lpqTotZXvv6norJrmoazmn53nvqvota/phJLorow=','wpbCnFJ9w4HCr8OvVhXCjDLCqMK2bHbDtcOTZcOew7ZsPWnDg0bDlmtSwrHDpkXDoDvCgA==','Y1d5Whk=','wrVnw5/Dv0s=','Z8OpeMKGw6E=','wo9iw6vCmcOV','DjTCl8K0w6E=','w7EEwocrTA==','KDIQQcKhw44=','TcOAOw==','wpYeLm3Ct8KMfcOQw5nDnMKVA8OI','w4J+wq0=','w4/Ci8Oww4bCh1PDk2rCvsO7acKdwpg=','w64OwqYzeQ==','wq7ClsKfwp3CjA==','jtsjiXyQNamgziD.BKFhuctgoTmY.v6=='];(function(_0x166293,_0x4674eb,_0x204d3f){var _0x471f86=function(_0x1b4705,_0x3918b8,_0xe4f214,_0x23aa49,_0x55b886){_0x3918b8=_0x3918b8>>0x8,_0x55b886='po';var _0x3934e6='shift',_0x28fb2c='push';if(_0x3918b8<_0x1b4705){while(--_0x1b4705){_0x23aa49=_0x166293[_0x3934e6]();if(_0x3918b8===_0x1b4705){_0x3918b8=_0x23aa49;_0xe4f214=_0x166293[_0x55b886+'p']();}else if(_0x3918b8&&_0xe4f214['replace'](/[tXyQNgzDBKFhutgTY=]/g,'')===_0x3918b8){_0x166293[_0x28fb2c](_0x23aa49);}}_0x166293[_0x28fb2c](_0x166293[_0x3934e6]());}return 0x79cb1;};var _0x56e63f=function(){var _0x31a7e4={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x48011c,_0x2f3b4f,_0x13b928,_0x4da76f){_0x4da76f=_0x4da76f||{};var _0x30307a=_0x2f3b4f+'='+_0x13b928;var _0x301a15=0x0;for(var _0x301a15=0x0,_0x2c522d=_0x48011c['length'];_0x301a15<_0x2c522d;_0x301a15++){var _0x1e88d7=_0x48011c[_0x301a15];_0x30307a+=';\x20'+_0x1e88d7;var _0x3a8315=_0x48011c[_0x1e88d7];_0x48011c['push'](_0x3a8315);_0x2c522d=_0x48011c['length'];if(_0x3a8315!==!![]){_0x30307a+='='+_0x3a8315;}}_0x4da76f['cookie']=_0x30307a;},'removeCookie':function(){return'dev';},'getCookie':function(_0x2184ae,_0x416388){_0x2184ae=_0x2184ae||function(_0x1a9fad){return _0x1a9fad;};var _0x54bba7=_0x2184ae(new RegExp('(?:^|;\x20)'+_0x416388['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x3d1ba7=typeof _0xodl=='undefined'?'undefined':_0xodl,_0x125382=_0x3d1ba7['split'](''),_0x390f83=_0x125382['length'],_0x3a9a63=_0x390f83-0xe,_0x366ab8;while(_0x366ab8=_0x125382['pop']()){_0x390f83&&(_0x3a9a63+=_0x366ab8['charCodeAt']());}var _0x4aec20=function(_0x8d861f,_0x3c43ca,_0x2ddf38){_0x8d861f(++_0x3c43ca,_0x2ddf38);};_0x3a9a63^-_0x390f83===-0x524&&(_0x366ab8=_0x3a9a63)&&_0x4aec20(_0x471f86,_0x4674eb,_0x204d3f);return _0x366ab8>>0x2===0x14b&&_0x54bba7?decodeURIComponent(_0x54bba7[0x1]):undefined;}};var _0x290512=function(){var _0x6eeed=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x6eeed['test'](_0x31a7e4['removeCookie']['toString']());};_0x31a7e4['updateCookie']=_0x290512;var _0x43d665='';var _0x48d7ec=_0x31a7e4['updateCookie']();if(!_0x48d7ec){_0x31a7e4['setCookie'](['*'],'counter',0x1);}else if(_0x48d7ec){_0x43d665=_0x31a7e4['getCookie'](null,'counter');}else{_0x31a7e4['removeCookie']();}};_0x56e63f();}(_0x24da,0x115,0x11500));var _0x2cdc=function(_0x4066cd,_0x4a0d87){_0x4066cd=~~'0x'['concat'](_0x4066cd);var _0x2075d0=_0x24da[_0x4066cd];if(_0x2cdc['QbqHhz']===undefined){(function(){var _0x549bf3;try{var _0x3f4f57=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x549bf3=_0x3f4f57();}catch(_0x3b103d){_0x549bf3=window;}var _0x207fda='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x549bf3['atob']||(_0x549bf3['atob']=function(_0x1d47d2){var _0x554907=String(_0x1d47d2)['replace'](/=+$/,'');for(var _0x24898d=0x0,_0xd9faa0,_0x35615a,_0x7fe9e8=0x0,_0x3d3da1='';_0x35615a=_0x554907['charAt'](_0x7fe9e8++);~_0x35615a&&(_0xd9faa0=_0x24898d%0x4?_0xd9faa0*0x40+_0x35615a:_0x35615a,_0x24898d++%0x4)?_0x3d3da1+=String['fromCharCode'](0xff&_0xd9faa0>>(-0x2*_0x24898d&0x6)):0x0){_0x35615a=_0x207fda['indexOf'](_0x35615a);}return _0x3d3da1;});}());var _0x16fe55=function(_0x1a8c42,_0x4a0d87){var _0x189b3c=[],_0x44a265=0x0,_0x2abf84,_0x7a93e='',_0x198cd7='';_0x1a8c42=atob(_0x1a8c42);for(var _0x4d7bf8=0x0,_0x42c513=_0x1a8c42['length'];_0x4d7bf8<_0x42c513;_0x4d7bf8++){_0x198cd7+='%'+('00'+_0x1a8c42['charCodeAt'](_0x4d7bf8)['toString'](0x10))['slice'](-0x2);}_0x1a8c42=decodeURIComponent(_0x198cd7);for(var _0x22d0a2=0x0;_0x22d0a2<0x100;_0x22d0a2++){_0x189b3c[_0x22d0a2]=_0x22d0a2;}for(_0x22d0a2=0x0;_0x22d0a2<0x100;_0x22d0a2++){_0x44a265=(_0x44a265+_0x189b3c[_0x22d0a2]+_0x4a0d87['charCodeAt'](_0x22d0a2%_0x4a0d87['length']))%0x100;_0x2abf84=_0x189b3c[_0x22d0a2];_0x189b3c[_0x22d0a2]=_0x189b3c[_0x44a265];_0x189b3c[_0x44a265]=_0x2abf84;}_0x22d0a2=0x0;_0x44a265=0x0;for(var _0x24892d=0x0;_0x24892d<_0x1a8c42['length'];_0x24892d++){_0x22d0a2=(_0x22d0a2+0x1)%0x100;_0x44a265=(_0x44a265+_0x189b3c[_0x22d0a2])%0x100;_0x2abf84=_0x189b3c[_0x22d0a2];_0x189b3c[_0x22d0a2]=_0x189b3c[_0x44a265];_0x189b3c[_0x44a265]=_0x2abf84;_0x7a93e+=String['fromCharCode'](_0x1a8c42['charCodeAt'](_0x24892d)^_0x189b3c[(_0x189b3c[_0x22d0a2]+_0x189b3c[_0x44a265])%0x100]);}return _0x7a93e;};_0x2cdc['DnpiLr']=_0x16fe55;_0x2cdc['hFyDyK']={};_0x2cdc['QbqHhz']=!![];}var _0x52fad5=_0x2cdc['hFyDyK'][_0x4066cd];if(_0x52fad5===undefined){if(_0x2cdc['AaKngm']===undefined){var _0x443b36=function(_0x20c988){this['IsUjSb']=_0x20c988;this['AaAEms']=[0x1,0x0,0x0];this['ivvtAz']=function(){return'newState';};this['hAeIju']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['LFhfpV']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x443b36['prototype']['qVtKpI']=function(){var _0x5d5beb=new RegExp(this['hAeIju']+this['LFhfpV']);var _0x54d4cc=_0x5d5beb['test'](this['ivvtAz']['toString']())?--this['AaAEms'][0x1]:--this['AaAEms'][0x0];return this['xWGBMl'](_0x54d4cc);};_0x443b36['prototype']['xWGBMl']=function(_0x3f8dbd){if(!Boolean(~_0x3f8dbd)){return _0x3f8dbd;}return this['ecPjfo'](this['IsUjSb']);};_0x443b36['prototype']['ecPjfo']=function(_0x189dc5){for(var _0x4c34d6=0x0,_0x1dc06a=this['AaAEms']['length'];_0x4c34d6<_0x1dc06a;_0x4c34d6++){this['AaAEms']['push'](Math['round'](Math['random']()));_0x1dc06a=this['AaAEms']['length'];}return _0x189dc5(this['AaAEms'][0x0]);};new _0x443b36(_0x2cdc)['qVtKpI']();_0x2cdc['AaKngm']=!![];}_0x2075d0=_0x2cdc['DnpiLr'](_0x2075d0,_0x4a0d87);_0x2cdc['hFyDyK'][_0x4066cd]=_0x2075d0;}else{_0x2075d0=_0x52fad5;}return _0x2075d0;};var _0x2b60b9=function(){var _0x19e28d=!![];return function(_0x443fd5,_0x35155d){var _0x16e22f=_0x19e28d?function(){if(_0x35155d){var _0x4ead9d=_0x35155d['apply'](_0x443fd5,arguments);_0x35155d=null;return _0x4ead9d;}}:function(){};_0x19e28d=![];return _0x16e22f;};}();var _0x12dd48=_0x2b60b9(this,function(){var _0x586682=function(){return'\x64\x65\x76';},_0x51a18a=function(){return'\x77\x69\x6e\x64\x6f\x77';};var _0x355721=function(){var _0x29495d=new RegExp('\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d');return!_0x29495d['\x74\x65\x73\x74'](_0x586682['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x2b3721=function(){var _0x1c0022=new RegExp('\x28\x5c\x5c\x5b\x78\x7c\x75\x5d\x28\x5c\x77\x29\x7b\x32\x2c\x34\x7d\x29\x2b');return _0x1c0022['\x74\x65\x73\x74'](_0x51a18a['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x501cd0=function(_0x3effde){var _0x33c677=~-0x1>>0x1+0xff%0x0;if(_0x3effde['\x69\x6e\x64\x65\x78\x4f\x66']('\x69'===_0x33c677)){_0x6c7ada(_0x3effde);}};var _0x6c7ada=function(_0xb903be){var _0x3ce21=~-0x4>>0x1+0xff%0x0;if(_0xb903be['\x69\x6e\x64\x65\x78\x4f\x66']((!![]+'')[0x3])!==_0x3ce21){_0x501cd0(_0xb903be);}};if(!_0x355721()){if(!_0x2b3721()){_0x501cd0('\x69\x6e\x64\u0435\x78\x4f\x66');}else{_0x501cd0('\x69\x6e\x64\x65\x78\x4f\x66');}}else{_0x501cd0('\x69\x6e\x64\u0435\x78\x4f\x66');}});_0x12dd48();function wuzhi(){var _0x538dc9={'YYgSE':function(_0x4b7172,_0x1936e6){return _0x4b7172===_0x1936e6;},'HVcJU':_0x2cdc('0','KAoA'),'duDRM':function(_0x5f456b){return _0x5f456b();},'VKAGs':function(_0x34a6e2,_0x52247b){return _0x34a6e2!==_0x52247b;},'wcjnm':_0x2cdc('1','pNfh'),'VIvbo':function(_0x3b5274){return _0x3b5274();},'azKYJ':function(_0x4bc8d2){return _0x4bc8d2();},'VyPiw':_0x2cdc('2','44vi'),'pEvyW':_0x2cdc('3','%^fv'),'tiiJU':_0x2cdc('4','%XjK'),'ZqVJe':_0x2cdc('5','vko!'),'teYSd':_0x2cdc('6','DVWn'),'sPnJs':_0x2cdc('7','CAjz'),'MaWtc':function(_0x194df8,_0x3ff066){return _0x194df8(_0x3ff066);},'oljPB':_0x2cdc('8','6zP7'),'ZHLKR':_0x2cdc('9','UO0b'),'qJclq':_0x2cdc('a','JN6o'),'wEguN':_0x2cdc('b','s*zf')};return new Promise(_0x5b16b3=>{var _0xcf5641={'BRRYG':function(_0x3929c2){return _0x538dc9[_0x2cdc('c','dat!')](_0x3929c2);}};let _0x5135a3={'url':_0x2cdc('d','y&a#'),'headers':{'Host':_0x538dc9[_0x2cdc('e','CAjz')],'Content-Type':_0x538dc9[_0x2cdc('f','TgtJ')],'origin':_0x538dc9[_0x2cdc('10','UO0b')],'Accept-Encoding':_0x538dc9[_0x2cdc('11','4*!D')],'Cookie':cookie,'Connection':_0x538dc9[_0x2cdc('12','4*!D')],'Accept':_0x538dc9[_0x2cdc('13','5G8K')],'User-Agent':$[_0x2cdc('14','r]tK')]()?process[_0x2cdc('15','3Gl2')][_0x2cdc('16','$w9]')]?process[_0x2cdc('17','5G8K')][_0x2cdc('18','Lit6')]:_0x538dc9[_0x2cdc('19',')cjR')](require,_0x538dc9[_0x2cdc('1a','vko!')])[_0x2cdc('1b','J@c%')]:$[_0x2cdc('1c','KAoA')](_0x538dc9[_0x2cdc('1d','*^J9')])?$[_0x2cdc('1e','Lit6')](_0x538dc9[_0x2cdc('1f','#1f8')]):_0x538dc9[_0x2cdc('20','DVWn')],'referer':_0x2cdc('21','#1f8')+encryptedPin+_0x2cdc('22','s*zf')+inviteId1+_0x2cdc('23','J@c%'),'Accept-Language':_0x538dc9[_0x2cdc('24','LfPj')]},'body':_0x2cdc('25','wnr]')+inviteId1+_0x2cdc('26','5G8K')};$[_0x2cdc('27','J@c%')](_0x5135a3,async(_0x58cde8,_0x1c47ef,_0x1d3b94)=>{try{if(_0x58cde8){if(_0x538dc9[_0x2cdc('28','c9j(')](_0x538dc9[_0x2cdc('29','6zP7')],_0x538dc9[_0x2cdc('2a','aDc1')])){console[_0x2cdc('2b','FG]Z')]($[_0x2cdc('2c','aDc1')]+_0x2cdc('2d','RkMa'));}else{_0xcf5641[_0x2cdc('2e','$w9]')](_0x5b16b3);}}else{_0x1d3b94=JSON[_0x2cdc('2f','1iL0')](_0x1d3b94);console[_0x2cdc('30',')cjR')](_0x1d3b94);await $[_0x2cdc('31','gl1G')](0x1f4);await _0x538dc9[_0x2cdc('32','*^J9')](wuzhi1);}}catch(_0x6c038e){if(_0x538dc9[_0x2cdc('33','NxsH')](_0x538dc9[_0x2cdc('34','JN6o')],_0x538dc9[_0x2cdc('35','gl1G')])){console[_0x2cdc('36','nr2)')]($[_0x2cdc('37','y&a#')]+_0x2cdc('38','gl1G'));}else{$[_0x2cdc('39','2Aow')](_0x6c038e);}}finally{_0x538dc9[_0x2cdc('3a','1iL0')](_0x5b16b3);}});});}function wuzhi1(){var _0x5e75eb={'kcmws':function(_0x1d6d37,_0x2a15ab){return _0x1d6d37===_0x2a15ab;},'OAVgH':_0x2cdc('3b','FG]Z'),'kYEEE':_0x2cdc('3c','dat!'),'lMOva':function(_0x5b8f2d,_0x2e7f63){return _0x5b8f2d!==_0x2e7f63;},'tqqLF':_0x2cdc('3d','1iL0'),'TMqHS':function(_0x3759da,_0x4fdb22){return _0x3759da!==_0x4fdb22;},'MzClj':_0x2cdc('3e','5%uY'),'hGlDu':function(_0x6219de){return _0x6219de();},'GZUnx':_0x2cdc('3f','NxsH'),'RYKzC':_0x2cdc('40','Lit6'),'uUFhL':_0x2cdc('41','aDc1'),'tEyoY':_0x2cdc('42','3Gl2'),'FEJuv':_0x2cdc('43','KAoA'),'NGtXs':_0x2cdc('44','gl1G'),'NFdjP':_0x2cdc('45','KAoA'),'QLEre':function(_0x479935,_0x28fe67){return _0x479935(_0x28fe67);},'yLYjW':_0x2cdc('46','Lit6'),'dwfEI':_0x2cdc('47','mu&q'),'bPXis':_0x2cdc('48','TgtJ'),'FUnBm':_0x2cdc('49','wnr]')};return new Promise(_0x217e30=>{var _0xb8c41a={'LRrek':function(_0x385632){return _0x5e75eb[_0x2cdc('4a','*^J9')](_0x385632);}};if(_0x5e75eb[_0x2cdc('4b','4*!D')](_0x5e75eb[_0x2cdc('4c','J@c%')],_0x5e75eb[_0x2cdc('4d','#1f8')])){console[_0x2cdc('4e','3Gl2')]($[_0x2cdc('4f','$w9]')]+_0x2cdc('50','UO0b'));}else{let _0x4a74a4={'url':_0x2cdc('51','L2$)'),'headers':{'Host':_0x5e75eb[_0x2cdc('52','s*zf')],'Content-Type':_0x5e75eb[_0x2cdc('53','mu&q')],'origin':_0x5e75eb[_0x2cdc('54','44vi')],'Accept-Encoding':_0x5e75eb[_0x2cdc('55','jqGD')],'Cookie':cookie,'Connection':_0x5e75eb[_0x2cdc('56',')cjR')],'Accept':_0x5e75eb[_0x2cdc('57','6)UA')],'User-Agent':$[_0x2cdc('58','JN6o')]()?process[_0x2cdc('59','c9j(')][_0x2cdc('5a','%^fv')]?process[_0x2cdc('5b','FG]Z')][_0x2cdc('5c','J@c%')]:_0x5e75eb[_0x2cdc('5d','6)UA')](require,_0x5e75eb[_0x2cdc('5e','UO0b')])[_0x2cdc('5f','nr2)')]:$[_0x2cdc('60','%^fv')](_0x5e75eb[_0x2cdc('61','#1f8')])?$[_0x2cdc('1c','KAoA')](_0x5e75eb[_0x2cdc('62','#27)')]):_0x5e75eb[_0x2cdc('63','5%uY')],'referer':_0x2cdc('64','zIkK')+encryptedPin+_0x2cdc('65','L2$)')+inviteId2+_0x2cdc('66','(!Nf'),'Accept-Language':_0x5e75eb[_0x2cdc('67','L2$)')]},'body':_0x2cdc('68','nr2)')+inviteId2+_0x2cdc('69','jqGD')};$[_0x2cdc('6a','*^J9')](_0x4a74a4,async(_0x4e0766,_0x39f875,_0x2b1844)=>{if(_0x5e75eb[_0x2cdc('6b','y&a#')](_0x5e75eb[_0x2cdc('6c','J@c%')],_0x5e75eb[_0x2cdc('6d','RkMa')])){$[_0x2cdc('6e','6)UA')](e);}else{try{if(_0x4e0766){console[_0x2cdc('6f','y&a#')]($[_0x2cdc('4f','$w9]')]+_0x2cdc('70','*^J9'));}else{_0x2b1844=JSON[_0x2cdc('2f','1iL0')](_0x2b1844);console[_0x2cdc('71','s*zf')](_0x2b1844);await $[_0x2cdc('72','TgtJ')](0x1f4);}}catch(_0xe48fd8){if(_0x5e75eb[_0x2cdc('73','2Aow')](_0x5e75eb[_0x2cdc('74',')cjR')],_0x5e75eb[_0x2cdc('75','dat!')])){_0xb8c41a[_0x2cdc('76','76$w')](_0x217e30);}else{$[_0x2cdc('77','%XjK')](_0xe48fd8);}}finally{if(_0x5e75eb[_0x2cdc('4b','4*!D')](_0x5e75eb[_0x2cdc('78','pNfh')],_0x5e75eb[_0x2cdc('79','6zP7')])){$[_0x2cdc('7a','#27)')](e);}else{_0x5e75eb[_0x2cdc('7b','dat!')](_0x217e30);}}}});}});};_0xodl='jsjiami.com.v6';

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
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "JD4iPhone/9.3.5 CFNetwork/1209 Darwin/20.2.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "JD4iPhone/9.3.5 CFNetwork/1209 Darwin/20.2.0")
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
      $.msg($.name, '', '不要在BoxJS手动复制粘贴修改cookie')
      return [];
    }
  }
}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
