// Derives a dialog from dialog-base

import { DialogController } from "./dialog-base.js" ;

export class ContextDialogController extends DialogController {
	constructor ( dialog ) {
		super ( dialog ) ;
		dialog.addEventListener( "submit" , this.dialogSubmitHandler.bind( this ));
		}
	dialogSubmitHandler ( evt ) {  /// set the cell value
		this.target.innerText = evt.submitter.value || "" ;
		}
	}

/* * *   module init code   * * */

export const contextDialogController = await fetch ( "context-dialog.htm" )
.then ( response => response.ok ? response.text( ) : "" )
.then ( text => {
	if ( ! text ) return ;
	const template = document.createElement( "TEMPLATE" );
	template.innerHTML = text ;
	document.body.append( template.content );
	return new ContextDialogController( document.body.lastElementChild );
	} ) ;

