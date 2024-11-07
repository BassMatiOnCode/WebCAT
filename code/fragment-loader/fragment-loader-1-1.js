// Documentation: .../web-cat/fragment-loader/fragment-loader.htm 

import { names as namespaces } from "../xml-namespaces/xml-namespaces-1.js" ;
import * as initializer from "../component-initializer/component-initializer.js" ;

/**
 *		rebaseRelativeAddresses( )
 *		Rebase load-target relative addresses so that they continue 
 *		to work in the context of the host document.
 *	
 */ export function rebaseRelativeAddresses ( buffer, base, addressAttributes = [ "href", "src", "data" ] ) {
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
 *		loadFragments()
 *
 */ 
export function loadFragments( root = document.body ) {
	return new Promise ( resolve => {
		const requestInfos = [ ] ;    // a combination of fragment origin and array of injected elements
		let settledRequests = 0 ;
		function processTree ( treeRoot ) {
			// Loop with forEach because anchor must in in a closure because
			// it will be referenced asynchronously on different threads.
			treeRoot.querySelectorAll( "A[data-load-fragment]" ).forEach ( anchor => {
				if ( anchor.closest( `[data-fragment-origin="${anchor.href}"]` )) {
					// Prevent recursion
					console.error( `Fragment address recursion: ${anchor.href}` );
					return ;
					}
				const requestInfo = requestInfos[ requestInfos.push( { url : anchor.href } ) - 1] ;
				fetch ( anchor.href )
				.then ( response => {
					// Process the server response
					requestInfo.url = response.url ;
					if ( response.ok ) return response.text( );
					else throw response.statusText ;
					} ) 
				.then ( text => { 
					// Inject elements into the document
					// Parse text
					const bufferContent = parse( text, requestInfo.url );
					// Select specified part of the fragment
					const contentSelector = anchor.getAttribute( "data-select" ) ;
					if ( contentSelector ) bufferContent.replaceChildren( bufferContent.querySelectorAll( contentSelector ));
					// Rebase addresses
					rebaseRelativeAddresses ( bufferContent, requestInfo.url );
					// Prevent non-terminating recursions
					const recordOrigin = anchor.getAttribute( "data-record-origin" ) !== "no" ;
					if ( recordOrigin ) for ( const element of bufferContent.children ) element.setAttribute( "data-load-origin", requestInfo.url );
					// Store references to injected root elements
					requestInfo.injectedElements = Array.from( bufferContent.children );
					// Pending injection notification
					anchor.dispatchEvent( new CustomEvent( "fragment-loading", { bubbles: true, cancelable : true , detail: { success : true, content : bufferContent } } ) ) ;
					// Inject content nodes
					anchor.replaceWith( ...bufferContent.childNodes );
					// TODO: success member is superfluous
					anchor.dispatchEvent( new CustomEvent( "fragment-loaded", { bubbles: false, detail: { success : true, content : requestInfo.injectedElements } } ) ) ;
					return requestInfo.injectedElements ;
					} ) 
				.then ( injectedElements => {
					// Recurse into injected elements
					for ( const element of injectedElements ) {
						processTree( element );
						}
					} ) 
				.catch ( statustext => {
					// Inject an error string into the document
					anchor.replaceWith( `<< ${ statustext } (${ requestInfo.url }) >>` );
					} ) 
				.finally ( ( ) => {    
					// Resolve the promise returned by loadFragments( )
					if ( ( settledRequests += 1 ) === requestInfos.length ) resolve( requestInfos ) ;
					} );
				} ) ;
			}
		processTree( root ) ;
		} ) ;
	}
/**
 *		anchorParentClickHandler()
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
	const root = searchparams.get( "root" ) || document.body ;
	loadFragments( root ).then ( ( ) => {
		// Monitor click events on interactive fragment anchors
		for ( const anchor of root.querySelectorAll( "a[data-load-interactive]" )) anchor.parentElement.addEventListener( "click" , anchorParentClickHandler ) ;
		} ) ;
	}
/** Module init code */ initializer.initComponent( init, import.meta.url );
