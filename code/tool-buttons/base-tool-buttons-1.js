// documentation : /page-toolbar/tool-buttons.htm

/**
*		init ( )
*		Initializes list elements with checked items.
*
*/ export function init ( ) {
	}

/**
*		addVectorButton ( )
*		Adds an SVG vector button to the toolbar
*
*/ export function addVectorButton ( url, toolbar = mainToolbar, reference = null ) {
	const anchor = document.createElement( "A" );
	anchor.setAttribute( "href" , url );
	anchor.toggleAttribute( "c" );
	toolbar.insertBefore( anchor, reference );
	}


//
// Module init code
const searchparams = new URL( import.meta.url ).searchParams ;
// Extract parameters from module URL
const root = searchparams.get( "root" ) || undefined ;
const initEventName = searchparams.get( "init-event-name" );
// Schedule init() function call
if ( ! initEventName ) init ( root ) ;
else if ( initEventName != "no-default-init" ) {
	// Set up event handler to call init() later
	const eventTarget = document.getElementById( searchparams.get( "event-target-id" )) || document ;
	eventTarget.addEventListener( initEventName, { 
		root : root ,   // saved parameter 
		handleEvent : ( ) => init( root ) 
	} ) }