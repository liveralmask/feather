//alert( "icecrepe" );

var global = this;
var icecrepe = icecrepe || {};

(function( application ){
  application.eval = function( code ){
    try{
      eval( code );
    }catch ( err ){
      return err.toString();
    }
    return undefined;
  };
  
  application.xpath = function( code ){
    
  };
})(icecrepe.application = icecrepe.application || {});

chrome.extension.onMessage.addListener( function( request, sender, responseMethod ){
  var response = {};
  if ( "method" in request ){
    var instance = global;
    var method_names = request.method.split( "." );
    var method_names_len = method_names.length;
    for ( var i = 0; i < method_names_len; ++i ){
      var method_name = method_names[ i ];
      
      instance = instance[ method_name ];
    }
    if ( ! ( "args" in request ) ) request.args = [];
    response = instance.apply( instance, request.args );
  }
  if ( typeof responseMethod !== "undefined" ) responseMethod( response );
});
