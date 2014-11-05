(function (window, undefined) {
    var initialized = false;
    var PrivateEnhancedPostMessage = {
        _defaults: { stringify: false },
        _options: {},
        _events: {},
        _listeners: {},
        _sources: {},

        initialize: function(options){
            var that = this;
            if(!initialized){
                // Load in all sources
                if(options.sources && keys(options.sources).length){
                    for(var source in options.sources){
                        if(options.sources.hasOwnProperty(source)){
                            this._addSource(source, options.sources[source]);
                        }
                    }
                }

                // Check for events and load them in
                if(options.events && keys(options.events).length){
                    for(var e in options.events){
                        if(options.events.hasOwnProperty(e)){
                            this._addEvent(e, options.events[e]);
                        }
                    }
                }

                // Check for any listeners and add them
                if(options.listeners && keys(options.listeners).length){
                    for(var l in options.listeners){
                        if(options.listeners.hasOwnProperty(l)){
                            this._addListener(l, options.listeners[l]);
                        }
                    }
                }

                this._options = extend({}, this._defaults, options);


                // Setup sole listener that will listen for all events.
                window.addEventListener('message', function(e){
                    that._handleEventListener(e);
                });

                initialized = true;
            } else {
                // @todo: maybe extend, might just ignore if an object is passed after initialization
            }
        },
        triggerEvent: function(eventName, sourceName, data){
            var sourceWindow, e, objToSend = {};
            if(sourceName === 'parent'){
                sourceWindow = window.parent;
            } else {
                // Initially assume stored source is a window object (which is the return value of window.open)
                sourceWindow = this._sources[sourceName];
                // If we see contentWindow we've been passed an iframe dom element, swap out for actual window
                if ('contentWindow' in sourceWindow)
                    sourceWindow = sourceWindow.contentWindow;
            }

            e = this._events[eventName];
            if(!sourceWindow){
                this.log('No source by that name');
                return false;
            }

            if(!e){
                this.log('No events by that name');
                return false;
            }

            if(e !== true){
                if(typeof e === 'function'){
                    data = e(data);
                } else if(typeof e === 'object'){
                    data = e;
                } else {
                    this.log('Event value was not a valid type');
                    return false;
                }
            }

            objToSend = {
                eventName: eventName,
                data: data
            };

            sourceWindow.postMessage(this._options.stringify ? JSON.stringify(objToSend) : objToSend, '*');
        },
        _addEvent: function (key, value) {
            this._events[key] = value;
        },
        _addListener: function (key, value) {
            this._listeners[key] = value;
        },
        _addSource: function (key, value) {
            this._sources[key] = value;
        },
        _setOptions: function (options) {

        },
        _setOption: function (name, value) {
            this._options[name] = value;
        },
        _handleEventListener: function(e){

            // If the data was stringified we need to parse it, this option should match on both sides.
            var data = e.data;
            if(this._options.stringify && typeof e.data === 'string'){
                data = JSON.parse(e.data);
            }

            // If there is a listener for this event name, call it and pass the data
            if(this._listeners[data.eventName]){
                this._listeners[data.eventName](data.data);
            }
        }
    };

    PrivateEnhancedPostMessage.log = function (message, error) {
        message = message instanceof Array ? message : [message];
        if(window.console && this._options.debug){
            (error ? console.error : console.log).apply(console, message);
        }
    };

    // Some sites have problems with Object.keys, this is to get around that, backward support
    var extend = function (obj) {
        var source, prop;
        for (var i = 1, length = arguments.length; i < length; i++) {
            source = arguments[i];
            for (prop in source) {
                if (Object.prototype.hasOwnProperty.call(source, prop)) {
                    obj[prop] = source[prop];
                }
            }
        }
        return obj;
    };

    var keys = function(obj){
        if(Object.keys) return Object.keys(obj);
        var keys = [];
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                keys.push(key);
            }
        }
        return keys;
    };

    var PublicInstance = function (options) {
        if (arguments.length > 1) {
            // Handle event triggers
            if(arguments[0] === 'trigger' && arguments.length >= 3){
                PrivateEnhancedPostMessage.triggerEvent(arguments[1], arguments[2], arguments[3]);
            }
            
            if(arguments[0] === 'addSource' && arguments.length >= 3){
                PrivateEnhancedPostMessage._addSource(arguments[1], arguments[2]);
            }

            if(arguments[0] === 'addEvent' && arguments.length >= 3){
                PrivateEnhancedPostMessage._addEvent(arguments[1], arguments[2]);
            }

            if(arguments[0] === 'addListener' && arguments.length >= 3){
                PrivateEnhancedPostMessage._addListener(arguments[1], arguments[2]);
            }
        } else if (arguments.length == 1) {
            PrivateEnhancedPostMessage.initialize(options);
        } else {

        }
        return PublicInstance;
    };

    PublicInstance.trigger = function(){
        if(arguments.length >= 2){
            PrivateEnhancedPostMessage.triggerEvent(arguments[0], arguments[1], arguments[2]);
        } else {
            PrivateEnhancedPostMessage.log('Invalid trigger, need both an event name and a source name', true);
        }
        return PublicInstance;
    };

    /**
     * Programatically adds a source to the current instance of EnhancedPostMessage.
     * @param {String} key - name of source
     * @param {HTMLElement} value - a single dom element to use as a source
     */
    PublicInstance.addSource = function(key, value){
        // Initialize if hasn't been already
        PrivateEnhancedPostMessage.initialize();

        PrivateEnhancedPostMessage._addSource(key, value);
    };

    /**
     * Programatically add an event to the current instance of EnhancedPostMessage
     * @param {String} key - name of the event
     * @param {Object|String|True|Function|Number} value - pretty much anything but false
     */
    PublicInstance.addEvent = function(key, value){
        // Initialize if hasn't been already
        PrivateEnhancedPostMessage.initialize();

        PrivateEnhancedPostMessage._addEvent(key, value);
    };

    /**
     * 
     * @param key
     * @param value
     */
    PublicInstance.addListener = function(key, value){
        // Initialize if hasn't been already
        PrivateEnhancedPostMessage.initialize();

        PrivateEnhancedPostMessage._addListener(key, value);
    };



    window.EnhancedPostMessage = PublicInstance;
})(window);
