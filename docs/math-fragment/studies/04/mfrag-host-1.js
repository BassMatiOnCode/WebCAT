// Loads the math fragment passed in the module URL into the BODY

import { initDocument as prepareNumberedEquations } from "/inc/webcat/numbered-equation/numbered-equation-2.js"

export function initContent ( 
	// Initializes a math fragment a) in an MFRAG-CONTAINER or b) in the BODY of 
	// a math-fragment host document.
	container,						// { HTMLElement } Receives the math fragment content
	fragmentUrl,					// { URL } Address of the math fragment
	hostDocumentUrl		// { URL } Address of the stand-alone fragment host document
			// host document in case the function was called from mfrag-container.js,
			// otherwise undefined.
	)	{
	if ( hostDocumentUrl ) hostDocumentUrl.searchParams.set( "fragment-url" , fragmentUrl );
	fetch ( fragmentUrl )
	.then ( response => response.ok ? response.text( ) : "not found" )
	.then ( text =>{
		// Parse html code
		const template = document.createElement( "TEMPLATE" );
		template.innerHTML = text ;
		// Decorate heading with fragment ID anchor
		const heading = template.content.querySelector( "H1" );
		let anchor = heading.querySelector( "A:first-child" );
		if ( ! anchor ) {
			heading.prepend( document.createTextNode( " " ));
			anchor = document.createElement( "A" );
			anchor.setAttribute( "href" , "#" );  // make it unusable for simple clicks
			heading.prepend( anchor );
			}
		anchor.textContent = fragmentUrl.href.split( "/" ).pop( ).split( "=" ).shift( );
		// Convert relative links so that they remain valid in other documents
		for ( const anchor of template.content.querySelectorAll( "A" )) 
			anchor.href = ( new URL( anchor.href, fragmentUrl )).href ;
		container.append( template.content );
		// Anchor click event handler
		anchor.addEventListener( "click" , evt => {
			if ( ! evt.altKey ) return ;  // standard anchor click behavior
			evt.preventDefault( );
			evt.stopPropagation( );
			openSeparateWindow( evt , fragmentUrl, hostDocumentUrl );
			} );
		} ) ;
	}
export function openSeparateWindow ( 
	// Open the math-fragment in a new tab or in a separate window.
	evt ,
	hostDocumentUrl
	 )	{
	let target = "" ;
	let options = "" ;
	if ( ! evt.shiftKey ) hostDocumentUrl.searchParams.delete( "resize" );
	else {		// open in new popup window
		hostDocumentUrl.searchParams.set( "resize" , "true" );  // fit content
		target = "math-fragment-popup" ;
		options = "width=400,height=300" ;
		}
	window.open( hostDocumentUrl, target, options );
	}
console.log( "mfrag-host.js module initializing" );
const searchParams = ( new URL ( document.location.href )).searchParams ;
if ( searchParams.has( "fragment-url" )) initContent ( document.body, new URL( searchParams.get( "fragment-url" )));