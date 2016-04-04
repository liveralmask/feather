//alert( "icecrepe" );

var global = this;
var icecrepe = icecrepe || {};
opjs.dom.document( document );

(function( application ){
  application.eval = function( code ){
    return opjs.application.eval( code );
  };
  
  application.xpath = function( code ){
    return opjs.dom.xpath.html( code );
  };
})(icecrepe.application = icecrepe.application || {});

chrome.extension.onMessage.addListener( function( request, sender, responseMethod ){
  var response = null;
  if ( "method" in request ){
    if ( ! ( "args" in request ) ) request.args = [];
    response = opjs.method.call( global, request.method, request.args );
  }
  if ( null === response ) return;
  
  responseMethod( response );
});
