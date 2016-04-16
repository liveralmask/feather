//alert( "popup" );

opjs.document.set( document );

var g_bg = chrome.extension.getBackgroundPage();
var g_element = opjs.document.element;
var g_event = opjs.document.event;
var g_attributes = {
  "text_center" : { "style" : "text-align: center" },
  "tables"      : {
    "table" : { "style" : "border: thin solid gray; border-collapse: collapse; margin: 5px" },
    "head"  : { "style" : "border: thin solid gray" },
    "foot"  : { "style" : "border: thin solid gray" },
    "body"  : { "style" : "border: thin solid gray" }
  }
};

var popup = popup || {};

(function( action ){
  action.expression = function(){
    return g_element.get( "icecrepe.expression" ).value;
  };
  
  action.clear = function(){
    g_bg.call( "icecrepe.application.clear", [ "icecrepe.result" ], function( response ){} );
  };
  
  action.insert_result = function( value ){
    if ( "text" in value ){
      var div = g_element.create( "div" );
      g_element.add( div, g_element.create( "text", {}, { "text" : value.text } ) );
      value.html = div.innerHTML;
    }
    g_bg.call( "icecrepe.application.insert_result", [ "icecrepe.result", value.html ], function( response ){} );
  };
  
  action.xpath = function( expression ){
    action.insert_result( { "text" : opjs.string.format( "xpath: {0}", expression ) } );
    
    try{
      g_bg.call( "icecrepe.application.xpath", [ expression ], function( response ){
        if ( "" === response[ 2 ] ){
          response[ 1 ] = opjs.json.decode( response[ 1 ] );
          var div = g_element.create( "div" );
          g_element.add( div, action.expression_table( expression, response[ 0 ], response[ 1 ].length ) );
          g_element.add( div, action.xpath_matches_table( expression, response[ 1 ] ) );
          action.insert_result( { "html" : div.innerHTML } );
        }else{
          action.insert_result( { "text" : response[ 2 ] } );
        }
      } );
    }catch ( err ){
      action.insert_result( { "text" : opjs.string.format( "{0}\n{1}", err.toString(), err.stack ) } );
    }
  };
  
  action.regex = function( expression ){
    action.insert_result( { "text" : opjs.string.format( "regex: {0}", expression ) } );
    
    try{
      g_bg.call( "icecrepe.application.regex", [ expression ], function( response ){
        if ( "" === response[ 2 ] ){
          response[ 1 ] = opjs.json.decode( response[ 1 ] );
          var div = g_element.create( "div" );
          g_element.add( div, action.expression_table( expression, response[ 0 ], response[ 1 ].length ) );
          g_element.add( div, action.regex_matches_table( expression, response[ 1 ] ) );
          action.insert_result( { "html" : div.innerHTML } );
        }else{
          action.insert_result( { "text" : response[ 2 ] } );
        }
      } );
    }catch ( err ){
      action.insert_result( { "text" : opjs.string.format( "{0}\n{1}", err.toString(), err.stack ) } );
    }
  };
  
  action.expression_table = function( expression, msec, num ){
    var body = [[
      { "text" : expression, "attributes" : g_attributes.text_center },
      { "text" : opjs.string.format( "{0}(sec)", msec / 1000 ), "attributes" : g_attributes.text_center },
      { "text" : num, "attributes" : g_attributes.text_center }
    ]];
    return g_element.array_to_table( body, [ "Expression", "Time", "Num" ], undefined, g_attributes.tables );
  };
  
  action.xpath_matches_table = function( expression, response ){
    var tables = [];
    opjs.array.each( response, function( result, i ){
      var div = g_element.create( "div" );
      g_element.add( div, g_element.create( result[ 0 ], result[ 1 ], { "text" : result[ 2 ] } ) );
      var code = div.innerHTML;
      tables.push( [ { "text" : tables.length + 1, "attributes" : g_attributes.text_center }, { "html" : code }, { "text" : code } ] );
    });
    if ( 0 === tables.length ){
      tables.push( [ { "text" : 1 }, { "text" : "" }, { "text" : opjs.string.format( "Mismatch: {0}", expression ) } ] );
    }
    return g_element.array_to_table( tables, [ "No.", "HTML", "Code" ], undefined, g_attributes.tables );
  };
  
  action.regex_matches_table = function( expression, response ){
    var tables = [];
    opjs.array.each( response, function( matches, i ){
      var div = g_element.create( "div" );
      var body = [];
      opjs.array.each( matches, function( match, i ){
        body.push( [ { "text" : i, "attributes" : g_attributes.text_center }, { "text" : match } ] );
      });
      g_element.add( div, g_element.array_to_table( body, undefined, undefined, g_attributes.tables ) );
      tables.push( [ { "text" : tables.length + 1, "attributes" : g_attributes.text_center }, { "html" : div.innerHTML } ] );
    });
    if ( 0 === tables.length ){
      tables.push( [ { "text" : 1 }, { "text" : opjs.string.format( "Mismatch: {0}", expression ) } ] );
    }
    return g_element.array_to_table( tables, [ "No.", "Matches" ], undefined, g_attributes.tables );
  };
})(popup.action = popup.action || {});

g_event.add( document, "DOMContentLoaded", function(){
  g_element.attr( g_element.get( "icecrepe.expression" ), "style", "width: 500px" );
  g_element.attr( g_element.get( "icecrepe.xpath" ), "style", "width: 50px" );
  g_element.attr( g_element.get( "icecrepe.regex" ), "style", "width: 50px" );
  g_element.attr( g_element.get( "icecrepe.clear" ), "style", "width: 50px" );
  
  g_event.add( g_element.get( "icecrepe.xpath" ), "click", function(){
    var expression = popup.action.expression();
    if ( "" !== expression ) popup.action.xpath( expression );
  });
  
  g_event.add( g_element.get( "icecrepe.regex" ), "click", function(){
    var expression = popup.action.expression();
    if ( "" !== expression ) popup.action.regex( expression );
  });
  
  g_event.add( g_element.get( "icecrepe.clear" ), "click", function(){
    popup.action.clear();
  });
});
