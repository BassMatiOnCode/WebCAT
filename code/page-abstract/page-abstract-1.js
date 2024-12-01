// Documentation: /webcat/page-abstract/page-abstract.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;
import { createElement } from "../utility/create-element/create-element.js" ;

/**
*		setContent ( )
*
*/ export function setContent( evt ) {
	const current = evt && evt.detail.navigationInfo.current?.closest( "LI" );
	const content = current?.querySelector( 'meta[name="abstract"]' )?.getAttribute( "content" )
		|| document.head.querySelector( "meta[name='description']" )?.getAttribute( "content" );
	if ( ! content ) pageAbstract.remove( );
	else pageAbstract.innerHTML = content ;
	}
/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init( searchparams = new URLSearchParams( ), evt ) {
	// Find or create abstract container
	if ( typeof( pageAbstract ) === "undefined" && searchparams.get( "create-abstract" ) !== "no" && ! document.head.querySelector( "META[name='page-abstract'][content='create=no']" ) ) {
		let reference = document.querySelector( "H1" )?.nextElementSibling ;
		if ( ! reference ) return ;
		const parentElement = reference.parentElement;
		if ( reference.tagName === "HR" ) reference = reference.nextElementSibling ;
		if ( reference.classList.contains( "subtitle" )) reference = reference.nextElementSibling ;
		parentElement.insertBefore( createElement( "P" , { attributes : { id : "pageAbstract" } } ), reference );
		}
	if ( typeof( pageAbstract ) === "undefined" || pageAbstract.textContent ) return ;
	// Find and set content
	if ( searchparams.has( "use-description" )) setContent( null )
	else document.addEventListener( "navigation-info-update" , setContent );
	}

// * * * Module init code * * * // 

initializer.initComponent( init, import.meta.url );
