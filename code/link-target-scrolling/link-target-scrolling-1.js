// Documentation: .../web-toolbox/link-target-scrolling/link-target-scrolling.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;

let scrollMarginTop ;  // default fixed scroll margin top value

/**
*		scrollToElement ( )
*		Scrolls the element into view and triggers highlighting animation.
*		Returns true if the link target element was found, or undefined otherwise.
*
*/ export function scrollToElement( selector, restoreHash ) {
	console.debug( "selector=", selector );
	// Find the link target element
	if ( selector?.length < 2 ) return ;  // nothing to do
	const element = document.querySelector( selector );
	if ( ! element ) return console.error( `Link target element not found: ${selector}` );
	// Determine the scroll margin top
	const event = new CustomEvent( "query-scroll-margins", { detail : { marginTop : null , marginBottom : null  } } ) ;
	document.dispatchEvent( event ) ;
	const scrollMargin = event.detail.marginTop || scrollMarginTop ;
	document.scrollingElement.scroll( { top : element.offsetTop - scrollMargin , behavior : "smooth"  } ) ;
	function scrollEndHandler ( ) {
		// Restore the location hash only if requested.
		document.location.hash = selector ;
		document.removeEventListener( "scrollend" , scrollEndHandler );
		}
	if ( restoreHash ) document.addEventListener( "scrollend" , scrollEndHandler );
	return true;
	}
/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init( searchparams = new URLSearchParams( )) {
	// Scroll to link target element
	scrollMarginTop = searchparams.get( "scroll-margin-top" ) || "20" ;
	scrollToElement( linkTargetElementSelector, searchparams.get( "restore-hash" ) || false );
	// Add event handler to monitor anchors with links to elements on the page
	document.addEventListener( "click" , evt => {
		// Catch anchor clicks that navigate to an element on the same page
		if ( evt.target.tagName !== "A" ) return ;
		// Scroll smoothly instead.
		if ( scrollToElement( evt.target.hash )) evt.preventDefault( ) ;
		} ) ;
	}
/** 
 *		Module init code 
 */ 
// Save and remove document fragment identifier from the URL to enable smooth scrolling.
const linkTargetElementSelector = document.location.hash;
document.location.hash = "" ;
window.requestAnimationFrame( ( ) => { 
window.requestAnimationFrame( ( ) => { 
	initializer.initComponent( init, import.meta.url );
	} );
	} );
