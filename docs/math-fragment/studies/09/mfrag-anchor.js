import styles from "./mfrag-anchor.css" with { type: "css" } ;
class MathFragmentAnchor extends HTMLElement {
constructor ( ) {
	super( );
	const shadow = this.attachShadow ( { mode : "open" } ) ;
	shadow.adoptedStyleSheets.push( styles );
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
	}

customElements.define( "mfrag-anchor", MathFragmentAnchor );