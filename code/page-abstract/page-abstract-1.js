// Documentation: /web-cat/page-abstract/page-abstract.htm

/**
 *		init ( )
 *		Copies the meta description to the 
 *
 */ export function init ( ) {
	if ( typeof( pageAbstract ) === "undefined" ) return ;
	const content = document.querySelector( 'meta[name="description"]' ).getAttribute( "content" );
	if ( ! content || content.length === 0 ) pageAbstract.remove( );
	else pageAbstract.innerHTML = content ;
	} ;

//
// Module init code 
const searchparams = new URL( import.meta.url ).searchParams ;
if ( ! searchparams.has( "no-default-init" )) init( ) ;
