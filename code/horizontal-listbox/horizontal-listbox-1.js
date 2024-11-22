// Documentation: .../web-toolbox/horizontal-listbox/horizontal-listbox.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;
import { createElement } from "../utility/create-element/create-element-1.js" ;

/**	- - - - - - - - - - - - - - - - - - - - - - - - - -	- - - - - -
*		getContainers ( )
*
*/	function getContainers( evt ) {
	return { 
		itemContainer : evt.target ,
 		curtain : evt.target.parentElement ,
		listbox : evt.target.parentElement.parentElement
		}
	}
/**	- - - - - - - - - - - - - - - - - - - - - - - - - -	- - - - - -
*		mouseEnterHandler ( )
*
*/	function mouseEnterHandler( evt ) {
	const { itemContainer, curtain, listbox } = getContainers( evt );
	curtain.style.height = itemContainer.clientHeight + "px" ;
	if ( ! listbox.classList.contains( "scrollbar" )) return;
	requestAnimationFrame( ( ) => {
	requestAnimationFrame( ( ) => {
		curtain.style.height = itemContainer.offsetHeight + "px" ;
		} ) ;
		} ) ;
	}
/**	- - - - - - - - - - - - - - - - - - - - - - - - - -	- - - - - -
*		mouseLeaveHandler ( )
*
*/	function mouseLeaveHandler( evt ) {
	const { itemContainer, curtain, listbox } = getContainers( evt );
	curtain.style.height = itemContainer.clientHeight + "px" ;
	}
/**	- - - - - - - - - - - - - - - - - - - - - - - - - -	- - - - - -
*		scrollItemLeft ( )
*
*/	function scrollItemLeft( evt ) {
	evt.preventDefault( );
	evt.stopPropagation( );
	const itemContainer = evt.target.nextElementSibling ;
	for ( const item of Array.from( itemContainer.children ).reverse( )) {
		const d = item.offsetLeft - configuration.itemSpaceRight ;
		if ( d - Math.round( itemContainer.scrollLeft ) < - configuration.pickThreshold  ) {
			itemContainer.scroll( { left : d , behavior : "smooth" } );
			return ;
	}	}	}
/**	- - - - - - - - - - - - - - - - - - - - - - - - - -	- - - - - -
*		scrollItemRight ( )
*
*/	function scrollItemRight( evt ) {
	evt.preventDefault( );
	evt.stopPropagation( );
	const itemContainer = evt.target.previousElementSibling ;
	for ( const item of itemContainer.children ) {
		const d = item.offsetLeft + item.offsetWidth - itemContainer.clientWidth + configuration.itemSpaceRight ;
		console.debug( item.innerText, d, d - Math.round( itemContainer.scrollLeft )); 
		if ( d - Math.round( itemContainer.scrollLeft ) > configuration.pickThreshold ) {
			itemContainer.scroll( { left : d , behavior : "smooth" } );
			break ;
	}	}	}
/**	- - - - - - - - - - - - - - - - - - - - - - - - - -	- - - - - -
*		init ( )
*		Initializes the WebCAT component.
*
*/	export function init( searchparams = new URLSearchParams( )) {
	configuration.itemSpaceLeft = parseInt( searchparams.get( "item-space-left" )) || 5 ;
	configuration.itemSpaceRight = parseInt( searchparams.get( "item-space-right" )) || 5 ;
	configuration.pickThreshold = parseInt( searchparams.get( "pick-threshold" )) || 5 ;
	for ( const listbox of document.querySelectorAll( ".horizontal-listbox" )) {
		// Create nexted box structure
		const items = Array.from( listbox.children );
		const curtain = listbox.insertBefore( createElement( "DIV" , { attributes : { class : "curtain" } } ) , null ) ;
		const leftArrow = curtain.insertBefore( createElement( "DIV" , { attributes : { class : "arrow left" } } ), null ) ;
		const itemContainer = curtain.insertBefore( createElement( "DIV" , { attributes : { class : "item-container" } } ), null ) ;
		const rightArrow = curtain.insertBefore( createElement( "DIV" , { attributes : { class : "arrow right" } } ), null ) ;
		// Move items into their container
		itemContainer.append( ...items );  
		// Add event handlers
		leftArrow.addEventListener( "click" , scrollItemLeft );
		rightArrow.addEventListener( "click" , scrollItemRight );
		itemContainer.addEventListener( "mouseenter" , mouseEnterHandler );
		itemContainer.addEventListener( "mouseleave" , mouseLeaveHandler );
		// Finish configuration
		curtain.style.height = itemContainer.clientHeight + "px" ;
		}
	}

/** Module init code */ 
export const configuration = { } ;
initializer.initComponent( init, import.meta.url );
