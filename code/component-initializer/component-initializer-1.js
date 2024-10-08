// Documentation : /web-cat/component-initializer/component-initializer.htm

/**
 *		initComponent()
 *		Inspects the module URL search parameters and schedules the init function call,
 *		depending on the init-event parameter in the searchparams.
 *
 */ export function initComponent ( initFunction, modURL ) {
	const searchparams = new URL( modURL ).searchParams ;
	if ( searchparams.has( "no-default-init" )) return;  // Prevent default init
	const initEventName = searchparams.get( "init-event-name" );
	if ( ! initEventName ) return initFunction ( searchparams );  // Direct init call
	const eventTarget = document.getElementById( searchparams.get( "event-target-id" )) || document ;
	function callback ( ) {  // init function wrapper
		initFunction( searchparams );
		if ( ! searchparams.has( "keep-init-handler" )) eventTarget.removeEventListener( initEventName, callback );  // prevent multiple execution
		} ;
	eventTarget.addEventListener( initEventName, callback );
	}
