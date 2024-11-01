// Documentation: .../web-toolbox/scroll-margin-provider/scroll-margin-provider.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;

/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init ( ) {
	// init code goes here
	document.addEventListener( "query-scroll-margins" , evt => {
		evt.detail.marginTop = 0 ;
		evt.detail.marginBottom = 0 ;
		for ( const element of document.querySelectorAll( '.toolbar' )) {
			const style = getComputedStyle( element ) ;
			if ( style.position === "sticky" && style.top !== "auto" ) evt.detail.marginTop = 
				Math.max( evt.detail.marginTop, parseInt( style.top ) + element.offsetHeight );
			else if ( style.position === "sticky" && style.bottom !== "auto" ) evt.detail.marginBottom = 
				Math.max( evt.detail.marginBottom, parseInt( style.bottom ) + element.offsetHeight ) ;
	}	} ) }
/** Module init code */ initializer.initComponent( init, import.meta.url );
