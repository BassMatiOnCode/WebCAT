// Documentation: .../web-toolbox/scroll-box/scroll-box.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;
import { createElement } from "../utility/create-element/create-element-1.js" ;

const styleElement = document.getElementById( "webcat-stylesheet" ) || document.createElement( "STYLE" ) ;
if ( ! styleElement.id ) styleElement.id = "webcat-stylesheet" ;
if ( ! styleElement.parentNode ) document.head.append( styleElement );
let curtainID = 0 ;

/**
 *		AddStyleRules( )
 *
 */ function addStyleRules( scrollbarProvider ) {
	const curtain = scrollbarProvider.parentElement ;
	styleElement.sheet.insertRule( `#${ curtain.id } { height : ${ scrollbarProvider.clientHeight }px }` );
	styleElement.sheet.insertRule( `#${ curtain.id }:hover { height : ${ scrollbarProvider.offsetHeight }px }` );
	}
/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init( ) {
	// Find scroll-box item containers and add the functional containers
	for ( const contentbox of document.querySelectorAll( ".horizontal.scroll-box.items" )) {
		const scrollbox = createElement( "DIV" , { attributes : { class : "horizontal scroll-box" } } );
		const curtain = createElement( "DIV" , { attributes : { id : `curtain-${ ++ curtainID }` } } );
		scrollbox.append( curtain );
		const scrollbarProvider = createElement( "DIV", { attributes : { class : "scrollbar-provider" } } ) ;
		curtain.append( scrollbarProvider );
		contentbox.replaceWith( scrollbox );
		scrollbarProvider.append( contentbox );
		contentbox.setAttribute( "class", "items" );
		addStyleRules( scrollbarProvider );
		}
	}
/** Module init code */ initializer.initComponent( init, import.meta.url );
