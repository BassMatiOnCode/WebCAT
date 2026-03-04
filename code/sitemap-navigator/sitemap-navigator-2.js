// Documentation : /webcat/sitemap-navigator/sitemap-navigator.htm
//	2025-10-07 usp Switched to fragment-loader-2

// TODO: Use the Navigation API instead of anchor click events when it is available in all browsers.
// TODO: Decide whether LI elements go into navigation info or only A elements

import * as initializer from "../component-initializer/component-initializer.js" ;
import * as fragmentLoader from "../fragment-loader/fragment-loader-2.js" ;
import * as collapsibleStructures from "../collapsible-structures/collapsible-structures.js" ;  // imports

/**	module configuration
 *		@typedef {object} configuration
 *		@property {boolean} homeIsFirstLink
 *		@property {boolean} removeRedundants - Remove redundant nodes from navigation info
 */ export const configuration = { } ;
/**
 *		@typedef {HTMLAnchorElement|HTMLLIElement} NavigationInfoEntry
 *		Holds anchors or list items that are related to the current document.
 *		@typedef {object} navigationInfo
 *		@property {NavigationInfoEntry} home
 *		@property {NavigationInfoEntry} firstSibling
 *		@property {NavigationInfoEntry} previousSibling
 *		@property {NavigationInfoEntry} backSequential
 *		@property {NavigationInfoEntry} currentNode
 *		@property {NavigationInfoEntry} forwardSequential
 *		@property {NavigationInfoEntry} nextSibling
 *		@property {NavigationInfoEntry} lastSibling
 *		@property {NavigationInfoEntry} parent - Parent nodes, excluding root
 *		@property {NavigationInfoEntry} parentNodes
 */ let navigationInfo = { } ;

/**
*		getAbstract ( )
*		@param {string|HTMLElement} pageSpecifier - Page URI or anchor that references the page
*
*/	export function getAbstract ( pageSpecifier ) {
	if ( typeof pageSpecifier === "string" ) pageSpecifier = findCurrentAnchor( pageSpecifier );
	else if ( pageSpecifier.tagName === "A" ) pageSpecifier = pageSpecifier.closest( "LI" );
	return pageSpecifier?.querySelector( "meta[name='abstract']" )?.getAttribute( "description" );
	}
/**
*		loadAbstracts( )
*
*/	function loadAbstracts( ) {
	for ( const meta of sitemapRoot.querySelectorAll( "meta[name='abstract'][href]" )) ( function( meta ) { 
		fetch ( meta.getAttribute( "href" ))
		.then( response => response.ok ? response.text( ) : response.statusText )
		.then( text => meta.setAttribute( "description", text )) ;
		} ) ( meta ) ;
	}
/**		
 *		findCurrentAnchor()
 * 
 */ function findCurrentAnchor( contentAddress ) {
	const root = document.getElementById( "sitemapRoot" );
	// Try pathname without query string and with and without hash
	const anchor = root.querySelector( `a[href="${contentAddress.origin}${contentAddress.pathname}${contentAddress.hash}"]` ) || root.querySelector( `a[href="${contentAddress.origin}${contentAddress.pathname}"]` );
	return anchor ;
//	if ( anchor ) return anchor.closest( "LI" );
	}
