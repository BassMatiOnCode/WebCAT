// Documentation: .../web-cat/collaspible-table-structures/collaspible-table-structures.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;

/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init( searchparams = new URLSearchParams( )) {
	console.info( "Initializing collapsible tables" );
	for ( const table of document.querySelectorAll( "table.collapsible-structure" )) {
		table.addEventListener( "click" , evt => {
			if ( evt.target.hasAttribute["data-collapsible-state"] ) return ;
			const collapsible = evt.target.closest( "TBODY" ).nextElementSibling;
			switch ( evt.target.getAttribute( "data-collapsible-state" )) {
			case "expanded" :
				collapsible.style.display = "none" ;
				evt.target.setAttribute("data-collapsible-state", "collapsed")
				break;
			case "collapsed" :
				collapsible.style.display = "table-row-group" ;
				evt.target.setAttribute("data-collapsible-state", "expanded")
				break ;
				}
			evt.preventDefault( );
			evt.stopPropagation( );
			} ) ;
		// Determine the number of columns
		const numColumns = table.getAttribute( "data-num-columns" ) || (( rows ) => {
			let n = 0 ;
			for ( const row of rows ) n = Math.max( n, row.cells.length );
			return n ;
			} )( table.tHead.rows );
		// Set colspan in controller rows
		for ( const cell of table.querySelectorAll( "th[data-collapsible-state]" )) {
			cell.setAttribute( "colspan", numColumns );
			}
		}
	}
/** Module init code */ initializer.initComponent( init, import.meta.url );
