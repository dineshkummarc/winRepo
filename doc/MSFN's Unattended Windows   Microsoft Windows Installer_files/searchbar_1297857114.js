if (!$iTXT) {var $iTXT = {};};
if (!$iTXT.tmpl) {$iTXT.tmpl = {};};
if (!$iTXT.tmpl.components) {$iTXT.tmpl.components = {};};

//////////////////////////////////////////////////////////////////
//TEMPLATE LOAD INDICATOR! DO NOT REMOVE
//////////////////////////////////////////////////////////////////
$iTXT.tmpl.loader["$iTXT.tmpl.components.SearchBar"] = true;
//////////////////////////////////////////////////////////////////

$iTXT.tmpl.components.SearchBar_Load = function()
{

	$iTXT.tmpl.components.SearchBar = $iTXT.core.Class.create($iTXT.tmpl.ElementBase,
		    /** @lends $iTXT.tmpl.components.SearchBar.prototype */
		    {
		    	
		        /**
		         * SearchBar class for rendering a list of adverts
		         * @constructs
		         * @augments $iTXT.tmpl.ElementBase
		         * @param {Object} _options The new object options
		         * @param {Advert} ad The advert object
		         */
		        init: function(_options, ad, $super)
		        {		    		
		            //default options
		            var defOpts = $iTXT.core.Util.extend(
		            {
		                id: $iTXT.tmpl.ElementIdentifier.get("itxtSearchBar")
		            }
		            , _options);
		            
		            //call super constructor
		            $super(defOpts, ad);      
		            		      
		            var imgSrc = "http://images.intellitxt.com/ast/tt/09/px.gif";
		            if (this.properties.logo && ""!=this.properties.logo)		            
		            {
		            	//Create the search bar image
		            	imgSrc = this.properties.logo;
		            }
		            
		            this.rcImage = $iTXT.core.Builder.make("IMG", {id: this.options.id + "Image", src: imgSrc, style: "cursor:pointer;"});
		            //add click handler
		            this.rcImage.itxtSubscribe("click", $iTXT.core.Event.bind(this, this.bClk));
		            
		            var ipLeftImg = "http://images.intellitxt.com/ast/tt/09/px.gif";
		            if (this.properties.iplbg && ""!=this.properties.iplbg)		            
		            {
		            	//Create the search bar image
		            	ipLeftImg = this.properties.iplbg;
		            }
		            this.inputLeftImg = $iTXT.core.Builder.make("IMG", {id: this.options.id + "IPLImage", src: ipLeftImg});

		            //Create the search box
		            this.input = $iTXT.core.Builder.make("INPUT", {id: this.options.id + "Input", type: "text", value: this.properties.searchtxt || "", style: "background-color: transparent; border: none;position:absolute;"});
		            this.input.itxtSetStyle(
		            		{
		            			backgroundColor: 'transparent',
		            			border: 'none',
		            			height: (this.properties.inputheight || 18) + 'px',
		            			lineHeight: (this.properties.inputheight || 18) + 'px'	            			
		            		}
		            		);
		            this.input.itxtSubscribe("keyup", $iTXT.core.Event.bind(this, this.keyUp));
		            
		            this.inputHldr = $iTXT.core.Builder.make("DIV", {id: this.options.id + "InputHldr",style: "background-image: url(" + this.properties.ipbg + ");position:absolute;"}, [this.inputLeftImg, this.input]);
		            
		            //Create the search box		            
		            this.inputBtnHldr = $iTXT.core.Builder.make("DIV", {id: this.options.id + "InputHldr"}, [this.properties.btntxt]);
		            this.inputBtnHldr.itxtSetStyle(
		            		{
		            			backgroundColor: this.properties.btncol,
		            			backgroundImage: 'url(' + this.properties.btnbg + ')',
		            			backgroundPosition: 'right',
		            			right: '0px',
		            			top:"0px",
		            			position: 'absolute',
		            			height: this.options.height + "px",
		            			lineHeight: this.options.height + "px",
		            			paddingRight: (this.properties.btnrightpadding || 15) + 'px',
		            			paddingLeft: (this.properties.btnleftpadding || 5) + 'px',
		            			color: this.properties.btntextcol || 'white',
		            			fontFamily: 'Arial,Helvetica,Sans-Serif',
		            			fontWeight: 'bold',
		            			fontSize: '14px',
		            			cursor: 'pointer'
		            		}
		            );
		            this.inputBtnHldr.itxtSubscribe("click", $iTXT.core.Event.bind(this, this.bClk));		            
		            
		            this.mainContainer = $iTXT.core.Builder.make("DIV", {id: this.options.id + "Container", style: "background-image: url(" + this.properties.bgimg + ");"}, [this.rcImage,this.inputHldr,this.inputBtnHldr]);
		            
		            this.rootElement.appendChild(this.mainContainer);
		        },
		        
		        /**
		         * Overriden resize function for resizing the image component
		         * @param (Integer} w The width available for this element to use
		         * @param {Integer} h The height available for this element to use
		         */
		        _resize: function(w, h, $super)
		        {  
		        	this.mainContainer.itxtSetStyle({width: w + "px", height: this.options.height});
		        	this.rootElement.itxtSetStyle({width: w + "px", height: this.options.height});
		        	
		        	//get the height/width of the search bar
		        	var intH = this.mainContainer.clientHeight;
		        	var intW = w;
		        	
		        	//get image width
		        	var imgW = this.rcImage.offsetWidth;
		        	var btnW = this.inputBtnHldr.offsetWidth;
		        	
		        	//calculate the leftover width
		        	var availW = intW-imgW-btnW;
		        	this.inputHldr.itxtSetStyle({left: imgW + "px", top: "0px", width: availW + "px", height: intH + "px"});
		        	
		        	var ipLM = this.properties.ipLeftMargin || 0;
		        	var inputW = availW-this.inputLeftImg.offsetWidth-ipLM;
		        	var inputH = this.properties.inputheight || 18;
		        	var topPos = (intH-inputH)/2;
		        	this.input.itxtSetStyle({marginLeft: ipLM + "px", width: inputW + "px", marginTop: topPos + "px"});
		        	
		        	return [w,this.rootElement.offsetHeight];
		        },
		        
		        /**
		         * Override neededSize method to return the size that is needed by this element if its content based
		         * @param {Integer} w The available width should the component need it
		         * @param {Integet} h The available height should the component need it
		         */
		        _neededSize: function(w, h, $super)
		        {
		        	this.rootElement.itxtSetStyle({width: w + "px", height: this.options.height});
		        	return [w,this.rootElement.offsetHeight];
		        },
		        
		        /**
		         * Button click event handler
		         */
		        bClk: function(e)
		        {
		        	if (this.properties.searchCallback)
		        	{
		        		this.properties.searchCallback(this.input.value, 23);
		        	}
		        },
		        
		        /**
		         * Key Up event handler
		         */
		        keyUp: function(e)
		        {
		        	if (e.keyCode==13 && this.properties.searchCallback)
		        	{
		        		this.properties.searchCallback(this.input.value, 25);
		        	}
		        }
		        
		    });//end SearchBar class
	
	
}

