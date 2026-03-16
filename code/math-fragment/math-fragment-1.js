import numberedEquationStyles from "../numbered-equation/numbered-equation.css" with { type: "css" } ;
import { prepareNumberedEquations } from "../numbered-equation/numbered-equation.js"
import mathFragmentStyles from "/inc/webcat/math-fragment/math-fragment.css" with { type: "css" } ;

const searchParams = ( new URL ( import.meta.url )).searchParams ;
const mathFragmentHostUrl = searchParams.get( "fragment-host" ) || "/inc/webcat/math-fragment/math-fragment-host.htm" ;  // URL for the stand-alone fragment host document 

class MathFragment extends HTMLElement {
constructor ( ) {
	console.log( "Constructor running" );
	super( );
	const shadow = this.attachShadow ( { mode : "open" } ) ;
	shadow.adoptedStyleSheets.push( numberedEquationStyles );
	shadow.adoptedStyleSheets.push( mathFragmentStyles );
	// Create the heading
	const heading = document.createElement( "P" );
	// Heading anchor
	const anchor = document.createElement( "A" );
	const fragmentId = this.getAttribute( "id" );
	let fragmentPath = this.getAttribute( "path" ) || "" ;
	if ( ! fragmentPath.endsWith( "/" )) fragmentPath += "/" ;
	let fragmentUrl = `${ fragmentPath }${ fragmentId }=${ this.getAttribute( "name" ) || "" }` ;
	if ( ! ( fragmentUrl.endsWith( ".htm" ) || fragmentUrl.endsWith( ".html" ))) fragmentUrl += ".htm" ;
	// Fragment URL must be absolute
	fragmentUrl = new URL( fragmentUrl, document.location );
	// NOTE: The descriptive title may have to be separated with a '='
	anchor.href = `${ mathFragmentHostUrl }?fragmentUrl=${ fragmentUrl.href }&backlink=${ document.location.pathname }&hash=${ fragmentId }` ;
	anchor.setAttribute( "target", "_blank'" );
	let span = document.createElement( "SPAN" );
	span.textContent = fragmentId ;
	anchor.appendChild( span );
	anchor.appendChild( document.createTextNode( " " ));
	heading.appendChild( anchor );
	shadow.appendChild( heading );
	// Add normalized fragment type to the element's class list
	const fragmentType = ( fragmentId.match( /[a-zA-Z]+/ )[ 0 ] || "" ).toLowerCase( );
	if ( [ "d", "def", "dfn", "definition" ].includes( fragmentType )) this.classList.add( "definition" );
	else if ( [ "a", "ax", "axiom" ].includes( fragmentType )) this.classList.add( "axiom" );
	else if ( [ "t", "thm", "theorem" ].includes( fragmentType )) this.classList.add( "theorem" );
	else if ( [ "c", "cor", "corollary" ].includes( fragmentType )) this.classList.add( "corollary" );
	else if ( [ "l", "lm", "lem", "lemma" ].includes( fragmentType )) this.classList.add( "lemma" );
	// Load the fragment content.
	fetch ( fragmentUrl.href )
	.then ( response => response.ok ? response.text( ) : "not found" )
	.then ( text => { 
		const template = document.createElement( "TEMPLATE" );
		template.innerHTML = text ;
		prepareNumberedEquations( template.content );
		shadow.appendChild( template.content.querySelector( ".content" ));
		// Fragment title
		span = document.createElement( "SPAN" );
		span.innerHTML = this.getAttribute( "title" ) || template.content.querySelector( "H1" ).innerHTML ;
		anchor.appendChild( span );
		} ) ;
	anchor.addEventListener( "click" , evt => {
		if ( ! evt.shiftKey ) return ;
		window.open( anchor.href + "&popup=true", "_blank", "width=400,height=300,menubar=no,toolbar=no,status=no" );
		evt.preventDefault( );
		} ) ;
	}
	}

customElements.define( "math-fragment", MathFragment );