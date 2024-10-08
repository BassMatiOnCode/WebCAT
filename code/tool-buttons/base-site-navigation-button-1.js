// Documentation: /web-cat/tool-buttons/tool-buttons.htm#site-navigation-buttons

import * as anchorButton from "../tool-buttons/base-anchor-button-1.js" ;

/**
 *		createAnchorButton( )
 *		Creates a site navigation button, loads the
 *		associated SVG image and retrieves the associated URL.
 */

const settings = { } ;

export function appendAnchorButton ( imageFilename, addressName ) {
	// Create anchor and append it to specified toolbar
	const anchor = anchorButton.appendAnchorButton( imageFilename ) ;
	// Retrieve the url related to this button and set the anchor's href attribute.
	// TODO: Implement the option have a disabled anchor if there is 
	// no address for this button.
	const eventDetails = { name : addressName } ;
	document.dispatchEvent( new CustomEvent( "SiteNavigationAddressQuery" , {
		bubbles : false ,
		details : eventDetails 
		} ) ) ;
	if ( eventDetails.url ) anchor.href = eventDetails.url ;  // url is valid
	else if ( eventDetails.url === "" ) settings.removeUnused && anchor.remove( );  // no url
	else document.addEventListener( "SiteNavigationInfoUpdate" , evt => {
		const url = evt.detail.urls[ addressName ] ;
		if ( ! url ) settings.removeUnused && anchor.remove( ); 
		else anchor.href = url ;
		} ) ;
	return anchor ;
	}

// Module Init Code
//
// Retrieve configuration values
settings.removeUnusedAnchors = new URL( import.meta.url ).searchParams.has( "removeUnused" );
