// Documentation: /webcat/page-header/page-header.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;

/**
*		init ( )
*		Creates a page header before the mainContent element
*
*/ export function init ( referenceElement = document.getElementById( "mainContent" )) {
	// Create and insert the header element
	const e = document.createElement( "HEADER" );
	document.body.insertBefore( e, referenceElement );
	// Subtract height from main's margin-top
	const main = document.querySelector( "MAIN" );
	if ( main ) main.style.marginTop = parseInt( main.style.marginTop || getComputedStyle( main ).marginTop ) - parseInt( e.offsetHeight ) + "px";
	// Add section title image
	const titleimg = document.head.querySelector( "meta[name='sectionTitle']" )?.getAttribute( "content" );
	if ( titleimg ) e.style.backgroundImage= `${window.getComputedStyle( e )["backgroundImage"]}, url("${titleimg}")`;
	}

// * * * Module init code * * * //

export const configuration = { } ;
const searchparams = new URL( import.meta.url ).searchParams ;
if ( ! searchparams.has( "no-default-init" )) init ( searchparams.get( "referenceElement" ) || undefined ) ;
