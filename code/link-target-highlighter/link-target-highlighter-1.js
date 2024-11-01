// Documentation: .../web-toolbox/link-target-highlighter/link-target-highlighter.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;

/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ function highlightLinkTarget( selector ) {
	if ( selector.length < 2 ) return;
	const element = document.querySelector( selector );
	if ( ! element ) return console.error( `Cannot find link target element: ${selector}` );
	element.classList.add( "highlight-link-target" );
	function animationEndHandler( evt ) {
		evt.target.classList.remove( "highlight-link-target" );
		evt.target.removeEventListener( "animationend" , animationEndHandler );
		}
	element.addEventListener( "animationend" , animationEndHandler );
	}
/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init( searchparams = new URLSearchParams( )) {
	highlightLinkTarget( document.location.hash );
	document.addEventListener( "click" , evt => {
		// Catch anchor clicks that navigate to an element on the same page
		if ( evt.target.tagName !== "A" ) return ;
		highlightLinkTarget( evt.target.hash );
		} ) ;

	}
/** Module init code */ initializer.initComponent( init, import.meta.url );
