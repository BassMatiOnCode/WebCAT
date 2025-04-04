// 2025-04-04 USP
// Support code for a math equation fragment.
// Documentation: .../webcat/math-equation/math-equation.htm

if ( window.parent === window ) {
	const p = document.createElement( "P" );
	p.innerHTML = document.querySelector( "meta[name='description']" ).getAttribute( "content" );
	document.body.prepend( p );
	}