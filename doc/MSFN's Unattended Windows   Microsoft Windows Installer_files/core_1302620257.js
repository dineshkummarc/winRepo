/* This source code is Copyright (c) Vibrant Media 2001-2011 and forms part of the patented Vibrant Media product "IntelliTXT" (sm). */ 
$iTXT.js.loader["$iTXT.core.Ajax"]=true;$iTXT.core.Ajax_Load=function(){var undefined;$iTXT.core.Ajax={maxURLLength:2000,postData:function(opts)
{if($iTXT.glob.params.get("echm")&$iTXT.debug.Util.ECH_TIME_XFER)
{if(undefined==$iTXT.metrics.Context)
{$iTXT.metrics.Context={};}
$iTXT.metrics.Context.startXfer=(new Date()).getTime();}
$iTXT.debug.info($iTXT.debug.Category.CONTEXT,"Sending harvested content Data");var forceChunk=$iTXT.glob.params.getBool("force.chunk",true);if(forceChunk)
{$iTXT.debug.info($iTXT.debug.Category.CONTEXT,"Force Chunking is <b>ON</b>");};if(($iTXT.core.Ajax.Mode.CHUNKING==$iTXT.core.Ajax.currentMode)||forceChunk)
{$iTXT.core.Ajax._chunkData(opts);}
else
{$iTXT.core.Ajax._corsData(opts);}
if(($iTXT.glob.params.get("echm")&$iTXT.debug.Util.ECH_TIME_XFER)&&undefined!=$iTXT.metrics.Context&&undefined!=$iTXT.metrics.Context.startXfer)
{$iTXT.metrics.Context.stopXfer=(new Date()).getTime();$iTXT.debug.debug($iTXT.debug.Category.CONTEXT,'<b style="color: blue">ECH:</b> Data transfer took '+($iTXT.metrics.Context.stopXfer-$iTXT.metrics.Context.startXfer)+'ms.');}},_corsData:function(opts)
{var xhr=null;var url=opts.url;if($iTXT.core.Ajax.Mode.FULL_CORS==$iTXT.core.Ajax.currentMode)
{xhr=new XMLHttpRequest();xhr.open("POST",url,true);var contentType="text/plain";xhr.setRequestHeader("Content-type",contentType);xhr.setRequestHeader("Content-length",opts.data.length);}
else
{xhr=new XDomainRequest();xhr.open("POST",url);}
$iTXT.debug.debug($iTXT.debug.Category.CONTEXT,"Posting AJAX Data Using Cross Origin Scripting To: "+url);xhr.onload=function()
{if(opts.callback)
{opts.callback(xhr.responseText);}}
xhr.send(opts.data);},_chunkData:function(opts)
{opts.chunkKey=$iTXT.js.chunkKey||0;var url=opts.url;var data=encodeURIComponent(opts.data)||"";if(url.indexOf("?")==-1)
{url+="?";}
else
{url+="&";}
url+="chunkkey="+opts.chunkKey;url+="&data=";var chunkSize=$iTXT.core.Ajax.maxURLLength-url.length;var totalChunks=Math.ceil(data.length/chunkSize);$iTXT.debug.debug($iTXT.debug.Category.CONTEXT,"Sending "+totalChunks+" Chunks To <b>"+url+"</b>");$iTXT.debug.debug($iTXT.debug.Category.CONTEXT,"Using Chunk Key: <b>"+opts.chunkKey+"</b>");var chunksArr=[];for(var i=0;i<totalChunks;i++)
{if(chunkSize>data.length)
{chunkSize=data.length;}
var dataChunk=data.substring(0,chunkSize);$iTXT.debug.trace($iTXT.debug.Category.CONTEXT,"Getting chunk "+i);$iTXT.debug.trace($iTXT.debug.Category.CONTEXT,"Last Chunk Char: "+dataChunk.charAt(dataChunk.length-1));$iTXT.debug.trace($iTXT.debug.Category.CONTEXT,"Second To Last Chunk Char: "+dataChunk.charAt(dataChunk.length-2));if("%"==dataChunk.charAt(dataChunk.length-1))
{$iTXT.debug.trace($iTXT.debug.Category.CONTEXT,"Last character is % so moving to next chunk");dataChunk=dataChunk.substring(0,dataChunk.length-1);data=data.substring(chunkSize-1);}
else if("%"==dataChunk.charAt(dataChunk.length-2))
{$iTXT.debug.trace($iTXT.debug.Category.CONTEXT,"Second to last character is % so moving to next chunk");dataChunk=dataChunk.substring(0,dataChunk.length-2);data=data.substring(chunkSize-2);}
else
{$iTXT.debug.trace($iTXT.debug.Category.CONTEXT,"Chunk ok as it is");if(i+1<totalChunks)
{data=data.substring(chunkSize);}}
var newUrl=url+dataChunk+"&chunk="+i;newUrl+="&total="+totalChunks;var chunkDetails={loaded:false,number:i,url:newUrl,data:dataChunk}
$iTXT.debug.debug($iTXT.debug.Category.CONTEXT,"URL size before callback: "+newUrl.length);chunksArr.push(chunkDetails);}
this._chunkSequential(opts,chunksArr);},_chunkSequential:function(opts,chunksArr)
{if(chunksArr&&chunksArr.length>0)
{var chunk=chunksArr.shift();$iTXT.debug.debug($iTXT.debug.Category.CONTEXT,"<b>Sending Chunk "+chunk.number+"</b>");$iTXT.debug.trace($iTXT.debug.Category.CONTEXT,"<b>Chunk "+chunk.number+" Data:</b> <br>"+chunk.data);$iTXT.core.Util.dropScript(chunk.url,function(response)
{opts.response=response;$iTXT.debug.debug($iTXT.debug.Category.CONTEXT,"<b>Chunk "+chunk.number+" Sent</b>");$iTXT.core.Ajax._chunkSequential(opts,chunksArr);});}
else
{$iTXT.debug.debug($iTXT.debug.Category.CONTEXT,"<b>All Chunks Sent</b>");if(opts.callback)
{opts.callback(opts.response);}}},_sendChunk:function(opts,chunk,chunksArr)
{$iTXT.debug.debug($iTXT.debug.Category.CONTEXT,"<b>Sending Synchronous Chunk "+chunk.number+"</b>");$iTXT.debug.trace($iTXT.debug.Category.CONTEXT,"<b>Chunk "+chunk.number+" Data:</b> <br>"+chunk.data);$iTXT.core.Util.dropScript(chunk.url,function(response)
{$iTXT.debug.debug($iTXT.debug.Category.CONTEXT,"<b>Synchronous Chunk "+chunk.number+" Sent</b>");chunk.loaded=true;$iTXT.core.Ajax._checkChunksLoaded(opts,chunksArr,response);});},_checkChunksLoaded:function(opts,chunksArr,response)
{for(var i in chunksArr)
{if(!chunksArr[i].loaded)
{return;}}
$iTXT.debug.debug($iTXT.debug.Category.CONTEXT,"All Chunks Loaded");if(opts.callback)
{opts.callback(response);opts.callback=null;}},Mode:{FULL_CORS:1,IE8_CORS:2,CHUNKING:3},currentMode:null,setMode:function()
{try
{this.currentMode=this.Mode.CHUNKING;var xhr=new XMLHttpRequest();if("withCredentials"in xhr)
{$iTXT.core.Ajax.currentMode=this.Mode.FULL_CORS;}
else if(typeof XDomainRequest!="undefined")
{$iTXT.core.Ajax.currentMode=this.Mode.IE8_CORS;}
xhr=null;}
catch(e)
{}}}
$iTXT.core.Ajax.setMode();}
$iTXT.js.loader["$iTXT.core.Util"]=true;$iTXT.core.Util_Load=function()
{var undefined;$iTXT.core.Util={init:function()
{},ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11,callbackID:0,args:function(args)
{var rA=[];for(var i=0,len=args.length;i<len;i++)
{rA[i]=args[i];}
return rA;},extend:function(dest,src)
{for(var p in src)
{if(undefined!=src[p])
{try
{dest[p]=src[p];}
catch(e)
{}}}
return dest;},extendObjectArray:function(dest,src,prop)
{dest=dest.reverse();src=src.reverse();var pA=[];for(var s=0,len=src.length;s<len;s++)
{if(src[s]&&undefined!=src[s][prop])
{pA[pA.length]=src[s][prop];}}
for(var d=0,len=dest.length;d<len;d++)
{if(dest[d]&&undefined!=dest[d][prop]&&!this.inArray(pA,dest[d][prop]))
{src[src.length]=dest[d];}}
return src.reverse();},isArray:function(o)
{return!!(o&&undefined!=o&&((o.prototype&&o.prototype===Array.prototype)||o instanceof Array));;},isObject:function(o)
{return!!(o&&undefined!=o&&Object.prototype.toString.call(o).indexOf("Object")>=0&&!o.itxtClass);},isClass:function(o)
{return!!(o&&undefined!=o&&o instanceof Object&&o.itxtClass);},isFunction:function(o)
{return o&&undefined!=o&&"function"==typeof(o);},isURL:function(s,i)
{if('string'!=typeof s)
{return false;}
else if(i&&(s.match($iTXT.cnst.DNS_INTELLITXT_SUFFIX)||s.match($iTXT.cnst.DNS_SMARTAD_MARKER)))
{return false;}
else
{var m=s.match("^(https?|mailto|ftp|wais|file|gopher|telnet)://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");return(null==m)?false:true;}},isString:function(o)
{return typeof(o)=='string';},cleanString:function(s)
{if('string'!=typeof s)
{return s;}
else
{return s.replace(/(\t|[\n\r])/g,' ').replace(/\s{2,}/g,' ').replace(/(^\s+|\s+$)/g,'');}},getEmbeddedURL:function(src)
{if(null==src)
{return src;}
var url='';var urlMatch=src.match(/=\"(http[^\"]+)\"/);if(null==urlMatch||!urlMatch[1])
{return src;}
else
{url=urlMatch[1];}
return url;},appendToEmbeddedURL:function(src,extra)
{var url=this.getEmbeddedURL(src);var sep=(url.indexOf('?')>=0)?'&':'?';var newUrl=url+sep+extra;return src.replace(url,newUrl);},appendToURL:function(url,param,before)
{{if(null==url||'string'!=typeof url||null==param||'string'!=typeof param||''==param)
{return url;}
if(null!=before&&'string'==typeof before)
{var target=url.match(new RegExp("[\?|\&]"+before+'='));if(null!=target&&'string'==typeof target[0]&&target[0].length==(before.length+2))
{var rep=target[0].slice(0,1)+param+'&'+target[0].slice(1);return url.replace(target,rep);}}
return url+((url.indexOf('?')>=0)?'&':'?')+param;}},kwEncode:function(kw)
{if(null==kw||'string'!=typeof kw)
{return kw;}
var maxD=5,thisD=0;do
{thisD++;var oldKw=kw;kw=decodeURIComponent(kw);}
while(thisD<maxD&&oldKw!=kw)
return encodeURIComponent(encodeURIComponent(kw));},dropCSS:function(src,id)
{var pageHead=document.getElementsByTagName("HEAD")[0];if(!pageHead)
{var pageBody=document.getElementsByTagName("BODY")[0];if(!pageBody)
return;pageHead=$iTXT.core.Builder.make("head");pageBody.parentNode.insertBefore(pageHead,pageBody);}
var ss=$iTXT.core.$(id);if(!ss)
{ss=$iTXT.core.Builder.make("link",{id:id,type:"text/css",href:url,rel:"stylesheet"});pageHead.appendChild(ss);}},dropImage:function(src,cb,eh)
{var img=$iTXT.core.Builder.make("IMG",{src:src,style:"width:0px;height:0px;display:none;visibility:hidden;"});if(cb&&'function'==typeof cb)
{img.itxtSubscribe("load",cb);}
if(eh&&'function'==typeof eh)
{img.itxtSubscribe("error",eh);}
var c=$iTXT.js.exclCont();c.insertBefore(img,c.firstChild);},dropIframe:function(src,cb,eh)
{src=this.getEmbeddedURL(src);var iframe=$iTXT.core.Builder.make("IFRAME",{src:src,style:"width:0px;height:0px;display:none;visibility:hidden;"});if(cb&&'function'==typeof cb)
{iframe.itxtSubscribe("load",cb);}
if(eh&&'function'==typeof eh)
{iframe.itxtSubscribe("error",eh);}
var c=$iTXT.js.exclCont();c.insertBefore(iframe,c.firstChild);},dropScript:function(src,cb,eh)
{if('string'!=typeof src||!src.match(/^http/)){return;}
try
{var newS=document.createElement('script');var c=$iTXT.js.exclCont();var removeFunc=function()
{c.removeChild(newS);};if('function'==typeof cb)
{var cbFunc=this.callbackFunction(cb,newS,removeFunc);if(src.indexOf('?')!=-1)
{src+="&jscallback="+cbFunc;}
else
{src+="?jscallback="+cbFunc;}}
if(eh&&'function'==typeof eh)
{$iTXT.core.$(newS).itxtSubscribe("error",eh);}
newS.src=src;newS.type='text/javascript';c.insertBefore(newS,c.firstChild);$iTXT.debug.debug($iTXT.debug.Category.GENERAL,'<b style="color:green;">Dropping Script</b> "'+src+'"');}
catch(e)
{$iTXT.debug.error($iTXT.debug.Category.GENERAL,'<b style="color:red;">Error</b> dropping script "'+src+'": "'+e.message+'".');}},callbackFunction:function(f,src,removeFunc)
{var cbName="callback"+(this.callbackID++);$iTXT.js[cbName]=function()
{if(f)
{var args=$iTXT.core.Util.args(arguments);args[args.length]=removeFunc;if(src)
{f.apply(src,args);}
else
{f(args);}}}
return"$iTXT.js."+cbName;},getQueryParams:function(srcUrl)
{if(srcUrl.indexOf('?')==-1)
{return{};}
var params={};var qs=srcUrl.substring(srcUrl.indexOf('?')+1);var pairs=qs.split('&');for(var i=0,len=pairs.length;i<len;i++)
{var keyPair=pairs[i].split('=');if(keyPair.length==2)
{params[keyPair[0]]=unescape(keyPair[1]);}}
return params;},getScriptBySrc:function(srcUrl)
{var scripts=document.getElementsByTagName("script");for(var i=0,len=scripts.length;i<len;i++)
{var s=scripts[i];if(s.src.indexOf(srcUrl)!=-1)
{return s;}}
return null;},getWindowSize:function(win,doc)
{win=win||window;doc=doc||document;var vW;var vH;if(typeof win.innerWidth!='undefined')
{vW=win.innerWidth,vH=win.innerHeight}
else if(typeof doc.documentElement!='undefined'&&typeof doc.documentElement.clientWidth!='undefined'&&doc.documentElement.clientWidth!=0)
{vW=doc.documentElement.clientWidth,vH=doc.documentElement.clientHeight}
else
{vW=doc.getElementsByTagName('body')[0].clientWidth,vH=doc.getElementsByTagName('body')[0].clientHeight}
var rObj=[vW,vH];rObj.width=vW;rObj.height=vH;return rObj;},getPageScroll:function()
{var scrOfX=0,scrOfY=0;if(typeof(window.pageYOffset)=='number'){scrOfY=window.pageYOffset;scrOfX=window.pageXOffset;}else if(document.body&&(document.body.scrollLeft||document.body.scrollTop)){scrOfY=document.body.scrollTop;scrOfX=document.body.scrollLeft;}else if(document.documentElement&&(document.documentElement.scrollLeft||document.documentElement.scrollTop)){scrOfY=document.documentElement.scrollTop;scrOfX=document.documentElement.scrollLeft;}
return[scrOfX,scrOfY];},inArray:function(arr,val)
{if(this.isArray(arr))
{var i=arr.length;while(i--)
{if(this.fuzzyMatch(val,arr[i]))
{return true;}}}
return false;},objValues:function(obj)
{var rA=[];for(var key in obj)
{if(obj[key]&&'function'!=typeof obj[key])
{rA[rA.length]=obj[key];}}
return rA;},objKeys:function(obj)
{var rA=[];for(var key in obj)
{if(obj[key]&&'function'!=typeof obj[key])
{rA[rA.length]=key;}}
return rA;},objCount:function(obj)
{return this.objValues(obj).length;},cacheImage:function(src)
{var im=new Image();im.src=src;},cacheImages:function(imgs)
{var i=imgs.length;while(i--)
{this.cacheImage(imgs[i]);}},flattenJSON:function(object)
{return _iter(object,0);function _iter(obj,depth)
{var out='';if('object'==typeof obj&&!obj.nodeType)
{for(var elem in obj)
{var val=obj[elem];if('object'==typeof val&&!obj.nodeType)
{out+=elem+_iter(val,(depth+1));}
else if('function'!=typeof val)
{out+=elem+val;}}}
else if('function'!=typeof obj)
{out+=obj;}
return out;}},serialiseJSON:function(object,flds,fi)
{return _iter(object,0,flds);function _iter(obj,depth,flds)
{var out='';if('function'!=typeof obj&&($iTXT.core.Util.isObject(obj)||$iTXT.core.Util.isArray(obj)||$iTXT.core.Util.isClass(obj))&&!obj.nodeType)
{var c=0;for(var elem in obj)
{var val=obj[elem];if(null!=val&&'function'!=typeof val&&'itxt'!=elem.substr(0,4)&&'$'!=elem.substr(0,1)&&(undefined==flds||($iTXT.core.Util.isObject(flds)&&('itxtAllowed'==flds[elem]||!isNaN(elem)))))
{var pass='';var name='';var next=null;if(isNaN(elem)||fi)
{name+=elem+':';}
if($iTXT.core.Util.isArray(val))
{next=_iter(val,(depth+1),flds);if(''!=next)
{pass+=name+'['+next+']';}}
else if($iTXT.core.Util.isObject(val))
{next=_iter(val,(depth+1),flds);if(''!=next)
{pass+=name+'{'+next+'}';}}
else if(!isNaN(val)&&'string'!=typeof val)
{pass+=name+val;}
else if('string'==typeof val)
{var delim=(val.match(/^(\{|\[\{).*(\}\]|\})$/)||name=='')?'':'"';pass+=name+delim+val+delim;}
if(c>0&&''!=pass&&''!=out)
{pass=','+pass;}
c++;out+=pass;}}
if(0==depth)
{out='{'+out+'}';}}
return out;}},matchObjs:function(o1,o2,precision)
{if(null==precision||undefined==precision||isNaN(precision))
{precision=0;}
if(this.isObject(o1)&&this.isObject(o2))
{var res=false;for(var fld in o1)
{if('function'!=typeof o1[fld])
{if(o2[fld])
{var sub=(this.isObject(o1[fld]))?this.matchObjs(o1[fld],o2[fld],precision):(this.fuzzyMatch(o1[fld],o2[fld]));if(!sub)
{return sub;}
else
{res=sub;}}
else if(precision>=0)
{return false;}}}
if(precision>0)
{for(var fld in o2)
{if('function'!=typeof o2[fld])
{if(o1[fld])
{var sub=(this.isObject(o2[fld]))?this.matchObjs(o2[fld],o1[fld],precision):(this.fuzzyMatch(o2[fld],o1[fld]));if(!sub)
{return sub;}
else
{res=sub;}}
else
{return false;}}}}
return res;}
return false;},fuzzyMatch:function(s1,s2)
{if('string'!=typeof s1||'string'!=typeof s2)
{return false;}
if('*'==s1)
{return true;}
if(s1.indexOf('*')<0)
{return(s1.toLowerCase()==s2.toLowerCase());}
if('*'==s1.substr(0,1)&&'*'==s1.substr(-1,1))
{return!!(s2.indexOf(s1.replace(/\*/g,''))>=0);}
var m=new RegExp(((s1.match(/\*$/,''))?'^':'')+(s1.replace(/\*/g,''))+((s1.match(/^\*/,''))?'$':''));return(null!=s2.match(m));},reverseString:function(s)
{if('string'==typeof s||!isNaN(s))
{s=s+'';s=s.split('');s=s.reverse();s=s.join('');}
return s;},sizeString:function(s,w,r,c)
{if(('string'==typeof s||!isNaN(s))&&!isNaN(w)&&s.length!=w)
{if(r)
{s=this.reverseString(s);if(c&&'string'==typeof c)
{c=this.reverseString(c);}}
if(s.length>w)
{s=s.substr(0,w);}
else if(s.length<w)
{var i=w-s.length;while(i--)
{if('string'!=typeof c)
{c=' ';}
s+=c;}}
if(r)
{s=this.reverseString(s);}}
return s;},formatJSONString:function(s,h)
{var a=s.split("");var o="";var d=0;var nl=(h)?"<br/>":"\n";var tb=(h)?"&nbsp;&nbsp;&nbsp;&nbsp;":"\t";var isQu=false;var qCh="";var hOn=(h)?'<span style="color:red">':"";var hOf=(h)?'</span>':"";var mOpe=/(\{|\[)/;var mClo=/(\}|\])/;var mQuo=/(\"|\')/;var mEsc=/\\/;var mPro=/\,/;function tab(dpt)
{var tO=nl;var i=dpt;while(i--)
{tO+=tb;}
return tO;}
for(var i=0,len=a.length;i<len;i++)
{var ch=a[i];var pc=a[i-1]||'';var nc=a[i+1]||'';if(ch.match(mQuo)&&!pc.match(mEsc))
{if((isQu&&ch==qCh)||!isQu)
{o+=hOn+ch+hOf;isQu=!isQu;qCh=(isQu)?ch:"";}
else
{if(isQu)
{o+=hOn+ch+hOf;}}}
else if(isQu)
{o+=hOn+ch+hOf;}
else if(ch.match(mOpe))
{o+=tab(d);o+=ch;d++;if(ch.match(/{/))
{o+=tab(d);}}
else if(ch.match(mClo))
{d--;o+=tab(d);o+=ch;}
else if(ch.match(mPro)&&!nc.match(mOpe))
{o+=ch;o+=tab(d);}
else
{o+=ch;}}
return o;},genUUID:function()
{return(s4()+s4()+"-"+s4()+"-4"+s4().substring(1,4)+"-"+sp()+"-"+s4()+s4()+s4());function s4()
{return(((1+Math.random())*0x10000)|0).toString(16).substring(1);}
function sp()
{var r4='';do
{r4=s4();}
while("8"!=r4.substring(0,1)&&"9"!=r4.substring(0,1)&&"a"!=r4.substring(0,1)&&"b"!=r4.substring(0,1));return r4;}},getNodeText:function(n)
{try
{if(n)
{return n.nodeValue;}}
catch(e)
{}
return"";},cloneArray:function(a)
{var ra=[];for(var i=0,len=a.length;i<len;i++)
{ra[i]=a[i];}
return ra;},cloneObject:function(src)
{var rO={};for(var p in src)
{if(undefined!=src[p])
{if(this.isObject(src[p]))
{rO[p]=this.cloneObject(src[p]);}
else
{rO[p]=src[p];}}}
return rO;},fixTags:function(s)
{var rxTag=new RegExp(/<([^>]+)\/?/gi);var rxAttr=new RegExp(/(\S+)=(["'])?((?:.(?!\2?\s+(?:\S+)=|(>|\2)))+.)\2?/gi);var tags;while(tags=rxTag.exec(s))
{var origTag=tags[0];var newTag=origTag;var attrs;while(attrs=rxAttr.exec(newTag))
{var origAttr=attrs[0];var quot=(undefined==attrs[2])?'"':attrs[2];var newAttr=attrs[1]+'='+quot+attrs[3]+quot;if(origAttr!=newAttr)
{newTag=newTag.replace(origAttr,newAttr);}}
if(origTag!=newTag)
{s=s.replace(origTag,newTag);}}
return s;},decodeQueryString:function(s)
{var rob={};var comps=s.split('&');i=comps.length;while(i--)
{var kvP=comps[i];kvPComps=kvP.split('=');if(kvPComps.length==2)
{rob[kvPComps[0]]=kvPComps[1];}}
return rob;},without:function(array,element)
{for(var i=0,len=array.length;i<len;i++)
{if(array[i]==element)
{array.splice(i,1);return array;}}},parseColorArray:function(s,n,c)
{if(null==s||""==s)
return[];c=c||',';var colors=s.split(c);if(colors.length<n)
{var lc=colors[colors.length-1];while(colors.length<n)
{colors[colors.length]=lc;}}
return colors;},summarize:function(s,len,br)
{br=br||"...";var rs=s;if(rs&&rs.length>len)
{rs=s.substring(0,len-br.length);var fsp=false;var spos=rs.length-1;while(!fsp&&spos>0)
{if(" "!=rs.charAt(spos))
{spos--;}
else
{fsp=true;}}
if(fsp)
{rs=s.substring(0,spos);}
rs+=br;}
return rs;},strRepeat:function(c,n)
{var rs="";while(n--)
{rs+=c;}
return rs;},isoTs:function()
{var digitString=["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60"];var rs="";var d=new Date();rs+=d.getUTCFullYear();rs+=digitString[d.getUTCMonth()+1];rs+=digitString[d.getUTCDate()];rs+=digitString[d.getUTCHours()];rs+=digitString[d.getUTCMinutes()];rs+=digitString[d.getUTCSeconds()];return rs;},ts:function()
{return(new Date()).getTime();},td:function(t)
{return this.ts()-t;},convertSpaces:function(t)
{if('string'!=typeof t)
{return'';}
return t.replace(/\xA0+|\s+/g,' ');},getInnerText:function(n,maxt,st)
{st=st||this.ts();maxt=maxt||0;if((maxt>0)&&(this.td(st)>maxt))
{throw("");}
var nT=n.nodeType;var nV=n.nodeValue||'';var tag=(n.tagName||'').toLowerCase();if((nT==$iTXT.core.Dom.COMMENT_NODE)||n.itxtvisited)
{return'';}
if(this.inArray(tag,['script','a','embed','noscript','applet','xml','iframe','object','img','style','form']))
{return'';}
if(nT&&this.TEXT_NODE==nT)
{return this.cleanString(nV);}
n.itxtvisited=1;var rT='';var cn=$iTXT.core.$A(this.toArray(n.childNodes));cn.itxtEach(function(o)
{try
{rT+=this.getInnerText(o,maxt,st);}
catch(e)
{throw(rT);}},this);return rT;},getContentEncoding:function()
{var e='';try
{$iTXT.core.$A(document.getElementsByTagName('META')).itxtEach(function(o)
{if(o.content)
{var c=o.content.toLowerCase(),o=c.indexOf('charset=');if(o>=0)
{var re=/([\w\-]+)/,s=re.exec(c.substring(o+8));if(s)
{e=s[0];}}}},this);}
catch(x){}
return e;},toArray:function(obj)
{var retArr=[];var pS=Object.prototype.toString.call(obj);var className=pS.substring(pS.indexOf(' ')+1,pS.indexOf(']'));if("NodeList"==className)
{for(var i=0,len=obj.length;i<len;i++)
{retArr[retArr.length]=obj[i];}}
return retArr;},openUrl:function(url,cts)
{if(cts)
{this._changeLocation(url);}
else
{var blocked=false;var windowName='swnd_'+Math.floor(Math.random()*50);var windowHandle=null;try
{var winOpts=$iTXT.glob.params.get("open.win.opts","");windowHandle=window.open(url,windowName,winOpts);}
catch(e)
{blocked=true;}
if(windowHandle)
{var t=this;window.setTimeout(function()
{t._chkWindow(windowHandle,url);},50);}
else
{blocked=true;}
if(blocked)
{this._changeLocation(url);}}},_chkWindow:function(w,url)
{var clsd=0;try
{clsd=w.closed;}
catch(e){}
if(!w||clsd||($iTXT.core.Browser.is("Opera")&&null==w.name))
{this._changeLocation(this.url);}},_changeLocation:function(url)
{var deferrers=[];var cbFunc=function()
{deferrers.shift();if(deferrers.length==0)
{document.location=url;}};var deferFunc=function(src)
{deferrers[deferrers.length]=src;}
$iTXT.fire("$iTXT:location:change",{defer:deferFunc,cb:cbFunc});if(deferrers.length==0)
{document.location=url;}},parseFlashAdxParameters:function(advert)
{var adxParams={};var adx=advert.params.get("ADX");if(adx&&adx.indexOf("^^")!=-1)
{var adxComps=adx.split("^^");var i=adxComps.length;while(i--)
{var adxP=adxComps[i];if(-1!=adxP.indexOf(':'))
{var adxPname=adxP.substring(0,adxP.indexOf(':'));if("bg"==adxPname)
{adxPname="fl.bg";}
var adxPvalue=adxP.substring(adxP.indexOf(':')+1);adxParams[adxPname]=adxPvalue;advert.params.set(adxPname,adxPvalue,$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);}}}
else if(adx)
{var adxParts=this.decodeQueryString(adx);for(var key in adxParts)
{var pName=key;if("bg"==pName)
{pName="fl.bg";}
advert.params.set(pName,decodeURIComponent(adxParts[key]),$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);}}},getQryPair:function(key,params)
{if(key&&params)
{var name=key;var qName=key;if(this.isArray(key))
{name=key[1];qName=key[0];}
var val=params.get(name);if(val!=null)
{return qName+"="+encodeURIComponent(val);}}
return"";},generateQueryString:function(keys,params)
{var retStr="";for(var i=0,len=keys.length;i<len;i++)
{var key=keys[i];var pair=this.getQryPair(key,params);if(null!=pair&&""!=pair)
{if(i>0)
{retStr+="&";}
retStr+=pair;}}
return retStr;},validHexColor:function(c)
{var rS=c;if(c&&'string'==typeof c)
{if("#"!=c.charAt(0))
{if(c.match($iTXT.core.Regex.hexColor))
{rS="#"+c;}}}
return rS;},getText:function(n)
{if(n)
{return this.cleanString(n.innerText||n.textContent);}
return"";},getTagName:function(t)
{if(t.charAt(0)=="<")
{t=t.substring(1);}
if(t.indexOf(">")!=-1)
{t=t.substring(0,t.indexOf(">"));}
if(t.charAt(t.length-1)=="/")
{t=t.substring(0,t.length-1);}
return t;},hasCapitals:function(s)
{return null!=s.match(/[A-Z\u00C0-\u00D6\u00D8-\u00DF\u0401-\u042F\u0386\u0388-\u03AB]/);},hasPunctuation:function(s)
{return null!=s.match(/[-!\"#$%&\'()*+,.\/:;<=>?@[\\\]^_`{|}~]/);},isCapitalisedSubTerm:function(t,s,e)
{var kw=t.substring(s,e);if(!this.hasCapitals(kw.substring(0,1)))
{$iTXT.debug.Util.msg('<b style="color:#ff6600">isCapitalisedSubTerm:</b> <b>PASSED</b> keyword <b>"'+kw+'"</b> as it is itself not capitalised.');return false;}
var ssS=Math.max(0,t.lastIndexOf(' ',s-2)+1);var ssE=Math.min(t.indexOf(' ',e+2),t.length);var bef=(s>ssS)?this.cleanString(t.substring(ssS,s)):null;var aft=(ssE>e)?this.cleanString(t.substring(e,ssE)):null;if(bef&&this.hasPunctuation(bef.substr((bef.length-1),1)))
{bef=null;}
if(aft&&this.hasPunctuation(aft.substr(0,1)))
{aft=null;}
var subT=t.substring(((s>ssS)?ssS:s),((ssE>e)?ssE:e));if((bef&&this.hasCapitals(bef.substring(0,1)))||(aft&&this.hasCapitals(aft.substring(0,1))))
{$iTXT.debug.Util.msg('<b style="color:#ff6600">isCapitalisedSubTerm:</b> <b>REJECTED</b> keyword <b>"'+kw+'"</b> as containing text <b>"'+subT+'"</b> has capitalised terms.');return true;}
$iTXT.debug.Util.msg('<b style="color:#ff6600">isCapitalisedSubTerm:</b> <b>PASSED</b> keyword <b>"'+kw+'"</b> against containing text <b>"'+subT+'"</b>.');return false;},nodeIndex:function()
{var pn=n.parentNode;if(n&&pn)
{for(var i=0,len=pn.childNodes.length;i<len;i++)
{if(pn.childNodes[i]==n)
{return i;}}}
return-1;},parseInt:function(s,def)
{try
{return parseInt(s);}
catch(e){}
return def;},nativeLog:function(logType,logOpts)
{var fbDb=((($iTXT.glob.dbgParams&&$iTXT.glob.dbgParams.get('firebugdb'))?$iTXT.glob.dbgParams.get('firebugdb'):-1)+"").toLowerCase();fbDb=('all'==fbDb)?[logType.value+""]:fbDb.split(',');if((this.inArray(fbDb,logType.value+"")||this.inArray(fbDb,logType.name.toLowerCase()))&&'string'==typeof logOpts)
{if((window.console&&console.log)||(this.console&&typeof console.log!="undefined"))
{console.log(logOpts.replace(/\&nbsp\;/g,' ').replace(/<br(\s*\/)>/gi,'\n').replace(/<[^>]+>/g,'').replace(/\&lt\;/g,'<').replace(/\&gt\;/g,'>'));}
return true;}
return false},parseAdExtensions:function(adx)
{var ro={};var adxPairs=[adx];if(null!=adx&&adx.indexOf("^^")!=-1)
{adxPairs=adx.split("^^");}
for(var i=0;i<adxPairs.length;i++)
{var pair=adxPairs[i];if(null!=pair&&-1!=pair.indexOf(':'))
{var pairArr=pair.split(":");if(pairArr.length==2)
{ro[pairArr[0]]=pairArr[1];}}}
return ro;},parseBool:function(s)
{return("1"==s||"true"==s||true===s);},getStyle:function(e,s)
{if(e.currentStyle)
{return e.currentStyle[s];}
else if(window.getComputedStyle)
{return document.defaultView.getComputedStyle(e,null).getPropertyValue(s);}
return"";},parsePixels:function(s)
{try
{s=s.replace("px","");var r=parseInt(s);if(!isNaN(r))
{return r}}
catch(e)
{}
return 0;},loadTemplate:function(name,callback)
{var subscribeArray=[];var unSubscribeFunc=null;var t=this;$iTXT.subscribe("$iTXT:tmpl:load",function()
{if($iTXT.tmpl.loader['$iTXT.tmpl.js.'+name])
{if(t.isFunction(callback))
{callback();}
if(t.isFunction(unSubscribeFunc))
{unSubscribeFunc();}}},subscribeArray);unSubscribeFunc=subscribeArray.pop();$iTXT.tmpl.dependsOn(name,false);}}
$iTXT.core.Util.init();}
$iTXT.js.loader["$iTXT.core.Array"]=true;$iTXT.core.Array_Load=function(){var undefined;$iTXT.core.$A=function(arr){if(!arr)
return null;if((arr.itxt&&arr.itxt.arrayExtended)||!$iTXT.core.Util.isArray(arr))
{return arr;}
else
{arr=$iTXT.core.Util.extend(arr,$iTXT.core.Array);arr.itxt={};arr.itxt.arrayExtended=true;return arr;}}
$iTXT.core.Array={itxtEach:function(f,src)
{src=src||this;if('function'==typeof f)
{for(var i=0,len=this.length;i<len;i++)
{if(f.apply(src,[this[i],i,len]))
{break;}}}
return this;}};}
$iTXT.js.loader["$iTXT.core.Browser"]=true;$iTXT.core.Browser_Load=function(){var undefined;$iTXT.core.Browser={_browsers:[{s:navigator.userAgent,ss:"Chrome",id:"Chrome"},{s:navigator.userAgent,ss:"OmniWeb",vt:"OmniWeb/",id:"OmniWeb"},{s:navigator.vendor,ss:"Apple",id:"Safari",vt:"Version"},{prop:window.opera,id:"Opera"},{s:navigator.vendor,ss:"iCab",id:"iCab"},{s:navigator.vendor,ss:"KDE",id:"Konqueror"},{s:navigator.userAgent,ss:"Firefox",id:"Firefox"},{s:navigator.vendor,ss:"Camino",id:"Camino"},{s:navigator.userAgent,ss:"Netscape",id:"Netscape"},{s:navigator.userAgent,ss:"MSIE",id:"Explorer",vt:"MSIE"},{s:navigator.userAgent,ss:"Gecko",id:"Mozilla",vt:"rv"},{s:navigator.userAgent,ss:"Mozilla",id:"Netscape",vt:"Mozilla"}],useragent:"",version:0.0,performance:0,ie7orlessmode:0,quirksMode:0,_versionTemplate:"",featureSupport:{},pfx:['-o-','-moz-','-ms-','-webkit-','-khtml-'],bpfx:['Webkit','Moz','O','ms','Khtml'],init:function()
{this.useragent=this._getUserAgent(this._browsers)||"Unknown User Agent";this.version=this._getVersion(navigator.userAgent)||this._getVersion(navigator.appVersion)||"Unkown Version";this.performance=this._performanceCheck();var ie7compat=(document.documentMode&&document.documentMode==7);var ie7orless=this.is("Explorer",7,2);this.ie7orlessmode=ie7compat||ie7orless;this.ie8CompatMode=ie7compat;this.quirksMode=this._quirksMode();this._detectFeatureSupport();},supportsFeature:function()
{for(var i=0;i<arguments.length;i++)
{var feature=arguments[i];if(!this.featureSupport[feature]||false===this.featureSupport[feature])
{return false;}}
return true;},_detectFeatureSupport:function()
{var elmt=document.createElement("itxtelmt");this.style=elmt.style;var tests={};tests['cssgradients']=function()
{var s1='background-image:',s2='gradient(linear,left top,right bottom,from(black),to(white));',s3='linear-gradient(left top, black, white);';this._css
((s1+this.pfx.join(s2+s1)+this.pfx.join(s3+s1)).slice(0,-s1.length));return this._hasCss(this.style.backgroundImage,'gradient');};tests['cssborderradius']=function()
{return this._testCssProperty("borderRadius");};tests['dommutationevents']=function()
{return!!(document.implementation.hasFeature('MutationEvents','2.0')||undefined!=window.MutationEvent);};tests['propertychangeevent']=function()
{return this._testEventSupport('propertychange',elmt);};for(var testName in tests)
{this.featureSupport[testName]=tests[testName].call(this);}},_testEventSupport:function(evt,elmt)
{evt='on'+evt;var s=(evt in elmt);if(!s)
{elmt.setAttribute(evt,'return;');s=!!('function'==typeof elmt[evt]);}
return s;},_css:function(t)
{this.style.cssText=t;},_testCssProperty:function(p)
{var ucp=p.charAt(0).toUpperCase()+p.substring(1);if(this.style[p]!==undefined)
{return true;}
for(var i=0;i<this.bpfx.length;i++)
{var pfx=this.bpfx[i];if(this.style[pfx+ucp]!==undefined)
{return true;}}
return false;},_hasCss:function(s,sb)
{return(''+s).indexOf(sb)!==-1;},_quirksMode:function()
{if(!this.is("Explorer"))
{return false;}
var mode=document.compatMode;if("BackCompat"==mode)
{return true;}
return false;},_getUserAgent:function(d)
{for(var i=0;i<d.length;i++)
{var str=d[i].s;var prop=d[i].prop;this._versionTemplate=d[i].vt||d[i].id;if(str)
{if(str.indexOf(d[i].ss)!=-1)
return d[i].id;}
else if(prop)
{return d[i].id;}}},_getVersion:function(uas){var index=uas.indexOf(this._versionTemplate);return(index==-1)?undefined:parseFloat(uas.substring(index+this._versionTemplate.length+1));},is:function(ua,v,mode)
{var isVer=true;if(v)
{if(mode&&1==mode)
{isVer=(this.version>=v);}
else if(mode&&2==mode)
{isVer=(this.version<=v);}
else if(mode&&3==mode)
{isVer=(this.version>v);}
else if(mode&&4==mode)
{isVer=(this.version<v);}
else
{isVer=(v==this.version);}}
return(ua==this.useragent)&&isVer;},_performanceCheck:function()
{var rperf=50;if("Explorer"==this.useragent)
{if(this.version<6)
{rperf=50;}
else if(this.version<7)
{rperf=60;}
else if(this.version<8)
{rperf=80;}
else if(this.version<9)
{rperf=80;}}
else if("Firefox"==this.useragent)
{if(this.version<2)
{rperf=60;}
else if(this.version<3)
{rperf=70;}
else if(this.version<4)
{rperf=85;}
else if(this.version<5)
{rperf=95;}}
else if("Firefox"==this.useragent)
{if(this.version<2)
{rperf=60;}
else if(this.version<3)
{rperf=70;}
else if(this.version<4)
{rperf=90;}}
else if("Chrome"==this.useragent)
{if(this.version<2)
{rperf=70;}
else if(this.version<3)
{rperf=80;}
else if(this.version<4)
{rperf=98;}}
return rperf;},isIE7OrLessMode:function()
{return this.ie7orlessmode;},isQuirksMode:function()
{return this.quirksMode;}}
$iTXT.core.Browser.init();}
$iTXT.js.loader["$iTXT.core.Builder"]=true;$iTXT.core.Builder_Load=function(){var undefined;var pixelImage="http://images.intellitxt.com/ast/tt/09/px.gif";$iTXT.core.Util.cacheImage(pixelImage);$iTXT.core.Builder={NODEMAP:{AREA:'map',CAPTION:'table',COL:'table',COLGROUP:'table',LEGEND:'fieldset',OPTGROUP:'select',OPTION:'select',PARAM:'object',TBODY:'table',TD:'tr',TFOOT:'table',TH:'table',THEAD:'table',TR:'table'},make:function(tagName,attrs,children,doc)
{var documentContext=doc||document;var tagName=tagName.toUpperCase();var apngMode=false;var apngSrc="";if("APNG"==tagName)
{tagName="IMG";if(window.ActiveXObject)
{apngMode=true;apngSrc=attrs.src;attrs.src=pixelImage;}}
var parentTagName=this.NODEMAP[tagName]||'div';var parentTag=documentContext.createElement(parentTagName);try{parentTag.innerHTML="<"+tagName+"></"+tagName+">";}catch(e){}
var element=parentTag.firstChild||null;if(element&&(element.tagName.toUpperCase()!=tagName))
element=element.getElementsByTagName(tagName)[0];if(!element)element=documentContext.createElement(tagName);if(!element)return;if(attrs)
{var attrString=this._attributes(attrs);if(attrString.length){try{parentTag.innerHTML="<"+tagName+" "+attrString+"></"+tagName+">";}
catch(e){}
element=parentTag.firstChild||null;if(!element){element=documentContext.createElement(tagName);var classAdded=false;for(attr in attrs)
{try
{element[attr]=attrs[attr];}
catch(ex2)
{element.setAttribute(attr,attrs[attr]);}}}
if(element.tagName.toUpperCase()!=tagName)
element=parentTag.getElementsByTagName(tagName)[0];}}
if(children)
{this._children(element,children,documentContext);}
if(apngMode)
{element.itxtChangeSrc=function(s)
{var pngImg=new Image();pngImg.onload=function()
{element.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+s+"',sizingMethod='image')";element.style.width=pngImg.width+"px";element.style.height=pngImg.height+"px";}
pngImg.src=s;};element.itxtChangeSrc(apngSrc);}
else
{element.itxtChangeSrc=function(s)
{element.src=s;}}
var rstClass="itxtrst itxtrst"+tagName.toLowerCase();if(""!=element.className)
{element.className=rstClass+" "+element.className;}
else
{element.className=rstClass;}
return $iTXT.core.$(element);},_children:function(element,children,documentContext)
{for(var i=0;i<children.length;i++)
{if('string'==typeof children[i]||'number'==typeof children[i])
{var span=documentContext.createElement("SPAN");span.innerHTML=children[i];var x=0;while(span.firstChild)
{element.appendChild(span.firstChild);x++;if(x>10000)
{break;}}}
else
{element.appendChild(children[i]);}}},_attributes:function(attributes)
{var attrs=[];for(attribute in attributes)
{var an=(attribute=="className")?"class":attribute;attrs.push(an+'="'+attributes[attribute]+'"');}
return attrs.join(" ");}}}
$iTXT.js.loader["$iTXT.core.Class"]=true;$iTXT.core.Class_Load=function(){var undefined;$iTXT.core.Class={create:function()
{var parent=null;var properties=arguments[0];if('function'==typeof properties)
{parent=properties;properties=arguments[1];}
properties["itxtClass"]=true;function _newClass()
{this.init.apply(this,arguments);}
if(null!=parent)
{var parentClass=function(){};parentClass.prototype=parent.prototype
_newClass.prototype=new parentClass;}
for(var p in properties)
{this._addProperty(_newClass,p,properties[p],parent);}
return _newClass;},_addProperty:function(_class,_property,_value,_parent)
{if('function'==typeof _value&&_parent&&undefined!=_parent.prototype[_property])
{var parentArguments=_parent.length;var _oldValue=_value;_value=function()
{var _instance=this;var _newArgs=$iTXT.core.Util.args(arguments);var _super=function()
{return _parent.prototype[_property].apply(_instance,arguments);}
_newArgs.push(_super)
return _oldValue.apply(this,_newArgs);}}
_class.prototype[_property]=_value;}}}
$iTXT.js.loader["$iTXT.core.Dom"]=true;$iTXT.core.Dom_Load=function(){var undefined;var $itxtUtil=$iTXT.core.Util;$iTXT.fire=function()
{var elmt=$iTXT.core.$(document);elmt.itxtFire.apply(elmt,$iTXT.core.Util.args(arguments));}
$iTXT.subscribe=function()
{var elmt=$iTXT.core.$(document);elmt.itxtSubscribe.apply(elmt,$iTXT.core.Util.args(arguments));}
$iTXT.core.$=function(elmt,dontExt,documentContext)
{documentContext=documentContext||document;if('string'==typeof elmt)
{elmt=documentContext.getElementById(elmt);}
if(!elmt)
return null;if(dontExt||(elmt.itxt&&elmt.itxt.domExtended))
{return elmt;}
else
{elmt=$itxtUtil.extend(elmt,$iTXT.core.Dom);elmt.itxt={};elmt.itxt.domExtended=true;return elmt;}}
$iTXT.core.$X=function(elmt,documentContext)
{documentContext=documentContext||document;if('string'==typeof elmt)
{elmt=documentContext.getElementById(elmt);}
elmt.itxt=undefined;for(var prop in $iTXT.core.Dom)
{elmt[prop]=undefined;}
return elmt;}
$iTXT.core.Dom={iTXTEvents:{},itxtFire:function(type,data)
{$iTXT.core.Event.fire(this,type,data);return this;},itxtSubscribe:function(type,handler,disposeArray)
{var removeFunc=$iTXT.core.Event.subscribe(this,type,handler);if($itxtUtil.isArray(disposeArray))
{disposeArray.push(removeFunc);}
return this;},itxtBatchSubscribe:function(events,disposeArray)
{if($itxtUtil.isArray(events))
{for(var i=0;i<events.length;i++)
{var pair=events[i];if(pair.length==2)
{var type=pair[0];var handler=pair[1];this.itxtSubscribe(type,handler,disposeArray);}}}
return this;},itxtUnSubscribe:function(type,handler)
{$iTXT.core.Event.unsubscribe(this,type,handler);return this;},itxtAddClass:function(addClass,removeClass)
{if(this.className)
{var cNs=this.className.split(' ');var newCNs=[];for(var i=0;i<cNs.length;i++)
{var cn=cNs[i];if(cn!=removeClass&&cn!=addClass)
{newCNs.push(cn);}}
newCNs.push(addClass);this.className=newCNs.join(' ');}
else
{this.className=addClass;}
return this;},itxtRemoveClass:function(removeClass)
{if(this.className)
{var cNs=this.className.split(' ');var newCNs=[];for(var i=0;i<cNs.length;i++)
{var cn=cNs[i];if(cn!=removeClass)
{newCNs.push(cn);}}
this.className=newCNs.join(' ');}
return this;},itxtSetStyle:function(styles,removeStyles)
{if(removeStyles)
{for(s in removeStyles)
{this.style[s]="";}}
if('string'==typeof styles)
{return this.style.cssText+=";"+styles;}
for(s in styles)
{try
{if("cursor"==s&&"pointer"==styles[s])
{try
{this.style[s]="pointer";}
catch(se)
{this.style[s]="hand";}}
else
{this.style[s]=styles[s];}}
catch(e)
{}}
return this;},itxtSetAttribute:function(atts)
{for(attribute in atts)
{this[attribute]=atts[attribute];}
return this;},itxtHide:function()
{if(this.style.display!="none")
{this.itxt.display=this.style.display||"";this.style.display="none";}
this.style.visibility="hidden";return this;},itxtShow:function()
{this.style.display=this.itxt.display||"";this.style.visibility="visible";return this;},itxtOpacity:function(o)
{if(window.ActiveXObject)
{this.style['filter']="alpha(opacity="+Math.round(100*o)+");";}
else
{this.style.mozOpacity=o;this.style.opacity=o;}
return this;},itxtAppendChildren:function(children)
{var cl=children.length;for(var i=0;i<cl;i++)
{this.itxtAppendChild(children[i]);}
return this;},itxtAppendChild:function(child)
{if('string'==typeof child)
{this.appendChild(document.createTextNode(child));}
else if(child.nodeType&&$itxtUtil.ELEMENT_NODE==child.nodeType)
{this.appendChild(child);}},itxtClear:function()
{while(this.firstChild)
{this.removeChild(this.firstChild);}},itxtRemoveNode:function()
{try
{if(this.offsetParent)
{this.offsetParent.removeChild(this);}}
catch(e)
{}},itxtTotalOffset:function()
{var element=this;var t=0;var l=0;do
{if((element==document.body)&&("relative"!=element.style.position))
{l+=element.offsetLeft;t+=element.offsetTop;}
else if(element!=document.body)
{l+=element.offsetLeft;t+=element.offsetTop;}
element=element.offsetParent;}
while(element)
var retArr=[l,t];retArr.left=l;retArr.top=t;return retArr;},itxtBounds:function()
{var nOff=this.itxtTotalOffset();var b={left:nOff.left,top:nOff.top,width:this.offsetWidth,height:this.offsetHeight};return b;}}}
$iTXT.js.loader["$iTXT.core.Event"]=true;$iTXT.core.Event_Load=function(){var undefined;$iTXT.core.Event={bind:function(source,func)
{return function()
{source.itxtThis=this;return func.apply(source,arguments);}},nsUID:0,subscribe:function(elmt,type,handler)
{elmt=$iTXT.core.$(elmt);var eventName=type;var eventUID=type;if(type.indexOf('.')!=-1)
{var splt=type.split('.');eventName=splt.pop();}
else
{eventUID="evt"+this.nsUID+++"."+eventName;}
var custom=eventName.charAt(0)=='$';if(custom)
{this._addEvt(elmt,eventName,eventUID,handler);}
else
{var intHandler=function(e)
{var newE=e||event;try
{if(!newE.pageX&&!newE.pageY)
{newE.pageX=newE.clientX-document.body.scrollLeft;newE.pageY=newE.clientY-document.body.scrollTop;}}catch(e){}
if(!newE.target&&newE.srcElement)
{newE.target=newE.srcElement;}
try
{if(3==newE.target.nodeType)
{newE.target=newE.target.parentNode;}}catch(exc){}
newE.stop=function()
{newE.cancelBubble=true;if(newE.stopPropagation)
{newE.stopPropagation();}}
if(null!=handler)
{var rv=handler.apply(elmt,[newE]);if(false===rv)
{if(e.preventDefault)
{e.preventDefault();}
e.returnValue=false;}
return rv;}};if(elmt.addEventListener)
{elmt.addEventListener(eventName,intHandler,false);}
else if(elmt.attachEvent)
{elmt.attachEvent("on"+eventName,intHandler);}}
this._addEvt(elmt,eventName,eventUID,handler,intHandler);var t=this;var remFunc=function()
{t.unsubscribe(elmt,eventUID,handler);}
return remFunc;},_addEvt:function(elmt,eventName,eventUID,handler,intHandler)
{var handlers=elmt.iTXTEvents[eventName]||{};handlers[eventUID]={handler:handler,intHandler:intHandler}
elmt.iTXTEvents[eventName]=handlers;},_removeEvt:function(elmt,eventName,eventUID,eventHandler)
{var handlers=elmt.iTXTEvents[eventName]||{};var newHandlers={};for(handler in handlers)
{if(handler!=eventUID&&handlers[handler].handler!=eventHandler)
{newHandlers[handler]=handlers[handler];}}
elmt.iTXTEvents[eventName]=newHandlers;},_getInternalHandler:function(elmt,eventName,eventUID,eventHandler)
{var handlers=elmt.iTXTEvents[eventName]||{};for(handler in handlers)
{if(handlers[handler].handler==eventHandler)
{return handlers[handler].intHandler;}}
return null;},unsubscribe:function(elmt,eventUID,handler)
{elmt=$iTXT.core.$(elmt);var eventName=eventUID;if(eventUID.indexOf('.')!=-1)
{var splt=eventUID.split('.');eventName=splt.pop();}
var custom=eventName.charAt(0)=='$';if(!custom)
{var intH=this._getInternalHandler(elmt,eventName,eventUID,handler);if(null!=intH)
{if(elmt.removeEventListener)
elmt.removeEventListener(eventName,intH,false);else if(elmt.detachEvent)
elmt.detachEvent("on"+eventName,intH);}}
this._removeEvt(elmt,eventName,eventUID,handler);},fire:function(elmt,eventName,data)
{if($iTXT.debug.Util.isLoggingOn())
{$iTXT.debug.trace($iTXT.debug.Category.EVENT,"<b><i>"+eventName+"</i></b> fired ("+$iTXT.core.Util.serialiseJSON(data)+")");}
elmt=$iTXT.core.$(elmt);var custom=eventName.charAt(0)=='$';var handlers=elmt.iTXTEvents[eventName]||{};var event={data:data||{}}
for(handler in handlers)
{if('function'==typeof handlers[handler].handler)
{handlers[handler].handler.apply(elmt,[event]);}}
if(eventName&&"$iTXT:console:log"!=eventName)
{}},preventDefault:function(e)
{if(e&&e.preventDefault)e.preventDefault();else if(window.event)window.event.returnValue=false;},stop:function(e)
{if(e&&e.stopPropagation)e.stopPropagation();else if(window.event)window.event.cancelBubble=true;}}}
$iTXT.js.loader["$iTXT.core.Flash"]=true;$iTXT.core.Flash_Load=function(){var undefined;$iTXT.core.Flash={init:function()
{this.version=this.getFlashVersion();},supports:function(maj,min,rev)
{maj=maj||6;min=min||0;rev=rev||0;if(this.version.major>=maj)
{if(this.version.minor>=min)
{if(this.version.revision>=rev)
{return true;}}}
return false;},getFlashVersion:function()
{var versionDims=[0,0,0];if(navigator.plugins&&navigator.mimeTypes.length)
{var fp=navigator.plugins["Shockwave Flash"];if(fp&&fp.description)
{versionDims=fp.description.replace(/([a-zA-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split('.');}}
else
{try
{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");}
catch(e)
{try
{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");versionDims=[6,0,21];axo.AllowScriptAccess="always";}
catch(e)
{if(0==versionDims[0])
{try
{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");}catch(e){}}
else if(6==versionDims[0])
{axo=null;}}}
if(null!=axo)
{versionDims=axo.GetVariable("$version").split(" ")[1].split(",");}}
var rV={major:versionDims[0],minor:versionDims[1],revision:versionDims[2]};return rV;}}
$iTXT.core.Flash.init();}
$iTXT.js.loader["$iTXT.core.Math"]=true;$iTXT.core.Math_Load=function(){var undefined;var $itxtUtil=$iTXT.core.Util;$iTXT.core.Math={intersects:function(r1,r2)
{var l=(r1.left>r2.left)?r1.left:r2.left;var t=(r1.top>r2.top)?r1.top:r2.top;var r=((r1.left+r1.width)<(r2.left+r2.width))?(r1.left+r1.width):(r2.left+r2.width);var b=((r1.top+r1.height)<(r2.top+r2.height))?(r1.top+r1.height):(r2.top+r2.height);return(l<r&&t<b);},intersectsPercentage:function(r1,r2)
{var l=(r1.left>r2.left)?r1.left:r2.left;var t=(r1.top>r2.top)?r1.top:r2.top;var r=((r1.left+r1.width)<(r2.left+r2.width))?(r1.left+r1.width):(r2.left+r2.width);var b=((r1.top+r1.height)<(r2.top+r2.height))?(r1.top+r1.height):(r2.top+r2.height);if(l<r&&t<b)
{var w=r-l;var h=b-t;var area=w*h;var r1Area=r1.width*r1.height;return area/r1Area;}
return 0;},arrayMax:function(inA,rnd)
{if(!$itxtUtil.isArray(inA)||inA.length==0)
{return null;}
var max=0;for(var i=0;i<inA.length;i++)
{if(!isNaN(inA[i]))
{if(0==max||inA[i]>max)
{max=inA[i];}}}
if(rnd)
{return Math.round(max);}
else
{return max;}},arrayMin:function(inA,rnd)
{if(!$itxtUtil.isArray(inA)||inA.length==0)
{return null;}
var min=0;for(var i=0;i<inA.length;i++)
{if(!isNaN(inA[i]))
{if(0==min||inA[i]<min)
{min=inA[i];}}}
if(rnd)
{return Math.round(min);}
else
{return min;}},arrayMean:function(inA,rnd)
{if(!$itxtUtil.isArray(inA)||inA.length==0)
{return null;}
var tot=0,len=0;for(var i=0;i<inA.length;i++)
{if(!isNaN(inA[i]))
{tot+=inA[i];len++;}}
var mean=tot/len;if(rnd)
{return Math.round(mean);}
else
{return mean;}},arrayMedian:function(inA,rnd)
{if(!$itxtUtil.isArray(inA)||inA.length==0)
{return null;}
inA.sort(function(a,b){return(a-b);});var middle=Math.round(inA.length/2);var median=inA[middle];if(rnd)
{return Math.round(median);}
else
{return median;}}};}
$iTXT.js.loader["$iTXT.core.Regex"]=true;$iTXT.core.Regex_Load=function()
{var undefined;$iTXT.core.Regex={hexColor:new RegExp("^([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?$"),tagSrc:new RegExp("\\b(src)=\"([^\"]*)\"","i"),tagWidth:new RegExp("\\b(width)=\"([^\"]*)\"","i"),tagHeight:new RegExp("\\b(height)=\"([^\"]*)\"","i"),stripTags:new RegExp("(<([^>]+)>)","gi"),stripNotImgBrScriptTags:new RegExp("(<(?!img|br|script|/script)([^>]+)>)","gi"),stripNotImgBrStrongItalicScriptTags:new RegExp("(<(?!strong|em|b|i|img|br|script|/script)([^>]+)>)","gi")};}