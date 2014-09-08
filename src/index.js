(function(window, undefined){
  var PluginName = {
    _defaults: {},
    _options: {},
    _events: {},
    _listeners: {},
    _sources: {},

    _addEvent: function(key, value){
      this._events[key] = value;
    },
    _addListener: function(key, value){
      this._events[key] = value;
    },
    _addSource: function(key, value){
      this._sources[key] = value;
    },
    _setOptions: function(options){

    },
    _setOption: function(name, value){
      this._options[name] = value;
    }
  };

  var log = function (message, error) {
      message = message instanceof Array ? message : [message];
      window.console && this.ajaxOptions.debug && (error ? console.error : console.log).apply(console, message);
  };

  var extend = function(obj){
    var source, prop;
    for(var i = 1, length = arguments.length; i < length; i++){
      source = arguments[i];
      for(prop in source){
        if(Object.prototype.hasOwnProperty.call(source, prop)){
          obj[prop] = source[prop];
        }
      }
    }
  };

  var PublicPluginName = function(options){
    if(arguments.length > 1){
      // Attempting to set an option
    } else if(arguments.length == 1){

    } else {

    }
  };

  window.PluginName = PublicPluginName;
})(window);
