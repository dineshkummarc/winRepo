// JavaScript Document

_menuCloseDelay=500           // The time delay for menus to remain visible on mouse out
_menuOpenDelay=150            // The time delay before menus open on mouse over
_followSpeed=5                // Follow scrolling speed
_followRate=50                // Follow scrolling Rate
_subOffsetTop=2               // Sub menu top offset
_subOffsetLeft=-10            // Sub menu left offset
_scrollAmount=3               // Only needed for Netscape 4.x
_scrollDelay=20               // Only needed for Netcsape 4.x



with(XPMainStyle=new mm_style()){
onclass="root_menu_on";
offclass="root_menu_off";
bordercolor="#E1E1E1";
borderstyle="solid";
borderwidth=0;
separatorcolor="#E1E1E1";
imageposition="middle";
separatorsize="4";
subimagepadding="2";
}


with(XPMenuStyle=new mm_style()){
offclass="sub_menu_off";
onclass="sub_menu_on";
bordercolor="#8A867A";
borderstyle="solid";
borderwidth=1;
separatorcolor="#8A867A";
separatorpadding="2";
separatoralign="center";
separatorwidth="95%";
image="/global/menu/icons/xpblank.gif";
imageposition="middle";
imagealign="left";
subimage="/global/menu/icons/arrow.gif";
subimageposition="middle";
overfilter="Shadow(color='#777777', Direction=135, Strength=5)";
menubgcolor="#FFFFFF";
menubgimage="/global/menu/icons/winxp_test.gif";
onborder="1px solid #316AC5";
}