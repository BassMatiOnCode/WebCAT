// Documentation: /web-cat/fragment-loader/fragment-loader.htm
//	Ideas
//	Drop the fragment loading complete? 
//	Dispatch fragment-loading-complete to container element?
//	Fragment loaded event dispatched to each root element in a fragment after injection into the document.
import * as initializer from "../component-initializer/component-initializer.js" ;

// TODO: Think about anchor element decoration. A classname beginning with "fragment" should be better than an a data-load-fragment attribute.

/** Tracks the number of fragments being loaded */ let counter = 0 ;

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
 * Loads HTML/MathML/SVG/plain text fragments into the current document.
 * The element anchor stores the target address in the href attribute and 
 * is replaced by the injected code.
 * @param {HTMLElement} anchor - reference to the fragment link (A) element
 * @returns {Promise} - the promise used to fetch the resource text.
 */ export async function loadFragment ( anchor ) {
		// Store the load address
		const fragmentAddress = anchor.href ;
		// Prevent recursion
		if ( anchor.closest( `[data-load-origin="${fragmentAddress}"]` )) 
			return console.error( `Fragment address recursion: ${fragmentAddress}` );
		//	Setup content construction structures
		let buffer, bufferContent ;
		switch ( anchor.getAttribute( "data-load-namespace" )) {
		case "http://www.w3.org/1998/Math/MathML" :
			buffer = bufferContent = document.createElementNS( "http://www.w3.org/1998/Math/MathML", "mrow" ) ;
			break ;
		case "http://www.w3.org/2000/svg" :
			buffer = bufferContent = document.createElementNS( "http://www.w3.org/2000/svg", "g" ) ;
			break ;
		default :
			buffer = document.createElement( "template" ) ; 
			bufferContent = buffer.content ;
			break;
			}
		//	Fetch fragment into buffer
		counter += 1;
		console.info( "Loading: ", fragmentAddress );
		const promise = fetch( fragmentAddress ).then ( response => response.text( ));
		buffer.innerHTML = await promise ;
		rebaseRelativeAddresses ( bufferContent, fragmentAddress );
		//	Process the list of elements to be injected.
		const fragment = new DocumentFragment( );
		fragment.append (...( anchor.hasAttribute( "data-select" ) ? bufferContent.querySelectorAll( anchor.getAttribute( "data-select" )) : bufferContent.childNodes )) ;
		// mainContent doesn't need recursion prevention.
		const recordOrigin = anchor.getAttribute( "data-record-origin" ) !== "no" ;
		for ( const element of fragment.children ) {
			// Store fragment origin address for recursion prevention
			// Note: Text nodes cannot have attributes...
			if ( recordOrigin && element.setAttribute ) element.setAttribute( "data-load-origin", fragmentAddress );
			}
		// Load nested fragments recursively
		for ( const anchor of fragment.querySelectorAll( "[data-load-fragment]" )) loadFragment( anchor );
		//	Notify the fragment anchor that the content will be loaded.
		// TODO: success member is superfluous
		anchor.dispatchEvent( new CustomEvent( "fragment-loading", { bubbles: true, detail: { success : true, content : fragment } } ) ) ;
		//	Create an array of references to the elements to be injected before the fragment is injected (which will deplete its children list unless the clone flag was given.
		const injectionList = Array.from ( fragment.childNodes );
		anchor.replaceWith( ...fragment.childNodes );
		console.info( "Content injected from: ", fragmentAddress );
		// NOTE that the fragment anchor has been taken out of the DOM tree at this point!
		//	Notify the fragment anchor that the content has been loaded. 
		// TODO: success member is superfluous
		anchor.dispatchEvent( new CustomEvent( "fragment-loaded", { bubbles: false, detail: { success : true, content : injectionList } } ) ) ;
		//	Update tracking counter and dispatch "fragment-loading-completed" event
		counter -= 1;
		if ( counter === 0 ) document.dispatchEvent( new CustomEvent( "fragment-loading-complete", { detail : { success : true } } ) );
		return promise;
		} ;
/**
 *		loadFragmentInteractive()
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
 * Loads HTML/MathML/SVG/plain text fragments into the current document.
 * The element e stores the target address in the href attribute and 
 * is replaced by the injected code.
 * @param {HTMLElement} e - reference to the fragment link (A) element
 * @returns {Promise} - the promise used to fetch the resource text.
 * 
 */ export function loadFragments ( container = document ) {
	console.log( "loadFragments()" );
	////	Processes child elements which have a data-load-fragment attribute
	for ( const o of container.querySelectorAll( '[data-load-fragment]' )) loadFragment( o );
	if ( counter === 0 ) document.dispatchEvent( new CustomEvent( "fragment-loading-complete", { detail : { success : true } } ) );
	}
/**
 *		init()
 *		Finds fragment link anchors and load the related resources.
 *
 */ export function init ( searchparams = new URLSearchParams( )) {
	const root = searchparams.get( "root" ) || undefined ;
	loadFragments ( root );
	for ( const anchor of (root || document.body).querySelectorAll( "a[data-load-interactive]" )) {
		anchor.parentElement.addEventListener( "click" , anchorParentClickHandler ) ;
		}
	}
/** Module init code */ initializer.initComponent( init, import.meta.url );
