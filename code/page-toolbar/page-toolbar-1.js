//	Documentation: /webcat/page-toolbar/page-toolbar.htm
//	TODO: The toolbar must have a defined height and determine the height of buttons.

/**
*		init ( )
*		Creates a page toolbar before the mainContent element
*
*/ export function init ( referenceElement = document.getElementById("mainContent" )) {	
	// Create and insert the toolbar
	const e = document.createElement( "DIV" );
	e.className = "toolbar page-toolbar" ;
	e.id = "mainToolbar" ;
	// e.textContent = "Toolbar" ;
	document.body.insertBefore( e, referenceElement );
	// Move margin bottom from previous sibling to path bar
	const main = document.querySelector( "MAIN" );
	if ( main ) main.style.marginTop = parseInt( main.style.marginTop || getComputedStyle( main ).marginTop ) - parseInt( e.scrollHeight ) + "px";
	return; 
	}
/**	
 *		processNavigationData ( )
 *		Handles the NavigationDataPublication event
 * 
 */ function processNavigationData ( evt ) {
	if ( evt.detail.up ) {
		const e = evt.detail.toolbar.insertBefore( document.createElement( "A" ));
		e.setAttribte( "href" , evt.detail.up );
		e.textContent = "Up" ;
		evt.detail.toolbar.insertBefore( e, evt.detail.before );
		}
	if ( evt.detail.first ) {
		const e = evt.detail.toolbar.insertBefore( document.createElement( "A" ));
		e.setAttribte( "href" , evt.detail.first );
		e.textContent = "First" ;
		evt.detail.toolbar.insertBefore( e, evt.detail.before );
		}
	if ( evt.detail.previous ) {
		const e = evt.detail.toolbar.insertBefore( document.createElement( "A" ));
		e.setAttribte( "href" , evt.detail.previous );
		e.textContent = "Previous" ;
		evt.detail.toolbar.insertBefore( e, evt.detail.before );
		}
	if ( evt.detail.down ) {
		const e = evt.detail.toolbar.insertBefore( document.createElement( "A" ));
		e.setAttribte( "href" , evt.detail.down );
		e.textContent = "Down" ;
		evt.detail.toolbar.insertBefore( e, evt.detail.before );
		}
	if ( evt.detail.next ) {
		const e = evt.detail.toolbar.insertBefore( document.createElement( "A" ));
		e.setAttribte( "href" , evt.detail.next );
		e.textContent = "Next" ;
		evt.detail.toolbar.insertBefore( e, evt.detail.before );
		}
	if ( evt.detail.last ) {
		const e = evt.detail.toolbar.insertBefore( document.createElement( "A" ));
		e.setAttribte( "href" , evt.detail.last );
		e.textContent = "Last" ;
		evt.detail.toolbar.insertBefore( e, evt.detail.before );
		}
	if ( document.querySelector( "[cbc]" )) {
		const e = evt.detail.toolbar.insertBefore( document.createElement( "BUTTON" ));
		e.textContent = "Collapse Elements" ;
		evt.detail.toolbar.insertBefore( e, evt.detail.before );
		}
	}

//
// Module init code
const searchparams = new URL( import.meta.url ).searchParams ;
// Extract parameters from module URL
const root = searchparams.get( "root" ) || undefined ;
const buttons = searchparams.get( "buttons" ) || undefined ;
const initEventName = searchparams.get( "init-event-name" );
// Schedule init() function call
if ( ! initEventName ) init ( root ) ;
else if ( initEventName != "no-default-init" ) {
	// Set up event handler to call init() later
	const eventTarget = document.getElementById( searchparams.get( "event-target-id" )) || document ;
	eventTarget.addEventListener( initEventName, { 
		root : root ,
		buttons : buttons ,
		handleEvent : ( ) => init( root ) 
	} ) }