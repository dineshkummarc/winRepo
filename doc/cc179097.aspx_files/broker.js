var _sr_builder = "builder.js";var qI_loaded=false;var qI_flag=false;var SR_url = window.location.toString().toLowerCase();var SR_url_stripped = SR_url.split("?");
if(SR_url_stripped[0].search('careers\\.microsoft\\.com/careers/en/') != -1 || SR_url_stripped[0].search('careers\\.microsoft\\.com/careers/zh-cn/') != -1) 
{ qI_loaded=true; _sr_builder= "builder_c_qInvite.js"; }
if(typeof(COMSCORE)=="undefined"){var COMSCORE={};}if(typeof COMSCORE.SiteRecruit=="undefined"){COMSCORE.SiteRecruit={version:"4.6.3",configUrl:"broker-config.js",builderUrl:_sr_builder,allowScriptCaching:false,CONSTANTS:{COOKIE_TYPE:{ALREADY_ASKED:1,DD_IN_PROGRESS:2},STATE_NAME:{IDLE:"IDLE",DDINPROGRESS:"DDINPROGRESS"}}};
COMSCORE.SiteRecruit.Utils=(function(){var _sr=COMSCORE.SiteRecruit;return{location:document.location.toString(),loadScript:function(url,loadFresh){if(loadFresh&&!_sr.allowScriptCaching){url=_sr.Utils.appendQueryParams(url,(new Date()).getTime());
}var s=document.createElement("script");s.src=url;document.body.appendChild(s);},getBrowser:function(){var b={};
b.name=navigator.appName;b.version=parseInt(navigator.appVersion,10);if(b.name=="Microsoft Internet Explorer"){if(b.version>3){var ua=navigator.userAgent.toLowerCase();
if(ua.indexOf("msie 5.0")==-1){b.ie=true;}if(ua.indexOf("msie 7")!=-1){b.ie7=true;
}}}if(b.name=="Netscape"||b.name=="Opera"){if(b.version>4){b.mozilla=true;}}return b;
},fireBeacon:function(url){setTimeout(function(){if(url.indexOf("?")==-1){url+=(/\?/.test(url)?"&":"?")+(new Date()).getTime();
}else{url+="&"+(new Date()).getTime();}var i=new Image();i.src=url;},1);},appendQueryParams:function(url,params){if(url==null||params==null){}if(!url){return params;
}else{url=url.replace("?","")+"?";if(params){url+=params.toString().replace("?","");
}return url;}},getRandom:function(num){var n=1000000000;function ugen(old,a,q,r,m){var t=Math.floor(old/q);
t=a*(old-(t*q))-(t*r);return Math.round((t<0)?(t+m):t);}var m1=2147483563,m2=2147483399,a1=40014,a2=40692,q1=53668,q2=52774,r1=12211,r2=3791,x=67108862;
var g2=(Math.round(((new Date()).getTime()%100000))&2147483647),g1=g2;var shuffle=[32],i=0;
for(;i<19;i++){g1=ugen(g1,a1,q1,r1,m1);}for(i=0;i<32;i++){g1=ugen(g1,a1,q1,r1,m1);
shuffle[31-i]=g1;}g1=ugen(g1,a1,q1,r1,m1);g2=ugen(g2,a2,q2,r2,m2);var s=Math.round((shuffle[Math.floor(shuffle[0]/x)]+g2)%m1);
var rand=Math.floor(s/(m1/(n+1)))/n;if(typeof(num)=="undefined"){return rand;}else{return Math.floor(rand*(num+1));
}},getExecutingPath:function(filename){var tags=document.getElementsByTagName("script");
for(var i=tags.length-1;i>=0;i--){var src=tags[i].src;this.scriptUrl=src;if(src.indexOf("/"+filename)!=-1){return src.replace(/(.*)(\/.*)$/,"$1/");
}}},JSONDeserialize:function(str){try{if(str===""){str='""';}eval("var p="+str+";");
return p;}catch(e){return null;}},JSONSerialize:function(obj){try{var t=typeof(obj);
if(t!="object"||obj===null){if(t=="string"){obj='"'+obj+'"';}return String(obj);}else{var n,v,json=[],arr=(obj&&obj.constructor==Array);
for(n in obj){v=obj[n];t=typeof(v);if(t!="function"){if(t=="string"){v='"'+v+'"';
}else{if(t=="object"&&v!==null){v=this.JSONSerialize(v);}}json.push((arr?"":'"'+n+'":')+String(v));
}}return(arr?"[":"{")+String(json)+(arr?"]":"}");}}catch(e){return"";}}};})();COMSCORE.SiteRecruit.Utils.UserPersistence={CONSTANTS:{STATE_NAME:{IDLE:"IDLE",DDINPROGRESS:"DDINPROGRESS"}},getCookieName:function(){var A;
if(COMSCORE.SiteRecruit.Broker&&COMSCORE.SiteRecruit.Broker.config){A=COMSCORE.SiteRecruit.Broker.config.cookie;
if(A.name){return A.name;}}return"";},getDefaultCookieOptions:function(){var A={path:"/",domain:""};
return A;},getVendorId:function(){var A=1;return A;},createCookie:function(B,A,D){A=escape(A);
if(D.duration&&D.duration<0){var C=new Date();C.setTime(C.getTime()+D.duration*24*60*60*1000);
A+="; expires="+C.toGMTString();}else{var C=new Date();C.setTime(C.getTime()+10*365*24*60*60*1000);
A+="; expires="+C.toGMTString();}if(D.path){A+="; path="+D.path;}else{}if(D.domain){A+="; domain="+D.domain;
}if(D.secure){A+="; secure";}document.cookie=B+"="+A;return true;},getCookieValue:function(B){var A=document.cookie.match("(?:^|;)\\s*"+B+"=([^;]*)");
return A?unescape(A[1]):false;},removeCookie:function(A,B){B=B||{};B.duration=-999;
this.createCookie(A,"",B);},createUserObj:function(D){var C=new Date();var G=D.pid;
var F=D.url;var E=this.CONSTANTS.STATE_NAME.IDLE;if(D.statename){E=D.statename;}var A=C.getTime();
if(D.timestamp){A=D.timestamp;}var H=this.getCookieName();if(D.cookiename){H=D.cookiename;
}if(!D.cookieoptions){D.cookieoptions=this.getDefaultCookieOptions();}var B={};B.version="4.6";
B.state={};B.state.name=E;B.state.url=F;B.state.timestamp=A;B.lastinvited=A;B.userid=C.getTime().toString()+Math.floor(Math.random()*1e+16).toString();
B.vendorid=this.getVendorId();B.surveys=new Array();B.surveys.push(G);var I=COMSCORE.SiteRecruit.Utils.JSONSerialize(B);
this.createCookie(H,I,D.cookieoptions);return B;},setUserObj:function(E){var H=E.pid;
var G=E.url;var D=new Date();var F=this.CONSTANTS.STATE_NAME.IDLE;if(E.statename){F=E.statename;
}var A=D.getTime();if(E.timestamp){A=E.timestamp;}var I=this.getCookieName();if(E.cookiename){I=E.cookiename;
}if(!E.cookieoptions){E.cookieoptions=this.getDefaultCookieOptions();}var C=this.getUserObj(E);
if(!C){this.createUserObj(E);}else{var D=new Date();C.lastinvited=A;if(H){var B=false;
for(i=0;i<C.surveys.length;i++){if(C.surveys[i]&&C.surveys[i].toLowerCase()==H.toLowerCase()){B=true;
}}if(B==false){C.surveys.push(H);}for(i=0;i<C.surveys.length;i++){if(C.surveys[i]==null){C.surveys.splice(i,1);
}}}if(F){C.state.name=F;C.state.url=G;C.state.timestamp=A;}var J=COMSCORE.SiteRecruit.Utils.JSONSerialize(C);
this.createCookie(I,J,E.cookieoptions);}return C;},getUserObj:function(A){var B=this.getCookieName();
if(A.cookiename){B=A.cookiename;}var C=this.getCookieValue(B);if(C&&C!=""){var D=COMSCORE.SiteRecruit.Utils.JSONDeserialize(C);
if(D&&D.version&&D.version=="4.6"){return D;}}return null;}};COMSCORE.SiteRecruit.DDKeepAlive=(function(){var B=1000,E=Math.random(),A;
var C=COMSCORE.SiteRecruit;var D=C.Utils;return{start:function(){var F=this;A=setInterval(function(){if(C.Broker.isDDInProgress()){F.setDDTrackerCookie();
}else{F.stop();}},B);},stop:function(){clearInterval(A);},setDDTrackerCookie:function(){var G=C.Broker.config.cookie;
var F={};F.cookieoptions={path:G.path,domain:G.domain};F.cookiename=G.name;F.url=escape(D.location);
F.statename=C.CONSTANTS.STATE_NAME.DDINPROGRESS;if(COMSCORE.SiteRecruit.Builder&&COMSCORE.SiteRecruit.Builder.invitation&&COMSCORE.SiteRecruit.Builder.invitation.config){F.pid=COMSCORE.SiteRecruit.Builder.invitation.config.projectId;
}D.UserPersistence.setUserObj(F);}};})();COMSCORE.SiteRecruit.PagemapFinder=(function(){var C;
var B=COMSCORE.SiteRecruit;var A=B.Utils;return{getTotalFreq:function(){return C;
},find:function(K){var F=0,I;var G=K;var J=[];var H=false;C=0;for(var D=0;G&&D<G.length;
D++){var E=false;var N=G[D];if(N){var M=new RegExp(N.m,"i");if(A.location.search(M)!=-1){var L=G[D].prereqs;
E=true;if(L){if(!this.isMatchContent(L.content)){E=false;}if(!this.isMatchCookie(L.cookie)){E=false;
}if(!this.isMatchLanguage(L.language)){E=false;}}}if(E){if(N.halt){H=true;break;}else{J.push(N);
C+=N.f;}}}}if(H==true){J=null;C=0;return null;}return this.choosePriority(J);},choose:function(E,F){var D=A.getRandom((F*100));
var H=0;for(var G=0;G<E.length;G++){H+=(E[G].f*100);if(D<=H){return E[G];}}return null;
},choosePriority:function(D){var F=null;for(var E=0;E<D.length;E++){if(F==null){F=D[E];
}else{if(F.p<D[E].p){F=D[E];}}}return F;},isMatchContent:function(M){var I=true,D=0;
while(I&&D<M.length){var L=false;var K=false;var J=M[D];if(J.element){var F=document.getElementsByTagName(J.element);
for(var E=0;E<F.length;E++){var G=J.elementValue;if(G&&G.length){
	//if(F[E].innerHTML.search(G)!=-1){
	//alert("innerHtml: " + F[E].innerHTML);
	if(F[E].innerHTML == G){
		L=true;
}}else{L=true;}if(J.attrib&&J.attrib.length){var H=F[E].attributes.getNamedItem(J.attrib);
if(H){if(J.attribValue&&J.attribValue.length){
	//if(H.value.search(J.attribValue)!=-1){
	var _pre = J.attribValue;
	var _pre_stripped = _pre.split("|");
	for(i=0;i< _pre_stripped.length;i++){
	if(H.value == _pre_stripped[i]){
		//alert("iRoot=" + H.value + "; SRpreReq Value=" + _pre_stripped[i]);
		K=true;
		}
	}}else{K=true;}}}else{K=true;}}}if(!L||!K){I=false;}D++;}return I;},
	isMatchCookie:function(D){var H=true,F=0;
while(H&&F<D.length){var E=D[F],G=A.UserPersistence.getCookieValue(E.name);if(G&&G!==null){H=G.indexOf(E.value)!=-1?true:false;
F++;}else{return false;}}return H;},isMatchLanguage:function(E){var D=navigator.language||navigator.userLanguage;
D=D.toLowerCase();if(!E){return true;}if(D.indexOf(E)!=-1){return true;}return false;
}};})();COMSCORE.SiteRecruit.Broker=(function(){var B=COMSCORE.SiteRecruit;var A=B.Utils;
return{init:function(){B.browser=A.getBrowser();B.executingPath=A.getExecutingPath("broker.js");
if(B.browser.ie||B.browser.mozilla){A.loadScript(B.executingPath+B.configUrl,true);
	if(qI_loaded){A.loadScript(B.executingPath+"qinvite-config.js");}
}else{return;}},start:function(){this.init();},run:function(){if(this.config.objStoreElemName){if(B.browser.ie){COMSCORE.SiteRecruit.Utils.UserPersistence.initialize();
}else{return;}}if(B.version!==this.config.version){return;}if(this.isDDInProgress()){this.processDDInProgress();
}if(!this.config.testMode||this.isDDInProgress()){var C={};C.cookiename=this.config.cookie.name;
var E=A.UserPersistence.getUserObj(C);var F=new Date();var H=this.config.cookie.duration;
var D=F.getTime()-(H*24*60*60*1000);if(E){if(E.lastinvited>D){return;}}}if(this.findPageMapping()){var G=A.getRandom();
if(G<=B.PagemapFinder.getTotalFreq()){if(this.pagemap){this.loadBuilder();}}else{return;
}}else{return;}},isDDInProgress:function(){var E=false;var C={};C.cookiename=COMSCORE.SiteRecruit.Broker.config.cookie.name;
var D=A.UserPersistence.getUserObj(C);if(D){if(D.state.name==B.CONSTANTS.STATE_NAME.DDINPROGRESS){E=true;
}}return E;},processDDInProgress:function(){B.DDKeepAlive.start();},findPageMapping:function(){this.pagemap=B.PagemapFinder.find(this.config.mapping);
return this.pagemap;},loadBuilder:function(){var C=B.executingPath+B.builderUrl;A.loadScript(C);
}};})();COMSCORE.isDDInProgress=COMSCORE.SiteRecruit.Broker.isDDInProgress;COMSCORE.SiteRecruit.OnReady=(function(){var B=COMSCORE.SiteRecruit;
var A=B.Utils;return{onload:function(){if(B.OnReady.done){return;}B.OnReady.done=true;
B.Broker.start();if(B.OnReady.timer){clearInterval(B.OnReady.timer);}if(document.addEventListener){document.removeEventListener("DOMContentLoaded",B.OnReady.onload,false);
}if(window.ActiveXObject){}},listen:function(){if(/WebKit|khtml/i.test(navigator.userAgent)){B.OnReady.timer=setInterval(function(){if(/loaded|complete/.test(document.readyState)){clearInterval(B.OnReady.timer);
delete B.OnReady.timer;B.OnReady.onload();}},10);}else{if(document.addEventListener){document.addEventListener("DOMContentLoaded",B.OnReady.onload,false);
}else{if(window.ActiveXObject){COMSCORE.SiteRecruit.OnReady.waitForLoad=setInterval(function(){try{document.documentElement.doScroll("left");
}catch(C){return;}COMSCORE.SiteRecruit.OnReady.waitForLoad=clearInterval(COMSCORE.SiteRecruit.OnReady.waitForLoad);
COMSCORE.SiteRecruit.OnReady.onload();},1000);}else{if(window.addEventListener){window.addEventListener("load",B.OnReady.onload,false);
}else{if(window.attachEvent){return window.attachEvent("onload",B.OnReady.onload);
}}}}}},f:[],done:false,timer:null};})();COMSCORE.SiteRecruit.OnReady.listen();}