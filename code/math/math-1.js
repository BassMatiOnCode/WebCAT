// Documentation: .../web-toolbox/name/name.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;
import { namespaces } from "../utility/xml-namespaces/xml-namespaces-1.js" ;

/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init( searchparams = new URLSearchParams( )) {
	const parameterValue = searchparams.get( "parameterName" ) || "default-value" ;
	for ( const element of document.querySelectorAll( "math" )) {
		element.setAttribute( "xmlns" , namespaces.mathml );
		}
	}

// * * * Module init code * * * // 

initializer.initComponent( init, import.meta.url );
