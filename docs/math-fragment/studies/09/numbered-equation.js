export function prepareNumberedEquations ( 
		// Creates a wrapper around a numbered math block element.
	container		// The container that contains the <math display="block"> elements
	)	{
	for ( const m of container.querySelectorAll( "math.numbered" )) {
		if ( m.parentNode.classList.contains( "numbered-equation" )) continue ;
		const wrapper = document.createElement( "DIV" );
		wrapper.classList.add( "webcat", "numbered-equation" );
		wrapper.appendChild( document.createElement( "SPAN" ));
		m.before( wrapper );
		wrapper.appendChild( m );
		const span = document.createElement( "SPAN" );
		span.textContent = m.getAttribute( "eqn-num" );
		wrapper.appendChild( span );
		}
	}