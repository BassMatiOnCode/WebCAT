// Base classes for dialogs

export class DialogController {
	dialog ;
	opener ;
	target ;
	constructor ( dialog ) {
		this.dialog = typeof dialog === "string" ? document.getElementById( dialog ) : dialog ;
		this.prepareOpeners( );
		}
	contextmenuHandler ( evt ) {
		evt.preventDefault( );
		this.opener = evt.currentTarget ;
		this.target = evt.target ;
		this.dialog.showModal( );
		this.dialog.style.marginLeft = evt.clientX - this.dialog.offsetWidth / 2 +  "px" ;
		this.dialog.style.marginTop = evt.clientY - this.dialog.offsetHeight / 2 + "px" ;
		}
	prepareOpeners( ) {
		for ( const opener of document.querySelectorAll( `[data-context-dialog="${ this.dialog.id }"]` )) {
			opener.addEventListener( "contextmenu" , this.contextmenuHandler.bind( this ));
			}
		}
	}