/* This source code is Copyright (c) Vibrant Media 2001-2011 and forms part of the patented Vibrant Media product "IntelliTXT" (sm). */ 
$iTXT.js.loader["$iTXT.debug.Util"]=true;$iTXT.debug.Util_Load=function()
{var undefined;$iTXT.debug.Util={ECH_EVENTS_TIME:1,ECH_EVENTS_DUMP:2,ECH_ASSESS_DUMP:4,ECH_TIME_XFER:8,ECH_XPAND_JSON:16,ECH_JSON_DB:32,ECH_ASSESS_DUMP_INPUT:64,ECH_TEXTNODES_DUMP:128,HL_COL_INIT:'#fcb514',HL_COL_SKIP:'blue',HL_COL_EXCLUDE:'red',HL_COL_CONTENT:'green',HL_BORDER_STD:'solid',HL_BORDER_SHORT:'solid',HL_BORDER_UPN:'dotted',HL_RESET:'none',hilite:function(n,c,b,f)
{if($iTXT.debug.CurrentConsole&&!$iTXT.glob.dbgParams.get('itxthln-xx'))
{if(n&&n.nodeType&&$iTXT.core.Util.TEXT_NODE==n.nodeType&&n.parentNode&&$iTXT.core.Util.ELEMENT_NODE==n.parentNode.nodeType&&('string'==typeof c||'string'==typeof b))
{var p=n.parentNode;if(this.HL_RESET==c||this.HL_RESET==b)
{f=true;}
if(!f&&p.itxtHilite)
{return;}
if(!c||'string'!=typeof c)
{c=this.HL_COL_CONTENT;}
if(!b||'string'!=typeof b)
{b=this.HL_BORDER_STD;}
try
{if(this.HL_RESET==c||this.HL_RESET==b)
{p.style.borderWidth=this.HL_RESET;p.style.borderColor=this.HL_RESET;p.style.borderStyle=this.HL_RESET;p.itxtHilite=0;}
else
{p.style.borderWidth='2px';p.style.borderColor=c;p.style.borderStyle=b;p.itxtHilite=1;}}
catch(x)
{}}}},isLoggingOn:function(logType,logOpts)
{return!!($iTXT.debug.Level);},msg:function(msg)
{$iTXT.debug.info($iTXT.debug.Category.OLD,msg);},dumpItxt:function()
{var m=arguments,t=$iTXT,n='$iTXT';for(var i=0,l=m.length;i<l;i++)
{n+='.'+m[i];t=t[m[i]];}
var d=this.isLoggingOn();var s=n+' =  '+$iTXT.core.Util.formatJSONString($iTXT.core.Util.serialiseJSON(t,null,true),d);if(d)
{$iTXT.debug.info($iTXT.debug.Category.GENERAL,s);}
else
{return s;}}};}