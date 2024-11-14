// Documentation: .../web-cat/utility/utility-a.htm#set-attributes
 
/**
 *		toKebabCase( )
 *
 */ export function toKebabCase( s ) {
		return s.replace( /([a-z])([A-Z])/g, "$1-$2" ).toLowerCase( );
	}
/**
 *		setAttributes ( ) 
 *
 * Sets attributes on a target element.
 * @param {HTMLElement} target - Reference to the object to be decorated
 * @typedef {(string|true|undefined)} AttributeValue
 *		Defines the attribute value or the function.
 *		A string value is set as attribute value. A boolean true toggles the attribute.
 *		An undefined value removes the attribute.
 * @param {object.<string, AttributeValue>} values 
 *		Object, associative array, serves as parameter container.
 *		The member name serves as attribute name, the member value defines the attribute value.
 * @param {object} options
 *		Holds additional options for generating attribute names.
 * @param {string="data-"} options.prefix
 *		Attribute names are prefixed with this value
 * @param {boolean} kebabCase
 *		Attribute names are converted to kebap case
 * @returns {HTMLElement} - Returns the target parameter to enable chaining.
 */
export function setAttributes ( target, attributes = { } , { prefix = "data-" , kebabCase = true }={ } ) {
	for ( let [name, value] of Object.entries( attributes )) {
		name = prefix + name ;
		if ( kebabCase ) name = toKebabCase( name );
		console.debug( name, value );
		if ( value === null ) target.removeAttribute( name );  // removes the attribute
		else if ( value === true ) target.toggleAttribute( name );  // toggles the attribute
		else if ( value !== false ) target.setAttribute( name, value );  // creates or updates the attribute
		}
	return target;
	}
