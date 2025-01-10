// Documentation: .../web-toolbox/page-scrolling/page-scrolling.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;

const configuration = {
	scrollMarginTop : 0 ,  // fixed default scroll margin top value
	scrollMarginBottom : 0 ,  // fixed default scroll margin bottom value
	scrollTargetsContainer : undefined ,  // reference to the scrollTargetsContainer that holds the scroll targets
	scrollTargetsSelector : undefined ,  // Defines which elements can be jumped to
	scrollTargets : undefined ,  // list of heading elements in the main content scrollTargetsContainer
	documentFragmentIdentifier : undefined  //stores the url "hash" part
	}

/**
*		scrollToElement ( )
*		Scrolls the scrollTarget into view and triggers highlighting animation.
*		Returns true if the link scrollTarget scrollTarget was found, or undefined otherwise.
*
*/ export function scrollToElement( scrollTarget ) {
	if ( ! scrollTarget ) return ;
	// Find the scrollTarget by CSS selector
	if ( typeof scrollTarget === "string" ) {
		const target = document.querySelector( scrollTarget );
		if ( target ) scrollTarget = target ;
		else return console.error( `Selected scroll target not found: ${target}` );
		}
	// Determine the scroll margin top
	const event = new CustomEvent( "query-scroll-margins", { detail : { } } ) ;
	document.dispatchEvent( event ) ;
	let scrollY = -( event.detail.marginTop || configuration.scrollMarginTop );
	// Collect scroll top offsets from parents
	let element = scrollTarget ;
	while ( element ) { 
		scrollY += element.offsetTop ;
		element = element.offsetParent ;
		}
	document.scrollingElement.scroll( { top : scrollY , behavior : "smooth"  } ) ;
	// Restore original document URL only if requested.
	function scrollEndHandler ( ) {
		history.replaceState( null, null, document.location.href + (configuration.documentFragmentIdentifier || "" )) ;
		configuration.restoreHash = false;  // it's a one-time operation
		document.removeEventListener( "scrollend" , scrollEndHandler );
		}
	if ( configuration.restoreHash ) document.addEventListener( "scrollend" , scrollEndHandler );
	return true;  // to indicate that the document was navigated to a link target element.
	}
/**
 *		updateScrollMargins( )
 *
 */ export function updateScrollMargins( ) {
	const event = new CustomEvent ( "query-scroll-margins" , { detail : { } } ) ; 
	document.dispatchEvent ( event );
	configuration.scrollMarginTop = event.detail.marginTop || configuration.scrollMarginTop || 0 ;
	configuration.scrollMarginBottom = event.detail.marginBottom || configuration.scrollMarginBottom || 0 ;
	}
/**
 *		scrollToNextTarget( )
 *
 */ export function scrollToNextTarget ( ) {
	updateScrollMargins( );
	if ( ! configuration.scrollTargets ) configuration.scrollTargets = document.querySelectorAll( configuration.scrollTargetsSelector );
	for ( const heading of configuration.scrollTargets )
		if ( heading.getBoundingClientRect( ).top > configuration.scrollMarginTop + 10  ) 
			return scrollToElement( heading ) ;
	}
/**
 *		scrollToPreviousTarget( )
 *
 */ export function scrollToPreviousTarget ( ) {
	updateScrollMargins( );
	if ( ! configuration.scrollTargets ) configuration.scrollTargets = document.querySelectorAll( configuration.scrollTargetsSelector );
	for ( let i = configuration.scrollTargets.length - 1 ; i >= 0 ; i -= 1 ) {
		const scrolltarget = configuration.scrollTargets[ i ];
		if ( scrolltarget.getBoundingClientRect( ).top < 0  ) 
			return scrollToElement( scrolltarget ) ;
		}
	}
/**
 *		scrollToTopOfPage()
 *
 */ export function scrollToTopOfPage ( ) {
	window.scroll( { top : 0 , behavior : "smooth" } );
	}
/**
 *		scrollToBottomOfPage()
 *
 */ export function scrollToBottomOfPage ( ) {
	window.scroll( { top : document.documentElement.scrollHeight , behavior : "smooth" } ) ;
	}
/**
 *		updateScrollTargetList( )
 *
 */ export function updateScrollTargetList ( selector ) {
	configuration.scrollTargetsSelector = selector || configuration.scrollTargetsSelector ;
	configuration.scrollTargets = configuration.scrollTargetsContainer.querySelectorAll( configuration.scrollTargetsSelector );
	}
/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init( searchparams = new URLSearchParams( )) {
	// Set scroll margin configuration
	const event = new CustomEvent ( "query-scroll-margins" , { detail : { } } ) ; 
	document.dispatchEvent( event );
	configuration.scrollMarginTop = event.detail.marginTop || parseInt( searchparams.get( "scroll-margin-top" )) || 0 ;
	configuration.scrollMarginBottom = event.detail.marginBottom || parseInt( searchparams.get( "scroll-margin-bottom" )) || 0 ;
	// Compile the list of scroll targets
	configuration.scrollTargetsContainer = document.getElementById( searchparams.get( "scroll-targets-container" )) || document.querySelector( "MAIN" ) || document ;
	updateScrollTargetList( searchparams.get( "scroll-targets-selector" ) || "H1,H2,H3,H4,H5" );
	// Keep scroll targets up to date
	if ( searchparams.has( "monitor-fragment-loading" )) document.addEventListener( "fragment-loading-complete" , ( ) => updateScrollTargetList( ));
	// Monitor scroll request events
	document.addEventListener( "scroll-page-request" , evt => { 
		switch ( evt.detail.scrollTarget ) {
		case "nextTarget" :
			scrollToNextTarget( );
			break;
		case "previousTarget" :
			scrollToPreviousTarget( );
			break;
		case "topOfPage" :
			window.scroll( { top : 0 , behavior : "smooth" } );
			break;
		case "bottomOfPage" :
			window.scroll( { top : document.documentElement.scrollHeight , behavior : "smooth" } ) ;
			break;
		default :
			scrollToElement( evt.detail.scrollTarget );
			break ;
		}	} ) ;
	// Monitor clicks on anchors which link to elements on the page
	document.addEventListener( "click" , evt => {
		if ( evt.target.tagName !== "A" ) return ;
		if ( scrollToElement( evt.target.hash )) evt.preventDefault( ) ;
		} ) ;
	// An application might require the hash to be restored when loading has finished
	configuration.restoreHash = searchparams.get( "restore-hash" ) !== "no" ;
	// Scroll to the element addressed in the document fragment identifier (URL hash)
	if ( configuration.documentFragmentIdentifier ) scrollToElement( configuration.documentFragmentIdentifier );
	}
/** 
 *		Module init code 
 */ 
// Save and remove document fragment identifier from the URL to enable smooth scrolling.
if ( document.location.hash.length > 1 ) {
	configuration.documentFragmentIdentifier = document.location.hash ;
	const url = new URL ( document.location );
	url.hash = "" ;
	history.replaceState( null, null, url.href ) ;
	 }
initializer.initComponent( init, import.meta.url );
