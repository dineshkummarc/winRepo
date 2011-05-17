/* This source code is Copyright (c) Vibrant Media 2001-2011 and forms part of the patented Vibrant Media product "IntelliTXT" (sm). */ 
$iTXT.js.loader["$iTXT.fx.Base"]=true;$iTXT.fx.Base_Load=function(){var undefined;$iTXT.fx.Transition={Linear:function(v)
{return v;},EaseIn:function(v)
{return Math.pow(v,1.5*2);},EaseOut:function(v)
{return 1-Math.pow(1-v,1.5*2);}}
$iTXT.fx.Base=$iTXT.core.Class.create({options:null,queue:null,init:function(_options)
{this.options={useTimeout:true,delay:0,from:0,to:1.0,fps:60,duration:2000,transition:$iTXT.fx.Transition.Linear,start:false,targetChildren:false};$iTXT.core.Util.extend(this.options,_options);if(this.options.target)
{this.options.target=$iTXT.core.$(this.options.target);}
this.valueChange=this.options.to-this.options.from;this.totalDuration=this.options.duration;this.intervalDuration=Math.round(1000/this.options.fps);this.totalFrames=Math.round(this.options.fps*(this.options.duration/1000));if(this.options.start)
{this.delayedStart();}},_start:function()
{this.setup();this.start();},delayedStart:function()
{window.setTimeout($iTXT.core.Event.bind(this,this._start),this.options.delay);},setup:function()
{this.notify("onSetup");},start:function()
{this.running=true;this.notify("beforeStart");this.position=this.options.from;this.currentFrame=0;this.startTime=new Date().getTime();if(this.options.useTimeout)
{setTimeout($iTXT.core.Event.bind(this,this.loop),0);}
else
{this.interval=setInterval($iTXT.core.Event.bind(this,this.loop),this.intervalDuration);}
this.notify("afterStart");},notify:function(name,details)
{if((undefined!=this.options[name])&&('function'==typeof this.options[name]))
{this.options[name](details);}},loop:function()
{if(this.running)
{var now=new Date().getTime();if(now>this.startTime+this.totalDuration)
{this.running=false;this.finish();return;}
var pos=(now-this.startTime)/this.totalDuration;var frame=Math.round(this.totalFrames*pos);if(frame>this.currentFrame)
{this.currentFrame=frame;this.render(pos);}
if(this.options.useTimeout)
{setTimeout($iTXT.core.Event.bind(this,this.loop),0);}}},finish:function()
{this.notify("beforeFinish");if(!this.options.useTimeout)
{clearInterval(this.interval);}
this.render(1.0);this.notify("afterFinish");if(this.queue!=null)
{this.queue.pop();}},render:function(pos)
{this.notify("beforeUpdate",this.position);this.position=this.options.from+(this.valueChange*this.options.transition(pos));this.update();this.notify("afterUpdate",this.position);},update:function()
{}});}
$iTXT.js.loader["$iTXT.fx.Combination"]=true;$iTXT.fx.Combination_Load=function(){var undefined;$iTXT.fx.Combination=$iTXT.core.Class.create($iTXT.fx.Base,{options:null,init:function(_options,$super)
{this.defaultOptions={effects:[],from:0,to:1};$super($iTXT.core.Util.extend(this.defaultOptions,_options));},setup:function()
{for(var i=0;i<this.options.effects.length;i++)
{this.options.effects[i].setup();}},update:function()
{for(var i=0;i<this.options.effects.length;i++)
{this.options.effects[i].render(this.position);}}});}
$iTXT.js.loader["$iTXT.fx.Fade"]=true;$iTXT.fx.Fade_Load=function(){var undefined;$iTXT.fx.Fade=$iTXT.core.Class.create($iTXT.fx.Base,{options:null,init:function(_options,$super)
{this.defaultOptions={direction:'in',notifyOnly:false};$super($iTXT.core.Util.extend(this.defaultOptions,_options));this.target=this.options.target;},update:function()
{var o=(this.position);if('out'==this.options.direction)
o=1-o;this.notify("onUpdate",o);if(!this.options.notifyOnly)
{if(this.options.targetChildren)
{for(var i=0;i<this.target.childNodes.length;i++)
{$iTXT.core.$(this.target.childNodes[i].firstChild).itxtOpacity(o);}}
else
{this.target.itxtOpacity(o);}}}});}
$iTXT.js.loader["$iTXT.fx.Move"]=true;$iTXT.fx.Move_Load=function(){var undefined;$iTXT.fx.Move=$iTXT.core.Class.create($iTXT.fx.Base,{options:null,init:function(_options,$super)
{this.defaultOptions={dX:null,dY:null,x:null,y:null};$super($iTXT.core.Util.extend(this.defaultOptions,_options));this.target=this.options.target;},setup:function($super)
{this.startX=this.target.offsetLeft;this.startY=this.target.offsetTop;if(this.options.dX!=null&&this.options.dY!=null)
{this.finishX=this.startX+this.options.dX;this.finishY=this.startY+this.options.dY;}
else
{this.finishX=this.options.x;this.finishY=this.options.y;}
this.changeX=this.finishX-this.startX;this.changeY=this.finishY-this.startY;$super();},update:function()
{var newL=Math.round(this.startX+(this.changeX*this.position));var newT=Math.round(this.startY+(this.changeY*this.position));this.target.itxtSetStyle({left:newL+"px",top:newT+"px",right:"",bottom:""});}});}
$iTXT.js.loader["$iTXT.fx.Queue"]=true;$iTXT.fx.Queue_Load=function(){var undefined;$iTXT.fx.Queue=$iTXT.core.Class.create({queue:null,queueIndex:null,init:function(effect)
{this.queueIndex=0;this.queue=[];this.push(effect);effect.delayedStart();},push:function(effect)
{this.queue.push(effect);effect.queue=this;return this;},pop:function()
{this.queueIndex++;if(this.queueIndex<this.queue.length)
{this.queue[this.queueIndex].delayedStart();}
return this;}});}
$iTXT.js.loader["$iTXT.fx.Size"]=true;$iTXT.fx.Size_Load=function(){var undefined;$iTXT.fx.Size=$iTXT.core.Class.create($iTXT.fx.Base,{options:null,init:function(_options,$super)
{this.defaultOptions={width:0,height:0};$super($iTXT.core.Util.extend(this.defaultOptions,_options));this.target=this.options.target;this.tStartW=this.target.offsetWidth;this.tStartH=this.target.offsetHeight;this.tStartX=this.target.offsetLeft;this.tStartY=this.target.offsetTop;},update:function()
{var w=this.tStartW+((this.options.width-this.tStartW)*this.position);var h=this.tStartH+((this.options.height-this.tStartH)*this.position);this.target.itxtSetStyle({width:w+"px",height:h+"px"});}});}
$iTXT.js.loader["$iTXT.fx.Util"]=true;$iTXT.fx.Util_Load=function(){var undefined;$iTXT.fx.Util={}}