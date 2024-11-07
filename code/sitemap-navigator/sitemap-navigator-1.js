// documentation : /web-cat/sitemap-navigator/sitemap-navigator.htm
// TODO: Use the Navigation API instead of anchor click events when it is available in all browsers.

import * as initializer from "../component-initializer/component-initializer-1.js" ;
import * as fragmentLoader from "../fragment-loader/fragment-loader-1.js" ;
import * as collapsibleStructures from "../collapsible-structures/collapsible-structures-1.js" ;

let navigationInfo = { } ;  // carries link anchors related to the current document

/**		
 *		findCurrentEntry()
 * 
 */ function findCurrentEntry( contentAddress ) {
	const root = document.getElementById( "sitemapRoot" );
	// Try pathname without query string and with and without hash
	const anchor = root.querySelector( `a[href="${contentAddress.origin}${contentAddress.pathname}${contentAddress.hash}"]` ) || root.querySelector( `a[href="${contentAddress.origin}${contentAddress.pathname}"]` );
	if ( anchor ) return anchor.closest( "LI" );
	}
/**		
 *		highlightPath()
 * 
 */ function highlightPath( ) {
	////	Highlight current path in primary sitemap
	console.info( "highlighting path" );
	// Compute the content address without url query string
	const url = new URL( document.getElementById( "mainContent" ).getAttribute( "data-content-address" ) || document.location.href ) ;
	url.search = "" ;
	let entry = findCurrentEntry( url );
	if ( ! entry ) {
		loadMissingFragments( url.href );
		entry = findCurrentEntry( url );
		if ( ! entry ) return console.error( "Cannot find entry for current document." );
		}
	compileNavigationInfo( entry );
	// Deactivate old path
	const collapse = document.getElementById( "sitemapRoot" ).hasAttribute( "data-collapse-expired-path" );
	for ( const listItem of document.getElementById( "sitemapRoot").querySelectorAll( ".active" )) {
		listItem.classList.remove( "active" );
		if ( collapse ) collapsibleStructures.collapse( listItem );
		}
	// Activate new path
	while ( entry ) {
		entry.classList.add( "active" );
		if ( entry.hasAttribute( "data-collapsible-state" )) collapsibleStructures.expand( entry ) ;
		entry = entry.closest( "UL" );
		if ( entry.classList.contains( "sitemap-tree" )) break;
		entry = entry.closest( "LI" );
		}
	}
/**
 *		findContentAnchor()
 *		@param {HtmlListItemElement} node
 *
 */ export function findContentAnchor( node ) {
	const anchor = node?.querySelector( ":scope > A" );
	return anchor?.hasAttribute( "data-load-interactive" ) ? null : anchor ;
	}
/**
 *		findNode()
 *		@param {HtmlAnchorElement} anchor
 *
 */ export function findNode( anchor ) {
	return anchor.closest( "LI" );
	}
/**
 *		compileNaviationInfo( )
 *		Builds a map of page-related page links
 *		@param {HtmlListItemElement} currentNode
 *		References module.navigationInfo
 *
 */ function compileNavigationInfo( currentNode ) {
	navigationInfo = { };
	// previous and next siblings
	navigationInfo.previousSibling = findContentAnchor( currentNode.previousElementSibling );
	navigationInfo.nextSibling = findContentAnchor( currentNode.nextElementSibling );
	// First and last siblings
	let parent = currentNode.parentElement;  // UL
	if ( parent.classList.contains( "sitemap-tree" )) parent = null ;
	navigationInfo.firstSibling = findContentAnchor( parent?.firstElementChild );
	navigationInfo.lastSibling = findContentAnchor( parent?.lastElementChild );
	// Compile chain of parents nodes
	navigationInfo.parentNodes = [ ];
	while ( parent ) {
		if ( parent.classList.contains( "sitemap-tree" )) break;  // sitemap root reached
		parent = parent.parentElement ;  // LI
		navigationInfo.parentNodes.unshift( findContentAnchor( parent ) || parent );  // A or LI
		parent = parent.parentElement ;  // UL
		}
	// Next parent
	navigationInfo.parent = navigationInfo.parentNodes[ navigationInfo.parentNodes.length - 1 ];
	// Previous andNext in sequence
	const anchors = Array.from( document.getElementById( "sitemapRoot" ).querySelectorAll( "A" ));
	const currentIndex = anchors.indexOf( findContentAnchor( currentNode ));
	navigationInfo.backSequential = anchors[ currentIndex - 1 ];
	navigationInfo.forwardSequential = anchors[ currentIndex + 1 ];
	// Home
	navigationInfo.home = anchors[ 0 ] ;
	// Dispatch navigation-info-change event
	const event = new CustomEvent( "navigation-info-update" , { detail : { navigationInfo : navigationInfo } } ) ;
	document.dispatchEvent( event );
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
		fragmentAnchor = document.querySelector( `a[data-load-interactive][href="${fragmentAddress}/toc.htm"]` );
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
		if ( i > 0 ) fragmentAnchor = searchParent.querySelector( `a[data-load-interactive][href="${responses[ i ].value.url}"]` );
		const text = textContentArray[ i ];
		// Parse
		template.innerHTML = text ;
		// Rebase relative addresses
		fragmentLoader.rebaseRelativeAddresses ( template.content, responses[ i ].value.url );
		//	Determine the list of elements to be injected
		// TODO: Select only if there is a selector attribute
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
		// TODO: success and bubbles members are superfluous.
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
	