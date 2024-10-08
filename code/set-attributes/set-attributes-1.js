/** @module set-attributes */
/** @author usp */
/** @documentation https://bassmati.github.io/web-toolbox-2/set-members.htm

/** Sets attributes on a target element.
 *	A boolean value will always be set, because a boolean cannot be "undefined" -
 *	a boolean attribute is always true or false. Existing string values are preserved
 *	if the "preserve" flag is passed in.
 *	The optional "preserve" parameter prevents existing attributes from being 
 *	overwritten. The "preserver" parameter cannot be applied to boolean attributes.
 * @param {HTMLElement} target - Referenct to the object to be decorated
 * @param {object} values - Associative array, serves as parameter container.
 *		The member key servers as attribute name, the value is an array of [string, boolean] 
 *		which hold the attribute value and an optional "preserve" flag.
 * @typedef {[string, [boolean | undefined]]} AttributeDescriptor
 * @param {AttributeDescriptor} values.key - Specifies the attribute name, 
 *		value is an array [value, preserve].
 * @returns {HTMLElement} - Returns the target parameter to enable chaining.
 */
export function setAttributes ( target, attributes = { } ) {
	for ( const [name, descriptor] of Object.entries( attributes )) {
		// Normalize and desctructurize data
		const [ value, preserve=false ] = Array.isArray( descriptor ) ? descriptor : [ descriptor ] ;
		console.log( name, value, preserve );
		if ( typeof value === "boolean" ) target.toggleAttribute( name, value );
		else if ( ! preserve || ! target.hasAttribute( name )) target.setAttribute( name, value );
		}
	return target;
	}
