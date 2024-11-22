// Documentation: .../web-toolbox/horizontal-listbox/horizontal-listbox.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;
import { createElement } from "../utility/create-element/create-element-1.js" ;
import { createUniqueID } from "../utility/unique-id/unique-id-1.js" ;

/**
*		scrollItemLeft ( )
*
*/	export function scrollItemLeft( evt ) {
	evt.preventDefault( );
	evt.stopPropagation( );
	for ( const item of Array.from( evt.target.nextElementSibling.children ).reverse( )) {
		const d = item.offsetLeft - configuration.itemOffset ;
		if ( d - Math.round( evt.target.nextElementSibling.scrollLeft ) < - configuration.pickThreshold  ) {
			evt.target.nextElementSibling.scroll( { left : d , behavior : "smooth" } );
			return ;
	}	}	}
/**	*	*	*
*		scrollItemRight ( )
*
*/	export function scrollItemRight( evt ) {
	evt.preventDefault( );
	evt.stopPropagation( );
	for ( const item of evt.target.previousElementSibling.children ) {
		const d = item.offsetLeft - configuration.itemOffset ;
		if ( d - Math.round( evt.target.previousElementSibling.scrollLeft ) > configuration.pickThreshold  ) {
			evt.target.previousElementSibling.scroll( { left : d , behavior : "smooth" } );
			break ;
	}	}	}
/**	*	*	*
*		init ( )
*		Initializes the WebCAT component.
*
*/	export function init( searchparams = new URLSearchParams( )) {
	configuration.itemOffset = parseInt( searchparams.get( "item-offset" )) || 5 ;
	configuration.pickThreshold = parseInt( searchparams.get( "pick-threshold" )) || 5 ;
	configuration.dynamicScrollbar = searchparams.has( "pick-threshold" );
	for ( const listbox of document.querySelectorAll( ".horizontal-listbox" )) {
		const items = Array.from( listbox.children );
		const curtain = listbox.insertBefore( createElement( "DIV" , { attributes : { class : "curtain" , id : createUniqueID( "curtain" ) } } ) , null ) ;
		curtain.append( createElement( "DIV" , { attributes : { class : "arrow left" } } ) ) ;
		curtain.append( createElement( "DIV" , { attributes : { class : "item-container" , "data-item-index" : "0" } } ) ) ;
		curtain.lastElementChild.append( ...items );  // move items into their container
		curtain.append( createElement( "DIV" , { attributes : { class : "arrow right" } } ) ) ;
		if ( configuration.dynamicScrollbar ) ;
		curtain.firstElementChild.addEventListener( "click" , scrollItemLeft );
		curtain.lastElementChild.addEventListener( "click" , scrollItemRight ) ;
		}
	}

/** Module init code */ 
export const configuration = { } ;
initializer.initComponent( init, import.meta.url );
