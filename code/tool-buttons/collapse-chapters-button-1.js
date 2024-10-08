// Documentation: /web-cat/tool-buttons/tool-buttons.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;
import { appendAnchorButton } from "../tool-buttons/base-anchor-button-1.js" ;

const settings = {
	autoscrollMarginTop : undefined  // bottom edge of main toolbar, used for auto-scrolling
	} ;

/**
 *		setButtonState()
 *
 */ function toggleButtonState ( anchor, state=undefined ) {
	state = state || ( anchor.getAttribute( "data-state" ) === "expanded" ? "collapsed" : "expanded" ) ;
	anchor.setAttribute( "data-state" , state );
	return state ;
	}
/**
 *		init ( )
 *		Adds the button to the specified toolbar	and loads the associated SVG image.
 */
export function init ( searchparams = new URLSearchParams( ) ) {
	// Setup parameters for auto-scrolling feature
	settings.autoscrollMarginTop = settings.autoscrollMarginTop || parseInt(searchparams.get( "autoscroll-margin-top" )) ;
	if ( ! settings.autoscrollMarginTop ) {
		const element = document.querySelector( "MAIN" )?.previousElementSibling || document.getElementById( "mainToolbar" ) ;
		if ( element ) settings.autoscrollMarginTop = element.scrollTop + element.offsetHeight ;
		else settings.autoscrollMarginTop = 0 ;
		}
	// Create and insert the anchor button
	const anchor = appendAnchorButton( "collapse-chapters-button.svg" , { 
		toolbar : searchparams.get( "toolbar" ) ,
		postprocess : ( anchor ) => {
			toggleButtonState ( anchor, searchparams.get( "initial-state" ) || "expanded" );
		}	} ) ;
	anchor.setAttribute( "name" , "collapse-chapters" );
	console.debug( "adding click event listener" );
	anchor.addEventListener( "click" , evt => {
		evt.preventDefault( );
		evt.stopPropagation( );
		// Compile a selector for chapter controllers in the current state
		const currentState = evt.currentTarget.getAttribute( "data-state" );
		toggleButtonState( anchor );
		// If expanding, store a reference to the first visible element
		let firstVisibleElement ;
		if ( currentState === "collapsed" ) {
			// Loop through elements (important: from the bottom to top!)
			for ( const element of Array.from(( mainContent || document.body).querySelectorAll( "*" )).reverse( )) {
				if ( element.getBoundingClientRect().top < settings.autoscrollMarginTop ) { 
					// Element is at least partially hidden by the toolbar
					firstVisibleElement = element ; 
					firstVisibleElement.style.scrollMarginTop = `${firstVisibleElement.getBoundingClientRect().top}px` ;
					break ;
			}	}	}
		let selectors = [ ] ;
		for ( let i = 1 ; i <= 5 ; i += 1 ) selectors.push( `H${i}[data-collapsible-state="${currentState}"]` );
		// Dispatch a click event to matching chapter controllers
		const event = new Event( "click" , { bubbles : true } );
		event.offsetX = -10 ; 
		const controllers = (document.querySelector( "MAIN" ) || document.body ).querySelectorAll( selectors.toString( ));
		for ( const controller of controllers ) controller.dispatchEvent( event );
		// If expanding chapters, keep the topmost visible element in view 
		function transitionEndHandler ( ) {
			requestAnimationFrame ( ( ) => 
			requestAnimationFrame ( ( ) => {
			firstVisibleElement.scrollIntoView( { behavior : "smooth" } ) ;
			firstVisibleElement.style.removeProperty( "scrollMarginTop" ) ;
			controllers[ controllers.length - 1 ].removeEventListener( "transitionend" , scrollElement );
			} ) ) }
		// Add transition end handler to start auto-scrolling
		if ( firstVisibleElement ) controllers[ controllers.length - 1 ].addEventListener( "transitionend" , transitionEndHandler );
		} ) ;
	}

// Module Init Code
//
initializer.initComponent( init, import.meta.url );
