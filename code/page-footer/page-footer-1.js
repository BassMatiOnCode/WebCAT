//	documentation : /web-cat/page-footer/page-footer.htm

/**
*		init ( )
*		creates a page footer at the end of the document
*
*/ export function init ( referenceElement = null ) {
	// Retrieve metadata
	const creationDate = getDocumentMetaData( "creation-date" );
	const pageCreator = getDocumentMetaData( "author" );
	const changeDate = getDocumentMetaData( "change-date" );
	const pageEditor = getDocumentMetaData( "editor" );
	// Create the header element
	const e = document.createElement( "FOOTER" );
	// Create and insert the first paragraph
	let s = "" ;
	if ( creationDate || pageCreator ) {
		s += "Created" ;
		if ( pageCreator ) s += ` by ${pageCreator}` ;
		if ( creationDate ) s += ` on ${creationDate}` ;
		}
	if ( changeDate || pageEditor ) {
		if ( s.length ) s += " • " ;
		s += "Modified " ;
		if ( pageEditor ) s += ` by ${pageEditor}` ;
		if ( changeDate ) s += ` on ${changeDate}` ;
		}
	if ( s.length ) s += " • Version " ;
	s += getDocumentMetaData("version", "1");
	let p = document.createElement( "P" );
	p.innerHTML = s ;
	e.insertBefore( p, null );
	// Create and insert the second paragraph
	p = document.createElement( "P" );
	p.innerHTML = '<a href="/index.htm">Home</a>' ;
	e.insertBefore( p, referenceElement );
	// Create and insert the third paragraph
	p = document.createElement( "P" );
	p.innerHTML = '<a href="/legal.htm">Legal</a> | <a href="/contact.htm">Contact</a> | <a href="/feedback.htm">Feedback</a>' ;
	e.insertBefore( p, null );
	// Insert the footer
	document.body.appendChild( e );
	// Raise the navigation data query event
	const event = new CustomEvent( "NavigationDataQuery",  { detail : { 
		result : null,
		paragraph : p
		} } ) ;
	document.dispatchEvent ( event ) ;
	if ( event.detail.result ) processNavigationData( event );
	else document.addEventListener( "NavigationDataPublication", processNavigationData );
	} ;
/**
*		getDocumentMetaData ( )
*		Retrieves document meta data content
*
*/ function getDocumentMetaData( name, defaultValue="?" ) {
	const e = document.querySelector( `meta[name='${name}']` );
	if ( ! e ) return ;
	let value = e.getAttribute( "content" );
	return value || defaultValue ;
	}
/**
*		processNavigationData ( )
*		Event handler for NavigationDataPublication
*
*/ function processNavigationData ( evt ) {
	// Sets up and deletes anchor elements in the footer.
	const result = evt.detail.result ;
	if ( result ) {
		let s = "" ;
		if ( result.up ) s += ` | <a href="${result.up}">Up</a>` ;
		if ( result.first ) s += ` | <a href="${result.first}">First</a>` ;
		if ( result.previous ) s += ` | <a href="${result.previous}">Previous</a>` ;
		if ( result.down) s += ` | <a href="${result.down}">Down</a>` ;
		if ( result.next ) s += ` | <a href="${result.next}">Next</a>` ;
		if ( result.last ) s += ` | <a href="${result.last}">Last</a>` ;
		evt.detail.paragraph.innerHTML += s ;
		}
	document.removeEventListener( "NavigationDataPublication", processNavigationData );
	}

//
// Module init code 
const searchparams = new URL( import.meta.url ).searchParams ;
if ( ! searchparams.has( "no-default-init" )) init( searchparams.get( "referenceElement" ) || undefined ) ;
