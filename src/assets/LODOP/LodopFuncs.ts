/// <refrence path="./CLodop.d.ts" />;

var CreatedOKLodop7766:any = null;

//====判断是否需要安装CLodop云打印服务器:====
function needCLodop () {
  try {
    var ua = navigator.userAgent;
    if (ua.match(/Windows\sPhone/i) != null) return true;
    if (ua.match(/iPhone|iPod/i) != null) return true;
    if (ua.match(/Android/i) != null) return true;
    if (ua.match(/Edge\D?\d+/i) != null) return true;

    var verTrident = ua.match(/Trident\D?\d+/i);
    var verIE:any = ua.match(/MSIE\D?\d+/i);
    var verOPR:any = ua.match(/OPR\D?\d+/i);
    var verFF:any = ua.match(/Firefox\D?\d+/i);
    var x64:any = ua.match(/x64/i);
    if ((verTrident == null) && (verIE == null) && (x64 !== null))
      return true;
    else
      if (verFF !== null) {
        verFF = verFF[0].match(/\d+/);
        if ((verFF[0] >= 41) || (x64 !== null)) return true;
      } else
        if (verOPR !== null) {
          verOPR = verOPR[0].match(/\d+/);
          if (verOPR[0] >= 32) return true;
        } else
          if ((verTrident == null) && (verIE == null)) {
            var verChrome:any = ua.match(/Chrome\D?\d+/i);
            if (verChrome !== null) {
              verChrome = verChrome[0].match(/\d+/);
              if (verChrome[0] >= 41) return true;
            };
          };
    return false;
  } catch (err) { return true; };
};

//====页面引用CLodop云打印必须的JS文件：====
if (needCLodop()) {
  // console.log(CLODOP);
  var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
  if (window.location.protocol.indexOf('https') != -1) {
    var oscript = document.createElement("script");
    oscript.src = "https://localhost:8443/CLodopfuncs.js?priority=1";
    head.insertBefore(oscript, head.firstChild);
  } else {
    // 引用双端口 避免其中某个被占用：
    var oscript = document.createElement("script");
    oscript.src = "http://localhost:8000/CLodopfuncs.js?priority=0";
    head.insertBefore(oscript, head.firstChild);
  }
};

