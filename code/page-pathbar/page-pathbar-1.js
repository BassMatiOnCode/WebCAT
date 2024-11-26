// Documentation: .../webcat/page-pathbar/page-pathbar.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;
import { createElement } from "../utility/create-element/create-element-1.js" ;

/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init( searchparams = new URLSearchParams( )) {
	const referenceElement = document.getElementById( searchparams.get( "reference-element" )) || document.querySelector( "MAIN" ); 
	// Create and insert the navigation path bar
	const e = document.createElement( "DIV" );
	e.className = "toolbar page-pathbar horizontal scroll-box" ;
	const a = document.createElement( "A" );
	a.href = "/index.htm" ;
	a.textContent = "Home" ;
	e.append( a );
	document.body.insertBefore( e, referenceElement );
	// Move margin bottom from previous sibling to path bar
	const main = document.querySelector( "MAIN" );
	if ( main ) main.style.marginTop = parseInt( main.style.marginTop || getComputedStyle( main ).marginTop ) - parseInt( e.offsetHeight ) + "px";
	}

// * * * Module init code * * * //

initializer.initComponent( init, import.meta.url );