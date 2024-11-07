//
//		loader-1.js    module    2023-11-06    usp
//		TODO: Update flowchart diagrams.
//		
export const hostDocumentBase = document.location.href.split( "/" ).slice( 0, -1 ).join( "/" ) + "/" ;
	//	Points ot the location of the current document. 
	//	Used for converting relative to absolute addresses.

export function applyContentSelector ( template, selectorString="" ) {
	// Replace template content with a selected set of child nodes.
	if ( selectorString.length === 0 ) return ;
	const nodes = template.content.querySelector( selectorString );
	if ( nodes.length > 0 ) template.content.replaceChildren( ...nodes );
	}
export function transformRelativeUrls ( template, componentUrl, addressAttributes = [ "src", "href", "data", "data-load-url" ] ) {
	///		template : The content loaded from the component
	///		componentUrl : location of the component
	///		addressAttributes : The list of attribute names that contain URLs 
	const componentBase = componentUrl.split( "/" ).slice( 0, -1 ).join( "/" ) + "/" ;
	for ( const attribute of addressAttributes ) {
		for ( const element of template.content.querySelectorAll( `[${attribute}]` ) ) {
			console.info( "transformRelativeUrls() was: " , element.getAttribute( attribute ));
			const absoluteUrl = new URL( element.getAttribute( attribute ), element.hasAttribute( "data-host-relative" ) ? hostDocumentBase : componentBase )
			element.setAttribute( attribute, absoluteUrl.href );
			console.info( "transformRelativeUrls()  is: ", absoluteUrl.href );
			}
		}
	}
export function findComponentRoot ( template, referenceElement, position, shadowRoot ) {
		// Find and mark the component root. A single top-level element is always 
		// considered component root. Text nodes cannot be component root.
		let componentRoot = template.content.querySelector( "[data-component-root]" );
		if ( componentRoot ) {
			if ( shadowRoot ) {
				const shadow = componentRoot.attachShadow( { mode : "open" } ) ;
				shadow.append( ...componentRoot.childNodes );
				}
			}
		else {	//	The component root must be in the host document 
			switch ( position ) {
			case "replace" :
			case "before" :
			case "after" :
				componentRoot = referenceElement.parentNode ;
				break ;
			case "prepend" :
			case "append" :
				componentRoot = referenceElement;
				break;
			default :
				throw new Error ( `findComponentRoot(): Invalid argument: position="${position}"` );
				}
			if ( componentRoot.childElementCount > 0 ) componentRoot.setAttribute( "data-not-unloadable", "" );
			}
		componentRoot.setAttribute( "data-component-root", "" );
		return componentRoot;
	}
export function moveStyleElements ( template, url ) {
	///		Called from loadHtmlComponent( )
	///		template : holds the component content
	///		url : absolute component source address
	///		returns : true if style elements have been extracted
	//
	//	Move style elements to document head
	const styles = template.content.querySelectorAll( "STYLE" );
	if ( styles.length === 0 ) return ;
	let style = document.head.querySelector( `style[data-load-origin="${url}"]` );
	if ( style )   
		//	reuse existing style in host document
		style.setAttribute( "data-load-instances", +style.getAttribute( "data-load-instances" ) + 1 );
	else {	
		//	Aggregate template styles
		let text = "" ;
		for ( style of styles ) text += style.textContent ; 
		if ( text.length > 0 ) {
			//	Create a new style element
			style = document.createElement( "STYLE" );
			style.setAttribute( "data-load-instances", 1 );
			style.setAttribute( "data-load-origin", url );
			style.textContent = text ;
			document.head.append( style );
			}
		//	Remove styles from template
		for ( style of styles ) style.remove( );
	}	}
export function moveLinkElements( template, url, componentRoot ) {
	///		Link elements are moved to the host document. Existing link elements are re-used.
	///		The href attribute value is added to the component root element's data-load-links attribute.
	for ( const link of template.content.querySelectorAll( "LINK" )) {
		link.remove( );
		// Find a LINK that references the same external stylesheet
		const documentLink = document.querySelector( `LINK[href="${link.getAttribute("href")}"]` );
		if ( documentLink ) {
			documentLink.setAttribute( "data-load-instances", (+documentLink.getAttribute( "data-load-instances" ) || 1) + 1 );
			return ;
			}
		link.setAttribute( "data-load-instances" , "1" );
		link.setAttribute( "data-load-origin", url );
		document.head.append( link );
		}
	}
