// Documentation: /web-cat/docking-panel/docking-panel.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;

/**
*		getPropertyName ( )
*		returns "height" or "width", depending on the "dock" property value.
*
*/ export function getPropertyName ( panel ) {
	switch ( panel.getAttribute( "dock" )) {
	case "left" :
	case "right" :
		return "width" ;
	case "top" :
	case "bottom" :
		return "height" ;
	}	}
/**
*		expand ( )
*		Expands a panel
*
*/ export function expand ( panel ) {
	if ( panel.style.display !== "" ) return ;
	// TODO: Is display="block" necessary?
	panel.style.display = "block" ;
	const property = getPropertyName( panel );
	panel.style[ property ] = "auto" ;
	const length = window.getComputedStyle( panel )[ property ] ;
	panel.style[ property ] = "0px" ;
	requestAnimationFrame ( ( ) => {
		panel.style[ property ] = length ;
		} ) ;
	}
/**
*		collapse ( )
*		Collapses a panel
*
*/ export function collapse ( panel ) {
	panel.style.removeProperty( "overflow" );
	const property = getPropertyName( panel );
	panel.style[ property ] = window.getComputedStyle( panel )[ property ] ;
	requestAnimationFrame ( ( ) => {
		panel.style[ property ] = "0px" ;
		} ) ;
	}
/**
*		transitionEndHandler ( )
*		Finishes a height or width transition.
*
*/ export function transitionEndHandler ( evt ) {
	const property = getPropertyName( evt.target );
	if ( evt.target.style[ property ] === "0px" ) {  
		// collapsed
		evt.target.style.removeProperty( property );
		evt.target.style.removeProperty( "display" );
		}
	else {  
		// expanded
		evt.target.style[ property ] = "auto" ;
		evt.target.style.overflow = "auto" ;
	}	}
/**
*		init ( )
*		Initializes docking panels in the container
*
*/ export function init ( searchparams = new URLSearchParams( )) {
	const container = searchparams.get( "container" ) || document.body ;
	for ( const element of container.querySelectorAll( "[dock]" )) {
		element.addEventListener( "transitionend" , transitionEndHandler ) ;
		element.addEventListener( "expand-request" ,  evt => expand( evt.target )) ;
		element.addEventListener( "collapse-request" ,  evt => collapse( evt.target )) ;
		element.addEventListener( "toggle-visibility" , evt => { evt.target.scrollWidth === 0 || evt.target.scrollHeight === 0 ? 
			evt.target.dispatchEvent ( new Event ( "expand-request" , { bubbles : false } )) : 
			evt.target.dispatchEvent ( new Event ( "collapse-request" , { bubbles : false } )) } );
	}	}
/** Module init code */ initializer.initComponent( init, import.meta.url );
