/*
Copyright (c) 2011, comScore Inc. All rights reserved.
version: 4.6.3
*/
COMSCORE.SiteRecruit.Builder.config = {
	version: "4.6.3",
	
	// invitations' settings
	invitation: [
							
											{ 	methodology: 2,
					projectId: 'p77596864',
					weight: _centerW,
					isRapidCookie: false,
					acceptUrl: 'http://survey2.surveysite.com/wix/p77596864.aspx ',
					acceptParams: {
						raw: _raw_params,
						siteCode: _Site,
												cookie: [
													],
												otherVariables: [
													]
					},
					viewUrl: 'http://web.survey-poll.com/tc/CreateLog.aspx',
					viewParams: 'log=comscore/view/p77596864-view.log',
					content: '<table width="360" cellpadding="3" cellspacing="0" border="0" bgcolor="#FFFFFF"><tr><td style="padding: 3px;"> <table width="100%" cellpadding="1" cellspacing="0" border="0" bgcolor="#999999"><tr><td style="padding: 1px;"> <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF"><tr valign="top"><td> <img src="technet_logo.gif" /><img border="0" src="technet-close.gif" onclick="@declineHandler" /><br /> <img src="top-stripe.gif" /> <table width="100%" cellpadding="5"><tr><td>  <div style="font-family: Verdana, Arial, Helvetica, sans-serif;	font-size: 11px; color: #000000; margin-left: 10px; margin-right: 10px; margin-top: 10px; margin-bottom: 10px; text-align:left">Microsoft is conducting an online survey to understand your opinion of the TechNet Web site.  If you choose to participate, the online survey will be presented to you when you leave the TechNet Web site. <br /><br /> Would you like to participate?    </div>  <div align="center" style="font-family: Verdana, Arial, Helvetica, sans-serif;	font-size: 11px; color: #000000; margin-bottom:15px;"> <input style="margin: 0; padding: 0" type="button" value="  Yes  " onclick="@acceptHandler" />&nbsp;&nbsp; <input style="margin: 0; padding: 0"  type="button" value=" No " onclick="@declineHandler" /> </div>  <div style="font-family: Verdana, Arial, Helvetica, sans-serif;	font-size: 11px; color: #000000; margin-top: 0px; margin-bottom: 15px; margin-left: 10px; text-align:left"><a style="color:#0000EE; text-decoration: underline; " href="http://privacy.microsoft.com/en-us/default.mspx" target="_blank">Privacy Statement</a></div>  </td></tr></table> <img src="bottom-stripe.gif" /></td></tr></table> </td></tr></table> </td></tr></table>   ',
					height: 210,
					width: 390,
					revealDelay: 1000,
					horizontalAlignment: 1,
					verticalAlignment: 0,
					horizontalMargin: 0,
					verticalMargin: 0,
					isHideBlockingElements: false,
					isAutoCentering: true,
					url: 'SiteRecruit_Tracker.htm'
											,trackerWindow: {
							width: 400,
							height: 270,
							orientation: 1,
							offsetX: 0,
							offsetY: 0,
							hideToolBars: true,
							trackerPageConfigUrl: 'trackerConfig_TechNet-p77596864.js'
							// future feature: 
							//features: "location=0,menubar=0,resizable=1,scrollbars=1,toolbar=0"
						}
																			}
								
											,
								{ 	methodology: 2,
					projectId: 'p77737117',
					weight: _networkW,
					isRapidCookie: false,
					acceptUrl: 'http://survey2.surveysite.com/wix/p77737117.aspx',
					acceptParams: {
						raw: 'l=9',
						siteCode: '74',
												cookie: [
													],
												otherVariables: [
													]
					},
					viewUrl: 'http://web.survey-poll.com/tc/CreateLog.aspx',
					viewParams: 'log=comscore/view/p77737117-view.log',
					content: '<table width="360" cellpadding="3" cellspacing="0" border="0" bgcolor="#FFFFFF"><tr><td style="padding: 3px;"> <table width="100%" cellpadding="1" cellspacing="0" border="0" bgcolor="#999999"><tr><td style="padding: 1px;"> <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF"><tr valign="top"><td> <img src="technet_logo.gif" /><img border="0" src="technet-close.gif" onclick="@declineHandler" /><br /> <img src="top-stripe.gif" /> <table width="100%" cellpadding="5"><tr><td>  <div style="font-family: Verdana, Arial, Helvetica, sans-serif;	font-size: 11px; color: #000000; margin-left: 10px; margin-right: 10px; margin-top: 10px; margin-bottom: 10px; text-align:left">Microsoft is conducting an online survey to understand your opinion of the TechNet Web site.  If you choose to participate, the online survey will be presented to you when you leave the TechNet Web site. <br /><br /> Would you like to participate? </div>  <div align="center" style="font-family: Verdana, Arial, Helvetica, sans-serif;	font-size: 11px; color: #000000; margin-bottom:15px;"> <input style="margin: 0; padding: 0" type="button" value="  Yes  " onclick="@acceptHandler" />&nbsp;&nbsp; <input style="margin: 0; padding: 0"  type="button" value=" No " onclick="@declineHandler" /> </div>  <div style="font-family: Verdana, Arial, Helvetica, sans-serif;	font-size: 11px; color: #000000; margin-top: 0px; margin-bottom: 15px; margin-left: 10px; text-align:left"><a style="color:#0000EE; text-decoration: underline; " href="http://privacy.microsoft.com/en-us/default.mspx" target="_blank">Privacy Statement</a></div>  </td></tr></table> <img src="bottom-stripe.gif" /></td></tr></table> </td></tr></table> </td></tr></table>   ',
					height: 210,
					width: 390,
					revealDelay: 1000,
					horizontalAlignment: 1,
					verticalAlignment: 0,
					horizontalMargin: 0,
					verticalMargin: 0,
					isHideBlockingElements: false,
					isAutoCentering: true,
					url: 'SiteRecruit_Tracker.htm'
											,trackerWindow: {
							width: 400,
							height: 270,
							orientation: 1,
							offsetX: 0,
							offsetY: 0,
							hideToolBars: true,
							trackerPageConfigUrl: 'trackerConfig_TN-p77737117.js'
							// future feature: 
							//features: "location=0,menubar=0,resizable=1,scrollbars=1,toolbar=0"
						}
																			}
						]
};
COMSCORE.SiteRecruit.Builder.run();
