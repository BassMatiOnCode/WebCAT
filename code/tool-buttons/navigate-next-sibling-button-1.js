// Documentation: /webcat/tool-buttons/tool-buttons.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;
import { appendAnchorButton } from "../tool-buttons/site-navigation-button-base-1.js" ;

/**
 *		init( )
 *		Appends a anchor element to the specified toolbar and loads the
 *		associated SVG image.
 */ export function init ( searchparams = new URLSearchParams( ) ) {
	if ( ! searchparams.has( "toolbar" )) searchparams.append( "toolbar" , "mainToolbar" );
	const anchor = appendAnchorButton( "next-sibling" ) ;
	}

/** Module Init Code */ initializer.initComponent( init, import.meta.url );
