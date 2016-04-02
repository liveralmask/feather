//alert( "background" );

var bg = this;

bg.send_request = function( request, callback ){
  chrome.tabs.query( { active : true, lastFocusedWindow : true }, function( tabs ){
    var tab = tabs[ 0 ];
    
    chrome.tabs.sendMessage( tab.id, request, function( response ){
      if ( typeof response === "undefined" ) return;
      if ( typeof callback === "undefined" ) return;
      
      callback( response );
    } );
  });
};

bg.eval = function( code, callback ){
  bg.send_request(
    {
      "method" : "icecrepe.application.eval",
      "args" : [ code ]
    },
    callback
  );
};

bg.xpath = function( code, callback ){
  bg.send_request(
    {
      "method" : "icecrepe.application.xpath",
      "args" : [ code ]
    },
    callback
  );
};
