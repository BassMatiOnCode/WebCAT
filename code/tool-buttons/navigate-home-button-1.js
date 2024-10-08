// Documentation: /web-cat/tool-buttons/tool-buttons.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;
import * as siteNavigationButton from "../tool-buttons/base-site-navigation-button-1.js" ;

/**
 *		init( )
 *		Appends a anchor element to the specified toolbar and loads the
 *		associated SVG image.
 */
export function init ( searchparams = new URLSearchParams( ) ) {
	siteNavigationButton.appendAnchorButton ( "navigate-home-button.svg" , 
		{ href : "/index.htm" } ) ;
	}

// Module Init Code
//
initializer.initComponent( init, import.meta.url );
