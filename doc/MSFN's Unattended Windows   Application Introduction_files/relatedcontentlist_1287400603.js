if (!$iTXT) {var $iTXT = {};};
if (!$iTXT.tmpl) {$iTXT.tmpl = {};};
if (!$iTXT.tmpl.components) {$iTXT.tmpl.components = {};};

//////////////////////////////////////////////////////////////////
//TEMPLATE LOAD INDICATOR! DO NOT REMOVE
//////////////////////////////////////////////////////////////////
$iTXT.tmpl.loader["$iTXT.tmpl.components.RelatedContentList"] = true;
//////////////////////////////////////////////////////////////////

$iTXT.tmpl.components.RelatedContentList_Load = function()
{

	$iTXT.tmpl.components.RelatedContentList = $iTXT.core.Class.create($iTXT.tmpl.ElementBase,
		    /** @lends $iTXT.tmpl.components.RelatedContentList.prototype */
		    {
		    	
				showMore: true,
				
		        /**
		         * RelatedContentList class for rendering a list of adverts
		         * @constructs
		         * @augments $iTXT.tmpl.ElementBase
		         * @param {Object} _options The new object options
		         * @param {Advert} ad The advert object
		         */
		        init: function(_options, ad, $super)
		        {		    	
		
					//Create some parameter defaults
					//for this component
					this.paramDefaults = 
					{						
					};
		
		            //default options
		            var defOpts = $iTXT.core.Util.extend(
		            {
		                id: $iTXT.tmpl.ElementIdentifier.get("itxtRelatedContentList")
		            }
		            , _options);
		            
		            //Get the sub adverts array
		            this.rcArticles = ad.params.get("rc.articles", []);
		            
		            //Get the featured article
		            this.featuredArticle = ad.params.get("rc.featured");
		            
		            this.showMore = ad.params.get("rc.list.showmore");
		            
		            //call super constructor
		            $super(defOpts, ad);      		
		            
		            this._build();
		        },
		        
		        /**
		         * 
		         */
		        _build: function()
		        {
		        	
		        	//shortcut to properties
		        	var p = this.properties;
		        	
		        	this.rootElement.itxtSetStyle(
		        			{
		        				overflow: 'hidden'
		        			});			        	
		        	
		        	this.rowHolder = $iTXT.core.Builder.make("DIV", {id:"rcholder", className: "bxSizeBorder"});		
		        	this.rowHolder.itxtSetStyle(
		        			{
		        				overflow: 'auto',
		        				overflowX: 'hidden',
		        				backgroundColor: p.bgCol,
		        				backgroundImage: "url(" + p.topShadow + ")",
		        				backgroundRepeat: 'repeat-x',
		        				backgroundPosition: 'top',
		        				borderTop: p.topBorder,
		        				paddingBottom: '15px'
		        			});	
		        	this.rootElement.itxtAppendChild(this.rowHolder);
		        	
		        	//Count on the rows
		        	var rowCount = 0;		        
		        	
		        	if (this.featuredArticle)
		        	{
		        		var ad = this._buildFeaturedAd(this.featuredArticle,rowCount);
	        			//append the row DOM element
	        			this.rowHolder.appendChild(ad);		        			
	        			rowCount++;
		        	}
		        	
		        			 
		        	//set the max articles
		        	var ma = parseInt(p.maxArticles);
		        	var ads = this.rcArticles;
		        	if (ads && $iTXT.core.Util.isArray(ads))
		        	{
		        		for (var i=0;i<ads.length;i++)
		        		{
		        			if (i<ma)
		        			{
			        			var ad = this._buildRCAdvert(i, rowCount);
			        			//append the row DOM element
			        			this.rowHolder.appendChild(ad);		        			
			        			rowCount++;
		        			}
		        		}
		        	}
		        	
		        	
		        	this.sizeDiv = $iTXT.core.Builder.make("DIV", {id:"rcsizediv", style: "width: auto;height:0px;"});
		        	this.rowHolder.appendChild(this.sizeDiv); 
		        	
		        	this.bottomHolder = $iTXT.core.Builder.make("DIV", {});
		        	this.bottomHolder.itxtSetStyle(
		        			{
		        				position: 'absolute',
		        				bottom: '0px',
		        				left: '0px',
		        				height: '20px',
		        				width: '100%'
		        			});
		        	
		        	this.rootElement.appendChild(this.bottomHolder); 
		        	
		        	
		        	this.bottomShadow = $iTXT.core.Builder.make("DIV", {});		        	
		        	this.bottomShadow.itxtSetStyle(
		        			{
		        				borderBottom: p.holderBottomBorder,
		        				backgroundImage: "url(" + p.shadowBottom + ")",
		        				backgroundRepeat: 'repeat-x',
		        				backgroundPosition: 'bottom',
		        				position: 'absolute',
		        				bottom: '0px',
		        				left: '0px',
		        				height: '6px'
		        			});
		        	
		        	this.bottomHolder.itxtAppendChild(this.bottomShadow);
		        	
		        	if ($iTXT.core.Util.parseBool(p.showMore))
		        	{		        		
		        		
		        		this.moreResultsA = $iTXT.core.Builder.make("A", {className: 'itxtahoverul', style: 'height: 20px;line-height: 20px;cursor:pointer;'}, [p.moreResText]);
		        		this.moreResultsA.itxtSubscribe("click", $iTXT.core.Event.bind(this, this.moreClick));
		        		
			        	this.moreResults = $iTXT.core.Builder.make("DIV", {});		        	
			        	this.moreResults.itxtSetStyle(
			        			{
			        				color: p.showMoreCol,
			        				backgroundImage: "url(" + p.showMoreBg + ")",
			        				backgroundRepeat: 'no-repeat',
			        				backgroundPosition: 'left bottom',
			        				position: 'absolute',
			        				bottom: '0px',
			        				right: '0px',
			        				fontSize: '12px',
			        				fontWeight: 'bold',
			        				fontFamily: 'Arial,Helvetica,Sans-Serif',
			        				padding: '0 10px 0 25px',
			        				height: '20px',
			        				lineHeight: '20px'
			        			});
			        	
			        	this.bottomHolder.itxtAppendChild(this.moreResults);	
			        	this.moreResults.itxtAppendChild(this.moreResultsA);
			        	
		        	}
		        	

		        },
		        
		        /**
		         * Overriden resize function for resizing the image component
		         * @param (Integer} w The width available for this element to use
		         * @param {Integer} h The height available for this element to use
		         */
		        _resize: function(w, h, $super)
		        { 		        		
		        	this.rootElement.itxtSetStyle({width: w + "px", height: h + "px"});
		        	this.rowHolder.itxtSetStyle({width: w + "px", height: h + "px"});
		        	this.bottomShadow.itxtSetStyle({width: w + "px"});
		        	
		        	//Call the super method
		        	//to resize the rows.
		        	$super(this.rowHolder.clientWidth, h);
		        	
		        	//Fix width of the more results tab
		        	this.fixWidth();		        
		        
		        	
		        	return [w,h];
		        },		        		        
		        
		        /**
		         * Override neededSize method to return the size that is needed by this element if its content based
		         * @param {Integer} w The available width should the component need it
		         * @param {Integet} h The available height should the component need it
		         */
		        _neededSize: function(w, h, $super)
		        {
		        	this.rootElement.itxtSetStyle({width: w + "px", height: this.properties.height});
		        	return [w,h];
		        },
		        
		        /**
		         * Builds an {$iTXT.data.Advert} object for the related content article 
		         */
		        _buildRCAdvert: function(i, rowNumber)
		        {		    
		        	//shortcuts
		        	var b = $iTXT.core.Builder;
		        	var u = $iTXT.core.Util;
		        	var p = this.properties;
		        	var d = this.rcArticles[i];
		        	
		        	
		        	
		        	var title = b.make("DIV",{},[u.summarize(d.title, p.titleLength)]);
		        	title.itxtSetStyle(
        			{
        				color: p.titleCol,
        				fontSize: '12px',
						fontWeight: 'bold'
        			});
		        	var body = b.make("DIV",{},[u.summarize(d.summary, p.bodyLength)]);
		        	body.itxtSetStyle(
        			{
        				color: p.bodyCol,
        				fontSize: '11px'
        			});
		        	var url = b.make("DIV",{},[u.summarize(d.url, p.urlLength)]);
		        	url.itxtSetStyle(
        			{
        				color: p.urlCol,
        				fontSize: '11px'						
        			});
		        	
		        	var hldr = b.make("DIV",{},[title, body, url]);
		        	hldr.itxtSetStyle(
        			{
        				backgroundColor: p.itemBgCol,
        				cursor: 'pointer',
        				fontFamily: 'Arial,Helvetica,Sans-Serif',
        				padding: '10px 10px 0 10px'
        			});
		        	//Dom events for the holder div
		        	hldr.itxtSubscribe("mouseover", function(){this.style.backgroundColor=p.itemHvBgCol;});
		        	hldr.itxtSubscribe("mouseout", function(){this.style.backgroundColor=p.itemBgCol;});
		        	hldr.itxtSubscribe("click", function(){if (p.itemClick){p.itemClick(rowNumber, d.url);}});
		        	
		        	
		        	
		        	return hldr;
		        },
		        
		        
		        /**
		         * Builds an {$iTXT.data.Advert} object for the related content article 
		         */
		        _buildFeaturedAd: function(d, rowNumber)
		        {		    
		        	//shortcuts
		        	var b = $iTXT.core.Builder;
		        	var u = $iTXT.core.Util;
		        	var p = this.properties;
		        	
		        	
		        	
		        	var title = b.make("DIV",{},[u.summarize(d.title, p.titleLength)]);
		        	title.itxtSetStyle(
        			{
        				color: p.titleCol,
        				fontSize: '12px',
						fontWeight: 'bold'
        			});
		        	
		        	var bodyArr = [];
		        	if (d.logo && ""!=d.logo)
		        	{
			        	var logo = b.make("IMG",{src:d.logo});
			        	logo.itxtSetStyle(
	        			{
	        				cssFloat: 'right',
	        				padding:'0 0 0 5px'
	        			});
			        	bodyArr.push(logo);
		        	}
		        	
		        	bodyArr.push(u.summarize(d.text, p.bodyLength));
		        	
		        	var body = b.make("DIV",{},bodyArr);
		        	body.itxtSetStyle(
        			{
        				color: p.bodyCol,
        				fontSize: '11px'
        			});
		        	

		        	
		        	var url = b.make("DIV",{},[u.summarize(d.merchant, p.urlLength)]);
		        	url.itxtSetStyle(
        			{
        				color: p.urlCol,
        				fontSize: '11px'						
        			});
		        	
		        	var hldr = b.make("DIV",{},[title, body, url]);
		        	hldr.itxtSetStyle(
        			{
        				backgroundColor: p.featBgCol,
        				cursor: 'pointer',
        				fontFamily: 'Arial,Helvetica,Sans-Serif',
        				padding: '10px 10px 10px 10px'
        			});
		        	//Dom events for the holder div
		        	hldr.itxtSubscribe("mouseover", function(){this.style.backgroundColor=p.featHvBgCol;});
		        	hldr.itxtSubscribe("mouseout", function(){this.style.backgroundColor=p.featBgCol;});
		        	hldr.itxtSubscribe("click", function(){if (p.itemClick){p.featuredClick(rowNumber, d.url, d.did, d.mdh);}});
		        	
		        	
		        	
		        	return hldr;
		        },
		        
		        
		        /**
		         * Fix the width of the bottom holder container, so it takes into
		         * account any scrollbars..
		         */
		        fixWidth: function()
		        {
		        	//Access the scrollHeight and clientHeight param, as this forces IE to actually check the
		        	//scrollbars on the DIV, which should be visible if the container is overflowing		        	
		        	var i = this.rowHolder.scrollHeight;
		        	var i2 = this.rowHolder.clientHeight;
		        	this.bottomHolder.itxtSetStyle({width: (this.sizeDiv.clientWidth) + "px"});
		        },
		        
		        moreClick: function()
		        {
		        	if (this.properties.moreResultsCallback)
		        	{
		        		this.properties.moreResultsCallback(null, 27);
		        	}
		        },
		        
		        /**
		         * Adds a sponsored lising underneath the featured listing, or at the top
		         * of the list.
		         * 
		         */
		        adSponsoredListing: function()
		        {
		        	
		        }
		        
		    });//end RelatedContentList class
	
	
}

