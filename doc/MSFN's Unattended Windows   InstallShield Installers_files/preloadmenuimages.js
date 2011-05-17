/*
   Milonic DHTML Menu Image Pre-loading Module preloadmenuimages.js version 1.0 December 5th 2004
   This module is only compatible with the Milonic DHTML Menu version 5.16 or higher

   Copyright 2004 (c) Milonic Solutions Limited. All Rights Reserved.
   This is a commercial software product, please visit http://www.milonic.com/ for more information.
   
   USE: This module does not need any parameters but needs to be placed after the menus have been built
   
   SYNTAX: <script language="JavaScript1.2" type="text/javascript" src="preloadmenuimages.js"></script> 
*/

_mIms=new Array();

function _mPLF(_img)
{
	for(_x=0;_x<_mIms.length;_x++)
	{
		if(_img==_mIms[_x])return
		_x++
	}
	
	_mIms[_mIms.length]=_img
	_mIms[_mIms.length]=new Image()
	_mIms[_mIms.length-1].src=_img
}


function mmenuPreLoadImages()
{
	for(_i=0;_i<_mi.length;_i++)
	{
		_I=_mi[_i]
		
		if(_I[24])_mPLF(_I[24])
		if(_I[29])_mPLF(_I[29])
		if(_I[32])_mPLF(_I[32])
		if(_I[46])_mPLF(_I[46])
		if(_I[47])_mPLF(_I[47])
		if(_I[48])_mPLF(_I[48])
		if(_I[56])_mPLF(_I[56])
		if(_I[69])_mPLF(_I[69])
		if(_I[71])_mPLF(_I[71])
		if(_I[73])_mPLF(_I[73])
	}
}

mmenuPreLoadImages()