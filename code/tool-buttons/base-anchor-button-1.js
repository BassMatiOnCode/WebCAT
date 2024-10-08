// Documentation: /web-cat/tool-buttons/tool-buttons.htm#anchor-buttons

/**
 *		appendAnchorButton( )
 *		Creates an anchor element and asynchronously, loads the
 *		associated SVG image and appends the anchor to the specified
 *		toolbar. The image file is usually located in the same folder 
 *		as this script module.
 */
export function appendAnchorButton ( imageFilename, options = { } ) {
	const anchor = document.createElement( "A" );
	if ( options.href ) anchor.href = options.href ;  // assigning an empty string doesn't work here
	fetch ( new URL( `${ import.meta.url }/../${ imageFilename }` ).href )
	.then ( response => response.ok && response.text( ) || " not found " )
	.then ( text => {
		anchor.innerHTML = text ;
		if ( options.postprocess ) options.postprocess( anchor );
		} ) ;
	document.getElementById( options.toolbar || "mainToolbar" ).insertBefore( anchor, null ) ;
	return anchor ;
	}
