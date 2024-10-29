// Documentation: /web-cat/content-height-observer/content-height-observer.htm

/**
 *		init ( )
 *		Set up resize observers for content host containers.
 *
 */ export function init ( container = document.body )	 {
	for ( const documentHost of container.querySelectorAll( ".content-height-observed" )) {
		documentHost.addEventListener( "load" , evt => {
			const hostedDocument = evt.target.contentDocument.documentElement ; // html element
			hostedDocument.style.height = "fit-content" ;
			if ( hostedDocument.tagName === "HTML" )evt.target.contentDocument.body.style.height = "fit-content" ;
			for ( const element of hostedDocument.querySelectorAll( ".hide-if-hosted" )) element.style.display = "none" ;
			hostedDocument.style.overflowY = "hidden" ;  // prevents vertical scrollbar when a horizontal scrollbar is shown
			const observer = new ResizeObserver(( entries ) => {
//				console.debug( entries[ 0 ].target.offsetHeight, documentHost.scrollHeight );
				documentHost.style.height = entries[ 0 ].target.offsetHeight + 0 +  "px" ;
				} ) ;
			observer.observe( hostedDocument );
			} ) ;
	}	}

//
// Module init code 
const searchparams = new URL( import.meta.url ).searchParams ;
if ( ! searchparams.has( "no-default-init" )) init ( searchparams.get( "container" ) || undefined ) ;
