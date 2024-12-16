// Documentation: .../webcat/table-data-loader.htm

import * as initializer from "../component-initializer/component-initializer.js" ;

/**
*		parseHtmlText( )
*		Assigns a content to a table cell
*
*/ export function parseHtmlText( cell, content ) {
	cell.innerHTML = content ;
	}
/**
*		loadRowData( )
*		Loads data into table rows
*
*/ export function loadRowData( table , { 
		rowTemplate = table.getAttribute( "data-row-template" ) ,
		dataSource = table.getAttribute( "data-source" ) ,
		columnHeaderRow = table.tHead.querySelector( "TR.column-headers" )
		} = { } ) {
	if ( typeof dataSource === "string" ) dataSource = globalThis[ dataSource ];
	if ( typeof rowTemplate === "string" ) rowTemplate = document.getElementById( rowTemplate );
	for ( const dataRow of dataSource ) {
		const tableRow = rowTemplate.content.cloneNode( true ).firstElementChild ;
		for ( let i = 0 ; i < columnHeaderRow.cells.length ; i ++ ) {
			const headerCell = columnHeaderRow.cells[ i ] ;
			const name = headerCell.getAttribute( "name" );
			if ( name ) configuration.assignmentFunction( tableRow.cells[ i ], dataRow[ name ] ) ;
			else if ( headerCell.hasAttribute( "rowspan" )) headerCell.setAttribute( "rowspan" , headerCell.rowspan + 1 ) ;
			}
		table.tBodies[ 0 ].insertBefore( tableRow, null );
	}	}
/**
*		loadColumnData( )
*		Loads a ungrouped plain object properties into the 
*
*/ export function loadColumnData ( table, { dataSource = table.getAttribute( "data-source" ) } = { } ) {
	if ( typeof dataSource === "string" ) dataSource = globalThis[ dataSource ] ;
	for ( const dataRow of dataSource ) {
		for ( const tableRow of table.rows ) {
			const tableRowHeader = tableRow.firstElementChild ;
			if ( tableRowHeader.hasAttribute( "colspan" )) tableRowHeader.setAttribute( "colspan" , tableRowHeader.colSpan + 1 );
			else 	configuration.assignmentFunction( tableRow.insertCell( ), dataRow[ tableRowHeader.getAttribute( "name" ) ] || "" );
	}	}	}
/**
*		load( )
*		Loads data into a table into row groups
*
*/ export function postponed___loadWithGroups( table, dataRows ) {
	for ( const dataRow of dataRows ) {
		for ( const [ dataGroupName, dataGroupObject ] of Object.entries( dataRow )) {
			const tableGroup = table.querySelector( `:scope > [name="${ dataGroupName }"]` );
			if ( ! tableGroup ) continue ;
			const tableGroupHeader = tableGroup.querySelector( "tr.group-header > [colspan]" );
			if ( tableGroupHeader ) tableGroupHeader.setAttribute( "colspan", parseInt( tableGroupHeader.getAttribute( "colspan" )) + 1 );
			for ( const [ dataPropertyName, dataPropertyValue ] of Object.entries( dataGroupObject )) {
				const tableRow = tableGroup.querySelector( `:scope > tr > [name="${ dataPropertyName }"]` )?.parentElement ;
				if ( ! tableRow ) continue ;
				configuration.assignmentFunction( tableRow.insertCell( ), dataPropertyValue );
	}	}	}	}
/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init( ) {
	for ( const table of document.querySelectorAll( "table[data-source]" )) {
		switch ( table.getAttribute( "data-orientation" )) {
		default :
		case "horizontal" : 
			loadRowData( table );
			break ;
		case "vertical" :
			loadColumnData( table ) ;
			break ;
		}	}	}

// * * * Module init code * * * // 

export const configuration = {
	assignmentFunction : parseHtmlText , // plain text copy function
	} ;
initializer.initComponent( init, import.meta.url );
