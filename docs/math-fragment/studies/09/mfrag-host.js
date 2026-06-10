	// Compile the local storage key for this URL
const storageKey = document.location.pathname.split( "/" ).slice( 0, -1 ).join( "/" );
	// Retrieve the list of math-fragments from local storage
const urls = window.localStorage.getItem( storageKey ).split( "\n" ).slice( 0, -1 );
	// Create math fragment containers for each url
for ( const s of urls ) {
	const mfragment = document.createElement( "mfrag-container" );
	mfragment.setAttribute( "href" , s );
	mfragment.setAttribute( "tabindex", "0" );
	mfragment.toggleAttribute( "no-flyout-button" );
	textContainer.append( mfragment );
	}
function updateStorage ( ) {
	let s = "" ;
	for ( const fragment of textContainer.children ) s += fragment.getAttribute( "href" ) + "\n" ;
	window.localStorage.setItem( storageKey, s );
	}
function getActiveElement( ) {
	const e = document.activeElement ;
	if ( e.tagName === "MFRAG-CONTAINER" && e.parentNode === textContainer ) return e ;
	}
textContainer.addEventListener( "click" , evt => {
	if ( evt.target.tagName !== "P" ) return ;
	evt.target.focus( );
	} ) ;
buttons.addEventListener( "mousedown" , evt => {
	// Don't steal focus
	if ( evt.target.tagName === "BUTTON" ) event.preventDefault( );
	} ) ;
deleteButton.addEventListener( "click" , evt => {
	// Delete the active element from the list
	const p = document.activeElement ;
	if ( p.tagName != "P" ) return ;
	const i = Array.from( p.parentNode.children ).indexOf( p );
	p.remove( );
	( textContainer.children[ i ] || textContainer.lastChild ).focus( );
	updateStorage( );
	} ) ;
upButton.addEventListener( "click" , evt => {
	const e = getActiveElement( );
	if ( ! e ) return ;
	textContainer.insertBefore( e, e.previousElementSibling || textContainer.firstChild );
	e.focus( );
	updateStorage( );
	} ) ;
downButton.addEventListener( "click" , evt => {
	const e = getActiveElement( ) ;
	if ( ! e ) return ;
	textContainer.insertBefore( e, e.nextElementSibling?.nextElementSibling );
	e.focus( );
	updateStorage( );
	} ) ;
clearButton.addEventListener( "click" , evt => {
		
	} ) ;
window.addEventListener( "storage" , evt => {
	// Add the new math-fragement at the end of the list
	if ( evt.key !== storageKey ) return ;  // not our business
	const mfragment = document.createElement( "mfrag-container" );
	mfragment.setAttribute( "href" , evt.newValue.split( "\n" ).slice( -2, -1 );
	mfragment.setAttribute( "tabindex", "0" );
	mfragment.toggleAttribute( "no-flyout-button" );
	textContainer.append( mfragment );
	} ) ;
