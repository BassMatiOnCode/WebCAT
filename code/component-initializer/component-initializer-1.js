// Documentation : /webcat/component-initializer/component-initializer.htm
//	2025-10-08  usp  Event registration improved with "once" option.

export function initComponent ( initFunction, modURL, ...restParams ) {
	//	Inspects the module URL search parameters and schedules the init function call.
	//	initFunction : Supplied by the component to initializes the component.
	//	modURL : The URL used to import the script module. Contains the URL search string parameters.
	//	restParams : Additional parameters forwarded to the initFunction.
	const searchparams = new URL( modURL ).searchParams ;
	if ( searchparams.has( "no-default-init" )) return;  // Calling module init() is now responsibility of the developer
	const initEventName = searchparams.get( "init-event-name" );
	if ( ! initEventName ) return initFunction ( searchparams, null, ...restParams );  // Direct init call
	const eventTarget = document.getElementById( searchparams.get( "event-target-id" )) || document ;
	const options = { once :  ! searchparams.has( "keep-init-handler" ) } ;
	eventTarget.addEventListener( initEventName, evt => initFunction( searchparams, evt, ...restParams ) , options );
	}
