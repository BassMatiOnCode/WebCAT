// Documentation: /web-cat/tool-buttons/tool-buttons.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;
import * as anchorButton from "../tool-buttons/base-anchor-button-1.js" ;
import { scrollToBottomOfPage } from "../in-page-navigation/in-page-navigation-1.js" ;

/**
 *		init ( )
 *		Adds a navigate sitemap toggle button to the specified toolbar
 *		and loads the associated SVG image.
 */
export function init ( searchparams = new URLSearchParams( ) ) {
	const anchor = anchorButton.appendAnchorButton( "bottom-of-page-button.svg" );
	anchor.addEventListener( "click" , evt => {
		evt.preventDefault( );
		scrollToBottomOfPage( );
		} ) ;
	}

/** Module Init Code */ initializer.initComponent( init, import.meta.url );
