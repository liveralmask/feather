//alert( "icecrepe" );

var global = this;
var icecrepe = icecrepe || {};

(function( application ){
  application.eval = function( code ){
    return opjs.application.eval( code );
  };
  
  application.xpath = function( code ){
    
  };
})(icecrepe.application = icecrepe.application || {});

chrome.extension.onMessage.addListener( function( request, sender, responseMethod ){
  var response = undefined;
  if ( "method" in request ){
    if ( ! ( "args" in request ) ) request.args = [];
    response = opjs.method.call( global, request.method, request.args );
  }
  if ( undefined === response ) return;
  
  responseMethod( response );
});
