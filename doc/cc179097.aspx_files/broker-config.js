var _msdn = [ ["default.aspx",'1175',0.2277],["library",'1176',0.2299],["ie",'1177',0.081],["netframework",'1178',0.2277],["windowsazure",'1179',0.2299],["magazine",'1180',0.2277], ["office",'1181',0.2299],["sharepoint",'1183',0.2299],["sqlserver",'1184',0.2299],["subscriptions",'1185',0.2277],["vbasic",'1186',0.081], ["vcsharp",'1187',0.081],["visualc",'1188',0.081],["vstudio",'1189',0.081],["windows",'1190',0.081]  ];
var _technet = [ ["default.aspx",'1219',0.089],["library",'1192',0.089],["windowsserver",'1194',0.089],["forefront",'1011',0.3],["office",'1195',0.089], ["sharepoint",'1196',0.3],["sqlserver",'1197',0.3],["systemcenter",'1198',0.089],["windows",'1199',0.018],["scriptcenter",'1200',0.089],["security",'1202',0.089], ["sysinternals",'1203',0.018],["virtualization",'1205',0.3],["subscriptions",'1206',0.089],["magazine",'623',0.089],["ie",'1220',0.3],["exchange",'1221',0.3],["edge",'1222',0.089]  ];
var SR_url = window.location.toString().toLowerCase();
var SR_url_stripped = SR_url.split("?");
var _Freq="See deployment report. ",_Site="See deployment report. ",srchMSForumIroot="",_wtsp="",_centerW=90;_networkW=10;_halt=false;
if(document.getElementsByName('Search.MSForums.Iroot')[0] && document.getElementsByName('Search.MSForums.Iroot')[0].getAttribute('content') != null){
		srchMSForumIroot = document.getElementsByName('Search.MSForums.Iroot')[0].getAttribute('content');
}
if(typeof(wtsp)&& typeof(wtsp)!='undefined'){ _wtsp=wtsp.toLowerCase(); if(/_technet_library_windowsserver/i.test(_wtsp)){_wtsp="_technet_library_windowsserver_";} };
var _raw_params = 'Search.MSForums.Iroot='+srchMSForumIroot+"&wtsp="+ _wtsp;

if(SR_url_stripped[0].search('msdn.microsoft.com') != -1){
	setSiteFreq("http://msdn.microsoft.com/en-us/", _msdn);//MSDN center survey check
	checkWTSP();
}else if(SR_url_stripped[0].search('technet.microsoft.com') != -1){
	setSiteFreq("http://technet.microsoft.com/en-us/", _technet);//TechNet center survey check
	checkWTSP();
}
function setSiteFreq(_url, _array){
	for(i=0; i< _array.length; i++){
		if(SR_url.search(_url + _array[i][0].toString().toLowerCase()) != -1){	
			_Site = _array[i][1];
			_Freq = _array[i][2];
			break;
		}
	}
}
function checkWTSP(){
	if(_Site == '1176'){
		if(!(_wtsp=="msdnlib_webdev" || _wtsp=="msdnlib_devtools_lang" || _wtsp=="windowsazure" || _wtsp=="_msdn_library_sqlserver_" || _wtsp=="_msdnlib_w32_com" || _wtsp=="msdnlib_w32_com")){
			_halt=true; _centerW=0; _networkW=100; _Freq=0.06;//reset freq for network study(site=72)
			//alert("WTSP codes invalid: centerWeight="+_centerW+"; NetworkWeight="+_networkW);
		}
		if(_wtsp=="msdnlib_w32_com"){
			_Freq=0.081;
		}else if(_wtsp=="msdnlib_webdev" || _wtsp=="msdnlib_devtools_lang"){
			_Freq=0.012;
		}//Default freq is set in _msdn[] array above
	}else if(_Site=='1192'){
		if(!(_wtsp=="_technet_library_windowsserver_" || _wtsp=="_technet_prodtechnol_office_" || _wtsp=="_technet_library_sqlserver_" || _wtsp=="_sto_technet_systemcenter_" || _wtsp=="_technet_library_win7_" || _wtsp=="scriptcenter_technet" || _wtsp=="_technet_library_security_" || _wtsp=="_technet_library_ie_")){	
				_halt=true; _centerW=0; _networkW=100; _Freq=0.15;//reset freq for network study(site=74)
				//alert("WTSP codes invalid: centerWeight="+_centerW+"; NetworkWeight="+_networkW);
		}
		if(_wtsp=="_technet_library_win7_"){
			_Freq=0.018;
		}else if(_wtsp=="_technet_library_ie_" || _wtsp=="_technet_library_sqlserver_"){
			_Freq=0.3;
		}//Default is 1232 set in _technet[] array above
	}
}

