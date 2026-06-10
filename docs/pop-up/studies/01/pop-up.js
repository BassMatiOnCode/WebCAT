import styles from "./pop-up.css" with { type: "css" } ;

class PopUp extends HTMLElement {
constructor ( ) {
	super( );
	const shadow = this.attachShadow( { mode : "open" } );
	shadow.adoptedStyleSheets.push( styles );
	shadow.appendChild( document.createElement( "SLOT" ));
	}
connectedCallback ( ) {
	this.addEventListener( "pointerdown" , this.startDrag );
	}
startDrag = ( evt ) => {
	this.setPointerCapture( evt.pointerId ) ;
	this.startX = evt.clientX;
    this.startY = evt.clientY;
	const rect = this.getBoundingClientRect( );
    this.dx = rect.left;
    this.dy = rect.top;
	this.addEventListener( "pointermove", this.onDrag );
    this.addEventListener( "pointerup", this.stopDrag );
	}
onDrag = ( evt ) => {
    const dx = evt.clientX - this.startX;
    const dy = evt.clientY - this.startY;
    this.style.left = `${ this.dx + dx }px`;
    this.style.top = `${ this.dy + dy }px`;
	} ;
  stopDrag = ( evt ) => {
    this.releasePointerCapture( evt.pointerId );
    this.removeEventListener( "pointermove", this.onDrag );
    this.removeEventListener( "pointerup", this.stopDrag );
	} ;
	}

customElements.define( "pop-up", PopUp );