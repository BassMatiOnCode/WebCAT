// Documentation: .../web-cat/table-column-selector/table-column-selector.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;

/**
 *		dialogClosingHandler( )
 *		Sets table column visibility.
 *
 */ function dialogClosingHandler( evt ) {
	// find the row element
	const table = evt.currentTarget.closest( "TABLE" );
	for ( const row of table.rows ) {
		for ( const container of evt.detail.dialog.children ) {
			if ( container.tagName !== "DIV" ) continue ;
			const cell = row.cells[ container.firstElementChild.getAttribute( "cellindex" ) ];
			if ( cell ) cell.style.display = container.firstElementChild.checked ? "" : "none" ;
	}	}	}
/**
 *		contextmenuHandler( )
 *		Fills the dialog with column headercell names.
 *
 */ function dialogOpeningHandler( evt ) {
	// find the row element
	const row = evt.currentTarget.tagName === "TR" ? evt.target : evt.target.parentElement ;
	// clear the dialog content
	evt.detail.dialog.innerHTML = "" ;
	// add checkbox and label for each TH element in the row
	for ( const headercell of row.querySelectorAll( "TH" )) {
		const container = document.createElement( "DIV" );
		evt.detail.dialog.append( container );
		const checkbox = document.createElement( "INPUT" );
		checkbox.type = "checkbox" ;
		checkbox.checked = headercell.style.display === "" ;
		checkbox.setAttribute( "cellindex" , headercell.cellIndex );
		checkbox.id = `${evt.detail.dialog.id}-${headercell.cellIndex}` ; 
		container.append( checkbox );
		const label = document.createElement( "LABEL" );
		label.innerText = headercell.innerText ;
		label.htmlfor = checkbox.id ;
		container.append( label );
		}
	const button = document.createElement( "BUTTON" );
	button.textContent = "Apply" ;
	button.classList.add( "autoclose" );
//	button.style.borderStyle = "none" ;
//	button.style.width = "100%" ;
	evt.detail.dialog.append( button );
	}
/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init( searchparams = new URLSearchParams( )) {
	console.info( "Initializing collapsible table columns" );
	for ( const row of document.querySelectorAll( ".selectable-column-headers" )) {
		const opener = row.hasAttribute( "data-context-dialog-id" ) ? row : 	row.querySelector( "[data-context-dialog-id]" );
		if ( ! opener ) { console.log( "data-context-dialog-id attribute missing." ) ; continue ; }
		opener.addEventListener( "context-dialog-opening" , dialogOpeningHandler );
		opener.addEventListener( "context-dialog-closing" , dialogClosingHandler );
		} 
	}
/** Module init code */ initializer.initComponent( init, import.meta.url );
