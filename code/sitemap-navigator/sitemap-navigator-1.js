// documentation : /web-cat/sitemap-navigator/sitemap-navigator.htm
// TODO: Use the Navigation API instead of anchor click events when it is available in all browsers.

import * as initializer from "../component-initializer/component-initializer-1.js" ;
import * as fragmentLoader from "../fragment-loader/fragment-loader-1.js" ;
import * as collapsibleStructures from "../collapsible-structures/collapsible-structures-1.js" ;

let navigationInfo = { } ;

/**		highlightPath()
 * 
 */ function highlightPath( ) {
	////	Highlight current path in primary sitemap
	console.info( "highlighting path" );
	// Compute the content address without url query string
	const url = new URL( document.getElementById( "mainContent" ).getAttribute( "data-content-address" ) || document.location.href ) ;
	url.search = "" ;
	let entry = findCurrentEntry( url.href );
	if ( ! entry ) {
		loadMissingFragments( url.href );
		entry = findCurrentEntry( url.href );
		if ( ! entry ) return console.error( "Cannot find entry for current document." );
		}
	compileNavigationInfo( entry );
	// Deactivate old path
	const collapse = document.getElementById( "sitemapRoot" ).hasAttribute( "data-collapse-expired-path" );
	for ( const listItem of document.getElementById( "sitemapRoot").querySelectorAll( "[data-active-path]" )) {
		listItem.toggleAttribute( "data-active-path" );
		if ( collapse ) collapsibleStructures.collapse( listItem );
		}
	// Activate new path
	while ( entry ) {
		entry.toggleAttribute( "data-active-path" );
		if ( entry.hasAttribute( "data-collapsible-state" )) collapsibleStructures.expand( entry ) ;
		entry = entry.closest( "UL" );
		if ( entry.classList.contains( "sitemap-tree" )) break;
		entry = entry.closest( "LI" );
		}
	}
/**
 *		findAnchor()
 *		@param {HtmlListItemElement} currentNode
 *
 */ function findAnchor( refNode ) {
	const anchor = refNode.querySelector( "A" )
	}
/**
 *		compileNaviationInfo( )
 *		builds a map of page-related page links
 *		@param {HtmlListItemElement} currentNode 
 *
 */ function compileNavigationInfo( currentNode ) {
	navigationInfo = { };
	// Home, previous and next siblings
	navigationInfo.home = document.getElementById( "sitemapRoot" ).firstElementChild ;
	navigationInfo.previousSibling = currentNode.previousElementSibling ;
	navigationInfo.nextSibling = currentNode.nextElementSibling;
	// Find parent node
	navigationInfo.parentNode = currentNode.parentElement.classList.contains( "sitemap-tree" ) ? null : currentNode.parentNode.parentNode ;
	// First and last siblings
	navigationInfo.firstSibling = navigationInfo?.parentNode.firstElementChild;
	navigationInfo.lastSibling = navigationInfo?.parentNode.lastElementChild;
	// Previous andNext in reading order
	let anchors = Array.from( document.getElementById( "sitemapRoot" ).querySelectorAll( "A" ));
		
	}
/**		
 *		findCurrentEntry()
 * 
 */ function findCurrentEntry( contentAddress ) {
	const anchor = document.getElementById( "sitemapRoot" ).querySelector( `a[href="${contentAddress}"]` );
	if ( anchor ) return anchor.closest( "LI" );
	}
/**		loadMissingFragments()
 * 
 */ function loadMissingFragments ( documentAddress = getContentAddress( )) {
	// Split the document address into a list of folders
	console.info( `Loading sitemap fragments for ${documentAddress}` );
	const folders = new URL( documentAddress + "/.." ).href.split( "/" ).slice( 0, -1 );
	let fragmentAnchor, fragmentAddress = folders.shift( ) + "/" + folders.shift( ) + "/" + folders.shift( ) ;
	// Find the first sitemap fragment anchor in that path
	while ( ! fragmentAnchor && folders.length > 0 ) {
		fragmentAddress += "/" + folders.shift( );
		console.info( "Looking for " + fragmentAddress + "/toc.htm" );
		fragmentAnchor = document.querySelector( `a[data-load-ondemand][href="${fragmentAddress}/toc.htm"]` );
		}
	if ( ! fragmentAnchor ) return console.error( "No sitemap fragment anchor found." );
	// Retrieve all potential sitemap fractions in parallel.
	const requests = [ ] ;
	requests.push( fetch( fragmentAddress + "/toc.htm" ));
	console.info( `Fetching ${fragmentAddress}/toc.htm` );
	// Every folder below in the path might contain another sitemap fragment.
	while ( folders.length > 0 ) {
		fragmentAddress += "/" + folders.shift( );
		requests.push( fetch( fragmentAddress + "/toc.htm" ));
		console.info( `Fetching ${fragmentAddress}/toc.htm` );
		}
	Promise.allSettled( requests ).then ( responses => {
		// Collect the text content for retrieved resources
		// Failed requests are no error, because we have only guessed the URL
		const texts = [ ] ;  
		for ( const response of responses ) texts.push( response.value.ok ? response.value.text( ) : "" );
		Promise.all( texts ).then( texts => { 
			// Inject the text resources in the order of retrieval
			console.log( responses );
			console.log( fragmentAnchor ) ;
			injectFragments( fragmentAnchor, responses, texts ) ;
			} ) ;
		} ) ;
	}
