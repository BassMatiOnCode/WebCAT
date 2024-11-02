// Documentation: .../web-toolbox/scroll-margin-provider/scroll-margin-provider.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;

/** Module configuration parameters */ const configuration = {
	marginTop : 0 ,
	marginBottom : 0
	}

/**
*		initDocument ( )
*		Determine current scroll margins and adds static scroll-margin styles 
*		to potential link target elements
*
*/ export function initDocument ( ) {
	// Determine current scroll margins
	configuration.marginTop = 0 ;
	configuration.marginBottom = 0;
	for ( const element of document.querySelectorAll( '.toolbar' )) {
		const style = getComputedStyle( element ) ;
		if ( style.position === "sticky" && style.top !== "auto" )  
			configuration.marginTop = Math.max( configuration.marginTop, parseInt( element.top || 0 ) + element.scrollHeight );
		else if ( style.position === "sticky" && style.bottom !== "auto" ) 
			configuration.marginBottom = Math.max( configuration.marginBottom, parseInt( style.bottom || 0 ) + element.offsetHeight + 1 ) ;
		}
	// console.debug( configuration );
	// Add static scroll-margin styles to potential link target elements
	const root = document.querySelector( "MAIN" ) || document.body ;
	for ( const element of root.querySelectorAll( "[id]" )) {
		if ( configuration.marginTop ) element.style.setProperty( "scroll-margin-top" , configuration.marginTop + "px" )
		else element.style.removeProperty( "scroll-margin-top" );
		if ( configuration.marginBottom ) element.style.setProperty( "scroll-margin-bottom" , configuration.marginBottom + "px" ) ;
		else element.style.removeProperty( "scroll-margin-bottom" );
		}
	}
/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init ( ) {
	initDocument( );
	document.addEventListener( "query-scroll-margins" , evt => {
		if ( evt.detail.recalculate ) initDocument( );
		evt.detail.marginTop = configuration.marginTop ;
		evt.detail.marginBottom = configuration.marginBottom ;
		} ) ;
	}
/** Module init code */ initializer.initComponent( init, import.meta.url );
