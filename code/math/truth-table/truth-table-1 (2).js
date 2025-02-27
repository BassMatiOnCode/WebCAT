// Documentation : .../webcat/math/truth-table.htm

import { prepareStaticDownloadAnchor, prepareDynamicDownloadAnchor } from "../../element-download/element-download.js" ;
import * as initializer from "../../component-initializer/component-initializer-1.js" ;

/**
*		toggleContentEditable ( )
*		Adds or removes the contenteditable attribute from table cells.
*
*/ function toggleContentEditable( table ) {
	for ( const row of table.rows )
		for ( const cell of row.cells )
			cell.toggleAttribute( "contenteditable" );
	}
/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init( searchparams = new URLSearchParams( )) {
	const parameterValue = searchparams.get( "parameterName" ) || "default-value" ;
	// Add left-click event handlers to truth tables
	for ( const table of document.querySelectorAll( "table.truth-table" )) {
		// Add column highlight click event handler
		table.addEventListener( "click" , evt => {
			if ( ! ( evt.target.tagName === "TD" || evt.target.tagName === "TH" ) || evt.target.parentElement.parentElement.tagName !== "THEAD" ) return ;
			evt.preventDefault( );
			for ( const cell of evt.currentTarget.querySelectorAll( `tbody > tr > :nth-child( ${ evt.target.cellIndex + 1 } )` )) {
				cell.classList.toggle( "column-selected" );
				} ;
			} ) ;
		// Add focus event handler
		table.addEventListener( "focus" , evt => {
			console.debug( evt.target.tagName );
			} ) ;
		// Add context menu handlers to truth tables
		table.addEventListener( "contextmenu" , evt => {
			// Position and show context menu
			evt.preventDefault( );
			evt.stopPropagation( );
			if ( truthTableContextMenu.style.display === "block" ) return ;
			// Store important values
			const truthTable = evt.currentTarget ;
			const truthTableCell = evt.target ;
			let truthTableCellIndex = truthTableCell.cellIndex ;
			const truthTableRow = evt.target.closest( "TR" );
			let truthTableRowIndex = truthTableRow.rowIndex ;
			const cellsInRow = truthTableRow.cells.length ;
			// Setup download id
			prepareStaticDownloadAnchor ( truthTableContextMenu.querySelector( "div[name='download-table'] > a" ) , { element : truthTable , fileName : "truth-table.txt" } ) ;
			// Show the context menu
			truthTableContextMenu.style.display="block" ;
			truthTableContextMenu.style.left= evt.x - truthTableContextMenu.scrollWidth / 2 + "px" ;
			truthTableContextMenu.style.top = evt.y - truthTableContextMenu.scrollHeight / 2 + "px" ;
			// Capture mouse pointer
			truthTableContextMenu.setPointerCapture( evt.pointerId );
			// Temporary document click handler for active context menu
			const documentClickHandler = evt => {
				// Remove event handler
				truthTableContextMenu.releasePointerCapture( evt.pointerId );
				document.removeEventListener( "click" , documentClickHandler ) ;
				truthTableContextMenu.style.display = "none" ;
				// Consume event if it is not an anchor
				if ( evt.target.tagName !== "A" ) evt.preventDefault( );
				evt.stopPropagation( );
				// Bail out on click outside of the menu box
				if ( evt.target === document.documentElement ) return ;
				// Process context menu click
				switch ( evt.target.getAttribute( "name" ) ) {
				case "append-column" :
					truthTableCellIndex = undefined ;
				case "insert-column" :
					for ( const row of truthTable.rows ) row.insertCell( truthTableCellIndex );
					break ;
				case "delete-column" :
					for ( const row of truthTable.rows ) row.deleteCell( truthTableCellIndex );
					break ;
				case "append-row" :
					truthTableRowIndex = undefined ;
				case "insert-row" :
					const row = truthTable.insertRow( truthTableRowIndex );
					for ( let i = 0 ; i < cellsInRow ; i ++ ) row.insertCell( ).innerHTML="&nbsp;" ;
					break;
				case "delete-row" :
					truthTable.deleteRow( truthTableRowIndex );
					break ;
				case "edit-table" :
					evt.target.style.display = "none" ;
					evt.target.nextElementSibling.style.display = "block" ;
					toggleContentEditable( table );
					truthTableCell.focus();
					break;
				case "stop-editing" :
					evt.target.style.display = "none" ;
					evt.target.previousElementSibling.style.display = "block" ;
					toggleContentEditable( table );
					break;
					}
				} ;
			document.addEventListener( "click" , documentClickHandler ) ;
			} ) ;
		}
	}

// * * * Module init code * * * // 

initializer.initComponent( init, import.meta.url );
