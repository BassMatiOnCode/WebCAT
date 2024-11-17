// Documentation: .../web-toolbox/name/name.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;

/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init( searchparams = new URLSearchParams( )) {
	// init code goes here
	const parameterValue = searchparams.get( "parameterName" ) || "default-value" ;
	}
/** Module init code */ initializer.initComponent( init, import.meta.url );
