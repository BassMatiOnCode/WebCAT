// Documentation: .../web-toolbox/checked-items/checked-items.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;

/**
*		init ( )
*		Initializes list elements with checked items.
*
*/ export function init( searchparams = new URLSearchParams( )) {
	const root = document.getElementById( searchparams.get( "root" )) || document.body ;
	// Step 1 - Preprocess elements decorated with "checked-items-inherit"
	for ( const element of root.querySelectorAll ( ".checked-items-inherit" )) {
		element.classList.replace( "checked-items-inherit", "checked-items" );
		for ( const nestedList of element.querySelectorAll ( "UL, OL" )) {
			if ( nestedList.classList.contains( "no-checked-items" )) continue ;
			nestedList.classList.add( "checked-items" );
			}
		}
	// Step 2 - Process the items of decorated list elements
	for ( const element of root.querySelectorAll( ".checked-items > li" )) {
		const checkbox = document.createElement( "INPUT" );
		checkbox.type = "checkbox" ;
		element.insertBefore( checkbox, element.firstChild );
		}
	}
/** Module init code */ initializer.initComponent( init, import.meta.url );