/**		
 *		highlightPath()
 * 
 */ function highlightPath( ) {
	////	Highlight current path in primary sitemap
	console.info( "highlighting path" );
	// Compute the content address without url query string
	debugger;
	// const url = document.location.origin + document.location.pathname;
	for ( const anchor of navigationPanel.querySelectorAll( `[href*="${ document.location.pathname }"]` )) {
		console.log( anchor.href );
		}
	// const url = new URL( document.getElementById( "mainContent" ).getAttribute( "data-content-address" ) || document.location.href ) ;
	// ??? url.search = "" ;
	// ??? let anchor = findCurrentAnchor( url );
	// ??? if ( ! anchor ) {
		// ??? fragmentLoader.loadSitemapFragments ( url );
		// ??? anchor = findCurrentAnchor( url );
		// ??? if ( ! anchor ) return console.error( "Cannot find anchor for current document." );
		// ??? }
	// Deactivate old path
	const collapse = document.getElementById( "sitemapRoot" ).hasAttribute( "data-collapse-expired-path" );
	for ( const listItem of document.getElementById( "sitemapRoot").querySelectorAll( ".active" )) {
		listItem.classList.remove( "active" );
		if ( collapse ) collapsibleStructures.collapse( listItem );
		}
	// ??? compileNavigationInfo( anchor );
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
 *		@param {HtmlAnchorElement} anchor
 *		References module.navigationInfo
 *
 */ function compileNavigationInfo( anchor ) {
	navigationInfo = { parentNodes : [ anchor ] };
	// previous and next siblings
	const currentNode = anchor.closest( "LI" );
	currentNode.classList.add( "active" );
	if ( currentNode.hasAttribute( "data-collapsible-state" )) collapsibleStructures.expand( currentNode ) ;
	navigationInfo.previousSibling = findContentAnchor( currentNode.previousElementSibling );
	navigationInfo.nextSibling = findContentAnchor( currentNode.nextElementSibling );
	// First and last siblings
	let parent = currentNode.parentElement;  // UL
	if ( parent.classList.contains( "sitemap-tree" )) parent = null ;
	navigationInfo.firstSibling = findContentAnchor( parent?.firstElementChild );
	navigationInfo.lastSibling = findContentAnchor( parent?.lastElementChild );
	// Compile chain of parents nodes
	while ( parent ) {  // UL
		if ( parent.classList.contains( "sitemap-tree" )) break;  // sitemap root reached
		parent = parent.parentElement ;  // LI
		parent.classList.add( "active" );
		if ( parent.hasAttribute( "data-collapsible-state" )) collapsibleStructures.expand( parent ) ;
		navigationInfo.parentNodes.unshift( findContentAnchor( parent ) || parent );  // A or LI
		parent = parent.parentElement ;  // UL
		}
	// Previous andNext in sequence
	const anchors = Array.from( document.getElementById( "sitemapRoot" ).querySelectorAll( "A" ));
	const currentIndex = anchors.indexOf( findContentAnchor( currentNode ));
	navigationInfo.backSequential = anchors[ currentIndex - 1 ];
	navigationInfo.forwardSequential = anchors[ currentIndex + 1 ];
	// Remove redundants
	if ( configuration.removeRedundants ) {
		if ( navigationInfo.firstSibling === navigationInfo.previousSibling ) delete navigationInfo.firstSibling ;
		if ( navigationInfo.lastSibling === navigationInfo.nextSibling ) delete navigationInfo.lastSibling ;
		if ( navigationInfo.previousSibling === navigationInfo.backSequential ) delete navigationInfo.previousSibling ;
		if ( navigationInfo.nextSibling === navigationInfo.forwardSequential ) delete navigationInfo.nextSibling ;
		}
	// Add home to parent nodes
	if ( configuration.homeIsFirstLink ) navigationInfo.parentNodes.unshift( anchors[ 0 ] );
	// Provide members for specific parent nodes to allow buttons to address them with names
	navigationInfo.home = navigationInfo.parentNodes[ 0 ];
	navigationInfo.current = navigationInfo.parentNodes[ navigationInfo.parentNodes.length - 1 ]; 
	navigationInfo.parent = navigationInfo.parentNodes[ navigationInfo.parentNodes.length - 2 ];
	
	// Dispatch navigation-info-change event
	const event = new CustomEvent( "navigation-info-update" , { detail : { navigationInfo : navigationInfo } } ) ;
	document.dispatchEvent( event );
	}
/**
 *		init ( )
 *		Adds event handlers to find the current document and highlight its path.
 *
 */ export async function init ( searchparams = new URLSearchParams( ) ) {
	console.debug( "initializing sitemap navigator" );
	await fragmentLoader.loadFragments( navigationPanel );
	configuration.homeIsFirstLink = ( searchparams.get( "home-is" ) || "first-link" ) === "first-link" ;
	configuration.removeRedundants = ( searchparams.get( "remove-redundants" ) || "yes" ) === "yes" ;
	loadAbstracts( );
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
	