//====获取LODOP对象的主过程：====
const getLodop = function (oOBJECT?:any, oEMBED?:any) {
  var strHtmInstall = "<font >打印控件未安装!点击这里<a href='install_lodop32.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
  var strHtmUpdate = "<font >打印控件需要升级!点击这里<a href='install_lodop32.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
  var strHtm64_Install = "<font >打印控件未安装!点击这里<a href='install_lodop64.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
  var strHtm64_Update = "<font >打印控件需要升级!点击这里<a href='install_lodop64.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
  var strHtmFireFox = "<font>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>";
  var strHtmChrome = "<font >(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>";
  var strCLodopInstall = "<font >CLodop云打印服务(localhost本地)未安装启动!点击这里<a href='http://www.c-lodop.com/download/CLodop_Setup_for_Win32NT_https_3.028Extend.zip' target='_self'>下载控件</a>,安装后请刷新页面。</font>";
  var strCLodopUpdate = "<font >CLodop云打印服务需升级!点击这里<a href='http://www.c-lodop.com/download/CLodop_Setup_for_Win32NT_https_3.028Extend.zip' target='_self'>执行升级</a>,升级后请刷新页面。</font>";
  var LODOP;
  try {
    var isIE = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0);
    if (needCLodop()) {
      try { LODOP = getCLodop(); } catch (err) { };
      if (!LODOP && document.readyState !== "complete") { alert("C-Lodop没准备好，请稍后再试！"); return; };
      if (!LODOP) {
        if (isIE) document.write(strCLodopInstall);
        else
          // renderError(strCLodopInstall)
          oOBJECT.$Notice.error({ desc: strCLodopInstall, duration: 0 })
        return;
      } else {
        if (CLODOP.CVERSION < "3.0.2.8") {
          if (isIE) document.write(strCLodopUpdate);
          else
            // renderError(strCLodopUpdate)
            oOBJECT.$Notice.error({ desc: strCLodopUpdate, duration: 0 })
        };
        if (oEMBED && oEMBED.parentNode) oEMBED.parentNode.removeChild(oEMBED);
        if (oOBJECT && oOBJECT.parentNode) oOBJECT.parentNode.removeChild(oOBJECT);
      };
    } else {
      var is64IE:boolean = isIE && (navigator.userAgent.indexOf('x64') >= 0);
      //=====如果页面有Lodop就直接使用，没有则新建:==========
      if (oOBJECT != undefined || oEMBED != undefined) {
        if (isIE) LODOP = oOBJECT;
        else LODOP = oEMBED;
      } else if (CreatedOKLodop7766 == null) {
        LODOP = document.createElement("object");
        LODOP.setAttribute("width", '0');
        LODOP.setAttribute("height", '0');
        LODOP.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
        if (isIE) LODOP.setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
        else LODOP.setAttribute("type", "application/x-print-lodop");
        document.documentElement.appendChild(LODOP);
        CreatedOKLodop7766 = LODOP;
      } else LODOP = CreatedOKLodop7766;
      //=====Lodop插件未安装时提示下载地址:==========
      if ((LODOP == null) || (typeof (LODOP.VERSION) == "undefined")) {
        if (navigator.userAgent.indexOf('Chrome') >= 0)
          // document.body.innerHTML = strHtmChrome + document.body.innerHTML;
          // renderError(strHtmChrome)
          oOBJECT.$Notice.error({ desc: strHtmChrome, duration: 0 })
        if (navigator.userAgent.indexOf('Firefox') >= 0)
          // document.body.innerHTML = strHtmFireFox + document.body.innerHTML;
          // renderError(strHtmFireFox)
          oOBJECT.$Notice.error({ desc: strHtmFireFox, duration: 0 })
        if (is64IE) document.write(strHtm64_Install);
        else
          if (isIE) document.write(strHtmInstall);
          else
            // document.body.innerHTML = strHtmInstall + document.body.innerHTML;
            // renderError(strHtmInstall)
            oOBJECT.$Notice.error({ desc: strHtmInstall, duration: 0 })
        return LODOP;
      };
    };
    if (LODOP.VERSION < "6.2.2.0") {
      var is64IE:boolean = isIE && (navigator.userAgent.indexOf('x64') >= 0);
      if (!needCLodop()) {
        if (is64IE) document.write(strHtm64_Update);
        else
          if (isIE) document.write(strHtmUpdate);
          else
            // document.body.innerHTML = strHtmUpdate + document.body.innerHTML;
            // renderError(strHtmUpdate)
            oOBJECT.$Notice.error({ desc: strHtmUpdate, duration: 0 })
      };
      return LODOP;
    };
    //===如下空白位置适合调用统一功能(如注册语句、语言选择等):===
    LODOP.SET_LICENSES("广州弗睿贸易有限公司", "8BBB1DC79DE07DB6E9709F871AB2846B", "", "");

    //===========================================================
    return LODOP;
  } catch (err) { alert("getLodop出错:" + err); };
};

export default getLodop

// function renderError(errorMsg) {
//   var errorContainer = document.createElement('div');
//   errorContainer.style.width = '100%';
//   errorContainer.style.height = '30px';
//   errorContainer.style.position = 'fixed';
//   errorContainer.style.top = '0px';
//   errorContainer.style.left = '0px';
//   errorContainer.style.fontSize = '12px';
//   errorContainer.style.paddingLeft = '12px';
//   errorContainer.style.lineHeight = '30px';
//   errorContainer.style.zIndex = '9999999999'
//   errorContainer.style.backgroundColor = "#fff";
//   errorContainer.style.transition = 'all ease .5s'
//   errorContainer.innerHTML = errorMsg;

//   var closeBtn = document.createElement('span');
//   closeBtn.style.display = 'inline-block';
//   closeBtn.style.height = '30px';
//   closeBtn.style.width = '30px';
//   closeBtn.style.position = 'absolute';
//   closeBtn.style.right = '0px';
//   closeBtn.style.cursor = 'pointer';
//   closeBtn.innerHTML = '<font color="#aaa" style="font-size:16px">x</font>'
//   closeBtn.addEventListener('click', function() {
//     errorContainer.style.display = 'none';
//   })
//   errorContainer.appendChild(closeBtn);

//   document.documentElement.appendChild(errorContainer);
// }
