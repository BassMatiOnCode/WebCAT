document.querySelectorAll( "a[data-load-fragment]" ).forEach( anchor => {
	fetch ( anchor.href )
	.then ( response => response.text( ))
	.then ( text => {
		// Parse response text
		const template = document.createElement( "TEMPLATE" );
		template.innerHTML = text ;
		// Recreate script elements
		for ( const script of template.content.querySelectorAll( "SCRIPT" )) {
			const newscript = document.createElement( "SCRIPT" );
			newscript.textContent = script.textContent;
			if ( script.hasAttribute( "type" )) newscript.setAttribute( "type", script.getAttribute( "type" ));
			if ( script.hasAttribute( "src" )) newscript.setAttribute( "src", script.getAttribute( "src" ));
			console.log( "Replacing script" );
			script.replaceWith( newscript );
			console.log( "Script replaced." );
			} ;
		// Replace the anchor with the imported content
		console.log( "Replacing fragment anchor" );
		anchor.replaceWith( template.content );
		console.log( "Fragment anchor replaced" );
		} ) ;
	} ) ;
	console.log( "loader-script.js" );