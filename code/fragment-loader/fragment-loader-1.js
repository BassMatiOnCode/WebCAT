// Documentation: .../webcat/fragment-loader/fragment-loader.htm 

import { namespaces } from "../utility/xml-namespaces/xml-namespaces-1.js" ;
import * as initializer from "../component-initializer/component-initializer.js" ;

/**
 *		rebaseUrls( )
 *		Rebase load-target relative addresses so that they continue 
 *		to work in the context of the host document.
 *	
 */ export function rebaseUrls ( buffer, base, addressAttributes = [ "href", "src", "data" ] ) {
	for ( const addressAttribute of addressAttributes ) {
		for ( const element of buffer.querySelectorAll( `[${addressAttribute}]` )){
			// Skip elements that have host document relative addresses
			if ( element.hasAttribute( "data-host-relative" )) continue;
			//	Translate target-document relative address to absolute address based on the fragment location.
			element.setAttribute( addressAttribute,  new URL( element.getAttribute( addressAttribute ), base ).href );
			}
		}
	 }
/**
 *		parse()
 *
 */ export function parse( text, origin ) {
	let buffer ;
	if ( origin.endsWith( ".svg" )) buffer = document.createElementNS( namespaces.svg , "G" ) ;
	else if ( origin.endsWith( ".math.htm" )) buffer = document.createElementNS( namespaces.mathml , "MROW" ) ;
	else buffer = document.createElement( "TEMPLATE" ) ; 
	buffer.innerHTML = text ;
	return buffer.content || buffer;
	}
/**
 *		fetchFragment ( )
 *		Fetches and parses the specified document fragment and selects the requested elements
 *		@return {Promise<DocumentFragment|MTRElement|SVGGroupElement>} An content container element
 *
 */ export function fetchFragment ( url, contentSelector="", recordOrigin=true ) {
	console.debug( "Fetching " + url );
	return fetch ( url )
	.then ( response => {
		// Process the server response
		if ( response.ok ) return response.text( );
		else throw response.statusText ;
		} ) 
	.then ( text => { 
		// Parse text and return selected elements for injection
		const content = parse( text, url );
		if ( contentSelector ) content.replaceChildren( ...content.querySelectorAll( contentSelector ));
		rebaseUrls ( content, url );
		if ( recordOrigin ) for ( const element of content.children ) element.setAttribute( "data-load-origin", url );
		return content ;
		} ) ;  // no catch statement here because the browser noted the missing file already. 
	}
/**
 *		injectFragment ( )
 *
 */ function injectFragment( content , anchor ) {
	console.debug( "Injecting", content.childNodes.length, "nodes", content.children.length, "elements" );
	// Pending injection notification
	// TODO: Rename fragment-loading to fragment-loaded
	// TODO: Rename detail.content to detail.nodes
	anchor.dispatchEvent( new CustomEvent( "fragment-loading", { bubbles: true, cancelable : true , detail: { content : content } } ) ) ;
	// Inject content nodes
	const injectedElements = Array.from( content.children );
	anchor.replaceWith( ...content.childNodes );
	// TODO: Rename detail.content to detail.elements
	// TODO: Rename fragment-loaded to fragment-injected
	anchor.dispatchEvent( new CustomEvent( "fragment-loaded", { detail: { content : injectedElements } } ) ) ;
	return injectedElements ;
	}
