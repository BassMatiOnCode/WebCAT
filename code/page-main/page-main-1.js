// Documentation: .../web-cat/page-main/page-main.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;

/**
*		init ( )
*		Wraps the entire body content in a MAIN container.
*
*/ export function init ( ) {
	const main = document.getElementsByTagName( "MAIN" )[ 0 ] || document.createElement( "MAIN" );
	main.id = "mainContent" ;
	main.classList.add( "collapsible-structure" );  // root element for collapsible chapters
	const searchparams = new URLSearchParams( document.location.search );
	main.setAttribute( "data-collapsible-default", searchparams.get("collapsible-default") || "expanded" );
	for ( const e of Array.from( document.body.children )) main.insertBefore( e, null );
	document.body.insertBefore( main, null );
	}

/** Module init code */ initializer.initComponent( init, import.meta.url );
