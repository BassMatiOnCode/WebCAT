// Documentation: .../web-toolbox/perstistent-state/state-persistence-1.htm

/**
*		init ( )
*		Creates a page toolbar before the mainContent element
*
*/ export function init ( container = document.body ) {	
	// Examine the modle url to register an event handler to load the page state
	const url = new URL(import.meta.url);
	const initEventName = url.searchParams.get( "readStateEventName" );
	switch( initEventName ) {
	case "load" :
	default:
		window.addEventListener( "load" , readPageState ); break;
	case "none" :
		break ;	  // readPageState( ) must be called explicitly by the client.
	case "DOMContentLoaded" :
		document.addEventListener( "DOMContentLoaded" , readPageState ); break;
	case "fragment-loading-complete" :
		document.addEventListener( "fragment-loading-complete" , readPageState ); break;
	case "readystatechange" :
		document.addEventListener( "readystatechange" , ( ) => { 
			if ( document.readystate === url.searchParams.get( "readystate" )) readPageState( ); 
			} ); 
		break;
		}
	window.addEventListener( "beforeunload" , writePageState );
	}
/**
 *		readPageState( )
 *		Retrieves the page state from local storage and initializes element properties.
 *
 */ export function readPageState ( ) {
	for ( const element of document.querySelectorAll( "[data-persist-map]" )) readElementState( element );
	}
/**
 *		readElementState( )
 *		Retrieves the element state from local storage and initializes its properties.
 *
 */ export function readElementState( element ) {
	if ( ! element.id ) return console.error( "Persisted elements need a unique ID." ) ;
	const propertyMap = element.getAttribute( "data-persist-map" ).replace( "\\s*,\\s*" , "," ).split( "," );
	for ( const propertyName of propertyMap ) {
		debugger;
		const value = window.localStorage.getItem( `${document.location.pathname}/${element.id.trim( )}/${propertyName}` );
		if ( value !== null ) element[ propertyName ] = value ;
	}	}
/**
 *		writePageState ( ) 
 *		Writes the page state to local storage
 *
 */ export function writePageState ( ) {
	for ( const element of document.querySelectorAll( "[data-persist-map]" )) writeElementState( element );
	}
/**
 *		writeElementState( )
 *		Writes the element state from local storage and initializes its properties.
 *
 */ export function writeElementState( element ) {
	const propertyMap = element.getAttribute( "data-persist-map" ).replace( "\\s*,\\s*" , "," ).split( "," );
	for ( const propertyName of propertyMap ) {
		window.localStorage.setItem( `${document.location.pathname}/${element.id.trim( )}/${propertyName}`, element[propertyName] );
	}	}

//
// Module init code 
const searchparams = new URL( import.meta.url ).searchParams ;
if ( ! searchparams.has( "no-default-init" )) init ( searchparams.get( "container" ) || undefined ) ;
