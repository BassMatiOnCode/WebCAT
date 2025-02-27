// Documentation: .../web-toolbox/name/name.htm

import * as initializer from "../component-initializer/component-initializer.js" ;
import { setUniqueID } from "../utility/unique-id/unique-id.js" ;

/**
 *		documentClickHandler( )
 *
 */ function xdocumentClickHandler ( evt ) {
	evt?.preventDefault( );
	evt?.stopPropagation( );
	for ( const dialog of document.querySelectorAll( ".context-dialog" )) {
		dialog.style.visibility = "hidden" ;
		dialog.removeAttribute( "data-opener-id" );
		}
	document.removeEventListener( documentClickHandler , documentClickHandler );
	}
/**
 *		documentClickHandler( )
 *
 */ function documentClickHandler( evt ) {
	evt.stopPropagation( );
	// Check dialog closing condition
	if ( ! evt.currentTarget.classList.contains( "autoclose" ) && ! evt.target.classList.contains( "autoclose" )) return ;
	// Dispatch dialog closing event to dialog opener
	// THIS DOESN'T WORK...
	const opener = document.getElementById( evt.currentTarget.getAttribute( "data-opener-id" ));
	if ( opener.dispatchEvent( new CustomEvent( "context-dialog-closing", { cancelable : true , bubbles : false, detail : { dialog : evt.currentTarget , closer : evt.target } } ))) {
		// The dialog may be closed now.
		evt.currentTarget.style.visibility = "hidden" ;
		evt.currentTarget.removeAttribute( "data-opener-id" );
		document.removeEventListener( "click" , documentClickHandler );
	}	}
/**
 *		openerContextmenuHandler( )
 *
 */ function openerContextmenuHandler( evt ) {
	// notify opener, opener can abort.
	if ( ! evt.currentTarget.dispatchEvent( new CustomEvent( "context-dialog-opening", { cancelable : true , bubbles : false, detail : { dialog : dialog , target : evt.target } } ))) return ;
	evt.preventDefault( );
	evt.stopPropagation( );
	// close any open context dialogs
	const dialog = document.getElementById( evt.currentTarget.getAttribute( "data-context-dialog-id" ));
	if ( ! dialog ) return console.error( "Context dialog element not found:", evt.currentTarget.getAttribute( "data-context-dialog-id" ) ) ;
	// store the opener id in the dialog
	dialog.setAttribute( "data-opener-id" , evt.currentTarget.id );
	// adjust position
	const position = evt.target.getBoundingClientRect();
	dialog.style.left = `${position.left}px` ;
	dialog.style.top = `${position.top}px` ;
	// Capture pointer events
	dialog.setPointerCapture( evt.pointerId );
	// show dialog
	dialog.style.visibility = "visible" ;
	// catch clicks outside of the document
	document.addEventListener( "click" , documentClickHandler );
	}
/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init( ) {
	// Process context dialog openers
	for ( const opener of document.querySelectorAll( "[data-context-dialog-id]" )){
		opener.setAttribute( "id" , setUniqueID( opener ));
		opener.addEventListener( "contextmenu" , openerContextmenuHandler );
		}
	// Process context dialogs
	for ( const dialog of document.querySelectorAll( ".context-dialog" )) dialog.addEventListener( "click", dialogClickHandler );
	}
/** Module init code */ initializer.initComponent( init, import.meta.url );
