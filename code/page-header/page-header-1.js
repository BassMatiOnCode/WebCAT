// Documentation: /web-cat/page-header/page-header.htm
/**
*		init ( )
*		Creates a page header before the mainContent element
*
*/ export function init ( referenceElement = document.getElementById( "mainContent" )) {
	// Create and insert the header element
	const e = document.createElement( "HEADER" );
	document.body.insertBefore( e, referenceElement );
	// Move margin from body to header
	e.style.marginBottom = parseInt( window.getComputedStyle( document.body ).marginTop ) - parseInt( e.scrollHeight ) + "px";
	document.body.style.marginTop = "0" ;
	// Add section title image
	const titleimg = document.head.querySelector( "meta[name='sectionTitle']" )?.getAttribute( "content" );
	if ( titleimg ) e.style.backgroundImage= `${window.getComputedStyle( e )["backgroundImage"]}, url("${titleimg}")`;
	}

//
// Module init code 
const searchparams = new URL( import.meta.url ).searchParams ;
if ( ! searchparams.has( "no-default-init" )) init ( searchparams.get( "referenceElement" ) || undefined ) ;
