// Documentation: .../web-toolbox/scroll-margin-provider/scroll-margin-provider.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;

/** Module configuration parameters */ const configuration = {
	recalculate : true ,
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
	let marginTop = 0 ;
	let marginBottom = 0;
	for ( const element of document.querySelectorAll( '.toolbar' )) {
		const style = getComputedStyle( element ) ;
		if ( style.position === "sticky" && style.top !== "auto" )  
			marginTop = Math.max( marginTop, parseInt( style.top || 0 ) + element.offsetHeight );
		else if ( style.position === "sticky" && style.bottom !== "auto" ) 
			marginBottom = Math.max( marginBottom, parseInt( style.bottom || 0 ) + element.offsetHeight + 1 ) ;
		}
	// Configuration update required?
	if ( configuration.marginTop === marginTop && configuration.marginBottom === marginBottom ) return ;
	// Update configuration
	configuration.marginTop = marginTop ;
	configuration.marginBottom = marginBottom ;
	// Add static scroll-margin styles to potential link target elements
	const root = document.querySelector( "MAIN" ) || document.body ;
	for ( const element of root.querySelectorAll( "[id]" )) {
		if ( marginTop ) element.style.setProperty( "scroll-margin-top" , marginTop + "px" )
		else element.style.removeProperty( "scroll-margin-top" );
		if ( marginBottom ) element.style.setProperty( "scroll-margin-bottom" , marginBottom + "px" ) ;
		else element.style.removeProperty( "scroll-margin-bottom" );
		}
	}
/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init ( searchparams = new URLSearchParams( )) {
	configuration.recalculate = searchparams.get( "recalculate" ) !== "never" ;
	configuration.additionalMarginTop = parseInt( searchparams.get( "additional-margin-top" ) || 10 ) ;
	configuration.additionalMarginBottom = parseInt( searchparams.get( "additional-margin-bottom" ) || 10 ) ;
	initDocument( );
	document.addEventListener( "query-scroll-margins" , evt => {
		if ( configuration.recalculate || evt.detail.recalculate ) initDocument( );
		evt.detail.marginTop = configuration.marginTop + configuration.additionalMarginTop ;
		evt.detail.marginBottom = configuration.marginBottom + configuration.additionalMarginBottom ;
		} ) ;
	}
/** Module init code */ initializer.initComponent( init, import.meta.url );
