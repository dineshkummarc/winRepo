/* This source code is Copyright (c) Vibrant Media 2001-2011 and forms part of the patented Vibrant Media product "IntelliTXT" (sm). */ 
$iTXT.js.loader["$iTXT.tmpl.Row"]=true;$iTXT.tmpl.Row_Load=function(){var undefined;$iTXT.tmpl.Row=$iTXT.core.Class.create($iTXT.tmpl.ElementBase,{cells:null,init:function(_options,ad,$super)
{var defOpts=$iTXT.core.Util.extend({id:$iTXT.tmpl.ElementIdentifier.get("itxtrow"),className:"itxtrow"},_options);$super(defOpts,ad);this.cells=[];if(this.options.structure)
{this._build(this.options.structure,ad);}},dispose:function($super)
{if(null!=this.cells)
{for(var i=0;i<this.cells.length;i++)
{this.cells[i].dispose();}}
$super();},_build:function(s,ad)
{for(var i=0;i<s.length;i++)
{if(s[i].type&&'cell'==s[i].type)
{var c=new $iTXT.tmpl.Cell(s[i],ad);c.parentNode=this.rootElement;this.cells.push(c);this.rootElement.appendChild(c.rootElement);}}},_resize:function(w,h)
{$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"Resizing Row ("+this.options.id+")",this);if(null!=this.cells)
{var tw=0;var ecs=0;for(var i=0;i<this.cells.length;i++)
{var c=this.cells[i];if(c.fillWidth)
{ecs++;}
else if(c.contentWidth)
{var dims=c.neededSize(w,h);c.width=dims[0];tw+=dims[0];}
else
{tw+=c.width;}}
var rw=w-tw;var ecw=(0==ecs)?0:Math.floor(Math.max(rw/ecs,0));$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"<b>Row Columns:</b>",this);$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"Total width: "+w+"px, Fixed cells width: "+tw+"px, Remaning width: "+rw+"px",this);$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"Total dynamic cells: "+ecs+", Each allowed: "+ecw+"px",this);if(this.cells.length>0)
{w=0;for(var i=0;i<this.cells.length;i++)
{var c=this.cells[i];var cw=(c.fillWidth)?ecw:c.width;var celldim=c.resize(cw,h);c.position(w,0);h=(celldim[1]>h)?celldim[1]:h;w+=(celldim[0]>cw)?celldim[0]:cw;}}}
return[w,h];},_neededSize:function(w,h)
{if(this.contentHeight)
{var tw=0;var ecs=0;for(var i=0;i<this.cells.length;i++)
{var c=this.cells[i];if(c.fillWidth)
{ecs++;}
else if(c.contentWidth)
{var dims=c.neededSize(w,h);c.width=dims[0];tw+=dims[0];}
else if(!c.contentWidth)
{tw+=c.width;}}
var rw=w-tw;var ecw=(0==ecs)?0:Math.floor(Math.max(rw/ecs,0));h=0;for(var i=0;i<this.cells.length;i++)
{var c=this.cells[i];var cwa=(c.fillWidth)?ecw:w;var cdims=c.neededSize(cwa,h);h=(cdims[1]>h)?cdims[1]:h;}}
return[w,h];},needsResize:function(w,h,$super)
{if((null!=this.cells)&&(0<this.cells.length))
{for(var i=0;i<this.cells.length;i++)
{if(this.cells[i].needsResize(w,h))
{return true;}}}
return $super(w,h);},isLoaded:function()
{if(this.cells.length>0)
{for(var i=0;i<this.cells.length;i++)
{if(!this.cells[i].isLoaded())
{return false;}}}
return true;}});}
$iTXT.js.loader["$iTXT.tmpl.Input"]=true;$iTXT.tmpl.Input_Load=function(){var undefined;$iTXT.tmpl.Input=$iTXT.core.Class.create($iTXT.tmpl.ElementBase,{init:function(_options,ad,$super)
{var defOpts=$iTXT.core.Util.extend({id:$iTXT.tmpl.ElementIdentifier.get("itxtInput")},_options);$super(defOpts,ad);this.input=$iTXT.core.Builder.make("INPUT",{id:this.options.id+"Input",type:this.properties.type||"text",value:this.properties.value||""});this.inputDiv=$iTXT.core.Builder.make("DIV",{id:this.options.id+"InputDiv"},[this.input]);this.rootElement.itxtAppendChild(this.inputDiv);this._applyStyles();if(this.events.onclick)
{this.input.onclick=this.events.onclick;}
if("text"==this.properties.type)
{this.input.itxtSubscribe("keyup",$iTXT.core.Event.bind(this,this.keyUp));}},_applyStyles:function()
{if(this.options.styles&&this.input)
{this.input.itxtSetStyle(this.options.styles);}},_resize:function(w,h,$super)
{this.input.itxtSetStyle({width:"",height:""});this.inputDiv.itxtSetStyle({width:"",height:"",display:""});if(this.fillWidth)
{this.input.itxtSetStyle({width:w+"px"});this.inputDiv.itxtSetStyle({width:"",height:"",display:"inline"});var wD=this.inputDiv.offsetWidth-w;if(wD>0)
{this.input.itxtSetStyle({width:(w-wD)+"px"});}
this.inputDiv.itxtSetStyle({display:""});}
if(this.fillHeight)
{this.input.itxtSetStyle({height:h+"px"});this.inputDiv.itxtSetStyle({width:"",height:"",display:"inline"});var hD=this.inputDiv.offsetHeight-h;if(hD>0)
{this.input.itxtSetStyle({height:(h-hD)+"px"});}
this.inputDiv.itxtSetStyle({display:""});}
return $super(w,h);},_neededSize:function(w,h,$super)
{if(this.events.neededSize)
{return this.events.neededSize.apply(this,[w,h]);}
this.inputDiv.itxtSetStyle({width:"",height:""});var newW=w;var newH=h;this.input.itxtSetStyle({width:"",height:""});this.inputDiv.itxtSetStyle({width:"",height:"",display:"inline"});if(!this.fillWidth)
{newW=this.inputDiv.offsetWidth;}
if(!this.fillHeight)
{newH=this.inputDiv.offsetHeight;}
this.inputDiv.itxtSetStyle({display:""});return $super(newW,newH);},_onMouseOver:function(e)
{if(this.options.hoverstyles&&this.input)
{this.input.itxtSetStyle(this.options.hoverstyles);}
if(this.events.onMouseOver)
{this.events.onMouseOver.apply(this,[e]);}},_onMouseOut:function(e)
{if(this.options.hoverstyles&&this.input)
{this.input.itxtSetStyle(this.options.styles,this.options.hoverstyles);}
if(this.events.onMouseOut)
{this.events.onMouseOut.apply(this,[e]);}},keyUp:function(e)
{if(this.events.onEnter&&e.keyCode&&e.keyCode==13)
{this.events.onEnter.apply(this,[e])}}});}
$iTXT.js.loader["$iTXT.tmpl.Iframe"]=true;$iTXT.tmpl.Iframe_Load=function(){var undefined;$iTXT.tmpl.Iframe=$iTXT.core.Class.create($iTXT.tmpl.ElementBase,{mouseOver:false,init:function(_options,ad,$super)
{var defOpts=$iTXT.core.Util.extend({id:$iTXT.tmpl.ElementIdentifier.get("itxtIframe")},_options);this._buildSrc();$super(defOpts,ad);this.properties.src=$iTXT.core.Util.getEmbeddedURL(this.properties.src);this.iframe=$iTXT.core.Builder.make("IFRAME",{id:this.options.id+"Iframe",src:this.properties.src,scrolling:'no',marginheight:0,marginwidth:0,style:"display: block",frameBorder:"0",border:"0"});this.iframeHldr=$iTXT.core.Builder.make("DIV",{id:this.options.id+"IframeHldr",style:"display: inline-block;"},[this.iframe]);this.rootElement.itxtAppendChild(this.iframeHldr);this._applyStyles();this.iframe.itxtBatchSubscribe([["mouseout",$iTXT.core.Event.bind(this,this._onMouseOut)],["mouseover",$iTXT.core.Event.bind(this,this._onMouseOver)]],this.evtDspFuncs);this.iframe.itxtBatchSubscribe([["mousemove",$iTXT.core.Event.bind(this,this._onBodyMouseMove)]],this.evtDspFuncs);},_buildSrc:function()
{},_applyStyles:function()
{if(this.options.styles&&this.iframe)
{this.iframe.itxtSetStyle(this.options.styles);}},_resize:function(w,h,$super)
{this.iframeHldr.itxtSetStyle({width:"",height:""});if(this.properties.width&&this.properties.height)
{this.iframe.itxtSetStyle({width:this.properties.width+"px",height:this.properties.height+"px"});return[this.iframeHldr.offsetWidth,this.iframeHldr.offsetHeight];}
if(this.fillWidth)
{this.iframe.itxtSetStyle({width:w+"px"});var wD=this.iframeHldr.offsetWidth-w;if(wD>0)
{this.iframe.itxtSetStyle({width:(w-wD)+"px"});}}
if(this.fillHeight)
{this.iframe.itxtSetStyle({height:h+"px"});var hD=this.iframeHldr.offsetHeight-h;if(hD>0)
{this.iframe.itxtSetStyle({height:(h-hD)+"px"});}}
return $super(w,h);},_neededSize:function(w,h,$super)
{this.iframeHldr.itxtSetStyle({width:"",height:""});if(this.properties.width&&this.properties.height)
{this.iframe.itxtSetStyle({width:this.properties.width+"px",height:this.properties.height+"px"});return[this.iframeHldr.offsetWidth,this.iframeHldr.offsetHeight];}
return $super(w,h);},_onMouseOut:function(e)
{e.stop();},_onMouseOver:function()
{this.mouseOver=true;},_onBodyMouseMove:function(e)
{if(this.mouseOver)
{$iTXT.core.$(document).itxtFire("$iTXT:tt:iframe:out");this.mouseOver=false;}}});}
$iTXT.js.loader["$iTXT.tmpl.Image"]=true;$iTXT.tmpl.Image_Load=function(){var undefined;$iTXT.tmpl.Image=$iTXT.core.Class.create($iTXT.tmpl.ElementBase,{imageLoaded:false,imageFailed:false,styleWidth:0,styleHeight:0,init:function(_options,ad,$super)
{var initSrc=_options.props.src;var defOpts=$iTXT.core.Util.extend({id:$iTXT.tmpl.ElementIdentifier.get("itxtImage")},_options);$super(defOpts,ad);if(initSrc==this.properties.src||""==this.properties.src)
{this.imageFailed=true;this.imageLoaded=true;}
else
{var imgMode="IMG";if(this.properties.apng)
{imgMode="APNG";}
this.image=$iTXT.core.Builder.make(imgMode,{id:this.options.id+"Image",title:this.properties.title||"",style:"display: inline-block;"});this.image.itxtBatchSubscribe([["load",$iTXT.core.Event.bind(this,this._imageLoad)],["error",$iTXT.core.Event.bind(this,this._imageError)]],this.evtDspFuncs);this.image.src=this.properties.src;this.imageStyle=$iTXT.core.Builder.make("DIV",{id:this.options.id+"ImageStyle",style:""},[this.image]);this.rootElement.itxtAppendChild(this.imageStyle);this._applyStyles();}},_applyStyles:function()
{if(this.options.styles&&this.imageStyle)
{this.imageStyle.itxtSetStyle(this.options.styles);if($iTXT.core.Browser.quirksMode)
{var pL=$iTXT.core.Util.parsePixels($iTXT.core.Util.getStyle(this.imageStyle,"paddingLeft"));var pR=$iTXT.core.Util.parsePixels($iTXT.core.Util.getStyle(this.imageStyle,"paddingRight"));var bL=$iTXT.core.Util.parsePixels($iTXT.core.Util.getStyle(this.imageStyle,"borderLeftWidth"));var bR=$iTXT.core.Util.parsePixels($iTXT.core.Util.getStyle(this.imageStyle,"borderRightWidth"));this.styleWidth=pL+pR+bL+bR;var pT=$iTXT.core.Util.parsePixels($iTXT.core.Util.getStyle(this.imageStyle,"paddingTop"));var pB=$iTXT.core.Util.parsePixels($iTXT.core.Util.getStyle(this.imageStyle,"paddingBottom"));var bT=$iTXT.core.Util.parsePixels($iTXT.core.Util.getStyle(this.imageStyle,"borderTopWidth"));var bB=$iTXT.core.Util.parsePixels($iTXT.core.Util.getStyle(this.imageStyle,"borderBottomWidth"));this.styleHeight+=pL+pR+bL+bR;}}},needsResize:function(w,h,$super)
{return $super(w,h);},_imageLoad:function()
{this.imageLoaded=true;this.reCalculateSize=true;$iTXT.debug.debug($iTXT.debug.Category.UI,this.properties.src+" Loaded!");$iTXT.core.$(document).itxtFire("$iTXT:tt:element:loaded",this.advert);},_imageError:function()
{this.imageStyle.itxtSetStyle({width:"0px",height:"0px"});this.imageFailed=true;this.imageLoaded=true;this.reCalculateSize=true;this.properties.width=0;this.properties.height=0;$iTXT.debug.debug($iTXT.debug.Category.UI,this.properties.src+" Error Loading!");$iTXT.core.$(document).itxtFire("$iTXT:tt:element:loaded",this.advert);},_resize:function(w,h,$super)
{try
{if(this.imageFailed)
{return[0,0];}
if(this.imageLoaded)
{this.getImageSize();this._setImageRatio();}
$iTXT.debug.debug($iTXT.debug.Category.UI,"Resizing Image: "+this.properties.src);this.setImageSize("","");if(this.properties.width&&this.properties.height)
{this.setImageSize(this.properties.width,this.properties.height);$iTXT.debug.debug($iTXT.debug.Category.UI,"Image w: "+this.properties.width+", h: "+this.properties.height);return $super(this.imageStyle.offsetWidth,this.imageStyle.offsetHeight);}
else
{this.setImageSize(this.imageW,this.imageH);}
if(this.fillWidth)
{this.setImageSize(w);var wD=this.imageStyle.offsetWidth-w;if(wD>0)
{this.setImageSize((w-wD));}}
if(this.fillHeight)
{this.setImageSize(undefined,h);var hD=this.imageStyle.offsetHeight-h;if(hD>0)
{;this.setImageSize(undefined,(h-hD));}}
var newW=w;var newH=h;if(!this.fillWidth)
{newW=this.imageStyle.offsetWidth;}
if(!this.fillHeight)
{newH=this.imageStyle.offsetHeight;}
$iTXT.debug.debug($iTXT.debug.Category.UI,"Image w: "+newW+", h: "+newH);return $super(newW,newH);}
catch(e)
{return[0,0];}},_neededSize:function(w,h,$super)
{try
{if(this.imageFailed)
{return[0,0];}
if(!this.imageLoaded&&undefined==this.properties.loadingwidth&&undefined==this.properties.loadingheight&&undefined==this.properties.width&&undefined==this.properties.height)
{return[0,0];}
if(this.imageLoaded)
{this.getImageSize();this._setImageRatio();}
this.shrinkRoot();var newW=w;var newH=h;this.setImageSize("","");if(this.properties.width)
{this.setImageSize(this.properties.width);}
else
{this.setImageSize(this.imageW);}
if(this.properties.height)
{this.setImageSize(undefined,this.properties.height);}
else
{this.setImageSize(undefined,this.imageH);}
if(!this.imageLoaded&&this.properties.loadingwidth&&this.properties.loadingheight)
{this.setImageSize(this.properties.loadingwidth,this.properties.loadingheight);}
if(!this.fillWidth)
{newW=this.imageStyle.offsetWidth;}
if(!this.fillHeight)
{newH=this.imageStyle.offsetHeight;}
if(this.events.neededSize)
{var dims=this.events.neededSize.apply(this,[newW,newH]);newW=dims[0];newH=dims[1];}
this.expandRoot();return $super(newW,newH);}
catch(e)
{return[0,0];}},_onMouseOver:function(e)
{if(this.options.hoverstyles&&e.target==this.image)
{this.image.itxtSetStyle(this.options.hoverstyles);}
if(this.events.onMouseOver)
{this.events.onMouseOver.apply(this,[e]);}},_onMouseOut:function(e)
{if(this.options.hoverstyles&&e.target==this.image)
{this.image.itxtSetStyle(this.options.styles,this.options.hoverstyles);}
if(this.events.onMouseOut)
{this.events.onMouseOut.apply(this,[e]);}},_onMouseClick:function(e)
{if(e.target==this.image)
{if(this.events.onMouseClick)
{this.events.onMouseClick.apply(this,[e]);e.stop();}}},isLoaded:function()
{if(!this.imageLoaded)
{$iTXT.debug.debug($iTXT.debug.Category.UI,this.options.id+" is not loaded yet!");}
return this.imageLoaded;},_sdr:function(s,ms)
{if(s&&ms&&s>ms)
{return ms/s;}
return 1;},ratioChanged:false,_setImageRatio:function()
{if(!this.ratioChanged)
{this.ratioChanged=true;var sizeChangeRatio=1;var wr=this._sdr(this.image.width,this.properties.maxWidth);var hr=this._sdr(this.image.height,this.properties.maxHeight);sizeChangeRatio=Math.min(wr,hr);if(sizeChangeRatio<1)
{$iTXT.debug.debug($iTXT.debug.Category.UI,"Image is bigger than max dimensions, resizing by "+sizeChangeRatio);this.imageW=this.image.width=sizeChangeRatio*this.imageW;this.imageH=this.image.height=sizeChangeRatio*this.imageH;}}},gotImageSize:false,getImageSize:function()
{if(!this.gotImageSize)
{if(0!=this.image.width&&0!=this.image.height)
{this.gotImageSize=true;this.imageW=this.image.width;this.imageH=this.image.height;}}},setImageSize:function(w,h)
{var sw=parseInt(w)+parseInt(this.styleWidth);var sh=parseInt(h)+parseInt(this.styleHeight);if(""==w)
{this.image.itxtSetStyle({width:""});this.imageStyle.itxtSetStyle({width:""});}
else
{this.image.itxtSetStyle({width:w+"px"});this.imageStyle.itxtSetStyle({width:sw+"px"});}
if(""==h)
{this.image.itxtSetStyle({height:""});this.imageStyle.itxtSetStyle({height:""});}
else
{this.image.itxtSetStyle({height:h+"px"});this.imageStyle.itxtSetStyle({height:sh+"px"});}}});}
$iTXT.js.loader["$iTXT.tmpl.Flash"]=true;$iTXT.tmpl.Flash_Load=function(){var undefined;$iTXT.tmpl.Flash=$iTXT.core.Class.create($iTXT.tmpl.ElementBase,{validFlash:false,extraFlashVars:null,init:function(_options,ad,$super)
{var startSrc=_options.props.src;var defOpts=$iTXT.core.Util.extend({id:$iTXT.tmpl.ElementIdentifier.get("itxtFlash")},_options);$super(defOpts,ad);if(startSrc!=this.properties.src)
{this.validFlash=true;this.extraFlashVars={};var actualSrc=this.properties.src;var qmIndex=actualSrc.indexOf('?');if(qmIndex!=-1)
{var flvStr=decodeURIComponent(actualSrc.substring(qmIndex+1));this.extraFlashVars=$iTXT.core.Util.decodeQueryString(flvStr);this.extraFlashVars["clickURL"]=undefined;actualSrc=actualSrc.substring(0,qmIndex);}
var flashProperties={width:this.template.defaultWidth,height:this.template.defaultHeight,id:this.options.id+"MC",name:this.options.id+"MC",src:actualSrc,style:"display: block",scale:"exactfit",quality:"high",wmode:"transparent",swliveconnect:"true",allowscriptaccess:"always",flashvars:this._getFlashVars(),type:"application/x-shockwave-flash",bgcolor:"transparent"};this.finalFlashProperties=flashProperties;var flashIE='';if($iTXT.core.Browser.is("Explorer"))
{var objAttrs={classid:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",style:flashProperties.style,width:flashProperties.width,height:flashProperties.height,id:flashProperties.id,name:flashProperties.name,type:"application/x-shockwave-flash"};delete flashProperties.style;delete flashProperties.id;delete flashProperties.name;delete flashProperties.width;delete flashProperties.height;flashProperties.movie=flashProperties.src;var objNode=document.createElement("object");for(var i in objAttrs)
{objNode.setAttribute(i,objAttrs[i]);}
for(var i in flashProperties)
{var paramNode=document.createElement("param");paramNode.setAttribute("name",i);paramNode.setAttribute("value",flashProperties[i]);objNode.appendChild(paramNode);}
this.flMC=objNode;}else{this.flMC=$iTXT.core.Builder.make("EMBED",flashProperties);}
var contDiv=document.createElement("div");contDiv.appendChild(this.flMC);this.flMC=undefined;var flashStyle="display: inline-block;";var fDC=this.advert.params.get("fl.div.col");if(null!=fDC)
{if('#'!=fDC.substr(0,1))
{fDC='#'+fDC;}
flashStyle+='background-color: '+fDC+';';}
this.flashStyleDiv=$iTXT.core.Builder.make("DIV",{id:this.options.id+"Style",style:flashStyle});this.flashStyleDiv.innerHTML=contDiv.innerHTML;this.flashHldr=$iTXT.core.Builder.make("DIV",{id:this.options.id+"Hldr",style:"display: inline-block;-moz-box-sizing: content-box;box-sizing: content-box;-ms-box-sizing: content-box;-webkit-box-sizing: content-box;"},[this.flashStyleDiv]);this.rootElement.itxtAppendChild(this.flashHldr);this._applyStyles();var flashHandlesClick=this.advert.params.get("fl.handles.clk",0);if(flashHandlesClick)
{this.rootElement.itxtSubscribe("click",function(e){e.stop();return false;});}
$iTXT.core.$(document).itxtBatchSubscribe([["$iTXT:flash:setvar",$iTXT.core.Event.bind(this,this.setFlashVar)],["$iTXT:tt:before:open",$iTXT.core.Event.bind(this,this._tooltipOpening)]],this.evtDspFuncs);}},_tooltipOpening:function()
{if(!this.addedEvents)
{this.addedEvents=true;if(null!=document.getElementById(this.options.id+"MC"))
{$iTXT.core.$(this.options.id+"MC").itxtBatchSubscribe(["click",function(e){e.stop();},"mouseover",function(e){$iTXT.core.$(document).itxtFire("$iTXT:tt:over");},"mousemove",function(e){$iTXT.core.$(document).itxtFire("$iTXT:tt:over");}]);}}},_applyStyles:function()
{if(this.options.styles&&this.flashHldr)
{this.flashHldr.itxtSetStyle(this.options.styles);}},paramMapping:{'wMax':'fwm','hMax':'fhm','wMin':'fw','hMin':'fh','bgc':'tt.bg.col','tthv':'tt.bg.h.col'},_getFlashVars:function()
{$iTXT.debug.debug($iTXT.debug.Category.FLASH,"Building Flash Variables For "+this.options.id);var flvstr="";var allowedVars=$iTXT.core.Util.extend(["a","aClr","adx","ar","at","audioUsr","banner","bg","bgc","boc","bt","buc","cc","clickColor","clickPlay","clickVarName","cta","cta2","ctac","ctaCase","ctaImg","ctat","cts","fao","hMax","hMin","hqSrc","iPath","k","l1","l2","l3","l4","link1","link2","link3","link4","ll","lMsg","loc","logo","logoH","lqSrc","mpuAudio","mpuBgc","msTrk","msTrk2","mvuData","pageRef","playLim","seid","sest","src","so","t","t1","t2","t3","t4","tBox","tc","tClr","tcol","tD","tl","tracker1","tracker2","trkimg","trueH","trueW","tt","tt1","tt2","tt3","tt4","v8Src","verifyAge","verifyText","vl","webClickURL","webIMG","wMax","wMin","xPanded"],this.properties.vars);var campaignSpecificFlParams=this.advert.params.get("fl.vars","").split(",");for(var i=0;i<campaignSpecificFlParams.length;i++)
{var flParam=campaignSpecificFlParams[i];if(""!=flParam)
{var flVal=this.advert.params.get("fl."+flParam,null);allowedVars.push(flParam);this.extraFlashVars[flParam]=flVal;}}
var clickVarName=this.advert.params.get("fl.clk.var.name","clickURL");allowedVars.push(clickVarName);if("clickURL"!=clickVarName)
{this.advert.params.set(clickVarName,this.advert.params.get("clickURL"),$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);}
var templateFlashVars=this.advert.params.get("templateFlashVars",{});for(var fvName in templateFlashVars)
{$iTXT.debug.debug($iTXT.debug.Category.FLASH,"Adding Extra Flash Variable: "+fvName);allowedVars.push(fvName);}
var clickVarNames=this.advert.params.get("cvn","");clickVarNames=clickVarNames.split(",");var fti=this.advert.params.parse("${fl.trk.image}");if(fti&&!fti.match(/\$\{/))
{var pos='';var kpt=!!(this.advert.params.get('kp',0));if(kpt)
{var bounds=this.advert.hook.getPosition();if(bounds)
{pos='&kp='+bounds.left+','+bounds.top;}}
fti=$iTXT.data.al.getClickURL(this.advert,{so:$iTXT.cnst.Source.LOGO,ttv:this.advert.params.get('ttv','1'),ll:this.advert.params.get('ll','0'),llip:this.advert.params.get('llip','0')},null,true)+pos+'&rdti='+encodeURIComponent(fti);this.advert.params.set('clickURL2',this.advert.params.get('clickURL'),$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);this.advert.params.set('clickURL',fti,$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);clickVarNames.push('clickURL2');}
for(var i=0;i<clickVarNames.length;i++)
{allowedVars.push(clickVarNames[i]);}
var setVarsHash={};for(var i=0;i<allowedVars.length;i++)
{var flVarName=allowedVars[i];var flVarMappedName=flVarName;if(!setVarsHash[flVarName])
{setVarsHash[flVarName]=true;if(this.paramMapping[flVarName])
{flVarMappedName=this.paramMapping[flVarName];}
var flVarVal=this.advert.params.get(flVarMappedName);if(templateFlashVars[flVarMappedName])
{flVarVal=templateFlashVars[flVarMappedName];}
if(undefined!=this.extraFlashVars[flVarMappedName])
{var flVal=this.advert.params.parse(this.extraFlashVars[flVarMappedName]);if("adx"!=flVarName)
{flVal=encodeURIComponent(flVal);}
$iTXT.debug.debug($iTXT.debug.Category.FLASH,"Setting flash variable <b>'"+flVarName+"'</b> to: "+flVal);flvstr+=flVarName+"="+flVal+"&";}
else if(null!=flVarVal)
{var flVal=this.advert.params.parse(flVarVal);if("adx"!=flVarName)
{flVal=encodeURIComponent(flVal);}
$iTXT.debug.debug($iTXT.debug.Category.FLASH,"Setting flash variable <b>'"+flVarName+"'</b> to: "+flVal);flvstr+=flVarName+"="+flVal+"&";}}}
var faoVal=this.advert.params.get('fao');if(faoVal&&faoVal==0){$iTXT.debug.debug($iTXT.debug.Category.FLASH,"Disabling audio");flvstr+="jsAudioAdjust=AUDIO_OFF&";}
if($iTXT.data.al)
{flvstr+="tracker1="+encodeURIComponent($iTXT.data.al.getTrackerUrl($iTXT.data.AdViewValue.ADVIEW_VIDEO_FIRSTFRAME))+"&";flvstr+="tracker2="+encodeURIComponent($iTXT.data.al.getTrackerUrl($iTXT.data.AdViewValue.ADVIEW_VIDEO_LASTFRAME))+"&";}
return flvstr;},setFlashVar:function(e)
{var opts=e.data||{};var flmc=document.getElementById(this.options.id+"MC");if(opts.key&&opts.value&&flmc)
{try
{$iTXT.debug.debug($iTXT.debug.Category.FLASH,"Flash variable <b>'"+opts.key+"'</b> set to '"+opts.value+"' for "+this.options.id);flmc.SetVariable(opts.key,opts.value);}
catch(e)
{}}},_resize:function(w,h,$super)
{var flmc=document.getElementById(this.options.id+"MC");try
{if(!this.validFlash)
return[0,0];this.flashHldr.itxtSetStyle({width:"",height:""});if(this.properties.width&&this.properties.height)
{flmc.width=this.properties.width;flmc.height=this.properties.height;this.flashHldr.itxtSetStyle({width:this.properties.width+"px",height:this.properties.height+"px"});return $super(this.flashHldr.offsetWidth,this.flashHldr.offsetHeight);}
if(this.fillWidth)
{flmc.width=w;this.flashHldr.itxtSetStyle({width:w+"px"});var wD=this.flashHldr.offsetWidth-w;if(wD>0)
{flmc.width=(w-wD);}}
if(this.fillHeight)
{flmc.height=h;this.flashHldr.itxtSetStyle({height:h+"px"});var hD=this.flashHldr.offsetHeight-h;if(hD>0)
{flmc.height=(h-hD);}}
return $super(w,h);}
catch(e)
{return[0,0];}},_neededSize:function(w,h,$super)
{var flmc=document.getElementById(this.options.id+"MC");try
{if(!this.validFlash)
return[0,0];this.flashHldr.itxtSetStyle({width:"",height:""});if(this.properties.width&&this.properties.height)
{flmc.width=this.properties.width;flmc.height=this.properties.height;this.flashHldr.itxtSetStyle({width:this.properties.width+"px",height:this.properties.height+"px"});return[this.flashHldr.offsetWidth,this.flashHldr.offsetHeight];}
return $super(w,h);}
catch(e)
{return[0,0];}},reset:function()
{var oldParent=this.parentNode;this.init(this.defaultOptions,this.advert);if(null!=oldParent)
{$iTXT.core.$(oldParent).itxtClear();oldParent.appendChild(this.rootElement);}
this.addedEvents=false;}});}
$iTXT.js.loader["$iTXT.tmpl.Cell"]=true;$iTXT.tmpl.Cell_Load=function(){var undefined;$iTXT.tmpl.Cell=$iTXT.core.Class.create($iTXT.tmpl.ElementBase,{rows:null,element:null,init:function(_options,ad,$super)
{var defOpts=$iTXT.core.Util.extend({id:$iTXT.tmpl.ElementIdentifier.get("itxtcell"),className:"itxtcell"},_options);$super(defOpts,ad);this.rows=[];if(this.options.structure)
{this._build(this.options.structure,ad);}},dispose:function($super)
{if(null!=this.rows)
{for(var i=0;i<this.rows.length;i++)
{this.rows[i].dispose();}}
else if(null!=this.element)
{this.element.dispose();}
$super();},_build:function(s,ad)
{if($iTXT.core.Util.isArray(s))
{if((s.length==1)&&s[0].type&&('comp'==s[0].type)&&s[0].klass)
{var opts=s[0];opts.template=this;this.rows=null;var compClass=eval(opts.klass);this.element=new compClass(opts,ad);this.element.parentNode=this.rootElement;this.rootElement.appendChild(this.element.rootElement);this.fillWidth=this.element.fillWidth;this.fillHeight=this.element.fillHeight;return;}
for(var i=0;i<s.length;i++)
{if(s[i].type&&'row'==s[i].type)
{var r=new $iTXT.tmpl.Row(s[i],ad);this.rows.push(r);r.parentNode=this.rootElement;this.rootElement.appendChild(r.rootElement);rowCont=true;}}}},_resize:function(w,h)
{$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"Resizing Cell ("+this.options.id+")",this);this.rootElement.itxtSetStyle({width:"",height:""});if(null!=this.element)
{this.element.resize(w,h);w=this.element.width;h=this.element.height;this.fillWidth=this.element.fillWidth;this.fillHeight=this.element.fillHeight;$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"Cell has element requiring "+w+"px * "+h+"px",this);}
if((null==this.element)&&(null!=this.rows)&&(0<this.rows.length))
{var th=0;var ers=0;for(var i=0;i<this.rows.length;i++)
{var r=this.rows[i];if(r.fillHeight)
{ers++;}
else if(r.contentHeight)
{var dims=r.neededSize(w,h);r.height=dims[1];th+=dims[1];}
else
{th+=r.height;}}
var rh=h-th;var erh=(0==ers)?0:Math.floor(Math.max(rh/ers,0));$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"<b>Cell Rows:</b>",this);$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"Total height: "+h+"px, Fixed rows height: "+th+"px, Remaning height: "+rh+"px",this);$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"Total dynamic rows: "+ers+", Each allowed: "+erh+"px",this);h=0;for(var i=0;i<this.rows.length;i++)
{var r=this.rows[i];var rh=(r.fillHeight)?erh:r.height;var rowdim=r.resize(w,rh);w=(rowdim[0]>w)?rowdim[0]:w;h+=(rowdim[1]>rh)?rowdim[1]:rh;}}
return[w,h];},_neededSize:function(w,h)
{if(null!=this.element)
{var edims=this.element.neededSize(w,h);if(this.contentWidth)
w=edims[0];if(this.contentHeight)
h=edims[1];}
else if((null!=this.rows)&&(0<this.rows.length))
{if(this.contentHeight)
{var availH=h;h=0;for(var i=0;i<this.rows.length;i++)
{var r=this.rows[i];var rdims=r.neededSize(w,availH);h+=rdims[1];}}}
return[w,h];},needsResize:function(w,h,$super)
{if(null!=this.element&&this.element.needsResize(w,h))
{return true;}
else if((null!=this.rows)&&(0<this.rows.length))
{for(var i=0;i<this.rows.length;i++)
{if(this.rows[i].needsResize(w,h))
{return true;}}}
return $super(w,h);},isLoaded:function()
{if(null!=this.element)
{return this.element.isLoaded();}
else if(this.rows.length>0)
{for(var i=0;i<this.rows.length;i++)
{if(!this.rows[i].isLoaded())
{return false;}}}
return true;}});}
$iTXT.js.loader["$iTXT.tmpl.ElementBase"]=true;$iTXT.tmpl.ElementBase_Load=function(){var undefined;$iTXT.tmpl.ElementIdentifier={id:0,categories:{},get:function(cat)
{if(cat)
{if(!this.categories[cat])
{this.categories[cat]=0;}
return cat+(this.categories[cat]++);}
return"itxtelmt"+(this.id++);}}
$iTXT.tmpl.ElementBase=$iTXT.core.Class.create({fillWidth:true,fillHeight:true,contentWidth:false,contentHeight:false,properties:null,events:null,advert:null,reCalculateSize:true,neededWidth:0,neededHeight:0,lastAvailableWidth:0,lastAvailableHeight:0,evtDspFuncs:null,defaultProperties:{},parentNode:null,init:function(_options,ad)
{this.evtDspFuncs=[];this.advert=ad;if(this.advert)
{if(this.paramDefaults&&$iTXT.core.Util.isObject(this.paramDefaults))
{this.advert.addTemplateParams(this.paramDefaults,$iTXT.cnst.WEIGHTING_DEFAULT_COMPONENT);}}
this.template=this.advert.getTemplate();if(null!=this.template)
{this.template.addComponent(this);}
var newUID=_options.id||$iTXT.tmpl.ElementIdentifier.get();this.defaultOptions=$iTXT.core.Util.cloneObject(_options);this.options=$iTXT.core.Util.extend({UID:newUID,id:newUID,className:""},_options);this.events=$iTXT.core.Util.cloneObject(this.options.events||{});if(this.options.width&&"**"==this.options.width)
{this.contentWidth=true;this.fillWidth=false;this.options.width=0;}
else if(this.options.width&&"*"!=this.options.width)
{this.fillWidth=false;}
if(this.options.height&&"**"==this.options.height)
{this.contentHeight=true;this.fillHeight=false;this.options.height=0;}
else if(this.options.height&&"*"!=this.options.height)
{this.fillHeight=false;}
this.width=this.options.width||0;this.height=this.options.height||0;this.properties=$iTXT.core.Util.extend($iTXT.core.Util.cloneObject(this.defaultProperties),$iTXT.core.Util.cloneObject(this.options.props||{}));if(ad)
{if(this.events.beforeTokenize)
{this.events.beforeTokenize.apply(this);}
this.properties=ad.tokenize(this.properties);if(this.options.styles)
{this.options.styles=ad.tokenize($iTXT.core.Util.cloneObject(this.options.styles));}
if(this.options.hoverstyles)
{this.options.hoverstyles=ad.tokenize($iTXT.core.Util.cloneObject(this.options.hoverstyles));}
if(this.options.ttoverstyles)
{this.options.ttoverstyles=ad.tokenize($iTXT.core.Util.cloneObject(this.options.ttoverstyles));}}
if(this.properties.id)
{this.options.id=this.properties.id;}
this.rootElement=$iTXT.core.Builder.make("DIV",{id:this.options.id,className:this.options.className});this.rootElement.itxtSetStyle({position:"relative"});this.rootElement.itxtSubscribe("mouseover",$iTXT.core.Event.bind(this,this._onMouseOver));this.rootElement.itxtSubscribe("mouseout",$iTXT.core.Event.bind(this,this._onMouseOut));this.rootElement.itxtSubscribe("click",$iTXT.core.Event.bind(this,this._onMouseClick));$iTXT.subscribe("$iTXT:tt:mouse:over",$iTXT.core.Event.bind(this,this._onTooltipOver))
$iTXT.subscribe("$iTXT:tt:mouse:out",$iTXT.core.Event.bind(this,this._onTooltipOut))
if(this.events.onCreate)
{this.events.onCreate.apply(this);}
this._applyStyles();},_applyStyles:function()
{if(this.options.styles)
{this.rootElement.itxtSetStyle(this.options.styles);}},dispose:function()
{this.rootElement.innerHTML="";this.rootElement=null;if(this.events.onDispose)
{this.events.onDispose.apply(this);}
for(var i=0;i<this.evtDspFuncs.length;i++)
{var f=this.evtDspFuncs[i];if('function'==typeof f)
{f.call();}}
this.evtDspFuncs=[];},position:function(l,t)
{if(null!=l&&null!=t)
{this.left=l;this.top=t;this.rootElement.itxtSetStyle({position:"absolute",left:this.left+"px",top:this.top+"px"});}
else
{this.rootElement.itxtSetStyle({position:"relative"});}},resize:function(w,h)
{this.width=w;this.height=h;var dims=this._resize(w,h);if(null!=dims)
{this.width=dims[0];this.height=dims[1];}
if(undefined===this.options.fillSize||true===this.options.fillSize)
{this.rootElement.itxtSetStyle({width:this.width+"px",height:this.height+"px"});}
return[this.width,this.height];},_resize:function(w,h)
{if(this.events.onResize)
{var newDims=this.events.onResize.apply(this,[w,h]);if(null!=newDims&&$iTXT.core.Util.isArray(newDims))
{w=newDims[0];h=newDims[1];return[w,h];}}
return null;},neededSize:function(w,h)
{if(this.needsResize(w,h))
{this.reCalculateSize=false;this.lastAvailableWidth=w;this.lastAvailableHeight=h;var dims=this._neededSize(w,h);this.neededWidth=dims[0];this.neededHeight=dims[1];}
return[this.neededWidth,this.neededHeight];},_neededSize:function(w,h)
{if(this.events.neededSize)
{return this.events.neededSize.apply(this,[w,h]);}
return[w,h];},needsResize:function(w,h)
{var rv=this.reCalculateSize||((this.lastAvailableWidth!=w&&this.fillWidth)||(this.lastAvailableHeight!=h&&this.fillHeight));return rv;},render:function()
{return this.rootElement;},_onMouseOver:function(e)
{if(this.options.hoverstyles&&this.rootElement)
{this.rootElement.itxtSetStyle(this.options.hoverstyles);}
if(this.events.onMouseOver)
{this.events.onMouseOver.apply(this,[e]);}
return true;},_onMouseOut:function(e)
{if(this.options.hoverstyles&&this.rootElement)
{this.rootElement.itxtSetStyle(this.options.styles,this.options.hoverstyles);}
if(this.events.onMouseOut)
{this.events.onMouseOut.apply(this,[e]);}
return true;},_onMouseClick:function(e)
{if(this.events.onMouseClick)
{if(!this.events.onMouseClick.apply(this,[e]))
{return false;}}
return true;},isLoaded:function()
{return true;},shrinkRoot:function()
{if(this.rootElement)
{this.rootElement.itxtSetStyle({width:"0px",height:"0px"});}},expandRoot:function()
{if(this.rootElement)
{this.rootElement.itxtSetStyle({width:"auto",height:"auto"});}},_onTooltipOver:function()
{},_onTooltipOut:function()
{}});}
$iTXT.js.loader["$iTXT.tmpl.TemplateBase"]=true;$iTXT.tmpl.TemplateBase_Load=function(){var undefined;$iTXT.tmpl.TemplateBase=$iTXT.core.Class.create({defaultWidth:300,defaultHeight:150,expandedWidth:300,expandedHeight:200,structure:null,rows:null,root:null,baseParamDefaults:{},components:null,fullyBuilt:false,isCurrentTemplate:false,init:function(_options)
{this.beforeInit();this.templateID=$iTXT.tmpl.ElementIdentifier.get("Template");this.rootElement=$iTXT.core.Builder.make("DIV",{style:"visibility: hidden;",id:this.templateID});$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"Init Template Base ("+this.templateID+")");this.baseParamDefaults={'tt.t.col':'#000099','tt.t.h.col':'#000099','tt.bdy.col':'#000','tt.bdy.h.col':'#000','tt.url.col':'#008000','tt.url.h.col':'#008000','tt.wturl':{w:$iTXT.cnst.WEIGHTING_DEFAULT_DEFAULT,v:'http://www.vibrantmedia.com/whatisIntelliTXT.asp?ipid=${ipid}&cc=${cc}&server=${itxtserver}'},'LOG':'ipid=${ipid}&cc=${cc}&server=${itxtserver}'};this.components=[];if(null==this.structure)
{this.structure=[{type:'row',structure:[{type:'cell',structure:[]}]}];}
this.options=$iTXT.core.Util.extend({dontColorTailTop:true},_options);if(this.options.advert)
{this.advert=this.options.advert;delete this.options.advert;if(this.paramDefaults&&$iTXT.core.Util.isObject(this.paramDefaults))
{var prms=$iTXT.core.Util.extend(this.baseParamDefaults,this.paramDefaults);this.advert.addTemplateParams(prms,$iTXT.cnst.WEIGHTING_DEFAULT_TEMPLATE);}
else
{this.advert.addTemplateParams(this.baseParamDefaults);}
this.options=this.advert.tokenize(this.options)}
this.events=this.options.events||{};this.afterTokenize();try
{if(this.options.width)
{var w=parseInt(this.options.width);if(!isNaN(w))
{this.defaultWidth=w;}}
if(this.options.height)
{var h=parseInt(this.options.height);if(!isNaN(h))
{this.defaultHeight=h;}}
if(this.options.expwidth)
{var ew=parseInt(this.options.expwidth);if(!isNaN(ew))
{this.expandedWidth=ew;}}
if(this.options.expheight)
{var eh=parseInt(this.options.expheight);if(!isNaN(eh))
{this.expandedHeight=eh;}}}
catch(e)
{}
var subsArr=[];$iTXT.core.$(document).itxtSubscribe("$iTXT:tt:element:loaded",$iTXT.core.Event.bind(this,this._elementLoaded),subsArr);this.elementLoadUnsubscribe=subsArr.pop();},addComponent:function(c)
{this.components.push(c);},getComponentByUID:function(UID)
{for(var i=0;i<this.components.length;i++)
{var c=this.components[i];if(c.options.UID==UID)
{return c;}}
return null;},removeElement:function(sUID)
{if(null!=this.structure&&$iTXT.core.Util.isArray(this.structure))
{this._removeElmt(this.structure,sUID);}},_removeElmt:function(items,sUID)
{try
{if(sUID&&items&&items.length)
{for(var i=0;i<items.length;i++)
{var item=items[i];if(item&&sUID==item.UID)
{items.splice(i,1);return true;}
if(item.structure&&$iTXT.core.Util.isArray(item.structure))
{if(this._removeElmt(item.structure,sUID))
{return true;}}}}}
catch(e)
{var i=items;}
return false;},_applyStyles:function()
{if(this.options.styles)
{this.rootElement.itxtSetStyle(this.options.styles);}},beforeInit:function()
{},afterTokenize:function()
{},beforeBuild:function()
{},afterBaseBuild:function()
{},afterBuild:function()
{},beforeOpen:function()
{},afterOpen:function()
{},beforeClose:function()
{},afterClose:function()
{},onShow:function()
{},afterShow:function()
{},onHide:function()
{},onBuildHookStyle:function(hk)
{},onLogEvent:function(type,opts,advert)
{return true;},onTrackingDrop:function(beacons,advert)
{return true;},onCloseClick:function()
{return true;},onWhatsThisClick:function()
{return true;},onVibrantLogoClick:function()
{return true;},beforeLiveLookup:function(e)
{return true;},afterLiveLookup:function(e)
{},onMouseClick:function()
{var opts={advert:this.advert};$iTXT.core.$(document).itxtFire("$iTXT:tt:click",opts);},dispose:function()
{$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"<b style='color:red;'>Disposing of Template ("+this.templateID+")</b>",this);this.fullyBuilt=false;if(this.elementLoadUnsubscribe)
{this.elementLoadUnsubscribe();}
if(null!=this.rows)
{for(var i=0;i<this.rows.length;i++)
{this.rows[i].dispose();}}
if(null!=this.rootElement)
{this.rootElement.itxtClear();}
if(null!=this.rootElement&&this.rootElement.parentNode)
{this.rootElement.parentNode.removeChild(this.rootElement);}},remove:function()
{this.isCurrentTemplate=false;if(null!=this.rootElement&&this.rootElement.parentNode)
{this.rootElement.parentNode.removeChild(this.rootElement);}},resize:function(w,h,force)
{this.width=w;this.height=h;if(this.fullyBuilt)
{$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"<b style='color:red;'>Resizing Template ("+this.templateID+") with initial size of "+w+"px * "+h+"px</b>",this);if(null!=this.rows)
{var th=0;var ers=0;for(var i=0;i<this.rows.length;i++)
{var r=this.rows[i];if(r.fillHeight)
{ers++;}
else if(r.contentHeight)
{var dims=r.neededSize(w,h);r.height=dims[1];th+=dims[1];}
else
{th+=r.height;}}
var rh=this.height-th;var erh=(0==ers)?0:Math.floor(Math.max(rh/ers,0));$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"<b>Template Rows</b>",this);$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"Total height: "+this.height+"px, Fixed rows height: "+th+"px, Remaning height: "+rh+"px",this);$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"Total dynamic rows: "+ers+", Each allowed: "+erh+"px",this);if(this.rows.length>0)
{this.height=0;for(var i=0;i<this.rows.length;i++)
{var r=this.rows[i];var rh=(r.fillHeight)?erh:r.height;var rowdim=r.resize(this.width,rh);this.width=(rowdim[0]>this.width)?rowdim[0]:this.width;this.height+=(rowdim[1]>rh)?rowdim[1]:rh;$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"Adding Row Height, Total Now: "+this.height+"px",this);}}}
this.rootElement.itxtSetStyle({width:this.width+"px",height:this.height+"px"});$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"Finished Resizing Template ("+this.templateID+") with size of "+this.width+"px * "+this.height+"px",this);}
return[this.width,this.height];},_build:function(ad)
{if(!this.templateBuilt)
{this.templateBuilt=true;$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"Internal Template Build ("+this.templateID+")",this);var b=$iTXT.core.Builder;this.rows=[];if(null!=this.structure&&$iTXT.core.Util.isArray(this.structure))
{for(var i=0;i<this.structure.length;i++)
{var item=this.structure[i];if(item.type&&'row'==item.type)
{var r=new $iTXT.tmpl.Row(item,ad);this.rows.push(r);this.rootElement.appendChild(r.rootElement);}}}
this.rootElement.itxtSubscribe("mouseover",$iTXT.core.Event.bind(this,this._onMouseOver));this.rootElement.itxtSubscribe("mouseout",$iTXT.core.Event.bind(this,this._onMouseOut));this.rootElement.itxtSubscribe("click",$iTXT.core.Event.bind(this,this._onMouseClick));this._applyStyles();}
return this.rootElement;},_onMouseOver:function(e)
{if(this.options.hoverstyles&&this.rootElement)
{this.rootElement.itxtSetStyle(this.options.hoverstyles);}
if(this.events.onMouseOver)
{this.events.onMouseOver.apply(this,[e]);}},_onMouseOut:function(e)
{if(this.options.hoverstyles&&this.rootElement)
{this.rootElement.itxtSetStyle(this.options.styles,this.options.hoverstyles);}
if(this.events.onMouseOut)
{this.events.onMouseOut.apply(this,[e]);}},_onMouseClick:function(e)
{if(this.events.onMouseClick)
{this.events.onMouseClick.apply(this,[e]);}},checkLoaded:function()
{$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"Checking if template is loaded ("+this.templateID+")",this);if(this.fullyBuilt)
{if(this.rows.length>0)
{for(var i=0;i<this.rows.length;i++)
{if(!this.rows[i].isLoaded())
{$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"Row "+i+" is not loaded ("+this.templateID+")",this);return false;}}}
return true;}
else
{$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"Template not fully built yet ("+this.templateID+")",this);}
return false;},getAdvertHandler:function()
{if(undefined==this._advertHandlerInstance)
{if(this.options.advertHandlerKlass)
{var ahKlass=eval(this.options.advertHandlerKlass);this._advertHandlerInstance=new ahKlass(this.advert);}
else
{this._advertHandlerInstance=new $iTXT.data.AdvertHandler(this.advert);}}
return this._advertHandlerInstance;},buildTemplate:function(loadCb)
{this.isCurrentTemplate=true;$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"Build Template ("+this.templateID+")",this);this.loadCallback=loadCb;this.beforeBuild();this._build(this.advert);this.fullyBuilt=true;this._elementLoaded();},_elementLoaded:function()
{if(!this.isCurrentTemplate)
{return;}
$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"Template Element Loaded ("+this.templateID+")",this);if(this.checkLoaded())
{$iTXT.debug.debug($iTXT.debug.Category.TEMPLATE,"Template Fully Loaded ("+this.templateID+")",this);if(this.loadCallback)
{this.loadCallback();}
this.afterBuild();}}});window.mvuExpand=function(w,h,rt,kac)
{$iTXT.debug.debug($iTXT.debug.Category.UI,"function called: mvuExpand("+w+", "+h+", "+rt+", "+kac+");");$iTXT.core.$(document).itxtFire("$iTXT:function:mvuExpand",{w:w,h:h,rt:rt,kac:kac});};window.fExp=function()
{$iTXT.debug.debug($iTXT.debug.Category.UI,"function called: fExp");$iTXT.core.$(document).itxtFire("$iTXT:function:fExp");};window.fClick=function()
{$iTXT.debug.debug($iTXT.debug.Category.UI,"function called: fClick");$iTXT.core.$(document).itxtFire("$iTXT:function:fClick");}
window.$iTXT.func={setClickThrough:function(url,did){$iTXT.debug.debug($iTXT.debug.Category.UI,"function called: $iTXT.func.setClickThrough");if(!url.match(/^http/)){$iTXT.debug.debug($iTXT.debug.Category.UI,"ClickThrough URL is not valid, ignoring: "+url);return;}
$iTXT.core.$(document).itxtFire("$iTXT:function:setClickThrough",{url:url,did:did});}};}
$iTXT.js.loader["$iTXT.tmpl.Text"]=true;$iTXT.tmpl.Text_Load=function(){var undefined;$iTXT.tmpl.Text=$iTXT.core.Class.create($iTXT.tmpl.ElementBase,{init:function(_options,ad,$super)
{var defOpts=$iTXT.core.Util.extend({id:$iTXT.tmpl.ElementIdentifier.get("itxtText")},_options);$super(defOpts,ad);this.textDiv=$iTXT.core.Builder.make("DIV",{id:this.options.id+"TextDiv",title:this.properties.title||""},[this.properties.text]);this.rootElement.itxtAppendChild(this.textDiv);this._applyStyles();},_applyStyles:function()
{if(this.options.styles&&this.textDiv)
{this.textDiv.itxtSetStyle(this.options.styles);}},_resize:function(w,h,$super)
{if(!this.fillHeight||!this.fillWidth)
{this.width=w;this.height=h;this.textDiv.itxtSetStyle({width:"",height:""});return[w,h];}
else
{this.textDiv.itxtSetStyle({width:w+"px",height:h+"px"});}
return $super(w,h);},_neededSize:function(w,h,$super)
{if(this.events.neededSize)
{return this.events.neededSize.apply(this,[w,h]);}
var newW=w;var newH=h;if(!this.fillHeight&&!this.fillWidth)
{this.rootElement.itxtSetStyle({width:"",height:""});this.textDiv.itxtSetStyle({width:"",height:"",display:"inline"});newH=this.textDiv.offsetHeight;newW=this.textDiv.offsetWidth;this.textDiv.itxtSetStyle({display:""});}
else if(!this.fillHeight)
{this.rootElement.itxtSetStyle({width:w+"px",height:""});newH=this.textDiv.offsetHeight;this.rootElement.itxtSetStyle({width:"",height:""});}
else if(!this.fillWidth)
{this.textDiv.itxtSetStyle({width:"",height:"",display:"inline"});newW=this.textDiv.offsetWidth;this.textDiv.itxtSetStyle({display:""});}
return $super(newW,newH);},_onMouseOver:function(e)
{if(this.options.hoverstyles&&this.textDiv)
{this.textDiv.itxtSetStyle(this.options.hoverstyles);}
if(this.events.onMouseOver)
{this.events.onMouseOver.apply(this,[e]);}},_onMouseOut:function(e)
{if(this.options.hoverstyles&&this.textDiv)
{this.textDiv.itxtSetStyle(this.options.styles,this.options.hoverstyles);}
if(this.events.onMouseOut)
{this.events.onMouseOut.apply(this,[e]);}},_onTooltipOver:function(e)
{if(this.options.ttoverstyles&&this.textDiv)
{this.textDiv.itxtSetStyle(this.options.ttoverstyles);}
if(this.events.onMouseOver)
{this.events.onMouseOver.apply(this,[e]);}},_onTooltipOut:function(e)
{if(this.options.ttoverstyles&&this.textDiv)
{this.textDiv.itxtSetStyle(this.options.styles,this.options.ttoverstyles);}
if(this.events.onMouseOut)
{this.events.onMouseOut.apply(this,[e]);}}});}
$iTXT.js.loader["$iTXT.tmpl.Link"]=true;$iTXT.tmpl.Link_Load=function(){var undefined;$iTXT.tmpl.Link=$iTXT.core.Class.create($iTXT.tmpl.ElementBase,{init:function(_options,ad,$super)
{var defOpts=$iTXT.core.Util.extend({id:$iTXT.tmpl.ElementIdentifier.get("itxtlink")},_options);$super(defOpts,ad);this.link=$iTXT.core.Builder.make("A",{id:this.options.id+"Anchor",className:this.options.className,href:this.properties.src,title:this.properties.title||""},[this.properties.text]);this.rootElement.itxtAppendChild(this.link);this._applyStyles();this.link.itxtBatchSubscribe([["click",$iTXT.core.Event.bind(this,this._onLinkClick)]],this.evtDspFuncs);},_applyStyles:function()
{if(this.options.styles&&this.link)
{this.link.itxtSetStyle(this.options.styles);}},_onMouseOver:function(e)
{if(this.options.hoverstyles&&e.target==this.link)
{this.link.itxtSetStyle(this.options.hoverstyles);}
if(this.events.onMouseOver)
{this.events.onMouseOver.apply(this,[e]);}},_onMouseOut:function(e)
{if(this.options.hoverstyles&&e.target==this.link)
{this.link.itxtSetStyle(this.options.styles,this.options.hoverstyles);}
if(this.events.onMouseOut)
{this.events.onMouseOut.apply(this,[e]);}},_onMouseClick:function()
{},_onLinkClick:function(e)
{if(this.events.onMouseClick)
{e.stop();return this.events.onMouseClick.apply(this,[e]);}}});}
$iTXT.js.loader["$iTXT.tmpl.Html"]=true;$iTXT.tmpl.Html_Load=function(){var undefined;$iTXT.tmpl.Html=$iTXT.core.Class.create($iTXT.tmpl.ElementBase,{init:function(_options,ad,$super)
{var defOpts=$iTXT.core.Util.extend({id:$iTXT.tmpl.ElementIdentifier.get("itxtHtml")},_options);$super(defOpts,ad);this.rootElement.innerHTML=this.properties.src;}});}