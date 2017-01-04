(function(o){
	var log = Oskari.log('Oskari.deprecated');

	// Warn 2 times before falling silent
	var warnMessagesSent = {};
	var warn = function(name) {
		if(!warnMessagesSent[name]) {
			warnMessagesSent[name] = 0;
		}
		warnMessagesSent[name]++;
		if(warnMessagesSent[name] < 3) {
			log.warn('Oskari.' + name + '() will be removed in future release. Remove calls to it.')
		}
	};

	var mode = 'default';
    var domMgr;
    var dollarStore = o.createStore();
    var _ctrlKeyDown = false;
	var funcs = {

	    /**
	     * @public @static @method Oskari.setLoaderMode
	     * @param {string} m Loader mode
	     */
	    setLoaderMode :  function (m) {
	    	mode = m;
	    },

	    /**
	     * @public @method Oskari.getLoaderMode
	     * @return {string} Loader mode
	     */
	    getLoaderMode : function () {
	        return mode;
	    },

	    /**
	     * @public @method Oskari.setPreloaded
	     * @deprecated No longer has any effect. Remove calls to it. Will be removed in 1.38 or later.
	     */
	    setPreloaded : function () {},

	    purge : function () {},

	    getDomManager : function () {
	        return domMgr;
	    },
	    setDomManager :  function (dm) {
			domMgr = dm;
	    },

	    /**
	     * @public @method Oskari.$
	     * @return {}
	     */
	    $ : function (name, value) {
	        return dollarStore.data(name, value);
	    },
	    setSandbox : function (name, sandbox) {},

        /**
         * @method handleCtrlKeyDownRequest
         * Sets flag to show that CTRL key is pressed down
         * @private
         */
        ctrlKeyDown: function (isDown) {
        	if(typeof isDown === 'undefined') {
        		// getter
        		return _ctrlKeyDown;
        	}
        	// setter
            _ctrlKeyDown = !!isDown;
        }
	};
	var attachWarning = function(name) {
		return function() {
			warn(name);
			return funcs[name].apply(o, arguments);
		};
	}
	// attach to Oskari with a warning message wrapping
	for(var key in funcs) {
		o[key] = attachWarning(key);
	}
}(Oskari));