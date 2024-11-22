// Documentation: /webcat/collapsible-structures/collapsible-structures.htm
// TODO: Replace console.info with console.debug
import * as initializer from "../component-initializer/component-initializer-1.js" ;

/**
 *		getController ( )
 *		Returns the controller that is associated with the collapsible element
 *
 */ export function getController ( collapsibleElement ) {
	switch ( collapsibleElement.tagName ) {
	case "UL" :
	case "OL" :
		// TODO: Use .closest( "LI" ) instead
		// return collapsibleElement.parentElement ;
	case "A" :
		// Interactively loaded fragment anchor
		return collapsibleElement.closest( "LI" );
	default :
		return collapsibleElement.previousElementSibling;
	}	}
/**	
 *		getCollapsibleElement ( )
 *		Returns the collapsible element associated with the controller
 *
 */ export function getCollapsibleElement( controller ) {
	switch ( controller.tagName ) {
	case "LI" :  // TODO: Documentation change
		return controller.querySelector( "UL,OL,A[data-load-interactive]" ); break;
	case "A" : 
		return undefined ;   // Anchors should not have collapsible elements
	default :
		return controller.nextElementSibling ;
	}	}
/**	
 *		controllerClick ( ) 
 *		Exands or collapses a controlled element
 *
 */ function controllerClick ( evt ) {
	// console.debug( "controllerClick() " + evt.offsetX );
	// TODO: LI elements have negative offsetX values for the node icon!
	if ( ! evt.target.hasAttribute( "data-collapsible-state" ) || evt.offsetX > 20 ) return;
	evt.stopPropagation( );
	evt.preventDefault( );
	const controller = evt.target;
	const collapsibleElement = getCollapsibleElement( controller );
	if ( ! collapsibleElement ) return ;
	// expansion must be delayed until fragment has been loaded.
	if ( collapsibleElement.hasAttribute( "data-load-interactive" )) collapsibleElement.addEventListener( "fragment-loaded" , ( ) => expand( controller ));
	// TODO: Better use controller state to decide here
	else	if ( collapsibleElement.style.height === "0px" ) expand( controller, collapsibleElement );
	else collapse( controller, collapsibleElement  );
	}
/**	
 *		expand ( )
 *		Expands a collapsed element
 *
 */ export function expand ( controller, collapsibleElement = getCollapsibleElement( controller )) {
	collapsibleElement.style.height = "auto" ;
	const targetHeight = window.getComputedStyle( collapsibleElement ).height ;
	collapsibleElement.style.height = "0px" ;
	collapsibleElement.style.overflow = "visible clip" ;
	controller.setAttribute( "data-collapsible-state", "expanded" );
	window.requestAnimationFrame( ( ) => 
	window.requestAnimationFrame( ( ) => {
		// TODO: Remove instruction because it is ineffective...
		if ( collapsibleElement.tagName === "A" ) collapsibleElement = getCollapsibleElement( controller );
		collapsibleElement.style.height = targetHeight } ) ) ;
	}
/**	
 *		collapse ( )
 *		Collapses an expanded element.
 *
 */ export function collapse ( controller, collapsibleElement = getCollapsibleElement( controller )) {
	collapsibleElement.style.height = window.getComputedStyle( collapsibleElement ).height ;
	collapsibleElement.style.overflow = "visible clip" ;
	window.requestAnimationFrame( ( ) => 
	window.requestAnimationFrame( ( ) => {
		controller.setAttribute( "data-collapsible-state", "collapsed" );
		collapsibleElement.style.height = "0px" } ) ) ;
	}
/**	
 *		finishTransitionfinishTransition ( )
 *		Finishes a state transition of a collapsible structure.
 *
 */ function finishTransition( evt ) {
	if ( ! evt.target.classList.contains( "collapsible-element" )) return ;
	if ( evt.target.style.height === "0px" ) evt.target.style.overflow = "clip clip" ;
	else {
		evt.target.style.height = "auto" ;
		evt.target.style.overflow = "visible visible";
		}
	evt.stopPropagation( );
	}