/**		injectFragments( )
 * 
 */ function injectFragments ( fragmentAnchor, responses, textContentArray ) {
	const searchParent = fragmentAnchor.parentElement ;
	// the html parser
	const template = document.createElement( "TEMPLATE" );
	// Process responses
	for ( let i = 0 ; i < responses.length ; i ++ ) {
		if ( ! responses[ i ].value.ok ) continue ;
		// Find the next fragment anchor
		if ( i > 0 ) fragmentAnchor = searchParent.querySelector( `a[data-load-ondemand][href="${responses[ i ].value.url}"]` );
		const text = textContentArray[ i ];
		// Parse
		template.innerHTML = text ;
		// Rebase relative addresses
		fragmentLoader.rebaseRelativeAddresses ( template.content, responses[ i ].value.url );
		//	Determine the list of elements to be injected
		let injectionList = template.content.querySelectorAll( fragmentAnchor.getAttribute( "data-select" ));
		if ( injectionList.length === 0 ) injectionList = Array.from( template.content.childNodes );
		for ( const element of injectionList ) {
			// element nodes only
			if ( element.nodeType !== 1 ) continue ;
			// Store fragment origin address for recursion prevention
			if ( element.setAttribute ) element.setAttribute( "data-load-origin", responses[ i ].value.url );
			}
		//	Notify the fragment anchor that the content will be loaded. 
		fragmentAnchor.dispatchEvent( new CustomEvent( "fragment-loading", { 
			bubbles: true, 
			detail: { success : true, content : injectionList } 
			} ) ) ;
		//	Inject the content into the document.
		// This takes the fragment anchor out of the DOM tree
		fragmentAnchor.replaceWith( ...injectionList );
		console.info( "Content injected from: ", responses[ i ].value.url );
		//	Notify the fragment anchor that the content has been loaded. 
		fragmentAnchor.dispatchEvent( new CustomEvent( "fragment-loaded", { 
			bubbles: false, 
			detail: { success : true, content : injectionList } 
			} ) ) ;
		}
	}
/**
 *		init ( )
 *		Adds event handlers to find the current document and highlight its path.
 *
 */ export function init ( searchparams = new URLSearchParams( ) ) {
	console.info( "initializing sitemap navigator" );
	highlightPath( );  // registering as listerner in not enough
	document.addEventListener( "fragment-loading-complete" , ( ) => highlightPath( )) ;
	if ( searchparams.has( "single-page-environment" )) {
		// Configure single-page environment
		document.getElementById("mainContent" ).setAttribute( "data-content-address" , document.searchparams.get( "content-address" ) || "" );
		// Setup a click event listener to recognize site-navigation events
		document.addEventListener( "click" , evt => { 
			// Bail out if it is not a site navigation event.
			if ( ! evt.target.tagName === "A" || evt.target.origin !== document.location.origin ) return ;
			// Load new content into the MAIN element.
			document.getElementById( "mainContent" ).innerHTML = `<a data-load-fragment data-record-origin="no" href="${evt.target.href}"></a>` ;
			// Setup an event handler to record the content origin in the MAIN element
			document.getElementById( "mainContent" ).firstElementChild.addEventListener( "fragment-loaded" , evt => {
				document.getElementById( "mainContent" ).setAttribute( "content-origin" , evt.target.href );
				} ) ;
			fragmentLoader.loadFragment( document.getElementById( "mainContent" ).firstElementChild );
			// Don't navigate the document
			evt.preventDefault( );
			} ) ;
		}
	if ( searchparams.has( "collapse-expired-path" )) document.getElementById( "sitemapRoot" ).toggleAttribute( "data-collapse-expired-path", "true" );
	// Catch interactive sitemap fragment load clicks
	document.getElementById( "sitemapRoot" ).addEventListener( "click" , evt => { 
		const anchor = evt.target.querySelector( ":scope > [data-load-interactive]" );
		if ( ! anchor ) return ;
		debugger;
		fragmentLoader.loadFragment( anchor );
		evt.preventDefault( );
		evt.stopPropagation( );
		} ) ;
	}
/** Module Init Code */ initializer.initComponent( init, import.meta.url );
	