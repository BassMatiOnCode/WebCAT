// Documentation: .../web-toolbox/dynamic-style-rules/dynamic-style-rules.htm

import { createElement } from "../utility/create-element/create-element-1.js" ;

/**
 *		findRule( )
 *
 */ export function findRule( selector ) {
	for ( let i = 0 ; i < stylesheet.cssRules.length ; i ++ ) if ( stylesheet.cssRules[ i ].selectorText === selector ) return i ;
	return -1 ;
	}
/**
 *		deleteRule( )
 *
 */ export function deleteRule( selector, { strict=false }={ } ) {
	const index = findRule( selector );
	if ( index !== -1 ) return stylesheet.deleteRule( index ) , index ;
	else if ( strict ) console.error( "Cannot find dynamic style rule:", selector );
	}
/**
 *		insertRule( )
 *
 */ export function insertRule( selector, ruleText, { insertIndex=undefined, strict=false }={ } ) {
	let index = findRule( selector );
	if ( index === -1  ) index = undefined ; 
	else {
		if( strict ) return console.error( "Dynamic style rule already exists:", selector );
		else stylesheet.deleteRule( index );
		}
	if ( insertIndex !== undefined ) index = insertIndex ;
	stylesheet.insertRule( `${selector} { ${ruleText} }` , index );
	return index;
	}
/**
 *		replaceRule( )
 *
 */ export function replaceRule( selector, ruleText, {insertIndex=undefined, strict=false }={ } ) {
	let index = findRule( selector );
	if ( index !== -1 ) stylesheet.deleteRule( index );
	else if ( strict ) return console.error( "Dynamic rule does not exist:" , selector ); 
	else index = undefined ;
	if ( insertIndex !== undefined ) index = insertIndex ;
	stylesheet.insertRule( `${selector} { ${ruleText} }` , index );
	return index;
	}

// * * Module init code * *// 

export const stylesheet = document.head.insertBefore( createElement( "STYLE", { attributes : { id : "webcatDynamicStyles" } } ), null ).sheet ;
