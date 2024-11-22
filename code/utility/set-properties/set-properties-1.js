// Documentation: .../webcat/utility/set-properties/set-properties.htm

import * as initializer from "../../component-initializer/component-initializer-1.js" ;

 /** 
 *		PropertyDescriptor( )
 *
 */ export function PropertyDescriptor ( propertyName, propertyValue, { noPath=configuration.noPath, preserve=configuration.preserve, emptyValues=configuration.emptyValues } = { } ) {
	this.name = propertyName ;
	if ( ! noPath && propertyName.includes( "." )) {
		this.path = propertyName.split( "." );
		this.name = this.path.pop( );
		}
	else this.path = [ ];
	this.value = propertyValue ;
	this.preserve = preserve ;
	this.empty = emptyValues ;
	}

export const PD = PropertyDescriptor ;   // alias declaration

/**
 *		assign()
 *
 */ PropertyDescriptor.prototype.assign = function ( assignmentTarget ) {
	// Follow the path
	for ( const member of this.path ) assignmentTarget = assignmentTarget[ member ];
	// Preserve existing values
	if ( this.preserve && Object.hasOwn( assignmentTarget, this.name ) && ! this.empty.includes( assignmentTarget[ this.name ] )) return ;
	// Assign value to assignmentTarget property
	assignmentTarget[ this.name ] = this.value ;
	}
/** 
 *		setProperties( )
 *
 */ export function setProperties ( target, ...propertyDescriptors ) {
	for ( const descriptor of propertyDescriptors ) {
		if ( Object.getPrototypeOf( descriptor ) === PropertyDescriptor.prototype ) descriptor.assign( target );
		else if ( Object.getPrototypeOf( descriptor ) === Object.prototype ) for ( let [name, value] of Object.entries( descriptor )) {
			const descriptor = new PD( name, value );
			descriptor.assign( target );
			}
		}
	return target ;
	}
/**
*		init ( )
*		Initializes the WebCAT component.
*
*/ export function init( searchparams = new URLSearchParams( )) {
	// Update module configuration
	configuration.noPath = searchparams.has( "dots-are-no-path" ) || false ;
	configuration.preserve = searchparams.get( "preserve-existing-properties" ) || false ;
	configuration.emptyValues = ! eval(	`[${searchparams.get( "empty-values" )}]`) || [ undefined, null, "" ] ;
	}

//  * * * Module init code * * *  //

export const configuration = { } ;
initializer.initComponent( init, import.meta.url );
