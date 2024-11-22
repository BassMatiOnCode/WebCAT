// Documentation: /webcat/navigation-panel/navigation-panel.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;

/**
 *		toggleNavigationPanel ( )
 *		Hides or shows the navigation panel.
 *
 */ function toggleNavigationPanel ( ) {
	document.getElementById( "navigationPanel" ).dispatchEvent ( new Event ( "toggle-visibility" , { bubbles : false } ));
	}
/**
 *		documentClickHandler( )
 *		is only active if the navigation panel is open. Every click event
 *		closes the navigation panel. Prevents default behaviour except
 *		for clicks on A elements.
 *
 */ function documentClickHandler( evt ) {
	console.info( "Document click event recognized." );
	if ( evt.target.tagName !== "A" && ! evt.target.closest( "#navigationPanel" )) {
		evt.preventDefault( );
		evt.stopPropagation( );
		}
	if ( ! evt.defaultPrevented ) document.getElementById( "navigationPanel" ).dispatchEvent( new Event( "collapse-request" , { bubbles : false } ));
	}
/**
 *		init ( )
 *		Creates a navigation panel element at the bottom of the document.
 *		@param searchparams - carries parameters in a string collection
 *		@param searchparams.referenceElement - ID of the reference element for injection
 *
 */ export function init ( searchparams = new URLSearchParams ) {
	console.info( "initializing navigation panel" );
	// Create the panel
	const panel = document.createElement( "DIV" );
	panel.id = "navigationPanel" ;
	panel.setAttribute( "dock", "left" );
	// Create the close button
	let o = document.createElement( "button" );
	o.type = "button" ;
	o.innerText = "Close" ;
	o.addEventListener( "click" , ( ) => panel.dispatchEvent( new Event( "collapse-request" , { bubbles : false } )));
	panel.insertBefore( o, null );
	// Insert an HTML fragment link to load the table-of-contents
	o = document.createElement( "A" );
	o.setAttribute( "href", "/toc.htm" );
	o.toggleAttribute( "data-load-fragment" );
//	o.classList.add( "sitemap-root" ); 
	panel.insertBefore( o, null );
	// Inject panel into page
	document.body.insertBefore( panel, document.getElementById( searchparams.get( "referenceElement" )));
	// Register show/hide event handler
	document.addEventListener( "toggle-navigation-panel" , toggleNavigationPanel );
	// Monitor close events
	panel.addEventListener( "expand-request" , evt => {
		console.info( "Panel expand request event recognized." );
		window.requestAnimationFrame( ( ) => document.addEventListener( "click" , documentClickHandler )) ;
		} ) ;
	panel.addEventListener( "collapse-request" , evt => {
		console.info( "Panel collapse request event recognized." );
		document.removeEventListener( "click" , documentClickHandler ) ;
		} ) ;
	}
/** Module init code */ initializer.initComponent( init, import.meta.url );
