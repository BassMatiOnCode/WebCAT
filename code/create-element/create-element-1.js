/**	@module  		- create-element
 *		@author			- usp 
 *		@date				- 2024-04-15
 *		@description	- Creates an HTML/XHTML/SVG/MathML element
 */

import { setAttributes } from "/inc/set-attributes/set-attributes-1.js" ; 
import { setProperties } from "/inc/set-properties/set-properties-1.js" ;

/** Creates an element and configures attributes and properties
 * @param {string} tagname - tag name
 * @param {object} options - configuration options
 * @param {string} options.namespace - a valid XML namespace (https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris)
 * @param {object} createOptions - used for custom elements
 * @param {object} attributes - Element attribute configuration descriptor
 * @param {opbject} properties - Element property configuration descriptor
 */
export function createElement ( tagname, {namespace, createOptions, attributes, properties} = { } ) {
	const element = namespace ? document.createElementNS( namespace, tagname, createOptions ) : document.createElement( tagname, createOptions );
	setAttributes( element, attributes );
	setProperties( element, properties );
	return element;
	}