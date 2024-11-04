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
	// Find the link scrollTarget scrollTarget
	if ( ! scrollTarget ) return ;
	if ( typeof scrollTarget === "string" ) {
		const target = document.querySelector( scrollTarget );
		if ( target ) scrollTarget = target ;
		else return console.error( `Scroll target element not found: ${scrollTarget}` );
		}
	// Determine the scroll margin top
	const event = new CustomEvent( "query-scroll-margins", { detail : { } } ) ;
	document.dispatchEvent( event ) ;
	const scrollMargin = event.detail.marginTop || configuration.scrollMarginTop ;
	document.scrollingElement.scroll( { top : scrollTarget.offsetTop - scrollMargin , behavior : "smooth"  } ) ;
	function scrollEndHandler ( ) {
		// Restore the location hash only if requested.
		document.location.hash = selector ;
		document.removeEventListener( "scrollend" , scrollEndHandler );
		}
	if ( configuration.restoreHash ) document.addEventListener( "scrollend" , scrollEndHandler );
	return true;
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
	configuration.scrollTargetsContainer = document.getElementById( searchparams.get( "scrollTargetsContainer" )) || document.querySelector( "MAIN" ) || document ;
	updateScrollTargetList( searchparams.get( "scrollTargetsSelector" ) || "H1,H2,H3,H4,H5" );
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
			scrollToTopOfPage( );
			break;
		case "bottomOfPage" :
			scrollToBottomOfPage( );
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
	configuration.restoreHash = searchparams.has( "restore-hash" );
	// Scroll to the element addressed in the document fragment identifier (URL hash)
	if ( configuration.documentFragmentIdentifier ) scrollToElement( configuration.documentFragmentIdentifier );
	}
/** 
 *		Module init code 
 */ 
// Save and remove document fragment identifier from the URL to enable smooth scrolling.
debugger;
if ( document.location.hash.length > 1 ) {
	configuration.documentFragmentIdentifier = document.location.hash ;
	const url = new URL ( document.location );
	url.hash = "" ;
	history.replaceState( null, null, url.href ) ;
	// document.location.hash = "" ;
	 }
// requestAnimationFrame( ( ) => { 
// requestAnimationFrame( ( ) => { 
	initializer.initComponent( init, import.meta.url );
//	} );
//	} );
