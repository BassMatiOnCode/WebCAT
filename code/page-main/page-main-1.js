// Documentation: .../webcat/page-main/page-main.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;

/**
*		init ( )
*		Wraps the entire body content in a MAIN container.
*
*/ export function init ( searchparams = new URLSearchParams( )) {
	const main = document.getElementsByTagName( "MAIN" )[ 0 ] || document.createElement( "MAIN" );
	main.id = "mainContent" ;
	// TODO: Is collapsible-structure still necessary?
	main.classList.add( "collapsible-structure" );  // root element for collapsible chapters
	main.setAttribute( "data-collapsible-default", searchparams.get("collapsible-default") || "expanded" );
	// Move body elements to MAIN
	main.append( ...document.body.childNodes );
	document.body.insertBefore( main, null );
	}

// * * * Module init code * * * // 

initializer.initComponent( init, import.meta.url );
