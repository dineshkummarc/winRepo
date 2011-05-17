if (!$iTXT) {var $iTXT = {};};
if (!$iTXT.tmpl) {$iTXT.tmpl = {};};
if (!$iTXT.tmpl.js) {$iTXT.tmpl.js = {};};
//////////////////////////////////////////////////////////////////
//TEMPLATE AND COMPONENT IMPORTS
//////////////////////////////////////////////////////////////////
//Include the ad repeater component
$iTXT.tmpl.dependsOn("RelatedContentList", true);
$iTXT.tmpl.dependsOn("SearchBar", true);

//////////////////////////////////////////////////////////////////
//TEMPLATE LOAD INDICATOR! DO NOT REMOVE
//////////////////////////////////////////////////////////////////
$iTXT.tmpl.loader["$iTXT.tmpl.js.RelatedContent"] = true;
//////////////////////////////////////////////////////////////////

$iTXT.tmpl.js.RelatedContent_Load = function()
{
	////////////////////////////////////////////////////////
	//CALL ANY REQUIRED COMPONENT OR TEMPLATE LOAD FUNCTIONS
	$iTXT.tmpl.components.RelatedContentList_Load();
	$iTXT.tmpl.components.SearchBar_Load();
	////////////////////////////////////////////////////////
	
    $iTXT.tmpl.js.RelatedContent = $iTXT.core.Class.create($iTXT.tmpl.TemplateBase,
    	    {
    	
    	
		    	/**
				 * Overriden afterTokenize method, that is called before the template has been built,
				 * but after it has been created    			 
				 */
    			afterTokenize: function()
				{
    				
    				//shortcut to ad params
    				var adps = this.advert.params;
    				
    				//Check if there is some advert html set, and if the slide out
    				//advert unit should be used.
    				var adhtml = adps.get("iefh", "");
    				var soa = adps.getBool("iesoa", false);
    				if (soa)
    				{
    					//Slide out ad is used, remove ad cell
    					this.removeElement("AdvertCell");
    					this.removeElement("AdvertPaddingCell");
    				} 
    				else if (""==adhtml)
    				{
    					//ad html is empty, remove ad cell
    					this.removeElement("AdvertCell");
    					this.removeElement("AdvertPaddingCell");
    				}
    				else
    				{
    					//Ad html is set, and soa is not being used, so set the rc.ad.html param    					
    					adps.set("rc.ad.html", adhtml, $iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);
    					var rcw = adps.getInt("rc.width",450);
    					adps.set("width", rcw+310, $iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);
    				}
    	
    				//Check for the search url, if none remove the search bar
    				var iessu = this.advert.params.get("iessu", "");
    				if (""==iessu)
    				{
    					this.removeElement("BottomSearchBar");
    					this.removeElement("TopSearchBar");
    					adps.set("rc.list.showmore", "0", $iTXT.cnst.WEIGHTING_DEFAULT_TEMPLATE);
    				}
    				else
    				{
	    				//Check the search bar position parameter 
	    				var searchBarPos = adps.parse("${rc.sb.state}");   				
	    				if ("1"==searchBarPos)
	    				{
	    					//If position is 1, then remove bottom bar
	    					this.removeElement("BottomSearchBar");
	    					adps.set("rc.list.showmore", "1", $iTXT.cnst.WEIGHTING_DEFAULT_TEMPLATE);
	    				}
	    				else if ("2"==searchBarPos)
	    				{
	    					//If position is 2, then remove top bar
	    					this.removeElement("TopSearchBar");
	    					//and change the footer/tail colours and remove show more link
	        	        	$iTXT.core.$(document).itxtFire("$iTXT:tt:ftr:set:bgcol",adps.get("rc.ftr.sbb.col"));
	        	        	$iTXT.core.$(document).itxtFire("$iTXT:tt:ftr:set:hvcol",adps.get("rc.ftr.sbb.col"));
	        	        	$iTXT.core.$(document).itxtFire("$iTXT:tt:tail:set:bgcol",adps.get("rc.tail.sbb.col"));        	        	
	        	        	$iTXT.core.$(document).itxtFire("$iTXT:tt:tail:set:hvcol",adps.get("rc.tail.sbb.col"));
	        	        	adps.set("rc.list.showmore", "0", $iTXT.cnst.WEIGHTING_DEFAULT_TEMPLATE);
	    				}
	    				else
	    				{
	    					this.removeElement("BottomSearchBar");
	    					this.removeElement("TopSearchBar");
	    					adps.set("rc.list.showmore", "0", $iTXT.cnst.WEIGHTING_DEFAULT_TEMPLATE);
	    				}
    				}
    				

    				
    				//Get the old related content logo url, strip it down so
    				//its using the newer png versions of the logo
    				var rcLogo = adps.get("rctu","");
    				var newRcLogo = adps.get("rc.sb.logo","");    				
    				if (""!=rcLogo && ""==newRcLogo)
    				{
    					var lindx = rcLogo.lastIndexOf("/");
    					if (-1!=lindx && rcLogo.length>4)
    					{	    					
	    					adps.set
	    							(
	    							"rc.sb.logo", 
	    							"${rc.img.dir}/logos_v4/" + rcLogo.substring(lindx,rcLogo.length-4) + ".png", 
	    							$iTXT.cnst.WEIGHTING_DEFAULT_TEMPLATE
	    							);
    					}
    				}
    				//If we have a logo of some sort, then pre-load it
    				if (""!=rcLogo || ""!=newRcLogo )
    				{
    					$iTXT.core.Util.cacheImage(adps.parse("${rc.sb.logo}"));
    				}
    				
    				var articles = adps.get("rc.articles", []);
		        	var sLen = 80;
		        	var maxRows = parseInt(adps.parse("${rc.list.max.articles}"));
		        	var noAds = articles.length;
		        	if (1==noAds)
		        	{
		        		sLen = 255;
		        	}
		        	else if (2==noAds)
		        	{
		        		sLen = 130;
		        	}
		        	else if (noAds<maxRows)
		        	{
		        		sLen = 110;
		        	}
		        	adps.set("rc.list.body.len", sLen, $iTXT.cnst.WEIGHTING_DEFAULT_TEMPLATE);
		        	
		        	//sort out the click tag for this advert, get it from the 1st rc article
		        	if (articles.length>0)
		        	{
		        		var firstAd = articles[0];
		        		var url = firstAd.url;
		        		if (url)
		        		{
		        			adps.set("CLICKTAG", url, $iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);
		        		}
		        	}
    				
				},
				
				
		        /**
		         * Override the hook style.
		         */
		        onBuildHookStyle: function(hkDefOpts)
		        {    
					var adps = this.advert.params;
		           	//Get the rc hook style
		           	var hks = adps.get("rc.hk.style");
		           	//If is not null and empty and not set to default token
		           	if (null!=hks && ""!=hks && "${rc.hk.def.style}"!=hks)
		           	{
		           		//If hook style is set get hook hover style
		           		var hkhs = adps.get("rc.hk.h.style");
		           		if (hkhs==null || ""==hkhs || "${rc.hk.def.h.style}"==hkhs)
		           		{
		           			//if hook hover style is not set then set to
		           			//same as hook style, with a background colour
		           			adps.set("rc.hk.h.style", "${rc.hk.style};background-color:${rc.hk.bg.h.col};", $iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);		           			
		           		}
		           	}
		           	
	           		hkDefOpts.hookActiveStyle = "${rc.hk.h.style}";
	           		hkDefOpts.hookStyle = "${rc.hk.style}";
					
		        },
		        
		        /**
		         * Method called when the search button or more results button is clicked.
		         * 
		         * @param {String} kw The keyword to use or null if default
		         * @param {Integer} so The source of the click
		         */
		        searchClick: function(kw, so)
		        {
		        	//If there is no passed kw, then
		        	//use the adverts default keyword
		        	if (!kw || ""==kw)
		        	{
		        		kw = this.advert.$A.kw;
		        	}
		        	
		        	//Get the search url
		        	var redir = this.advert.params.get("iessu", null);
		        	if (null != redir)
		        	{
		        		redir = redir.replace("_SEARCHKEYWORD_", encodeURIComponent(kw));
	        		 	var opts = 
	        		 	{
	        		 		redir: redir,
	        		 		advert: this.advert,
	        		 		so: so || 13
	        		 	};
	        		 	
	        		 	//Get the featured article
	        		 	var feat = this.advert.params.get("rc.featured", null);
	        		 	
	        		 	//If there is a wordcast ad
	        		 	if (null!=feat)
	        		 	{
	        		 		opts.di = this.advert.$A.did;
	        		 		opts.pid = 8;
	        		 	}
	        		 	
	        		 	$iTXT.core.$(document).itxtFire("$iTXT:tt:click", opts);
		        	}
		        	
		        },
		        
		        /**
		         * Overriden template base method which is called by adlogger when the hook is clicked.
		         * In here we can modify the click parameters depending on if this unit has wordcast etc.
		         */
		        onLogEvent: function(type, qp, a, o)
		        {
		        	if ($iTXT.data.LogEventType.HOOKCLICK==type)
		        	{
		        		//If there is a hook click, and we have a featured advert (wordcast)
		        		//then set the detail id to the wordcast detail id, wch to the wordcast
		        		//mdh, log detail id to the original adverts (RC) detail id and the
		        		//redirect to the wordcast destination click tag.
		        		
		        		//Get the featured article
	        		 	var feat = this.advert.params.get("rc.featured", null);
	        		 	
	        		 	//If there is a wordcast ad
	        		 	if (null!=feat)
	        		 	{	        		 		
	        		 		qp.di = feat.did;
	        		 		qp.wch = feat.mdh; 
	        		 		qp.ldid = this.advert.$A.did;
	        		 		qp.redir = feat.url;
	        		 		
	        		 		//set the options cts value
	        		 		o.cts = false;
	        		 	}
		        	}
		        	else if ($iTXT.data.LogEventType.ADVIEW==type)
		        	{
		        		//If there is an adview, and we have a featured advert (wordcast)
		        		//then set the wch parameter to the wordcast mdh, and the log detail id
		        		//to the wordcast detail id value.
		        		
		        		//Get the featured article
	        		 	var feat = this.advert.params.get("rc.featured", null);
	        		 	
	        		 	//If there is a wordcast ad
	        		 	if (null!=feat)
	        		 	{
	        		 		qp.wch = feat.mdh; 
	        		 		qp.ldid = feat.did;
	        		 	}
		        	}
		        	return true;
		        },
		        
		        featuredClick: function(i, ct, did, mdh)
		        {
		        	//If we have a featured (wordcast) click then we want
		        	//to set the redir to the wordcast destination url
		        	//detail id to the wordcast detai lid, wch value to the 
		        	//wordcast mdh and log detail id to the original advert
		        	//detail id.
		        			        	
		        	
        		 	var opts = 
        		 	{
        		 		advert: this.advert,
        		 		so: $iTXT.cnst.Source.IEB + i,
        		 		redir: ct,
        		 		di: did,
        		 		wch: mdh,
        		 		ldid: this.advert.$A.did,
        		 		cts: false
        		 	};
        		 	$iTXT.core.$(document).itxtFire("$iTXT:tt:click", opts);
		        },
		        
				itemClick: function(i, ct)
				{
        		 	var opts = 
        		 	{
        		 		advert: this.advert,
        		 		so: $iTXT.cnst.Source.IEB + i,
        		 		redir: ct
        		 	};
        		 	$iTXT.core.$(document).itxtFire("$iTXT:tt:click", opts);
        		 	
				},
				
    	        init: function(_options, $super)
    	        {
		        	
		        	//Do some preprocessing for the hook icon, as its a bit funny with 
		        	//related content adverts, as there are no campaign script params
		        	//so the server side code never works.
		        	if (_options.advert)
		        	{
		        		var p = _options.advert.params;
		        		var atig0 = p.get("atig0");
		        		var w = $iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN;
		        		if ("none"==atig0)
		        		{
		        			p.set("hk.icon","",w);
		        			p.set("hk.icon.active","",w);
		        		}
		        		else if (""!=atig0)
		        		{
		        			p.set("hk.icon",atig0,w);
		        			p.set("hk.icon.active",atig0,w);
		        		}
		        	}
    	
			    	//Set the paremter default values
					this.paramDefaults = $iTXT.core.Util.extend(
					{
						'rc.sl.url': 'http://${server}/rcsl.jsp?ipid=${ipid}&di=${a.ldid}&cc=${cc}&rcc=${rcc}&reg=${reg}&dma=${dma}&pvu=${pvu}&mh=${sid}&enc=${enc}',
						'iert': '${iera}',
						'hdr.txt': '${iert}',
						'rc.img.dir': 'http://images.intellitxt.com/ast/related_content/',
						'rc.sb.logo': '',
						'rc.sb.bg': '${rc.img.dir}assets/sb_bg.png',
						'rc.sb.ipbg': '${rc.img.dir}assets/ip_bg.png',
						'rc.sb.iplbg': '${rc.img.dir}assets/ip_lbg.png',
						'rc.sb.btnbg': '${rc.img.dir}assets/btn_search.png',
						'ielc': '#CE621F',
						'rc.sb.btn.col': '${ielc}',
						'hk.icon': 'mag-glass_10x10.gif',
						'hk.icon.active': 'mag-glass_10x10.gif',
						//default hook style override
						'rc.hk.def.style': 'text-decoration: none; border-bottom: 1px dotted ${rc.hk.fg.col}; border-top: none; color: ${rc.hk.fg.col}; background-color: ${rc.hk.bg.col}',
						//default active hook style override
						'rc.hk.def.h.style': 'text-decoration: none; border-bottom: 0.2em solid ${rc.hk.fg.h.col}; border-top: none; color: ${rc.hk.fg.h.col}; background-color: ${rc.hk.bg.h.col}',
						'rc.hk.style': '${rc.hk.def.style}',
						'rc.hk.h.style': '${rc.hk.def.h.style}',
						//default rc hook foreground colour
						'rc.hk.fg.col': '#95181C',
						//default rc hook active foreground colour
						'rc.hk.fg.h.col': '#0099FF',
						//default rc hook background colour
						'rc.hk.bg.col': 'transparent',
						//default rc hook active background colour
						'rc.hk.bg.h.col': 'transparent',
						'rc.ftr.sbb.col' : '#d6d6d6$$#d6d6d6$$#d5d4d4$$#d1d1d2$$#cecece$$#cbcbcb',
						'rc.tail.sbb.col' : '#c7c7c7$$#c3c3c3$$#c1c1c1$$#bfbebf$$#bdbdbd$$#bbbbbc$$#bababb$$#b9b9b8$$#b7b7b7$$#b6b5b5$$#b5b5b4$$#b3b3b3$$#b2b2b2$$#b0b1b0$$#afafaf$$#aeaeae',						
						'rc.list.more' : '1',
						'rc.list.bg.col' : 'white',
						'rc.list.title.col' : '${ielc}',
						'rc.list.body.col' : '#333333',
						'rc.list.url.col' : '#008000',
						'rc.list.shad.top' : '${rc.img.dir}assets/shadow_t.png',
						'rc.list.shad.bottom': '${rc.img.dir}assets/shadow_b.png',
						'rc.list.border.top' : '1px solid #A0A0A0',
						'rc.list.ad.bg.col': '#FFFFAA',
						'iel': 3,
						'rc.list.max.articles': '${iel}',
						'rc.hldr.border.bottom' : '1px solid #A0A0A0',
						'rc.hldr.more.bg' : '${rc.img.dir}assets/tab_moreresults.png',
						'rc.hldr.more.col': '${ielc}',						
						'rc.ftr.def.col': '#f0f0f0',
						'rc.tail.def.col': '#f0f0f0',
						'tt.ftr.col': '${rc.ftr.def.col}',
						'tt.tail.col': '${rc.tail.def.col}',
						'tt.ftr.h.col': '${rc.ftr.def.col}',
						'tt.tail.h.col': '${rc.tail.def.col}',						
						'tt.bg.col': '${rc.ftr.def.col}',
						'rcadbgclr': '#333333',
						'rc.ad.bgc': '${rcadbgclr}',
						'rc.ad.hv.bgc': '${rc.ad.bgc}',
						'rc.item.bgc': '',
						'rc.item.hv.bgc': '',
						'rcsrchbr': '1',
						'rc.sb.state': '${rcsrchbr}',
						'rc.list.title.len': 80,
						'rc.list.url.len': 80,						
						'width': 450,
						'height': 250,
						'rc.width': 450,
						'tmpl.soa.enabled': 1 //Enable the slide out advert for this template
					}, this.paramDefaults);
					//End set parameter defaults
		
    	             //default options
    	             var defOpts = $iTXT.core.Util.extend(
    	             {
    	            	 width: '${width}',
    	            	 height: '${height}',
    	            	 ttbgcol: 'white',
    	            	 tthbgcol: 'white',
    	            	 ttfooterbgcol: '#F0F0F0',
    	            	 tthoverfooterbgcol: '#F0F0F0',
    	            	 tttailbgcol: '#F0F0F0',
    	            	 tthovertailbgcol: '#F0F0F0'
    	             }
    	             , _options);
    	             
    	             //Define the template structure
    	             this.structure = 
    	             [	
    	              {
    	            	  type: 'row',
    	            	  height: '*',
    	            	  width: '*',
    	            	  structure:
    	            	  [
    	            	   {
    	            		   type: 'cell',
    	            		   height: '*',
    	            		   width: 450,
    	            		   structure:
    	            		   [
		    	            	   {
			    	            	  type: 'row',
			    	            	  UID: 'TopSearchBar',
			    	            	  height: '**',
			    	            	  width: '**',
			    	                  structure:
			    	                      [    	                       	
			     	                       {
			    	                           type: 'cell',
			    	                           height: '**',
			    	                           width: '**',
			    	                           structure: 
			    	                               [
														{
														 	type: 'comp',
														 	height: 40,
														 	width: '**',
														 	klass: '$iTXT.tmpl.components.SearchBar',
														 	id: 'itxtrctopsb',
														 	styles:
						                            	 	{
						                            	 	},
														 	props:
														 	{
						                            	 		bgimg: '${rc.sb.bg}',
						                            	 		ipbg: '${rc.sb.ipbg}',
						                            	 		iplbg: '${rc.sb.iplbg}',
						                            	 		logo: '${rc.sb.logo}',
						                            	 		btnbg: '${rc.sb.btnbg}',
						                            	 		btncol: '${rc.sb.btn.col}',
						                            	 		btntxt: "${trans.search}",
						                            	 		searchtxt: '${a.kw}',			                            	 		
						                            	 		ipLeftMargin: -5,
						                            	 		searchCallback: $iTXT.core.Event.bind(this, this.searchClick)
														 	}
														 }
			    	                                ]
			    	                       	}
			    	                       ]
			    	              },
			    	              {
			    	            	  type: 'row',
			    	            	  UID: 'ResultsPanel',
			    	            	  width: '**',
			    	                  structure:
			    	                      [    	                       	
			     	                       {
			    	                           type: 'cell',
			    	                           width: '**',
			    	                           structure: 
			    	                               [
														{
														 	type: 'comp',
														 	UID: 'RCList',	
														 	height: '*',
														 	klass: '$iTXT.tmpl.components.RelatedContentList',
														 	id: 'itxtrclist',
														 	styles:
						                            	 	{
						                            	 	},
														 	props:
														 	{
						                            	 		bgCol: '${rc.list.bg.col}',
						                            	 		topShadow: '${rc.list.shad.top}',
						                            	 		topBorder: '${rc.list.border.top}',
						                            	 		holderBottomBorder: '${rc.hldr.border.bottom}',
						                            	 		shadowBottom: '${rc.list.shad.bottom}',
						                            	 		showMore: '${rc.list.showmore}',
						                            	 		showMoreCol: '${rc.hldr.more.col}',
						                            	 		showMoreBg: '${rc.hldr.more.bg}',
						                            	 		moreResText: '${trans.moreres} &gt;',
						                            	 		itemBgCol: '${rc.item.bgc}',
						                            	 		itemHvBgCol: '${rc.item.hv.bgc}',
						                            	 		featBgCol: '${rc.ad.bgc}',
						                            	 		featHvBgCol: '${rc.ad.hv.bgc}',
						                            	 		moreResultsCallback: $iTXT.core.Event.bind(this, this.searchClick),
						                            	 		titleCol: '${rc.list.title.col}',
						                            	 		titleLength: '${rc.list.title.len}',
						                            	 		bodyLength: '${rc.list.body.len}',
						                            	 		bodyCol: '${rc.list.body.col}',
						                            	 		urlLength: '${rc.list.url.len}',
						                            	 		urlCol: '${rc.list.url.col}',
						                            	 		itemClick: $iTXT.core.Event.bind(this, this.itemClick),
						                            	 		featuredClick: $iTXT.core.Event.bind(this, this.featuredClick),
						                            	 		maxArticles: '${rc.list.max.articles}'
														 	}
														 }
			    	                                ]
			    	                       	}
			    	                       ]
			    	              },
			    	              {
			    	            	  type: 'row',
			    	            	  UID: 'BottomSearchBar',
			    	            	  height: '**',
			    	            	  width: '**',
			    	                  structure:
			    	                      [    	                       	
			     	                       {
			    	                           type: 'cell',
			    	                           height: '**',
			    	                           width: '**',
			    	                           structure: 
			    	                               [
														{
														 	type: 'comp',
														 	height: 40,
														 	width: '**',
														 	klass: '$iTXT.tmpl.components.SearchBar',
														 	id: 'itxtrcbottomsb',
														 	styles:
						                            	 	{
						                            	 	},
														 	props:
														 	{
						                            	 		bgimg: '${rc.sb.bg}',
						                            	 		ipbg: '${rc.sb.ipbg}',
						                            	 		iplbg: '${rc.sb.iplbg}',
						                            	 		logo: '${rc.sb.logo}',
						                            	 		btnbg: '${rc.sb.btnbg}',
						                            	 		btncol: '${rc.sb.btn.col}',
						                            	 		btntxt: "${trans.search}",
						                            	 		searchtxt: '${a.kw}',
						                            	 		ipLeftMargin: -5,
						                            	 		searchCallback: $iTXT.core.Event.bind(this, this.searchClick)
														 	}
														 }
			    	                                ]
			    	                       	}
			    	                       ]
			    	              }			    	              
			    	          ]
    	            	   },
    	            	   {
		    	            	  type: 'cell',		
		    	            	  UID: 'AdvertPaddingCell',
		    	            	  height: 250,
	    	            		  width: 5,
	    	            		  styles: 
	    	            		  {
    	            		   		backgroundColor: '${tt.ftr.col}'
	    	            		  },
	    	            		  hoverstyles: 
	    	            		  {
    	            		   		backgroundColor: '${tt.ftr.h.col}'
	    	            		  }
		    	           },
    	            	   {
		    	            	  type: 'cell',		
		    	            	  UID: 'AdvertCell',
		    	            	  height: 250,
	    	            		  width: 300,	 
	    	            		  styles: 
	    	            		  {
		    	        	   		backgroundColor: 'white'
	    	            		  },
		    	            	  structure:
		    	            	  [
		    	            	   {
		    	            		   type: 'comp',
		    	            		   height: 250,
		    	            		   width: 300,
		    	            		   klass: '$iTXT.tmpl.Html',
		    	            		   id: 'itxtrcadvert',
		    	            		   props:
		    	            		   {
                         	 			src: '${rc.ad.html}'
		    	            		   }
		    	            	   }
		    	            	  ]
		    	            },
		    	            {
		    	            	  type: 'cell',		
		    	            	  UID: 'AdvertPaddingCell',
		    	            	  height: 250,
	    	            		  width: 5,
	    	            		  styles: 
	    	            		  {
  	            		   			backgroundColor: '${tt.ftr.col}'
	    	            		  },
	    	            		  hoverstyles: 
	    	            		  {
	    	            			  backgroundColor: '${tt.ftr.h.col}'
	    	            		  }
		    	           }
		    	           ]
    	              }
    	             ];
    	             
    	             $super(defOpts);
    	        }
    	    });    
    	
	
	
}