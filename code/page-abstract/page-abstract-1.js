// Documentation: /webcat/page-abstract/page-abstract.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;
import { createElement } from "../utility/create-element/create-element.js" ;

/**
*		setAbstract ( )
*
*/ export function setAbstract( evt ) {
	if ( pageAbstract.textContent ) return ;   // author has supplied abstract content directly 
	const description = document.head.querySelector( "meta[name='description']" );
	const current = evt && evt.detail.navigationInfo.current?.closest( "LI" );
	pageAbstract.innerHTML = current?.querySelector( 'meta[name="abstract"]' )?.getAttribute( "content" ) || "" ;
	if ( pageAbstract ) 
		if ( ! description.getAttribute( "content" )) description.setAttribute( "content", pageAbstract.textContent );
	else pageAbstract.innerHTML = description.getAttribute( "content" );
	if ( ! pageAbstract.innerText ) pageAbstract.remove( );
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
	if ( searchparams.has( "use-description" )) setAbstract( null )
	else document.addEventListener( "navigation-info-update" , setAbstract );
	}

// * * * Module init code * * * // 

initializer.initComponent( init, import.meta.url );
