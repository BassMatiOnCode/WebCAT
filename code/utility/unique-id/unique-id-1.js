// Documentation: .../web-toolbox/name/name.htm

/**
*		createUniqueID( )
*
*/ export function createUniqueID( { prefix = "element" , padLength = 3 , padChar = "0" } = { } ) {
	if ( counters[ prefix ] ) return `${prefix}-${ (++counters[ prefix ]).toString( ).padStart( padLength, padChar )}` ;
	return `${prefix}-${ (counters[ prefix ] = 1).toString( ).padStart( padLength, padChar )}` ;
	}
/**
*		setUniqueID( )
*
*/ export function setUniqueID( element, { prefix = element.tagName , padLength = 3, padChar = "0" } = { } ) {
	if ( element.hasAttribute( "ID" )) return ;
	element.setAttribute( "id" , createUniqueID( { prefix : prefix } ) ) ;
	return element ;
	}



// * * * Module init code * * * // 

const counters = { } ;  // Hosts the named counters
