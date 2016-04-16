//alert( "background" );

var g_bg = this;

g_bg.content = function( request, callback ){
  chrome.tabs.query( { "active" : true, "lastFocusedWindow" : true }, function( tabs ){
    var tab = tabs[ 0 ];
    
    chrome.tabs.sendMessage( tab.id, request, function( response ){
      callback( response );
    } );
  });
};

g_bg.call = function( method, args, callback ){
  g_bg.content(
    {
      "method" : method,
      "args"   : args
    }, callback );
};
