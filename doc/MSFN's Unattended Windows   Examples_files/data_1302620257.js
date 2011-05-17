/* This source code is Copyright (c) Vibrant Media 2001-2011 and forms part of the patented Vibrant Media product "IntelliTXT" (sm). */ 
$iTXT.js.loader["$iTXT.data.AdLogger"]=true;$iTXT.data.AdLogger_Load=function(){var undefined;var $itxtUtil=$iTXT.core.Util;$iTXT.data.BeaconMode={SCRIPT:0,IMAGE:1,IFRAME:2}
$iTXT.data.TTCloseSource={MOUSEOUT:1,CLOSECLICK:2,KEYWORDCLICK:3,TOOLTIPCLICK:4,OVERNEWHOOK:5}
$iTXT.data.LogEventType={ADVIEW:1,TOOLTIPCLICK:2,HOOKCLICK:3,MONITOR:4}
$iTXT.data.ClickSource={KEYWORD:0,TOOLTIP:1,ICON:2}
$iTXT.data.AdViewValue={ADVIEW_KEYWORD:1,ADVIEW_ADVERT:2,ADVIEW_VIDEO_FIRSTFRAME:3,ADVIEW_VIDEO_LASTFRAME:4,ADVIEW_ENG_KEYWORD:5,ADVIEW_ENG_TOOLTIP:6,ADVIEW_UNQUALIFIED:7,ADVIEW_CLICKED_HOOK_ICON:21,ADVIEW_CLICKED_CLOSED:22}
$iTXT.data.AdLogger=$iTXT.core.Class.create({server:"",qavTID:-1,trkDrps:null,pWind:null,pWindName:"",pWindUrl:"",demoMode:false,duplicateAdViews:[],init:function(o)
{if($iTXT.data.al)
{return;}
this.demoMode=o.demo||false;$iTXT.data.al=this;this.server=o.server||"mymachine";this.trkDrps={};var evt=$iTXT.core.Event;$iTXT.core.$(document).itxtBatchSubscribe([["$iTXT:data:adlog",evt.bind(this,this.log)],["$iTXT:data:log:monitor",evt.bind(this,this._mtrLog)],["$iTXT:tt:open:prechromerw",evt.bind(this,this._ttOpnPRW)],["$iTXT:tt:open",evt.bind(this,this._ttOpn)],["$iTXT:tt:close",evt.bind(this,this._ttCls)],["$iTXT:tt:mouse:over",evt.bind(this,this._ttMsOvr)],["$iTXT:tt:mouse:out",evt.bind(this,this._ttMsOut)],["$iTXT:hook:over",evt.bind(this,this._hkOvr)],["$iTXT:hook:out",evt.bind(this,this._hkOut)],["$iTXT:tt:click",evt.bind(this,this._ttClick)],["$iTXT:hook:click",evt.bind(this,this._hookClick)],["$iTXT:hooks:loaded",evt.bind(this,this._pageHooksLoaded)],["$iTXT:livelookup:finished",evt.bind(this,this.llLoad)]],this.evtDspFuncs);},log:function(e)
{this._log(e.data);},_log:function(o)
{var url=this._bldALUrl(o);$itxtUtil.dropScript(url,function(removeFunction){removeFunction();});},_bldALUrl:function(o)
{var jsp=o.jsp||"al.asp";var url='http://'+this.server+'/'+jsp+'?ts='+(new Date()).getTime();if(this.demoMode)
{url+="&demogen=1";}
for(pn in o)
{if(('undefined'!=typeof o[pn])&&""!==o[pn])
{url+="&"+pn+"="+encodeURIComponent(o[pn]);}}
return url;},_logQS:function(qs,o,ret)
{var url=this._mkLogUrl(qs,o);var cb=function(params)
{if($itxtUtil.isObject(params))
{$iTXT.debug.debug($iTXT.debug.Category.ADLOGGER,"Adding extra params to log call: "+$itxtUtil.serialiseJSON(params));var extraParams="";for(var name in params)
{var val=params[name];extraParams+="&"+name+"="+encodeURIComponent(val);}
url+=extraParams;}};$iTXT.fire("$iTXT:adlogger:before:log",cb);$iTXT.debug.debug($iTXT.debug.Category.ADLOGGER,((ret)?"Building Event: ":"Logging Event: ")+url);if(ret)
{return url;}
else
{$itxtUtil.dropScript(url,function(removeFunction)
{removeFunction();if(o!=null&&o.onLoad)
{o.onLoad();}});}},_mkLogUrl:function(qs,o)
{o=o||{};var ld=o.logDocument||"al.asp";var url='http://'+this.server+'/'+ld+'?ts='+$iTXT.core.Util.isoTs();if(this.demoMode)
{url+="&demogen=1";}
url+="&"+qs;return url;},_pageHooksLoaded:function(e)
{var hks=e.data||[];var dids="";var adids="";var syids="";var apids="";var upw="";var upwr="";var kwp="";for(var i=0;i<hks.length;i++)
{var hk=hks[i];var ad=hk.ad;if(ad)
{if(i>0)
{dids+=",";adids+=",";syids+=",";apids+=",";upw+=",";upwr+=",";}
dids+=ad.$A.did;adids+=ad.$A.adid;syids+=ad.$A.syid;apids+=ad.$A.pid;upw+=ad.$A.uf;upwr+=ad.$A.ur;var tOff=hk.getPosition();kwp+=tOff.left+","+tOff.top+";";}}
var alOpts={adid:adids,di:dids,pid:apids,syid:syids,uf:upw,ur:upwr,hk:1,kp:kwp,so:$iTXT.cnst.Source.ITXT+""};var qps=this._makeQPrms(this.pvPrms,$iTXT.glob.params,alOpts);$iTXT.debug.info($iTXT.debug.Category.ADLOGGER,"Logging <b>Page View</b> ("+$itxtUtil.serialiseJSON(qps)+")");this._logQS(this._buildQS(qps));},_ttOpn:function(e)
{var o=e.data||{};var ad=o.advert||$iTXT.ui.tt.currentAdvert;if(ad)
{$iTXT.fire("$iTXT:ad:view",ad);var qavd=ad.params.get("qavd")||0;if(qavd>0)
{var t=this;this.logAV(ad,$iTXT.data.AdViewValue.ADVIEW_UNQUALIFIED,0,o);this.qavTID=window.setTimeout(function(){t.logAV(ad,$iTXT.data.AdViewValue.ADVIEW_KEYWORD,1,o);},qavd);}
else
{this.logAV(ad,$iTXT.data.AdViewValue.ADVIEW_KEYWORD,0,o);}}},llLoad:function(e)
{var o=e.data;var ad=o.advert||$iTXT.ui.tt.currentAdvert;if(ad)
{$iTXT.debug.info($iTXT.debug.Category.ADLOGGER,"Live lookup finished, firing AV=1");this.logAV(ad,$iTXT.data.AdViewValue.ADVIEW_KEYWORD,0,{});}},_ttOpnPRW:function()
{this._cancelQAVT();if(null!=$iTXT.tglb&&'undefined'!=typeof $iTXT.tglb&&'undefined'!=typeof $iTXT.tglb.getAVStub)
{return;}
var iTt=giTt();var ad=iTt.vm.a;var qavd=ad.params.get("qavd")||0;if(qavd>0)
{this.logAVPRW(ad,7,0);var t=this;this.qavTID=window.setTimeout(function(){t.logAVPRW(ad,1,1);},qavd);}
else
{this.logAVPRW(ad,1,0);}},_ttCls:function(e)
{this._cancelQAVT();if(!$iTXT.glob.newTooltipChrome)
return;var o=e.data||{};var ad=o.advert||$iTXT.ui.tt.currentAdvert;if(e.data.closeSource&&e.data.closeSource==$iTXT.data.TTCloseSource.CLOSECLICK)
{this.logAV(ad,$iTXT.data.AdViewValue.ADVIEW_CLICKED_CLOSED,0,o);}
this.logAV(ad,$iTXT.data.AdViewValue.ADVIEW_ENG_TOOLTIP,0,o);ad.avSent=false;var openLength=$iTXT.ui.tt.getTimeSinceOpen();if(openLength>1000)
{this.logAV(ad,openLength,0,o);}
this._lgMtr({mt:67,mv:o.closeSource,mv2:o.tso||$iTXT.ui.tt.getTimeSinceOpen()});var qavd=ad.params.get("qavd")||0;if(qavd>0&&openLength<qavd)
{this.logAV(ad,$iTXT.data.AdViewValue.ADVIEW_UNQUALIFIED,0,o);}
if(!this.duplicateAdViews[ad.id]){this.duplicateAdViews[ad.id]=1;}},_ttMsOvr:function(e)
{var o=e.data||{};var ad=o.advert||$iTXT.ui.tt.currentAdvert;if(ad&&!ad.loggedAV2)
{this.logAV(ad,$iTXT.data.AdViewValue.ADVIEW_ADVERT,0,o);ad.loggedAV2=true;}},_ttMsOut:function(e)
{},_hkOvr:function(e)
{},_hkOut:function(e)
{var o=e.data||{};var ad=o.advert||$iTXT.ui.tt.currentAdvert;if(ad)
{this.logAV(ad,$iTXT.data.AdViewValue.ADVIEW_ENG_KEYWORD,0,o);}},_mtrLog:function(e)
{this._lgMtr(e.data);},_lgMtr:function(o)
{o=o||{};var ad=o.advert||$iTXT.ui.tt.currentAdvert;var qps=this._makeQPrms(this.mtrPrms,ad.params,o);if(ad&&ad.getTemplate)
{var atmp=ad.getTemplate();if(atmp)
{if(atmp.onLogEvent)
{if(!atmp.onLogEvent($iTXT.data.LogEventType.MONITOR,qps,ad,o))
{return;}}}}
$iTXT.debug.info($iTXT.debug.Category.ADLOGGER,"Logging <b>Monitoring {0}</b>",o.mt);$iTXT.debug.debug($iTXT.debug.Category.ADLOGGER,"Logging <b>Monitoring {0} Data:</b> {1}",o.mt,$iTXT.core.Util.serialiseJSON(qps));this._logQS(this._buildQS(qps),o);},getTrackerUrl:function(av)
{var qps=this.getAVQueryParams($iTXT.ui.tt.currentAdvert,av,0,{});return this._mkLogUrl(this._buildQS(qps));},getAVQueryParams:function(ad,av,uqav,o)
{var qps=this._makeQPrms(this.avPrms,ad.params,o);qps.uav=uqav?1:undefined;qps.so=(0==ad.params.get("A.AT")?9:ad.params.get("ISO"));qps.av=av;qps.da=(this.duplicateAdViews[ad.id])?1:0;qps.ll=ad.params.get("ll")||0;qps.llip=ad.params.get("llip")||0;qps.hbll=ad.params.get("hbll")||0;qps.syid=ad.params.get("syid")||0;return qps;},logAV:function(ad,av,uqav,o)
{var msg;var qavd=ad.params.get("qavd")||0;var openLength=$iTXT.ui.tt.getTimeSinceOpen();if(av<1000){switch(parseInt(av)){case 1:if(qavd>0){msg="Qualified ad view - popup was open long enough, (required QAVD = "+qavd+"ms)";}
else{msg="Qualified ad view - popup opened, no minimal ad view length (QAVD) is set";}
break;case 2:msg="User mouseovered tooltip";break;case 5:msg="User moused-out the hook";break;case 6:msg="Tooltip is closing";break;case 7:msg="Unqualified ad view, popup wasn't open long enough. Open time: "+openLength+"ms, (required QAVD = "+qavd+"ms)";break;case 21:msg="User clicked hook icon";break;case 22:msg="User clicked (X) button";break;}}else{msg="Popup was opened longer than 1000ms, total time: "+av+"ms.";}
if(ad)
{var ll=ad.params.get("LIVELOOKUP",0);var llip=ad.params.get("LIVELOOKUPFINISHED",0);if(!o.fromHookClick)
{if(1==av)
{if((ll&&!llip))
{$iTXT.debug.info($iTXT.debug.Category.ADLOGGER,"<b style='color:red'>Delaying AV=1 Ad View becase live lookup is in progress</b>");return;}
if(ad.avSent)
{return;}
ad.avSent=true;}}else{if(ad.avSent)
{return;}
ad.avSent=true;}
o=o||{};if(ad.oldDid)
{$iTXT.debug.info($iTXT.debug.Category.ADLOGGER,"<b style='color:green'>Advert has an old detail id ("+ad.olDid+"), adding as ldid param.</b>");o.ldid=ad.oldDid;o.di=ad.did;}
var qps=this.getAVQueryParams(ad,av,uqav,o);var adTemplate=ad.getTemplate();if(adTemplate)
{if(adTemplate.onLogEvent)
{if(!adTemplate.onLogEvent($iTXT.data.LogEventType.ADVIEW,qps,ad,o))
{return;}}}
$iTXT.debug.info($iTXT.debug.Category.ADLOGGER,"Logging <b>Ad View {0}</b> <span style='color:green;'>{1}</span>",av,msg);$iTXT.debug.debug($iTXT.debug.Category.ADLOGGER,"Logging <b>Ad View {0} Data:</b> <span style='color:green;'>{1}</span>",av,$itxtUtil.serialiseJSON(qps));this._logQS(this._buildQS(qps),o);if(1==av)
{this._drpBkns(ad);}}},logAVPRW:function(ad,avt,uqav)
{var o={av:avt,ipid:ipid,di:ad.ldid,syid:ad.syid,adid:ad.adid,pid:ad.pid,cc:gGeo.cc,rcc:gGeo.rcc,so:(0==ad.at?9:iSo),mh:gSID,ll:ad.ll,hbll:ad.hbll,id:ad.id,pvu:gPVU,pvm:gPVM,uf:ad.uf,ur:ad.ur,idh:ad.idh}
if(ad.rc&&ad.rc.featured&&ad.rc.featured.wch)
{o.wch=ad.rc.featured.wch;}
if(uqav)
{o.uav=1;}
this._log(o);if(1==avt&&!this.trkDrps[ad.idh])
{this.trkDrps[ad.idh]=1;var toks=itxtSubclass(gTokVals);var timgs=ad.params.get("trkimages");if(timgs&&$itxtUtil.isArray(timgs))
{for(var i=0;i<timgs.length;i++)
{var cts=(new Date()).getTime().toString();toks.TIMESTAMP=cts;if(""!=timgs[i])
{var imgSrc=timgs[i];imgSrc=imgSrc.replace(/_TIMESTAMP_/g,cts);imgSrc=repToks(imgSrc,1,toks);var px=new $iTXT.data.Pixel(ad.did,ad.k,imgSrc,true,'trkimg');$iTXT.data.PixelManager.queue(px);}}
$iTXT.data.PixelManager.flush();}
if(ad.avs)
{itxtDSS(ad.avs);}}},_drpBkns:function(ad)
{if(ad.droppedBeacons)
{return;}
ad.droppedBeacons=1;var bcs=ad.params.get("trkimages");var atmpl=ad.getTemplate();if(atmpl)
{if(atmpl.onTrackingDrop)
{if(!atmpl.onTrackingDrop(bcs,ad))
{return;}}}
if(bcs&&$itxtUtil.isArray(bcs))
{for(var i=0;i<bcs.length;i++)
{var src=ad.params.parse(bcs[i],{'TIMESTAMP':$iTXT.core.Util.isoTs()});this._drpBkn(src);}}},_drpBkn:function(url)
{var bm=$iTXT.data.BeaconMode;var util=$iTXT.core.Util;var mode=url.match(/^https?\:\/\/.*\/(.*\.js|al\.asp)/i)?bm.SCRIPT:url.match(/^https?\:\/\/.*\/.*\.gif|png|jpg|jpeg/i)?bm.IMAGE:bm.IFRAME;var cb=function()
{if(this.parentNode)
{this.parentNode.removeChild(this);}}
switch(mode)
{case bm.SCRIPT:util.dropScript(url,cb);break;case bm.IMAGE:util.dropImage(url,cb);break;case bm.IFRAME:util.dropIframe(url,cb);break;}},_cancelQAVT:function()
{if(-1!=this.qavTID)
{window.clearTimeout(this.qavTID);this.qavTID=-1;}},prmMap:{'av':"ADVIEWTYPE",'at':"A.AT",'ipid':"IPID",'di':"A.LDID",'syid':"A.SYID",'adid':"A.ADID",'pid':"A.PID",'cc':"CC",'rcc':"RCC",'so':"so",'mh':"SID",'ll':"LIVELOOKUP",'hbll':"LIVELOOKUPFINISHED",'id':"H.ID",'idh':"H.IDH",'pvu':"pvu",'pvm':"pvm",'uf':"A.UF",'ur':"A.UR",'redir':"CLICKTAG"},pvPrms:['adid','cc','di','hk','ipid','mh','pid','pvm','pvu','rcc','so','syid','uf','ur','kp'],avPrms:['av','at','da','ipid','di','syid','adid','pid','cc','rcc','so','mh','ll','hbll','id','idh','pvu','pvm','uf','ur','len','wch','ldid'],clkPrms:['at','ipid','di','ldid','syid','adid','pid','cc','rcc','so','mh','ll','hbll','id','idh','pvu','pvm','uf','ur','ttv','llip','kp','redir','vt','qavclk'],mtrPrms:['mt','mv','mv2','ipid','di','id','idh','cc','rcc'],_makeQPrms:function(nms,params,o)
{var retObj={};if(params)
{for(var i=0;i<nms.length;i++)
{var qp=nms[i];var mapName=this.prmMap[qp];if(mapName)
{var val=o[qp]||params.get(mapName);if(val||(0==val&&'number'==typeof val))
{retObj[qp]=params.parse(val+"");}}
else if(o[qp]||(0==o[qp]&&'number'==typeof o[qp]))
{retObj[qp]=o[qp];}}}
return retObj;},_buildQS:function(map)
{var qs="";var addAmp=0;for(var qsName in map)
{var qsVal=map[qsName];if(qsVal||(0==qsVal&&'number'==typeof qsVal))
{if(addAmp)
{qs+="&";}
else
{addAmp=1;}
qs+=qsName+"="+encodeURIComponent(qsVal);}}
return qs;},_ttClick:function(e)
{if(!$iTXT.glob.newTooltipChrome)
{this._ttClickPRW(e);return;}
var o=e.data||{};var ad=o.advert||$iTXT.ui.tt.currentAdvert;if(!o.so)
{o.so=$iTXT.cnst.Source.TT;}
if(ad)
{var now=(new Date()).getTime();if(ad.lastClickTime)
{var clickDelay=parseInt(ad.params.get("RECLICKDELAY",10000));if(clickDelay>(now-ad.lastClickTime))
{return;}}
var ll=ad.params.get("LIVELOOKUP",0);var llif=ad.params.get("LIVELOOKUPFINISHED",0);if(ll&&!llif)
{o.llip=1;o.recurseTime=o.recurseTime?(o.recurseTime+250):0;if(o.recurseTime<5000)
{var t=this;window.setTimeout(function(){t._ttClick({data:o});},250);return;}}
else
{o.llip=0;}
var tso=$iTXT.ui.tt.getTimeSinceOpen();var qavd=ad.params.get("QAVD",0);if(qavd>0)
{if(tso<qavd)
{o.qavclk=1;this._cancelQAVT();}
else
{o.qavclk=2;}}
var ttcd=parseInt(ad.params.get("ttd",750));var cm=parseInt(ad.params.get("A.CM",0));if(cm&&cm>1000&&tso<cm)
{return;}
if(ad.oldDid)
{o.ldid=ad.oldDid;o.di=ad.did;}
var qParams=this._makeQPrms(this.clkPrms,ad.params,o);qParams.ttv=$iTXT.ui.tt.isOpen?1:0;if(ad.params.get("KP",0))
{var hkPos=ad.hook.getPosition();qParams.kp=hkPos.left+","+hkPos.top;}
var adTemplate=ad.getTemplate();if(adTemplate)
{if(adTemplate.onLogEvent)
{if(!adTemplate.onLogEvent($iTXT.data.LogEventType.TOOLTIPCLICK,qParams,ad,o))
{return;}}}
var redirect=qParams.redir;qParams.redir=undefined;var qString=this._buildQS(qParams);qString+="&redir="+encodeURIComponent(redirect);var url=this._mkLogUrl(qString,o);var cts=parseInt(ad.params.get("cts",0));if(o.cts!==undefined)
{cts=o.cts;}
$itxtUtil.openUrl(url,cts);if(!cts)
{$iTXT.core.$(document).itxtFire("$iTXT:tt:close",{closeSource:$iTXT.data.TTCloseSource.TOOLTIPCLICK});}
ad.lastClickTime=now;}},_hookClick:function(e)
{var o=e.data||{};var ad=o.advert||$iTXT.ui.tt.currentAdvert;var hkClickMode=ad.params.getInt("hk.click.mode",0);var hkClickModeTimeout=ad.params.getInt("hk.click.mode.time",0);switch(hkClickMode)
{case 1:$iTXT.debug.info($iTXT.debug.Category.ADLOGGER,'<b style="color:red;">Hook Click NOT Allowed (hk.click.mode=1)</b>');return;break;case 2:if(!$iTXT.ui.tt.isOpen)
{$iTXT.debug.info($iTXT.debug.Category.ADLOGGER,'<b style="color:red;">Hook Click NOT Allowed as tooltip is not open (hk.click.mode=2)</b>');return;}
$iTXT.debug.info($iTXT.debug.Category.ADLOGGER,'<b style="color:green;">Hook Click Allowed as tooltip is open (hk.click.mode=2)</b>');break;case 3:var tso=$iTXT.ui.tt.getTimeSinceOpen();if(tso<hkClickModeTimeout)
{$iTXT.debug.info($iTXT.debug.Category.ADLOGGER,'<b style="color:red;">Hook Click NOT Allowed as tooltip has only been open for {0}ms (hk.click.mode=3,hk.click.mode.to={1})</b>',tso,hkClickModeTimeout);return;}
$iTXT.debug.info($iTXT.debug.Category.ADLOGGER,'<b style="color:green;">Hook Click Allowed as tooltip has been open for {0}ms (hk.click.mode=3,hk.click.mode.to={1})</b>',tso,hkClickModeTimeout);break;case 0:default:$iTXT.debug.info($iTXT.debug.Category.ADLOGGER,'<b style="color:green;">Hook Click Allowed (hk.click.mode=0)</b>');break;}
if(!o.so)
{o.so=$iTXT.cnst.Source.KW;}
if(ad)
{var ll=ad.params.get("LIVELOOKUP",0);var llif=ad.params.get("LIVELOOKUPFINISHED",0);if(ll&&!llif)
{o.llip=1;o.recurseTime=o.recurseTime?(o.recurseTime+250):0;if(o.recurseTime<5000)
{var t=this;window.setTimeout(function(){t._hookClick({data:o});},250);return;}}
else
{o.llip=0;}
var cm=parseInt(ad.params.get("A.CM",0));if(1==cm)
{return;}
var now=(new Date()).getTime();var tso=$iTXT.ui.tt.getTimeSinceOpen();if(ad.lastClickTime)
{var clickDelay=parseInt(ad.params.get("RECLICKDELAY",10000));if(clickDelay>(now-ad.lastClickTime))
{return;}}
if(e.data.source&&e.data.source==$iTXT.data.ClickSource.ICON)
{this.logAV(ad,$iTXT.data.AdViewValue.ADVIEW_CLICKED_HOOK_ICON,0,o);}
var ttd=$iTXT.glob.params.getInt("ttd",0);if((cm==2)&&(ttd>1000)&&(tso<ttd))
{$iTXT.debug.info($iTXT.debug.Category.ADLOGGER,"<b style='color: red'>Hook click rejected as tooltip has only been open {0} ms, and ttd is {1}ms</b>",tso,ttd);return;}
var qavd=ad.params.get("QAVD",0);if(qavd>0)
{if(tso<qavd)
{$iTXT.debug.info($iTXT.debug.Category.ADLOGGER,'<b style="color:red;">Hook Click Not Allowed as QAVD has not been met</b>');return false;}}
var qParams=this._makeQPrms(this.clkPrms,ad.params,o);qParams.ttv=$iTXT.ui.tt.isOpen?1:0;qParams.ttv=$iTXT.ui.tt.isOpen?1:0;var adTemplate=ad.getTemplate();if(adTemplate)
{if(adTemplate.onLogEvent)
{if(!adTemplate.onLogEvent($iTXT.data.LogEventType.HOOKCLICK,qParams,ad,o))
{return;}}}
var redirect=qParams.redir;qParams.redir=undefined;var qString=this._buildQS(qParams);var override=false;if($itxtUtil.isArray(ad.params.get('clicktag','')))
{if(''!=$iTXT.glob.params.get('sest',''))
{var seID=$iTXT.glob.params.get('seid',-1);var adType=ad.params.get('a.at',-1);if((0==seID||14==seID)&&(32==adType||34==adType||46==adType))
{var adx=ad.params.get('adx',null);if(adx&&adx.get)
{var clk=adx.get("webClickURL2",null);if(clk)
{s+='&redir='+encodeURIComponent(clk.replace(/_KEYWORD_/,ad.params.get('keyword','')));$iTXT.debug.info($iTXT.debug.Category.ADLOGGER,'Using "{0}" for hook click.',clk);override=true;}}}}}
if(!override)
{qString+="&redir="+encodeURIComponent(redirect);}
var url=this._mkLogUrl(qString,o);var cts=ad.params.getInt("cts",0);if(o.cts!==undefined)
{cts=o.cts;}
if(ad.avSent)
{$iTXT.debug.info($iTXT.debug.Category.ADLOGGER,"<span style='color:#6E0D55'>Not logging av1 on click - already sent!</span>");}else{$iTXT.debug.info($iTXT.debug.Category.ADLOGGER,"<span style='color:#6E0D55'>Logging av1 - premature click (tooltip not loaded)</span>");o.fromHookClick=true;this.logAV(ad,$iTXT.data.AdViewValue.ADVIEW_KEYWORD,0,o);}
$itxtUtil.openUrl(url,cts);if(!cts)
{$iTXT.core.$(document).itxtFire("$iTXT:tt:close",{closeSource:$iTXT.data.TTCloseSource.KEYWORDCLICK});}
ad.lastClickTime=now;}},makeUrlPRW:function(a,clkOp)
{var o={};o.ipid=clkOp.ipid||ipid||'';o.cc=clkOp.cc||gGeo.cc||'';o.rcc=clkOp.rcc||gGeo.rcc||'';o.qavclk=clkOp.qavclk||undefined;if(a.ur)
{o.ur=a.ur;o.uf=a.uf;}
o.di=a.ldid;o.mh=clkOp.sid||gSID||'';o.syid=a.syid?a.syid:'';o.adid=a.adid?a.adid:'';o.pid=a.pid?a.pid:'';o.id=a.id.length?a.id:'';o.idh=a.idh.length?a.idh:'';o.pvm=clkOp.pvm||gPVM||'';o.pvu=clkOp.pvu||gPVU||'';o.ll=a.ll;var dekw=encodeURIComponent(a.k);o.ttv=clkOp.ttv||0;o.so=clkOp.so||0;if(a.hbll)
{o.hbll=a.hbll;}
o.llip=clkOp.llip||0;if(gKWPF)
{var anchor=aDIDN[a.did];var bb=cBB(anchor);if(bb!=null)
{clkOp.kp=+bb.l+','+bb.t;}}
if(a.multi)
{if(!((13<o.so)&&(20>o.so)))
{clkOp.redir=a.c;}
else
{var extraAds=a.adx.split('$$');var adDetail=extraAds[o.so-14].split('||');clkOp.redir=adDetail[3];}}
else if(a.c.length)
{var sSrchT=gSEST?decodeURIComponent(gSEST):"";var gSrchE_ID=gSEID?gSEID:0;if((sSrchT!=='')&&!(gSrchE_ID===0||gSrchE_ID===14)&&(a.at==32||a.at==34||a.at==46))
{var clk=gtADX(a.adx,"webClickURL2");clkOp.redir=clk?clk:a.c;}
else
{clkOp.redir=a.c;}}
o.redir=clkOp.redir||a.ct||"";o.redir=$itxtUtil.appendToURL(o.redir.replace(/_KEYWORD_/g,dekw).replace(/\$\{KEYWORD\}/g,dekw),(clkOp.csp||''));if(clkOp.vt)
{o.vt=clkOp.vt;}
var url=this._bldALUrl(o);return url;},_ttClickPRW:function(e)
{if(!gSI&&!gIESI)
{$iTXT.debug.info($iTXT.debug.Category.ADLOGGER,'Return from kwC: !gSI 77 !gIESI');return 0;}
var o=e.data||{};e.data=o;var a=fABDID(4==gPI?aADi:aAD,gDI);if(null==a)
{return 0;}
var now=(new Date()).getTime();var tstto=(now-$iTXT.glob.ttopents);if(a&&a.params&&a.params.get("qavd")&&a.params.get("qavd")>0)
{if(tstto<a.params.get("qavd"))
{o.qavclk=1;this._cancelQAVT();}
else
{o.qavclk=2;}}
if(a.ct&&(now-a.ct<10000))
{$iTXT.debug.info($iTXT.debug.Category.ADLOGGER,'Return from kwC: Too soon (now '+now+' - a.ct '+a.ct+' < 10000)');return 0;}
a.ct=now;var ttd=(gTTD>=1000?gTTD:750);if(o.cm&&(o.cm==2||o.cm>1000))
{var minT=(o.cm>=1000?o.cm:ttd);if(tstto<minT)
{dbM('Clicked to early, click again in: '+(minT-tstto)+'ms');return 0;}}
if(a.ll&&(1==a.ll)&&(!a.hbll||tstto<100))
{o.llip=1;o.rttclkt=('undefined'!=typeof o.rttclkt)?(o.rttclkt+250):0;if(o.rttclkt<5000)
{var t=this;e.data.rttclkt=o.rttclkt;$iTXT.debug.info($iTXT.debug.Category.ADLOGGER,'Retrying kwC: LL Too soon, retry in 250ms');window.setTimeout(function(){t._ttClickPRW(e);},250);return 0;}}
else
{o.llip=0;}
if(a.ll&&a.hbll&&a.llcr&&a.at==4)
{$iTXT.debug.info($iTXT.debug.Category.ADLOGGER,'Return from kwC: Blocked',1);return 0;}
o.ttv=1;var url=this.makeUrlPRW(a,o);$itxtUtil.openUrl(url,a.cts);if(4!=gPI&&!a.cts)
{var cs=(10==o.so)?3:((11<o.so)?4:null);ttH(1,cs);}
return 0;},getClickURL:function(ad,opts,params,noredir)
{opts=opts||{};params=params||this.clkPrms;if(!opts.so)
{opts.so=$iTXT.cnst.Source.ITXT;}
var qParams=this._makeQPrms(params,ad.params,opts);qParams.ttv=1;if(ad.params.get("KP",0))
{var hkPos=ad.hook.getPosition();qParams.kp=hkPos.left+","+hkPos.top;}
var redirect=(noredir||undefined==qParams.redir)?'':qParams.redir;qParams.redir=undefined;var qString=this._buildQS(qParams);if(!noredir)
{qString+="&redir="+encodeURIComponent(redirect);}
var url=this._mkLogUrl(qString,{});return url;}});}
$iTXT.js.loader["$iTXT.data.Advert"]=true;$iTXT.data.Advert_Load=function(){var undefined;$iTXT.data.AdvertManager={id:0,ads:{},remapped:{},add:function(ad)
{if(ad)
{var cAd=this.getByDid(ad.did);if(null!=cAd)
{this.remove(cAd);}
ad.id=this.id++;this.ads["itxtAdvert"+ad.id]=(ad);}},remove:function(advert)
{var newAds=[];for(adid in this.ads)
{var ad=this.ads[adid];if(ad!=advert)
{newAds["itxtAdvert"+ad.id]=ad;}}
this.ads=newAds;},get:function(id)
{return this.ads["itxtAdvert"+id]||null;},getByDid:function(did,caller)
{for(adid in this.ads)
{var ad=this.ads[adid];if(ad.$A&&ad.$A.did&&did==ad.$A.did&&ad!=caller)
{return ad;}}
return null;},list:function()
{var rArr=[];for(var i=1;i<this.id;i++)
{rArr.push(this.ads["itxtAdvert"+i]);}
return rArr;},remap:function(did,newdid)
{this.remapped[did]=newdid;},getMapping:function(did)
{if(this.remapped[did])
{return this.getByDid(this.remapped[did]);}
return null;}}
$iTXT.data.Advert=$iTXT.core.Class.create({template:null,params:null,id:-1,did:0,liveLookupFinished:false,avSent:false,childAdverts:null,processed:false,init:function(template,params,attributes)
{this.$A=attributes||{livelookup:false};this.did=this.$A.did;$iTXT.data.AdvertManager.add(this);this.templateClass=template||"$iTXT.tmpl.TemplateBase";this.params=params;this.clickTag=this.params.get("CLICKTAG");this.childAdverts=[];var childArr=params.get("children.adverts",[]);params.unset("children.adverts");this.addChildAds(childArr);$iTXT.debug.info($iTXT.debug.Category.ADVERT,"Advert Created with detail id {0} ({1}|{2})",this.did,params.get("a.at"),params.get("a.rat"));},setHook:function(hk)
{this.hook=hk;$iTXT.debug.info($iTXT.debug.Category.ADVERT,"Advert {0} associated with hook {1}",this.did,hk.options.value);this.params.set("KEYWORD",hk.options.value,$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);},createTemplate:function()
{if(!this.template)
{var _tKlass=eval(this.templateClass);this.template=new _tKlass({advert:this});}},processAdvert:function()
{if(this.processed)
{return;}
this.processed=true;var w=$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN;this.params.set("ITXTSERVER",$iTXT.js.serverName,w);for(var att in this.$A)
{this.params.set("a."+att,this.$A[att],w);}
var clickTag=this.clickTag;if(null!=clickTag)
{var clickTagValues=clickTag.split("##");var clickVarNames=this.params.get("CVN","");clickVarNames=clickVarNames.split(",");for(var i=0;i<clickVarNames.length;i++)
{if(clickVarNames.length>i&&clickTagValues.length>i)
{var clickVarName=clickVarNames[i];var clickTagValue=clickTagValues[i];if($iTXT.data.al&&""!=clickVarName)
{var url=$iTXT.data.al.getClickURL(this,{redir:clickTagValue});;this.params.set(clickVarName,url,w);}}}
this.params.set("SEARCHCLICKTAG",clickTagValues[0],w);if(clickVarNames.length==0)
{this.params.set("CLICKTAG",clickTagValues[0],w);}}
var wd=this.params.get("w");if(null!=wd)
{this.params.set("width",wd,w);}
var ht=this.params.get("h");if(null!=ht)
{this.params.set("height",ht,w);}
if($iTXT.data.al&&$iTXT.data.al.getClickURL)
{var clkUrl=$iTXT.data.al.getClickURL(this,{so:$iTXT.cnst.Source.LOGO,ll:this.params.get('ll',"0"),llip:this.params.get('llip',"0"),hbll:this.params.get('hbll',"0")});this.params.set("A.CLICKURL",clkUrl,w);this.params.set("clickURL",encodeURIComponent(clkUrl),w);}
var opts={ll:'0',llip:'0',hbll:'0',uf:null,ur:null};opts.so=$iTXT.data.ClickSource.LOGO;this.params.set('stub.tu',$iTXT.data.al.getClickURL(this,opts),$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);this.params.set('stub.tu.noredirect',$iTXT.data.al.getClickURL(this,opts,null,true),$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);opts.so=$iTXT.data.ClickSource.ICON;this.params.set('stub.t',$iTXT.data.al.getClickURL(this,opts),$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);opts.so='0',opts.av=1;this.params.set('stub.av',$iTXT.data.al.getClickURL(this,opts,$iTXT.data.al.avPrms,true),$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);this.params.set("LIVELOOKUP",this.$A.livelookup,$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);this.params.set("LIVELOOKUPFINISHED",0,$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);},getTemplate:function()
{this.createTemplate();return this.template;},addTemplateParams:function(params,weight)
{if(this.params&&this.params.set)
{var w=(undefined==weight)?$iTXT.cnst.WEIGHTING_DEFAULT_DATABASE:weight;this.params.set(params,null,w);}},tokenize:function(obj)
{return this.params.tokenize(obj);},isSameOrChild:function(a)
{try
{if(a==this)
{return true;}
if(null!=this.childAdverts&&$iTXT.core.Util.isArray(this.childAdverts))
{for(var i=0;i<this.childAdverts.length;i++)
{var ca=this.childAdverts[i];if(a==ca)
{return true;}}}}
catch(e)
{$iTXT.debug.error($iTXT.debug.Category.ERROR,"Exception in advert.js - isSameOrChild : "+e);}
return false;},addChildAds:function(children)
{if(children&&children.length>0)
{$iTXT.core.$A(children).itxtEach($iTXT.core.Event.bind(this,this.addChildAd));}},addChildAd:function(child)
{if(child)
{var adParams=new $iTXT.data.Param(this.params);adParams.set(child,null,$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);var adAttributes={};var ad=new $iTXT.data.Advert(this.templateClass,adParams,adAttributes);this.childAdverts.push(ad);}},addChildAdvert:function(ad)
{if(ad)
{this.childAdverts.push(ad);}}});}
$iTXT.js.loader["$iTXT.data.AdvertHandler"]=true;$iTXT.data.AdvertHandler_Load=function(){var undefined;$iTXT.data.AdvertHandler=$iTXT.core.Class.create({advert:null,callback:null,init:function(advert)
{this.advert=advert;},handle:function(callback)
{this.callback=callback;if(this.advert.$A.livelookup&&!this.advert.liveLookupInProgress&&$iTXT.js.serverUrl&&$iTXT.cnst.CONTROLLER_LOOK)
{this.advert.liveLookupInProgress=true;$iTXT.debug.info($iTXT.debug.Category.ADVERT,"Advert <b>{0}</b> requires a live lookup.",this.advert.did);var fo=0;var lookUrl=$iTXT.js.serverUrl+$iTXT.cnst.CONTROLLER_LOOK+"?ts="+$iTXT.core.Util.ts();var lookKeys=[$iTXT.cnst.Params.REF,$iTXT.cnst.Params.REF_MD5,$iTXT.cnst.Params.UID,$iTXT.cnst.Params.UID_MD5,"ipid","cc","rcc","reg","dma","city","auat","fo",["did","a.did"],["syid","a.syid"],["pid","a.pid"],"eat","dat","sest","seid","sehs","ugoogle"];lookUrl+="&"+$iTXT.core.Util.generateQueryString(lookKeys,this.advert.params);var t=this;$iTXT.core.Util.dropScript(lookUrl,function(details)
{t._liveLookupLoad(details);});}
else
{callback();}},_liveLookupLoad:function(liveLookupDetails)
{$iTXT.debug.info($iTXT.debug.Category.ADVERT,"Live lookup returned an advert with the detail id <b>{0}</b>",liveLookupDetails.did);this.advert.params.set("LIVELOOKUPFINISHED",1,$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);var newAd=$iTXT.data.AdvertManager.getByDid(liveLookupDetails.did);if(liveLookupDetails.did!=this.advert.did)
{$iTXT.debug.info($iTXT.debug.Category.ADVERT,"Live lookup detail id has changed. Old: {0}, New: {1}",this.advert.did,liveLookupDetails.did);newAd.oldDid=this.advert.did;}
this.advert.hook.options.uid=liveLookupDetails.uid;this.advert.hook.options.uidh=liveLookupDetails.uidh;this.advert.hook.setAdvert(newAd);newAd.$A.livelookup=false;newAd.liveLookupFinished=true;newAd.params.set("LIVELOOKUPFINISHED",1,$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);if(this.advert.templateClass!=newAd.templateClass)
{var templateName=newAd.templateClass.substring(newAd.templateClass.lastIndexOf('.')+1);$iTXT.core.Util.loadTemplate(templateName,function(){$iTXT.core.$(document).itxtFire("$iTXT:tt:content:change:ad",newAd);});this.advert.template.dispose();}
else
{$iTXT.core.$(document).itxtFire("$iTXT:tt:content:change:ad",newAd);}
$iTXT.fire("$iTXT:livelookup:finished",{advert:newAd});}});}
$iTXT.js.loader["$iTXT.data.Channel"]=true;$iTXT.data.Channel_Load=function(){var undefined;$iTXT.data.Channel=$iTXT.core.Class.create({init:function()
{$iTXT.glob.currentChannel=this;if($iTXT.glob.params)
{this._processChannelParams();}},_processChannelParams:function()
{var p=$iTXT.glob.params;p.set("normalisedcountry",p.get("cc"));p.set("realcountry",p.get("rcc"));p.set("region",p.get("reg"));p.set("pcode",p.get("postcode"));p.set("regname",p.get("regionname"));}});}
$iTXT.js.loader["$iTXT.data.Context"]=true;$iTXT.data.Context_Load=function()
{var undefined;var $itxtUtil=$iTXT.core.Util;$iTXT.data.Context={BAD_EXCL:1,BAD_SHORT:2,BAD_SML_IMG:4,BAD_IAB_IMG:8,BAD_NOT_CONTENT:16,allowedFields:{c:'itxtAllowed',h:'itxtAllowed',n:'itxtAllowed',p:'itxtAllowed',t:'itxtAllowed',u:'itxtAllowed',v:'itxtAllowed',w:'itxtAllowed',x:'itxtAllowed'},changedContentSections:{},contextFull:true,currentDepth:0,dynamicContentMode:false,eligibleElementsTotal:-1,harvestCount:0,harvestedCount:0,lastTimeOut:-1,modifiedTrees:[],nodeAssessments:[],nodeTextLengths:[],pageElementsTotal:-1,pageTitle:'',paragraphNodes:[],processedElementsCount:0,textNodes:[],timedOut:false,timings:{},treeObjectMode:false,Node:$iTXT.core.Class.create({c:null,h:null,n:null,p:null,t:null,u:null,v:null,w:null,x:null,init:function(n,params,parent,uuid)
{if(params.metrics&$iTXT.debug.Util.ECH_EVENTS_TIME)
{params.metricID=uuid||$itxtUtil.genUUID();$iTXT.metrics.Context.nodeMetrics.tick(params.metricID,n);$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'init: start');}
if(this._checkLimits(params))
{this._suicide();return;}
var hC=n.itxtHarvested;if(n&&null!=hC&&undefined!=hC&&hC==$iTXT.data.Context.harvestCount)
{if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_init: early end - loop detected');}
this._suicide();return;}
var domA={},nT=n.nodeType;if(nT)
{domA.nodeElem=!!(nT==$itxtUtil.ELEMENT_NODE);domA.nodeAttr=!!(nT==$itxtUtil.ATTRIBUTE_NODE);domA.nodeText=!!(nT==$itxtUtil.TEXT_NODE);}
if(!domA.nodeElem&&!domA.nodeAttr&&!domA.nodeText)
{if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'init: early end - unsuitable element');}
this._suicide();return;}
if(!$iTXT.data.Context.contextFull&&domA.nodeAttr)
{if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'init: early end - attribute and context is light');}
this._suicide();return;}
if(domA.nodeAttr&&n.nodeName&&params.intattrs)
{iAttrs=params.intattrs.split(",");if(!$itxtUtil.inArray(iAttrs,n.nodeName))
{if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'init: early end - uninteresting attribute');}
this._suicide();return;}}
if(domA.nodeText)
{var nV=$itxtUtil.cleanString(n.nodeValue);if(null==nV||undefined==nV||""==nV)
{if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'init: early end - unsuitable content');}
this._suicide();return;}}
if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'init: start assessment');}
var didA=false;if(domA.nodeElem)
{if(n.itxtBad)
{this._bad=n.itxtBad;if(this._isBad(n))
{if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'init: early end - bad node from pre-processors ('+this._bad+')');}
this._suicide();return;}}
this._nId=$iTXT.data.Dom.setNodeId(n);try
{n.itxtHarvested=$iTXT.data.Context.harvestCount;}
catch(x)
{$iTXT.debug.error($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> Could not mark node ('+n+') as processed due to error "'+x.message+'".');}
var thisA=$iTXT.data.Context.loadAssessment(n);if((!thisA||!$itxtUtil.isObject(thisA))&&params.assessor&&params.assessor.assess)
{var sel=$iTXT.data.Dom.parseElement(n,params.intattrs);thisA=params.assessor.assess(sel);didA=true;if(params.metrics&$iTXT.debug.Util.ECH_ASSESS_DUMP)
{var aStr='';for(var a in thisA)
{if('function'!=typeof thisA[a])
{var tag=(a.indexOf('is')==0)?'b':'span';aStr+='&nbsp;&nbsp;&nbsp;&nbsp;'+a+':<'+tag+' style="color:'+((thisA[a]==true)?'green':'red')+';">'+thisA[a]+'</'+tag+'><br/>';}}
if(''!=aStr&&$iTXT.debug.Util.isLoggingOn())
{var sSel=$itxtUtil.serialiseJSON(sel);$iTXT.debug.debug($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> Node<br />'+sSel+'<br />assessed as:<br />'+aStr);}}}}
var assessment=thisA||{};assessment.nodeElem=domA.nodeElem;assessment.nodeAttr=domA.nodeAttr;assessment.nodeText=domA.nodeText;if(params.metrics&$iTXT.debug.Util.ECH_JSON_DB)
{if(!this._debug)
{this._debug={};}
this._debug.assessment=assessment;try
{this._debug.node={name:n.nodeName};if(n.nodeValue)
{this._debug.node.value=$itxtUtil.cleanString(n.nodeValue.replace(/(\"|\'|\\)/g,''))}
if(n.id)
{this._debug.node.id=n.id;}
if(n.styleClass)
{this._debug.node.styleClass=n.styleClass;}}
catch(x)
{this._debug.node=x.message;}}
if(didA)
{$iTXT.data.Context.saveAssessment(n,assessment);}
if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'init: end '+((didA)?'PERFORMED':'CACHED')+' assessment');}
if(assessment.nodeElem)
{$iTXT.data.Context.processedElementsCount++;}
if(!params.processed)
{if(undefined==params.maxImageW)
{params.maxImageW=-1;}
if(undefined==params.maxImageH)
{params.maxImageH=-1;}
if(undefined==params.initskip)
{params.initskip=-1;}
if(undefined==params.maxnodes)
{params.maxnodes=-1;}
if(undefined==params.maxnodedepth)
{params.maxnodedepth=255;}
if(undefined==params.mintextlength)
{params.mintextlength=-1;}
if(undefined==params.maxheaderdepth)
{params.maxheaderdepth=3;}
if(undefined==params.timeout)
{params.timeout=1500;}
if(params.initskip>0&&params.maxnodes>0)
{params.maxnodes+=params.initskip;}
params.processed=true;}
this._setType(n,params,assessment,parent);if(this._isBad(n,assessment.hasHooknodes))
{if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'init: early end - bad node after _setType ('+this._bad+')');}
this._suicide();return;}
if(""==this.t)
{delete this.t;}
$iTXT.data.Context.currentDepth++;this._getChildren(n,params,assessment);this._setHookable(n,params,assessment,parent);this._setParagraph(n,params,assessment,parent);this._setWeight(n,params,assessment,parent);this._setContent(n,params,assessment,parent);if(this._isBad(n,assessment.hasHooknodes))
{if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'init: early end - bad node after _setContent ('+this._bad+')');}
$iTXT.data.Context.currentDepth--;this._suicide();return;}
if($iTXT.data.Context.dynamicContentMode)
{this._setVisibility(n,params,assessment,parent);}
if($iTXT.debug.CurrentConsole&&!$iTXT.glob.params.get('itxthln-xx'))
{if(1==this.h)
{$iTXT.debug.Util.hilite(n,$iTXT.debug.Util.HL_COL_SKIP);}
else
{$iTXT.debug.Util.hilite(n,$iTXT.debug.Util.HL_COL_CONTENT,null,true);}
if(assessment.isUnbreaknode)
{$iTXT.debug.Util.hilite(n.firstChild,$iTXT.debug.Util.HL_COL_SKIP,$iTXT.debug.Util.HL_BORDER_UPN);}}
var me={h:this.h,p:this.p,t:this.t,v:this.v};if(parent&&parent.p&&1==parent.p)
{me.p=1;}
if(parent&&1==parent.h)
{me.h=1;}
if(parent&&1==parent.v)
{me.v=parent.v;}
if(assessment.isHooknode||(parent&&parent.isHooknode))
{me.isHooknode=true;}
if(assessment.isSkipnode||(parent&&parent.isSkipnode))
{me.isSkipnode=true;}
this._setChildren(n,params,assessment,me);$iTXT.data.Context.currentDepth--;if(params.metrics&$iTXT.debug.Util.ECH_JSON_DB)
{if(!this._debug)
{this._debug={};}
try
{this._debug.orig={};for(var fN in this)
{if('x'!=fN&&fN.substring(0,1)!='_'&&this[fN]&&'function'!=typeof this[fN])
{this._debug.orig[fN]=$itxtUtil.cleanString(this[fN]);}}}
catch(x)
{this._debug.orig=x.message;}}
if(!this.c&&!this.u&&!this.x)
{this._suicide();}
delete this._bad;if(this.t&&this.x&&!this.u&&!this.c)
{delete this.t;}
if(this.h&&this.x&&!this.u&&!this.c)
{delete this.h;}
if(1==this.h)
{this.h=0;}
if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'init: end');}},serialise:function(all)
{if(all||this.c||this.u||this.w||this.x)
{return $itxtUtil.serialiseJSON(this,$iTXT.data.Context.allowedFields);}
else
{return'{}';}},simplify:function(all)
{var rO={},rF=[];if(all||this.c||this.u||this.w||this.x)
{for(var f in $iTXT.data.Context.allowedFields)
{if(null!=this[f])
{rF[rF.length]=f;rO[f]=this[f];}}}
return(rF.length>0)?rO:null;},_checkLimits:function(params)
{if(params.maxnodes>0&&$iTXT.data.Context.textNodes.length>=params.maxnodes)
{if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_checkLimit: early end - node count exceeded');}
return true;}
var tc=new Date().getTime();if(params.timeout>0&&undefined!=$iTXT.data.Context.timings.cStart&&(tc-$iTXT.data.Context.timings.cStart)>params.timeout)
{if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_checkLimit: early end - global timeout exceeded');}
$iTXT.data.Context.timings.cEnd=tc;$iTXT.data.Context.timedOut=true;$iTXT.data.Context.lastTimeOut=params.timeout;return true;}
return false;},_getChildren:function(n,params,parent)
{var badTags={'a':true,'applet':true,'embed':true,'form':true,'iframe':true,'img':true,'noscript':true,'object':true,'script':true,'style':true,'xml':true};var children=[];if(n.nodeType==$itxtUtil.ELEMENT_NODE)
{if(params.maxnodedepth&&params.maxnodedepth>-1&&$iTXT.data.Context.currentDepth>=params.maxnodedepth)
{$iTXT.debug.debug($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> Node depth of '+$iTXT.data.Context.currentDepth+' exceeds maximum permissable of '+params.maxnodedepth+'.');}
else
{var cs=n.childNodes,t='';var l=cs.length;while(l--)
{var c=cs[l];var cT=c.nodeType;if(cT==$itxtUtil.TEXT_NODE)
{children[children.length]=c;if(!badTags[n.tagName.toLowerCase()])
{var cV=c.nodeValue;if(null!=cV&&undefined!=cV&&''!=cV)
{t+=' '+cV;}}}
else if(cT==$itxtUtil.ELEMENT_NODE)
{children[children.length]=c;var childA=$iTXT.data.Context.loadAssessment(c);if(!childA||!$itxtUtil.isObject(childA))
{childA=params.assessor.assess($iTXT.data.Dom.parseElement(c,params.intattrs));childA.nodeElem=true;childA.nodeAttr=false;childA.nodeText=false;$iTXT.data.Context.saveAssessment(c,childA);}}}
$iTXT.data.Context.nodeTextLengths[n.itxtNodeId]=$itxtUtil.cleanString(t).length||0;}}
this._children=children.reverse();},_isBad:function(n,nohilite)
{if(this._bad>0)
{if(!nohilite)
{var col=$iTXT.debug.Util.HL_COL_EXCLUDE;var bor=$iTXT.debug.Util.HL_BORDER_STD;if($iTXT.data.Context.BAD_NOT_CONTENT==this._bad)
{col=$iTXT.debug.Util.HL_RESET;}
else if($iTXT.data.Context.BAD_SHORT==this._bad)
{col=$iTXT.debug.Util.HL_COL_SKIP;bor=$iTXT.debug.Util.HL_BORDER_SHORT;}
else if($iTXT.data.Context.BAD_SML_IMG==this._bad||$iTXT.data.Context.BAD_IAB_IMG==this._bad)
{col=$iTXT.debug.Util.HL_COL_SKIP;}
$iTXT.debug.Util.hilite(n,col,bor);}
return true;}
else
{return false;}},_processNodes:function(n,nodeList,params,parent)
{if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_processNodes: start');}
var rA=[];var killChildren=('a'==this.t)?true:false;var hasContent=false;var hasUrl=false;for(var i=0,len=nodeList.length;i<len;i++)
{var thisChild=nodeList[i];if(thisChild.itxtBad)
{continue;}
var noContentTags={"br":true,"hr":true};if(thisChild.tagName&&noContentTags[thisChild.tagName.toLowerCase()])
{continue;}
if(thisChild.nodeType==$itxtUtil.TEXT_NODE)
{var content=thisChild.nodeValue.replace(/^\s\s*/,'').replace(/\s\s*$/,'');if(content.length==0)
{continue;}}
var node=new $iTXT.data.Context.Node(thisChild,params,parent);if(1==this.h&&null!=node.h&&undefined!=node.h)
{delete this.h;}
if(node.u)
{hasUrl=true;}
if(node.c&&"std"==node.t)
{if(parent&&parent.t&&"std"!=parent.t)
{node.t=parent.t}
hasContent=true;}
if("a"==this.t&&hasContent&&hasUrl)
{killChildren=false;}
if($iTXT.data.Context.treeObjectMode)
{var cId=$iTXT.data.Dom.setNodeId(thisChild);node=node.simplify();if(null!=node)
{var next=rA.length;rA[next]=node;if(cId)
{$iTXT.data.Dom.nodeIds[cId]=rA[next];}}}
else
{var json=node.serialise();if('{}'!=json)
{rA[rA.length]=json;}
node=null;}}
if(killChildren)
{rA=[];}
if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_processNodes: end');}
return rA;},_setChildren:function(n,params,assessment,parent)
{if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_setChildren: start');}
var iAttrs=[],nAttrs=[];if(params.intattrs&&n.attributes)
{iAttrs=params.intattrs.split(",");nAttrs=n.attributes;}
if(assessment.nodeElem)
{var children=this._children||[];if(iAttrs.length>0)
{for(att in iAttrs)
{var aName=('name'==iAttrs[att]&&'meta'==this.t)?'content':iAttrs[att];if(nAttrs[aName]&&nAttrs[aName].specified)
{children[children.length]=nAttrs[aName];}}}
if(children.length>0)
{children=this._processNodes(n,children,params,parent);if(children.length>0)
{this.x=children;}}}
if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_setChildren: end');}},_setContent:function(n,params,assessment,parent)
{if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_setContent: start');}
var content=null;var nName=n.nodeName;var nValue=$itxtUtil.cleanString(n.nodeValue);if(assessment.nodeAttr)
{content=nValue;}
else if(assessment.nodeText)
{content=nValue;}
else if(assessment.nodeElem&&'meta'==this.t&&n.content)
{content=$itxtUtil.cleanString(n.content);parent={};}
if(null!=content&&content.length>1)
{content=content.replace(/\\/g,'\\\\');content=content.replace(/"/g,'\\"');content=content.replace(/<.*>|\{|\}/g,"");if($itxtUtil.isURL(content,true))
{this.u=content;}
else
{var pN=n.parentNode,t=this.t||parent.t;if((params.mintextlength>0)&&pN&&pN.nodeType==$itxtUtil.ELEMENT_NODE&&(1!=this.p)&&(1!=parent.p)&&("h"!=t)&&("title"!=t)&&("meta"!=t)&&(content.length<params.mintextlength))
{if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_setContent: early end - min-text length');}
this._bad=$iTXT.data.Context.BAD_SHORT;return;}
if(content.length>0&&content.match(/[a-zA-Z0-9]/))
{if(null==this.t||undefined==this.t||""==this.t)
{this.t='std';}
var h=this.h||parent.h;if((null==h||undefined==h||h<1)&&'std'==this.t)
{$iTXT.data.Context.textNodes[$iTXT.data.Context.textNodes.length]=n;this.n=$iTXT.data.Context.textNodes.length;var currPara=$iTXT.data.Context.paragraphNodes.length-1;if(currPara>=0)
{$iTXT.data.Context.paragraphNodes[currPara].push(n);}}
$iTXT.data.Context.harvestedCount++;this.c=content;if('title'==parent.t&&'title'==this.t)
{$iTXT.data.Context.pageTitle=content;}}}}else{if(this.t&&'title'==this.t&&!$iTXT.data.Context.pageTitle&&!this.c)
{var content=$iTXT.data.Context.pageTitle=$itxtUtil.cleanString(n.innerText);if(content)
{content=content.replace(/\\/g,'\\\\');content=content.replace(/"/g,'\\"');content=content.replace(/<.*>|\{|\}/g,"");}
this.h=1;delete this.w;this.c=content;}}
var rX=/([^\w\s\-\!\"#$&\'()*+,.\/:;<=>?@[\\\]\^_`{|}~])/g;if(this.c&&this.c.match(rX))
{this.c=this.c.replace(rX,function(s)
{return encodeURIComponent(s);});}
if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_setContent: end');}},_setHookable:function(n,params,assessment,parent)
{if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_setHookable: start');}
if('meta'==this.t||assessment.nodeAttr)
{this.h=1;return;}
if(parent&&1==parent.h)
{this.h=1;if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_setHookable: early end - parent not hookable');}
return;}
if(null!=parent&&null==parent.h&&null!=this.t&&('alt'==this.t||'h'==this.t||'img'==this.t||'meta'==this.t||'title'==this.t||'url'==this.t))
{this.h=1;if(parent&&assessment.hasHooknodes&&!parent.isHooknode&&('alt'==this.t||'h'==this.t))
{this._bad=$iTXT.data.Context.BAD_NOT_CONTENT;}
if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_setHookable: early end - ex-officio not hookable type');}
return;}
if(assessment.nodeText)
{var pNode=n.parentNode;var parentA=$iTXT.data.Context.loadAssessment(pNode);if(pNode&&pNode.nodeType&&(!parentA||!$itxtUtil.isObject(parentA)))
{parentA=params.assessor.assess($iTXT.data.Dom.parseElement(pNode,params.intattrs));var nT=pNode.nodeType;parentA.nodeElem=!!(nT==$itxtUtil.ELEMENT_NODE);parentA.nodeAttr=!!(nT==$itxtUtil.ATTRIBUTE_NODE);parentA.nodeText=!!(nT==$itxtUtil.TEXT_NODE);$iTXT.data.Context.saveAssessment(pNode,parentA);}
if((!parentA.hasHooknodes&&(parentA.isSkipnode||parent.isSkipnode))||(parentA.hasHooknodes&&((!parentA.isHooknode&&!parent.isHooknode)||(parent.isHooknode&&parentA.isSkipnode))))
{this.h=1;if(parentA.hasHooknodes&&!parent.isHooknode)
{this._bad=$iTXT.data.Context.BAD_NOT_CONTENT;}
if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_setHookable: early end - skip or not explicitly hookable');}
return;}}
if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_setHookable: end');}},_lenOK:function(n,params)
{var textLength=$iTXT.data.Context.nodeTextLengths[n.itxtNodeId];if(undefined==textLength)
{if(params.maxnodedepth&&params.maxnodedepth>-1&&$iTXT.data.Context.currentDepth>=params.maxnodedepth)
{return false;}
textLength=$iTXT.data.Dom.getInnerTextLength(n);$iTXT.data.Context.nodeTextLengths[n.itxtNodeId]=textLength;$iTXT.debug.debug($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> <b style="color:#ff6600;">WARNING:</b> Had to use $iTXT.data.Dom.getInnerText for node '+n.itxtNodeId);}
if(!params.mintextlength||isNaN(params.mintextlength)||params.mintextlength<0)
{params.mintextlength=1;}
return!!(textLength>=params.mintextlength);},_childBPNs:function(n,params)
{if(null!=this._children)
{var cNodes=this._children;var i=cNodes.length;while(i--)
{var cNode=cNodes[i];if(cNode&&cNode.nodeType&&$itxtUtil.ELEMENT_NODE==cNode.nodeType)
{var childA=$iTXT.data.Context.loadAssessment(cNode);if(!childA||!$itxtUtil.isObject(childA))
{childA=params.assessor.assess($iTXT.data.Dom.parseElement(cNode,params.intattrs));childA.nodeElem=true;childA.nodeAttr=false;childA.nodeText=false;$iTXT.data.Context.saveAssessment(cNode,childA);}
if(childA.isBreaknode)
{return true;}}}}
return false;},_relatedBPNs:function(n,params)
{var cands=[];if(null!=n.parentNode&&$itxtUtil.ELEMENT_NODE==n.parentNode.nodeType)
{cands[cands.length]=n.parentNode;}
if(null!=n.previousSibling&&$itxtUtil.ELEMENT_NODE==n.previousSibling.nodeType)
{var pS=n.previousSibling;while(pS)
{cands[cands.length]=pS;pS=pS.previousSibling;}}
if(null!=n.nextSibling&&$itxtUtil.ELEMENT_NODE==n.nextSibling.nodeType)
{var nS=n.nextSibling;while(nS)
{cands[cands.length]=nS;nS=nS.nextSibling;}}
for(var i=0,len=cands.length;i<len;i++)
{var cand=cands[i];if(cand&&cand.nodeType&&$itxtUtil.ELEMENT_NODE==cand.nodeType)
{var candA=$iTXT.data.Context.loadAssessment(cand);if(!candA||!$itxtUtil.isObject(candA))
{candA=params.assessor.assess($iTXT.data.Dom.parseElement(cands[i],params.intattrs));candA.nodeElem=true;candA.nodeAttr=false;candA.nodeText=false;$iTXT.data.Context.saveAssessment(cands[i],candA);}
if(candA.isBreaknode)
{return true;}}}
return false;},_setParagraph:function(n,params,assessment,parent)
{if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_setParagraph: start');}
delete this.p;if(!assessment.isSkipnode)
{if(!parent||!parent.p||1!=parent.p)
{if((!parent||!parent.t||("title"!=parent.t&&"h"!=parent.t))&&(!this.t||("title"!=this.t&&"h"!=this.t))&&(!this.h||1!=this.h))
{if(assessment.nodeElem)
{if(!this._childBPNs(n,params))
{if(assessment.isUnbreaknode||this._lenOK(n,params))
{this.p=1;}}}
else if(assessment.nodeText&&this._relatedBPNs(n,params)&&this._lenOK(n.parentNode,params))
{this.p=1;}}}}
if(1==this.p)
{var currL=$iTXT.data.Context.paragraphNodes.length;if(currL>0)
{var lastM=currL-1
var lastP=$iTXT.data.Context.paragraphNodes[lastM];if(!lastP||0==lastP.length)
{currL=lastM;}}
$iTXT.data.Context.paragraphNodes[currL]=[];}
if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_setParagraph: end');}},_setType:function(n,params,assessment,parent)
{if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_setType: start');}
delete this.t;if(assessment.isExcludenode&&!assessment.isContentnode)
{this._bad=$iTXT.data.Context.BAD_EXCL;if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_setType: early end - exclude node');}
return;}
if(assessment.nodeElem)
{var nN=n.nodeName.toLowerCase();if('img'==nN)
{this.t="img";}
else if("title"==nN||"meta"==nN||"a"==nN)
{if('meta'==nN&&!assessment.isContentnode)
{this._bad=$iTXT.data.Context.BAD_NOT_CONTENT;if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_setType: early end - non-content m');}
return;}
this.t=nN;}
else if('h'==nN.substr(0,1)&&!isNaN(nN.substr(1,1)))
{var hLevel=nN.substr(1,1);if(hLevel<=params.maxheaderdepth)
{this.t="h";}}
if(!this.t)
{if(assessment.hasHooknodes&&!assessment.isHooknode)
{delete this.t;}
else
{this.t="std";}}}
else if(assessment.nodeAttr)
{this.t=n.nodeName.toLowerCase();if('title'==this.t&&parent&&parent.t&&'title'!=parent.t)
{this.t=parent.t+'-'+this.t;}
if(('href'==this.t||'src'==this.t)&&parent&&parent.t)
{this.t=parent.t;}
if('content'==this.t)
{this.t='meta';}}
else if(assessment.nodeText&&null==this.t&&parent&&parent.t)
{switch(parent.t)
{case'alt':case'h':case'img':case'meta':case'title':case'url':this.t=parent.t;break;}}
if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_setType: end');}},_setVisibility:function(n,params,assessment,parent)
{if(!assessment.isVisibilitynode||this.h||(parent&&parent.h)||!n.nodeType||$itxtUtil.ELEMENT_NODE!=n.nodeType||assessment.isSkipnode)
{return;}
var isNewSec=$iTXT.data.Dom.assessVisibility(n);if(isNewSec)
{this.v=$iTXT.data.Dom.visibilitySections[this._nId];var vState=$iTXT.data.Dom.isVisible(n);if(!$iTXT.data.Context.changedContentSections[this.v])
{$iTXT.data.Context.changedContentSections[this.v]={pseudoURL:'',sent:false};}
if(!params.visscanwholepage||!vState)
{$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<span style="color:#ff6600;"><b>Web 2.0:</b> SCAN </span> '+$iTXT.data.Dom.getElementSignature(n,true)+' ('+this._nId+') is '+((vState)?'':'NOT ')+'visible'+((this.v)?' (section '+this.v+')':'')+'.');}
if(!vState)
{this.h=1;$iTXT.data.Context.getPseudoURL(this.v);}
else
{if(!$iTXT.data.Context.changedContentSections[this.v])
{$iTXT.data.Context.changedContentSections[this.v]={pseudoURL:$iTXT.glob.params.get('refurl'),sent:true};}}
$iTXT.data.Dom.setOnPropChange(n,function(e)
{$iTXT.data.Dom.onVisibilityChange(n,function(n)
{$iTXT.data.Context.onContentStateChange(n);});});}},_setWeight:function(n,params,assessment,parent)
{if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_setWeight: start');}
if(assessment.isWeightset)
{this.w=assessment.weightset;delete assessment.weightset;}
if(params.metricID)
{$iTXT.metrics.Context.nodeMetrics.tock(params.metricID,'_setWeight: end');}},_suicide:function()
{for(var fN in this)
{if('function'!=typeof this[fN])
{delete this[fN];}}}}),determineCompatMode:function()
{var nds=document.getElementsByName('intelliTxt');if(nds&&nds.length==0)
{nds=document.getElementsByName('intelliTXT');}
if(nds&&nds.length>0)
{return'v1';}
if(document.getElementById('intelliTxt'))
{return'v1';}
if(document.getElementById('intelliTXT'))
{return'v1';}
return'v2';},getContent:function()
{var cUrl=$iTXT.glob.params.get('refurl');for(var ccI in this.changedContentSections)
{var ccS=this.changedContentSections[ccI];if(cUrl==ccS.pseudoURL&&ccS.sent)
{return;}}
this.setContextFull();this.setDynamicContentMode();this.setTreeObjectMode();var startNodes=this.getStartNodes();var bAH=$iTXT.core.Browser.useragent.toLowerCase();if('explorer'==bAH)
{if($iTXT.core.Browser.is('Explorer',8,1))
{bAH='explorer8';}
else if($iTXT.core.Browser.is('Explorer'))
{bAH='explorer7';}}
else if('unknown user agent'==bAH)
{bAH='other';}
$iTXT.fire("$iTXT:metrics:evt",{n:"prepro"+bAH,t:'interval'});var timeoutName='timeout.light';if(this.contextFull)
{timeoutName='timeout.full';}
if($iTXT.core.Browser.is("Explorer",8,2))
{timeoutName+='.ie';}
this.params.set("timeout",this.params.get(timeoutName,1500),$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> Using timeout param "'+timeoutName+'": '+this.params.get('timeout')+'ms');if(!this.contextFull)
{this.params.set('excludenodes',this.params.get('excludenodes').concat('<img>'),$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);if(null==this.params.get('hooknodes',null))
{$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> Light content harvesting means we squish the skip nodes into the exclude nodes.');this.params.set('excludenodes',this.params.get('excludenodes').concat(this.params.get('skipnodes')),$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);this.params.set('skipnodes',[],$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);}
else
{$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> Light content harvesting but we have hook nodes so <b style="color: red;">NOT</b> squishing the skip nodes into the exclude nodes.');}}
else
{this.preprocessImages(this.params);}
this.preprocessExcludeNodes(this.params);$iTXT.fire("$iTXT:metrics:evt",{n:"prepro"+bAH});var oParams={};var sA=new $iTXT.data.Dom.SelectorAssessor();var pL=this.params.list(),params=[];for(var i=0,len=pL.length;i<len;i++)
{var pK=pL[i].toLowerCase();var pV=this.params.get(pK);if(null!=pV&&undefined!=pV)
{if($itxtUtil.isArray(pV)&&pV.length>0)
{var nodes=[],oths=[];if(pV[0].match(/:/))
{for(var j=0,lenj=pV.length;j<lenj;j++)
{var bits=pV[j].split(':');nodes[nodes.length]=bits[0];oths[oths.length]=bits[1]||1;}
pV=nodes;}
sA.add($iTXT.data.Dom.parseVMNode(pV),pK.replace(/s$/,''),oths);pV=null;}}
if(pK&&pV)
{oParams[pK]=pV;}}
if(sA.count()>0)
{this.params.set('assessor',sA);oParams.assessor=sA;if(oParams.metrics&$iTXT.debug.Util.ECH_ASSESS_DUMP_INPUT)
{if($iTXT.debug.Util.isLoggingOn())
{$iTXT.debug.debug($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> SelectorAssessor:<br /><span style="color:darkblue;">'+sA.summarise(true)+'</span><br />');}}}
if(this.dynamicContentMode)
{oParams.visscanwholepage=!!('*'==this.params.get('visibilitynodes',[])[0]);var visMethod='timer';if($iTXT.core.Browser.supportsFeature('dommutationevents'))
{visMethod='DOM mutation events';}
else if($iTXT.core.Browser.supportsFeature('propertychangeevent'))
{visMethod='onPropertyChange';}
$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:#ff6600;">Web 2.0:</b> Visibility checking will use the '+visMethod+' method.');}
if(!this.timings||!$itxtUtil.isObject(this.timings))
{this.timings={};}
this.timings.cStart=new Date().getTime();if(oParams.metrics&$iTXT.debug.Util.ECH_ASSESS_DUMP)
{if(!$iTXT.metrics.Context)
{oParams.metrics=0;}
else
{$iTXT.metrics.Context.nodeMetrics.reset();}}
var trees=[];$iTXT.fire("$iTXT:metrics:evt",{n:"getcon"+bAH,t:'interval'});this.params.set('oparams',oParams);for(var i=0,len=startNodes.length;i<len;i++)
{var tc=new Date().getTime();tc=tc-this.timings.cStart;if(tc>oParams.timeout)
{break;}
var sN=startNodes[i];var tree=new this.Node(sN,oParams);if(this.treeObjectMode)
{tree=tree.simplify();}
else
{tree=tree.serialise();if('{}'==tree)
{tree=null;}}
if(null!=tree)
{trees[trees.length]=tree;}}
this.tree=(this.treeObjectMode)?{x:trees}:'{x:['+trees.join(',')+']}';$iTXT.fire("$iTXT:metrics:evt",{n:"getcon"+bAH});var msgM='completed before timeout of '+oParams.timeout+'ms';if(this.timedOut||undefined!=this.timings.cEnd)
{msgM='reached timeout of '+oParams.timeout+'ms';this.timedOut=true;this.lastTimeOut=oParams.timeout;}
else
{this.timings.cEnd=new Date().getTime();}
if($iTXT.debug.Util.isLoggingOn())
{var sTree=(this.treeObjectMode)?$itxtUtil.serialiseJSON(this.tree,this.allowedFields):this.tree;var json=(oParams.metrics&$iTXT.debug.Util.ECH_XPAND_JSON)?$itxtUtil.formatJSONString(sTree,true):sTree;$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> '+((this.contextFull)?'FULL':'LIGHT')+' content harvesting '+msgM+' after '+(this.timings.cEnd-this.timings.cStart)+'ms, having processed '+$iTXT.data.Dom.nodeIds.length+' nodes and harvested '+this.harvestedCount+' nodes of which '+this.textNodes.length+' in '+($iTXT.data.Context.paragraphNodes.length)+' paragraphs are hookable.');$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> '+this.processedElementsCount+' <i>element</i> nodes were processed, which is '+this.getProcessedPercentage()+'% of the estimated total of '+this.eligibleElementsTotal+' eligible element nodes on the page.  (There were '+this.pageElementsTotal+' element nodes on the page in total.)');$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> This produces '+(sTree.length)+' bytes of JSON:<br /><span style="color:green;">'+json+'</span><br />');}
if(oParams.metrics&$iTXT.debug.Util.ECH_TEXTNODES_DUMP)
{var hnl=$iTXT.data.Context.textNodes.length;if(hnl>0)
{var dbNodes='<b style="color:blue;">ECH:</b> Hookable text nodes are:';for(var j=0;j<hnl;j++)
{var nV=$itxtUtil.cleanString($iTXT.data.Context.textNodes[j].nodeValue);dbNodes+='<br />'+j+': '+((nV.length>72)?nV.substr(0,70)+'...':nV)+' ('+nV.length+')';}
$iTXT.debug.debug($iTXT.debug.Category.CONTEXT,dbNodes);}}
if(oParams.metrics&$iTXT.debug.Util.ECH_EVENTS_TIME)
{$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> '+$iTXT.metrics.Context.nodeMetrics.getTotal()+' processable nodes took an average of '+$iTXT.metrics.Context.nodeMetrics.getMean(true)+'ms each to process with a minimum of '+$iTXT.metrics.Context.nodeMetrics.getMin()+'ms and a maximum of '+$iTXT.metrics.Context.nodeMetrics.getMax()+'ms.  The median was '+$iTXT.metrics.Context.nodeMetrics.getMedian()+'ms.');if(oParams.metrics&$iTXT.debug.Util.ECH_EVENTS_DUMP)
{$iTXT.debug.debug($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> $iTXT.metrics.Context.nodeMetrics.dumpEvents():<br />'+$iTXT.metrics.Context.nodeMetrics.dumpEvents());}}},getProcessedPercentage:function()
{if(this.processedElementsCount>0&&this.eligibleElementsTotal>0)
{return Math.round((this.processedElementsCount/this.eligibleElementsTotal)*100);}
else
{return-1;}},getPseudoURL:function(sId)
{var ccSec=this.changedContentSections[sId],pURL='';if(ccSec&&ccSec.pseudoURL)
{pURL=ccSec.pseudoURL;}
else
{var aURL=$iTXT.glob.params.get('refurl').split('\?',2);pURL=aURL[0]+'¤itxtSec'+sId;if(aURL[1])
{pURL+='?'+aURL[1];}
if(undefined==ccSec||null==ccSec)
{this.changedContentSections[sId]={sent:false};ccSec=this.changedContentSections[sId];}
ccSec.pseudoURL=pURL;}
return pURL;},getStartNodes:function()
{if(!this.timings||!$itxtUtil.isObject(this.timings))
{this.timings={};}
this.timings.snStart=new Date().getTime();var rA=[];if(this.contextFull)
{if($iTXT.data.Context.params&&$iTXT.data.Context.params.get('contentnodes'))
{var heads=document.getElementsByTagName('head');var cN=$iTXT.data.Dom.parseVMNode($iTXT.data.Context.params.get('contentnodes'));var tags={};for(var k=0,lenk=cN.length;k<lenk;k++)
{if(cN[k].tag)
{tags[cN[k].tag]=true;}}
for(var j=0,lenj=heads.length;j<lenj;j++)
{for(var tag in tags)
{var tA=heads[j].getElementsByTagName(tag);for(var l=0,lenl=tA.length;l<lenl;l++)
{rA[rA.length]=tA[l];}}}
if(rA.length>0)
{$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> Found '+rA.length+' potential start node(s) in the head.');}}}
else
{$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> Light contextualisation, not looking in the head.');}
var detectedVersion=this.determineCompatMode();var overrideVersion=this.params.get('compatmode');$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> Detected compatibility mode is "'+detectedVersion+'".'+((overrideVersion)?' Override compatibility mode is "'+overrideVersion+'"':''));var cM=this.params.get('compatmode',detectedVersion);var nA=document.getElementsByTagName('*');this.pageElementsTotal=nA.length;if("v1"==cM)
{for(var n=0,lenn=nA.length;n<lenn;n++)
{var nd=nA[n];if(($iTXT.core.Util.isString(nd.id)&&'intellitxt'==nd.id.toLowerCase())||(nd.getAttribute('name')&&'intellitxt'==nd.getAttribute('name').toLowerCase()))
{if(this.params.get('metrics',0)&$iTXT.debug.Util.ECH_TEXTNODES_DUMP)
{$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> <b style="color:green">FOUND</b> "v1" node <span style="color: green">&lt;'+nd.tagName.toLowerCase()+'&gt;'+((nd.id)?'#'+nd.id:'')+((nd.className)?'.'+nd.className:'')+'</span>');}
rA[rA.length]=nd;}}
$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> Found '+rA.length+' definite "v1" start node(s) in the body.');this.params.set("mintextlength",0);this.params.set("compatmode","v1");var hN=this.params.get("hooknodes",null)
{if(hN&&$itxtUtil.isArray(hN))
{hN[hN.length]='intellitxt';hN[hN.length]='!intellitxt';}
this.params.set("hooknodes",hN);}}
else
{this.params.set("compatmode","v2");var bN=document.getElementsByTagName('body');$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> Found '+bN.length+' definite "v2" start node(s) in the body.');for(var o=0,leno=bN.length;o<leno;o++)
{var nd=bN[o];if(this.params.get('metrics',0)&$iTXT.debug.Util.ECH_TEXTNODES_DUMP)
{$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> <b style="color:green">FOUND</b> "v2" node <span style="color: green">&lt;'+nd.tagName.toLowerCase()+'&gt;'+((nd.id)?'#'+nd.id:'')+((nd.className)?'.'+nd.className:'')+'</span>');}
rA[rA.length]=nd;}}
this.timings.snEnd=new Date().getTime();$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> "'+this.params.get("compatmode")+'" compatibility found '+rA.length+' start node(s) in '+(this.timings.snEnd-this.timings.snStart)+'ms');return rA;},loadAssessment:function(n)
{if(!n||!n.itxtNodeId||!this.nodeAssessments[n.itxtNodeId])
{return null;}
return this.nodeAssessments[n.itxtNodeId];},modifyTree:function()
{_iter=function(s,tA)
{var spliced=[];for(var tI=0,tL=tA.length;tI<tL;tI++)
{var tC=tA[tI];if(tC.newTree)
{var nId=tC.nodeId;var k=tC.fieldName;var v=tC.fieldValue;var t=tC.newTree;if(s[k]&&v==s[k])
{for(var f in s)
{delete s[f];}
for(var m in t)
{s[m]=t[m];}
if(nId)
{$iTXT.data.Dom.nodeIds[nId]=s;}
spliced.push(nId);tA[tI]={};}}}
if(1==s.p)
{var currL=pNodes.length;if(currL>0)
{var lastM=currL-1
var lastP=pNodes[lastM];if(!lastP||0==lastP.length)
{currL=lastM;}}
pNodes[currL]=[];}
if(s.n)
{var n=$iTXT.data.Context.textNodes[s.n-1];tNodes[tNodes.length]=n;s.n=tNodes.length;var currPara=pNodes.length-1;if(currPara>=0)
{pNodes[currPara].push(n);}}
if(s.x&&s.x.length&&s.x.length>0)
{for(var i=0,l=s.x.length;i<l;i++)
{var rIds=_iter(s.x[i],tA);if(rIds.length>0)
{spliced=spliced.concat(rIds);}}}
return spliced;};var dS=[];if(this.modifiedTrees.length)
{var pNodes=[],tNodes=[];dS=_iter(this.tree,this.modifiedTrees);if(dS.length>0)
{this.paragraphNodes=pNodes;this.textNodes=tNodes;}
this.modifiedTrees=[];}
return dS;},onContentStateChange:function(n)
{var nId=$iTXT.data.Dom.setNodeId(n);var cN=$iTXT.data.Dom.nodeIds[nId];var vSec=cN.v;if(!$itxtUtil.isObject(cN))
{return;}
var oParams=this.params.get('oparams');this.timings.cStart=new Date().getTime();this.harvestCount++;this.modifiedTrees[this.modifiedTrees.length]={nodeId:nId,fieldName:'v',fieldValue:cN.v,newTree:new this.Node(n,oParams).simplify()};this.timings.cEnd=new Date().getTime();var doneFlag=this.changedContentSections[vSec].sent||false;var vState=$iTXT.data.Dom.isVisible(n);$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<span style="color:#ff6600;"><b>Web 2.0:</b> REACT </span> '+$iTXT.data.Dom.getElementSignature(n,true)+' is now '+((vState)?'':'in')+'visible (section '+vSec+').');if(vState&&!doneFlag)
{$iTXT.glob.params.set('refurl',this.getPseudoURL(vSec),100);$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<span style="color:#ff6600;"><b>Web 2.0:</b> </span> Using sectional URL "'+$iTXT.glob.params.get('refurl')+'" for section '+vSec+'.');var spliced=this.modifyTree();if($iTXT.debug.Util.isLoggingOn())
{var sTree=$itxtUtil.serialiseJSON(this.tree,this.allowedFields);var json=(oParams.metrics&$iTXT.debug.Util.ECH_XPAND_JSON)?$itxtUtil.formatJSONString(sTree,true):sTree;$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:#ff6600;">ECH:</b>  '+((this.contextFull)?'FULL':'LIGHT')+' <i>sectional</i> content harvesting completed after '+(this.timings.cEnd-this.timings.cStart)+'ms.  '+this.textNodes.length+' nodes in '+(this.paragraphNodes.length)+' paragraphs are now hookable.');$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:#ff6600;">ECH:</b> This produces '+(sTree.length)+' bytes of JSON:<br /><span style="color:green;">'+json+'</span><br />');}
if(oParams.metrics&$iTXT.debug.Util.ECH_TEXTNODES_DUMP)
{var hnl=$iTXT.data.Context.textNodes.length;if(hnl>0)
{var dbNodes='<b style="color:#ff6600;">ECH:</b> Hookable text nodes are:';for(var j=0;j<hnl;j++)
{var nV=$itxtUtil.cleanString($iTXT.data.Context.textNodes[j].nodeValue);dbNodes+='<br />'+j+': '+'('+nV.length+') '+((nV.length>73)?nV.substr(0,70)+'...':nV);}
$iTXT.debug.debug($iTXT.debug.Category.CONTEXT,dbNodes);}}
$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<span style="color:#ff6600;"><b>Web 2.0:</b> </span> Resubmitting sectional URL "'+$iTXT.glob.params.get('refurl')+'" for section '+vSec+'.');this.changedContentSections[vSec].sent=true;var tmpDispArr=[];$iTXT.subscribe("$iTXT:tmpl:load",$iTXT.core.Event.bind($iTXT.itxt.currentController,$iTXT.itxt.currentController.templatesLoad),tmpDispArr);$iTXT.itxt.currentController.templateLoadUnSubFunc=tmpDispArr.pop();$iTXT.itxt.currentController.initialiserLoaded=false;$iTXT.itxt.currentController.skipClientParams=true;$iTXT.itxt.currentController.dropInitialiser();}},preprocessExcludeNodes:function(params)
{var fS=new Date().getTime();var eN=params.get('excludenodes',null),badC=0;if(eN&&eN.length)
{var i=eN.length,keep=[];while(i--)
{var tN=eN[i];if('<'==tN.substring(0,1)&&'>'==tN.slice(-1))
{tN=tN.slice(1,-1).toLowerCase();var tags=document.getElementsByTagName('body')[0].getElementsByTagName(tN);var j=tags.length;while(j--)
{var n=tags[j];try
{n.itxtBad=this.BAD_EXCL;badC++;}
catch(x)
{$iTXT.debug.error($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> Could not mark node ('+n+') as bad due to error "'+x.message+'".');}}}
else
{keep[keep.length]=tN;}}
params.set('excludenodes',keep);}
this.eligibleElementsTotal=this.pageElementsTotal-badC;var fE=new Date().getTime();var fD=(fE-fS);$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> Pre-processed '+badC+' excludenodes in '+fD+'ms.');},preprocessImages:function(params)
{var fS=new Date().getTime();var fE=null;var minimagew=params.get('minimagew',300);var minimageh=params.get('minimageh',300);var imgs=document.getElementsByTagName('img');var len=imgs.length,badC=0;var i=len;var timeout=params.get('timeout.image',params.get('timeout',1500));while(i--)
{var n=imgs[i],bad=false;var imgW=n.width;var imgH=n.height;var imgD="-"+imgW+"x"+imgH;if(minimagew>=0&&minimageh>=0&&(imgW<minimagew||imgH<minimageh))
{bad=this.BAD_SML_IMG;}
else if("-120x600"==imgD||"-160x600"==imgD||"-300x250"==imgD||"-180x150"==imgD||"-728x90"==imgD)
{bad=this.BAD_IAB_IMG;}
if(bad)
{try
{n.itxtBad=bad;badC++;}
catch(x)
{$iTXT.debug.error($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> Could not mark node ('+n+') as bad due to error "'+x.message+'".');}}
fE=new Date().getTime();var fD=(fE-fS);if(fD>timeout)
{break;}}
var proc=len-i-1;var msg=(fD>timeout)?"reached":"completed before";$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> Image pre-processing '+msg+' timeout of '+timeout+'ms after '+fD+'ms, having processed '+proc+' of '+len+' images. '+badC+' were marked as bad.');},saveAssessment:function(n,a)
{if(n.nodeType&&n.nodeType==$itxtUtil.ELEMENT_NODE)
{var id=$iTXT.data.Dom.setNodeId(n);$iTXT.data.Context.nodeAssessments[id]=a;}},setContextFull:function()
{var sV=true;var pV=$iTXT.glob.params.get('force.context',-1);if(!$iTXT.js.requiresContextualization)
{sV=false;}
if(pV>=0)
{sV=!!(pV>0);}
this.contextFull=sV;$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> Content harvesting will be <b style="color:blue;">'+((this.contextFull)?'FULL':'LIGHT')+'</b>: requiresContextualization flag is '+$iTXT.js.requiresContextualization+' (0 = LIGHT, 1 = FULL); force.context debug param is '+pV+' (-1 = not set, 0 = LIGHT, 1 = FULL).');},setDynamicContentMode:function()
{var vN=this.params.get('visibilitynodes',[]);this.dynamicContentMode=!!(vN.length>0);},setTreeObjectMode:function()
{var pV=$iTXT.glob.params.get('context.tree.object',0);this.treeObjectMode=!!(this.dynamicContentMode||pV>0);$iTXT.debug.info($iTXT.debug.Category.CONTEXT,'<b style="color:blue;">ECH:</b> Harvested nodes will be represented as '+((this.treeObjectMode)?'an object':'a serialised string')+': context.tree.object param is '+pV+' (0 = serialise, 1 = object)'+((this.dynamicContentMode)?'; dynamic content mode is on':'')+'.');}};}
$iTXT.js.loader["$iTXT.data.Country"]=true;$iTXT.data.Country_Load=function(){var undefined;$iTXT.data.Country={langs:{de:"de",at:"de",ch:"de",fr:"fr",gb:"en-gb",uk:"en-gb",it:"it",nl:"nl",se:"sv",no:"no",dk:"da",jp:"ja",cn:"zh",es:"es",fi:"fi",pl:"pl",ru:"ru",pt:"pt"},translations:{en:{sCC:"$",sspl:"Advertisement",swti:"What's this?",slm:"LEARN MORE",ssch:"Searching...",sbn:"Buy now",scls:"Close",sEet:"End time",sEcb:"Place bid",sEsn:"Seller",ierao:"Related Articles on ",iera:"Related Articles",wcfa:"Featured article",iist:"Shop for items related to ",iirt:"Search the web for info related to ",iimsnt:"Live Search for ",iivt:"Show video related to ",iiat:"Information related to ",gRCSrcTSt:"Search this site:",gRCSrc:"Search",gRCMor:"MORE",gROTE:"Roll over to expand",gCTLM:"Click to learn more","TRANS.PRECS":"${SCC}","TRANS.POSTCS":"","TRANS.PRICE":"Price","TRANS.DECIMALPLACE":".","TRANS.SEARCH":"Search","trans.moreres":'More Results'},"en-gb":{sCC:"&pound;"},fr:{sCC:"&euro;",sspl:"Publicit&#233;",swti:"Qu'est-ce que c'est?",sbn:"Achat maintenant",scls:"Fermer",sEet:"Temps restant",sEcb:"Ench&#233;rir",sEsn:"Vendeur",ierao:"Articles connexes sur ",iera:"Articles connexes",wcfa:"Article phare",iist:"Boutique pour les produits apparent&#233;s &#224; ",iirt:"Rechercher sur le web une info apparent&#233;e &#224; ",iivt:"Visualiser les vid&#233;os apparent&#233;es &#224; ",iiat:"Information apparent&#233;e &#224; ",gRCSrcTSt:"Rechercher sur le site:",gRCSrc:"Rechercher",gRCMor:"PLUS",gROTE:"Agrandir la vid\u00E9o",gCTLM:"En savoir plus","TRANS.DECIMALPLACE":",","TRANS.SEARCH":"Rechercher"},de:{sCC:"&euro;",sspl:"Werbung",swti:"was ist das?",sbn:"Jetzt kaufen",scls:"Schlie&#223;en",sEet:"Angebotsende",sEcb:"Bieten",sEsn:"Verk&#228;ufer",ierao:"Themenverwandte Artikel ",iera:"Themenverwandte Artikel",wcfa:"Artikelhighlight",iist:"Finden Sie weitere Produkte zum Thema ",iirt:"Finden Sie weitere Informationen zum Thema ",iivt:"Videos zum Thema ",iiat:"Weitere Informationen zum Thema ",gRCSrcTSt:"Suche auf:",gRCSrc:"Suchen",gRCMor:"MEHR INFO",mlm:true,gROTE:"Hier Vergr\u00F6ssern",gCTLM:"Mehr Info",TR_PRICE:"Aktuell","TRANS.DECIMALPLACE":",","TRANS.SEARCH":"Suchen"},es:{sCC:"&euro;",sspl:"Publicidad",swti:"&#191; Qu&#233; es esto?",scls:"cierre",ierao:"Otros art&#237;culos sobre ",iera:"Otros art&#237;culos",wcfa:"Art&#237;culo principal",iist:"Compra art&#237;culos relacionados con ",iirt:"B&#250;squeda para informaci&#243;n relacionado con ",iivt:"Mostrar video relacionado con ",iiat:"Informaci&#243;n relacionado con ",gRCSrcTSt:"B&#250;squeda del sitio:",gRCSrc:"Buscar",gRCMor:"M&#193;S",gROTE:"Pasar por encima",gCTLM:"Haz clic aqu\u00ED","TRANS.DECIMALPLACE":",","TRANS.SEARCH":"Buscar"},it:{sCC:"&euro;",sspl:"Pubblicit&#224;",swti:"Che cos'&#232;?",sbn:"Compra ora",scls:"Chiudi",sEet:"Ora di scadenza",sEcb:"Fai un'offerta",sEsn:"Venditore",ierao:"Altri articoli su ",iera:"Altri articoli",wcfa:"In primo piano",iist:"Acquista prodotti in relazione a ",iirt:"Cerca nel web informazioni su ",iivt:"Mostra video su ",iiat:"Informazioni su ",gRCSrcTSt:"Cerca nel sito:",gRCSrc:"Cerca",gRCMor:"VAI",gROTE:"Passa il cursore qui sopra",gCTLM:"Clicca qui","TRANS.DECIMALPLACE":",","TRANS.SEARCH":"Cerca"},nl:{sCC:"&euro;",sspl:"Advertentie",swti:"Wat is dit?",scls:"Sluiten",sEet:"End time",iist:"Shop voor een item in verband met ",iirt:"Zoek op het net voor informatie in verband met ",iivt:"Laat een video zien in verband met ",iiat:"Informatie in verband met ",gRCSrcTSt:"Zoeken op deze site:",gRCSrc:"Zoeken",gRCMor:"MEER",gROTE:"Wijs aan en vergroot",gCTLM:"Klik voor meer info","TRANS.DECIMALPLACE":",","TRANS.SEARCH":"Zoeken"},sv:{sCC:"kr ",sspl:"Annons",swti:"Vad &#228;r detta?",sbn:"K&#246;pa nu",scls:"St&#228;nga",sEet:"Sluttid",sEcb:"L&#228;gg bud",sEsn:"s&#228;ljare",iist:"Handla varor relaterade till ",iirt:"S&#246;k p&#229; webben f&#246;r info relaterad till ",iivt:"Spela upp video relaterad till ",iiat:"Information relaterad till ",gRCSrcTSt:"S&#246;k p&#229; sidan:",gRCSrc:"S&#246;k",gRCMor:"MER",gROTE:"F\u00F6rstora med musen",gCTLM:"Klicka f\u00F6r mer info","TRANS.SEARCH":"S&#246;k"},no:{sCC:"kr ",sspl:"Annonse",swti:"Hva er dette?",sbn:"Kj\u00D8p n\u00E5",scls:"Lukk vindu",sEet:"Sluttdato",sEcb:"Legg inn bud",sEsn:"Selger",iist:"Shop etter relaterte produkter ",iirt:"S&#248;k p&#229; nettet for mer informasjon av ",iivt:"Se video p&#229; ",iiat:"Informasjon relatert til ",gRCSrcTSt:"S&#248;k p&#229; siden:",gRCSrc:"S&#248;ke",gRCMor:"MER",gROTE:"Mus over og utvid",gCTLM:"Klikk for \u00E5 se mer","TRANS.SEARCH":"S&#248;ke"},da:{sCC:"kr ",sspl:"Annonce",swti:"Hvad er dette?",sbn:"K\u00D8b nu",scls:"Luk vindue",sEet:"Slut",sEcb:"Byd",sEsn:"S\u00E6lger",iist:"Shop for ting relateret til ",iirt:"S&#248;g p&#229; nettet for ting relateret til ",iivt:"Vis video relateret til ",iiat:"Information relateret til ",gRCSrcTSt:"S&#248;g p&#229; siden:",gRCSrc:"S&#248;gning",gRCMor:"MERE",gROTE:"Rul over for st\u00F8rre",gCTLM:"Klik for mere viden","TRANS.SEARCH":"S&#248;gning"},fi:{sCC:"&euro;",sspl:"Mainos",swti:"Mik&#228; t&#228;m&#228; on?",ssch:"Etsim&#228;ss&#228;...",scls:"Sulje",gROTE:"Kohdista suurentaaksesi",gCTLM:"Klikkaa lis\u00E4tietoja"},ru:{sCC:"\u0440\u0443\u0431",sspl:"\u0420\u0435\u043A\u043B\u0430\u043C\u0430",swti:"\u0447\u0442\u043E \u044D\u0442\u043E?",slm:"\u0423\u0437\u043D\u0430\u0442\u044C \u043F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435",ssch:"\u041F\u043E\u0438\u0441\u043A...",sbn:"\u041A\u0443\u043F\u0438\u0442\u044C \u0421\u0435\u0439\u0447\u0430\u0441",scls:"\u0437\u0430\u043A\u0440\u044B\u0442\u044C (\u043E\u043A\u043D)",sEet:"\u0414\u043E \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u044F",sEcb:"\u0421\u0434\u0435\u043B\u0430\u0442\u044C \u0441\u0442\u0430\u0432\u043A\u0443",sEsn:"\u041F\u0440\u043E\u0434\u0430\u0432\u0435\u0446",ierao:"\u041F\u043E\u0445\u043E\u0436\u0438\u0435 \u0441\u0442\u0430\u0442\u044C\u0438 ",iera:"\u041F\u043E\u0445\u043E\u0436\u0438\u0435 \u0441\u0442\u0430\u0442\u044C\u0438 ",wcfa:"\u041F\u043E\u0434\u043E\u0431\u0440\u0430\u043D\u043D\u0430\u044F \u0421\u0442\u0430\u0442\u044C\u044F",iist:"\u041A\u0443\u043F\u0438\u0442\u044C \u0442\u043E\u0432\u0430\u0440 \u0441\u0445\u043E\u0436\u0438\u0439 \u0441 ",iirt:"\u041F\u043E\u0438\u0441\u043A \u0432 \u0441\u0435\u0442\u0438 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438 \u043F\u043E ",iivt:"\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0438\u0434\u0435\u043E \u0441\u0445\u043E\u0436\u0435\u0435 \u0441 ",iiat:"\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E\u0442\u043D\u043E\u0441\u044F\u0449\u0430\u044F\u0441\u044F \u043A ",gRCSrcTSt:"\u041F\u043E\u0438\u043A \u043F\u043E \u0441\u0430\u0439\u0442\u0443:",gRCSrc:"\u041F\u043E\u0438\u0441\u043A",gRCMor:"\u0414\u0410\u041B\u0415\u0415",gROTE:"&#1053;&#1072;&#1074;&#1077;&#1076;&#1080;&#32;&#1080;&#32;&#1091;&#1074;&#1077;&#1083;&#1080;&#1095;&#1100;",gCTLM:"&#1055;&#1086;&#1076;&#1088;&#1086;&#1073;&#1085;&#1086;","TRANS.SEARCH":"\u041F\u043E\u0438\u0441\u043A"},pl:{sCC:"z\u0142",sspl:"Reklama",swti:"Co to jest?",slm:"DOWIEDZ SI\u0118 WI\u0118CEJ",ssch:"Trwa przeszukiwanie",sbn:"Kup teraz",scls:"Zamknij",sEet:"Koniec",sEcb:"Z\u0142\u00f3\u017c Ofert\u0119",sEsn:"Sprzedawca",iist:"Kupuj powi\u0105zane przedmioty ",iirt:"Szukaj w Internecie Informacji na podobny temat ",iivt:"Poka\u017c Video na podobny temat ",iiat:"Informacja na podobny temat ",gRCSrcTSt:"Szukaj na tej Stronie:",gRCSrc:"Szukaj",gRCMor:"Wi\u0119cej","TRANS.SEARCH":"Szukaj"},ja:{sCC:"&yen;",sspl:"\u30b9\u30dd\u30f3\u30b5\u30fc\u30ea\u30f3\u30af",swti:"\u3053\u306e\u5e83\u544a\u306b\u3064\u3044\u3066",sbn:"\u4eca\u8cb7\u7269",scls:"\u9589\u3058\u308b"},zh:{sCC:"&yen;",sspl:"\u5e7f\u544a",swti:"\u8fd9\u662f\u4ec0\u4e48\u5e7f\u544a",sbn:"\u4eca\u8cb7\u7269",scls:"\u5173\u5e7f\u544a"},pt:{gROTE:"Clique para aumentar",gCTLM:"Clique para mais info"}},country:"en",tr:function(name,cc)
{cc=cc||this.country;var lang=this.langs[cc]||"en";return this.translations[lang][name]||this.translations["en"][name]||"";},init:function(l)
{this.country=l;for(var prop in this.translations.en)
{window[prop]=this.tr(prop);$iTXT.glob.dbParams.set(prop,this.tr(prop),$iTXT.cnst.WEIGHTING_DEFAULT_TRANSLATION);}
$iTXT.glob.translationSet={};$iTXT.glob.translationSet.isMLM=(""==this.tr("mlm"))?false:this.tr("mlm");$iTXT.glob.dbParams.set("trans.lang",this.langs[this.country]||"en",$iTXT.cnst.WEIGHTING_DEFAULT_TRANSLATION);}};}
$iTXT.js.loader["$iTXT.data.Dom"]=true;$iTXT.data.Dom_Load=function(){var undefined;var $itxtUtil=$iTXT.core.Util;$iTXT.data.Dom={nodeIds:[],Selector:$iTXT.core.Class.create({init:function(tag,id,className,attrs)
{if(null!=tag&&'string'==typeof tag&&""!=tag)
{this.tag=tag.toLowerCase();}
if(null!=id&&'string'==typeof id&&""!=id)
{this.id=id.toLowerCase();}
if(null!=className&&'string'==typeof className&&""!=className)
{this.className=className.toLowerCase();}
if(null!=attrs&&$itxtUtil.isObject(attrs)&&$itxtUtil.objCount(attrs)>0)
{this.attrs={};for(var attr in attrs)
{try
{var tAttr=attrs[attr].toLowerCase();if('string'==typeof tAttr||!isNaN(tAttr))
{this.attrs[attr.toLowerCase()]=tAttr;}}catch(e){}}}}}),SelectorAssessor:$iTXT.core.Class.create({_othHash:{},_tagHash:{},_idHash:{},_classHash:{},_attrHash:{},_intHash:{},_selHash:{},_count:0,_addToHash:function(h,i,k,v)
{var xI={};if(undefined!=h[i])
{xI=h[i];}
var xV=[];if(undefined!=xI[k])
{xV=xI[k];}
if(!$itxtUtil.isArray(xV)||$itxtUtil.inArray(xV,v))
{return;}
xV[xV.length]=v;xI[k]=xV;if(k.match&&k.match(/\*/))
{xI.wild=true;}
h[i]=xI;},_extract:function(rO,i,h,s,f)
{if($itxtUtil.isObject(rO)&&$itxtUtil.isObject(i)&&$itxtUtil.isObject(h)&&$itxtUtil.isClass(s)&&'string'==typeof f&&undefined!=s[f])
{var sz=$itxtUtil.flattenJSON(s);for(var int in i)
{var thisI=i[int],thisH=h[int];if(thisI&&'function'!=typeof thisI)
{if(thisH&&$itxtUtil.isObject(thisH))
{var tO=thisH;var comps=[];var sF=s[f];if($itxtUtil.isObject(sF))
{for(var oK in sF)
{if('function'!=typeof sF[oK])
{comps.push=sF[oK];}}}
else
{comps[comps.length]=sF;}
var cands=[];var j=comps.length;while(j--)
{var comp=comps[j];if(tO[comp])
{cands=cands.concat(tO[comp]);}
else if(tO.wild)
{for(var o in tO)
{if($itxtUtil.isArray(tO[o]))
{cands=cands.concat(tO[o]);}}}}
if(cands.length>0&&$iTXT.data.Dom.findSelector(s,cands,1))
{var kN='is'+int.substr(0,1).toUpperCase()+int.substr(1);rO[kN]=true;if(this._othHash[int]&&this._othHash[int][sz]&&$itxtUtil.isArray(this._othHash[int][sz]))
{rO[int]=this._othHash[int][sz][0];}
delete i[int];}}}}}
return rO;},add:function(sel,int,oth)
{if((!$itxtUtil.isClass(sel)&&!$itxtUtil.isArray(sel))||'string'!=typeof int)
{return;}
var sA=[];var oA=[];if(!$itxtUtil.isArray(sel))
{sA[0]=sel;}
else
{sA=sel;}
if(!$itxtUtil.isArray(oth))
{oA[0]=oth;}
else
{oA=oth;}
if(!$itxtUtil.isClass(sA[0]))
{return;}
var i=sA.length;while(i--)
{sel=sA[i];oth=oA[i];if(undefined==sel.tag&&undefined==sel.id&&undefined==sel.className&&undefined==sel.attrs)
{continue;}
var s=$itxtUtil.flattenJSON(sel);this._intHash[int]=true;this._addToHash(this._selHash,int,s,sel);if(undefined!=sel.tag)
{this._addToHash(this._tagHash,int,sel.tag,sel);}
if(undefined!=sel.id)
{this._addToHash(this._idHash,int,sel.id,sel);}
if(undefined!=sel.className)
{this._addToHash(this._classHash,int,sel.className,sel);}
if($itxtUtil.isObject(sel.attrs))
{for(var aN in sel.attrs)
{if('function'!=typeof sel.attrs[aN])
{this._addToHash(this._attrHash,int,aN,sel);}}}
if(undefined!=oth)
{this._addToHash(this._othHash,int,s,oth);}
this._count++;}},assess:function(sel,spInt)
{if(!sel instanceof $iTXT.data.Dom.Selector)
{return{};}
var intHash={};if(spInt&&'string'==typeof spInt)
{intHash[spInt]=true;}
else
{for(var k in this._intHash)
{if('function'!=typeof this._intHash)
{intHash[k]=this._intHash[k];}}}
var rO={};for(var int in intHash)
{if('function'!=typeof int)
{rO['has'+int.substr(0,1).toUpperCase()+int.substr(1)+'s']=true;rO['is'+int.substr(0,1).toUpperCase()+int.substr(1)]=false;}}
rO=this._extract(rO,intHash,this._tagHash,sel,'tag');rO=this._extract(rO,intHash,this._idHash,sel,'id');rO=this._extract(rO,intHash,this._classHash,sel,'className');rO=this._extract(rO,intHash,this._attrHash,sel,'attrs');return rO;},count:function()
{return this._count;},summarise:function(html)
{try
{var op=(html)?'&lt;':'<';var cl=(html)?'&gt;':'>';var nl=(html)?'<br />':'\n';var out=[];for(var int in this._intHash)
{if('function'!=typeof this._intHash[int])
{var mems=[];if(undefined!=this._selHash[int])
{for(var s in this._selHash[int])
{if('{'==s.substr(0,1))
{var sels=this._selHash[int][s];var i=sels.length;while(i--)
{var sel=sels[i];var mem='';if(sel.tag)
{mem+=op+sel.tag+cl;}
else
{}
if(sel.id)
{mem+='#'+sel.id;}
if(sel.className)
{mem+='.'+sel.className;}
if(sel.attrs)
{for(var a in sel.attrs)
{if('function'!=typeof sel.attrs[a])
{mem+='@'+a;if('*'!=sel.attrs[a])
{mem+='='+sel.attrs[a];}}}}
if(this._othHash[int]&&this._othHash[int][s])
{mem+=':'+this._othHash[int][s][0];}
mems[mems.length]=mem;}}}}
mems=mems.join(',');out[out.length]=int+': '+mems;}}
return out.join(nl);}
catch(x)
{return x.message;}},init:function()
{}}),getElementsByClassName:function(c,n)
{if(!n&&null!=document)
{n=document;}
if(n)
{if(n.getElementsByClassName&&'function'==typeof n.getElementsByClassName)
{return n.getElementsByClassName(c);}
else
{var rN=[];var rX=new RegExp('\\b'+c+'\\b');var aN=n.getElementsByTagName('*');for(var i=0,len=aN.length;i<len;i++)
{if(rX.test(aN[i].className))
{rN[rN.length]=aN[i];}}
return rN;}}},parseSelector:function(selector,vmmode)
{var tag='',separator='',identifier='',value='',out=null;var PATTERN1=(vmmode)?/(\>\@|\>|\!|\@)/:/(\#|\.)/;var PATTERN2=/\=/;var priMatch=selector.match(PATTERN1);if(priMatch)
{separator=priMatch[0];var bits=selector.split(separator,2);if(vmmode)
{separator=separator.replace(/\>\@/,'@').replace(/\>/,'#').replace(/\!/,'.')}
tag=bits[0];identifier=bits[1];if(vmmode&&identifier.match(PATTERN2))
{var vsep=identifier.match(PATTERN2)[0];var vbits=identifier.split(vsep,2);identifier=vbits[0];value=vbits[1];}}
else
{tag=selector;}
if(vmmode)
{var id=null,className=null,attr=null,val=null;if(selector==tag)
{separator='#';identifier=selector;tag='';}
if(''!=tag)
{tag=tag.toLowerCase().replace(/\<|\>/,'')}
if(''!=identifier)
{switch(separator)
{case"#":id=identifier;break;case".":className=identifier;break;case"@":attr=identifier;if(''!=value)
{val=value;}
else
{val='*';}
break;}}
var attrO={};if(attr)
{attrO[attr]=val;}
out=new $iTXT.data.Dom.Selector(tag,id,className,attrO);}
else
{out=[tag.toLowerCase(),separator,identifier];}
return out;},findSelector:function(needle,haystack,precision)
{_checkField=function(n,h,p,d)
{if(undefined==n&&undefined==h)
{return(p>=0)?true:false;}
else if(undefined!=n&&undefined==h)
{return(p>=0)?true:false;}
else if(undefined==n&&undefined!=h)
{return(p==0)?true:false;}
else if($itxtUtil.isObject(n))
{var res=false;for(var a in n)
{if('function'!=typeof n[a])
{var aRes=_checkField(n[a],h[a],p,'attr['+a+']');res=aRes;if((aRes&&p<0)||(!aRes&&p>=0))
{break;}}}
return res;}
else
{return $itxtUtil.fuzzyMatch(h,n);}};if(!precision||isNaN(precision))
{precision=0;}
var nA=[];if(!$itxtUtil.isArray(needle))
{nA[nA.length]=needle;}
else
{nA=needle;}
var hA=[];if(!$itxtUtil.isArray(haystack))
{hA[hA.length]=haystack;}
else
{hA=haystack;}
var i=nA.length;while(i--)
{var j=hA.length;while(j--)
{var ret=false;var tN=nA[i];var tH=hA[j];if(precision<0)
{ret=(_checkField(tN.tag,tH.tag,precision,'tag')||_checkField(tN.id,tH.id,precision,'id')||_checkField(tN.className,tH.className,precision,'class')||_checkField(tN.attrs,tH.attrs,precision,'attrs'));}
else
{ret=(_checkField(tN.tag,tH.tag,precision,'tag')&&_checkField(tN.id,tH.id,precision,'id')&&_checkField(tN.className,tH.className,precision,'class')&&_checkField(tN.attrs,tH.attrs,precision,'attrs'));}
if(ret)
{return ret;}}}
return false;},extractAttrs:function(elem,constraint)
{var out={};if(elem&&elem.nodeType&&$itxtUtil.ELEMENT_NODE==elem.nodeType&&elem.attributes)
{if(constraint&&$itxtUtil.isObject(constraint))
{for(var cName in constraint)
{if('function'!=typeof constraint[cName])
{var cValue=elem.getAttribute(cName);if(cValue)
{out[cName]=cValue;}}}}
else
{var i=elem.attributes.length;while(i--)
{var attr=elem.attributes[i];if("id"!=attr.nodeName&&"class"!=attr.nodeName)
{out[attr.nodeName]=attr.nodeValue;}}}}
return out;},parseVMNode:function(inp)
{var outA=[];if(null!=inp)
{if(!$itxtUtil.isArray(inp))
{inp=[inp];}
var i=inp.length;while(i--)
{var sel=this.parseSelector(inp[i],true);if(sel instanceof $iTXT.data.Dom.Selector)
{outA[outA.length]=sel;}}}
if(outA.length==1)
{return outA[0];}
else
{return outA;}},parseElement:function(inp,attrC)
{var inA=[],outA=[];if(inp&&inp.nodeType&&$itxtUtil.ELEMENT_NODE==inp.nodeType)
{inA[inA.length]=inp;}
else if(undefined==inp)
{return null;}
else
{inA=inp;}
if(attrC&&'string'==typeof attrC)
{attrC=attrC.split(",");}
var i=inA.length;while(i--)
{var elem=inA[i];if(elem&&elem.nodeType&&$itxtUtil.ELEMENT_NODE==elem.nodeType)
{if(outA.length==0)
{var attrO=null;if(attrC&&attrC.length>0)
{attrO={};for(var j=0,lenj=attrC.length;j<lenj;j++)
{attrO[attrC[j]]=true;}
attrO=this.extractAttrs(elem,attrO);}
outA[outA.length]=new $iTXT.data.Dom.Selector(elem.tagName.toLowerCase(),elem.id,elem.className,attrO);}}}
if(outA.length==1)
{return outA[0];}
else
{return outA;}},getElementSignature:function(n,e)
{if(n&&n.tagName)
{return((e)?'&lt;':'<')+n.tagName.toLowerCase()+((e)?'&gt;':'>')+((n.id)?'#':'')+n.id+((n.className)?'.':'')+n.className;}
else
{return'';}},getInnerTextLength:function(n)
{var v=0;var badTags={'a':true,'applet':true,'embed':true,'form':true,'iframe':true,'img':true,'noscript':true,'object':true,'script':true,'style':true,'xml':true};if(!n||!n.tagName||badTags[n.tagName.toLowerCase()])
{return v;}
var t='',children=n.childNodes;var i=children.length;while(i--)
{var c=children[i];if($itxtUtil.TEXT_NODE==c.nodeType)
{t+=' '+c.nodeValue;}}
return $itxtUtil.cleanString(t).length;},getElementByTagName:function(tag,index)
{index=index||0;var ts=document.getElementsByTagName(tag);if(ts.length>index)
{return ts[index];}
return null;},getElementByClassName:function(className,index)
{index=index||0;var ts=$iTXT.data.Dom.getElementsByClassName(className);if(ts.length>index)
{return ts[index];}
return null;},getNodeByTagClassOrId:function(p,i)
{p=$itxtUtil.getTagName(p);var tag=this.getElementByTagName(p,i);if(!tag&&p.charAt(0)=="!")
{tag=$iTXT.data.Dom.getElementByClassName(p,i);}
else if(!tag)
{tag=document.getElementById(p);}
return tag;},searchEngines:{},detectSearchEngines:function()
{function _parseTerms(sQry,sQSD)
{sQry=sQry.replace(/%20/g,"+");var i;var sC;var sPrv='+';var sFlat='';var r=new RegExp("[&|?]"+sQSD+"=\+?([^&]*)");oT=(r.exec(sQry));if(oT===null)
{return'';}
sQry=oT[oT.length-1];for(var i=0;i<sQry.length;i++)
{sC=sQry.charAt(i);if(!(sC==='+'&&sPrv==='+'))
{sFlat+=sC==='+'?' ':sC;}
sPrv=sC;}
sQry=sFlat;return sFlat;}
function _parseReferer(sU)
{var sQ,sT,r,oT,D,i,iD;r=/(^https?:\/\/)([^\/]+)(.*)/gi;oT=r.exec(sU);if(oT==null||oT.length<2)
{return;}
sU=oT[2];sT=oT.length>=4?oT[3].replace(/\./g,"%2E"):'';D=sU.split('.');iD=D.length;if(iD<2)
{return;}
outer:for(i=0;i<iD-1;i++)
{if($iTXT.data.Dom.searchEngines[D[i]])
{var sE=$iTXT.data.Dom.searchEngines[D[i]];var flds=sE.flds;for(var j=0;j<sE.flds.length;j++)
{sQ=sE.flds[j];r=new RegExp('[\?|\&|\;]'+sQ+'=');if(sQ==='*'||sQ==='')
{$iTXT.js.SearchEngineSettings.current={seid:sE.id,sehs:D[i],sest:''};}
else if(r.test(document.referrer))
{$iTXT.js.SearchEngineSettings.current={seid:sE.id,sehs:D[i],sest:_parseTerms(sT,sQ)};break outer;}}}}
if($iTXT.js.SearchEngineSettings.current)
{$iTXT.debug.info($iTXT.debug.Category.GENERAL,'Referer was from a search engine - ID is '+$iTXT.js.SearchEngineSettings.current.seid+' ('+$iTXT.js.SearchEngineSettings.current.sehs+'), search terms are "'+$iTXT.js.SearchEngineSettings.current.sest+'".');}}
var foundSE=false;var seHosts=$iTXT.js.SearchEngineSettings.hosts;if(seHosts&&'string'==typeof seHosts)
{seHosts=seHosts.split(',');var i=seHosts.length;while(i--)
{var seHost=seHosts[i];var seID=$iTXT.js.SearchEngineSettings['ids.'+seHost];var seFlds=$iTXT.js.SearchEngineSettings['fields.'+seHost];seFlds=(seFlds)?seFlds.split(','):[];if(seID&&seFlds.length>0)
{this.searchEngines[seHost]={id:seID,flds:seFlds}
foundSE=true;}}}
else
{$iTXT.debug.info($iTXT.debug.Category.GENERAL,'<b style="color:red">WARNING:</b> No search engine hosts found!');}
if(foundSE)
{_parseReferer(document.referrer);}},setNodeId:function(n)
{var nId=n.itxtNodeId;if(null==nId||undefined==nId)
{nId=this.nodeIds.length;this.nodeIds[nId]=nId;if(n.nodeType&&$itxtUtil.ELEMENT_NODE==n.nodeType)
{try
{n.itxtNodeId=nId;}
catch(x)
{$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:red;">ERROR:</b> Could not attach node ID {'+nId+'} to node ('+n+') due to error "'+x.message+'".');}}}
return nId;},getComputedStyles:function(elmt)
{if(!elmt.nodeType||$itxtUtil.ELEMENT_NODE!=elmt.nodeType)
{return{};}
try
{if(window.getComputedStyle)
{return window.getComputedStyle(elmt,null);}
else
{return elmt.currentStyle;}}
catch(x)
{return{};}},visibilityCount:0,visibilitySections:{},visibilityStates:{},assessVisibility:function(elmt)
{if(!elmt.nodeType||$itxtUtil.ELEMENT_NODE!=elmt.nodeType)
{return false;}
var nId=this.setNodeId(elmt),tSec;var tSec=null;if(this.visibilitySections[nId])
{tSec=this.visibilitySections[nId];}
var pState=null,pSec=null;if(elmt.parentNode)
{var pId=this.setNodeId(elmt.parentNode);if(this.visibilitySections[pId])
{pSec=this.visibilitySections[pId];pState=this.visibilityStates[pSec];}}
var tState=this.isVisible(elmt);if(pState==null||pState!=tState)
{if(null==tSec)
{tSec=++this.visibilityCount;}
this.visibilitySections[nId]=tSec;this.visibilityStates[tSec]=tState;return true;}
else
{this.visibilitySections[nId]=pSec;return false;}},isVisible:function(elmt)
{var cS=this.getComputedStyles(elmt);return!!(cS.visibility!='hidden'&&cS.display!='none');},propChangeIntervals:{},propChangeSubs:{},setOnPropChange:function(elmt,f)
{if(!elmt.nodeType||$itxtUtil.ELEMENT_NODE!=elmt.nodeType||'function'!=typeof f)
{return;}
var nId=this.setNodeId(elmt);var evtName=null;if($iTXT.core.Browser.supportsFeature('dommutationevents'))
{evtName='DOMAttrModified';}
else if($iTXT.core.Browser.supportsFeature('propertychangeevent'))
{evtName='propertychange';}
if(evtName)
{$iTXT.core.$(elmt).itxtSubscribe(evtName,function(e){f(e)});this.propChangeSubs[nId]=[evtName,f];}
else
{var intV=window.setInterval(f,500);this.propChangeIntervals[nId]=intV;}},onVisibilityChange:function(elmt,f)
{var nId=this.setNodeId(elmt);var visSec=this.visibilitySections[nId];if(undefined!=visSec)
{var currState=this.isVisible(elmt);var prevState=this.visibilityStates[visSec];if(prevState!=currState)
{this.visibilityStates[visSec]=currState;var sub=this.propChangeSubs[nId];var intV=this.propChangeIntervals[nId];if(intV)
{window.clearInterval(intV);}
if(sub)
{elmt.itxtUnSubscribe(sub[0],sub[1]);}
f(elmt);return true;}}
return false;}};}
$iTXT.js.loader["$iTXT.data.Param"]=true;$iTXT.data.Param_Load=function(){var undefined;var $itxtUtil=$iTXT.core.Util;$iTXT.data.Param=$iTXT.core.Class.create({paramHash:null,parent:null,debugName:null,init:function(p,params,weight,dbgName)
{this.debugName=dbgName||"Uknown";if($iTXT.js.umat)
{$iTXT.debug.debug($iTXT.debug.Category.PARAMETERS,this.debugName+" Parameter Object Created");}
this.isFuncRegEx=/^\$[a-zA-Z]+\{/;this.isTokenRegEx=/^\$\{[a-zA-Z0-9_.]*\}/;this.containsFuncRegEx=/\$[a-zA-Z]+\{/;this.containsTokenRegEx=/\$\{[a-zA-Z0-9_.]*\}/;this.paramHash={}
this.parent=p||null;if(params&&weight)
{this.set(params,null,weight);}},setParent:function(p)
{if(p)
{this.parent=p;}},list:function()
{return $itxtUtil.objKeys(this.paramHash);},get:function(pname,defVal)
{var retVal=(undefined==defVal)?null:defVal;var pV=null,pW=0,mV=null,mW=0;var pnameU=pname.toUpperCase();var v=this.paramHash[pnameU];if(null!=v)
{mW=v.w;mV=v.v;}
var p=this.parent;if(p!=null&&p.get)
{pW=p.weigh(pnameU);pV=p.get(pnameU,defVal);}
if(null!=pV&&null==mV)
{retVal=pV;}
else if(null!=mV&&null==pV)
{retVal=mV;}
else if(null!=mV&&null!=pV)
{if(pW>mW)
{retVal=pV;}
else
{retVal=mV;}}
return retVal;},getBool:function(name,def)
{var val=this.get(name);if(null!=val&&("1"==val||"true"==val))
{return true;}
else if(null!=val&&("0"==val||"false"==val))
{return false;}
return def;},getObj:function(name,defVal)
{var val=this.get(name,defVal);if('string'==typeof val)
{try
{val=eval(val);}
catch(e)
{}}
if(!$itxtUtil.isObject(val))
{return{};}
return val;},getInt:function(name,def)
{var val=this.get(name);if(null!=val&&""!=val)
{try
{if('string'==typeof val&&val.substr&&'.'==val.substr(0,1)&&!isNaN(val.substr(1)))
{val='0'+val;}
val=parseInt(val);if(isNaN(val))
{val=def;}}
catch(e)
{val=def;}}
else
{val=def;}
return val;},weigh:function(pname)
{var retVal=0,pW=0,mW=0;if(null!=this.paramHash[pname])
{mW=this.paramHash[pname].w;}
if(null!=this.parent&&this.parent.weigh)
{pW=this.parent.weigh(pname);}
if(pW>mW)
{retVal=pW;}
else
{retVal=mW;}
return retVal;},set:function(arg1,arg2,arg3)
{if('string'==typeof arg1)
{this.paramHash[arg1.toUpperCase()]=this._qualify(arg1,arg2,arg3);}
else if($itxtUtil.isObject(arg1))
{for(var nm in arg1)
{this.paramHash[nm.toUpperCase()]=this._qualify(nm,arg1[nm],arg3);}}},unset:function(pname)
{delete this.paramHash[pname.toUpperCase()];},exists:function(pname)
{var pT=false;if(this.parent!=null&&this.parent.exists)
{pT=this.parent.exists(pname);}
var mT=(this.paramHash[pname.toUpperCase()]!=null);return pT||mT;},parse:function(s,obj)
{if(!s||""==s)
{return"";}
if($iTXT.core.Util.isString(s)&&s.indexOf("_")>-1)
{s=s.replace(/_VM_UECLICK_/g,'${stub.tu}');s=s.replace(/_VM_CLICK_/g,'$ENCODE{${stub.tu}}');s=s.replace(/_VM_NRDCLICK_/g,'${stub.tu.noredirect}&redir=');s=s.replace(/_VM_ENRDCLICK_/g,'$ENCODE{${stub.tu.noredirect}&redir=}');s=s.replace(/_KEYWORD_/g,'$ENCODE{${keyword}}');s=s.replace(/_TITLE_/g,'${title}');s=s.replace(/_DESCRIPTION_/g,'${body}');s=s.replace(/_ENCODED_URL_/g,'$ENCODE{${stub.t}}');s=s.replace(/_URL_/g,'${stub.t}');s=s.replace(/_CALL_TO_ACTION_/g,'$ENCODE{${cta}}');s=s.replace(/_CLICK_TO_SELF_/g,'$ENCODE{${cts}}');s=s.replace(/_TRACKING_IMAGE_2_/g,'$ENCODE{$ARRAYITEM{trkimages,2}}');s=s.replace(/_TRACKING_IMAGE_1_/g,'$ENCODE{$ARRAYITEM{trkimages,1}}');s=s.replace(/_TRACKING_IMAGE_0_/g,'$ENCODE{$ARRAYITEM{trkimages,0}}');s=s.replace(/_TRACKING_IMAGE_/g,'$ENCODE{$ARRAYITEM{trkimages,0}}');s=s.replace(/_ADVIEW_/g,'$ENCODE{${stub.av}}');s=s.replace(/_SERVER_/g,'$ENCODE{${itxtserver}}');s=s.replace(/_SEARCHTERMS_/g,'$ENCODE{${sest}}');s=s.replace(/_SEARCHENGINE_/g,'$ENCODE{${seid}}');}
if(!this.containsTokens(s))
{return s;}
obj=this.fixOverrideObject(obj);s=s.replace(/\$\{timestamp\}/gi,$iTXT.core.Util.isoTs());s=s.replace(/\$\{epochtimestamp\}/gi,$iTXT.core.Util.ts());var pt=this._buildParseTree(s);return this._serializeParseTree(pt,obj);},fixOverrideObject:function(obj)
{var no={};for(var name in obj)
{no[name.toUpperCase()]=obj[name];}
return no;},containsTokens:function(s)
{if(s&&'string'==typeof s)
{if(s.match(this.containsTokenRegEx))
return true;if(s.match(this.containsFuncRegEx))
return true;}
return false;},BranchType:{ROOT:"ROOT",FUNC:"FUNC",STRING:"STRING",TOKEN:"TOKEN",PARAM:"PARAM"},ParseMode:{NONE:0,STRING:1,TOKEN:2,FUNCNAME:3,FUNCTION:4,PARAM:5},_buildParseTree:function(s)
{var rootNode=this._branch(this.BranchType.ROOT);var stack=[rootNode];var mode=[this.ParseMode.NONE];var buffer="";var pchar="";for(var i=0;i<s.length;i++)
{var ss=s.substring(i);var char=s.charAt(i);if(this._mode(mode,this.ParseMode.NONE))
{if(this._isToken(ss))
{mode.push(this.ParseMode.TOKEN);i++;}
else if(this._isFunc(ss))
{mode.push(this.ParseMode.FUNCNAME);}
else
{mode.push(this.ParseMode.STRING);buffer+=char;}}
else if(this._mode(mode,this.ParseMode.STRING))
{if('$'==char&&'\\'==pchar)
{buffer=buffer.substring(0,buffer.length-1)+"$";}
else if(this._isToken(ss))
{if(""!=buffer)
{this._addBranch(stack,this._branch(this.BranchType.STRING,buffer));buffer="";}
mode.push(this.ParseMode.TOKEN);i++;}
else if(this._isFunc(ss))
{if(""!=buffer)
{this._addBranch(stack,this._branch(this.BranchType.STRING,buffer));buffer="";}
mode.push(this.ParseMode.FUNCNAME);}
else if(i==(s.length-1))
{buffer+=char;this._addBranch(stack,this._branch(this.BranchType.STRING,buffer));buffer="";mode.pop();}
else
{buffer+=char;}}
else if(this._mode(mode,this.ParseMode.TOKEN))
{if('}'==char)
{mode.pop();this._addBranch(stack,this._branch(this.BranchType.TOKEN,buffer));buffer="";}
else
{buffer+=char;}}
else if(this._mode(mode,this.ParseMode.FUNCNAME))
{if('{'==char)
{mode.pop();mode.push(this.ParseMode.FUNCTION);this._addBranch(stack,this._branch(this.BranchType.FUNC,buffer));buffer="";}
else
{buffer+=char;}}
else if(this._mode(mode,this.ParseMode.FUNCTION))
{mode.pop();if('}'!=char)
{this._addBranch(stack,this._branch(this.BranchType.PARAM,buffer));mode.push(this.ParseMode.PARAM);if(this._isToken(ss))
{mode.push(this.ParseMode.TOKEN);i++;}
else if(this._isFunc(ss))
{mode.push(this.ParseMode.FUNCNAME);}
else
{buffer+=char;}}}
else if(this._mode(mode,this.ParseMode.PARAM))
{if('}'==char&&'\\'!=pchar)
{if(""!=buffer)
{this._addBranch(stack,this._branch(this.BranchType.STRING,buffer));buffer="";}
stack.pop();stack.pop();mode.pop();}
else if(','==char&&'\\'!=pchar)
{if(""!=buffer)
{this._addBranch(stack,this._branch(this.BranchType.STRING,buffer));buffer="";}
stack.pop();this._addBranch(stack,this._branch(this.BranchType.PARAM,buffer));}
else if('$'==char&&'\\'==pchar)
{buffer=buffer.substring(0,buffer.length-1)+"$";}
else if(','==char&&'\\'==pchar)
{buffer=buffer.substring(0,buffer.length-1)+",";}
else if(this._isToken(ss))
{if(""!=buffer)
{this._addBranch(stack,this._branch(this.BranchType.STRING,buffer));buffer="";}
mode.push(this.ParseMode.TOKEN);i++;}
else if(this._isFunc(ss))
{if(""!=buffer)
{this._addBranch(stack,this._branch(this.BranchType.STRING,buffer));buffer="";}
mode.push(this.ParseMode.FUNCNAME);}
else
{buffer+=char;}}
pchar=char;}
if(this._mode(mode,this.ParseMode.STRING)&&""!=buffer)
{this._addBranch(stack,this._branch(this.BranchType.STRING,buffer));}
return rootNode;},_branch:function(t,s)
{var rObj={t:t,v:s||"",branches:[]};return rObj;},_addBranch:function(s,b)
{s[s.length-1].branches.push(b);if(b.t==this.BranchType.FUNC||b.t==this.BranchType.PARAM)
{s.push(b);}},_mode:function(m,t)
{return((m.length>0)&&(m[m.length-1]==t));},_serializeParseTree:function(pt,obj)
{var parsedStr="";for(var i=0;i<pt.branches.length;i++)
{var branch=pt.branches[i];if(branch.t==this.BranchType.FUNC)
{if(undefined!=this.tokenFuncs[branch.v.toUpperCase()]&&branch.branches.length>0)
{var paramArray=[];for(var j=0;j<branch.branches.length;j++)
{var paramBranch=branch.branches[j];if(paramBranch.t==this.BranchType.PARAM)
{paramArray.push(this._serializeParseTree(paramBranch,obj));}}
parsedStr+=this.tokenFuncs[branch.v.toUpperCase()].apply(this,paramArray);}}
else if(branch.t==this.BranchType.TOKEN)
{parsedStr+=this._expandToken(branch.v,obj);}
else if(branch.t==this.BranchType.STRING)
{parsedStr+=branch.v;}}
return parsedStr;},_isFunc:function(s)
{return(null!=s.match(this.isFuncRegEx));},_isToken:function(s)
{return(null!=s.match(this.isTokenRegEx));},_expandToken:function(name,obj)
{if(obj&&obj[name])
{return this.parse(obj[name]+"",obj);}
else if(this.exists(name))
{return this.parse(this.get(name)+"",obj);}
if((name.indexOf("P.")==0)&&this.parent)
{var pName=name.substring(2);if(this.parent.exists(pName))
{return this.parse(this.parent.get(pName)+"",obj);}}
return"${"+name+"}";},_param:function(pname,val,weight)
{if('string'==typeof val)
{var itemIndex=val.toUpperCase().indexOf("${"+pname.toUpperCase()+"}");if(itemIndex!=-1)
{val=val.substring(0,itemIndex+2)+"P."+val.substring(itemIndex+2);}}
var r={n:pname.toUpperCase(),v:val,w:(weight||0)}
return r;},_qualify:function(pname,val,weight)
{if($itxtUtil.isArray(val))
{for(var i=0;i<val.length;i++)
{this._qualify(pname+i,val[i],weight);}}
if($itxtUtil.isObject(val)&&undefined!=val.v&&undefined!=val.w)
{weight=val.w;val=val.v;}
if(('clicktag'==pname.toLowerCase()||'tt.logo.url'==pname.toLowerCase())&&val.toLowerCase().indexOf('${keyword}')>-1&&val.toLowerCase().indexOf('$encode{${keyword}}')<0)
{val=val.replace(/\$\{keyword\}/i,'$ENCODE{${keyword}}');}
var retV=null;if(null!=this.paramHash[pname.toUpperCase()])
{var curV=this.paramHash[pname.toUpperCase()];var newV=this._param(pname.toUpperCase(),val,weight);retV=curV;if(newV.w>=curV.w)
{retV=newV;}}
else
{retV=this._param(pname.toUpperCase(),val,weight);}
if($iTXT.js.umat)
{var dV=retV.v;if(dV)
{if(dV.join)
{dV=dV.join(',');}
if(dV.replace)
{dV=dV.replace(/>/g,'&gt;').replace(/</g,'&lt;')}}
$iTXT.debug.trace($iTXT.debug.Category.PARAMETERS,"Setting "+this.debugName+" Parameter<br><b>"+retV.n+"</b> (weight:"+retV.w+")<br> "+dV);}
return retV;},getParamList:function(childParams)
{var returnParams=childParams||{};for(var p in this.paramHash)
{if(!returnParams[p])
{returnParams[p]=this.get(p);}}
if(this.parent)
{return this.parent.getParamList(returnParams);}
return returnParams;},getParamLevel:function(pname,lvl)
{lvl=lvl||0;if(null==this.paramHash[pname.toUpperCase()])
{if(this.parent!=null&&this.parent.getParamLevel)
{return this.parent.getParamLevel(pname,lvl+1);}}
else if(this.parent!=null&&this.parent.getParamLevel)
{var w=this.paramHash[pname.toUpperCase()].w;var pW=this.parent.weigh(pname.toUpperCase());if(pW>w)
{return this.parent.getParamLevel(pname,lvl+1);}}
return lvl;},getAtLevel:function(pname,requestedLevel,lvl)
{lvl=lvl||0;if(lvl==requestedLevel)
{return this.paramHash[pname.toUpperCase()]||null;}
if(this.parent!=null&&this.parent.getAtLevel)
{return this.parent.getAtLevel(pname,requestedLevel,lvl+1);}
return"";},numberOfLevels:function(lvl)
{lvl=lvl||1;if(this.parent!=null&&this.parent.numberOfLevels)
{return this.parent.numberOfLevels(lvl+1);}
return lvl;},tokenize:function(obj)
{if('string'===typeof obj)
{obj=this.parse(obj);}
else if($itxtUtil.isObject(obj))
{for(p in obj)
{obj[p]=this.tokenize(obj[p]);}}
return obj;},tokenFuncs:{ENCODE:function(s)
{try
{return encodeURIComponent(s);}
catch(e){}
return s;},DECODE:function(s)
{try
{return decodeURIComponent(s);}
catch(e){}
return s;},REPLACE:function(needle,haystack,replacement,attributes)
{attributes=attributes||"g";return haystack.replace(new RegExp(needle,attributes),replacement);},SUBSTR:function(s,i,l)
{if(undefined==i)
{return"";}
try
{i=parseInt(i);if(undefined!=l)
{l=parseInt(l);return s.substring(i,l);}
return s.substring(i);}
catch(e){}
return"";},INDEXOF:function(s,c)
{},TRIM:function(s,l,p)
{return $iTXT.core.Util.summarize(s,l,p);},ARRAYITEM:function(n,i)
{var arr=this.get(n);if($itxtUtil.isArray(arr))
{if(arr.length>i)
{return arr[i];}}
return'';},O:function(s)
{return s;}}});}
$iTXT.js.loader["$iTXT.data.Pixel"]=true;$iTXT.data.Pixel_Load=function()
{var undefined;var $itxtUtil=$iTXT.core.Util;$iTXT.data.Pixel=$iTXT.core.Class.create({blind:false,cat:"",detailid:0,done:false,id:"",keyword:"",type:"",url:"",init:function(detailid,keyword,url,blind,cat,type)
{this.id=$itxtUtil.genUUID();var idS='('+this.id+')';this.detailid=detailid;this.keyword=keyword;this.url=url;var ifrStub='http://'+$iTXT.js.serverName+'/'+$iTXT.cnst.IFRAME_SCRIPT_DROPPER_LOC+'?'+$iTXT.cnst.IFRAME_SCRIPT_DROPPER_FLD+'=';if(this.url.match($iTXT.cnst.IFRAME_SCRIPT_DROPPER_LOC))
{var candUrl=decodeURIComponent(this.url.replace(ifrStub,'')).replace(/\%26/g,'&');if($itxtUtil.isURL(candUrl))
{this.url=candUrl;blind=true;$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">Pixel.init:</b> '+idS+' setting pixel to blind because source URL "'+url+' requires Iframe.")');}}
this.type=(this.url.match(/^<iframe/i))?'iframe':(this.url.match(/^https?\:\/\/.*\/.*\.gif|png|jpg|jpeg/i)||this.url.match(/type\=(img|image)/i))?'img':(this.url.match(/^https?\:\/\/.*\/.*\.js/i)||this.url.match(/type\=script/i))?'script':type;if(!this.type||undefined==this.type||''==this.type)
{this.type='img';$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">Pixel.init:</b> '+idS+' cannot auto-detect or resolve type from param "'+type+'" so defaulting to "img".)');}
else
{$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">Pixel.init:</b> '+idS+' auto-detected or resolved type from param "'+type+'" as "'+this.type+'".)');}
if(blind&&'boolean'==typeof blind)
{this.blind=blind;$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">Pixel.init:</b> '+idS+' setting blind from param "'+blind+'".)');}
else if(!url.match($iTXT.cnst.DNS_INTELLITXT_SUFFIX)&&!url.match($iTXT.cnst.DNS_SMARTAD_MARKER))
{this.blind=true;$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">Pixel.init:</b> '+idS+' overriding blind to "'+this.blind+'" because pixel is 3rd-party.)');}
if((url.match($iTXT.cnst.DNS_INTELLITXT_SUFFIX)||url.match($iTXT.cnst.DNS_SMARTAD_MARKER))&&url.match(/al\.(a|j)sp/))
{this.blind=false;$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">Pixel.init:</b> '+idS+' overriding blind to "'+this.blind+'" because pixel is AdLogger.)');}
if('iframe'==this.type)
{this.url=$itxtUtil.getEmbeddedURL(url);this.blind=false;$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">Pixel.init:</b> '+idS+' overriding blind to "'+this.blind+'" because pixel is a native '+this.type+'.)');}
if(cat&&'string'==typeof cat)
{cat=cat.replace("$iTXT.glob.track.",'');this.cat=cat;if('rand'==this.cat)
{this.blind=false;$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">Pixel.init:</b> '+idS+' overriding blind to "'+this.blind+'" because pixel category is "'+this.cat+'".)');}}
if(this.url.match($iTXT.cnst.PIXEL_SERVER_PREFIX+$iTXT.cnst.DNS_INTELLITXT_SUFFIX))
{var ipid=$iTXT.glob.params?$iTXT.glob.params.get("ipid",0):0;if($iTXT.glob.ipid&&!isNaN($iTXT.glob.ipid))
{ipid=$iTXT.glob.ipid;}
this.url=$itxtUtil.appendToURL(this.url,'ipid='+ipid);var sfid=0;if($iTXT.glob.currentAd&&$iTXT.glob.currentAd.sfid&&!isNaN($iTXT.glob.currentAd.sfid))
{sfid=$iTXT.glob.currentAd.sfid;}
if($iTXT.glob.params&&$iTXT.glob.params.get('testrandsfid'))
{sfid=Math.round(10000*Math.random());}
this.url=$itxtUtil.appendToURL(this.url,'sfid='+sfid);}
$iTXT.debug.info($iTXT.debug.Category.GENERAL,'<b style="color:orange;">Pixel.init:</b> '+idS+' created '+((this.blind)?'blind':'non-blind')+' '+this.cat+' '+this.type+' pixel "'+this.url+'" for "'+this.keyword+'" and '+this.detailid+'.)');}});$iTXT.data.PixelManager={pixelQueue:[],activePixels:[],active:function()
{return(this.activePixels.length>0)?true:false;},defer:function(job,iteration)
{try
{var mode=null;var id='',idS='';if('function'==typeof job)
{id=job.toString();idS='(function)';mode='normal';}
else if('string'==typeof job)
{id=job;idS='('+id+')';job=new Function('$iTXT.data.PixelManager.drop($iTXT.data.PixelManager.activePixels[$iTXT.data.PixelManager.findActive("'+id+'")],null,true);');mode='drop';}
if(!mode)
{throw new Error('Job is not valid.')}
var itrDelay=$iTXT.glob.params.get("pxid")||100;var maxDelay=$iTXT.glob.params.get("pxmd")||1000;if(null==iteration)
{iteration=0;}
$iTXT.debug.info($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.defer:</b> '+idS+' iteration '+iteration+' ('+(iteration*itrDelay)+'ms - timeout will occur at '+maxDelay+'ms)');var execute=true;if(this.active())
{if('normal'==mode)
{$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.defer:</b> '+idS+' active queue has '+this.activePixels.length+' pixel(s).');execute=false;}
else if(id!=this.activePixels[0].id)
{$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.defer:</b> '+idS+' top ('+this.activePixels[0].id+') of active pixel queue of '+this.activePixels.length+' pixel(s) is not the pixel we\'re looking for.');execute=false;}}
if(execute)
{$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.defer:</b> '+idS+' executing in '+mode+' mode.  Active pixel queue has '+this.activePixels.length+' pixel(s).');}
else if(iteration*itrDelay>=maxDelay)
{$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.defer:</b> '+idS+' timed out after '+iteration+' iteration(s) ('+(iteration*itrDelay)+'ms)');execute=true;}
if(execute)
{$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.defer:</b> '+idS+' executing function after '+(iteration*itrDelay)+'ms');job();}
else
{if('drop'==mode&&'function'==typeof job)
{job=id;}
$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.defer:</b> '+idS+' re-iterating, sleeping for '+itrDelay+'ms...');iteration++;window.setTimeout(function(){$iTXT.data.PixelManager.defer(job,iteration)},itrDelay);}}
catch(x)
{var msg='ERROR attempting to defer for function "'+job+'" on iteration '+i+'.  Error message is "'+x.message+'".';$itxtUtil.dropScript('http://'+$iTXT.js.serverName+'/v3/errorlog.jsp?msg='+encodeURIComponent('checkBeeacons: '+msg),function(removeFunction){removeFunction();});$iTXT.debug.error($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.defer:</b> '+idS+' '+msg);}},drop:function(pixel,mode,confirm)
{try
{$iTXT.debug.info($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.drop:</b> ('+pixel.id+') '+((pixel.blind)?'blind':'non-blind')+' '+pixel.cat+' '+pixel.type+' pixel to drop has URL "'+pixel.url+'"');if(undefined==pixel||'string'!=typeof pixel.url||'string'!=typeof pixel.id||'string'!=typeof pixel.type)
{$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.drop:</b> ('+pixel.id+') <b style="color: red">DID NOT DROP</b>: "'+pixel+'" is not a Pixel.');return;}
if(!pixel.url.match(/^http/))
{$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.drop:</b> ('+pixel.id+') <b style="color: red">DID NOT DROP</b>: "'+pixel.url+'" is not a URL.');return;}
if(!mode||undefined==mode)
{mode=pixel.type;}
if(pixel.blind&&pixel.type=='script')
{mode='iframe';}
else
{mode=pixel.type;}
if(confirm&&'script'==mode&&$iTXT.core.Browser.is('Explorer')&&!(pixel.url.match(/al\.asp/)||pixel.url.match($iTXT.cnst.PIXEL_SERVER_PREFIX+$iTXT.cnst.DNS_INTELLITXT_SUFFIX)))
{$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.drop:</b> ('+pixel.id+') <b style="color: red">CANNOT CONFIRM</b>: mode is "'+mode+'" and confirm is set but "'+pixel.url+'" cannot be confirmed in this browser.');this.remove(pixel.id);}
pixel.url=$iTXT.glob.params.parse(pixel.url);var cb=null;if(confirm)
{cb=function(){$iTXT.data.PixelManager.remove(pixel.id);};}
switch(mode.toLowerCase())
{case'img':case'image':$itxtUtil.dropImage(pixel.url,cb,cb);break;case'iframe':if(pixel.blind&&!pixel.url.match(/^<iframe/i)&&!pixel.url.match($iTXT.cnst.IFRAME_SCRIPT_DROPPER_LOC))
{pixel.url='http://'+$iTXT.js.serverName+'/'+$iTXT.cnst.IFRAME_SCRIPT_DROPPER_LOC+'?'+$iTXT.cnst.IFRAME_SCRIPT_DROPPER_FLD+'='+encodeURIComponent(pixel.url);}
$itxtUtil.dropIframe(pixel.url,cb,cb);break;default:$itxtUtil.dropScript(pixel.url,cb,cb);break;}
$iTXT.debug.info($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.drop:</b> ('+pixel.id+') dropped '+pixel.type+' pixel "'+pixel.url+'" '+((''!=confirm)?' using "'+mode+'"':''));}
catch(x)
{var msg='('+pixel.id+') ERROR attempting to drop Pixel "'+pixel.url+'" in mode "'+mode+'" with confirm '+confirm+'.  Error message is "'+x.message+'".';$itxtUtil.dropScript('http://'+$iTXT.js.serverName+'/v3/errorlog.jsp?msg='+encodeURIComponent('dropBeeacon: '+msg),function(removeFunction){removeFunction();});$iTXT.debug.error($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.drop:</b> '+msg);}},findActive:function(id)
{for(var i=0;i<this.activePixels.length;i++)
{if(id==this.activePixels[i].id)
{return i;}}
return-1;},flush:function()
{$iTXT.debug.info($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.flush:</b> '+this.pixelQueue.length+' pixel(s) to aggregate');var aggPXs={};while(this.pixelQueue.length>0)
{var pX=this.pixelQueue.shift();if(!pX.url.match($iTXT.cnst.PIXEL_SERVER_PREFIX+$iTXT.cnst.DNS_INTELLITXT_SUFFIX)||pX.type=='img')
{aggPXs[pX.id]=pX;continue;}
var qsArgs=$itxtUtil.getQueryParams(pX.url);var pId=qsArgs.id;var aggIdx=(pX.type||'*')+':'+qsArgs.ipid+':'+qsArgs.sfid;if(aggPXs[aggIdx]&&undefined!=aggPXs[aggIdx])
{var aggPX=aggPXs[aggIdx];var newURL=aggPX.url.replace(/id\=/,'id='+pId+',');if(newURL.length>2048)
{aggPXs[pX.id]=aggPX;aggPXs[aggIdx]=pX;}
else
{aggPX.url=newURL;}}
else
{aggPXs[aggIdx]=pX;}}
$iTXT.debug.info($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.flush:</b> '+$itxtUtil.objKeys(aggPXs).length+' aggregated pixel(s) to flush');var c=0;for(var k in aggPXs)
{c++;if('function'!=typeof aggPXs[k])
{var aPx=aggPXs[k];this.activePixels.push(aPx);$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.flush:</b> ('+aPx.id+') flushing "'+aPx.url+'" into active queue which now contains '+this.activePixels.length+' pixel(s).');this.defer(aPx.id);}}
this.pixelQueue=[];},get:function(cat,cri)
{var uCat,uCri;if(null!=cri&&'string'==typeof cri)
{uCri='keyword';}
else if(null!=cri&&!isNaN(cri))
{uCri='detail ID';}
else
{$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.get:</b> Criterion "'+cri+'" of type "'+typeof cri+'" is not supported.');return;}
var uCat;switch(cat)
{case'guar':uCat='GUARANTEED';break;case'rand':uCat='RANDOM';break;default:uCat=cat.toUpperCase();break;}
$iTXT.debug.info($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.get:</b> Searching for '+uCat+' pixels for '+uCri+' "'+cri+'"');if($iTXT.glob.track&&$iTXT.glob.track[cat]&&$itxtUtil.isArray($iTXT.glob.track[cat])&&$iTXT.glob.track[cat].length>0)
{var eC=0,fC=0,dC=0;var px=$iTXT.glob.track[cat];for(var i=0;i<px.length;i++)
{eC++;var tPx=px[i];var t=('string'==typeof cri)?tPx.keyword:tPx.detailid;if(t==cri)
{fC++;var dupe=false;for(j=0;j<px.length&&!dupe;j++)
{var cPx=px[j];if(cPx.url==tPx.url&&cPx.done)
{dupe=true;}}
if(!dupe)
{$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.get:</b> ('+tPx.id+') found <span style="color:blue;">UNUSED</span> '+uCat+' pixel for '+uCri+' <span style="color:darkgreen;">"'+cri+'"</span> '+tPx.url);tPx.done=true;this.queue(tPx);dC++;if('hook'!=cat)
{if(!$iTXT.js.modAdTypes)
{var mon='http://'+$iTXT.js.serverName+'/al.asp?ipid='+ipid+'&mt=54&ts='+$iTXT.glob.params.get('timestamp')+'&cc='+$iTXT.glob.geo.get('normalisedcountry')+'&rcc='+$iTXT.glob.geo.get('realcountry')+'&mh='+$iTXT.glob.params.get('page.md5')+'&mv='+tPx.detailid;$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.get:</b> monitoring (LOG TRK) call: '+mon);$itxtUtil.dropScript(mon,function(removeFunction){removeFunction(removeFunction);});}
else
{var mOpts={mt:54,mv:tPx.detailid};$iTXT.core.$(document).itxtFire("$iTXT:data:log:monitor",mOpts);}}
if('rand'==cat)
{break;}}}}
$iTXT.debug.info($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.get:</b> examined '+eC+' '+uCat+' pixel(s), of which '+fC+' matched '+uCri+' "'+cri+'" and '+dC+' were unused and were queued to be dropped.');}
else
{$iTXT.debug.info($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.get:</b> No '+uCat+' pixels were found.');}},queue:function(pixel,always)
{if(pixel.id&&'string'==typeof pixel.id)
{if(always||pixel.url.match($iTXT.cnst.DNS_INTELLITXT_SUFFIX)||pixel.url.match($iTXT.cnst.DNS_SMARTAD_MARKER))
{this.pixelQueue.push(pixel);$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.queue:</b> ('+pixel.id+') queued pixel "'+pixel.url+'" - pixel queue has '+this.pixelQueue.length+' pixel(s).');}
else
{$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.queue:</b> ('+pixel.id+') dropping (we don\'t need to queue) 3rd-party pixel "'+pixel.url+'"');window.setTimeout(function(){$iTXT.data.PixelManager.drop(pixel)},50);}}},queued:function()
{return(this.pixelQueue.length>0)?true:false;},remove:function(id)
{$iTXT.debug.info($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.remove:</b> ('+id+') attempting to remove pixel...');var idx=this.findActive(id);if(idx>=0)
{$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.remove:</b> ('+id+') active queue has '+this.activePixels.length+' pixel(s) before removal.');$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.remove:</b> ('+id+') deleting pixel "'+this.activePixels[idx].url+'".');this.activePixels.splice(idx,1);$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.remove:</b> ('+id+') active queue has '+this.activePixels.length+' pixel(s) after removal.');}
else
{$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:orange;">PixelManager.remove:</b> ('+id+') pixel not found in active queue of '+this.activePixels.length+' pixel(s).');}}};$iTXT.data.PixelController={init:function()
{$iTXT.core.$(document).itxtBatchSubscribe([["$iTXT:tt:open",$iTXT.core.Event.bind(this,this._ttOpn)],["$iTXT:location:change",$iTXT.core.Event.bind(this,this.locationChange)],["$iTXT:hook:hooked",$iTXT.core.Event.bind(this,this.hookHooked)],["$iTXT:hooks:loaded",$iTXT.core.Event.bind(this,this.hooksLoaded)]]);},locationChange:function(e)
{var o=e.data||{};if($iTXT.data.PixelManager&&$iTXT.data.PixelManager.active())
{if(o.defer&&o.cb)
{o.defer(this);$iTXT.data.PixelManager.defer(o.cb);}}},_ttOpn:function(e)
{var o=e.data||{};var ad=o.advert||$iTXT.ui.tt.currentAdvert;if(ad)
{$iTXT.data.PixelManager.get('rand',ad.params.get("A.KW","").replace(/\'/g,"\\'"));$iTXT.data.PixelManager.get('guar',ad.params.get("A.KW","").replace(/\'/g,"\\'"));window.setTimeout(function(){$iTXT.data.PixelManager.flush()},50);}},hookHooked:function(e)
{var hk=e.data||null;if(null!=hk)
{$iTXT.data.PixelManager.get('hook',hk.options.value.replace(/\'/g,"\\'"));}},hooksLoaded:function()
{$iTXT.data.PixelManager.flush();}};}