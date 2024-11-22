// Documentation: /webcat/tool-buttons/tool-buttons.htm#site-navigation-buttons

import * as anchorButton from "../tool-buttons/base-anchor-button-1.js" ;

const settings = { } ;

/**
 *		appendAnchorButton( )
 *		Creates a site navigation button, loads the
 *		associated SVG image and retrieves the associated URL.
 */
export function appendAnchorButton ( addressName, imageFilename ) {
	if ( ! imageFilename ) imageFilename = "navigate-" +  addressName + "-button.svg" ;
	// Create anchor and append it to specified toolbar
	const anchor = anchorButton.appendAnchorButton( imageFilename ) ;
	anchor.classList.add( "site-navigation" );
	anchor.setAttribute( "name", `navigate-${addressName}` );
	// Retrieve the url related to this button and set the anchor's href attribute.
	// TODO: Implement the option have a disabled anchor if there is 
	//		no address for this button.
	// TODO: Swap imageFilename and addressName parameters and infer 
	//		the imageFilename from addressName.
	/*
	const eventDetails = { name : addressName } ;
	document.dispatchEvent( new CustomEvent( "SiteNavigationAddressQuery" , {
		bubbles : false ,
		details : eventDetails 
		} ) ) ;
	if ( eventDetails.url ) anchor.href = eventDetails.url ;  // url is valid
	else if ( eventDetails.url === "" ) settings.removeUnused && anchor.remove( );  // no url
	else */
	document.addEventListener( "navigation-info-update" , evt => {
		const fieldName = addressName.replace(/-./g, s => s[ 1 ].toUpperCase());
		const element = evt.detail.navigationInfo[ fieldName ] ;
		if ( element && element.tagName === "A" ) {  // a valid site link
			anchor.setAttribute( "href", element.href ) ;  // this should expand the anchor
			anchor.firstElementChild.setAttribute( "title" , element.closest( "LI" ).textContent );
			}
		if ( ! element || element.tagName === "LI" ) {  // node has no document
			anchor.removeAttribute( "href" );  // this should collapse the anchor
			anchor.firstElementChild.removeAttribute( "title" );
			}
		} ) ;
	return anchor ;
	}

// Module Init Code
//
// Retrieve configuration values
settings.removeUnusedAnchors = new URL( import.meta.url ).searchParams.has( "removeUnused" );
