class LinkChain extends HTMLElement {
	static templateDocument = undefined ;
	static contentRequest = fetch( new URL( "link-chain-1.htm" , import.meta.url ))
		.then ( response => response.text( ))
		.then ( text => { 
			const template = document.createElement( "TEMPLATE" );
			template.setHTMLUnsafe( text );
			return template;
		} ) ;
	constructor ( ) {
		super( );
		if ( this.shadowRoot ) this.initializeInstance( );  // the author already provided the code
		else {  // The custom element body is empty
			this.attachShadow( { mode : "open" } );
			LinkChain.contentRequest.then ( template => {
				this.shadowRoot.appendChild( document.importNode( template.content, true ) );
				this.initializeInstance( );
				} ) ;
		}	}
	initializeInstance ( ) {
		// Configures href and textContent properties of link anchors..
		const path = document.location.pathname.split( "/" );
		const match = /^(?<prefix>[a-zA-Z._-]+)(?<number>\d+)(?<postfix>[a-zA-Z._-]+)?$/.exec( path.pop( ));
		const { prefix, number, postfix } = match ? match.groups : [  ] ;
		const numLength = number.length ;
		const currentFolder = path.pop( ) || "" ;
		const parentFolder = path.pop( ) || "" ;
		let anchor = this.shadowRoot.getElementById( "previous-document" );
		anchor.textContent = anchor.href = +number === 1 || this.hasAttribute( "no-previous" ) ? "" : `${ prefix }${ (number - 1).toString( ).padStart( numLength, "0" ) }${ postfix }` ;
		anchor = this.shadowRoot.getElementById( "following-document" )
		anchor.textContent = anchor.href = this.hasAttribute( "no-following" ) ? "" : `${ prefix }${ (+ number + 1).toString( ).padStart( numLength, "0" )}${ postfix }` ;
		this.shadowRoot.getElementById( "parent-folder" ).textContent = parentFolder ;
		this.shadowRoot.getElementById( "current-folder" ).textContent = currentFolder ;
		}
	}

customElements.define( "link-chain", LinkChain );
