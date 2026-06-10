import { prepareNumberedEquations } from "./numbered-equation.js"
import { makeRelative } from "./url-tools.js" ;
import mathStyles from "./math.css" with { type: "css" } ;
import numberedEquationStyles from "./numbered-equation.css" with { type: "css" } ;
import mathFragmentStyles from "./mfrag-container.css" with { type: "css" } ;

const searchParams = ( new URL ( import.meta.url )).searchParams ;
const hostDocumentUrl = new URL( searchParams.get( "fragment-host" ) || "./mfrag-host.htm", document.location ) ;  // stand-alone math-fragment host document 
const storageKey = hostDocumentUrl.pathname.split( "/" ).slice( 0, -1 ).join( "/" );

class MathFragmentContainer extends HTMLElement {
	fragmentAnchor = undefined ;
constructor ( ) {
	super( );
	const shadow = this.attachShadow ( { mode : "open" } ) ;
	shadow.adoptedStyleSheets.push( mathStyles );
	shadow.adoptedStyleSheets.push( mathFragmentStyles );
	shadow.adoptedStyleSheets.push( numberedEquationStyles );
	}
connectedCallback( ) {
	const fragmentUrl = new URL( this.getAttribute( "href" ), document.location );
	this.id = fragmentUrl.pathname.split( "/" ).pop( ).split( "=" ).shift( );
	fetch ( fragmentUrl )
	.then ( response => response.ok ? response.text( ) : "not found" )
	.then ( text => {
		// Parse html code
		const template = document.createElement( "TEMPLATE" );
		template.innerHTML = text ;
		// Decorate heading with fragment ID anchor
		const heading = template.content.querySelector( "H1" );
		let anchor = heading.querySelector( "A:first-child" );
		if ( anchor ) anchor.textContent = this.id ;
		else heading.prepend( document.createTextNode( `${ this.id } ` ));
		// Classify the math fragment for CSS application
		switch ( this.id.substring( 0, 1 ).toUpperCase( 0 )) {
		case "D" : this.classList.add( "definition" ); break;
		case "T" : this.classList.add( "theorem" ); break;
		case "A" : this.classList.add( "axiom" ); break;
		case "C" : this.classList.add( "corollary" ); break;
		case "L" : this.classList.add( "lemma" ); break;		
		case "P" : this.classList.add( "property" ); break;		
			}
		// Convert relative links in the text so that they remain valid in this document
		for ( const anchor of template.content.querySelectorAll( "A" )) 
			anchor.href = ( new URL( anchor.href, fragmentUrl )).href ;
		this.shadowRoot.append( template.content );
		// Create the flyout button anchor
		if ( ! anchor.hasAttribute( "no-flyout-button" )) {
			anchor = document.createElement( "A" );
			anchor.href = hostDocumentUrl ;
			const img = document.createElement( "IMG" );
			img.src = "separate-window.svg" ;
			img.style = "position:absolute; top:10px; right:10px"
			anchor.append( img );
			this.shadowRoot.append( anchor );
			anchor.addEventListener( "click" , evt => {
				// Add the the (relative) fragment URL to local storage
				let content = window.localStorage.getItem( storageKey ) || "" ;
				const url = makeRelative( fragmentUrl, hostDocumentUrl );
				if ( ! content.indexOf( url )) {
					content += url + "\n"  ;
					window.localStorage.setItem( storageKey, content );
					}
				// Open fragment list window only with shift and control clicks
				if ( ! ( evt.shiftKey || evt.ctrlKey )) evt.preventDefault( );
		} ) }	} ) ;
	}
	}

customElements.define( "mfrag-container", MathFragmentContainer );
