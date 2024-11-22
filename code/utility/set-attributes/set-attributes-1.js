// Documentation: .../webcat/utility/set-attributes/set-attributes.htm

import * as initializer from "../../component-initializer/component-initializer-1.js" ;

/**
 *		toKebabCase( )
 *
 */ export function toKebabCase( s ) {
		return s.replace( /([a-z])([A-Z])/g, "$1-$2" ).toLowerCase( );
	}
/**
 *		setAttributes ( ) 
 *
 *		Sets attributes on a element.
 *		@param {HTMLElement} element - Reference to the object to be decorated
 *		@typedef {(string|true|undefined)} AttributeValue
 *			Defines the attribute value or the function.
 *			A string value is set as attribute value. A boolean true toggles the attribute.
 *			An undefined value removes the attribute.
 *		@param {object.<string, AttributeValue>} values 
 *			Object, associative array, serves as parameter container.
 *			The member name serves as attribute name, the member value defines the attribute value.
 *		@param {object} options
 *			Holds additional options for generating attribute names.
 *		@param {string="data-"} options.prefix
 *			Attribute names are prefixed with this value
 *		@param {boolean} kebabCase
 *			Attribute names are converted to kebap case
 *		@returns {HTMLElement} - Returns the element parameter to enable chaining.
 *
 */ export function setAttributes ( element, attributes = { } , { 
		prefix = configuration.attributeNamePrefix , 
		kebabCase = configuration.convertToKebabCase, 
		summaries = configuration.summaries 
		} = { } ) {
	for ( let [name, value] of Object.entries( attributes )) {
		const prefixedName = prefix + name ;
//		const prefixedName = name.startsWith( prefix ) ? name : prefix + name ;
		if ( kebabCase ) name = toKebabCase( name );
//		console.debug( name, prefixedName value );
		if ( summaries ) attributes[ name ] = { prefixedName : prefixedName, previousValue : element.getAttribute( prefixedName ), suppliedValue : value } ;
		if ( value === null ) element.removeAttribute( prefixedName );  // removes the attribute
		else if ( value === true ) element.toggleAttribute( prefixedName );  // toggles the attribute
		else if ( value !== false ) element.setAttribute( prefixedName, value );  // creates or updates the attribute
		if ( summaries ) attributes[ name ].currentValue = element.getAttribute( prefixedName ) ;
		}
	return element;
	}
/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init( searchparams = new URLSearchParams( )) {
	// Initialize module configuration
	configuration.attributeNamePrefix = searchparams.get( "attribute-name-prefix" ) || "" ;
	configuration.convertToKebabCase = ! searchparams.has( "no-kebab-case" ) || true ;
	configuration.valueSummary = searchparams.has( "value-summary" ) || false ;
	}

// * * * Module init code * * *

export const configuration = { } ;
initializer.initComponent( init, import.meta.url );