/**
 *		initContainer ( )
 *		@param {object} options - optional parameters
 *		@param {object} options.root - points to the root object to be initialized
 *
*/ export function initContainer ( root = document, addRoot = false ) {
	console.debug( "Initializing collapsible structures" );
	// Step 1: Process elements declared as collapsible structures
	const collapsibleStructures = Array.from( root.querySelectorAll( ".collapsible-structure" ));
	if ( addRoot ) collapsibleStructures.unshift( root );
	for ( const collapsibleStructure of collapsibleStructures ) {
		// Step 1.1 Compile a selector for potentially collapsible elements. 
		// In "flat" structures, only the first level of the subtree is collected.
		// In "deep" structures, all collapsible elements in the entire subtree are collected.
		let selector ;
		switch ( collapsibleStructure.tagName ) {
		case "LI" :
		case "OL" :
		case "UL" :
			selector = collapsibleStructure.classList.contains( "flat" ) 
				? ":scope > LI > UL , :scope > LI > OL , :scope > LI > [data-load-interactive]" 
				: "UL , OL , [data-load-interactive]" ;
			break;
		case "DL" :
			selector = collapsibleStructure.classList.contains( "flat" ) ? ":scope > DT+DD" : "DT+DD" ;
			break;
			}
		// Step 1.2 Decorate associated controllers
		for ( const collapsibleElement of collapsibleStructure.querySelectorAll( selector )) {
			if ( collapsibleElement.classList.contains( "not-collapsible" )) continue ;
			const controller = getController( collapsibleElement );
			if ( ! controller.hasAttribute( "data-collapsible-state" )) controller.setAttribute( "data-collapsible-state", "" );
		}	}
	// Step 2: Process elements with cbc attributes
	for ( const controller of root.querySelectorAll( "[cbc]" )) {
		controller.setAttribute( "data-collapsible-state", controller.getAttribute( "cbc" ) || "expanded" );
		controller.removeAttribute( "cbc" );
		}
	// Step 3: Configure controllers and collapsible elements
	const controllers = Array.from( root.querySelectorAll( '[data-collapsible-state]' ));
	if ( addRoot ) controllers.unshift( root );
	for ( const controller of controllers ) {
		// Get rid of list style bullets on UL items 
		if ( controller.parentElement.tagName === "UL" ) controller.parentElement.style.listStyleType = "none" ;
		// Initialize controller state value
		let state;
		const collapsibleElement = getCollapsibleElement( controller );
		if ( collapsibleElement.hasAttribute( "data-load-interactive" )) {
			state = "collapsed" ;
			controller.setAttribute( "data-collapsible-state", state );
			// Initialize fragments later, when they have been loaded
			collapsibleElement.addEventListener( "fragment-loaded" , evt => 
				initContainer( evt.detail.content[ 0 ].parentElement, true )) ;
			}
		else {
			state = controller.getAttribute( "data-collapsible-state" );
			if ( ! state ) {
				const stateProvider = controller.closest( "[data-collapsible-default]" );
				state = stateProvider && stateProvider.getAttribute( "data-collapsible-default" ) || "collapsed" ;
				controller.setAttribute( "data-collapsible-state", state );
				}
			}
		// Classify associated collapsible element
		collapsibleElement.classList.add( "collapsible-element" );
		// Make sure that collapsed elements start with a zero height
		if ( state === "collapsed" ) {
			 collapsibleElement.style.height = "0px" ;
			 collapsibleElement.style.overflow = "clip clip" ;
			} 
		}
	}
/**	
*		init ( )
*		Module initialization
*		@param searchparams - carries parameters from the module URL
*
*/ export function init ( searchparams = new URLSearchParams( )) {
	document.addEventListener( "click" , controllerClick );
	document.addEventListener( "transitionend", finishTransition );
	initContainer( document.getElementById( searchparams.get( "root" )) || document.body ) ;
	window.requestAnimationFrame(( ) => document.body.classList.add( "collapsible-transitions-enabled" ));
	}
/** Module init code */ initializer.initComponent( init, import.meta.url );
