// fragment-loader.js

import { namespaces } from "../utility/xml-namespaces/xml-namespaces-1.js" ;
import * as initializer from "../component-initializer/component-initializer.js" ;

export async function loadFragments( root = document.body ) {
	// Loads all HTML fragments and injects them into the root container.
	//	root : The HTML container element that contains fragments to load.
	//	Returns a Promise that settles when all load jobs have settled.
	const jobs = [ ] ;
	root.querySelectorAll( "A[data-load-fragment]" ).forEach( anchor => {
		jobs.push( loadFragment( anchor ));
		} ) ;
	return Promise.allSettled( jobs );
	}
export async function loadFragment( anchor ) {
	//	Loads the HTML fragment referenced by the anchor element.
	//	Includes nested fragments.
	//	anchor : An HTML A element with a data-load-fragment attribute
	//	Returns a Promise that fulfills when the HTML fragment have
	// been injected, or undefined if a recursion error occurs.
		// Prevent recursion
	if ( anchor.closest( `[data-fragment-origin="${ anchor.href }"]` )) { 
		console.error( `Fragment address recursion: ${ anchor.href }` ) ; 
		return ;
		}
	return fetch( anchor.href )
	.then ( response => { 
		if ( response.ok ) return response.text( ) ; 
		else return response.statusText;  
		} )
	.then ( text => { 
		let buffer = createBuffer( text, anchor.href );
		if ( anchor.hasAttribute( "data-select" )) buffer.replaceChildren( ...buffer.querySelectorAll( anchor.getAttribute( "data-select" )));
		rebaseUrls( buffer, achor.href );
		for ( const element of content.children ) element.setAttribute( "data-load-origin", url );
		await loadFragments( buffer );
		anchor.replaceWith( ...buffer.childNodes );
		} );
	}
export function createBuffer( text, origin ) {
	//	Creates a buffer with a suitable type (G, MROW or TEMPLATE element
	//	according to the filename extension) and fills the text in. 
	//	Returns a buffer (G, MROW or DocumentFragment with an HTML object structure.
	let buffer ;
	if ( origin.endsWith( ".svg" )) buffer = document.createElementNS( namespaces.svg , "G" ) ;
	else if ( origin.endsWith( ".math.htm" )) buffer = document.createElementNS( namespaces.mathml , "MROW" ) ;
	else buffer = document.createElement( "TEMPLATE" ) ; 
	buffer.innerHTML = text ;
	return buffer.content || buffer;
	}
export function rebaseUrls ( buffer, base, addressAttributes = [ "href", "src", "data" ] ) {
	for ( const addressAttribute of addressAttributes ) {
		for ( const element of buffer.querySelectorAll( `[${addressAttribute}]` )){
			// Skip elements that have host document relative addresses
			if ( element.hasAttribute( "data-host-relative" )) continue;
			//	Translate target-document relative address to absolute address based on the fragment location.
			element.setAttribute( addressAttribute,  new URL( element.getAttribute( addressAttribute ), base ).href );
			}
		}
	 }
