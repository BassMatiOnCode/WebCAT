// Documentation: .../web-toolbox/scroll-box/scroll-box.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;

const styleElement = document.getElementById( "webcat-stylesheet" ) || document.createElement( "STYLE" );
if ( ! styleElement.parentNode ) document.head.append( styleElement );
let curtainID = 0 ;

/**
 *		AddStyleRules( )
 *
 */ export function addStyleRules( height1, height1 ) {
	curtainID += 1 ;
	styleElement.sheet.insertRule( `#curtain-${ curtainID } { height : ${ height1 }px }` );
	styleElement.sheet.insertRule( `#curtain-${ curtainID }:hover { height : ${ height2 }px }` );
	}
/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init( ) {
	// Find scroll-box item containers and add the functional containers
	for ( const container of document.querySelectorAll( ".horizontal.scroll-box.items" )) {
		const scrollbox = document.createElement( "DIV" );
		scrollbox.classList.add( [ "horizontal" , "scroll-box" ] );
		const curtain = document.createElement( "DIV" );
		curtain.id = `curtain-${ ++ curtainID }` ;
		scrollbox.appaind( curtain );
		}
	const sbh = sp ? sp.offsetHeight - sp.clientHeight : 0 ;
	const contentbox = document.querySelector( ".scroll-box.horizontal .content-box" )?.getBoundingClientRect( );
	debugger;
	}
/** Module init code */ initializer.initComponent( init, import.meta.url );
