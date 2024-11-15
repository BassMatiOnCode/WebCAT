// Documentation: .../web-toolbox/scroll-box/scroll-box.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;
import { createElement } from "../utility/create-element/create-element-1.js" ;

/**
 *		createSelector( )
 *
 */ function createSelector( scrollbarProvider, appendix="" ) {
	return `#${ scrollbarProvider.parentElement.id }${ appendix }` ;
	}
/**
 *		createHeightRule( )
 *
 */ function createHeightRule( scrollbarProvider, heightSelector, selectorAppendix="", index ) {
	stylesheet.insertRule( `${ createSelector( scrollbarProvider, selectorAppendix) } { height : ${ scrollbarProvider[ heightSelector ] }px }` , index ) ;
	}
/**
 *		findStyleRuleIndex( )
 *
 */ function findStyleRuleIndex( selector ) {
	for ( let i = 0 ; i < stylesheet.cssRules.length ; i ++ ) if ( stylesheet.cssRules[ i ].selectorText === selector ) return i ;
	return -1 ;
	}
/**
 *		createObserver( )
 *
 */ function createObserver( scrollbarProvider ) {
	// variables for recent height values
	let clientHeight = scrollbarProvider.clientHeight ;
	let offsetHeight = scrollbarProvider.offsetHeight ;
	new ResizeObserver( entries => { 
		const entry = entries[ 0 ] ;
		if ( entry.target.offsetHeight !== offsetHeight ) { 
//			console.debug ( "offsetHeight changed:" , entry.target.offsetHeight, offsetHeight ) ;
			offsetHeight = scrollbarProvider.offsetHeight ;
			const selector = createSelector( scrollbarProvider, ":hover" );
			const index = findStyleRuleIndex( selector ) ;
			if ( index === -1 ) return console.error( "CSS rule not found." , selector ) ;
			stylesheet.deleteRule( index );
			createHeightRule( scrollbarProvider, "offsetHeight", ":hover", index );
			}
		if ( entry.target.clientHeight !== clientHeight ) { 
//			console.debug ( "clientHeight changed:" , entry.target.clientHeight, clientHeight ) ;
			clientHeight = scrollbarProvider.clientHeight ;
			const selector = createSelector( scrollbarProvider );
			const index = findStyleRuleIndex( selector ) ;
			if ( index === -1 ) return console.error( "CSS rule not found." , selector ) ;
			stylesheet.deleteRule( index );
			createHeightRule( scrollbarProvider, "clientHeight", "", index );
			}
		} ).observe( scrollbarProvider ); // immediately start monitoring
	}
/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init( ) {
	// Find scroll-box elements and add the functional containers
	for ( const scrollbox of document.querySelectorAll( ".horizontal.scroll-box" )) {
		// Find scroll-box item containers and add the functional containers
		const items = Array.from( scrollbox.childNodes );
		// Save references to the items
		const curtain = createElement( "DIV" , { attributes : { id : `curtain-${ (++curtainID).toString().padStart(3, "0") }` } } );
		scrollbox.append( curtain );
		const scrollbarProvider = createElement( "DIV" ); // , { attributes : { class : "scrollbar-provider" } } ) ;
		curtain.append( scrollbarProvider );
		const itemContainer = createElement( "DIV" ); // , { attributes : { class : "item-container" } } ) ;
		scrollbarProvider.append( itemContainer );
		// Move the items to the item container
		itemContainer.append( ...items );
		// Create the CSS height rules for the curtain box
		createHeightRule( scrollbarProvider, "clientHeight" );
		createHeightRule( scrollbarProvider, "offsetHeight", ":hover" );
		// Monitor the scrollbar provider height
		createObserver( scrollbarProvider );
		// It is now safe to show the box.
		scrollbox.style.visibility = "visible" ;
		}
	}

// * * Module init code * *// 

const stylesheet = (( ) => {
	const style = document.getElementById( "webcatStylesheet" ) || document.createElement( "STYLE" ) ;
	if ( ! style.id ) {
		style.id = "webcatStylesheet" ;
		document.head.append( style );
		}
	return style.sheet ;
	} ) ( ) ; // The CSSStyleSheet of the webcatStylesheet element.
let curtainID = 0 ;  // A couter to create unique IDs for the curtain elements.
initializer.initComponent( init, import.meta.url );
