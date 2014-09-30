##EnhancedPostMessage

An easy way to do 1 and 2 way communication across multiple frames/windows.  Supports adding events programatically, and triggering events at any time after being instantiated.


###options
-----------------
####stringify
> __Type:__ `Boolean`
> __Default:__ `false`
> Only set to true if you wish to support IE9 and/or IE8.  Every other browser can pass objects through postMessage.
####sources
> __Type:__ `Object`
> 
> List of sources where the value is a single dom element
>
> ```js
> {
>   sources: {
>     source1: document.getElementById('test'),
>     // If using jQuery you can accomplish the same way using the following
>     source2: $('#test')[0]
> }
> ```
>
> A special internal reserved word of parent is used for sending an event back to the parent frame.  No source can use this name.

####events
> __Type:__ `Object`
> 
> The events to listen for in a `name: value` type of way
>> _value_ - __Type:__ `Object|Function|True`
>>
>> The value of an event can be an object that is passed to the listener, a function that is called with the data sent from the trigger and a object is returned, or `true` which means we just trigger the listener on the source with no data passed.
> 
> ```js
> {
>   events: {
>     exTrue: true,
>     exFunc: function(data){
>       // do some manipulation to data
>       return newData;
>     },
>     exObj: {
>       test: 'data'
>     }
>   }
> }
> ```

####listeners
> __Type:__ `Object`
>
> The callbacks to be called on when an event is triggered.  
>
> ```js
> {
>   listeners: {
>     listener1: function(data){
>       // If any data is passed the first param will contain that data.
>       //    Otherwise the first param will be `undefined`
>
>       $('#html').html(data);
>       // Anything else...
>     }
>   }
> }
> ```

There are no required options, and any option can be added at a later time after the plugin has been instantiated through one of the following methods:

###methods
-------
####addEvent
```js
EnhancedPostMessage('addEvent', 'eventName', 'Object|Function|True');
```

####addListener
```js
var FunctionToBeCalled = function(data){};
EnhancedPostMessage('addListener', 'listenerName', FunctionToBeCalled);
```

####addSource
```js
EnhancedPostMessage('addSource', 'sourceName', document.getElementById('sourceId');
```
-----
###trigger
`trigger` has 3 params:

param 1:
> __Required__
>
> __Type:__ `String`
>
> The name of the event you wish to be triggered

param 2:
> __Required__
>
> __Type:__ `String`
>
> The name of the source you wish the event to be triggered on

param 3:
> __Optional__
>
> __Type:__ `String|Object`
> 
> Any data you wish to send to the event, if the event is a function.  If the event is an object, the event's object will override the data passed.  If the event is a bool `true` then the data will be passed as is to the listener.

**Example:**
```js
EnhancedPostMessage.trigger('exEvent1', 'source1', {data: {to: {be: 'passed'}}});
```
