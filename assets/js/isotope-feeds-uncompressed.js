/**
 * Class RefreshCache
 *
 * Refresh the XMl files on an AJAX loop
 */
var RefreshCache =
{
	/**
	 * Start the AJAX process
	 * @param string
	 * @param int
	 * @param string
	 * @param string
	 */
	startRefresh: function(el, offset, startTxt, endTxt){
		if(offset==0){
			document.id('refresh-cache').set('html','<div id="tl_header">'+startTxt+'</div><div id="message"></div>');
			this.spinner = new Spinner(document.id('tl_header'),{containerPosition: {position:'centerBottom', offset:{x:-12, y:-30}}});
			this.spinner.show();
		}
		var request = new Request.Contao({
			url: window.location.href,
			data: 'isAjax=1&action=startCache&offset=' + offset + '&REQUEST_TOKEN=' + REQUEST_TOKEN,
			onSuccess: function(content, json){
				if(json.data){
					if (json.data.offset != 'finished'){
						RefreshCache.startRefresh(el,json.data.offset);
						document.id('message').set('html',json.data.message);
					}
					else{
						document.id('refresh-cache').set('html','<div id="tl_header">'+json.data.message+'</div>');
						this.spinner.destroy();
					}
				}
				else{
					RefreshCache.getError(json);
				}
			}.bind(this),
			onError: function(txt, error){
    			RefreshCache.getError(error);
			}
		}).send();
	},
    
    /**
	 * Display an alert with the error
	 *
	 * @param {string} The error message
	 */
	getError: function(error){
		if(error){
			document.id('refresh-cache').set('html','<div class="tl_error">'+ error +'</div>');
		} else{
			alert("If you are seeing this message, something went really wrong during the cache, like a database connection failure, or a page refresh or something. It shouldn't happen, but if it does, you will want to start over.");
			document.id('refresh-cache').set('html','<div class="tl_error">An Error Occurred</div>');
		}
	},
	
    /**
	 * Open a selector page in a modal window
	 *
	 * @param {object} options An optional options object
	 */
	openModalSelector: function(options) {
		var opt = options || {},
			max = (window.getSize().y-180).toInt();
		if (!opt.height || opt.height > max) opt.height = max;
		var M = new SimpleModal({
			'width': opt.width,
			'btn_ok': Contao.lang.close,
			'draggable': false,
			'overlayOpacity': .5,
			'onShow': function() { document.body.setStyle('overflow', 'hidden'); },
			'onHide': function() { document.body.setStyle('overflow', 'auto'); }
		});
		M.addButton(Contao.lang.close, 'btn', function() {
			this.hide();
		});
		M.show({
			'title': opt.title,
			'contents': '<iframe src="' + opt.url + '" name="simple-modal-iframe" width="100%" height="' + opt.height + '" frameborder="0"></iframe>',
			'model': 'modal'
		});
	}
};
