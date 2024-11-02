// Documentation: .../web-toolbox/tool-buttons/in-page-navigation.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;

export const settings = {
	offsetTop : 0 ,  // compensation for toolbars and other sticky content
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
		if ( heading.getBoundingClientRect( ).top > settings.offsetTop + 10  ) {
			document.documentElement.scroll( { top : heading.offsetTop - settings.offsetTop , behavior : "smooth"  } ) ;
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
			document.documentElement.scroll( { top : heading.offsetTop - settings.offsetTop , behavior : "smooth"  } ) ;
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
	settings.offsetTop = event.detail.marginTop || settings.offsetTop ;
	}
/**
*		init ( )
*		
*/ export function init( searchparams = new URLSearchParams( )) {
	// Initialize parameters. Prefer settings members if possible.
	updateScrollMargin( );
	settings.offsetTop = settings.offsetTop || parseInt(searchparams.get( "offsetTop" ) || 0) ;
	settings.container = settings.container || document.getElementById( searchparams.get( "container" )) || document.querySelector( "MAIN" ) || document ;
	settings.selector = settings.selector || searchparams.get( "selector" ) || "H1,H2,H3,H4,H5" ;
	// (Re)Compile the list of scrollTargets
	settings.scrollTargets = settings.container.querySelectorAll( settings.selector );
	}
/** Module init code */ 
initializer.initComponent( init, import.meta.url );
