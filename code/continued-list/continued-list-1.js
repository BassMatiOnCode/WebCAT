// Documentation: /web-cat/continued-list/continued-list.htm

/**
*		init ( )
*		Initializes a container
*
*/ export function init ( container = document.body ) {
	// Find all OL elements that don't have a "start" attribute
	const list = Array.from( container.querySelectorAll( "ol.continued:not([start])" ));
	let postponed = 0; // counts postponed OLs to prevent infinite loop
	while ( list.length > 0 ) {
		let sibling = list[0].previousElementSibling;
		while ( sibling && sibling.tagName !== "OL" ) sibling = sibling.previousElementSibling ;
		if ( ! sibling ) {
			console.error( "Ordered list continuation error" );
			list.shift();
			sibling = null;
			postponed = 0;
		} else if ( ! sibling.className.contains( "continued" ) || sibling.hasAttribute( "start" ) ) {
			list[ 0 ].setAttribute( "start", sibling.children.length + + ( sibling.getAttribute( "start" ) || 1 ) );
			list.shift( );
			postponed = 0;		
		} else {
			if ( ++ postponed > list.length ) {
				console.error( "Infinite loop prevented." );
				break;
				}
			list.push( list.shift( ) );
			postponed += 1;
	}	}	}

//
// Module init code 
const searchparams = new URL( import.meta.url ).searchParams ;
if ( ! searchparams.has( "no-default-init" )) init ( searchparams.get( "container" ) || undefined ) ;
