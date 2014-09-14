(function (window, undefined) {
    var initialized = false;
    var PrivatePluginName = {
        _defaults: { stringify: false },
        _options: {},
        _events: {},
        _listeners: {},
        _sources: {},

        initialize: function(options){
            var that = this;
            if(!initialized){
                // We need some things before the plugin can be truly initialized
                if(!options.sources){
                    this.log('Must have at least one source available', true);
                }

                // Load in all sources
                for(var source in options.sources){
                    if(options.sources.hasOwnProperty(source)){
                        this._addSource(source, options.sources[source]);
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
        triggerEvent: function(sourceName, eventName, data){
            var source = this._sources[sourceName];
            var e = this._events[eventName];
            if(!source){
                this.log('No source by that name');
                return false;
            }

            if(!e){
                this.log('No events by that name');
                return false;
            }

            if(e !== true){
                if(typeof e === 'function'){
                    data = e();
                } else if(typeof e === 'object'){
                    data = e;
                } else {
                    this.log('Event value was not a valid type');
                    return false;
                }
            }

            var objToSend = {
                eventName: eventName,
                data: data
            };

            source.contentWindow.postMessage(this._options.stringify ? JSON.stringify(objToSend) : objToSend, '*');
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
            this.log(e);
        }
    };

    PrivatePluginName.log = function (message, error) {
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
        for(key in obj){
            if(obj.hasOwnProperty(key)){
                keys.push(key)
            }
        }
        return keys;
    }

    window.PluginName = function (options) {
        if (arguments.length > 1) {
            // Handle event triggers
            if(arguments[0] === 'trigger' && arguments.length >= 3){
                PrivatePluginName.triggerEvent(arguments[1], arguments[2], arguments[3]);
            }
        } else if (arguments.length == 1) {
            PrivatePluginName.initialize(options);
        } else {

        }
    };
})(window);
