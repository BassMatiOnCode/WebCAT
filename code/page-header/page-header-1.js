// Documentation: /webcat/page-header/page-header.htm
// 2025-10-08 usp  Overhauled. Configuration parameters changed. Init() signature changed. MainContent no longer referenced to eliminate coupling to content document structure.

import * as initializer from "../component-initializer/component-initializer-1.js" ;

export function init ( searchparams, event , 
	referenceElement = searchparams.get( "ref-element" ) || document.body , 
	injectionMethod = searchparams.get( "injection-method" ) || "prepend" ,
	occupySpace = searchparams.get( "occupySpace" ) !== "no" )
	// searchparams : URLSearchParams object or null, contains parameters passed via script module URL.
	// event : Event object if called as event handler, or null if called directly.
	// referenceElement : ID or reference of the element to be used for injection.
	// injectionMethod : Method to be used on the referenceElement. Permitted values: "before", "after", "append", "prepend".
	// occupySpace : If true, the height of the new header is subtracted from the margin below or above the header.
	// Returns : The header element.
	{
	if ( typeof referenceElement === "string" ) referenceElement = document.getElementById( referenceElement );
		// Create and insert the header element
	const e = document.createElement( "HEADER" );
		// Append section title image
	const titleimg = document.head.querySelector( "meta[name='sectionTitle']" )?.getAttribute( "content" );
	if ( titleimg ) e.style.backgroundImage= `${window.getComputedStyle( e )["backgroundImage"]}, url("${titleimg}")`;
		// Sample initial value for layout shift detection
		// TODO: If everything works fine, remove the test code.
	let testElement ; 
	switch ( injectionMethod ) {
	case "before" : testElement = referenceElement ; break ;
	case "prepend" : testElement = referenceElement.firstElementChild ; break ;
	case "after" : testElement = referenceElement.nextElementSibling ; break ;
	case "append" : testElement = undefined ; break ;
		}
	const testBefore = testElement?.offsetTop || 0 ;
		// Inject the new header element
	referenceElement[ injectionMethod ]( e );
		// Subtract height from the next sibling in order to avoid content shifting
	if ( occupySpace ) {
		switch ( injectionMethod ) {
		case "prepend" :
			referenceElement.style.paddingTop = Math.max( 0, parseInt( referenceElement.style.paddingTop || getComputedStyle( referenceElement ).paddingTop ) - parseInt( e.offsetHeight )) + "px";
			break;
		case "before" :
			referenceElement.style.marginTop = Math.max( 0, parseInt( referenceElement.style.marginTop || getComputedStyle( referenceElement ).marginTop ) - parseInt( e.offsetHeight )) + "px";
			break;
		case "after" :
			referenceElement.style.marginBottom = Math.max( 0, parseInt( referenceElement.style.marginBottom || getComputedStyle( referenceElement ).marginBottom ) - parseInt( e.offsetHeight )) + "px";
			break;
		case "append" :
			// there cannot be a layout shift if elements are inserted at the very bottom
			break;
			}
		if ( testBefore !== ( testElement?.offsetTop || 0 )) console.warn( "Layout shift detected." );
		}
	return e ;
	}
initializer.initComponent ( init, import.meta.url );
