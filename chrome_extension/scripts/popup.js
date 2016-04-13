//alert( "popup" );

var bg = chrome.extension.getBackgroundPage();
opjs.document.set( document );
var table_attributes = {
  "table" : {
    "style" : "border: thin solid gray; border-collapse: collapse; margin: 5px"
  },
  "head" : {
    "style" : "border: thin solid gray"
  },
  "foot" : {
    "style" : "border: thin solid gray"
  },
  "body" : {
    "style" : "border: thin solid gray"
  }
};
var number_attributes = {
  "style" : "text-align: center"
};

var popup = popup || {};

(function( action ){
  action.expression = function(){
    return opjs.document.element.get( "icecrepe.expression" ).value;
  };
  
  action.clear = function(){
    bg.call( "icecrepe.application.clear", [ "icecrepe.result" ], function( response ){} );
  };
  
  action.xpath = function( expression ){
    bg.call( "icecrepe.application.xpath", [ expression ], function( response ){
      var result = opjs.document.element.create( "div" );
      var text = opjs.document.element.create( "text", {}, { "text" : "TEXT" } );
      opjs.document.element.add( result, text );
      bg.call( "icecrepe.application.insert_result", [ "icecrepe.result", result.innerHTML ], function( response ){} );
    } );
  };
  
  action.regex = function( expression ){
    bg.call( "icecrepe.application.regex", [ expression ], function( response ){
      var div = opjs.document.element.create( "div" );
      opjs.document.element.add( div, action.expression_table( expression ) );
      opjs.document.element.add( div, action.regex_matches_table( expression, response ) );
      bg.call( "icecrepe.application.insert_result", [ "icecrepe.result", div.innerHTML ], function( response ){} );
    } );
  };
  
  action.expression_table = function( expression ){
    var body = [[ { "text" : "Expression" }, { "text" : expression } ]];
    return opjs.document.element.array_to_table( body, undefined, undefined, table_attributes );
  };
  
  action.regex_matches_table = function( expression, response ){
    var tables = [];
    opjs.array.each( response, function( matches, i ){
      var div = opjs.document.element.create( "div" );
      var body = [];
      opjs.array.each( opjs.json.decode( matches ), function( match, i ){
        body.push( [ { "text" : i, "attributes" : number_attributes }, { "text" : match } ] );
      });
      opjs.document.element.add( div, opjs.document.element.array_to_table( body, undefined, undefined, table_attributes ) );
      tables.push( [ { "text" : tables.length + 1, "attributes" : number_attributes }, { "html" : div.innerHTML } ] );
    });
    if ( 0 === tables.length ){
      tables.push( [ { "text" : 1 }, { "text" : opjs.string.format( "Unmatched: {0}", expression ) } ] );
    }
    return opjs.document.element.array_to_table( tables, [ "No.", "Matches" ], undefined, table_attributes );
  };
})(popup.action = popup.action || {});

opjs.document.event.add( document, "DOMContentLoaded", function(){
  opjs.document.element.attr( opjs.document.element.get( "icecrepe.expression" ), "style", "width: 500px" );
  
  opjs.document.event.add( opjs.document.element.get( "icecrepe.xpath" ), "click", function(){
    popup.action.clear();
    
    var expression = popup.action.expression();
    if ( "" !== expression ) popup.action.xpath( expression );
  });
  
  opjs.document.event.add( opjs.document.element.get( "icecrepe.regex" ), "click", function(){
    popup.action.clear();
    
    var expression = popup.action.expression();
    if ( "" !== expression ) popup.action.regex( expression );
  });
  
  opjs.document.event.add( opjs.document.element.get( "icecrepe.clear" ), "click", function(){
    popup.action.clear();
  });
});
