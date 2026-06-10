import { initContent, openSeparateWindow } from "./mfrag-host-1.js" ;
import numberedEquationStyles from "./numbered-equation-2.css" with { type: "css" } ;
import { initDocument as prepareNumberedEquations } from "./numbered-equation-2.js"
import mathStyles from "./math-2.css" with { type: "css" } ;
import mathFragmentStyles from "./mfrag-container-1.css" with { type: "css" } ;
import mathFragmentAnchorStyles from "./mfrag-anchor-1.css" with { type: "css" } ;

const searchParams = ( new URL ( import.meta.url )).searchParams ;
const standaloneHostUrl = new URL( searchParams.get( "fragment-host" ) || "./mfrag-host-1.htm", document.location ) ;  // stand-alone math-fragment host document 

class MathFragmentContainer extends HTMLElement {
	fragmentAnchor = undefined ;
constructor ( ) {
	super( );
	const shadow = this.attachShadow ( { mode : "open" } ) ;
	shadow.adoptedStyleSheets.push( mathStyles );
	shadow.adoptedStyleSheets.push( mathFragmentStyles );
	shadow.adoptedStyleSheets.push( numberedEquationStyles );
	const fragmentUrl = new URL( this.getAttribute( "href" ), document.location);
	this.id = fragmentUrl.pathname.split( "/" ).pop( ).split( "=" ).shift( );
	initContent( this.shadowRoot, fragmentUrl, standaloneHostUrl);
	const img = document.createElement( "IMG" );
	img.src = "separate-window.svg" ;
	img.style = "position:absolute; top:10px; right:10px"
	this.shadowRoot.append( img );
	img.addEventListener( "click" , evt => {
		openSeparateWindow( evt, standaloneHostUrl );
		} ) ;
	}
	}

class MathFragmentAnchor extends HTMLElement {
static get observedAttributes ( ) { return [ "href", "target" ] }
constructor ( ) {
	super( );
	const shadow = this.attachShadow ( { mode : "open" } ) ;
	shadow.adoptedStyleSheets.push( mathFragmentAnchorStyles );
	shadow.innerHTML = `<a part="link" target="_blank"><slot></slot></a>` ;
	this.addEventListener( "click", ( evt ) => {
		const mathFragment = document.getElementById( this.getAttribute( "href" ).substring( 1 ));
		if ( ! mathFragment ) {
			window.open( `${ standaloneHostUrl }?fragmentUrl=${ this.href }${ evt.shiftKey ? "&popup=true" : "" }` , "_blank", `${ evt.shiftKey ? "popup, " : "" }width=400,height=300,menubar=no,toolbar=no,status=no` );
			evt.preventDefault( );
			}
		else if ( evt.shiftKey || evt.ctrlKey ) {
			const clickEvent = new Event( "click" );
			if ( evt.shiftKey ) clickEvent.shiftKey = evt.shiftKey ;
			mathFragment.fragmentAnchor.dispatchEvent( clickEvent );
			}
		else this.shadowRoot.querySelector( "a" ).click( );
		} ) ;
	}
attributeChangedCallback ( name, oldValue, newValue ) {
	this.shadowRoot.querySelector( "a" )[ name ] = newValue ;
	}
connectedCallback ( ) {
    this.shadowRoot.querySelector( "a" ).href = this.getAttribute( "href" );
	}
	}

customElements.define( "mfrag-container", MathFragmentContainer );
customElements.define( "mfrag-anchor", MathFragmentAnchor );