// Documentation: .../webcat/scroll-box/scroll-box.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;
import * as dynamcStyles from "../dynamic-styles/dynamic-styles-1.js" ;
import { createElement } from "../utility/create-element/create-element-1.js" ;
import { createUniqueID } from "../utility/unique-id/unique-id-1.js" ;

/**
 *		createSelector( )
 *
 */ function createSelector( scrollbarProvider, appendix="" ) {
	return `#${ scrollbarProvider.parentElement.id }${ appendix }` ;
	}
/**
 *		createHeightRule( )
 *
 */ function createHeightRule( scrollbarProvider, heightSelector, selectorAppendix="" ) {
	dynamcStyles.insertRule( `${ createSelector( scrollbarProvider, selectorAppendix) }` , `height : ${ scrollbarProvider[ heightSelector ] }px` ) ;
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
			// Update recent value
			offsetHeight = scrollbarProvider.offsetHeight ;
			// Update style rule
			createHeightRule( scrollbarProvider, "offsetHeight", ":hover" );
			}
		if ( entry.target.clientHeight !== clientHeight ) { 
			// Update recent value
			clientHeight = scrollbarProvider.clientHeight ;
			// Update style rule
			createHeightRule( scrollbarProvider, "clientHeight", "" );
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
		const curtain = createElement( "DIV" , { attributes : { class : "curtain" , id : `curtain-${ createUniqueID( { prefix : "curtain" } ) }` } } );
		scrollbox.append( curtain );
		const scrollbarProvider = createElement( "DIV" , { attributes : { class : "scrollbar-provider" } } ) ;
		curtain.append( scrollbarProvider );
		const itemContainer = createElement( "DIV" , { attributes : { class : "item-container" } } ) ;
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

initializer.initComponent( init, import.meta.url );
