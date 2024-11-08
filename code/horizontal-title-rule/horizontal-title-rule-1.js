// Documentation: .../web-toolbox/horizontal-title-rule/horizontal-title-rule.htm

import * as initializer from "../component-initializer/component-initializer-1.js" ;

/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init( searchparams = new URLSearchParams( )) {
	const parameterValue = searchparams.get( "parameterName" ) || "default-value" ;
	const refElement = document.querySelector( "H1" )?.nextElementSibling ;
	if ( ! refElement ) return ;
	const element = refElement.parentElement.insertBefore( document.createElement( "HR" ), refElement );
	element.classList.add( "horizontal-title-rule" );
	}
/** Module init code */ initializer.initComponent( init, import.meta.url );