function readCookie(name)
{
  var ca = document.cookie.split(';');
  var nameEQ = name + "=";
  for(var i=0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1, c.length); //delete spaces
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
  return null;
}

var _Career_Freq = false;

if(qI_loaded==true){
	/* Career srTimer cookie check - set freq to 100 percent if exist */
	var SRtempCookie = document.cookie.toString();
	var _timer=0; var _newpage = false;
	if(SRtempCookie.indexOf("srtimer")!= -1){
		_Career_Freq = true;
		_timer = readCookie("srtimer");
	}
}
//if(!_halt){alert("Site=" + _Site + "\n" +_raw_params + "\nFreq: " + _Freq);}
COMSCORE.SiteRecruit.Broker.config={version:"4.6.3",testMode:false,cookie:{name:"msresearch",path:"/",domain:".microsoft.com",duration:90,rapidDuration:0,expireDate:""},prefixUrl:"",mapping:[{m:"//careers\\.microsoft\\.com/careers/en/us",c:"inv_c_MS-Careers-qInvite-US.js",f:(_Career_Freq)?1:0.5,p:0},{m:"//careers\\.microsoft\\.com/careers/en/gb",c:"inv_c_MS-Careers-qInvite-GB.js",f:(_Career_Freq)?1:0.5,p:0},{m:"//careers\\.microsoft\\.com/careers/en/gbl",c:"inv_c_MS-Careers-qInvite-GBL.js",f:(_Career_Freq)?1:0.5,p:1},{m:"//careers\\.microsoft\\.com/careers/en/ie",c:"inv_c_MS-Careers-qInvite-IE.js",f:(_Career_Freq)?1:0.5,p:0},{m:"//careers\\.microsoft\\.com/careers/en/in",c:"inv_c_MS-Careers-qInvite-IN.js",f:(_Career_Freq)?1:0.25,p:0},{m:"//careers\\.microsoft\\.com/careers/zh-cn/cn",c:"inv_c_MS-Careers-qInvite-ZH-CN.js",f:(_Career_Freq)?1:0.3,p:0},{m:"(code\\.msdn\\.microsoft\\.com|cpapp02)",c:"inv_c_CODE-p26386365_661-p15808382mt.js",f:0.043,p:0},{m:"(gallery\\.msdn\\.microsoft)[\\w\\.-]+/ScriptJunkie",c:"inv_c_GA-MSDN-p77737117-1210.js",f:0.043,p:0},{m:"(gallery\\.technet\\.microsoft)[\\w\\.-]+/",c:"inv_c_GA-TN-p77737117-1212.js",f:0.1,p:0},{m:"/(sr-msdn|msdnstage|msdntest|msdnlive|msdn\\.microsoft)[\\w\\.-]+/de-de/",c:"inv_c_MSDN-p15466742-DE-DE.js",f:0.0266,p:1},{m:"/(sr-msdn|msdnstage|msdntest|msdnlive|msdn\\.microsoft)[\\w\\.-]+/en-au",c:"inv_c_MSDN-p15466742-en-au.js",f:0.5,p:1},{m:"/(sr-msdn|msdnstage|msdntest|msdnlive|msdn\\.microsoft)[\\w\\.-]+/en-us/",c:"inv_c_MSDN-p15808382-p26386365_TIER4.js",f:0.043,p:0},{m:"/(sr-msdn|msdnstage|msdntest|msdnlive|msdn\\.microsoft)[\\w\\.-]+/en-us/((default\\.aspx)|(windows/)|(library|ie|netframework|windowsazure|magazine|office|sharepoint|sqlserver|subscriptions|vbasic|vcsharp|visualc|vstudio))",c:"inv_c_MSDN-p77596864_TIER5.js",f:_Freq,p:2},{m:"/(sr-msdn|msdnstage|msdntest|msdnlive|msdn\\.microsoft)[\\w\\.-]+/fr-fr/",c:"inv_c_MSDN-p15466742-fr-fr.js",f:0.017,p:0},{m:"/(sr-msdn|msdnstage|msdntest|msdnlive|msdn\\.microsoft)[\\w\\.-]+/ja-jp/",c:"inv_c_MSDN-p15466742-JA.js",f:0.0012,p:0},{m:"(.*?social\\.msdn\\.microsoft)[\\w\\.-/]+/Forums/en-(us|US)",c:"inv_c_SC-MSDN-p77737117-1207.js",f:0.043,p:0},{m:"(.*?social\\.msdn\\.microsoft)[\\w\\.-/]+/Forums/en-(us|US)",c:"inv_c_SC-MSDN-p77596864-p77737117-Tier1.js",f:0.2277,p:1,prereqs:{content:[{"element":"meta","attrib":"content","attribValue":"netframework"}],cookie:[]}},{m:"(.*?social\\.msdn\\.microsoft)[\\w\\.-/]+/Forums/en-(us|US)",c:"inv_c_SC-MSDN-p77596864-p77737117-Tier2.js",f:0.081,p:1,prereqs:{content:[{"element":"meta","attrib":"content","attribValue":"ie|vbasic|vcsharp|visualc|vstudio|windows"}],cookie:[]}},{m:"(.*?social\\.msdn\\.microsoft)[\\w\\.-/]+/Forums/en-(us|US)",c:"inv_c_SC-MSDN-p77596864-p77737117-Tier3.js",f:0.2299,p:1,prereqs:{content:[{"element":"meta","attrib":"content","attribValue":"windowsazure|office|sharepoint|sqlserver"}],cookie:[]}},{m:"(.*?social\\.technet\\.microsoft|sr-technet)[\\w\\.-]+/Forums/en/",c:"inv_c_SC-TN-p77737117-1308.js",f:0.1,p:0},{m:"(.*?social\\.technet\\.microsoft|sr-technet)[\\w\\.-]+/Forums/en/",c:"inv_c_SC-TN-p77596864-1308.js",f:0.089,p:1,prereqs:{content:[{"element":"meta","attrib":"content","attribValue":"scriptcenter|windowsserver"}],cookie:[]}},{m:"(.*?social\\.technet\\.microsoft|sr-technet)[\\w\\.-]+/Forums/en/",c:"inv_c_SC-TN-p77596864-p77737117-1308.js",f:0.018,p:1,prereqs:{content:[{"element":"meta","attrib":"content","attribValue":"windows"}],cookie:[]}},{m:"(.*?social\\.technet\\.microsoft|sr-technet)[\\w\\.-]+/Forums/en-(us|US)",c:"inv_c_SC-TN-p77737117-1208.js",f:0.1,p:0},{m:"(.*?social\\.technet\\.microsoft|sr-technet)[\\w\\.-]+/forums/en-(us|US)",c:"inv_c_SC-TN-p77596864-p77737117-TIER1.js",f:0.089,p:1,prereqs:{content:[{"element":"meta","attrib":"content","attribValue":"windowsserver|office|systemcenter|scriptcenter"}],cookie:[]}},{m:"(.*?social\\.technet\\.microsoft|sr-technet)[\\w\\.-]+/forums/en-(us|US)",c:"inv_c_SC-TN-p77596864-p77737117-TIER2.js",f:0.3,p:1,prereqs:{content:[{"element":"meta","attrib":"content","attribValue":"forefront|sharepoint|sqlserver|exchange"}],cookie:[]}},{m:"(.*?social\\.technet\\.microsoft)[\\w\\.-]+/wiki",c:"inv_c_SC-TN-p77737117-1213.js",f:0.1,p:0},{m:"/(sr-technet|tnstage|tnlive|tntest|technet\\.microsoft)[\\w\\.-]+/de-de/",c:"inv_c_TN-p15466742-p81712691-DE.js",f:0.1575,p:2},{m:"/(sr-technet|tnstage|tnlive|tntest|technet\\.microsoft)[\\w\\.-]+/en-au",c:"inv_c_TN-p15466742-en-au.js",f:0.2,p:1},{m:"/(sr-technet|tnstage|tnlive|tntest|technet\\.microsoft)[\\w\\.-]+/en-us/",c:"inv_c_TN-p15808382-p26386365_74-TIER4.js",f:0.1,p:0},{m:"/(sr-technet|tnstage|tnlive|tntest|technet\\.microsoft)[\\w\\.-]+/en-us/((default\\.aspx)|(windows/)|(library|windowsserver|forefront|office|sharepoint|sqlserver|systemcenter|scriptcenter|security|sysinternals|virtualization|subscriptions|magazine|ie|exchange|edge))",c:"inv_c_TechNet-p77596864.js",f:_Freq,p:2},{m:"/(sr-technet|tnstage|tnlive|tntest|technet\\.microsoft)[\\w\\.-]+/fr-fr/",c:"inv_c_TN-p15466742-p81712691-FR.js",f:0.1,p:2},{m:"/(sr-technet|tnstage|tnlive|tntest|technet\\.microsoft)[\\w\\.-]+/ja-jp",c:"inv_c_TECHNET-p15466742-p81712691-JA.js",f:0.0033,p:1},{m:"(visualstudiogallery\\.msdn\\.microsoft)[\\w\\.-]+/",c:"inv_c_GA-MSDN-p77737117-1211.js",f:0.043,p:0}]};
COMSCORE.SiteRecruit.Broker.run();