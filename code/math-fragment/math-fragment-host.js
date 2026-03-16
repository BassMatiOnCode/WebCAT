// Loads the math fragment passed in the module URL into the BODY

import { prepareNumberedEquations } from "/inc/webcat/numbered-equation/numbered-equation.js"

const searchParams = ( new URL ( document.location.href )).searchParams ;

fetch ( searchParams.get( "fragmentUrl" )) 
.then ( response => response.ok ? response.text( ) : "not found" )
.then ( text =>{
	document.body.innerHTML = text ;
	prepareNumberedEquations( document.body );
	// Create backlink anchor
	const backlink =  searchParams.get( "backlink" );
	const hash =  searchParams.get( "hash" );
	if ( backlink ) {
		const heading = document.getElementsByTagName( "H1" )[ 0 ];
		heading.prepend( document.createTextNode( " " ));
		const anchor = document.createElement( "A" );
		anchor.textContent = hash ;
		anchor.href = `${ backlink }#${ hash }` ;
		heading.prepend( anchor );
		}
	} ) ;