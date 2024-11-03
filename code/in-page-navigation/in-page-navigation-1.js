// Documentation: .../web-toolbox/tool-buttons/in-page-navigation.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;

export const settings = {
	scrollMarginTop : 0 ,  // compensation for toolbars and other sticky content
	container : undefined ,  // reference to the container that holds the scroll targets
	selector : undefined ,  // Defines which elements can be jumped to
	scrollTargets : undefined  // list of heading elements in the main content container
	} ;

/**
 *		scrollToNextTarget( )
 *
 */ export function scrollToNextTarget ( ) {
	updateScrollMargin( );
	if ( ! settings.scrollTargets ) settings.scrollTargets = document.querySelectorAll( settings.selector );
	for ( const heading of settings.scrollTargets ) {
		if ( heading.getBoundingClientRect( ).top > settings.scrollMarginTop + 10  ) {
			document.documentElement.scroll( { top : heading.offsetTop - settings.scrollMarginTop , behavior : "smooth"  } ) ;
			return;
			}
		}
	}
/**
 *		scrollToPreviousTarget( )
 *
 */ export function scrollToPreviousTarget ( ) {
	updateScrollMargin( );
	if ( ! settings.scrollTargets ) settings.scrollTargets = document.querySelectorAll( settings.selector );
	for ( let i = settings.scrollTargets.length - 1 ; i >= 0 ; i -= 1 ) {
		const heading = settings.scrollTargets[ i ];
		if ( heading.getBoundingClientRect( ).top < 0  ) {
			document.documentElement.scroll( { top : heading.offsetTop - settings.scrollMarginTop , behavior : "smooth"  } ) ;
			return;
			}
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
 *		scrollPageHandler( )
 *
 */ function scrollPageHandler ( evt ) {
	switch ( evt.detail.method ) {
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
		}
	}
/**
 *		updateTargetList( )
 *
 */ export function updateTargetList( ) {
	settings.scrollTargets = settings.container.querySelectorAll( settings.selector );
	}
/**
 *		updateScrollMargin( )
 *
 */ function updateScrollMargin ( ) {
	const event = new CustomEvent ( "query-scroll-margins" , { detail : { } } ) ; 
	document.dispatchEvent( event );
	settings.scrollMarginTop = event.detail.marginTop || settings.scrollMarginTop ;
	}
/**
*		init ( )
*		
*/ export function init( searchparams = new URLSearchParams( )) {
	// Initialize parameters. Prefer settings members if possible.
	updateScrollMargin( );
	settings.scrollMarginTop = settings.scrollMarginTop || parseInt(searchparams.get( "scroll-margin-top" ) || 0) ;
	settings.container = settings.container || document.getElementById( searchparams.get( "container" )) || document.querySelector( "MAIN" ) || document ;
	// Compile the list of scroll targets
	settings.selector = settings.selector || searchparams.get( "selector" ) || "H1,H2,H3,H4,H5" ;
	updateTargetList( );
	// Keep scroll targets up to date
	if ( searchparams.has( "monitor-fragment-loading-complete" )) document.addEventListener( "fragment-loading-complete" , updateTargetList );
	// Add event listener
	document.addEventListener( "scroll-page" , scrollPageHandler ); 
	}
/** Module init code */ 
initializer.initComponent( init, import.meta.url );
