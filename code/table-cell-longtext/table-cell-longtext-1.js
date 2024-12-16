// Documentation: .../webcat/table-cell-longtext/table-cell-longtext.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;
import { createElement } from "../utility/create-element/create-element.js" ;

/**
*		setCellContent ( )
*		Extracts the cell title string.
*
*/ export function setCellContent( cell, content ) {
	if ( typeof content === "string" ) {
		const i = content?.lastIndexOf( configuration.separator );
		if ( i >= 0 ) {
			cell.setAttribute( configuration.longtextAttribute , content.substring( i+1 ));
			content = content.substring( 0, i );
		}	}
	cell.innerHTML = content ;
	return cell ;
	}
/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init( searchparams = new URLSearchParams( )) {
	configuration.separator = searchparams.get( "separator" ) || configuration.separator ;
	configuration.longtextAttribute = searchparams.get( "longtext-attrib" ) || configuration.longtextAttribute ;
	for ( const table of document.querySelectorAll( "table.longtext-cells" )) {
		const longtextAttrib = table.getAttribute( "data-longtext-attrib" ) || configuration.longtextAttribute ;
		table.addEventListener( "click" , evt => { 
			let longtext = evt.target.getAttribute( longtextAttrib );
			if ( evt.target.tagName !== "TD" || ! longtext ) return ;  // cell has no longtext
			evt.stopPropagation( );
			evt.preventDefault( );
			let div = evt.target.querySelector( "DIV.long-text" ) ;  // get the longtext container
			if ( ! div ) {  // create one
				div = evt.target.insertBefore( createElement( "DIV", { 
					attributes : { class : "long-text" }, 
					properties : { innerText : longtext } } ) , 
					null ) ;
				div.addEventListener( "click" , ( ) => div.style.display = "" );  // hide ; use "div" because evt.target points to TD
				evt.target.style.position = "relative" ;
				}
			div.style.display = "inline-block" ;  // show
			} ) ;
		}
	}

// * * * Module init code * * * // 

const configuration = { 
	separator : "|" ,
	longtextAttribute : "title"
	} ;
initializer.initComponent( init, import.meta.url );
