// Documentation: .../web-toolbox/name/name.htm

/**
*		createUniqueID( )
*
*/ export function createUniqueID( prefix="element" , padLength=3, padChar="0" ) {
	if ( dictionary[ prefix ] ) return `${prefix}-${ (++dictionary[ prefix ]).toString( ).padStart( padLength, padChar )}` ;
	return `${prefix}-${ (dictionary[ prefix ] = 1).toString( ).padStart( padLength, padChar )}` ;
	}

// * * * Module init code * * * // 

const dictionary = { } ;
