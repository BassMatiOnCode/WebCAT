// Documentation: .../web-cat/page-pathbar/page-pathbar.htm

/**
*		init ( )
*		Creates a navigation path bar before the mainContent element
*
*/ export function init ( referenceElement = document.getElementById("mainContent" )) { 
	// Create and insert the navigation path bar
	const e = document.createElement( "DIV" );
	e.className = "page-pathbar" ;
	const a = document.createElement( "A" );
	a.href = "/index.htm" ;
	a.textContent = "Home" ;
	e.insertBefore( a, null );
	document.body.insertBefore( e, referenceElement );
	// Move margin bottom from previous sibling to path bar
	e.style.marginBottom = parseInt( window.getComputedStyle( e.previousElementSibling ).marginBottom ) - parseInt( e.scrollHeight ) + "px";
	e.previousElementSibling.style.marginBottom = "0" ;
	}

//
// Module init code 
const searchparams = new URL( import.meta.url ).searchParams ;
if ( ! searchparams.has( "no-default-init" )) init ( searchparams.get( "referenceElement" ) || undefined ) ;
