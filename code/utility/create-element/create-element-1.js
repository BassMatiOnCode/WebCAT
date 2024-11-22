// Documentation : .../webcat/utility/createElement.htm

import * as initializer from "../../component-initializer/component-initializer-1.js" ;
import { namespaces } from "../xml-namespaces/xml-namespaces-1.js" ; 
import { setAttributes } from "../set-attributes/set-attributes-1.js" ; 
import { setProperties } from "../set-properties/set-properties-1.js" ; 

/** Creates an element and configures attributes and properties
 * @param {string} tagname - tag name
 * @param {object} options - configuration options
 * @param {string} options.namespaceKey - a valid xml namespace key)
 * @param {object} createOptions - used for custom elements
 * @param {object} attributes - Element attribute configuration descriptor
 * @param {object} properties - Element property configuration descriptor
 */ export function createElement ( tagname, { 
		namespaceKey=configuration.namespaceKey, 
		createOptions=configuration.createOptions, 
		attributes=undefined, 
		properties=undefined 
		} = { } ) {
	const namespace = namespaces[ namespaceKey ] ;
	const element = namespace ? document.createElementNS( namespace, tagname, createOptions ) : document.createElement( tagname, createOptions );
	if ( attributes ) setAttributes( element, attributes );
	if ( properties )
		if ( Array.isArray( properties )) setProperties( element, ...properties );
		else setProperties( element, properties );
	return element;
	}
/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init( searchparams = new URLSearchParams( )) {
	configuration.namespaceKey = searchparams.get( "namespace-key" ) || "html" ;
	configuration.createOptions = eval(`( { ${ searchparams.get("create-options")||"" } } )` );
	}

//  * * * Module init code * * *  //

export const configuration = { } ;
initializer.initComponent( init, import.meta.url );
