// 2025-11-04 usp

import * as initializer from "/inc/webcat/component-initializer/component-initializer.js" ;
const configuration = { } ;
const fragmentTypeNames = {
	c : "COR" ,	// corollary
	d : "DEF" ,	// definition
	l : "LEM" ,	// lemma
	p: "PRN" ,	// proposition
	t : "THM" ,	// theorem
	} ;
export function createFragmentNumber ( pathname, stripZeroes ) {
	const matches = pathname.match( new RegExp( "/([a-zA-Z])-([a-zA-Z0-9-.]*)\\.(.*?)$" ));
	if ( matches && matches.length === 4 ) return { 
		fragmentType : fragmentTypeNames[ matches[ 1 ]] ,
		fragmentNumber : stripZeroes ? matches[ 2 ].substring( matches[ 2 ].search( new RegExp( "[^0]" ))) : matches[ 2 ]
	}	}
export function setMathFragmentNumber( container, fragmentType, fragmentNumber ) {
	// Extract fragment type and number from pathname
	container.querySelector( ".math-fragment-type" ).textContent = fragmentType ;
	container.querySelector( ".math-fragment-number" ).textContent = fragmentNumber ;
	}
export function createLinkTarget ( container, fragmentType, fragmentNumber ) {
	// Sets the ID property of the math fragment element in the host document to make it a link target.
	container.querySelector( "figure.math-fragment-content" ).id = `${ fragmentType }-${ fragmentNumber }`;
	}
export function createMathFragmentAnchor ( container, href ) 
	//	Wraps the fragment identifier with an anchor that links to the standalone document.
	//	container : The element that contais the math fragment identifer.
	//	href : Contains the URL of the math fragment document.
	{
	const identifier = container.querySelector( ".math-fragment-id" );
	const anchor = document.createElement( "A" );
	anchor.className = "math-fragment-anchor" ;
	anchor.href = href + `?host=${ document.location.pathname }&target=${ container.querySelector( "figure.math-fragment-content" ).id }` ;
	identifier.replaceWith( anchor );
	anchor.append( identifier );
	}
export function setFigureCaptionText ( container ) {
	// Extracts the fragment title or caption from the math fragment HEAD.
	const captionTitle = container.querySelector( "[data-selector]" )
	if ( captionTitle ) captionTitle.textContent = container.querySelector( captionTitle.getAttribute( "data-selector" ))?.innerText || "title-selector-error" ;
	}
export function processContainer ( 
	container ,  // the container elements to be processed in this document 
	url ,  // the math fragment document href if a host document is processed, or null if a math fragment document is processed.
	createAnchor ,  // true if 
	stripZeroes, standAlone ) 
	
	{
	const { fragmentType, fragmentNumber } = createFragmentNumber ( new URL( url ).pathname, stripZeroes ) 
	setMathFragmentNumber( container, fragmentType, fragmentNumber, stripZeroes );
	if ( ! standAlone ) {
		createLinkTarget( container, fragmentType, fragmentNumber );
		if ( createAnchor ) createMathFragmentAnchor( container, url );
	}	}
export function init ( 
	// Processes math fragment anchors, math fragment documents, and anchors that link to a math fragment document.
	searchparams, 	// URLSearchParams object, contains parameters passed via script module URL.
	event,  // Not used.
	containers = searchparams?.get( "containers" ) || [ document.body ] ,  // the container element(s) to be processed.
	createAnchor = configuration.createAnchor = searchparams?.get( "create-anchor" ) !== "no" ,  // if true creates an anchor to the stand-alone fragment document.
	stripZeroes = configuration.stripZeroes = searchparams?.get( "strip-zeroes" ) !== "no"  // if true then leading zeroes from the fragment number are removed.
	)	{
	for ( const container of containers ) {
		if ( typeof container === "string" ) container = document.getElementById( container );
		if ( document.querySelector( "meta[itemprop='document-type']" )?.getAttribute( "content" ) === "math-fragment" ) {
			processContainer( container, document.location, createAnchor, stripZeroes, standalone );
			}
		else for ( const anchor of container.querySelectorAll( "a[data-load-fragment][data-select='.math-fragment-content']" )) {
			anchor.addEventListener( "fragment-loader-selecting-content" , evt => { processContainer( evt.detail.content, evt.target.href, createAnchor, stripZeroes, standalone ) } ) ;
	}	}	}

initializer.initComponent ( init, import.meta.url );
