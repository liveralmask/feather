//alert( "popup" );

var bg = chrome.extension.getBackgroundPage();
opjs.dom.document( document );

var type_eval = opjs.dom.element.get( "type-eval" );
type_eval.checked = true;

var result = opjs.dom.element.get( "result" );

var popup = popup || {};

(function( action ){
  action.eval = function(){
    bg.eval( opjs.dom.element.get( "code" ).value, function( response ){
      if ( "msg" in response ){
        opjs.dom.element.add( result, opjs.dom.element.create( "font", { "style" : "color:red" }, { "text" : response.msg } ) );
      }
    } );
  };
  
  action.xpath = function(){
    bg.xpath( opjs.dom.element.get( "code" ).value, function( response ){
      opjs.dom.element.text( result, response );
    } );
  };
})(popup.action = popup.action || {});

opjs.dom.element.get( "execute" ).onclick = function(){
  opjs.dom.element.removes( result );
  
  var types = opjs.dom.element.gets( "type" );
  var types_len = types.length;
  for ( var i = 0; i < types_len; ++i ){
    var type = types[ i ];
    
    if ( type.checked ){
      popup.action[ type.value ]();
      break;
    }
  }
};
