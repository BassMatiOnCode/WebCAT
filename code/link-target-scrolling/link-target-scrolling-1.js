// Documentation: .../web-toolbox/link-target-scrolling/link-target-scrolling.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;

let scrollMarginTop ;  // default scroll margin top

/**
*		scrollToElement ( )
*		Scrolls the element into view and triggers highlighting animation.
*		Returns true if the link target element was found, or undefined otherwise.
*
*/ export function scrollToElement( selector ) {
	// Find the link target element
	if ( selector?.length < 2 ) return ;  // nothing to do
	const element = document.querySelector( selector );
	if ( ! element ) return console.error( `Link target element not found: ${selector}` );
	// Determine the scroll margin top
	const event = new CustomEvent( "query-scroll-margin-top", { detail : { marginTop : null , marginBottom : null  } } ) ;
	document.dispatchEvent( event ) ;
	const scrollMargin = event.detail.marginTop || scrollMarginTop ;
	element.style.scrollMarginTop =	`${ scrollMargin }px` ;
//	element.scrollIntoView( { behavior : "smooth" , block : "start" } );
	document.scrollingElement.scroll( { top : element.offsetTop - scrollMargin , behavior : "smooth"  } ) ;
	function scrollEndHandler ( ) {
		document.location.hash = selector ;
		document.removeEventListener( "scrollend" , scrollEndHandler );
		}
	document.addEventListener( "scrollend" , scrollEndHandler );
	return true;
	}
/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init( searchparams = new URLSearchParams( )) {
	console.debug( "Module.init() is running" );
	// Save and remove document fragment identifier from the URL to enable smooth scrolling.
	const linkTargetElementSelector = document.location.hash;
	document.location.hash = "" ;
	// Scroll to link target element
	scrollMarginTop = searchparams.get( "scroll-margin-top" ) || "20" ;
	scrollToElement( linkTargetElementSelector );
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
// Initialize component
initializer.initComponent( init, import.meta.url );
