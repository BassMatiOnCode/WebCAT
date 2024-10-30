//	Documentation: .../web-cat/literature-reference-list/literature-reference-list.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;

/**
*		extractEntryNumber ( )
*		Extracts the trailing number portion form an entry ID.
*
*/ export function extractEntryNumber( id ) {
	const number = id.match( new RegExp( "\\d+$" ))[ 0 ];
	if ( number === undefined ) console.error( `Title ID must end with digits: ${ title.id }` ) ;
	else return number;
	}

/**
*		processReferenceAnchor ( )
*		loads the document, retrieves the DT element, extracts the text content and generates the title attribute for the anchor.
*
*/ export function processReferenceAnchor( anchor ) {
	// Generate the inner text for the reference anchor
	const url = new URL( anchor.href );
	const number = extractEntryNumber( url.hash );
	// Bail out if there is no proper numeric suffix in the ID
	if ( number === undefined ) return ;
	anchor.innerText = `[${ parseInt( number ) }]` ;
	// Generate the title attribute for the reference anchor
	fetch( url )
	.then( response => {
		if ( response.ok ) return response.text( );
		else throw new Error( `Cannot find literature reference document: ${ response.url }` );
		} ) 
	.then ( text => {
		const template = document.createElement( "TEMPLATE" );
		template.innerHTML = text ;  // parses content
		const titleElement = template.content.querySelector(`dt[id='${ url.hash.substring( 1 ) }']`);
		if ( titleElement ) anchor.setAttribute( "title" , titleElement.innerText );
		else throw new Error( `Cannot find literature reference entry in : ${url.href}` );
		} ) 
	.catch ( reason => console.error( reason ));
	}
/**
*		processReferenceList ( )
*		Processes the DT entries in a literature reference list.
*
*/ export function processReferenceList( list ) {
	for ( const title of list.querySelectorAll( "dt" )) {
		if ( ! title.id ) continue;
		// Create the title prefix element
		const element = document.createElement( "SPAN" );
		const number = extractEntryNumber( title.id );
		if ( number === undefined ) continue ;  // allows entries that are not referenced in the main text
		element.textContent = `[${ parseInt( number )}] ` ;
		title.insertBefore( element, title.firstChild ) ;
		// Check uniqueness of IDs
		if ( list.querySelectorAll( `dt[id="${title.id}"]` ).length > 1 ) console.error( `Literature reference list title ID ${title.id} is not unique.` );
	}	}
/**
*		init ( )
*		Decorates list titles with a number in square brackets, derived
*		from the list title ID.
*
*/ export function init( ) {
	for ( const list of document.querySelectorAll( "dl.literature-reference-list" )) processReferenceList( list );
	for ( const anchor of document.querySelectorAll( "a.literature-reference, a.lit-ref" )) processReferenceAnchor( anchor );
	}

/** Module init code */ initializer.initComponent( init, import.meta.url );




