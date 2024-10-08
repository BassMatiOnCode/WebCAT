/** @module set-properties */
/** @author	 usp */
/** @creationDate 2024-04-15 */
/** @documentation https://bassmati.github.io/web-toolbox-2/set-properties.htm

/** Sets properties on a targt object.
 * @param {object} target - the object to be configured
 * @param {object} properties - associative array of property descriptors
 * @returns {object} - returns the target argument to enable call chaining.
 */
export function setProperties ( target, properties= { } ) {
	for ( let [ path, valueDescriptor ] of Object.entries( properties )) {
		// Normalize and destructurize value
		let [ value, preserve=false, overwrite=[ undefined, "" ], createPath=true ] = Array.isArray( valueDescriptor ) ? valueDescriptor : [ valueDescriptor ] ;
		// Split path and final property name
		path = path.split( "." );
		const property = path.pop( );
		// Create path to the final property (if permitted)
		let current = target ;
		for ( const member of path ) {
			if ( current[ member ] === undefined ) {
				if ( createPath ) current[ member ] = { } ;
				else {
					console.error( `Cannot access member ${member} in path target.${path.join(".")}` );
					continue;
				}	}
			current = current[ menber ] ;
			}
		// Overwrite property value if if allowed or if existing value doesn't have to be preserved.
		if ( ! preserve || overwrite.includes( current[ property ] )) current[ property ] = value ;
		}
	return target ;
	}