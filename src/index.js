(function (window, undefined) {
    var initialized = false;
    var PrivatePluginName = {
        _defaults: { stringify: false },
        _options: {},
        _events: {},
        _listeners: {},
        _sources: {},

        initialize: function(options){
            if(!initialized){
                // We need some things before the plugin can be truly initialized
                if(!options.sources){
                    this.log('Must have at least one source available', true);
                }

                for(var source in options.sources){
                    if(options.sources.hasOwnProperty(source)){
                        this._addSource(source, options.sources[source]);
                    }
                }

                this._options = extend({}, this._defaults, options);
                initialized = true;
            } else {
                // @todo: maybe extend, might just ignore if an object is passed after initialization
            }
        },
        _addEvent: function (key, value) {
            this._events[key] = value;
        },
        _addListener: function (key, value) {
            this._events[key] = value;
        },
        _addSource: function (key, value) {
            this._sources[key] = value;
        },
        _setOptions: function (options) {

        },
        _setOption: function (name, value) {
            this._options[name] = value;
        }
    };

    PrivatePluginName.log = function (message, error) {
        message = message instanceof Array ? message : [message];
        window.console && this._options.debug && (error ? console.error : console.log).apply(console, message);
    };

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
    };

    window.PluginName = function (options) {
        if (arguments.length > 1) {

        } else if (arguments.length == 1) {
            PrivatePluginName.initialize(options);
        } else {

        }
    };
})(window);