export function recreateScriptElements ( template, url ) {
	///		This step is required to get script elements in the template executed
	///		when the template is injected into the host document.
	for ( const script of template.content.querySelectorAll( "SCRIPT" )) {
		const newScript = document.createElement( "SCRIPT" );
		for ( const attribute of script.attributes ) newScript.setAttribute( attribute.name, attribute.value );
		if ( ! script.hasAttribute( "src" )) newScript.textContent = script.textContent ; 
		script.replaceWith( newScript );
		}
	}
export function injectTemplate( t, referenceElement, position, contentSelector, options ) {
	///		Injects the document fragment into the DOM, which executes the script elements
	///		contained in the template content. 
	switch ( position ) {
	case "replace" :
		referenceElement.replaceWith( ...t.content.childNodes );
		break ;
	case "before" :
		referenceElement.before( ...t.content.childNodes );
		break;
	case "after" :
		referenceElement.after( ...t.content.childNodes );
		break;
	case "prepend" :
		referenceElement.firstElementChild.before( ...t.content.childNodes );
		break;
	case "append" :
		referenceElement.append( ...t.content.childNodes );
		break;
	default :
		throw new Error ( `injectTemplate(): Invalid argument: position="${position}"` );
	}	}
export function loadHtmlComponent ( url, { referenceElement=document.body , position="append" , contentSelector="" , shadowRoot=false , componentInitInfo={ } } = { } ) {
	/// 	Loads an HTML web component.
	/// 	url : address of the HTML component. Will be converted to an absolute url.
	/// 	referenceElement : defines insert reference element
	///		position : optional, defines the insert position relative to the reference element 
	/// 	componentInitInfo : optional, passed to a module script in the component and the initComponent event.
	///		- - -
	// Ensure that url is absolute and fetch the resource
	url = new URL( url, hostDocumentBase ).href ;
	return fetch( url  )
	.then ( response => response.ok ? response.text( ) : "not found" )
	.then ( function ( text ) {
		// Create a template and fill it with the component text
		let t = document.createElement( "TEMPLATE" );
		t.innerHTML = text ;
		// Document processing steps
		applyContentSelector( t, contentSelector );
		transformRelativeUrls( t, url );
		if ( ! shadowRoot ) moveStyleElements ( t, url );
		if ( ! shadowRoot ) moveLinkElements( t, url );
		recreateScriptElements ( t, url );
		const componentRoot = findComponentRoot( t, referenceElement, position, shadowRoot );
		injectTemplate( t, referenceElement, position, shadowRoot );
		if ( componentRoot ) { 
			// Dispatch init event
			componentRoot.setAttribute( "data-load-origin", url );
			let e = new Event( "initComponent" );
			e.componentInitInfo = componentInitInfo;
			componentRoot.dispatchEvent( e  );
			// Dispatch component loaded event
			e = new Event( "componentLoaded" );
			e.loaded = componentRoot ;
			componentRoot.parentNode.dispatchEvent( e ) ;
			}
		} ) ;
	}
export function unloadHtmlComponent ( targetElement ) {
	///		Removes components from the document.
	///		targetElement : points to the component in the host document
	///		- - -
	//	Remove unused component style
	const loadOrigin = targetElement.getAttribute("data-load-origin" );
	const eventTarget = targetElement.parentNode ;
	targetElement.remove( ) ;
	// Unload associated STYLE elements
	const style = document.head.querySelector ( `style[data-load-origin="${loadOrigin}"]` );
	if ( style ) {
		const i = +style.getAttribute( "data-load-instances" ) - 1;
		if ( i === 0 ) style.remove( ); 
		else style.setAttribute( "data-load-instances", i );
		}
	//	Unload associated LINK elements
	const links = document.head.querySelectorAll( `link[data-load-origin="${loadOrigin}"]` );
	for ( const link of links ) {
		const i = +link.getAttribute( "data-load-instances" ) - 1;
		if ( i === 0 ) link.remove( ); 
		else style.setAttribute( "data-load-instances", i );
		}
	// Raise unload event
	const unloadedEvent = new Event( "componentUnloaded" );
	unloadedEvent.unloaded = targetElement ;
	eventTarget.dispatchEvent( unloadedEvent ); 
	}

(function ( ) {
	///		Module init function
	console.info( "WTBX loader module started." );
	} ) ( ) ;
