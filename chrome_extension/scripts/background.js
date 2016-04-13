//alert( "background" );

var bg = this;

bg.content = function( request, callback ){
  chrome.tabs.query( { "active" : true, "lastFocusedWindow" : true }, function( tabs ){
    var tab = tabs[ 0 ];
    
    chrome.tabs.sendMessage( tab.id, request, function( response ){
      callback( response );
    } );
  });
};

bg.call = function( method, args, callback ){
  bg.content(
    {
      "method" : method,
      "args"   : args
    }, callback );
};