/**
 *		loadFragments ( )
 *
 */ export function loadFragments( root = document.body ) {
	return new Promise ( resolve => {
		const requestInfos = [ ] ;    // a combination of fragment origin and array of injected elements
		let settledRequests = 0 ;
		function processTree ( treeRoot ) {
			// Loop with forEach because anchor must in in a closure because
			// it will be referenced asynchronously on different threads.
			treeRoot.querySelectorAll( "A[data-load-fragment]" ).forEach( anchor => {
				// Prevent recursion
				if ( anchor.closest( `[data-fragment-origin="${anchor.href}"]` )) { console.error( `Fragment address recursion: ${anchor.href}` ) ; return }
				const requestInfo = requestInfos[ requestInfos.push( { url : anchor.href } ) - 1] ;
				fetchFragment ( anchor.href, anchor.getAttribute( "data-select" ), anchor.getAttribute( "recordOrigin" ) !== "no" )
				.then ( content => {  
					requestInfo.injectedElements = injectFragment( content, anchor );
					for ( const element of requestInfo.injectedElements ) processTree( element );  // recurse into fragment
					return requestInfo.injectedElements ;
					} ) 
				.catch ( statustext => {
					anchor.innerText = ( `<< ${ statustext } (${ requestInfo.url }) >>` );
					} ) 
				.finally ( ( ) => {    
					console.debug( "Requests pending:", requestInfos.length - settledRequests - 1 );
					if ( ++ settledRequests === requestInfos.length ) {
						document.dispatchEvent( new CustomEvent( "fragment-loading-complete" , { options : { anchor : anchor } } ) ) ;
						resolve( requestInfos ) ; // resolve outermost promise
						}
					} );
				} ) ;
			}
		processTree( root ) ;
		} ) ;
	}
/**		
 *		loadSitemapFragments()
 * 
 */ export function loadSitemapFragments ( url = new URL( document.location.origin + document.location.pathname + "/../" ), fragmentName = "toc.htm" ) {
	// Split the document address into a list of folders
	console.info( `Loading sitemap fragments for ${ url.pathname }` );
	const urls = [ ] ;
	let rootAnchor ;
	while ( true ) {
		const fragmentUrl = url.href + fragmentName ;
		urls.push( fragmentUrl );
		if ( document.querySelector( `A[data-load-interactive][href="${ fragmentUrl }"]` )) break;
		if ( url.href === document.location.origin + "/" ) return console.error( "No sitemap fragment chain head anchor found." );   // error exit
		url = new URL( url.href + "../" );  // ascend to parent node
		}
	const requests = [ ] ;
	for ( const url of urls ) requests.push( fetchFragment( url ));
	return Promise.allSettled( requests ).then ( results => {
		const summary = [ ] ;
		for ( let i = results.length - 1 ; i >= 0 ; i -= 1 ) {
			if ( ! results[ i ].value ) continue ;  // ignore failed request, this is normal.
			summary.push( { 
				url : urls[ i ] ,
				injectedElements : injectFragment( results[ i ].value , document.querySelector( `A[href="${ urls[ i ] }"]` ))
				} ) ;
			}
		return summary ;   // fulfillment value
		} ) ;
	}
/**
 *		anchorParentClickHandler()
 *		Catches clicks on the parent of interactive fragment anchors and loads the fragment.
 *
 */ export function anchorParentClickHandler( evt ) {
	console.info( "anchorParentClickHandler()" );
	// Prevent fragment loading if window is navigated to another page
	// TODO: Documentation change
	if ( evt.target.tagName !== "A" 
	|| document.location.hostname === evt.target.href.hostname
	&& document.body.classList.contains( "single-page-environment" )
	&& ! evt.targt.classList.contains( "leave-single-page-environment" )) {
		// Load the fragment
		const anchor = evt.target.querySelector( "a[data-load-interactive]" );
		evt.target.removeEventListener( "click" , anchorParentClickHandler );
		loadFragment( anchor );
		}
	}
/**
 *		init()
 *		Finds fragment link anchors and load the related resources.
 *
 */ export function init ( searchparams = new URLSearchParams( )) {
	const root = document.getElementById( searchparams.get( "root" )) || document.body ;
	for ( const anchor of document.querySelectorAll( "A[data-load-interactive]" )) {
		anchor.setAttribute( "href", anchor.href );
		}
	loadFragments( root ).then ( ( ) => {
		// Monitor click events on interactive fragment anchors
		for ( const anchor of root.querySelectorAll( "a[data-load-interactive]" )) anchor.parentElement.addEventListener( "click" , anchorParentClickHandler ) ;
		} ) ;
	}
/** Module init code */ initializer.initComponent( init, import.meta.url );
