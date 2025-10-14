export function getScrollMargins ( document = document ) {
	const result = { top : 0 , right : 0 , bottom : 0 , left : 0 };
	for ( const toolbar of document.querySelectorAll( ".toolbar" )) {
		if ( toolbar.top === 0 ) result.top = Math.max( result.top, toolbar.offsetHeight ) ;
		else if ( toolbar.bottom === 0 ) result.bottom = Math.max( result.bottom, toolbar.offsetHeight ) ;
		else if ( toolbar.left === 0 ) result.left = Math.max( result.left, toolbar.offsetWidth ) ;
		else if ( toolbar.right === 0 ) result.right = Math.max( result.right, toolbar.offsetWidth ) ;
		}
	return result;
	}